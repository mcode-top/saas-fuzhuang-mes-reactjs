import type { BusSizeTemplateItemType } from './../../../techology-manage/SizeTemplate/typing';
import type {
  BusManufactureNeedProductionTable,
  BusOrderManufacture,
} from './../../../../../apis/business/order-manage/manufacture/typing';
import type { BusOrderStyleDemandLogo } from '@/apis/business/order-manage/contract/typing';
import type { BusOrderSizePriceNumberProductionQuantity } from '@/apis/business/order-manage/manufacture/typing';
import type { FillExcelColumn } from '@/utils/excel';
import { addOssPathToImage, excelFillCol } from '@/utils/excel';
import { cloneDeep, isEmpty } from 'lodash';
import * as Excel from 'exceljs';
import { browersArrayBufferDownload } from '@/utils/upload/upload';
import { mergeNeedProducetionAndSizePriceNumber } from '../helper';
import storageDataSource from '@/utils/storage';
import { STORAGE_SIZE_TEMPLATE_LIST, STORAGE_SIZE_TEMPLATE_TREE } from '@/configs/storage.config';

export function exportManufactureFormExcel(manufacturceForm: BusOrderManufacture) {
  const dataSource = cloneDeep(manufacturceForm);

  const replaceAttrDom = document.querySelectorAll(
    ".ant-tabs-tabpane-active [class*='manufacture-excel-data-']",
  );

  // 将表单中的id|值更改为实际的显示文本
  replaceAttrDom.forEach((e) => {
    const reg = e.className.matchAll(/manufacture-excel-data-([\w]+)/g);
    const attr = reg.next().value[1];
    const value = (e as any).innerText || '';
    dataSource[attr] = value;
  });

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
    const defaultCenterValueStyle = cloneDeep(ws.getRow(3).getCell(2).style);
    if (defaultCenterValueStyle.alignment) {
      defaultCenterValueStyle.alignment.horizontal = 'center';
    }
    /**@name 标签样式 */
    const defaultLabelValueStyle = ws.getRow(3).getCell(1).style;
    /**@name 标题样式 */
    const defaultTitleStyle = ws.getRow(10).getCell(1).style;
    /**@name 多文本样式 */
    const defaultTextareStyle = ws.getRow(9).getCell(2).style;
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
          console.log(item.logo效果图);

          const resultLogo = item.logo效果图.map(async ({ position }, logoIndex) => {
            console.log(position);

            if (position) {
              const imgInfo = await addOssPathToImage(workbook, position);

              const imgH = 85;
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
          await Promise.all(resultLogo);
          ws.mergeCellsWithoutStyle(row1Index, 2, row1Index, 9);
        }
        ws.mergeCellsWithoutStyle(row0Index, 2, row0Index, 4);
        ws.mergeCellsWithoutStyle(row0Index, 6, row0Index, 9);
      });
      await Promise.all(result);
      return currentIndex;
    }
    if (dataSource.styleDemand.logo) {
      insertRowIndex = await addLogoRows(insertRowIndex, dataSource.styleDemand.logo);
    }

    /**@name 尺码数量价格表 */
    async function addSizeNumberPriceTable(
      initRowIndex: number,
      data: BusOrderSizePriceNumberProductionQuantity[],
    ) {
      const sizeList: (BusSizeTemplateItemType & { label: string })[] = await storageDataSource
        .getValue(STORAGE_SIZE_TEMPLATE_TREE)
        .then((a) =>
          a.titleParentTree.reduce((p, n) => {
            p.push(...(n.children || []));
            return p;
          }, []),
        );
      let currentRowIndex = initRowIndex;
      const dbtRow = ws.insertRow(currentRowIndex, ['尺码数量价格表'], 'i+');
      ws.mergeCellsWithoutStyle(currentRowIndex, 1, currentRowIndex, 9);

      dbtRow.getCell(1).style = defaultTitleStyle;
      dbtRow.height = 20;
      const titleRowIndex = ++currentRowIndex;
      const titleRow = ws.insertRow(
        titleRowIndex,
        ['序号', '尺码规格', , , '颜色', , '需求数量', , '需要生产数量'],
        'i+',
      );
      titleRow.height = 15;
      titleRow.eachCell((c) => {
        c.style = defaultTitleStyle;
      });
      console.log(defaultCenterValueStyle);

      const sizeColStyle = cloneDeep(defaultCenterValueStyle);
      if (sizeColStyle.border) {
        sizeColStyle.border.right = sizeColStyle.border?.left;
      }
      const resultSizeNumberPriceTable = data.map(async (item, index) => {
        const currentDataRowIndex = ++currentRowIndex;
        // 将sizeId转换为可读信息
        const sizeInfo = sizeList.find((i) => i.id === item.sizeId);
        console.log(sizeInfo);

        const dataRow = ws.insertRow(
          currentDataRowIndex,
          [index + 1, sizeInfo?.label, , , item.color, , item.number, , item.productionQuantity],
          'i+',
        );

        dataRow.eachCell((c) => {
          c.style = sizeColStyle;
        });
      });
      await Promise.all(resultSizeNumberPriceTable);
      for (let index = titleRowIndex; index <= currentRowIndex; index++) {
        ws.mergeCellsWithoutStyle(index, 2, index, 4);
        ws.mergeCellsWithoutStyle(index, 5, index, 6);
        ws.mergeCellsWithoutStyle(index, 7, index, 8);
      }
      return currentRowIndex;
    }
    insertRowIndex = await addSizeNumberPriceTable(
      insertRowIndex,
      mergeNeedProducetionAndSizePriceNumber(
        dataSource.styleDemand.sizePriceNumber,
        dataSource.needProduction as BusManufactureNeedProductionTable[],
      ),
    );
    const columns: FillExcelColumn[] = [
      ['contractNumber', 3, 2],
      ['operatorId', 3, 5],
      ['contract.deliverDate', 3, 8],
      ['materialInfo', 4, 2],
      ['styleType', 4, 5],
      ['deliverDate', 4, 8],
      ['styleDemand.shellFabric', 5, 2],
      ['styleDemand.商标', 5, 5],
      ['styleDemand.口袋', 5, 8],
      ['styleDemand.领号', 6, 2],
      ['styleDemand.领子颜色', 6, 5],
      ['styleDemand.后备扣', 6, 8],
      ['styleDemand.领部缝纫工艺', 7, 2],
      ['styleDemand.门襟工艺', 7, 5],
      ['styleDemand.袖口工艺', 7, 8],
      ['styleDemand.下摆工艺', 8, 2],
      ['styleDemand.纽扣工艺', 8, 5],
      ['contract.sampleRemark', 8, 8],
      ['styleDemand.其他工艺', 9, 2],
    ];
    excelFillCol(ws, columns, dataSource);
    workbook.xlsx.writeBuffer().then((buffer) => {
      browersArrayBufferDownload(
        `${dataSource.contractNumber}_${dataSource.materialCode}生产单.xlsx`,
        buffer,
      );
    });
  });
}
