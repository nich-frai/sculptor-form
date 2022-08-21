import { FieldController } from "../field.controller";

export class CheckboxController extends FieldController {

	inputEl!: HTMLInputElement;

	constructor(name : string) {
		super(name);
	}

	collect(): unknown {
		return this.inputEl.checked;
	}

	hasErrors(): boolean {
		let hasHTMLError = !this.inputEl.checkValidity();
		let hasValidationErrors = false;
		
		this.errors.subscribe(e => {
			hasValidationErrors = e.length !== 0;
		})();

		return !hasHTMLError && !hasValidationErrors;
	}

	setValue(value: unknown): void {
		this.inputEl.value = String(value);
	}

}