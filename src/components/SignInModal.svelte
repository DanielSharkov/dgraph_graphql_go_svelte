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
			inputError = err.response.data.error.m
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
			inputError = err.response.data.error.m
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
</script>



<style>
	.modal.signin {
		position: relative;
		display: flex;
		flex: 0 1 500px;
	}
	.modal.signin h1 {
		margin: 0 0 2rem 0;
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
	}
	.modal.signin .form input {
		margin: 0 0 2rem 0;
		padding: 1rem;
		flex: 1 1 100%;
		background: none;
		border: solid 1px rgba(0,0,0,.1);
		border-radius: 4px;
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
	.modal.signin .form button {
		display: flex;
		margin: 0;
		padding: 0;
		background: none;
		border: none;
		flex: 0 1 auto;
		outline: none;
		cursor: pointer;
	}
	.modal.signin .form button.secondary {
		font-size: .85rem;
	}
	.modal.signin .form button.secondary:hover {
		color: #03f;
		text-decoration: underline;
	}
	.modal.signin .form button.primary {
		margin: 0 0 0 auto;
		padding: .5rem 1rem;
		border: solid 1px rgba(0,0,0,.1);
		border-radius: 4px;
		color: #03f;
	}
	.modal.signin .form button.primary:hover {
		border-color: #03f;
		background-color: rgba(0,40,255,.05);
	}
	.modal.signin .form button.primary:active {
		background-color: #03f;
		color: #fff;
	}
	.modal.signin .form button[disabled] {
		color: #000;
		border-color: rgba(0,0,0,.5);
		opacity: .25;
		pointer-events: none;
	}
</style>



<div class="modal signin" class:show-sign-up-panel={isSigningUp}>
	<h1>
		{#if isSigningUp}Sign up{:else}Sign in{/if}
	</h1>
	<div class="form">
		{#if inputError !== ''}
			<p class="input-error">{inputError}</p>
		{/if}
		{#if isSigningUp}
			<input
				on:input={() => validateInput()}
				placeholder="Name"
				type="text"
				bind:value={formData.displayName}
			/>
		{/if}
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
		on:click={isSigningUp ? SignUp : SignIn}>
			{#if isSigningUp}
				Sign up
			{:else}
				Sign in
			{/if}
		</button>
	</div>
</div>
