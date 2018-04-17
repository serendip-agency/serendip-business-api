import { ServerServiceInterface, DbService, Server, DbCollection, ServerEndpointActionInterface, ServerError } from "serendip";
import { CrmModel, CrmMemberModel } from "../models";
import * as _ from 'underscore';
import { ObjectId } from "bson";
export interface CrmCheckAccessResultInterface {
    member: CrmMemberModel,
    crm: CrmModel
}
export class CrmService implements ServerServiceInterface {

    static dependencies = ["AuthService", "DbService"];

    private _dbService: DbService;
    private crmCollection: DbCollection<CrmModel>;

    constructor() {

        this._dbService = Server.services["DbService"];

    }
    async start() {

        this.crmCollection = await this._dbService.collection<CrmModel>('Crms', true);

    }

    async insert(model: CrmModel) {
        return this.crmCollection.insertOne(model);
    }

    async update(model: CrmModel) {
        return this.crmCollection.updateOne(model);
    }

    async delete(model: CrmModel) {
        return this.crmCollection.deleteOne(model._id);
    }

    async findById(id: string) {

        var query = await this.crmCollection.find({ _id: new ObjectId(id) });

        if (query.length == 0)
            return undefined;
        else
            return query[0];

    }

    async findCrmByMember(userId: string): Promise<CrmModel[]> {

        return this.crmCollection.find({
            $or: [
                {
                    members: {
                        $elemMatch: { 'userId': userId }
                    }
                },
                {
                    owner: userId
                }
            ]
        });

    }

    public static async checkUserAccess(req, res, next, done) {

        if (!req.body.crm)
            return next(new ServerError(400, 'crm field missing'));

        var crm: CrmModel;
        try {
            crm = await Server.services["CrmService"].findById(req.body.crm);
        } catch (e) {

        }


        if (!crm)
            return next(new ServerError(400, 'crm invalid'));

        var crmMember: CrmMemberModel;

        if (crm.owner.toString() != req.user._id.toString()) {

            if (!crm.members || crm.members.length == 0)
                return next(new ServerError(400, 'crm has no members'));

            crmMember = _.findWhere(crm.members, { userId: req.user._id });

            if (!crmMember)
                return next(new ServerError(400, 'you are not member of this crm'));


        } else {
            crmMember = {
                role: 'owner',
                userId: req.user._id
            };
        }

        var result: CrmCheckAccessResultInterface = {
            crm: crm,
            member: crmMember
        }

        next(result);

    }




}