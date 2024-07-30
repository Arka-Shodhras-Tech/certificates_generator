import dotenv from 'dotenv';
import { google } from 'googleapis';
import { Stream } from 'stream';
import { auth } from '../google_drive/auth.js';
dotenv.config()

export const uploadPhotos = async (files, teamcode) => {
    try {
        const drive = google.drive({ version: "v3", auth });
        let parentFolderId = process.env.folderId;
        let folderId;
        if (parentFolderId) {
            const folderQuery = `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${teamcode}'`;
            const folderSearchRes = await drive.files.list({
                q: folderQuery,
                fields: 'files(id)'
            });
            if (folderSearchRes.data.files.length > 0) {
                folderId = folderSearchRes.data.files[0].id;
            } else {
                const folderMetadata = {
                    name: teamcode,
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
        const uploadPromises = files?.map(async (file) => {
            const bufferStream = new Stream.PassThrough();
            bufferStream.end(file.buffer);
            const fileMetadata = {
                name: file?.originalname,
                parents: [folderId],
            };
            const media = {
                mimeType: "image/png",
                body: bufferStream,
            };
            const result = await drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: 'webViewLink',
            });
            return result.data.webViewLink;
        });
        const uploadResults = await Promise.all(uploadPromises);
        return uploadResults;
    } catch (error) {
        console.log(error);
        throw new Error("Error uploading files to Google Drive");
    }
};