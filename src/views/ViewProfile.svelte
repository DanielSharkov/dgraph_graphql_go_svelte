<script>
	import { isValidSession, sessionUser, UserSession } from '../stores'
	import { api } from './../api'

	let isEditing = false

	const user = {
		displayName: '',
		sessions: [],
		creation: new Date(0),
		email: '',
		posts: [],
		reactions: [],
	}

	$:passChanged = profileEdit.newPass !== ''
	$:isValidPass = profileEdit.newPass.length > 5
	$:emailChanged = profileEdit.newEmail !== $sessionUser.email

	// Semicolon needed because otherwise javascript
	// would try to assign it as a function
	const profileEdit = {
		newEmail: $sessionUser.email,
		newPass: '',
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

		profileEdit.displayName = user.displayName = resp.user.displayName
		profileEdit.newEmail = user.email = resp.user.email
		user.id = resp.user.id
		user.sessions = resp.user.sessions
		user.creation = resp.user.creation
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

			if (index !== undefined) {
				user.sessions.splice(index, 1)
				// Reactivate sessions list
				user.sessions = user.sessions
			}
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

	function cancelEdit() {
		profileEdit.newPass = ''
		profileEdit.newEmail = $sessionUser.email
		isEditing = false
	}

	async function saveEdit() {
		if (!emailChanged && !isValidPass) return

		let vars = {
			user: $sessionUser.id,
			editor: $sessionUser.id,
		}

		if (emailChanged) vars['newEmail'] = profileEdit.newEmail
		if (passChanged) vars['newPass'] = profileEdit.newPass

		const resp = await api.Query(
			`mutation (
				$user: Identifier!
				$editor: Identifier!
				${emailChanged ? '$newEmail: String':''}
				${passChanged ? '$newPass: String':''}
			) {
				editUser(
					user: $user
					editor: $editor
					${emailChanged ? 'newEmail: $newEmail':''}
					${passChanged ? 'newPassword: $newPass':''}
				) {
					displayName
					email
				}
			}`,
			vars,
		)

		profileEdit.newPass = ''
		profileEdit.newEmail = resp.editUser.email
		let oldData = $sessionUser
		sessionUser.set(new UserSession(
			oldData.key,
			oldData.id,
			resp.editUser.email,
			oldData.displayName,
			oldData.creation,
		))
		isEditing = false
	}
</script>

<svelte:head>
	<title>{user.displayName}</title>
</svelte:head>



<style>
	#user-profile section {
		display: flex;
		margin-bottom: 4rem;
		flex-flow: row wrap;
		align-items: center;
	}
	#user-profile.is-editing-profile section:not(#personal-data) {
		pointer-events: none;
		opacity: .25;
	}
	#user-profile section h4 {
		flex: 1 0 auto;
	}
	#user-profile section .placeholder {
		opacity: .25;
	}
	#user-profile section .entries {
		flex: 1 1 100%;
	}
	#user-profile #personal-data {
		position: relative;
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
		margin-bottom: 0;
	}
	#user-profile #personal-data .display-name,
	#user-profile #personal-data .email,
	#user-profile #personal-data .new-pass {
		flex: 1 1 100%;
		text-align: center;
	}
	#user-profile #personal-data input {
		margin-bottom: .5rem;
		padding: .5rem;
		font-size: inherit;
		font-weight: inherit;
		text-align: center;
		border-radius: 4px;
		border: solid 1px transparent;
	}
	#user-profile #personal-data input:hover,
	#user-profile.is-editing-profile #personal-data input {
		border-color: rgba(0,0,0,.1);
	}
	#user-profile.is-editing-profile #personal-data input:hover {
		border-color: #000;
	}
	#user-profile.is-editing-profile #personal-data input:active,
	#user-profile.is-editing-profile #personal-data input:focus {
		border-color: #03f;
		box-shadow: 0 0 0 .25rem rgba(0,40,255,.1);
	}
	#user-profile #personal-data .new-pass.not-set input:not(active):not(:focus)::placeholder {
		color: #03f;
	}
	#user-profile #personal-data .new-pass.not-set:hover:not(active):not(:focus) {
		text-decoration: underline;
	}
	#user-profile #personal-data .new-pass.not-set input:not(:hover):not(:active):not(:focus) {
		border-color: transparent;
	}
	#user-profile #personal-data .creation {
		margin-top: 1rem;
		flex: 1 1 100%;
		text-align: center;
		font-size: .75rem;
		opacity: .5;
	}
	#user-profile #personal-data .actions {
		position: absolute;
		top: 0;
		right: 0;
		display: flex;
	}
	#user-profile #personal-data .actions button {
		position: relative;
		display: flex;
		margin: 0;
		padding: .5rem;
		border: solid 1px transparent;
		border-radius: 4px;
		align-items: center;
		flex: 0 0 auto;
		justify-content: center;
	}
	#user-profile #personal-data .actions button[disabled] {
		opacity: .25;
		pointer-events: none;
	}
	#user-profile #personal-data .actions button:hover svg > *,
	#user-profile #personal-data .actions button:active svg > * {
		stroke: #03f;
	}
	#user-profile #personal-data .actions button:not(:first-child) {
		margin-left: .5rem;
	}

	#user-profile #sessions .close-session,
	#user-profile #sessions .close-all-sessions {
		display: flex;
		margin: .5rem;
		padding: .5rem;
		flex: 0 0 auto;
		align-items: center;
		align-self: flex-start;
		border: solid 1px transparent;
		border-radius: 4px;
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



