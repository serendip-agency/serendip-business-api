"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path_1 = require("path");
const serendip_1 = require("serendip");
const services_1 = require("../services");
class StorageController {
    constructor() {
        this.storage = {
            method: "get",
            publicAccess: true,
            route: "storage/:path*",
            actions: [
                async (req, res, next, done, access) => {
                    res.json(req.params.path.join("/"));
                }
            ]
        };
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
        this.parts = {
            method: "POST",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var command = req.body;
                    if (!command)
                        return;
                    if (!(await this.storageService.userHasAccessToPath(req.user._id.toString(), command.path)))
                        return;
                    var model = await this.storageService.getFilePartsInfo(path_1.join(this.storageService.dataPath, command.path));
                    var exists = [];
                    var missing = [];
                    model.forEach(item => {
                        console.log(item.start, item.end, exists, missing);
                        if (!exists[0])
                            exists.push({ start: item.start, end: item.end });
                        else {
                            if (missing[0]) {
                                if (missing[0].end == item.start) {
                                    exists.unshift({ start: item.start, end: item.end });
                                    return;
                                }
                            }
                            if (exists[0].end == item.start)
                                exists[0].end = item.end;
                            else {
                                missing.unshift({ start: exists[0].end, end: item.start });
                                exists.unshift({ start: item.start, end: item.end });
                            }
                        }
                    });
                    res.json({
                        exists,
                        missing
                    });
                }
            ]
        };
        this.list = {
            method: "POST",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var command = req.body;
                    if (!command)
                        return;
                    if (!(await this.storageService.userHasAccessToPath(req.user._id.toString(), command.path)))
                        return;
                    res.json(await this.storageService.list(command.path));
                }
            ]
        };
        this.assemble = {
            method: "POST",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var command = req.body;
                    if (!command)
                        return;
                    if (!(await this.storageService.userHasAccessToPath(req.user._id.toString(), command.path)))
                        return;
                    await this.storageService.assemblePartsIfPossible(path_1.join(this.storageService.dataPath, command.path), req.user._id);
                    done();
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
