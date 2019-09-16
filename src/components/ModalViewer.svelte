<script>
	import { app } from '../stores/'
	import { fade } from '../utils/transitions'

	function backgroundClose() {
		if ($app.modals.allowBgEscape) {
			app.modals.close()
		}
	}
</script>

<style lang="stylus">
	#modal-viewport
		z-index 10
		position absolute
		top 0
		left 0
		display flex
		width 100vw
		min-height 100vh
		padding 2rem
		justify-content center
		align-items center
		flex-flow row wrap
		> .background
			z-index -1
			position fixed
			top 0
			left 0
			width 100%
			height 100%
			background-color rgba(0,0,0,.5)
			backdrop-filter blur(16px)
			-webkit-backdrop-filter blur(16px)
		:global(> .modal)
			position relative
			display flex
</style>

{#if $app.modals.currentModal}
	<div id="modal-viewport" transition:fade={{ duration: 200 }}>
		<div class="background" on:click={backgroundClose}/>
		<svelte:component this={$app.modals.currentModal.component}/>
	</div>
{/if}
