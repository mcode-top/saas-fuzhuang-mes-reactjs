import type { BusOrderRecordPieceLog } from './../record-piece/typing';
import type { UserListItem } from '@/apis/person/typings';
import { request } from 'umi';
import type {
  SalesStatisiticsContractType,
  SalesStatisiticsType,
  StatisiticsRecordPieceType,
} from './typing';
/**
 * 按时间统计计件数与工资
 */
export function fetchDateStatisticsRecordPiece(rangeDate: Date[]) {
  return request<RESULT_SUCCESS<StatisiticsRecordPieceType[]>>('/statisitics/date-record-piece', {
    method: 'POST',
    data: { rangeDate },
  });
}
/**
 * 按时间统计合同单销售提成
 */
export function fetchDateStatisiticsContractSalesCommission(rangeDate: Date[]) {
  return request<
    RESULT_SUCCESS<{
      contractDataSource: SalesStatisiticsContractType[];
      salesCommissionDateSource: SalesStatisiticsType[];
    }>
  >('/statisitics/date-contract-sales', {
    method: 'POST',
    data: {
      rangeDate,
    },
  });
}

/**@name 按时间去统计员工计件工资 */
export function fetchDateStatisiticsWorkerRecordPiece(userId: number, rangeDate: Date[]) {
  return request<
    RESULT_SUCCESS<{
      worker: UserListItem;
      workerLogList: BusOrderRecordPieceLog[];
    }>
  >('/statisitics/date-worker-record-piece', {
    method: 'POST',
    data: {
      userId,
      rangeDate,
    },
  });
}
