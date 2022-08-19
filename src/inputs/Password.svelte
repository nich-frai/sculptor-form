<script lang="ts">
  import { bindFieldToFormController, type FormController } from "../form.controller";

  import { getContext, onMount } from "svelte";

  import Label from "./Label.svelte";

  export let label: string;
  export let name: string | undefined = undefined;
  export let value: string = "";
  export let placeholder: string = "";
  export let required: boolean = true;
  export let pattern: string | undefined = undefined;

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

<Label title={label}>
  <!-- re-export slot "after-label" -->
  <slot name="after-label" slot="after-label" />

  <slot name="before-input" />
  <input
    bind:this={inputEl}
    type="password"
    {name}
    {value}
    {placeholder}
    {required}
    {pattern}
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
</Label>

<style>
	input {
		height: var(--text-input-height, var(--input-height, var(--item-height, 2rem)));
		padding: var(--text-input-padding, var(--input-padding, 0.25rem 0.75rem));
		border: var(--text-input-border, 0);
		background-color: var(--text-input-bg-color, transparent);
	}
	input:only-child {
		border-radius: var(--text-input-radius, var(--label-input-radius, var(--radius-2, 4px)));
	}
</style>