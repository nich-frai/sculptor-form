<script lang="ts">
  import type { FormController } from "../../form.controller";

  import { getContext, onMount } from "svelte";
  import { CheckboxController } from "./checkbox.controller";

  export let label: string;
  export let name: string | undefined = undefined;
  export let value: string = "";
  export let placeholder: string = "true";
  export let required: boolean = false;
  export let pattern: string | undefined = undefined;
  export let checked: boolean = false;

  const controller = getContext<FormController>("form-controller");
  let inputEl: HTMLInputElement;
  let field: CheckboxController | undefined;
  let errors: string[] = [];
  let hasErrors: boolean = false;

  onMount(() => {
    if (name != null) {
      field = new CheckboxController(name);

      field.inputEl = inputEl;
      controller.addField(field);

      let unsubscribeFromController = field.errors.subscribe((err) => {
        errors = err;
        hasErrors = err.length !== 0;
      });

      if (value === "") {
        let inputValue = controller.getInputValue(name);
        inputEl.value = inputValue;
      }

      return () => {
        controller.removeField(name!);
        unsubscribeFromController();
      };
    }
  });
</script>

<label class="checkbox-label" class:has-errors={hasErrors}>
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
  {#if errors.length > 0}
    {#each errors as err}
      <br /><span class="display-error">{err}</span>
    {/each}
  {/if}
</label>

<style>
  .checkbox-label {
    display: flex;
    column-gap: var(--checkbox-column-gap, 0.5rem);
  }

  .display-error {
    color: var(--text-input-error-color, var(--input-error-color, var(--color-error, #d21d44)));
  }
</style>
