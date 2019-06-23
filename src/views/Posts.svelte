<script>
	import Post from '../components/Post'
	import {
		sessionUser,
		isValidSession,
		UserSession,
		modalViewer,
		ModalView,
	} from '../stores'
	import { api } from '../api'

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

		for (const post of resp.posts) {
			postList.unshift(post)
		}
		postList = postList
	}
	fetchPosts()

	async function createNewPost() {
		if (
			!$isValidSession ||
			formPostData.title === '' ||
			formPostData.contents === ''
		) {
			return
		}

		const resp = await api.Query(
			`mutation (
				$author: Identifier!,
				$title: String!,
				$contents: String!
			) {
				createPost(
					author: $author,
					title: $title,
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

	function openSignInModal() {
		modalViewer.open(
			new ModalView('sign_in')
		)
	}
</script>

<svelte:head>
	<title>Posts</title>
</svelte:head>



<style>
	#createNewPost {
		margin: 0 auto 2rem auto;
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
		border-radius: var(--app-border-radius);
		line-height: 1.5;
	}
	.post .title input:hover,
	.post .contents:hover {
		border-color: #000;
	}
	.post .title input:focus,
	.post .contents:focus {
		border-color: var(--app-primary);
		box-shadow: 0 0 0 .25rem var(--app-primary-01);
	}
	.post .actions {
		display: flex;
		flex-flow: row nowrap;
		margin-top: 1rem;
		flex: 1 1 100%;
	}
</style>



{#if $isValidSession}
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
	on:click={() => showCreatePost = true}>
		+ Write a new post
	</button>
{:else}
	<h3 class="view-title">
		<button class="link" on:click={openSignInModal}>
			Sign in
		</button>
		to write a post.
	</h3>
{/if}

<div id="posts">
	{#each postList as post}
		<Post {...post}/>
	{/each}
</div>
