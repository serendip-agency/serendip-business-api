import { ValidationErrorInterface } from ".";

export interface CrmModelInterface {

  _id?: string;

  /**
   * related CRM
   */
  crm: string;

  lastChange?: number;

  /**
   * model validation
   */
  validate?(model: any): Promise<ValidationErrorInterface[]>;

}