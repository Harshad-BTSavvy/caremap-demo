import { Notes } from '@/services/database/migrations/v1/schema_v1';
import { NotesModel } from '@/services/database/models/NotesModel';
import { logger } from '@/services/logging/logger';
import { useModel, getCurrentTimestamp } from '@/services/core/utils';
import { isExistingPatientById } from '@/services/core/PatientService';

// Single shared instance of model
const notesModel = new NotesModel();

export const isExistingNote = async (id: number): Promise<boolean> => {
    const existingNote = await getNote(id);
    return !!existingNote;
}

export const createNote = async (note: Partial<Notes>): Promise<Notes | null> => {
    return useModel(notesModel, async (model) => {
        if (!note.patient_id || !(await isExistingPatientById(note.patient_id))) {
            logger.debug("Cannot create note: Patient does not exist", note.patient_id);
            return null;
        }

        const now = getCurrentTimestamp();
        const newNote = {
            ...note,
            reminder_date: note.reminder_date || now,
            created_date: now,
            updated_date: now
        };

        const created = await model.insert(newNote);
        logger.debug("Note created: ", created);
        return created;
    });
}

export const getNote = async (id: number): Promise<Notes | null> => {
    return useModel(notesModel, async (model) => {
        const result = await model.getFirstByFields({ id });
        logger.debug("DB Note data: ", result);
        return result;
    });
}

export const getNotesByPatient = async (patientId: number): Promise<Notes[]> => {
    return useModel(notesModel, async (model) => {
        const results = await model.getByFields({ patient_id: patientId });
        logger.debug("DB Notes for patient: ", results);
        return results;
    });
}

export const updateNote = async (noteUpdate: Partial<Notes>, whereMap: Partial<Notes>): Promise<Notes | null> => {
    return useModel(notesModel, async (model) => {
        const existingNote = await model.getFirstByFields(whereMap);
        if (!existingNote) {
            logger.debug("Note not found for update: ", whereMap);
            return null;
        }

        const updateData = {
            ...noteUpdate,
            updated_date: getCurrentTimestamp()
        };
        const updatedNote = await model.updateByFields(updateData, whereMap);
        logger.debug("Updated Note: ", updatedNote);
        return updatedNote;
    });
}

export const deleteNote = async (id: number): Promise<boolean> => {
    return useModel(notesModel, async (model) => {
        if (!(await isExistingNote(id))) {
            logger.debug("Note not found for deletion: ", id);
            return false;
        }

        await model.deleteByFields({ id });
        logger.debug("Deleted Note: ", id);
        return true;
    });
} 