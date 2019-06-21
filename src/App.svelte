<script>
	import { fade } from 'svelte/transition'
	import { RouterViewport } from '@danielsharkov/svelte-router'
	import router from './router'
	
	import SignInModal from './components/SignInModal'
	import {
		sessionUser,
		isValidSession,
		modalViewer,
		ModalView,
	} from './stores'

	function sessionUserAction() {
		if ($isValidSession) {
			let test = $sessionUser.id
			console.log(test)
			router.push('profile', {id: test})
		}
		else {
			modalViewer.open(new ModalView('sign_in'))
		}
	}
</script>



<style>
	#app {
		max-width: 800px;
		margin: auto;
	}

	header {
		display: flex;
		width: 100%;
		margin-bottom: 2rem;
		padding: 1rem 0;
		align-content: stretch;
		align-items: stretch;
	}

	#navigation {
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 0 0 auto;
	}
	#navigation button {
		margin: 0 1rem 0 0;
		padding: .5rem 1rem;
		background: none;
		border: none;
		border: solid 1px transparent;
		border-radius: 4px;
		cursor: pointer;
	}
	#navigation button:hover {
		background-color: rgba(0,40,255,0.05);
		border-color: #03f;
		color: #03f;
	}
	#navigation button:active,
	#navigation button.active,
	#navigation button:focus {
		background-color: #03f;
		border-color: #03f;
		color: #fff;
	}
	#navigation button:focus {
		box-shadow: 0 0 0 .25rem rgba(0,40,255,0.05);
	}

	#sessionUser {
		display: flex;
		margin-left: auto;
		flex: 0 0 auto;
		align-content: center;
		align-items: center;
	}
	#sessionUser button {
		display: flex;
		margin: 0;
		padding: .5rem;
		align-content: center;
		align-items: center;
		background: none;
		border: none;
		cursor: pointer;
		flex: 1 1 auto;
		border-radius: 4px;
		border: solid 1px transparent;
	}
	#sessionUser button:hover {
		border-color: #03f;
		background-color: rgba(0,40,255,.1);
	}
	#sessionUser button:active,
	#sessionUser button:focus {
		border-color: #03f;
		background-color: #03f;
	}
	#sessionUser .user {
		padding: .5rem 1rem;
	}
	#sessionUser button .picture {
		display: flex;
		margin-left: 1rem;
		flex: 0 0 auto;
		justify-content: center;
		align-content: center;
		align-items: center;
	}
	#sessionUser button:hover svg > * {
		stroke: #03f;
	}
	#sessionUser button:active svg > *,
	#sessionUser button:focus svg > * {
		stroke: #fff;
	}
	#sessionUser button:hover .displayName {
		color: #03f;
	}
	#sessionUser button:active .displayName,
	#sessionUser button:focus .displayName {
		color: #fff;
	}
	#sessionUser.profile-view .user {
		background-color: #03f;
	}
	#sessionUser.profile-view .user .displayName {
		color: #fff;
	}
	#sessionUser.profile-view .user .picture svg > * {
		stroke: #fff;
	}

	#router-viewport {
		display: block;
		max-width: 960px;
		margin: auto;
		padding-bottom: 4rem;
	}

	#modal-viewport {
		z-index: 10;
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		width: 100vw;
		min-height: 100vh;
		padding: 2rem;
		justify-content: center;
		align-items: center;
		flex-flow: row wrap;
	}
	#modal-viewport > .background {
		z-index: -1;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.5);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
	}

	@media screen and (max-width: 825px) {
		header {
			padding: 1rem;
		}
		#router-viewport {
			padding: 0 1rem 4rem 1rem;
		}
	}
</style>



{#if $modalViewer.type !== ''}
	<div id="modal-viewport" transition:fade={{duration:100}}>
		<div class="background" on:click={modalViewer.close}/>
		{#if $modalViewer.type === 'sign_in'}
			<SignInModal/>
		{/if}
	</div>
{/if}

<div id="app">
	<header>
		<div id="navigation">
			{#each $router.routes as route}
				{#if route.metadata && route.metadata.nav}
					<button
					class:active={$router.route.name === route.name}
					on:click={() => router.push(route.name)}>
						{route.metadata.nav.displayName}
					</button>
				{/if}
			{/each}
		</div>
		<div
		id="sessionUser"
		class:profile-view={
			$router.route.name == 'profile' &&
			$router.route.params.id === $sessionUser.id
		}>
			<button
			class="user"
			on:click={sessionUserAction}>
				<span class="displayName">
					{#if $isValidSession}
						{$sessionUser.displayName}
					{:else}
						Sign in
					{/if}
				</span>
				<div class="picture">
					<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 120 120" fill="none" stroke="#000">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".5rem" d="M103 107V96c0-14-11-25-25-25H42c-14 0-25 11-25 25v11"/>
						<circle cx="60" cy="34" r="21" stroke-width=".5rem"/>
					</svg>
				</div>
			</button>
		</div>
	</header>

	<div id="router-viewport">
		<RouterViewport {router}/>
	</div>
</div>
