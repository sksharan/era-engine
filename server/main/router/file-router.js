import express from 'express'
import multer from 'multer'
import {
    getAllFileMetadata,
    getFileContentStream,
    getFileMetadata,
    uploadFiles
} from '../service/file-service'

const router = express.Router();
const upload = multer({});

export const FileRouterEndpoint = "/files";
export const FileRouter = router;

router.get('/view', (req, res) => {
    const promise = getAllFileMetadata();
    promise.then((metadata) => {
        res.render('file', {fileEndpoint: FileRouterEndpoint, files: metadata});
    })
    .catch(err => {
        res.status(500).send(err);
    })
});

router.get('/:id/content', (req, res) => {
    const promise = getFileMetadata(req.params.id);
    promise.then((metadata) => {
        if (metadata === null) {
            res.status(400).json(`{"error": "No file with id ${req.params.id}"}`);
        } else {
            res.attachment(metadata.filename);
            getFileContentStream(req.params.id).pipe(res);
        }
    })
    .catch(err => {
        res.status(500).send(err);
    })
});

router.get('/:id/metadata', (req, res) => {
    const promise = getFileMetadata(req.params.id);
    promise.then((metadata) => {
        if (metadata === null) {
            res.status(400).json(`{"error": "No file with id ${req.params.id}"}`);
        } else {
            res.status(200).send(metadata);
        }
    })
    .catch(err => {
        res.status(500).send(err);
    })
});

router.post('/', upload.any(), (req, res) => {
    if (!req.files) {
        res.status(400).send('No files to upload');
    }
    const promises = uploadFiles(req.files);
    Promise.all(promises)
        .then((files) => {
            res.status(201).send(files);
        })
        .catch(err => {
            res.status(500).send(err);
        })
});
