import { BaseModel } from '@/services/database/BaseModel';
import { Medication } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';

export class MedicationModel extends BaseModel<Medication> {
    constructor() {
        super(tables.MEDICATION);
    }
} 