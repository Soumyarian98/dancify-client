import { DanceEvent } from "./dance-event";
import { DanceEventCategory } from "./dance-event-category";

export type BattleCartResponse = BattleCartItem[];

export interface BattleCartItem {
  id: number;
  createdAt: string;
  category: DanceEventCategory;
  event: DanceEvent;
}
