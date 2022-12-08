import type { BusOrderStyleDemand } from '@/apis/business/order-manage/contract/typing';
import { BusOrderStyleTypeEnum } from '@/apis/business/order-manage/contract/typing';

import { OrderContractTypeValueEnum } from '@/configs/commValueEnum';
import BusMaterialSelect from '@/pages/business/techology-manage/Material/components/MaterialSelect';
import { BusMaterialTypeEnum } from '@/pages/business/techology-manage/Material/typing';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormGroup, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { ProFormSelect } from '@ant-design/pro-form';
import { ProFormList } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';
import { ProFormMoney } from '@ant-design/pro-form';
import type { ContractLocationQuery } from '@/pages/business/order-manage/contract/typing';
import { useRef, useState } from 'react';
import { useLocation } from 'umi';
import { fetchAddProductMaterialStyleDemand } from '@/apis/business/order-manage/contract';
import LogoCraftsmanship from '@/pages/business/order-manage/contract/Info/LogoCraftsmanship';

const ProductMaterialModal: React.FC<{
  node: {
    type: 'add' | 'watch';
    materialCode: string;
    value?: Partial<ProductMaterialType>;
  };
  title: string;
  onFinish?: (value: ProductMaterialType | undefined) => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();
  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (props.node.type === 'watch') {
        props?.onFinish?.(props.node.value);
        return resolve(true);
      }
      try {
        const value = await formRef.current?.validateFields();
        await fetchAddProductMaterialStyleDemand(props.node.materialCode, value);
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
  return (
    <ModalForm<ProductMaterialType>
      width={800}
      title={props.title}
      submitter={disabled ? false : undefined}
      formRef={formRef}
      onVisibleChange={(v) => {
        formRef.current?.resetFields();
        formRef.current?.setFieldsValue(props.node.value);
      }}
      grid={true}
      modalProps={{ maskClosable: disabled }}
      trigger={props.children}
      readonly={disabled}
      layout={disabled ? 'horizontal' : 'vertical'}
      onFinish={onFinish}
    >
      <ProFormGroup>
        <BusMaterialSelect
          name="shellFabric"
          label="面料"
          materialType={BusMaterialTypeEnum.Material}
          colProps={{ span: 8 }}
          serachLength={1}
        />
        <ProFormText colProps={{ span: 8 }} name="商标" label="商标" />
        <ProFormText colProps={{ span: 8 }} name="口袋" label="口袋" />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormText name="领号" colProps={{ span: 8 }} label="领号" />
        <ProFormText name="领子颜色" colProps={{ span: 8 }} label="领子颜色" />
        <ProFormText name="后备扣" colProps={{ span: 8 }} label="后备扣" />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormTextArea colProps={{ span: 12 }} name="领部缝纫工艺" label="领部缝纫工艺" />
        <ProFormTextArea colProps={{ span: 12 }} name="门襟工艺" label="门襟工艺" />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormTextArea colProps={{ span: 12 }} name="袖口工艺" label="袖口工艺" />
        <ProFormTextArea colProps={{ span: 12 }} name="下摆工艺" label="下摆工艺" />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormTextArea colProps={{ span: 12 }} name="纽扣工艺" label="纽扣工艺" />
        <ProFormTextArea colProps={{ span: 12 }} name="其他工艺" label="其他工艺" />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormMoney
          colProps={{ span: 6 }}
          fieldProps={{ precision: 4 }}
          name="其他费用"
          min={0}
          initialValue={0}
          label="其他费用"
        />
        <ProFormMoney
          fieldProps={{ precision: 4 }}
          colProps={{ span: 6 }}
          initialValue={0}
          name="印刷单价"
          min={0}
          label="印刷单价"
        />
        <ProFormMoney
          fieldProps={{ precision: 4 }}
          colProps={{ span: 6 }}
          name="绣花单价"
          initialValue={0}
          min={0}
          label="绣花单价"
        />
        <ProFormMoney
          fieldProps={{ precision: 4 }}
          colProps={{ span: 6 }}
          initialValue={0}
          name="版费"
          min={0}
          label="版费"
        />
      </ProFormGroup>
      <div style={{ width: '100%' }}>
        <LogoCraftsmanship value={props.node?.value?.logo} readonly={disabled} />
      </div>
      <ProFormList
        name="colorGroup"
        label="颜色列表"
        colProps={{ span: 24 }}
        creatorButtonProps={
          disabled
            ? false
            : {
                creatorButtonText: '新建颜色',
                icon: false,
                type: 'link',
                style: { width: 'unset' },
              }
        }
        min={1}
        copyIconProps={false}
        deleteIconProps={disabled ? false : { tooltipText: '删除' }}
        itemRender={({ listDom, action }) => (
          <div
            style={{
              display: 'inline-flex',
              marginInlineEnd: 25,
            }}
          >
            {listDom}
            {action}
          </div>
        )}
      >
        <ProFormText width="xs" name="color" />
      </ProFormList>
    </ModalForm>
  );
};
export default ProductMaterialModal;
/**@name 物料成衣类型 */
export type ProductMaterialType = {
  /**@name 颜色组 */
  colorGroup?: string[];
  /**@name 产品名称(款式) */
  style?: string;
  /**@name 面料 */
  shellFabric?: string;
  /**@name 领号 */
  领号?: string;
  /**@name 领子颜色 */
  领子颜色?: string;
  /**@name 领部缝纫工艺 */
  领部缝纫工艺?: string;
  /**@name 门襟工艺 */
  门襟工艺?: string;
  /**@name 袖口工艺 */
  袖口工艺?: string;
  /**@name 下摆工艺 */
  下摆工艺?: string;
  /**@name 纽扣工艺 */
  纽扣工艺?: string;
  /**@name 其他工艺 */
  其他工艺?: string;
  /**@name 商标 */
  商标?: string;
  /**@name 口袋 */
  口袋?: string;
  /**@name 后备扣 */
  后备扣?: string;
  /**@name 印刷单价 */
  印刷单价?: number;
  /**@name 绣花单价 */
  绣花单价?: number;
  /**@name 版费 */
  版费?: number;
  logo?: {
    /**@name logo生产流程 */
    logo生产流程?: string;
    /**@name logo工艺位置 */
    logo工艺位置?: string;
    /**@name logo效果图 */
    logo效果图?: { name: string; position?: string }[];
  }[];
};
