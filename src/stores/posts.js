import { writable, get as getStore } from 'svelte/store'

function declareStore_posts() {
	const { subscribe } = writable({
		emotions: [
			'happy',
			'angry',
			'excited',
			'fearful',
			'thoughtful',
		],
		emotionsDisplayNames: {
			happy: `😃`,
		    angry: `😠`,
		    excited: `🤩`,
		    fearful: `😰`,
		    thoughtful: `🤔`,
		},
	})

	return {
		subscribe,
	}
}

export const posts = declareStore_posts()
