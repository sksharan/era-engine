import express from 'express';
import Region from '../model/region';

const router = express.Router();

router.get('/', (req, res) => {
    Region.find((err, regions) => {
        if (err) {
            return console.error(err);
        }
        res.json(regions);
    });
});

module.exports = router;
