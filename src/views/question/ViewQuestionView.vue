<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24" style="max-height: 80vh; overflow-y: auto">
        <h1 v-if="question">{{ question.num }}. {{ question.title }}</h1>
        <div v-if="question" style="display: flex; padding-bottom: 5px">
          <a-space style="padding-left: 17px">
            <a-descriptions v-if="question" :column="{ xs: 1, md: 2, lg: 3 }">
              <a-descriptions-item label="时间限制">
                {{ `${question.judgeConfig.timeLimit ?? 0}ms` }}
              </a-descriptions-item>
              <a-descriptions-item label="内存限制">
                {{ `${question.judgeConfig.memoryLimit ?? 0}MB` }}
              </a-descriptions-item>
            </a-descriptions>
          </a-space>
          <a-space style="flex: 1; justify-content: flex-end" wrap>
            <a-tag
              v-for="(tag, index) of question.tags"
              :key="index"
              color="green"
              >{{ tag }}
            </a-tag>
          </a-space>
        </div>
        <a-card v-if="question" title="题目描述">
          <MdViewer :value="question.content || ''" />
        </a-card>
        <a-card v-if="question" title="样例">
          <a-table
            :columns="columns"
            :data="question.sampleCase"
            :pagination="false"
            style="white-space: pre-wrap"
          >
          </a-table>
        </a-card>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-form :model="form" layout="inline">
          <a-form-item
            field="language"
            label="编程语言"
            style="min-width: 240px"
          >
            <a-select
              v-model="form.language"
              :style="{ width: '320px' }"
              placeholder="选择编程语言"
            >
              <a-option value="java">Java</a-option>
              <a-option value="cpp">C++</a-option>
              <a-option value="python">Python</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <CodeEditor
          :handle-change="changeCode"
          :language="form.language"
          :value="form.code as string"
        />
        <a-divider size="0" />
        <a-button style="min-width: 200px" type="primary" @click="doSubmit">
          提交代码
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref, withDefaults } from "vue";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitControllerService,
  QuestionVO,
} from "../../../generated";
import { useRouter } from "vue-router";

interface Props {
  id: string;
}

const router = useRouter();
const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});
const columns = [
  {
    title: "输入",
    dataIndex: "input",
  },
  {
    title: "输出",
    dataIndex: "output",
  },
];

const question = ref<QuestionVO>();

const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败，" + res.message);
  }
};

const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
});

/**
 * 提交代码
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }

  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
    router.push({
      path: "/question_submit",
      replace: true,
    });
  } else {
    message.error("提交失败," + res.message);
  }
};

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const changeCode = (value: string) => {
  form.value.code = value;
};
</script>

<style>
#viewQuestionView {
  max-width: 1400px;
  margin: 0 auto;
}

#viewQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}
</style>
