/**
 * 数学星环 - 交互式题型渲染模块
 * 支持数轴定位、坐标绘点等 Canvas 交互题型
 */

/**
 * 设置 Canvas 适配 HiDPI 屏
 */
function setupCanvas(canvas, w, h) {
  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}

/**
 * 绘制数轴刻度线和标签
 */
function drawAxis(ctx, ox, oy, axisLen, scale, rangeMin, rangeMax, tickStep, highlightVal, clickVal) {
  const w = axisLen * 2;
  ctx.clearRect(0, 0, ctx.canvas.width / (window.devicePixelRatio || 1),
    ctx.canvas.height / (window.devicePixelRatio || 1));

  // 背景
  ctx.fillStyle = 'rgba(15,23,42,0.6)';
  ctx.beginPath();
  ctx.roundRect(10, oy - 50, w + 20, 100, 12);
  ctx.fill();

  // 轴线
  ctx.strokeStyle = '#818cf8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(ox - axisLen, oy);
  ctx.lineTo(ox + axisLen, oy);
  ctx.stroke();

  // 箭头
  ctx.fillStyle = '#818cf8';
  drawArrow(ctx, ox + axisLen, oy, 'right');
  drawArrow(ctx, ox - axisLen, oy, 'left');

  // 刻度+标签
  ctx.font = '13px "Ma Shan Zheng", "Comic Sans MS", cursive, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let v = rangeMin; v <= rangeMax; v += tickStep) {
    const px = ox + v * scale;
    if (px < 10 || px > ox + axisLen + 10) continue;
    ctx.strokeStyle = v === 0 ? '#fbbf24' : 'rgba(148,163,184,0.5)';
    ctx.lineWidth = v === 0 ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(px, oy - 6);
    ctx.lineTo(px, oy + 6);
    ctx.stroke();
    ctx.fillStyle = v === 0 ? '#fbbf24' : '#94a3b8';
    ctx.fillText(String(v), px, oy + 10);
  }

  // 用户点击标记
  if (clickVal !== null) {
    const cpx = ox + clickVal * scale;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(cpx, oy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cpx, oy, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px "Ma Shan Zheng", "Comic Sans MS", cursive, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('你点的位置', cpx, oy - 14);
  }

  // 正确答案标记
  if (highlightVal !== null && clickVal !== null) {
    const hpx = ox + highlightVal * scale;
    const isCorrect = Math.abs(clickVal - highlightVal) <= 0.001;
    ctx.fillStyle = isCorrect ? '#34d399' : '#ef4444';
    ctx.beginPath();
    ctx.moveTo(hpx, oy - 18);
    ctx.lineTo(hpx + 8, oy - 10);
    ctx.lineTo(hpx, oy - 2);
    ctx.lineTo(hpx - 8, oy - 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = isCorrect ? '#34d399' : '#f87171';
    ctx.font = 'bold 13px "Ma Shan Zheng", "Comic Sans MS", cursive, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(isCorrect ? '✓ 正确位置' : '✗ 正确位置', hpx, oy - 20);
  }
}

function drawArrow(ctx, tipX, tipY, dir) {
  const size = 8;
  ctx.beginPath();
  if (dir === 'right') {
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX - size, tipY - size / 2);
    ctx.lineTo(tipX - size, tipY + size / 2);
  } else {
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX + size, tipY - size / 2);
    ctx.lineTo(tipX + size, tipY + size / 2);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * 渲染数轴定位题型
 * @param {HTMLElement} container - 放置 Canvas 的容器
 * @param {object} q - 题目对象 { q, axisMin, axisMax, tickStep, answer, explain }
 * @param {object} state - 答题状态 { selected, answered, isCorrect, wrongAttempts }
 * @param {Function} [onSubmit] - 提交答案后的回调，用于触发奖励/连击/重绘
 */
export function renderNumberLine(container, q, state, onSubmit) {
  container.innerHTML = '';

  // 题目文字
  const prompt = document.createElement('div');
  prompt.style.cssText = 'color:#e0e7ff;font-size:1.1rem;line-height:1.7;margin-bottom:1rem;font-weight:500;text-align:center;';
  prompt.textContent = q.q;
  container.appendChild(prompt);

  // 创建 Canvas
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:block;margin:0 auto;cursor:pointer;border-radius:12px;touch-action:none;';
  container.appendChild(canvas);

  const W = 420, H = 140;
  const ctx = setupCanvas(canvas, W, H);

  const axisLen = 170;
  const ox = W / 2;
  const oy = H / 2 + 6;
  const range = q.axisMax - q.axisMin;
  const scale = axisLen / range; // pixels per unit

  let userVal = state.selected !== undefined ? state.selected : null;

  /**
   * 将 Canvas 像素坐标转换为数轴数值
   */
  function pixelToVal(px) {
    return (px - ox) / scale;
  }

  function valToPixel(v) {
    return ox + v * scale;
  }

  function redraw() {
    drawAxis(ctx, ox, oy, axisLen, scale, q.axisMin, q.axisMax, q.tickStep,
      state.answered ? q.answer : null, userVal);
  }

  redraw();

  // 点击事件
  const clickHandler = (e) => {
    if (state.answered) return;
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * (W / rect.width);
    const py = (e.clientY - rect.top) * (H / rect.height);

    // 只响应靠近轴线的点击（垂直范围 ±30px）
    if (py < oy - 30 || py > oy + 30) return;

    userVal = Math.round(pixelToVal(px) / q.tickStep) * q.tickStep;
    // 限制在范围内
    userVal = Math.max(q.axisMin, Math.min(q.axisMax, userVal));
    state.selected = userVal;
    redraw();
  };

  canvas.addEventListener('click', clickHandler);

  // 触屏支持
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const px = (touch.clientX - rect.left) * (W / rect.width);
    const py = (touch.clientY - rect.top) * (H / rect.height);
    if (py < oy - 30 || py > oy + 30) return;
    userVal = Math.round(pixelToVal(px) / q.tickStep) * q.tickStep;
    userVal = Math.max(q.axisMin, Math.min(q.axisMax, userVal));
    state.selected = userVal;
    redraw();
  }, { passive: false });

  // 提交按钮（未作答时显示）
  if (!state.answered) {
    const submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.textContent = userVal !== null ? '✓ 确认位置' : '👆 点击数轴选择位置';
    submitBtn.style.cssText = 'display:block;margin:0.8rem auto 0;padding:0.6rem 2rem;border-radius:10px;border:2px solid #fbbf24;background:rgba(251,191,36,0.1);color:#fbbf24;font-size:1rem;cursor:pointer;transition:all 0.2s;';
    if (userVal === null) submitBtn.style.opacity = '0.5';
    container.appendChild(submitBtn);

    const updateBtnText = () => {
      submitBtn.textContent = userVal !== null ? `✓ 确认 (${userVal})` : '👆 点击数轴选择位置';
      submitBtn.style.opacity = userVal !== null ? '1' : '0.5';
    };
    updateBtnText();

    // 每次点击canvas后更新按钮文字
    const origMouseDown = canvas._origMouseDown;
    canvas.addEventListener('click', updateBtnText);

    submitBtn.addEventListener('click', () => {
      if (userVal === null) return;
      state.answered = true;
      state.isCorrect = Math.abs(userVal - q.answer) <= 0.001; // 浮点容差
      state.selected = userVal;
      redraw();

      // 显示正确/错误标记
      const isCorrect = state.isCorrect;
      const resultBox = document.createElement('div');
      resultBox.style.cssText = `margin-top:0.8rem;padding:0.7rem 0.9rem;border-radius:10px;background:${isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'};color:${isCorrect ? '#34d399' : '#f87171'};font-size:0.9rem;line-height:1.5;text-align:center;`;
      resultBox.innerHTML = isCorrect
        ? `✅ 完全正确！你点的位置 ${userVal} 就是正确答案！<br><span style="color:#94a3b8;font-size:0.85rem;">${q.explain}</span>`
        : `❌ 你点的位置是 ${userVal}，正确答案是 ${q.answer}<br><span style="color:#fbbf24;font-size:0.85rem;">💡 ${q.explain}</span>`;
      container.appendChild(resultBox);
      submitBtn.remove();

      // 音效
      if (typeof window.playSound === 'function') {
        window.playSound(isCorrect ? 'correct' : 'wrong');
      }

      // 触发主流程回调
      if (typeof onSubmit === 'function') onSubmit();
    });
  } else {
    // 已作答：可选添加确认提示
    const statusBox = document.createElement('div');
    statusBox.style.cssText = `margin-top:0.8rem;padding:0.7rem 0.9rem;border-radius:10px;background:${state.isCorrect ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'};color:${state.isCorrect ? '#34d399' : '#f87171'};font-size:0.9rem;line-height:1.5;text-align:center;`;
    const shownVal = state.selected !== undefined ? state.selected : q.answer;
    statusBox.innerHTML = state.isCorrect
      ? `✅ 完全正确！位置 ${shownVal} 正确！<br><span style="color:#94a3b8;font-size:0.85rem;">${q.explain}</span>`
      : `❌ 你的位置 ${shownVal} 不正确，正确答案是 ${q.answer}<br><span style="color:#fbbf24;font-size:0.85rem;">💡 ${q.explain}</span>`;
    container.appendChild(statusBox);
  }
}
