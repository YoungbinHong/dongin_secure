const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');

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
    readDirectory: async (dirPath) => {
        try {
            return await ipcRenderer.invoke('read-directory', dirPath);
        } catch (error) {
            console.error(`Error invoking read-directory for ${dirPath}:`, error);
            // 오류 발생 시, 호출하는 쪽에서 처리할 수 있도록 오류 정보 포함하여 반환
            return { success: false, error: error.message, files: [] };
        }
    },
    getFileStat: (filePath) => ipcRenderer.invoke('get-file-stat', filePath),
    fileExists: (filePath) => ipcRenderer.invoke('file-exists', filePath),
    checkAccess: (filePath) => ipcRenderer.invoke('check-access', filePath),
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
    deleteFile: (filePath) => ipcRenderer.invoke('delete-file', filePath),
    moveToTrash: (filePath) => ipcRenderer.invoke('move-to-trash', filePath),

    // ===== 파일 실행 =====
    openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),

    // ===== 자동 시작 =====
    checkAutoStart: () => ipcRenderer.invoke('check-auto-start'),
    setAutoStart: (enabled) => ipcRenderer.invoke('set-auto-start', enabled),

    // ===== 암호화/복호화 =====
    encryptFile: (filePath) => ipcRenderer.invoke('encrypt-file', filePath),
    decryptFile: (filePath) => ipcRenderer.invoke('decrypt-file', filePath),

    // ===== PDF 편집 =====
    // (PDF 편집 관련 API가 있다면 여기에 추가)

    // ===== AI Agent =====
    // (AI Agent 관련 API가 있다면 여기에 추가)
});
