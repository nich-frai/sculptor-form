import { writable, type Writable } from "svelte/store";

export abstract class FieldController {

	errors : Writable<string[]> = writable([]);

	abstract collect() : unknown | Promise<unknown>;

	abstract hasErrors() : boolean;

	abstract setValue(value : unknown) : void;

	constructor(public name : string) {}

	removeErrors() {
		this.errors.set([]);
	}

	addError(error : string) {
		this.errors.update((e) => {
			e.push(error);
			return e;
		});
	}

	setErrors(errors : string[]) {
		this.errors.set(errors);
	}

}