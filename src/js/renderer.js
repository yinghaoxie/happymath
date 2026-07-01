/**
 * 数学星环 - 渲染工具模块
 * 处理 DOM 渲染和更新操作
 */

import { GALAXIES, BILIBILI_VIDEOS, ACHIEVEMENTS, KNOWLEDGE_SIDEBAR } from './data.js';
import { autoSave } from './storage.js';
import { renderNumberLine } from './interactive.js';

/**
 * 安全转义 HTML 防止 XSS
 * @param {string} text - 需要转义的文本
 * @returns {string} 转义后的文本
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * 创建星空背景（三层星星系统）
 * @param {HTMLElement} container - 星星容器元素
 */
export function createStars(container) {
  if (!container) return;

  const layers = [
    { count: 60, className: 'star-layer-1', minSize: 1, maxSize: 2 },
    { count: 40, className: 'star-layer-2', minSize: 1.5, maxSize: 3 },
    { count: 20, className: 'star-layer-3', minSize: 2, maxSize: 4 }
  ];

  layers.forEach((layer, li) => {
    const layerDiv = document.createElement('div');
    layerDiv.className = layer.className;
    layerDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    const frag = document.createDocumentFragment();

    for (let i = 0; i < layer.count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      const size = layer.minSize + Math.random() * (layer.maxSize - layer.minSize);
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.animationDelay = Math.random() * 3 + 's';
      star.style.animationDuration = (6 - li * 1.5) + 's';
      frag.appendChild(star);
    }
    layerDiv.appendChild(frag);
    container.appendChild(layerDiv);
  });
}

/**
 * 创建星云光晕
 * @param {HTMLElement} container - 容器元素
 */
export function createNebula(container) {
  if (!container) return;

  const colors = [
    'rgba(147, 51, 234, 0.3)',
    'rgba(59, 130, 246, 0.25)',
    'rgba(236, 72, 153, 0.2)'
  ];

  colors.forEach((color, i) => {
    const blob = document.createElement('div');
    blob.className = 'nebula';
    const size = 200 + Math.random() * 300;
    blob.style.width = size + 'px';
    blob.style.height = size + 'px';
    blob.style.background = `radial-gradient(circle, ${color}, transparent)`;
    blob.style.left = (15 + i * 30 + Math.random() * 10) + '%';
    blob.style.top = (10 + i * 20 + Math.random() * 15) + '%';
    blob.style.animation = `nebulaDrift ${40 + i * 15}s ease-in-out infinite alternate`;
    container.appendChild(blob);
  });
}

/**
 * 创建流星事件
 * @param {HTMLElement} container - 容器元素
 * @param {number} interval - 出现间隔（毫秒），默认 8 秒
 * @returns {number} intervalId 用于清除定时器
 */
export function createShootingStar(container, interval) {
  if (!container) return null;
  const ms = interval || 8000;

  function spawn() {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.left = (80 + Math.random() * 20) + '%';
    star.style.top = Math.random() * 40 + '%';
    star.style.animation = `shoot ${0.6 + Math.random() * 0.4}s ease-out forwards`;
    container.appendChild(star);
    star.addEventListener('animationend', () => star.remove());
  }

  // 立即生成一颗，无需等待第一个 interval
  setTimeout(spawn, 500 + Math.random() * 2000);

  return setInterval(spawn, ms);
}

/**
 * 启用 2.5D 卡片跟随鼠标倾斜
 * @param {string} selector - 卡片选择器，默认 '.galaxy-card:not(.locked)'
 */
export function enableCard3D(selector) {
  const sel = selector || '.galaxy-card:not(.locked)';

  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll(sel);
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  });

  // 鼠标离开卡片区域时复位
  document.addEventListener('mouseleave', () => {
    document.querySelectorAll(sel).forEach(card => {
      card.style.transform = '';
    });
  });
}

/**
 * 创建撒花庆祝粒子
 * @param {number} count - 粒子数量，默认 30
 */
export function createConfetti(count) {
  const n = count || 30;
  const colors = ['#fbbf24', '#f472b6', '#60a5fa', '#a78bfa', '#34d399', '#f87171', '#f97316'];

  for (let i = 0; i < n; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    particle.style.left = (10 + Math.random() * 80) + '%';
    particle.style.top = (10 + Math.random() * 30) + '%';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.width = (6 + Math.random() * 8) + 'px';
    particle.style.height = (6 + Math.random() * 8) + 'px';
    particle.style.animationDuration = (1 + Math.random() * 1) + 's';
    particle.style.animationDelay = Math.random() * 0.5 + 's';
    particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    document.body.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove());
  }
}

/**
 * 渲染连击显示
 * @param {HTMLElement} container - 容器元素
 * @param {number} combo - 连击数
 */
export function renderComboDisplay(container, combo) {
  if (!container) return;
  if (combo < 2) {
    container.innerHTML = '';
    return;
  }

  const emojis = ['', '', '🔥', '🔥🔥', '🔥🔥🔥', '💥💥💥'];
  const label = combo >= emojis.length ? '🔥🔥🔥🔥' : emojis[combo];

  container.innerHTML = `<div class="combo-display">${label} ${combo}x 连击！</div>`;
}

/**
 * 显示里程碑弹窗
 * @param {Object} milestone - 里程碑配置对象 { id, name, icon, desc }
 * @param {Function} onClose - 关闭回调
 */
export function showMilestoneModal(milestone, onClose) {
  showModal(`
    <div class="milestone-flash" style="padding: 1rem;">
      <div style="font-size: 4rem; margin-bottom: 0.5rem; animation: float 2s ease-in-out infinite;">${milestone.icon}</div>
      <div class="modal-title">🏅 里程碑解锁！</div>
      <div style="font-size: 1.3rem; color: #fbbf24; font-weight: bold; margin-bottom: 0.5rem;">
        ${milestone.name}
      </div>
      <div style="color: #e2e8f0; font-size: 1rem; margin-bottom: 1rem;">
        ${milestone.desc}
      </div>
      <button class="action-btn primary" onclick="this.closest('.modal-overlay').remove()" style="font-size: 1.1rem; padding: 0.7rem 2rem;">
        👏 太棒了！
      </button>
    </div>
  `, onClose);
}

/**
 * 渲染星系地图
 * @param {HTMLElement} grid - 网格容器
 * @param {Object} gameState - 游戏状态
 * @param {Function} onGalaxyClick - 点击回调
 */
