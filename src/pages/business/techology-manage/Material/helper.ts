import { fetchCheckOneCodeUnique } from '@/apis/business/techology-manage/material';

/**@name 检查物料编码是否存在校验 */
export function validatorMaterialCode(rule, value, callback) {
  return new Promise<void>(async (resolve, reject) => {
    if (value) {
      if (value.length <= 4) {
        return reject(new Error('物料编码必须大于4位'));
      }
      const result = (await fetchCheckOneCodeUnique(value)).data;

      if (result) {
        return reject(new Error('物料编码已存在'));
      } else {
        return resolve();
      }
    }
    return reject(new Error('物料编码必填'));
  });
}
