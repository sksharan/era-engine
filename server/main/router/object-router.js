import express from 'express'
import multer from 'multer'
import path from 'path'
import {createFromZip} from '../service/object-service'

const router = express.Router();
const upload = multer({
    storage: multer.diskStorage({})
});

export const ObjectRouterEndpoint = "/objects";
export const ObjectRouter = router;

router.get('/view', (req, res) => {
    res.render('object', {objectEndpoint: ObjectRouterEndpoint});
});

router.post('/', upload.any(), async (req, res) => {
    if (!req.files || req.files.length !== 1) {
        res.status(400).send('Must specify exactly one file');
        return;
    }
    if (path.extname(req.files[0].originalname) !== '.zip') {
        res.status(400).send(`Uploaded file '${req.files[0].originalname}' is not a zip file`);
        return;
    }
    const zipPath = path.join(req.files[0].destination, req.files[0].filename);
    try {
        await createFromZip(zipPath);
        res.status(201).send('Successfully uploaded zip');
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});
