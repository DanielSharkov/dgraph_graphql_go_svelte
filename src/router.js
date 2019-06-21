import { Router } from '@danielsharkov/svelte-router'

import NotFoundView from './views/NotFound'
import UsersView from './views/Users'
import ProfileView from './views/ViewProfile'
import PostsView from './views/Posts'
import PostView from './views/Post'

import { isValidSession } from './stores'

let $isValidSession;
isValidSession.subscribe(val => $isValidSession = val)

export default new Router({
	window,
	routes: {
		'root': {
			path: '/',
		},
		'404': {
			path: '/404',
			component: NotFoundView,
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
		'post': {
			path: '/post/:id',
			component: PostView,
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
			path: '/profile/:id',
			component: ProfileView,
		},
	},
	fallback: {
		name: '404',
	},
	beforePush(name, params, previousRoute) {
		if (
			previousRoute !== null &&
			previousRoute.name === 'posts' &&
			name === 'signin.modal'
		) {
			alert('Sign in modal')
			return previousRoute
		}

		switch (name) {
		case 'root':
			name = 'posts'
			break
		}

		return { name, params }
	},
})
