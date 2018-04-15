import { ContactModel } from ".";
import { CrmModelInterface } from "../interfaces";


export class CompanyModel implements CrmModelInterface {

    _id?: string;
    
    crm: string;

    name: string;

    /**
     * storing contact ways to company ex : headquarter , factory , ...
     */
    contacts: ContactModel[];

    /**
     * related persons
     */
    persons: string[]


    /**
     * Provider , Partner , Costumer
     */
    type: string[];


    async validate() {



    }
}