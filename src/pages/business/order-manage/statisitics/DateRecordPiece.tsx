import { fetchDateStatisticsRecordPiece } from '@/apis/business/order-manage/statisitics';
import type {
  SalesStatisiticsContractType,
  SalesStatisiticsType,
  StatisiticsRecordPieceType,
} from '@/apis/business/order-manage/statisitics/typing';
import {
  Card,
  Row,
  Col,
  Spin,
  Form,
  Space,
  Button,
  DatePicker,
  Table,
  Tabs,
  message,
  Descriptions,
} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { isEmpty } from 'lodash';
import type { Moment } from 'moment';
import moment from 'moment';
import { useRef, useState } from 'react';
import { read, utils, writeFileXLSX } from 'xlsx';

const { RangePicker } = DatePicker;

/**
 * @name 按时间统计计件工资
 */
const StatisiticsDateRecordPiece: React.FC = () => {
  const [searchBody, setSearchBody] = useState<{
    loading: boolean;
    isRequest: boolean;
    /**@name 计件工资汇总 */
    list: any[];
    statisiticsInfo?: {
      /**@name 领料总数 */
      countMaterialNumber: number;
      /**@name 计件总数 */
      countRecordNumber: number;
      /**@name 总工资 */
      countWages: number;
      /**@name 统计时间 */
      statisiticsDate?: string;
      /**@name 统计数量 */
      length: number;
    };
  }>({
    // 是否显示加载中
    loading: false,
    // 是否已请求
    isRequest: false,
    list: [],
  });

  const [form] = Form.useForm();
  /**@name 当前查询的时间 */
  const currentQueryDate = useRef<string | null>(null);
  /**@name 当前查询的时间Moment形式 */
  const currentQueryMoment = useRef<Moment[] | null>(null);
  async function onSubmit(values) {
    setSearchBody({ loading: true, isRequest: true, list: [] });
    try {
      currentQueryDate.current = values.rangeDate
        .map((item) => item.format('YYYY_MM_DD'))
        .join('至');
      currentQueryMoment.current = values.rangeDate;
      const result = (
        await fetchDateStatisticsRecordPiece(values.rangeDate.map((item) => new Date(item)))
      ).data;
      const computedData = result.reduce(
        (p, n) => {
          p.countWages += n.countWages;
          p.countRecordNumber += n.countRecordNumber;
          p.countMaterialNumber += n.countMaterialNumber || 0;
          return p;
        },
        {
          countMaterialNumber: 0,
          countRecordNumber: 0,
          countWages: 0,
        },
      );
      setSearchBody({
        loading: false,
        isRequest: true,
        list: result,
        statisiticsInfo: {
          ...computedData,
          statisiticsDate: currentQueryDate.current || undefined,
          length: result.length,
        },
      });
    } catch (error) {
      currentQueryDate.current = null;
      setSearchBody({ loading: false, isRequest: true, list: [] });
    }
  }
  return (
    <Card title="统计整体计件数与工资" size="small">
      <Row gutter={[24, 24]} style={{ minWidth: 700, width: '100%', paddingLeft: 24 }}>
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
                      currentQueryDate.current && !isEmpty(searchBody.list)
                        ? exportListToExcel(currentQueryDate.current, searchBody.list)
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
        {searchBody.statisiticsInfo && (
          <Col span={24}>
            <Descriptions column={4} size="small">
              {[
                ['统计时间', 'statisiticsDate'],
                ['领料总数', 'countMaterialNumber'],
                ['计件总数', 'countRecordNumber'],
                ['统计数量', 'length'],
                ['总合计工资', 'countWages'],
              ].map((i) => (
                <Descriptions.Item label={i[0]} key={i[0]}>
                  {searchBody?.statisiticsInfo?.[i[1]]}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Col>
        )}
        <Col span={24}>
          {/* 搜索信息 */}
          {searchBody.isRequest ? (
            <RecordPieceStatisiticsTable
              list={searchBody.list}
              queryDate={currentQueryMoment.current as Moment[]}
            />
          ) : null}
        </Col>
      </Row>
    </Card>
  );
};
export default StatisiticsDateRecordPiece;

/**@name 统计计件工资表格列表 */
export const RecordPieceStatisiticsTable: React.FC<{
  list: StatisiticsRecordPieceType[];
  queryDate: Moment[];
}> = (props) => {
  const columns: ColumnsType<StatisiticsRecordPieceType> = [
    {
      title: '员工名称',
      dataIndex: 'worker.name',
      render(value, record, index) {
        return record.worker.name;
      },
    },
    {
      title: '所属部门',
      dataIndex: 'worker.dept',
      render(value, record, index) {
        return record.worker.dept.name;
      },
    },
    {
      title: '所属角色',
      dataIndex: 'worker.roleList',
      render(value, record, index) {
        return record.worker.roleList.map((i) => i.name).join(',');
      },
    },
    {
      title: '计件总数',
      dataIndex: 'countRecordNumber',
    },
    {
      title: '领料总数',
      dataIndex: 'countMaterialNumber',
    },
    {
      title: '计件金额',
      dataIndex: 'countWages',
    },
    {
      title: '查看明细',
      dataIndex: 'operation',
      render(value, record, index) {
        return (
          <Button
            onClick={() => {
              window.tabsAction.goBackTab(
                `/order-manage/statisitics/worker-date-record-piece?_systemTabName=${
                  record.worker.name
                }的计件工资统计单&userId=${record.worker.id}&${props.queryDate
                  .map((i) => 'rangeDate=' + i.format('YYYY-MM-DD'))
                  .join('&')}`,
              );
            }}
          >
            跳转至明细
          </Button>
        );
      },
    },
  ];
  return (
    <Table
      size="small"
      rowKey={(r) => r.worker.id}
      columns={columns}
      dataSource={props.list}
      pagination={{
        size: 'small',
        pageSize: 15,
      }}
    />
  );
};

function exportListToExcel(title: string, list: StatisiticsRecordPieceType[]) {
  const wb = utils.book_new();
  const contractDataSourceWB = [
    ['员工名称', '所属部门', '所属角色', '计件总数', '领料总数', '计件金额'],
    ...list.reduce<any[]>((p, n) => {
      p.push([
        n.worker.name,
        n.worker.dept.name,
        n.worker.roleList.map((i) => i.name).join(','),
        n.countRecordNumber,
        n.countMaterialNumber,
        n.countWages,
      ]);
      return p;
    }, []),
  ];
  utils.book_append_sheet(
    wb,
    {
      ['!cols']: [{ wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 18 }, { wch: 18 }, { wch: 20 }],
      ...utils.aoa_to_sheet(contractDataSourceWB),
    },
    '统计计件总工资表',
  );
  writeFileXLSX(wb, title + '统计计件总工资表.xlsx');
}
