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

/**@name 生产单详情 */
const OrderManufactureInfo: React.FC = () => {
  /**@name 合同单信息 */
  const [contractResult, setContractResult] = useState<BusOrderManufacture>();
  const [readonly, setReadonly] = useState(false);
  /**@name 相同物料编码的数据 */
  const [sysWorkPriceTable, setSysWorkPriceTable] = useState<{ visible: boolean; data: any }>({
    visible: false,
    data: {},
  });
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
  /**@name 获取生产单与合同单数据 */
  function getManufactureValues(id: number) {
    return fetchReadManufacture(id).then(async (res) => {
      formRef.current?.setFieldsValue(res.data);

      setContractResult(res.data);

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
  /**@name 开始生产单 */
  async function startManufacture(data: UpdateManufactureDto) {
    await fetchStartManufacture(Number(query.id), data);
    resultSuccess();
  }
  /**@name 审核生产单 */
  function approveManufacture(isAgree: boolean) {
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
  console.log(contractResult);

  return (
    <Card style={{ width: 1000, margin: 'auto' }}>
      {contractResult ? (
        <ContractStyleDemand
          deliverDate={contractResult?.contract?.deliverDate}
          contractNumber={contractResult?.contractNumber}
          styleDemand={contractResult?.styleDemand}
        />
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
                    const values = await formRef.current?.validateFields();
                    await updateManufacture(values as any);
                  }}
                >
                  保存修改
                </LoadingButton>
                <LoadingButton
                  hidden={query.type !== 'create'}
                  type="primary"
                  onLoadingClick={async () => {
                    const values = await formRef.current?.validateFields();
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
                    return await startManufacture({ ...values, isUpdateWorkPrice: isUpdate });
                  }}
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
