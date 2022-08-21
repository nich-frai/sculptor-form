<script lang="ts">
  export let disabled: boolean = false;
  export let locked: boolean = false;
</script>

<button type="submit" {disabled}>
  <slot {locked} />
</button>

<style>
  button {
    position: relative;
    width: var(--submit-button-width, var(--button-width, 100%));
    height: var(--submit-button-height, var(--button-height, 2.5rem));
    padding: var(
      --submit-button-padding,
      var(--button-padding, 0.5rem 0.75rem)
    );
    box-sizing: border-box;
    transition: background-color var(--transition-duration, 0.25s), filter var(--transition-duration);
    border: 0;
    border-radius: var(--submit-button-radius, var(--button-radius, 4px));
		background-color: var(--submit-button-bg-color, var(--button-bg-color, var(--surface-4, rgba(0,0,0,0.2))));
		filter: brightness(100%);
		cursor: pointer;
  }

	button:hover {
		filter: brightness(90%) ;
	}

	button:active {
		filter: brightness(70%) contrast(120%);
	}

	@media (prefers-color-scheme: dark) {
		button:hover {
		filter: brightness(110%) ;
	}

	button:active {
		filter: brightness(70%) contrast(120%);
	}
	}
</style>
