"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path_1 = require("path");
const services_1 = require("../services");
class StorageController {
    constructor(dbService, storageService) {
        this.dbService = dbService;
        this.storageService = storageService;
        this.test = {
            method: "get",
            publicAccess: true,
            actions: [
                async (req, res, next, done, access) => {
                    const data = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUwIDUwIiBoZWlnaHQ9IjUwcHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MCA1MCIgd2lkdGg9IjUwcHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iNTAiIHdpZHRoPSI1MCIvPjxwYXRoIGQ9Ik0zNC4zOTcsMjlMMjAsNDhMNS42MDQsMjkgIEgxNUMxNSwwLDQ0LDEsNDQsMVMyNSwyLjM3MywyNSwyOUgzNC4zOTd6IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=';
                    const binaryString = Buffer.from(data, 'base64');
                    // res.setHeader('Content-Type', 'application-octet-stream');
                    // res.setHeader('Content-disposition', 'attachment; filename=test.svg');
                    res.write(binaryString, 'binary', () => {
                        res.end();
                    });
                    // const write = (data) => {
                    //   return new Promise((resolve, reject) => {
                    //     if (!res.write(data, 'base64', () => resolve()))
                    //       resolve();
                    //   });
                    // }
                    // for (const c of data.split(',')[1]) {
                    //   console.log(c);
                    //   await write(c);
                    // }
                    // res.end();
                    // res.write(data.split(',')[1], 'binary', () => {
                    //   res.end();
                    // })
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
                        // await this.storageService.writeBase64AsFile(
                        //   command.data,
                        //   command.path
                        // );
                        done();
                    }
                    else {
                        await this.storageService.checkPartsBeforeUpload(command);
                        await fs.writeFile(path_1.join(this.storageService.dataPath, command.path) +
                            `.${command.start || "0"}-${command.end || "0"}-${command.total}.part`, command.data, { encoding: 'hex' });
                        done();
                    }
                }
            ]
        };
        this.download = {
            method: "GET",
            publicAccess: true,
            route: 'api/storage/download/:path*',
            actions: [
                //    BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var command = req.body;
                    if (!command)
                        return;
                    // if (
                    //   !(await this.storageService.userHasAccessToPath(
                    //     req.user._id.toString(),
                    //     req.params.path
                    //   ))
                    // )
                    //   return;
                    console.log(req.params);
                    let filePath = req.params.path.join('/');
                    if (!filePath.startsWith('/'))
                        filePath = '/' + filePath;
                    await this.dbService.openDownloadStreamByFilePath(filePath).then((stream) => {
                        stream.pipe(res);
                    });
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
    }
    async onRequest(req, res, next, done) {
        next();
    }
}
exports.StorageController = StorageController;
