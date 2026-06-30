/**
 * 数学星环 - 主应用入口
 * 整合所有模块，初始化应用
 */

import { GALAXIES, GAME_CONFIG, createInitialGameState } from './data.js';
import { QUESTIONS } from './questions.js';
import { saveGame, loadGame, autoSave, clearSave } from './storage.js';
import {
  createStars,
  createNebula,
  createShootingStar,
  enableCard3D,
  createConfetti,
  renderComboDisplay,
  showMilestoneModal,
  renderGalaxyMap,
  renderAchievements,
  renderVideos,
  renderQuiz,
  updateStatsDisplay,
  updateExplorationDisplay,
  drawRadarChart,
  showModal,
  escapeHtml,
  showKnowledgeHint,
  aiSearchAnswer
} from './renderer.js';

import { MILESTONES, MATH_QUOTES } from './data.js';

// 全局游戏状态
let gameState = createInitialGameState();
let currentGalaxyId = null;

// 答题交互状态
let quizCombo = 0;

// 探索计时器
let exploreTimer = null;
let exploreSaveCounter = 0;

/**
 * 初始化应用
 */
function init() {
  // 尝试加载存档
  const saved = loadGame();
  if (saved) {
    gameState = { ...createInitialGameState(), ...saved };
  }

  // 显示玩家姓名
  const nameDisplay = document.getElementById('player-name-display');
  if (nameDisplay) nameDisplay.textContent = gameState.playerName || '星际探险家';

  // 直接显示主应用（去掉首屏）
  document.getElementById('main-app').style.display = 'block';

  // 保存初始状态
  saveGame(gameState);

  // 启用 2.5D 卡片跟随鼠标
  enableCard3D('.galaxy-card:not(.locked)');

  // 初始渲染
  renderAll();

  // 启动探索计时器（每秒 +1 秒，每 30 秒自动保存）
  startExploreTimer();

  // 绑定全局函数（供 HTML 和 renderer 调用）
  window.handleGalaxyClick = handleGalaxyClick;
  window.showSkipModal = showSkipModal;
  window.confirmSkip = confirmSkip;
  window.completeChallenge = completeChallenge;
  window.playSound = playSound;
  window.createConfetti = createConfetti;
  window.showKnowledgeHint = showKnowledgeHint;
  window.aiSearchAnswer = aiSearchAnswer;

  // 装饰性视觉效果延迟到首屏渲染后，不阻塞首次交互
  requestAnimationFrame(() => {
    const starsContainer = document.getElementById('stars');
    if (starsContainer) createStars(starsContainer);
    createNebula(document.body);
    createFloatingMathLetters();
    createShootingStar(document.body, 10000);
  });

  console.log('数学星环已初始化 🚀');
}

/**
 * 启动探索计时器：每秒递增 totalExploreSeconds，每 30 秒自动保存
 */
function startExploreTimer() {
  if (exploreTimer) clearInterval(exploreTimer);
  exploreSaveCounter = 0;

  exploreTimer = setInterval(() => {
    gameState.totalExploreSeconds = (gameState.totalExploreSeconds || 0) + 1;
    exploreSaveCounter++;

    // 每 30 秒持久化一次
    if (exploreSaveCounter >= 30) {
      exploreSaveCounter = 0;
      autoSave(gameState);
    }

    // 仅在显示地图页时更新 UI
    const mapPage = document.getElementById('page-map');
    if (mapPage && mapPage.classList.contains('active')) {
      updateExplorationDisplay(gameState);
    }
  }, 1000);
}

/**
 * 创建随鼠标移动的浮动字母 "math"
 * m/a/t/h 四个字母依次跟随，带延迟拖尾效果
 */
