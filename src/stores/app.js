import { writable, get as getStore } from 'svelte/store'

export function initStore() {
	_initStore()
}

let _initStore = function(){}

function declareStore_app() {
	const themes = [
		{
			name: 'default',
			primary: '#04F',
			secondary: '',
			browserTitle: '#FFF',
		},
		{
			name: 'black',
			primary: '#09F',
			secondary: '#F00',
			browserTitle: '#000',
		},
	]
	let theme = themes[0]
	let debugMode = {
		state: false,
		elBounds: false,
	}

	if (!localStorage.dggs_theme) {
		syncLocStorTheme(themes[0].name)
	}
	if (localStorage.dggs_dev_dm === undefined) {
		syncLocStorDebugMode(`{"state":false,"elBounds":false}`)
	}

	function syncLocStorTheme(state) {
		if (localStorage !== undefined) {
			localStorage.setItem('dggs_theme', state)
		}
	}
	function syncLocStorDebugMode(state) {
		if (localStorage !== undefined) {
			localStorage.setItem('dggs_dev_dm', JSON.stringify(state))
		}
	}

	if (localStorage.dggs_theme) {
		for (const index in themes) {
			if (themes[index].name === localStorage.dggs_theme) {
				theme = themes[index]
			}
		}
	}
	if (localStorage.dggs_dev_dm) {
		debugMode = JSON.parse(localStorage.dggs_dev_dm)
	}

	const { subscribe, update } = writable({
		theme,
		themes,
		debugMode,
		loader: {
			failed: {
				state: false,
				message: null,
			},
			isLoading: false,
			loaderGraphic: 0,
			timeout: 30000,
			noEscape: false,
			loadStack: [],
		},
		modals: {
			currentModal: null,
			allowBgEscape: true,
			modals: {},
		},
	})

	function toggleDebugMode() {
		update((store)=> {
			store.debugMode.state = !store.debugMode.state
			syncLocStorDebugMode(store.debugMode)
			if (store.debugMode.state) {
				console.log(
					'%cDebug Mode turned ON',
					`padding: 0 .5rem;
					background-color: #FFF;
					color: #000;
					font-size: 1.5rem;
					border-radius: .25rem;`,
				)
			}
			else {
				console.log(
					'%cDebug Mode turned OFF',
					`padding: 0 .5rem;
					background-color: #666;
					color: #FFF;
					font-size: 1.5rem;
					border-radius: .25rem;`,
				)
			}
			return store
		})
		return 0
	}
	window.dggs_dev_dm = toggleDebugMode
	function toggleDebugElBounds() {
		update((store)=> {
			store.debugMode.elBounds = !store.debugMode.elBounds
			syncLocStorDebugMode(store.debugMode)
			if (store.debugMode.elBounds) {
				console.log(
					'%cBoundaries turned ON',
					`padding: 0 .5rem;
					border: dotted .2rem #FF1DFF;
					color: #FF1DFF;
					font-size: 1.5rem;`,
				)
			}
			else {
				console.log(
					'%cBoundaries turned OFF',
					`padding: 0 .5rem;
					border: dotted .2rem #666;
					color: #666;
					font-size: 1.5rem;`,
				)
			}
			return store
		})
		return 0
	}
	window.dggs_dev_dm_eb = toggleDebugElBounds
	function setTheme(themeName) {
		if (typeof themeName !== 'string') {
			throw new Error(`expected theme of type string`)
		}
		update((store)=> {
			if (themeName !== store.theme.name) {
				for (let index in store.themes) {
					if (themeName === store.themes[index].name) {
						store.theme = themes[index]
					}
				}
			}
			syncLocStorTheme(store.theme.name)
			return store
		})
	}
	function getTheme() {
		return getStore({subscribe}).theme
	}
	function toggleTheme() {
		update((store)=> {
			if (store.theme.name === store.themes[0].name) {
				store.theme = themes[1]
			}
			else {
				store.theme = themes[0]
			}
			syncLocStorTheme(store.theme.name)
			return store
		})
	}
	function load(
		callback,
		{
			onFail,
			timeout = 30000,
			noEscape = false,
		} = {
			onFail: undefined,
			timeout: 30000,
			noEscape: false,
		}
	) {
		if (
			callback === undefined ||
			callback === null ||
			{}.toString.call(callback) !== '[object Function]'
		) {
			throw new Error('expected callback as a function')
		}
		else if (typeof noEscape !== 'boolean') {
			throw new Error(`expected 'noEscape' of type boolean`)
		}
		update((store)=> {
			store.loader.loadStack.push({callback})
			if (
				onFail !== undefined ||
				onFail !== null ||
				{}.toString.call(onFail) === '[object Function]'
			) {
				store.loader.loadStack[0].onFail = onFail
			}
			store.loader.timeout = timeout
			store.loader.loaderGraphic = Math.round(Math.random() * 5)
			store.loader.sate = true
			store.loader.failed = false
			store.loader.noEscape = noEscape

			return store
		})
		if (!getStore({subscribe}).loader.isLoading) {
			callLoaderStack()
		}
	}
	function callLoaderStack() {
		update((store)=> {
			store.loader.isLoading = true
			return store
		})
		const loader = getStore({subscribe}).loader
		setTimeout(()=> {
			setTimeout(()=> {
				if (getStore({subscribe}).loader.isLoading) {
					failLoader()
				}
			}, loader.timeout)
			loader.loadStack[0].callback(resolveLoader, failLoader)
		})
	}
	function failLoader(message) {
		update((store)=> {
			if (store.loader.loadStack[0].onFail) {
				store.loader.loadStack[0].onFail()
			}
			if (message) {
				if (message.toString) {
					store.loader.failMessage = message.toString()
				}
				else if (!message.toString && typeof message !== 'string') {
					throw new Error('error message not a string')
				}
				else {
					store.loader.failMessage = message
				}
			}
			store.loader.failed = true
			return store
		})
	}
	function cancelLoader() {
		update((store)=> {
			if (!store.loader.noEscape) {
				store.loader.failed = false
				store.loader.isLoading = false
				store.loader.loadStack.shift()
			}
			return store
		})
	}
	function retryFetch() {
		if (getStore({subscribe}).loader.isLoading) {
			return
		}
		update((store)=> {
			store.loader.failed = false
			store.loader.failMessage = null
			return store
		})
		callLoaderStack()
	}
	function resolveLoader() {
		update((store)=> {
			store.loader.failed = false
			store.loader.isLoading = false
			store.loader.loaderGraphic = 0
			store.loader.timeout = 30000
			store.loader.noEscape = false
			store.loader.failMessage = null
			store.loader.loadStack.shift()
			return store
		})
		if (getStore({subscribe}).loader.loadStack.length >= 1) {
			callLoaderStack()
		}
	}

	const validModals = []
	function registerModal(modalName, component) {
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
			store.modals.modals[modalName] = component
			return store
		})
	}
	function _openModal(modalName, data = null, options) {
		if (typeof modalName !== 'string') {
			throw new Error(
				`invalid modal name: ${modalName} (${typeof modalName})`,
			)
		}
		else if (validModals.indexOf(modalName) < 0) {
			throw new Error(`modal by name '${modalName}' not existing`)
		}
		update((store)=> {
			store.modals.currentModal = {
				data,
				component: store.modals.modals[modalName],
			}
			if (options) {
				if (options.allowBgEscape != undefined) {
					if (typeof options.allowBgEscape != 'boolean') {
						throw new Error(
							`expected option 'allowBgEscape' of type boolen: ` +
							`${options.allowBgEscape} (${typeof options.allowBgEscape})`,
						)
					}
					store.modals.allowBgEscape = options.allowBgEscape
				}
			}
			return store
		})
	}
	function _closeModal() {
		update((store)=> {
			store.modals.currentModal = null
			store.modals.allowBgEscape = true
			return store
		})
	}

	return {
		subscribe,
		setTheme,
		getTheme,
		toggleTheme,
		load,
		failLoader,
		cancelLoader,
		retryFetch,
		toggleDebugMode,
		modals: {
			registerModal,
			open: _openModal,
			close: _closeModal,
		},
	}
}

export const app = declareStore_app()
