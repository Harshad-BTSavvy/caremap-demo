import { SQLiteDatabase } from "expo-sqlite";
import { tables } from "./schema_v2";

export const up = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${tables.USER} (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ${tables.PATIENT} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL UNIQUE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      dob TEXT,
      gender TEXT,
      phone TEXT,
      address TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES ${tables.USER}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.PATIENT_SNAPSHOT} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      summary TEXT,
      health_issues TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.MEDICAL_CONDITION} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      condition_name TEXT NOT NULL,
      source TEXT,
      diagnosed_date TEXT,
      notes TEXT,
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.MEDICAL_EQUIPMENT} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      equipment_name TEXT NOT NULL,
      usage_description TEXT,
      is_daily_use INTEGER NOT NULL DEFAULT 0,
      added_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.HIGH_LEVEL_GOAL} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      goal_title TEXT NOT NULL,
      description TEXT,
      target_date TEXT,
      source TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (patient_id) REFERENCES ${tables.PATIENT}(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${tables.GOAL_PROGRESS} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      note TEXT,
      FOREIGN KEY (goal_id) REFERENCES ${tables.HIGH_LEVEL_GOAL}(id) ON DELETE CASCADE
    );`
  );

  console.log('V2 migration completed successfully');
};

export const down = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    -- First, backup v2 data that we want to preserve
    CREATE TEMPORARY TABLE user_backup AS
    SELECT id, email, name FROM ${tables.USER};

    CREATE TEMPORARY TABLE patient_backup AS
    SELECT p.id, p.user_id, p.first_name || ' ' || p.last_name as name,
           NULL as age, NULL as relationship, NULL as weight,
           NULL as height, p.gender, p.dob as birthdate
    FROM ${tables.PATIENT} p;

    -- Drop v2 tables
    DROP TABLE IF EXISTS ${tables.GOAL_PROGRESS};
    DROP TABLE IF EXISTS ${tables.HIGH_LEVEL_GOAL};
    DROP TABLE IF EXISTS ${tables.MEDICAL_EQUIPMENT};
    DROP TABLE IF EXISTS ${tables.MEDICAL_CONDITION};
    DROP TABLE IF EXISTS ${tables.PATIENT_SNAPSHOT};
    DROP TABLE IF EXISTS ${tables.PATIENT};
    DROP TABLE IF EXISTS ${tables.USER};

    -- Create v1 tables
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT
    );

    CREATE TABLE patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      age INTEGER,
      relationship TEXT,
      weight REAL,
      height REAL,
      gender TEXT,
      birthdate TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Restore data from backup
    INSERT INTO users (id, email, name)
    SELECT id, email, name FROM user_backup;

    INSERT INTO patients (user_id, name, age, relationship, weight, height, gender, birthdate)
    SELECT user_id, name, age, relationship, weight, height, gender, birthdate FROM patient_backup;

    -- Drop temporary tables
    DROP TABLE user_backup;
    DROP TABLE patient_backup;
  `);

  console.log('V2 migration reverted successfully');
};