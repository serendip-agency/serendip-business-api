"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
const path_1 = require("path");
const controllers_1 = require("./controllers");
const EntityController_1 = require("./controllers/EntityController");
const BusinessService_1 = require("./services/BusinessService");
const DashboardService_1 = require("./services/DashboardService");
const StorageService_1 = require("./services/StorageService");
const StorageController_1 = require("./controllers/StorageController");
const dotenv = require("dotenv");
const HooksController_1 = require("./controllers/HooksController");
const services_1 = require("./services");
const serendip_mingodb_provider_1 = require("serendip-mingodb-provider");
dotenv.config();
serendip_1.Server.dir = __dirname;
serendip_1.AuthService.configure({
    tokenExpireIn: 1000 * 60 * 60,
    smsProvider: "SmsIrService"
});
serendip_1.DbService.configure({
    defaultProvider: "Mongodb",
    providers: {
        // Griddb: {
        //   object: new GriddbProvider(),
        //   options: {}
        // },
        Mongodb: {
            object: new serendip_mingodb_provider_1.MingodbProvider(),
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
serendip_1.EmailService.configure({
    smtp: {
        host: process.env["email.smtp.host"],
        username: process.env["email.smtp.username"],
        password: process.env["email.smtp.password"],
        port: parseInt(process.env["email.smtp.port"]) || 587,
        ssl: process.env["email.smtp.ssl"] == "true"
    },
    templatesPath: path_1.join(__dirname, "..", "storage", "email-templates")
});
serendip_1.SmsIrService.configure({
    lineNumber: process.env["smsIr.lineNumber"],
    apiKey: process.env["smsIr.apiKey"],
    secretKey: process.env["smsIr.secretKey"],
    verifyTemplate: process.env["smsIr.verifyTemplate"],
    verifyTemplateWithIpAndUseragent: process.env["smsIr.verifyTemplateWithIpAndUseragent"]
});
serendip_1.HttpService.configure({
    beforeMiddlewares: [
        (req, res, next) => {
            req.url = req.url.replace(/\/\//g, "/");
            next();
        }
    ],
    cors: "*",
    httpPort: process.env.PORT || process.env["core.httpPort"] || 2040,
    staticPath: path_1.join(__dirname, "../", "files", "public"),
    controllers: [
        serendip_1.AuthController,
        serendip_1.ServerController,
        controllers_1.BusinessController,
        EntityController_1.EntityController,
        serendip_1.ServerController,
        StorageController_1.StorageController,
        HooksController_1.HooksController
    ]
});
//WebSocketService.bypassTokenOnRoutes = ['/']
console.log("ENV", process.env);
serendip_1.start({
    logging: process.env["core.logging"] || "info",
    cpuCores: process.env["core.cpuCores"] || 1,
    services: [
        serendip_1.HttpService,
        serendip_1.SmsIrService,
        serendip_1.EmailService,
        serendip_1.FaxService,
        serendip_1.DbService,
        serendip_1.AuthService,
        serendip_1.ViewEngineService,
        BusinessService_1.BusinessService,
        services_1.EntityService,
        serendip_1.WebSocketService,
        StorageService_1.StorageService,
        DashboardService_1.DashboardService,
        StorageService_1.StorageService
        // ClientService
    ]
})
    .then(() => { })
    .catch(msg => console.log(msg));
