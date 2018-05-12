import { CrmModelInterface, ValidationErrorInterface } from "../interfaces";

export class ServiceModel implements CrmModelInterface {


    constructor(model?: ServiceModel) {

        if (model) {
            if (model._id)
                this._id = model._id;

            this.crm = model.crm;
            this.date = model.date;
            this.serviceType = model.serviceType;
            this.products = model.products;
        }
    }


    crm: string;

    _id?: string;

    date: number;

    serviceType: string;

    /**
     * related product
     */
    products: string[];

    static async validate(model: ServiceModel): Promise<void> {
        var errs: ValidationErrorInterface[] = [];

        if (errs && errs.length > 0)
            throw errs;

    }

}