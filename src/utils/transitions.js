import { cubicOut } from 'svelte/easing'

export function fade(node, {
	duration = 500,
	delay = 0,
	easing = cubicOut,
}) {
	return {
		duration,
		delay,
		css(tick) {
			tick = easing(tick)
			return `opacity: ${tick};`
		},
	}
}

export function fly(node, {
	duration = 500,
	delay = 0,
	easing = cubicOut,
	multiplier = 1,
}) {
	return {
		duration,
		delay,
		css(tick) {
			tick = easing(tick)
			return `
				opacity: ${tick};
				transform: translateY(${multiplier * (tick - 1)}rem)
			`
		},
	}
}
