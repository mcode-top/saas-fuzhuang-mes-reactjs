import type { FormListActionType, ProFormInstance } from '@ant-design/pro-form';
import { ProFormDependency } from '@ant-design/pro-form';
import { ProFormGroup, ProFormSelect } from '@ant-design/pro-form';
import { ProFormList } from '@ant-design/pro-form';
import { ProFormDigit } from '@ant-design/pro-form';
import { ModalForm } from '@ant-design/pro-form';

import React, { useRef, useEffect, useState } from 'react';

import type { BusWarehousePutOutGoodsDto } from '@/apis/business/warehouse/typing';
import { message, Spin } from 'antd';
import BusSelectWorkStaff from '@/pages/business/techology-manage/WorkProcess/components/WorkProcessSelectStaff';
import type { BusRecordPieceStaffAndWorkProcess } from '@/apis/business/order-manage/record-piece/typing';
import {
  fetchManufactureIdToOneRecordPiece,
  fetchRecordPieceAdd,
} from '@/apis/business/order-manage/record-piece';
import type { LabelValue } from '@/components/typing';
import { fetchWorkProcessWorkPiriceList } from '@/apis/business/order-manage/manufacture';
import storageDataSource from '@/utils/storage';
import { STORAGE_WORK_PROCESS_LIST } from '@/configs/storage.config';
import BusSelectUser from '../../components/SelectUser';
import RecordPieceLogModal from './RecordPieceLogModal';
type BusRecordPieceStaffAndWorkProcessForm = BusRecordPieceStaffAndWorkProcess & {
  readonly?: boolean;
  readonlyTotal?: number;
  readonlymaterialNumber?: number;
};
/**@name 货品出库对话框 */
const RecordPieceAddModal: React.FC<{
  value: { manufactureId: number };
  type: 'watch' | 'add';
  title: string;
  onFinish?: (value: BusWarehousePutOutGoodsDto) => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const formListRef = useRef<FormListActionType>();
  const [loading, setLoading] = useState(false);
  const [recordPieceId, setRecordPieceId] = useState<number | undefined>(undefined);
  /**@name 原始计件单列表 */
  const [list, setList] = useState<BusRecordPieceStaffAndWorkProcessForm[]>([]);
  /**@name 可选工序列表 */
  const [filterWorkProcessList, setFilterWorkProcessList] = useState<LabelValue[]>([]);
  useEffect(() => {
    if (props.value.manufactureId) {
      setLoading(true);

      fetchWorkProcessWorkPiriceList(props.value.manufactureId)
        .then(async (res) => {
          const allWorkProcess = (
            await storageDataSource.getValue(STORAGE_WORK_PROCESS_LIST, false)
          ).serachRecord;
          setFilterWorkProcessList(
            res.data.map((i) => {
              return {
                label: allWorkProcess[i.workProcessId],
                value: i.workProcessId,
              };
            }),
          );
        })
        .finally(() => setLoading(false));
    }
  }, [props.value.manufactureId]);
  useEffect(() => {
    const curList = formListRef.current?.getList?.();
    console.log(
      curList,
      Array(curList?.length || 0)
        .fill({})
        .map((item, index) => index),
    );
    const allIndex = Array(curList?.length || 0)
      .fill({})
      .map((item, index) => index);
    formListRef.current?.remove(allIndex);
    list.forEach((i) => formListRef.current?.add(i));
  }, [list]);
  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (props.type === 'add') {
        try {
          const value = await formRef.current?.validateFields();
          await fetchRecordPieceAdd({ ...value, manufactureId: props.value.manufactureId });
          message.success('计件单新增成功');
          props?.onFinish?.(value);
          return resolve(true);
        } catch (error) {
          console.log('====================================');
          console.log(error);
          console.log('====================================');
          return reject(false);
        }
      }
      resolve(true);
    });
  }
  const readonly = props.type === 'watch';
  return (
    <ModalForm
      width={1200}
      title={props.title}
      formRef={formRef}
      onVisibleChange={(v) => {
        if (v) {
          if (props.value.manufactureId) {
            setLoading(true);
            // 加载已填写的计件单
            fetchManufactureIdToOneRecordPiece(props.value.manufactureId)
              .then((res) => {
                if (!res.data) {
                  setList([]);
                  return;
                }
                setRecordPieceId(res.data.id);
                setList(
                  res.data.staffAndWorkProcessList.map((i) => {
                    return {
                      readonlyTotal: i.total,
                      readonlymaterialNumber: i.materialNumber,
                      readonly: true,
                      total: 0,
                      materialNumber: 0,
                      userId: i.userId,
                      workProcessId: i.workProcessId,
                    };
                  }),
                );
              })
              .finally(() => {
                setLoading(false);
              });
          }
        }
        formRef.current?.resetFields();
      }}
      trigger={props.children}
      onFinish={onFinish}
    >
      <Spin spinning={loading}>
        <ProFormList
          actionRef={formListRef}
          name="staffAndWorkProcessList"
          label="员工与工序计件数量"
          rules={[
            {
              validator: (rule, value: BusRecordPieceStaffAndWorkProcessForm[], callback) => {
                console.log(value);
                if (Array.isArray(value)) {
                  const error = value.find((i) => {
                    if (!i.userId || !i.workProcessId) {
                      return true;
                    }
                    return false;
                  });
                  if (error) {
                    return callback('有表单未填充');
                  }
                }
                return callback();
              },
            },
          ]}
          actionRender={(f, action, defaultDom) => {
            const data = formListRef.current?.get(f.name);
            if (!data) {
              return [];
            }
            return [
              ...defaultDom,
              <RecordPieceLogModal
                key="RecordPieceLogModal"
                type="findList"
                data={{
                  recordPieceId: recordPieceId as any,
                  workProcessId: data.workProcessId,
                  userId: data.userId,
                }}
              >
                <a
                  hidden={!data.readonly || recordPieceId === undefined}
                  style={{ paddingLeft: 12 }}
                >
                  查看记录
                </a>
              </RecordPieceLogModal>,
            ];
          }}
          creatorButtonProps={readonly ? false : undefined}
          copyIconProps={
            readonly
              ? false
              : {
                  tooltipText: '复制此行到末尾',
                }
          }
          deleteIconProps={
            readonly
              ? false
              : {
                  tooltipText: '删除此行',
                }
          }
          initialValue={[]}
        >
          {(f: BusRecordPieceStaffAndWorkProcessForm, index, action) => {
            const data: BusRecordPieceStaffAndWorkProcessForm = action.getCurrentRowData();
            return (
              <ProFormGroup key="group">
                <ProFormSelect
                  name="workProcessId"
                  width={250}
                  options={filterWorkProcessList}
                  disabled={data.readonly || readonly}
                  label="选择工序"
                />
                {data.readonly || readonly ? (
                  <BusSelectUser name="userId" disabled={true} width={150} label="选择员工" />
                ) : (
                  <ProFormDependency name={['workProcessId']}>
                    {({ workProcessId }) => {
                      return (
                        <BusSelectWorkStaff
                          workProcessId={workProcessId}
                          name="userId"
                          width={150}
                          label="选择员工"
                        />
                      );
                    }}
                  </ProFormDependency>
                )}
                <ProFormDigit
                  initialValue={0}
                  name="readonlyTotal"
                  disabled={true}
                  width={60}
                  label="计件数"
                />
                <ProFormDigit
                  name="readonlymaterialNumber"
                  disabled={true}
                  width={60}
                  label="领料数"
                  initialValue={0}
                />
                {readonly ? null : (
                  <ProFormDigit name="total" width={80} label="计件数" initialValue={0} />
                )}
                {readonly ? null : (
                  <ProFormDigit name="materialNumber" width={80} label="领料数" initialValue={0} />
                )}
              </ProFormGroup>
            );
          }}
        </ProFormList>
      </Spin>
    </ModalForm>
  );
};

export default RecordPieceAddModal;
