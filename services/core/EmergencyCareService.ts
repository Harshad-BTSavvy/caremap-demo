import { EmergencyCare } from '@/services/database/migrations/v1/schema_v1';
import { EmergencyCareModel } from '@/services/database/models/EmergencyCareModel';
import { logger } from '@/services/logging/logger';
import { useModel, getCurrentTimestamp } from '@/services/core/utils';
import { isExistingPatientById } from '@/services/core/PatientService';

// Single shared instance of model
const emergencyCareModel = new EmergencyCareModel();

export const isExistingEmergencyCare = async (id: number): Promise<boolean> => {
    const existingCare = await getEmergencyCare(id);
    return !!existingCare;
}

export const createEmergencyCare = async (care: Partial<EmergencyCare>): Promise<EmergencyCare | null> => {
    return useModel(emergencyCareModel, async (model) => {
        if (!care.patient_id || !(await isExistingPatientById(care.patient_id))) {
            logger.debug("Cannot create emergency care: Patient does not exist", care.patient_id);
            return null;
        }

        const now = getCurrentTimestamp();
        const newCare = {
            ...care,
            created_date: now,
            updated_date: now,
            linked_health_system: care.linked_health_system || false
        };

        const created = await model.insert(newCare);
        logger.debug("Emergency Care created: ", created);
        return created;
    });
}

export const getEmergencyCare = async (id: number): Promise<EmergencyCare | null> => {
    return useModel(emergencyCareModel, async (model) => {
        const result = await model.getFirstByFields({ id });
        logger.debug("DB Emergency Care data: ", result);
        return result;
    });
}

export const getEmergencyCareByPatient = async (patientId: number): Promise<EmergencyCare[]> => {
    return useModel(emergencyCareModel, async (model) => {
        const results = await model.getByFields({ patient_id: patientId });
        logger.debug("DB Emergency Care for patient: ", results);
        return results;
    });
}

export const updateEmergencyCare = async (careUpdate: Partial<EmergencyCare>, whereMap: Partial<EmergencyCare>): Promise<EmergencyCare | null> => {
    return useModel(emergencyCareModel, async (model) => {
        const existingCare = await model.getFirstByFields(whereMap);
        if (!existingCare) {
            logger.debug("Emergency Care not found for update: ", whereMap);
            return null;
        }

        const updateData = {
            ...careUpdate,
            updated_date: getCurrentTimestamp()
        };
        const updatedCare = await model.updateByFields(updateData, whereMap);
        logger.debug("Updated Emergency Care: ", updatedCare);
        return updatedCare;
    });
}

export const deleteEmergencyCare = async (id: number): Promise<boolean> => {
    return useModel(emergencyCareModel, async (model) => {
        if (!(await isExistingEmergencyCare(id))) {
            logger.debug("Emergency Care not found for deletion: ", id);
            return false;
        }

        await model.deleteByFields({ id });
        logger.debug("Deleted Emergency Care: ", id);
        return true;
    });
} 