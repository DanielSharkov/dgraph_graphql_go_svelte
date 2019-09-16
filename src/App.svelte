<script>
	import { RouterViewport } from '@danielsharkov/svelte-router'
	import router from './router'
	import SignInModal from './components/SignInModal'
	import globalStyles from './styles/global.styl'
	import blackTheme from './styles/black-theme.styl'
	import { app as appStore, userSession } from './stores/'
	import initStores from './stores/initStores'
	import ModalViewer from './components/ModalViewer'

	// Loads asynchronous data
	appStore.load((resolve, fail)=> {
		initStores().then(resolve).catch(fail)
	})

	let isValidSession = userSession.isValidSession

	function userSessionAction() {
		if ($isValidSession) {
			router.push('profile', {id: $userSession.id})
		}
		else {
			appStore.modals.open('signIn')
		}
	}

	appStore.modals.registerModal('signIn', SignInModal)
</script>



<style lang="stylus">
	header
		display flex
		max-width 800px
		margin auto
		margin-bottom 2rem
		padding 1rem 0
		align-content stretch
		align-items stretch
		#navigation
			display flex
			justify-content center
			align-items center
			flex 0 0 auto
			button
				margin 0 1rem 0 0
				&:hover
					background-color var(--app-primary-01)
					border-color var(--app-primary)
					color var(--app-primary)
				&:active, &.active, &:focus
					background-color var(--app-primary)
					border-color var(--app-primary)
					color #fff
				&:focus
					box-shadow 0 0 0 .25rem var(--app-primary-01)

	#userSession
		display flex
		margin-left auto
		flex 0 0 auto
		align-content center
		align-items center
		.user
			padding .5rem 1rem
			flex 1 1 auto
			&:hover
				border-color var(--app-primary)
				background-color var(--app-primary-01)
				svg > *
					stroke var(--app-primary)
				.displayName
					color var(--app-primary)
			&:active, &:focus
				border-color var(--app-primary)
				background-color var(--app-primary)
				svg > *
					stroke #fff
				.displayName
					color #fff
			.picture
				display flex
				margin-left 1rem
				flex 0 0 auto
				justify-content center
				align-content center
				align-items center
		&.profile-view .user
			background-color var(--app-primary)
			.displayName
				color #fff
			.picture svg > *
				stroke #fff

	#router-viewport
		position relative
		display block
		max-width 800px
		margin auto
		padding-bottom 4rem

	@media screen and (max-width 825px)
		header
			padding 2rem
			margin 0
		#router-viewport
			padding 0 2rem 4rem 2rem
</style>



<div id="app" class="{$appStore.theme.name}-theme">
	<ModalViewer/>

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
		id="userSession"
		class:profile-view={
			$router.route.name == 'profile' &&
			$router.route.params.id === $userSession.id
		}>
			<button class="user" on:click={userSessionAction}>
				<span class="displayName">
					{#if $isValidSession}
						{$userSession.displayName}
					{:else}
						Sign in
					{/if}
				</span>
				<div class="picture">
					<svg class="icon stroked" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 120 120" fill="none" stroke="#000">
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
