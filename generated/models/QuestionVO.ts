/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JudgeConfig } from './JudgeConfig';
import type { SampleCase } from './SampleCase';

export type QuestionVO = {
    content?: string;
    id?: number;
    judgeConfig?: JudgeConfig;
    num?: number;
    sampleCase?: Array<SampleCase>;
    tags?: Array<string>;
    title?: string;
};
