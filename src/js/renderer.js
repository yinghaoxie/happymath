/**
 * 数学星环 - 渲染工具模块
 * 处理 DOM 渲染和更新操作
 */

import { GALAXIES, BILIBILI_VIDEOS, ACHIEVEMENTS, MONSTERS } from './data.js';

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
 * 创建星空背景
 * @param {HTMLElement} container - 星星容器元素
 */
export function createStars(container) {
  if (!container) return;
  
  const fragment = document.createDocumentFragment();
  
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    const size = Math.random() * 3 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.animationDelay = Math.random() * 3 + 's';
    fragment.appendChild(star);
  }
  
  container.appendChild(fragment);
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
    
    const progress = isCompleted ? 100 : (isSkipped ? 50 : 0);
    
    return `
      <div class="galaxy-card ${statusClass}" 
           data-id="${galaxy.id}" 
           role="button"
           tabindex="${isLocked ? '-1' : '0'}"
           aria-label="${galaxy.name}${isLocked ? '（未解锁）' : ''}"
           ${!isLocked ? `onclick="window.handleGalaxyClick(${galaxy.id})"` : ''}>
        <div class="galaxy-number">${galaxy.id}</div>
        <div class="galaxy-icon">${galaxy.icon}</div>
        <div class="galaxy-name">${escapeHtml(galaxy.name)}</div>
        <div class="galaxy-topic">${escapeHtml(galaxy.topic)}</div>
        <div class="galaxy-progress">
          <div class="galaxy-progress-bar" style="width: ${progress}%"></div>
        </div>
        ${isCompleted ? '<div style="color: #10b981; margin-top: 0.5rem; font-size: 0.9rem;">✅ 已完成</div>' : ''}
        ${isSkipped && !isCompleted ? '<div style="color: #6b7280; margin-top: 0.5rem; font-size: 0.9rem;">⏭️ 已跳过</div>' : ''}
        ${isLocked ? '<div style="color: #ef4444; margin-top: 0.5rem; font-size: 0.9rem;">🔒 需完成前一关</div>' : ''}
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
        <div style="color: #c7d2fe; font-size: 0.9rem;">${escapeHtml(achievement.desc)}</div>
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
 * 渲染怪兽列表
 * @param {HTMLElement} grid - 网格容器
 * @param {Object} gameState - 游戏状态
 */
export function renderMonsters(grid, gameState) {
  if (!grid) return;
  
  const cards = MONSTERS.map(monster => {
    const isPurified = gameState.monsters.includes(monster.id + '_purified');
    const isCaught = gameState.monsters.includes(monster.id);
    
    return `
      <div class="monster-card ${isPurified ? 'purified' : ''}">
        <div style="font-size: 4rem;" aria-hidden="true">${monster.icon}</div>
        <div style="color: #fbbf24; font-size: 1.1rem; margin-top: 0.5rem;">${escapeHtml(monster.name)}</div>
        <div style="color: #c7d2fe; font-size: 0.85rem;">${escapeHtml(monster.desc)}</div>
        ${!isCaught 
          ? '<div style="color: #6b7280; font-size: 0.8rem; margin-top: 0.5rem;" aria-label="未发现">🔒 未发现</div>' 
          : ''}
        ${isCaught && !isPurified 
          ? `<button class="action-btn success" 
                     style="margin-top: 0.5rem; font-size: 0.9rem; padding: 0.4rem 1rem;" 
                     onclick="window.purifyMonster('${monster.id}')"
                     aria-label="净化${monster.name}">✨ 净化</button>` 
          : ''}
        ${isPurified 
          ? '<div style="color: #10b981; font-size: 0.85rem; margin-top: 0.5rem;" aria-label="已净化">✨ 已净化</div>' 
          : ''}
      </div>
    `;
  }).join('');
  
  grid.innerHTML = cards;
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
    container.innerHTML = '<p style="color: #c7d2fe; text-align: center;">暂无配套视频</p>';
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
  
  // ESC 键关闭
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
