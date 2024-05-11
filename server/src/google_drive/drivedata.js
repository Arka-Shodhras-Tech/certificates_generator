import dotenv from 'dotenv';
import express from 'express';
import { google } from 'googleapis';
dotenv.config();
const app = express();
app.use(express.json());
export const DataFromGoogleDrive = async () => {
    try {
        const images=[]
        const oauth2Client = new google.auth.OAuth2(
            process.env.clientId,
            process.env.clientSecret,
            process.env.directUrl
        );
        oauth2Client.setCredentials({
            access_token: process.env.accessToken
        });
        const drive = google.drive({
            version: 'v3',
            auth: oauth2Client
        });
        const folderName = 'Certificates';
        const folderQuery = `'root' in parents and mimeType='application/vnd.google-apps.folder' and name='${folderName}'`;
        const folderSearchRes = await drive.files.list({
            q: folderQuery,
            fields: 'files(id)'
        });
        if (folderSearchRes.data.files.length === 0) {
            throw new Error('Certificates folder not found in Google Drive.');
        }
        const parentFolderId = folderSearchRes.data.files[0].id;
        const subFolderQuery = `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder'`;
        const subFolderSearchRes = await drive.files.list({
            q: subFolderQuery,
            fields: 'files(id,name,webViewLink)'
        });
        // console.log(subFolderSearchRes.data.files)
        if (subFolderSearchRes.data.files.length === 0) {
            throw new Error('No subfolders found within the Certificates folder.');
        }
        for (let i = 0; i < subFolderSearchRes.data.files.length; i++) {
            const subFolderId = subFolderSearchRes.data.files[i].id;
            const imageQuery = `'${subFolderId}' in parents and mimeType contains 'image/'`;
            const imageSearchRes = await drive.files.list({
                q: imageQuery,
                fields: 'files(id, name,webViewLink)'
            });

            images[i]= imageSearchRes.data.files;
        }
        return images
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};
