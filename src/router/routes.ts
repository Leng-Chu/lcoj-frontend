import { RouteRecordRaw } from "vue-router";
import UserLayout from "@/layouts/UserLayout.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import ACCESS_ENUM from "@/access/accessEnum";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import QuestionsView from "@/views/question/QuestionsView.vue";
import QuestionSubmitView from "@/views/question/QuestionSubmitView.vue";
import ViewQuestionView from "@/views/question/ViewQuestionView.vue";
import AddJudgeCaseView from "@/views/question/AddJudgeCaseView.vue";
import ViewUserView from "@/views/user/ViewUserView.vue";
import UserRankView from "@/views/user/UserRankView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    children: [
      {
        path: "/user/login",
        name: "用户登录",
        component: UserLoginView,
        meta: { title: "用户登录" },
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: UserRegisterView,
        meta: { title: "用户注册" },
      },
    ],
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/questions",
    name: "浏览题目",
    component: QuestionsView,
    meta: { title: "浏览题目" },
  },
  {
    path: "/manage/question/",
    name: "管理题目",
    component: ManageQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
      title: "管理题目",
    },
  },
  {
    path: "/question_submit",
    name: "评测状态",
    component: QuestionSubmitView,
    props: true,
    meta: {
      access: ACCESS_ENUM.USER,
      title: "评测状态",
    },
  },
  {
    path: "/view/question/:id",
    name: "在线做题",
    component: ViewQuestionView,
    props: true,
    meta: {
      access: ACCESS_ENUM.USER,
      hideInMenu: true,
      title: "在线做题",
    },
  },
  {
    path: "/add/question",
    name: "创建题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
      title: "创建题目",
    },
  },
  {
    path: "/rank",
    name: "做题排行",
    component: UserRankView,
    meta: {
      access: ACCESS_ENUM.USER,
      title: "做题排行",
    },
  },
  {
    path: "/update/question",
    name: "更新题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
      hideInMenu: true,
      title: "更新题目",
    },
  },
  {
    path: "/judgeCase",
    name: "管理测试用例",
    component: AddJudgeCaseView,
    props: true,
    meta: {
      access: ACCESS_ENUM.ADMIN,
      hideInMenu: true,
      title: "管理测试用例",
    },
  },
  {
    path: "/view/user",
    name: "个人信息",
    component: ViewUserView,
    meta: {
      access: ACCESS_ENUM.USER,
      hideInMenu: true,
      title: "个人信息",
    },
  },
  {
    path: "/",
    redirect: "/questions",
  },
];
