import type { BusOrderStyleDemand } from '@/apis/business/order-manage/contract/typing';
import SelectUploadFile from '@/components/Comm/FormlyComponents/Upload';
import { dictValueEnum, OrderContractTypeValueEnum } from '@/configs/commValueEnum';
import ProForm from '@ant-design/pro-form';
import { Descriptions } from 'antd';
import { isEmpty } from 'lodash';
import MaterialToWarehouseGoodsTable from '../../components/SizeNumberPriceTable';
import LogoCraftsmanship from '../../contract/Info/LogoCraftsmanship';

/**@name 查看合同单中的款式信息 */
const ContractStyleDemand: React.FC<{
  styleDemand: BusOrderStyleDemand;
  contractNumber: string;
  deliverDate?: string;
  sampleRemark?: string;
}> = (props) => {
  return (
    <div>
      <Descriptions>
        <Descriptions.Item label="订单单号">{props?.contractNumber}</Descriptions.Item>
        <Descriptions.Item label="订单类型">
          {dictValueEnum(OrderContractTypeValueEnum.Style, props?.styleDemand.styleType)}
        </Descriptions.Item>
        <Descriptions.Item label="物料编码(型号)">
          {props?.styleDemand.materialCode}
        </Descriptions.Item>
        {props.sampleRemark && props.sampleRemark !== '无' ? (
          <Descriptions.Item label="有样衣">{props.sampleRemark}</Descriptions.Item>
        ) : null}
        <Descriptions.Item label="合同交期时间">{props.deliverDate}</Descriptions.Item>
        <Descriptions.Item label="产品名称(款式)">{props?.styleDemand.style}</Descriptions.Item>
        <Descriptions.Item label="面料">{props?.styleDemand.shellFabric}</Descriptions.Item>
        <Descriptions.Item label="商标">{props?.styleDemand.商标}</Descriptions.Item>
        <Descriptions.Item label="口袋">{props?.styleDemand.口袋}</Descriptions.Item>
        <Descriptions.Item label="领号">{props?.styleDemand.领号}</Descriptions.Item>
        <Descriptions.Item label="领子颜色">{props?.styleDemand.领子颜色}</Descriptions.Item>
        <Descriptions.Item label="后备扣">{props?.styleDemand.后备扣}</Descriptions.Item>
        <Descriptions.Item label="领部缝纫工艺">
          {props?.styleDemand.领部缝纫工艺}
        </Descriptions.Item>
        <Descriptions.Item label="门襟工艺">{props?.styleDemand.门襟工艺}</Descriptions.Item>
        <Descriptions.Item label="袖口工艺">{props?.styleDemand.袖口工艺}</Descriptions.Item>
        <Descriptions.Item label="下摆工艺">{props?.styleDemand.下摆工艺}</Descriptions.Item>
        <Descriptions.Item label="纽扣工艺">{props?.styleDemand.纽扣工艺}</Descriptions.Item>
      </Descriptions>
      {!isEmpty(props.styleDemand.logo) ? (
        <LogoCraftsmanship readonly={true} value={props.styleDemand.logo} />
      ) : null}

      <MaterialToWarehouseGoodsTable
        materialCode={props?.styleDemand.materialCode}
        data={props?.styleDemand.sizePriceNumber}
      />
    </div>
  );
};

export default ContractStyleDemand;
