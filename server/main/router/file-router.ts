import * as express from 'express';
import * as multer from 'multer';
import {FileService} from '../service/index';

const router = express.Router();
const upload = multer({});

export const FileRouterEndpoint = '/files';
export const FileRouter = router;

router.get('/metadata', async (req, res) => {
    res.status(200).json(await FileService.getAllFileMetadata());
});

router.get('/view', async (req, res) => {
    const metadata = await FileService.getAllFileMetadata();
    res.render('file', {fileEndpoint: FileRouterEndpoint, files: metadata});
});

router.get('/:id/content', async (req, res) => {
    const metadata = await FileService.getFileMetadata(req.params.id);
    if (metadata === null) {
        res.status(400).json(`{"error": "No file with id ${req.params.id}"}`);
    } else {
        res.attachment(metadata.filename);
        FileService.getFileContentStream(req.params.id).pipe(res);
    }
});

router.get('/:id/metadata', async (req, res) => {
    const metadata = await FileService.getFileMetadata(req.params.id);
    if (metadata === null) {
        res.status(400).json(`{"error": "No file with id ${req.params.id}"}`);
    } else {
        res.status(200).send(metadata);
    }
});

router.post('/', upload.any(), async (req, res) => {
    if (!req.files) {
        res.status(400).send('No files to upload');
        return;
    }
    let files = [];
    for (let file of FileService.uploadFiles(req.files)) {
        files.push(await file);
    }
    res.status(201).send(files);
});
