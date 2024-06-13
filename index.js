// Copyright 2024 Steve Nginyo
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     https://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// electron-packager . --platform=win32 --overwrite --icon="D:\Steve Projects\DevMotors\src\assets\icon\favicon.ico" --ignore="^.*\.angular" --ignore="^.*\.firebase" --ignore="^.*\.github" --ignore="^.*\.vscode" --ignore="^.*\android" --ignore="\/node_modules" --ignore="\/src" --ignore="\/functions" --ignore="^.*\.browserslistrc" --ignore="^.*\.eslintrc.json" --ignore="^.*\.firebase" --ignore="\/.gitignore"  --ignore="\/firestore.rules" --ignore="^.*\.editorconfig" --ignore="\/firebase.json" --ignore="^.*\angular.json" --ignore="\/build_installer.js" --ignore="\/storage.rules" --ignore="\/firestore.indexes.json" --ignore="\/tsconfig.app.json" --ignore="\/ionic.config.json" --ignore="\/karma.conf.js" --ignore="\/capacitor.config.ts" --ignore="\/tsconfig.json" --ignore="\/tsconfig.spec.json"

const { app, BrowserWindow } = require('electron')
// require('./server')

let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1900, 
    height: 1320,
    backgroundColor: '#ffffff',
    icon: `assets/icon/favicon.ico`,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true,
      javascript: true //**** add this**
    }
  })


  win.loadURL(`${__dirname}/www/index.html`)

  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  // --icon=assets/icon/favicon.png
  win.on('closed', function () {
    win = null
  })
}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})