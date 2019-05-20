"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module Storage
 */
const fs = require("fs-extra");
const path_1 = require("path");
const services_1 = require("../services");
const mime = require("mime-types");
const archiver = require("archiver");
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
        this.newFolder = {
            method: "POST",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var command = req.body;
                    if (!command)
                        return done(400);
                    if (!command.path)
                        return done(400);
                    if (!command.path.startsWith('/'))
                        command.path = '/' + command.path;
                    if (!(await this.storageService.userHasAccessToPath(req.user._id.toString(), command.path)))
                        return done(400);
                    await this.dbService.openUploadStreamByFilePath(command.path + '/.keep', {}).then((stream) => {
                        stream.write('');
                        stream.end();
                        stream.on('finish', () => {
                            done(200);
                        });
                    });
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
                        return done(400);
                    if (!command.path)
                        return done(400);
                    if (!command.path.startsWith('/'))
                        command.path = '/' + command.path;
                    if (!(await this.storageService.userHasAccessToPath(req.user._id.toString(), command.path)))
                        return done(400);
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
        this.public = {
            method: "GET",
            publicAccess: true,
            isStream: true,
            route: 'dl/:first*/public/:last*',
            actions: [
                async (req, res, next, done) => {
                    req.params.path = '/' + ([...req.params.first, ...['public'], ...req.params.last].join('/'));
                    return this.preview.actions[0](req, res, next, done);
                }
            ]
        };
        this.preview = {
            method: "GET",
            publicAccess: false, isStream: true,
            route: 'api/storage/preview/:path*',
            actions: [
                async (req, res, next, done) => {
                    let filePath;
                    if (typeof req.params.path !== 'string')
                        filePath = req.params.path.join('/');
                    else
                        filePath = req.params.path;
                    if (!filePath.startsWith('/'))
                        filePath = '/' + filePath;
                    if (filePath.split('/')[3] != 'public' &&
                        !(await this.storageService.userHasAccessToPath(req.user._id.toString(), filePath)))
                        return done(403);
                    const filesCollection = await this.dbService.collection('fs.files', false);
                    const fileQuery = await filesCollection.find({ filename: filePath });
                    if (!fileQuery[0])
                        return done(404);
                    res.setHeader('Content-Type', mime.lookup(filePath));
                    let range = (req.headers.range) ? req.headers.range.toString().replace(/bytes=/, "").split("-") : [];
                    range[0] = range[0] ? parseInt(range[0], 10) : 0;
                    range[1] = range[1] ? (parseInt(range[1], 10) || 0) : range[0] + ((1024 * 1024) - 1);
                    if (range[1] >= fileQuery[0].length) {
                        range[1] = fileQuery[0].length - 1;
                    }
                    range = { start: range[0], end: range[1] };
                    if (!req.headers.range) {
                        await this.dbService.openDownloadStreamByFilePath(filePath).then((stream) => {
                            res.writeHead(200, {
                                'Cache-Control': 'no-cache, no-store, must-revalidate',
                                'Pragma': 'no-cache',
                                'Expires': 0,
                                'Content-Disposition': `inline; filename=${encodeURIComponent(fileQuery[0].filename.split('/')[fileQuery[0].filename.split('/').length - 1])}`,
                                'Content-Type': mime.lookup(filePath),
                                'Content-Length': fileQuery[0].length,
                            });
                            stream.pipe(res);
                        });
                    }
                    else {
                        await this.dbService.openDownloadStreamByFilePath(filePath, {
                            start: range.start,
                            end: range.end
                        }).then((stream) => {
                            res.writeHead(206, {
                                'Cache-Control': 'no-cache, no-store, must-revalidate',
                                'Pragma': 'no-cache',
                                'Expires': 0,
                                'Content-Type': mime.lookup(filePath),
                                'Content-Disposition': `inline; filename=${encodeURIComponent(fileQuery[0].filename.split('/')[fileQuery[0].filename.split('/').length - 1])}`,
                                'Accept-Ranges': 'bytes',
                                'Content-Range': 'bytes ' + range.start + '-' + range.end + '/' + (fileQuery[0].length),
                                'Content-Length': range.end - range.start + 1,
                            });
                            stream.pipe(res);
                        });
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
                        return done(400);
                    if (!command.path)
                        return done(400);
                    if (!command.path.startsWith('/'))
                        command.path = '/' + command.path;
                    if (!(await this.storageService.userHasAccessToPath(req.user._id.toString(), command.path)))
                        return done(400);
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
                        return done(400);
                    if (!command.path)
                        return done(400);
                    if (!command.path.startsWith('/'))
                        command.path = '/' + command.path;
                    if (!command.path.endsWith('/'))
                        command.path += '/';
                    if (!(await this.storageService.userHasAccessToPath(req.user._id.toString(), command.path)))
                        return done(400);
                    const filesCollection = await this.dbService.collection('fs.files', false);
                    let model = await filesCollection.find({
                        $or: [{
                                filename: {
                                    $regex: `^${command.path.replace(/\//g, '\/')}[^/]{0,}$`
                                }
                            }, {
                                filename: {
                                    $regex: `^${command.path.replace(/\//g, '\/')}[^/]{0,}\/.keep$`
                                }
                            }]
                    });
                    model = model.filter((p) => command.path + '.keep' != p.filename).map((p) => {
                        return {
                            isFile: !p.filename.endsWith('/.keep'),
                            isDirectory: p.filename.endsWith('/.keep'),
                            path: p.filename,
                            basename: path_1.basename(p.filename.replace('/.keep', '')),
                            mime: mime.lookup(p.filename),
                            size: p.length,
                            ext: p.filename.split(".")
                                .reverse()[0]
                                .toLowerCase(),
                            sizeInMB: parseFloat((p.length / 1024 / 1024).toFixed(2))
                        };
                    });
                    res.json(model);
                    // res.json(await this.storageService.list(command.path));
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
                        return done(400);
                    if (!command.path)
                        return done(400);
                    if (!command.path.startsWith('/'))
                        command.path = '/' + command.path;
                    if (!(await this.storageService.userHasAccessToPath(req.user._id.toString(), command.path)))
                        return done(400);
                    await this.storageService.assemblePartsIfPossible(path_1.join(this.storageService.dataPath, command.path), req.user._id);
                    done();
                }
            ]
        };
        this.rename = {
            method: "POST",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var command = req.body;
                    if (!command)
                        return done(400);
                    if (!command.path)
                        return done(400);
                    if (!command.path.startsWith('/'))
                        command.path = '/' + command.path;
                    if (!(await this.storageService.userHasAccessToPath(req.user._id.toString(), command.path)))
                        return done(400);
                    var file = await this.storageService.filesCollection.find({ filename: command.path });
                    if (!file[0])
                        return done(400, 'file not found');
                    file[0].filename = path_1.join(command.path, '..', command.newName);
                    await this.storageService.filesCollection.updateOne(file[0], req.user._id);
                    done(200);
                }
            ]
        };
        this.zip = {
            method: "POST",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var command = req.body;
                    if (!command)
                        return done(400);
                    if (!command.paths)
                        return done(400);
                    if (!command.zipName)
                        return done(400);
                    if (command.zipName.indexOf('/') != 0)
                        command.zipName = '/' + command.zipName;
                    for (let cpath of command.paths) {
                        if (!cpath.startsWith('/'))
                            cpath = '/' + cpath;
                        if (!(await this.storageService.userHasAccessToPath(req.user._id.toString(), cpath)))
                            return done(400);
                    }
                    var archive = archiver('zip', {
                        comment: new Date().toISOString(),
                        zlib: { level: 9 }
                    });
                    archive.on('error', function (err) {
                        done(500, err.message);
                    });
                    const uploadStream = await this.dbService.openUploadStreamByFilePath(command.zipName, {});
                    let files = [];
                    for (let cpath of command.paths) {
                        files = [...files, ...await this.storageService.filesCollection.find({
                                filename: { $regex: '^' + cpath.replace('/.keep', '/') }
                            })];
                    }
                    console.log(command);
                    archive.pipe(uploadStream);
                    for (const file of files) {
                        archive.append(await this.dbService.openDownloadStreamByFilePath(file.filename), { date: file.uploadDate, name: file.filename });
                    }
                    uploadStream.on('finish', () => {
                        done(200);
                    });
                    archive.finalize();
                }
            ]
        };
        this.delete = {
            method: "POST",
            actions: [
                services_1.BusinessService.checkUserAccess,
                async (req, res, next, done, access) => {
                    var command = req.body;
                    if (!command)
                        return done(400);
                    if (!command.paths)
                        return done(400);
                    for (let cpath of command.paths) {
                        if (!cpath.startsWith('/'))
                            cpath = '/' + cpath;
                        if (!(await this.storageService.userHasAccessToPath(req.user._id.toString(), cpath)))
                            return done(400);
                    }
                    let files = [];
                    for (let cpath of command.paths) {
                        files = [...files, ...await this.storageService.filesCollection.find({
                                filename: { $regex: '^' + cpath.replace('/.keep', '/') }
                            })];
                    }
                    for (const file of files) {
                        await this.storageService.filesCollection.deleteOne(file._id);
                    }
                    done(200);
                }
            ]
        };
    }
    async onRequest(req, res, next, done) {
        next();
    }
}
exports.StorageController = StorageController;
