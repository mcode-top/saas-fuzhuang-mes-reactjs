import SelectWorkPrice from '@/pages/business/techology-manage/WorkPrice/components/SelectWorkPrice';
import SelectWorkPriceContent from '@/pages/business/techology-manage/WorkPrice/components/SelectWorkPriceContent';
import { jsonUniq } from '@/utils';
import type { FormListActionType } from '@ant-design/pro-form';
import ProForm, { ProFormDependency, ProFormList, ProFormMoney } from '@ant-design/pro-form';
import { Alert } from 'antd';
import React, { useState } from 'react';

/**@name 工序工价可编辑列表 */
const EditWorkProcessWrokPriceList: React.FC<{
  readonly: boolean;
  name: string;
  label: string;
  key?: string;
}> = (props) => {
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
      name={props.name}
      label={props.label}
      key={props.key}
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
};

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

export default EditWorkProcessWrokPriceList;
