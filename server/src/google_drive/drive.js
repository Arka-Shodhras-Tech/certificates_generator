import express from 'express';
import fs from 'fs';
import { google } from 'googleapis';
const app = express()
app.use(express.json())
export const uploadToGoogleDrive = async (files) => {
    try {
        const oauth2Client = new google.auth.OAuth2(
            "481160337495-1b6e65o43di54ef5ihear9288k0hqrak.apps.googleusercontent.com",
            "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",
            "https://developers.google.com/oauthplayground"
        );
        oauth2Client.setCredentials({
            access_token: "ya29.a0AXooCgv40a-9DUZDh64WlDX1o6tHW2lUSu2kZG3IppZj06vAu07uRDYIEspmI2Z2zbKkRQvtHmi5x0lwILVxIBi4v4eH3TBTuGB7_j3iLrjeU3SMsJUM4u-Xk6VIOFgeMaSNNc8Hl0IDLfP2iNLxIinCoclXdFXn1TDPaCgYKAeoSARISFQHGX2MiBFe8RCa4yJTbRqCa2-nWAw0171"
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
        const folderName = 'My New Folder';
        const folderQuery = `'root' in parents and mimeType='application/vnd.google-apps.folder' and name='${folderName}'`;
        const folderSearchRes = await drive.files.list({
            q: folderQuery,
            fields: 'files(id)'
        });
        let folderId;
        if (folderSearchRes.data.files.length > 0) {
            folderId = folderSearchRes.data.files[0].id;
        } else {
            const folderMetadata = {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder'
            };
            const folderRes = await drive.files.create({
                requestBody: folderMetadata,
                fields: 'id'
            });
            folderId = folderRes.data.id;
        }
        const fileMetadata = {
            name: 'Sample_project_wad.png',
            parents: [folderId]
        };
        const media = {
            // mimeType: 'application/pdf',
            mimeType:"image/png",
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