function createFloatingMathLetters() {
  const letters = ['m', 'a', 't', 'h'];
  const elMap = {};

  letters.forEach((letter) => {
    const el = document.createElement('div');
    el.className = `floating-math-letter ${letter}`;
    el.textContent = letter;
    el.style.left = '-100px';
    el.style.top = '-100px';
    document.body.appendChild(el);
    elMap[letter] = el;
  });

  // 鼠标位置历史队列
  const positions = [
    { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  ];

  // 平滑系数: 字母越靠后滞后越大
  const smoothFactors = [0.35, 0.25, 0.18, 0.12];

  document.addEventListener('mousemove', (e) => {
    // 将最新位置插入队首
    positions.unshift({ x: e.clientX + 12, y: e.clientY + 10 });
    positions.pop();

    letters.forEach((letter, i) => {
      const el = elMap[letter];
      const target = positions[i];
      const sf = smoothFactors[i];

      // 获取当前位置
      const curX = parseFloat(el.style.left) || target.x;
      const curY = parseFloat(el.style.top) || target.y;

      // 平滑插值
      const newX = curX + (target.x - curX) * sf;
      const newY = curY + (target.y - curY) * sf;

      el.style.left = newX + 'px';
      el.style.top = newY + 'px';
    });
  });
}

/**
 * Web Audio API 音效（正确/错误/完美）
 * @param {string} type - 'correct' | 'wrong' | 'perfect'
 */
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.value = 0.15;

    if (type === 'correct') {
      // 上升的双音 — 清脆肯定
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 523; // C5
      osc1.connect(gain);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.15);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 659; // E5
      const g2 = ctx.createGain();
      g2.gain.value = 0.12;
      osc2.connect(g2);
      g2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.3);
    } else if (type === 'wrong') {
      // 低沉下降 — 温和提示
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = 200;
      osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.3);
      osc.connect(gain);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'perfect') {
      // 三音上升和声 — 辉煌胜利
      [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const gn = ctx.createGain();
        gn.gain.value = 0.1;
        osc.connect(gn);
        gn.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.4);
      });
    }
  } catch (e) {
    // Web Audio API 不可用时静默降级
  }
}

/**
 * 渲染所有组件
 */
function renderAll() {
  renderGalaxyMap(document.getElementById('galaxy-grid'), gameState);
  renderAchievements(document.getElementById('achievements-grid'), gameState);
  updateStatsDisplay(gameState);
  updateExplorationDisplay(gameState);
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
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });
  
  // 特殊页面处理
  if (pageId === 'profile') {
    const canvas = document.getElementById('radarCanvas');
    if (canvas) drawRadarChart(canvas, gameState.stats);
  }

  // 切换到地图页时更新探索计时显示
  if (pageId === 'map') {
    updateExplorationDisplay(gameState);
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
      <p style="color: #e2e8f0; margin-bottom: 1.5rem;">请先完成第 ${id - 1} 关</p>
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

  // 随机选一条数学箴言（取代 NPC 对话）
  const mathQuote = MATH_QUOTES[Math.floor(Math.random() * MATH_QUOTES.length)];

  content.innerHTML = `
    <div style="position: sticky; top: 0; z-index: 100; background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,27,75,0.95)); backdrop-filter: blur(8px); border-bottom: 1px solid rgba(99,102,241,0.2); padding: 0.5rem 0.75rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.75rem;">
      <button class="back-btn" onclick="showPage('map')" aria-label="返回地图" style="flex-shrink: 0;">
        ← 返回
      </button>
      <span style="font-size: 1.3rem;">${galaxy.icon}</span>
      <h2 style="color: #fbbf24; font-size: 1.1rem; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        ${escapeHtml(galaxy.name)}
      </h2>
    </div>

    <div id="combo-container" style="text-align: center; margin-bottom: 0.5rem;"></div>

    <div style="background: rgba(99, 102, 241, 0.2); border-radius: 12px; padding: 0.5rem 0.75rem; margin-bottom: 0.5rem;">
      <p style="text-align: center; color: #e2e8f0; font-size: 1rem;">${escapeHtml(galaxy.topic)}</p>

      <div id="math-quote-area" style="margin: 0.8rem auto 0; max-width: 480px; padding: 0.75rem 1rem; background: linear-gradient(135deg, rgba(251, 191, 36, 0.10), rgba(251, 191, 36, 0.03)); border: 1px solid rgba(251, 191, 36, 0.25); border-radius: 10px; text-align: center;">
        <div style="color: #d4a574; font-size: 1.05rem; line-height: 1.7; font-family: 'Ma Shan Zheng', cursive;">
          <span>${escapeHtml(mathQuote.quote)}</span>
          <span style="display: block; margin-top: 0.15rem; font-size: 0.85rem; color: rgba(212, 165, 116, 0.55);">—— ${escapeHtml(mathQuote.author)}</span>
        </div>
      </div>
    </div>

    <div style="text-align: center;">
      <h3 style="color: #fbbf24; margin-bottom: 0.75rem; font-size: 1.3rem;">善问好学 自学视频</h3>
      <div id="video-container"></div>
    </div>

    <div id="quiz-container"></div>
  `;

  // 渲染视频
  const videoContainer = document.getElementById('video-container');
  renderVideos(videoContainer, galaxyId);

  // 渲染测试题目
  const quizContainer = document.getElementById('quiz-container');
  renderQuiz(quizContainer, QUESTIONS[galaxyId]);

  // 重置答题状态
  quizCombo = 0;

  // 注册全局答题进度检查
  window.checkQuizProgress = () => checkQuizProgress(galaxyId);

  // 注册完成挑战全局函数
  window.completeChallenge = (id, coins) => completeChallenge(id, coins);
}

