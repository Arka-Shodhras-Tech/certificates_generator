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
            access_token: "ya29.a0AXooCgvyf8mjuGOf9YKMYv8NIuaDt1nOsJM97b2v9eor-dgxEKiFYMBUckqyJfH710JKDiwvUIU7Vw68i-twj29RuAr0xQS2j_FaKaPjHsUMFheAhCKfdtlWEStq8QyZkAbUrahSo35wEFIQGGWCQvmLFOxcDXAU0phSaCgYKAV8SARISFQHGX2Miz3P0QIvVGT2X8R5u0OH9Fg0171",
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
            name: 'Sample_project_wad.pdf',
            parents: [folderId]
        };
        const media = {
            mimeType: 'application/pdf',
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