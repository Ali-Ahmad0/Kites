import { db_connect } from "$db/mongo";


db_connect().then(() : void => {
    console.log("[KITES | INFO]: Connected to database succesfully!");
}).catch(e => {console.error("[KITESA | ERROR]: Unable to connect to database")})
