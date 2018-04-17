import { PersonSocialModel } from "./PersonSocialModel";
import { CrmModelInterface } from "../interfaces";

export class PersonModel implements CrmModelInterface {


    crm: string;
    validate(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    _id?: string;

    firstName: string;

    lastName: string;

    profilePicture: string;

    socials: PersonSocialModel

}