import { Difficulty } from './types';

export const EASY_WORDS = [
  "SEE", "SAY", "NEW", "SIT", "SAD", "SHY", "BUS", "CAR", "ZOO", "CRY", "CUP", "WIN", "HUG", "FIX", "TRY", "NAME", "FINE", "NICE", "MEET", "HAND", "KIND", "WAKE", "PLAY", "PARK", "GAME", "TIDY", "BOOK", "DRAW", "TALL", "HAIR", "AUNT", "KITE", "TAKE", "CUTE", "EXAM", "EXIT", "SIGN", "HEAR", "COOK", "GOOD", "BUSY", "CUFF", "BELL", "PULL", "TELL", "MISS", "LESS", "BUZZ", "FUZZ", "JAZZ", "WELL", "CITY", "DUCK", "JUMP", "BLUE", "SOCK", "BACK", "NECK", "MALL", "ROLL", "LION", "WALK", "SAVE", "SOON", "HOLE", "FREE", "LICK", "WORK", "TEAM", "CARE", "KNEE", "COAT", "FACE", "GOAL", "NEED", "TALK", "GIFT", "CLEAN", "PACK", "DARE", "STEP", "TURN", "PLAN", "PASS", "FAIR", "PAGE", "HUGE", "GATE", "NEAR", "KICK", "SPRAY", "SPIN", "BUMP", "RIDE", "HOLD", "PUSH", "FEET"
];

export const MEDIUM_WORDS = [
  "LATER", "CHECK", "SHORT", "GREEN", "RAISE", "HELP", "MESSY", "STAND", "SHOUT", "CLOSE", "START", "KEEP", "WRITE", "WHALE", "WHEEL", "WHEN", "WHITE", "WHERE", "FUNNY", "CURLY", "BROWN", "LAUGH", "BRUSH", "HAPPY", "ANGRY", "QUIET", "SHELF", "SMILE", "PRETTY", "CLOWN", "WATCH", "TOUCH", "SOUND", "SLEEP", "DREAM", "STRING", "GRAPH", "PIANO", "BRAVE", "EXIST", "PHONE", "PHOTO", "STORY", "TRUCK", "PILOT", "HOUSE", "TRAIN", "STAFF", "GRASS", "CAIRO", "HORSE", "CAMEL", "LOCK", "SUNNY", "COUCH", "STUCK", "STICK", "LUNCH", "CHIPS", "JUICE", "POUND", "DRINK", "CLIMB", "SCRATCH", "LOCAL", "EXCITED", "CHORES", "TIRED", "BORED", "SCORE", "PROUD", "SOLVE", "REACH", "SPRING", "WATER", "SPLASH", "SHARE", "CHEER", "COACH", "MAGIC", "GREAT", "GROUND", "MEETING", "BREAKFAST", "HOMEWORK", "SCHOOL", "FOOTBALL", "SPLIT", "SCREEN", "FAMILY", "PRIMARY", "FRIEND", "TEACHER", "BATHROOM", "PLEASE", "KITCHEN", "STUDENT", "GARDEN"
];

export const HARD_WORDS = [
  "TOGETHER", "DRESS", "LISTEN", "ANSWER", "FATHER", "UNCLE", "STRAIGHT", "SISTER", "BROTHER", "EASILY", "COUSIN", "HELPFUL", "MEMBER", "MOTHER", "SOLDIER", "SALTED", "EXAMPLE", "ELEPHANT", "ALPHABET", "BALLOON", "RABBIT", "PICTURE", "FAVORITE", "REMIND", "BAKER", "PATIENT", "TRAVEL", "STATION", "MUSEUM", "BUTTON", "FOREVER", "FARMER", "DOCTOR", "VISIT", "BEHIND", "BETWEEN", "CURTAIN", "MONKEY", "TICKET", "LANDMARK", "BOUNCE", "TOWER", "PEDAL", "SHOPPING", "MISTAKE", "BETTER", "LIVING", "POSTER", "WORRIED", "PUDDLE", "FOLLOW", "NERVOUS", "FENCE", "PROBLEM", "SUCCESS", "GIRAFFE", "CLOTHES", "CARTOON", "RUNNER", "PROJECT", "BRIDGE", "DONATE", "BEDROOM", "BEHAVIOR", "CLASSROOM", "CAREFULLY", "FRIENDLY", "GRANDMOTHER", "GRANDFATHER", "CELEBRATION", "EXERCISE", "MORNING", "PRACTICE", "EVERYDAY", "LIBRARY", "PYRAMID", "HOLIDAY", "ADVENTURE", "EXAMINE", "AMUSEMENT", "HOSPITAL", "DESCRIBE", "QUICKLY", "RECEIVE", "COMMUNITY", "SWIMMER", "TRADITIONS", "NEIGHBORHOOD", "SUPERMARKET"
];

