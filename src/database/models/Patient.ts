// import { Model } from '@nozbe/watermelondb';

// export class Patient extends Model {
//   static table = 'patients';

//   // Define fields without decorators for now
//   get firstName() { return this._raw.first_name; }
//   get lastName() { return this._raw.last_name; }
//   get dob() { return this._raw.dob; }
//   get gender() { return this._raw.gender; }
//   get contactInfo() { return this._raw.contact_info; }
// }

// Temporary mock Patient model for development
export class Patient {
  // Mock model methods will be replaced with real backend integration
  static table = 'patients';

  get firstName() { return 'Mock'; }
  get lastName() { return 'Patient'; }
  get dob() { return '1990-01-01'; }
  get gender() { return 'Unknown'; }
  get contactInfo() { return 'mock@contact.com'; }
}