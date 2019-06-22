<script>
	import {
		isValidSession,
		sessionUser,
		emotions,
		emotionsDisplayName,
	} from '../stores'
	import { createEventDispatcher } from 'svelte'
	import { api } from '../api'

	const dispatch = createEventDispatcher()

	export let subject;

	const form = {
		emote: '',
		message: '',
	}

	async function reactOnPost() {
		if (
			!$isValidSession &
			form.emote === '' &&
			form.message === ''
		) {
			return
		}

		const resp = await api.Query(
			`mutation (
				$authorID: Identifier!
				$subjectID: Identifier!
				$emotion: Emotion!
				$message: String!
			) {
				createReaction(
					author: $authorID
					subject: $subjectID
					emotion: $emotion
					message: $message
				) {
					id
					emotion
					message
					creation
				}
			}`,
			{
				subjectID: subject,
				authorID: $sessionUser.id,
				emotion: form.emote,
				message: form.message,
			},
		)

		resp.createReaction.author = {
			id: $sessionUser.id,
			displayName: $sessionUser.displayName,
		}

		form.emote = ''
		form.message = ''

		dispatch('created', resp.createReaction)
	}
</script>



<style>
	.create-reaction {
		display: flex;
		align-items: center;
		flex-flow: row wrap;
		flex: 1 1 100%;
	}
	.create-reaction .emote {
		display: flex;
		height: 2.5rem;
		width: 2.5rem;
		margin: 0 1rem 0 0;
		font-size: 1.5rem;
		justify-content: center;
		align-content: center;
		align-items: center;
		line-height: 1;
		padding: .5rem;
		border-radius: var(--app-border-radius);
		background: none;
		border: solid 1px transparent;
		cursor: pointer;
	}
	.create-reaction .emote:hover {
		border-color: var(--app-border-01);
	}
	.create-reaction .emote:active {
		background-color: var(--app-border-01);
		border-color: transparent;
	}
	.create-reaction .emote.selected {
		background-color: var(--app-primary-01);
		border-color: var(--app-primary);
	}
	.create-reaction .actions {
		margin: 0 0 0 auto;
	}
	.create-reaction .actions > * {
		display: inline-block;
	}
	.create-reaction .message {
		margin: 1rem auto 0 auto;
		padding: .5rem;
		border: solid 1px transparent;
		flex: 1 1 100%;
		border-radius: var(--app-border-radius);
		border-color: rgba(0,0,0,.1);
		box-shadow: none;
		resize: vertical;
		min-height: 2.25rem;
	}
	.create-reaction .message:hover {
		border-color: var(--app-fg);
	}
	.create-reaction .message:active {
		border-color: var(--app-primary);
		box-shadow: 0 0 0 .25rem var(--app-primary-01);
	}
	.create-reaction .message:focus {
		border-color: var(--app-primary);
		box-shadow: 0 0 0 .25rem var(--app-primary-01);
	}
</style>



<div class="create-reaction">
	{#each $emotions as emote}
		<button
		class="emote"
		class:selected={{emote}.emote === form.emote}
		on:click={() => form.emote = {emote}.emote}>
			{$emotionsDisplayName[emote]}
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
</div>