export function renderGalaxyMap(grid, gameState, onGalaxyClick) {
  if (!grid) return;
  
  const cards = GALAXIES.map(galaxy => {
    const isCompleted = gameState.completed.includes(galaxy.id);
    const isSkipped = gameState.skipped.includes(galaxy.id);
    const isLocked = !isCompleted && !isSkipped && 
                     galaxy.id > 1 && 
                     !gameState.completed.includes(galaxy.id - 1) &&
                     !gameState.skipped.includes(galaxy.id - 1);
    
    let statusClass = '';
    if (isCompleted) statusClass = 'completed';
    else if (isSkipped) statusClass = 'skipped';
    else if (isLocked) statusClass = 'locked';

    return `
      <div class="galaxy-card ${statusClass}"
           data-id="${galaxy.id}"
           style="--drift-delay: ${galaxy.id * 0.4}s"
           role="button"
           tabindex="${isLocked ? '-1' : '0'}"
           aria-label="${galaxy.name}${isLocked ? '（未解锁）' : ''}"
           ${!isLocked ? `onclick="window.handleGalaxyClick(${galaxy.id})"` : ''}>
        <div class="galaxy-icon">${galaxy.icon}</div>
        <div class="galaxy-name">${escapeHtml(galaxy.name)}
          ${isCompleted ? '<span class="galaxy-badge done">✦</span>' : ''}
          ${isSkipped && !isCompleted ? '<span class="galaxy-badge skip">↷</span>' : ''}
          ${isLocked ? '<span class="galaxy-badge locked-badge">🔒</span>' : ''}
        </div>
        <div class="galaxy-level">关卡${galaxy.id}</div>
      </div>
    `;
  }).join('');
  
  grid.innerHTML = cards;
}

/**
 * 渲染成就列表
 * @param {HTMLElement} grid - 网格容器
 * @param {Object} gameState - 游戏状态
 */
export function renderAchievements(grid, gameState) {
  if (!grid) return;
  
  const cards = ACHIEVEMENTS.map(achievement => {
    const isUnlocked = checkAchievement(achievement, gameState);
    
    return `
      <div class="achievement-card ${isUnlocked ? '' : 'locked'}">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-name">${escapeHtml(achievement.name)}</div>
        <div style="color: #e2e8f0; font-size: 0.9rem;">${escapeHtml(achievement.desc)}</div>
        ${isUnlocked 
          ? '<div style="color: #10b981; margin-top: 0.5rem;" aria-label="已解锁">✅ 已解锁</div>' 
          : '<div style="color: #ef4444; margin-top: 0.5rem;" aria-label="未解锁">🔒 未解锁</div>'}
      </div>
    `;
  }).join('');
  
  grid.innerHTML = cards;
}

/**
 * 检查成就是否解锁
 * @param {Object} achievement - 成就配置
 * @param {Object} gameState - 游戏状态
 * @returns {boolean}
 */
function checkAchievement(achievement, gameState) {
  if (achievement.type === 'coins') {
    return gameState.coins >= achievement.condition;
  }
  return gameState.completed.length >= achievement.condition;
}

/**
 * 渲染 B 站视频列表
 * @param {HTMLElement} container - 容器元素
 * @param {number} galaxyId - 星系 ID
 */
export function renderVideos(container, galaxyId) {
  if (!container) return;

  const videos = BILIBILI_VIDEOS[galaxyId] || [];

  if (videos.length === 0) {
    container.innerHTML = '<p style="color: #e2e8f0; text-align: center;">暂无配套视频</p>';
    return;
  }

  const videoCards = videos.map(video => {
    // 清理 BV 号，去除首尾空格和可能的斜杠
    const cleanBv = (video.bv || '').trim().replace(/\/$/, '');
    return `
    <div class="video-card">
      <iframe src="https://player.bilibili.com/player.html?bvid=${cleanBv}&page=1&high_quality=1"
              scrolling="no"
              border="0"
              frameborder="no"
              framespacing="0"
              allowfullscreen="true"
              title="${escapeHtml(video.title)}"
              loading="lazy">
      </iframe>
      <div class="video-title">${escapeHtml(video.title)}</div>
    </div>
  `;
  }).join('');

  container.innerHTML = `<div class="video-grid">${videoCards}</div>`;
}

/**
 * 更新探索计时和宇宙探索百分比显示
 * @param {Object} gameState - 游戏状态
 */
export function updateExplorationDisplay(gameState) {
  const totalSecs = gameState.totalExploreSeconds || 0;

  // 格式化为 时:分:秒，每秒实时更新
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  const formatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const secEl = document.getElementById('explore-seconds');
  if (secEl) secEl.textContent = formatted;
}

/**
 * 更新统计显示
 * @param {Object} gameState - 游戏状态
 */
export function updateStatsDisplay(gameState) {
  const elements = {
    coinCount: document.getElementById('coin-count'),
    starCount: document.getElementById('star-count'),
    playerLevel: document.getElementById('player-level'),
    playerExp: document.getElementById('player-exp'),
    expBar: document.getElementById('exp-bar'),
    perfectCount: document.getElementById('perfect-count'),
    learnedCount: document.getElementById('learned-count'),
    challengeCount: document.getElementById('challenge-count'),
    skippedCount: document.getElementById('skipped-count'),
    statCalc: document.getElementById('stat-calc'),
    statSpace: document.getElementById('stat-space'),
    statLogic: document.getElementById('stat-logic'),
    statReverse: document.getElementById('stat-reverse'),
    statResist: document.getElementById('stat-resist'),
    titleDisplay: document.getElementById('title-display')
  };
  
  if (elements.coinCount) elements.coinCount.textContent = gameState.coins;
  if (elements.starCount) elements.starCount.textContent = gameState.stars;
  if (elements.playerLevel) elements.playerLevel.textContent = gameState.level;
  if (elements.playerExp) elements.playerExp.textContent = gameState.exp;
  if (elements.expBar) elements.expBar.style.width = gameState.exp + '%';
  if (elements.perfectCount) elements.perfectCount.textContent = gameState.perfectCount || 0;
  if (elements.learnedCount) elements.learnedCount.textContent = gameState.completed.length;
  if (elements.challengeCount) elements.challengeCount.textContent = gameState.completed.length;
  if (elements.skippedCount) elements.skippedCount.textContent = gameState.skipped.length;
  if (elements.statCalc) elements.statCalc.textContent = gameState.stats.calc;
  if (elements.statSpace) elements.statSpace.textContent = gameState.stats.space;
  if (elements.statLogic) elements.statLogic.textContent = gameState.stats.logic;
  if (elements.statReverse) elements.statReverse.textContent = gameState.stats.reverse;
  if (elements.statResist) elements.statResist.textContent = gameState.stats.resist;
  
  // 计算称号
  let title = '算术见习生';
  if (gameState.completed.length >= 12) title = '欧几里得传人';
  else if (gameState.completed.length >= 9) title = '几何炼金术士';
  else if (gameState.completed.length >= 5) title = '代数小能手';
  
  if (elements.titleDisplay) elements.titleDisplay.textContent = title;
}

/**
 * 绘制雷达图
 * @param {HTMLCanvasElement} canvas - Canvas 元素
 * @param {Object} stats - 能力值对象
 */
