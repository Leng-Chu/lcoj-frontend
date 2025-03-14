<template>
  <div id="viewUserView">
    <h1>个人信息 - {{ searchParams.userName }}</h1>
    <br />
    <a-space :size="'large'" align="start">
      <a-list :data="dataList" :hoverable="true" style="width: 805px">
        <template #header><span class="header-text">最近提交</span></template>
        <template #item="{ item: x }">
          <a-list-item>
            <div
              style="
                display: grid;
                grid-template-columns: 8fr 3fr 3fr;
                align-items: center;
                cursor: pointer;
              "
              @click="
                searchParams.userName === store.state.user.loginUser.userName ||
                store.state.user.loginUser.userRole === ACCESS_ENUM.ADMIN
                  ? showCode(x.code, x.language)
                  : router.push({ path: `/view/question/${x.questionId}` })
              "
            >
              <span>
                <router-link
                  :to="{ path: `/view/question/${x.questionId}` }"
                  class="custom-link"
                >
                  {{ x.questionNum + ". " + x.questionTitle }}
                </router-link>
              </span>
              <span :style="{ color: judgeResultColor(x.judgeResult) }">
                {{ formatJudgeResult(x.judgeResult) }}
              </span>
              <span>{{
                moment(x.createTime).format("YYYY-MM-DD HH:mm:ss")
              }}</span>
            </div>
          </a-list-item>
        </template>
      </a-list>
      <a-list style="width: 250px">
        <template #header><span class="header-text">统计</span></template>
        <a-list-item>{{ "通过率：" + passRate + "%" }}</a-list-item>
        <a-list-item>{{ "提交总数：" + data.submitCount + " 次" }}</a-list-item>
        <a-list-item
          >{{ "提交通过：" + data.acceptCount + " 次" }}
        </a-list-item>
        <a-list-item>{{ "答案错误：" + data.wrongCount + " 次" }}</a-list-item>
        <a-list-item
          >{{ "编译错误：" + data.compileErrorCount + " 次" }}
        </a-list-item>
        <a-list-item
          >{{ "运行错误：" + data.runtimeErrorCount + " 次" }}
        </a-list-item>
        <a-list-item
          >{{ "时间超限：" + data.timeLimitCount + " 次" }}
        </a-list-item>
        <a-list-item
          >{{ "内存超限：" + data.memoryLimitCount + " 次" }}
        </a-list-item>
      </a-list>
    </a-space>
    <a-divider />
    <h3>{{ "已解答题目 ( " + acceptList.length + " )" }}</h3>
    <div class="question-links-container">
      <router-link
        v-for="question in acceptList"
        :key="question.id"
        :to="{ path: `/view/question/${question.id}` }"
        class="question-link"
      >
        {{ question.num }}
      </router-link>
    </div>
    <a-divider />
    <h3>{{ "尝试过的题目 ( " + failList.length + " )" }}</h3>
    <div class="question-links-container">
      <router-link
        v-for="question in failList"
        :key="question.id"
        :to="{ path: `/view/question/${question.id}` }"
        class="question-link"
      >
        {{ question.num }}
      </router-link>
    </div>
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
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import message from "@arco-design/web-vue/es/message";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import CodeEditor from "@/components/CodeEditor.vue";
import moment from "moment/moment";
import { useRoute, useRouter } from "vue-router";
import ACCESS_ENUM from "@/access/accessEnum";

const router = useRouter();
const route = useRoute();
const store = useStore();
const dataList = ref([]);
const data = ref({});
const acceptList = ref<Array<Question>>([]);
const failList = ref<Array<Question>>([]);
let passRate = ref("");

const isCodeModalVisible = ref(false);
const codeContent = ref("");
const codeLanguage = ref("");
const showCode = (code: string, language: string) => {
  codeContent.value = code;
  codeLanguage.value = language;
  isCodeModalVisible.value = true;
};

const searchParams = ref<QuestionSubmitQueryRequest>({
  userName: route.query.userName
    ? route.query.userName
    : store.state.user.loginUser.userName,
  pageSize: 8,
  current: 1,
});

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
/**
 * 加载个人提交记录
 */
const loadData = async () => {
  const res1 =
    await QuestionSubmitControllerService.listQuestionSubmitByPageUsingPost({
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    });
  if (res1.code === 0) {
    dataList.value = res1.data.records;
  } else {
    message.error("加载失败，" + res1.message);
  }
  const res2 =
    await QuestionSubmitControllerService.countQuestionSubmitUsingPost(
      searchParams.value.userName
    );
  if (res2.code === 0) {
    data.value = res2.data;
    if (res2.data.submitCount === 0) {
      passRate.value = "0.00";
    } else
      passRate.value = (
        (res2.data.acceptCount / res2.data.submitCount) *
        100
      ).toFixed(2);
  } else {
    message.error("加载失败，" + res2.message);
  }
  const res3 = await QuestionControllerService.getAcceptQuestionUsingGet(
    searchParams.value.userName
  );
  if (res3.code === 0) {
    if (res3.data) {
      acceptList.value = res3.data;
    }
  } else {
    message.error("加载失败，" + res3.message);
  }
  const res4 = await QuestionControllerService.getFailQuestionUsingGet(
    searchParams.value.userName
  );
  if (res4.code === 0) {
    if (res4.data) {
      failList.value = res4.data;
    }
  } else {
    message.error("加载失败，" + res4.message);
  }
};
onMounted(() => {
  loadData();
});
</script>

<style scoped>
#viewUserView {
  max-width: 1080px;
  margin: 0 auto;
}

.header-text {
  font-weight: bold;
  font-size: 16px;
}

.custom-link {
  color: #1890ff;
  text-decoration: none;
}

.custom-link:hover {
  text-decoration: underline;
  cursor: pointer;
}

.question-links-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.question-link {
  background-color: #fafafa;
  border-radius: 5px;
  padding: 5px 10px;
  text-decoration: none;
  color: #007acc;
  transition: background-color 0.3s, color 0.3s;
}

.question-link:hover {
  background-color: #eeeeee;
  color: #005f99;
}
</style>
