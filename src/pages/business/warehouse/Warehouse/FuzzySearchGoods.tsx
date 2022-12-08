import { fetchFuzzyFindAllWarehouseInGoods } from '@/apis/business/warehouse';
import type { BusWarehouseGoodsType } from '@/apis/business/warehouse/typing';
import { Button, Card, Col, Empty, Form, Input, Row, Space, Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useState } from 'react';
import { read, utils, writeFileXLSX } from 'xlsx';
import { BusMaterialTypeEnum } from '../../techology-manage/Material/typing';
import GoodsOutInLogModal from '../Log/GoodsOutInLogModal';

/**
 * @name 模糊查询全仓库货品信息
 */
const WarehouseFuzzySearchGoodsList: React.FC = () => {
  const [searchBody, setSearchBody] = useState<{
    loading: boolean;
    isRequest: boolean;
    list: BusWarehouseGoodsType[];
  }>({
    // 是否显示加载中
    loading: false,
    // 是否已请求
    isRequest: false,
    list: [],
  });
  const [form] = Form.useForm();
  async function onSubmit(values) {
    setSearchBody({ loading: true, isRequest: true, list: [] });
    try {
      const list = (await fetchFuzzyFindAllWarehouseInGoods(values)).data;
      setSearchBody({ loading: false, isRequest: true, list: list });
    } catch (error) {
      setSearchBody({ loading: false, isRequest: true, list: [] });
    }
  }
  return (
    <Card title="查询全仓库货品信息" size="small">
      <Row gutter={[24, 24]} style={{ minWidth: 700, width: '100%' }}>
        <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
          <Spin spinning={searchBody.loading}>
            {/* 搜索栏 */}
            <Form layout="inline" form={form} onFinish={onSubmit}>
              <Form.Item rules={[{ required: true }]} label="查询模糊物料信息" name="searchText">
                <Input style={{ width: 400 }} />
              </Form.Item>
              <Form.Item label="尺码" name="size">
                <Input style={{ width: 150 }} />
              </Form.Item>
              <Form.Item label="颜色" name="color">
                <Input style={{ width: 150 }} />
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
                  <Button onClick={() => exportListToExcel(searchBody.list)}>导出表格</Button>
                </Space>
              </Form.Item>
            </Form>
          </Spin>
        </Col>
        <Col span={24}>
          {/* 搜索信息 */}
          {searchBody.isRequest ? <WarehouseSearchGoodsTable list={searchBody.list} /> : null}
        </Col>
      </Row>
    </Card>
  );
};

/**@name 查询搜索内容 */
export const WarehouseSearchGoodsTable: React.FC<{
  list: BusWarehouseGoodsType[];
}> = (props) => {
  const columns: ColumnsType<BusWarehouseGoodsType> = [
    {
      title: '物料信息',
      dataIndex: 'materialInfo',
      render(value, record, index) {
        return `${record.material?.code}(${record.material?.name})`;
      },
    },
    {
      title: '尺码信息',
      dataIndex: 'sizeInfo',
      render(value, record, index) {
        return record.size ? `${record.size?.name}(${record.size?.specification})` : '---';
      },
    },
    {
      title: '颜色',
      dataIndex: 'color',
    },
    {
      title: '仓库信息',
      dataIndex: 'warehouseInfo',
      render(value, record, index) {
        return record.shelf
          ? `${record.shelf?.warehouse?.name || '仓库不存在'}/${record.shelf?.name})`
          : '---';
      },
    },
    {
      title: '库存数量',
      dataIndex: 'quantity',
    },
    {
      title: '是否是成衣',
      dataIndex: 'record.material.type',
      render(value, record, index) {
        return `${record.material?.type === BusMaterialTypeEnum.Material ? '否' : '是'}`;
      },
    },
    {
      title: '备注信息',
      dataIndex: 'remark',
      width: 200,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render(v, record) {
        return (
          <GoodsOutInLogModal
            warehouseName={record.shelf?.warehouse?.name as string}
            value={record}
          >
            <a>查看出入库记录</a>
          </GoodsOutInLogModal>
        );
      },
    },
  ];
  return (
    <Table
      size="small"
      rowKey={(data) => `${data.materialCode}_${data.sizeId}_${data.shelfId}_${data.color}`}
      columns={columns}
      dataSource={props.list}
      pagination={{ size: 'small', pageSize: 15 }}
    />
  );
};
export default WarehouseFuzzySearchGoodsList;
/**@name 将列表导出为Excel */
function exportListToExcel(list: BusWarehouseGoodsType[]) {
  const ws = utils.json_to_sheet(
    list.map((record) => {
      return {
        物料信息: `${record.material?.code}(${record.material?.name})`,
        尺码信息: record.size ? `${record.size?.name}(${record.size?.specification})` : '',
        仓库信息: record.shelf
          ? `${record.shelf?.warehouse?.name || '仓库不存在'}/${record.shelf?.name})`
          : '---',
        颜色: record.color || '',
        库存数量: `${record.quantity}`,
        是否是成衣: `${record.material?.type === BusMaterialTypeEnum.Material ? '否' : '是'}`,
        备注信息: record.remark || '',
      };
    }),
  );
  const wb = utils.book_new();
  ws['!cols'] = [
    { wch: 25 },
    { wch: 20 },
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 25 },
  ];
  utils.book_append_sheet(wb, ws, '查询搜索内容');
  writeFileXLSX(wb, moment().format('YYYYMMDDHHmmss') + '查询搜索内容.xlsx');
}
