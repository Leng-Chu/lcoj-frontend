<template>
  <div id="questionsView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="num" label="题号" style="width: 180px">
        <a-input-number
          v-model="searchParams.num"
          :max="100000"
          :min="1"
          placeholder="请输入题号"
        />
      </a-form-item>
      <a-form-item field="title" label="标题" style="width: 240px">
        <a-input v-model="searchParams.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="tags" label="标签" style="width: 300px">
        <a-input-tag v-model="searchParams.tags" placeholder="输入标签后回车" />
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
      <template #num="{ record }">
        <a-button
          :style="{
            backgroundColor:
              record.status === 0
                ? '#FF4444'
                : record.status === 1
                ? '#5cb85c'
                : '#F2F3F5',
            color: record.status === 2 ? 'black' : 'white',
          }"
          @click="toQuestionPage(record)"
        >
          {{ record.num }}
        </a-button>
      </template>
      <template #title="{ record }">
        <router-link
          :to="{ path: `/view/question/${record.id}` }"
          class="custom-link"
        >
          {{ record.title }}
        </router-link>
      </template>
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="green"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        {{
          record.submitNum
            ? ((record.acceptedNum / record.submitNum) * 100).toFixed(2)
            : "0.00"
        }}% ({{ record.acceptedNum }}/{{ record.submitNum }})
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="toQuestionPage(record)">
            做题
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";
import { toNumber } from "@vue/shared";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionQueryRequest>({
  num: NaN,
  title: "",
  tags: [],
  pageSize: 20,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost({
    ...searchParams.value,
    sortField: "num",
    sortOrder: "ascend",
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
watch(
  () => searchParams.value,
  () => {
    loadData();
  },
  { deep: true }
);

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

// {id: "1", title: "A+ D", content: "新的题目内容", tags: "["二叉树"]", answer: "新的答案", submitNum: 0,…}

const columns = [
  {
    title: "题号",
    slotName: "num",
    align: "center",
    width: 120,
  },
  {
    title: "标题",
    slotName: "title",
    width: 500,
  },
  {
    title: "标签",
    slotName: "tags",
    align: "center",
    width: 350,
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
    align: "center",
    width: 200,
  },
  {
    slotName: "optional",
    width: 100,
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const router = useRouter();

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
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
</script>

<style scoped>
#questionsView {
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
