export default function UserSession(
	key = '',
	id = '',
	email = '',
	displayName = '',
	creation = new Date(0),
) {
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
