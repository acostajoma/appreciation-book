// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session | null;
			user: User | null;
			authenticatedUser: boolean;
			lucia: Lucia;
			db: D1Database;
			prismaClient: PrismaClient<
				{
					adapter: PrismaD1;
				},
				never,
				DefaultArgs
			>;
		}
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
