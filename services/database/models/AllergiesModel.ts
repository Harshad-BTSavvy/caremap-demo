import { BaseModel } from '@/services/database/BaseModel';
import { Allergies } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';

export class AllergiesModel extends BaseModel<Allergies> {
    constructor() {
        super(tables.ALLERGIES);
    }
} 