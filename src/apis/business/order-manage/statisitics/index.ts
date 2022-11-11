import { request } from 'umi';
/**
 * 按月统计计件数与工资
 */
export function fetchMonthStatisticsRecordPiece(rangeDate: Date[]) {
  return request<RESULT_SUCCESS>('/statisitics/month-record-piece', {
    method: 'GET',
    params: { rangeDate },
  });
}
/**
 * 按月统计合同单销售提成
 */
export function fetchMonthStatisiticsContractSalesCommission(rangeDate: Date[]) {
  return request<RESULT_SUCCESS>('/statisitics/month-contract-sales', {
    method: 'GET',
    params: {
      rangeDate,
    },
  });
}
