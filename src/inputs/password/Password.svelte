<script lang="ts">
  import type { FormController } from "../../form.controller";

  import { getContext, onMount, setContext } from "svelte";

  import { PasswordController } from "./password.controller";

  export let label: string;
  export let name: string | undefined = undefined;
  export let value: string = "";
  export let placeholder: string = "";
  export let required: boolean = true;
  export let pattern: string | undefined = undefined;

  const controller = getContext<FormController>("form-controller");
  let field: PasswordController | undefined;
  let errors: string[] = [];
	let hasErrors : boolean = false;

  let inputEl: HTMLInputElement;

  onMount(() => {
    if (name != null) {
      field = new PasswordController(name);

      field.inputEl = inputEl;
      controller.addField(field);

      let unsubscribeFromController = field.errors.subscribe((err) => {
        errors = err;
				hasErrors = err.length !== 0;
      });

      return () => {
        controller.removeField(name!);
        unsubscribeFromController();
      };
    }
  });
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="flow-" class:has-errors={hasErrors}>
  <div class="label-container" class:optional={!required}>
    <slot name="pre-label" />
    <span class="label-text">{label}</span>
    <slot name="after-label" />
  </div>
  <div class="input-container">
    <slot name="icon" />
    <input
      bind:this={inputEl}
      type="password"
      {name}
      {value}
      {placeholder}
      {required}
      {pattern}
      autocomplete="off"
			on:change={() => {
				field?.removeErrors();
			}}
      on:input
      on:change
      on:keyup
      on:keydown
      on:keypress
      on:focus
      on:blur
      on:invalid
    />
    <slot name="actions" />
  </div>
  <div class="error-container">
    {#each errors as err}
      <span class="display-error">{err}</span>
      <br />
    {/each}
  </div>
</label>

<style>
  label {
    display: flex;
    flex-direction: var(--label-flex-direction, column);
    row-gap: var(--label-row-gap, 0.25rem);
    margin: var(--label-margin, 0.75rem 0);
  }

  .label-container {
    position: relative;
    width: var(--label-text-width, 100%);
    height: var(--label-text-height, 100%);
    font-weight: 600;
  }

  .label-container.optional {
    font-weight: 400;
  }

  .input-container {
    position: relative;
    display: flex;
    width: var(--label-input-width, 100%);
    height: var(--label-input-height, 100%);
    border-radius: var(--label-input-radius, var(--radius-2, 4px));
    background-color: var(--label-input-bg-color, var(--surface-subtle-darker, rgba(0, 0, 0, 0.1)));
    flex-direction: var(--label-input-flex-direction, row);
    column-gap: var(--label-input-column-gap, 0.5rem);
    row-gap: var(--label-input-row-gap);
    justify-items: center;
    align-items: center;
    border: 2px solid transparent;
    transition: border var(--transition-duration);
    padding: var(--text-input-padding, var(--input-padding, 0.25rem 0.75rem));
    box-sizing: border-box;
  }

	.has-errors .input-container:not(:focus-within) {
		border: var(
      --text-input-error-border,
      var(--input-error-border, 2px solid var(--color-error, #720e24))
    );
	}

  .input-container:focus-within {
    border: var(
      --text-input-focus-border,
      var(--input-focus-border, 2px solid var(--color-primary, #2e528f))
    );
  }

  @media (prefers-contrast: more) {
    .input-container {
      background-color: var(--label-input-bg-color, var(--surface-darker, rgba(0, 0, 0, 0.3)));
    }
  }

  @media (prefers-color-scheme: dark) {
    .input-container {
      background-color: var(
        --label-input-bg-color,
        var(--surface-subtle-lighter, rgba(255, 255, 255, 0.15))
      );
    }
		.has-errors .input-container:not(:focus-within) {
      border: var(
        --text-input-error-border,
        var(--input-error-border, 2px solid var(--color-error, #d21d44))
      );
    }
    .error-container span {
      color: var(--text-input-error-color, var(--input-error-color, var(--color-error, #d21d44)));
    }
  }

  @media (prefers-color-scheme: dark) and (prefers-contrast: more) {
    .input-container {
      background-color: var(
        --label-input-bg-color,
        var(--surface-lighter, rgba(255, 255, 255, 0.35))
      );
    }
  }

  input {
    flex-grow: 1;
    height: var(--text-input-height, var(--input-height, var(--item-height, 2rem)));
    border: var(--text-input-border, 0);
    background-color: var(--text-input-bg-color, transparent);
    outline: 0;
  }

  input:only-child {
    border-radius: var(--text-input-radius, var(--label-input-radius, var(--radius-2, 4px)));
  }

	.error-container span {
		width: 20ch;
		font-weight: 500;
		font-size: 0.8em;
		color: var(--text-input-error-color, var(--input-error-color, var(--color-error, #720e24)))
	}
</style>
