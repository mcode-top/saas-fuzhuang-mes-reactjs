/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-14 09:51:05
 * @Description: 个人任务
 */
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Statistic, Divider, Button, Space, Modal } from 'antd';
import ProCard from '@ant-design/pro-card';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { fetchMyProcessList, fetchMyTaskList } from '@/apis/process/process';
import { ProcessValueEnum } from '@/configs/commValueEnum';
import * as _ from 'lodash';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import type { ActProcess, ActTask } from '@/apis/process/typings';
import { ActProcessStatusEnum } from '@/apis/process/typings';
import { ActTaskModelTypeEnum } from '@/apis/process/typings';
import { ActApproveStatusEnum } from '@/apis/process/typings';
import { COM_PRO_TABLE_TIME } from '@/configs/index.config';
import ReviewProcess from './components/ReviewProcess';
import ApproveModal from './components/ApproveModal';
import { Access } from 'umi';

import StartTaskModal from './components/StartTaskModal';
export default function UserTask() {
  const [tab, setTab] = useState('tab1');
  const taskColumns: ProColumns<ActTask>[] = [
    {
      title: '流程名称',
      dataIndex: 'process.name',
      width: 250,
      renderText: (t, record) => record.process?.name,
    },
    {
      title: '流程状态',
      dataIndex: 'process.status',
      valueEnum: ProcessValueEnum.ActProcessStatusEnum,
      width: 100,
      fieldProps: { mode: 'multiple' },
      renderText: (t, record) => record.process?.status,
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      width: 250,
    },
    {
      title: '任务状态',
      width: 100,
      valueEnum: ProcessValueEnum.ActTaskStatusEnum,
      dataIndex: 'status',
      fieldProps: { mode: 'multiple' },
    },
    {
      title: '审批状态',
      width: 100,
      valueEnum: ProcessValueEnum.ActApproveStatusEnum,
      dataIndex: 'approverList.status',
      hideInSearch: true,
      renderText: (t, record) => record.approverList?.[0].log.status,
    },
    {
      title: '审批意见',
      dataIndex: 'approverList.opinion',
      ellipsis: true,
      renderText: (t, record) => record.approverList?.[0].log.opinion,
    },
    ...COM_PRO_TABLE_TIME.updatedAt,
    ...COM_PRO_TABLE_TIME.createdAt,
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      render: (m, data, index, action) => {
        return (
          <Space>
            <Button type="link" onClick={() => handleReviewProcess(data.processId)}>
              预览流程图
            </Button>

            <Access
              accessible={checkStatusIsApprove({
                processStatus: data?.process?.status,
                taskType: data?.type,
                approverStatus: data?.approverList?.[0].log.status,
              })}
            >
              <ApproveModal
                task={data}
                key={data.id}
                onFinish={() => {
                  action?.reload();
                }}
              />
            </Access>
            <Access
              accessible={checkStatusIsStartTask({
                processStatus: data?.process?.status,
                taskType: data?.type,
                approverStatus: data?.approverList?.[0].log.status,
              })}
            >
              <StartTaskModal key={data.id} task={data} onFinish={() => action?.reload()} />
            </Access>
          </Space>
        );
      },
    },
  ];
  const processColumns: ProColumns<ActProcess>[] = [
    {
      title: '流程名称',
      dataIndex: 'name',
      width: 250,
    },
    {
      title: '流程状态',
      dataIndex: 'status',
      valueEnum: ProcessValueEnum.ActProcessStatusEnum,
      width: 100,
      fieldProps: { mode: 'multiple' },
    },
    {
      title: '正在执行的任务名称',
      dataIndex: 'runningTask.name',
      width: 250,
      hideInSearch: true,
      renderText: (t, record) => record.runningTask?.name,
    },
    {
      title: '正在执行的任务状态',
      dataIndex: 'runningTask.status',
      width: 150,
      hideInSearch: true,
      valueEnum: ProcessValueEnum.ActTaskStatusEnum,
      renderText: (t, record) => record.runningTask?.status,
    },
    {
      title: '执行人',
      dataIndex: 'parameter.assignInfo.userId',
      hideInSearch: true,
      renderText: (t, record) => record?.assignUser?.name,
    },
    {
      title: '执行意见',
      dataIndex: 'parameter.assignInfo.opinion',
      hideInSearch: true,
      renderText: (t, record) => record?.parameter?.assignInfo?.opinion,
    },
    ...COM_PRO_TABLE_TIME.updatedAt,
    ...COM_PRO_TABLE_TIME.createdAt,
    {
      title: '操作',
      render: (d, record) => {
        return (
          <Space>
            <Button type="link" onClick={() => handleReviewProcess(record.id)}>
              预览流程图
            </Button>
          </Space>
        );
      },
    },
  ];
  /**
   * 预览流程状态
   */
  function handleReviewProcess(processId: number) {
    Modal.info({
      width: 800,
      title: '预览流程状态',
      content: <ReviewProcess style={{ height: 600 }} processId={processId} />,
    });
  }
  return (
    <Row gutter={[24, 24]}>
      <Col span={24} style={{ width: '100%' }}>
        <ProCard.Group title="本月审批任务流程统计" direction="row">
          <ProCard>
            <Statistic title="与我有关审批流程" value={111} />
          </ProCard>
          <Divider type="vertical" />
          <ProCard>
            <Statistic title="我发起的流程" value={10} />
          </ProCard>
          <Divider type="vertical" />
          <ProCard>
            <Statistic title="已完成审批任务" value={10} />
          </ProCard>
          <Divider type="vertical" />
          <ProCard>
            <Statistic title="未完成的审批任务" value={5} />
          </ProCard>
        </ProCard.Group>
      </Col>
      <Col span={24}>
        <ProCard
          tabs={{
            activeKey: tab,
            onChange: (key) => {
              setTab(key);
            },
          }}
        >
          <ProCard.TabPane key="tab1" tab="待办任务">
            <ProTable
              rowKey="id"
              columns={taskColumns}
              request={(params, sort, filter) => {
                return nestPaginationTable(
                  {
                    ...params,
                    'process.status': [ActProcessStatusEnum.Running, ActProcessStatusEnum.Reject],
                    'approver.status': [ActApproveStatusEnum.Normal],
                  },
                  sort,
                  filter,
                  fetchMyTaskList,
                );
              }}
            />
          </ProCard.TabPane>
          <ProCard.TabPane key="tab2" tab="已办任务">
            <ProTable
              rowKey="id"
              columns={taskColumns}
              request={(params, sort, filter) => {
                return nestPaginationTable(
                  {
                    ...params,
                    'approver.status': [ActApproveStatusEnum.Agree, ActApproveStatusEnum.Disagree],
                  },
                  sort,
                  filter,
                  fetchMyTaskList,
                );
              }}
            />
          </ProCard.TabPane>
          <ProCard.TabPane key="tab3" tab="我发起的流程">
            <ProTable
              rowKey="id"
              columns={processColumns}
              request={(params, sort, filter) => {
                return nestPaginationTable(params, sort, filter, fetchMyProcessList);
              }}
            />
          </ProCard.TabPane>
        </ProCard>
      </Col>
    </Row>
  );
}

