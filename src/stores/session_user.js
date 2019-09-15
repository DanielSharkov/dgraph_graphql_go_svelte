import { writable, get as getStore, derived } from 'svelte/store'
import UserSession from '../types/UserSession'

export function initStore() {
	_initStore()
}

let _initStore = function(){}

function declareStore_user() {
	function syncLocStorSession(state) {
		if (localStorage !== undefined) {
			localStorage.setItem('dggs_session', JSON.stringify(state))
		}
	}

	if (!localStorage.dggs_session) {
		syncLocStorSession(new UserSession())
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
			decoded.creation,
		)
	}
	const { subscribe, set } = writable(currentSession)

	return {
		subscribe,
		set(session) {
			if (session instanceof UserSession) {
				syncLocStorSession(session.json())
				return set(session)
			}
		},
		reset() {
			const nullSess = new UserSession()
			syncLocStorSession(nullSess.json())
			return set(nullSess)
		},
		isValidSession: derived(
			subscribe,
			(session)=> (
				session.key !== '' &&
				session.id !== '' &&
				session.email !== ''
			),
		),
	}
}

export const user = declareStore_user()
