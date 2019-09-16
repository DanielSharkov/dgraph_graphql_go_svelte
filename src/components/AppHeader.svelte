<script>
	import router from '../router'
	import { app } from '../stores/'
	import { userSession } from '../stores/'

	let isValidSession = userSession.isValidSession

	function userSessionAction() {
		if ($isValidSession) {
			router.push('profile', {id: $userSession.id})
		}
		else {
			app.modals.open('signIn')
		}
	}

	$:signInButtonText = $isValidSession ? $userSession.displayName : 'Sign in'
	$:isProfileView = (
		$router.route.name == 'profile' &&
		$router.route.params.id === $userSession.id
	)
</script>



<style lang="stylus">
	header
		display flex
		max-width 800px
		margin auto
		padding 2rem 0
		align-content stretch
		align-items stretch
		@media screen and (max-width 825px)
			padding 2rem
		#navigation button
			display inline-block
			margin-right 1rem

	#userSession
		margin-left auto
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
</style>



<header>
	<div id="navigation">
		{#each $router.routes as route}
			{#if route.metadata && route.metadata.nav}
				<button
				class="primary"
				class:active={$router.route.name === route.name}
				on:click={() => router.push(route.name)}>
					{route.metadata.nav.displayName}
				</button>
			{/if}
		{/each}
	</div>
	<div
	id="userSession"
	class:profile-view={isProfileView}>
		<button class="user" on:click={userSessionAction}>
			<span class="displayName">
				{signInButtonText}
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
