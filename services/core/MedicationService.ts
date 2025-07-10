import { Medication } from '@/services/database/migrations/v1/schema_v1';
import { MedicationModel } from '@/services/database/models/MedicationModel';
import { logger } from '@/services/logging/logger';
import { useModel, getCurrentTimestamp } from '@/services/core/utils';
import { isExistingPatientById } from '@/services/core/PatientService';

// Single shared instance of model
const medicationModel = new MedicationModel();

export const isExistingMedication = async (id: number): Promise<boolean> => {
    const existingMedication = await getMedication(id);
    return !!existingMedication;
}

export const createMedication = async (medication: Partial<Medication>): Promise<Medication | null> => {
    return useModel(medicationModel, async (model) => {
        if (!medication.patient_id || !(await isExistingPatientById(medication.patient_id))) {
            logger.debug("Cannot create medication: Patient does not exist", medication.patient_id);
            return null;
        }

        const now = getCurrentTimestamp();
        const newMedication = {
            ...medication,
            active: medication.active ?? true,
            flaggedForReview: medication.flaggedForReview || false,
            created_date: now,
            updated_date: now,
            linked_health_system: medication.linked_health_system || false
        };

        const created = await model.insert(newMedication);
        logger.debug("Medication created: ", created);
        return created;
    });
}

export const getMedication = async (id: number): Promise<Medication | null> => {
    return useModel(medicationModel, async (model) => {
        const result = await model.getFirstByFields({ id });
        logger.debug("DB Medication data: ", result);
        return result;
    });
}

export const getMedicationsByPatient = async (patientId: number): Promise<Medication[]> => {
    return useModel(medicationModel, async (model) => {
        const results = await model.getByFields({ patient_id: patientId });
        logger.debug("DB Medications for patient: ", results);
        return results;
    });
}

export const updateMedication = async (medicationUpdate: Partial<Medication>, whereMap: Partial<Medication>): Promise<Medication | null> => {
    return useModel(medicationModel, async (model) => {
        const existingMedication = await model.getFirstByFields(whereMap);
        if (!existingMedication) {
            logger.debug("Medication not found for update: ", whereMap);
            return null;
        }

        const updateData = {
            ...medicationUpdate,
            updated_date: getCurrentTimestamp()
        };
        const updatedMedication = await model.updateByFields(updateData, whereMap);
        logger.debug("Updated Medication: ", updatedMedication);
        return updatedMedication;
    });
}

export const deleteMedication = async (id: number): Promise<boolean> => {
    return useModel(medicationModel, async (model) => {
        if (!(await isExistingMedication(id))) {
            logger.debug("Medication not found for deletion: ", id);
            return false;
        }

        await model.deleteByFields({ id });
        logger.debug("Deleted Medication: ", id);
        return true;
    });
} 