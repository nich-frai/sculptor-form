# Sculptor - Form
A Svelte library for building Form UI's in a streamlined and simple way and using zod form input validation!


## Quick example
```svelte
<script lang="ts">
	import { Form, z } from '@sculptor/form';

	const schema = z.object({
		username : z.string(),
		password : z.string(),
		keepSignedIn : z.boolean().default(false)
	});
</script>

<Form 
	action="http://myapi.localhost:4000/login" 
	{schema}
	on:submitSuccess={(loginResponse) => {
		alert("Login was successfull!");
	}}	
>
	
	<h1> Simple login form! </h1>
	
	<TextInput label="username" name="username" />
	<PasswordInput label="password" name="password" />
	<CheckboxInput label="keep signed in?" name="keepSignedIn" />

	<SubmitButton> login </SubmitButton>
</Form>
```
It might not appear much but the script, as is, is performing the following tasks:
1. Building a form
2. Adding validation to each of the inputs based on our schema (generated with zod)
3. Sending the payload with username, password and keepSignedIn to "http://myapi.localhost:4000/login"
4. Calling the function "submitSuccess" when the api endpoint returns a reponse within the 200 range
5. Blocking the submit button when a request/response is ongoing or ater a request has timedout (10s by default)

## Goals
- Be as close as writing HTML as possible (improved DX)
- Ensure a data schema / integrity using Zod (please use a backend IO validation!)
- Simplify reporting validation error to users 
- Nested form as a way to express nested data 
- Generate multiple forms from a template as a way to express array of objects 
- Generatemultiple inputs from a template as a way to express array of values
- Customize the theme and layout of form disposition

## Want to have but lacks the knowledge
- Acessibility
- i18n

## Warnings
This library is open source and open to contribution, everyone is free to make suggestions, fixes, PRs and so forth **BUT** as of now its a single man project and not suited for production!
Keep in mind the following as it may be a no-go:
1. It's suited for feature rich applications where initial load time is not such a valuable metric, therefore it's not optmized for bundle size or treeshaking capabilities (there's some coupling between elements so they can work properly)
2. It uses some experimental features from Svelte that might change in the future and possibly break this library (e.g Generic inside Components $$);
3. It uses some CSS properties that are somewhat new, even if now whithout IE 11 the compatibility across browser are not such an issue you should test the styling in the targeted devices you intend to deploy!
4. I18n and A11y are considered "desired features" but the current developer has little knowledge in such areas, therefore the implementation lacks such features 

## Examples 

### More examples

- **Native Behaviour**, only styling / component composition:
- **Nested Form**, useful when dealing with data structures that have nested objects
- **Input Arrays**, useful when dealing with a input that can be repeated N amount of times
- **Form Arrays**, useful when dealing with a data structure that can be repeated N amount of times

## Theming 
By default the form uses the same general theme as the one used in "@sculptor/ui" but most of it can be controller through 
css variables;
Some of these varibales are more broadbly used and dont hold the component name as a prefix:

Others apply only to a specific component and carry the component name as a prefix:

## Components
