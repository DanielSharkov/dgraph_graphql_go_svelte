<script>
	import { isValidSession, sessionUser } from '../stores'
	import { api } from './../api'

	// Semicolon needed because otherwise javascript
	// would try to assign it as a function
	const user = {
		displayName: '',
		sessions: [],
		creation: new Date(0),
		email: '',
		posts: [],
		reactions: [],
	};

	(async function() {
		if (!$isValidSession) return

		const resp = await api.Query(
			`query (
				$id: Identifier!
			) {
				user(id: $id) {
					id
					displayName
					email
					creation
					sessions {
						key
						creation
					}
					posts {
						id
						creation
						title
					}
					publishedReactions {
						id
						creation
						emotion
						message
						reactions {
							id
							creation
							author {
								id
								displayName
							}
							emotion
							message
							subject {
								__typename
								... on Post {
									id
									title
								}
								... on Reaction {
									id
									emotion
								}
							}
						}
					}
				}
			}`,
			{id: $sessionUser.id},
		)

		user.displayName = resp.user.displayName
		user.sessions = resp.user.sessions
		user.creation = resp.user.creation
		user.email = resp.user.email
		user.posts = resp.user.posts
		user.reactions = resp.user.publishedReactions
	}())

	async function closeSession(sessionKey, index) {
		const resp = await api.Query(
			`mutation ($sessionKey: String!) {
				closeSession(key: $sessionKey)
			}`,
			{sessionKey},
		)

		if (resp.closeSession) {
			// When closing current session reset the session
			if (sessionKey === $sessionUser.key) sessionUser.reset()

			user.sessions.splice(index, 1)
			// Reactivate sessions list
			user.sessions = user.sessions
		}
	}

	async function closeAllSessions() {
		const resp = await api.Query(
			`mutation ($id: Identifier!) {
				closeAllSession(id: $id)
			}`,
			{id: $sessionUser.id},
		)

		if (resp.closeAllSession) sessionUser.reset()
	}
</script>



