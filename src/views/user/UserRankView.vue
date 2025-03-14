<template>
  <div id="userRankView">
    <h1>做题排行</h1>
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
      <template #rank="{ record }">
        {{ record.rank }}
      </template>
      <template #userName="{ record }">
        <router-link
          :to="{
            path: `/view/user`,
            query: {
              userName: record.userName,
            },
          }"
          class="custom-link"
        >
          {{ record.userName }}
        </router-link>
      </template>
      <template #acceptedNum="{ record }">
        {{ record.acceptedNum }}
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { UserControllerService } from "../../../generated";
import { toNumber } from "@vue/shared";
import message from "@arco-design/web-vue/es/message";

const tableRef = ref();
const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  current: 1,
  pageSize: 20,
});
const columns = [
  {
    title: "排名",
    slotName: "rank",
    align: "center",
    width: 200,
  },
  {
    title: "用户名",
    slotName: "userName",
    width: 650,
    align: "center",
  },
  {
    title: "通过数",
    slotName: "acceptedNum",
    align: "center",
    width: 200,
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};
const loadData = async () => {
  const res = await UserControllerService.getRankByPageUsingPost(
    searchParams.value.current,
    searchParams.value.pageSize
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = toNumber(res.data.total);
  } else {
    message.error("加载失败，" + res.message);
  }
};
onMounted(() => {
  loadData();
});
</script>

<style scoped>
#userRankView {
  max-width: 1080px;
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
