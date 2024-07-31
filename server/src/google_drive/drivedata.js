import dotenv from 'dotenv';
import { google } from 'googleapis';
import { auth } from './auth.js';

dotenv.config();

export const DataFromGoogleDrive = async () => {
    try {
        const images=[]    
        const drive=google.drive({ version: "v3", auth })
        const parentFolderId = process.env.folderId;
        const subFolderQuery = `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder'`;
        const subFolderSearchRes = await drive.files.list({
            q: subFolderQuery,
            fields: 'files(id,name,webViewLink)'
        });
        if (subFolderSearchRes.data.files.length === 0) {
            throw new Error('No subfolders found within the Certificates folder.');
        }
        for (let i = 0; i < subFolderSearchRes.data.files.length; i++) {
            const subFolderId = subFolderSearchRes.data.files[i].id;
            const subFolderName = subFolderSearchRes.data.files[i].name;
            const imageQuery = `'${subFolderId}' in parents and mimeType contains 'image/'`;
            const imageSearchRes = await drive.files.list({
                q: imageQuery,
                fields: 'files(id, name,webViewLink)'
            });
            images[i]= imageSearchRes.data.files;
            console.log(imageSearchRes)
        }
        return images
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};
