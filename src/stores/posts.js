function declareStore_posts() {
	const emotions = Object.freeze([
		'happy',
		'angry',
		'excited',
		'fearful',
		'thoughtful',
	])
	const emotionsDisplayNames = Object.freeze({
		happy: `😃`,
	    angry: `😠`,
	    excited: `🤩`,
	    fearful: `😰`,
	    thoughtful: `🤔`,
	})

	return {
		//subscribe,
		getEmotionsDisplayNames() {
			return emotionsDisplayNames
		},
		getEmotionDisplayName(emote) {
			return emotionsDisplayNames[emote]
		},
		getEmotions() {
			return emotions
		},
	}
}

export const user = declareStore_posts()
