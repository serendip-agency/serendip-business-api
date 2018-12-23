import { ServerRouter, ServerServiceInterface, EmailService, Server, EmailModel, SmsIrService, ServerRequestInterface, ServerResponseInterface } from "serendip";
import { join } from "path";
import * as fs from 'fs'
import * as handlebars from 'handlebars';
import * as _ from 'underscore';
import * as Request from 'request';
import * as Moment from 'moment'

export class WebService implements ServerServiceInterface {

    static dependencies = ["DbService", "ViewEngineService"];


    static async processRequest(req: ServerRequestInterface, res: ServerResponseInterface, next, done) {

        if (req.url.indexOf('/api') !== 0) {
            var domain = req.headers.host.split(':')[0].replace('www.', '');

            if (domain == 'localhost' || domain == 'serendip.ir')
                domain = 'serendip.cloud';
            var sitePath = join(Server.dir, '..', 'www', domain);

            if (!sitePath.endsWith('/'))
                sitePath += '/';
            var filePath = join(sitePath, req.url);
            var hbsPath = filePath + (filePath.endsWith('/') ? 'index.hbs' : '.hbs');
            var hbsJsPath = filePath + (filePath.endsWith('/') ? 'index.hbs.js' : '.hbs.js');


            // res.json({ domain, sitePath, url: req.url, filePath, fileExist: fs.existsSync(filePath), hbsPath });
            // return;
            if (fs.existsSync(hbsPath)) {

                var render,
                    model,
                    error,
                    viewEngline = handlebars.noConflict(),
                    hbsTemplate = viewEngline.compile(fs.readFileSync(hbsPath).toString() || '');

                if (fs.existsSync(hbsJsPath)) {
                    var hbsJsFunc: Function,
                        hbsJsScript = fs.readFileSync(hbsJsPath).toString();

                    try {
                        hbsJsFunc = function () {
                            let Server = {
                                request: req,
                                response: res
                            }
                            let Modules = {
                                _,
                                request: Request,
                                moment: Moment,
                                handlebars: handlebars
                            }

                            let process = null;

                            return eval(hbsJsScript);

                        }();
                    } catch (error) {

                    }

                    if (typeof hbsJsFunc === 'function') {
                        var hbsJsFuncResult;
                        try {
                            hbsJsFuncResult = await hbsJsFunc();
                        } catch (e) {
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
                var partialsPath = join(sitePath, '_partials');
                if (fs.existsSync(partialsPath)) {

                    fs.readdirSync(partialsPath).filter((item) => {
                        return item.endsWith('.hbs');
                    }).map((partialFileName) => {
                        return join(partialsPath, partialFileName);
                    }).forEach((partialFilePath) => {
                        var partialName = partialFilePath.split('/')[partialFilePath.split('/').length - 1].replace('.hbs', '');
                        viewEngline.registerPartial(partialName, fs.readFileSync(partialFilePath).toString());
                    });
                }

                try {
                    render = hbsTemplate({ model })
                } catch (error) {
                    render = error.message || error;
                }

                res.setHeader('content-type', 'text/html');
                res.statusCode = 200;
                res.send(render);

            } else {
                ServerRouter.processRequestToStatic(req, res, () => {

                }, sitePath);
            }

        } else {
            next();
        }
        // next();

    }



    constructor() {
    }

    async start() {

    }


}