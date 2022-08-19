<script lang="ts">
  export let title: string = "";
	export let optional : boolean = false;
	export let displayOptionalLabel : boolean = true;
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class={$$props.class}>
  <div class="label-container" class:optional={displayOptionalLabel && optional}>
    <slot name="label" />{title}
		{#if optional && displayOptionalLabel}
		(optional)
		{/if}<slot name="after-label"></slot>
  </div>
  <div class="input-container">
    <slot />
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
    background-color: var(
      --label-input-bg-color,
      var(--surface-subtle-darker, rgba(0, 0, 0, 0.1))
    );
    flex-direction: var(--label-input-flex-direction, row);
		column-gap: var(--label-input-column-gap);
		row-gap: var(--label-input-row-gap);
		justify-items: stretch;
  }

	.input-container :global(input) {
		flex-grow: 1;
	}

  @media (prefers-contrast: more) {
    .input-container {
      background-color: var(
        --label-input-bg-color,
        var(--surface-darker, rgba(0, 0, 0, 0.3))
      );
    }
  }

  @media (prefers-color-scheme: dark) {
    .input-container {
      background-color: var(
        --label-input-bg-color,
        var(--surface-subtle-lighter, rgba(255, 255, 255, 0.15))
      );
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
</style>
