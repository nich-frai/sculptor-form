<script lang="ts">
  import { onMount, setContext } from "svelte";
  import type { Writable } from "svelte/store";
  import type { SomeZodObject, TypeOf } from "zod";
  import {
    createActionForTargetURL,
    FormController,
    type TFormEncType,
  } from "./form.controller";

  type T = $$Generic<SomeZodObject>;
  type Enc = $$Generic<TFormEncType>;

  export let native: boolean = false;

  export let schema: T;
  export let configureRequest: RequestInit | undefined = undefined;
  export let method:
    | "POST"
    | "GET"
    | "PUT"
    | "PATCH"
    | "DELETE"
    | (string & {}) = "POST";
  export let enctype: Enc | undefined = undefined;
  export let action:
    | string
    | ((data: TypeOf<T>) => Promise<unknown> | unknown) = "";

  export let value: TypeOf<T> | Writable<TypeOf<T>> | undefined = undefined;

  export let controller: FormController<T> | undefined = undefined;

  let formEl: HTMLFormElement;

  function isSvelteStore(o: any): o is Writable<unknown> {
    return (
      typeof o === "object" && o != null && typeof o.subscribe === "function"
    );
  }

  // if a controller was not provided, create one
  if (controller == null) {
    controller = new FormController<T>();
  }
  const lockStore = controller.lockStore;
  $: submitting = $lockStore;

  setContext("form-controller", controller);

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

    if (native === true) {
      controller.nativeBehaviour = true;
    }

    if (schema != null) {
      controller.schema = schema;
    }

    if (typeof action === "string") {
      controller.onSubmit = createActionForTargetURL(action, configureRequest);
    }
    if (typeof action === "function") {
      controller.onSubmit = action;
    }

    controller.formElement = formEl;

    return () => {
      // destroy form ?
      controller!.formElement = undefined;
    };
  }

  function handleFormSubmit(e: SubmitEvent) {
    controller!.formElement = formEl;
    controller!.submitEvent(e);
  }

  onMount(initializeForm);
</script>

<form
  bind:this={formEl}
  on:submit|preventDefault={handleFormSubmit}
  {method}
  {enctype}
  action={typeof action === "string" ? action : ""}
>
  <slot {submitting} />
</form>

<style>
</style>
