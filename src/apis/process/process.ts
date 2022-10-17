/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-14 10:57:04
 * @Description: 文件描述
 */
import { request } from 'umi';
import type {
  ActApproverLog,
  ActProcess,
  ActTask,
  ActTaskQuery,
  ActUpdateModelApprove,
  ApproveTaskDto,
  UpdateModelApproveDto,
} from './typings';

export function fetchMyTaskList(data: PAGINATION_QUERY.Param<ActTaskQuery>) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<ActTask>>>('/workflow/task/page', {
    method: 'POST',
    data,
  });
}
export function fetchMyProcessList(data: PAGINATION_QUERY.Param<ActTaskQuery>) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<ActProcess>>>('/workflow/process/page', {
    method: 'POST',
    data,
  });
}

/**@name 通过流程Id获取任务列表 */
export function fetchProcessToTaskList(processId: number) {
  return request<RESULT_SUCCESS<ActTask[]>>('/workflow/task/list/' + processId, {
    method: 'POST',
  });
}
/**@name 通过TaskId获取当前任务的全部审批记录 */
export function fetchTaskIdToApprovedLogList(taskId: number) {
  return request<RESULT_SUCCESS<ActApproverLog[]>>('/workflow/approved-log/list/' + taskId, {
    method: 'POST',
  });
}

/**
 * 执行流程中的开始任务，请确保流程已启动
 */
export function processStartTask(taskId: number, data: { opinion?: string; parameter?: any }) {
  return request<RESULT_SUCCESS>('/workflow/approved/execute-start/' + taskId, {
    method: 'POST',
    data,
  });
}
/**
 * 审批任务
 */
export function processApproveTask(taskId: number, data: ApproveTaskDto) {
  return request<RESULT_SUCCESS>('/workflow/approved/' + taskId, {
    method: 'POST',
    data,
  });
}
/**
 * 撤回流程
 */
export function processRecall(processId: number) {
  return request<RESULT_SUCCESS>('/workflow/process/recall/' + processId, {
    method: 'POST',
  });
}
/**
 * 修改审批流中的审批人员
 */
export function updateModelApprove(data: UpdateModelApproveDto) {
  return request<RESULT_SUCCESS>('/workflow/model/update-approve', {
    method: 'POST',
    data,
  });
}
/**
 * 获取系统指定的审批流
 */
export function findSystemWorkflow() {
  return request<RESULT_SUCCESS<ActUpdateModelApprove[]>>('/workflow/model/system-current-model', {
    method: 'GET',
  });
}
