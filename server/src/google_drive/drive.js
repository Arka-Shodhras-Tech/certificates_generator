import dotenv from 'dotenv';
import express from 'express';
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import { Stream } from 'stream';
import { config } from './config.js';
dotenv.config()

const app = express()
app.use(express.json())
const auth = new GoogleAuth({
    credentials: config,
    scopes: "https://www.googleapis.com/auth/drive",
});

export const uploadToGoogleDrive = async (files, name, course, foldername) => {
    try {
        const drive = google.drive({ version: "v3", auth })
        const folderName = `Certificates`;
        const folderQuery = `'root' in parents and mimeType='application/vnd.google-apps.folder' and name='${folderName}'`;
        const folderSearchRes = await drive.files.list({
            q: folderQuery,
            fields: 'files(id)'
        });
        let parentFolderId;
        let folderId;
        const bufferStream = new Stream.PassThrough();
        bufferStream.end(files);
        if (folderSearchRes.data.files.length > 0) {
            parentFolderId = process.env.folderId;
        } else {
            const folderMetadata = {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder'
            };
            const folderRes = await drive.files.create({
                requestBody: folderMetadata,
                fields: 'id'
            });
            parentFolderId = folderRes.data.id;
        }
        if (parentFolderId) {
            const folderQuery = `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${foldername}'`;
            const folderSearchRes = await drive.files.list({
                q: folderQuery,
                fields: 'files(id)'
            });
            if (folderSearchRes.data.files.length > 0) {
                folderId = folderSearchRes.data.files[0].id;
            } else {
                const folderMetadata = {
                    name: foldername,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [parentFolderId]
                };
                const folderRes = await drive.files.create({
                    requestBody: folderMetadata,
                    fields: 'id'
                });
                folderId = folderRes.data.id;
            }
        }
        const fileMetadata = {
            name: `${course}.png`,
            parents: [folderId]
        };
        const media = {
            // mimeType: 'application/pdf',
            mimeType: "image/png",
            body: bufferStream
        };
        const result = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'webViewLink'
        });
        return result.data.webViewLink;
    } catch (error) {
        console.log(error);
        throw new Error("Error uploading file to Google Drive");
    }
};