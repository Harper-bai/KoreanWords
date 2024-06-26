let wordPairs = [
  { chinese: "形 安好,平安", korean: "안녕하십니까" },
  { chinese: "安寧 ", korean: "안녕하다" },
  { chinese: "不安 ", korean: "불안하다" },
  { chinese: "感叹词 是 ，是的", korean: "네" },
  { chinese: "代 我,  自己", korean: "저" },
  { chinese: "名 名字，姓名", korean: "이름" },
  { chinese: "名 先生- 教师, 先生", korean: "선생님" },
  { chinese: "名 氏 先生，女士", korean: "씨" },
  { chinese: "名 姓 姓，姓氏", korean: "성" },
  { chinese: "名 印度― 印度人", korean: "인도 사람" },
  { chinese: "名 中國 ", korean: "중국" },
  { chinese: "代 我的", korean: "제" },
  { chinese: "副 并且，还有, 然后，接着，又", korean: "그리고" },
  { chinese: "名 親舊 朋友，好友，挚友", korean: "친구" },
  { chinese: "惯形词 哪个, 某个", korean: "어느" },
  { chinese: "名 国家，国", korean: "나라" },
  { chinese: "名 人,人士", korean: "사람" },
  { chinese: "名 美國 ", korean: "미국" },
  { chinese: "感歎詞 不", korean: "아니요" },
  { chinese: "感歎詞 是", korean: "네" },
  { chinese: "名 日本 ", korean: "일본" },
  { chinese: "形 是吗？", korean: "그렇습니까" },
  { chinese: " 是那样 ，是那样的", korean: "그렇다" },
  { chinese: "名 英國 ", korean: "영국" },
  { chinese: "名 獨逸 德国", korean: "독일" },
  { chinese: "名 Russia 俄罗斯", korean: "러시아" },
  { chinese: "名 Mongolia 蒙古", korean: "몽골" },
  { chinese: "名 泰國 ", korean: "태국" },
  { chinese: "名 韓國 ", korean: "한국" },
  { chinese: "名 濠洲 澳大利亚", korean: "호주" },
  { chinese: "名 Canada 加拿大", korean: "캐나다" },
  { chinese: "名 國籍 ", korean: "국적" },
  { chinese: "助 ...中，从， 来自", korean: "에서" },
  { chinese: "自动 来", korean: "왔습니다" },
  { chinese: "自动 来", korean: "오다" },
  { chinese: "名 會社員 公司职员，公司员工", korean: "회사원" },
  { chinese: "副 那么 那样就 ", korean: "그럼" },
  { chinese: "名 學生  学生", korean: "학생" },
  { chinese: "名大學生 ", korean: "대학생" },
  { chinese: "名 職業  职业", korean: "직업" },
  { chinese: "名 警察 警察，公安", korean: "경찰" },
  { chinese: "名 歌手 ", korean: "가수" },
  { chinese: "名 醫師 大夫，医生", korean: "의사" },
  { chinese: "名 看護師 护士", korean: "간호사" },
  { chinese: "名 銀行員 银行职员", korean: "은행원" },
  { chinese: "名 秘書 ", korean: "비서" },
  { chinese: "名 記者 ", korean: "기자" },
  { chinese: "名 辯護士 律师", korean: "변호사" },
  { chinese: "形 不是，不，非", korean: "아니다" },
  { chinese: "副 可是，不过，但是", korean: "그런데" },
  { chinese: "代 什么 ，何", korean: "무엇" },
  { chinese: "动 做吗？", korean: "하십니까" },
  { chinese: " 做，干，进行，作出", korean: "하다" },
  { chinese: "名 敎授 ", korean: "교수" },
  { chinese: "助 宾格助词，表示行为作用的直接对象", korean: "을/를" },
  { chinese: "代 谁, 某人", korean: "누구" },
  { chinese: "形  高兴，愉快", korean: "반갑다" },
  { chinese: " 初次见面", korean: "처음 뵙겠습니다." },
  { chinese: " 第一次", korean: "처음" },
  { chinese: " 见", korean: "뵙다" },
  { chinese: "自动 去，前往", korean: "가다" },
  { chinese: "自动 到，来", korean: "오다" },
  { chinese: "他动 碰到，遇到", korean: "만나다" },
  { chinese: "自动 睡，睡觉", korean: "자다" },
  { chinese: "自动 人事- 问候，请安", korean: "인사하다" },
  { chinese: "他动  吃", korean: "먹다" },
  { chinese: "他动  穿", korean: "입다" },
  { chinese: "他动  听，闻", korean: "듣다" },
  { chinese: "他动 看，读", korean: "읽다" },
  { chinese: "他动 写、用、撑", korean: "쓰다" },
  { chinese: "名學校  学校", korean: "학교" },
  { chinese: "助 (用于体词后)表示存在的处所", korean: "에" },
  { chinese: "名 店員  店员", korean: "점원" },
  { chinese: "代 这，这个", korean: "이것" },
  { chinese: "名 敎科書 教科书", korean: "교과서" },
  { chinese: "形  这样的", korean: "그렇다" },
  { chinese: "代 那个(物品)", korean: "저것" },
  { chinese: "名 辭典/詞典 词典", korean: "사전" },
  { chinese: "名 雜誌 杂志", korean: "잡지" },
  { chinese: "名  读物", korean: "읽기책" },
  { chinese: "名 冊床  书桌", korean: "책상" },
  { chinese: "名 紙匣 钱包", korean: "지갑" },
  { chinese: "名 鉛筆 铅笔", korean: "연필" },
  { chinese: "名 尺子", korean: "자" },
  { chinese: "名 擦子, 橡皮 ", korean: "지우개" },
  { chinese: "名 ball pen 圆珠笔", korean: "볼펜" },
  { chinese: "名 钱", korean: "돈" },
  { chinese: "名 card 卡, 卡片", korean: "카드" },
  { chinese: "名 旅券 护照", korean: "여권" },
  { chinese: "名 身分證 身份证", korean: "신분증" },
  { chinese: "名 包, 背包", korean: "가방" },
  { chinese: "名-手巾 手绢", korean: "손수건" },
  { chinese: "名 帽子 帽子", korean: "모자" },
  { chinese: "名 镜子", korean: "거울" },
  { chinese: "名 休紙 手纸, 废纸", korean: "휴지" },
  { chinese: "名 空冊 本子, 记事本", korean: "공책" },
  { chinese: "名 钥匙", korean: "열쇠" },
  { chinese: "名 手帖 小笔记本, 手册", korean: "수첩" },
  { chinese: "名 菓子 点心, 饼干", korean: "과자" },
  { chinese: "名 纸, 纸张", korean: "종이" },
  { chinese: "名 筆筒 笔筒, 笔盒", korean: "필통" },
  { chinese: "形  有, 存在", korean: "있다" },
  { chinese: "名 月历", korean: "달력" },
  { chinese: "n. 月", korean: "달" },
  { chinese: "n. 历", korean: "력" },
  { chinese: "名 地圖 地图", korean: "지도" },
  { chinese: "形 没有 ", korean: "없다" },
  { chinese: "adj. 有", korean: "있다" },
  { chinese: "名 教室", korean: "교실" },
  { chinese: "名 窓門 窗户", korean: "창문" },
  { chinese: "名 粉筆 粉笔", korean: "분필" },
  { chinese: "名 漆板 黑板", korean: "칠판" },
  { chinese: "名 画 ", korean: "그림" },
  { chinese: "名  衣架,衣挂 ", korean: "옷걸이" },
  { chinese: "名 门  ", korean: "문" },
  { chinese: "名 television ", korean: "텔레비전" },
  { chinese: "n TV", korean: "티비" },
  { chinese: "名 椅子 ", korean: "의자" },
  { chinese: "形 多, 大", korean: "많다" },
  { chinese: "形  少, 少量", korean: "적다" },
  { chinese: "形 大，高，长，", korean: "크다" },
  { chinese: "形 小,细,矮,瘦", korean: "작다" },
  { chinese: "名 天气 ", korean: "날씨" },
  { chinese: "形  好, 美, 良, 善", korean: "좋다" },
  { chinese: "形 坏, 差, 糟,不良, 不好", korean: "나쁘다" },
  { chinese: "名 juice  果汁, 液", korean: "주스" },
  { chinese: "助 也,也还 (表示包括,补充、添加)，用于同时举出两个以上的事物时", korean: "도" },
  { chinese: "名 物件 东西, 物, 物品", korean: "물건" },
  { chinese: "n. 物价", korean: "물건값" },
  { chinese: "助 “-에”的强调说法", korean: "에는" },
  { chinese: "口语体格助词 ，表示比较的对象,一起、共同", korean: "하고" },
  { chinese: "名 口袋, 衣袋, 袋子", korean: "주머니" },
  { chinese: "名 銀行 银行", korean: "은행" },
  { chinese: "代 哪儿, 哪里 何处", korean: "어디" },
  { chinese: "名 學生會館 ", korean: "학생회관" },
  { chinese: "名 圖書館 ", korean: "도서관" },
  { chinese: "名 前面, 前方, 前边", korean: "앞" },
  { chinese: "名 化粧室 洗手间", korean: "화장실" },
  { chinese: "名 食堂  食堂, 餐厅", korean: "식당" },
  { chinese: "名 (構內食堂)", korean: "구내식당" },
  { chinese: "名 書店 书店", korean: "서점" },
  { chinese: "名 郵遞局 邮局", korean: "우체국" },
  { chinese: "名 事務室 办公室, 业务室", korean: "사무실" },
  { chinese: "名 后面", korean: "뒤" },
  { chinese: "名 前", korean: "앞" },
  { chinese: "名 旁边  ", korean: "옆" },
  { chinese: "名 上面", korean: "위" },
  { chinese: "名 底", korean: "밑" },
  { chinese: "名 下面", korean: "아래" },
  { chinese: "名 内", korean: "안" },
  { chinese: "名 外", korean: "밖" },
  { chinese: "名 computer 电脑", korean: "컴퓨터" },
  { chinese: "名cup 杯子", korean: "컵" },
  { chinese: "名 牛乳 牛奶", korean: "우유" },
  { chinese: "名 新聞 报纸", korean: "신문" },
  { chinese: "名 電話 电话 ", korean: "전화" },
  { chinese: "名 衣服 ", korean: "옷" },
  { chinese: "名 麥酒  啤酒", korean: "맥주" },
  { chinese: "名 寢臺 床, 铺", korean: "침대" },
  { chinese: "名 冷藏庫 冰箱, 冰柜", korean: "냉장고" },
  { chinese: "名 一層 一楼", korean: "1층" },
  { chinese: "名 地下 地下 ", korean: "지하" },
  { chinese: "名 家 (n.家务)", korean: "집" },
  { chinese: "名 近處 附近", korean: "근처" },
  { chinese: "名 百貨店  百货商店", korean: "백화점" },
  { chinese: "名 地铁", korean: "지하철" },
  { chinese: "名 驛站 车站, 驿站  ", korean: "역" },
  { chinese: "名  剧院 ，剧场", korean: "극장" },
  { chinese: "名 病院 医院", korean: "병원" },
  { chinese: "名 藥局 药店, 药房", korean: "약국" },
  { chinese: "名 小店, 小铺,", korean: "가게" },
  { chinese: "名 會社 훼사 公司, 企业", korean: "회사" },
  { chinese: "名 公園 公园", korean: "공원" },
  { chinese: "名 市場 市场", korean: "시장" },
  { chinese: "代 我们, 咱们, 咱", korean: "우리" },
  { chinese: "名 bus 公交车", korean: "버스" },
  { chinese: "名 停留場  车站", korean: "정류장" },
  { chinese: "名 coffee shop 咖啡店", korean: "커피숍" },
  { chinese: "助 和, 与, 跟", korean: "하고" },
  { chinese: "名 敎會 교훼 教会, 教堂", korean: "교회" },
  { chinese: "副 真, 实在, 相当", korean: "참" },
  { chinese: "他动 做, 干, 进行", korean: "하다" },
  { chinese: "名 家族 家庭, 家人", korean: "가족" },
  { chinese: "名 寫眞 相片", korean: "사진" },
  { chinese: "他 看, 观, 视", korean: "보다" },
  { chinese: "副 常常, 频繁, 经常", korean: "자주" },
  { chinese: "副 偶尔, 有时", korean: "가끔" },
  { chinese: "名 事", korean: "일" },
  { chinese: "自动 工作, 做事, 劳动", korean: "일하다" },
  { chinese: "名 工夫 ", korean: "공부" },
  { chinese: "他 学, 学习, 攻读, 用功", korean: "공부하다" },
  { chinese: "名 宿題 ", korean: "숙제" },
  { chinese: "动 做作业", korean: "숙제하다" },
  { chinese: "名 ", korean: "이야기" },
  { chinese: "动 说, 谈, 解释, 讲故事", korean: "이야기하다" },
  { chinese: "名 ", korean: "노래" },
  { chinese: "动 唱歌, 演唱, 歌颂", korean: "노래하다" },
  { chinese: "名 運動 ", korean: "운동" },
  { chinese: "动 运动, 锻炼, 健身, 活动", korean: "운동하다" },
  { chinese: "名 散策 ", korean: "산책" },
  { chinese: "动 散步", korean: "산책하다" },
  { chinese: "他 购买, 置办", korean: "사다" },
  { chinese: "名 米饭", korean: "밥" },
  { chinese: "名 泡菜, 辛奇", korean: "김치" },
  { chinese: "名 映畵 电影, 影片", korean: "영화" },
  { chinese: "名 音樂  音乐", korean: "음악" },
  { chinese: "副 每天, 天天", korean: "날마다" },
  { chinese: "他 呼唤, 叫唤, 喊, 唱", korean: "부르다" },
  { chinese: "数  多少 ，几", korean: "몇" },
  { chinese: "名 名, 人, 个    ", korean: "명" },
  { chinese: "副 全部, 所有, 总共, 都", korean: "모두" },
  { chinese: "名 父母님 父母", korean: "부모님" },
  { chinese: "自动 (指长辈或上级)在，健在", korean: "계시다" },
  { chinese: "名 故鄕 故乡, 家乡", korean: "고향" },
  { chinese: "名 兄弟 兄弟姐妹", korean: "형제" },
  { chinese: "助 主格助词“가/이”的尊敬形式", korean: "께서" },
  { chinese: "他动 睡觉", korean: "(敬语) 주무시다" },
  { chinese: "他动  吃", korean: "잡수시다" },
  { chinese: "他动 吃", korean: "드시다" },
  { chinese: "动  [动] 说话，表达", korean: "말씀하시다" },
  { chinese: "量 个，块，只，颗，张", korean: "개" },
  { chinese: "量 卷 本，卷，册", korean: "권" },
  { chinese: "他动 喜欢，喜爱，喜好", korean: "좋아하다" },
  { chinese: "名 主婦 主妇", korean: "주부" },
  { chinese: "副 “아니”的略语,不,没有", korean: "안" },
  { chinese: "名 高等學生  高中生", korean: "고등학생" },
  { chinese: "名 首都, 首尔", korean: "서울" },
  { chinese: "副 很，极，非常", korean: "아주" },
  { chinese: "形  有趣，有意思", korean: "재미있다" },
  { chinese: "助  一起，一同", korean: "같이" },
  { chinese: "自动 居住，生活，生存", korean: "살다" },
  { chinese: "助 ...中,在", korean: "에서" },
  { chinese: "名  山 山", korean: "산" },
  { chinese: "名 空氣 空气，大气", korean: "공기" },
  { chinese: "形 安静, 寂静", korean: "조용하다" },
  { chinese: "形 喧哗，吵闹", korean: "시끄럽다" },
  { chinese: "形  干净,整洁", korean: "깨끗하다" },
  { chinese: "形  宽，宽阔", korean: "넓다" },
  { chinese: "形  脏,变糟", korean: "더럽다" },
  { chinese: "形  窄 ，狭窄", korean: "좁다" },
  { chinese: "形  冷，寒冷", korean: "춥다" },
  { chinese: "形  热，暑", korean: "덥다" },
  { chinese: "形 凉快, 爽口, 豁然", korean: "시원하다" },
  { chinese: "形  热乎，暖和, 温情", korean: "따뜻하다" },
  { chinese: "形 美丽，漂亮, 可爱", korean: "예쁘다" },
  { chinese: "形 複雜-  复杂, 纷杂", korean: "복잡하다" },
  { chinese: "形 (簡單)", korean: "간단하다" },
  { chinese: "名 们，辈(表示复数）", korean: "들" },
  { chinese: "名 海，海洋 해", korean: "바다" },
  { chinese: "副 所以,因此", korean: "그래서" },
  { chinese: "名 生鮮 鱼，鲜鱼", korean: "생선" },
  { chinese: "名 冬天", korean: "겨울" },
  { chinese: "名 夏天", korean: "여름" },
  { chinese: "名 春天", korean: "봄" },
  { chinese: "名 秋天", korean: "가을" },
  { chinese: "形 親切- 亲切，和蔼", korean: "친절하다" },
  { chinese: "他动 爱 ，宠爱 ，疼爱", korean: "사랑하다" },
  { chinese: "名 大學校 大学, 高等学府", korean: "대학교" },
  { chinese: "名 經濟學 ", korean: "경제학" },
  { chinese: "名 專攻 专业, 主修", korean: "전공" },
  { chinese: "名 歷史學", korean: "역사학" },
  { chinese: "名 computer工學 计算机工学", korean: "컴퓨터공학" },
  { chinese: "名 政治學 ", korean: "정치학" },
  { chinese: "名 法學 ", korean: "법학" },
  { chinese: "名 經營學 ", korean: "경영학" },
  { chinese: "名 醫學 ", korean: "의학" },
  { chinese: "名 英文學 ", korean: "영문학" },
  { chinese: "名 生物學 ", korean: "생물학" },
  { chinese: "名 programmer 编导、程序员", korean: "프로그래머" },
  { chinese: "助 跟、和, 一起、", korean: "하고" },
  { chinese: "副 名 单独 ，独自 ", korean: "혼자" },
  { chinese: "副  一起 ，一同 ，共同", korean: "같이" },
  { chinese: "動 那样做吧", korean: "그럽시다" },
  { chinese: "自動 出去, 向前 ", korean: "나가다" },
  { chinese: "自動  进来, 进，入  ", korean: "들어오다" },
  { chinese: "動 爬上, 进, 升    ", korean: "올라가다" },
  { chinese: "自動 下 ，下来 ，回        ", korean: "내려오다" },
  { chinese: "名 韓食-  韩食餐馆", korean: "한식집" },
  { chinese: "名 中國-  中餐厅", korean: "중국집" },
  { chinese: "名 日食-  日本料理店", korean: "일식집" },
  { chinese: "名 洋食- 西餐厅", korean: "양식집" },
  { chinese: "名  拌饭", korean: "비빔밥" },
  { chinese: "名 烤牛肉", korean: "불고기" },
  { chinese: "名 來日 明天，明日", korean: "내일" },
  { chinese: "名 正门，大门 ", korean: "정문" },
  { chinese: "形  近 ，亲密", korean: "가깝다" },
  { chinese: "動 是吗？", korean: "그래요?" },
  { chinese: "名 飮食 食物 ，饭菜，餐饮", korean: "음식" },
  { chinese: "名 今天 ，今日", korean: "오늘" },
  { chinese: "名  价钱，价格, 价值", korean: "값" },
  { chinese: "形 便宜, 低廉 ", korean: "싸다" },
  { chinese: "冠 什么", korean: "무슨" },
  { chinese: "名  味道，滋味", korean: "맛" },
  { chinese: "形  可口，好吃", korean: "맛있다" },
  { chinese: "形  不好吃，无味", korean: "맛없다" },
  { chinese: "名 外國人  ", korean: "외국인" },
  { chinese: "副 好，熟练,", korean: "잘" },
  { chinese: "名 韓食 ", korean: "한식" },
  { chinese: "名 中國飮食 ", korean: "중국 음식" },
  { chinese: "名 日食 ", korean: "일식" },
  { chinese: "名 洋食 ", korean: "양식" },
  { chinese: "名 炸醬麵 ", korean: "자장면" },
  { chinese: "名 醋- 寿司 ", korean: "초밥" },
  { chinese: "名steak 烤肉", korean: "스테이크" },
  { chinese: "名 (beefsteak) 牛排", korean: "비프스테이크" },
  { chinese: "形 맵따 辣", korean: "맵다" },
  { chinese: "形 酸, 酸疼, 炫目", korean: "시다" },
  { chinese: "形 甜，甘甜", korean: "달다" },
  { chinese: "形 味苦，苦涩", korean: "쓰다" },
  { chinese: "形 咸", korean: "짜다" },
  { chinese: "形  淡，寡淡, 乏味", korean: "싱겁다" },
  { chinese: "名Christmas  ", korean: "크리스마스" },
  { chinese: "他動 知道, 理解", korean: "알다" },
  { chinese: "他動 开，打开, 召开", korean: "열다" },
  { chinese: "自動 玩乐, 闲着", korean: "놀다" },
  { chinese: "他動 作, 制造", korean: "만들다" },
  { chinese: "名ice-cream ", korean: "아이스크림" },
  { chinese: "副 稍微，少量, 一点儿", korean: "좀" },
  { chinese: "名 酱油", korean: "간장" },
  { chinese: "名 辣椒", korean: "고추" },
  { chinese: "名 食醯  甜米露", korean: "식혜" },
  { chinese: "名curry 咖喱", korean: "카레" },
  { chinese: "名 肋排，排骨", korean: "갈비" },
  { chinese: "名三-  烤五花肉", korean: "삼겹살" },
  { chinese: "名 辛奇汤", korean: "김치찌개" },
  { chinese: "名 大酱汤", korean: "된장찌개" },
  { chinese: "名 -豆腐- 嫩豆腐锅", korean: "순두부찌개" },
  { chinese: "名  铁板鸡", korean: "닭갈비" },
  { chinese: "名 蔘鷄湯  ", korean: "삼계탕" },
  { chinese: "名 -湯 牛排骨汤", korean: "갈비탕" },
  { chinese: "名 冷麵 ", korean: "냉면" },
  { chinese: "名  刀切面", korean: "칼국수" },
  { chinese: "名 拉麪 ラーメン 拉面 ，方便面", korean: "라면" },
  { chinese: "名 紫菜卷饭", korean: "김밥" },
  { chinese: "名  辣炒年糕", korean: "떡볶이" },
  { chinese: "名 雪嶽山  雪岳山", korean: "설악산" },
  { chinese: "名 人分 份儿", korean: "인분" },
  { chinese: " …期间 ，…中 ，…时", korean: "중에서" },
  { chinese: "副 普通 通常，一般", korean: "보통" },
  { chinese: "名 生菜", korean: "상추" },
  { chinese: "名 外國 ", korean: "외국" },
  { chinese: "名 從業員  工作人员，职工", korean: "종업원" },
  { chinese: "助 表示尊敬或强调的辅助词", korean: "요" },
  { chinese: "他動 给, 给与", korean: "주다" },
  { chinese: "他動 进, 呈献，奉上", korean: "드리다" },
  { chinese: "代 什么", korean: "뭘" },
  { chinese: "名 水", korean: "물" },
  { chinese: "量 盞 杯 ，盏 ，盅", korean: "잔" },
  { chinese: "量 甁 瓶", korean: "병" },
  { chinese: "量  碗", korean: "그릇" },
  { chinese: "名 砂糖/沙糖 糖, 糖果 (雪糖)", korean: "사탕" },
  { chinese: "名coffee ", korean: "커피" },
  { chinese: "名 chocolate ", korean: "초콜릿" },
  { chinese: "名 燒酒 ", korean: "소주" },
  { chinese: "名 沙果/砂果 苹果", korean: "사과" },
  { chinese: "名 肚子 ，腹部", korean: "배" },
  { chinese: "形 饿 ，饥饿  ", korean: "고프다" },
  { chinese: "名 腿，下肢", korean: "다리" },
  { chinese: "形 疼，痛", korean: "아프다" },
  { chinese: "名 單語  单词，词语", korean: "단어" },
  { chinese: "他動 不知道，不认识", korean: "모르다" },
  { chinese: "名 orange 橙子", korean: "오렌지" },
  { chinese: "名 cake 蛋糕", korean: "케이크" },
  { chinese: "名 生日 ", korean: "생일" },
  { chinese: "名 英語 ", korean: "영어" },
  { chinese: "名 日語 ", korean: "일어" },
  { chinese: "名combination 组合", korean: "콤비네이션" },
  { chinese: "名pizza ", korean: "피자" },
  { chinese: "名spaghetti ", korean: "스파게티" },
  { chinese: "名 lasagna 千层面", korean: "라자나" },
  { chinese: "名ちゃんぽん 杂烩面", korean: "짬뽕" },
  { chinese: "名  炒饭 ", korean: "볶음밥" },
  { chinese: "名 糖水肉 糖醋肉片", korean: "탕수육" },
  { chinese: "名 客人，宾客", korean: "손님" },
  { chinese: "名 -冷麵 ", korean: "물냉면" },
  { chinese: "拌冷麵", korean: "비빔냉면" },
  { chinese: "名  酒馆，酒家", korean: "술집" },
  { chinese: "他動 让 ，使唤, 点 (菜)", korean: "시키다" },
  { chinese: "他動 喝 ，饮, 呼吸", korean: "마시다" },
  { chinese: "他動  懂 ，理解, 知道", korean: "알겠습니다" },
  { chinese: "副 只今 现在，目前，此时", korean: "지금" },
  { chinese: "名 時間 ", korean: "시간" },
  { chinese: "名 時 点，时", korean: "시" },
  { chinese: "名分 分，分钟", korean: "분" },
  { chinese: "名 圓 ￦ ", korean: "원" },
  { chinese: "名 半 半, 一半", korean: "반" },
  { chinese: "名 時計 시게 表，钟，钟表", korean: "시계" },
  { chinese: "名 午前 上午", korean: "오전" },
  { chinese: "名 午後 下午", korean: "오후" },
  { chinese: "助 到，到 …为止", korean: "까지" },
  { chinese: "后缀 表示程度", korean: "쯤" },
  { chinese: "名 會議 开会，会议", korean: "회의" },
  { chinese: "副 暂时，稍微，一会儿", korean: "잠깐" },
  { chinese: "助 和、与、跟", korean: "과/와" },
  { chinese: "動 说，谈, 讲故事", korean: "이야기하다" },
  { chinese: "形  感谢，感激", korean: "고맙다" },
  { chinese: " 未来时，将要…", korean: "을/ㄹ 거예요" },
  { chinese: "名 月 ", korean: "월" },
  { chinese: "名 日 ", korean: "일" },
  { chinese: "名 來日 明天，明日", korean: "내일" },
  { chinese: "名 几号, 几天", korean: "며칠" },
  { chinese: "代  什么", korean: "뭐" },
  { chinese: "感歎 不清楚，是啊", korean: "글쎄요" },
  { chinese: "動 休息，休憩", korean: "쉬다" },
  { chinese: "名 曜日 星期", korean: "요일" },
  { chinese: "名 下宿- 寄宿，客栈", korean: "하숙집" },
  { chinese: "副 快，赶快", korean: "어서" },
  { chinese: "名 -番 这次，这回", korean: "이번" },
  { chinese: "名 旅行 ", korean: "여행" },
  { chinese: "代 那边 ，那里, 那个", korean: "거기" },
  { chinese: "名 濟州島 ", korean: "제주도" },
  { chinese: "名 放學 学校放假", korean: "방학" },
  { chinese: "代 什么时候，何时", korean: "언제" },
  { chinese: "名 一天，一日,  白天", korean: "날" },
  { chinese: "名 試驗 考试, 考查", korean: "시험" },
  { chinese: "名 party 宴会，茶话会", korean: "파티" },
  { chinese: "助 从，起，自从，由此", korean: "부터" },
  { chinese: "名 时候，时机", korean: "때" },
  { chinese: "名 卒業式  毕业典礼   ", korean: "졸업식" },
  { chinese: "名 早晨,  早餐", korean: "아침" },
  { chinese: "名 點心 午饭，午餐", korean: "점심" },
  { chinese: "名 傍晚，黄昏,  晚饭，밤", korean: "저녁" },
  { chinese: "名 授業 讲课, 听课", korean: "수업" },
  { chinese: "自動  起床, 起身", korean: "일어나다" },
  { chinese: "名 酒，酒水", korean: "술" },
  { chinese: "他動 喝，饮, 吸", korean: "마시다" },
  { chinese: "自動 洗手-- 洗脸", korean: "세수하다" },
  { chinese: "名 牙，牙齿", korean: "이" },
  { chinese: "他動 乘坐,  搭乘", korean: "타다" },
  { chinese: "他動 擦，拭，抹，刷        ", korean: "닦다" },
  { chinese: "動 下，降，落, 拿下, 下达  ", korean: "내리다" },
  { chinese: "名 睡觉，睡眠 ", korean: "잠" },
  { chinese: "名 食事 饭菜 ，饭  ", korean: "식사" },
];
