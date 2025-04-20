import { prisma } from "$lib/server/prisma.server";

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
  