import { fetchMaterialToStyleDemandData } from '@/apis/business/order-manage/contract';
import {
  fetchApproveManufacture,
  fetchReadManufacture,
  fetchStartManufacture,
  fetchUpdateManufacture,
} from '@/apis/business/order-manage/manufacture';
import type {
  BusManufactureWorkPriceTable,
  BusOrderManufacture,
  UpdateManufactureDto,
} from '@/apis/business/order-manage/manufacture/typing';
import { DraftsModal, saveDrafts } from '@/components/Comm/Drafts';
import LoadingButton from '@/components/Comm/LoadingButton';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormTextArea } from '@ant-design/pro-form';
import ProForm, { ProFormDatePicker } from '@ant-design/pro-form';
import { FooterToolbar } from '@ant-design/pro-layout';
import { Button, Card, Input, message, Modal, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'umi';
import type { ManufactureLocationQuery } from '../typing';
import { disabledLastDate } from '@/components/Comm/helper';
import EditWorkProcessWrokPriceList from './EditWorkProcessWrokPriceList';
import ContractStyleDemand from './ContractStyleDemand';
import type { MaterialToWarehouseGoodsTableRef } from '../../components/SizeNumberPriceTable';
import { MaterialToWarehouseGoodsTable } from '../../components/SizeNumberPriceTable';
import { exportManufactureFormExcel } from './exportExcel';

/**@name 生产单详情 */
const OrderManufactureInfo: React.FC = () => {
  /**@name 生产单信息 */
  const [manufactureResult, setManufactureResult] = useState<BusOrderManufacture>();
  const [readonly, setReadonly] = useState(false);
  /**@name 相同物料编码的数据 */
  const [sysWorkPriceTable, setSysWorkPriceTable] = useState<{ visible: boolean; data: any }>({
    visible: false,
    data: {},
  });
  /**@name 需要生产数量Ref实例 */
  const needProductionRef = React.useRef<MaterialToWarehouseGoodsTableRef>(null);
  /**@name 主表单实例 */
  const formRef = React.useRef<ProFormInstance>();
  const location = useLocation();
  const query = (location as any).query as ManufactureLocationQuery;
  useEffect(() => {
    getManufactureValues(Number(query.id));
    if (query.type === 'watch' || query.type === 'approve') {
      setReadonly(true);
    }
  }, []);
  /**@name 获取生产单数据 */
  function getManufactureValues(id: number) {
    return fetchReadManufacture(id).then(async (res) => {
      formRef.current?.setFieldsValue(res.data);
      console.log(res.data);

      setManufactureResult(res.data);

      if (query.type === 'create' || query.type === 'update') {
        fetchMaterialToStyleDemandData(res.data.materialCode).then((r) => {
          if (r?.data?.manufactureData) {
            setSysWorkPriceTable({
              visible: true,
              data: r?.data?.manufactureData,
            });
          } else {
            setSysWorkPriceTable({
              visible: false,
              data: null,
            });
          }
        });
      }
    });
  }
  /**@name 获取表单 */
  async function getFormValues() {
    const values = await formRef.current?.validateFields();
    const needProduction = needProductionRef.current?.getNeedQuantityColumns();
    if (!needProduction) {
      return Promise.reject('尺码数量价格表中的需要生产数量是必填的');
    }
    return {
      ...values,
      needProduction,
    };
  }
  /**@name 确定创建生产单 */
  async function buttonCreateManufacture() {
    const values = await getFormValues();
    const workPriceTable: BusManufactureWorkPriceTable[] = values.workPriceTable;
    let isUpdate = false;
    if (Array.isArray(workPriceTable)) {
      isUpdate =
        workPriceTable.findIndex((w) => {
          let bl = false;
          if (Array.isArray(w.workProcessWrokPrice)) {
            w.workProcessWrokPrice.forEach((v) => {
              if (v.changePrice !== undefined || v.changePrice > 0) {
                bl = true;
              }
            });
          }
          return bl;
        }) !== -1;
    }
    const uploadFetchData = { ...values, isUpdateWorkPrice: isUpdate };
    const productionTotal = values.needProduction.reduce((p, n) => p + n.needQuantity, 0);
    if (productionTotal === 0) {
      return Modal.confirm({
        title: '系统提示',
        content: <p>检测到需要生产的数量为0,当前生产单审批完成后将自动完成生产单,是否确定提交?</p>,
        onOk: () => startManufacture(uploadFetchData),
      });
    } else {
      return await startManufacture(uploadFetchData);
    }
  }
  /**@name 开始生产单 */
  async function startManufacture(data: UpdateManufactureDto) {
    await fetchStartManufacture(Number(query.id), data);
    resultSuccess();
  }
  /**@name 审核生产单 */
  async function approveManufacture(isAgree: boolean) {
    await formRef.current?.validateFields();

    return new Promise((resolve, reject) => {
      let value = '';
      Modal.confirm({
        title: '请您填写审批意见(可不填)',
        content: <Input.TextArea onChange={(e) => (value = e.target.value)} />,
        onOk: () => {
          fetchApproveManufacture(query.id, {
            isAgree,
            opinion: value,
          })
            .then((res) => {
              resultSuccess();
              resolve(true);
            })
            .catch(reject);
        },
        onCancel: () => {
          resolve(false);
        },
      });
    });
  }
  /**@name 修改生产单 */
  async function updateManufacture(data: BusOrderManufacture) {
    await fetchUpdateManufacture(query.id, data as any);
    resultSuccess();
  }
  function resultSuccess() {
    window.layoutTabsAction.goAndClose('/order-manage/manufacture', true);
    message.success('操作成功');
  }
  return (
    <Card style={{ width: 1000, margin: 'auto' }}>
      {manufactureResult ? (
        <>
          <ContractStyleDemand
            sampleRemark={manufactureResult?.contract?.sampleRemark}
            deliverDate={manufactureResult?.contract?.deliverDate}
            contractNumber={manufactureResult?.contractNumber}
            styleDemand={manufactureResult?.styleDemand}
            operatorId={manufactureResult?.contract?.process?.operatorId}
          />
          <MaterialToWarehouseGoodsTable
            ref={needProductionRef}
            materialCode={manufactureResult?.styleDemand.materialCode}
            data={manufactureResult?.styleDemand.sizePriceNumber}
            business={{
              edit: query.type === 'create' || query.type === 'update',
              type: 'manufacture',
              value: manufactureResult.needProduction || [],
            }}
          />
        </>
      ) : null}

      <ProForm
        style={{ paddingTop: 12 }}
        layout={'horizontal'}
        formRef={formRef}
        readonly={readonly}
        submitter={{
          render: (_, dom) => (
            <FooterToolbar>
              <Space>
                {manufactureResult && (
                  <Button
                    hidden={query.type === 'create' || query.type === 'update'}
                    onClick={() => exportManufactureFormExcel(manufactureResult)}
                  >
                    导出生产单
                  </Button>
                )}
                <LoadingButton
                  onLoadingClick={async () => {
                    const values = await formRef.current?.getFieldValue('workPriceTable');
                    await saveDrafts('manufacture', values);
                  }}
                >
                  另存为草稿箱
                </LoadingButton>
                <DraftsModal
                  businessKey="manufacture"
                  onFinish={async (values) => {
                    await formRef?.current?.setFieldValue('workPriceTable', values);
                  }}
                >
                  <Button hidden={query.type !== 'create' && query.type !== 'update'}>
                    设置草稿箱内容
                  </Button>
                </DraftsModal>
                <LoadingButton
                  onLoadingClick={() => approveManufacture(true)}
                  hidden={query.type !== 'approve'}
                  type="primary"
                >
                  同意通过
                </LoadingButton>
                <LoadingButton
                  onLoadingClick={() => approveManufacture(false)}
                  hidden={query.type !== 'approve'}
                  danger
                >
                  拒绝驳回
                </LoadingButton>
                <LoadingButton
                  hidden={query.type !== 'update'}
                  type="primary"
                  onLoadingClick={async () => {
                    const values = await getFormValues();
                    await updateManufacture(values as any);
                  }}
                >
                  保存修改
                </LoadingButton>
                <LoadingButton
                  hidden={query.type !== 'create'}
                  type="primary"
                  onLoadingClick={buttonCreateManufacture}
                >
                  确定创建
                </LoadingButton>
              </Space>
            </FooterToolbar>
          ),
        }}
      >
        <ProForm.Group>
          <ProFormDatePicker
            readonly={readonly}
            rules={[{ required: true }]}
            label="生产交期时间"
            fieldProps={{ disabledDate: disabledLastDate }}
            width="sm"
            name="deliverDate"
          />
          <a
            hidden={!sysWorkPriceTable.visible}
            onClick={() => {
              formRef?.current?.setFieldValue('workPriceTable', sysWorkPriceTable.data);
            }}
          >
            发现系统中相同款式工价表,可单击设置
          </a>
        </ProForm.Group>
        <EditWorkProcessWrokPriceList
          name="workPriceTable"
          label="工价表"
          key="workPriceId"
          readonly={readonly}
        />
        <ProFormTextArea readonly={readonly} label="备注信息" width="lg" name="remark" />
      </ProForm>
    </Card>
  );
};
export default OrderManufactureInfo;
