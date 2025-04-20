import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma.server';
import bcrypt from 'bcryptjs';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        return { user: null };
    }
    return {
        user: {
            username: locals.user.username,
            email: 'email' in locals.user ? locals.user.email : null
        }
    };
};

export const actions: Actions = {
    updateUsername: async ({ request, locals }) => {
        const formData = await request.formData();
        const username = formData.get('username')?.toString().trim();

        // Validation
        if (!username) {
            return fail(400, { 
                usernameError: 'Username is required',
                usernameSuccess: false
            });
        }

        if (username.length < 3) {
            return fail(400, { 
                usernameError: 'Username must be at least 3 characters',
                usernameSuccess: false
            });
        }

        // Check if username exists
        const existingUser = await prisma.users.findUnique({
            where: { username }
        });

        if (existingUser) {
            return fail(400, { 
                usernameError: 'Username already taken',
                usernameSuccess: false
            });
        }

        // Update username
        if (!locals.user) {
            return fail(400, { 
                usernameError: 'User is not authenticated',
                usernameSuccess: false
            });
        }

        await prisma.users.update({
            where: { id: locals.user.id },
            data: { username }
        });
    
        throw redirect(303, '/user/settings');
    },

    changePassword: async ({ request, locals }) => {
        if (!locals.user) 
            throw redirect(303, '/login');
        
        const formData = await request.formData();
        const currentPassword = formData.get('currentPassword')?.toString();
        const newPassword = formData.get('newPassword')?.toString();
        const confirmPassword = formData.get('confirmPassword')?.toString();

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            return fail(400, { 
                passwordError: 'All fields are required',
                passwordSuccess: false
            });
        }

        if (newPassword !== confirmPassword) {
            return fail(400, { 
                passwordError: 'New passwords do not match',
                passwordSuccess: false
            });
        }

        if (newPassword.length < 8) {
            return fail(400, { 
                passwordError: 'Password must be at least 8 characters',
                passwordSuccess: false
            });
        }

        // Verify current password
        const user = await prisma.users.findUnique({
            where: { id: locals.user.id }
        });

        if (!user || !await bcrypt.compare(currentPassword, user.password)) {
            return fail(400, { 
                passwordError: 'Current password is incorrect',
                passwordSuccess: false
            });
        }

        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.users.update({
            where: { id: locals.user.id },
            data: { 
                password: hashedPassword
            }
        });
        
        throw redirect(303, '/user/settings');
    }
};