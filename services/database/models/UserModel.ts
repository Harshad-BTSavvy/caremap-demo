import { SQLiteDatabase } from "expo-sqlite";
import { BaseModel } from "../BaseModel";
import { User, tables } from "../migrations/v2/schema_v2";

export class UserModel extends BaseModel<User> {

  constructor(db: SQLiteDatabase) {
    super(db, `${tables.USER}`);
  }

  async getUser(email: string): Promise<User | null> {
    const result = await this.db.getFirstAsync<User>(`SELECT * FROM ${tables.USER} WHERE email = ?`, [email]);
    console.log(result);
    return result;
  }

}