import { ServerServiceInterface, Server, DbService } from "serendip";
import * as fs from "fs";
import { join } from "path";
import * as _ from "underscore";
import { EntityService } from "./EntityService";

export class ImportService implements ServerServiceInterface {
  static dependencies = ["EntityService", "DbService"];

  private dbService: DbService;
  private entityService: EntityService;

  private data: any;

  constructor() {
    this.dbService = Server.services["DbService"];
    this.entityService = Server.services["EntityService"];
  }

  _business = "5c3731c0227df05a6a429674";

  async start() {
    // this.data = JSON.parse(
    //   fs.readFileSync(join(Server.dir, "..", "ignore.json")).toString()
    // );
    // this.importPeoples();
    // this.importCompanies();
  }

  async importCompanies() {
    this.data.clients.forEach(async p => {
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
        } as any);

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
    this.data.persons.forEach(async (p: any) => {
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
        } as any);

        console.log(p.Id);
      }
    });
  }
}
