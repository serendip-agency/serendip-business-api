import { CrmModelInterface, ValidationErrorInterface } from "../interfaces";

export class SaleItemModel{


}

export class SaleModel implements CrmModelInterface{

    
    constructor(model?: SaleModel) {

        if (model) {
            if (model._id)
                this._id = model._id;

            this.crm = model.crm;

            this.date = model.date;
            this.items = model.items;
            this.company = model.company;

        }
    }


    crm: string;

 
    _id?: string;
    
    date : number;
    items : SaleItemModel[];
    company : string;
    
    static async validate(model: SaleModel): Promise<void> {
        var errs: ValidationErrorInterface[] = [];

        if (errs && errs.length > 0)
            throw errs;

    }

}