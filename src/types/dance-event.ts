import { DanceEventCategory } from "./dance-event-category";

export interface DanceEvent {
  id: number;
  eventName: string;
  startTime: string;
  endTime: string;
  status: string;
  city: string;
  createdAt: string;
  imageUrls: string[];
  updatedAt: string;
  createdBy: number;
  categories: DanceEventCategory[];
}
