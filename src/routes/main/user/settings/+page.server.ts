import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { prisma } from '$lib/server/prisma.server';
import bcrypt from 'bcryptjs';

export const actions: Actions = {
    update_username: async ({ request, locals }) => {
        if (!locals.user) 
            throw redirect(303, '/login');

        const data = await request.formData();
        const username = data.get('username')?.toString();

        // Validation for username
        if (!username) {
            return fail(400, {
                username_error: "Username is required.",
                success: false
            });
        }

        // Check if username exists
        const user = await prisma.users.findUnique({
            where: { username }
        });

        if (user) {
            return fail(400, { 
                username_error: 'Username already taken',
                success: false
            });
        }

        // Update username in database
        await prisma.users.update({
            where: { id: locals.user.id },
            data: { username }
        });

        // Return success response
        return {
            username_success: true
        };
    },

    change_password: async ({ request, locals }) => {
        if (!locals.user) 
            throw redirect(303, '/login');
        
        const data = await request.formData();

        const current_password = data.get('current_password')?.toString();
        const new_password = data.get('new_password')?.toString();
        const confirm_password = data.get('confirm_password')?.toString();

        // Validation
        if (!current_password || !new_password || !confirm_password) {
            return fail(400, { 
                password_error: 'All fields are required',
                success: false
            });
        }

        if (new_password !== confirm_password) {
            return fail(400, { 
                password_error: 'New passwords do not match',
                success: false
            });
        }

        if (new_password.length < 8) {
            return fail(400, { 
                password_error: 'Password must be at least 8 characters',
                success: false
            });
        }

        // Verify current password
        const user = await prisma.users.findUnique({
            where: { id: locals.user.id }
        });

        if (!user || !await bcrypt.compare(current_password, user.password)) {
            return fail(400, { 
                password_error: 'Current password is incorrect',
                success: false
            });
        }

        // Update password in database
        const hashed_password = await bcrypt.hash(new_password, 10);
        await prisma.users.update({
            where: { id: locals.user.id },
            data: { 
                password: hashed_password
            }
        });
        
        return { password_success: true };
    }
};
