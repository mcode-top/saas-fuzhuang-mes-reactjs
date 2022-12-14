import { cloneDeep } from 'lodash';
import type { BusOrderContract } from '@/apis/business/order-manage/contract/typing';
import type {
  BusOrderDeliveryEntity,
  BusOrderDeliveryGoodsAndNumberEntity,
} from '@/apis/business/order-manage/delivery/typing';
import type { FillExcelColumn } from '@/utils/excel';
import { excelFillCol } from '@/utils/excel';
import { browersArrayBufferDownload } from '@/utils/upload/upload';
import * as Excel from 'exceljs';

export function exportDeliveryExcel(
  deliveryForm: BusOrderDeliveryEntity,
  contractData: BusOrderContract,
) {
  return fetch('/delivery_template.xlsx', {
    method: 'GET',
  }).then(async (r) => {
    const buf = await r.arrayBuffer();
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buf);
    // 加载工作薄
    const ws = workbook.getWorksheet(1);
    /**@name 居中文本样式 */
    const defaultCenterValueStyle = cloneDeep(ws.getRow(3).getCell(2).style);
    if (defaultCenterValueStyle.alignment) {
      defaultCenterValueStyle.alignment.horizontal = 'center';
    }
    /**@name 标签样式 */
    const defaultLabelValueStyle = ws.getRow(3).getCell(1).style;
    /**@name 多文本样式 */
    const defaultTextareStyle = ws.getRow(4).getCell(2).style;
    let insertRowIndex = 9;

    /**@name 新增发货表 */
    function addDeliveryList(initRowIndex: number, data: BusOrderDeliveryGoodsAndNumberEntity[]) {
      let currentRowIndex = initRowIndex;
      data.forEach((item, index) => {
        const currentDataRowIndex = currentRowIndex++;
        const materialInfo = `${item?.goods?.material?.name}(${item?.goods?.material?.code})`;
        const sizeInfo = `${item?.goods?.size?.parent?.name}/${item?.goods?.size?.name}(${item?.goods?.size?.specification})`;
        const color = `${item?.goods?.color}`;
        const shelf = `${item?.goods?.shelf?.warehouse?.name}/${item?.goods?.shelf?.name}`;
        const quantity = item.quantity;
        const dataRow = ws.insertRow(
          currentDataRowIndex,
          [index + 1, materialInfo, , sizeInfo, , color, shelf, , quantity],
          'i+',
        );
        dataRow.eachCell((c) => {
          c.style = defaultCenterValueStyle;
        });
      });
      for (let index = insertRowIndex; index <= currentRowIndex; index++) {
        ws.mergeCellsWithoutStyle(index, 2, index, 3);
        ws.mergeCellsWithoutStyle(index, 4, index, 5);
        ws.mergeCellsWithoutStyle(index, 7, index, 8);
      }
      return currentRowIndex;
    }
    if (deliveryForm.goodsAndNumber) {
      insertRowIndex = addDeliveryList(insertRowIndex, deliveryForm.goodsAndNumber);
    }
    const remark = ws.insertRow(insertRowIndex, ['备注:'], 'i+');
    remark.getCell(1).style = defaultLabelValueStyle;
    remark.getCell(2).style = defaultTextareStyle;
    remark.height = 40;
    ws.unMergeCells(insertRowIndex, 2, insertRowIndex, 9);
    ws.mergeCells(insertRowIndex, 2, insertRowIndex, 9);
    const columns: FillExcelColumn[] = [
      ['deliveryForm.contractNumber', 3, 2],
      ['contractData.process.operator.name', 3, 5],
      ['contractData.deliverDate', 3, 8],
      ['deliveryForm.address', 4, 2],
      ['contractData.company.name', 5, 2],
      ['deliveryForm.contact', 5, 5],
      ['deliveryForm.phone', 5, 8],
      ['deliveryForm.logisticsCompany', 6, 2],
      ['deliveryForm.expressNumber', 6, 5],
      ['deliveryForm.remark', insertRowIndex, 2],
    ];
    excelFillCol(ws, columns, {
      contractData,
      deliveryForm,
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      browersArrayBufferDownload(`${deliveryForm.contractNumber}_发货单.xlsx`, buffer);
    });
  });
}
