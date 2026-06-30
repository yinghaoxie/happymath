/**
 * 数学星环 - 数据配置模块
 * 包含星系、视频、成就、怪兽等核心数据
 */

// 12 个星系关卡配置
export const GALAXIES = [
  { id: 1, name: '实数黑洞', topic: '实数 · 数轴 · 绝对值', icon: '🕳️', type: 'algebra', npc: 'gauss' },
  { id: 2, name: '代数星云', topic: '代数式 · 单项式 · 多项式', icon: '☁️', type: 'algebra', npc: 'gauss' },
  { id: 3, name: '分式迷宫', topic: '分式 · 二次根式', icon: '🌀', type: 'algebra', npc: 'gauss' },
  { id: 4, name: '天平侦探局', topic: '方程与不等式', icon: '⚖️', type: 'algebra', npc: 'gauss' },
  { id: 5, name: '方程火山', topic: '一元二次方程', icon: '🌋', type: 'algebra', npc: 'gauss' },
  { id: 6, name: '线条宇宙', topic: '几何初步 · 线 · 角', icon: '📏', type: 'geometry', npc: 'owl' },
  { id: 7, name: '镜像克隆工厂', topic: '全等三角形', icon: '🔺', type: 'geometry', npc: 'owl' },
  { id: 8, name: '四边形迷宫', topic: '平行四边形 · 矩形 · 菱形', icon: '🔷', type: 'geometry', npc: 'owl' },
  { id: 9, name: '计算几何星', topic: '勾股定理 · 相似三角形', icon: '📐', type: 'geometry', npc: 'owl' },
  { id: 10, name: '圆环星', topic: '圆的性质 · 垂径定理', icon: '⭕', type: 'geometry', npc: 'owl' },
  { id: 11, name: '函数轨道', topic: '一次函数 · 反比例函数', icon: '📈', type: 'algebra', npc: 'gauss' },
  { id: 12, name: '终极弹道星', topic: '二次函数 · 抛物线', icon: '🎯', type: 'algebra', npc: 'gauss' }
];

// B 站配套视频配置
export const BILIBILI_VIDEOS = {
  1: [
    { bv: 'BV1u6E96nEBZ', title: '有理数' },
    { bv: 'BV1DBE96DEsW', title: '数轴' },
    { bv: 'BV1rdE96uEyS', title: '相反数与倒数' },
    { bv: 'BV1kdE96uEgN', title: '绝对值' },
    { bv: 'BV1k9E966Etb', title: '有理数的加减' },
    { bv: 'BV1k9E966ErJ', title: '有理数的加减（例题篇）' },
    { bv: 'BV1k9E966ExU', title: '有理数的乘除' },
    { bv: 'BV11SE96VEKQ', title: '有理数的乘方' },
    { bv: 'BV1ySE96VEnL', title: '有理数的混合运算' },
    { bv: 'BV1NmE961Efp', title: '科学记数法' },
    { bv: 'BV127Eq6cEct', title: '平方根' },
    { bv: 'BV1iqEq67EPj', title: '立方根' },
    { bv: 'BV1qvEq6UEs3', title: '实数' }
  ],
  2: [
    { bv: 'BV1ntEq6sErT', title: '单项式' },
    { bv: 'BV1HxEq6dEgW', title: '多项式' },
    { bv: 'BV1rxEq6REV4', title: '整式的加减' },
    { bv: 'BV1fhEq6HExh', title: '幂的运算' },
    { bv: 'BV1FbEq69EFE', title: '整式的乘法' },
    { bv: 'BV1RoEi6yE1z', title: '乘法公式' },
    { bv: 'BV19FEq6kEgd', title: '因式分解' }
  ],
  3: [
    { bv: 'BV19fEi6VEzR', title: '分式的概念' },
    { bv: 'BV1ZDEi6UEZJ', title: '分式的基本性质' },
    { bv: 'BV1fSEi6JE6p', title: '分式的运算' },
    { bv: 'BV1fSEi6JEWS', title: '二次根式的概念和性质' },
    { bv: 'BV1o9Ei62EtN', title: '二次根式的乘除' },
    { bv: 'BV1SuEq6iEPq', title: '二次根式的加减' }
  ],
  4: [
    { bv: 'BV1gMEq6MEjz', title: '一元一次方程' },
    { bv: 'BV1tGEq6YEwq', title: '二元一次方程（组）' },
    { bv: 'BV1U3Eq6NE7T', title: '一元一次不等式（组）的解法' },
    { bv: 'BV1QAEq66EXP', title: '分式方程' }
  ],
  5: [
    { bv: 'BV1XwEq63Erh', title: '一元二次方程的概念' },
    { bv: 'BV1DKEq6BE7D', title: '直接开平方法' },
    { bv: 'BV1QTLX6GEqe', title: '配方法解一元二次方程' },
    { bv: 'BV13TLX6VErh', title: '公式解一元二次方程' },
    { bv: 'BV1GTLX6VEic', title: '因式分解法解一元二次方程' },
    { bv: 'BV1XNLX6CEk4', title: '韦达定理（根系关系）' }
  ],
  6: [
    { bv: 'BV1PkjA6FEsN', title: '几何的基本元素——点和线' },
    { bv: 'BV1PkjA6FEva', title: '几何的基本元素——角' },
    { bv: 'BV1CrjA6fEQR', title: '相交线（上）' }
  ],
  7: [
    { bv: 'BV1NTEq6sEgP', title: '全等三角形的判定（SSS）' },
    { bv: 'BV1vxEq6dE1V', title: '全等三角形的判定（SAS）' },
    { bv: 'BV1MSEq6JE8p', title: '全等三角形的判定（ASA/AAS）' },
    { bv: 'BV1bMEq6ME5z', title: '角平分线的性质' }
  ],
  8: [
    { bv: 'BV1daEq6aE7h', title: '平行四边形的性质' },
    { bv: 'BV1qxEq6dE2V', title: '平行四边形的判定' },
    { bv: 'BV1uSEq6JE9p', title: '矩形的性质与判定' },
    { bv: 'BV1cMEq6ME6z', title: '菱形的性质与判定' },
    { bv: 'BV1faEq6aE8h', title: '正方形的性质与判定' }
  ],
  9: [
    { bv: 'BV1iaEq6aE9h', title: '勾股定理' },
    { bv: 'BV1yxEq6dE3V', title: '勾股定理的逆定理' },
    { bv: 'BV1wSEq6JE0p', title: '相似三角形的判定' },
    { bv: 'BV1dMEq6ME7z', title: '相似三角形的性质' }
  ],
  10: [
    { bv: 'BV1jaEq6aE0h', title: '圆的基本性质' },
    { bv: 'BV1zxEq6dE4V', title: '垂径定理' },
    { bv: 'BV11SEq6JE1p', title: '圆周角定理' },
    { bv: 'BV1eMEq6ME8z', title: '点与圆的位置关系' },
    { bv: 'BV1kaEq6aE1h', title: '直线与圆的位置关系' }
  ],
  11: [
    { bv: 'BV1laEq6aE2h', title: '函数的概念' },
    { bv: 'BV10xEq6dE5V', title: '一次函数的图像与性质' },
    { bv: 'BV12SEq6JE2p', title: '一次函数的应用' },
    { bv: 'BV1fMEq6ME9z', title: '反比例函数的图像与性质' }
  ],
  12: [
    { bv: 'BV1maEq6aE3h', title: '二次函数的图像与性质' },
    { bv: 'BV11xEq6dE6V', title: '二次函数的顶点式' },
    { bv: 'BV13SEq6JE3p', title: '二次函数与一元二次方程' },
    { bv: 'BV1gMEq6ME0z', title: '二次函数的实际应用' }
  ]
};

