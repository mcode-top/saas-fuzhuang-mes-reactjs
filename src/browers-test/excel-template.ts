import type { BusOrderStyleDemandLogo } from './../apis/business/order-manage/contract/typing';
import { BusOrderContract } from './../apis/business/order-manage/contract/typing';
import type {
  BusOrderSizePriceNumberProductionQuantity,
  BusWorkProcessPrice,
} from './../apis/business/order-manage/manufacture/typing';
import { BusOrderManufacture } from './../apis/business/order-manage/manufacture/typing';
/**
 * @name 测试使用ExcelJs
 */
import { addOssPathToImage, duplicateRowWithMergedCells } from '@/utils/excel';
import { browersArrayBufferDownload } from '@/utils/upload/upload';
import Excel from 'exceljs';
import { getOssPosistionToTimeLink } from '@/apis/file-manage/file-manage';
import { isEmpty } from 'lodash';
import type { BusOrderDeliveryGoodsAndNumberEntity } from '@/apis/business/order-manage/delivery/typing';
export function testTemplate3() {
  const list: BusOrderDeliveryGoodsAndNumberEntity[] = [
    {
      id: 51,
      createdAt: '2022-12-01 13:17:49',
      updatedAt: '2022-12-01 13:17:49',
      operatorId: 1,
      goodsId: 20,
      quantity: 100,
      deliveryId: 42,
      goods: {
        id: 20,
        createdAt: '2022-10-25 15:48:08',
        updatedAt: '2022-12-01 13:49:07',
        shelfId: 6,
        materialCode: 'QN209',
        sizeId: 2,
        quantity: 289,
        color: '绿色',
        remark: null,
        shelf: {
          id: 6,
          createdAt: '2022-08-30 12:47:48',
          updatedAt: '2022-08-30 12:47:48',
          warehouseId: 4,
          name: '二号货架',
          code: 'AA',
          position: null,
          maxCapacity: null,
          remark: null,
          warehouse: {
            id: 4,
            createdAt: '2022-08-29 17:39:05',
            updatedAt: '2022-08-29 17:39:05',
            name: '样品间',
            code: 'Y1',
            type: '0',
            position: '西南',
            maxCapacity: 1111,
            remark: null,
          },
        },
        material: {
          code: 'QN209',
          name: '长袖衫',
          type: '1',
          unit: '件',
          price: null,
          codes: [],
          remark: null,
          createdAt: '2022-08-30 16:06:02',
          updatedAt: '2022-08-30 16:06:02',
        },
        size: {
          id: 2,
          createdAt: '2022-08-29 14:32:41',
          updatedAt: '2022-08-29 14:32:41',
          name: 'xxl',
          specification: '73*23cm',
          parentId: 1,
          remark: null,
          parent: {
            id: 1,
            createdAt: '2022-08-29 14:32:19',
            updatedAt: '2022-08-30 16:00:40',
            name: '标准尺码',
            specification: null,
            parentId: -1,
            remark: null,
          },
        },
      },
    },
    {
      id: 52,
      createdAt: '2022-12-01 13:17:49',
      updatedAt: '2022-12-01 13:17:49',
      operatorId: 1,
      goodsId: 38,
      quantity: 200,
      deliveryId: 42,
      goods: {
        id: 38,
        createdAt: '2022-12-01 13:13:15',
        updatedAt: '2022-12-01 13:49:07',
        shelfId: 10,
        materialCode: 'QN209',
        sizeId: 5,
        quantity: 0,
        color: '棕色',
        remark: 'HT22120001生产入库',
        shelf: {
          id: 10,
          createdAt: '2022-10-31 13:33:45',
          updatedAt: '2022-10-31 13:33:45',
          warehouseId: 4,
          name: '主货架',
          code: 'ZHJ',
          position: null,
          maxCapacity: null,
          remark: null,
          warehouse: {
            id: 4,
            createdAt: '2022-08-29 17:39:05',
            updatedAt: '2022-08-29 17:39:05',
            name: '样品间',
            code: 'Y1',
            type: '0',
            position: '西南',
            maxCapacity: 1111,
            remark: null,
          },
        },
        material: {
          code: 'QN209',
          name: '长袖衫',
          type: '1',
          unit: '件',
          price: null,
          codes: [],
          remark: null,
          createdAt: '2022-08-30 16:06:02',
          updatedAt: '2022-08-30 16:06:02',
        },
        size: {
          id: 5,
          createdAt: '2022-08-30 16:00:29',
          updatedAt: '2022-08-30 16:00:29',
          name: 's',
          specification: '12cm',
          parentId: 1,
          remark: null,
          parent: {
            id: 1,
            createdAt: '2022-08-29 14:32:19',
            updatedAt: '2022-08-30 16:00:40',
            name: '标准尺码',
            specification: null,
            parentId: -1,
            remark: null,
          },
        },
      },
    },
    {
      id: 53,
      createdAt: '2022-12-01 13:17:49',
      updatedAt: '2022-12-01 13:17:49',
      operatorId: 1,
      goodsId: 37,
      quantity: 22,
      deliveryId: 42,
      goods: {
        id: 37,
        createdAt: '2022-12-01 13:13:15',
        updatedAt: '2022-12-01 13:49:07',
        shelfId: 10,
        materialCode: 'QN107',
        sizeId: 4,
        quantity: 0,
        color: '22',
        remark: 'HT22120001生产入库',
        shelf: {
          id: 10,
          createdAt: '2022-10-31 13:33:45',
          updatedAt: '2022-10-31 13:33:45',
          warehouseId: 4,
          name: '主货架',
          code: 'ZHJ',
          position: null,
          maxCapacity: null,
          remark: null,
          warehouse: {
            id: 4,
            createdAt: '2022-08-29 17:39:05',
            updatedAt: '2022-08-29 17:39:05',
            name: '样品间',
            code: 'Y1',
            type: '0',
            position: '西南',
            maxCapacity: 1111,
            remark: null,
          },
        },
        material: {
          code: 'QN107',
          name: '质量猪',
          type: '1',
          unit: '件',
          price: null,
          codes: null,
          remark: '由单号HT22120001创建',
          createdAt: '2022-12-01 13:11:23',
          updatedAt: '2022-12-01 13:11:23',
        },
        size: {
          id: 4,
          createdAt: '2022-08-30 16:00:24',
          updatedAt: '2022-08-30 16:00:24',
          name: 'l',
          specification: '12*12cm',
          parentId: 1,
          remark: null,
          parent: {
            id: 1,
            createdAt: '2022-08-29 14:32:19',
            updatedAt: '2022-08-30 16:00:40',
            name: '标准尺码',
            specification: null,
            parentId: -1,
            remark: null,
          },
        },
      },
    },
    {
      id: 54,
      createdAt: '2022-12-01 13:17:49',
      updatedAt: '2022-12-01 13:17:49',
      operatorId: 1,
      goodsId: 36,
      quantity: 22,
      deliveryId: 42,
      goods: {
        id: 36,
        createdAt: '2022-12-01 13:13:15',
        updatedAt: '2022-12-01 13:49:07',
        shelfId: 10,
        materialCode: 'QN107',
        sizeId: 2,
        quantity: 0,
        color: '22',
        remark: 'HT22120001生产入库',
        shelf: {
          id: 10,
          createdAt: '2022-10-31 13:33:45',
          updatedAt: '2022-10-31 13:33:45',
          warehouseId: 4,
          name: '主货架',
          code: 'ZHJ',
          position: null,
          maxCapacity: null,
          remark: null,
          warehouse: {
            id: 4,
            createdAt: '2022-08-29 17:39:05',
            updatedAt: '2022-08-29 17:39:05',
            name: '样品间',
            code: 'Y1',
            type: '0',
            position: '西南',
            maxCapacity: 1111,
            remark: null,
          },
        },
        material: {
          code: 'QN107',
          name: '质量猪',
          type: '1',
          unit: '件',
          price: null,
          codes: null,
          remark: '由单号HT22120001创建',
          createdAt: '2022-12-01 13:11:23',
          updatedAt: '2022-12-01 13:11:23',
        },
        size: {
          id: 2,
          createdAt: '2022-08-29 14:32:41',
          updatedAt: '2022-08-29 14:32:41',
          name: 'xxl',
          specification: '73*23cm',
          parentId: 1,
          remark: null,
          parent: {
            id: 1,
            createdAt: '2022-08-29 14:32:19',
            updatedAt: '2022-08-30 16:00:40',
            name: '标准尺码',
            specification: null,
            parentId: -1,
            remark: null,
          },
        },
      },
    },
  ];
  return fetch('/delivery_template.xlsx', {
    method: 'GET',
  }).then(async (r) => {
    const buf = await r.arrayBuffer();
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buf);
    // 加载工作薄
    const ws = workbook.getWorksheet(1);
    /**@name 居中文本样式 */
    const defaultCenterValueStyle = ws.getRow(3).getCell(2).style;
    /**@name 标签样式 */
    const defaultLabelValueStyle = ws.getRow(3).getCell(1).style;
    /**@name 多文本样式 */
    const defaultTextareStyle = ws.getRow(4).getCell(2).style;
    if (defaultCenterValueStyle.alignment) {
      defaultCenterValueStyle.alignment.horizontal = 'center';
    }
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
    insertRowIndex = addDeliveryList(insertRowIndex, list);
    console.log(insertRowIndex);
    const remark = ws.insertRow(insertRowIndex, ['备注:'], 'i+');
    remark.getCell(1).style = defaultLabelValueStyle;
    remark.getCell(2).style = defaultTextareStyle;
    remark.height = 40;
    ws.unMergeCells(insertRowIndex, 2, insertRowIndex, 9);
    ws.mergeCells(insertRowIndex, 2, insertRowIndex, 9);
    window.testTemplate = {
      save: () => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          browersArrayBufferDownload('模板测试数据1.xlsx', buffer);
        });
      },
      ws,
      workbook,
    };
  });
}

