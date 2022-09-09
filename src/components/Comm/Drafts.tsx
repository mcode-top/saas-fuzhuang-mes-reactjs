import { fetchCreateStation, fetchUpdateStation } from '@/apis/business/techology-manage/station';
import {
  fetchCreateDrafts,
  fetchDraftsList,
  fetchRemoveDrafts,
  fetchWatchDrafts,
} from '@/apis/drafts';
import type { DraftsType } from '@/apis/drafts/typing';
import SelectSystemPersonButton from '@/components/Comm/FormlyComponents/SelectSystemPersonButton';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form, Input, message, Modal, Popconfirm, Space } from 'antd';
import type { CSSProperties } from 'react';
import { useRef, useState } from 'react';

export const DraftsModal: React.FC<{
  businessKey: string;
  style?: CSSProperties | undefined;
  className?: string | undefined;

  onFinish?: (value: DraftsType) => void;
  children: JSX.Element;
}> = (props) => {
  const [visible, setVisible] = useState(false);
  const formRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>(null);
  function removeDrafts(id: number) {
    return fetchRemoveDrafts(id).then((r) => {
      actionRef.current?.reload();
      message.success('删除成功');
    });
  }
  const columns: ProColumns<DraftsType>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      dataIndex: 'operator',
      width: 150,
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <Space>
            <Popconfirm
              title="设置后将覆盖原先内容,您确定要设置为草稿箱内容吗?"
              okText="确定"
              onConfirm={async () => {
                const content = await fetchWatchDrafts(entity.id as number).then(
                  (res) => res.data.data,
                );
                if (content) {
                  props.onFinish?.(content);
                  setVisible(false);
                }
              }}
              cancelText="取消"
            >
              <Button type="link">设置草稿箱内容</Button>
            </Popconfirm>

            <Popconfirm
              title="草稿箱内容被删除后将无法恢复,您确定要删除草稿箱内容吗?"
              okText="确定"
              onConfirm={() => {
                removeDrafts(entity.id as number);
              }}
              cancelText="取消"
            >
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  return (
    <ModalForm<DraftsType>
      width={600}
      visible={visible}
      title={'设置草稿箱内容'}
      onVisibleChange={setVisible}
      formRef={formRef}
      trigger={
        <div style={props.style} className={props.className} onClick={() => setVisible(true)}>
          {props.children}
        </div>
      }
    >
      <ProTable
        size="small"
        headerTitle="草稿箱列表"
        actionRef={actionRef}
        search={{ filterType: 'light' }}
        columns={columns}
        params={{ businessKey: props.businessKey }}
        request={(params, sort, filter) => {
          return nestPaginationTable(params, sort, filter, fetchDraftsList as any);
        }}
      />
    </ModalForm>
  );
};

/**@name 保存草稿箱 */
export function saveDrafts(businessKey: string, data: any): Promise<boolean> {
  return new Promise((resolve, reject) => {
    let value = '';
    Modal.confirm({
      title: '保存草稿箱',
      content: <Input onChange={(e) => (value = e.target.value)} />,
      onOk: () => {
        return fetchCreateDrafts({ name: value, businessKey, data })
          .then((res) => {
            message.success('草稿箱保存成功');
            resolve(true);
            return res;
          })
          .catch(reject);
      },
      onCancel: () => {
        resolve(false);
      },
    });
  });
}