export const WORDS_PER_GAME = 10; // Number of words to find per round to keep grid manageable

export const GRID_SIZE: Record<Difficulty, number> = {
  easy: 10,
  medium: 12,
  hard: 14
};

export const SCORES = {
  WORD_FOUND: 10
};

export const TRANSLATIONS = {
  ar: {
    appTitle: "مسابقة تهجئة الكلمات",
    appSubtitle: "للصف الثالث الإبتدائي",
    enterName: "اسم الطالب",
    placeholderName: "اكتب اسمك هنا...",
    difficulty: "مستوى الصعوبة",
    diffEasy: "مستوى سهل",
    diffEasyDesc: "كلمات قصيرة",
    diffMedium: "مستوى متوسط",
    diffMediumDesc: "كلمات متوسطة",
    diffHard: "مستوى صعب",
    diffHardDesc: "كلمات طويلة",
    startGame: "ابدأ اللعبة",
    designer: "مصمم اللعبة : محمد علاء",
    welcome: "أهلاً",
    level: "المستوى",
    score: "النقاط",
    attempts: "المحاولات",
    requiredWords: "الكلمات المطلوبة",
    finishedBtn: "انتهيت (حفظ النتيجة)",
    changeWordsBtn: "تغيير الكلمات",
    newGameBtn: "لعبة جديدة",
    resultPerfectTitle: "ممتاز يا بطل!",
    resultPerfectDesc: "لقد أكملت جميع الكلمات بنجاح!",
    resultGreatTitle: "عمل رائع!",
    resultGreatDesc: "أنت قريب جداً من القمة، استمر!",
    resultGoodTitle: "جيد جداً!",
    resultGoodDesc: "حاول مرة أخرى لتحقيق نتيجة أفضل.",
    resultStartTitle: "بداية جيدة!",
    resultStartDesc: "لا تيأس، التدريب يصنع المعجزات.",
    leaderboard: "لوحة الشرف (أفضل النتائج)",
    time: "الوقت",
    from: "من",
    dateLocale: "ar-EG"
  },
  en: {
    appTitle: "Spelling Bee",
    appSubtitle: "3rd Grade Primary",
    enterName: "Student Name",
    placeholderName: "Enter your name...",
    difficulty: "Difficulty Level",
    diffEasy: "Easy Level",
    diffEasyDesc: "Short words",
    diffMedium: "Medium Level",
    diffMediumDesc: "Medium words",
    diffHard: "Hard Level",
    diffHardDesc: "Long words",
    startGame: "Start Game",
    designer: "Game Designer: Mohamed Alaa",
    welcome: "Welcome",
    level: "Level",
    score: "Score",
    attempts: "Attempts",
    requiredWords: "Required Words",
    finishedBtn: "Finish (Save)",
    changeWordsBtn: "Change Words",
    newGameBtn: "New Game",
    resultPerfectTitle: "Perfect Hero!",
    resultPerfectDesc: "You found all words successfully!",
    resultGreatTitle: "Great Job!",
    resultGreatDesc: "You are very close to the top, keep going!",
    resultGoodTitle: "Very Good!",
    resultGoodDesc: "Try again to get a better score.",
    resultStartTitle: "Good Start!",
    resultStartDesc: "Don't give up, practice makes perfect.",
    leaderboard: "Leaderboard (Top Scores)",
    time: "Time",
    from: "of",
    dateLocale: "en-US"
  }
};