import { Router } from '@danielsharkov/svelte-router'

import NotFoundView from './views/NotFound'
import UsersView from './views/Users'
import ProfileView from './views/ViewProfile'
import PostsView from './views/Posts'
import PostView from './views/Post'

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
		switch (name) {
		case 'root':
			name = 'posts'
			break
		}

		return { name, params }
	},
})
