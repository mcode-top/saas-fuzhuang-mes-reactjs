/* eslint-disable @typescript-eslint/no-use-before-define */
/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-17 13:39:14
 * @Description: 预览流程状态
 */
import React, { useEffect, useRef, useState } from 'react';
import type { Edge, Node } from '@antv/x6';
import { Graph } from '@antv/x6';
import type { ActApprover, ActApproverLog, ActTask } from '@/apis/process/typings';
import { ActTaskStatusEnum } from '@/apis/process/typings';
import { ActTaskModelTypeEnum } from '@/apis/process/typings';
import { CheckCard } from '@ant-design/pro-card';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  createFromIconfontCN,
  InfoCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Modal, Tooltip } from 'antd';
import '@antv/x6-react-shape';
import styles from './index.less';
import { DagreLayout } from '@antv/layout';

import classNames from 'classnames';
import { fetchProcessToTaskList, fetchTaskIdToApprovedLogList } from '@/apis/process/process';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ProcessValueEnum } from '@/configs/commValueEnum';
const IconFont = createFromIconfontCN({
  scriptUrl: '/icons/process/iconfont.js',
});
export default function ReviewProcess(props: {
  style?: React.CSSProperties;
  processId: number;
  className?: string;
}) {
  const canvas = useRef<HTMLDivElement>(null);
  const [taskList, setTaskList] = useState<ActTask[]>([]);
  function fetchTaskListToView() {
    return fetchProcessToTaskList(props.processId).then((res) => setTaskList(res.data));
  }
  useEffect(() => {
    fetchTaskListToView();
  }, [props.processId]);
  useEffect(() => {
    if (canvas.current) {
      const graph = new Graph({
        container: canvas.current,
        width: canvas.current.clientWidth,
        height: canvas.current.clientHeight,
        panning: true,
        interacting: {
          nodeMovable: false,
        },
      });
      const nodes: Node.Metadata[] = [];
      const edges: Edge.Metadata[] = [];
      taskList.forEach((task) => {
        nodes.push({
          width: TaskNodeWidth,
          height: TaskNodeHeight,
          shape: 'react-shape',
          id: task.taskModelId,
          data: task,
          component(node) {
            return <DAGTaskNode node={node} />;
          },
        });
        task?.to?.forEach?.((taskModelId) => {
          edges.push({
            shape: 'dag-edge', // 指定使用何种图形，默认值为 'edge'
            source: task.taskModelId,
            target: taskModelId,
          });
        });
        task?.from?.forEach?.((taskModelId) => {
          edges.push({
            shape: 'dag-edge', // 指定使用何种图形，默认值为 'edge'
            target: task.taskModelId,
            source: taskModelId,
          });
        });
      });

      const dagreLayout = new DagreLayout({
        type: 'dagre',
        rankdir: 'TB',
        align: 'UL',
        ranksep: 20,
        nodesep: 15,
        controlPoints: true,
      });

      const model = dagreLayout.layout({
        nodes: nodes as any,
        edges: edges as any,
      });

      graph.fromJSON(model);
    }
  }, [taskList]);
  return (
    <div
      className={props.className}
      style={{ width: '100%', height: '100%', ...(props?.style || {}) }}
      ref={canvas}
    />
  );
}

Graph.registerEdge(
  'dag-edge',
  {
    inherit: 'edge',
    attrs: {
      line: {
        stroke: '#C2C8D5',
        strokeWidth: 1,
        targetMarker: null,
      },
    },
  },
  true,
);

const taskTypeIcon = {
  [ActTaskModelTypeEnum.Condition]: ['icon-tiaojianxing', '条件节点:用于选择分支'],
  [ActTaskModelTypeEnum.End]: ['icon-weibiaoti517', '结束节点:到这里代表流程结束'],
  [ActTaskModelTypeEnum.Start]: ['icon-ai23', '开始节点:流程的第一个节点'],
  [ActTaskModelTypeEnum.Approve]: ['icon-shenpi-lv', '审批节点:用于人员审批'],
  [ActTaskModelTypeEnum.Recipient]: ['icon-chaosong', '抄送节点:推送流程状态给'],
};
const TaskNodeWidth = 220;
const TaskNodeHeight = 54;

export class DAGTaskNode extends React.Component<{ node?: Node }> {
  shouldComponentUpdate() {
    const { node } = this.props;
    if (node) {
      if (node.hasChanged('data')) {
        return true;
      }
    }
    return false;
  }

  render() {
    const { node } = this.props;
    const data = node?.getData() as ActTask;
    const columns: ProColumns<ActApproverLog>[] = [
      {
        title: '人员名称',
        dataIndex: '',
        render: (value: any, record: ActApproverLog, index: number) => {
          return record?.approved?.user?.name;
        },
      },
      {
        title: '审核状态',
        dataIndex: 'status',
        valueEnum: ProcessValueEnum.ActApproveStatusEnum,
      },
      {
        title: '审核意见',
        dataIndex: 'opinion',
      },
      {
        title: '审批时间',
        dataIndex: 'updatedAt',
      },
    ];
    return (
      <CheckCard
        style={{ width: TaskNodeWidth, height: TaskNodeHeight }}
        avatar={
          <Tooltip title={taskTypeIcon[data.type][1]}>
            <IconFont
              className={styles.taskStatusPrimary}
              style={{ fontSize: 30 }}
              type={taskTypeIcon[data.type][0]}
            />
          </Tooltip>
        }
        disabled={data.status === ActTaskStatusEnum.Disable}
        title={
          <div className={styles.taskNodeTitle}>
            <span>{data.name}</span>
            <span>
              {(data.status === ActTaskStatusEnum.Normal ||
                data.status === ActTaskStatusEnum.Disable) && (
                <InfoCircleOutlined className={classNames(styles.taskStatusIcon)} />
              )}
              {data.status === ActTaskStatusEnum.Disagree && (
                <CloseCircleOutlined
                  className={classNames(styles.taskStatusIcon, styles.taskStatusError)}
                />
              )}

              {(data.status === ActTaskStatusEnum.Complete ||
                data.status === ActTaskStatusEnum.Agree) && (
                <CheckCircleOutlined
                  className={classNames(styles.taskStatusIcon, styles.taskStatusSuccess)}
                />
              )}

              {data.status === ActTaskStatusEnum.Running && (
                <SyncOutlined
                  spin
                  className={classNames(styles.taskStatusIcon, styles.taskStatusPrimary)}
                />
              )}
            </span>
          </div>
        }
        size="small"
        onChange={(checked) => {
          console.log('checked', checked);
        }}
        onClick={() => {
          Modal.info({
            title: `查看节点[${data.name}]的审批人员列表`,
            width: 800,
            content: (
              <ProTable
                search={false}
                size="small"
                columns={columns}
                request={async () => {
                  return await fetchTaskIdToApprovedLogList(data.id);
                }}
              />
            ),
          });
        }}
      />
    );
  }
}
