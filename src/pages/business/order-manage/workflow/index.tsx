import { findSystemWorkflow, updateModelApprove } from '@/apis/process/process';
import type { ActUpdateModelApprove } from '@/apis/process/typings';
import IdToPerson from '@/components/Comm/IdToPerson';
import SelectSystemPerson from '@/components/SelectSystemPerson';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Card, Descriptions, Spin, Table } from 'antd';
import { useEffect, useState } from 'react';

const BusWorkflowManage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<ActUpdateModelApprove[]>([]);
  async function getList() {
    setLoading(true);
    findSystemWorkflow()
      .then((res) => {
        setList(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  useEffect(() => {
    getList();
  }, []);
  return (
    <ProTable
      loading={loading}
      columns={[
        {
          title: '工作流名称',
          dataIndex: 'name',
        },
        {
          title: '审批节点名称',
          dataIndex: 'taskModelName',
        },
        {
          title: '审批人员',
          dataIndex: 'person',
          render(dom, entity, index, action, schema) {
            return <IdToPerson showTypeTitle={true} person={entity.person} />;
          },
        },
        {
          title: '操作',
          dataIndex: 'operator',
          render(dom, entity, index, action, schema) {
            return (
              <SelectSystemPerson
                onFinish={(v) => {
                  if (v) {
                    setLoading(true);
                    return updateModelApprove({
                      taskModelId: entity.taskModelId,
                      businessKey: entity.businessKey,
                      person: v,
                    })
                      .then((res) => {
                        getList();
                      })
                      .catch((err) => {
                        console.error(err);

                        setLoading(false);
                      });
                  } else {
                    return Promise.reject();
                  }
                }}
                showDept
                showRole
                showUser
                multiple
                value={entity.person}
              >
                <Button>选择修改审批人员</Button>
              </SelectSystemPerson>
            );
          },
        },
      ]}
      headerTitle="审批人员管理"
      search={false}
      toolbar={{
        settings: [{ icon: <ReloadOutlined />, tooltip: '刷新', onClick: getList }],
      }}
      rowKey={(record) => record.businessKey + record.taskModelId}
      dataSource={list}
    />
  );
};

export default BusWorkflowManage;
