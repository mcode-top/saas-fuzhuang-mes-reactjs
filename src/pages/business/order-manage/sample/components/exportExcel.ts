import { cloneDeep } from 'lodash';
import type { FillExcelColumn } from '@/utils/excel';
import { excelFillCol } from '@/utils/excel';
import { duplicateRowWithMergedCells } from '@/utils/excel';
import { browersArrayBufferDownload } from '@/utils/upload/upload';
import Excel from 'exceljs';
import type {
  BusOrderContract,
  OrderSampleStyleDemand,
} from '@/apis/business/order-manage/contract/typing';
import { dictValueEnum, OrderContractTypeValueEnum } from '@/configs/commValueEnum';

/**@name 导出寄样单Excel */
export function exportSendSampleExcel(title: string, sampleForm: BusOrderContract) {
  const data = cloneDeep(sampleForm);
  console.log(data);

  const replaceAttrDom = document.querySelectorAll(
    ".ant-tabs-tabpane-active [class*='send-sample-excel-data-']",
  );
  // 将表单中的id|值更改为实际的显示文本
  replaceAttrDom.forEach((e) => {
    const reg = e.className.matchAll(/send-sample-excel-data-([\w]+)/g);
    const attr = reg.next().value[1];
    console.log(e.querySelector('.ant-form-item-control-input-content'));

    const value = (e.querySelector('.ant-form-item-control-input-content') as any)?.innerText || '';
    data[attr] = value;
  });
  (data as any).distributionPrint = data.distributionPrint ? '是' : '否';
  // 加载public下的模板文件 contract_template.xlsx
  return fetch('/send_sample_template.xlsx', {
    method: 'GET',
  }).then(async (r) => {
    const buf = await r.arrayBuffer();
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buf);
    // 加载工作薄
    const ws = workbook.getWorksheet(1);
    ws.name = title;
    ws.getRow(1).getCell(1).value = title;
    /**@name 初始行索引 */
    const initRowIndex = 10;
    const dataSource: OrderSampleStyleDemand[] = (data as any).orderSampleStyleDemand;
    // 包装要求索引
    const baozRow = initRowIndex + dataSource.length;
    // 备注索引
    const remarkRow = initRowIndex + dataSource.length + 1;
    const columns: FillExcelColumn[] = [
      ['contractNumber', 3, 2],
      ['operatorId', 3, 5],
      ['deliverDate', 3, 8],
      ['companyId', 4, 2],
      ['contactId', 4, 7],
      ['addressId', 5, 2],
      ['prepayPercent', 6, 2],
      ['invoiceType', 6, 5],
      ['payment', 6, 8],
      ['logisticsMode', 7, 2],
      ['distributionPrint', 7, 5],
      ['packageDemand', baozRow, 2],
      ['remark', remarkRow, 2],
    ];
    // 插入空白数据
    duplicateRowWithMergedCells(ws, initRowIndex, dataSource.length - 1);
    console.log(data, baozRow, remarkRow);

    // 插入款式需求列表数据
    dataSource.forEach((item, index) => {
      const addRowIndex = initRowIndex + index;
      const row = ws.getRow(addRowIndex);
      const currentAddRow: any[] = [];
      currentAddRow[0] = index + 1;
      currentAddRow[1] = item.materialCode;
      currentAddRow[6] = item.sizePriceNumber.reduce((p, n) => p + n.number, 0);
      currentAddRow[8] = item.totalPrice || 0;
      currentAddRow.forEach((colValue, cIndex) => {
        if (colValue !== undefined) {
          row.getCell(cIndex + 1).value = colValue;
        }
      });
    });
    // ws.getRow(baozRow).values = ['asvsdsd:', '', '', '', '', '', '', '', ''];
    // ws.getRow(remarkRow).values = ['asvsdsd:', '', '', '', '', '', '', '', ''];
    ws.unMergeCells(baozRow, 2, baozRow, 9);
    ws.unMergeCells(remarkRow, 2, remarkRow, 9);
    ws.mergeCells(baozRow, 2, baozRow, 9);
    ws.mergeCells(remarkRow, 2, remarkRow, 9);

    excelFillCol(ws, columns, data);
    workbook.xlsx.writeBuffer().then((buffer) => {
      browersArrayBufferDownload(data.contractNumber + '_' + title + '.xlsx', buffer);
    });
  });
}
