import { Router } from '@danielsharkov/svelte-router'

import UsersView from './views/Users'
import ProfileView from './views/ViewProfile'
import PostsView from './views/Posts'

import { isValidSession } from './stores'

let $isValidSession;
isValidSession.subscribe(val => $isValidSession = val)

export default new Router({
	window,
	routes: {
		'root': {
			path: '/',
		},
		'posts': {
			path: '/posts',
			component: PostsView,
			metadata: {
				nav: {
					displayName: 'Posts',
				},
			},
		},
		'users': {
			path: '/users',
			component: UsersView,
			metadata: {
				nav: {
					displayName: 'Users',
				},
			},
		},
		'profile': {
			path: '/profile',
			component: ProfileView,
		},
	},
	beforePush(name, params) {
		if (name == 'profile' && !$isValidSession) {
			name = 'posts'
		}

		return { name, params }
	},
})
