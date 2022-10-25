import { fetchWarehouseExcelManyPutInGoods } from '@/apis/business/warehouse';
import type { ExcelManyPutInGoodsDataDto } from '@/apis/business/warehouse/typing';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm } from '@ant-design/pro-form';
import { ProFormTextArea } from '@ant-design/pro-form';
import { Descriptions, Input, message, Modal, Table, Tabs } from 'antd';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import type { ActionType } from 'use-switch-tabs';
import type { ExcelImportData } from './GoodsExcelOperation';
import { checkGoodsExcelDataToFetchData } from './GoodsExcelOperation';

/**@name Excel货品批量入库对话框 */
const ExcelHintGoodsPutInModal: React.FC<{
  shelfId: number;
  data: ExcelImportData[];
  actionRef: ActionType | undefined;
  children: JSX.Element;
  onFinish?: () => void;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const [tabKey, setTabKey] = useState<string>('error');
  const [fetchData, setFetchData] = useState<{
    errorData: (ExcelImportData & {
      errorText: string;
    })[];
    successData: ExcelManyPutInGoodsDataDto[];
  }>();
  useEffect(() => {
    if (Array.isArray(props.data) && props.data.length > 0) {
      checkGoodsExcelDataToFetchData(props.data).then((r) => {
        setFetchData(r);
        if (r.errorData.length === 0) {
          setTabKey('success');
        } else {
          setTabKey('error');
        }
      });
    }
  }, [props.data]);

  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!fetchData?.successData) {
        message.error('没有可导入的数据');
        reject(false);
        return;
      }
      try {
        const value = await formRef.current?.validateFields();
        if (fetchData?.successData.length > 0) {
          Modal.confirm({
            title: '您确定要新增可成功导入的物料列表',
            onOk: () => {
              fetchWarehouseExcelManyPutInGoods({
                shelfId: props.shelfId,
                contractNumber: value.contractNumber,
                data: fetchData?.successData as any,
              });
              formRef.current?.resetFields();
              props?.onFinish?.();
              resolve(true);
            },
            onCancel: () => {
              formRef.current?.resetFields();
            },
          });
        } else {
          message.error('没有可导入的数据');
          reject(false);
        }
      } catch (error) {
        console.log(error);
        reject(false);
      }
    });
  }

  return (
    <ModalForm
      width={700}
      title={'成功入库的货品列表'}
      formRef={formRef}
      trigger={props.children}
      onFinish={onFinish}
    >
      <Tabs activeKey={tabKey} onChange={setTabKey}>
        {fetchData?.errorData && fetchData?.errorData.length > 0 ? (
          <Tabs.TabPane tab="错误列表" key="error">
            <Table
              size="small"
              rowKey="materialCode"
              columns={[
                {
                  title: '物料编码',
                  dataIndex: 'materialCode',
                },
                {
                  title: '尺码模板',
                  dataIndex: 'sizeTemplateName',
                },
                {
                  title: '尺码',
                  dataIndex: 'sizeName',
                },
                {
                  title: '颜色',
                  dataIndex: 'color',
                },
                {
                  title: '货品入库数',
                  dataIndex: 'deliveryCount',
                },
                {
                  title: '入库原因',
                  dataIndex: 'remark',
                  ellipsis: true,
                },
                {
                  title: '错误原因',
                  dataIndex: 'errorText',
                },
              ]}
              dataSource={fetchData.errorData}
            />
          </Tabs.TabPane>
        ) : null}
        <Tabs.TabPane tab="可成功入库的货品列表" key="success">
          <Table
            rowKey="materialCode"
            size="small"
            columns={[
              {
                title: '物料编码',
                dataIndex: 'materialCode',
              },
              {
                title: '货品入库数',
                dataIndex: 'deliveryCount',
              },
              {
                title: '尺码',
                dataIndex: 'sizeName',
              },
              {
                title: '颜色',
                dataIndex: 'color',
              },
              {
                title: '入库原因',
                dataIndex: 'remark',
                ellipsis: true,
              },
            ]}
            dataSource={fetchData ? fetchData.successData : []}
          />
        </Tabs.TabPane>
      </Tabs>
      <ProFormTextArea label="绑定合同单" name="remark" />
      {/**TODO:待完善绑定合同单 */}
    </ModalForm>
  );
};

export default ExcelHintGoodsPutInModal;
