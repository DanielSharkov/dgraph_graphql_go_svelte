<script>
	import Post from '../components/Post'
	import { sessionUser, isValidSession, UserSession } from '../stores'
	import { api } from '../api'

	const postList = []
	let showCreatePost = false
	const formPostData = {
		title: '',
		contents: '',
	}

	function isFormEmpty() {
		return formPostData.title === '' || formPostData.contents === ''
	}

	async function fetchPosts() {
		const resp = await api.Query(
			`{
				posts {
					id
					author {
						id
						displayName
					}
					creation
					title
					contents
					reactions {
						id
						author {
							id
							displayName
						}
						emotion
						message
						creation
						reactions {
							id
							author {
								id
								displayName
							}
							emotion
							message
							creation
						}
					}
				}
			}`,
		)

		for (const post of resp.posts) postList.unshift(post)
		postList = postList
	}
	fetchPosts()

	async function createNewPost() {
		if (!$isValidSession || isFormEmpty()) return

		const resp = await api.Query(
			`mutation (
				$author: Identifier!
				$title: String!
				$contents: String!
			) {
				createPost(
					author: $author
					title: $title
					contents: $contents
				) {
					id
					creation
					title
					contents
					author {
						id
						displayName
					}
				}
			}`,
			{
				author: $sessionUser.id,
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



<style>
	#createNewPost {
		display: block;
		width: 100%;
		margin: 0 auto 2rem auto;
		padding: 1rem;
		background: none;
		border: solid 1px rgba(0,0,0,.1);
		border-radius: 4px;
		cursor: pointer;
		color: #03f;
		outline: none;
	}
	#createNewPost:hover {
		background-color: rgba(0,40,255,.1);
		border-color: #03f;
	}
	#createNewPost:active {
		background-color: #03f;
		border-color: #03f;
		color: #fff;
	}

	input, textarea {
		display: block;
		width: 100%;
		outline: none;
	}

	.post {
		display: flex;
		margin: 0 auto 2rem auto;
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
		flex: 1 0 auto;
		justify-content: flex-start;
		align-content: center;
		align-items: center;
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
	.post .title {
		margin: 0 0 .5rem 0;
		flex: 1 0 auto;
	}
	.post .title input {
		font-weight: inherit;
		font-size: inherit;
	}
	.post .contents {
		flex: 1 1 100%;
	}
	.post .title input,
	.post .contents {
		margin: 0;
		padding: .25rem;
		outline: none;
		border: solid 1px transparent;
		border-radius: 4px;
		line-height: 1.5;
	}
	.post .title input:hover,
	.post .contents:hover {
		border-color: #000;
	}
	.post .title input:focus,
	.post .contents:focus {
		border-color: #03f;
		box-shadow: 0 0 0 .25rem rgba(0,40,255,.1);
	}
	.post .actions {
		display: flex;
		flex-flow: row nowrap;
		margin-top: 1rem;
		flex: 1 1 100%;
	}
	.post .actions button {
		margin: 0;
		padding: .5rem 1rem;
		background: none;
		border: solid 1px transparent;
		border-radius: 4px;
		cursor: pointer;
		outline: none;
	}
	.post .actions button:hover {
		border-color: rgba(0,0,0,.1);
	}
	.post .actions button:active {
		background-color: rgba(0,0,0,.05);
		border-color: #000;
		color: #000;
	}
	.post .actions .primary {
		margin-left: auto;
		border: solid 1px rgba(0,0,0,.1);
		color: #03f;
	}
	.post .actions .primary:hover {
		background-color: rgba(0,40,255,.1);
		border-color: #03f;
	}
	.post .actions .primary:active {
		background-color: #03f;
		border-color: #03f;
		color: #fff;
	}
</style>



<h3 class:hidden={$isValidSession} class="view-title">
	Sign in to write a post.
</h3>

{#if $isValidSession}
	<div
	id="createPost"
	class="post"
	class:hidden={!showCreatePost}>
		<div class="header">
			<div class="author">
				<div class="picture">
					<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 120 120" fill="none" stroke="#000">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width=".5rem" d="M103 107V96c0-14-11-25-25-25H42c-14 0-25 11-25 25v11"/>
						<circle cx="60" cy="34" r="21" stroke-width=".5rem"/>
					</svg>
				</div>
				<span class="display-name">
					{$sessionUser.displayName}
				</span>
			</div>
		</div>
		<h3 class="title">
			<input
				placeholder="Title ..."
				type="text"
				bind:value={formPostData.title}
			/>
		</h3>
		<textarea
			placeholder="Write your comment ..."
			class="contents"
			rows="10"
			bind:value={formPostData.contents}
		></textarea>
		<div class="actions">
			<button id="cancelNewPost" on:click={() => showCreatePost = false}>
				Cancel
			</button>
			<button id="submitNewPost" class="primary" on:click={createNewPost}>
				+ Create Post
			</button>
		</div>
	</div>

	<button
	id="createNewPost"
	class:hidden={showCreatePost}
	on:click={() => showCreatePost = true}>
		+ Write a new post
	</button>
{/if}

<div id="posts">
	{#each postList as post}
		<Post {...post}/>
	{/each}
</div>
