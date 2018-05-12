import { ServiceModel, ProductModel } from ".";
import { CrmModelInterface, ValidationErrorInterface } from "../interfaces";

export class ComplaintModel implements CrmModelInterface {

    constructor(model?: ComplaintModel) {

        if (model) {
            if (model._id)
            this._id = model._id;

            this.crm = model.crm;
            this.products = model.products;
            this.services = model.services;
        }

    }
    _id?: string;

    crm: string;

    services: ServiceModel[];

    products: ProductModel[];

    static async validate(model: ComplaintModel): Promise<void> {
        var errs: ValidationErrorInterface[] = [];


        if (errs && errs.length > 0)
            throw errs;

    }


}