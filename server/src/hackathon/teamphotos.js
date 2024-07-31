import dotenv from 'dotenv';
import { google } from 'googleapis';
import { auth } from '../google_drive/auth.js';

dotenv.config();

export const TeamPhotos = async (team, res) => {
    try {
        const images = [];
        const drive = google.drive({ version: "v3", auth });
        let parentFolderId = process.env.folderId;
        const folderQuery = `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${team}'`;
        const folderSearchRes = await drive.files.list({
            q: folderQuery,
            fields: 'files(id, name)'
        });
        if (folderSearchRes.data.files.length > 0) {
            const folder = folderSearchRes.data.files[0];
            const folderId = folder.id;
            const subFolderName = folder.name;
            const imageQuery = `'${folderId}' in parents and mimeType contains 'image/'`;
            const imageSearchRes = await drive.files.list({
                q: imageQuery,
                fields: 'files(id, name, webViewLink)'
            });
            images.push({
                folder: subFolderName,
                Links: imageSearchRes.data.files
            });
            return images;
        } else {
            res.send({ error: 'Folder not found' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};
