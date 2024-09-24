// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				DB: D1Database;
			};
			cf: CfProperties;
			ctx: ExecutionContext;
			caches: (CacheStorage & { default: Cache }) | CacheStorage_2;
		}
	}
}

export {};
