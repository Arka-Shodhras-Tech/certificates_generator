// const folderName = `Certificates`;
// const folderQuery = `'root' in parents and mimeType='application/vnd.google-apps.folder' and name='${folderName}'`;
// const folderSearchRes = await drive.files.list({
//     q: folderQuery,
//     fields: 'files(id)'
// });

// if (folderSearchRes.data.files.length > 0) {
//     parentFolderId = process.env.folderId;
// } else {
//     const folderMetadata = {
//         name: folderName,
//         mimeType: 'application/vnd.google-apps.folder'
//     };
//     const folderRes = await drive.files.create({
//         requestBody: folderMetadata,
//         fields: 'id'
//     });
//     parentFolderId = folderRes.data.id;
// }