import { NODEMAILER_EMAIL_ID, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REDIRECT_URI, OAUTH_REFRESH_TOKEN } from "$env/static/private";
import { prisma } from "$lib/server/prisma.server";
import { google } from "googleapis"
import nodemailer from 'nodemailer'

const oauth_client = new google.auth.OAuth2(
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    OAUTH_REDIRECT_URI
);

oauth_client.setCredentials({
    refresh_token: OAUTH_REFRESH_TOKEN
})

// Nodemailer transporter with OAuth2
const create_transporter = async () => {
    try {
        const access_token = await oauth_client.getAccessToken();

        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: NODEMAILER_EMAIL_ID,
                clientId: OAUTH_CLIENT_ID,
                clientSecret: OAUTH_CLIENT_SECRET,
                refreshToken: OAUTH_REFRESH_TOKEN,
                accessToken: access_token.token || ''
            }
        });
    
    } catch (e) {
        console.error('[KITES | ERROR]: Error getting access tokens', e);
    }
};

const OTP_LENGTH = 6;
const OTP_DIGITS = '0123456789'

export async function generate_otp(email: string) {
    // Generate random 6 digit OTP code
    let code = '';
    for (let i = 0; i < OTP_LENGTH; i++) {
        code += OTP_DIGITS.charAt(Math.floor(Math.random() * OTP_DIGITS.length));
    }

    // Code expires within 5 minutes
    const code_expires = new Date();
    code_expires.setMinutes(code_expires.getMinutes() + 5);

    // Store OTP in database
    await prisma.otp.create({
        data: {
            email: email,
            code: code,
            code_expires: code_expires
        }    
    });

    // Send OTP using nodemailer
    try {
        const transporter = await create_transporter();
        if (!transporter) {
            console.error('[KITES | ERROR]: Transporter is undefined');
            return;
        }

        const mail_options = {
            from: `"Kites" <${NODEMAILER_EMAIL_ID}>`,
            to: email,
            subject: 'Your OTP for Account Verification',
            text: `Your OTP is: ${code}`,
            html: `
                <div>
                    <h2>Account Verification</h2>
                    <p>Your OTP code is: <strong>${code}</strong></p>
                    <p>This code will expire in 5 minutes.</p>
                </div>
            `
        };

        await transporter.sendMail(mail_options);
    } catch (e) {
        console.error('[KITES | ERROR]: Failed to send email:', e);
    }

    return code;
}

export async function validate_otp(email: string, code: string) {
    // Find the most recent valid OTP for this email
    const otp = await prisma.otp.findFirst({
        where: {
            email: email,
            used: false,
            code_expires: { gte: new Date() }
      },
        orderBy: { code_expires: 'desc' }
    });
  
    if (!otp) {
        return false;
    }
  
    // Check if code matches
    if (otp.code !== code) {
        return false;
    }
  
    // Mark OTP as used
    await prisma.otp.update({
        where: { id: otp.id },
        data: { used: true }
    });
  
    return true;
}
  