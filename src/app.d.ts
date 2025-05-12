/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PrismaClient } from "@prisma/client/extension";

declare global {
	namespace App {
		interface Locals {
			user: {
				id: string, email: string, username: string
			} | null;

			authenticated: boolean;
		}
		interface PageData {
			admin_stats?: {
				total_users: number;
				total_posts: number;
				users_by_rank: { rank: string; _count: number }[];
				posts_by_topic: { topic: string; _count: number }[];
				posts_by_type: { type: string; _count: number }[];
			};
		}
	}
}

export {};
