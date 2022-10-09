import {
  fetchRecorPieceLogList,
  fetchWorkProcessLogList,
} from '@/apis/business/order-manage/record-piece';
import type { BusOrderRecordPieceLog } from '@/apis/business/order-manage/record-piece/typing';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm } from '@ant-design/pro-form';
import { Table } from 'antd';
import { useRef, useState } from 'react';

const RecordPieceLogModal: React.FC<{
  type: 'findOne' | 'findList';
  data: {
    recordPieceId: number;
    workProcessId?: number;
    userId?: number;
  };
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<BusOrderRecordPieceLog[]>([]);
  return (
    <ModalForm
      width={700}
      title={'查看工价单记录'}
      formRef={formRef}
      onVisibleChange={(v) => {
        if (v) {
          setLoading(true);
          if (props.type === 'findOne') {
            fetchRecorPieceLogList(props.data.recordPieceId)
              .then((res) => {
                setList(res.data);
              })
              .finally(() => setLoading(false));
          } else {
            fetchWorkProcessLogList(props.data as any)
              .then((res) => {
                setList(res.data);
              })
              .finally(() => setLoading(false));
          }
        }
      }}
      trigger={props.children}
    >
      <Table
        dataSource={list}
        size="small"
        loading={loading}
        pagination={{ size: 'small' }}
        columns={[
          {
            title: '工序名称',
            dataIndex: 'a',
            render(value, record, index) {
              return record.workProcess.name;
            },
          },
          {
            title: '工价',
            dataIndex: 'price',
          },
          {
            title: '计件数量',
            dataIndex: 'number',
          },
          {
            title: '领料数',
            dataIndex: 'materialNumber',
          },
          {
            title: '计件员工',
            dataIndex: 'workerUser',
            render(value, record, index) {
              return record.workerUser.name;
            },
          },
        ]}
      />
    </ModalForm>
  );
};
export default RecordPieceLogModal;
