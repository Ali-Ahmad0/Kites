import { prisma } from './prisma.server';

export async function get_total_users() {
    return await prisma.users.count();
}

export async function get_users_by_rank() {
    return await prisma.users.groupBy({
        by: ['rank'],
        _count: true,
        orderBy: {
            _count: {
                rank: 'desc'
            }
        }
    });
}

export async function get_total_posts() {
    return await prisma.forumPosts.count();
}

export async function get_posts_by_topic() {
    return await prisma.forumPosts.groupBy({
        by: ['topic'],
        _count: true,
        orderBy: {
            _count: {
                topic: 'desc'
            }
        }
    });
}

export async function get_posts_by_type() {
    return await prisma.forumPosts.groupBy({
        by: ['type'],
        _count: true,
        orderBy: {
            _count: {
                type: 'desc'
            }
        }
    });
}

export async function get_dashboard_data(user_rank: string) {
    if (user_rank === 'Admin') {
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