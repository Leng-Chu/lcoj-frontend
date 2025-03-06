# LCOJ判题系统-前端

## 生成代码

```shell
openapi --input http://localhost:8101/api/v2/api-docs --output ./generated --client axios
```

修改generated/core/OpenAPI.ts中的OpenAPIConfig，删除BASE中的/api，将WITH_CREDENTIALS设置为true。

## 启动项目

### serve

```shell
vue-cli-service serve
```

### build

```shell
vue-cli-service build
```

### lint

```shell
vue-cli-service lint
```
