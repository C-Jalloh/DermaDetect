import { Model } from '@nozbe/watermelondb';

export class Patient extends Model {
  static table = 'patients';

  // Define fields without decorators for now
  get firstName() { return this._raw.first_name; }
  get lastName() { return this._raw.last_name; }
  get dob() { return this._raw.dob; }
  get gender() { return this._raw.gender; }
  get contactInfo() { return this._raw.contact_info; }
}