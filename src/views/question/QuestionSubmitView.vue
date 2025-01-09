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
      <a-form-item field="judgeResult" label="判题结果" style="width: 200px">
        <a-select
          v-model="searchParams.judgeResult"
          :style="{ width: '200px' }"
          placeholder="选择结果"
        >
          <a-option value="">全选</a-option>
          <a-option value="0">等待判题</a-option>
          <a-option value="1">通过题目</a-option>
          <a-option value="2">答案错误</a-option>
          <a-option value="3">编译错误</a-option>
          <a-option value="4">运行错误</a-option>
          <a-option value="5">系统错误</a-option>
          <a-option value="6">时间超限</a-option>
          <a-option value="7">内存超限</a-option>
          <a-option value="8">无测评数据</a-option>
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
          @click="showCode(record.code, record.language)"
        >
          {{ record.language }}
        </a>
        <span v-else>
          {{ record.language }}
        </span>
      </template>
      <template #judgeResult="{ record }">
        <a
          :style="{ color: judgeResultColor(record.judgeResult) }"
          class="custom-link"
          @click="showJudgeResult(record.caseInfoList)"
        >
          {{ formatJudgeResult(record.judgeResult) }}
        </a>
      </template>
      <template #judgeInfo="{ record }">
        <a-descriptions
          :data="transformJudgeInfo(record.maxTime, record.maxMemory)"
          layout="inline-horizontal"
          size="small"
        />
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #actions="{ record }">
        <a-button
          v-if="isAdmin"
          type="primary"
          @click="QuestionSubmitControllerService.rejudgeUsingPost(record.id)"
        >
          重判
        </a-button>
      </template>
    </a-table>
    <a-modal
      v-model:visible="isCodeModalVisible"
      :hide-cancel="true"
      title="Code"
      width="800px"
    >
      <!--   展示codeContent   -->
      <CodeEditor
        :handleChange="() => {}"
        :language="codeLanguage"
        :readOnly="true"
        :value="codeContent"
      />
    </a-modal>
    <a-modal
      v-model:visible="isJudgeResultModalVisible"
      :hide-cancel="true"
      title="判题结果"
      width="1000px"
    >
      <a-table
        :ref="caseRef"
        :columns="caseColumns"
        :data="caseInfoList"
        :pagination="false"
        :scroll="{ x: '100%', y: 400 }"
        :scrollbar="true"
      >
        <template #caseResult="{ record }">
          <span :style="{ color: judgeResultColor(record.judgeResult) }">
            {{ formatJudgeResult(record.judgeResult) }}
          </span>
        </template>
        <template #caseInfo="{ record }">
          <a-descriptions
            :data="transformJudgeInfo(record.time, record.memory)"
            layout="inline-horizontal"
            size="small"
          />
        </template>
        <template #message="{ record }">
          <template v-if="record.input">
            <a-tabs size="mini">
              <a-tab-pane key="1" title="输入数据">
                <span style="white-space: pre-wrap">
                  {{ record.input }}
                </span>
              </a-tab-pane>
              <a-tab-pane key="2" title="正确输出">
                <span style="white-space: pre-wrap">
                  {{ record.expectOutput }}
                </span>
              </a-tab-pane>
              <a-tab-pane key="3" title="你的输出">
                <span style="white-space: pre-wrap">
                  {{ record.wrongOutput }}
                </span>
              </a-tab-pane>
            </a-tabs>
          </template>
          <template v-else>
            <span style="white-space: pre-wrap">
              {{ record.message }}
            </span>
          </template>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watchEffect } from "vue";
import {
  CaseInfo,
  QuestionSubmitControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import moment from "moment";
import { toNumber } from "@vue/shared";
import { useRoute } from "vue-router";
import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";
import CodeEditor from "@/components/CodeEditor.vue";
import store from "@/store";

const route = useRoute();
const wsRef = ref();
const tableRef = ref();
const caseRef = ref();
const isAdmin = ref(false);
const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionNum: NaN,
  questionTitle: "",
  userName: "",
  language: "",
  judgeResult: NaN,
  pageSize: 10,
  current: 1,
});
const columns = ref([
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
    title: "提交者",
    dataIndex: "userName",
    align: "center",
    width: 100,
  },
  {
    title: "编程语言",
    slotName: "language",
    align: "center",
    width: 100,
  },
  {
    title: "判题结果",
    slotName: "judgeResult",
    align: "center",
    width: 100,
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
    align: "center",
    width: 330,
  },
  {
    title: "提交时间",
    slotName: "createTime",
    align: "center",
    width: 170,
  },
]);

const caseColumns = ref([
  {
    dataIndex: "caseId",
    title: "编号",
    align: "center",
    width: 70,
  },
  {
    slotName: "caseResult",
    title: "判题结果",
    align: "center",
    width: 100,
  },
  {
    slotName: "caseInfo",
    title: "判题信息",
    align: "center",
    width: 330,
  },
  {
    slotName: "message",
    title: "错误信息",
  },
]);

const loadData = async () => {
  isAdmin.value = checkAccess(store.state.user.loginUser, ACCESS_ENUM.ADMIN);
  if (
    isAdmin.value &&
    !columns.value.some((col) => col.slotName === "actions")
  ) {
    columns.value.push({
      title: "操作",
      slotName: "actions",
      align: "center",
      width: 100,
    });
  }
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
  // 建立 WebSocket 连接
  var clientId = Math.random().toString(36).substr(2);
  const ws = new WebSocket("ws://localhost:8101/api/ws/" + clientId);
  ws.onmessage = (event) => {
    console.log("WebSocket message received:", event.data);
    loadData();
  };
  wsRef.value = ws;
});

// 组件卸载时关闭 WebSocket 连接
onUnmounted(() => {
  if (wsRef.value) {
    wsRef.value.close();
  }
});

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const isCodeModalVisible = ref(false);
const codeContent = ref("");
const codeLanguage = ref("");

const showCode = (code: string, language: string) => {
  codeContent.value = code;
  codeLanguage.value = language;
  isCodeModalVisible.value = true;
};
const isJudgeResultModalVisible = ref(false);
const caseInfoList = ref<CaseInfo[]>([]);
const showJudgeResult = (cases: CaseInfo[]) => {
  caseInfoList.value = cases;
  isJudgeResultModalVisible.value = true;
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
// 根据 judgeResult 返回对应的状态字符串
const formatJudgeResult = (judgeResult: number) => {
  switch (judgeResult) {
    case 0:
      return "等待判题";
    case 1:
      return "通过题目";
    case 2:
      return "答案错误";
    case 3:
      return "编译错误";
    case 4:
      return "运行错误";
    case 5:
      return "时间超限";
    case 6:
      return "内存超限";
    case 7:
      return "系统错误";
    case 8:
      return "无测评数据";
    default:
      return "未知状态";
  }
};

const judgeResultColor = (judgeResult: number) => {
  switch (judgeResult) {
    case 0:
      return "black";
    case 1:
      return "green";
    default:
      return "red";
  }
};
// 将 maxTime 和 maxMemory 对象转换为 descriptions 需要的数组形式
const transformJudgeInfo = (
  maxTime: number | null,
  maxMemory: number | null
) => {
  return [
    {
      label: "maxTime",
      value:
        maxTime !== null && maxTime !== undefined ? `${maxTime}ms` : "null",
    },
    {
      label: "maxMemory",
      value:
        maxMemory !== null && maxMemory !== undefined
          ? `${maxMemory}KB`
          : "null",
    },
  ];
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
