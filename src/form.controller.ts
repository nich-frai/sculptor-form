import { writable, type Writable } from "svelte/store";
import { ZodError, type SomeZodObject, type TypeOf, type SafeParseReturnType } from "zod";
import type { FieldController } from "./inputs/field.controller";

export class FormController<
	T extends SomeZodObject | undefined = undefined,
	Data = T extends NonNullable<T> ? TypeOf<T> : unknown
	> {

	private fields: Record<string, FieldController> = {};
	private submitLock: boolean = false;
	private lockTimeoutID: number | undefined = undefined;

	public lockTimeout?: number;
	public lockStore: Writable<boolean> = writable(false);

	public method?: string;
	public enctype?: TFormEncType;
	public schema?: T;
	public nativeBehaviour: boolean = false;
	public formElement?: HTMLFormElement;
	public shouldConsumeHTTPResponse: boolean = true;

	//@ts-ignore unknown makes TS error on writable(undefined) even if its on the definition of both Writable<> types
	public valueStore?: Writable<Data> = writable(undefined);

	onSubmit?: (data: Data) => unknown | Promise<unknown>;
	onSubmitError?: (error: Error) => void;
	onSubmitSuccess?: (submitReturnedValue: unknown) => void;

	onParsingError?: (error: ZodError<any>) => void;

	async submitEvent(_e: SubmitEvent) {
		// locked? noop
		if (this.submitLock) {
			console.debug('[FORM] Submit event was captured but the form is currently locked!');
			return;
		}

		this.lock(this.lockTimeout);

		// clear up form validity state
		for (let input of Object.values(this.fields)) {
			input.removeErrors();
		}

		// if the "native" behaviour is set OR no "onSubmit" exists, just submit it using the default event
		if (this.nativeBehaviour || this.onSubmit == null) {
			this.formElement!.submit();
			this.unlock();
			return;
		}

		// collect and parse form data
		const data = await this.collectDataFromFields();
		const parsed = this.parseObject(data);

		// validation / parsing error, halt and notify!
		if (!parsed.success) {
			this.notifySchemaParsingIssues(parsed.error);
			this.unlock();
			return false;
		}

		const parsedData = parsed.data;

		try {
			let submitReturnedValue = this.onSubmit(parsedData);
			if (submitReturnedValue instanceof Promise) {
				submitReturnedValue = await submitReturnedValue;
			}

			// if it's an HTTP response, consume it
			if (submitReturnedValue instanceof Response && this.shouldConsumeHTTPResponse) {
				submitReturnedValue = await this.consumeHTTPResponse(submitReturnedValue);
			}

			if (this.onSubmitSuccess != null) {
				this.onSubmitSuccess(submitReturnedValue);
			}
		} catch (error) {
			if (this.onSubmitError != null) this.onSubmitError(error as Error);
			console.debug('[FORM] Submit action generated an error!', error);
		} finally {
			this.unlock();
		}
		return;
	}

	addField(observable: FieldController) {
		this.fields[observable.name] = observable;
	}

	removeField(name: string) {
		delete this.fields[name];
	}

	async collectDataFromFields() {
		let collectedData: Record<string, unknown> = {};

		for (let field of Object.values(this.fields)) {
			collectedData[field.name] = await field.collect();
		}

		return collectedData;
	}

	parseObject(obj: unknown): SafeParseReturnType<any, any> {

		// check for individual input validity state
		for (let field of Object.values(this.fields)) {
			let isValid = field.hasErrors();
			if (!isValid) {
				return {
					success: false,
					error: new ZodError([])
				};
			};
		}

		// now check if it adheres to schema
		if (this.schema == null) {
			return {
				success: true,
				data: obj as Data
			};
		}

		return this.schema.safeParse(obj);
	}

	notifySchemaParsingIssues(errors: ZodError<any>) {
		console.debug('[FORM] Failed to parse input data!', errors);
		// call user listener for patsingErrors
		if (this.onParsingError != null) {
			this.onParsingError(errors);
		}

		// go trough issues and dispatch errors to fields
		for (let issue of errors.issues) {
			let fieldsWithError = issue.path;
			let errorMessage = issue.message;
			for (let fieldName of fieldsWithError) {
				if (this.fields[fieldName] != null) {
					this.fields[fieldName].addError(errorMessage);
				}
			}
		}
	}

	getInputValue(name: string) {
		let returnValue = "";
		this.valueStore?.subscribe((v) => {
			if (typeof v === 'object' && v != null) {
				returnValue = String((v as any)[name] ?? "");
			}
		});

		return returnValue;
	}

	async initializeFields() {
		this.valueStore?.subscribe((v) => {
			if(v != null) {
				for(let [key, value] of Object.entries(v)) {
					if(this.fields[key] != null) {
						this.fields[key].setValue(value);
					}
				}
			}
		});
	}

	/**
	 * Lock
	 * -----
	 * Lock submits from being parsed, avoid duplicated submit events to be sent
	 * the submitEvent handles the locking/unlocking feature
	 * @param timeout 
	 */
	lock(timeout = 10000) {
		this.submitLock = true;
		this.lockStore.set(true);
		this.lockTimeoutID = window.setTimeout(this.unlock, timeout);
	}

	unlock() {
		this.submitLock = false;
		this.lockStore.set(false);
		window.clearTimeout(this.lockTimeoutID);
	}

	async consumeHTTPResponse(response: Response) {

		if (!response.ok) {
			let body = await response.text();
			throw new HTTPError(response.status, response.statusText, body);
		}

		let responseData: unknown;

		// check for content-type
		switch (response.headers.get('content-type')) {
			case 'application/json':
				responseData = await response.json();
				break;
			case 'multipart/form-data':
				responseData = await response.formData();
				break;
			default:
				// TODO: check for content type "mime" and check if it should be consumed as a blob!
				responseData = await response.text();
		}
		return responseData;
	}
}

export class HTTPError extends Error {
	constructor(public status: number, public statusText: string, public body: string) {
		super(`[HTTPErrorResponse] The API returned an error response [${status}] ${statusText}!\n${body}`);
	}
}

export type TFormEncType =
	| "application/json"
	| "multipart/form-data"
	| "application/x-www-form-urlencoded";

export interface FieldObservable {
	name: string;
	collect(): unknown | Promise<unknown>;
	subscribe(subscriber: (value: unknown) => void): void;
	checkValidityState(): boolean;
	setValidity(error: string): void;
}

export function createActionForTargetURL(url: string, requestInit?: RequestInit) {

	const headers: Record<string, string> = {};
	// check if url is in same domain, else add 'CORS' mode

	return (data: unknown) => {

		const shouldDataBeSerialized = !(data instanceof FormData || typeof data === 'string' || data == null);
		if (shouldDataBeSerialized) {
			data = JSON.stringify(data);
			headers['content-type'] = 'application/json';
		}

		return fetch(url, {
			...requestInit,
			body: data as any,
			headers: {
				...requestInit?.headers,
				...headers
			}
		});
	};

}