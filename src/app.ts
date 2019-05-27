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

import { join } from "path";
import { BusinessController } from "./controllers";
import { EntityController } from "./controllers/EntityController";
import { BusinessService } from "./services/BusinessService";
import { EntityService, ProfileService } from "./services";
import { DashboardService } from "./services/DashboardService";
import { StorageService } from "./services/StorageService";
import { StorageController } from "./controllers/StorageController";
import { MongodbProvider } from "serendip-mongodb-provider";
import { GriddbProvider } from "serendip-griddb-provider";
import * as dotenv from "dotenv";
import { EventEmitter } from "events";
import { ClientService } from "./services/ClientService";
import { HooksController } from "./controllers/HooksController";

dotenv.config();

Server.dir = __dirname;

AuthService.configure({
  tokenExpireIn: 1000 * 60 * 60,
  smsProvider: "SmsIrService"
});

DbService.configure({
  defaultProvider: "Mongodb",
  providers: {
    // Griddb: {
    //   object: new GriddbProvider(),
    //   options: {}
    // },
    Mongodb: {
      object: new MongodbProvider(),
      options: {
        mongoDb: process.env["db.mongoDb"],
        mongoUrl: process.env["db.mongoUrl"],
        authSource: process.env["db.authSource"],
        user: process.env["db.user"],
        password: process.env["db.password"]
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

SmsIrService.configure({
  lineNumber: process.env["smsIr.lineNumber"],
  apiKey: process.env["smsIr.apiKey"],
  secretKey: process.env["smsIr.secretKey"],
  verifyTemplate: process.env["smsIr.verifyTemplate"] as any,
  verifyTemplateWithIpAndUseragent: process.env[
    "smsIr.verifyTemplateWithIpAndUseragent"
  ] as any
});

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
  staticPath: join(__dirname, "../", "files", "public"),
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

//WebSocketService.bypassTokenOnRoutes = ['/']

console.log("ENV", process.env);

start({
  logging: (process.env["core.logging"] as any) || "info",

  cpuCores: (process.env["core.cpuCores"] as any) || 1,

  services: [
    HttpService,
    SmsIrService,
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
    StorageService,
    ProfileService,
    ClientService
  ]
})
  .then(() => {
    let emitter = new EventEmitter();
  })
  .catch(msg => console.log(msg));
