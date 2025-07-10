import { logger } from "@/services/logging/logger";
import { SQLiteDatabase } from "expo-sqlite";
import { tables } from "@/services/database/migrations/v1/schema_v1";

export const up = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${tables.USER} (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      profile_picture_url TEXT
    );

    CREATE TABLE IF NOT EXISTS ${tables.PATIENT} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL UNIQUE,
      blood_type TEXT,
      date_of_birth TEXT,
      first_name TEXT NOT NULL,
      gender TEXT,
      height REAL,
      height_unit TEXT,
      last_name TEXT NOT NULL,
      middle_name TEXT DEFAULT NULL,
      profile_image_data TEXT,
      relationship TEXT,
      weight REAL,
      weight_unit TEXT,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES ${tables.USER}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.PATIENT_SNAPSHOT} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      summary TEXT,
      health_issues TEXT,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.MEDICAL_CONDITION} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      condition_name TEXT NOT NULL,
      diagnosed_date TEXT NOT NULL DEFAULT (datetime('now')),
      linked_health_system INTEGER NOT NULL DEFAULT 0,
      flagged_for_review INTEGER NOT NULL DEFAULT 0,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.MEDICAL_EQUIPMENT} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      equipment_name TEXT NOT NULL UNIQUE COLLATE NOCASE,
      equipment_description TEXT,
      linked_health_system INTEGER NOT NULL DEFAULT 0,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.HIGH_LEVEL_GOAL} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      goal_description TEXT NOT NULL,
      target_date TEXT NOT NULL,
      status TEXT CHECK(status IN ('Active', 'Completed', 'On Hold', 'Cancelled')) DEFAULT 'Active',
      linked_health_system INTEGER NOT NULL DEFAULT 0,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.EMERGENCY_CARE} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      linked_health_system INTEGER NOT NULL DEFAULT 0,
      topic TEXT NOT NULL,
      details TEXT NOT NULL,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.ALLERGIES} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      linked_health_system INTEGER NOT NULL DEFAULT 0,
      topic TEXT NOT NULL,
      details TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      severity TEXT CHECK(severity IN ('Mild', 'Moderate', 'Severe')) DEFAULT 'Mild',
      onset_date TEXT NOT NULL DEFAULT (datetime('now')),
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.MEDICATION} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      linked_health_system INTEGER NOT NULL DEFAULT 0,
      name TEXT NOT NULL,
      details TEXT NOT NULL,
      dosage TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      administration_route TEXT,
      flaggedForReview INTEGER NOT NULL DEFAULT 0,
      created_date TEXT NOT NULL DEFAULT (datetime('now')),
      updated_date TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.NOTES} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        topic TEXT NOT NULL,
        details TEXT NOT NULL,
        reminder_date TEXT NOT NULL DEFAULT (datetime('now')),
        created_date TEXT NOT NULL DEFAULT (datetime('now')),
        updated_date TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );
  `);

  // Check if profile_picture_url column exists and add if missing
  const columns = await db.getAllAsync(`PRAGMA table_info(${tables.USER});`);
  const hasProfilePicture = columns.some((col: any) => col.name === 'profile_picture_url');

  if (!hasProfilePicture) {
    await db.execAsync(`ALTER TABLE ${tables.USER} ADD COLUMN profile_picture_url TEXT;`);
  }

  logger.debug(`Tables created for V1.`);
};