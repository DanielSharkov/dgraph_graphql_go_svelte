import App from './App'

let app;

// App only going to work when web storage is available
if (typeof(Storage) !== undefined) {
	window.eventUserSignIn = new CustomEvent('userSignIn')

	window.handleRequestError = function(err) {
		// err.errors.c = error code
		// err.errors.m = error message
		if (err === undefined) {
			console.error('DEBUG\nUnexpected error @ handleRequestError')
		}
		else if (err.errors) {
			console.warn(
				'DEBUG\n' +
				`Err code: ${err.errors.c}\n` +
				`Err msg: ${err.errors.m}`,
			)
		}
		else {
			console.warn(
				'DEBUG\n' +
				`Req. status: ${err.status}\n` +
				`Req. data: ${err.data}`,
			)
		}
	}

	app = new App({target: document.body})
	window.app = app
}
else {
	alert(
		`Warning! You're using this app without a local storage api ` +
		`wherefore you actually can't use this app.` +
		`\nRecommended Browsers: Chrome (Opera, Vivaldi), Safari, Firefox`
	)
}

// In case that the browser doesn't support web storage export an empty object
export default app || {}
