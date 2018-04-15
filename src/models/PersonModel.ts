import { PersonSocialModel } from "./PersonSocialModel";

export class PersonModel {


    _id?: string;
    firstName: string;

    lastName: string;

    profilePicture: string;

    socials: PersonSocialModel

}