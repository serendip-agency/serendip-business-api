import { CrmModelInterface, ValidationErrorInterface } from '../interfaces';
export class ProductCategoryModel implements CrmModelInterface {

    static async validate(model: ProductCategoryModel): Promise<void> {
        var errs: ValidationErrorInterface[] = [];

        if (errs && errs.length > 0)
            throw errs;
    }

    constructor(model: ProductCategoryModel) {

        if (model._id)
            this._id = model._id;
        this.assuranceTemplate = model.assuranceTemplate;
        this.name = model.name;
        this.crm = model.crm;
        this.master = model.master;

    }

    _id?: string;
    crm: string;
    name: string;
    master: string;
    assuranceTemplate: string;


}