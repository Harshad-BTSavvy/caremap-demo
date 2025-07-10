import { Allergies } from '@/services/database/migrations/v1/schema_v1';
import { AllergiesModel } from '@/services/database/models/AllergiesModel';
import { logger } from '@/services/logging/logger';
import { useModel, getCurrentTimestamp } from '@/services/core/utils';
import { isExistingPatientById } from '@/services/core/PatientService';

// Single shared instance of model
const allergiesModel = new AllergiesModel();

export const isExistingAllergy = async (id: number): Promise<boolean> => {
    const existingAllergy = await getAllergy(id);
    return !!existingAllergy;
}

export const createAllergy = async (allergy: Partial<Allergies>): Promise<Allergies | null> => {
    return useModel(allergiesModel, async (model) => {
        if (!allergy.patient_id || !(await isExistingPatientById(allergy.patient_id))) {
            logger.debug("Cannot create allergy: Patient does not exist", allergy.patient_id);
            return null;
        }

        const now = getCurrentTimestamp();
        const newAllergy = {
            ...allergy,
            onset_date: allergy.onset_date || now,
            active: allergy.active ?? true,
            severity: allergy.severity || 'Mild',
            created_date: now,
            updated_date: now,
            linked_health_system: allergy.linked_health_system || false
        };

        const created = await model.insert(newAllergy);
        logger.debug("Allergy created: ", created);
        return created;
    });
}

export const getAllergy = async (id: number): Promise<Allergies | null> => {
    return useModel(allergiesModel, async (model) => {
        const result = await model.getFirstByFields({ id });
        logger.debug("DB Allergy data: ", result);
        return result;
    });
}

export const getAllergiesByPatient = async (patientId: number): Promise<Allergies[]> => {
    return useModel(allergiesModel, async (model) => {
        const results = await model.getByFields({ patient_id: patientId });
        logger.debug("DB Allergies for patient: ", results);
        return results;
    });
}

export const updateAllergy = async (allergyUpdate: Partial<Allergies>, whereMap: Partial<Allergies>): Promise<Allergies | null> => {
    return useModel(allergiesModel, async (model) => {
        const existingAllergy = await model.getFirstByFields(whereMap);
        if (!existingAllergy) {
            logger.debug("Allergy not found for update: ", whereMap);
            return null;
        }

        const updateData = {
            ...allergyUpdate,
            updated_date: getCurrentTimestamp()
        };
        const updatedAllergy = await model.updateByFields(updateData, whereMap);
        logger.debug("Updated Allergy: ", updatedAllergy);
        return updatedAllergy;
    });
}

export const deleteAllergy = async (id: number): Promise<boolean> => {
    return useModel(allergiesModel, async (model) => {
        if (!(await isExistingAllergy(id))) {
            logger.debug("Allergy not found for deletion: ", id);
            return false;
        }

        await model.deleteByFields({ id });
        logger.debug("Deleted Allergy: ", id);
        return true;
    });
} 