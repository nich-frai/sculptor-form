<script lang="ts">
  import "./open.props.css";
  import {
    CheckboxInput,
    Form,
    PasswordInput,
    SubmitButton,
    TextInput,
		z
  } from "@sculptor/form";

  const loginSchema = z.object({
    username: z.string().min(6).regex(/^[0-9A-Za-z.]+$/, "Username may only contain letters (upper or lowercase), numbers or a dot \".\"!"),
		password : z.string().min(6),
		keepLoggedIn : z.boolean().default(false),
  });

  let darkTheme: boolean = false;
  let accentColor: string = "#008081";
	function sleep(time : number) {
		return new Promise<void>((res) => setTimeout(res, time));
	}

</script>

<main
  class:apply-dark-theme={darkTheme}
  style="
	--accent : {accentColor};
	--scheme: {darkTheme ? 'dark' : 'light'};
"
>
  <section>
    <h1>Sculptor</h1>
    <h2>Login form example</h2>
    <p>A simple demonstration of sculptor's capabilities using a login form</p>
    <p>This form should:</p>
		<ul>
			<li>Display 3 inputs for username, password and a checkbox indicating a "keep me signed in"</li>
			<li>Validate username as : required, minimum of 6 letters, only alpha numeric chars and "."</li>
			<li>Validate password as : required, minimum of 6 letters</li>
			<li>Have the default value of keepLoggedIn as : false</li>
			<li>Not fire any more events while the artificial delay of 2 seconds take place on submit</li>
		</ul>

    <label>
      <input type="checkbox" bind:checked={darkTheme} /> dark theme ?
    </label>
  </section>

  <section class="form-box">
    <Form
      schema={loginSchema}
      value={{ username: "form default username", password : "", keepLoggedIn : false}}
      action={async (data) => {
        // Artifical delay of 2 seconds
				await sleep(2000);
        alert("Login with: " + JSON.stringify(data));
      }}
			let:submitting
    >
      <h2>Authenticate!</h2>
      <TextInput
        label="username"
        name="username"
        placeholder="insert your username!"
      />
      <PasswordInput label="password" name="password" placeholder="********" />
      <CheckboxInput
        label="keep you signed in?"
        name="keepLoggedIn"
        value="true"
      />
      <br />
      <SubmitButton>{submitting ? 'submitting!' : 'login!'}</SubmitButton>
    </Form>
  </section>
</main>

<style>
  main {
    position: relative;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    padding: 1.5rem 2rem;
    background-color: var(--surface-1);
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    justify-items: center;
    --submit-button-bg-color: var(--accent);
  }
  h1,
  h2 {
    margin: 0.5rem 0;
  }

  h1 {
    font-size: 3rem;
  }

  .form-box {
    width: 30vw;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-2);
    background-color: var(--surface-2);
  }

  /* From Open.Props normalize css! */
  :where(main) {
    --link: var(--indigo-7);
    --link-visited: var(--grape-7);
    --text-1: var(--gray-9);
    --text-2: var(--gray-7);
    --surface-1: var(--gray-0);
    --surface-2: var(--gray-2);
    --surface-3: var(--gray-3);
    --surface-4: var(--gray-4);
    --scrollthumb-color: var(--gray-6);
    -webkit-text-size-adjust: none;
    background-color: var(--surface-1);
    block-size: 100%;
    caret-color: var(--link);
    color: var(--text-2);
    color-scheme: light;
    font-family: var(--font-sans);
    line-height: var(--font-lineheight-3);
    scrollbar-color: var(--scrollthumb-color) transparent;
  }

  .apply-dark-theme {
    --link: var(--indigo-3);
    --link-visited: var(--grape-3);
    --text-1: var(--gray-1);
    --text-2: var(--gray-4);
    --surface-1: var(--gray-9);
    --surface-2: var(--gray-8);
    --surface-3: var(--gray-7);
    --surface-4: var(--gray-6);
    color-scheme: dark;
  }
</style>
