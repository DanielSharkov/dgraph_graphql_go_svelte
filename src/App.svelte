<script>
	import { RouterViewport } from '@danielsharkov/svelte-router'
	import router from './router'
	import { app } from './stores/'
	import initStores from './stores/initStores'
	import ModalViewer from './components/ModalViewer'
	import AppHeader from './components/AppHeader'

	// Styles
	import globalStyles from './styles/global.styl'
	import blackTheme from './styles/black-theme.styl'

	import SignInModal from './components/SignInModal'
	app.modals.registerModal('signIn', SignInModal)

	// Loads asynchronous data
	app.load((resolve, fail)=> {
		initStores().then(resolve).catch(fail)
	})
</script>

<style lang="stylus">
	#router-viewport
		position relative
		display block
		max-width 800px
		margin auto
		padding-bottom 4rem
		@media screen and (max-width 825px)
			padding 0 2rem 4rem 2rem
</style>

<div id="app" class="{$app.theme.name}-theme">
	<ModalViewer/>
	<AppHeader/>
	<div id="router-viewport">
		<RouterViewport {router}/>
	</div>
</div>
