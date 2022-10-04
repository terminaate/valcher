import { app, BrowserWindow, Menu, Tray } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

const {
	setupTitlebar,
	attachTitlebarToWindow,
} = require('custom-electron-titlebar/main');

setupTitlebar();

let mainWindow = null;

// TODO
// add loader of application

function createWindow() {
	mainWindow = new BrowserWindow({
		minHeight: 480,
		minWidth: 850,
		height: 480,
		width: 850,
		resizable: true,
		center: true,
		// autoHideMenuBar: true, // hide menubar on top
		titleBarStyle: 'hidden',
		webPreferences: {
			sandbox: false,
			preload: path.join(__dirname, 'preload.js'),
			devTools: process.env.npm_lifecycle_event === 'dev:server',
		},
		icon: path.join(__dirname, './assets/logo.ico'),
	});

	attachTitlebarToWindow(mainWindow);

	require('./server/index.js');

	const loadingInterval = setInterval(() => {
		if (
			fs.readdirSync(path.resolve(__dirname, '')).includes('client') &&
			fs.readdirSync(path.resolve(__dirname, './client')).includes('index.html')
		) {
			mainWindow.loadURL('http://127.0.0.1:19245');
			clearInterval(loadingInterval);
		}
	}, 1);
}

let tray = null;
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
	app.quit();
} else {
	app.on('second-instance', () => {
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus();
		}
	});

	app.whenReady().then(() => {
		tray = new Tray(path.join(__dirname, './assets/logo.ico'));
		const contextMenu = Menu.buildFromTemplate([
			{
				label: 'Open',
				type: 'normal',
				click: () => {
					if (!mainWindow) {
						createWindow();
					} else {
						if (mainWindow.isMinimized()) mainWindow.restore();
						mainWindow.focus();
					}
				},
			},
			{
				label: 'Exit',
				type: 'normal',
				click: () => {
					app.quit();
					process.exit(0);
				},
			},
		]);

		tray.setContextMenu(contextMenu);
		createWindow();
	});
}

app.on('window-all-closed', () => {
	console.log('All windows all closed');
	mainWindow = null;
});
