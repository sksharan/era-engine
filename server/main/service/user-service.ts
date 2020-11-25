import {UserDao} from '../dao/index';
import * as bcrypt from 'bcrypt';
import {User} from '../type';
import {ObjectId} from 'mongodb';

export const getUserById = (id: ObjectId | string): Promise<User> => {
    return UserDao.getUser(id);
};

export const saveUser = (user: User): Promise<User> => {
    const saltRounds = 12;
    var hash = bcrypt.hashSync(user.password, saltRounds);
    user.password = hash;
    return UserDao.saveUser(user);
};

export const getUserByLogin = async (email: string, password: string): Promise<User> => {
    const user = await UserDao.getUserByUsername(email);
    if (user === null) {
        return null;
    }
    return (await bcrypt.compare(password, user.password)) ? user : null;
};
