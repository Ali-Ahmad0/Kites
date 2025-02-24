import { get_collection } from "$db/collection";

export async function create_session(user_id : string) {
    const collection = get_collection("Sessions");
    const session_id = Math.random().toString(36).substring(2);

    await collection.insertOne({
        session: session_id,
        user_id: user_id,
        session_created: new Date(),
        
        // Expires in 7 days
        session_expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
    });

    return session_id;
}

export async function get_session(session_id : string) {
    const collection = get_collection("Sessions");
    const session = await collection.findOne({ session: session_id });

    if (session && session.session_expires > new Date()) {
        return session;
    }

    return null;
}

export async function delete_session(session_id : string) {
    const collection = get_collection("Sessions");
    await collection.deleteOne({ session: session_id });
}