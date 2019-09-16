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
</script>



<style lang="stylus">
	.reaction
		padding 1rem
		border solid 1px var(--app-border-01)
		border-radius var(--app-border-radius)
		.header
			display flex
			margin-bottom 1rem
			flex 1 1 100%
			justify-content flex-start
			align-content center
			align-items center
			.author
				display flex
				flex 0 0 auto
				justify-content flex-start
				align-content center
				align-items center
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
				display flex
				margin-right 1rem
				flex 0 0 auto
				justify-content center
				align-items center
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



<div class="reaction" reaction-id={reaction.id}>
	<div class="header">
		<div
		class="author"
		author-id={reaction.author.id}
		on:click={() => router.push('profile', {id: reaction.author.id})}>
			<div class="picture">
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
		<span>{$posts.emotionsDisplayNames[reaction.emotion]}</span>
		<span>{reaction.message}</span>
	</div>
	{#if reaction.reactions && reaction.reactions.length > 0}
		{#each reaction.reactions as reaction}
			<svelte:self {reaction}/>
		{/each}
	{/if}
	{#if createReaction}
		<CreateReaction
			subject={reaction.id}
			on:cancel={() => createReaction = false}
			on:created={react => {
				createReaction = false
				reaction.reactions = [react.detail, ...reaction.reactions]
			}}
		/>
	{:else}
		<button class="primary small" on:click={() => createReaction = true}>
			+ Write reaction
		</button>
	{/if}
</div>
