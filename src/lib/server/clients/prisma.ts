import type { D1Database } from '@cloudflare/workers-types/experimental';
import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@prisma/client';

export function getPrismaClient(D1: D1Database) {
	const d1Adapter = new PrismaD1(D1);
	return new PrismaClient({ adapter: d1Adapter });
}
