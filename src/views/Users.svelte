<script>
	import { sessionUser } from '../stores'
	import router from '../router'
	import { api } from '../api'

	// Semicolon needed because otherwise javascript
	// would try to assign it as a function
	const userList = [];

	(async function() {
		const resp = await api.Query(`{ users { id displayName } }`)

		for (let user of resp.users) userList.unshift(user)
		userList = userList
	}())
</script>

<svelte:head>
	<title>Users</title>
</svelte:head>



<style>
	h3 {
		margin: auto;
	}

	#userList {
		display: flex;
		flex-flow: row wrap;
	}
	#userList .user {
		display: flex;
		padding: 2rem 1rem;
		flex-flow: row wrap;
		flex: 0 0 calc(50% - 1rem);
		border-radius: var(--app-border-radius);
		border: solid 1px var(--app-border-01);
		justify-content: center;
		align-items: center;
		transform: scale(1);
		cursor: pointer;
	}
	#userList .user:nth-child(odd) {
		margin: 0 1rem 2rem 0;
	}
	#userList .user:nth-child(even) {
		margin: 0 0 2rem 1rem;
	}
	#userList .user:hover {
		transform: scale(1.05);
		box-shadow: 0 10px 20px rgba(0,0,0,.05);
	}
	#userList .user .picture {
		display: flex;
		margin-bottom: 2rem;
		padding: 1rem;
		flex: 0 0 auto;
		background-color: var(--app-bg-lightest);
		border-radius: 100%;
		justify-content: center;
		align-items: center;
	}
	#userList .user .displayName {
		flex: 1 1 100%;
		text-align: center;
	}

	@media screen and (min-width: 826px) {
		#userList .user {
			flex: 0 0 calc(100% / 4 - 2rem);
		}
		/* Every first user */
		#userList .user:nth-child(4n+1) {
			margin: 0 1rem 2rem 0;
		}
		/* Every secound & third user */
		#userList .user:nth-child(4n+2),
		#userList .user:nth-child(4n+3) {
			margin: 0 1.5rem 2rem 1.5rem;
		}
		/* Every fourth user */
		#userList .user:nth-child(4n-0) {
			margin: 0 0 2rem 1rem;
		}
	}
</style>



<div id="userList">
	{#each userList as {id, displayName}}
		{#if id === $sessionUser.id && userList.length === 1}
			<h3 class="view-title">
				Your the only existing user ☹️
			</h3>
		{:else}
			<div class="user" on:click={() => router.push('profile', {id})}>
				<div class="picture">
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

