import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'dermadetect.db',
  jsi: true,
});

export const database = new Database({
  adapter,
  modelClasses: [], // We'll add models later
});