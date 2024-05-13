import dotenv from 'dotenv';
import express from 'express';
import { google } from 'googleapis';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
const auth = new google.auth.GoogleAuth({
    keyFile: `${__dirname}/apikeys.json`,
    scopes: "https://www.googleapis.com/auth/drive",
  });
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
            const imageQuery = `'${subFolderId}' in parents and mimeType contains 'image/'`;
            const imageSearchRes = await drive.files.list({
                q: imageQuery,
                fields: 'files(id, name,webViewLink)'
            });
            // for (const res of imageSearchRes.data.files) {
            //     try {
            //       const fileMetadata = await drive.files.get({
            //         fileId: res.id,
            //         fields: 'id, name, owners',
            //       });
            //       const owners = fileMetadata.data.owners;
            //       console.log('File owners:', owners);
            //     } catch (error) {
            //       console.error('Error retrieving file metadata:', error);
            //     }
            //   }
              
            images[i]= imageSearchRes.data.files;
        }
        return images
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};
