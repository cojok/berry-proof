import { Model } from 'pinia-orm';

export default class User extends Model {
  // required: the “entity” name under which records will be stored
  static entity = 'users';

  // define the schema fields
  static fields() {
    return {
      id:    this.uid(),
      name:  this.string(''),
      email: this.string(''),
    };
  }

  // for TypeScript, declare the props
  declare id: string;
  declare name: string;
  declare email: string;
}
