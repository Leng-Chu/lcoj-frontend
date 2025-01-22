import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router/routes";
import { QuestionControllerService } from "../../generated";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    if (to.name === "在线做题" && to.params.id) {
      // Fetch the question title using the question ID
      QuestionControllerService.getQuestionVoByIdUsingGet(
        to.params.id as any
      ).then((res) => {
        if (res.code === 0) {
          document.title = res.data?.title as string;
        } else {
          document.title = to.meta.title as string;
        }
        next();
      });
    } else {
      document.title = to.meta.title as string;
      next();
    }
  } else {
    next();
  }
});

export default router;
