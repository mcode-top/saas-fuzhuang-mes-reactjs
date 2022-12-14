import { get, last, times } from 'lodash';
import type Excel from 'exceljs';
import { getOssPosistionToTimeLink } from '@/apis/file-manage/file-manage';

/**@name 复制并合并行 */
export const duplicateRowWithMergedCells = (sheet: Excel.Worksheet, row: number, count: number) => {
  sheet.duplicateRow(row, count, true);

  const merges: string[] = (sheet.model as any).merges;
  // Find all merges inside initial row
  const rowMerges = merges.filter((range) => range.match(`\\w+${row}:\\w+${row}`));

  times(count, (index) => {
    const newRow = row + index + 1;

    // Unmerge everything in a newRow so we dont run into conflicts
    merges
      .filter((range) => range.match(`\\w+${newRow}:\\w+${newRow}`))
      .forEach((range) => sheet.unMergeCells(range));

    // Merge the same cells as in the initial row
    rowMerges
      .map((range) => range.replace(new RegExp(`${row}`, 'g'), `${newRow}`))
      .forEach((range) => sheet.mergeCells(range));
  });
};

/**@name 对象的键名 */
type ValueKey = string;
/**@name 行索引(1为最小值) */
type RowIndex = number;
/**@name 列索引(1为最小值) */
type ColIndex = number;
/**@name 填充Excel列 */
export type FillExcelColumn = [ValueKey, RowIndex, ColIndex];
/**@name 填充表 */
export function excelFillCol(
  sheet: Excel.Worksheet,
  columns: FillExcelColumn[],
  dataSource: Record<string, any>,
) {
  columns.forEach((i) => {
    sheet.getRow(i[1] as number).getCell(i[2]).value = get(dataSource, i[0]);
  });
}

/**@name 通过Oss短路径导入到Excel并生成ImageId(可以通过ImageId来放置图片到Excel中) */
export async function addOssPathToImage(workbook: Excel.Workbook, path: string) {
  const suffix = last(path.split('.'));
  if (!suffix) {
    return Promise.reject(new Error('路径地址出错'));
  }
  if (suffix !== 'png' && suffix !== 'jpeg' && suffix !== 'gif') {
    return Promise.reject(new Error('图片文件不支持导出'));
  }
  const url = await getOssPosistionToTimeLink(path).then((res) => {
    return res.data.url;
  });
  const img = await fetch(url, { method: 'GET' }).then(async (res1) => {
    return await res1.blob();
  });
  /**@name 读取文件长宽 */
  function getImageSzie(file) {
    return new Promise<{ h: number; w: number; ratio: number }>((resolve, reject) => {
      const rd = new FileReader();
      rd.onload = (e) => {
        /**@name Base64地址 */
        const res = e.target?.result;
        if (res) {
          const imgTag = new Image();
          imgTag.src = res as string;
          imgTag.onload = () => {
            resolve({
              w: imgTag.width,
              h: imgTag.height,
              ratio: imgTag.width / imgTag.height,
            });
          };
          imgTag.onerror = reject;
        } else {
          reject(new Error('读取文件为空'));
        }
      };
      rd.onerror = reject;
      // 将图片转换为Base64
      rd.readAsDataURL(file);
    });
  }
  const imgInfo = await getImageSzie(img);
  const imageId = workbook.addImage({
    buffer: img as any,
    extension: suffix,
  });
  return {
    ...imgInfo,
    imageId,
  };
}
