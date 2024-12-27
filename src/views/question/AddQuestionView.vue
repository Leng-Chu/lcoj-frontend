<template>
  <div id="addQuestionView">
    <h1>创建题目</h1>
    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="标题">
        <a-space direction="vertical" style="width: 800px">
          <a-input v-model="form.title" placeholder="请输入标题" />
        </a-space>
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-space direction="vertical" style="width: 800px">
          <a-input-tag
            v-model="form.tags"
            allow-clear
            placeholder="输入标签后回车"
          />
        </a-space>
      </a-form-item>
      <a-form-item :content-flex="false" :merge-props="false" label="判题配置">
        <a-space direction="vertical" style="width: 400px">
          <a-form-item field="judgeConfig.timeLimit" label="时间限制">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              allow-clear
              hide-button
              placeholder="请输入时间限制"
            >
              <template #suffix> ms</template>
            </a-input-number>
          </a-form-item>
          <a-form-item field="judgeConfig.memoryLimit" label="内存限制">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              allow-clear
              hide-button
              placeholder="请输入内存限制"
            >
              <template #suffix> MB</template>
            </a-input-number>
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item field="content" label="题目描述">
        <MdEditor
          :handle-change="onContentChange"
          :value="form.content"
          style="width: 800px"
        />
      </a-form-item>
      <a-form-item field="language" label="标程">
        <a-select
          v-model="form.language"
          placeholder="请选择编程语言"
          style="width: 400px"
        >
          <a-option value="none">不提供标程</a-option>
          <a-option value="java">Java</a-option>
          <a-option value="cpp">C++</a-option>
          <a-option value="python">Python</a-option>
        </a-select>
      </a-form-item>
      <a-form-item
        v-if="form.language && form.language !== 'none'"
        field="answer"
      >
        <CodeEditor
          :handle-change="onAnswerChange"
          :language="form.language"
          :value="form.answer"
          style="width: 800px"
        />
      </a-form-item>
      <a-form-item :content-flex="false" :merge-props="false" label="样例">
        <a-form-item
          v-for="(judgeCaseItem, index) of form.judgeCase"
          :key="index"
          no-style
        >
          <a-space
            direction="vertical"
            style="width: 800px; padding-bottom: 20px"
          >
            <a-space style="width: 800px">
              <a-textarea
                v-model="judgeCaseItem.input"
                :placeholder="`输入样例${index}`"
                allow-clear
                style="width: 400px; height: 200px"
              />
              <a-textarea
                v-model="judgeCaseItem.output"
                :placeholder="`输出样例${index}`"
                allow-clear
                style="width: 400px; height: 200px"
              />
            </a-space>
            <div style="display: flex; justify-content: flex-end">
              <a-button status="danger" @click="handleDelete(index)">
                删除
              </a-button>
            </div>
          </a-space>
        </a-form-item>
        <div style="margin-top: 10px">
          <a-button status="success" type="outline" @click="handleAdd"
            >新增样例
          </a-button>
        </div>
      </a-form-item>
      <div style="margin-top: 16px" />
      <a-form-item>
        <a-button style="width: 200px" type="primary" @click="doSubmit"
          >提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";
import CodeEditor from "@/components/CodeEditor.vue";

const router = useRouter();
const route = useRoute();
// 如果页面地址包含 update，视为更新页面
const updatePage = route.path.includes("update");

let form = ref({
  title: "",
  tags: [],
  language: "",
  answer: "",
  content: "",
  judgeConfig: {
    memoryLimit: 128,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
});

/**
 * 根据题目 id 获取老的数据
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    // json 转 js 对象
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 128,
        timeLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
    if (!form.value.language) {
      form.value.language = "none";
    }
  } else {
    message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

watch(
  () => form.value.language,
  (newLanguage) => {
    if (newLanguage === "none") {
      form.value.answer = "";
    }
  }
);

const doSubmit = async () => {
  if (!form.value.language) {
    form.value.language = "none";
  }
  console.log(form.value);
  // 区分更新还是创建
  if (updatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("更新成功");
      router.push({
        path: "/manage/question/",
        replace: true,
      });
    } else {
      message.error("更新失败，" + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("创建成功");
      router.push({
        path: "/questions",
        replace: true,
      });
    } else {
      message.error("创建失败，" + res.message);
    }
  }
};

/**
 * 新增判题样例
 */
const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};

/**
 * 删除判题样例
 */
const handleDelete = (index: number) => {
  form.value.judgeCase.splice(index, 1);
};

const onContentChange = (value: string) => {
  form.value.content = value;
};

const onAnswerChange = (value: string) => {
  form.value.answer = value;
};
</script>

<style scoped>
#addQuestionView {
  max-width: 1080px;
  margin: 0 auto;
}
</style>
