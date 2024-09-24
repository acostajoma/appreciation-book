import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: ['<all>'],
			},
			platformProxy: {
				configPath: 'wrangler.toml',
				environment: undefined,
				experimentalJsonConfig: false,
				persist: false,
			},
		}),

		csrf: {
			checkOrigin: true,
		},
		csp: {
			directives: {
				'script-src': ['self'],
				'img-src': ['self', 'data:', 'https://tailwindui.com'],
				'worker-src': ['self', 'blob:'],
			},
		},
	},
};

export default config;
