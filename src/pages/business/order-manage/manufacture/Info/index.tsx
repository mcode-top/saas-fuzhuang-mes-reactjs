import {
  fetchApproveContract,
  fetchContractSerialNumber,
  fetchCreateContract,
  fetchMaterialToStyleDemandData,
  fetchUpdateContract,
} from '@/apis/business/order-manage/contract';
import type { BusOrderStyleDemand } from '@/apis/business/order-manage/contract/typing';
import {
  fetchReadManufacture,
  fetchStartManufacture,
} from '@/apis/business/order-manage/manufacture';
import type {
  BusManufactureWorkPriceTable,
  BusOrderManufacture,
  UpdateManufactureDto,
} from '@/apis/business/order-manage/manufacture/typing';
import { DraftsModal, saveDrafts } from '@/components/Comm/Drafts';
import SelectUploadFile from '@/components/Comm/FormlyComponents/Upload';
import LoadingButton from '@/components/Comm/LoadingButton';
import { dictValueEnum, OrderContractTypeValueEnum } from '@/configs/commValueEnum';
import SelectTreeSizeTemplate from '@/pages/business/techology-manage/SizeTemplate/components/SelectTreeSizeTemplate';
import type { FormListActionType, ProFormInstance } from '@ant-design/pro-form';
import { ProFormDependency } from '@ant-design/pro-form';
import { ProFormMoney } from '@ant-design/pro-form';
import { ProFormList } from '@ant-design/pro-form';
import { ProFormTextArea } from '@ant-design/pro-form';
import ProForm, { ProFormDatePicker } from '@ant-design/pro-form';
import { FooterToolbar } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { FormListOperation } from 'antd';
import { Alert, Button, Card, Descriptions, Input, message, Modal, Space, Table } from 'antd';
import { omit } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useLocation, useModel } from 'umi';
import type { ManufactureLocationQuery } from '../typing';
import ContractOrderStyleModal from './ContractOrderStyleModal';
import SelectWorkPrice from '@/pages/business/techology-manage/WorkPrice/components/SelectWorkPrice';
import SelectWorkPriceContent from '@/pages/business/techology-manage/WorkPrice/components/SelectWorkPriceContent';
import { useForm } from 'antd/lib/form/Form';
import { disabledLastDate } from '@/components/Comm/helper';
import { jsonUniq } from '@/utils';

