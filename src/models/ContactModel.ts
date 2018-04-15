import { ContactAddressModel } from "./ContactAddressModel";

export class ContactModel {

    /**
     * name of contact entry for example : headquarter office
     */
    name: string;

    address: ContactAddressModel;

    telephones: string[];

    faxes: string[];

    /**
     * array of users who are related to this contact address of company
     */
    persons : string[];

}