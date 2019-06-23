import { writable, readable, derived } from 'svelte/store'



export function UserSession(
	key = '',
	id = '',
	email = '',
	displayName = '',
	creation = new Date(0),
) {
	Object.defineProperties(this, {
		key:         { value: key },
		creation:    { value: creation },
		id:          { value: id },
		email:       { value: email },
		displayName: { value: displayName },
		json:        { value: function() {
			return JSON.stringify({
				key: this.key,
				creation: this.creation,
				id: this.id,
				email: this.email,
				displayName: this.displayName,
			})
		}},
	})
}

function initUserSession() {
	let currentSession = new UserSession()

	const fromLS = window.localStorage.getItem('session')
	if (fromLS) {
		const decoded = JSON.parse(fromLS)
		currentSession = new UserSession(
			decoded.key,
			decoded.id,
			decoded.email,
			decoded.displayName,
			decoded.creation,
		)
	}

	const { subscribe, set } = writable(currentSession)
	return {
		subscribe,
		set(session) {
			if (session instanceof UserSession) {
				window.localStorage.setItem('session', session.json())
				return set(session)
			}
		},
		reset() {
			const nullSess = new UserSession()
			window.localStorage.setItem('session', nullSess.json())
			return set(nullSess)
		},
		
	}
}
export const sessionUser = initUserSession()
export const isValidSession = derived(
	sessionUser,
	(session) => {
		return (
			session.key !== '' &&
			session.id !== '' &&
			session.email !== ''
		)
	},
)



export const emotions = readable([
	'happy',
	'angry',
	'excited',
	'fearful',
	'thoughtful',
])
export const emotionsDisplayName = readable({
	happy: `😃`,
    angry: `😠`,
    excited: `🤩`,
    fearful: `😰`,
    thoughtful: `🤔`,
})



export function ModalView(type = '', data = {}) {
	Object.defineProperties(this, {
		type: { value: type },
		data: { value: data },
	})
}

function initModalViewer() {
	const { subscribe, set } = writable(new ModalView())
	return {
		subscribe,
		open(modal) {
			if (modal instanceof ModalView) {
				return set(
					new ModalView(
						modal.type,
						modal.data || {},
					)
				)
			}
		},
		close() {
			return set(new ModalView())
		},
	}
}
export const modalViewer = initModalViewer()



function initAppTheme() {
	const { subscribe, update } = writable(
		window.localStorage.getItem('appTheme') || ''
	)
	return {
		subscribe,
		toggle() {
			return update(store => {
				if (store === 'black') {
					store = 'default'
				} else {
					store = 'black'
				}
				window.localStorage.appTheme = store
				return store
			})
		},
	}
}
export const appTheme = initAppTheme()
