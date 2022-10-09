import {
  fetchApproveContract,
  fetchContractSerialNumber,
  fetchCreateContract,
  fetchUpdateContract,
  fetchWatchContract,
} from '@/apis/business/order-manage/contract';
import type {
  BusOrderContract,
  BusOrderStyleDemand,
} from '@/apis/business/order-manage/contract/typing';
import { BusOrderTypeEnum } from '@/apis/business/order-manage/contract/typing';
import { DraftsModal, saveDrafts } from '@/components/Comm/Drafts';
import { disabledLastDate } from '@/components/Comm/helper';
import LoadingButton from '@/components/Comm/LoadingButton';
import { OrderContractTypeValueEnum } from '@/configs/commValueEnum';
import { ReloadOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormSelect } from '@ant-design/pro-form';
import ProForm, {
  ProFormDatePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Card, Input, message, Modal, Space } from 'antd';
import { isEmpty, omit } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useModel, useParams } from 'umi';
import useSwitchTabs from 'use-switch-tabs';
import BusSelectCustomerAddress from '../../components/SelectCustomerAddress';
import BusSelectCustomerCompany from '../../components/SelectCustomerCompany';
import BusSelectCustomerContacter from '../../components/SelectCustomerContacter';
import BusSelectUser from '../../components/SelectUser';
import type { ContractLocationQuery } from '../typing';
import ContractOrderStyleModal from './ContractOrderStyleModal';

/**@name 合同单详情 */
const OrderContractInfo: React.FC = (props) => {
  const [contractLoading, setContractLoading] = useState(false);
  const [readonly, setReadonly] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const formRef = React.useRef<ProFormInstance>();
  const location = useLocation();
  const query = (location as any).query as ContractLocationQuery;
  useEffect(() => {
    if (query.type === 'create') {
      refrshContractNumber();
    } else if (query.type === 'watch' || query.type === 'approve') {
      if (query.contractNumber) {
        setReadonly(true);
        setContractValues(query.contractNumber);
      }
    } else if (query.type === 'update') {
      if (query.contractNumber) {
        setContractValues(query.contractNumber);
      }
    }
  }, []);
  /**@name 设置合同数据 */
  function setContractValues(contractNumber: string) {
    return fetchWatchContract(contractNumber).then((res) => {
      formRef.current?.setFieldsValue(res.data);
    });
  }
  /**@name 新增合同单 */
  async function createContract(data: BusOrderContract) {
    await fetchCreateContract(data);
    resultSuccess();
  }
  /**@name 审核合同单 */
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
  /**@name 修改合同单 */
  async function updateContract(data: BusOrderContract) {
    await fetchUpdateContract(data);
    resultSuccess();
  }
  function resultSuccess() {
    window.layoutTabsAction.goAndClose('/order-manage/contract', true);
    message.success('操作成功');
  }
  function refrshContractNumber() {
    setContractLoading(true);
    fetchContractSerialNumber()
      .then((res) => {
        formRef.current?.setFieldValue('contractNumber', res.data);
      })
      .finally(() => setContractLoading(false));
  }
  return (
    <Card style={{ width: 800, margin: 'auto' }}>
      <ProForm
        layout={readonly ? 'horizontal' : 'vertical'}
        formRef={formRef}
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
                    await createContract(values as any);
                  }}
                >
                  确定创建
                </LoadingButton>
              </Space>
            </FooterToolbar>
          ),
        }}
        onFinish={async (values) => {
          await createContract(values as any);
        }}
      >
        <ProForm.Group>
          <ProFormText
            name="contractNumber"
            label="合同号"
            width="sm"
            rules={[{ required: true }]}
            placeholder="请输入名称"
            fieldProps={{
              disabled: contractLoading,
              addonAfter: <ReloadOutlined onClick={refrshContractNumber} />,
            }}
            readonly={readonly}
            help={readonly ? '' : '点击按钮可重置合同流水号'}
          />
          <BusSelectUser
            label="跟进人"
            initialValue={initialState?.currentUser?.id}
            placeholder="请输入名称"
            name="operatorId"
            width="sm"
            readonly={true}
          />
          <ProFormDatePicker
            readonly={readonly}
            rules={[{ required: true }]}
            label="交期时间"
            fieldProps={{ disabledDate: disabledLastDate }}
            width="sm"
            name="deliverDate"
          />
        </ProForm.Group>
        <BusSelectCustomerCompany
          label="客户公司"
          width="lg"
          readonly={readonly}
          rules={[{ required: true }]}
          name="companyId"
        />
        <ProForm.Group>
          <ProFormDependency name={['companyId']}>
            {({ companyId }) => {
              return (
                <>
                  <BusSelectCustomerContacter
                    label="客户联系人"
                    readonly={readonly}
                    width="lg"
                    companyId={companyId}
                    name="contactId"
                  />
                  <BusSelectCustomerAddress
                    label="客户地址"
                    readonly={readonly}
                    width="lg"
                    companyId={companyId}
                    name="addressId"
                  />
                </>
              );
            }}
          </ProFormDependency>
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDigit
            label="预付比例(%)"
            rules={[{ required: true }]}
            fieldProps={{
              addonAfter: '%',
            }}
            min={0}
            readonly={readonly}
            max={100}
            name="prepayPercent"
          />

          <ProFormRadio.Group
            label="发票类型"
            name="invoiceType"
            readonly={readonly}
            initialValue="发票"
            rules={[{ required: true }]}
            options={['发票', '普票', '无票']}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            readonly={readonly}
            label="订单类型"
            name="type"
            rules={[{ required: true }]}
            initialValue={BusOrderTypeEnum.Normal}
            valueEnum={OrderContractTypeValueEnum.OrderType}
          />
          <ProFormText
            readonly={readonly}
            name="payment"
            label="付款方式"
            rules={[{ required: true }]}
            placeholder="请输入名称"
          />
          {/**@name 需要审批人员设置销售提成 */}
          <ProFormDigit
            name="salesCommissions"
            readonly={query.type !== 'approve'}
            label="销售提成(%)"
            fieldProps={{
              addonAfter: '%',
            }}
            min={0}
            rules={[{ required: query.type === 'approve' }]}
            max={100}
          />
        </ProForm.Group>
        <ProFormText
          readonly={readonly}
          name="logisticsMode"
          label="物流方式"
          placeholder="请输入物流方式"
        />
        <ProForm.Item
          name="styleDemand"
          label="款式需求"
          rules={[
            {
              validator(rule, value, callback) {
                if (isEmpty(value)) {
                  return callback('款式需求不能为空');
                }
                callback();
              },
            },
          ]}
        >
          <OrderStyleDemandTable readonly={readonly} />
        </ProForm.Item>
        <ProFormTextArea readonly={readonly} label="包装要求" name="packageDemand" />
        <ProFormTextArea readonly={readonly} label="备注说明" name="remark" />
      </ProForm>
    </Card>
  );
};
export default OrderContractInfo;

