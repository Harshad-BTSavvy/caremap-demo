import { BaseModel } from '@/services/database/BaseModel';
import { EmergencyCare } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';

export class EmergencyCareModel extends BaseModel<EmergencyCare> {
    constructor() {
        super(tables.EMERGENCY_CARE);
    }
} 