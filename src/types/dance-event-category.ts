import { DanceEventRole } from "./dance-event-role";
import { EventLocation } from "./event-location";

export interface DanceEventCategory {
  id: number;
  categoryName: string;
  style: string;
  gender: string;
  ageGroup: string;
  teamSize: number;
  createdAt: string;
  entryFee: number;
  imageUrls: string[];
  updatedAt: string;
  location: EventLocation | null;
  eventId: number;
  roles: DanceEventRole[];
}
