import { Question, ResponseOption, TrackCategory, TrackItem, TrackResponse } from "../database/migrations/v1/schema_v1";

export type AuthTokens = {
  access_token?: string;
  refresh_token?: string;
  issued_at?: string;
  expires_in?: string;
};

export type GoogleConfig = {
  REDIRECT_URI: string,
  GOOGLE_IOS_CLIENT_ID: string;
  GOOGLE_ANDROID_CLIENT_ID: string;
}

export type AlertType = 'i' | 'e' | 'w';

export const alertTitleMap: Record<AlertType, string> = {
  i: 'Info',
  e: 'Error',
  w: 'Warning',
};

// Track module types
export interface TrackCategoryWithItems extends TrackCategory {
  items: TrackItemWithProgress[];
};

export interface TrackItemWithProgress extends TrackItem {
  item: TrackItem;
  completed: number;
  total: number;
  started: boolean;
};

export interface TrackItemSelectable {
  item: TrackItem;
  selected: boolean;
}

export interface TrackCategoryWithSelectableItems {
  category: TrackCategory;
  items: TrackItemSelectable[];
}

export interface QuestionWithOptions {
  question: Question;
  options: ResponseOption[];
  existingResponse?: TrackResponse;
}