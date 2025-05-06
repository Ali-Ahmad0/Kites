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
      const data = await request.formData();
      const username = data.get('username');

      // Validation for username
      if (!username || typeof username !== 'string') {
        return fail(400, {
          username: {
            success: true,
            usernameError: "Username is required.",
          }
        });
      }

      // Check if username exists
      const existingUser = await prisma.users.findUnique({
          where: { username }
      });

      if (existingUser) {
          return fail(400, { 
              action: 'updateUsername',
              usernameError: 'Username already taken',
              success: false
          });
      }

      // Check if user is authenticated
      if (!locals.user) {
          return fail(400, { 
              action: 'updateUsername',
              usernameError: 'User is not authenticated',
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
          action: 'updateUsername',
          usernameSuccess: true
      };
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
                action: 'changePassword',
                passwordError: 'All fields are required',
                success: false
            });
        }

        if (newPassword !== confirmPassword) {
            return fail(400, { 
                action: 'changePassword',
                passwordError: 'New passwords do not match',
                success: false
            });
        }

        if (newPassword.length < 8) {
            return fail(400, { 
                action: 'changePassword',
                passwordError: 'Password must be at least 8 characters',
                success: false
            });
        }

        // Verify current password
        const user = await prisma.users.findUnique({
            where: { id: locals.user.id }
        });

        if (!user || !await bcrypt.compare(currentPassword, user.password)) {
            return fail(400, { 
                action: 'changePassword',
                passwordError: 'Current password is incorrect',
                success: false
            });
        }

        // Update password in database
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.users.update({
            where: { id: locals.user.id },
            data: { 
                password: hashedPassword
            }
        });
        
        return {
            action: 'changePassword',
            success: true
        };
    }
};
