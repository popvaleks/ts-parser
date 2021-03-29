import * as lowDB from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';
import IUser from '../interfaces/user.interface';
import User from '../models/user.model';
import constants from '../../constants/server';

const db = lowDB(new FileSync(constants.baseDir + 'db.json'));

export default class UserRepository {
  public static async setDefaults() {
    await db.defaults({ user: [{ name: 'Alex', age: 26 }], count: 0 }).write();
  }
  public static getData() {
    const users = db.get('users');
    return users;
  }
  public static setData(data: IUser) {
    db.get('users').push(data).write();
  }
}