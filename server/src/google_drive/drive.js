import express from 'express';
import fs from 'fs';
import { google } from 'googleapis';
const app = express()
app.use(express.json())
export const uploadToGoogleDrive = async (files, name, course, mail) => {
    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.clientId,
            process.env.clientSecret,
            process.env.directUrl
        );
        oauth2Client.setCredentials({
            access_token: process.env.accessToken
        });

        const scopes = [
            "https://www.googleapis.com/auth/drive",
        ];
        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes
        });

        oauth2Client.on('tokens', (tokens) => {
            console.log("ON TOKENS");
            if (tokens.refresh_token) {
                console.log("Refresh Token: " + tokens.refresh_token);
            }
            console.log("New Access Token: " + tokens.access_token);
        });
        const drive = google.drive({
            version: 'v3',
            auth: oauth2Client
        });
        const folderName = `Certificates`;
        const folderQuery = `'root' in parents and mimeType='application/vnd.google-apps.folder' and name='${folderName}'`;
        const folderSearchRes = await drive.files.list({
            q: folderQuery,
            fields: 'files(id)'
        });
        let parentFolderId;
        let folderId;
        if (folderSearchRes.data.files.length > 0) {
            parentFolderId = folderSearchRes.data.files[0].id;
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
            const folderQuery = `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${mail}'`;
            const folderSearchRes = await drive.files.list({
                q: folderQuery,
                fields: 'files(id)'
            });
            if (folderSearchRes.data.files.length > 0) {
                folderId = folderSearchRes.data.files[0].id;
            } else {
                const folderMetadata = {
                    name: mail,
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
            body: fs.createReadStream(files)
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