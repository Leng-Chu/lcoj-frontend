<template>
  <div id="manageQuestionView">
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
      <a-form-item field="userName" label="创建者" style="width: 240px">
        <a-input v-model="searchParams.userName" placeholder="请输入创建者" />
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
        <router-link
          :to="{ path: `/view/question/${record.id}` }"
          class="custom-link"
        >
          {{ record.num }}
        </router-link>
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
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #updateTime="{ record }">
        {{ moment(record.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="doUpdate(record)"> 修改</a-button>
          <a-button status="danger" @click="doDelete(record)">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment/moment";
import { toNumber } from "@vue/shared";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  num: undefined,
  title: "",
  userName: "",
  tags: [],
  pageSize: 20,
  current: 1,
});

const loadData = async () => {
  const res =
    await QuestionControllerService.listQuestionManageVoByPageUsingPost({
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

const columns = [
  {
    title: "题号",
    slotName: "num",
    align: "center",
    width: 80,
  },
  {
    title: "标题",
    slotName: "title",
    width: 300,
  },
  {
    title: "标签",
    slotName: "tags",
    align: "center",
  },
  {
    title: "创建者",
    dataIndex: "userName",
    align: "center",
  },
  {
    title: "创建时间",
    slotName: "createTime",
    align: "center",
  },
  {
    title: "更新时间",
    slotName: "updateTime",
    align: "center",
  },
  {
    title: "操作",
    slotName: "optional",
    align: "center",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const doDelete = async (question: Question) => {
  const res = await QuestionControllerService.deleteQuestionUsingPost({
    id: question.id,
  });
  if (res.code === 0) {
    message.success("删除成功");
    loadData();
  } else {
    message.error("删除失败");
  }
};

const router = useRouter();
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
const doUpdate = (question: Question) => {
  router.push({
    path: "/update/question",
    query: {
      id: question.id,
    },
  });
};
</script>

<style scoped>
#manageQuestionView {
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
