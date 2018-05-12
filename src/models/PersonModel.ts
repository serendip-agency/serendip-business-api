import { PersonSocialModel } from "./PersonSocialModel";
import { CrmModelInterface, ValueTypeInterface, ValidationErrorInterface } from "../interfaces";
import { Validator } from "serendip";

export class PersonModel implements CrmModelInterface {

    constructor(model?: PersonModel) {

        if (model) {
            this.crm = model.crm;

            if (model._id)
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
    static async validate(model: PersonModel): Promise<void> {
        var errs: ValidationErrorInterface[] = [];


        if (errs && errs.length > 0)
            throw errs;

    }
    _id?: string;

    oid?: string;

    firstName: string;

    lastName: string;

    profilePicture: string;

    socials: ValueTypeInterface[];

    birthDate: number;

    mobiles: string[];

    emails: string[];

    gender: boolean;

}