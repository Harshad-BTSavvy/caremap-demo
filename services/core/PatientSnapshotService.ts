import { PatientSnapshot } from '@/services/database/migrations/v1/schema_v1';
import { PatientSnapshotModel } from '@/services/database/models/PatientSnapshotModel';
import { logger } from '@/services/logging/logger';
import { useModel, getCurrentTimestamp } from '@/services/core/utils';
import { isExistingPatientById } from '@/services/core/PatientService';

// Single shared instance of model
const snapshotModel = new PatientSnapshotModel();

export const isExistingPatientSnapshot = async (patientId: number): Promise<boolean> => {
    const existingSnapshot = await getPatientSnapshot(patientId);
    return !!existingSnapshot;
}

export const createPatientSnapshot = async (snapshot: Partial<PatientSnapshot>): Promise<PatientSnapshot | null> => {
    return useModel(snapshotModel, async (model) => {
        if (!snapshot.patient_id || !(await isExistingPatientById(snapshot.patient_id))) {
            logger.debug("Cannot create snapshot: Patient does not exist", snapshot.patient_id);
            return null;
        }

        const existingSnapshot = await getPatientSnapshot(snapshot.patient_id);
        if (existingSnapshot) {
            logger.debug("Snapshot already exists for patient: ", snapshot.patient_id);
            return existingSnapshot;
        }

        const now = getCurrentTimestamp();
        const newSnapshot = {
            ...snapshot,
            created_date: now,
            updated_date: now,
        };

        const created = await model.insert(newSnapshot);
        logger.debug("Snapshot created: ", created);
        return created;
    });
}

export const getPatientSnapshot = async (patientId: number): Promise<PatientSnapshot | null> => {
    return useModel(snapshotModel, async (model) => {
        const result = await model.getFirstByFields({ patient_id: patientId });
        logger.debug("DB Patient Snapshot data: ", result);
        return result;
    });
}

export const updatePatientSnapshot = async (snapshotUpdate: Partial<PatientSnapshot>, whereMap: Partial<PatientSnapshot>): Promise<PatientSnapshot | null> => {
    return useModel(snapshotModel, async (model) => {
        const existingSnapshot = await model.getFirstByFields(whereMap);
        if (!existingSnapshot) {
            logger.debug("Snapshot not found for update: ", whereMap);
            return null;
        }

        const updateData = {
            ...snapshotUpdate,
            updated_date: getCurrentTimestamp()
        };
        const updatedSnapshot = await model.updateByFields(updateData, whereMap);
        logger.debug("Updated DB Patient Snapshot data: ", updatedSnapshot);
        return updatedSnapshot;
    });
} 