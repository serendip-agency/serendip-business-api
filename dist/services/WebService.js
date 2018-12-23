"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
const path_1 = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const _ = require("underscore");
const Request = require("request");
const Moment = require("moment");
class WebService {
    constructor() {
    }
    static async processRequest(req, res, next, done) {
        if (req.url.indexOf('/api') !== 0) {
            var domain = req.headers.host.split(':')[0].replace('www.', '');
            if (domain == 'localhost' || domain == 'serendip.ir')
                domain = 'serendip.cloud';
            var sitePath = path_1.join(serendip_1.Server.dir, '..', 'www', domain);
            if (!sitePath.endsWith('/'))
                sitePath += '/';
            var filePath = path_1.join(sitePath, req.url);
            var hbsPath = filePath + (filePath.endsWith('/') ? 'index.hbs' : '.hbs');
            var hbsJsPath = filePath + (filePath.endsWith('/') ? 'index.hbs.js' : '.hbs.js');
            // res.json({ domain, sitePath, url: req.url, filePath, fileExist: fs.existsSync(filePath), hbsPath });
            // return;
            if (fs.existsSync(hbsPath)) {
                var render, model, error, viewEngline = handlebars.noConflict(), hbsTemplate = viewEngline.compile(fs.readFileSync(hbsPath).toString() || '');
                if (fs.existsSync(hbsJsPath)) {
                    var hbsJsFunc, hbsJsScript = fs.readFileSync(hbsJsPath).toString();
                    try {
                        hbsJsFunc = function () {
                            let Server = {
                                request: req,
                                response: res
                            };
                            let Modules = {
                                _,
                                request: Request,
                                moment: Moment,
                                handlebars: handlebars
                            };
                            let process = null;
                            return eval(hbsJsScript);
                        }();
                    }
                    catch (error) {
                    }
                    if (typeof hbsJsFunc === 'function') {
                        var hbsJsFuncResult;
                        try {
                            hbsJsFuncResult = await hbsJsFunc();
                        }
                        catch (e) {
                            error = e;
                        }
                        if (hbsJsFuncResult) {
                            if (hbsJsFuncResult.handlebars)
                                viewEngline = hbsJsFuncResult.handlebars;
                            if (hbsJsFuncResult.model)
                                model = hbsJsFuncResult.model;
                        }
                    }
                    if (error) {
                        res.write(error.toString());
                        res.end();
                        return;
                    }
                }
                var partialsPath = path_1.join(sitePath, '_partials');
                if (fs.existsSync(partialsPath)) {
                    fs.readdirSync(partialsPath).filter((item) => {
                        return item.endsWith('.hbs');
                    }).map((partialFileName) => {
                        return path_1.join(partialsPath, partialFileName);
                    }).forEach((partialFilePath) => {
                        var partialName = partialFilePath.split('/')[partialFilePath.split('/').length - 1].replace('.hbs', '');
                        viewEngline.registerPartial(partialName, fs.readFileSync(partialFilePath).toString());
                    });
                }
                try {
                    render = hbsTemplate({ model });
                }
                catch (error) {
                    render = error.message || error;
                }
                res.setHeader('content-type', 'text/html');
                res.statusCode = 200;
                res.send(render);
            }
            else {
                serendip_1.ServerRouter.processRequestToStatic(req, res, () => {
                }, sitePath);
            }
        }
        else {
            next();
        }
        // next();
    }
    async start() {
    }
}
WebService.dependencies = ["DbService", "ViewEngineService"];
exports.WebService = WebService;
