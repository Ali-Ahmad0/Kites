import { generate_otp } from '$lib/server/otp.server.js';
import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
    try {
        // Resend the OTP to user's email
        const email = cookies.get('otp_email') as string;
        await generate_otp(email);

        return json({ success: true });
    
    } catch (e) {
        return json({ error: `Internal server error: ${e}` }, { status: 500 });
    }

}