export function drawRadarChart(canvas, stats) {
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2 - 40;
  
  ctx.clearRect(0, 0, w, h);
  
  const labels = ['计算爆发力', '空间想象力', '逻辑推理力', '逆向思维', '抗挫折力'];
  const values = [stats.calc, stats.space, stats.logic, stats.reverse, stats.resist];
  const n = labels.length;
  
  // 绘制背景网格
  for (let level = 1; level <= 5; level++) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
      const lr = r * level / 5;
      const x = cx + lr * Math.cos(angle);
      const y = cy + lr * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  
  // 绘制轴线
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    ctx.stroke();
    
    // 绘制标签
    const lx = cx + (r + 25) * Math.cos(angle);
    const ly = cy + (r + 25) * Math.sin(angle);
    ctx.fillStyle = '#fbbf24';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], lx, ly);
  }
  
  // 绘制数据区域
  ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const idx = i % n;
    const angle = (Math.PI * 2 * idx / n) - Math.PI / 2;
    const vr = r * values[idx] / 100;
    const x = cx + vr * Math.cos(angle);
    const y = cy + vr * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // 绘制数据点
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    const vr = r * values[i] / 100;
    const x = cx + vr * Math.cos(angle);
    const y = cy + vr * Math.sin(angle);
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * 渲染测试题 — 逐题展示模式
 * @param {HTMLElement} container - 容器元素
 * @param {Array} questions - 题目数组
 * @param {number} galaxyId - 星系 ID（可选，用于显示视频链接）
 */
