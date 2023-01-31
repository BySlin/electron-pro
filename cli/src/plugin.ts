import type { IApi } from "father";

export default (api: IApi) => {
  api.describe({
    key: "electronPro",
    config: {
      default: {},
      schema(joi) {
        return joi.object();
      },
    },
  });
};
