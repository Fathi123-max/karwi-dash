import { Washer } from "../../washers/_components/types";

export type ScheduleDetail = {
  id: string;
  washer: Washer;
  startTime: string;
  endTime: string;
};
