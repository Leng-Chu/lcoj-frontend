/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CaseInfo } from './CaseInfo';
import type { JudgeInfo } from './JudgeInfo';

export type QuestionSubmitVO = {
    caseInfoList?: Array<CaseInfo>;
    code?: string;
    createTime?: string;
    id?: number;
    judgeInfo?: JudgeInfo;
    language?: string;
    questionId?: number;
    questionNum?: number;
    questionTitle?: string;
    status?: number;
    updateTime?: string;
    userName?: string;
};
