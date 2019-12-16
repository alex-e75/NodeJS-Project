import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'
var passwordHash = require('password-hash');

export class User {
    public username: string
    public email: string
    private _password: string = ""

    constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
        this.username = username;
        this.email = email;

        if (!passwordHashed) {
            this.setPassword(password)
        } else this._password = password
    }

    static fromDb(username: string, value: any): User {
        const [password, email] = value.split(":")
        return new User(username, email, password);
    }

    public setPassword(toSet: string): void {
        this._password = toSet;
    }

    public get password(): string {
        return this._password;
    }

    public validatePassword(toValidate: String): boolean {
        return this.password === toValidate;
    }
}

export class UserHandler {
    public db: any

    public get(username: string, callback: (err: Error | null, result?: User) => void) {
        this.db.get(`user:${username}`, function (err: Error, data: any) {
            if (err) callback(err)
            else if (data === undefined) callback(null, data)
            else callback(null, User.fromDb(username, data))
        })
    }

    public save(user: User, callback: (err: Error | null) => void) {
        this.db.put(`user:${user.username}`, `${user.password}:${user.email}`, (err: Error | null) => {
            callback(err)
        })
    }

    public delete(username: string, callback: (err: Error | null) => void) {
        this.db.delete(`user:${username}`, (err: Error | null) => {
            callback(err)
        })
    }

    constructor(path: string) {
        this.db = LevelDB.open(path)
    }
}