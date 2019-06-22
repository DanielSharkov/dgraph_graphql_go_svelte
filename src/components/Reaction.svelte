<script>
	import { emotionsDisplayName } from '../stores'
	import router from '../router'
	import CreateReaction from './CreateReaction'

	export let id;
	export let author = {
		id: null,
		displayName: null,
	}
	export let emotion;
	export let message;
	export let reactions = []
	export let creation = null

	let createReaction = false
</script>



<style>
	.reaction {
		margin-top: 2rem;
		padding: 1rem;
		flex: 1 1 100%;
		border: solid 1px var(--app-border-01);
		border-radius: var(--app-border-radius);
	}
	.reaction .header {
		display: flex;
		margin-bottom: 1rem;
		flex: 1 1 100%;
		justify-content: flex-start;
		align-content: center;
		align-items: center;
	}
	.reaction .header .author {
		display: flex;
		flex: 0 0 auto;
		justify-content: flex-start;
		align-content: center;
		align-items: center;
		cursor: pointer;
		opacity: .5;
	}
	.reaction .header .author:hover {
		opacity: 1;
	}
	.reaction .header .author:hover .picture {
		border-color: var(--app-primary);
	}
	.reaction .header .author:hover .picture svg > * {
		stroke: var(--app-primary);
	}
	.reaction .header .author:hover .display-name {
		color: var(--app-primary);
	}
	.reaction .header .author .picture {
		display: flex;
		margin-right: 1rem;
		flex: 0 0 auto;
		justify-content: center;
		align-items: center;
	}
	.reaction .header .author .display-name {
		flex: 1 1 auto;
	}
	.reaction .header .creation {
		margin: auto 0 auto 1rem;
		flex: 0 0 auto;
		font-size: .75rem;
		justify-self: flex-end;
		align-self: flex-start;
		opacity: .25;
	}
	.reaction .content {
		margin-bottom: 1rem;
		flex: 1 1 100%;
	}
	:global(.reaction > .create-reaction) {
		margin: 0 0 0 1rem;
		padding: 1rem 0 1rem 1rem;
		border-left: solid 1px var(--app-border-01);
	}
	:global(.reaction .reaction) {
		margin: 0 0 0 1rem;
		padding: 1rem 0 1rem 1rem;
		background: none;
		border: none;
		border-left: solid 1px var(--app-border-01);
		border-radius: 0;
	}
	:global(.reaction .reaction .header) {
		margin-top: .5rem;
	}
</style>



<div class="reaction" reaction-id={id}>
	<div class="header">
		<div
		class="author"
		author-id={author.id}
		on:click={() => router.push('profile', {id: author.id})}>
			<div class="picture">
				<svg class="icon stroked" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 120 120" fill="none" stroke="#000">
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
	<div class="content">
		<span>{$emotionsDisplayName[emotion]}</span>
		<span>{message}</span>
	</div>
	{#if reactions.length > 0}
		{#each reactions as reaction}
			<svelte:self {...reaction}/>
		{/each}
	{/if}
	{#if createReaction}
		<CreateReaction
			subject={id}
			on:cancel={() => createReaction = false}
			on:created={react => {
				reactions = [react.detail, ...reactions]
				createReaction = false
			}}
		/>
	{:else}
		<button class="primary small" on:click={()=>createReaction = true}>
			+ Write reaction
		</button>
	{/if}
</div>
