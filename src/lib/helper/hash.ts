import bcrypt from "bcryptjs";

export async function hash(text: any) {
    // Hash plaintext using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(text, salt);
    return hashed;
    
}