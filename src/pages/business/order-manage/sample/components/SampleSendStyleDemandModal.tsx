import type { OrderSampleStyleDemand } from '@/apis/business/order-manage/contract/typing';
import type { BusWarehouseGoodsType } from '@/apis/business/warehouse/typing';
import BusMaterialSelect from '@/pages/business/techology-manage/Material/components/MaterialSelect';
import { BusMaterialTypeEnum } from '@/pages/business/techology-manage/Material/typing';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormMoney } from '@ant-design/pro-form';
import { ProFormDigit, ProFormGroup, ProFormList, ProFormSelect } from '@ant-design/pro-form';
import { ProFormDependency } from '@ant-design/pro-form';
import { ModalForm } from '@ant-design/pro-form';
import { Empty } from 'antd';
import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { MaterialToWarehouseGoodsTable } from '../../components/SizeNumberPriceTable';
import type { GoodsOptional } from '../../delivery/components/OrderDeliveryInfo';
import { transformGoodsToLabelValue } from '../../delivery/components/OrderDeliveryInfo';

/**@name 寄样单款式价格表单对话框引用 */
export type SampleSendStyleDemandModalRef = {
  type?: 'create' | 'update' | 'watch';
  show: (
    type: SampleSendStyleDemandModalRef['type'],
    data?: OrderSampleStyleDemand & { index },
  ) => any;
};
export type SampleSendStyleDemandModalProps = {
  isCharge: boolean;
  onFinish?: (value: any, type: SampleSendStyleDemandModalRef['type']) => void;
};
/**@name 寄样单款式价格表单对话框 */
export default forwardRef<SampleSendStyleDemandModalRef, SampleSendStyleDemandModalProps>(
  (props, ref) => {
    const [visible, setVisible] = useState(false);
    const formRef = useRef<ProFormInstance>();
    const [goodsOptional, setGoodsOptional] = useState<GoodsOptional[]>([]);
    const [formData, setFormData] = useState<OrderSampleStyleDemand | undefined>();
    const [type, setType] = useState<SampleSendStyleDemandModalRef['type']>('create');
    const readonly = type === 'watch';
    useImperativeHandle(ref, () => {
      return {
        show: init,
      };
    });
    useEffect(() => {
      formRef.current?.setFieldsValue(formData);
    }, [visible]);
    /**@name 初始话获取数据 */
    const init: SampleSendStyleDemandModalRef['show'] = (initType, data) => {
      setVisible(true);
      setType(initType);
      if (initType === 'update') {
        setFormData(data);
      } else if (initType === 'watch') {
        setFormData(data);
      } else {
        setFormData(undefined);
      }
    };
    function onFinish(): Promise<boolean> {
      return new Promise(async (resolve, reject) => {
        try {
          const value = await formRef.current?.validateFields();
          props?.onFinish?.(
            {
              ...formData,
              ...value,
              totalPrice: value.sizePriceNumber.reduce((p, n) => {
                return p + (n?.price || 0) * (n?.number || 0);
              }, 0),
            },
            type,
          );
          resolve(true);
        } catch (error) {
          console.log('====================================');
          console.log(error);
          console.log('====================================');
          reject(false);
        }
      });
    }
    return (
      <ModalForm
        width={1000}
        title={'寄样单款式需求'}
        formRef={formRef}
        visible={visible}
        onVisibleChange={(v) => {
          setVisible(v);
          formRef.current?.resetFields();
        }}
        onFinish={onFinish}
        readonly={readonly}
        grid={true}
      >
        <BusMaterialSelect
          materialType={BusMaterialTypeEnum.Product}
          colProps={{ span: 24 }}
          label="选择成衣物料编码"
          name="materialCode"
          readonly={readonly}
        />
        <ProFormDependency name={['materialCode']}>
          {({ materialCode }) => {
            if (!materialCode) {
              return (
                <div style={{ margin: 'auto' }}>
                  <Empty description="请先填写成衣物料编码" />
                </div>
              );
            }
            return (
              <>
                <ProFormGroup colProps={{ span: 24 }}>
                  <MaterialToWarehouseGoodsTable
                    materialCode={materialCode}
                    title={`${materialCode}所有的仓库库存`}
                    onChangeDataSource={(data) => {
                      const goodsList = data.reduce<BusWarehouseGoodsType[]>((p, n) => {
                        n.mateGoods?.forEach((g) => {
                          p.push(g);
                        });
                        return p;
                      }, []);
                      setGoodsOptional(transformGoodsToLabelValue(goodsList));
                    }}
                  />
                </ProFormGroup>
                <ProFormList
                  initialValue={[{}]}
                  colProps={{ span: 24 }}
                  name="sizePriceNumber"
                  label="品类数量与价格"
                  creatorButtonProps={readonly ? false : undefined}
                  deleteIconProps={readonly ? false : undefined}
                  copyIconProps={readonly ? false : undefined}
                  rules={[
                    {
                      validator(_rule, value: { goodsId: number; quantity: number }[], callback) {
                        const find = value.find((item) => {
                          const goodsFilter = value.filter((i) => i.goodsId === item.goodsId);
                          return goodsFilter.length >= 2;
                        });
                        if (find) {
                          return callback('出库品类出现相同货品');
                        }
                        callback();
                      },
                    },
                  ]}
                >
                  <ProFormGroup>
                    <ProFormSelect
                      colProps={{ span: 16 }}
                      name="goodsId"
                      rules={[{ required: true }]}
                      label="寄样货品"
                      options={goodsOptional}
                    />
                    <ProFormDependency name={['goodsId']}>
                      {({ goodsId }) => {
                        const find = goodsOptional.find((i) => i.value === goodsId);
                        return (
                          <ProFormDigit
                            rules={[{ required: true }]}
                            colProps={{ span: 4 }}
                            min={0}
                            max={find?.goods.quantity}
                            name="number"
                            label="需要寄样数量"
                          />
                        );
                      }}
                    </ProFormDependency>
                    {props.isCharge ? (
                      <ProFormMoney
                        fieldProps={{ precision: 4 }}
                        colProps={{ span: 4 }}
                        name="price"
                        rules={[{ required: true }]}
                        min={0}
                        label="样品单价"
                      />
                    ) : null}
                  </ProFormGroup>
                </ProFormList>
              </>
            );
          }}
        </ProFormDependency>
      </ModalForm>
    );
  },
);
