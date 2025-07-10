import { MedicalCondition } from '@/services/database/migrations/v1/schema_v1';
import { MedicalConditionModel } from '@/services/database/models/MedicalConditionModel';
import { logger } from '@/services/logging/logger';
import { useModel, getCurrentTimestamp } from '@/services/core/utils';
import { isExistingPatientById } from '@/services/core/PatientService';

// Single shared instance of model
const medicalConditionModel = new MedicalConditionModel();

export const isExistingMedicalCondition = async (id: number): Promise<boolean> => {
    const existingCondition = await getMedicalCondition(id);
    return !!existingCondition;
}

export const createMedicalCondition = async (condition: Partial<MedicalCondition>): Promise<MedicalCondition | null> => {
    return useModel(medicalConditionModel, async (model) => {
        if (!condition.patient_id || !(await isExistingPatientById(condition.patient_id))) {
            logger.debug("Cannot create medical condition: Patient does not exist", condition.patient_id);
            return null;
        }

        const now = getCurrentTimestamp();
        const newCondition = {
            ...condition,
            diagnosed_date: condition.diagnosed_date || now,
            flagged_for_review: condition.flagged_for_review || false,
            created_date: now,
            updated_date: now,
            linked_health_system: condition.linked_health_system || false
        };

        const created = await model.insert(newCondition);
        logger.debug("Medical Condition created: ", created);
        return created;
    });
}

export const getMedicalCondition = async (id: number): Promise<MedicalCondition | null> => {
    return useModel(medicalConditionModel, async (model) => {
        const result = await model.getFirstByFields({ id });
        logger.debug("DB Medical Condition data: ", result);
        return result;
    });
}

export const getMedicalConditionsByPatient = async (patientId: number): Promise<MedicalCondition[]> => {
    return useModel(medicalConditionModel, async (model) => {
        const results = await model.getByFields({ patient_id: patientId });
        logger.debug("DB Medical Conditions for patient: ", results);
        return results;
    });
}

export const updateMedicalCondition = async (medicalConditionUpdate: Partial<MedicalCondition>, whereMap: Partial<MedicalCondition>): Promise<MedicalCondition | null> => {
    return useModel(medicalConditionModel, async (model) => {
        const existingCondition = await model.getFirstByFields(whereMap);
        if (!existingCondition) {
            logger.debug("Medical Condition not found for update: ", whereMap);
            return null;
        }

        const updateData = {
            ...medicalConditionUpdate,
            updated_date: getCurrentTimestamp()
        };
        const updatedCondition = await model.updateByFields(updateData, whereMap);
        logger.debug("Updated Medical Condition: ", updatedCondition);
        return updatedCondition;
    });
}

export const deleteMedicalCondition = async (id: number): Promise<boolean> => {
    return useModel(medicalConditionModel, async (model) => {
        if (!(await isExistingMedicalCondition(id))) {
            logger.debug("Medical Condition not found for deletion: ", id);
            return false;
        }

        await model.deleteByFields({ id });
        logger.debug("Deleted Medical Condition: ", id);
        return true;
    });
} 