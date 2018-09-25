import { ServiceModel, ProductModel } from ".";
import { CrmModelInterface, ValidationErrorInterface } from "../interfaces";

export class ComplaintModel implements CrmModelInterface {

    constructor(model?: ComplaintModel) {
        if (model) {
            if (model._id)
                this._id = model._id;

            this.crm = model.crm;
            this.product = model.product;
            this.service = model.service;
        }
    }

    _id?: string;

    crm: string;

    service: string;

    product: string;

    company: string;

    person: string;

    receiver: string;

    receivedAt: Date;


    static async validate(model: ComplaintModel): Promise<void> {
        var errs: ValidationErrorInterface[] = [];


        if (errs && errs.length > 0)
            throw errs;

    }


}