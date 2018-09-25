import { ContactModel } from ".";
import { CrmModelInterface, ValidationErrorInterface } from "../interfaces";
import { Validator } from 'serendip'

export class CompanyModel implements CrmModelInterface {

    constructor(model?: CompanyModel) {

        if (model) {
            if (model._id)
                this._id = model._id;

            this.contacts = model.contacts;
            this.crm = model.crm;
            this.name = model.name;
            this.type = model.type;

            this.oid = model.oid;
        }
    }


    static async validate(model: CompanyModel): Promise<void> {
        var errs: ValidationErrorInterface[] = [];

        if (!Validator.isLength(model.name, 3, 64))
            errs.push({ property: 'name', type: 'length' })


        if (errs && errs.length > 0)
            throw errs;

    }

    oid?: string;

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