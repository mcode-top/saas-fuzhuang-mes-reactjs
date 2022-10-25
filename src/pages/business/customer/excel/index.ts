import type {
  BusCustomerAddressType,
  BusCustomerContacterType,
} from './../../../../apis/business/customer/typing';
import type { BusCustomerCompanyType } from '@/apis/business/customer/typing';
import { arrayAttributeChange } from '@/utils';
import { fileToBinaryString, SelectLocalFile } from '@/utils/upload/upload';
import { pick } from 'lodash';
import { read, utils, writeFileXLSX } from 'xlsx';
const cellWidth = [{ wch: 36 }, { wch: 15 }];

/**@name 导出公司信息Excel模板 */
export function busCustomerExportExcelTemplate() {
  const ws = utils.json_to_sheet([
    {
      公司名称: '必填',
      公司类型: '必填,普通客户 | VIP客户',
      公司电话: '',
      公司地址: '',
      备注描述: '',
    },
  ]);
  const wb = utils.book_new();
  ws['!cols'] = [{ wch: 36 }, { wch: 36 }, { wch: 36 }, { wch: 36 }, { wch: 36 }, { wch: 36 }];
  utils.book_append_sheet(wb, ws, '公司信息Excel模板');
  writeFileXLSX(wb, '公司信息Excel模板.xlsx');
}
/**@name 导出公司客户联系人Excel模板 */
export function busCustomerContacterExportExcelTemplate(companyName: string) {
  const ws = utils.json_to_sheet([
    {
      联系人姓名: '必填',
      联系人电话: '必填',
      联系人部门: '',
      联系人职称: '',
      备注: '',
    },
  ]);
  const wb = utils.book_new();
  ws['!cols'] = [
    { wch: 20 },
    { wch: 36 },
    { wch: 36 },
    { wch: 36 },
    { wch: 36 },
    { wch: 36 },
    { wch: 36 },
  ];
  utils.book_append_sheet(wb, ws, companyName + '客户联系人Excel模板');
  writeFileXLSX(wb, companyName + '客户联系人Excel模板.xlsx');
}
/**@name 导出公司客户收货地址Excel模板 */
export function busCustomerAddressExportExcelTemplate(companyName: string) {
  const ws = utils.json_to_sheet([
    {
      收货人姓名: '必填',
      收货人电话: '必填',
      收货地址: '必填',
      备注: '',
    },
  ]);
  const wb = utils.book_new();
  ws['!cols'] = [{ wch: 20 }, { wch: 36 }, { wch: 36 }, { wch: 36 }, { wch: 36 }, { wch: 36 }];
  utils.book_append_sheet(wb, ws, companyName + '客户收货地址Excel模板');
  writeFileXLSX(wb, companyName + '客户收货地址Excel模板.xlsx');
}

/**@name 导入Excel客户信息 */
export function busCustomerImportExcel() {
  return SelectLocalFile({ accept: '.xlsx' }).then(async (file) => {
    if (file instanceof File) {
      const wb = read(await fileToBinaryString(file), { type: 'binary' });
      const sheetNames = wb.SheetNames; // 工作表名称集合
      const worksheet = wb.Sheets[sheetNames[0]]; // 只读取第一张sheet
      const data: any = utils.sheet_to_json(worksheet);
      const columns = [
        { title: '公司名称', dataIndex: 'name' },
        { title: '公司电话', dataIndex: 'phone' },
        { title: '公司类型', dataIndex: 'type' },
        { title: '公司地址', dataIndex: 'address' },
        { title: '备注描述', dataIndex: 'remark' },
      ];
      return arrayAttributeChange<any>(
        data.map((i) => pick(i, ...columns.map((col) => col.title))),
        columns.map((col) => {
          return [col.title, col.dataIndex];
        }),
      ) as Merge<BusCustomerCompanyType, { type: string }>[];
    }
  });
}
/**@name 导入Excel客户联系人 */
export function busCustomerContacterImportExcel() {
  return SelectLocalFile({ accept: '.xlsx' }).then(async (file) => {
    if (file instanceof File) {
      const wb = read(await fileToBinaryString(file), { type: 'binary' });
      const sheetNames = wb.SheetNames; // 工作表名称集合
      const worksheet = wb.Sheets[sheetNames[0]]; // 只读取第一张sheet
      const data: any = utils.sheet_to_json(worksheet);
      const columns = [
        { title: '联系人姓名', dataIndex: 'name' },
        { title: '联系人电话', dataIndex: 'phone' },
        { title: '联系人部门', dataIndex: 'dept' },
        { title: '联系人职称', dataIndex: 'role' },
        { title: '备注', dataIndex: 'remark' },
      ];
      return arrayAttributeChange<any>(
        data.map((i) => pick(i, ...columns.map((col) => col.title))),
        columns.map((col) => {
          return [col.title, col.dataIndex];
        }),
      ) as Merge<BusCustomerContacterType, { type: string }>[];
    }
  });
}
/**@name 导入Excel客户联系人 */
export function busCustomerAddressImportExcel() {
  return SelectLocalFile({ accept: '.xlsx' }).then(async (file) => {
    if (file instanceof File) {
      const wb = read(await fileToBinaryString(file), { type: 'binary' });
      const sheetNames = wb.SheetNames; // 工作表名称集合
      const worksheet = wb.Sheets[sheetNames[0]]; // 只读取第一张sheet
      const data: any = utils.sheet_to_json(worksheet);
      const columns = [
        { title: '收货人姓名', dataIndex: 'name' },
        { title: '收货人电话', dataIndex: 'phone' },
        { title: '收货地址', dataIndex: 'address' },
        { title: '备注', dataIndex: 'remark' },
      ];
      return arrayAttributeChange<any>(
        data.map((i) => pick(i, ...columns.map((col) => col.title))),
        columns.map((col) => {
          return [col.title, col.dataIndex];
        }),
      ) as Merge<BusCustomerAddressType, { type: string }>[];
    }
  });
}
