"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serendip_1 = require("serendip");
class ImportService {
    constructor() {
        this._business = "5c3731c0227df05a6a429674";
        this.dbService = serendip_1.Server.services["DbService"];
        this.entityService = serendip_1.Server.services["EntityService"];
    }
    async start() {
        // this.data = JSON.parse(
        //   fs.readFileSync(join(Server.dir, "..", "ignore.json")).toString()
        // );
        // this.importPeoples();
        // this.importCompanies();
    }
    async importCompanies() {
        this.data.clients.forEach(async (p) => {
            console.log(p);
            var query = await this.entityService.find({
                _business: this._business,
                _entity: "company",
                oid: p.Id
            });
            if (query.length == 0) {
                await this.entityService.insert({
                    contacts: [
                        {
                            telephones: [p.telephone],
                            faxes: [],
                            peoples: [],
                            name: "",
                            address: { text: p.address }
                        }
                    ],
                    name: p.name,
                    type: [],
                    oid: p.Id,
                    _business: this._business,
                    _entity: "company"
                });
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
    async importPeoples() {
        this.data.persons.forEach(async (p) => {
            var query = await this.entityService.find({
                _business: this._business,
                _entity: "people",
                oid: p.Id
            });
            if (query.length == 0) {
                await this.entityService.insert({
                    contacts: [
                        {
                            telephones: [""],
                            faxes: [],
                            peoples: [],
                            name: "",
                            address: { text: "" }
                        }
                    ],
                    firstName: p.name ? p.name.split(" ")[0] : "",
                    lastName: p.name ? p.name.split(" ")[1] : "",
                    gender: p.gender == 1 ? "male" : p.gender == 2 ? "female" : "",
                    birthDate: p.birthDate,
                    mobiles: [p.mobile || ""],
                    oid: p.Id,
                    _entity: "people",
                    _business: this._business
                });
                console.log(p.Id);
            }
        });
    }
}
ImportService.dependencies = ["EntityService", "DbService"];
exports.ImportService = ImportService;
