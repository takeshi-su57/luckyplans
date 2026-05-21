import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

const BacktestTasksQuery = gql`
  query BacktestTasks {
    backtestTasks {
      id
      name
      symbol
      interval
      status
      assignedWorkerId
      processedConfigs
      totalConfigs
      createdAt
    }
  }
`;

const BacktestResultsQuery = gql`
  query BacktestResults($taskId: String!) {
    backtestResults(taskId: $taskId) {
      id
      configId
      metrics
      createdAt
    }
  }
`;

const CreateTemplateMutation = gql`
  mutation CreateStrategyTemplate($input: CreateStrategyTemplateInput!) {
    createStrategyTemplate(input: $input) {
      id
      name
      category
      isActive
    }
  }
`;

const CreateTaskMutation = gql`
  mutation CreateBacktestTask($input: CreateBacktestTaskInput!) {
    createBacktestTask(input: $input) {
      id
      name
      status
    }
  }
`;

const CancelTaskMutation = gql`
  mutation CancelBacktestTask($taskId: String!) {
    cancelBacktestTask(taskId: $taskId) {
      id
      status
    }
  }
`;

const RetryTaskMutation = gql`
  mutation RetryBacktestTask($taskId: String!) {
    retryBacktestTask(taskId: $taskId) {
      id
      status
    }
  }
`;

export function useBacktestTasks() {
  return useQuery<{ backtestTasks: unknown[] }>(BacktestTasksQuery);
}

export function useBacktestResults(taskId: string) {
  return useQuery<{ backtestResults: unknown[] }>(BacktestResultsQuery, {
    variables: { taskId },
    skip: !taskId,
  });
}

export function useCreateTemplate() {
  return useMutation<{ createStrategyTemplate: { id: string; name: string } }>(CreateTemplateMutation);
}

export function useCreateTask() {
  return useMutation(CreateTaskMutation);
}

export function useCancelTask() {
  return useMutation(CancelTaskMutation);
}

export function useRetryTask() {
  return useMutation(RetryTaskMutation);
}