export function renderQuiz(container, questions, galaxyId) {
  if (!container) return;
  if (!questions || questions.length === 0) {
    container.innerHTML = '<p style="color: #e2e8f0; text-align: center;">暂无题目</p>';
    return;
  }
  if (galaxyId) window.__currentGalaxyId = galaxyId;
  const COINS_CORRECT = 2;
  const COINS_EFFORT = 1;
  const STARS_CORRECT = 5;
  const STARS_EFFORT = 1;
  const MAX_WRONG_ATTEMPTS = 3;

  const total = questions.length;
  let currentIdx = 0;
  const answerState = questions.map(() => ({ answered: false, isCorrect: false, selected: null, wrongAttempts: 0 }));

  // 游戏状态（每题重置）
  let streak = 0;
  let challengeActive = true;

  // 骨架
  container.innerHTML = `
    <div style="margin-top: 1.2rem; padding-top: 1rem; border-top: 1px solid rgba(251, 191, 36, 0.3);">
      <h3 style="color: #fbbf24; margin-bottom: 0.8rem; text-align: center; font-size: 1.3rem;">📝 突破知识边界</h3>
      <!-- 顶部状态栏：连击 -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.8rem; padding: 0 0.5rem;">
        <div></div>
        <div id="quiz-streak-display" style="font-size: 0.9rem; color: #f87171; font-weight: bold; min-height: 1.4rem;"></div>
      </div>
      <!-- 进度条 -->
      <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem; justify-content: center;">
        <span id="quiz-progress-text" style="color: #e2e8f0; font-size: 0.9rem; min-width: 4rem; text-align: right;">1/${total}</span>
        <div style="flex: 1; max-width: 300px; height: 6px; background: rgba(99, 102, 241, 0.25); border-radius: 3px; overflow: hidden;">
          <div id="quiz-progress-bar" style="height: 100%; width: ${100/total}%; background: linear-gradient(90deg, #fbbf24, #f59e0b); border-radius: 3px; transition: width 0.4s ease;"></div>
        </div>
        <span style="color: #64748b; font-size: 0.85rem;">共 ${total} 题</span>
      </div>
      <div id="quiz-card-area" style="position: relative; min-height: 300px; overflow: hidden;"></div>
      <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.2rem;">
        <button id="quiz-prev-btn" class="action-btn" style="background: rgba(99, 102, 241, 0.3); display: none;">‹ 上一题</button>
        <button id="quiz-next-btn" class="action-btn primary" style="display: none;">下一题 ›</button>
        <button id="quiz-finish-btn" class="action-btn success" style="display: none;">📊 查看结果</button>
      </div>
      <div id="quiz-result" style="text-align: center; margin-top: 1rem; min-height: 2rem;"></div>
    </div>
  `;

  const cardArea = document.getElementById('quiz-card-area');
  const progressText = document.getElementById('quiz-progress-text');
  const progressBar = document.getElementById('quiz-progress-bar');
  const prevBtn = document.getElementById('quiz-prev-btn');
  const nextBtn = document.getElementById('quiz-next-btn');
  const finishBtn = document.getElementById('quiz-finish-btn');
  const quizResult = document.getElementById('quiz-result');

  /** 渲染第 idx 题 */
  function renderQuestion(idx) {
    const q = questions[idx];
    if (!q) return;
    const state = answerState[idx];
    const isBoss = idx === total - 1;

    cardArea.innerHTML = `
      <div class="quiz-card-slide" style="animation: quizFadeIn 0.3s ease;">
        <div style="background: rgba(99, 102, 241, 0.12); border-radius: 16px; padding: 1rem 1.2rem;
                    border: 2px solid ${isBoss ? 'rgba(251, 191, 36, 0.5)' : 'rgba(251, 191, 36, 0.2)'};
                    ${isBoss ? 'box-shadow: 0 0 25px rgba(251, 191, 36, 0.15), inset 0 0 20px rgba(251, 191, 36, 0.05);' : ''}">
          ${isBoss ? '<div style="text-align:center;font-size:1.6rem;margin-bottom:0.5rem;">👑 BOSS 关卡</div>' : ''}
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
            <span style="color: #fbbf24; font-weight: bold; font-size: 0.95rem;">
              第 ${idx + 1} 题 ${isBoss ? '⭐' : ''}
              ${state.wrongAttempts > 0 && state.wrongAttempts < MAX_WRONG_ATTEMPTS ? `<span style="color:#f87171;margin-left:0.5rem;font-size:0.8rem;">${'❤️'.repeat(MAX_WRONG_ATTEMPTS - state.wrongAttempts)}${'🖤'.repeat(state.wrongAttempts)}</span>` : ''}
            </span>
            <span style="color: #64748b; font-size: 0.8rem;">
              ${state.answered ? (state.isCorrect ? '✅ 答对了' : '❌ 答错了') : '⏳ 请作答'}
            </span>
          </div>
          <div style="color: #e0e7ff; font-size: 1.25rem; line-height: 1.8; margin-bottom: 1rem; font-weight: 500;">
            ${escapeHtml(q.q)}
          </div>
          <div class="quiz-options" id="quiz-options-area" style="display: flex; flex-direction: column; gap: 0.6rem;">
            ${q.type === 'numberline'
              ? '' // 交互题选项由 renderNumberLine 动态渲染
              : q.options.map((opt, j) => {
              const isSelected = state.selected === j;
              let bg = 'rgba(99, 102, 241, 0.15)';
              let border = 'transparent';
              let pointerEv = 'auto';
              if (state.answered) {
                pointerEv = 'none';
                if (state.isCorrect && j === q.answer) { bg = 'rgba(16, 185, 129, 0.25)'; border = '#10b981'; }
                else if (isSelected) { bg = 'rgba(239, 68, 68, 0.25)'; border = '#ef4444'; }
              }
              const checked = isSelected ? 'checked' : '';
              return `
                <label class="quiz-option" data-opt="${j}"
                       style="display: flex; align-items: center; gap: 0.7rem; padding: 0.7rem 1rem;
                              background: ${bg}; border-radius: 12px; cursor: ${pointerEv};
                              transition: background 0.2s, border-color 0.2s, transform 0.15s;
                              border: 2px solid ${border}; color: #e2e8f0; font-size: 1.1rem;">
                  <input type="radio" name="quiz-current" value="${j}" ${checked}
                         style="accent-color: #fbbf24; width: 20px; height: 20px; cursor: ${pointerEv}; flex-shrink: 0;">
                  <span style="flex:1;">${String.fromCharCode(65 + j)}. ${escapeHtml(opt)}</span>
                  ${state.answered && state.isCorrect && j === q.answer ? '<span style="font-size:1.1rem;">✅</span>' : ''}
                  ${state.answered && isSelected && !state.isCorrect ? '<span style="font-size:1.1rem;">❌</span>' : ''}
                </label>`;
            }).join('')}
          </div>
          ${!state.answered ? `
            <div style="display: flex; gap: 0.6rem; margin-top: 0.8rem; justify-content: center;">
              <button class="quiz-hint-btn" data-qidx="${idx}" type="button"
                      style="flex:1;padding:0.5rem 0.8rem;border-radius:10px;border:1px solid rgba(251,191,36,0.3);
                             background:rgba(251,191,36,0.08);color:#fbbf24;font-size:0.85rem;cursor:pointer;
                             transition:all 0.2s;">
                💡 知识点提示
              </button>
              <button class="quiz-ai-btn" data-qidx="${idx}" type="button"
                      style="flex:1;padding:0.5rem 0.8rem;border-radius:10px;border:1px solid rgba(99,102,241,0.3);
                             background:rgba(99,102,241,0.08);color:#a5b4fc;font-size:0.85rem;cursor:pointer;
                             transition:all 0.2s;">
                🤖 AI 搜寻答案
              </button>
            </div>` : ''}
          ${state.answered && (q.type !== 'numberline' || !state.isCorrect) ? `
            ${q.type !== 'numberline' ? `
            <div style="margin-top: 0.8rem; padding: 0.7rem 0.9rem; border-radius: 10px;
                        background: ${state.isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'};
                        color: ${state.isCorrect ? '#34d399' : '#f87171'}; font-size: 0.95rem; line-height: 1.6;">
              ${state.isCorrect
                ? '✅ 答对啦！思维清晰，保持这个节奏！<br><span style="color:#94a3b8;font-size:0.9rem;">' + escapeHtml(q.explain) + '</span>'
                : '❌ 答错了，再想想！<br><span style="color:#fbbf24;font-size:0.9rem;">💡 仔细审题，你一定能找到正确答案！</span>'}
            </div>
            ` : ''}
            ${state.answered && !state.isCorrect ? `
              ${state.wrongAttempts < MAX_WRONG_ATTEMPTS ? `
              <div style="display: flex; gap: 0.6rem; margin-top: 0.8rem;">
                <button class="quiz-hint-btn" data-qidx="${idx}" type="button"
                        style="flex:1;padding:0.5rem 0.8rem;border-radius:10px;border:1px solid rgba(251,191,36,0.3);
                               background:rgba(251,191,36,0.08);color:#fbbf24;font-size:0.85rem;cursor:pointer;
                               transition:all 0.2s;">
                  💡 知识点提示
                </button>
                <button class="quiz-ai-btn" data-qidx="${idx}" type="button"
                        style="flex:1;padding:0.5rem 0.8rem;border-radius:10px;border:1px solid rgba(99,102,241,0.3);
                               background:rgba(99,102,241,0.08);color:#a5b4fc;font-size:0.85rem;cursor:pointer;
                               transition:all 0.2s;">
                  🤖 AI 搜寻答案
                </button>
              </div>` : ''}
              <button class="quiz-retry-btn" type="button"
                      style="margin-top:0.7rem;padding:0.5rem 1.5rem;border-radius:10px;
                             border:2px solid #fbbf24;background:rgba(251,191,36,0.1);
                             color:#fbbf24;font-size:0.9rem;cursor:pointer;display:block;
                             width:100%;transition:all 0.2s;">
                🔄 再试一次
              </button>` : ''}
          </div>
      </div>
    ` : ''}
    `;

    // 未作答时绑定选项事件
    if (!state.answered) {
      if (q.type === 'numberline') {
        // 交互题渲染
        const optionsArea = document.getElementById('quiz-options-area');
        if (optionsArea) {
          renderNumberLine(optionsArea, q, state, () => {
            // onSubmit 回调 — 完成后的奖励/连击逻辑
            if (!challengeActive) return;
            const isBoss = idx === total - 1;

            // 音效已在交互模块中播放

            // 💰 答对奖 2 逻辑币，答错也奖 1 努力币
            if (window.gameState) {
              window.gameState.coins += state.isCorrect ? COINS_CORRECT : COINS_EFFORT;
              window.gameState.stars += state.isCorrect ? STARS_CORRECT : STARS_EFFORT;
              if (window.updateStatsDisplay) window.updateStatsDisplay(window.gameState);
              autoSave(window.gameState);
            }

            // 🌟 浮动星光动画
            showFloatingScore(optionsArea, state.isCorrect ? `+${STARS_CORRECT} ⭐` : `+${STARS_EFFORT} ⭐`, state.isCorrect);

            // 💥 屏幕震动（答错）
            if (!state.isCorrect) {
              screenShake();
            }

            // 答错处理 — 记录尝试次数
            if (!state.isCorrect) {
              answerState[idx].wrongAttempts++;
              if (answerState[idx].wrongAttempts >= MAX_WRONG_ATTEMPTS) {
                if (typeof window.playSound === 'function') {
                  setTimeout(() => window.playSound('wrong'), 200);
                }
                renderQuestion(idx);
                updateUI();
                window.__currentQ = q;
                showModal(`
                  <div style="text-align:center;">
                    <div style="font-size:2.5rem;margin-bottom:0.5rem;">💪</div>
                    <div style="color:#fbbf24;font-size:1.1rem;font-weight:bold;margin-bottom:0.3rem;">这道题有点挑战性呢！</div>
                    <div style="color:#94a3b8;font-size:0.85rem;margin-bottom:1.2rem;">换个方法，一定能掌握！</div>
                    <button id="fail-ai-btn" style="display:block;width:100%;padding:0.7rem;margin-bottom:0.6rem;
                      border-radius:10px;border:none;background:linear-gradient(135deg,#6366f1,#818cf8);
                      color:#fff;font-size:0.9rem;cursor:pointer;">
                      🤖 AI 答疑 — 帮你理解这道题
                    </button>
                    <button id="fail-video-btn" style="display:block;width:100%;padding:0.7rem;margin-bottom:0.6rem;
                      border-radius:10px;border:1px solid rgba(251,191,36,0.3);
                      background:rgba(251,191,36,0.1);color:#fbbf24;font-size:0.9rem;cursor:pointer;">
                      🎬 看视频学习 — 重温知识点
                    </button>
                    <button id="fail-retry-btn" style="display:block;width:100%;padding:0.5rem;
                      border-radius:8px;border:none;background:transparent;color:#64748b;font-size:0.85rem;cursor:pointer;">
                      🔄 重新挑战
                    </button>
                  </div>
                `);
                setTimeout(() => {
                  const overlay = document.querySelector('.modal-overlay');
                  if (!overlay) return;
                  document.getElementById('fail-ai-btn')?.addEventListener('click', () => {
                    overlay.remove();
                    aiSearchAnswer(window.__currentQ);
                  });
                  document.getElementById('fail-video-btn')?.addEventListener('click', () => {
                    overlay.remove();
                    document.getElementById('video-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  });
                  document.getElementById('fail-retry-btn')?.addEventListener('click', () => {
                    overlay.remove();
                    if (window.retryQuiz) window.retryQuiz();
                  });
                }, 0);
                return;
              } else {
                showKnowledgePopup('答错了，再想想！', 'wrong');
              }
            }

            // 🔥 连击系统
            if (state.isCorrect) {
              streak++;
              const streakEl = document.getElementById('quiz-streak-display');
              let bonusText = '';
              let bonusCoins = 0;
              if (streak === 3) { bonusText = '🔥 三连击！'; bonusCoins = 3; }
              else if (streak === 5) { bonusText = '⚡ 五连绝世！'; bonusCoins = 5; }
              else if (streak === 10) { bonusText = '🌟 十全十美！'; bonusCoins = 10; }
              if (bonusCoins > 0 && window.gameState) {
                window.gameState.coins += bonusCoins;
                if (window.updateStatsDisplay) window.updateStatsDisplay(window.gameState);
                autoSave(window.gameState);
                showFloatingScore(optionsArea, bonusText + ' +' + bonusCoins + ' 🪙', true);
                if (typeof window.playSound === 'function') window.playSound('perfect');
                if (typeof window.createConfetti === 'function') window.createConfetti(12);
              }
              if (streakEl) {
                if (streak >= 2) {
                  const fireIcons = streak >= 5 ? '🔥🔥🔥' : streak >= 3 ? '🔥🔥' : '🔥';
                  streakEl.textContent = fireIcons + ' ' + streak + ' 连击！';
                  streakEl.style.color = streak >= 5 ? '#fbbf24' : '#f87171';
                } else { streakEl.textContent = ''; }
              }
            } else {
              streak = 0;
              const streakEl = document.getElementById('quiz-streak-display');
              if (streakEl) streakEl.textContent = '';
            }

            // 🏆 Boss 题答对 — 额外庆祝
            if (state.isCorrect && isBoss) {
              if (typeof window.createConfetti === 'function') window.createConfetti(25);
              if (typeof window.playSound === 'function') setTimeout(() => window.playSound('perfect'), 150);
            }

            // 弹窗知识点
            if (state.isCorrect) {
              showKnowledgePopup(q.explain, 'correct');
            }

            renderQuestion(idx);
            updateUI();
          });
        }
      } else {
        cardArea.querySelectorAll('input[name="quiz-current"]').forEach(r => {
        r.addEventListener('change', () => {
          if (!challengeActive) return; // 生命耗尽后禁用
          state.answered = true;
          state.selected = parseInt(r.value);
          state.isCorrect = state.selected === q.answer;
          const isBoss = idx === total - 1;

          // 🎵 即时音效
          if (typeof window.playSound === 'function') {
            window.playSound(state.isCorrect ? 'correct' : 'wrong');
          }

          // 💰 答对奖 2 逻辑币，答错也奖 1 努力币
          if (window.gameState) {
            window.gameState.coins += state.isCorrect ? COINS_CORRECT : COINS_EFFORT;
            window.gameState.stars += state.isCorrect ? STARS_CORRECT : STARS_EFFORT;
            if (window.updateStatsDisplay) window.updateStatsDisplay(window.gameState);
            autoSave(window.gameState);
          }

          // 🌟 浮动星光动画（每次答题都有星光）
          const anchor = r.closest('.quiz-option') || cardArea;
          showFloatingScore(anchor, state.isCorrect ? `+${STARS_CORRECT} ⭐` : `+${STARS_EFFORT} ⭐`, state.isCorrect);

          // 💥 屏幕震动（答错）
          if (!state.isCorrect) {
            screenShake();
          }

          // 答错处理 — 记录尝试次数，最多 MAX_WRONG_ATTEMPTS 次
          if (!state.isCorrect) {
            answerState[idx].wrongAttempts++;

            if (answerState[idx].wrongAttempts >= MAX_WRONG_ATTEMPTS) {
              // 💀 用完所有尝试 → 弹出提示：AI答疑 / 看视频
              if (typeof window.playSound === 'function') {
                setTimeout(() => window.playSound('wrong'), 200);
              }
              renderQuestion(idx);
              updateUI();
              window.__currentQ = q;
              showModal(`
                <div style="text-align:center;">
                  <div style="font-size:2.5rem;margin-bottom:0.5rem;">💪</div>
                  <div style="color:#fbbf24;font-size:1.1rem;font-weight:bold;margin-bottom:0.3rem;">这道题有点挑战性呢！</div>
                  <div style="color:#94a3b8;font-size:0.85rem;margin-bottom:1.2rem;">换个方法，一定能掌握！</div>
                  <button id="fail-ai-btn" style="display:block;width:100%;padding:0.7rem;margin-bottom:0.6rem;
                    border-radius:10px;border:none;background:linear-gradient(135deg,#6366f1,#818cf8);
                    color:#fff;font-size:0.9rem;cursor:pointer;">
                    🤖 AI 答疑 — 帮你理解这道题
                  </button>
                  <button id="fail-video-btn" style="display:block;width:100%;padding:0.7rem;margin-bottom:0.6rem;
                    border-radius:10px;border:1px solid rgba(251,191,36,0.3);
                    background:rgba(251,191,36,0.1);color:#fbbf24;font-size:0.9rem;cursor:pointer;">
                    🎬 看视频学习 — 重温知识点
                  </button>
                  <button id="fail-retry-btn" style="display:block;width:100%;padding:0.5rem;
                    border-radius:8px;border:none;background:transparent;color:#64748b;font-size:0.85rem;cursor:pointer;">
                    🔄 重新挑战
                  </button>
                </div>
              `);
              setTimeout(() => {
                const overlay = document.querySelector('.modal-overlay');
                if (!overlay) return;
                document.getElementById('fail-ai-btn')?.addEventListener('click', () => {
                  overlay.remove();
                  aiSearchAnswer(window.__currentQ);
                });
                document.getElementById('fail-video-btn')?.addEventListener('click', () => {
                  overlay.remove();
                  document.getElementById('video-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
                document.getElementById('fail-retry-btn')?.addEventListener('click', () => {
                  overlay.remove();
                  if (window.retryQuiz) window.retryQuiz();
                });
              }, 0);
              return;
            } else {
              // 还有尝试次数 — 显示鼓励弹窗（不含正确答案）
              showKnowledgePopup('答错了，再想想！', 'wrong');
            }
          }

          // 🔥 连击系统
          if (state.isCorrect) {
            streak++;
            const streakEl = document.getElementById('quiz-streak-display');
            // 连击奖励
            let bonusText = '';
            let bonusCoins = 0;
            if (streak === 3) {
              bonusText = '🔥 三连击！';
              bonusCoins = 3;
            } else if (streak === 5) {
              bonusText = '⚡ 五连绝世！';
              bonusCoins = 5;
            } else if (streak === 10) {
              bonusText = '🌟 十全十美！';
              bonusCoins = 10;
            }
            if (bonusCoins > 0 && window.gameState) {
              window.gameState.coins += bonusCoins;
              if (window.updateStatsDisplay) window.updateStatsDisplay(window.gameState);
              autoSave(window.gameState);
              // 额外浮动奖励
              showFloatingScore(cardArea, bonusText + ' +' + bonusCoins + ' 🪙', true);
              // 连击音效
              if (typeof window.playSound === 'function') {
                window.playSound('perfect');
              }
              // 小型撒花
              if (typeof window.createConfetti === 'function') {
                window.createConfetti(12);
              }
            }
            if (streakEl) {
              if (streak >= 2) {
                const fireIcons = streak >= 5 ? '🔥🔥🔥' : streak >= 3 ? '🔥🔥' : '🔥';
                streakEl.textContent = fireIcons + ' ' + streak + ' 连击！';
                streakEl.style.color = streak >= 5 ? '#fbbf24' : '#f87171';
              } else {
                streakEl.textContent = '';
              }
            }
          } else {
            streak = 0;
            const streakEl = document.getElementById('quiz-streak-display');
            if (streakEl) streakEl.textContent = '';
          }

          // 🏆 Boss 题答对 — 额外庆祝
          if (state.isCorrect && isBoss) {
            if (typeof window.createConfetti === 'function') {
              window.createConfetti(25);
            }
            if (typeof window.playSound === 'function') {
              setTimeout(() => window.playSound('perfect'), 150);
            }
          }

          // 弹窗知识点 + 鼓励（仅在答对时弹，答错已在上面弹过）
          if (state.isCorrect) {
            showKnowledgePopup(q.explain, 'correct');
          }

          renderQuestion(idx);
          updateUI();
        });
      });
      }
    }

    // 💡 知识点提示
    const hintBtn = cardArea.querySelector('.quiz-hint-btn');
    if (hintBtn) {
      hintBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showKnowledgeHint(q);
      });
    }

    // 🤖 AI 搜寻答案
    const aiBtn = cardArea.querySelector('.quiz-ai-btn');
    if (aiBtn) {
      aiBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        aiSearchAnswer(q, idx);
      });
    }

    // 🔄 再试一次 — 重置本题作答状态重新尝试
    const retryBtn = cardArea.querySelector('.quiz-retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        state.answered = false;
        state.selected = null;
        state.isCorrect = false;
        renderQuestion(idx);
        updateUI();
      });
    }

    updateProgress(idx);
    updateUI();
  }

  function updateProgress(idx) {
    progressText.textContent = (idx + 1) + '/' + total;
    progressBar.style.width = ((idx + 1) / total * 100) + '%';
  }

  function updateUI() {
    const answeredCount = answerState.filter(s => s.answered).length;
    const curAns = answerState[currentIdx].answered;
    prevBtn.style.display = currentIdx > 0 ? 'inline-flex' : 'none';
    nextBtn.style.display = (currentIdx < total - 1 && curAns) ? 'inline-flex' : 'none';
    finishBtn.style.display = (currentIdx === total - 1 && curAns) ? 'inline-flex' : 'none';
    if (answeredCount === total) {
      finishBtn.style.display = 'inline-flex';
      nextBtn.style.display = 'none';
    }
  }

  // 按钮事件（带卡片动画）
  prevBtn.addEventListener('click', () => {
    if (currentIdx > 0) {
      animateCardTransition(cardArea, 'right');
      currentIdx--;
      setTimeout(() => renderQuestion(currentIdx), 50);
    }
  });
  nextBtn.addEventListener('click', () => {
    if (currentIdx < total - 1) {
      animateCardTransition(cardArea, 'left');
      currentIdx++;
      setTimeout(() => renderQuestion(currentIdx), 50);
    }
  });
  finishBtn.addEventListener('click', () => {
    if (typeof window.playSound === 'function') {
      window.playSound('perfect');
    }
    const correctCount = answerState.filter(s => s.isCorrect).length;
    // 将答题结果存到 DOM 上供 checkQuizProgress 读取
    quizResult.dataset.total = total;
    quizResult.dataset.correct = correctCount;
    quizResult.dataset.answered = 'true';
    quizResult.innerHTML = '<div style="color:#fbbf24;font-size:1.2rem;font-weight:bold;padding:1rem;">'
      + '🎉 答题完成！共 ' + total + ' 题，答对 ' + correctCount + ' 题（' + Math.round(correctCount / total * 100) + '%）</div>';
    if (window.checkQuizProgress) window.checkQuizProgress();
  });

  // 渲染第一题
  renderQuestion(0);
}

