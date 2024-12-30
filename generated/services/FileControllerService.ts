/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_boolean_ } from '../models/BaseResponse_boolean_';
import type { BaseResponse_FileListVO_ } from '../models/BaseResponse_FileListVO_';
import type { Resource } from '../models/Resource';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FileControllerService {

    /**
     * deleteFile
     * @param filename filename
     * @param num num
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static deleteFileUsingDelete(
filename: string,
num: number,
): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/file/delete',
            query: {
                'filename': filename,
                'num': num,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * deleteAllFiles
     * @param num num
     * @returns BaseResponse_boolean_ OK
     * @throws ApiError
     */
    public static deleteAllFilesUsingDelete(
num: number,
): CancelablePromise<BaseResponse_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/file/deleteAll',
            query: {
                'num': num,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * downloadFile
     * @param filename filename
     * @param num num
     * @returns Resource OK
     * @throws ApiError
     */
    public static downloadFileUsingGet(
filename: string,
num: number,
): CancelablePromise<Resource> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/file/download',
            query: {
                'filename': filename,
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
     * downloadAllFiles
     * @param num num
     * @returns Resource OK
     * @throws ApiError
     */
    public static downloadAllFilesUsingGet(
num: number,
): CancelablePromise<Resource> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/file/downloadAll',
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
     * listFiles
     * @param num num
     * @returns BaseResponse_FileListVO_ OK
     * @throws ApiError
     */
    public static listFilesUsingGet(
num: number,
): CancelablePromise<BaseResponse_FileListVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/file/list',
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
     * uploadFile
     * @param file file
     * @param num num
     * @returns BaseResponse_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static uploadFileUsingPost(
file: Array<Blob>,
num: number,
): CancelablePromise<BaseResponse_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/file/upload',
            query: {
                'num': num,
            },
            formData: {
                'file': file,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
