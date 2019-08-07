import * as express from 'express';
import {UserService} from '../service/index';

const router = express.Router();

export const UserRouterEndpoint = '/users';
export const UserRouter = router;

router.post('/', async (req, res) => {
    const user = req.body;
    const savedUser = await UserService.saveUser(user);
    res.status(201).json(savedUser);
});

router.post('/login', async (req, res) => {
    console.warn('testing');
    const {email, password} = req.body;
    const user = await UserService.getUserByLogin(email, password);
    if (user === null) {
        res.status(400).json(`{"error": "Invalid username or password given."}`);
    } else {
        req.session.userId = user._id;
        console.warn(req.session.userId);
        res.status(200).send();
    }
});

router.get('/verify', async (req, res) => {
    console.warn(req.session);
    if (req.session.userId) {
        return res.status(200).send();
    }
    return res.status(401).send();
});

router.get('/:id', async (req, res) => {
    const user = await UserService.getUserById(req.params.id);
    if (user === null) {
        res.status(400).json(`{"error": "No valid user with id ${req.params.id}"}`);
    } else {
        res.status(200).send(user);
    }
});
