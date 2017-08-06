import express from 'express'

const router = express.Router();

router.get('/', (req, res) => {
    res.render('object');
});

export const ObjectRouterEndpoint = "/objects";
export const ObjectRouter = router;
