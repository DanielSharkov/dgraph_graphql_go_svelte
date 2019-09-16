<script>
	import { posts } from '../stores/'
	import router from '../router'
	import CreateReaction from './CreateReaction'

	export let reaction = {
		id: null,
		author: {
			id: null,
			displayName: null,
		},
		emotion: null,
		message: null,
		reactions: [],
		creation: null,
	}

	let createReaction = false

	function openReactCreation() {
		createReaction = true
	}
	function closeReactCreation() {
		createReaction = false
	}
	function newReactionCreated(react) {
		closeReactCreation()
		reaction.reactions = [react.detail, ...reaction.reactions]
	}

	function openAuthorProfile(id) {
		router.push('profile', {id})
	}
</script>



<style lang="stylus">
	.reaction
		padding 1rem
		border solid 1px var(--app-border-01)
		border-radius var(--app-border-radius)
		.header
			margin-bottom 1rem
			justify-content flex-start
			.author
				flex 0 0 auto
				justify-content flex-start
				cursor pointer
				opacity .5
				&:hover
					opacity 1
					.picture
						border-color var(--app-primary)
						svg > *
							stroke var(--app-primary)
					.display-name
						color var(--app-primary)
			.picture
				margin-right 1rem
				flex 0 0 auto
			.display-name
				flex 1 1 auto
			.creation
				margin auto 0 auto 1rem
				flex 0 0 auto
				font-size .75rem
				justify-self flex-end
				align-self flex-start
				opacity .25
		.content
			margin-bottom 1rem
			flex 1 1 100%



	:global(.reaction > .create-reaction)
		margin 0 0 0 1rem
		padding 1rem 0 1rem 1rem
		border-left solid 1px var(--app-border-01)
	:global(.reaction .reaction)
		margin 0 0 0 1rem
		padding 1rem 0 1rem 1rem
		background none
		border none
		border-left solid 1px var(--app-border-01)
		border-radius 0
	:global(.reaction .reaction .header)
		margin-top .5rem
	:global(.reaction .create-reaction .not-signed-in)
		margin 0 !important
</style>



<div class="reaction">
	<div class="header flex-row center-v full-width">
		<div
		class="author flex-row center-v"
		on:click={()=> openAuthorProfile(reaction.author.id)}>
			<div class="picture flex-row center-v">
				<svg class="icon stroked" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 120 120" fill="none" stroke="#000">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".5rem" d="M103 107V96c0-14-11-25-25-25H42c-14 0-25 11-25 25v11"/>
					<circle cx="60" cy="34" r="21" stroke-width=".5rem"/>
				</svg>
			</div>
			<span class="display-name">
				{reaction.author.displayName}
			</span>
		</div>
		<span class="creation">{
			new Date(reaction.creation).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
			})
		}</span>
	</div>
	<div class="content">
		<span class="emote">
			{$posts.emotionsDisplayNames[reaction.emotion]}
		</span>
		<span class="message">
			{reaction.message}
		</span>
	</div>
	{#if reaction.reactions && reaction.reactions.length > 0}
		{#each reaction.reactions as reaction}
			<svelte:self {reaction}/>
		{/each}
	{/if}
	{#if createReaction}
		<CreateReaction
			subject={reaction.id}
			on:cancel={closeReactCreation}
			on:created={newReactionCreated}
		/>
	{:else}
		<button class="primary small" on:click={openReactCreation}>
			+ Write reaction
		</button>
	{/if}
</div>
