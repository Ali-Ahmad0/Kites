// src/lib/helper/dashboard.ts
import {
    get_total_users,
    get_users_by_rank,
    get_total_posts,
    get_posts_by_topic,
    get_posts_by_type
} from '$lib/server/dashboard.server';

export async function get_dashboard_data(user_rank: string) {
    if (user_rank === 'admin') {
        return {
            total_users: await get_total_users(),
            users_by_rank: await get_users_by_rank(),
            total_posts: await get_total_posts(),
            posts_by_topic: await get_posts_by_topic(),
            posts_by_type: await get_posts_by_type()
        };
    }
    return null;
}