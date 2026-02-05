const { contextBridge, ipcRenderer } = require('electron');

// 렌더러에 노출할 안전한 API만 정의
contextBridge.exposeInMainWorld('api', {
    // ===== 업데이트 =====
    onUpdateStatus: (callback) => ipcRenderer.on('update-status', callback),
    goToLogin: () => ipcRenderer.invoke('go-to-login'),


    // ===== 경로 관련 =====
    getHomePath: () => ipcRenderer.invoke('get-home-path'),
    getPlatform: () => ipcRenderer.invoke('get-platform'),
    getPathSep: () => ipcRenderer.invoke('get-path-sep'),
    joinPath: (...args) => ipcRenderer.invoke('join-path', ...args),
    getBasename: (filePath, ext) => ipcRenderer.invoke('get-basename', filePath, ext),
    getExtname: (filePath) => ipcRenderer.invoke('get-extname', filePath),

    // ===== 파일 시스템 =====
    readDirectory: (dirPath) => ipcRenderer.invoke('read-directory', dirPath),
    getFileStat: (filePath) => ipcRenderer.invoke('get-file-stat', filePath),
    fileExists: (filePath) => ipcRenderer.invoke('file-exists', filePath),
    checkAccess: (filePath) => ipcRenderer.invoke('check-access', filePath),
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
    deleteFile: (filePath) => ipcRenderer.invoke('delete-file', filePath),
    moveToTrash: (filePath) => ipcRenderer.invoke('move-to-trash', filePath),

    // ===== 암호화/복호화 =====
    encryptFile: (filePath) => ipcRenderer.invoke('encrypt-file', filePath),
    decryptFile: (filePath) => ipcRenderer.invoke('decrypt-file', filePath),

    // ===== 시스템 =====
    openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
    checkAutoStart: () => ipcRenderer.invoke('check-auto-start'),
    setAutoStart: (enabled) => ipcRenderer.invoke('set-auto-start', enabled),
});
