import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
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