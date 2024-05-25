import cors from 'cors';
import express from 'express';
import fs from 'fs';
import Multer from "multer";
import { connectToDB, db } from "./db.js";
import { uploadToGoogleDrive } from './google_drive/drive.js';
import { DataFromGoogleDrive } from './google_drive/drivedata.js';
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
    await db.collection('Signup').findOne({ Gmail: req.params.email, Course: req.params.course })
        .then(async (details) => {
            if (details) {
                res.status(200).json({ message: "exist" });
            }
            else {
                await db.collection('Signup').insertOne({
                    Gmail: req.params.email,
                    Name: req.params.name,
                    Course: req.params.course,
                    Time: req.params.time,
                    Pending: true,
                    Approve: false,
                    Reject: false,
                    Archive: false
                })
                    .then((details) => {
                        res.json({ data: details });
                    })
                    .catch((e) => console.log(e))
            }
        })
        .catch((e) => console.log(e))
})


const multer = Multer({
    storage: Multer.diskStorage({
        destination: function (req, file, callback) {
            return callback(null, `src/google_drive`);
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
        if (req.body.mail) {
            await uploadToGoogleDrive(req.file.path, req.body.name, req.body.course, req.body.mail)
                .then((result) => {
                    fs.unlinkSync(req.file.path);
                    res.status(200).json({ success: true, link: result });
                })
                .catch((e) => {
                    console.log(e)
                    fs.unlinkSync(req.file.path);
                }
                )
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/retrivepdf', async (req, res) => {
    await DataFromGoogleDrive().then((result) => {
        result.map((res) => (res.map((res1) => console.log(res1.webViewLink))))
    }).catch((e) => console.log(e))
})

app.post('/storepdftomongo', async (req, res) => {
    await db.collection('Certificates').insertOne({ Gmail: req.body.mail, Link: req.body.link })
        .then((details) => {
            res.status(200).json({ success: true });
        })
        .catch((e) => console.log(e))
});

app.post('/retrivepdffrommongo', async (req, res) => {
    await db.collection('Certificates').find().toArray()
        .then((details) => {
            res.status(200).json({ success: true, details });
        })
        .catch((e) => console.log(e))
})

app.post('/archive/:mail/:course', async (req, res) => {
    await db.collection('Signup').findOneAndUpdate({ Gmail: req.params.mail, Course: req.params.course }, { $set: { Pending: false, Archive: true, Reject: false } })
        .then((details) => {
            res.status(200).json({ success: true });
        })
        .catch((e) => console.log(e))
});

app.post('/reject/:mail/:course', async (req, res) => {
    await db.collection('Signup').findOneAndUpdate({ Gmail: req.params.mail, Course: req.params.course }, { $set: { Pending: false, Archive: false, Reject: true } })
        .then((details) => {
            res.status(200).json({ success: true });
        })
        .catch((e) => console.log(e))
});

app.post('/pending/:mail/:course', async (req, res) => {
    await db.collection('Signup').findOneAndUpdate({ Gmail: req.params.mail, Course: req.params.course }, { $set: { Pending: true, Reject: false, Archive: false } })
        .then((details) => {
            res.status(200).json({ success: true });
        })
        .catch((e) => console.log(e))
});

app.post('/delete/:mail/:course', async (req, res) => {
    await db.collection('Signup').deleteOne({ Gmail: req.params.mail, Course: req.params.course })
        .then((details) => {
            res.status(200).json({ success: true });
        })
        .catch((e) => console.log(e))
});

app.post('/approve/:mail/:course', async (req, res) => {
    await db.collection('Signup').findOneAndUpdate({ Gmail: req.params.mail, Course: req.params.course }, { $set: { Pending: false, Archive: false, Approve: true } })
        .then((details) => {
            res.status(200).json({ success: true });
        })
        .catch((e) => console.log(e))
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