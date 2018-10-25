import { CompanyModel } from '../models';
import { ServerServiceInterface, Server, DbService } from "serendip";
import * as fs from 'fs'
import { join } from "path";
import * as _ from 'underscore';
import { PeopleModel } from '../models';

export class ImportService implements ServerServiceInterface {


    static dependencies = ["DbService"];

    private dbService: DbService;

    private data: any;

    constructor() {

        this.dbService = Server.services["DbService"];

    }
    async start() {

        this.data = JSON.parse(fs.readFileSync(join(Server.dir, '..', 'export-mvc.json')).toString());

        //   this.importPeoples();

        //  this.importCompanies();


    }

    async importCompanies() {
        var collection = await this.dbService.collection("CrmCompanies");
        console.log(this.data.clients[0]);

        this.data.clients.forEach(async p => {

            var query = await collection.find({ oid: p.Id });
            if (query.length == 0) {
                await collection.updateOne(new CompanyModel({
                    contacts: [{
                        telephones: [p.telephone],
                        faxes: [],
                        peoples: [],
                        name: '',
                        address: { text: p.address }
                    }],
                    name: p.name,
                    crm: '5ad3da917e73503cd4bd5d1f',
                    type: [],
                    oid: p.Id
                }));

                console.log(p.Id);
            }

        });
    }



    async importServices() {
        var collection = await this.dbService.collection("CrmServices");

        console.log(Object.keys(this.data));

        console.log(this.data.services[0]);

        this.data.clients.forEach(async client => {

            // await collection.updateOne(new CompanyModel({
            //     contacts: [{
            //         telephones: [],
            //         faxes: [],
            //         Peoples: [],
            //         name: '',
            //         address: { text: client.address }
            //     }],
            //     name: client.name,
            //     crm: '5ad3da917e73503cd4bd5d1f',
            //     type: []
            // }));

        });
    }



    async importPeoples() {

        var collection = await this.dbService.collection("CrmPeoples");

        this.data.Peoples.forEach(async (p: any) => {

            var query = await collection.find({ oid: p.Id });

            if (query.length == 0)
                await collection.updateOne(new PeopleModel({
                    crm: '5ad3da917e73503cd4bd5d1f',
                    gender: p.gender == 1,
                    firstName: p.name.split(' ')[0],
                    lastName: p.name.split(' ')[1],
                    birthDate: p.birthDate,
                    mobiles: [p.mobile],
                    socials: [],
                    profilePicture: '',
                    emails: [],
                    oid: p.Id
                }));

            console.log(p.Id);

        });

    }

}