/**@name 生产单详情 */
const OrderManufactureInfo: React.FC = () => {
  /**@name 合同单信息 */
  const [contractResult, setContractResult] = useState<BusOrderManufacture>();
  const [readonly, setReadonly] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
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
    return fetchReadManufacture(id).then((res) => {
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
  function approveContract(isAgree: boolean) {
    return new Promise((resolve, reject) => {
      let value = '';
      Modal.confirm({
        title: '请您填写审批意见(可不填)',
        content: <Input.TextArea onChange={(e) => (value = e.target.value)} />,
        onOk: () => {
          fetchApproveContract({
            contractNumber: formRef.current?.getFieldValue('contractNumber'),
            result: isAgree,
            opinion: value,
            salesCommissions: formRef.current?.getFieldValue('salesCommissions'),
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
  async function updateContract(data: BusOrderManufacture) {
    await fetchUpdateContract(data);
    resultSuccess();
  }
  function resultSuccess() {
    window.layoutTabsAction.goAndClose('/order-manage/manufacture', true);
    message.success('操作成功');
  }

  return (
    <Card style={{ width: 1000, margin: 'auto' }}>
      {contractResult ? (
        <>
          <Descriptions>
            <Descriptions.Item label="合同号">{contractResult?.contractNumber}</Descriptions.Item>
            <Descriptions.Item label="订单类型">
              {dictValueEnum(
                OrderContractTypeValueEnum.Style,
                contractResult?.styleDemand.styleType,
              )}
            </Descriptions.Item>
            <Descriptions.Item label="物料编码(型号)">
              {contractResult?.styleDemand.materialCode}
            </Descriptions.Item>
            <Descriptions.Item label="产品名称(款式)">
              {contractResult?.styleDemand.style}
            </Descriptions.Item>
            <Descriptions.Item label="颜色">{contractResult?.styleDemand.color}</Descriptions.Item>
            <Descriptions.Item label="面料">
              {contractResult?.styleDemand.shellFabric}
            </Descriptions.Item>
            <Descriptions.Item label="商标">{contractResult?.styleDemand.商标}</Descriptions.Item>
            <Descriptions.Item label="口袋">{contractResult?.styleDemand.口袋}</Descriptions.Item>
            <Descriptions.Item label="领号">{contractResult?.styleDemand.领号}</Descriptions.Item>
            <Descriptions.Item label="领子颜色">
              {contractResult?.styleDemand.领子颜色}
            </Descriptions.Item>
            <Descriptions.Item label="后备扣">
              {contractResult?.styleDemand.后备扣}
            </Descriptions.Item>
            <Descriptions.Item label="领部缝纫工艺">
              {contractResult?.styleDemand.领部缝纫工艺}
            </Descriptions.Item>
            <Descriptions.Item label="门襟工艺">
              {contractResult?.styleDemand.门襟工艺}
            </Descriptions.Item>
            <Descriptions.Item label="袖口工艺">
              {contractResult?.styleDemand.袖口工艺}
            </Descriptions.Item>
            <Descriptions.Item label="下摆工艺">
              {contractResult?.styleDemand.下摆工艺}
            </Descriptions.Item>
            <Descriptions.Item label="纽扣工艺">
              {contractResult?.styleDemand.纽扣工艺}
            </Descriptions.Item>
            <Descriptions.Item label="logo生产流程">
              {contractResult?.styleDemand.logo生产流程}
            </Descriptions.Item>
            <Descriptions.Item label="logo工艺位置" span={2}>
              {contractResult?.styleDemand.logo工艺位置}
            </Descriptions.Item>
          </Descriptions>
          <div style={{ width: '100%' }}>
            <SelectUploadFile
              multiple
              accpet="image/*"
              readonly={true}
              description="logo效果图"
              value={contractResult?.styleDemand.logo效果图}
              imageProps={{
                showImage: true,
                imageColumn: 3,
                imageSize: 192,
              }}
            />
          </div>
          <Table
            size="small"
            rowKey="sizeId"
            columns={[
              {
                dataIndex: 'sizeId',
                title: '尺码规格',
                render(value, record, index) {
                  return <SelectTreeSizeTemplate fieldProps={{ value }} readonly={true} />;
                },
              },
              { dataIndex: 'number', title: '数量' },
            ]}
            dataSource={contractResult?.styleDemand.sizePriceNumber}
            title={() => '尺码数量价格表'}
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
                <LoadingButton
                  onLoadingClick={async () => {
                    const values = await formRef.current?.getFieldsValue();
                    await saveDrafts('contract', values);
                  }}
                >
                  另存为草稿箱
                </LoadingButton>
                <DraftsModal
                  businessKey="contract"
                  onFinish={async (values) => {
                    await formRef.current?.setFieldsValue(omit(values, 'contractNumber'));
                  }}
                >
                  <Button hidden={query.type !== 'create' && query.type !== 'update'}>
                    设置草稿箱内容
                  </Button>
                </DraftsModal>
                <LoadingButton
                  onLoadingClick={() => approveContract(true)}
                  hidden={query.type !== 'approve'}
                  type="primary"
                >
                  同意通过
                </LoadingButton>
                <LoadingButton
                  onLoadingClick={() => approveContract(false)}
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
                    await updateContract(values as any);
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
        <WorkProcessWrokPrice readonly={readonly} />
        <ProFormTextArea readonly={readonly} label="备注信息" width="lg" name="remark" />
      </ProForm>
    </Card>
  );
};
export default OrderManufactureInfo;

/**@name 工序工价 */
function WorkProcessWrokPrice(props: { readonly: boolean }) {
  const actionRef = React.useRef<FormListActionType>();

  return (
    <ProFormList
      creatorButtonProps={
        props.readonly
          ? false
          : {
              creatorButtonText: '设置工价表',
            }
      }
      name="workPriceTable"
      label="工价表"
      key="workPriceId"
      actionRef={actionRef}
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
    >
      <SelectWorkPrice
        name="workPriceId"
        key="选择工价表"
        rules={[
          {
            validator(rule, value, callback) {
              const list = actionRef.current?.getList();
              if (Array.isArray(list)) {
                if (jsonUniq(list, 'workPriceId').length !== list.length) {
                  return callback('工价表有出现重复');
                }
                const workProcessList = list.reduce((pre, next) => {
                  if (next) {
                    pre.push(...(next.workProcessWrokPrice || []));
                  }
                  return pre;
                }, []);
                if (jsonUniq(workProcessList, 'workProcessId').length !== workProcessList.length) {
                  return callback('有工序重复,工价表仅能存在唯一工序');
                }
              }
              callback();
            },
          },
        ]}
        label="选择工价表"
        width="md"
      />
      <ProFormDependency name={['workPriceId']}>
        {({ workPriceId }, form) => {
          if (workPriceId) {
            return <WorkPriceProcessLinked readonly={props.readonly} workPriceId={workPriceId} />;
          } else {
            return <Alert message="请先选择工价表" type="warning" />;
          }
        }}
      </ProFormDependency>
    </ProFormList>
  );
}

function WorkPriceProcessLinked(props: { workPriceId: number; readonly: boolean }) {
  const [price, setPrice] = useState(0);
  const actionRef = React.useRef<FormListActionType>();

  return (
    <ProFormList
      name="workProcessWrokPrice"
      creatorRecord={{ workProcessId: undefined, price: 0, changePrice: undefined }}
      key={props.workPriceId}
      label="工序工价"
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
      creatorButtonProps={
        props.readonly
          ? false
          : {
              creatorButtonText: '添加工序',
            }
      }
      actionRef={actionRef}
      rules={[
        {
          validator(rule, value, callback) {
            if (Array.isArray(value)) {
              if (jsonUniq(value, 'workProcessId').length !== value.length) {
                return callback('有工序重复');
              }
            }
            callback();
          },
        },
      ]}
    >
      {(meta, index, action, count) => {
        return (
          <ProForm.Group key={'ProFormList' + props.workPriceId} labelLayout="inline">
            <SelectWorkPriceContent
              help={props.readonly ? undefined : '如果现有工价与系统不符可以设置变更工价'}
              workPriceId={props.workPriceId}
              name="workProcessId"
              label="工序"
              width={250}
              onChangePrice={(v, p) => {
                const data = action.getCurrentRowData();
                action.add({ ...data, price: p }, index);
                action.remove(index + 1);
              }}
            />
            <ProFormMoney
              width={100}
              fieldProps={{ precision: 4 }}
              name="price"
              min={0}
              readonly={true}
              label="工价"
            />
            <ProFormMoney
              width={100}
              fieldProps={{ precision: 4 }}
              name="changePrice"
              rules={[
                {
                  validator(rule, value, callback) {
                    const data = action.getCurrentRowData();
                    if (data.price === value) {
                      return callback('变更工价不能与原工价相同');
                    }
                    callback();
                  },
                },
              ]}
              min={0}
              label="变更工价"
            />
          </ProForm.Group>
        );
      }}
    </ProFormList>
  );
}
