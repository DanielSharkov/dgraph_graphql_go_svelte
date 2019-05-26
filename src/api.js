import { sessionUser } from './stores'
import Axios from 'axios'

export function API(hostUrl, graphEndpoint) {
	const axios = Axios.create({
		method: 'post',
		baseURL: hostUrl + graphEndpoint,
		timeout: 5000,
		headers: {
			'Content-Type': 'application/json',
		},
	})

	let session;
	sessionUser.subscribe(s => session = s)

	Object.defineProperties(this, {
		Query: {value: async function(query, args) {
			const headers = {}

			if (session) {
				headers['Authorization'] = `Bearer ${session.key}`
			}
	
			try {
				const resp = await axios ({
					data: JSON.stringify({
						query: query,
						variables: args,
					}),
					headers,
				})
				return resp.data.data
			} catch(err) {
				window.handleRequestError(err.response.data.errors)
			}
		}}
	})
}

export const api = new API('https://localhost:16000', '/g')
