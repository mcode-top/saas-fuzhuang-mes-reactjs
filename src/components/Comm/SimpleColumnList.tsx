import type { RequestData } from '@ant-design/pro-table';
import type { TableColumnsType, TablePaginationConfig, TableProps } from 'antd';
import { Table } from 'antd';
import { isEmpty } from 'lodash';
import React, { useImperativeHandle } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
type SelectKey = string | number;
export type SimpleColumnListProps<T> = {
  request?: (params: { pageSize?: number; current?: number }) => Promise<Partial<RequestData<T>>>;
  pagination?: TablePaginationConfig;
  tableProps?: TableProps<T>;
  selectKey?: SelectKey;
  rowKey: string;
  columns: TableColumnsType<T>;
  icon?: React.ReactNode | JSX.Element;
  onChange?: (key: SelectKey, record: T) => Promise<void> | void;
  /**@name 过滤（不包含接口过滤）TODO:未完成 */
  filter?: { filterData: (record: T, index: number) => boolean; filterValue: any };
};
export type SimpleColumnListRef = {
  reload: () => any;
  reset: () => any;
};
/**@name 简单列表 */
function SimpleColumnList<T extends {}>(
  props: SimpleColumnListProps<T>,
  ref: React.Ref<SimpleColumnListRef>,
) {
  const [paginationParam, setPaginationParam] = useState<{
    pageSize?: number;
    current?: number;
    total?: number;
  }>({});
  const [currentSelectKey, setCurrentSelectKey] = useState<string | number>();
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setPaginationParam({
      current: props?.pagination?.current || 1,
      pageSize: props?.pagination?.pageSize || 10,
    });
    getDataSource();
  }, []);

  useEffect(() => {
    setCurrentSelectKey(props.selectKey);
  }, [props.selectKey]);

  useEffect(() => {
    setCurrentSelectKey(props.selectKey);
  }, [props.selectKey]);

  /**@name Ref实例 */
  useImperativeHandle(ref, () => ({
    reload: () => {
      getDataSource();
    },
    reset: () => {
      setPaginationParam({
        current: props?.pagination?.current || 1,
        pageSize: props?.pagination?.pageSize || 10,
      });
      getDataSource();
    },
  }));
  /**@name 获取数据 */
  function getDataSource() {
    if (props.request) {
      setLoading(true);
      props
        .request({ ...paginationParam })
        .then((res) => {
          if (!isEmpty(res.data)) {
            filterAndDataSource(res.data as T[]);

            setPaginationParam({ ...paginationParam, total: res.total });
          }
          return res;
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      filterAndDataSource((props.tableProps?.dataSource || []) as T[]);
    }
  }
  /**@name 过滤数据 TODO:未完成 */
  function filterAndDataSource(data: T[]) {
    setDataSource(
      data.filter((i, number) => {
        if (props.filter) {
          return props?.filter.filterData(i, number);
        } else {
          return true;
        }
      }),
    );
  }
  function onChangeSelectKey(key: SelectKey, record) {
    setCurrentSelectKey(key);
    props?.onChange?.(key, record);
  }
  return (
    <Table<T>
      {...(props.tableProps || {})}
      columns={props.columns}
      showHeader={false}
      bordered={false}
      loading={loading}
      rowKey={props.rowKey}
      pagination={{
        ...(props?.pagination || {}),
        pageSize: paginationParam.pageSize,
        current: paginationParam.current,
        total: paginationParam.total || dataSource.length,
        position: ['bottomCenter'],
        onChange: (page: number, pageSize: number) => {
          setPaginationParam({ current: page, pageSize });
          getDataSource();
          props.pagination?.onChange?.(page, pageSize);
        },
      }}
      dataSource={dataSource}
      rowSelection={{
        selections: true,
        renderCell: () => props?.icon || null,
        selectedRowKeys: [currentSelectKey] as any,
      }}
      onRow={(record, index) => {
        const onRow = props.tableProps?.onRow?.(record, index);
        return {
          ...onRow,
          onClick: (event) => {
            const rowSelectKey = record[props.rowKey];
            onChangeSelectKey(rowSelectKey, record);
            onRow?.onClick?.(event);
          },
        };
      }}
    />
  );
}
export default React.forwardRef(SimpleColumnList);
