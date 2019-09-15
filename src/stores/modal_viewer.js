import { writable, get as getStore, derived } from 'svelte/store'

function declareStore_modalViewer() {
	const { subscribe, update } = writable({
		currentModal: null,
		modals: {},
	})

	const validModals = []

	return {
		subscribe,
		registerModal(modalName, component) {
			if (typeof modalName !== 'string') {
				throw new Error(
					'expected first parameter of type string as modal name: ' +
					`${modalName} (${typeof modalName})`,
				)
			}
			else if (validModals.indexOf(modalName) >= 0) {
				throw new Error(`modal already exists by name '${modalName}'`)
			}
			else if (!component) {
				throw new Error('invalid component provided')
			}
			validModals.push(modalName)
			update((store)=> {
				store.modals[modalName] = component
				return store
			})
		},
		open(modalName, data = null) {
			if (typeof modalName !== 'string') {
				throw new Error(
					`invalid modal name: ${modalName} (${typeof modalName})`,
				)
			}
			else if (validModals.indexOf(modalName) < 0) {
				throw new Error(`modal by name '${modalName}' not existing`)
			}
			update((store)=> {
				store.currentModal = {
					data,
					component: store.modals[modalName],
				}
				return store
			})
		},
		close() {
			update((store)=> {
				store.currentModal = null
				return store
			})
		},
	}
}

export const modalViewer = declareStore_modalViewer()
