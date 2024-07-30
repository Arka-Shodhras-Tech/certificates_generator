import { google } from 'googleapis';
import { config } from './config.js';

export const auth = new google.auth.GoogleAuth({
    credentials: config,
    scopes: "https://www.googleapis.com/auth/drive",
});