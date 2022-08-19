<script lang="ts">

	export let name : string;

	export let amount : number = 1;

</script>

<div class="multi-form-container">
	<slot {amount} ></slot>
</div>