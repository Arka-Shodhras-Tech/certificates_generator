import { auth } from "../google_drive/auth.js";
import { google } from "googleapis";

export const DeleteFile = async (file) => {
    const drive = google.drive({ version: 'v3', auth });
    return drive.files.delete({ fileId:file });
}