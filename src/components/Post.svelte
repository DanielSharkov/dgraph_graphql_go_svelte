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

	let createReaction = false
</script>



<style lang="stylus">
	.post
		display flex
		margin 0 auto 4rem auto
		padding 2rem
		border solid 1px var(--app-border-01)
		border-radius var(--app-border-radius)
		flex-flow row wrap
		.header
			display flex
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
			&:hover
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
			display flex
			flex 1 1 100%
			flex-flow row wrap



	:global(.post .reactions > .create-reaction)
		margin-top 2rem
		padding 1rem
		border solid 1px var(--app-border-01)
		border-radius var(--app-border-radius)
</style>



<div class="post" post-id={post.id}>
	<div class="header">
		<div
		class="author"
		author-id={post.author.id}
		on:click={() => router.push('profile', {id: post.author.id})}>
			<div class="picture">
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
		{#if createReaction}
			<CreateReaction
				subject={post.id}
				on:cancel={() => createReaction = false}
				on:created={react => {
					createReaction = false
					post.reactions = [react.detail, ...post.reactions]
				}}
			/>
		{:else}
			<button
			class="full-width primary"
			on:click={() => createReaction = true}>
				+ Write reaction
			</button>
		{/if}
		{#each post.reactions.reverse() as reaction}
			<Reaction {reaction}/>
		{/each}
	</div>
</div>
