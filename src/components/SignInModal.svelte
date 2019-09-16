<script>
	import { app, userSession } from '../stores/'
	import { UserSession } from '../types/UserSession'
	import { api } from '../api'
	import { fly } from '../utils/transitions'
	import { cubicInOut } from 'svelte/easing'

	let isSigningUp = false
	let inputError;

	const formData = {
		email: '',
		displayName: '',
		password: '',
	}

	async function SignIn() {
		if (!formData.email || !formData.password) {
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

			app.modals.close()
			window.dispatchEvent(window.eventUserSignIn)
		} catch(err) {
			setErrorMessage(err.errors.m)
			inputError = err.errors.m
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
			setErrorMessage(err.erros.m)
		}
	}

	let isValidInput;
	function validateInput() {
		if (isSigningUp) {
			isValidInput = (
				formData.email && formData.password && formData.displayName
			)
		}
		else {
			isValidInput = (
				formData.email && formData.password
			)
		}
	}
	validateInput()

	let errorMessageId = 0
	function setErrorMessage(msg) {
		errorMessageId++
		const thisMsgId = errorMessageId
		inputError = msg
		setTimeout(()=> {
			if (errorMessageId == thisMsgId) {
				inputError = null
			}
		}, 5000)
	}

	function primaryAction() {
		isSigningUp ? SignUp() : SignIn()
	}
	function secondaryAction() {
		isSigningUp = !isSigningUp
		validateInput()
	}
	
	$:signText = isSigningUp ? 'Sign up' : 'Sign in'
	$:signBtnText = isSigningUp ? 'Back to sign in' : 'No account? Sign up!'

	function errorInOut(node) {
		const height = node.clientHeight
		return {
			duration: 500,
			css(tick) {
				tick = cubicInOut(tick)
				return `
					height: ${height * tick}px;
					margin-bottom: ${tick}rem;
				`
			}
		}
	}
</script>



<style lang="stylus">
	#modal-signin
		flex 0 1 500px
		h1
			margin 0 0 2rem 0
			text-align center
			flex 1 1 100%
		form
			flex 0 1 100%
			width 100%
			align-content flex-start
			align-items center
			.input-error
				color #f05
				margin 0 auto 1rem auto
				overflow hidden
			input
				margin 0 0 2rem 0
				flex 1 1 100%
			button.primary
				margin 0 0 0 auto
</style>



<div id="modal-signin" class="modal flex-row" transition:fly={{ duration: 300, multiplier: 2 }}>
	<h1>{signText}</h1>
	<form class="flex-row">
		{#if inputError}
			<p class="input-error" transition:errorInOut>{inputError}</p>
		{/if}
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
			{signBtnText}
		</button>
		<button
		type="submit"
		class="primary"
		disabled={!isValidInput}
		on:click|preventDefault={primaryAction}>
			{signText}
		</button>
	</form>
</div>
