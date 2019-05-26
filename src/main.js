import App from './App'
import { UserSession } from './stores'

// App only going to work when web storage is available
if (typeof(Storage) !== undefined) {
	if (window.localStorage.getItem('session') === undefined) {
		localStorage.setItem('session', new UserSession())
	}

	window.handleRequestError = function(err) {
		// err.c = error code
		// err.m = error message
		alert(`${err.c}\n${err.m}`)
	}

	const app = new App({target: document.body})
	window.app = app

} else alert(
	`The browser you use doesn't support web storage,` +
	`wherefore the app is not going to work.`,
)

// In case that the browser doesn't support web storage export an empty object
export default app || {}
