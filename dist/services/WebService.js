"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
const path_1 = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const _ = require("underscore");
const Request = require("request");
const Moment = require("moment");
const sUtils = require("serendip-utility");
class WebService {
    constructor() {
    }
    static executeHbsJs(script, sitePath, req, res) {
        var hbsJsError, hbsJsFunc, hbsJsScript = script;
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
                    handlebars: handlebars,
                    utils: sUtils
                };
                let process = null;
                return eval(hbsJsScript);
            }();
        }
        catch (e) {
            hbsJsError = e;
        }
        var handleError = () => {
            res.statusCode = 500;
            if (hbsJsError)
                WebService.renderHbs({ error: { message: hbsJsError, code: 500 } }, path_1.join(sitePath, '..', 'message.hbs'), sitePath, req, res);
        };
        handleError();
        if (typeof hbsJsFunc === 'function') {
            var hbsJsFuncResult;
            try {
                hbsJsFuncResult = async function () {
                    return await hbsJsFunc();
                }();
            }
            catch (e) {
                hbsJsError = e;
            }
            handleError();
            if (hbsJsFuncResult) {
                return hbsJsFuncResult;
            }
            else {
                return { model: {} };
            }
        }
        else {
            return { model: {} };
        }
    }
    static async renderHbs(inputObjects, hbsPath, sitePath, req, res) {
        var render, viewEngline = handlebars.noConflict(), hbsTemplate = viewEngline.compile(fs.readFileSync(hbsPath).toString() || '');
        var hbsJsPath = hbsPath + '.js';
        if (fs.existsSync(hbsJsPath)) {
            var hbsJsResult = await WebService.executeHbsJs(fs.readFileSync(hbsJsPath).toString(), sitePath, req, res);
            if (res.finished)
                return;
            if (hbsJsResult.model) {
                inputObjects.model = _.extend(inputObjects.model, hbsJsResult.model);
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
            render = hbsTemplate(inputObjects);
        }
        catch (error) {
            render = error.message || error;
        }
        if (!res.headersSent)
            res.setHeader('content-type', 'text/html');
        res.send(render);
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
            var model = {};
            var data = {};
            var hbsJsonPath = hbsPath + '.json';
            var siteDataPath = path_1.join(sitePath, 'data.json');
            if (fs.existsSync(siteDataPath)) {
                try {
                    data = _.extend({}, model, JSON.parse(siteDataPath));
                }
                catch (error) {
                }
            }
            if (fs.existsSync(hbsJsonPath)) {
                try {
                    model = _.extend({}, model, JSON.parse(hbsJsonPath));
                }
                catch (error) {
                }
            }
            // res.json({ domain, sitePath, url: req.url, filePath, fileExist: fs.existsSync(filePath), hbsPath });
            // return;
            if (fs.existsSync(hbsPath)) {
                WebService.renderHbs({ model, data }, hbsPath, sitePath, req, res);
            }
            else {
                if (!fs.existsSync(filePath)) {
                    res.statusCode = 404;
                    WebService.renderHbs({
                        error: {
                            message: req.url + ' not found!',
                            code: 404
                        }
                    }, path_1.join(sitePath, '..', 'message.hbs'), sitePath, req, res);
                    return;
                }
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
