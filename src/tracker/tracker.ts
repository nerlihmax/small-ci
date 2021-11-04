import axios from 'axios';
import { exit } from 'process';
import { ErrorMessages } from './strings';

export interface TrackerIssue {
  summary: string;
  queue: string;
  type?: string;
  assignee: string;
  description?: string;
};

export const useTracker = (oauth: string, orgId: string) => {
  const base = 'https://api.tracker.yandex.net/';

  const api = axios.create({
    baseURL: base,
    headers: {
      'Authorization': `OAuth ${oauth}`,
      'X-Org-ID': orgId,
    },
  });

  const createIssue = async (issue: TrackerIssue) => {
    const {
      summary,
      queue,
      type='task',
      description,
      assignee,
    } = issue;

    const summaryWithAuthor = `${summary} ${assignee} ${new Date()}`;

    try {
      const response = await api({
        method: 'POST',
        url: '/v2/issues',
        data: {
          summary: summaryWithAuthor,
          queue,
          type,
          description,
        },
      });
    } catch (ex) {
      console.error(ErrorMessages.trackerApiError);
      exit(-1);
    }
  };

  return {
    createIssue,
  };
};
