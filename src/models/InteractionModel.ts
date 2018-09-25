import { SaleModel } from "./SaleModel";
import { ServiceModel, ComplaintModel } from ".";
import { PeopleModel } from "./PeopleModel";
import { CrmModelInterface, ValidationErrorInterface } from "../interfaces";

export class InteractionModel implements CrmModelInterface {

    constructor(model?: InteractionModel) {

        if (model) {

            if (model._id)
                this._id = model._id;
                
            this.crm = model.crm;
            this.company = model.company;
            this.person = model.person;
            this.sales = model.sales;
            this.services = model.services;
            this.complaints = model.complaints;
        }

    }

    static async validate(model: InteractionModel): Promise<void> {
        var errs: ValidationErrorInterface[] = [];

        if (errs && errs.length > 0)
            throw errs;
    }

    _id?: string;
    crm: string;
    company: string;
    person: string;
    sales: string[];
    services: string[];
    complaints: string[];

}