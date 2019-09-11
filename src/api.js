import { sessionUser } from './stores'

export function API(hostUrl, graphEndpoint) {
	const baseURL = hostUrl + graphEndpoint

	let session;
	sessionUser.subscribe(s => session = s)

	Object.defineProperties(this, {
		Query: {
			async value(query, args) {
				const headers = {
					'Content-Type': 'application/json'
				}

				if (session) {
					headers['Authorization'] = `Bearer ${session.key}`
				}

				try {
					const resp = await fetch(baseURL, {
						method: 'POST',
						headers,
						body: JSON.stringify({
							query: query,
							variables: args,
						}),
					})
					const data = await resp.json()
					if (data.errors) {
						throw data
					}
					return data.data
				} catch(err) {
					window.handleRequestError(err)
					throw err
				}
			}
		}
	})
}

export const api = new API('https://localhost:16000', '/g')
