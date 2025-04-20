import type { PrismaClient } from "@prisma/client/extension";

declare global {
	namespace App {
		interface Locals {
			user: {
				id: string, email: string, username: string
			} | null;

			authenticated: boolean;
		}
	}
}


export {};
