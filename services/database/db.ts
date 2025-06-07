import { SQLITE_DB_NAME } from "@/utils/config";
import { SQLiteDatabase } from "expo-sqlite";
import * as v1 from './migrations/v1/migration_v1';
import * as v2 from './migrations/v2/migration_v2';

export const DB_NAME = SQLITE_DB_NAME;
export const DB_VERSION = 2;

export const useDatabase = (db: SQLiteDatabase) => {
    const runMigrations = async (targetVersion?: number) => {
        const result = await db.getAllAsync<{ user_version: number }>(
            `PRAGMA user_version;`
        );
        const currentVersion = result[0]?.user_version ?? 0;
        const migrationTarget = targetVersion ?? DB_VERSION;

        console.log("Current DB version:", currentVersion);
        console.log("Target DB version:", migrationTarget);

        if (currentVersion === migrationTarget) {
            console.log("Database is already at target version");
            return;
        }

        await db.withTransactionAsync(async () => {
            if (currentVersion < migrationTarget) {
                // Upgrading
                console.log("Upgrading database...");
                if (currentVersion < 1 && migrationTarget >= 1) {
                    await v1.up(db);
                }
                if (currentVersion < 2 && migrationTarget >= 2) {
                    await v2.up(db);
                }
            } else {
                // Downgrading
                console.log("Downgrading database...");
                if (currentVersion >= 2 && migrationTarget < 2) {
                    await v2.down(db);
                }
                if (currentVersion >= 1 && migrationTarget < 1) {
                    await v1.down(db);
                }
            }
            await db.execAsync(`PRAGMA user_version = ${migrationTarget}`);
        });

        console.log(`Database migrated to version ${migrationTarget}`);
    };

    const migrateDown = async (targetVersion: number) => {
        if (targetVersion < 0 || targetVersion >= DB_VERSION) {
            throw new Error(`Invalid target version: ${targetVersion}. Must be between 0 and ${DB_VERSION - 1}`);
        }
        await runMigrations(targetVersion);
    };

    return { db, runMigrations, migrateDown };
};