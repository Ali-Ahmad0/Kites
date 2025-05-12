// src/lib/server/dashboard.server.ts
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