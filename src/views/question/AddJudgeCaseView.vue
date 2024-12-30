<template>
  <div id="addJudgeCaseView">
    <h1>管理测试用例 - {{ name }}</h1>
    <br />
    <a-upload
      :auto-upload="true"
      :data="{ num }"
      :draggable="true"
      :maxCount="100 - count"
      :multiple="true"
      :show-file-list="false"
      :tip="`最多允许上传100个文件；文件必须以.in或.out结尾，同一测试用例的文件名相对应；文件大小不能超过100MB`"
      accept=".in,.out"
      action="http://localhost:8101/api/file/upload"
      style="width: 1074px"
      @change="loadData"
      @before-upload="beforeUpload"
    />
    <div
      style="
        display: flex;
        justify-content: center;
        gap: 30px;
        padding: 20px 0 10px 0;
      "
    >
      <a-button status="success" type="outline" @click="downloadAllFiles"
        >下载全部测试数据
      </a-button>
      <a-button status="danger" type="outline" @click="deleteAllFiles"
        >删除全部测试数据
      </a-button>
    </div>
    <a-space :size="'large'">
      <a-table :columns="column1" :data="data1" :pagination="false">
        <template #action="{ rowIndex }">
          <a-space>
            <a-button type="secondary" @click="downloadFile(data1[rowIndex])"
              >下载
            </a-button>
            <a-button status="danger" @click="deleteFile(data1[rowIndex])"
              >删除
            </a-button>
          </a-space>
        </template>
      </a-table>
      <a-table :columns="column2" :data="data2" :pagination="false">
        <template #action="{ rowIndex }">
          <a-space>
            <a-button type="secondary" @click="downloadFile(data2[rowIndex])"
              >下载
            </a-button>
            <a-button status="danger" @click="deleteFile(data2[rowIndex])"
              >删除
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import message from "@arco-design/web-vue/es/message";
import { Case, FileControllerService } from "../../../generated";
import { toNumber } from "@vue/shared";
import axios from "axios";

const route = useRoute();
const column1 = [
  {
    title: "输入文件",
    dataIndex: "name",
    width: 200,
  },
  {
    title: "大小(Bytes)",
    dataIndex: "size",
    width: 150,
  },
  {
    title: "",
    dataIndex: "action",
    slotName: "action",
    width: 176.5,
  },
];
const column2 = [
  {
    title: "输出文件",
    dataIndex: "name",
    width: 200,
  },
  {
    title: "大小(Bytes)",
    dataIndex: "size",
    width: 150,
  },
  {
    title: "",
    dataIndex: "action",
    slotName: "action",
    width: 176.5,
  },
];
const data1 = reactive<Case[]>([]);
const data2 = reactive<Case[]>([]);
const num = toNumber(route.query.num);
const name = route.query.num + ": " + route.query.title;
let count = 0;
/**
 * 根据题目 id 获取测试数据
 */
const loadData = async () => {
  const res = await FileControllerService.listFilesUsingGet(num);
  if (res.code === 0) {
    data1.splice(0, data1.length, ...(res.data?.inputFiles ?? []));
    data2.splice(0, data2.length, ...(res.data?.outputFiles ?? []));
    count = data1.length + data2.length;
  } else {
    message.error("加载失败，" + res.message);
  }
};
onMounted(() => {
  loadData();
});

const beforeUpload = (file: File) => {
  //检查文件大小不能大于100MB
  if (file.size > 100 * 1024 * 1024) {
    message.error("单个文件大小不能超过100MB");
    return false;
  }
  return true;
};

const download = async (url: string, filename: string) => {
  try {
    const response = await axios({
      url: url,
      method: "GET",
      responseType: "blob",
    });
    const blob = new Blob([response.data], {
      type: "application/octet-stream",
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    message.error("下载失败，文件不存在");
    await loadData();
  }
};

const downloadFile = async (file: Case) => {
  const url = `http://localhost:8101/api/file/download?filename=${file.name}&num=${num}`;
  await download(url, file.name as string);
};

const downloadAllFiles = async () => {
  const url = `http://localhost:8101/api/file/downloadAll?num=${num}`;
  await download(url, `${num}.zip`);
};

const deleteFile = async (file: Case) => {
  const res = await FileControllerService.deleteFileUsingDelete(
    file.name as string,
    num
  );
  if (res.code !== 0) {
    message.error("删除失败，" + res.message);
  } else {
    message.success("删除成功");
    await loadData();
  }
};

const deleteAllFiles = async () => {
  const res = await FileControllerService.deleteAllFilesUsingDelete(num);
  if (res.code !== 0) {
    message.error("删除失败，" + res.message);
  } else {
    message.success("删除成功");
    await loadData();
  }
};
</script>

<style scoped>
#addJudgeCaseView {
  max-width: 1080px;
  margin: 0 auto;
}
</style>
