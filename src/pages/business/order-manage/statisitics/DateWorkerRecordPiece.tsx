import type { BusOrderRecordPieceLog } from '@/apis/business/order-manage/record-piece/typing';
import {
  fetchDateStatisiticsWorkerRecordPiece,
  fetchDateStatisticsRecordPiece,
} from '@/apis/business/order-manage/statisitics';
import type {
  SalesStatisiticsContractType,
  SalesStatisiticsType,
  StatisiticsRecordPieceType,
} from '@/apis/business/order-manage/statisitics/typing';
import type { UserListItem } from '@/apis/person/typings';
import type { UserInfo } from '@/apis/user/typings';
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
  Select,
  Descriptions,
} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'umi';
import BusSelectUser from '../components/SelectUser';
import Excel from 'exceljs';
import { browersArrayBufferDownload } from '@/utils/upload/upload';
const { RangePicker } = DatePicker;
type StatisiticsInfo = {
  userName: string;
  deptName?: string;
  roleListName?: string;
  /**@name 统计时间 */
  statisiticsDate?: string;
  /**@name 领料总数 */
  countMaterialNumber: number;
  /**@name 计件总数 */
  countRecordNumber: number;
  /**@name 总工资 */
  countWages: number;
};
/**
 * @name 按时间去统计员工计件工资
 */