<div id="user-profile" class:is-editing-profile={isEditing}>
	<section id="personal-data">
		<div class="picture">
			<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".25rem" d="M103 107V96c0-14-11-25-25-25H42c-14 0-25 11-25 25v11"/>
				<circle cx="60" cy="34" r="21" stroke-width=".25rem"/>
			</svg>
		</div>
		<h1 class="display-name">
			{profileEdit.displayName}
		</h1>
		<span class="email">
			<input
				placeholder="email"
				type="email"
				bind:value={profileEdit.newEmail}
				readonly={!isEditing}
				on:click={() => isEditing = true}
			/>
		</span>
		<span
		class="new-pass"
		class:hidden={!isEditing}
		class:not-set={!passChanged}>
			<input
				placeholder="New password"
				type="password"
				bind:value={profileEdit.newPass}
			/>
		</span>

		<p class="creation">Joined on {
			new Date(user.creation).toLocaleDateString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})
		}</p>
		{#if isEditing}
			<div class="actions">
				<button class="cancel-edit" on:click={cancelEdit}>
					<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" stroke="#000">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".4rem" d="M35 99l64-64m0 64L35 35"/>
					</svg>
				</button>
				<button
				class="save-edit"
				on:click={saveEdit}
				disabled={!emailChanged && !isValidPass}>
					<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 120 120" fill="none" stroke="#000">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".4rem" d="M18 69l24 23 64-63"/>
					</svg>
				</button>
			</div>
		{:else}
			<div class="actions">
				<button class="signout" on:click={() => closeSession($sessionUser.key)}>
					<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 120 120" fill="none" stroke="#000">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".4rem" d="M86 91v19H22V10h64v19M48 61h50m0 0L79 42m19 19L79 79"/>
					</svg>
				</button>
				<button class="edit-acc" on:click={() => isEditing = !isEditing}>
					<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 120 120" fill="none" stroke="#000">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".4rem" d="M84 24L16 92l-6 18 18-6 68-68M84 24l12 12M84 24l10-10 12 12-10 10"/>
					</svg>
				</button>
			</div>
		{/if}
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
							<svg class="icon small" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
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
			{#if user.posts.length < 1}
				<span class="placeholder">
					No posts puiblished
				</span>
			{:else}
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
			{/if}
		</div>
	</section>

	<section id="reactions">
		<h4>Published reactions</h4>
		<div class="entries">
			{#if user.reactions.length < 1}
				<span class="placeholder">
					No reactions published
				</span>
			{:else}
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
			{/if}
		</div>
	</section>
</div>
