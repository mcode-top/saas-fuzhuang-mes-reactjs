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
import { fetchReadManufacture } from '@/apis/business/order-manage/manufacture';
import type { BusOrderManufacture } from '@/apis/business/order-manage/manufacture/typing';
import { DraftsModal, saveDrafts } from '@/components/Comm/Drafts';
import SelectUploadFile from '@/components/Comm/FormlyComponents/Upload';
import LoadingButton from '@/components/Comm/LoadingButton';
import { dictValueEnum, OrderContractTypeValueEnum } from '@/configs/commValueEnum';
import SelectTreeSizeTemplate from '@/pages/business/techology-manage/SizeTemplate/components/SelectTreeSizeTemplate';
import { ReloadOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
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
import { Button, Card, Descriptions, Input, message, Modal, Space, Table } from 'antd';
import { isEmpty, omit } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useModel, useParams } from 'umi';
import useSwitchTabs from 'use-switch-tabs';
import BusSelectCustomerAddress from '../../components/SelectCustomerAddress';
import BusSelectCustomerCompany from '../../components/SelectCustomerCompany';
import BusSelectCustomerContacter from '../../components/SelectCustomerContacter';
import BusSelectUser from '../../components/SelectUser';
import type { ManufactureLocationQuery } from '../typing';
import ContractOrderStyleModal from './ContractOrderStyleModal';

/**@name 生产单详情 */
const OrderContractInfo: React.FC = () => {
  const [contractLoading, setContractLoading] = useState(false);
  const [data, setData] = useState<BusOrderManufacture>();
  const [readonly, setReadonly] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const formRef = React.useRef<ProFormInstance>();
  const location = useLocation();
  const query = (location as any).query as ManufactureLocationQuery;
  useEffect(() => {
    console.log('====================================');
    console.log(query.id);
    console.log('====================================');
    setManufactureValues(Number(query.id));
  }, []);
  /**@name 设置合同数据 */
  function setManufactureValues(id: number) {
    return fetchReadManufacture(id).then((res) => {
      formRef.current?.setFieldsValue(res.data);
      setData(res.data);
    });
  }
  /**@name 新增生产单 */
  async function createContract(data: BusOrderContract) {
    await fetchCreateContract(data);
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
      {data ? (
        <>
          <Descriptions>
            <Descriptions.Item label="合同号">{data?.contractNumber}</Descriptions.Item>
            <Descriptions.Item label="订单类型">
              {dictValueEnum(OrderContractTypeValueEnum.Style, data?.styleDemand.styleType)}
            </Descriptions.Item>
            <Descriptions.Item label="物料编码(型号)">
              {data?.styleDemand.materialCode}
            </Descriptions.Item>
            <Descriptions.Item label="产品名称(款式)">{data?.styleDemand.style}</Descriptions.Item>
            <Descriptions.Item label="颜色">{data?.styleDemand.color}</Descriptions.Item>
            <Descriptions.Item label="面料">{data?.styleDemand.shellFabric}</Descriptions.Item>
            <Descriptions.Item label="商标">{data?.styleDemand.商标}</Descriptions.Item>
            <Descriptions.Item label="口袋">{data?.styleDemand.口袋}</Descriptions.Item>
            <Descriptions.Item label="领号">{data?.styleDemand.领号}</Descriptions.Item>
            <Descriptions.Item label="领子颜色">{data?.styleDemand.领子颜色}</Descriptions.Item>
            <Descriptions.Item label="后备扣">{data?.styleDemand.后备扣}</Descriptions.Item>
            <Descriptions.Item label="领部缝纫工艺">
              {data?.styleDemand.领部缝纫工艺}
            </Descriptions.Item>
            <Descriptions.Item label="门襟工艺">{data?.styleDemand.门襟工艺}</Descriptions.Item>
            <Descriptions.Item label="袖口工艺">{data?.styleDemand.袖口工艺}</Descriptions.Item>
            <Descriptions.Item label="下摆工艺">{data?.styleDemand.下摆工艺}</Descriptions.Item>
            <Descriptions.Item label="纽扣工艺">{data?.styleDemand.纽扣工艺}</Descriptions.Item>
            <Descriptions.Item label="logo生产流程">
              {data?.styleDemand.logo生产流程}
            </Descriptions.Item>
            <Descriptions.Item label="logo工艺位置" span={2}>
              {data?.styleDemand.logo工艺位置}
            </Descriptions.Item>
          </Descriptions>
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
            dataSource={data?.styleDemand.sizePriceNumber}
            title={() => '尺码数量价格表'}
          />
          <div style={{ width: '100%' }}>
            <SelectUploadFile
              multiple
              accpet="image/*"
              readonly={true}
              description="logo效果图"
              value={data?.styleDemand.logo效果图}
              imageProps={{
                showImage: true,
                imageColumn: 3,
                imageSize: 192,
              }}
            />
          </div>
        </>
      ) : null}
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
          <ProFormDatePicker
            readonly={readonly}
            rules={[{ required: true }]}
            label="交期时间"
            width="sm"
            name="deliverDate"
          />
        </ProForm.Group>
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
