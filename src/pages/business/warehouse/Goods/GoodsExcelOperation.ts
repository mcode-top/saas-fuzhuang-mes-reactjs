import storageDataSource from '@/utils/storage';
import { fetchCheckMaterialCode } from '@/apis/business/techology-manage/material';
import type { ExcelManyPutInGoodsDataDto } from '@/apis/business/warehouse/typing';
import { arrayAttributeChange } from '@/utils';
import { fileToBinaryString, SelectLocalFile } from '@/utils/upload/upload';
import { pick } from 'lodash';
import { read, utils, writeFileXLSX } from 'xlsx';
import { STORAGE_SIZE_TEMPLATE_TREE } from '@/configs/storage.config';
import type {
  BusSizeTemplateItemType,
  BusSizeTemplateParentType,
} from '../../techology-manage/SizeTemplate/typing';

export function GoodsImportExcelPutIn() {
  return SelectLocalFile({ accept: '.xlsx' }).then(async (file) => {
    if (file instanceof File) {
      const wb = read(await fileToBinaryString(file), { type: 'binary' });
      const sheetNames = wb.SheetNames; // 工作表名称集合
      const worksheet = wb.Sheets[sheetNames[0]]; // 只读取第一张sheet
      const data: any = utils.sheet_to_json(worksheet);
      return arrayAttributeChange<any>(
        data.map((i) => {
          const v = pick(i, '物料编码', '尺码模板', '尺码', '颜色', '货品入库数', '入库原因');
          return {
            ...v,
          };
        }),
        [
          ['物料编码', 'materialCode'],
          ['尺码模板', 'sizeTemplateName'],
          ['尺码', 'sizeName'],
          ['颜色', 'color'],
          ['货品入库数', 'deliveryCount'],
          ['入库原因', 'remark'],
        ],
      ).filter((i) => {
        return i.deliveryCount > 0;
      }) as ExcelImportData[];
    }
  });
}
export type ExcelImportData = {
  materialCode: string;
  deliveryCount: number;
  sizeTemplateName?: string;
  sizeName?: string;
  color?: string;
  remark?: string;
};
/**@name 检查Excel导入数据=>转换为接口数据 */
export async function checkGoodsExcelDataToFetchData(data: ExcelImportData[]) {
  const errorData: (ExcelImportData & { errorText: string })[] = [];
  const filterData: ExcelImportData[] = [];
  const successData: ExcelManyPutInGoodsDataDto[] = [];
  const codeData = await fetchCheckMaterialCode(data.map((i) => i.materialCode)).then(
    (r) => r.data,
  );
  if (codeData.notExistCodes.length > 0) {
    codeData.notExistCodes.forEach((code) => {
      const findIndex = data.findIndex((i) => i.materialCode === code);
      errorData.push({
        ...data[findIndex],
        errorText: '物料编码不存在',
      });
    });
    codeData.existCodes.forEach((code) => {
      const find = data.find((i) => i.materialCode === code);
      filterData.push(find as ExcelImportData);
    });
  } else {
    filterData.push(...data);
  }
  const sizeTreeData: (BusSizeTemplateParentType & { children: BusSizeTemplateItemType[] })[] =
    await storageDataSource.getValue(STORAGE_SIZE_TEMPLATE_TREE).then((r) => r.data);
  // 提取尺码ID
  filterData.forEach((item) => {
    // 如果没有尺码数据则不处理
    if (item.sizeName === undefined && item.sizeTemplateName === undefined) {
      successData.push({
        materialCode: item.materialCode,
        deliveryCount: item.deliveryCount,
        remark: item.remark,
      });
      return;
    }
    // 如果有尺码则筛选对比系统的尺码，如果与系统的不符则报错
    const sizeParentList = sizeTreeData.find((i) => {
      return i.name === item.sizeTemplateName;
    });
    if (sizeParentList) {
      const size = sizeParentList.children.find((i) => i.name === item.sizeName);
      if (size) {
        successData.push({
          sizeId: size.id,
          sizeName: size.name,
          color: item.color,
          materialCode: item.materialCode,
          deliveryCount: item.deliveryCount,
          remark: item.remark,
        });
        return;
      }
    }
    errorData.push({ ...item, errorText: '尺码不存在' });
  });
  return {
    errorData,
    successData,
  };
}

/**@name 下载批量入库模板 */
export function GoodsExcelPutInTemplate() {
  const ws = utils.json_to_sheet([
    {
      名称: '填写名称',
      物料编码: '必填,填写物料编码(需要与系统对应)',
      货品入库数: '必填,填写货品入库数,必须大于0',
      尺码模板: '如果是成品则需要填写尺码模板(需要与系统对应)',
      尺码: '如果是成品则需要填写尺码(需要与系统对应)',
      颜色: '如果是成品需要填写颜色',
      入库原因: '填写入库原因,可不填',
    },
  ]);
  const wb = utils.book_new();
  ws['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 40 }];
  utils.book_append_sheet(wb, ws, '批量入库模板');
  writeFileXLSX(wb, '批量入库模板.xlsx');
}
