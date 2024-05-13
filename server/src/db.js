import dotenv from 'dotenv';
import { MongoClient } from "mongodb";
let db;
dotenv.config()
async function connectToDB(cb){
    const url =process.env.Database;
    const client = new MongoClient(url);
    await client.connect();
    db = client.db("Certificates");
    cb();
}

export { connectToDB, db };
