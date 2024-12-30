<template>
  <div id="addQuestionView">
    <h1>{{ updatePage ? "更新题目" : "创建题目" }}</h1>
    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="标题">
        <a-space direction="vertical" style="width: 800px">
          <a-input v-model="form.title" placeholder="请输入标题" />
        </a-space>
      </a-form-item>
      <a-form-item field="num" label="题号">
        <a-space direction="vertical" style="width: 800px">
          <a-input-number
            v-model="form.num"
            :max="100000"
            :min="1"
            placeholder="请输入题号"
          />
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
      <a-form-item v-if="updatePage" field="judgeCase" label="测试用例">
        <a-button style="width: 200px" type="outline" @click="manageJudgeCase">
          管理测试用例
        </a-button>
      </a-form-item>
      <a-form-item :content-flex="false" :merge-props="false" label="样例">
        <a-form-item
          v-for="(sampleCaseItem, index) of form.sampleCase"
          :key="index"
          no-style
        >
          <a-space
            direction="vertical"
            style="width: 800px; padding-bottom: 20px"
          >
            <a-space style="width: 800px">
              <a-textarea
                v-model="sampleCaseItem.input"
                :placeholder="`输入样例${index}`"
                allow-clear
                style="width: 400px; height: 200px"
              />
              <a-textarea
                v-model="sampleCaseItem.output"
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
import { toNumber } from "@vue/shared";

const router = useRouter();
const route = useRoute();
// 如果页面地址包含 update，视为更新页面
let updatePage = route.path.includes("update");

let form = ref({
  title: "",
  num: NaN,
  tags: [],
  language: "",
  answer: "",
  content: "",
  judgeConfig: {
    memoryLimit: 256,
    timeLimit: 1000,
  },
  sampleCase: [
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
    const res = await QuestionControllerService.getNextNumUsingGet();
    if (res.code !== 0) {
      message.error("加载失败，" + res.message);
    }
    form.value = {
      title: "",
      num: toNumber(res.data),
      tags: [],
      language: "",
      answer: "",
      content: "",
      judgeConfig: {
        memoryLimit: 256,
        timeLimit: 1000,
      },
      sampleCase: [
        {
          input: "",
          output: "",
        },
      ],
    };
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    form.value.num = toNumber(form.value.num);
    // json 转 js 对象
    if (!form.value.sampleCase) {
      form.value.sampleCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.sampleCase = JSON.parse(form.value.sampleCase as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 256,
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

watch(
  () => route.path,
  (newPath) => {
    updatePage = newPath.includes("update");
    loadData();
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
        path: "/judgeCase",
        query: {
          num: form.value.num,
          title: form.value.title,
        },
      });
    } else {
      message.error("创建失败，" + res.message);
    }
  }
};

const handleAdd = () => {
  form.value.sampleCase.push({
    input: "",
    output: "",
  });
};
const handleDelete = (index: number) => {
  form.value.sampleCase.splice(index, 1);
};

const onContentChange = (value: string) => {
  form.value.content = value;
};

const onAnswerChange = (value: string) => {
  form.value.answer = value;
};

const manageJudgeCase = () => {
  router.push({
    path: "/judgeCase",
    query: {
      num: form.value.num,
      title: form.value.title,
    },
  });
};
</script>

<style scoped>
#addQuestionView {
  max-width: 1080px;
  margin: 0 auto;
}
</style>