<style>
	#user-profile section {
		display: flex;
		margin-bottom: 4rem;
		flex-flow: row wrap;
		align-items: center;
	}
	#user-profile section h4 {
		flex: 1 0 auto;
	}
	#user-profile section .entries {
		flex: 1 1 100%;
	}
	#user-profile #personal-data .picture {
		display: flex;
		margin: 1rem auto 1rem auto;
		padding: 2rem;
		background-color: rgba(0,0,0,.025);
		border-radius: 100%;
		justify-content: center;
		align-items: center;
		flex: 0 0 auto;
	}
	#user-profile #personal-data .picture svg {
		height: 5rem;
		width: 5rem;
	}
	#user-profile #personal-data .display-name {
		text-align: center;
		flex: 1 1 100%;
	}
	#user-profile #personal-data .email {
		position: relative;
		top: -1.25rem;
		margin-bottom: 0;
		flex: 1 1 100%;
		text-align: center;
	}
	#user-profile #personal-data .id {
		position: relative;
		top: -1rem;
		margin-bottom: 0;
		opacity: .15;
		font-size: .5rem;
		letter-spacing: 1px;
		font-weight: 100;
		font-family: monospace;
		flex: 1 1 100%;
		text-align: center;
		text-transform: uppercase;
	}
	#user-profile #personal-data .id:hover {
		opacity: 1;
	}
	#user-profile #personal-data .creation {
		flex: 1 1 100%;
		text-align: center;
		font-size: .75rem;
	}

	#user-profile #sessions .close-session,
	#user-profile #sessions .close-all-sessions {
		display: flex;
		margin: .5rem;
		padding: .5rem;
		flex: 0 0 auto;
		align-items: center;
		align-self: flex-start;
		background: none;
		border: solid 1px transparent;
		border-radius: 4px;
		cursor: pointer;
	}
	#user-profile #sessions .close-all-sessions {
		margin: auto 0;
		font-size: .75rem;
		opacity: .25;
	}
	#user-profile #sessions .close-all-sessions:hover,
	#user-profile #sessions .close-all-sessions:active,
	#user-profile #sessions .close-all-sessions:focus {
		opacity: 1;
	}
	#user-profile #sessions .close-session svg {
		height: 14px;
		width: 14px;
	}
	#user-profile #sessions .close-session:hover,
	#user-profile #sessions .close-session:hover svg > *,
	#user-profile #sessions .close-all-sessions:hover {
		background-color: rgba(255,0,50,.05);
		border-color: #f05;
		color: #f05;
		fill: #f05;
		stroke: #f05;
	}
	#user-profile #sessions .close-session:active,
	#user-profile #sessions .close-session:active svg > *,
	#user-profile #sessions .close-all-sessions:active {
		background-color: #f05;
		border-color: #f05;
		color: #fff;
		fill: #fff;
		stroke: #fff;
	}
	#user-profile #sessions .entries {
		display: flex;
		flex-flow: row wrap;
		border: solid 1px rgba(0,0,0,.1);
		border-radius: 4px;
	}
	#user-profile #sessions .entries .session {
		display: flex;
		flex-flow: row nowrap;
		padding: 1rem;
		flex: 1 1 100%;
		border-bottom: solid 1px rgba(0,0,0,.1);
		align-items: center;
	}
	#user-profile #sessions .entries .session:last-child {
		border: none;
	}
	#user-profile #sessions .entries .session .device-icon {
		height: 3rem;
		width: 3rem;
		margin: 1rem 2rem 1rem 1rem;
		flex: 0 0 auto;
	}
	#user-profile #sessions .entries .session .content {
		position: relative;
		display: flex;
		flex-flow: row wrap;
		flex: 1 1 auto;
		align-content: center;
		align-items: center;
	}
	#user-profile #sessions .entries .session .creation {
		margin-top: .5rem;
		font-size: 10px;
		opacity: .5;
		flex: 1 1 100%;
	}
	#user-profile #sessions .entries .session .close-session {
		position: absolute;
		top: 0;
		right: 0;
		opacity: 0;
		transform: scale(.5);
	}
	#user-profile #sessions .entries .session:hover .close-session {
		opacity: 1;
		transform: scale(1);
	}
	#user-profile #sessions .entries .session.current {
		color: #03f;
	}
	#user-profile #sessions .entries .session.current .device-icon svg > * {
		fill: #03f;
	}
	#user-profile #sessions .entries .session .current-label {
		display: flex;
		align-content: center;
		align-items: center;
		font-size: .75rem;
	}
	#user-profile #sessions .entries .session .current-label:before {
		content: '';
		height: 1px;
		width: 1rem;
		margin: 0 .5rem;
		background-color: #03f;
	}

	#user-profile #posts .entries {
		display: flex;
		flex-flow: row wrap;
	}
	#user-profile #posts .post {
		display: flex;
		margin: 0 0 1rem 0;
		padding: 20px;
		background-color: #fff;
		box-shadow: none;
		border: solid 1px rgba(0,0,0,.1);
		border-radius: 4px;
		flex-flow: row wrap;
		flex: 0 1 100%;
		cursor: pointer;
		transition: all cubic-bezier(.22,.61,.36,1) 300ms;
	}
	#user-profile #posts .post:hover {
		transform: scale(1.05);
		box-shadow: 0 10px 20px rgba(0,0,0,.05);
	}
	#user-profile #posts .post > * {
		flex: 1 1 100%;
	}
	#user-profile #posts .post .title {
		margin-top: 0;
	}
	#user-profile #posts .post .creation {
		font-size: .75rem;
		opacity: .5;
	}

	@media screen and (min-width: 826px) {
		#user-profile #posts .post {
			flex: 0 1 calc(50% - 1rem);
		}
		/* Every first post */
		#user-profile #posts .post:nth-child(odd) {
			margin: 0 1rem 2rem 0;
		}
		/* Every secound post */
		#user-profile #posts .post:nth-child(even) {
			margin: 0 0 2rem 1rem;
		}
	}
