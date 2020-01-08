import { observable } from 'mobx'

export interface IUserRecord {
  name: string
  age: number
  key: string
}

export class User {
  /** 用户列表 */
  @observable.shallow
  public list: IUserRecord[] = []
}

export const user = new User()
