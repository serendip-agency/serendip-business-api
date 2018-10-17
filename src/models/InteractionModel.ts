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


    // related company id in database
    company: string;


    // type of interaction ex: telephone, in person, email, website, 
    type: string;

    // could be in or out
    path: string;

    // related person id in database
    person: string;


    user: string;

    // array of related sales id in database
    sales: string[];

    // array of related services id
    services: string[];

    // array of related complaints
    complaints: string[];

    campaignTrees: {
        // utm_campaign should be campaign id of existing record in database
        campaign: string,
        // utm_source ex: google, newsletter
        source: string,
        // utm_medium ex: banner, cpc, email
        medium: string,
        // utm_content will be used for A/B testing ex: google-ad-1, logoWeb 
        content: string
    }

    // Date when interaction inserted in our database
    submitDate: Date;

    // Date when interaction happened
    interactDate: Date;

}