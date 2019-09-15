import { writable, get as getStore, derived } from 'svelte/store'
import UserSession from '../types/UserSession'

export function initStore() {
	_initStore()
}

let _initStore = function(){}

function declareStore_userSession() {
	function syncLocStorSession(state) {
		if (localStorage !== undefined) {
			localStorage.setItem('dggs_session', state)
		}
	}

	let currentSession = new UserSession()
	const fromLS = localStorage.dggs_session
	if (fromLS) {
		const decoded = JSON.parse(fromLS)
		currentSession = new UserSession(
			decoded.key,
			decoded.id,
			decoded.email,
			decoded.displayName,
			new Date(decoded.creation),
		)
	}
	const { subscribe, set } = writable(currentSession)

	if (!localStorage.dggs_session) {
		syncLocStorSession(currentSession.json())
	}

	return {
		subscribe,
		set(key, id, email, displayName, creation) {
			const newSession = new UserSession(
				key,
				id,
				email,
				displayName,
				new Date(creation),
			)
			syncLocStorSession(newSession.json())
			return set(newSession)
		},
		reset() {
			const nullSess = new UserSession()
			syncLocStorSession(nullSess.json())
			return set(nullSess)
		},
		isValidSession: derived(
			{subscribe},
			(session)=> (
				session.key !== '' &&
				session.id !== '' &&
				session.email !== ''
			),
		),
	}
}

export const userSession = declareStore_userSession()
