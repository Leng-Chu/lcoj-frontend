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
          <a-option value="cpp">C++</a-option>
          <a-option value="java">Java</a-option>
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
        <router-link
          :to="{ path: `/view/question/${record.questionId}` }"
          class="custom-link"
        >
          {{ record.questionNum }}
        </router-link>
      </template>
      <template #questionTitle="{ record }">
        <router-link
          :to="{ path: `/view/question/${record.questionId}` }"
          class="custom-link"
        >
          {{ record.questionTitle }}
        </router-link>
      </template>
      <template #language="{ record }">
        <a
          v-if="record.code"
          class="custom-link"
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
import { useRoute } from "vue-router";

const route = useRoute();

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionNum: NaN,
  questionTitle: "",
  userName: "",
  language: "",
  status: NaN,
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
  //如果是从其他页面跳转过来的，需要将参数设置到搜索框中
  if (route.query.questionNum) {
    searchParams.value.questionNum = toNumber(route.query.questionNum);
  }
  if (route.query.userName) {
    searchParams.value.userName = route.query.userName as string;
  }
  loadData();
});

const columns = [
  {
    title: "题号",
    slotName: "questionNum",
    align: "center",
    width: 80,
  },
  {
    title: "标题",
    slotName: "questionTitle",
    width: 250,
  },
  {
    title: "编程语言",
    slotName: "language",
    align: "center",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
    align: "center",
  },
  {
    title: "判题状态",
    slotName: "status",
    align: "center",
  },
  {
    title: "提交者",
    dataIndex: "userName",
    align: "center",
  },
  {
    title: "提交时间",
    slotName: "createTime",
    align: "center",
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
      return "成功";
    case 3:
      return "失败";
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

    if (key === "judgeResult") {
      switch (judgeInfo[key]) {
        case 0:
          return {
            label: "result",
            value: "等待判题",
          };
        case 1:
          return {
            label: "result",
            value: "通过题目",
          };
        case 2:
          return {
            label: "result",
            value: "答案错误",
          };
        case 3:
          return {
            label: "result",
            value: "编译错误",
          };
        case 4:
          return {
            label: "result",
            value: "运行错误",
          };
        case 5:
          return {
            label: "result",
            value: "系统错误",
          };
        case 6:
          return {
            label: "result",
            value: "时间超限",
          };
        case 7:
          return {
            label: "result",
            value: "内存超限",
          };
        case 8:
          return {
            label: "result",
            value: "无测评数据",
          };
        default:
          return {
            label: "result",
            value: "未知状态",
          };
      }
    }
  });
};
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}

.custom-link {
  color: #1890ff;
  text-decoration: none;
}

.custom-link:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
