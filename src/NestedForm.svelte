<script lang="ts">
  import { getContext, onMount, setContext } from "svelte";
  import { FormController } from "./form.controller";
  import type { SomeZodObject, TypeOf } from "zod";
  import type { Writable } from "svelte/store";

  type T = $$Generic<SomeZodObject>;

  export let name: string | undefined = undefined;
  export let schema: T;
  export let value: TypeOf<T> | Writable<TypeOf<T>> | undefined = undefined;
  export let controller: FormController<T> | undefined = undefined;

  const parentController = getContext<FormController>("form-controller");
  let formEl: HTMLFormElement;

	function isSvelteStore(o: any): o is Writable<unknown> {
    return (
      typeof o === "object" && o != null && typeof o.subscribe === "function"
    );
  }

  function initializeForm() {
    controller = controller!;

    // update controller with provided values
    if (value != null) {
      if (isSvelteStore(value)) {
        controller.valueStore = value;
      } else {
        controller.valueStore!.set(value);
      }
    }

    if (schema != null) {
      controller.schema = schema;
    }

    controller.formElement = formEl;

    return () => {
      // destroy form ?
      controller!.formElement = undefined;
    };
  }

  // if a controller was not provided, create one
  if (controller == null) controller = new FormController<T>();
  const lockStore = controller.lockStore;
  $: submitting = $lockStore;
  // override the form controller to this nested controller
  setContext("form-controller", controller);

  onMount(() => {
    initializeForm();
		
		// register this nested form as a field in parent controller
    if (name != null && parentController != null) {
      parentController.addField({
        name,
        checkValidityState() {
          return controller!.parseObject(controller!.collectDataFromFields())
            .success;
        },
        collect() {
          return controller!.collectDataFromFields();
        },
        setValidity(err) {},
        subscribe: controller!.valueStore!.subscribe,
      });
    }
  });
</script>

<form bind:this={formEl} on:submit|preventDefault>
  <slot {submitting} />
</form>

<style>
</style>
