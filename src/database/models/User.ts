import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class User extends Model {
  static table = 'users';

  @field('username') username!: string;
  @field('hashed_password') hashedPassword!: string;
  @field('role') role!: 'CHW' | 'Doctor';
}