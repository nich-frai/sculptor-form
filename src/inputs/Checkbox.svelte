<script lang="ts">
  import { bindFieldToFormController, type FormController } from "../form.controller";

  import { getContext, onMount } from "svelte";

  export let label: string;
  export let name: string | undefined = undefined;
  export let value: string = "";
  export let placeholder: string = "true";
  export let required: boolean = false;
  export let pattern: string | undefined = undefined;
	export let checked : boolean = false;

  const controller = getContext<FormController>("form-controller");
  let inputEl: HTMLInputElement;

	onMount(() => {
		if(name != null) {
			return bindFieldToFormController(
				name,
				() => inputEl,
				controller,
				value
			);
		}
  });
</script>

<label class="checkbox-label">
	<slot name="before-input" />
  <input
    bind:this={inputEl}
    type="checkbox"
    {name}
    {value}
    {placeholder}
    {required}
    {pattern}
		{checked}
    on:input
    on:change
    on:keyup
    on:keydown
    on:keypress
    on:focus
    on:blur
    on:invalid
  />
  <slot name="after-input" />
	{label}
	<slot name="after-label" />
</label>
  

  

<style>
	.checkbox-label {
		display: flex;
		column-gap: var(--checkbox-column-gap, 0.5rem);
	}
	
</style>