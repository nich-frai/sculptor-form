<script lang="ts">
  import type NestedForm from "./NestedForm.svelte";

  type T = $$Generic<NestedForm>;

  export let name: string;
  export let label: string = "";
  export let initialAmount: number = 1;
  export let formElement: T;

  const allIndexes = Array.from({ length: initialAmount }).map((_, i) => i);

	// TODO: surround each form with a "delete"
	// TODO: add a "+" button near the slot label
</script>

<div class="multi-form-container">
  <slot>{label}</slot>
  {#each allIndexes as index (index)}
    <svelte:component this={formElement} name={`${name}[${index}]`} />
  {/each}
</div>
