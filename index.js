const { app, BrowserWindow } = require("electron");
const { ipcMain } = require("electron");
const { execFile } = require("child_process");
const os = require("os")
var downloadDir = os.homedir() + `\\Downloads`

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
  win.webContents.openDevTools()
}
app.whenReady().then(() => {
  createWindow();
  console.log(downloadDir);
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
ipcMain.on("data", (event, data) => {
  let url = data["url"].trim();
  let password = data["password"].trim();
  if (password == "") {
    execFile("libs/youtube-dl.exe", [`${url}`, "--output", downloadDir + '\\ZoomDownloads\\%(title)s.%(ext)s'], (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      console.log();
      // event.sender.send("output", stdout);
      event.sender.send("output", "Your file is downloaded at " + downloadDir + "\\ZoomDownloads")
    });
  } else {
    execFile(
      "libs/youtube-dl.exe",
      [`${url}`, "--video-password", `${password}`, "-o", downloadDir],
      (error, stdout, stderr) => {
        if (error) {
          throw error;
        }
        event.sender.send("output", "Your file is downloaded at " + downloadDir + "\\ZoomDownloads");
      }
    );
  }
});
