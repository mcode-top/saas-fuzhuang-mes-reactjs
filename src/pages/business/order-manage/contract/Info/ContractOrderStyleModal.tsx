import type {
  BusOrderStyleDemand,
  BusOrderTypeEnum,
} from '@/apis/business/order-manage/contract/typing';
import { BusOrderStyleTypeEnum } from '@/apis/business/order-manage/contract/typing';

import { OrderContractTypeValueEnum } from '@/configs/commValueEnum';
import BusMaterialSelect from '@/pages/business/techology-manage/Material/components/MaterialSelect';
import { BusMaterialTypeEnum } from '@/pages/business/techology-manage/Material/typing';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormSelect } from '@ant-design/pro-form';
import { ProFormList } from '@ant-design/pro-form';
import { ProFormMoney } from '@ant-design/pro-form';
import { ProFormDigit } from '@ant-design/pro-form';
import { ProFormDependency } from '@ant-design/pro-form';
import { ProFormRadio } from '@ant-design/pro-form';
import { ModalForm, ProFormGroup, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { useEffect, useRef, useState } from 'react';
import { validatorMaterialCode } from '@/pages/business/techology-manage/Material/helper';
import SelectTreeSizeTemplate from '@/pages/business/techology-manage/SizeTemplate/components/SelectTreeSizeTemplate';
import { useLocation } from 'umi';
import type { ContractLocationQuery } from '../typing';
import { fetchMaterialToStyleDemandData } from '@/apis/business/order-manage/contract';
import type { ColProps } from 'antd';
import { isEmpty, omit } from 'lodash';
import './replace.css';
import LogoCraftsmanship from './LogoCraftsmanship';
/**
 * @name 计算单个款式的总价
 * 产品价格(含其他费用)+(印刷单价+绣花单价)*数量+版费
 *  */
export function computedTotalAmount(entity: BusOrderStyleDemand) {
  let totalPrice = 0;
  entity.sizePriceNumber?.forEach((i) => {
    totalPrice +=
      i.number * i.price +
      (entity['印刷单价'] || 0) * i.number +
      (entity['绣花单价'] || 0) * i.number +
      (entity['版费'] || 0);
  });
  return totalPrice;
}
const ContractOrderStyleModal: React.FC<{
  node: {
    type: 'create' | 'update' | 'watch';
    value?: Partial<BusOrderStyleDemand>;
  };
  title: string;
  onFinish?: (value: BusOrderStyleDemand) => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const location = useLocation();
  const query = (location as any).query as ContractLocationQuery;
  const [colorGroup, setColorGroup] = useState<string[]>([]);

  const [
    /**@name 是否为现货,如何是现货则填写物料编码时自动填装工艺,仅可填写尺码数量价格表 */
    isSpot,
    setIsSpot,
  ] = useState<boolean>(false);
  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await formRef.current?.validateFields();
        props?.onFinish?.({
          ...(props.node.value || {}),
          ...value,
          totalPrice: computedTotalAmount(value),
        });
        resolve(true);
      } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        reject(false);
      }
    });
  }
  /**@name 变更样式 */
  function changeStyleDemand(data) {
    if (data.colorGroup !== colorGroup) {
      setColorGroup(data.colorGroup?.map((i) => i.color) || []);
    }
  }
  const disabled = props.node.type === 'watch';
  return (
    <ModalForm<BusOrderStyleDemand>
      width={1000}
      title={props.title}
      submitter={disabled ? false : undefined}
      formRef={formRef}
      onVisibleChange={(v) => {
        formRef.current?.resetFields();
        formRef.current?.setFieldsValue(props.node.value);
      }}
      grid={true}
      modalProps={{ maskClosable: disabled, className: 'order-style' }}
      trigger={props.children}
      readonly={disabled}
      layout={disabled ? 'horizontal' : 'vertical'}
      onFinish={onFinish}
    >
      <ProFormRadio.Group
        label="订单款式类型"
        name="styleType"
        help="现货:表示已经存在的款式 | 现货定制:表示系统有相似的款式但是可能需要变更一些工艺参数（面料、部位更改）| 全新定制:表示系统中没有相同的款式需要重新填写工艺参数"
        rules={[{ required: true }]}
        valueEnum={OrderContractTypeValueEnum.Style}
        initialValue={BusOrderStyleTypeEnum.Custom}
        fieldProps={{
          onChange: (e) => {
            setIsSpot(e.target.value === BusOrderStyleTypeEnum.SpotGoods);
          },
        }}
      />
      <ProFormDependency name={['styleType']}>
        {({ styleType }) => {
          return (
            <>
              {styleType === BusOrderStyleTypeEnum.SpotGoodsCustom ? (
                <>
                  <MaterialFillStyleDemand
                    name="oldMaterialCode"
                    readonly={disabled}
                    styleType={styleType}
                    onChangeStyleDemand={changeStyleDemand}
                    action={formRef.current}
                  />
                  <ProFormGroup>
                    <ProFormText
                      name="materialCode"
                      rules={[
                        {
                          required: true,
                          validator: query.type === 'create' ? validatorMaterialCode : undefined,
                        },
                      ]}
                      colProps={{ span: 12 }}
                      label="新的物料编码(型号)"
                      placeholder="填写新的物料编码(型号)"
                    />
                    <ProFormText
                      rules={[{ required: true }]}
                      name="style"
                      colProps={{ span: 12 }}
                      placeholder="填写新的产品名称(款式)"
                      label="新的产品名称(款式)"
                    />
                  </ProFormGroup>
                </>
              ) : null}
              {styleType === BusOrderStyleTypeEnum.Custom ? (
                <ProFormGroup>
                  <ProFormText
                    name="materialCode"
                    rules={[
                      {
                        required: true,
                        validator: query.type === 'create' ? validatorMaterialCode : undefined,
                      },
                    ]}
                    colProps={{ span: 12 }}
                    label="物料编码(型号)"
                  />
                  <ProFormText
                    name="style"
                    colProps={{ span: 12 }}
                    rules={[{ required: true }]}
                    label="产品名称(款式)"
                  />
                </ProFormGroup>
              ) : null}
              {styleType === BusOrderStyleTypeEnum.SpotGoods ? (
                <ProFormGroup>
                  <MaterialFillStyleDemand
                    name="materialCode"
                    styleType={styleType}
                    onChangeStyleDemand={changeStyleDemand}
                    readonly={disabled}
                    colProps={{ span: 12 }}
                    action={formRef.current}
                  />
                  <ProFormText
                    rules={[{ required: true }]}
                    name="style"
                    disabled={isSpot}
                    colProps={{ span: 12 }}
                    placeholder="产品名称(款式)"
                    label="产品名称(款式)"
                  />
                </ProFormGroup>
              ) : null}
            </>
          );
        }}
      </ProFormDependency>

      <ProFormGroup>
        <ProFormText colProps={{ span: 8 }} name="shellFabric" label="面料" readonly={isSpot} />
        <ProFormText colProps={{ span: 8 }} name="商标" label="商标" readonly={isSpot} />
        <ProFormText colProps={{ span: 8 }} name="口袋" label="口袋" readonly={isSpot} />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormText name="领号" colProps={{ span: 8 }} label="领号" readonly={isSpot} />
        <ProFormText name="领子颜色" colProps={{ span: 8 }} label="领子颜色" readonly={isSpot} />
        <ProFormText name="后备扣" colProps={{ span: 8 }} label="后备扣" readonly={isSpot} />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormTextArea
          colProps={{ span: 12 }}
          name="领部缝纫工艺"
          label="领部缝纫工艺"
          readonly={isSpot}
        />
        <ProFormTextArea
          colProps={{ span: 12 }}
          name="门襟工艺"
          label="门襟工艺"
          readonly={isSpot}
        />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormTextArea
          colProps={{ span: 12 }}
          name="袖口工艺"
          label="袖口工艺"
          readonly={isSpot}
        />
        <ProFormTextArea
          colProps={{ span: 12 }}
          name="下摆工艺"
          label="下摆工艺"
          readonly={isSpot}
        />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormTextArea
          colProps={{ span: 12 }}
          name="纽扣工艺"
          label="纽扣工艺"
          readonly={isSpot}
        />
        <ProFormTextArea
          colProps={{ span: 12 }}
          name="其他工艺"
          label="其他工艺"
          readonly={isSpot}
        />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormMoney
          colProps={{ span: 6 }}
          fieldProps={{ precision: 4 }}
          name="其他费用"
          min={0}
          initialValue={0}
          label="其他费用"
          readonly={isSpot}
        />
        <ProFormMoney
          fieldProps={{ precision: 4 }}
          colProps={{ span: 6 }}
          readonly={isSpot}
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
          readonly={isSpot}
          min={0}
          label="绣花单价"
        />
        <ProFormMoney
          fieldProps={{ precision: 4 }}
          colProps={{ span: 6 }}
          initialValue={0}
          name="版费"
          readonly={isSpot}
          min={0}
          label="版费"
        />
      </ProFormGroup>

      {/* <ProFormGroup>
        <ProFormText colProps={{ span: 12 }} name="logo生产流程" label="logo生产流程" />
        <ProFormText colProps={{ span: 12 }} name="logo工艺位置" label="logo工艺位置" />
      </ProFormGroup>
      <ProForm.Item name="logo效果图" label="logo效果图">
        <SelectUploadFile
          multiple
          readonly={disabled}
          accpet="image/*"
          description="logo效果图"
          imageProps={{
            showImage: true,
            imageColumn: 3,
            imageSize: disabled ? 128 : 192,
          }}
        />
      </ProForm.Item> */}
      <div style={{ width: '100%' }}>
        <LogoCraftsmanship value={props.node?.value?.logo} readonly={disabled || isSpot} />
      </div>
      <SizeNumberPriceList colorGroup={colorGroup} readonly={disabled} />
      <ProFormDependency name={['sizePriceNumber', '印刷单价', '绣花单价', '其他费用', '版费']}>
        {(data) => {
          let totalPrice = 0;
          let pn = 0;
          const bf = data['版费'] || 0;
          const yh = data['印刷单价'] || 0;
          const xh = data['绣花单价'] || 0;
          data.sizePriceNumber?.forEach((i) => {
            pn += i.number || 0;
            totalPrice += (i.number || 0) * (i.price || 0);
          });

          return (
            <div
              style={{ fontSize: 18, fontWeight: 'bold' }}
            >{`总金额:产品价格[${totalPrice}](含其他费用[${
              data['其他费用'] || 0
            }]) + 版费[${bf}] + (绣花单价[${xh}]+印刷单价[${yh}])*数量[${pn}]=${
              totalPrice + bf + (xh + yh) * pn
            }`}</div>
          );
        }}
      </ProFormDependency>
    </ModalForm>
  );
};
export default ContractOrderStyleModal;

