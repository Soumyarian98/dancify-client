import { User } from "./user";

export interface DanceEventRole {
  id: number;
  eventId: number;
  user: Pick<User, "name" | "id" | "email" | "stageName" | "profilePicture">;
  role: "dj" | "judge" | "mc";
  createdAt: string;
}