/**@name 订单款式 */
function OrderStyleDemandTable(props: {
  onChange?: (styleGroup: BusOrderStyleDemand[]) => any;
  value?: BusOrderStyleDemand[];
  readonly?: boolean;
}) {
  const [dataSource, setDataSource] = useState<BusOrderStyleDemand[]>([]);
  const columns: ProColumns[] = [
    { title: '物料编码(型号)', dataIndex: 'materialCode', width: 150 },
    { title: '产品名称', dataIndex: 'style' },
    { title: '合同订单类型', dataIndex: 'styleType', valueEnum: OrderContractTypeValueEnum.Style },
    {
      title: '总数量',
      key: 'number',
      width: 80,
      render(dom, entity, index, action, schema) {
        let total = 0;
        entity.sizePriceNumber?.forEach((i) => {
          total += i.number;
        });
        return total;
      },
    },
    {
      title: '总金额',
      dataIndex: 'totalPrice',
      width: 100,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 80,
      key: 'operation',
      render(dom, entity, index, action, schema) {
        return (
          <Space size="small">
            <ContractOrderStyleModal
              key="create"
              node={{ type: 'watch', value: entity }}
              title="查看订单款式"
            >
              <Button type="link" size="small">
                查看
              </Button>
            </ContractOrderStyleModal>

            <ContractOrderStyleModal
              key="update"
              node={{ type: 'update', value: entity }}
              title="修改订单款式"
              onFinish={(value) => {
                change(
                  dataSource.map((item, di) => {
                    if (di === index) {
                      return value;
                    }
                    return item;
                  }),
                );
              }}
            >
              <Button hidden={props.readonly} type="link" size="small">
                修改
              </Button>
            </ContractOrderStyleModal>
            <Button hidden={props.readonly} type="link" size="small" danger>
              删除
            </Button>
          </Space>
        );
      },
    },
  ];
  useEffect(() => {
    setDataSource(props.value || []);
  }, [props.value]);
  function change(data: BusOrderStyleDemand[]) {
    setDataSource(data);
    props.onChange?.(data);
  }
  return (
    <ProTable
      rowKey="materialCode"
      search={false}
      columns={columns}
      dataSource={dataSource}
      size={'small'}
      toolBarRender={(action: ActionType | undefined) => {
        return props.readonly
          ? []
          : [
              <ContractOrderStyleModal
                key="create"
                node={{ type: 'create' }}
                title="新增订单款式"
                onFinish={(value) => {
                  change([...dataSource, value]);
                }}
              >
                <Button>新增订单款式</Button>
              </ContractOrderStyleModal>,
            ];
      }}
    />
  );
}
