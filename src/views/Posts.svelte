<script>
	import Post from '../components/Post'
	import { app as appStore, userSession } from '../stores/'
	import { api } from '../api'
	import { fly } from '../utils/transitions'

	const postList = []
	let showCreatePost = false
	const formPostData = {
		title: '',
		contents: '',
	}

	async function fetchPosts() {
		const resp = await api.Query(
			`{
				posts {
					id
					author { id displayName }
					creation
					title
					contents
					reactions {
						id
						author { id displayName }
						emotion
						message
						creation
						reactions {
							id
							author { id displayName }
							emotion
							message
							creation
						}
					}
				}
			}`,
		)

		for (const post of resp.posts) {
			postList.unshift(post)
		}
		postList = postList
	}
	fetchPosts()

	async function createNewPost() {
		if (
			!userSession.isValidSession ||
			formPostData.title === '' ||
			formPostData.contents === ''
		) {
			return
		}

		const resp = await api.Query(
			`mutation ($author: Identifier!, $title: String!, $contents: String!) {
				createPost(author: $author, title: $title, contents: $contents) {
					id
					creation
					title
					contents
					author { id displayName }
				}
			}`,
			{
				author: $userSession.id,
				title: formPostData.title,
				contents: formPostData.contents,
			},
		)

		postList.unshift(resp.createPost)
		postList = postList

		showCreatePost = false
		formPostData.title = ''
		formPostData.contents = ''
	}
</script>

<svelte:head>
	<title>Posts</title>
</svelte:head>



<style lang="stylus">
	#createNewPost
		margin 0 auto 2rem auto

	input, textarea
		display block
		width 100%

	#posts
		display grid
		grid-template-columns 1fr
		grid-gap 4rem

	.post
		padding 2rem
		border solid 1px var(--app-border-01)
		border-radius var(--app-border-radius)
		.header
			display flex
			flex 1 1 100%
			justify-content flex-start
			align-content center
			align-items center
		.author
			display flex
			flex 1 0 auto
			justify-content flex-start
			align-content center
			align-items center
			.picture
				display flex
				margin-right 1rem
				flex 0 0 auto
				justify-content center
				align-items center
			.display-name
				flex 1 1 auto
		.content
			margin 2rem 0
			flex 1 1 100%
			.title
				margin 0 0 .5rem 0
				input
					font-weight inherit
					font-size inherit
			.contents
				flex 1 1 100%
			.title input, .contents
				margin 0
				line-height 1.5
				&:not(:hover):not(:active):not(:focus)
					border-color transparent
		.actions
			display flex
			flex-flow row nowrap
			flex 1 1 100%
			.primary
				margin-left auto
</style>



{#if userSession.isValidSession}
	<div
	id="createPost"
	class="post"
	class:hidden={!showCreatePost}>
		<div class="header">
			<div class="author">
				<div class="picture">
					<svg class="icon stroked" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 120 120" fill="none">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".5rem" d="M103 107V96c0-14-11-25-25-25H42c-14 0-25 11-25 25v11"/>
						<circle cx="60" cy="34" r="21" stroke-width=".5rem"/>
					</svg>
				</div>
				<span class="display-name">
					{$userSession.displayName}
				</span>
			</div>
		</div>
		<div class="content">
			<h3 class="title">
				<input
					class="small"
					placeholder="Title ..."
					type="text"
					bind:value={formPostData.title}
				/>
			</h3>
			<textarea
				placeholder="Write your comment ..."
				class="contents small"
				rows="10"
				bind:value={formPostData.contents}
			></textarea>
		</div>
		<div class="actions">
			<button
			id="cancelNewPost"
			class="secondary"
			on:click={() => showCreatePost = false}>
				Cancel
			</button>
			<button
			id="submitNewPost"
			class="primary"
			on:click={createNewPost}>
				+ Create Post
			</button>
		</div>
	</div>

	<button
	id="createNewPost"
	class:hidden={showCreatePost}
	class="full-width large primary"
	on:click={() => showCreatePost = true}
	in:fly>
		+ Write a new post
	</button>
{:else}
	<h3 class="view-title">
		<button class="link" on:click={()=> appStore.modals.open('signIn')}>
			Sign in
		</button>
		to write a post.
	</h3>
{/if}

<div id="posts">
	{#each postList as post, index}
		<Post {post} index={index + 1}/>
	{/each}
</div>
