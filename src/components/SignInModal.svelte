<script>
	import { sessionUser, UserSession, modalViewer } from '../stores'
	import { api } from '../api'

	let isSigningUp = false
	let inputError = ''

	const formData = {
		email: '',
		displayName: '',
		password: '',
	}

	async function SignIn() {
		if (formData.email === '' || formData.password === '') return

		try {
			const resp = await api.Query(
				`mutation (
					$password: String!
					$email: String!
				) {
					createSession(
						email: $email
						password: $password
					) {
						key
						creation
						user {
							id
							displayName
							email
						}
					}
				}`,
				{
					email: formData.email,
					password: formData.password,
				}
			)

			sessionUser.set(new UserSession(
				resp.createSession.key,
				resp.createSession.user.id,
				resp.createSession.user.email,
				resp.createSession.user.displayName,
				resp.createSession.creation,
			))
			modalViewer.close()
		} catch(err) {
			inputError = err.response.data.errors.m
		}
	}

	async function SignUp() {
		try {
			const resp = await api.Query(
				`mutation (
						$displayName: String!
						$password: String!
						$email: String!
					) {
						createUser(
							displayName: $displayName
							email: $email
							password: $password
						) {
							id
							displayName
						}
					}
				`,
				{
					displayName: formData.displayName,
					email: formData.email,
					password: formData.password,
				},
			)
			SignIn()
		} catch(err) {
			inputError = err.response.data.errors.m
		}
	}

	let isValidInput;
	function validateInput() {
		if (isSigningUp) isValidInput =
			formData.email !== '' &&
			formData.password !== '' &&
			formData.displayName !== ''
		else isValidInput =
			formData.email !== '' &&
			formData.password !== ''
	}
	validateInput()

	function handleAction() {
		if (isSigningUp) SignUp()
		else SignIn()
	}
</script>



<style>
	.modal.signin {
		position: relative;
		display: flex;
		flex: 0 1 500px;
	}
	.modal.signin h1 {
		margin: 0 0 1rem 0;
		text-align: center;
		flex: 1 1 100%;
	}
	.modal.signin .form {
		display: flex;
		flex: 0 1 100%;
		width: 100%;
		flex-flow: row wrap;
		align-content: flex-start;
		align-items: center;
	}
	.modal.signin .form .input-error {
		color: #f05;
		margin: 0 auto 1rem auto;
	}
	.modal.signin .form input {
		margin: 0 0 2rem 0;
		padding: 1rem;
		flex: 1 1 100%;
		background: none;
		border: solid 1px rgba(0,0,0,.1);
		border-radius: var(--app-border-radius);
		outline: none;
		box-shadow: 0;
	}
	.modal.signin .form input:hover {
		border-color: #000;
	}
	.modal.signin .form input:focus {
		border-color: #03f;
		box-shadow: 0 0 0 .25rem rgba(0,40,255,.1);
	}
	.modal.signin .form button.primary {
		margin: 0 0 0 auto;
	}
</style>



<div class="modal signin" class:show-sign-up-panel={isSigningUp}>
	<h1>
		{#if isSigningUp}
			Sign up
		{:else}
			Sign in
		{/if}
	</h1>
	<div class="form">
		<p class="input-error" class:invisible={inputError === ''}>
			{inputError}
		</p>
		<input
			class:hidden={!isSigningUp}
			on:input={() => validateInput()}
			placeholder="Name"
			type="text"
			bind:value={formData.displayName}
		/>
		<input
			on:input={() => validateInput()}
			placeholder="Email"
			type="text"
			bind:value={formData.email}
		/>
		<input
			on:input={() => validateInput()}
			placeholder="Password"
			type="password"
			bind:value={formData.password}
		/>
		<button class="secondary" on:click={() => {
			isSigningUp = !isSigningUp
			validateInput()
		}}>
			{#if isSigningUp}
				Back to sign in
			{:else}
				No account? Sign up!
			{/if}
		</button>
		<button
		class="primary"
		disabled={!isValidInput}
		on:click={handleAction}>
			{#if isSigningUp}
				Sign up
			{:else}
				Sign in
			{/if}
		</button>
	</div>
</div>
