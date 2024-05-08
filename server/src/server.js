import cors from 'cors';
import express from 'express';
import fs from 'fs';
import Multer from "multer";
import { connectToDB, db } from "./db.js";
import { uploadToGoogleDrive } from './google_drive/drive.js';
const app = express()
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.json("server is running successfully!");
})

app.post('/student/:gmail', async (req, res) => {
    await db.collection('Signup').findOne({ Gmail: req.params.gmail })
        .then((details) => {
            res.json(details);
        })
        .catch((e) => console.log(e))
})

app.post('/signup/:email/:name/:course/:time', async (req, res) => {
    await db.collection('Signup').insertOne({
        Gmail: req.params.email,
        Name: req.params.name,
        Course: req.params.course,
        Time: req.params.time,
        Pending: true,
        Approve: false,
        Reject: false
    })
        .then((details) => {
            res.json(details);
        })
        .catch((e) => console.log(e))
})


const multer = Multer({
    storage: Multer.diskStorage({
        destination: function (req, file, callback) {
            return callback(null, `./files`);
        },
        filename: function (req, file, callback) {
            return callback(null, Date.now() + "_" + file.originalname);
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

app.post('/storepdf', multer.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            console.log("No file uploaded");
            res.status(400).send("No file uploaded.");
            return;
        }
        await uploadToGoogleDrive(req.file.path)
            .then((result) => {
                fs.unlinkSync(req.file.path);
                res.status(200).json({ success: true, link: result });
            })
            .catch((e) => {
                console.log(e)
                fs.unlinkSync(req.file.path);
            }
            )
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});



app.post('/students', async (req, res) => {
    await db.collection("Signup").find().toArray()
        .then((details) => {
            res.json(details);
        })
        .catch((e) => console.log(e))
})


connectToDB(() => {
    app.listen(8000, () => {
        console.log("server running at 8000");
    })
})