/**@name 尺码数量价格表 */
function SizeNumberPriceList(props: { readonly?: boolean; colorGroup: string[] }) {
  return (
    <ProFormList
      name="sizePriceNumber"
      label="尺码数量价格表"
      creatorButtonProps={props.readonly ? false : undefined}
      rules={[
        {
          validator(rule, value, callback) {
            if (Array.isArray(value)) {
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
                if (
                  i.sizeId === undefined ||
                  i.number === undefined ||
                  i.price === undefined ||
                  i.color === undefined
                ) {
                  errorText = '有字段为空,请补齐';
                }
                if (
                  i.sizeId === undefined &&
                  i.number === undefined &&
                  i.price === undefined &&
                  i.color === undefined
                ) {
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
        <SelectTreeSizeTemplate colProps={{ span: 10 }} name="sizeId" label="尺码规格" />
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
        <ProFormMoney
          fieldProps={{ precision: 4 }}
          colProps={{ span: 4 }}
          name="price"
          min={0}
          label="单价"
        />
        <ProFormDigit name="number" colProps={{ span: 4 }} label="数量" />
      </ProFormGroup>
    </ProFormList>
  );
}

/**@name 通过物料编码填充款式表单内容 */
function MaterialFillStyleDemand(props: {
  name: string;
  action: ProFormInstance<any> | undefined;
  readonly?: boolean;
  colProps?: ColProps;
  styleType: BusOrderStyleTypeEnum;
  onChangeStyleDemand?: (data: any) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [styleDemandData, setStyleDemandData] = useState(null);
  const [currentMaterialCode, setCurrentMaterialCode] = useState('');
  /**@name 设置款式到表单中 */
  function setStyleDemandForm() {
    if (props.readonly !== true) {
      props.action?.setFieldsValue(omit(styleDemandData, 'styleType'));
      props?.onChangeStyleDemand?.(styleDemandData);
    }
  }
  useEffect(() => {
    if (styleDemandData !== null && props.styleType === BusOrderStyleTypeEnum.SpotGoods) {
      setStyleDemandForm();
    }
  }, [styleDemandData]);
  return (
    <>
      <BusMaterialSelect
        name={props.name}
        width="xl"
        colProps={props.colProps}
        rules={[{ required: true }]}
        label="系统中的物料编码(型号)"
        help={props.readonly === true ? '' : '请选择系统的物料编码'}
        materialType={BusMaterialTypeEnum.Product}
        onChangeName={(v, n) => {
          props.action?.setFieldValue('style', n);
        }}
      />
      <ProFormDependency name={[props.name]}>
        {(data, form) => {
          const materialCode: string = data[props.name];
          // form.setFieldValue('style', name);
          if (materialCode && currentMaterialCode !== materialCode) {
            setCurrentMaterialCode(materialCode);
            fetchMaterialToStyleDemandData(materialCode).then((r) => {
              if (r?.data?.styleDemandData) {
                setVisible(true);
                setStyleDemandData(r.data.styleDemandData);
              } else {
                setVisible(false);
                setStyleDemandData(null);
              }
            });
          }
          if (props.styleType === BusOrderStyleTypeEnum.SpotGoods) {
            return null;
          }
          return (
            <a
              hidden={!visible || props.readonly === true}
              onClick={() => {
                setStyleDemandForm();
              }}
            >
              发现系统中相同款式表单,可单击设置款式
            </a>
          );
        }}
      </ProFormDependency>
    </>
  );
}
