import { sineIn } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

/**
 * A Svelte transition function that combines a fade and scale animation.
 *
 * This function animates an element's opacity and scale simultaneously, starting
 * from the element's current computed styles. The initial opacity and scale values
 * are dynamically captured and used as the base for the transition, ensuring that
 * the animation works correctly even if the element has custom styles applied.
 *
 * @param {HTMLElement} node - The DOM element to which the transition is applied.
 * @param {TransitionConfig} options - The configuration object for the transition,
 *        including optional delay, duration, and easing function.
 *
 * @returns {TransitionConfig} - An object defining the delay, duration, and CSS
 *          necessary to animate the element's opacity and scale.
 */
export function fadeScale(
	node: HTMLElement,
	{ delay, duration, easing = sineIn }: TransitionConfig,
): TransitionConfig {
	const style = getComputedStyle(node);
	const initialOpacity = parseFloat(style.opacity) || 1;
	const initialScale = parseFloat(style.transform.replace(/[^0-9.]/g, '')) || 1;

	return {
		delay: delay || 0,
		duration: duration || 200,
		css: (t: number) => {
			const eased = easing(t);
			return `transform: scale(${initialScale * eased});
        opacity: ${initialOpacity * eased};`;
		},
	};
}
