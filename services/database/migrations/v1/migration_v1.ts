import { tables } from "@/services/database/migrations/v1/schema_v1";
import { logger } from "@/services/logging/logger";
import { SQLiteDatabase } from "expo-sqlite";

export const up = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${tables.USER} (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT
    );

    CREATE TABLE IF NOT EXISTS ${tables.PATIENT} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      age INTEGER,
      relationship TEXT,
      weight REAL,
      height REAL,
      gender TEXT,
      birthdate TEXT,
      profile_picture TEXT,
      FOREIGN KEY(user_id) REFERENCES ${tables.USER}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.PATIENT_SNAPSHOT} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      summary TEXT,
      health_issues TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.MEDICAL_CONDITION} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      condition_name TEXT NOT NULL,
      diagnosed_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      linked_health_system INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.MEDICAL_EQUIPMENT} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      equipment_name TEXT NOT NULL,
      description TEXT,
      linked_health_system INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.HIGH_LEVEL_GOAL} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      goal_description TEXT NOT NULL,
      target_date TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );
  `);

  logger.debug(`Tables created for V1.`);
};