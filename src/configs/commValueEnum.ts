import { BusCustomerTypeEnum } from './../apis/business/customer/typing';
/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-03 12:58:57
 * @Description: 公用的valueEnum
 */

import { MessageLevelEnum, MessageReadStatusEnum, MessageTypeEnum } from '@/apis/message/typing';
import { BusMaterialTypeEnum } from '@/pages/business/techology-manage/Material/typing';
import { BusWarehouseLogTypeEnum, BusWarehouseTypeEnum } from '@/apis/business/warehouse/typing';
import {
  BusOrderStyleTypeEnum,
  BusOrderTypeEnum,
} from '@/apis/business/order-manage/contract/typing';
import {
  ActApproveModeEnum,
  ActApproveStatusEnum,
  ActApproveTypeEnum,
  ActProcessStatusEnum,
  ActTaskModelStatusEnum,
  ActTaskStatusEnum,
} from '@/apis/process/typings';
import { UserSexEnum } from '@/apis/user/typings';
import { ContractProcessEnum } from '@/apis/business/order-manage/order-process/typing';

export const UserValueEnum = {
  Sex: new Map([
    [UserSexEnum.WoMan, { text: '女' }],
    [UserSexEnum.Man, { text: '男' }],
    [UserSexEnum.Secret, { text: '保密' }],
  ]),
  Status: new Map([
    [0, { text: '禁用', status: 'Error' }],
    [1, { text: '正常', status: 'Success' }],
  ]),
};
export const ProcessValueEnum = {
  ActTaskStatusEnum: new Map([
    [ActTaskStatusEnum.Normal, { text: '未执行' }],
    [ActTaskStatusEnum.Running, { text: '执行中', status: 'Processing' }],
    [ActTaskStatusEnum.Complete, { text: '已完成', status: 'Success' }],
    [ActTaskStatusEnum.Agree, { text: '已同意', status: 'Success' }],
    [ActTaskStatusEnum.Disagree, { text: '被驳回', status: 'Error' }],
    [ActTaskStatusEnum.Disable, { text: '已失效', status: 'Warning' }],
  ]),
  ActProcessStatusEnum: new Map([
    [ActProcessStatusEnum.Running, { text: '执行中', status: 'Processing' }],
    [ActProcessStatusEnum.Complete, { text: '已完成', status: 'Success' }],
    [ActProcessStatusEnum.Stop, { text: '已撤销', status: 'Error' }],
    [ActProcessStatusEnum.Pause, { text: '被暂停', status: 'Warning' }],
    [ActProcessStatusEnum.Reject, { text: '被驳回', status: 'Error' }],
  ]),
  ActApproveStatusEnum: new Map([
    [ActApproveStatusEnum.Normal, { text: '未审批' }],
    [ActApproveStatusEnum.Agree, { text: '已同意', status: 'Success' }],
    [ActApproveStatusEnum.Disagree, { text: '不同意', status: 'Error' }],
    [ActApproveStatusEnum.Recipient, { text: '抄送状态' }],
  ]),
  ActApproveModeEnum: new Map([
    [ActApproveModeEnum.Normal, { text: '依次审批' }],
    [ActApproveModeEnum.Countersign, { text: '会签' }],
    [ActApproveModeEnum.Orsgin, { text: '或签' }],
  ]),
  ActApproveTypeEnum: new Map([
    [ActApproveTypeEnum.Person, { text: '选择人员' }],
    [ActApproveTypeEnum.Dept, { text: '选择部门' }],
    [ActApproveTypeEnum.Role, { text: '选择角色' }],
    [ActApproveTypeEnum.Starter, { text: '发起者指定' }],
  ]),
  ActTaskModelStatusEnum: new Map([
    [ActTaskModelStatusEnum.Disable, { text: '已失效', status: 'Error' }],
    [ActTaskModelStatusEnum.Normal, { text: '使用中', status: 'Success' }],
  ]),
};
export const MessageValueEnum = {
  MessageReadStatusEnum: new Map([
    [MessageReadStatusEnum.Read, { text: '已读', status: 'Success' }],
    [MessageReadStatusEnum.UnRead, { text: '未读', status: 'Error' }],
  ]),
  MessageLevelEnum: new Map([
    [MessageLevelEnum.Exigency, { text: '紧急', status: 'Error' }],
    [MessageLevelEnum.Importance, { text: '重要', status: 'Warning' }],
    [MessageLevelEnum.Normal, { text: '普通' }],
  ]),
  MessageDisableStatus: new Map([
    [true, { text: '已禁用', status: 'Error' }],
    [false, { text: '使用中', status: 'Success' }],
  ]),
};

/**@name 物料类型 */
export const MaterialValueEnum = {
  Type: new Map([
    [BusMaterialTypeEnum.Material, { text: '材料' }],
    [BusMaterialTypeEnum.Product, { text: '成衣' }],
  ]),
};

/**@name 客户类型 */
export const CustomerCompanyValueEnum = {
  Type: new Map([
    [BusCustomerTypeEnum.Normal, { text: '普通客户' }],
    [BusCustomerTypeEnum.VIP, { text: 'VIP客户' }],
  ]),
};
/**@name 仓库类型 */
export const WarehouseTypeValueEnum = {
  /**@name 仓库存放货品类型 */
  WarehouseType: new Map([
    [BusWarehouseTypeEnum.Product, { text: '成品' }],
    [BusWarehouseTypeEnum.Material, { text: '材料' }],
    [BusWarehouseTypeEnum.Both, { text: '混合' }],
  ]),
  /**@name 出入库记录类型 */
  LogType: new Map([
    [BusWarehouseLogTypeEnum.Out, { text: '出库', color: '#2a6e3f' }],
    [BusWarehouseLogTypeEnum.In, { text: '入库', color: '#c12c1f' }],
  ]),
};

/**@name 合同订单类型 */
export const OrderContractTypeValueEnum = {
  Style: new Map([
    [BusOrderStyleTypeEnum.SpotGoods, { text: '现货' }],
    [BusOrderStyleTypeEnum.SpotGoodsCustom, { text: '现货定制' }],
    [BusOrderStyleTypeEnum.Custom, { text: '全新定制' }],
  ]),
  OrderType: new Map([
    [BusOrderTypeEnum.Sample, { text: '样品单', color: '#1890ff' }],
    [BusOrderTypeEnum.Normal, { text: '普通单', color: '#52c41a' }],
    [BusOrderTypeEnum.Urgent, { text: '加急单', color: '#f5222d' }],
  ]),
  Process: new Map([
    [ContractProcessEnum.Running, { text: '运行中', type: 'Processing' }],
    [ContractProcessEnum.Stop, { text: '已停止', type: 'Error' }],
    [ContractProcessEnum.Done, { text: '已完成', type: 'Success' }],
  ]),
};

/**@name 枚举转为字段文字 */
export function dictValueEnum(type: Map<any, any>, value: any) {
  return `${type.get(value)?.text || '类型不存在'}`;
}
