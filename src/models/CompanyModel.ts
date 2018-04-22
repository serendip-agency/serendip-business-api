import { ContactModel } from ".";
import { CrmModelInterface } from "../interfaces";


export class CompanyModel implements CrmModelInterface {

    constructor(model?: CompanyModel) {

        if (model) {
            if (model._id)
                this._id = model._id;

            this.contacts = model.contacts;
            this.crm = model.crm;
            this.name = model.name;
            this.type = model.type;
        }
    }

    static async validate(model: any): Promise<any> {
    }

    _id?: string;

    crm: string;

    name: string;

    /**
     * storing contact ways to company ex : headquarter , factory , ...
     */
    contacts: ContactModel[];



    /**
     * Provider , Partner , Costumer
     */
    type: string[];


}