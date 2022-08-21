<script lang="ts">
  import "./open.props.css";
  import { CheckboxInput, Form, PasswordInput, SubmitButton, TextInput, z } from "@sculptor/form";

  const schema = z.object({
    name: z.string(),
  });

  let darkTheme: boolean = false;
  let accentColor: string = "#008081";

  function sleep(time: number) {
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
  </section>
  <br />
  <section class="form-box">
    <Form
      {schema}
      action={async (data) => {
        // Artifical delay of 2 seconds
        await sleep(2000);
        alert("Login with: " + JSON.stringify(data));
      }}
      let:submitting
    >
      <h2>Personal User Information</h2>
      <TextInput label="username" name="username" placeholder="insert your username!" />
      <PasswordInput label="password" name="password" placeholder="********" />
      <CheckboxInput label="keep you signed in?" name="keepLoggedIn" value="true" />
      <br />
      <SubmitButton>{submitting ? "submitting!" : "login!"}</SubmitButton>
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
    align-items: center;
    justify-items: center;
    accent-color: var(--accent);
    --submit-button-bg-color: var(--accent);
    --color-primary: var(--accent);
    --transition-duration: 250ms;
  }
  h1,
  h2 {
    margin: 0.5rem 0;
  }

  h1 {
    font-size: 2.5rem;
  }

  .form-box {
    width: 100%;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-2);
    background-color: var(--surface-2);
    box-sizing: border-box;
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
    --color-error: #e7405c;
    color-scheme: dark;
  }

  @media (prefers-color-scheme: dark) {
    main {
      --link: var(--indigo-3);
      --link-visited: var(--grape-3);
      --text-1: var(--gray-1);
      --text-2: var(--gray-4);
      --surface-1: var(--gray-9);
      --surface-2: var(--gray-8);
      --surface-3: var(--gray-7);
      --surface-4: var(--gray-6);
      --color-error: #e7405c;
      color-scheme: dark;
    }
  }
</style>
