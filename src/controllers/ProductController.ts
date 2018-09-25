import { ServerEndpointInterface, Server, ServerError, ServerRequestInterface, ServerResponseInterface, DbService, Validator } from "serendip";
import { ProductService, CrmService, CrmCheckAccessResultInterface } from "../services";
import { ProductModel } from "../models";
import * as archiver from 'archiver';
import * as fs from 'fs';
import { join } from "path";
import * as _ from 'underscore'
import { ObjectID, ObjectId } from "bson";

export class ProductController {

    /**
     * /api/crm/...
     */
    static apiPrefix = "CRM";

    private productService: ProductService;
    private crmService: CrmService;
    private dbService: DbService;

    constructor() {

        this.productService = Server.services["ProductService"];
        this.crmService = Server.services["CrmService"];
        this.dbService = Server.services["DbService"];

    }

    public async onRequest(req: ServerRequestInterface, res: ServerResponseInterface, next, done) {
        next();
    }

    public zip: ServerEndpointInterface = {
        method: 'post',
        actions: [
            CrmService.checkUserAccess,
            async (req, res, next, done, access: CrmCheckAccessResultInterface) => {

                var range = {
                    from: req.body.from && Validator.isNumeric(req.body.from) ? req.body.from : 0,
                    to: req.body.to && Validator.isNumeric(req.body.to) ? req.body.to : Date.now()
                };

                var model = await this.productService.find({ crm: access.crm._id.toString(), _vdate: { $gt: range.from, $lt: range.to } });

                res.setHeader('content-type', 'application/zip');

                var zip = archiver('zip', {
                    zlib: { level: 9 } // Sets the compression level.
                });

                zip.pipe(res);
                zip.append(JSON.stringify(model), { name: 'data.json' });
                zip.finalize();

            }
        ]
    }

    public changes: ServerEndpointInterface = {
        method: 'post',
        actions: [
            CrmService.checkUserAccess,
            async (req, res, next, done, access: CrmCheckAccessResultInterface) => {
              
                var range = {
                    from: req.body.from && Validator.isNumeric(req.body.from) ? req.body.from : 0,
                    to: req.body.to && Validator.isNumeric(req.body.to) ? req.body.to : Date.now()
                };

                if (req.body._id) {

                    var actualRecord = await this.productService.findById(req.body._id);
                    if (!actualRecord)
                        return next(new ServerError(400, "record not found"));

                    var recordChanges = await this.dbService.entityCollection.find({ entityId: actualRecord._id })

                    res.json(recordChanges);

                } else {

                    var changedRecords = _.map(await this.productService.find({ crm: access.crm._id.toString(), _vdate: { $gt: range.from, $lt: range.to } }), (item) => {
                        return item._id;
                    });

                    var deletedRecords = _.map(await this.dbService.entityCollection.find({ "model.crm": access.crm._id.toString(), type: 0, date: { $gt: range.from, $lt: range.to } }), (item) => {
                        return item.entityId;
                    });

                    res.json({ changed: changedRecords, deleted: deletedRecords });

                }
            }
        ]
    }

    public list: ServerEndpointInterface = {
        method: 'post',
        actions: [
            CrmService.checkUserAccess,
            async (req, res, next, done, access: CrmCheckAccessResultInterface) => {

                var model = await this.productService.findByCrmId(
                    access.crm._id,
                    req.body.skip,
                    req.body.limit);

                res.json(model);

            }
        ]
    }

    public count: ServerEndpointInterface = {
        method: 'post',
        actions: [
            CrmService.checkUserAccess,
            async (req, res, next, done, access: CrmCheckAccessResultInterface) => {

                var model = await this.productService.count(access.crm._id);
                res.json(model);

            }
        ]
    }

    public insert: ServerEndpointInterface = {
        method: 'post',
        actions: [
            CrmService.checkUserAccess,
            async (req, res, next, done, access: CrmCheckAccessResultInterface) => {

                var model: ProductModel = new ProductModel(req.body);

                try {
                    await ProductModel.validate(model);
                } catch (e) {
                    return next(new ServerError(400, e.message || e));
                }

                try {
                    model = await this.productService.insert(model);
                } catch (e) {
                    return next(new ServerError(500, e.message || e));
                }

                res.json(model);

            }
        ]
    }

    public update: ServerEndpointInterface = {
        method: 'post',
        actions: [
            CrmService.checkUserAccess,
            async (req, res, next, done, access: CrmCheckAccessResultInterface) => {

                var model: ProductModel = new ProductModel(req.body);


                try {
                    await ProductModel.validate(model);
                } catch (e) {
                    return next(new ServerError(400, e.message || e));
                }

                try {
                    await this.productService.update(model);
                } catch (e) {
                    return next(new ServerError(500, e.message || e));
                }

                res.json(model);

            }
        ]
    }

    public delete: ServerEndpointInterface = {
        method: 'post',
        actions: [
            CrmService.checkUserAccess,
            async (req, res, next, done, access: CrmCheckAccessResultInterface) => {

                var _id = req.body._id;

                if (!_id)
                    return next(new ServerError(400, '_id is missing'));

                var product = await this.productService.findById(_id);
                if (!product)
                    return next(new ServerError(400, 'product not found'));

                try {
                    await this.productService.delete(_id, req.user._id);
                } catch (e) {
                    return next(new ServerError(500, e.message || e));
                }

                res.json(product);

            }
        ]
    }


}