/**@name 测试模板导出2 */
export function testTemplate2() {
  // 加载public下的模板文件 contract_template.xlsx
  return fetch('/manufacture_template.xlsx', {
    method: 'GET',
  }).then(async (r) => {
    const buf = await r.arrayBuffer();
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buf);
    // 加载工作薄
    const ws = workbook.getWorksheet(1);

    /**@name 文本样式 */
    const defaultValueStyle = ws.getRow(3).getCell(2).style;
    /**@name 居中文本样式 */
    const defaultCenterValueStyle = ws.getRow(3).getCell(2).style;
    if (defaultCenterValueStyle.alignment) {
      defaultCenterValueStyle.alignment.horizontal = 'center';
    }
    /**@name 标签样式 */
    const defaultLabelValueStyle = ws.getRow(3).getCell(1).style;
    /**@name 多文本样式 */
    const defaultTextareStyle = ws.getRow(9).getCell(2).style;
    /**@name 标题样式 */
    const defaultTitleStyle = ws.getRow(10).getCell(1).style;
    let insertRowIndex = 11;
    async function addLogoRows(initRowIndex: number, data: BusOrderStyleDemandLogo[]) {
      let currentIndex = initRowIndex;
      const result = data.map(async (item, index) => {
        const row1Data: (string | undefined)[] = [];
        row1Data[0] = 'logo生产流程:';
        row1Data[1] = item.logo生产流程;
        row1Data[5] = item.logo工艺位置;
        row1Data[4] = 'logo工艺位置:';
        const row0Index = currentIndex++;
        const row = ws.insertRow(row0Index, row1Data, 'i+');
        row.height = 22;
        row.getCell(1).style = defaultLabelValueStyle;
        row.getCell(2).style = defaultValueStyle;

        row.getCell(5).style = defaultLabelValueStyle;
        row.getCell(6).style = defaultValueStyle;
        console.log(!isEmpty(item.logo效果图), item.logo效果图);

        if (!isEmpty(item.logo效果图) && item.logo效果图) {
          const row1Index = currentIndex++;
          const row2Data: (string | undefined)[] = [];
          row2Data[0] = 'logo效果图:';
          const row1 = ws.insertRow(row1Index, row2Data, 'i+');
          row1.getCell(1).style = defaultLabelValueStyle;
          row1.getCell(2).style = defaultValueStyle;
          row1.height = 75;
          const resultLogo = item.logo效果图.map(async ({ position }, logoIndex) => {
            if (position) {
              const imgInfo = await addOssPathToImage(workbook, position);

              const imgH = 95;
              const imgW = imgH * imgInfo.ratio;
              console.log(imgInfo, imgH, imgW);
              if (logoIndex % 2 === 1) {
                ws.addImage(imgInfo.imageId, {
                  tl: { col: 4.1, row: row1Index - 1 + 0.15 },
                  ext: { width: imgW, height: imgH },
                });
              } else {
                ws.addImage(imgInfo.imageId, {
                  tl: { col: 1.1, row: row1Index - 1 + 0.15 },
                  ext: { width: imgW, height: imgH },
                });
              }
            }
          });
          Promise.all(resultLogo);
          ws.mergeCellsWithoutStyle(row1Index, 2, row1Index, 9);
        }
        ws.mergeCellsWithoutStyle(row0Index, 2, row0Index, 4);
        ws.mergeCellsWithoutStyle(row0Index, 6, row0Index, 9);
      });
      await Promise.all(result);
      return currentIndex;
    }
    insertRowIndex = await addLogoRows(insertRowIndex, [
      {
        logo工艺位置: 'A1',
        logo生产流程: 'fdsfsdf',
        logo效果图: [
          {
            name: '200RQ45536.png',
            position:
              '3cfbc387-b7be-40d7-b7af-8b04a701af28/2022-09-06/12_10_08_449_458181-200RQ45536.png',
          },
          {
            name: '200RQ45536.png',
            position: '3cfbc387-b7be-40d7-b7af-8b04a701af28/2022-09-06/12_10_08_203_82403app-3.png',
          },
        ],
      },
      {
        logo工艺位置: 'B!',
        logo生产流程: 'fdsfsdf',
        logo效果图: [
          {
            name: '200RQ45536.png',
            position:
              '3cfbc387-b7be-40d7-b7af-8b04a701af28/2022-09-06/12_10_08_449_458181-200RQ45536.png',
          },
        ],
      },
    ]);
    /**@name 尺码数量价格表 */
    function addSizeNumberPriceTable(
      initRowIndex: number,
      data: BusOrderSizePriceNumberProductionQuantity[],
    ) {
      let currentRowIndex = initRowIndex;
      const dbtRow = ws.insertRow(currentRowIndex, ['尺码数量价格表'], 'i+');
      ws.mergeCellsWithoutStyle(currentRowIndex, 1, currentRowIndex, 9);

      dbtRow.getCell(1).style = defaultTitleStyle;
      dbtRow.height = 20;
      const titleRowIndex = ++currentRowIndex;
      const titleRow = ws.insertRow(
        titleRowIndex,
        ['序号', '尺码规格', , '颜色', , '需求数量', , '需要生产数量'],
        'i+',
      );
      titleRow.height = 15;
      titleRow.eachCell((c) => {
        c.style = defaultTitleStyle;
      });
      data.forEach((item, index) => {
        const currentDataRowIndex = ++currentRowIndex;
        const dataRow = ws.insertRow(
          currentDataRowIndex,
          [index + 1, item.sizeId, , item.color, , item.number, , item.productionQuantity],
          'i+',
        );
        dataRow.eachCell((c) => {
          c.style = defaultCenterValueStyle;
        });
      });
      for (let index = titleRowIndex; index <= currentRowIndex; index++) {
        ws.mergeCellsWithoutStyle(index, 2, index, 3);
        ws.mergeCellsWithoutStyle(index, 4, index, 5);
        ws.mergeCellsWithoutStyle(index, 6, index, 7);
        ws.mergeCellsWithoutStyle(index, 8, index, 9);
      }
      return currentRowIndex;
    }
    insertRowIndex = addSizeNumberPriceTable(insertRowIndex, [
      { sizeId: 'xxl' as any, color: '绿色', number: 100, productionQuantity: 100, price: 100 },
      { sizeId: 'xxxl' as any, color: '黑色', number: 200, productionQuantity: 100, price: 300 },
    ]);
    window.testTemplate = {
      save: () => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          browersArrayBufferDownload('模板测试数据1.xlsx', buffer);
        });
      },
      ws,
      workbook,
    };
  });
}
/**@name 合并同行的多个连续列 */
function peerRowMergeCells(row: Excel.Row, start: number, end: number, ignoreStyle?: boolean) {
  const startCell = row.getCell(start);
  for (let index = 1; index <= end - start; index++) {
    startCell.merge(row.getCell(start + index), ignoreStyle);
  }
}
/**@name 测试模板导出1 */
export function testTemplate1() {
  // 加载public下的模板文件 contract_template.xlsx
  return fetch('/contract_template.xlsx', {
    method: 'GET',
  }).then(async (r) => {
    const buf = await r.arrayBuffer();
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buf);
    // 加载工作薄
    const ws = workbook.getWorksheet(1);

    ws.name = '模板测试数据';

    /**@name 测试数据 */
    const dataSource = Array(10)
      .fill({})
      .map((i) => ({
        materialCode: 'QN209',
        styleName: '模糊xxxx',
        orderType: '现货',
        totalNumber: 9000.333,
        totalPrice: 800000.222,
      }));
    /**@name 初始行索引 */
    const initRowIndex = 10;
    // 插入空白数据
    duplicateRowWithMergedCells(ws, initRowIndex, dataSource.length - 1);
    // TODO:因为框架原因导致插入数据会将
    const baozRow = initRowIndex + dataSource.length;
    const remarkRow = initRowIndex + dataSource.length + 1;
    ws.mergeCells(baozRow, 2, baozRow, 9);
    ws.mergeCells(remarkRow, 2, remarkRow, 9);
    // 插入数据
    dataSource.forEach((item, index) => {
      const addRowIndex = initRowIndex + index;
      const row = ws.getRow(addRowIndex);
      const currentAddRow: any[] = [];
      currentAddRow[0] = index + 1;
      currentAddRow[1] = item.materialCode;
      currentAddRow[2] = item.styleName;
      currentAddRow[4] = item.orderType;
      currentAddRow[5] = item.totalNumber;
      currentAddRow[7] = item.totalPrice;
      currentAddRow.forEach((colValue, cIndex) => {
        if (colValue !== undefined) {
          row.getCell(cIndex + 1).value = colValue;
        }
      });
    });
    window.testTemplate = {
      save: () => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          browersArrayBufferDownload('模板测试数据1.xlsx', buffer);
        });
      },
      ws,
      workbook,
    };
  });
}
