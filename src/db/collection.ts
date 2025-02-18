import db from "$db/mongo";

export function collection(collection_name:string){
    return db.collection(collection_name);
}