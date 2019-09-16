<script>
	import { app as appStore, userSession } from '../stores/'
	import { UserSession } from '../types/UserSession'
	import { api } from '../api'
	import { cubicOut } from 'svelte/easing'

	let isSigningUp = false
	let inputError = ''

	const formData = {
		email: '',
		displayName: '',
		password: '',
	}

	async function SignIn() {
		if (formData.email === '' || formData.password === '') {
			return
		}

		try {
			const resp = await api.Query(
				`mutation ($password: String!, $email: String!) {
					createSession(email: $email, password: $password) {
						key
						creation
						user { id displayName email }
					}
				}`,
				{
					email: formData.email,
					password: formData.password,
				}
			)

			userSession.set(
				resp.createSession.key,
				resp.createSession.user.id,
				resp.createSession.user.email,
				resp.createSession.user.displayName,
				resp.createSession.creation,
			)

			appStore.modals.close()
			setTimeout(() => {
				window.dispatchEvent(window.eventUserSignIn)
			}, 0)
		} catch(err) {
			inputError = err.response.data.errors.m
		}
	}

	async function SignUp() {
		try {
			const resp = await api.Query(
				`mutation ($email: String!, $displayName: String!, $password: String!) {
					createUser(email: $email, displayName: $displayName, password: $password) {
						id
						displayName
					}
				}`,
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
		if (isSigningUp) {
			isValidInput = (
				formData.email !== '' &&
				formData.password !== '' &&
				formData.displayName !== ''
			)
		}
		else {
			isValidInput = (
				formData.email !== '' &&
				formData.password !== ''
			)
		}
	}
	validateInput()

	function primaryAction() {
		if (isSigningUp) {
			SignUp()
		}
		else {
			SignIn()
		}
	}

	function secondaryAction() {
		isSigningUp = !isSigningUp
		validateInput()
	}
	
	function testTrans() {
		return {
			duration: 300,
			css(tick) {
				tick = cubicOut(tick)
				return `
					transform: translateY(${2 - tick * 2}rem);
					opacity: ${tick};
				`
			},
		}
	}
</script>



<style lang="stylus">
	.modal.signin
		position relative
		display flex
		flex 0 1 500px
		h1
			margin 0 0 2rem 0
			text-align center
			flex 1 1 100%
		form
			display flex
			flex 0 1 100%
			width 100%
			flex-flow row wrap
			align-content flex-start
			align-items center
			.input-error
				color #f05
				margin 0 auto 1rem auto
			input
				margin 0 0 2rem 0
				flex 1 1 100%
			button.primary
				margin 0 0 0 auto
</style>



<div class="modal signin" in:testTrans>
	<h1>
		{#if isSigningUp}
			Sign up
		{:else}
			Sign in
		{/if}
	</h1>
	<form>
		<p class="input-error" class:invisible={inputError === ''}>
			{inputError}
		</p>
		<input
			class="large"
			class:hidden={!isSigningUp}
			on:input={validateInput}
			placeholder="Name"
			type="text"
			bind:value={formData.displayName}
		/>
		<input
			class="large"
			on:input={validateInput}
			placeholder="Email"
			type="text"
			bind:value={formData.email}
		/>
		<input
			class="large"
			on:input={validateInput}
			placeholder="Password"
			type="password"
			bind:value={formData.password}
		/>
		<button type="button" class="secondary" on:click={secondaryAction}>
			{#if isSigningUp}
				Back to sign in
			{:else}
				No account? Sign up!
			{/if}
		</button>
		<button
		type="submit"
		class="primary"
		disabled={!isValidInput}
		on:click|preventDefault={primaryAction}>
			{#if isSigningUp}
				Sign up
			{:else}
				Sign in
			{/if}
		</button>
	</form>
</div>
