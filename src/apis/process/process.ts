/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-14 10:57:04
 * @Description: 文件描述
 */
import { request } from 'umi';
import type { ActProcess, ActTask, ActTaskQuery } from './typings';

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

export function fetchProcessToTaskList(processId: number) {
  return request<RESULT_SUCCESS<ActTask[]>>('/workflow/task/process-to-task/list/' + processId, {
    method: 'POST',
  });
}

/**
 * 开启任务
 */
export function processStartTask(taskId: number, data: { opinion?: string; parameter?: any }) {
  return request<RESULT_SUCCESS>('/workflow/task/start/' + taskId, {
    method: 'POST',
    data,
  });
}
/**
 * 审批任务
 */
export function processApproveTask(taskId: number, data: { opinion?: string; isAgree: boolean }) {
  return request<RESULT_SUCCESS>('/workflow/task/approve/' + taskId, {
    method: 'POST',
    data,
  });
}
