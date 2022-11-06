import {
  fetchRecordPieceLogList,
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
      width={800}
      title={'查看工价单记录'}
      formRef={formRef}
      onVisibleChange={(v) => {
        if (v) {
          setLoading(true);
          if (props.type === 'findOne') {
            fetchRecordPieceLogList(props.data.recordPieceId)
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
      <RecordPieceLogTable list={list} loading={loading} />
    </ModalForm>
  );
};
export default RecordPieceLogModal;

/**@name 计件单记录表格 */
export const RecordPieceLogTable: React.FC<{
  list: BusOrderRecordPieceLog[];
  loading?: boolean;
}> = (props) => {
  return (
    <Table
      dataSource={props.list}
      size="small"
      loading={props.loading}
      rowKey="id"
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
          title: '员工',
          dataIndex: 'workerUser',
          render(value, record, index) {
            return record.workerUser.name;
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
          title: '操作人',
          dataIndex: 'workerUser',
          render(value, record, index) {
            return record.workerUser.name;
          },
        },
        {
          title: '记录时间',
          dataIndex: 'createdAt',
        },
      ]}
    />
  );
};
