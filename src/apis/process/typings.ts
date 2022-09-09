import type { UserListItem } from '../person/typings';

/**
 * 审批流 - 任务执行状态
 */
export enum ActTaskStatusEnum {
  Normal = '0',
  Running = '1',
  Complete = '2',
  Agree = '3',
  Disagree = '4',
  Disable = '5',
}
/**
 * 审批流 - 流程状态
 */
export enum ActProcessStatusEnum {
  Running = '0',
  Complete = '1',
  Stop = '2',
  Pause = '3',
  Reject = '4',
}
/**
 * 审批流 - 任务类型
 */
export enum ActTaskModelTypeEnum {
  /**
   * 开始节点 & 编写表单节点
   */
  Start = '0',
  /**
   * 结束节点 表示该流程状态已完成
   */
  End = '1',
  /**
   * 审批节点 具有审批功能
   */
  Approve = '2',
  /**
   * 抄送节点 用于消息通知
   */
  Recipient = '3',
  /**
   * 条件节点 用于分叉
   */
  Condition = '4',
}
/**
 * 审批流 - 模型状态
 */
export enum ActTaskModelStatusEnum {
  Disable = '0',
  Normal = '1',
}

/**
 * 审批流 - 审批状态
 */
export enum ActApproveStatusEnum {
  Normal = '0',
  Agree = '1',
  Disagree = '2',
  Recipient = '3',
}
/**
 * 审批流 - 审批模式
 */
export enum ActApproveModeEnum {
  /**
   * 依次审批(仅为固定人员时)
   */
  Normal = '0',
  /**
   * 会签
   */
  Countersign = '1',
  /**
   * 或签
   */
  Orsgin = '2',
}

/**
 * 选择审批人员类型
 */
export enum ActApproveTypeEnum {
  Person = '0',
  Dept = '1',
  Role = '2',
  /**
   * 发起者指定审批
   */
  Starter = '3',
}
export enum ActTaskFormDisplayEnum {
  Hide = '0',
  Show = '1',
  Edit = '2',
}
export type ActTaskModel = {
  name: string;
  type: ActTaskModelTypeEnum;
  id: string;
  /**
   * 其他节点连接该节点
   */
  from?: string[];
  /**
   * 连接其他节点
   */
  to?: string[];
  parameter?: ActTaskParameter;
  approvers?: ActApprover;
  orderNum: number;
};
/**
 * 审批流 - 流程实例参数
 */
export type ActProcessParameter = {
  /**
   * 指派人信息
   */
  assignInfo?: {
    userId: number;
    opinion: string;
  };
  /**
   * 发起人Id(默认为当前用户)
   */
  starterId?: number;
  /**
   * 表单可用字段
   */
  formFields?: { label: string; field: string }[];
  /**
   * 写入表单值
   */
  formValues?: Record<string, any>;
} & Record<string, any>;
/**
 * 审批流 - 任务实例参数
 */
export type ActTaskParameter = {
  approvers?: ActApprover & { index?: number };
  conditions?: any;
  /**
   * 表单字段显示
   */
  formDisplay?: Record<string, ActTaskFormDisplayEnum>;
} & Record<string, any>;

export type ActProcess = {
  id: number;
  name: string;
  status: ActProcessStatusEnum;
  parameter?: ActProcessParameter;
  runningId?: number;
  runningTask?: ActTask;
  businessKey: string;
  modelId: number;
  model?: any;
  taskList?: ActTask[];
  approverList?: ActApprover[];
  operatorId: number;
  operator?: UserListItem;
  assignUser?: UserListItem;
};
export type ActTask = {
  id: number;
  name: string;
  status: ActTaskStatusEnum;
  /**
   * 关联模型ID
   */
  to: string[];
  /**
   * 关联模型ID
   */
  from: string[];
  type: ActTaskModelTypeEnum;
  parameter?: ActTaskParameter;
  orderNum: number;
  /**
   * 需要审批人员列表
   */
  userList?: UserListItem[];
  /**
   * 与流程相关人员 (关联任务模型 从任务模型中动态添加在此)
   */
  approverList?: ActApprover[];

  processId: number;
  process?: ActProcess;
  /**
   * 模型ID
   */
  taskModelId: string;
};

/**@name 审批人节点 */
export type ActApprover = {
  processId: number;
  process?: ActProcess;
  userId: number;
  user?: UserListItem;
  taskId: number;
  task?: ActTask;
  status: ActApproveStatusEnum;
  opinion: string;
  log: ActApproverLog;
};

/**@name 审批记录 */
export type ActApproverLog = {
  approvedId: number;
  status: ActApproveStatusEnum;
  opinion: string;
  approved?: ActApprover;
};
export type ActTaskQuery = PartialObject<ActTask>;
