import { ServerServiceInterface, Server, DbService } from "serendip";
import * as fs from 'fs'
import { join } from "path";
import * as _ from 'underscore';
import { EntityService } from "./EntityService";
import { CompanyModel } from "../models";

export class ImportService implements ServerServiceInterface {


    static dependencies = ["EntityService", "DbService"];

    private dbService: DbService;
    private entityService: EntityService;

    private data: any;

    constructor() {

        this.dbService = Server.services["DbService"];
        this.entityService = Server.services["EntityService"];

    }

    _business = "5bd5254e65a0f95a6dea2faf";

    async start() {

        this.data = JSON.parse(fs.readFileSync(join(Server.dir, '..', 'export-mvc.json')).toString());

        //   this.importPeoples();

        this.importCompanies();


    }

    async importCompanies() {

        this.data.clients.forEach(async p => {

            var query = await this.entityService.find({ _business: this._business, _entity: 'company', oid: p.Id });
            if (query.length == 0) {
                await this.entityService.insert(new CompanyModel({
                    contacts: [{
                        telephones: [p.telephone],
                        faxes: [],
                        peoples: [],
                        name: '',
                        address: { text: p.address }
                    }],
                    name: p.name,
                    type: [],
                    oid: p.Id,
                    _business: this._business
                }));

                console.log(p.Id);
            }

        });
    }



    // async importServices() {
    //     var collection = await this.dbService.collection("CrmServices");

    //     console.log(Object.keys(this.data));

    //     console.log(this.data.services[0]);

    //     this.data.clients.forEach(async client => {

    //         // await collection.updateOne(new CompanyModel({
    //         //     contacts: [{
    //         //         telephones: [],
    //         //         faxes: [],
    //         //         Peoples: [],
    //         //         name: '',
    //         //         address: { text: client.address }
    //         //     }],
    //         //     name: client.name,
    //         //     crm: '5ad3da917e73503cd4bd5d1f',
    //         //     type: []
    //         // }));

    //     });
    // }



    // async importPeoples() {

    //     var collection = await this.dbService.collection("CrmPeoples");

    //     this.data.Peoples.forEach(async (p: any) => {

    //         var query = await collection.find({ oid: p.Id });

    //         if (query.length == 0)
    //             await collection.updateOne(new PeopleModel({
    //                 crm: '5ad3da917e73503cd4bd5d1f',
    //                 gender: p.gender == 1,
    //                 firstName: p.name.split(' ')[0],
    //                 lastName: p.name.split(' ')[1],
    //                 birthDate: p.birthDate,
    //                 mobiles: [p.mobile],
    //                 socials: [],
    //                 profilePicture: '',
    //                 emails: [],
    //                 oid: p.Id
    //             }));

    //         console.log(p.Id);

    //     });

    // }

}