const StatisiticsDateWorkerRecordPiece: React.FC = () => {
  const [searchBody, setSearchBody] = useState<{
    loading: boolean;
    isRequest: boolean;
    /**@name 员工计件工资汇总 */
    list: BusOrderRecordPieceLog[];
    worker: UserListItem | null;
    statisiticsInfo?: StatisiticsInfo;
  }>({
    // 是否显示加载中
    loading: false,
    // 是否已请求
    isRequest: false,
    list: [],
    worker: null,
  });
  const [form] = Form.useForm();
  const location = useLocation();
  const query = (location as any).query;
  useEffect(() => {
    if (query.userId && query.rangeDate) {
      const values = {
        userId: Number(query.userId),
        rangeDate: query.rangeDate.map((i) => moment(i)),
      };
      console.log(values);

      form.setFieldsValue(values);
      onSubmit(values);
    }
  }, [form]);
  /**@name 当前查询的时间 */
  const currentQueryDate = useRef<string | null>(null);
  async function onSubmit(values) {
    setSearchBody({ loading: true, isRequest: false, list: [], worker: null });
    try {
      currentQueryDate.current = values.rangeDate
        .map((item) => item.format('YYYY_MM_DD'))
        .join('至');
      const result = (
        await fetchDateStatisiticsWorkerRecordPiece(
          values.userId,
          values.rangeDate.map((item) => new Date(item)),
        )
      ).data;
      const computedData = result.workerLogList.reduce(
        (p, n) => {
          p.countWages += n.number * n.price;
          p.countRecordNumber += n.number;
          p.countMaterialNumber += n.materialNumber || 0;
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
        list: result.workerLogList,
        worker: result.worker,
        statisiticsInfo: {
          userName: result.worker.name,
          deptName: result.worker?.dept?.name,
          roleListName: result.worker.roleList?.map((item) => item.name)?.join(','),
          statisiticsDate: currentQueryDate.current || undefined,
          ...computedData,
        },
      });
    } catch (error) {
      currentQueryDate.current = null;
      setSearchBody({ loading: false, isRequest: true, list: [], worker: null });
    }
  }
  return (
    <Card title="统计单个员工计件数与工资" size="small">
      <Row gutter={[24, 24]} style={{ minWidth: 700, width: '100%', paddingLeft: 24 }}>
        <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
          <Spin spinning={searchBody.loading}>
            {/* 搜索栏 */}
            <Form layout="inline" form={form} onFinish={onSubmit}>
              <BusSelectUser
                fieldProps={{ style: { width: 200 } }}
                rules={[{ required: true }]}
                label="选择员工"
                name="userId"
              />
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
                      currentQueryDate.current &&
                      searchBody.statisiticsInfo &&
                      !isEmpty(searchBody.list)
                        ? exportListToExcel(
                            currentQueryDate.current +
                              searchBody.statisiticsInfo.userName +
                              '计件数与工资.xlsx',
                            searchBody.statisiticsInfo,
                            searchBody.list,
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
        {searchBody.statisiticsInfo && (
          <Col span={24}>
            <SingleWorkerInfoDescriptions data={searchBody.statisiticsInfo} />
          </Col>
        )}
        <Col span={24}>
          {/* 搜索信息 */}
          {searchBody.isRequest ? (
            <WorkerRecordPieceStatisiticsTable list={searchBody.list} />
          ) : null}
        </Col>
      </Row>
    </Card>
  );
};
export default StatisiticsDateWorkerRecordPiece;

/**@name 统计单个员工数据 */
export const SingleWorkerInfoDescriptions: React.FC<{
  data: StatisiticsInfo;
}> = (props) => {
  const columns = [
    ['员工名称', 'userName'],
    ['所属部门', 'deptName'],
    ['所属角色', 'roleListName'],
    ['统计时间', 'statisiticsDate'],
    ['领料总数', 'countMaterialNumber'],
    ['计件总数', 'countRecordNumber'],
    ['总合计工资', 'countWages'],
  ];
  return (
    <Descriptions size="small">
      {columns.map((i) => (
        <Descriptions.Item key={i[1]} label={i[0]} span={1}>
          {props.data[i[1]]}
        </Descriptions.Item>
      ))}
    </Descriptions>
  );
};

/**@name 统计员工计件工资表格列表 */
export const WorkerRecordPieceStatisiticsTable: React.FC<{
  list: BusOrderRecordPieceLog[];
}> = (props) => {
  const columns: ColumnsType<BusOrderRecordPieceLog> = [
    {
      title: '记录时间',
      dataIndex: 'createdAt',
    },
    {
      title: '订单号',
      dataIndex: 'contractNumber',
      render(value, record, index) {
        return record.recordPiece?.manufacture?.contractNumber;
      },
    },
    {
      title: '产品物料编码',
      dataIndex: 'materialCode',
      render(value, record, index) {
        return record.recordPiece?.manufacture?.materialCode;
      },
    },
    {
      title: '工序',
      dataIndex: 'workProcess.name',
      render(value, record, index) {
        return record?.workProcess?.name;
      },
    },
    {
      title: '数量',
      dataIndex: 'number',
    },
    {
      title: '领料数量',
      dataIndex: 'materialNumber',
    },
    {
      title: '工价',
      dataIndex: 'price',
    },
    {
      title: '合计',
      dataIndex: 'countPrice',
      render(value, record, index) {
        return Number((record.number * record.price).toFixed(5));
      },
    },
    {
      title: '计件员',
      dataIndex: 'operator',
      render(value, record, index) {
        return record.operator?.name;
      },
    },
  ];
  return (
    <Table
      size="small"
      rowKey={'id'}
      columns={columns}
      dataSource={props.list}
      pagination={{ size: 'small', pageSize: 15 }}
    />
  );
};

function exportListToExcel(title: string, info: StatisiticsInfo, list: BusOrderRecordPieceLog[]) {
  // 导入员工模板
  return fetch('/worker_template.xlsx', {
    method: 'GET',
  }).then(async (r) => {
    const buf = await r.arrayBuffer();
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(buf);
    // 加载工作薄
    const ws = workbook.getWorksheet(1);

    ws.name = '统计员工数据';
    /**@name 获取要生成的列样式 */
    const cellstyle = ws.getRow(8).getCell(1).style;
    /**@name 工作薄详情位置与字段 */
    const infoColumns = [
      ['userName', 3, 2],
      ['deptName', 3, 5],
      ['roleListName', 3, 8],
      ['statisiticsDate', 4, 2],
      ['countMaterialNumber', 4, 5],
      ['countRecordNumber', 4, 8],
      ['countWages', 5, 2],
    ];
    // step1:填表
    infoColumns.forEach((i) => {
      ws.getRow(i[1] as number).getCell(i[2]).value = info[i[0]];
    });
    /**@name 初始行索引 */
    const initRowIndex = 8;
    // step2:插入数据
    list.forEach((item, index) => {
      const addRowIndex = initRowIndex + index;
      ws.insertRow(
        addRowIndex,
        [
          index + 1,
          item.createdAt,
          item.recordPiece?.manufacture?.contractNumber,
          item.recordPiece?.manufacture?.materialCode,
          item.workProcess?.name,
          item.number,
          item.materialNumber,
          item.price,
          Number((item.number * item.price).toFixed(5)),
        ],
        'i+',
      );
    });
    // 下载
    return workbook.xlsx.writeBuffer().then((buffer) => {
      browersArrayBufferDownload(title, buffer);
    });
  });
}
