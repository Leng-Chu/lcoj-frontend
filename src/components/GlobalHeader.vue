<template>
  <a-row id="globalHeader" :wrap="false" align="center">
    <a-col flex="auto">
      <a-menu
        :selected-keys="selectedKeys"
        mode="horizontal"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/oj-logo.png" />
            <div class="title">LCOJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <!-- 未登录状态 -->
      <a-link v-if="!store.state.user.loginUser.userName" @click="doLogin"
        >未登录
      </a-link>
      <!-- 已登录状态 -->
      <a-popover v-else position="bottom" trigger="click">
        <a-link>{{ store.state.user.loginUser.userName }}</a-link>
        <template #content>
          <p class="logout" @click="doLogout">退出登录</p>
        </template>
      </a-popover>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { routes } from "../router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";
import message from "@arco-design/web-vue/es/message";
import { UserControllerService } from "../../generated";

const router = useRouter();
const store = useStore();

// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

// 默认主页
const selectedKeys = ref(["/"]);

// 路由跳转后，更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

console.log();

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

const doLogin = () => {
  router.push("/user/login");
};

const doLogout = async () => {
  //调用logout接口
  await UserControllerService.userLogoutUsingPost();
  store.state.user.loginUser = {
    userName: "",
    userRole: ACCESS_ENUM.NOT_LOGIN,
  };
  message.success("退出成功");
  await router.push({ path: "/questions" });
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 48px;
}

.logout {
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
}
</style>
