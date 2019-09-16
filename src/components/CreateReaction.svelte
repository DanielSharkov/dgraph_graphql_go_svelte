<script>
	import { api } from '../api'
	import { app as appStore, userSession, posts } from '../stores/'

	let isValidSession = userSession.isValidSession

	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	export let subject;

	const form = { emote: '', message: '' }

	async function reactOnPost() {
		if (!$isValidSession && !form.emote && !form.message) {
			return
		}

		const resp = await api.Query(
			`mutation (
				$authorId: Identifier!,
				$subjectId: Identifier!,
				$emotion: Emotion!,
				$message: String!
			) {
				createReaction(
					author: $authorId,
					subject: $subjectId,
					emotion: $emotion,
					message: $message
				) {
					id
					emotion
					message
					creation
				}
			}`,
			{
				authorId: $userSession.id,
				subjectId: subject,
				emotion: form.emote,
				message: form.message,
			},
		)

		resp.createReaction.author = {
			id: $userSession.id,
			displayName: $userSession.displayName,
		}

		form.emote = ''
		form.message = ''

		dispatch('created', resp.createReaction)
	}
	
	function openSignInModal() {
		appStore.modals.open('signIn')
	}

	function cancelCreation() {
		dispatch('cancel')
	}

	$:isInvalidForm = !form.emote || !form.message
</script>



<style lang="stylus">
	.create-reaction
		align-items center
		flex 1 1 100%
		.emote
			margin-right 1rem
			font-size 1.5rem
			line-height 1
			padding .5rem
			&:hover
				transform scale(1.5)
			&:active
				transform scale(.85)
				background-color var(--app-border-01)
			&.selected
				transform scale(1)
				background-color var(--app-primary-01)
				border-color var(--app-primary)
				cursor default
		.actions
			margin auto 0 auto auto
			> *
				display inline-block
		.message
			margin 1rem auto 0 auto
			flex 1 1 100%
			resize vertical
			min-height 2.25rem
		.not-signed-in
			margin auto
</style>



<div class="create-reaction flex-row full-width">
	{#if $isValidSession}
		{#each $posts.emotions as emote}
			<button
			class="emote"
			class:selected={{emote}.emote === form.emote}
			on:click={()=> form.emote = {emote}.emote}>
				{$posts.emotionsDisplayNames[emote]}
			</button>
		{/each}
		<div class="actions">
			<button class="secondary" on:click={cancelCreation}>
				Cancel
			</button>
			<button class="primary" on:click={reactOnPost} disabled={isInvalidForm}>
				React!
			</button>
		</div>
		<textarea
			class="message"
			placeholder="Write your react message..."
			rows="3"
			bind:value={form.message}
		></textarea>
	{:else}
		<span class="not-signed-in">
			<button class="link" on:click={openSignInModal}>
				Sign in
			</button>
			to create a reaction
		</span>
	{/if}
</div>
