import dotenv from 'dotenv';
import { google } from 'googleapis';
import { Stream } from 'stream';
import { auth } from './auth.js';
dotenv.config()

export const uploadToGoogleDrive = async (files,name, course, foldername) => {
    try {
        const drive = google.drive({ version: "v3", auth });
        let parentFolderId = process.env.folderId;
        let folderId;
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
        const uploadPromises = files?.map(async (file, index) => {
            const bufferStream = new Stream.PassThrough();
            bufferStream.end(file.buffer);
            const fileMetadata = {
                name: `${course}_${index + 1}.png`,
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