/**
 * 检查流程与任务状态判断是否显示审批
 */
function checkStatusIsApprove(options: {
  processStatus?: ActProcessStatusEnum;
  approverStatus?: ActApproveStatusEnum;
  taskType?: ActTaskModelTypeEnum;
}) {
  // 任务必须是运行中或者被驳回状态
  if (
    options.processStatus === ActProcessStatusEnum.Running ||
    options.processStatus === ActProcessStatusEnum.Reject
  ) {
    // 任务不能是开始任务且当前审批状态为未审批时便可显示
    if (
      options.approverStatus === ActApproveStatusEnum.Normal &&
      options.taskType !== ActTaskModelTypeEnum.Start
    ) {
      return true;
    }
  }
  return false;
}
/**
 * 检查流程与任务状态判断是否显示审批
 */
function checkStatusIsStartTask(options: {
  processStatus?: ActProcessStatusEnum;
  approverStatus?: ActApproveStatusEnum;
  taskType?: ActTaskModelTypeEnum;
}) {
  // 任务必须是运行中或者被驳回状态
  if (
    options.processStatus === ActProcessStatusEnum.Running ||
    options.processStatus === ActProcessStatusEnum.Reject
  ) {
    // 任务不能是开始任务且当前审批状态为未审批时便可显示
    if (
      options.approverStatus === ActApproveStatusEnum.Normal &&
      options.taskType === ActTaskModelTypeEnum.Start
    ) {
      return true;
    }
  }
  return false;
}
