import { PersonSocialModel } from "./PersonSocialModel";
import { CrmModelInterface, ValueTypeInterface } from "../interfaces";

export class PersonModel implements CrmModelInterface {

    constructor(model?: PersonModel) {

        if (model) {
            this.crm = model.crm;
            this._id = model._id;
            this.firstName = model.firstName;
            this.lastName = model.lastName;
            this.profilePicture = model.profilePicture;
            this.socials = model.socials;
            this.birthDate = model.birthDate;
            this.emails = model.emails;
            this.mobiles = model.mobiles;
            this.gender = model.gender;
            this.oid = model.oid;
            
        }
    }
    crm: string;
    static async validate(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    _id?: string;

    oid? : string;

    firstName: string;

    lastName: string;

    profilePicture: string;

    socials: ValueTypeInterface[];

    birthDate: number;

    mobiles: string[];

    emails: string[];

    gender: boolean;

}