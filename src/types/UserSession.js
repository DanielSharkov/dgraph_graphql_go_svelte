export default function UserSession(key, id, email, displayName, creation) {
	// Check wether this is an valid or empty session
	if ((!key || !id || !email) && (key || id || email)) {
		throw new Error(
			'key, id & email need to be empty for an empty session:' +
			`\nkey: "${key}"\nid: "${id}"\nemail: "${email}"`,
		)
	}
	// Validate values on valid session
	else if (key && id && email) {
		// Validate values
		if (typeof key != 'string' || key.length < 64) {
			throw new Error(
				`expected session key of type string with an length of 64` +
				`\nprovided: ${key} (typeof ${key})`,
			)
		}
		else if (typeof id != 'string' || id.length < 32) {
			throw new Error(
				`expected session id of type string with an length of 32` +
				`\nprovided: ${id} (typeof ${id})`,
			)
		}
		else if (typeof email != 'string' || email.length < 1) {
			throw new Error(
				`expected session email of type string` +
				`\nprovided: ${email} (typeof ${email})`,
			)
		}
		else if (typeof displayName != 'string') {
			throw new Error('invalid display name')
		}
		else if (!(creation instanceof Date)) {
			console.log(creation instanceof Date)
			throw new Error('invalid creation date')
		}
	}
	// On empty session set empty values
	else if (!key && !id && !email) {
		key = ''
		id = ''
		email = ''
		displayName = ''
		creation = new Date(0)
	}

	const _key = key
	const _creation = creation
	const _id = id
	const _email = email
	const _displayName = displayName

	function asJson() {
		return JSON.stringify({
			key: _key,
			creation: _creation,
			id: _id,
			email: _email,
			displayName: _displayName,
		})
	}

	Object.defineProperties(this, {
		key:         { value: key },
		creation:    { value: creation },
		id:          { value: id },
		email:       { value: email },
		displayName: { value: displayName },
		json:        { value: asJson },
	})
}
