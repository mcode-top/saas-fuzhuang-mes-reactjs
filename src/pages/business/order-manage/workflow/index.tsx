import { findSystemWorkflow, updateModelApprove } from '@/apis/process/process';
import type { ActUpdateModelApprove } from '@/apis/process/typings';
import IdToPerson from '@/components/Comm/IdToPerson';
import SelectSystemPerson from '@/components/SelectSystemPerson';
import { Button, Card, Descriptions, Spin } from 'antd';
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
    <Card loading={loading} title="审批人员管理" extra={<Button onClick={getList}>刷新</Button>}>
      <Descriptions column={1} bordered={true}>
        {list.map((i) => {
          return (
            <Descriptions.Item label={i.name} key={i.businessKey}>
              <IdToPerson showTypeTitle={true} person={i.person} />
              <SelectSystemPerson
                onFinish={(v) => {
                  if (v) {
                    setLoading(true);
                    return updateModelApprove({
                      taskModelId: i.taskModelId,
                      businessKey: i.businessKey,
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
                value={i.person}
              >
                <Button>选择修改审批人员</Button>
              </SelectSystemPerson>
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    </Card>
  );
};

export default BusWorkflowManage;
