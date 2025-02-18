import { MongoClient } from "mongodb";
import { DB_URL } from "$env/static/private";

const client = new MongoClient(DB_URL);

export function db_connect() {
    console.log("[KITES | INFO]: Connecting to mongodb...");
    return client.connect();
}

export default client.db("Kites");