import { HighLevelGoal } from '@/services/database/migrations/v1/schema_v1';
import { HighLevelGoalModel } from '@/services/database/models/HighLevelGoalModel';
import { logger } from '@/services/logging/logger';
import { useModel, getCurrentTimestamp } from '@/services/core/utils';
import { isExistingPatientById } from '@/services/core/PatientService';

// Single shared instance of model
const highLevelGoalModel = new HighLevelGoalModel();

export const isExistingHighLevelGoal = async (id: number): Promise<boolean> => {
    const existingGoal = await getHighLevelGoal(id);
    return !!existingGoal;
}

export const createHighLevelGoal = async (goal: Partial<HighLevelGoal>): Promise<HighLevelGoal | null> => {
    return useModel(highLevelGoalModel, async (model) => {
        if (!goal.patient_id || !(await isExistingPatientById(goal.patient_id))) {
            logger.debug("Cannot create high level goal: Patient does not exist", goal.patient_id);
            return null;
        }

        const now = getCurrentTimestamp();
        const newGoal = {
            ...goal,
            status: goal.status || 'Active',
            created_date: now,
            updated_date: now,
            linked_health_system: goal.linked_health_system || false
        };

        const created = await model.insert(newGoal);
        logger.debug("High Level Goal created: ", created);
        return created;
    });
}

export const getHighLevelGoal = async (id: number): Promise<HighLevelGoal | null> => {
    return useModel(highLevelGoalModel, async (model) => {
        const result = await model.getFirstByFields({ id });
        logger.debug("DB High Level Goal data: ", result);
        return result;
    });
}

export const getHighLevelGoalsByPatient = async (patientId: number): Promise<HighLevelGoal[]> => {
    return useModel(highLevelGoalModel, async (model) => {
        const results = await model.getByFields({ patient_id: patientId });
        logger.debug("DB High Level Goals for patient: ", results);
        return results;
    });
}

export const updateHighLevelGoal = async (goalUpdate: Partial<HighLevelGoal>, whereMap: Partial<HighLevelGoal>): Promise<HighLevelGoal | null> => {
    return useModel(highLevelGoalModel, async (model) => {
        const existingGoal = await model.getFirstByFields(whereMap);
        if (!existingGoal) {
            logger.debug("High Level Goal not found for update: ", whereMap);
            return null;
        }

        const updateData = {
            ...goalUpdate,
            updated_date: getCurrentTimestamp()
        };
        const updatedGoal = await model.updateByFields(updateData, whereMap);
        logger.debug("Updated High Level Goal: ", updatedGoal);
        return updatedGoal;
    });
}

export const deleteHighLevelGoal = async (id: number): Promise<boolean> => {
    return useModel(highLevelGoalModel, async (model) => {
        if (!(await isExistingHighLevelGoal(id))) {
            logger.debug("High Level Goal not found for deletion: ", id);
            return false;
        }

        await model.deleteByFields({ id });
        logger.debug("Deleted High Level Goal: ", id);
        return true;
    });
} 