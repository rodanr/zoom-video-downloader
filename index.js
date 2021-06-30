const { app, BrowserWindow } = require("electron");
const { ipcMain } = require("electron");
const { execFile } = require("child_process");

function createWindow() {
  const win = new BrowserWindow({
    width: 840,
    height: 640,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile("index.html");
  win.setMenu(null);
  win.setIcon("src/title-bar-icon.png");
}
app.whenReady().then(() => {
  createWindow();
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
ipcMain.on("data", (event, data) => {
  let url = data["url"].trim();
  let password = data["password"].trim();
  if (password == "") {
    execFile("libs/youtube-dl.exe", [`${url}`], (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      console.log();
      event.sender.send("output", stdout);
    });
  } else {
    execFile(
      "libs/youtube-dl.exe",
      [`${url}`, "--video-password", `${password}`],
      (error, stdout, stderr) => {
        if (error) {
          throw error;
        }
        event.sender.send("output", stdout);
      }
    );
  }
});