/**
 * 知识点弹窗 — 浮动小卡片，约 2.5s 自动消失
 * @param {string} explainText - 知识点解析文本
 */
export function showKnowledgePopup(explainText, type) {
  // 移除之前的弹窗
  const old = document.querySelector('.knowledge-popup');
  if (old) old.remove();

  const isCorrect = type === 'correct';
  const popup = document.createElement('div');
  popup.className = 'knowledge-popup' + (isCorrect ? '' : ' wrong');
  popup.setAttribute('role', 'alert');
  popup.innerHTML = `
    <div style="font-size:1.3rem;margin-bottom:0.25rem;">
      ${isCorrect ? '🎉 答对了！' : '💪 别灰心！'}
    </div>
    <div style="font-size:0.9rem;line-height:1.5;margin-bottom:0.5rem;">
      ${isCorrect
        ? '继续加油，你的数学思维越来越棒！⭐'
        : '学习就是在试错中进步，每一次犯错都是成长的养分！'}
    </div>
    <div style="font-size:0.85rem;line-height:1.5;color:#94a3b8;padding:0.5rem;border-radius:8px;background:rgba(0,0,0,0.2);">
      ${escapeHtml(explainText)}
    </div>
    ${!isCorrect ? `
    <div style="margin-top:0.6rem;font-size:0.85rem;color:#fbbf24;display:flex;gap:0.5rem;flex-wrap:wrap;">
      <span>📖 看书复习一下</span>
      <span>📺 看看视频教程</span>
      <span>💪 再试一次一定行</span>
    </div>` : ''}
  `;
  document.body.appendChild(popup);

  // 触发入场动画
  requestAnimationFrame(() => {
    popup.classList.add('visible');
  });

  // 正确约 2.5s，错误约 3.5s 后淡出
  const duration = isCorrect ? 2500 : 3500;
  setTimeout(() => {
    popup.classList.remove('visible');
    popup.classList.add('hiding');
    setTimeout(() => popup.remove(), 400);
  }, duration);
}

