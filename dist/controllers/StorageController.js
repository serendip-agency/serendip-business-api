"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
const path_1 = require("path");
const fs = require("fs-extra");
const services_1 = require("../services");
class StorageController {
    constructor() {
        this.upload = {
            method: "POST",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var command = req.body;
                    if (!command)
                        return;
                    if (!(await this.storageService.userHasAccessToPath(req.user._id.toString(), command.path)))
                        return;
                    await fs.ensureFile(path_1.join(this.storageService.dataPath, command.path));
                    console.log(command.type, command.path, command.start, command.end, command.total);
                    if (!command.total) {
                        await this.storageService.writeBase64AsFile(command.data, command.path);
                        done();
                    }
                    else {
                        await this.storageService.checkPartsBeforeUpload(command);
                        await fs.writeFile(path_1.join(this.storageService.dataPath, command.path) +
                            `.${command.start || "0"}-${command.end || "0"}-${command.total}.part`, command.data);
                        done();
                    }
                }
            ]
        };
        this.storageService = serendip_1.Server.services["StorageService"];
    }
    async onRequest(req, res, next, done) {
        next();
    }
}
exports.StorageController = StorageController;
