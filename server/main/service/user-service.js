import {UserDao} from '../dao/index';
import * as bcrypt from 'bcrypt';

export const getUserById = id => {
    return UserDao.getUser(id);
};

export const saveUser = user => {
    const saltRounds = 12;
    var hash = bcrypt.hashSync(user.password, saltRounds);
    user.password = hash;
    return UserDao.saveUser(user);
};

export const getUserByLogin = async (email, password) => {
    const user = await UserDao.getUserByUsername(email);
    if (user === null) {
        return null;
    }
    return (await bcrypt.compare(password, user.password)) ? user : null;
};