</style>



{#if $isValidSession}
	<div id="user-profile">
		<section id="personal-data">
			<div class="picture">
				<svg xmlns="http://www.w3.org/2000/svg" viewbox=" 0 0 120 120" fill="none">
					<path fill="#000" fill-rule="evenodd" d="M60 57a23 23 0 1 0 0-46 23 23 0 0 0 0 46zm0-4a19 19 0 1 0 0-38 19 19 0 0 0 0 38z" clip-rule="evenodd"/>
					<path fill="#000" d="M40 73a21 21 0 0 0-21 21v13a2 2 0 1 1-4 0V94a25 25 0 0 1 25-25h40a25 25 0 0 1 25 25v13a2 2 0 1 1-4 0V94a21 21 0 0 0-21-21H40z"/>
				</svg>
			</div>
			<h1 class="display-name">{user.displayName}</h1>
			<span class="email">{user.email}</span>
			<span class="id">{$sessionUser.id}</span>

			<p class="creation">Joined on {
				new Date(user.creation).toLocaleDateString('en-US', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				})
			}</p>
		</section>

		<section id="sessions">
			<h4>Open sessions</h4>
			<button class="close-all-sessions" on:click={closeAllSessions}>
				Close all sessions
			</button>
			<div class="entries">
				{#each user.sessions as {key, creation}, index}
					<div
					class="session"
					class:current={key === $sessionUser.key}>
						<div class="device-icon">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
								<path fill="#000" d="M60 80a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
								<path fill="#000" fill-rule="evenodd" d="M14 11h92a8 8 0 0 1 8 8v62a8 8 0 0 1-8 8H63.6l5.3 17H83a2 2 0 1 1 0 4H37a2 2 0 1 1 0-4h14l5.4-17H14a8 8 0 0 1-8-8V19a8 8 0 0 1 8-8zm44 85.5h4l2.7 9.5h-9.4l2.7-9.5zM14 15a4 4 0 0 0-4 4v62a4 4 0 0 0 4 4h92a4 4 0 0 0 4-4V19a4 4 0 0 0-4-4H14z" clip-rule="evenodd"/>
							</svg>
						</div>
						<div class="content">
							<span class="device-name">Here device name</span>
							{#if key === $sessionUser.key}
								<span class="current-label">This session</span>
							{/if}
							<span class="creation">{
								new Date(creation).toLocaleDateString('en-US', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									minute: '2-digit',
									hour: '2-digit',
									hour12: false,
								})
							}</span>
							<button
							class="close-session"
							on:click={() => closeSession(key, index)}>
								<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 320 512">
									<path fill="#000" d="M194 256l103-103 21-21c3-3 3-8 0-11l-23-23c-3-3-8-3-11 0L160 222 36 98c-3-3-8-3-11 0L2 121c-3 3-3 8 0 11l124 124L2 380c-3 3-3 8 0 11l23 23c3 3 8 3 11 0l124-124 103 103 21 21c3 3 8 3 11 0l23-23c3-3 3-8 0-11L194 256z"/>
								</svg>
							</button>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section id="posts">
			<h4>Published posts</h4>
			<div class="entries">
				{#each user.posts as {id, creation, title}}
					<div class="post" post-id={id}>
						<h3 class="title">{title}</h3>
						<span class="creation">{
							new Date(creation).toLocaleDateString('en-US', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})
						}</span>
					</div>
				{/each}
			</div>
		</section>

		<section id="reactions">
			<h4>Published reactions</h4>
			<div class="entries">
				{#each user.reactions as {
					id,
					creation,
					author,
					emotion,
					message,
				}}
					<li class="reaction">
						<span>{id}</span>
						<span>{creation}</span>
						<span>{emotion}</span>
						<span>{message}</span>
					</li>
				{/each}
			</div>
		</section>
	</div>
{:else}
	<h3 class="view-title">Not signed in</h3>
{/if}
