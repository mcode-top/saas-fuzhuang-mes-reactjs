import { request } from 'umi';
import type { BusOrderManufacture } from '../manufacture/typing';
import type {
  BusOrderRecordPiece,
  BusOrderRecordPieceLog,
  RecordPieceAddDto,
  RecordPieceWatchLogDto,
} from './typing';

/**@name 生产单已完成可以填写计件单的分页 */
export function fetchManufactureUseModfiyRecordPieceList(data: PAGINATION_QUERY.Param) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<BusOrderManufacture>>>(
    '/record-piece/page',
    {
      method: 'POST',
      data,
    },
  );
}

/**@name 通过生产Id获取计件单 */
export function fetchManufactureIdToOneRecordPiece(manufactureId: number) {
  return request<RESULT_SUCCESS<BusOrderRecordPiece>>('/record-piece/watch/' + manufactureId, {
    method: 'GET',
  });
}
/**@name 给生产单添加计件量 */
export function fetchRecordPieceAdd(data: RecordPieceAddDto) {
  return request<RESULT_SUCCESS<BusOrderRecordPiece>>('/record-piece/add', {
    method: 'POST',
    data,
  });
}

/**@name 获取计件单记录 */
export function fetchRecordPieceLogList(recordPieceId: number) {
  return request<RESULT_SUCCESS<BusOrderRecordPieceLog[]>>(
    '/record-piece/watch-log/' + recordPieceId,
    {
      method: 'GET',
    },
  );
}
/**@name 获取计件单当前工序员工记录 */
export function fetchWorkProcessLogList(params: RecordPieceWatchLogDto) {
  return request<RESULT_SUCCESS<BusOrderRecordPieceLog[]>>('/record-piece/watch-workProcess-log', {
    method: 'GET',
    params,
  });
}
