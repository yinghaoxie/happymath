/**
 * 数学星环 - 主应用入口
 * 整合所有模块，初始化应用
 */

import { GALAXIES, GAME_CONFIG, createInitialGameState } from './data.js';
import { saveGame, loadGame, autoSave } from './storage.js';
import { 
  createStars, 
  renderGalaxyMap, 
  renderAchievements, 
  renderMonsters,
  renderVideos,
  updateStatsDisplay,
  drawRadarChart,
  showModal,
  escapeHtml
} from './renderer.js';

// 全局游戏状态
let gameState = createInitialGameState();
let currentGalaxyId = null;

/**
 * 初始化应用
 */
function init() {
  // 尝试加载存档
  const saved = loadGame();
  if (saved) {
    gameState = { ...createInitialGameState(), ...saved };
  }
  
  // 创建星空背景
  const starsContainer = document.getElementById('stars');
  createStars(starsContainer);
  
  // 初始渲染
  renderAll();
  
  // 绑定全局函数（供 HTML 调用）
  window.handleGalaxyClick = handleGalaxyClick;
  window.purifyMonster = purifyMonster;
  window.showSkipModal = showSkipModal;
  window.confirmSkip = confirmSkip;
  window.completeChallenge = completeChallenge;
  
  console.log('数学星环已初始化 🚀');
}

/**
 * 渲染所有组件
 */
function renderAll() {
  renderGalaxyMap(document.getElementById('galaxy-grid'), gameState);
  renderAchievements(document.getElementById('achievements-grid'), gameState);
  renderMonsters(document.getElementById('monster-grid'), gameState);
  updateStatsDisplay(gameState);
}

/**
 * 开始游戏（关闭启动画面）
 */
function startGame() {
  const splash = document.getElementById('splash');
  if (splash) {
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.style.display = 'none';
      document.getElementById('main-app').style.display = 'block';
    }, 1000);
  }
}

/**
 * 切换页面
 * @param {string} pageId - 页面 ID
 */
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const targetPage = document.getElementById('page-' + pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // 更新导航按钮状态
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.style.color = btn.dataset.page === pageId ? '#fbbf24' : '#c7d2fe';
  });
  
  // 特殊页面处理
  if (pageId === 'profile') {
    const canvas = document.getElementById('radarCanvas');
    if (canvas) drawRadarChart(canvas, gameState.stats);
  }
  
  if (pageId !== 'learn') {
    removeFloatingSkip();
  }
  
  window.scrollTo(0, 0);
  
  // 自动保存
  autoSave(gameState);
}

/**
 * 进入星系关卡
 * @param {number} id - 星系 ID
 */
function handleGalaxyClick(id) {
  const galaxy = GALAXIES.find(g => g.id === id);
  if (!galaxy) return;
  
  // 检查是否锁定
  const isLocked = id > 1 && 
                   !gameState.completed.includes(id - 1) &&
                   !gameState.skipped.includes(id - 1);
  
  if (isLocked) {
    showModal(`
      <h3 class="modal-title">🔒 关卡未解锁</h3>
      <p style="color: #c7d2fe; margin-bottom: 1.5rem;">请先完成第 ${id - 1} 关</p>
      <button class="action-btn primary" onclick="document.querySelector('.modal-overlay').remove()">我知道了</button>
    `);
    return;
  }
  
  currentGalaxyId = id;
  showPage('learn');
  renderLearningPage(id);
  
  // 添加浮动跳过按钮
  addFloatingSkip(id);
}

/**
 * 渲染学习页面内容
 * @param {number} galaxyId - 星系 ID
 */
