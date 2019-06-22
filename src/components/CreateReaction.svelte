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
		border-radius: 4px;
		background: none;
		border: solid 1px transparent;
		cursor: pointer;
	}
	.create-reaction .emote:hover {
		border-color: rgba(0,0,0,.1);
	}
	.create-reaction .emote:active {
		background-color: rgba(0,0,0,.1);
		border-color: transparent;
	}
	.create-reaction .emote.selected {
		background-color: rgba(0,40,255,.05);
		border-color: #03f;
	}
	.create-reaction .actions {
		margin: 0 0 0 auto;
	}
	.create-reaction button {
		padding: .5rem 1rem;
		background: none;
		border-radius: 4px;
		cursor: pointer;
		outline: none;
		border: solid 1px transparent;
	}
	.create-reaction button.secondary {
		color: rgba(0,0,0,.5);
	}
	.create-reaction button.secondary:hover {
		color: #000;
		background-color: rgba(0,0,0,.05);
		border-color: #000;
	}
	.create-reaction button.secondary:active {
		color: #FFF;
		background-color: #000;
		border-color: #000;
	}
	.create-reaction button.primary {
		border-color: rgba(0,0,0,.1);
		color: #03f;
	}
	.create-reaction button.primary:hover {
		border-color: #03f;
		background-color: rgba(0,40,255,.05);
	}
	.create-reaction button.primary:active {
		background-color: #03f;
		color: #fff;
	}
	.create-reaction .message {
		margin: 1rem auto 0 auto;
		padding: .5rem;
		border: solid 1px transparent;
		flex: 1 1 100%;
		border-radius: 4px;
		border-color: rgba(0,0,0,.1);
		box-shadow: none;
		resize: vertical;
		min-height: 2.25rem;
	}
	.create-reaction .message:hover {
		border-color: #000;
	}
	.create-reaction .message:active {
		border-color: #03f;
		box-shadow: 0 0 0 .25rem rgba(0,40,255,.1);
	}
	.create-reaction .message:focus {
		border-color: #03f;
		box-shadow: 0 0 0 .25rem rgba(0,40,255,.1);
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
