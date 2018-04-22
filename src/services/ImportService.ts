import { CompanyModel } from '../models/CompanyModel';
import { ServerServiceInterface, Server, DbService } from "serendip";
import * as fs from 'fs'
import { join } from "path";

export class ImportService implements ServerServiceInterface {


    static dependencies = ["DbService"];

    private dbService: DbService;

    private data: any;

    constructor() {

        this.dbService = Server.services["DbService"];

    }
    async start() {

        this.data = JSON.parse(fs.readFileSync(join(Server.dir, '..', 'export-mvc.json')).toString());


    //    this.importCompanies();



    }

    async importCompanies() {

        var collection = await this.dbService.collection("CrmCompanies");

        this.data.clients.forEach(async client => {

            await collection.updateOne(new CompanyModel({
                contacts: [{
                    telephones: [],
                    faxes: [],
                    persons: [],
                    name: '',
                    address: { text: client.address }
                }],
                name: client.name,
                crm: '5ad3da917e73503cd4bd5d1f',
                type: []
            }));

        });

    }

}