/**
 * 浮动得分动画 — 从指定位置飘出数字，上升 + 淡出
 * @param {HTMLElement} anchor - 锚点元素（得分出现在其上方）
 * @param {string} text - 显示文字（如 "+2 🪙"）
 * @param {boolean} isPositive - 是否正向得分（影响颜色）
 */
export function showFloatingScore(anchor, text, isPositive) {
  if (!anchor) return;
  const rect = anchor.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'float-score';
  el.textContent = text;
  el.style.cssText = `
    position: fixed; left: ${rect.left + rect.width / 2}px; top: ${rect.top - 10}px;
    transform: translateX(-50%);
    font-size: 1.3rem; font-weight: bold; pointer-events: none; z-index: 99999;
    color: ${isPositive ? '#34d399' : '#fbbf24'};
    text-shadow: 0 0 10px ${isPositive ? 'rgba(52, 211, 153, 0.6)' : 'rgba(251, 191, 36, 0.6)'};
    animation: floatScoreUp 1s ease-out forwards;
  `;
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

/**
 * 屏幕震动效果 — 答错时触发
 */
export function screenShake() {
  const el = document.body;
  el.classList.add('shaking');
  setTimeout(() => el.classList.remove('shaking'), 400);
}

/**
 * 💡 知识点提示弹窗 — 显示当前题目的知识点解析（不暴露答案）
 * @param {Object} q - 题目对象
 */
export function showKnowledgeHint(q) {
  // 移除之前的弹窗
  document.querySelector('.knowledge-popup')?.remove();

  const popup = document.createElement('div');
  popup.className = 'knowledge-popup';
  popup.setAttribute('role', 'alert');
  popup.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.95);
    z-index: 99999; max-width: 420px; width: 90%; padding: 1.2rem 1.5rem;
    background: linear-gradient(135deg, #1e293b, #0f172a);
    border: 1px solid rgba(251, 191, 36, 0.35);
    border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.6);
    color: #e2e8f0; opacity: 0; transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: auto;
  `;
  popup.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.8rem;">
      <span style="font-size:1.2rem;font-weight:bold;color:#fbbf24;">💡 知识点提示</span>
      <button id="hint-close-btn" style="background:none;border:none;color:#94a3b8;font-size:1.3rem;cursor:pointer;padding:0.2rem;">✕</button>
    </div>
    <div style="background:rgba(251,191,36,0.08);padding:0.7rem 0.9rem;border-radius:10px;border-left:3px solid #fbbf24;">
      <div style="color:#fbbf24;font-size:0.8rem;margin-bottom:0.3rem;">📌 思考方向</div>
      <div style="color:#e0e7ff;font-size:0.9rem;line-height:1.6;">${q.explain}</div>
    </div>
    <div style="margin-top:0.8rem;text-align:center;color:#64748b;font-size:0.8rem;">
      提示仅供参考，先自己思考再查看哦 🤔
    </div>`;
  document.body.appendChild(popup);
  requestAnimationFrame(() => {
    popup.style.opacity = '1';
    popup.style.transform = 'translate(-50%, -50%) scale(1)';
  });
  popup.querySelector('#hint-close-btn').addEventListener('click', () => popup.remove());
  popup.addEventListener('click', (e) => { if (e.target === popup) popup.remove(); });
}

