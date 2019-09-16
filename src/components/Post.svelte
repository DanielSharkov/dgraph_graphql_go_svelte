<script>
	import router from '../router'
	import Reaction from './Reaction'
	import CreateReaction from './CreateReaction'
	import { fly } from '../utils/transitions'

	export let post = {
		id: '',
		creation: new Date(0),
		title: '',
		contents: '',
		reactions: [],
		author: {
			id: null,
			displayName: null,
		},
	}
	export let transitionDelay = 0

	let showReactCreation = false
	function openReactCreation() {
		showReactCreation = true
	}
	function hideReactCreation() {
		showReactCreation = false
	}

	function reactionCreated(react) {
		hideReactCreation()
		post.reactions = [react.detail, ...post.reactions]
	}

	function openAuthorProfile(id) {
		router.push('profile', {id})
	}
</script>



<style lang="stylus">
	.post
		padding 2rem
		border solid 1px var(--app-border-01)
		border-radius var(--app-border-radius)
		.header
			flex 1 1 100%
			justify-content flex-start
		.author
			flex 0 0 auto
			cursor pointer
			&:hover
				.picture
					border-color var(--app-primary)
					.stroked > *
						stroke var(--app-primary)
				.display-name
					color var(--app-primary)
			.picture
				margin-right 1rem
				flex 0 0 auto
			.display-name
				display inline-block
				flex 1 1 auto
		.creation
			margin-left auto
			flex 0 0 auto
			font-size .75rem
			justify-self flex-end
			align-self flex-start
			opacity .25
		.content
			margin 2rem 0
			flex 1 1 100%
			.title
				margin 0 0 .5rem 0
				padding .25rem
				flex 1 0 auto
			.contents
				width 100%
				font-family:
					'Lucida Sans',
					'Lucida Sans Regular',
					'Lucida Grande',
					'Roboto',
					'Arial'
				margin 0
				padding .25rem
				flex 1 1 100%
				word-wrap break-word
		.reactions
			display grid
			grid-template-columns 1fr
			grid-gap 2rem

	:global(.post .reactions > .create-reaction)
		padding 1rem
		line-height 1
		border solid 1px var(--app-border-01)
		border-radius var(--app-border-radius)
</style>



<div class="post" in:fly={{ delay: transitionDelay * 100 }}>
	<div class="header flex-row center-v">
		<div
		class="author flex-row center-v"
		on:click={()=> openAuthorProfile(post.author.id)}>
			<div class="picture flex-row center-content">
				<svg class="icon stroked" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 120 120" fill="none">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".5rem" d="M103 107V96c0-14-11-25-25-25H42c-14 0-25 11-25 25v11"/>
					<circle cx="60" cy="34" r="21" stroke-width=".5rem"/>
				</svg>
			</div>
			<span class="display-name">
				{post.author.displayName}
			</span>
		</div>
		<span class="creation">{
			new Date(post.creation).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
			})
		}</span>
	</div>
	<div class="content">
		<h3 class="title">{post.title}</h3>
		<pre class="contents">{post.contents}</pre>
	</div>
	<div class="reactions">
		{#if showReactCreation}
			<CreateReaction
				subject={post.id}
				on:cancel={hideReactCreation}
				on:created={reactionCreated}
			/>
		{:else}
			<button class="full-width primary" on:click={openReactCreation}>
				+ Write reaction
			</button>
		{/if}
		{#each post.reactions.reverse() as reaction}
			<Reaction {reaction}/>
		{/each}
	</div>
</div>
