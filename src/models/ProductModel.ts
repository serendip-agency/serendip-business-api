import { CrmModelInterface, ValidationErrorInterface } from "../interfaces";
import { Validator } from "serendip";

export class ProductModel implements CrmModelInterface {

    constructor(model?: ProductModel) {

        if (model) {

            if (model._id)
                this._id = model._id;

            this.crm = model.crm;
            this.name = model.name;
            this.price = model.price;
            this.priceCurrency = model.priceCurrency;

        }

    }

    static async validate(model: ProductModel): Promise<void> {
        var errs: ValidationErrorInterface[] = [];
        if (errs && errs.length > 0)
            throw errs;
    }

    _id?: string;
    crm: string;

    name: string;

    price: number;

    priceCurrency: string;



}