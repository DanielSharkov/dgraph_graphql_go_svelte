import App from './App'
import { UserSession } from './stores'

// App only going to work when web storage is available
if (typeof(Storage) !== undefined) {
	if (window.localStorage.getItem('session') === undefined) {
		localStorage.setItem('session', new UserSession())
	}

	window.handleRequestError = function(err) {
		// err.data.errors.c = error code
		// err.data.errors.m = error message
		if (err === undefined) console.error(
			'Unexpected error @ handleRequestError',
		)
		else if (err.data.errors !== undefined) alert(
			`${err.data.errors.c}\n` +
			`${err.data.errors.m}`,
		)
		else alert(
			`${err.status}\n` +
			`${err.data}`,
		)
	}

	const app = new App({target: document.body})
	window.app = app

} else alert(
	`The browser you use doesn't support web storage,` +
	`wherefore the app is not going to work.`,
)

// In case that the browser doesn't support web storage export an empty object
export default app || {}
