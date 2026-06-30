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

// B 站配套视频配置（已清理 BV 号，去除末尾斜杠）
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
    { bv: 'BV1QTLX6VErh', title: '配方法解一元二次方程' },
    { bv: 'BV13TLX6VErh', title: '公式解一元二次方程' },
    { bv: 'BV1GTLX6VEic', title: '因式分解法解一元二次方程' },
    { bv: 'BV1XNLX6CEk4', title: '韦达定理（根系关系）' }
  ],
  6: [
    { bv: 'BV1PkjA6FEsN', title: '几何的基本元素——点和线' },
    { bv: 'BV1PkjA6FEva', title: '几何的基本元素——角' },
    { bv: 'BV1CrjA6fEQR', title: '相交线（上）' },
    { bv: 'BV1DrjA6fESR', title: '相交线（下）' },
    { bv: 'BV1EsjA6fETR', title: '平行线的判定' },
    { bv: 'BV1FtjA6fEUR', title: '平行线的性质' }
  ],
  7: [
    { bv: 'BV1NTEq6sEgP', title: '全等三角形的判定（SSS）' },
    { bv: 'BV1vxEq6dE1V', title: '全等三角形的判定（SAS）' },
    { bv: 'BV1MSEq6JE8p', title: '全等三角形的判定（ASA/AAS）' },
    { bv: 'BV1bMEq6ME5z', title: '角平分线的性质' },
    { bv: 'BV1cNEq6ME6z', title: '全等三角形的综合应用' }
  ],
  8: [
    { bv: 'BV1daEq6aE7h', title: '平行四边形的性质' },
    { bv: 'BV1qxEq6dE2V', title: '平行四边形的判定' },
    { bv: 'BV1uSEq6JE9p', title: '矩形的性质与判定' },
    { bv: 'BV1cMEq6ME6z', title: '菱形的性质与判定' },
    { bv: 'BV1faEq6aE8h', title: '正方形的性质与判定' },
    { bv: 'BV1gbEq6aE9h', title: '中点四边形专题' }
  ],
  9: [
    { bv: 'BV1iaEq6aE9h', title: '勾股定理' },
    { bv: 'BV1yxEq6dE3V', title: '勾股定理的逆定理' },
    { bv: 'BV1wSEq6JE0p', title: '相似三角形的判定' },
    { bv: 'BV1dMEq6ME7z', title: '相似三角形的性质' },
    { bv: 'BV1eNEq6ME8z', title: '位似图形' },
    { bv: 'BV1fOEq6ME9z', title: '锐角三角函数' }
  ],
  10: [
    { bv: 'BV1jaEq6aE0h', title: '圆的基本性质' },
    { bv: 'BV1zxEq6dE4V', title: '垂径定理' },
    { bv: 'BV11SEq6JE1p', title: '圆周角定理' },
    { bv: 'BV1eMEq6ME8z', title: '点与圆的位置关系' },
    { bv: 'BV1kaEq6aE1h', title: '直线与圆的位置关系' },
    { bv: 'BV1lbEq6aE2h', title: '切线长定理' },
    { bv: 'BV1mcEq6aE3h', title: '正多边形与圆' }
  ],
  11: [
    { bv: 'BV1laEq6aE2h', title: '函数的概念' },
    { bv: 'BV10xEq6dE5V', title: '一次函数的图像与性质' },
    { bv: 'BV12SEq6JE2p', title: '一次函数的应用' },
    { bv: 'BV1fMEq6ME9z', title: '反比例函数的图像与性质' },
    { bv: 'BV1gNEq6ME0z', title: '反比例函数的应用' },
    { bv: 'BV1hOEq6ME1z', title: '一次函数与方程不等式' }
  ],
  12: [
    { bv: 'BV1maEq6aE3h', title: '二次函数的图像与性质' },
    { bv: 'BV11xEq6dE6V', title: '二次函数的顶点式' },
    { bv: 'BV13SEq6JE3p', title: '二次函数与一元二次方程' },
    { bv: 'BV1gMEq6ME0z', title: '二次函数的实际应用' },
    { bv: 'BV1iNEq6ME2z', title: '二次函数综合压轴题' },
    { bv: 'BV1jOEq6ME3z', title: '抛物线与几何变换' }
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

// NPC 对话配置（多场景）
export const NPC_DIALOGUES = {
  gauss: {
    welcome: [
      "⭐ 欢迎来到我的数学星球！我是高斯，今天我们一起探索数学的奥秘！",
      "🔢 数学就像宇宙中的星星，每一颗都有它独特的光芒！",
      "🚀 又见面了小宇航员！准备好挑战新的数学星系了吗？",
      "💡 记住：数学不是记住公式，而是理解背后的逻辑！",
      "📚 每一次练习都是一次星际跃迁，准备好起飞了吗？",
      "🌈 别怕犯错，每个数学大师都曾和你一样从零开始！",
      "🌟 你的数学直觉正在慢慢苏醒，用心感受数字的魅力吧！",
      "💪 面对难题不退缩，这就是真正的数学家精神！",
      "🎯 专注力就是你最强大的武器，每一次思考都在变强！",
      "🧠 大脑就像肌肉，练得越多越灵活，今天我们继续锻炼！"
    ],
    allCorrect: [
      "🌟 太棒了！全对！你真是数学天才！",
      "🎉 完美！我当年像你这么大的时候都没这么厉害！",
      "👏 漂亮的全胜！你已经开始像数学家一样思考了！",
      "🏆 满分！这个星系的奥秘已经被你全部掌握了！",
      "✨ 闪闪发光！这才是真正的数学之星！",
      "🔥 全对通关！你的思维像激光一样精准！",
      "💎 纯粹而完美的解答，这就是数学的优雅！",
      "🚀 又一关完美征服！你离数学巅峰又近了一步！",
      "🌠 今天的状态爆棚！逻辑币和经验值统统收入囊中！",
      "👑 无懈可击！你已经掌握了这个星系的所有奥秘！"
    ],
    partialCorrect: [
      "💪 不错！继续加油，再检查一下错题。",
      "📖 错了不要紧，从错误中学到的东西最牢固！",
      "🤔 差一点就完美了，再试试看？",
      "🌱 每次错误都是成长的养分，坚持就是胜利！",
      "🎯 瞄准目标，再来一次你一定能全对！",
      "💡 你看，你已经接近正确答案了，再推敲一步就行！",
      "🔍 错误是藏宝图上的标记，找到它你就离宝藏更近！",
      "🧩 别急，把每个条件拆开来看，答案就在眼前！",
      "📝 错一道题没关系，你学到了比做对十道还多的东西！",
      "🌊 学习就像潮汐，有起有落，但整体在进步！"
    ],
    allWrong: [
      "😅 看来这个星系的星云有点浓密，别着急再试一次！",
      "💪 失败是成功之母，伟大的数学家都是从错误中成长的！",
      "🔄 没关系，再看一遍视频，你一定可以的！",
      "📚 数学需要多练习，再来一次，我相信你！",
      "🌱 种子破土前总要经历黑暗，你的努力不会白费！",
      "⚡ 跌倒了拍拍灰站起来，这才是最酷的数学家姿态！",
      "🎭 别被暂时的困难吓倒，每个难题背后都藏着一个大道理！",
      "🧭 方向比速度重要，回头看看视频，找到正确的路！"
    ],
    retry: [
      "🔥 好样的，不放弃！这才是我欣赏的数学家精神！",
      "💫 第二次尝试更勇敢了，加油！",
      "⏳ 慢慢来，理解比速度更重要！",
      "✨ 敢于重来的人，往往笑到最后！",
      "💪 坚韧不拔比天赋更重要，你正在锻造最宝贵的品质！",
      "🎯 每一次重试都是一次跃迁，越挫越强！"
    ]
  },
  owl: {
    welcome: [
      "🦉 咕咕~ 我是智慧猫头鹰，让我带你领略几何的美妙！",
      "📐 几何图形中藏着宇宙的密码，仔细观察就能发现！",
      "✨ 又见面了！今天我们来探索形状和空间的秘密！",
      "🔍 几何是数学中最直观也最有趣的部分，让我们一起发现！",
      "🌌 空间想象是打开几何之门的钥匙，准备好了吗？",
      "🎨 几何就是数学中的艺术，每一根线条都有它的故事！",
      "🧩 不用担心看不懂，一步步拆解，图形就会对你说话！",
      "🏗️ 所有复杂的图形都是由简单图形组成的，就像搭积木！",
      "💡 多画图、多动手，几何直觉就是这样练出来的！",
      "🌟 每次你认真观察一个图形，你的空间力就在悄悄增长！"
    ],
    allCorrect: [
      "🦉 咕咕！全对！你的几何直觉太棒了！",
      "🌟 完美！你已经掌握了这个星系的几何奥秘！",
      "📏 精确的答案！你就像一个小几何学家！",
      "🎉 太精彩了！连我都忍不住为你鼓掌！",
      "✨ 咕咕咕！这表现简直是教科书级别的！",
      "🔥 全对通关！你的空间想象力令人惊叹！",
      "💎 每个答案都闪闪发光，几何已经难不倒你了！",
      "🚀 你对图形的理解又上升了一个维度！",
      "🏅 这关的几何奥秘已被你征服，继续前进吧！",
      "👑 咕咕！完美的表现，你就是几何小天才！"
    ],
    partialCorrect: [
      "🦉 咕...进步很大，再来检查一下错题吧！",
      "🌿 几何需要多画图多想象，你离完美就差一步！",
      "🔎 仔细看看错题，是不是哪个性质记混了？",
      "📝 不错不错，错题才是最好的老师！",
      "🧩 几何就像拼图，每道错题都是一块缺失的碎片！",
      "📐 试着在纸上画一画，图形画对了答案就出来了！",
      "🔄 回看视频中对应的知识点，你马上就能搞懂！",
      "💡 你已经做对大部分了，别让一个小细节挡住你！",
      "🌱 每天都在进步，哪怕只攻克一道错题也是胜利！",
      "🔍 仔细看看条件和图形，答案比你想象的更近！"
    ],
    allWrong: [
      "🦉 咕...看来这是一个难啃的骨头，再看一遍视频吧！",
      "🔄 别灰心！每个大师都曾是初学者。",
      "💪 几何就是需要反复练习空间想象，再试一次！",
      "📚 打开课本，回忆一下基本概念，你一定能行！",
      "🌌 别着急，空间感需要时间培养，你已经走在路上了！",
      "🧠 不懂就问、不会就练，这就是成为几何高手的秘诀！",
      "🎯 这次全错不代表什么，重要的是你学到了什么！",
      "📏 从基础开始，一步步来，你会越来越好的！"
    ],
    retry: [
      "🦉 咕咕！又回来了！这份坚持值得表扬！",
      "✨ 第二次尝试，你会发现之前忽略的细节！",
      "⏳ 稳步前进，理解每一个定理的含义！",
      "💪 不轻言放弃的人，终将看到最美的风景！",
      "🎯 再来一次，你的眼睛会比上一次更敏锐！",
      "🔥 咕咕！坚持就是几何学习中最硬核的能力！"
    ]
  }
};

// 数学名言（鼓励学习数学）
export const MATH_QUOTES = [
  { quote: "数学是上帝书写宇宙的语言。", author: "伽利略" },
  { quote: "在数学中，你并不理解事物，你只是习惯它们。", author: "冯·诺依曼" },
  { quote: "数学是无穷的科学。", author: "赫尔曼·外尔" },
  { quote: "纯数学是逻辑思想的诗篇。", author: "爱因斯坦" },
  { quote: "数学是打开科学大门的钥匙。", author: "培根" },
  { quote: "不要因为一道题做不出来就灰心，每道难题都是你变强的阶梯。", author: "数学星环" },
  { quote: "数学不是关于数字、公式和定理的，它关乎理解和思考。", author: "保罗·洛克哈特" },
  { quote: "天才就是百分之一的灵感加上百分之九十九的汗水。", author: "爱迪生" },
  { quote: "学数学就是学思考，会思考的人永远不会被困难打倒。", author: "数学星环" },
  { quote: "数学中最大的进步不是来自公式，而是来自好奇心。", author: "数学星环" },
  { quote: "成功的秘诀在于永不改变既定的目标。", author: "卢梭" },
  { quote: "数学是科学的皇后，数论是数学的皇后。", author: "高斯" },
  { quote: "在数学中，每个问题都有答案，只要你足够耐心去找。", author: "数学星环" },
  { quote: "我思故我在。", author: "笛卡尔" },
  { quote: "天才是无止境刻苦勤奋的能力。", author: "卡莱尔" },
  { quote: "数学是人类智慧皇冠上最璀璨的明珠。", author: "考特" },
  { quote: "不积跬步，无以至千里；不积小流，无以成江海。", author: "荀子" },
  { quote: "想象比知识更重要，因为知识是有限的，而想象是无限的。", author: "爱因斯坦" },
  { quote: "在数学的天地里，重要的不是我们知道什么，而是我们怎么知道。", author: "毕达哥拉斯" },
  { quote: "每一次努力，都是幸运的伏笔；每一道难题，都在为你积累智慧。", author: "数学星环" },
  { quote: "数学不是枯燥的公式堆砌，而是探索宇宙奥秘的冒险旅程。", author: "数学星环" },
  { quote: "你的大脑就像一个超级计算机，每次做题都在升级它的系统！", author: "数学星环" },
  { quote: "万物皆数。", author: "毕达哥拉斯" },
  { quote: "给我一个支点，我就能撬起整个地球。", author: "阿基米德" }
];

// 里程碑配置
export const MILESTONES = [
  { id: 'first_clear', name: '初次启航', icon: '🚀', desc: '第一次完成关卡挑战', condition: { type: 'completed_count', value: 1 } },
  { id: 'first_perfect', name: '完美开局', icon: '💯', desc: '第一次全部答对', condition: { type: 'perfect_count', value: 1 } },
  { id: 'three_clear', name: '三星连珠', icon: '🌟', desc: '完成 3 个星系', condition: { type: 'completed_count', value: 3 } },
  { id: 'half_way', name: '半程勇士', icon: '🏅', desc: '完成 6 个星系（一半）', condition: { type: 'completed_count', value: 6 } },
  { id: 'combo_master', name: '连击大师', icon: '🔥', desc: '单次全部答对', condition: { type: 'max_combo', value: 12 } },
  { id: 'speed_demon', name: '闪电思维', icon: '⚡', desc: '完成 3 个星系即可解锁', condition: { type: 'completed_count', value: 3 } },
  { id: 'five_perfect', name: '五连绝世', icon: '💫', desc: '5 次全部答对', condition: { type: 'perfect_count', value: 5 } },
  { id: 'all_done', name: '宇宙主宰', icon: '👑', desc: '完成全部 12 个星系', condition: { type: 'completed_count', value: 12 } },
  { id: 'all_perfect', name: '大圆满', icon: '🌈', desc: '12 关全部完美通关', condition: { type: 'perfect_count', value: 12 } }
];

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
  perfectCount: 0,       // 完美通关次数
  maxCombo: 0,           // 最高连击
  lastQuizTime: 0,       // 最近一次答题用时（秒）
  totalExploreSeconds: 0, // 总探索时长（秒），页面停留即可累计
  playerName: '',        // 玩家姓名
  unlockedMilestones: [], // 已解锁里程碑ID
  stats: {
    calc: 30,
    space: 20,
    logic: 25,
    reverse: 15,
    resist: 40
  }
});
