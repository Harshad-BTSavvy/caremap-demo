import { BaseModel } from "@/services/database/BaseModel";
import { HighLevelGoal, tables } from "@/services/database/migrations/v1/schema_v1";

export class HighLevelGoalModel extends BaseModel<HighLevelGoal> {
  constructor() {
    super(tables.HIGH_LEVEL_GOAL);
  }
} 