/**
 * 数学星环 - 存储管理模块
 * 处理本地存储的持久化和读取
 */

import { createInitialGameState } from './data.js';

const STORAGE_KEY = 'mathStarRing_save_v1';

/**
 * 保存游戏状态到 localStorage
 * @param {Object} gameState - 游戏状态对象
 */
export function saveGame(gameState) {
  try {
    const saveData = {
      ...gameState,
      lastSaved: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    console.log('游戏已保存');
  } catch (error) {
    console.error('保存失败:', error);
  }
}

/**
 * 从 localStorage 加载游戏状态
 * @returns {Object|null} 游戏状态对象，如果没有则返回 null
 */
export function loadGame() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('游戏已加载');
      return parsed;
    }
  } catch (error) {
    console.error('加载失败:', error);
  }
  return null;
}

/**
 * 清除保存的游戏数据
 */
export function clearSave() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('存档已清除');
  } catch (error) {
    console.error('清除失败:', error);
  }
}

/**
 * 检查是否有保存的游戏
 * @returns {boolean}
 */
export function hasSave() {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

/**
 * 自动保存（带防抖）
 * @param {Object} gameState - 游戏状态对象
 * @param {Function} callback - 保存后的回调
 */
let autoSaveTimeout = null;
export function autoSave(gameState, callback) {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }
  
  autoSaveTimeout = setTimeout(() => {
    saveGame(gameState);
    if (callback) callback();
  }, 1000); // 1 秒防抖
}

/**
 * 导出存档为 JSON 文件
 * @param {Object} gameState - 游戏状态对象
 */
export function exportSave(gameState) {
  const dataStr = JSON.stringify(gameState, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `math-star-ring-save-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 从 JSON 文件导入存档
 * @returns {Promise<Object|null>} 导入的游戏状态
 */
export function importSave() {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) {
        resolve(null);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const gameState = JSON.parse(event.target.result);
          // 验证基本结构
          if (gameState.coins !== undefined && gameState.completed !== undefined) {
            saveGame(gameState);
            resolve(gameState);
          } else {
            console.error('无效的存档格式');
            resolve(null);
          }
        } catch (error) {
          console.error('解析存档失败:', error);
          resolve(null);
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  });
}

/**
 * 获取存档信息（不加载完整数据）
 * @returns {Object|null}
 */
export function getSaveInfo() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      return {
        lastSaved: data.lastSaved || null,
        level: data.level || 1,
        completedCount: data.completed?.length || 0,
        coins: data.coins || 0
      };
    } catch {
      return null;
    }
  }
  return null;
}
