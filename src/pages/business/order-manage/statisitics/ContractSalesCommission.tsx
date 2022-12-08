import { fetchDateStatisiticsContractSalesCommission } from '@/apis/business/order-manage/statisitics';
import type {
  SalesStatisiticsContractType,
  SalesStatisiticsType,
} from '@/apis/business/order-manage/statisitics/typing';
import { Card, Row, Col, Spin, Form, Space, Button, DatePicker, Table, Tabs, message } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useRef, useState } from 'react';
import { read, utils, writeFileXLSX } from 'xlsx';

const { RangePicker } = DatePicker;

/**
 * @name 统计合同单销售额
 */
const ContractSalesCommission: React.FC = () => {
  const [searchBody, setSearchBody] = useState<{
    loading: boolean;
    isRequest: boolean;
    /**@name 销售员合计数据 */
    salesList: SalesStatisiticsType[];
    /**@name 合同单数据 */
    contractList: SalesStatisiticsContractType[];
  }>({
    // 是否显示加载中
    loading: false,
    // 是否已请求
    isRequest: false,
    salesList: [],
    contractList: [],
  });
  /**@name 当前查询的时间 */
  const currentQueryDate = useRef<string | null>(null);
  const [form] = Form.useForm();
  async function onSubmit(values) {
    setSearchBody({ loading: true, isRequest: true, salesList: [], contractList: [] });
    currentQueryDate.current = values.rangeDate.map((item) => item.format('YYYY_MM_DD')).join('至');
    try {
      const result = (
        await fetchDateStatisiticsContractSalesCommission(
          values.rangeDate.map((item) => new Date(item)),
        )
      ).data;
      setSearchBody({
        loading: false,
        isRequest: true,
        salesList: result.salesCommissionDateSource,
        contractList: result.contractDataSource,
      });
    } catch (error) {
      currentQueryDate.current = null;
      setSearchBody({ loading: false, isRequest: true, salesList: [], contractList: [] });
    }
  }
  return (
    <Card title="统计合同单的销售数据" size="small">
      <Row gutter={[24, 24]} style={{ minWidth: 700, width: '100%' }}>
        <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
          <Spin spinning={searchBody.loading}>
            {/* 搜索栏 */}
            <Form layout="inline" form={form} onFinish={onSubmit}>
              <Form.Item rules={[{ required: true }]} label="查询时间" name="rangeDate">
                <RangePicker picker="date" placeholder={['开始时间', '结束时间']} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button
                    htmlType="button"
                    onClick={() => {
                      form.resetFields();
                    }}
                  >
                    重置
                  </Button>
                  <Button
                    onClick={() =>
                      currentQueryDate.current && !isEmpty(searchBody.salesList)
                        ? exportListToExcel(
                            currentQueryDate.current,
                            searchBody.contractList,
                            searchBody.salesList,
                          )
                        : message.warning('当前无数据,无法导出!')
                    }
                  >
                    导出表格
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Spin>
        </Col>
        <Col span={24}>
          {/* 搜索信息 */}
          {searchBody.isRequest ? (
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="合同单的销售数据列表" key="1">
                <ContractSalesStatisiticsTable list={searchBody.contractList} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="销售员的总提成" key="2">
                <SalesCommissionStatisiticsTable list={searchBody.salesList} />
              </Tabs.TabPane>
            </Tabs>
          ) : null}
        </Col>
      </Row>
    </Card>
  );
};
export default ContractSalesCommission;

/**@name 合同单的销售数据列表 */
export const ContractSalesStatisiticsTable: React.FC<{
  list: SalesStatisiticsContractType[];
}> = (props) => {
  const columns: ColumnsType<SalesStatisiticsContractType> = [
    {
      title: '合同号',
      dataIndex: 'contractNumber',
    },
    {
      title: '销售员',
      dataIndex: 'salesmanName',
    },
    {
      title: '销售额',
      dataIndex: 'salesVolume',
    },
    {
      title: '销售数量',
      dataIndex: 'salesTotal',
    },
    {
      title: '销售比率(%)',
      dataIndex: 'salesProportion',
    },
    {
      title: '销售提成',
      dataIndex: 'salesCommission',
    },
    {
      title: '合同完成时间',
      dataIndex: 'completeDate',
    },
    {
      title: '是否收款完成',
      dataIndex: 'isCollectionDone',
      render(v) {
        return v ? '是' : '否';
      },
    },
  ];
  return (
    <Table
      size="small"
      rowKey="contractNumber"
      columns={columns}
      dataSource={props.list}
      pagination={{ size: 'small', pageSize: 15 }}
    />
  );
};

/**@name 销售员的总提成 */
export const SalesCommissionStatisiticsTable: React.FC<{
  list: SalesStatisiticsType[];
}> = (props) => {
  const columns: ColumnsType<SalesStatisiticsType> = [
    {
      title: '销售员',
      dataIndex: 'salesmanName',
    },
    {
      title: '总销售额',
      dataIndex: 'salesVolume',
    },
    {
      title: '总销售数量',
      dataIndex: 'salesTotal',
    },
    {
      title: '总销售提成',
      dataIndex: 'salesCommission',
    },
  ];
  return (
    <Table
      size="small"
      rowKey="salesmanName"
      columns={columns}
      dataSource={props.list}
      pagination={{ size: 'small', pageSize: 15 }}
    />
  );
};

function exportListToExcel(
  filename: string,
  contractList: SalesStatisiticsContractType[],
  salesList: SalesStatisiticsType[],
) {
  const wb = utils.book_new();
  const contractDataSourceWB = [
    [
      '合同号',
      '销售员',
      '销售额',
      '销售数量',
      '销售比率 (%)',
      '销售提成',
      '合同完成时间',
      '是否收款完成',
    ],
    ...contractList.reduce<any[]>((p, n) => {
      p.push([
        n.contractNumber,
        n.salesmanName,
        n.salesVolume,
        n.salesTotal,
        n.salesProportion,
        n.salesCommission,
        n.completeDate,
        n.isCollectionDone ? '是' : '否',
      ]);
      return p;
    }, []),
  ];
  const salesmanTotalDataSourceWB = [
    ['销售员', '总销售额', '总销售数量', '总销售提成'],
    ...salesList.reduce<any[]>((p, n) => {
      p.push([n.salesmanName, n.salesVolume, n.salesTotal, n.salesCommission]);
      return p;
    }, []),
  ];
  utils.book_append_sheet(
    wb,
    {
      ['!cols']: [
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 15 },
        { wch: 20 },
        { wch: 22 },
        { wch: 22 },
      ],
      ...utils.aoa_to_sheet(contractDataSourceWB),
    },
    '合同单的销售数据列表',
  );
  utils.book_append_sheet(
    wb,
    {
      ['!cols']: [{ wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }],
      ...utils.aoa_to_sheet(salesmanTotalDataSourceWB),
    },
    '销售员的总提成',
  );
  writeFileXLSX(wb, filename + '销售数据.xlsx');
}
