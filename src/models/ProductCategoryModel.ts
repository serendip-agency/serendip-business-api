import { CrmModelInterface, ValidationErrorInterface } from '../interfaces';
export class ProductCategoryModel implements CrmModelInterface {

    static async validate(model: ProductCategoryModel): Promise<void> {
        var errs: ValidationErrorInterface[] = [];

        if (errs && errs.length > 0)
            throw errs;
    }

    constructor(model : ProductCategoryModel){
        
    }

    _id?: string;
    crm: string;


    name: string;
    assuranceTemplate: string;

}