<script>
	import {
		sessionUser,
		isValidSession,
		emotions,
		emotionsDisplayName,
	} from '../stores'
	import { api } from '../api'
	import router from '../router'
	import Reaction from './Reaction'
	import CreateReaction from './CreateReaction'

	export let id;
	export let creation;
	export let title;
	export let contents;
	export let reactions = []
	export let author = {
		id: null,
		displayName: null,
	}

	let createReaction = false
</script>



<style>
	.post {
		display: flex;
		margin: 0 auto 4rem auto;
		padding: 2rem;
		border: solid 1px var(--app-border-01);
		border-radius: var(--app-border-radius);
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
		border-color: var(--app-primary);
	}
	.post .author:hover .picture svg > * {
		stroke: var(--app-primary);
	}
	.post .author:hover .display-name {
		color: var(--app-primary);
	}
	.post .author .picture {
		display: flex;
		margin-right: 1rem;
		flex: 0 0 auto;
		justify-content: center;
		align-items: center;
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
		width: 100%;
		font-family:
			'Lucida Sans',
			'Lucida Sans Regular',
			'Lucida Grande',
			'Roboto',
			'Arial';
		margin: 0;
		padding: .25rem;
		flex: 1 1 100%;
		word-wrap: break-word;
	}
	.post .reactions {
		display: flex;
		flex: 1 1 100%;
		flex-flow: row wrap;
	}
	:global(.post .reactions > .create-reaction) {
		margin-top: 2rem;
		padding: 1rem;
		border: solid 1px var(--app-border-01);
		border-radius: var(--app-border-radius);
	}
	.post .reactions .new-reaction {
		margin-top: 2rem;
	}
</style>



<div class="post" post-id={id}>
	<div class="header">
		<div
		class="author"
		author-id={author.id}
		on:click={() => router.push('profile', {id: author.id})}>
			<div class="picture">
				<svg class="icon stroked" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 120 120" fill="none">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".5rem" d="M103 107V96c0-14-11-25-25-25H42c-14 0-25 11-25 25v11"/>
					<circle cx="60" cy="34" r="21" stroke-width=".5rem"/>
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
		{#if createReaction}
			<CreateReaction
				subject={id}
				on:cancel={() => createReaction = false}
				on:created={react => {
					createReaction = false
					reactions = [react.detail, ...reactions]
				}}
			/>
		{:else}
			<button
			class="full-width primary new-reaction"
			on:click={() => createReaction = true}>
				+ Write reaction
			</button>
		{/if}
		{#each reactions as reaction}
			<Reaction {reaction}/>
		{/each}
	</div>
</div>