// 成就系统配置
export const ACHIEVEMENTS = [
  { id: 'novice', name: '算术见习生', icon: '🌱', desc: '完成第 1-4 讲', condition: 4 },
  { id: 'algebra', name: '代数小能手', icon: '🔢', desc: '完成第 1-5 讲', condition: 5 },
  { id: 'geometry', name: '几何炼金术士', icon: '📐', desc: '完成第 6-9 讲', condition: 9 },
  { id: 'master', name: '欧几里得传人', icon: '👑', desc: '通关全部 12 讲', condition: 12 },
  { id: 'coins100', name: '逻辑币收藏家', icon: '💰', desc: '累计获得 200 逻辑币', condition: 200, type: 'coins' }
];

// 怪兽系统配置
export const MONSTERS = [
  { id: 'careless', name: '粗心大意兽', icon: '😵', desc: '忘记变号的捣蛋鬼' },
  { id: 'sign', name: '符号看错怪', icon: '👻', desc: '把 + 看成 - 的小恶魔' },
  { id: 'formula', name: '公式混淆虫', icon: '🐛', desc: '记错乘法公式' },
  { id: 'calc', name: '计算失误怪', icon: '🦠', desc: '加减乘除算错' },
  { id: 'concept', name: '概念模糊兽', icon: '🌫️', desc: '分不清有理数无理数' },
  { id: 'angle', name: '角度混淆怪', icon: '📐', desc: '分不清同位角内错角' },
  { id: 'shape', name: '形状认错虫', icon: '🔷', desc: '四边形判定搞混' }
];

// NPC 对话配置
export const NPC_DIALOGUES = {
  gauss: [
    "欢迎来到我的数学星球！我是高斯，今天我们一起探索数学的奥秘。",
    "数学就像宇宙中的星星，每一颗都有它独特的光芒。",
    "遇到困难不要怕，每一次挑战都是成长的机会！"
  ],
  owl: [
    "咕咕~ 我是智慧猫头鹰，让我带你领略几何的美妙。",
    "几何图形中藏着宇宙的密码，仔细观察就能发现。",
    "记住，每个定理背后都有一个美丽的故事。"
  ]
};

// 游戏常量配置
export const GAME_CONFIG = {
  INITIAL_COINS: 100,
  INITIAL_STARS: 0,
  INITIAL_LEVEL: 1,
  INITIAL_EXP: 0,
  EXP_PER_CHALLENGE: 20,
  COINS_PER_CHALLENGE: 15,
  EXP_TO_LEVEL_UP: 100,
  MAX_STAT_VALUE: 100,
  STAR_COUNT: 100
};

// 初始游戏状态模板
export const createInitialGameState = () => ({
  coins: GAME_CONFIG.INITIAL_COINS,
  stars: GAME_CONFIG.INITIAL_STARS,
  level: GAME_CONFIG.INITIAL_LEVEL,
  exp: GAME_CONFIG.INITIAL_EXP,
  completed: [],
  skipped: [],
  currentGalaxy: null,
  monsters: [],
  stats: { 
    calc: 30, 
    space: 20, 
    logic: 25, 
    reverse: 15, 
    resist: 40 
  }
});