function renderLearningPage(galaxyId) {
  const galaxy = GALAXIES.find(g => g.id === galaxyId);
  if (!galaxy) return;
  
  const content = document.getElementById('learning-content');
  if (!content) return;
  
  const npcDialogue = galaxy.npc === 'gauss' 
    ? "欢迎来到我的数学星球！我是高斯，今天我们一起探索数学的奥秘。"
    : "咕咕~ 我是智慧猫头鹰，让我带你领略几何的美妙。";
  
  content.innerHTML = `
    <div style="margin-bottom: 2rem;">
      <button class="back-btn" onclick="showPage('map')" aria-label="返回地图">
        ← 返回星系地图
      </button>
    </div>
    
    <div style="background: rgba(99, 102, 241, 0.2); border-radius: 20px; padding: 2rem; margin-bottom: 2rem;">
      <div style="font-size: 4rem; text-align: center; margin-bottom: 1rem;">${galaxy.icon}</div>
      <h2 style="text-align: center; color: #fbbf24; font-size: 2rem; margin-bottom: 0.5rem;">
        ${escapeHtml(galaxy.name)}
      </h2>
      <p style="text-align: center; color: #c7d2fe; font-size: 1.1rem;">${escapeHtml(galaxy.topic)}</p>
      
      <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(0, 0, 0, 0.3); border-radius: 12px;">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
          <span style="font-size: 2rem;">${galaxy.npc === 'gauss' ? '🧙' : '🦉'}</span>
          <div>
            <div style="color: #fbbf24; font-weight: bold;">${galaxy.npc === 'gauss' ? '高斯' : '智慧猫头鹰'}</div>
            <div style="color: #c7d2fe; font-size: 0.95rem;">${npcDialogue}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div style="text-align: center; margin-bottom: 2rem;">
      <h3 style="color: #fbbf24; margin-bottom: 1rem;">配套教学视频</h3>
      <div id="video-container"></div>
    </div>
    
    <div style="text-align: center; margin-top: 2rem;">
      <button class="action-btn success" 
              onclick="completeChallenge(${galaxyId}, ${GAME_CONFIG.COINS_PER_CHALLENGE})"
              style="font-size: 1.2rem; padding: 1rem 2.5rem;">
        ✨ 完成挑战
      </button>
    </div>
  `;
  
  // 渲染视频
  const videoContainer = document.getElementById('video-container');
  renderVideos(videoContainer, galaxyId);
}

/**
 * 添加浮动跳过按钮
 * @param {number} id - 星系 ID
 */
function addFloatingSkip(id) {
  removeFloatingSkip();
  
  const btn = document.createElement('button');
  btn.className = 'float-skip';
  btn.id = 'float-skip-btn';
  btn.innerHTML = '⏭️ 跳过此关';
  btn.onclick = () => showSkipModal(id);
  btn.setAttribute('aria-label', '跳过当前关卡');
  document.body.appendChild(btn);
}

/**
 * 移除浮动跳过按钮
 */
function removeFloatingSkip() {
  const btn = document.getElementById('float-skip-btn');
  if (btn) btn.remove();
}

/**
 * 显示跳过确认模态框
 * @param {number} id - 星系 ID
 */
function showSkipModal(id) {
  const galaxy = GALAXIES.find(g => g.id === id);
  showModal(`
    <h3 class="modal-title">⏭️ 确认跳过？</h3>
    <p style="color: #c7d2fe; margin-bottom: 1.5rem;">
      确定要跳过"${escapeHtml(galaxy?.name || '本关')}"吗？<br>
      跳过将无法获得本关的逻辑币和经验值。
    </p>
    <div class="modal-buttons">
      <button class="action-btn" 
              style="background: rgba(99, 102, 241, 0.3);" 
              onclick="document.querySelector('.modal-overlay').remove()">
        取消
      </button>
      <button class="action-btn" 
              style="background: rgba(107, 114, 128, 0.8);" 
              onclick="confirmSkip(${id})">
        确认跳过
      </button>
    </div>
  `);
}

/**
 * 确认跳过关卡
 * @param {number} id - 星系 ID
 */
function confirmSkip(id) {
  if (!gameState.skipped.includes(id)) {
    gameState.skipped.push(id);
  }
  
  gameState.stats.resist = Math.min(100, gameState.stats.resist + 2);
  
  updateStatsDisplay(gameState);
  renderGalaxyMap(document.getElementById('galaxy-grid'), gameState);
  removeFloatingSkip();
  showPage('map');
  
  // 自动保存
  autoSave(gameState);
  
  // 关闭模态框
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) overlay.remove();
}

