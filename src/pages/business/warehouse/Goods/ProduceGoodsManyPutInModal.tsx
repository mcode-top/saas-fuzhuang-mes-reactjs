import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormGroup, ProFormList, ProFormSelect } from '@ant-design/pro-form';
import { ProFormDigit } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';

import React, { useContext, useRef, useState } from 'react';

import type { BusWarehousePutInGoodsDto } from '@/apis/business/warehouse/typing';
import { fetchProduceGoodsManyPutIn } from '@/apis/business/warehouse';
import BusMaterialSelect from '../../techology-manage/Material/components/MaterialSelect';
import SelectTreeSizeTemplate from '../../techology-manage/SizeTemplate/components/SelectTreeSizeTemplate';
import { WarehouseContext } from '../context';
import { BusMaterialTypeEnum } from '../../techology-manage/Material/typing';
import { isEmpty } from 'lodash';
import { fetchMaterialToStyleDemandData } from '@/apis/business/order-manage/contract';
import { message } from 'antd';

/**@name 成衣货品批量入库 */
const ProduceGoodsManyPutInModal: React.FC<{
  title: string;
  shelfId: number;
  onFinish?: (value: BusWarehousePutInGoodsDto) => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const [colorGroup, setColorGroup] = useState<string[]>([]);
  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await formRef.current?.validateFields();
        if (!props.shelfId) {
          reject(false);
          message.warning('未选择货架');
        } else {
          fetchProduceGoodsManyPutIn({
            data: value.sizeColorNumber.map((item) => {
              return {
                sizeId: item.sizeId,
                color: item.color,
                materialCode: value.materialCode,
                operationNumber: item.number,
                shelfId: props.shelfId,
              };
            }),
            remark: value.remark,
          });
          props?.onFinish?.(value);
          resolve(true);
        }
      } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        reject(false);
      }
    });
  }
  /**@name 获取与物料编码相关联的成衣样式 */
  function materialProduceStyleDemand(materialCode: string) {
    if (materialCode) {
      fetchMaterialToStyleDemandData(materialCode).then((r) => {
        if (r?.data?.styleDemandData) {
          setColorGroup(r?.data?.styleDemandData.colorGroup?.map((i) => i.color) || []);
        } else {
          setColorGroup([]);
        }
      });
    }
  }
  return (
    <ModalForm<BusWarehousePutInGoodsDto>
      width={1000}
      title={props.title}
      formRef={formRef}
      onVisibleChange={(v) => {
        formRef.current?.resetFields();
      }}
      trigger={props.children}
      onFinish={onFinish}
    >
      <BusMaterialSelect
        multiple={false}
        rules={[{ required: true }]}
        materialType={BusMaterialTypeEnum.Product}
        label="物料编码"
        name="materialCode"
        fieldProps={{
          onChange: (materialCode) => materialProduceStyleDemand(materialCode),
        }}
      />
      <SizeColorNumberList colorGroup={colorGroup} />
      <ProFormTextArea label="备注信息" name="remark" />
      {/* *TODO:待完善绑定合同单
      <SelectUndoneContractSelect label="绑定合同单" name="contractNumber" /> */}
    </ModalForm>
  );
};

export default ProduceGoodsManyPutInModal;
/**@name 设置入库尺码颜色数量表 */
function SizeColorNumberList(props: { readonly?: boolean; colorGroup?: string[] }) {
  return (
    <ProFormList
      name="sizeColorNumber"
      label="设置入库尺码颜色数量"
      style={{ width: '100%' }}
      creatorButtonProps={props.readonly ? false : undefined}
      rules={[
        {
          validator(rule, value, callback) {
            if (Array.isArray(value)) {
              /**@name 尺码颜色唯一 */
              const uniqeSize = {};
              let errorText = '';
              value.findIndex((i) => {
                const id = i.sizeId + '_' + i.color;
                if (i.sizeId !== undefined) {
                  if (uniqeSize[id]) {
                    errorText = '存在相同的尺码颜色,请检查删除';
                    return i;
                  }
                }
                if (i.number <= 0) {
                  errorText = '入库数量不能为零';
                  return true;
                }
                if (i.sizeId === undefined || i.number === undefined || i.color === undefined) {
                  errorText = '有字段为空,请补齐';
                }
                if (i.sizeId === undefined && i.number === undefined && i.color === undefined) {
                  errorText = '';
                }
                uniqeSize[id] = i;
                return false;
              });
              if (errorText) {
                return callback(errorText);
              }
            }
            callback();
          },
        },
      ]}
      copyIconProps={
        props.readonly
          ? false
          : {
              tooltipText: '复制此行到末尾',
            }
      }
      deleteIconProps={
        props.readonly
          ? false
          : {
              tooltipText: '删除此行',
            }
      }
      initialValue={[{}]}
    >
      <ProFormGroup key="group">
        <SelectTreeSizeTemplate
          fieldProps={{ style: { minWidth: 300 } }}
          colProps={{ span: 10 }}
          name="sizeId"
          label="尺码规格"
        />

        {isEmpty(props.colorGroup) ? (
          <ProFormText colProps={{ span: 6 }} name="color" label="颜色" />
        ) : (
          <ProFormSelect
            options={props.colorGroup}
            colProps={{ span: 6 }}
            name="color"
            label="颜色"
          />
        )}

        <ProFormDigit name="number" min={0} initialValue={0} colProps={{ span: 4 }} label="数量" />
      </ProFormGroup>
    </ProFormList>
  );
}
