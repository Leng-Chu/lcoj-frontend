<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionNum" label="题号" style="width: 180px">
        <a-input-number
          v-model="searchParams.questionNum"
          :max="100000"
          :min="1"
          placeholder="请输入题号"
        />
      </a-form-item>
      <a-form-item field="questionTitle" label="标题" style="width: 240px">
        <a-input
          v-model="searchParams.questionTitle"
          placeholder="请输入标题"
        />
      </a-form-item>
      <a-form-item field="userName" label="提交者" style="width: 200px">
        <a-input v-model="searchParams.userName" placeholder="请输入提交者" />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="width: 200px">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '200px' }"
          placeholder="选择语言"
        >
          <a-option value="">全选</a-option>
          <a-option value="java">Java</a-option>
          <a-option value="cpp">C++</a-option>
          <a-option value="python">Python</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="status" label="判题状态" style="width: 200px">
        <a-select
          v-model="searchParams.status"
          :style="{ width: '200px' }"
          placeholder="选择状态"
        >
          <a-option value="">全选</a-option>
          <a-option value="0">待判题</a-option>
          <a-option value="1">判题中</a-option>
          <a-option value="2">成功</a-option>
          <a-option value="3">失败</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-divider :size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #questionNum="{ record }">
        <router-link :to="{ path: `/view/question/${record.questionId}` }">
          {{ record.questionNum }}
        </router-link>
      </template>
      <template #questionTitle="{ record }">
        <router-link :to="{ path: `/view/question/${record.questionId}` }">
          {{ record.questionTitle }}
        </router-link>
      </template>
      <template #language="{ record }">
        <a
          v-if="record.code"
          style="color: blue; text-decoration: underline; cursor: pointer"
          @click="showCode(record.code)"
        >
          {{ record.language }}
        </a>
        <span v-else>
          {{ record.language }}
        </span>
      </template>
      <template #judgeInfo="{ record }">
        <a-descriptions
          :data="transformJudgeInfo(record.judgeInfo)"
          layout="inline-horizontal"
          size="small"
        />
      </template>
      <template #status="{ record }">
        {{ formatStatus(record.status) }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
    </a-table>
    <a-modal
      v-model:visible="isCodeModalVisible"
      :hide-cancel="true"
      title="Code"
      width="800px"
    >
      <pre>{{ codeContent }}</pre>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from "vue";
import {
  QuestionSubmitControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import moment from "moment";
import { toNumber } from "@vue/shared";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionNum: NaN,
  questionTitle: "",
  userName: "",
  language: "",
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res =
    await QuestionSubmitControllerService.listQuestionSubmitByPageUsingPost({
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    });
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = toNumber(res.data.total);
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "题号",
    slotName: "questionNum",
  },
  {
    title: "题目标题",
    slotName: "questionTitle",
  },
  {
    title: "编程语言",
    slotName: "language",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "判题状态",
    slotName: "status",
  },
  {
    title: "提交者",
    dataIndex: "userName",
  },
  {
    title: "提交时间",
    slotName: "createTime",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const isCodeModalVisible = ref(false);
const codeContent = ref("");
const showCode = (code: string) => {
  codeContent.value = code;
  isCodeModalVisible.value = true;
};

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
// 根据 status 返回对应的状态字符串
const formatStatus = (status: number) => {
  switch (status) {
    case 0:
      return "待判题";
    case 1:
      return "判题中";
    case 2:
      return "判题成功";
    case 3:
      return "判题失败";
    default:
      return "未知状态";
  }
};
// 将 judgeInfo 对象转换为 descriptions 需要的数组形式
const transformJudgeInfo = (judgeInfo: Record<string, any>) => {
  return Object.keys(judgeInfo).map((key) => {
    if (key === "time") {
      return {
        label: key,
        value: judgeInfo[key] !== null ? `${judgeInfo[key]}ms` : "0ms",
      };
    }

    if (key === "memory") {
      return {
        label: key,
        value: judgeInfo[key] !== null ? `${judgeInfo[key]}KB` : "0KB",
      };
    }

    return {
      label: key,
      value: judgeInfo[key] !== null ? `${judgeInfo[key]}` : "等待判题",
    };
  });
};
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
