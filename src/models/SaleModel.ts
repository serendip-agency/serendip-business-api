import { CrmModelInterface } from "../interfaces";

export class SaleItemModel{


}

export class SaleModel implements CrmModelInterface{

    crm: string;
    validate(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    _id?: string;
    
    date : number;
    items : SaleItemModel[];
    company : string;
    

}