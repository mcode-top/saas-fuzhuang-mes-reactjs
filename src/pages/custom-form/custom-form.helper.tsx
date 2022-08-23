import { fetchCustomTableList } from '@/apis/custom-form/custom-form';
import type { CustomFormTableType, CustomTableDataItem } from '@/apis/custom-form/typings';
import { COM_PRO_TABLE_TIME } from '@/configs/index.config';
import { SettingOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import { Button, Dropdown, Menu } from 'antd';
import { get as loadsh_get } from 'lodash';

/**
 * 将自定义表的字段转换为andT的列
 */
export function CustomTableColumnToAntDColumns(
  columns: CustomFormTableType[],
): ProColumns<CustomTableDataItem>[] {
  const convertColumns = columns.map((col) => {
    return {
      ...col,
      title: col.title,
      dataIndex: col.field,
      key: col.field,
      renderText: (text, record, index) => {
        const value = record.result[col.field];
        if (col.array) {
          return value.join(',');
        }
        return value;
      },
      ...col.viewColumn,
    };
  });
  return [
    ...convertColumns,
    ...(window.document.body.clientWidth > 1600 ? COM_PRO_TABLE_TIME.updatedAt : []),
    ...COM_PRO_TABLE_TIME.createdAt,
    {
      fixed: 'right',
      key: 'operator',
      hideInSearch: true,
      title: '操作',
      render: (dom, record, index) => {
        return (
          <Dropdown
            key="Dropdown"
            trigger={['click']}
            overlay={
              <Menu key="menu">
                <Menu.Item key="info">查看详情</Menu.Item>
                <Menu.Item key="modified">修改数据</Menu.Item>
              </Menu>
            }
          >
            <Button icon={<SettingOutlined />} type="link">
              更多操作
            </Button>
          </Dropdown>
        );
      },
    },
  ];
}

/**@name 关联自定义表查询获取select */
export function relationCustomTableSelectList(
  searchValue: string,
  options: {
    /**@name 关联表格 */
    businessKey: string;
    /**@name 显示字段 */
    labelField: string;
    /**@name 搜索字段默认与labelField保持一致 */
    searchField?: string;
    /**@name 是否为内部字段,默认false,如果是false则在data->labelField中查找否则在外部查找 */
    labelInner?: boolean;
    /**@name 默认为 id 支持 xxx.xxx */
    valueField?: string;
  },
) {
  let queryKeyType = 'dataParam';
  if (options.labelInner === true) {
    queryKeyType = 'basicParam';
  }
  console.log(options);

  return fetchCustomTableList(options.businessKey, {
    page: 1,
    limit: 30,
    [queryKeyType]: {
      query: {
        [options?.searchField || options.labelField]: searchValue,
      },
    },
  })
    .then((res) => {
      return res.data.items.map((item) => {
        return {
          label: loadsh_get(item, `data.${options.labelField}`),
          value: loadsh_get(item, options.valueField || 'id'),
        };
      });
    })
    .then((res) => {
      console.log(res);
      return res;
    });
}