/** 🤖 AI 搜寻答案 — 弹窗显示题目文本，用户复制后点击按钮打开 DeepSeek */
export function aiSearchAnswer(q) {
  try {
    console.log('aiSearchAnswer called', q?.q?.substring(0, 30));
    if (!q || !q.q) { console.error('aiSearchAnswer: invalid q', q); return; }
    let prompt;
    if (q.type === 'numberline') {
      prompt = `题目（交互题 - 数轴定位）：${q.q}\n正确答案：${q.answer}\n\n要求：\n- 耐心面向小升初学生讲解数轴和绝对值的概念\n- 适当补充知识背景\n- 帮助理解为什么答案在数轴的这个位置`;
    } else {
      if (!q.options) return;
      const opts = q.options.map((o, j) => `${String.fromCharCode(65 + j)}. ${o}`).join('\n');
      prompt = `题目：${q.q}\n选项：\n${opts}\n\n要求：\n- 耐心面向小升初学生讲解\n- 适当补充知识背景\n- 一步一步推演\n- 给出正确答案和解题过程`;
    }

    const popup = document.createElement('div');
    popup.className = 'knowledge-popup';
    Object.assign(popup.style, {
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
      zIndex: '99999', maxWidth: '480px', width: '90%',
      padding: '1.2rem 1.5rem',
      background: 'linear-gradient(135deg,#1e293b,#0f172a)',
      border: '1px solid rgba(99,102,241,0.35)', borderRadius: '16px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.6)', color: '#e2e8f0',
      opacity: '1', pointerEvents: 'auto'
    });
    popup.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.8rem;">
        <span style="font-size:1.1rem;font-weight:bold;color:#818cf8;">🤖 复制下方内容</span>
        <button id="ai-copy-close" style="background:none;border:none;color:#94a3b8;font-size:1.3rem;cursor:pointer;padding:0.2rem;">✕</button>
      </div>
      <textarea id="ai-copy-text" readonly style="width:100%;height:150px;padding:0.7rem;border-radius:10px;
        border:1px solid rgba(99,102,241,0.25);background:rgba(0,0,0,0.3);color:#e0e7ff;font-size:0.85rem;
        line-height:1.6;resize:none;outline:none;box-sizing:border-box;">${prompt}</textarea>
      <button id="ai-open-deepseek" style="display:block;width:100%;margin-top:0.8rem;padding:0.6rem;
        border-radius:10px;border:none;background:linear-gradient(135deg,#6366f1,#818cf8);
        color:#fff;font-size:0.9rem;cursor:pointer;">
        🚀 打开 DeepSeek 粘贴搜索
      </button>`;
    document.body.appendChild(popup);
    console.log('aiSearchAnswer: popup appended');

    popup.querySelector('#ai-copy-close').addEventListener('click', () => popup.remove());
    const textarea = popup.querySelector('#ai-copy-text');
    textarea.addEventListener('click', () => textarea.select());
    popup.querySelector('#ai-open-deepseek').addEventListener('click', () => {
      textarea.select();
      document.execCommand('copy');
      window.open('https://chat.deepseek.com/', '_blank');
      popup.remove();
    });
    // HTTP 下 navigator.clipboard 不可用，改为自动全选 textarea 方便用户 Ctrl+C
    textarea.select();
  } catch (e) {
    console.error('aiSearchAnswer error:', e);
  }
}

/**
 * 卡片切换动画 — 为新卡片容器添加滑入动画
 * @param {HTMLElement} cardArea - 卡片容器
 * @param {string} direction - 'left' | 'right'
 */
export function animateCardTransition(cardArea, direction) {
  if (!cardArea) return;
  cardArea.style.animation = 'none';
  // 触发回流
  void cardArea.offsetHeight;
  cardArea.style.animation = direction === 'right'
    ? 'quizSlideInRight 0.35s ease-out'
    : 'quizSlideInLeft 0.35s ease-out';
}

/**
 * 显示模态框
 * @param {string} content - 模态框内容 HTML
 * @param {Function} onClose - 关闭回调
 */
export function showModal(content, onClose) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-content" role="dialog" aria-modal="true">
      ${content}
    </div>
  `;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      if (onClose) onClose();
    }
  });

  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      overlay.remove();
      document.removeEventListener('keydown', handleEsc);
      if (onClose) onClose();
    }
  };
  document.addEventListener('keydown', handleEsc);

  document.body.appendChild(overlay);
}