/**
 * 答完所有题后检查进度（即时反馈模式 - 每答一题触发）
 * @param {number} galaxyId - 星系 ID
 */
function checkQuizProgress(galaxyId) {
  const questions = QUESTIONS[galaxyId];
  if (!questions) return;

  const resultEl = document.getElementById('quiz-result');
  const galaxy = GALAXIES.find(g => g.id === galaxyId);
  if (!galaxy || !resultEl) return;

  // 从 DOM data-* 读取答题结果（renderQuiz 逐题模式写入）
  if (resultEl.dataset.answered !== 'true') return;
  const correctCount = parseInt(resultEl.dataset.correct) || 0;
  const total = parseInt(resultEl.dataset.total) || questions.length;
  const allCorrect = correctCount === total;

  // === 连击追踪 ===
  if (allCorrect) {
    quizCombo++;
    gameState.perfectCount++;
    if (quizCombo > gameState.maxCombo) {
      gameState.maxCombo = quizCombo;
    }
    playSound('correct');
  } else {
    playSound('wrong');
  }

  // 更新连击显示
  const comboContainer = document.getElementById('combo-container');
  if (comboContainer) {
    renderComboDisplay(comboContainer, allCorrect ? quizCombo : 0);
  }

  // === 完全正确走完成流程 ===
  if (allCorrect) {
    resultEl.innerHTML = '<span style="color: #34d399; font-size: 1.2rem; font-weight: bold;">🎉 全部答对！点击下方按钮完成挑战</span>';

    const totalCoins = GAME_CONFIG.COINS_PER_CHALLENGE;

    resultEl.innerHTML += `
      <div style="margin-top: 0.8rem;">
        <button class="action-btn success" onclick="completeChallenge(${galaxyId}, ${totalCoins})"
                style="font-size: 1.2rem; padding: 1rem 2.5rem;">✨ 完成挑战</button>
      </div>`;
  } else {
    // 错误时重置连击
    quizCombo = 0;

    const wrongCount = questions.length - correctCount;
    resultEl.innerHTML = `
      <div style="color: #fbbf24; font-size: 1.05rem;">
        答对 <strong>${correctCount}</strong>/${questions.length} 题，<strong style="color:#f87171;">${wrongCount}</strong> 题需要订正
      </div>
      <div style="color: #e2e8f0; font-size: 0.9rem; margin-top: 0.3rem;">
        请查看上方解析，学习后 <button id="quiz-retry-btn" class="action-btn primary"
                style="font-size: 0.95rem; padding: 0.4rem 1.2rem; margin-left: 0.5rem; display: inline-block;">
          🔄 重新挑战
        </button>
      </div>`;

    // 绑定重新挑战
    const retryBtn = document.getElementById('quiz-retry-btn');
    if (retryBtn) {
      retryBtn.onclick = () => retryQuiz(galaxyId);
    }
  }
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
    <p style="color: #e2e8f0; margin-bottom: 1.5rem;">
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
 * 完成挑战（里程碑 + 撒花 + 完美记录）
 * @param {number} galaxyId - 星系 ID
 * @param {number} coins - 获得的逻辑币
 */
function completeChallenge(galaxyId, coins) {
  const isFirstTime = !gameState.completed.includes(galaxyId);
  let unlockedMilestone = null;

  if (isFirstTime) {
    gameState.completed.push(galaxyId);

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
    gameState.lastQuizTime = Date.now();

    updateStatsDisplay(gameState);
    renderGalaxyMap(document.getElementById('galaxy-grid'), gameState);
    renderAchievements(document.getElementById('achievements-grid'), gameState);

    // 升级检测
    if (gameState.exp >= GAME_CONFIG.EXP_TO_LEVEL_UP) {
      gameState.level++;
      gameState.exp -= GAME_CONFIG.EXP_TO_LEVEL_UP;
      showModal(`
        <h3 class="modal-title">🎉 升级啦！</h3>
        <p style="color: #e2e8f0; margin-bottom: 1.5rem;">
          恭喜你达到第 ${gameState.level} 级！
        </p>
        <button class="action-btn primary" onclick="document.querySelector('.modal-overlay').remove()">太棒了！</button>
      `);
    }

    // === 里程碑检测 ===
    for (const ms of MILESTONES) {
      if (gameState.unlockedMilestones.includes(ms.id)) continue;
      let met = false;
      switch (ms.condition.type) {
        case 'completed_count':
          met = gameState.completed.length >= ms.condition.value;
          break;
        case 'perfect_count':
          met = gameState.perfectCount >= ms.condition.value;
          break;
        case 'max_combo':
          met = gameState.maxCombo >= ms.condition.value;
          break;
        case 'level':
          met = gameState.level >= ms.condition.value;
          break;
        case 'coins':
          met = gameState.coins >= ms.condition.value;
          break;
      }
      if (met) {
        gameState.unlockedMilestones.push(ms.id);
        unlockedMilestone = ms;
        break; // 一次只提示一个里程碑
      }
    }

    // 自动保存
    autoSave(gameState);
  }

  // 撒花庆祝 + 里程碑弹窗
  createConfetti(40);

  setTimeout(() => {
    // 先显示里程碑（如果有）
    if (unlockedMilestone) {
      playSound('perfect');
      showMilestoneModal(unlockedMilestone);
    }

    const nextId = galaxyId + 1;
    if (nextId <= GALAXIES.length) {
      showModal(`
        <h3 class="modal-title">🎊 挑战成功！</h3>
        <p style="color: #e2e8f0; margin-bottom: 1rem;">获得 ${coins} 逻辑币 + 20 经验值</p>
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
        <p style="color: #e2e8f0; margin-bottom: 1.5rem;">
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
 * 重新挑战（重置当前星系测验）
 * @param {number} galaxyId - 星系 ID
 */
function retryQuiz(galaxyId) {
  const container = document.getElementById('quiz-container');
  const resultEl = document.getElementById('quiz-result');
  if (container) {
    renderQuiz(container, QUESTIONS[galaxyId]);
  }
  if (resultEl) {
    resultEl.innerHTML = '';
  }
  quizCombo = 0;
  const comboContainer = document.getElementById('combo-container');
  if (comboContainer) {
    renderComboDisplay(comboContainer, 0);
  }
  // 重新绑定检查
  window.checkQuizProgress = () => checkQuizProgress(galaxyId);
}

// 导出供外部使用（renderer.js 通过 window.* 访问）
window.showPage = showPage;
window.gameState = gameState;
window.updateStatsDisplay = updateStatsDisplay;

// 初始化应用
init();
