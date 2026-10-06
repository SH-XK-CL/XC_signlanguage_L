/**
 * dictionary.js — 中国标准手语手势词典（v6.0.0 重建版）
 * 数据底座：识别、翻译、训练三大模块均依赖此词典。
 *
 * 字段说明：
 *   id        唯一标识
 *   word      中文词/短语
 *   pinyin    拼音
 *   category  分类（数字/问候/人称/家庭/日常/食物/时间/感情/动作/颜色/自然/疑问/数量/学习/交通/方位/身体/动物/其他）
 *   hands     'single' 单手 | 'double' 双手
 *   dynamic   true 动态手势（含位移/摆动）| false 静态手势
 *   handshape 手形描述
 *   movement  动作描述
 *   meaning   含义/用法
 *   rec       true 表示可被摄像头规则识别器识别（带 sig 特征）
 *   sig       识别特征：{ f:[拇指,食指,中指,无名指,小指](1伸0屈), thumbUp?, handCount? }
 */

const SIGN_DICTIONARY = [
  /* ===================== 数字 ===================== */
  { id: 'num_0', word: '零', pinyin: 'líng', category: '数字', hands: 'single', dynamic: false, handshape: '五指握拳', movement: '拳头顶向前方', meaning: '数字0', rec: true, sig: { f: [0,0,0,0,0] } },
  { id: 'num_1', word: '一', pinyin: 'yī', category: '数字', hands: 'single', dynamic: false, handshape: '食指伸直，余四指握拳', movement: '食指竖直向上', meaning: '数字1', rec: true, sig: { f: [0,1,0,0,0] } },
  { id: 'num_2', word: '二', pinyin: 'èr', category: '数字', hands: 'single', dynamic: false, handshape: '食指、中指伸直，余三指握拳', movement: '两指竖直', meaning: '数字2', rec: true, sig: { f: [0,1,1,0,0] } },
  { id: 'num_3', word: '三', pinyin: 'sān', category: '数字', hands: 'single', dynamic: false, handshape: '食中无名三指伸直', movement: '三指竖直', meaning: '数字3', rec: true, sig: { f: [0,1,1,1,0] } },
  { id: 'num_4', word: '四', pinyin: 'sì', category: '数字', hands: 'single', dynamic: false, handshape: '食指到小指四指伸直，拇指内扣', movement: '四指竖直', meaning: '数字4', rec: true, sig: { f: [0,1,1,1,1] } },
  { id: 'num_5', word: '五', pinyin: 'wǔ', category: '数字', hands: 'single', dynamic: false, handshape: '五指全部张开', movement: '手掌展开', meaning: '数字5', rec: true, sig: { f: [1,1,1,1,1] } },
  { id: 'num_6', word: '六', pinyin: 'liù', category: '数字', hands: 'single', dynamic: false, handshape: '拇指与小指张开，余三指握拳', movement: '拇小指张开', meaning: '数字6', rec: true, sig: { f: [1,0,0,0,1] } },
  { id: 'num_7', word: '七', pinyin: 'qī', category: '数字', hands: 'single', dynamic: false, handshape: '拇指、食、中三指伸直', movement: '三指张开', meaning: '数字7', rec: true, sig: { f: [1,1,1,0,0] } },
  { id: 'num_8', word: '八', pinyin: 'bā', category: '数字', hands: 'single', dynamic: false, handshape: '拇指与食指张开成八字形', movement: '拇食指张开', meaning: '数字8', rec: true, sig: { f: [1,1,0,0,0] } },
  { id: 'num_9', word: '九', pinyin: 'jiǔ', category: '数字', hands: 'single', dynamic: false, handshape: '食指弯曲钩住，余指握拳', movement: '食指成钩', meaning: '数字9', rec: true, sig: { f: [0,1,0,0,0], hook: true } },
  { id: 'num_10', word: '十', pinyin: 'shí', category: '数字', hands: 'double', dynamic: false, handshape: '双手握拳，食指交叉', movement: '两拳食指交叉成十字', meaning: '数字10', rec: false },

  /* ===================== 问候 ===================== */
  { id: 'g_hello', word: '你好', pinyin: 'nǐ hǎo', category: '问候', hands: 'single', dynamic: true, handshape: '手掌伸开', movement: '手在胸前由外向内挥动', meaning: '打招呼、问候', rec: true, sig: { f: [1,1,1,1,1], wave: true } },
  { id: 'g_bye', word: '再见', pinyin: 'zài jiàn', category: '问候', hands: 'single', dynamic: true, handshape: '手掌张开', movement: '手前后摆动告别', meaning: '告别', rec: true, sig: { f: [1,1,1,1,1], wave: true } },
  { id: 'g_thanks', word: '谢谢', pinyin: 'xiè xie', category: '问候', hands: 'single', dynamic: true, handshape: '手指并拢', movement: '手从下巴向外前方移动', meaning: '表达感谢', rec: true, sig: { f: [1,1,1,1,1], chin: true } },
  { id: 'g_please', word: '请', pinyin: 'qǐng', category: '问候', hands: 'single', dynamic: false, handshape: '手掌向上', movement: '手掌由外向内轻抬', meaning: '礼貌用语', rec: true, sig: { f: [1,1,1,1,1] } },
  { id: 'g_sorry', word: '对不起', pinyin: 'duì bu qǐ', category: '问候', hands: 'single', dynamic: false, handshape: '双手手指相握', movement: '双手在胸前微微鞠躬', meaning: '道歉', rec: false },
  { id: 'g_welcome', word: '欢迎', pinyin: 'huān yíng', category: '问候', hands: 'double', dynamic: false, handshape: '双手手掌向上', movement: '双手由外向内合拢', meaning: '迎接客人', rec: false },

  /* ===================== 人称 ===================== */
  { id: 'p_me', word: '我', pinyin: 'wǒ', category: '人称', hands: 'single', dynamic: false, handshape: '拇指伸直，余四指握拳', movement: '拇指指点自己胸口', meaning: '第一人称', rec: true, sig: { f: [1,0,0,0,0], thumbUp: false } },
  { id: 'p_you', word: '你', pinyin: 'nǐ', category: '人称', hands: 'single', dynamic: false, handshape: '食指伸直，余四指握拳', movement: '食指指向对方', meaning: '第二人称', rec: true, sig: { f: [0,1,0,0,0], point: true } },
  { id: 'p_he', word: '他/她', pinyin: 'tā', category: '人称', hands: 'single', dynamic: false, handshape: '食指指向侧方', movement: '食指指向第三人', meaning: '第三人称', rec: true, sig: { f: [0,1,0,0,0], point: true } },
  { id: 'p_we', word: '我们', pinyin: 'wǒ men', category: '人称', hands: 'double', dynamic: false, handshape: '双手拇指指点胸口', movement: '双手拍胸', meaning: '第一人称复数', rec: false },
  { id: 'p_they', word: '他们', pinyin: 'tā men', category: '人称', hands: 'double', dynamic: false, handshape: '双手食指指向侧方', meaning: '第三人称复数', rec: false },
  { id: 'p_who', word: '谁', pinyin: 'shuí', category: '人称', hands: 'single', dynamic: false, handshape: '食指弯曲如钩', movement: '食指向侧方轻点', meaning: '疑问人称', rec: false },

  /* ===================== 家庭 ===================== */
  { id: 'f_father', word: '爸爸', pinyin: 'bà ba', category: '家庭', hands: 'single', dynamic: false, handshape: '拇指与食指张开成八字', movement: '手在额头侧方点两下', meaning: '父亲', rec: true, sig: { f: [1,1,0,0,0] } },
  { id: 'f_mother', word: '妈妈', pinyin: 'mā ma', category: '家庭', hands: 'single', dynamic: false, handshape: '拇指与食指张开成八字', movement: '手在脸颊侧方点两下', meaning: '母亲', rec: true, sig: { f: [1,1,0,0,0] } },
  { id: 'f_child', word: '孩子', pinyin: 'hái zi', category: '家庭', hands: 'single', dynamic: false, handshape: '手臂横放', movement: '手在身前横摆', meaning: '子女', rec: false },
  { id: 'f_family', word: '家', pinyin: 'jiā', category: '家庭', hands: 'single', dynamic: false, handshape: '拇指与小指张开成房顶形', movement: '手在头顶搭成尖顶', meaning: '家庭、房屋', rec: true, sig: { f: [1,0,0,0,1] } },
  { id: 'f_brother', word: '哥哥', pinyin: 'gē ge', category: '家庭', hands: 'single', dynamic: false, handshape: '拇指与食指成八字', movement: '手在眉上点两下', meaning: '兄长', rec: false },
  { id: 'f_sister', word: '姐姐', pinyin: 'jiě jie', category: '家庭', hands: 'single', dynamic: false, handshape: '拇指与食指成八字', movement: '手在嘴角点两下', meaning: '姊姊', rec: false },

  /* ===================== 日常 ===================== */
  { id: 'd_eat', word: '吃饭', pinyin: 'chī fàn', category: '日常', hands: 'single', dynamic: true, handshape: '拇指与食指捏合', movement: '手从嘴边向内送', meaning: '进食', rec: false },
  { id: 'd_drink', word: '喝水', pinyin: 'hē shuǐ', category: '日常', hands: 'single', dynamic: true, handshape: '手成杯状', movement: '手送向嘴边', meaning: '饮水', rec: false },
  { id: 'd_sleep', word: '睡觉', pinyin: 'shuì jiào', category: '日常', hands: 'single', dynamic: false, handshape: '头侧枕手', movement: '手贴脸颊侧倾', meaning: '休息', rec: false },
  { id: 'd_wash', word: '洗手', pinyin: 'xǐ shǒu', category: '日常', hands: 'double', dynamic: true, handshape: '双手手指交叉搓动', movement: '两手互搓', meaning: '清洁', rec: false },
  { id: 'd_good', word: '好', pinyin: 'hǎo', category: '日常', hands: 'single', dynamic: false, handshape: '拇指竖直向上，余四指握拳', movement: '拇指上翘', meaning: '肯定、好', rec: true, sig: { f: [1,0,0,0,0], thumbUp: true } },
  { id: 'd_bad', word: '不好', pinyin: 'bù hǎo', category: '日常', hands: 'single', dynamic: false, handshape: '小指伸出', movement: '小指下弯', meaning: '否定、差', rec: true, sig: { f: [0,0,0,0,1] } },
  { id: 'd_help', word: '帮助', pinyin: 'bāng zhù', category: '日常', hands: 'double', dynamic: false, handshape: '双手手掌向上托举', movement: '双手上托', meaning: '援助', rec: false },
  { id: 'd_money', word: '钱', pinyin: 'qián', category: '日常', hands: 'single', dynamic: false, handshape: '拇指与食指搓动', movement: '指尖相搓', meaning: '货币', rec: false },
  { id: 'd_book', word: '书', pinyin: 'shū', category: '日常', hands: 'double', dynamic: false, handshape: '双手掌心相对开合', movement: '两手如翻书', meaning: '书籍', rec: false },

  /* ===================== 食物 ===================== */
  { id: 'food_rice', word: '米饭', pinyin: 'mǐ fàn', category: '食物', hands: 'single', dynamic: false, handshape: '手指捏拢如粒', movement: '手在嘴边点', meaning: '主食', rec: false },
  { id: 'food_water', word: '水', pinyin: 'shuǐ', category: '食物', hands: 'single', dynamic: false, handshape: '手成波浪形', movement: '手指波动', meaning: '饮用水', rec: false },
  { id: 'food_apple', word: '苹果', pinyin: 'píng guǒ', category: '食物', hands: 'single', dynamic: false, handshape: '拇指与食指成圆形', movement: '圆形在脸颊旁', meaning: '水果', rec: false },
  { id: 'food_bread', word: '面包', pinyin: 'miàn bāo', category: '食物', hands: 'single', dynamic: false, handshape: '手掌平切', movement: '手横切', meaning: '面食', rec: false },
  { id: 'food_meat', word: '肉', pinyin: 'ròu', category: '食物', hands: 'single', dynamic: false, handshape: '手指捏合', movement: '手捏物状', meaning: '肉类', rec: false },
  { id: 'food_fish', word: '鱼', pinyin: 'yú', category: '食物', hands: 'single', dynamic: true, handshape: '手摆动如鱼尾', movement: '手腕左右摆', meaning: '鱼类', rec: false },
  { id: 'food_egg', word: '鸡蛋', pinyin: 'jī dàn', category: '食物', hands: 'single', dynamic: false, handshape: '手成卵形', movement: '双手合卵', meaning: '蛋类', rec: false },

  /* ===================== 时间 ===================== */
  { id: 't_now', word: '现在', pinyin: 'xiàn zài', category: '时间', hands: 'single', dynamic: false, handshape: '食指指向前方', movement: '食指指当下', meaning: '此刻', rec: false },
  { id: 't_today', word: '今天', pinyin: 'jīn tiān', category: '时间', hands: 'single', dynamic: false, handshape: '食指点下巴', movement: '食指点颌', meaning: '当日', rec: false },
  { id: 't_tomorrow', word: '明天', pinyin: 'míng tiān', category: '时间', hands: 'single', dynamic: false, handshape: '食指指天', movement: '食指向天空', meaning: '次日', rec: false },
  { id: 't_yesterday', word: '昨天', pinyin: 'zuó tiān', category: '时间', hands: 'single', dynamic: false, handshape: '手背拍肩', movement: '手拍肩后', meaning: '前一日', rec: false },
  { id: 't_year', word: '年', pinyin: 'nián', category: '时间', hands: 'single', dynamic: false, handshape: '握拳', movement: '拳在另一臂弯', meaning: '年份', rec: false },
  { id: 't_month', word: '月', pinyin: 'yuè', category: '时间', hands: 'single', dynamic: false, handshape: '拇指与食指成月牙', movement: '手成弧', meaning: '月份', rec: false },
  { id: 't_week', word: '星期', pinyin: 'xīng qī', category: '时间', hands: 'single', dynamic: false, handshape: '手指轮点数', movement: '依次点数', meaning: '周', rec: false },
  { id: 't_morning', word: '早上', pinyin: 'zǎo shàng', category: '时间', hands: 'single', dynamic: false, handshape: '手掌平举额前', movement: '手遮额', meaning: '上午', rec: false },
  { id: 't_night', word: '晚上', pinyin: 'wǎn shàng', category: '时间', hands: 'single', dynamic: false, handshape: '手遮眼', movement: '手搭眼', meaning: '夜晚', rec: false },

  /* ===================== 感情 ===================== */
  { id: 'e_love', word: '爱', pinyin: 'ài', category: '感情', hands: 'double', dynamic: false, handshape: '双手交叉抱胸', movement: '双手抱胸', meaning: '喜爱', rec: false },
  { id: 'e_like', word: '喜欢', pinyin: 'xǐ huan', category: '感情', hands: 'single', dynamic: false, handshape: '双手抚胸', movement: '手拍胸口', meaning: '好感', rec: false },
  { id: 'e_happy', word: '高兴', pinyin: 'gāo xìng', category: '感情', hands: 'double', dynamic: true, handshape: '双手上扬', movement: '两手由下向上扬', meaning: '快乐', rec: false },
  { id: 'e_sad', word: '难过', pinyin: 'nán guò', category: '感情', hands: 'single', dynamic: false, handshape: '手擦眼角', movement: '手触眼', meaning: '悲伤', rec: false },
  { id: 'e_angry', word: '生气', pinyin: 'shēng qì', category: '感情', hands: 'single', dynamic: false, handshape: '食指指额皱眉', movement: '指额', meaning: '愤怒', rec: false },
  { id: 'e_afraid', word: '害怕', pinyin: 'hài pà', category: '感情', hands: 'double', dynamic: false, handshape: '双手护胸', movement: '双臂收紧', meaning: '恐惧', rec: false },

  /* ===================== 动作 ===================== */
  { id: 'a_go', word: '走', pinyin: 'zǒu', category: '动作', hands: 'single', dynamic: true, handshape: '手指交替向前', movement: '手向前摆动', meaning: '行走', rec: false },
  { id: 'a_come', word: '来', pinyin: 'lái', category: '动作', hands: 'single', dynamic: true, handshape: '手掌向内招', movement: '手向自身招', meaning: '到来', rec: false },
  { id: 'a_stop', word: '停', pinyin: 'tíng', category: '动作', hands: 'single', dynamic: false, handshape: '手掌直立', movement: '掌心向前推', meaning: '停止', rec: true, sig: { f: [1,1,1,1,1], palm: true } },
  { id: 'a_run', word: '跑', pinyin: 'pǎo', category: '动作', hands: 'double', dynamic: true, handshape: '双手指交替', movement: '双手前后摆', meaning: '奔跑', rec: false },
  { id: 'a_sit', word: '坐', pinyin: 'zuò', category: '动作', hands: 'single', dynamic: false, handshape: '手平切向下', movement: '手掌下压', meaning: '坐下', rec: false },
  { id: 'a_stand', word: '站', pinyin: 'zhàn', category: '动作', hands: 'single', dynamic: false, handshape: '手掌向上托', movement: '手向上举', meaning: '站立', rec: false },
  { id: 'a_give', word: '给', pinyin: 'gěi', category: '动作', hands: 'single', dynamic: true, handshape: '手掌向上递', movement: '手向前递', meaning: '给予', rec: false },
  { id: 'a_take', word: '拿', pinyin: 'ná', category: '动作', hands: 'single', dynamic: false, handshape: '手指抓握', movement: '手握物', meaning: '取', rec: false },
  { id: 'a_write', word: '写', pinyin: 'xiě', category: '动作', hands: 'single', dynamic: true, handshape: '手握笔', movement: '手在身前划动', meaning: '书写', rec: false },

  /* ===================== 颜色 ===================== */
  { id: 'c_red', word: '红色', pinyin: 'hóng sè', category: '颜色', hands: 'single', dynamic: false, handshape: '食指指唇', movement: '食指点嘴唇', meaning: '红色', rec: false },
  { id: 'c_black', word: '黑色', pinyin: 'hēi sè', category: '颜色', hands: 'single', dynamic: false, handshape: '食指指眉', movement: '食指点眉', meaning: '黑色', rec: false },
  { id: 'c_white', word: '白色', pinyin: 'bái sè', category: '颜色', hands: 'single', dynamic: false, handshape: '手掌翻白', movement: '手背向上', meaning: '白色', rec: false },
  { id: 'c_yellow', word: '黄色', pinyin: 'huáng sè', category: '颜色', hands: 'single', dynamic: false, handshape: '拇指与食指捻', movement: '手捻物', meaning: '黄色', rec: false },
  { id: 'c_blue', word: '蓝色', pinyin: 'lán sè', category: '颜色', hands: 'single', dynamic: false, handshape: '手掌平伸', movement: '手横切', meaning: '蓝色', rec: false },
  { id: 'c_green', word: '绿色', pinyin: 'lǜ sè', category: '颜色', hands: 'single', dynamic: false, handshape: '手成叶形', movement: '手指并拢', meaning: '绿色', rec: false },

  /* ===================== 自然 ===================== */
  { id: 'n_sun', word: '太阳', pinyin: 'tài yáng', category: '自然', hands: 'single', dynamic: false, handshape: '圆圈在额上', movement: '手绕头', meaning: '太阳', rec: false },
  { id: 'n_moon', word: '月亮', pinyin: 'yuè liang', category: '自然', hands: 'single', dynamic: false, handshape: '手成月牙', movement: '手弯弧', meaning: '月亮', rec: false },
  { id: 'n_star', word: '星星', pinyin: 'xīng xing', category: '自然', hands: 'single', dynamic: false, handshape: '小指与拇指成星', movement: '手点空', meaning: '星辰', rec: false },
  { id: 'n_rain', word: '雨', pinyin: 'yǔ', category: '自然', hands: 'single', dynamic: true, handshape: '手指下垂抖动', movement: '手指下落', meaning: '雨水', rec: false },
  { id: 'n_wind', word: '风', pinyin: 'fēng', category: '自然', hands: 'single', dynamic: true, handshape: '手掌飘动', movement: '手随风摆', meaning: '风', rec: false },
  { id: 'n_fire', word: '火', pinyin: 'huǒ', category: '自然', hands: 'single', dynamic: true, handshape: '手指跳动', movement: '手指上下抖', meaning: '火焰', rec: false },
  { id: 'n_water_n', word: '河', pinyin: 'hé', category: '自然', hands: 'double', dynamic: true, handshape: '双手波浪', movement: '手波动', meaning: '河流', rec: false },
  { id: 'n_tree', word: '树', pinyin: 'shù', category: '自然', hands: 'single', dynamic: false, handshape: '手臂向上如干', movement: '手向上伸', meaning: '树木', rec: false },
  { id: 'n_mountain', word: '山', pinyin: 'shān', category: '自然', hands: 'double', dynamic: false, handshape: '双手成峰', movement: '两手叠峰', meaning: '山脉', rec: false },

  /* ===================== 疑问 ===================== */
  { id: 'q_what', word: '什么', pinyin: 'shén me', category: '疑问', hands: 'single', dynamic: false, handshape: '手掌摊开左右摆', movement: '手侧摆', meaning: '疑问事物', rec: false },
  { id: 'q_where', word: '哪里', pinyin: 'nǎ lǐ', category: '疑问', hands: 'single', dynamic: false, handshape: '食指指侧方', movement: '食指向旁指', meaning: '疑问地点', rec: false },
  { id: 'q_when', word: '什么时候', pinyin: 'shén me shí hou', category: '疑问', hands: 'single', dynamic: false, handshape: '食指指天摆', movement: '食指向天', meaning: '疑问时间', rec: false },
  { id: 'q_why', word: '为什么', pinyin: 'wèi shén me', category: '疑问', hands: 'single', dynamic: false, handshape: '双手摊开', movement: '手前推', meaning: '疑问原因', rec: false },
  { id: 'q_how', word: '怎么', pinyin: 'zěn me', category: '疑问', hands: 'single', dynamic: false, handshape: '手掌翻动', movement: '手翻转', meaning: '疑问方式', rec: false },
  { id: 'q_howmany', word: '多少', pinyin: 'duō shǎo', category: '疑问', hands: 'double', dynamic: false, handshape: '双手手指轮数', movement: '两手点数', meaning: '疑问数量', rec: false },

  /* ===================== 数量 ===================== */
  { id: 'qty_many', word: '多', pinyin: 'duō', category: '数量', hands: 'double', dynamic: false, handshape: '双手张开外扩', movement: '两手向两侧张', meaning: '数量大', rec: false },
  { id: 'qty_few', word: '少', pinyin: 'shǎo', category: '数量', hands: 'single', dynamic: false, handshape: '拇指与食指捏小', movement: '指尖捏拢', meaning: '数量小', rec: false },
  { id: 'qty_all', word: '全部', pinyin: 'quán bù', category: '数量', hands: 'double', dynamic: false, handshape: '双手环抱', movement: '两手画大圈', meaning: '所有', rec: false },
  { id: 'qty_some', word: '一些', pinyin: 'yī xiē', category: '数量', hands: 'single', dynamic: false, handshape: '手指捏几粒', movement: '手捏数点', meaning: '部分', rec: false },

  /* ===================== 学习 ===================== */
  { id: 's_study', word: '学习', pinyin: 'xué xí', category: '学习', hands: 'single', dynamic: true, handshape: '手握笔', movement: '手在胸前写', meaning: '读书', rec: false },
  { id: 's_school', word: '学校', pinyin: 'xué xiào', category: '学习', hands: 'single', dynamic: false, handshape: '双手搭顶', movement: '两手成屋顶', meaning: '学校', rec: false },
  { id: 's_teacher', word: '老师', pinyin: 'lǎo shī', category: '学习', hands: 'single', dynamic: false, handshape: '手指点太阳穴', movement: '食指点头侧', meaning: '教师', rec: false },
  { id: 's_student', word: '学生', pinyin: 'xué shēng', category: '学习', hands: 'single', dynamic: false, handshape: '手指点自己胸', movement: '指己', meaning: '学生', rec: false },
  { id: 's_read', word: '读书', pinyin: 'dú shū', category: '学习', hands: 'double', dynamic: false, handshape: '双手开合如书', movement: '翻书状', meaning: '阅读', rec: false },
  { id: 's_write2', word: '字', pinyin: 'zì', category: '学习', hands: 'single', dynamic: true, handshape: '手指虚写', movement: '手划字', meaning: '文字', rec: false },

  /* ===================== 交通 ===================== */
  { id: 'tr_car', word: '汽车', pinyin: 'qì chē', category: '交通', hands: 'single', dynamic: true, handshape: '手掌握轮', movement: '手转方向盘', meaning: '车辆', rec: false },
  { id: 'tr_bus', word: '公交车', pinyin: 'gōng jiāo chē', category: '交通', hands: 'single', dynamic: false, handshape: '手掌平推', movement: '手前推', meaning: '公共汽车', rec: false },
  { id: 'tr_train', word: '火车', pinyin: 'huǒ chē', category: '交通', hands: 'single', dynamic: false, handshape: '手成轨形', movement: '两手并轨', meaning: '铁路列车', rec: false },
  { id: 'tr_plane', word: '飞机', pinyin: 'fēi jī', category: '交通', hands: 'single', dynamic: false, handshape: '双臂平展如翼', movement: '手侧平举', meaning: '航空器', rec: false },
  { id: 'tr_bike', word: '自行车', pinyin: 'zì xíng chē', category: '交通', hands: 'double', dynamic: true, handshape: '双手转圈', movement: '两手画圈', meaning: '单车', rec: false },
  { id: 'tr_ship', word: '船', pinyin: 'chuán', category: '交通', hands: 'double', dynamic: false, handshape: '双手波动', movement: '手如浪', meaning: '船舶', rec: false },

  /* ===================== 方位 ===================== */
  { id: 'pos_up', word: '上', pinyin: 'shàng', category: '方位', hands: 'single', dynamic: false, handshape: '食指指上', movement: '食指向天', meaning: '上方', rec: false },
  { id: 'pos_down', word: '下', pinyin: 'xià', category: '方位', hands: 'single', dynamic: false, handshape: '食指指下', movement: '食指向地', meaning: '下方', rec: false },
  { id: 'pos_left', word: '左', pinyin: 'zuǒ', category: '方位', hands: 'single', dynamic: false, handshape: '食指指左', movement: '指向左', meaning: '左边', rec: false },
  { id: 'pos_right', word: '右', pinyin: 'yòu', category: '方位', hands: 'single', dynamic: false, handshape: '食指指右', movement: '指向右', meaning: '右边', rec: false },
  { id: 'pos_front', word: '前', pinyin: 'qián', category: '方位', hands: 'single', dynamic: false, handshape: '手掌向前', movement: '手前推', meaning: '前方', rec: false },
  { id: 'pos_back', word: '后', pinyin: 'hòu', category: '方位', hands: 'single', dynamic: false, handshape: '拇指指后', movement: '指向后', meaning: '后方', rec: false },

  /* ===================== 身体 ===================== */
  { id: 'b_head', word: '头', pinyin: 'tóu', category: '身体', hands: 'single', dynamic: false, handshape: '手指点额', movement: '指头', meaning: '头部', rec: false },
  { id: 'b_hand', word: '手', pinyin: 'shǒu', category: '身体', hands: 'single', dynamic: false, handshape: '手指点手', movement: '指手', meaning: '手部', rec: false },
  { id: 'b_eye', word: '眼睛', pinyin: 'yǎn jing', category: '身体', hands: 'single', dynamic: false, handshape: '食指指眼', movement: '指眼', meaning: '眼睛', rec: false },
  { id: 'b_ear', word: '耳朵', pinyin: 'ěr duo', category: '身体', hands: 'single', dynamic: false, handshape: '手指点耳', movement: '指耳', meaning: '耳朵', rec: false },
  { id: 'b_mouth', word: '嘴', pinyin: 'zuǐ', category: '身体', hands: 'single', dynamic: false, handshape: '食指指点唇', movement: '指嘴', meaning: '嘴巴', rec: false },
  { id: 'b_heart', word: '心', pinyin: 'xīn', category: '身体', hands: 'single', dynamic: false, handshape: '手指点心口', movement: '指胸', meaning: '心脏', rec: false },

  /* ===================== 动物 ===================== */
  { id: 'an_cat', word: '猫', pinyin: 'māo', category: '动物', hands: 'single', dynamic: false, handshape: '食指中指成猫须', movement: '手放颊边', meaning: '猫', rec: false },
  { id: 'an_dog', word: '狗', pinyin: 'gǒu', category: '动物', hands: 'single', dynamic: false, handshape: '手拍大腿', movement: '拍腿', meaning: '狗', rec: false },
  { id: 'an_bird', word: '鸟', pinyin: 'niǎo', category: '动物', hands: 'single', dynamic: true, handshape: '拇指食指成喙', movement: '手张合如喙', meaning: '鸟类', rec: false },
  { id: 'an_fish_a', word: '马', pinyin: 'mǎ', category: '动物', hands: 'single', dynamic: true, handshape: '手如马耳', movement: '手在头侧摆', meaning: '马', rec: false },
  { id: 'an_elephant', word: '大象', pinyin: 'dà xiàng', category: '动物', hands: 'single', dynamic: false, handshape: '手臂垂成鼻', movement: '手下垂摆', meaning: '象', rec: false },
  { id: 'an_rabbit', word: '兔子', pinyin: 'tù zi', category: '动物', hands: 'single', dynamic: false, handshape: '手指成耳', movement: '手放头顶', meaning: '兔', rec: false },

  /* ===================== 其他 ===================== */
  { id: 'o_yes', word: '是', pinyin: 'shì', category: '其他', hands: 'single', dynamic: false, handshape: '点头状/拇指向上', movement: '点头或拇指上', meaning: '肯定', rec: true, sig: { f: [1,0,0,0,0], thumbUp: true } },
  { id: 'o_no', word: '不', pinyin: 'bù', category: '其他', hands: 'single', dynamic: true, handshape: '食指左右摆', movement: '食指摆动', meaning: '否定', rec: true, sig: { f: [0,1,0,0,0], shake: true } },
  { id: 'o_china', word: '中国', pinyin: 'zhōng guó', category: '其他', hands: 'single', dynamic: false, handshape: '拇指与食指成直角', movement: '手在胸前行礼', meaning: '国家', rec: false },
  { id: 'o_peace', word: '和平', pinyin: 'hé píng', category: '其他', hands: 'single', dynamic: false, handshape: '食指中指成V', movement: '手举V', meaning: '和平', rec: true, sig: { f: [0,1,1,0,0] } },
  { id: 'o_friend', word: '朋友', pinyin: 'péng you', category: '其他', hands: 'double', dynamic: false, handshape: '双手勾指', movement: '两手相钩', meaning: '友人', rec: false },
  { id: 'o_time', word: '时间', pinyin: 'shí jiān', category: '其他', hands: 'single', dynamic: false, handshape: '食指指腕', movement: '指腕', meaning: '时间', rec: false },
  { id: 'o_money2', word: '元', pinyin: 'yuán', category: '其他', hands: 'single', dynamic: false, handshape: '手指捻动', movement: '指尖搓', meaning: '货币单位', rec: false },
  { id: 'o_phone', word: '电话', pinyin: 'diàn huà', category: '其他', hands: 'single', dynamic: false, handshape: '手成电话状贴耳', movement: '手贴耳', meaning: '通讯', rec: false },
  { id: 'o_computer', word: '电脑', pinyin: 'diàn nǎo', category: '其他', hands: 'single', dynamic: false, handshape: '手敲键盘', movement: '手指点', meaning: '计算机', rec: false },
  { id: 'o_hospital', word: '医院', pinyin: 'yī yuàn', category: '其他', hands: 'single', dynamic: false, handshape: '手指十字', movement: '手画十字', meaning: '医疗机构', rec: false },
  { id: 'o_name', word: '名字', pinyin: 'míng zi', category: '其他', hands: 'single', dynamic: false, handshape: '手指点唇再指人', movement: '指唇指人', meaning: '姓名', rec: false },
  { id: 'o_understand', word: '懂', pinyin: 'dǒng', category: '其他', hands: 'single', dynamic: false, handshape: '手指点太阳穴再点头', movement: '指头点', meaning: '明白', rec: false },
  { id: 'o_question', word: '问题', pinyin: 'wèn tí', category: '其他', hands: 'single', dynamic: false, handshape: '手摊开', movement: '手前伸', meaning: '疑问', rec: false },
  { id: 'o_hello2', word: '早上好', pinyin: 'zǎo shàng hǎo', category: '其他', hands: 'single', dynamic: true, handshape: '手掌遮额挥动', movement: '手遮额挥', meaning: '晨间问候', rec: false },

  /* ===================== 补充常用词（提升翻译覆盖率） ===================== */
  { id: 'x_think', word: '想', pinyin: 'xiǎng', category: '其他', hands: 'single', dynamic: false, handshape: '食指指太阳穴转圈', movement: '指头侧画圈', meaning: '思考、想要', rec: false },
  { id: 'x_language', word: '语', pinyin: 'yǔ', category: '其他', hands: 'single', dynamic: false, handshape: '手指点唇再指外', movement: '指唇指外', meaning: '语言', rec: false },
  { id: 'x_say', word: '说', pinyin: 'shuō', category: '其他', hands: 'single', dynamic: true, handshape: '手指交替指唇', movement: '手点唇', meaning: '说话', rec: false },
  { id: 'x_see', word: '看', pinyin: 'kàn', category: '其他', hands: 'single', dynamic: false, handshape: '手搭眉望远', movement: '手遮眉', meaning: '观看', rec: false },
  { id: 'x_hear', word: '听', pinyin: 'tīng', category: '其他', hands: 'single', dynamic: false, handshape: '手贴耳', movement: '指耳', meaning: '聆听', rec: false },
  { id: 'x_know', word: '知道', pinyin: 'zhī dào', category: '其他', hands: 'single', dynamic: false, handshape: '手指点太阳穴', movement: '指头', meaning: '知晓', rec: false },
  { id: 'x_person', word: '人', pinyin: 'rén', category: '其他', hands: 'single', dynamic: false, handshape: '手指点人', movement: '指人', meaning: '人物', rec: false },
  { id: 'x_big', word: '大', pinyin: 'dà', category: '其他', hands: 'double', dynamic: false, handshape: '双手张开外扩', movement: '两手张', meaning: '尺寸大', rec: false },
  { id: 'x_small', word: '小', pinyin: 'xiǎo', category: '其他', hands: 'single', dynamic: false, handshape: '拇指食指捏小', movement: '指尖捏', meaning: '尺寸小', rec: false },
  { id: 'x_have', word: '有', pinyin: 'yǒu', category: '其他', hands: 'single', dynamic: false, handshape: '手掌向上托', movement: '手上托', meaning: '拥有', rec: false },
  { id: 'x_nohave', word: '没有', pinyin: 'méi yǒu', category: '其他', hands: 'single', dynamic: false, handshape: '手掌向下摆', movement: '手下沉', meaning: '无', rec: false },
  { id: 'x_very', word: '很', pinyin: 'hěn', category: '其他', hands: 'single', dynamic: false, handshape: '手指点胸强调', movement: '指胸', meaning: '程度深', rec: false },
  { id: 'x_also', word: '也', pinyin: 'yě', category: '其他', hands: 'single', dynamic: false, handshape: '手指平伸', movement: '手横划', meaning: '同样', rec: false }
];

// 建立索引便于快速查找
const SIGN_INDEX = {};
SIGN_DICTIONARY.forEach((g, i) => { SIGN_INDEX[g.id] = i; });

// 导出（同时兼容浏览器全局与模块环境）
if (typeof window !== 'undefined') { window.SIGN_DICTIONARY = SIGN_DICTIONARY; window.SIGN_INDEX = SIGN_INDEX; }
if (typeof module !== 'undefined' && module.exports) { module.exports = { SIGN_DICTIONARY, SIGN_INDEX }; }