/**
 * 渲染侧边栏「你知道吗」跑马灯轮播
 * @param {HTMLElement} container
 * @param {number} galaxyId
 */
export function renderKnowledgeSidebar(container, galaxyId) {
  const sections = KNOWLEDGE_SIDEBAR[galaxyId];
  if (!sections || sections.length === 0) {
    container.innerHTML = '<div style="color:#64748b;padding:1rem;font-size:0.9rem;">暂无该关的扩展知识</div>';
    return;
  }

  // 展平为幻灯片列表
  const slides = [];
  sections.forEach(sec => {
    sec.items.forEach(item => {
      slides.push({
        categoryTitle: sec.title,
        categoryColor: sec.color,
        label: item.label,
        text: item.text
      });
    });
  });

  const total = slides.length;
  let current = 0;
  let timer = null;

  function renderSlideHTML(index) {
    const s = slides[index];
    return `
      <div class="marquee-category" style="color:${s.categoryColor}">${s.categoryTitle}</div>
      <div class="marquee-label">${s.label}</div>
      <div class="marquee-text">${s.text}</div>
    `;
  }

  function updateView() {
    const inner = container.querySelector('.marquee-viewport-inner');
    const dots = container.querySelectorAll('.marquee-dot');
    const counter = container.querySelector('.marquee-counter');
    if (inner) {
      inner.innerHTML = renderSlideHTML(current);
      inner.style.animation = 'none';
      inner.offsetHeight; // force reflow
      inner.style.animation = 'marqueeFadeIn 0.45s ease';
    }
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    if (counter) counter.textContent = `${current + 1} / ${total}`;
  }

  function goTo(index) {
    current = ((index % total) + total) % total;
    updateView();
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() { stopAuto(); timer = setInterval(next, 5500); }
  function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }

  // 构建 DOM
  container.innerHTML = `
    <div class="marquee-container">
      <div class="sidebar-header">
        <span class="sidebar-icon">💡</span>
        <span>你知道吗</span>
        <span class="marquee-counter">1 / ${total}</span>
      </div>
      <div class="marquee-viewport">
        <div class="marquee-viewport-inner">
          ${renderSlideHTML(0)}
        </div>
      </div>
      <div class="marquee-footer">
        <div class="marquee-dots">
          ${Array.from({ length: total }, (_, i) =>
            `<span class="marquee-dot${i === 0 ? ' active' : ''}"></span>`
          ).join('')}
        </div>
        <div class="marquee-footer-right">
          <button class="marquee-btn marquee-ai-btn" aria-label="AI 搜索" title="搜索更多相关知识">🤖 搜</button>
          <button class="marquee-btn marquee-next" aria-label="下一条">下一条 →</button>
        </div>
      </div>
    </div>
  `;

  // 事件绑定
  container.querySelector('.marquee-next')?.addEventListener('click', () => { next(); startAuto(); });

  container.querySelector('.marquee-ai-btn')?.addEventListener('click', () => {
    const s = slides[current];
    const query = encodeURIComponent(s.label.replace(/^[^\s]+\s/, '') + ' 数学');
    stopAuto();
    // 打开 AI 搜索结果页（模拟弹窗）
    const existing = container.querySelector('.marquee-ai-panel');
    if (existing) { existing.remove(); startAuto(); return; }

    const panel = document.createElement('div');
    panel.className = 'marquee-ai-panel';
    panel.innerHTML = `
      <div class="marquee-ai-header">
        <span>🤖 AI 搜索</span>
        <button class="marquee-ai-close">✕</button>
      </div>
      <div class="marquee-ai-body">
        <div class="marquee-ai-hint">关于「${s.label}」的搜索建议：</div>
        <div class="marquee-ai-links">
          <a href="https://www.bing.com/search?q=${query}" target="_blank" rel="noopener">🔍 Bing 搜索</a>
          <a href="https://chat.deepseek.com/" target="_blank" rel="noopener">🤖 DeepSeek 对话</a>
          <a href="https://www.baidu.com/s?wd=${query}" target="_blank" rel="noopener">🔍 百度搜索</a>
        </div>
        <div class="marquee-ai-tip">点击链接在新窗口查看详细内容</div>
      </div>
    `;
    container.querySelector('.marquee-container')?.appendChild(panel);

    panel.querySelector('.marquee-ai-close')?.addEventListener('click', () => {
      panel.remove();
      startAuto();
    });
  });

  container.querySelectorAll('.marquee-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  const vp = container.querySelector('.marquee-viewport');
  if (vp) {
    vp.addEventListener('mouseenter', stopAuto);
    vp.addEventListener('mouseleave', startAuto);
  }

  startAuto();
}
