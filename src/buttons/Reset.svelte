<button type="submit">
<slot></slot>
</button>
<style>
	button {
		position: relative;
		width: var(--submit-button-width, var(--button-width, 100%));
		height: var(--submit-button-height, var(--button-height, 2.5rem));
		padding: var(--submit-button-padding, var(--button-padding, 0.5rem 0.75rem));
		box-sizing: border-box;
		transition: background-color var(--transition-duration, 0.25s);
		border: 0;
		border-radius: var(--submit-button-radius, var(--button-radius, 4px));
	}
</style>