/**
 * 完成挑战
 * @param {number} galaxyId - 星系 ID
 * @param {number} coins - 获得的逻辑币
 */
function completeChallenge(galaxyId, coins) {
  if (!gameState.completed.includes(galaxyId)) {
    gameState.completed.push(galaxyId);
  }
  
  // 如果之前跳过过，移除跳过状态
  gameState.skipped = gameState.skipped.filter(id => id !== galaxyId);
  
  gameState.coins += coins;
  gameState.stars += 1;
  gameState.exp += GAME_CONFIG.EXP_PER_CHALLENGE;
  
  const galaxy = GALAXIES.find(g => g.id === galaxyId);
  if (galaxy?.type === 'algebra') {
    gameState.stats.calc = Math.min(100, gameState.stats.calc + 10);
    gameState.stats.logic = Math.min(100, gameState.stats.logic + 5);
  } else {
    gameState.stats.space = Math.min(100, gameState.stats.space + 10);
    gameState.stats.reverse = Math.min(100, gameState.stats.reverse + 5);
  }
  
  gameState.stats.resist = Math.min(100, gameState.stats.resist + 3);
  
  updateStatsDisplay(gameState);
  renderGalaxyMap(document.getElementById('galaxy-grid'), gameState);
  renderAchievements(document.getElementById('achievements-grid'), gameState);
  
  // 升级检测
  if (gameState.exp >= GAME_CONFIG.EXP_TO_LEVEL_UP) {
    gameState.level++;
    gameState.exp -= GAME_CONFIG.EXP_TO_LEVEL_UP;
    showModal(`
      <h3 class="modal-title">🎉 升级啦！</h3>
      <p style="color: #c7d2fe; margin-bottom: 1.5rem;">
        恭喜你达到第 ${gameState.level} 级！
      </p>
      <button class="action-btn primary" onclick="document.querySelector('.modal-overlay').remove()">太棒了！</button>
    `);
  }
  
  // 自动保存
  autoSave(gameState);
  
  // 显示完成提示
  setTimeout(() => {
    const nextId = galaxyId + 1;
    if (nextId <= GALAXIES.length) {
      showModal(`
        <h3 class="modal-title">🎊 挑战成功！</h3>
        <p style="color: #c7d2fe; margin-bottom: 1rem;">获得 ${coins} 逻辑币 + 20 经验值</p>
        <div class="modal-buttons">
          <button class="action-btn" 
                  style="background: rgba(99, 102, 241, 0.3);" 
                  onclick="document.querySelector('.modal-overlay').remove(); showPage('map')">
            返回地图
          </button>
          <button class="action-btn success" 
                  onclick="document.querySelector('.modal-overlay').remove(); handleGalaxyClick(${nextId})">
            下一关 →
          </button>
        </div>
      `);
    } else {
      showModal(`
        <h3 class="modal-title">🏆 恭喜通关！</h3>
        <p style="color: #c7d2fe; margin-bottom: 1.5rem;">
          你已经完成了全部 12 个星系的学习！<br>
          你是真正的数学大师！
        </p>
        <button class="action-btn primary" onclick="document.querySelector('.modal-overlay').remove(); showPage('map')">
          返回首页
        </button>
      `);
    }
  }, 500);
  
  removeFloatingSkip();
}

/**
 * 净化怪兽
 * @param {string} monsterId - 怪兽 ID
 */
function purifyMonster(monsterId) {
  if (!gameState.monsters.includes(monsterId + '_purified')) {
    gameState.monsters.push(monsterId + '_purified');
    gameState.coins += 10;
    updateStatsDisplay(gameState);
    renderMonsters(document.getElementById('monster-grid'), gameState);
    autoSave(gameState);
  }
}

// 导出供外部使用
window.startGame = startGame;
window.showPage = showPage;

// 初始化应用
init();
