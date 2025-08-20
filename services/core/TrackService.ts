import { QuestionWithOptions, TrackCategoryWithItems, TrackCategoryWithSelectableItems } from '@/services/common/types';
import { getCurrentTimestamp } from '@/services/core/utils';
import { useModel } from '@/services/database/BaseModel';
import { tables } from '@/services/database/migrations/v1/schema_v1';
import { QuestionModel } from '@/services/database/models/QuestionModel';
import { ResponseOptionModel } from '@/services/database/models/ResponseOptionModel';
import { TrackCategoryModel } from '@/services/database/models/TrackCategoryModel';
import { TrackItemEntryModel } from '@/services/database/models/TrackItemEntryModel';
import { TrackItemModel } from '@/services/database/models/TrackItemModel';
import { TrackResponseModel } from '@/services/database/models/TrackResponseModel';
import { logger } from '@/services/logging/logger';


// Single shared instance of models
const trackCategoryModel = new TrackCategoryModel();
const trackItemModel = new TrackItemModel();
const questionModel = new QuestionModel();
const responseOptionModel = new ResponseOptionModel();
const trackResponseModel = new TrackResponseModel();
const trackItemEntryModel = new TrackItemEntryModel();

const now = getCurrentTimestamp();

export const getTrackCategoriesWithItemsAndProgress = async (
    patientId: number,
    date: string
): Promise<TrackCategoryWithItems[]> => {
    logger.debug('getTrackCategoriesWithItemsAndProgress called', { patientId, date });

    const result = await useModel(trackCategoryModel, async (categoryModel) => {
        const categories = await categoryModel.getAll();

        const items = await useModel(trackItemModel, async (itemModel: any) => {
            const result = await itemModel.runQuery(`
                 SELECT 
                    ti.id,
                    ti.name,
                    ti.category_id,
                    COUNT(DISTINCT r.question_id) AS completed,
                    COUNT(DISTINCT q.id) AS total,
                    CASE WHEN tie.id IS NULL THEN 0 ELSE 1 END AS started
                    FROM ${tables.TRACK_ITEM} ti
                    INNER JOIN ${tables.TRACK_ITEM_ENTRY} tie 
                    ON tie.track_item_id = ti.id AND tie.patient_id = ? AND tie.date = ?
                    LEFT JOIN ${tables.TRACK_RESPONSE} r 
                    ON r.track_item_entry_id = tie.id
                    LEFT JOIN ${tables.QUESTION} q
                    ON q.item_id = ti.id
                    GROUP BY ti.id
            `, [patientId, date]);
            return result as any[];
        });

        // Group items under categories and transform to match new interface
        return categories.map((cat: any) => ({
            ...cat,
            items: items.filter((item: any) => item.category_id === cat.id).map((item: any) => ({
                item: {
                    id: item.id,
                    category_id: item.category_id,
                    name: item.name,
                    created_date: item.created_date,
                    updated_date: item.updated_date
                },
                completed: item.completed,
                total: item.total,
                started: item.started === 1,
            }))
        }));
    });

    logger.debug('getTrackCategoriesWithItemsAndProgress completed', JSON.stringify(result, null, 2));
    return result;
};

export const getAllCategoriesWithSelectableItems = async (
    patientId: number,
    date: string
): Promise<TrackCategoryWithSelectableItems[]> => {
    logger.debug('getAllCategoriesWithSelectableItems called', { patientId, date });

    return useModel(trackCategoryModel, async (categoryModel) => {
        // Get all categories
        const categories = await categoryModel.getAll();

        // Get all items with a flag if already linked for this patient/date
        const items = await useModel(trackItemModel, async (itemModel: any) => {
            const result = await itemModel.runQuery(`
                SELECT 
                    ti.id,
                    ti.name,
                    ti.category_id,
                    CASE WHEN tie.id IS NULL THEN 0 ELSE 1 END AS selected
                FROM ${tables.TRACK_ITEM} ti
                LEFT JOIN ${tables.TRACK_ITEM_ENTRY} tie
                    ON tie.track_item_id = ti.id
                    AND tie.patient_id = ?
                    AND tie.date = ?
            `, [patientId, date]);
            return result as { id: number; name: string; category_id: number; selected: number }[];
        });

        // Group items under categories with "selected" mapped to boolean
        const result: TrackCategoryWithSelectableItems[] = categories.map((cat: any) => ({
            category: cat,
            items: items
                .filter((item) => item.category_id === cat.id)
                .map((item) => ({
                    item: {
                        id: item.id,
                        category_id: item.category_id,
                        name: item.name,
                    },
                    selected: item.selected === 1
                }))
        }));

        logger.debug('getAllCategoriesWithSelectableItems completed', JSON.stringify(result, null, 2));
        return result;
    });
};


