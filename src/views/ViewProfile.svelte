<script>
	import {
		isValidSession,
		sessionUser,
		UserSession,
		emotionsDisplayName,
		appTheme,
	} from '../stores'
	import { api } from './../api'
	import router from '../router'

	let isEditing = false

	export let params;

	const user = {
		displayName: '',
		sessions: [],
		creation: new Date(0),
		email: '',
		posts: [],
		reactions: [],
	}

	let userNotExisting = false

	$:isSignedInUser = $sessionUser.id == params.id
	$:passChanged = profileEdit.newPass !== ''
	$:isValidPass = profileEdit.newPass.length > 5
	$:emailChanged = profileEdit.newEmail !== $sessionUser.email

	const profileEdit = {
		newEmail: $sessionUser.email,
		newPass: '',
	}

	async function fetchUser() {
		let query = `
			query ($id: Identifier!) {
				user(id: $id) {
					id
					displayName
					creation
					posts { id title creation }
					publishedReactions {
						id
						emotion
						message
						creation
						subject {
							__typename
							... on Post { id title }
							... on Reaction { id emotion message }
						}
					}
				}
			}`
		if ($isValidSession && $sessionUser.id == params.id) {
			query = `
				query ($id: Identifier!) {
					user(id: $id) {
						id
						email
						displayName
						creation
						sessions { key creation }
						posts { id title creation }
						publishedReactions {
							id
							emotion
							message
							creation
							subject {
							__typename
								... on Post { id title }
								... on Reaction { id emotion message }
							}
						}
					}
				}`
		}
		const resp = await api.Query(query, {id: params.id})

		if (resp.user === null) {
			userNotExisting = true
		}
		else {
			userNotExisting = false
		}

		profileEdit.displayName = user.displayName = resp.user.displayName
		user.id = resp.user.id
		user.creation = resp.user.creation

		for (const post of resp.user.posts) {
			user.posts.unshift(post)
		}
		user.posts = user.posts

		for (const reaction of resp.user.publishedReactions) {
			user.reactions.unshift(reaction)
		}
		user.reactions = user.reactions

		if (params.id === $sessionUser.id) {
			profileEdit.newEmail = user.email = resp.user.email
			user.sessions = resp.user.sessions
		}
	}
	fetchUser()

	async function closeSession(key, index) {
		const resp = await api.Query(
			`mutation ($key: String!) { closeSession(key: $key) }`,
			{key},
		)

		if (resp.closeSession) {
			if (index !== undefined) {
				user.sessions.splice(index, 1)
				// Reactivate sessions list
				user.sessions = user.sessions
			}
			// When closing current session reset the session
			if (key === $sessionUser.key) {
				sessionUser.reset()
			}
		}
	}

	async function closeAllSessions() {
		const resp = await api.Query(
			`mutation ($id: Identifier!) { closeAllSessions(user: $id) }`,
			{id: $sessionUser.id},
		)

		if (resp.closeAllSessions) {
			sessionUser.reset()
		}
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
			newEmail: null,
			newPass: null,
		}

		if (emailChanged) {
			vars['newEmail'] = profileEdit.newEmail
		}
		if (passChanged) {
			vars['newPass'] = profileEdit.newPass
		}

		const resp = await api.Query(
			`mutation (
				$user: Identifier!,
				$editor: Identifier!,
				$newEmail: String,
				$newPass: String
			) {
				editUser(
					user: $user,
					editor: $editor,
					newEmail: $newEmail,
					newPassword: $newPass
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

	function viewPost(id) {
		router.push('post', {id})
	}
</script>

<svelte:head>
	<title>{user.displayName}</title>
</svelte:head>
<svelte:window on:userSignIn={fetchUser}/>



<style lang="stylus">
	section
		display flex
		margin-bottom 4rem
		flex-flow row wrap
		align-items center
		h4
			flex 1 0 auto
		.placeholder
			opacity .25
		.entries
			flex 1 1 100%

	#user-profile
		&.is-editing-profile
			section:not(#personal-data)
				pointer-events none
				opacity .25
		&:not(.is-editing-profile) #personal-data input
			&:not(:hover):not(:active):not(:focus)
				border-color transparent

	#personal-data
		position relative
		.picture
			display flex
			margin 1rem auto 1rem auto
			padding 2rem
			background-color var(--app-bg-lightest)
			border-radius 100%
			justify-content center
			align-items center
			flex 0 0 auto
		.picture svg
			height 5rem
			width 5rem
		.display-name
			margin-bottom 0
		.display-name, .email, .new-pass
			flex 1 1 100%
			text-align center
		input
			margin-bottom .5rem
			text-align center
		.new-pass.not-set
			input:not(:active):not(:focus)::placeholder
				color var(--app-primary)
		.creation
			margin-top 1rem
			flex 1 1 100%
			text-align center
			font-size .75rem
			opacity .5
		.actions
			position absolute
			top 0
			right 0
			display flex
			button
				position relative
				display flex
				margin 0
				padding .5rem
				border solid 1px transparent
				border-radius var(--app-border-radius)
				align-items center
				flex 0 0 auto
				justify-content center
				&[disabled]
					opacity .25
					pointer-events none
				&:hover, &:active
					svg > *
						stroke var(--app-primary)
				&:not(:first-child)
					margin-left .5rem



	#sessions
		.close-session, .close-all-sessions
			display flex
			margin .5rem
			padding .5rem
			flex 0 0 auto
			align-items center
			align-self flex-start
			border-radius var(--app-border-radius)
		.close-all-sessions
			margin auto 0
			&:not(:hover):not(:active):not(:focus)
				color var(--app-fg-lightest)
				border-color transparent
		.entries
			border solid 1px var(--app-border-01)
			border-radius var(--app-border-radius)
			.session
				display flex
				flex-flow row nowrap
				padding 1rem
				flex 1 1 100%
				border-bottom solid 1px var(--app-border-01)
				align-items center
				&:hover .close-session
					opacity 1
					transform scale(1)
				&:last-child
					border none
				.device-icon
					margin 1rem 2rem 1rem 1rem
					flex 0 0 auto
				.content
					position relative
					display flex
					flex-flow row wrap
					flex 1 1 auto
					align-content center
					align-items center
				.creation
					margin-top .5rem
					font-size 10px
					opacity .5
					flex 1 1 100%
				.close-session
					position absolute
					top 0
					right 0
					opacity 0
					transform scale(.5)
				&.current
					color var(--app-primary)
					.creation
						opacity 1
					.device-icon svg > *
						fill var(--app-primary)
				.current-label
					display flex
					align-content center
					align-items center
					font-size .75rem
					&:before
						content ''
						height 1px
						width 1rem
						margin 0 .5rem
						background-color var(--app-primary)



	#posts, #reactions
		.entries
			display grid
			grid-template-columns 1fr
			grid-gap 2rem
			.entry
				position relative
				padding 1rem 1rem 2rem 1rem
				background-color var(--app-bg)
				box-shadow none
				border solid 1px var(--app-border-01)
				border-radius var(--app-border-radius)
				transition all cubic-bezier(.22,.61,.36,1) 300ms
				&.hoverable
					cursor pointer
					&:hover
						transform scale(1.05)
						box-shadow 0 10px 20px rgba(0,0,0,.05)
				.content
					margin-top 0
					margin-bottom .5rem
				.creation
					position absolute
					bottom 1rem
					display block
					font-size .75rem
					opacity .5

	#reactions .entries .entry
		.react, .subject
			display block
			margin-bottom 1rem
		.react .emotion
			margin-right .25rem



	@media screen and (min-width 826px)
		#posts, #reactions
			.entries
				grid-template-columns 1fr 1fr
</style>



{#if userNotExisting}
	<h3 class="view-title">User not existing</h3>
{:else}
	<div id="user-profile" class:is-editing-profile={isEditing}>
		<section id="personal-data">
			<div class="picture">
				<svg class="icon stroked" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".25rem" d="M103 107V96c0-14-11-25-25-25H42c-14 0-25 11-25 25v11"/>
					<circle cx="60" cy="34" r="21" stroke-width=".25rem"/>
				</svg>
			</div>
			<h1 class="display-name">
				{profileEdit.displayName}
			</h1>
			{#if isSignedInUser}
				<span class="email">
					<input
						placeholder="email"
						type="email"
						bind:value={profileEdit.newEmail}
						on:click={() => isEditing = true}
						on:focus={() => isEditing = true}
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
			{/if}

			<p class="creation">Joined on {
				new Date(user.creation).toLocaleDateString('en-US', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				})
			}</p>
			{#if isSignedInUser}
				{#if isEditing}
					<div class="actions">
						<button class="cancel-edit" on:click={cancelEdit}>
							<svg class="icon stroked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" stroke="#000">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".4rem" d="M35 99l64-64m0 64L35 35"/>
							</svg>
						</button>
						<button
						class="save-edit"
						on:click={saveEdit}
						disabled={!emailChanged && !isValidPass}>
							<svg class="icon stroked" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 120 120" fill="none" stroke="#000">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".4rem" d="M18 69l24 23 64-63"/>
							</svg>
						</button>
					</div>
				{:else}
					<div class="actions">
						<button class="signout" on:click={() => closeSession($sessionUser.key)}>
							<svg class="icon stroked" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 120 120" fill="none" stroke="#000">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".4rem" d="M86 91v19H22V10h64v19M48 61h50m0 0L79 42m19 19L79 79"/>
							</svg>
						</button>
						<button class="edit-acc" on:click={() => isEditing = !isEditing}>
							<svg class="icon stroked" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 120 120" fill="none" stroke="#000">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".4rem" d="M84 24L16 92l-6 18 18-6 68-68M84 24l12 12M84 24l10-10 12 12-10 10"/>
							</svg>
						</button>
						<button on:click={appTheme.toggle}>
							{#if $appTheme === 'black'}
								<svg class="icon stroked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
									<circle cx="60" cy="60" r="28" stroke-width=".4rem"/>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".4rem" d="M29 30l-8-8M18 60H7M21 99l8-8M60 113v-11M99 99l-8-8M113 60h-11M91 29l8-8M60 18V7"/>
								</svg>
							{:else}
								<svg class="icon stroked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
									<path stroke-width=".4rem" d="M62 113A53 53 0 0 1 56.07 7.33c.33-.04.6.1.8.44.2.37.2.83-.04 1.23-3.4 5.4-8.4 14.6-10.57 25.02-2.18 10.45-1.54 22.32 6.6 32.71C60.82 76.9 71.6 81.57 81.74 83.5c10.13 1.93 19.76 1.14 25.67.25.46-.07.9.13 1.16.46.25.3.27.62.11.9A52.99 52.99 0 0 1 62 113z"/>
								</svg>
							{/if}
						</button>
					</div>
				{/if}
			{/if}
		</section>

		{#if isSignedInUser}
			<section id="sessions">
				<h4>Open sessions</h4>
				<button class="danger small close-all-sessions" on:click={closeAllSessions}>
					Close all sessions
				</button>
				<div class="entries">
					{#each user.sessions as session, index}
						<div
						class="session"
						class:current={session.key === $sessionUser.key}>
							<div class="device-icon">
								<svg class="icon x-large filled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
									<path d="M60 80a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
									<path fill-rule="evenodd" d="M14 11h92a8 8 0 0 1 8 8v62a8 8 0 0 1-8 8H63.6l5.3 17H83a2 2 0 1 1 0 4H37a2 2 0 1 1 0-4h14l5.4-17H14a8 8 0 0 1-8-8V19a8 8 0 0 1 8-8zm44 85.5h4l2.7 9.5h-9.4l2.7-9.5zM14 15a4 4 0 0 0-4 4v62a4 4 0 0 0 4 4h92a4 4 0 0 0 4-4V19a4 4 0 0 0-4-4H14z" clip-rule="evenodd"/>
								</svg>
							</div>
							<div class="content">
								<span class="device-name">Here device name</span>
								{#if session.key === $sessionUser.key}
									<span class="current-label">This session</span>
								{/if}
								<span class="creation">{
									new Date(session.creation).toLocaleDateString('en-US', {
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
								class="close-session danger small"
								on:click={() => closeSession(session.key, index)}>
									<svg class="icon filled small" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
										<path d="M194 256l103-103 21-21c3-3 3-8 0-11l-23-23c-3-3-8-3-11 0L160 222 36 98c-3-3-8-3-11 0L2 121c-3 3-3 8 0 11l124 124L2 380c-3 3-3 8 0 11l23 23c3 3 8 3 11 0l124-124 103 103 21 21c3 3 8 3 11 0l23-23c3-3 3-8 0-11L194 256z"/>
									</svg>
								</button>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<section id="posts">
			<h4>Published posts</h4>
			<div class="entries">
				{#if user.posts.length < 1}
					<span class="placeholder">
						No posts puiblished
					</span>
				{:else}
					{#each user.posts as {id, creation, title}}
						<div
						class="entry hoverable"
						post-id={id}
						on:click={() => viewPost(id)}>
							<h3 class="content">
								{title}
							</h3>
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
						subject,
					}}
						<div
						class="entry"
						class:hoverable={subject.__typename === 'Post'}
						reaction-id={id}
						on:click={() => {
							if (subject.__typename === 'Post') {
								router.push('post', {id: subject.id})
							}
						}}>
							<div class="react">
								<span class="emotion">
									{$emotionsDisplayName[emotion]}
								</span>
								<span class="content">
									{message}
								</span>
							</div>
							<span
							class="subject"
							subject-type={subject.__typename}
							subject-id={subject.id}>
								to
								{#if subject.__typename === 'Post'}
									<span>"{subject.title}"</span>
								{:else if subject.__typename === 'Reaction'}
									<span class="emotion">
										{$emotionsDisplayName[subject.emotion]}
									</span>
									<span class="message">
										{subject.message}
									</span>
								{/if}
							</span>
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
	</div>
{/if}
