import { Patient } from '@/services/database/migrations/v1/schema_v1';
import { PatientModel } from '@/services/database/models/PatientModel';
import { logger } from '@/services/logging/logger';
import { useModel, getCurrentTimestamp } from '@/services/core/utils';

// Single shared instance of model
const patientModel = new PatientModel();

export const isExistingPatientByUserId = async (userId: string): Promise<boolean> => {
    const existingPatient = await getPatientByUserId(userId);
    return !!existingPatient;
}

export const isExistingPatientById = async (id: number): Promise<boolean> => {
    const existingPatient = await getPatient(id);
    return !!existingPatient;
}

export const createPatient = async (user: any): Promise<Patient> => {
    return useModel(patientModel, async (model) => {
        const exists = await isExistingPatientByUserId(user.id);
        if (exists) {
            const patient = await getPatientByUserId(user.id);
            return patient!;
        }

        const now = getCurrentTimestamp();
        const nameParts = user.name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];
        // If there are more than 2 parts, join the middle parts as middle name, otherwise undefined
        const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : undefined;

        const newPatient: Partial<Patient> = {
            user_id: user.id,
            first_name: firstName,
            last_name: lastName,
            middle_name: middleName,
            profile_image_data: user.profile_picture_url,
            created_date: now,
            updated_date: now
        };
        await model.insert(newPatient);
        const patient = await getPatientByUserId(user.id);
        logger.debug(`Patient saved to DB successfully`, `${newPatient.first_name} ${newPatient.last_name}`);
        return patient!;
    });
}

export const getPatientByUserId = async (userId: string): Promise<Patient | null> => {
    return useModel(patientModel, async (model) => {
        const result = await model.getFirstByFields({ user_id: userId });
        logger.debug("DB Patient data: ", result);
        return result;
    });
}

export const getPatient = async (id: number): Promise<Patient | null> => {
    return useModel(patientModel, async (model) => {
        const result = await model.getFirstByFields({ id });
        logger.debug("DB Patient data: ", result);
        return result;
    });
}

export const updatePatient = async (patientUpdate: Partial<Patient>, whereMap: Partial<Patient>): Promise<Patient | null> => {
    return useModel(patientModel, async (model) => {
        const existingPatient = await model.getFirstByFields(whereMap);
        if (!existingPatient) {
            logger.debug("Patient not found for update: ", whereMap);
            return null;
        }

        const updateData = {
            ...patientUpdate,
            updated_date: getCurrentTimestamp()
        };

        const updatedPatient = await model.updateByFields(updateData, whereMap);
        logger.debug("Updated DB Patient data: ", updatedPatient);
        return updatedPatient;
    });
}

export const getAllPatients = async (): Promise<Patient[]> => {
    return useModel(patientModel, async (model) => {
        return model.getAll();
    });
}

