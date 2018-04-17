export interface CrmModelInterface {

  _id?: string;

  /**
   * related CRM
   */
  crm: string;



  /**
   * model validation
   */
   validate?(model: any): Promise<any>;


}