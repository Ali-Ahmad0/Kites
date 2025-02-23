import db from "$db/mongo";


export function get_collection(collection_name:string) {
    return db.collection(collection_name);
}