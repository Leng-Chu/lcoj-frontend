/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Question = {
    /**
     * 题目通过数
     */
    acceptedNum?: number;
    /**
     * 题目标程
     */
    answer?: string;
    /**
     * 内容
     */
    content?: string;
    /**
     * 创建时间
     */
    createTime?: string;
    /**
     * id
     */
    id?: number;
    /**
     * 是否删除
     */
    isDelete?: number;
    /**
     * 判题用例（json 数组）
     */
    judgeCase?: string;
    /**
     * 判题配置（json 对象）
     */
    judgeConfig?: string;
    /**
     * 题目提交数
     */
    submitNum?: number;
    /**
     * 标签列表（json 数组）
     */
    tags?: string;
    /**
     * 标题
     */
    title?: string;
    /**
     * 更新时间
     */
    updateTime?: string;
    /**
     * 创建用户 id
     */
    userId?: number;
};
