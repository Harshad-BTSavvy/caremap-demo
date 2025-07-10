import { MedicalEquipment } from '@/services/database/migrations/v1/schema_v1';
import { MedicalEquipmentModel } from '@/services/database/models/MedicalEquipmentModel';
import { logger } from '@/services/logging/logger';
import { useModel, getCurrentTimestamp } from '@/services/core/utils';
import { isExistingPatientById } from '@/services/core/PatientService';

// Single shared instance of model
const medicalEquipmentModel = new MedicalEquipmentModel();

export const isExistingMedicalEquipment = async (id: number): Promise<boolean> => {
    const existingEquipment = await getMedicalEquipment(id);
    return !!existingEquipment;
}

export const createMedicalEquipment = async (equipment: Partial<MedicalEquipment>): Promise<MedicalEquipment | null> => {
    return useModel(medicalEquipmentModel, async (model) => {
        if (!equipment.patient_id || !(await isExistingPatientById(equipment.patient_id))) {
            logger.debug("Cannot create medical equipment: Patient does not exist", equipment.patient_id);
            return null;
        }

        const now = getCurrentTimestamp();
        const newEquipment = {
            ...equipment,
            created_date: now,
            updated_date: now,
            linked_health_system: equipment.linked_health_system || false
        };

        const created = await model.insert(newEquipment);
        logger.debug("Medical Equipment created: ", created);
        return created;
    });
}

export const getMedicalEquipment = async (id: number): Promise<MedicalEquipment | null> => {
    return useModel(medicalEquipmentModel, async (model) => {
        const result = await model.getFirstByFields({ id });
        logger.debug("DB Medical Equipment data: ", result);
        return result;
    });
}

export const getMedicalEquipmentByPatient = async (patientId: number): Promise<MedicalEquipment[]> => {
    return useModel(medicalEquipmentModel, async (model) => {
        const results = await model.getByFields({ patient_id: patientId });
        logger.debug("DB Medical Equipment for patient: ", results);
        return results;
    });
}

export const updateMedicalEquipment = async (medicalEquipmentUpdate: Partial<MedicalEquipment>, whereMap: Partial<MedicalEquipment>): Promise<MedicalEquipment | null> => {
    return useModel(medicalEquipmentModel, async (model) => {
        const existingEquipment = await model.getFirstByFields(whereMap);
        if (!existingEquipment) {
            logger.debug("Medical Equipment not found for update: ", whereMap);
            return null;
        }

        const updateData = {
            ...medicalEquipmentUpdate,
            updated_date: getCurrentTimestamp()
        };
        const updatedEquipment = await model.updateByFields(updateData, whereMap);
        logger.debug("Updated Medical Equipment: ", updatedEquipment);
        return updatedEquipment;
    });
}

export const deleteMedicalEquipment = async (id: number): Promise<boolean> => {
    return useModel(medicalEquipmentModel, async (model) => {
        if (!(await isExistingMedicalEquipment(id))) {
            logger.debug("Medical Equipment not found for deletion: ", id);
            return false;
        }

        await model.deleteByFields({ id });
        logger.debug("Deleted Medical Equipment: ", id);
        return true;
    });
} 