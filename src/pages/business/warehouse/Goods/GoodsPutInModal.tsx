import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormDigit } from '@ant-design/pro-form';
import ProForm, { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';

import React, { useContext, useRef } from 'react';

import type { BusWarehousePutInGoodsDto } from '@/apis/business/warehouse/typing';
import { BusWarehouseTypeEnum } from '@/apis/business/warehouse/typing';
import {
  fetchCreateWarehouseShelf,
  fetchUpdateWarehouseShelf,
  fetchWarehouseGoodsPutIn,
} from '@/apis/business/warehouse';
import BusMaterialSelect from '../../techology-manage/Material/components/MaterialSelect';
import SelectTreeSizeTemplate from '../../techology-manage/SizeTemplate/components/SelectTreeSizeTemplate';
import { WarehouseContext } from '../context';
import { formatWarehouseEnumToMaterialEnum } from '../helper';
import { dictValueEnum, MaterialValueEnum } from '@/configs/commValueEnum';
import SelectUndoneContractSelect from '../../order-manage/components/SelectUndoneContractSelect';

/**@name 货品入库对话框 */
const GoodsPutInModal: React.FC<{
  node: {
    type: 'create' | 'update' | 'watch';
    value?: Partial<BusWarehousePutInGoodsDto>;
  };
  title: string;
  onFinish?: (value: BusWarehousePutInGoodsDto) => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const wContext = useContext(WarehouseContext);

  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await formRef.current?.validateFields();
        if (props.node.type === 'create') {
          await fetchWarehouseGoodsPutIn({ ...(props.node?.value || {}), ...value });
        }
        props?.onFinish?.(value);
        resolve(true);
      } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        reject(false);
      }
    });
  }

  const disabled = props.node.type === 'watch';
  const currentMaterialType = formatWarehouseEnumToMaterialEnum(wContext.currentWarehouse?.type);
  return (
    <ModalForm<BusWarehousePutInGoodsDto>
      width={500}
      title={props.title}
      formRef={formRef}
      onVisibleChange={(v) => {
        formRef.current?.resetFields();

        formRef.current?.setFieldsValue({
          ...props.node.value,
        });
      }}
      trigger={props.children}
      onFinish={onFinish}
    >
      <BusMaterialSelect
        multiple={false}
        rules={[{ required: true }]}
        disabled={disabled}
        materialType={currentMaterialType}
        help={
          currentMaterialType
            ? `仅支持${dictValueEnum(MaterialValueEnum.Type, currentMaterialType)}类型`
            : undefined
        }
        label="物料编码"
        name="materialCode"
      />
      {wContext.currentWarehouse?.type !== BusWarehouseTypeEnum.Material ? (
        <SelectTreeSizeTemplate
          disabled={disabled}
          label="选择尺码"
          rules={[{ required: true }]}
          name="sizeId"
        />
      ) : null}
      {wContext.currentWarehouse?.type !== BusWarehouseTypeEnum.Material ? (
        <ProFormText disabled={disabled} label="颜色" rules={[{ required: true }]} name="color" />
      ) : null}
      <ProFormDigit
        rules={[
          { required: true },
          {
            validator(rule, value, callback) {
              if (value <= 0) {
                callback('入库数量必须大于0');
              } else {
                callback();
              }
            },
          },
        ]}
        disabled={disabled}
        min={0}
        label="货品入库数"
        name="quantity"
      />
      <ProFormTextArea label="备注信息" disabled={disabled} name="remark" />
      {/* *TODO:待完善绑定合同单
      <SelectUndoneContractSelect label="绑定合同单" name="contractNumber" /> */}
    </ModalForm>
  );
};

export default GoodsPutInModal;
