import axios from 'axios';
import { exit } from 'process';
import { DERROR, DLOG } from '../common/logger';
import { ErrorMessages } from './strings';

export interface TrackerIssue {
  summary: string;
  queue: string;
  type?: string;
  assignee: string;
  description?: string;
};

export const summaryWithAuthor = (
  summary: string,
  assignee: string,
) => `${summary} ${assignee}`;

export const fullDescription = (
  description: string | undefined,
) => `${new Date()}\n${description}`;

export const useTracker = (oauth: string, orgId: string) => {
  const base = 'https://api.tracker.yandex.net/';

  const api = axios.create({
    baseURL: base,
    headers: {
      'Authorization': `OAuth ${oauth}`,
      'X-Org-ID': orgId,
    },
  });

  const findIssue = async (queue: string, summary: string) => {
    try {
      const response = await api({
        method: 'POST',
        url: '/v2/issues/_search',
        data: {
          filter: {
            summary,
            queue,
          },
        },
      });

      const issues = [...response.data];

      if (issues.length > 0) {
        return issues[0];
      } else {
        return false;
      }
    } catch (ex) {
      console.error(ErrorMessages.trackerApiError);
      DERROR(ex);
      exit(-1);
    }
  };

  const addComment = async (text: string, issueId: string) => {
    try {
      const response = await api({
        method: 'POST',
        url: `/v2/issues/${issueId}/comments`,
        data: {
          text,
        },
      });
    } catch (ex) {
      console.error(ErrorMessages.trackerApiError);
      exit(-1);
    }
  };

  const createIssue = async (issue: TrackerIssue) => {
    const {
      summary,
      queue,
      type='task',
      description,
      assignee,
    } = issue;

    try {
      const response = await api({
        method: 'POST',
        url: '/v2/issues',
        data: {
          summary: summaryWithAuthor(summary, assignee),
          queue,
          type,
          description: fullDescription(description),
        },
      });
    } catch (ex) {
      console.error(ErrorMessages.trackerApiError);
      exit(-1);
    }
  };

  return {
    findIssue,
    addComment,
    createIssue,
  };
};
