<script>
	import { createEventDispatcher } from 'svelte'
	import { api } from '../api'
	import { app as appStore, userSession, posts } from '../stores/'

	let isValidSession = userSession.isValidSession

	const dispatch = createEventDispatcher()

	export let subject;

	const form = {
		emote: '',
		message: '',
	}

	async function reactOnPost() {
		if (!$isValidSession && form.emote === '' && form.message === '') {
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
</script>



<style lang="stylus">
	.create-reaction
		display flex
		align-items center
		flex-flow row wrap
		flex 1 1 100%
		.emote
			display flex
			height 2.5rem
			width 2.5rem
			margin 0 1rem 0 0
			font-size 1.5rem
			justify-content center
			align-content center
			align-items center
			line-height 1
			padding .5rem
			border-radius var(--app-border-radius)
			background none
			border solid 1px transparent
			cursor pointer
			&:hover
				border-color var(--app-border-01)
			&:active
				background-color var(--app-border-01)
				border-color transparent
			&.selected
				background-color var(--app-primary-01)
				border-color var(--app-primary)
		.actions
			margin 0 0 0 auto
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



<div class="create-reaction">
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
			<button class="secondary" on:click={() => dispatch('cancel')}>
				Cancel
			</button>
			<button class="primary" on:click={reactOnPost}>
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
			<button class="link" on:click={()=> appStore.modals.open('signIn')}>
				Sign in
			</button>
			to create a reaction
		</span>
	{/if}
</div>
