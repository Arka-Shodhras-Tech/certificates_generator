import dotenv from 'dotenv';
import { google } from "googleapis";
import { auth } from "../google_drive/auth.js";
dotenv.config()

export const DeleteFolder = async (folder, res) => {
    const drive = google.drive({ version: "v3", auth });
    let parentFolderId = process.env.folderId
    let folderId;
    const folderQuery = `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${folder}'`;
    const folderSearchRes = await drive.files.list({
        q: folderQuery,
        fields: 'files(id)'
    });
    if (folderSearchRes.data.files.length > 0) {
        folderId = folderSearchRes.data.files[0].id;
        const drive = google.drive({ version: 'v3', auth });
        return drive.files.delete({ fileId: folderId })
    } else {
        res.send({ error: 'folder not found' })
    }
}