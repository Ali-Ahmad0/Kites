// See https://svelte.dev/docs/kit/types#app.d.ts

import type { PrismaClient } from "@prisma/client/extension";

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: {
				id: string, username: string
			} | null;
			
			authenticated: boolean;
		}
	}
}


export {};
