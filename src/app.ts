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
  SmsIrService
} from "serendip";

import { join } from "path";
import { BusinessController } from "./controllers";
import { ImportService } from "./services/ImportService";
import { EntityController } from "./controllers/EntityController";
import { BusinessService } from "./services/BusinessService";
import {
  NotificationService,
  EntityService,
  UserProfileService
} from "./services";
import { ReportService } from "./services/ReportService";
import { TaskService } from "./services/TaskService";
import { WebSocketService } from "serendip";
import { DashboardService } from "./services/DashboardService";
import * as dotenv from "dotenv";
import { StorageService } from "./services/StorageService";
import { StorageController } from "./controllers/StorageController";

dotenv.config();

Server.dir = __dirname;

AuthService.configure({
  tokenExpireIn: 1000 * 60 * 60,
  smsProvider: "SmsIrService"
});

DbService.configure({
  mongoDb: process.env["db.mongoDb"],
  mongoUrl: process.env["db.mongoUrl"],
  authSource: process.env["db.authSource"],
  user: process.env["db.user"],
  password: process.env["db.password"]
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

start({
  cors: "*",
  logging: (process.env["core.logging"] as any) || "info",
  httpPort:
    (process.env.PORT as any) || (process.env["core.httpPort"] as any) || 2040,
  staticPath: join(__dirname, "../", "files", "public"),
  cpuCores: (process.env["core.cpuCores"] as any) || 1,
  controllers: [
    AuthController,
    ServerController,
    BusinessController,
    EntityController,
    ServerController,
    StorageController
  ],
  services: [
    SmsIrService,
    EmailService,
    FaxService,
    DbService,
    AuthService,
    ViewEngineService,
    NotificationService,
    BusinessService,
    EntityService,
    ReportService,
    ImportService,
    TaskService,
    WebSocketService,
    StorageService,
    DashboardService,
    StorageService,
    UserProfileService
  ]
})
  .then(() => {})
  .catch(msg => console.log(msg));
