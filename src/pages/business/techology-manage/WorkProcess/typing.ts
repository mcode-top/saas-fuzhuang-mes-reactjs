import { BusStationType } from '../Station/typing';

/**@name 工序管理类型 */
export type BusWorkProcessType = {
  id?: number;
  name: string;
  stationId: number;
  station: BusStationType;
  remark?: string;
};
