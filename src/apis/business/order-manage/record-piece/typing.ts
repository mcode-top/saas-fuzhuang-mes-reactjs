import type { BusWorkProcessType } from '../../../../pages/business/techology-manage/WorkProcess/typing';
import type { UserListItem } from '@/apis/person/typings';
import type { BusOrderManufacture } from '../manufacture/typing';

/**@name 计件单 - 员工与工序计件数量 */
export type BusRecordPieceStaffAndWorkProcess = {
  /**@name 绑定用户数量 */
  userId: number;
  /**@name 绑定工序 */
  workProcessId: number;
  /**@name 计件数量 */
  total: number;
  /**@name 领料数量 */
  materialNumber?: number;
};
/**@name 计件单 */
export type BusOrderRecordPiece = {
  id: number;
  manufactureId: number;
  manufacture: BusOrderManufacture;
  staffAndWorkProcessList: BusRecordPieceStaffAndWorkProcess[];
};

/**@name 计件单记录 */
export type BusOrderRecordPieceLog = {
  recordPieceId: number;
  recordPiece: BusOrderRecordPiece;
  workProcessId: number;
  workProcess: BusWorkProcessType;
  price: number;
  number: number;
  materialNumber?: number;
  userId: number;
  workerUser: UserListItem;
};
/**@name 填写计件单 */
export type RecordPieceAddDto = {
  manufactureId: number;
  staffAndWorkProcessList: BusRecordPieceStaffAndWorkProcess[];
};

/**@name 获取计件单当前工序员工记录 */
export type RecordPieceWatchLogDto = {
  recordPieceId: number;
  workProcessId: number;
  userId: number;
};
