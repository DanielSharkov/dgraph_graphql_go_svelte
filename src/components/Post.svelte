<script>
	import {
		sessionUser,
		isValidSession,
		emotions,
		emotionsDisplayName,
	} from '../stores'
	import { api } from '../api'

	export let id;
	export let creation;
	export let title;
	export let contents;
	export let author = {
		id: '',
		displayName: '',
	}

	const formReactData = {
		emote: '',
		message: '',
	}

	async function reactOnPost() {
		if (
			!$isValidSession &
			formReactData.emote === '' &&
			formReactData.message === ''
		) return

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
				}
			}`,
			{
				subjectID: id,
				authorID: $sessionUser.key,
				emotion: formReactData.emote,
				message: formReactData.message,
			},
		)
		console.log(resp.createReaction)
	}
</script>



<style>
	.post {
		display: flex;
		margin: 0 auto 4rem auto;
		padding: 2rem;
		border: solid 1px rgba(0,0,0,.1);
		border-radius: 4px;
		flex-flow: row wrap;
	}
	.post .header {
		display: flex;
		margin-bottom: 3rem;
		flex: 1 1 100%;
		justify-content: flex-start;
		align-content: center;
		align-items: center;
	}
	.post .author {
		display: flex;
		flex: 0 0 auto;
		justify-content: flex-start;
		align-content: center;
		align-items: center;
		cursor: pointer;
	}
	.post .author:hover .picture {
		border-color: #03f;
	}
	.post .author:hover .picture svg > * {
		fill: #03f;
		stroke: #03f;
	}
	.post .author:hover .display-name {
		color: #03f;
	}
	.post .author .picture {
		display: flex;
		margin-right: 1rem;
		flex: 0 0 auto;
		justify-content: center;
		align-items: center;
	}
	.post .author .picture svg {
		height: 1.5rem;
		width: 1.5rem;
		stroke-width: 4;
		stroke: #000;
	}
	.post .author .display-name {
		flex: 1 1 auto;
	}
	.post .creation {
		margin-left: auto;
		flex: 0 0 auto;
		font-size: .75rem;
		justify-self: flex-end;
		align-self: flex-start;
		opacity: .25;
	}
	.post .title {
		margin: 0 0 .5rem 0;
		padding: .25rem;
		flex: 1 0 auto;
	}
	.post .contents {
		font-family:
			'Lucida Sans',
			'Lucida Sans Regular',
			'Lucida Grande',
			'Roboto',
			'Arial';
		margin: 0;
		padding: .25rem;
		flex: 1 1 100%;
	}
	.post .reactions {
		display: flex;
		margin-top: 3rem;
		border-top: solid 1px rgba(0,0,0,.1);
		flex: 1 1 100%;
		flex-flow: row wrap;
	}
	.post .reactions .react {
		display: flex;
		margin: 1rem 0;
		align-items: center;
		flex-flow: row nowrap;
		flex: 1 1 100%;
	}
	.post .reactions .react .emote {
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
	.post .reactions .react .emote:hover {
		border-color: rgba(0,0,0,.1);
	}
	.post .reactions .react .emote:active {
		background-color: rgba(0,0,0,.1);
		border-color: transparent;
	}
	.post .reactions .react .emote.selected {
		background-color: rgba(0,40,255,.05);
		border-color: #03f;
	}
	.post .reactions .create-react {
		margin: 0 0 0 auto;
		padding: .5rem 1rem;
		background: none;
		border: solid 1px rgba(0,0,0,.1);
		border-radius: 4px;
		cursor: pointer;
		color: #03f;
		outline: none;
	}
	.post .reactions .create-react:hover {
		background-color: rgba(0,40,255,.1);
		border-color: #03f;
	}
	.post .reactions .create-react:active {
		background-color: #03f;
		border-color: #03f;
		color: #fff;
	}
	.post .reactions .message {
		padding: .5rem;
		border: solid 1px transparent;
		flex: 1 1 100%;
		border-radius: 4px;
		border-color: rgba(0,0,0,.1);
		box-shadow: none;
	}
	.post .reactions .message:hover {
		border-color: #000;
	}
	.post .reactions .message:active {
		border-color: #03f;
		box-shadow: 0 0 0 .25rem rgba(0,40,255,.1);
	}
	.post .reactions .message:focus {
		border-color: #03f;
		box-shadow: 0 0 0 .25rem rgba(0,40,255,.1);
	}
</style>



<div class="post" post-id={id}>
	<div class="header">
		<div class="author">
			<div class="picture">
				<svg xmlns="http://www.w3.org/2000/svg" viewbox=" 0 0 120 120" fill="none">
					<path fill="#000" fill-rule="evenodd" d="M60 57a23 23 0 1 0 0-46 23 23 0 0 0 0 46zm0-4a19 19 0 1 0 0-38 19 19 0 0 0 0 38z" clip-rule="evenodd"/>
					<path fill="#000" d="M40 73a21 21 0 0 0-21 21v13a2 2 0 1 1-4 0V94a25 25 0 0 1 25-25h40a25 25 0 0 1 25 25v13a2 2 0 1 1-4 0V94a21 21 0 0 0-21-21H40z"/>
				</svg>
			</div>
			<span class="display-name">
				{author.displayName}
			</span>
		</div>
		<span class="creation">{
			new Date(creation).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
			})
		}</span>
	</div>
	<h3 class="title">{title}</h3>
	<pre class="contents">{contents}</pre>
	<div class="reactions">
		<div class="existing"></div>
		<div class="react">
			{#each $emotions as emote}
				<button
				class="emote"
				class:selected={{emote}.emote === formReactData.emote}
				on:click={() => formReactData.emote = {emote}.emote}>
					{$emotionsDisplayName[emote]}
				</button>
			{/each}
			<button class="create-react" on:click={reactOnPost}>
				React!
			</button>
		</div>
		<textarea
			class="message"
			placeholder="Write your react message..."
			rows="3"
			bind:value={formReactData.message}
		></textarea>
	</div>
</div>
