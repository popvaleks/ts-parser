import IUser from '../interfaces/user.interface';

export default class User implements IUser {
  public name: string;
  public age: number;

  constructor(user: IUser) {
    this.name = user.name;
    this.age = user.age;
  }
}