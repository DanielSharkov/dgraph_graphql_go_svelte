<script>
	import Post from '../components/Post'
	import { api } from '../api'

	export let params;
	let post = null;

	async function fetchPost() {
		const resp = await api.Query(
			`query ($id: Identifier!) {
				post(id: $id) {
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
			{id: params.id}
		)

		post = resp.post
	}
	fetchPost()
</script>

<svelte:head>
	{#if post !== null}
		<title>{post.author.displayName} - {post.title}</title>
	{/if}
</svelte:head>
<svelte:window on:routeUpdated={fetchPost}/>



<Post {...post}/>
