import { runApp } from "electron-pro";
import { app } from "electron";

runApp();

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
