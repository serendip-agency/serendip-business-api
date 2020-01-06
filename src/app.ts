import {
  AuthService,
  DbService,
  FaxService,
  EmailService,
  ViewEngineService,
  AuthController,
  ServerController,
  start,
  Server,
  SmsIrService,
  HttpService,
  WebSocketService
} from "serendip";
import * as os from 'os';
import { join } from "path";
import { BusinessController } from "./controllers";
import { EntityController } from "./controllers/EntityController";
import { BusinessService } from "./services/BusinessService";
import { DashboardService } from "./services/DashboardService";
import { StorageService } from "./services/StorageService";
import { StorageController } from "./controllers/StorageController";
import { MongodbProvider } from "serendip-mongodb-provider";
import * as dotenv from "dotenv";
import { HooksController } from "./controllers/HooksController";
import { EntityService } from "./services";
import { MingodbProvider } from "serendip-mingodb-provider";
import * as path from 'path';
import * as fs from 'fs-extra'
dotenv.config();

Server.dir = __dirname;


AuthService.configure({
  tokenExpireIn: 1000 * 60 * 60,
  // smsProvider: "SmsIrService"
});

const mingoPath = path.join(os.homedir(),'.serendip','mingo');
fs.ensureDir(mingoPath);

DbService.configure({
  defaultProvider: "Mingodb",
  providers: {
    Mingodb: {
      object: new MingodbProvider(),
      options: {
        mingoPath
      }
    }
  }
});

EmailService.configure({
  smtp: {
    host: process.env["email.smtp.host"],
    username: process.env["email.smtp.username"],
    password: process.env["email.smtp.password"],
    port: parseInt(process.env["email.smtp.port"]) || 587,
    ssl: process.env["email.smtp.ssl"] == "true"
  },
  templatesPath: join(__dirname, "..", "storage", "email-templates")
});

// SmsIrService.configure({
//   lineNumber: process.env["smsIr.lineNumber"],
//   apiKey: process.env["smsIr.apiKey"],
//   secretKey: process.env["smsIr.secretKey"],
//   verifyTemplate: process.env["smsIr.verifyTemplate"] as any,
//   verifyTemplateWithIpAndUseragent: process.env[
//     "smsIr.verifyTemplateWithIpAndUseragent"
//   ] as any
// });

HttpService.configure({
  beforeMiddlewares: [
    (req, res, next) => {
      req.url = req.url.replace(/\/\//g, "/");

      next();
    }
  ],
  cors: "*",
  httpPort:
    (process.env.PORT as any) || (process.env["core.httpPort"] as any) || 2040,
  staticPath: join(__dirname, '..', "public"),
  controllers: [
    AuthController,
    ServerController,
    BusinessController,
    EntityController,
    ServerController,
    StorageController,
    HooksController
  ]
});

export async function run(mode?: string | 'single-user') {

  BusinessService.mode = mode;

  return start({
    logging: (process.env["core.logging"] as any) || "info",

    cpuCores: (process.env["core.cpuCores"] as any) || 1,

    services: [
      HttpService,
      // SmsIrService,
      EmailService,
      FaxService,
      DbService,
      AuthService,
      ViewEngineService,
      BusinessService,
      EntityService,
      WebSocketService,
      StorageService,
      DashboardService,
      StorageService
      // ClientService
    ]
  })


}