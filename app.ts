import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as cors from 'cors';

import * as multer from 'multer';

import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as fileStore from 'session-file-store';

import Router from './routes';
import constants from './constants/server';
import UserRepository from './db/repositories/user.repository';

export class App {
  private static _instance: App;
  private _app: express.Application;
  private readonly _port: number;
  private _db: any;

  private constructor(port: number = constants.port) {
    this._app = express();
    this._port = port;

    this._app.use(cors());
    this._app.use(express.static(constants.publicDir));
    this._app.set('views', path.join(constants.srcDir, 'views/'));
    this._app.set('view engine', 'pug')

    this.setMiddlewares();

    this.setSession();

    this._app.use(this.logError);
    this._app.use(this.errorHandler);
  }

  private logError(err: Error, req: Request, res: Response, next: NextFunction) {
    console.log(err.stack);
    next(err);
  }
  private errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    res.status(500);
    res.send({error: err});
  }

  private setMiddlewares() {
    this._app.use(cookieParser());
    this._app.use(bodyParser.text());
    this._app.use(bodyParser.urlencoded( {extended: true}));
    this._app.use(bodyParser.json());
    // this._app.use(express.text());
    // this._app.use(express.urlencoded( {extended: true}));
    // this._app.use(express.json());
    this._app.use(multer().any());
  }

  private setSession() {
    const FileStore = fileStore(session);
    this._app.use(
      session({
        secret: 'secret',
        cookie: {
          path: '/',
          httpOnly: true,
          maxAge: null,
        },
        saveUninitialized: true,
        resave: true,
        store: new FileStore(),
      })
    )
  }

  public static get Instance(): App {
    return this._instance || (this._instance = new this());
  }

  public init() {
    UserRepository.setDefaults();
    this._app.listen(this._port, () => console.log(`App listen in port: ${this._port}`));
  }
}

const app = App.Instance;
app.init();