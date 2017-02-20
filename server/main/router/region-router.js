const express = require('express');
const router = express.Router();
const Region = require('../model/region');

router.get('/', (req, res) => {
    Region.find((err, regions) => {
        if (err) {
            return console.error(err);
        }
        res.json(regions);
    });
});

module.exports = router;
