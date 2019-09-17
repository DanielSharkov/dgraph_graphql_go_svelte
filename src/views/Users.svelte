<script>
	import { userSession } from '../stores/'
	import router from '../router'
	import { api } from '../api'
	import { fly } from '../utils/transitions'

	const userList = []

	async function fetchUsers() {
		const resp = await api.Query(`{ users { id displayName } }`)

		for (let user of resp.users) {
			userList.push(user)
		}
		userList = userList
	}
	fetchUsers()

	function openUserProfile(id) {
		router.push('profile', {id})
	}
</script>

<svelte:head>
	<title>Users</title>
</svelte:head>



<style lang="stylus">
	h3
		margin auto

	#userList
		display grid
		grid-template-columns repeat(2, 1fr)
		grid-gap 2rem

	.user
		padding 2rem 1rem
		flex-flow row wrap
		flex 0 0 calc(50% - 1rem)
		border-radius var(--app-border-radius)
		border solid 1px var(--app-border-01)
		transform scale(1)
		cursor pointer
		&:hover
			transform scale(1.05)
			box-shadow 0 10px 20px rgba(0,0,0,.05)
		.picture
			margin-bottom 2rem
			padding 1rem
			flex 0 0 auto
			background-color var(--app-bg-lightest)
			border-radius 100%
		.displayName
			flex 1 1 100%
			text-align center

	@media screen and (min-width 826px)
		#userList
			grid-template-columns repeat(4, 1fr)
	@media screen and (max-width 825px)
		#userList
			grid-template-columns repeat(3, 1fr)
	@media screen and (max-width 600px)
		#userList
			grid-template-columns repeat(2, 1fr)
	@media screen and (max-width 425px)
		#userList
			grid-template-columns 1fr
</style>



<div id="userList">
	{#each userList.reverse() as {id, displayName}, index}
		{#if id === $userSession.id && userList.length === 1}
			<h3 class="view-title">
				Your the only existing user ☹️
			</h3>
		{:else}
			<div
			class="user flex-row center-content"
			on:click={()=> openUserProfile(id)}
			in:fly={{ delay: index * 40 }}>
				<div class="picture flex-row center-content">
					<svg class="icon x-large stroked" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".25rem" d="M103 107V96c0-14-11-25-25-25H42c-14 0-25 11-25 25v11"/>
						<circle cx="60" cy="34" r="21" stroke-width=".25rem"/>
					</svg>
				</div>
				<span class="displayName">
					{displayName}
				</span>
			</div>
		{/if}
	{/each}
</div>

