/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_List_Question_ } from '../models/BaseResponse_List_Question_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_QuestionListVO_ } from '../models/BaseResponse_Page_QuestionListVO_';
import type { BaseResponse_Page_QuestionManageVO_ } from '../models/BaseResponse_Page_QuestionManageVO_';
import type { BaseResponse_Question_ } from '../models/BaseResponse_Question_';
import type { BaseResponse_QuestionVO_ } from '../models/BaseResponse_QuestionVO_';
import type { DeleteRequest } from '../models/DeleteRequest';
import type { QuestionAddRequest } from '../models/QuestionAddRequest';
import type { QuestionAdminAddRequest } from '../models/QuestionAdminAddRequest';
import type { QuestionQueryRequest } from '../models/QuestionQueryRequest';
import type { QuestionUpdateRequest } from '../models/QuestionUpdateRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuestionControllerService {

    /**
     * getAcceptQuestion
     * @param userName userName
     * @returns BaseResponse_List_Question_ OK
     * @throws ApiError
     */
    public static getAcceptQuestionUsingGet(
userName?: string,
): CancelablePromise<BaseResponse_List_Question_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/accept',
            query: {
                'userName': userName,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * addQuestion
     * @param questionAddRequest questionAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addQuestionUsingPost(
questionAddRequest: QuestionAddRequest,
): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/add',
            body: questionAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * adminAddQuestion
     * @param questionAdminAddRequest questionAdminAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static adminAddQuestionUsingPost(
questionAdminAddRequest: QuestionAdminAddRequest,
): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/admin/add',
            body: questionAdminAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * createOutputFiles
     * @param num num
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static createOutputFilesUsingPost(
num: number,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/create-output',
            query: {
                'num': num,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * deleteQuestion
     * @param deleteRequest deleteRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static deleteQuestionUsingPost(
deleteRequest: DeleteRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/delete',
            body: deleteRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getFailQuestion
     * @param userName userName
     * @returns BaseResponse_List_Question_ OK
     * @throws ApiError
     */
    public static getFailQuestionUsingGet(
userName?: string,
): CancelablePromise<BaseResponse_List_Question_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/fail',
            query: {
                'userName': userName,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getQuestionById
     * @param id id
     * @returns BaseResponse_Question_ OK
     * @throws ApiError
     */
    public static getQuestionByIdUsingGet(
id?: number,
): CancelablePromise<BaseResponse_Question_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/get',
            query: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getQuestionVOById
     * @param id id
     * @returns BaseResponse_QuestionVO_ OK
     * @throws ApiError
     */
    public static getQuestionVoByIdUsingGet(
id?: number,
): CancelablePromise<BaseResponse_QuestionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/get/vo',
            query: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listQuestionVOByPage
     * @param questionQueryRequest questionQueryRequest
     * @returns BaseResponse_Page_QuestionListVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionVoByPageUsingPost(
questionQueryRequest: QuestionQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionListVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/list/page/vo',
            body: questionQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listQuestionManageVOByPage
     * @param questionQueryRequest questionQueryRequest
     * @returns BaseResponse_Page_QuestionManageVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionManageVoByPageUsingPost(
questionQueryRequest: QuestionQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionManageVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/manage/list/page/vo',
            body: questionQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getNextNum
     * @returns BaseResponse_long_ OK
     * @throws ApiError
     */
    public static getNextNumUsingGet(): CancelablePromise<BaseResponse_long_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/next-num',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * updateQuestion
     * @param questionUpdateRequest questionUpdateRequest
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateQuestionUsingPost(
questionUpdateRequest: QuestionUpdateRequest,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/update',
            body: questionUpdateRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
