import { ContactAddressModel } from "./ContactAddressModel";
import { CrmModelInterface, ValueTypeInterface } from "..";

export class ContactModel {

    // validate?(model: any): Promise<ValidationErrorInterface[]> {
    //     throw new Error("Method not implemented.");
    // }
    constructor(model: ContactModel) {
        this.name = model.name;
        this.address = model.address;
        this.faxes = model.faxes;
        this.telephones = model.telephones;
        this.persons = model.persons;
    }


    /**
     * name of contact entry for example : headquarter office
     */
    name: string;

    address: ContactAddressModel;

    telephones: ValueTypeInterface[];

    faxes: ValueTypeInterface[];

    /**
     * array of users who are related to this contact address of company
     */
    persons: ValueTypeInterface[];

}