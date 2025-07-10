import { BaseModel } from '@/services/database/BaseModel';
import { Notes } from '@/services/database/migrations/v1/schema_v1';
import { tables } from '@/services/database/migrations/v1/schema_v1';

export class NotesModel extends BaseModel<Notes> {
    constructor() {
        super(tables.NOTES);
    }
} 