export const getQuestionsWithOptions = async (
    itemId: number
): Promise<QuestionWithOptions[]> => {
    logger.debug('getQuestionsWithOptions called', { itemId });

    const result = await useModel(questionModel, async (model) => {
        const questions = await model.getByFields({ item_id: itemId });

        const allOptions = await useModel(responseOptionModel, async (optModel: any) => {
            const result = await optModel.getAll();
            return result as any[];
        });

        return questions.map((q: any) => ({
            question: q,
            options: allOptions.filter((opt: any) => opt.question_id === q.id),
            existingResponse: undefined
        }));
    });

    logger.debug('getQuestionsWithOptions completed', { itemId }, `${JSON.stringify(result)}`);
    return result;
};

export const saveResponse = async (
    entryId: number,
    questionId: number,
    answer: string,
    userId: string,
    patientId: number
): Promise<void> => {
    logger.debug('saveResponse called', { entryId, questionId, answer });

    const result = await useModel(trackResponseModel, async (model) => {
        const existing = await model.getFirstByFields({
            track_item_entry_id: entryId,
            question_id: questionId,
        });

        if (existing) {
            await model.updateByFields(
                {
                    answer: JSON.stringify(answer),
                    updated_date: getCurrentTimestamp(),
                },
                {
                    track_item_entry_id: entryId,
                    question_id: questionId,
                    user_id: userId,
                    patient_id: patientId
                }
            );
        } else {
            await model.insert({
                user_id: userId,
                patient_id: patientId,
                question_id: questionId,
                track_item_entry_id: entryId,
                answer: JSON.stringify(answer),
                created_date: getCurrentTimestamp(),
                updated_date: getCurrentTimestamp(),
            });
        }
    });

    logger.debug('saveResponse completed', { entryId, questionId, answer });
    return result;
};

export const addOptionToQuestion = async (
    questionId: number,
    label: string
): Promise<number> => {
    logger.debug('addOptionToQuestion called', { questionId, label });

    const result = await useModel(responseOptionModel, async (model) => {
        const insertResult = await model.insert({
            question_id: questionId,
            text: label,
            created_date: getCurrentTimestamp(),
            updated_date: getCurrentTimestamp(),
        });
        return insertResult.lastInsertRowId;
    });

    logger.debug('addOptionToQuestion completed', { questionId, label, result });
    return result;
};

// Link item to patient/date
export const addTrackItemOnDate = async (
    itemId: number,
    userId: string,
    patientId: number,
    date: string
): Promise<void> => {
    logger.debug('linkItemToPatientDate called', { itemId, patientId, date });

    await useModel(trackItemEntryModel, async (model) => {
        const existing = await model.getFirstByFields({
            track_item_id: itemId,
            patient_id: patientId,
            date
        });

        if (existing) {
            logger.debug('linkItemToPatientDate: Item already linked', { itemId, patientId, date });
            return;
        }

        await model.insert({
            user_id: userId,
            patient_id: patientId,
            track_item_id: itemId,
            date,
            created_date: now,
            updated_date: now,
        });
    });

    logger.debug('linkItemToPatientDate completed', { itemId, patientId, date });
};

// Unlink item from patient/date
export const removeTrackItemFromDate = async (
    itemId: number,
    userId: string,
    patientId: number,
    date: string
): Promise<void> => {
    logger.debug('unlinkItemFromPatientDate called', { itemId, patientId, date });

    await useModel(trackItemEntryModel, async (model) => {
        const existing = await model.getFirstByFields({
            track_item_id: itemId,
            patient_id: patientId,
            date
        });

        if (!existing) {
            logger.debug('unlinkItemFromPatientDate: Item not linked', { itemId, patientId, date });
            return;
        }

        await model.deleteByFields({
            track_item_id: itemId,
            user_id: userId,
            patient_id: patientId,
            date
        });
    });

    logger.debug('unlinkItemFromPatientDate completed', { itemId, patientId, date });
};