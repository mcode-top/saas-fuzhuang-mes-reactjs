import type { BusManufactureWorkPriceTable } from '@/apis/business/order-manage/manufacture/typing';
import SelectWorkPrice from '@/pages/business/techology-manage/WorkPrice/components/SelectWorkPrice';
import SelectWorkPriceContent from '@/pages/business/techology-manage/WorkPrice/components/SelectWorkPriceContent';
import { jsonUniq } from '@/utils';
import type { FormListActionType } from '@ant-design/pro-form';
import { ProFormItem } from '@ant-design/pro-form';
import { ProFormGroup } from '@ant-design/pro-form';
import ProForm, { ProFormDependency, ProFormList, ProFormMoney } from '@ant-design/pro-form';
import { Alert, Empty, Table } from 'antd';
import { isEmpty } from 'lodash';
import React, { useState, useEffect } from 'react';

/**@name 工序工价可编辑列表 */
const EditWorkProcessWrokPriceList: React.FC<{
  readonly: boolean;
  name: string;
  label: string;
  key?: string;
}> = (props) => {
  const actionRef = React.useRef<FormListActionType>();
  if (props.readonly) {
    return (
      <ProFormGroup colProps={{ span: 24 }}>
        <ProFormItem name={props.name} label={props.label} key={props.key}>
          <WrokPriceAndWorkProcessReadonlyTable title={false} />
        </ProFormItem>
      </ProFormGroup>
    );
  }
  return (
    <>
      {props.readonly ? null : (
        <Alert
          type="warning"
          message="如果现有工价与系统不符可以设置变更工价,变更后续需要进入总经理审批"
        />
      )}
      <ProFormList
        creatorButtonProps={
          props.readonly
            ? false
            : {
                creatorButtonText: '设置工价表',
              }
        }
        name={props.name}
        label={props.label}
        key={props.key}
        actionRef={actionRef}
        initialValue={[{}]}
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
                  if (
                    jsonUniq(workProcessList, 'workProcessId').length !== workProcessList.length
                  ) {
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
    </>
  );
};

function WorkPriceProcessLinked(props: { workPriceId: number; readonly: boolean }) {
  const actionRef = React.useRef<FormListActionType>();
  return (
    <ProFormList
      name="workProcessWrokPrice"
      creatorRecord={{ workProcessId: undefined, price: 0, changePrice: undefined }}
      key={props.workPriceId}
      label="工序工价"
      initialValue={[{}]}
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
          <>
            <ProForm.Group key={'ProFormList' + props.workPriceId} labelLayout="inline">
              <SelectWorkPriceContent
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
          </>
        );
      }}
    </ProFormList>
  );
}

/**@name 工价工序只读表 */
export const WrokPriceAndWorkProcessReadonlyTable: React.FC<{
  value?: BusManufactureWorkPriceTable[];
  title?: string | boolean;
}> = (props) => {
  const [expandedKeys, setExpandeKeys] = useState<number[]>([]);
  useEffect(() => {
    setExpandeKeys(
      props.value?.map((item) => {
        return item.workPriceId;
      }) || [],
    );
  }, [props.value]);
  /**@name 展开的工序工价 */
  const expandedWorkProcessWrokPrice = (r: BusManufactureWorkPriceTable) => {
    return (
      <Table
        size="small"
        dataSource={r.workProcessWrokPrice}
        pagination={false}
        rowKey="workProcessId"
        columns={[
          {
            title: '工序',
            dataIndex: 'workProcessId',
            render(value, record, index) {
              return <SelectWorkPriceContent workPriceId={r.workPriceId} fieldProps={{ value }} />;
            },
          },
          {
            title: '工价',
            dataIndex: 'price',
          },
          {
            title: '变更工价',
            dataIndex: 'changePrice',
          },
        ]}
      />
    );
  };
  return !isEmpty(props.value) ? (
    <Table
      dataSource={props.value?.map((item) => {
        return {
          ...item,
          key: item.workPriceId,
        };
      })}
      size="small"
      rowKey="workPriceId"
      style={{ width: '100%', minWidth: 800 }}
      title={() => (props.title === props.title ? '' : props.title || '工序工价表')}
      pagination={false}
      className="not-margin-bottom-form-item"
      expandable={{
        expandedRowRender: expandedWorkProcessWrokPrice,
        defaultExpandAllRows: true,
        expandedRowKeys: expandedKeys,
        onExpandedRowsChange(inExpandedKeys) {
          setExpandeKeys(inExpandedKeys as number[]);
        },
      }}
      columns={[
        {
          title: '工价表',
          dataIndex: 'workPriceId',
          render(value, record, index) {
            return <SelectWorkPrice fieldProps={{ value }} />;
          },
        },
      ]}
    />
  ) : null;
};
export default EditWorkProcessWrokPriceList;
