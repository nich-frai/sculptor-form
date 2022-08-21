<script lang="ts">
	export let value : string | Date;
	export let label : string;
	export let name : string = "";
	
	let timePickerEl : HTMLDivElement;
	let labelEl : HTMLLabelElement;
	let errors : string[] = [];

</script>
<!-- svelte-ignore a11y-label-has-associated-control -->
<label bind:this={labelEl}>
	<div class="label-container">
		{label}
	</div>
	<div class="input-display-container">
		<input type="hidden" {name} />
		<slot name="before-input"></slot>
		<input type="text" name="hour-picker" bind:value on:change on:input />
		<input type="text" name="minute-picker" bind:value on:change on:input />
		<slot name="after-input"></slot>
	</div>
	<div class="error-display">
		{#each errors as err }
				<span>{err}</span> <br />
		{/each}
	</div>
</label>
<div class="time-pick-container">
		
</div>