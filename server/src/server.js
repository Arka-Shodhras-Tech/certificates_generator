import cors from 'cors';
import express from 'express';
import Multer from "multer";
import { connectToDB, db } from "./db.js";
import { uploadToGoogleDrive } from './google_drive/drive.js';
import { DataFromGoogleDrive } from './google_drive/drivedata.js';
import { DeleteFile } from './hackathon/deletefile.js';
import { DeleteFolder } from './hackathon/deletefolder.js';
import { ShowPhotos } from './hackathon/showphotos.js';
import { uploadPhotos } from './hackathon/uploadphotos.js';
import { TeamPhotos } from './hackathon/teamphotos.js';
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


const initiateMulter = () => {
    return async (req, res, next) => {
        const storage = Multer.memoryStorage();
        const upload = Multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } });
        const uploadFn = upload.any();
        uploadFn(req, res, function (err) {
            if (err) {
                console.error(err);
                return next(err);
            }
            next();
        });
    };
}

app.post('/storepdf', initiateMulter(), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            console.log("No file uploaded");
            return res.status(400).send("No file uploaded.");
        }
        const file = req.files;
        if (req.body.mail) {
            try {
                const result = await uploadToGoogleDrive(file, req.body.name, req.body.course, req.body.mail);
                res.status(200).json({ success: true, link: result });
            } catch (e) {
                console.error(e);
                res.status(500).json({ error: "Error uploading file" });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/retrivepdf', async (req, res) => {
    await DataFromGoogleDrive().then((result) => {
        console.log(result.map((val) => val?.Link?.map((photo) => photo?.webViewLink)))
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

app.post('/uploadphotos', initiateMulter(), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            console.log("No file uploaded");
            return res.status(400).send("No file uploaded.");
        }
        const file = req.files;
        if (req.body.teamname) {
            try {
                const result = await uploadPhotos(file, req.body.teamname);
                res.status(200).json({ message: "upload photos sucessfully", link: result });
            } catch (e) {
                console.error(e);
                res.json({ error: "Error uploading file" });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/showphotos', async (req, res) => {
    await ShowPhotos().then((result) => {
        res.json(result)
    }).catch((e) => console.log(e))
})

app.post('/teamhotos', async (req, res) => {
    await TeamPhotos(req.body.team,res).then((result) => {
        res.json(result)
    }).catch((e) => console.log(e))
})

app.post('/deletephoto', async (req, res) => {
    await DeleteFile(req.body.id)
        .then(() => {
            res.json({ message: 'delete photo' })
        }).catch((e) => console.log(e))
})

app.post('/deleteallphotos', async (req, res) => {
    await DeleteFolder(req.body.id)
        .then((result) => {
            res.json({ message: 'delete folder' })
        }).catch((e) => console.log(e))
})


connectToDB(() => {
    app.listen(9877, () => {
        console.log("server running at 9877");
    })
})