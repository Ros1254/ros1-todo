/* ==========================================================================
   ROS1 TODO - REACTIVE ENGINE & INTERACTIVITY
   Vue 3, Web Audio API Sound Effects, Canvas Particles, and Touch Drag-and-Drop.
   ========================================================================== */

// 1. DYNAMIC SOUND SYNTHESIS USING WEB AUDIO API
// Synthesizes retro chime sounds on the fly with no external assets.
const SoundEffects = {
  ctx: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  playClick() {
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') this.ctx.resume();
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
    
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    
    osc.start(now);
    osc.stop(now + 0.09);
  },

  playSuccess() {
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') this.ctx.resume();
    
    const now = this.ctx.currentTime;
    
    const playNote = (freq, startTime, duration) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.03, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    
    // Play a happy 3-note ascending chime
    playNote(523.25, now, 0.12);        // C5
    playNote(659.25, now + 0.08, 0.12); // E5
    playNote(783.99, now + 0.16, 0.22); // G5
  }
};

// 2. CANVAS-BASED CONFETTI & SPARK SYSTEM
// Delivers a premium 'WOW' factor when tasks are finished.
const ParticleSystem = {
  canvas: null,
  ctx: null,
  particles: [],
  animationId: null,

  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  },

  resizeCanvas() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  },

  spawn(x, y, count = 28) {
    const colors = ['#00f2fe', '#bc00dd', '#00ffcc', '#ff007f', '#6e8b72', '#d4a373'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Upward bias
        radius: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015,
        gravity: 0.2
      });
    }
    if (!this.animationId) {
      this.loop();
    }
  },

  loop() {
    if (this.particles.length === 0) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animationId = null;
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.x < 0 || p.x > this.canvas.width || p.y > this.canvas.height) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
      this.ctx.restore();
    }

    this.animationId = requestAnimationFrame(() => this.loop());
  }
};

// 3. OVERRIDING BROWSER ALERTS WITH CUSTOM GLASSMORPHIC DIALOGS
// Returns Promises, matching standard confirm behaviors seamlessly.
window.alert = function(message, title = '提示') {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    
    const alertBox = document.createElement('div');
    alertBox.className = 'custom-alert';
    alertBox.innerHTML = `
      <div class="custom-alert-title">${title}</div>
      <div class="custom-alert-content">${message}</div>
      <div class="custom-alert-buttons">
        <button class="custom-alert-btn confirm">确定</button>
      </div>
    `;
    
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);
    
    const confirmBtn = alertBox.querySelector('.confirm');
    confirmBtn.focus();
    
    const close = () => {
      alertBox.style.animation = 'popOut 0.2s forwards ease-in';
      overlay.style.transition = 'opacity 0.2s ease';
      overlay.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(overlay);
        resolve(true);
      }, 200);
    };
    
    confirmBtn.addEventListener('click', close);
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') close();
    });
  });
};

window.confirm = function(message, title = '请确认') {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    
    const alertBox = document.createElement('div');
    alertBox.className = 'custom-alert';
    alertBox.innerHTML = `
      <div class="custom-alert-title">${title}</div>
      <div class="custom-alert-content">${message}</div>
      <div class="custom-alert-buttons">
        <button class="custom-alert-btn cancel">取消</button>
        <button class="custom-alert-btn confirm">确定</button>
      </div>
    `;
    
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);
    
    const confirmBtn = alertBox.querySelector('.confirm');
    const cancelBtn = alertBox.querySelector('.cancel');
    cancelBtn.focus();
    
    const close = (result) => {
      alertBox.style.animation = 'popOut 0.2s forwards ease-in';
      overlay.style.transition = 'opacity 0.2s ease';
      overlay.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(overlay);
        resolve(result);
      }, 200);
    };
    
    confirmBtn.addEventListener('click', () => close(true));
    cancelBtn.addEventListener('click', () => close(false));
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close(false);
    });
  });
};

// 4. STORAGE KEYS & DEFAULTS
const STORAGE_KEYS = {
  todos: 'ros1-todo-items',
  bin: 'ros1-todo-bin',
  slogan: 'ros1-todo-slogan',
  theme: 'ros1-todo-theme',
  sound: 'ros1-todo-sound',
  
  // MEETING NOTES AND API STORAGE KEYS
  notes: 'ros1-todo-notes',
  activeNoteId: 'ros1-todo-active-note-id',
  apiProvider: 'ros1-todo-api-provider',
  apiKey: 'ros1-todo-api-key',
  apiBaseUrl: 'ros1-todo-api-base-url',

  // 🌟 NEW MULTILINGUAL AND LAYOUT PREFERENCE STORAGE KEYS
  lang: 'ros1-todo-lang',
  radiusStyle: 'ros1-todo-radius-style',
  accentColor: 'ros1-todo-accent-color'
};

// HELPER UTILITY FOR Multimodal Audio base64 conversions
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Data = reader.result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

// 5. INITIALIZE THE VUE 3 APPLICATION
const { createApp, ref, computed, watch, onMounted, nextTick } = Vue;

const app = createApp({
  setup() {
    // Basic reactive states
    const todos = ref([]);
    const recycleBin = ref([]);
    const slogan = ref('');
    const theme = ref('light');
    const soundToggle = ref(true);

    const newTodoTitle = ref('');
    const newTodoTags = ref([]); // tags selected for a new task
    const availableTags = ref(['工作', '生活', '学习', '紧急', '会议']);
    
    const selectedTagsFilter = ref([]); // Active filters by tag
    const intention = ref('all'); // all, ongoing, completed, removed
    
    const checkEmpty = ref(false);
    const settingsActive = ref(false);
    const isEditingSlogan = ref(false);
    const originalSlogan = ref('');
    const sloganInputRef = ref(null);
    const editTodoInputRef = ref(null);
    const fileImportRef = ref(null);

    // Track active inline edited todo
    const editedTodo = ref(null);

    // Track dragging indexes
    const dragIndex = ref(null);
    const touchStartItemIndex = ref(null);

    // Time / Date Function States
    const currentTime = ref('');
    const currentDate = ref('');
    const timeGreeting = ref('');

    // Sub-steps Input State Dictionary (keyed by todo.id)
    const newSubtaskTitles = ref({});

    // MEETING NOTES & AI STATES
    const activeTab = ref('todo'); // 'todo' or 'notes'
    const meetingNotes = ref([]);
    const activeNoteId = ref(null);
    
    // AI API Configurations
    const apiProvider = ref('gemini'); // 'gemini', 'openai', or 'custom'
    const apiKey = ref('');
    const apiBaseUrl = ref('');
    
    // Voice Transcription States
    const isRecording = ref(false);
    const recordingInterimText = ref('');
    const isAiSummarizing = ref(false);

    // AUDIO FILE UPLOAD STT STATES
    const isAudioTranscribing = ref(false);
    const audioUploadFileInputRef = ref(null);

    // 🌟 NEW MULTILINGUAL AND LAYOUT STYLING PREFERENCE STATES
    const lang = ref('zh');
    const radiusStyle = ref('rounded'); // 'rounded', 'sharp', 'classic'
    const accentColor = ref('default'); // 'default', 'cyan', 'green', 'pink', 'purple', 'orange'
    const isTestingConnection = ref(false);

    // Fetch local storage initial state
    const fetchStorage = () => {
      try {
        todos.value = JSON.parse(localStorage.getItem(STORAGE_KEYS.todos) || '[]');
        recycleBin.value = JSON.parse(localStorage.getItem(STORAGE_KEYS.bin) || '[]');
        slogan.value = localStorage.getItem(STORAGE_KEYS.slogan) || '今日事今日毕，勿将今事待明日! ☕';
        theme.value = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
        soundToggle.value = localStorage.getItem(STORAGE_KEYS.sound) !== 'false';
        
        // Load AI and Note fields
        meetingNotes.value = JSON.parse(localStorage.getItem(STORAGE_KEYS.notes) || '[]');
        const storedActiveNoteId = localStorage.getItem(STORAGE_KEYS.activeNoteId);
        activeNoteId.value = storedActiveNoteId ? Number(storedActiveNoteId) : (meetingNotes.value[0]?.id || null);
        
        apiProvider.value = localStorage.getItem(STORAGE_KEYS.apiProvider) || 'gemini';
        apiKey.value = localStorage.getItem(STORAGE_KEYS.apiKey) || '';
        apiBaseUrl.value = localStorage.getItem(STORAGE_KEYS.apiBaseUrl) || '';

        // Load multilingual and styling preferences
        lang.value = localStorage.getItem(STORAGE_KEYS.lang) || 'zh';
        radiusStyle.value = localStorage.getItem(STORAGE_KEYS.radiusStyle) || 'rounded';
        accentColor.value = localStorage.getItem(STORAGE_KEYS.accentColor) || 'default';

        // Sync HTML data attribute with theme
        document.documentElement.setAttribute('data-theme', theme.value);
        
        // Guard subtask data safety for older imports
        todos.value.forEach(todo => {
          if (!todo.subtasks) todo.subtasks = [];
        });
        recycleBin.value.forEach(todo => {
          if (!todo.subtasks) todo.subtasks = [];
        });
      } catch (e) {
        console.error('Local storage reading failed:', e);
      }
    };

    // Save states to local storage
    const saveTodos = () => localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(todos.value));
    const saveBin = () => localStorage.setItem(STORAGE_KEYS.bin, JSON.stringify(recycleBin.value));
    const saveSlogan = () => localStorage.setItem(STORAGE_KEYS.slogan, slogan.value);
    const saveTheme = () => {
      localStorage.setItem(STORAGE_KEYS.theme, theme.value);
      document.documentElement.setAttribute('data-theme', theme.value);
    };
    const saveSound = () => localStorage.setItem(STORAGE_KEYS.sound, soundToggle.value.toString());
    
    // Save AI / Notes states
    const saveNotes = () => localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(meetingNotes.value));
    const saveActiveNoteId = () => {
      if (activeNoteId.value) localStorage.setItem(STORAGE_KEYS.activeNoteId, activeNoteId.value.toString());
      else localStorage.removeItem(STORAGE_KEYS.activeNoteId);
    };
    const saveApiProvider = () => localStorage.setItem(STORAGE_KEYS.apiProvider, apiProvider.value);
    const saveApiKey = () => localStorage.setItem(STORAGE_KEYS.apiKey, apiKey.value);
    const saveApiBaseUrl = () => localStorage.setItem(STORAGE_KEYS.apiBaseUrl, apiBaseUrl.value);

    // Save style and language preferences
    const saveLang = () => localStorage.setItem(STORAGE_KEYS.lang, lang.value);
    const saveRadiusStyle = () => localStorage.setItem(STORAGE_KEYS.radiusStyle, radiusStyle.value);
    const saveAccentColor = () => localStorage.setItem(STORAGE_KEYS.accentColor, accentColor.value);

    // Watchers for continuous storage synchronization
    watch(todos, saveTodos, { deep: true });
    watch(recycleBin, saveBin, { deep: true });
    watch(slogan, saveSlogan);
    watch(theme, saveTheme);
    watch(soundToggle, saveSound);
    
    // Notes watchers
    watch(meetingNotes, saveNotes, { deep: true });
    watch(activeNoteId, saveActiveNoteId);
    watch(apiProvider, saveApiProvider);
    watch(apiKey, saveApiKey);
    watch(apiBaseUrl, saveApiBaseUrl);

    // Language and Style watchers
    watch(lang, saveLang);
    watch(radiusStyle, () => {
      saveRadiusStyle();
      applyRadiusStyle();
    });
    watch(accentColor, () => {
      saveAccentColor();
      applyAccentColor();
    });

    // 6. COMPUTED STATS & FILTERS
    const leftTodos = computed(() => todos.value.filter(t => !t.completed));
    const leftTodosCount = computed(() => leftTodos.value.length);
    const completedTodos = computed(() => todos.value.filter(t => t.completed));
    const completedTodosCount = computed(() => completedTodos.value.length);
    const totalTodosCount = computed(() => todos.value.length);
    
    // Percentage rate calculation
    const progressRate = computed(() => {
      if (totalTodosCount.value === 0) return 0;
      return Math.round((completedTodosCount.value / totalTodosCount.value) * 100);
    });

    // Main filter logic integrating search options + active tags
    const filteredTodos = computed(() => {
      let result = [];
      
      // Intent/Tab filter
      if (intention.value === 'ongoing') {
        result = leftTodos.value;
      } else if (intention.value === 'completed') {
        result = completedTodos.value;
      } else if (intention.value === 'removed') {
        result = recycleBin.value;
      } else {
        result = todos.value;
      }

      // Tag filter
      if (selectedTagsFilter.value.length > 0 && intention.value !== 'removed') {
        result = result.filter(todo => 
          todo.tags && todo.tags.some(tag => selectedTagsFilter.value.includes(tag))
        );
      }

      return result;
    });

    const showEmptyTips = computed(() => {
      return filteredTodos.value.length === 0;
    });

    // Notes computing
    const activeNote = computed(() => {
      return meetingNotes.value.find(n => n.id === activeNoteId.value) || null;
    });

    // 7. 🌟 REAL-TIME TRANSLATION (i18n) ENGINE WRAPPER
    // Supports 100% reactive, offline-ready Chinese/English translation toggles.
    const translations = {
      zh: {
        tasks: "待办清单",
        notes: "会议纪要与 AI",
        addTodoPlaceholder: "输入待办事项，按下回车提交...",
        submit: "提交",
        addTag: "添加标签:",
        sloganTitle: "双击可编辑标语",
        emptyTips: "💡 请输入待办事项内容！",
        completed: "已完成",
        ongoing: "进行中",
        all: "全部",
        trash: "回收站",
        emptyTasksTitle: "添加你的第一个待办事项！",
        emptyOngoingTitle: "没有进行中的待办事项",
        emptyCompletedTitle: "没有已完成的待办事项",
        emptyTrashTitle: "回收站是空的",
        filterView: "分类视图",
        tagFilter: "标签筛选",
        clickToFilter: "点击标签过滤列表:",
        clear: "清除",
        progressRateTitle: "完成进度",
        rateText: "完成率",
        bulkActions: "快捷批量操作",
        markAll: "⚡ 全部标为已完成",
        clearCompleted: "🧹 清除已完成",
        clearAllTasks: "🗑️ 清空所有事项",
        clearTrash: "💥 彻底清空回收站",
        backupTitle: "备份与导入",
        exportBackup: "📤 导出 JSON 备份",
        importBackup: "📥 导入 TXT/JSON",
        settingsTitle: "Ros1 Todo 设置",
        chooseTheme: "选择个性主题",
        themeLight: "极简白",
        themeDark: "深空黑",
        themeCyberpunk: "赛博朋克",
        themeSage: "雅致绿",
        sysPreferences: "系统偏好设置",
        soundFeedback: "音效反馈",
        soundFeedbackDesc: "开启/关闭拖拽与完成任务时的和弦音",
        aboutTitle: "关于 Ros1 Todo",
        aboutDesc: "Ros1 Todo 是一款追求视觉美感与极度流畅交互的离线式 Todo 代办软件。结合音效反馈与 Canvas 烟花粒子引擎，为您带来前所未有的效率体验。",
        resetData: "⚠️ 重置所有系统数据",
        newNote: "➕ 新增会议纪要",
        emptyNotesHistory: "📭 暂无会议纪要历史",
        noteTitlePlaceholder: "输入会议纪要标题...",
        speechBtn: "语音录音输入",
        speechBtnRecording: "正在录音 (点击停止)...",
        uploadAudio: "上传录音文件",
        uploadAudioUploading: "录音文件识别中...",
        aiSummarize: "AI 智能会议总结",
        aiSummarizing: "AI 智能提炼总结中...",
        speechInterim: "🎙️ 实时转写中:",
        audioTranscribingAlert: "🔮 正在通过 AI 语音识别转写您上传的录音文件，请稍候（请勿关闭本页）...",
        editorPlaceholder: "请在此输入您的会议纪要，或点击上方「语音录音输入」进行实时录音转文字...",
        aiSummaryHeader: "🤖 AI 智能会议纪要提炼结果",
        aiSummaryImportBtn: "⚡ 一键导入待办行动项",
        aiSummaryLoading: "🔮 您的 AI 秘书正在分析段落、提炼决策和待办行动项，请稍候...",
        aiSummaryPlaceholder: "您的 AI 智能秘书已准备就绪。在上方输入会议细节，点击「AI 智能会议总结」即可生成要点及待办！",
        emptyNoteSelection: "请点击左侧 “新增会议纪要” 开始记录！",
        aiSecretatiryConfig: "AI 智能秘书配置",
        apiProviderLabel: "接口服务商 (API Provider)",
        apiKeyLabel: "接口密钥 (API Key)",
        apiBaseUrlLabel: "接口代理地址 (Base URL - 可选)",
        testAiBtn: "🔮 测试 AI 接口连接",
        testAiBtnTesting: "正在联络 AI 秘书...",
        langLabel: "界面语言 (System Language)",
        radiusLabel: "主体样式 - 卡片边角 (Card Corners)",
        radiusRounded: "圆润现代",
        radiusSharp: "直角科技",
        radiusClassic: "经典平直",
        accentLabel: "主体配色 - 强调色 (Theme Accent)",
        accentDefault: "默认主题色",
        accentCyan: "太空青",
        accentGreen: "极光绿",
        accentPink: "樱花粉",
        accentPurple: "罗兰紫",
        accentOrange: "落日橙"
      },
      en: {
        tasks: "Tasks List",
        notes: "Meeting Notes & AI",
        addTodoPlaceholder: "Enter task title, press Enter to submit...",
        submit: "Add",
        addTag: "Add Tag:",
        sloganTitle: "Double click to edit slogan",
        emptyTips: "💡 Please enter task content!",
        completed: "Completed",
        ongoing: "Ongoing",
        all: "All",
        trash: "Trash",
        emptyTasksTitle: "Add your first todo task!",
        emptyOngoingTitle: "No ongoing tasks",
        emptyCompletedTitle: "No completed tasks",
        emptyTrashTitle: "Recycle bin is empty",
        filterView: "Categories",
        tagFilter: "Filter by Tag",
        clickToFilter: "Click tags to filter:",
        clear: "Clear",
        progressRateTitle: "Completion Progress",
        rateText: "Progress Rate",
        bulkActions: "Bulk Actions",
        markAll: "⚡ Mark All Completed",
        clearCompleted: "🧹 Clear Completed",
        clearAllTasks: "🗑️ Clear All Tasks",
        clearTrash: "💥 Empty Recycle Bin",
        backupTitle: "Backup & Portability",
        exportBackup: "📤 Export JSON Backup",
        importBackup: "📥 Import TXT/JSON",
        settingsTitle: "Ros1 Todo Settings",
        chooseTheme: "Choose Theme",
        themeLight: "Minimalist Light",
        themeDark: "Deep Space Dark",
        themeCyberpunk: "Cyberpunk Tech",
        themeSage: "Sage Forest",
        sysPreferences: "Preferences",
        soundFeedback: "Audio Feedback",
        soundFeedbackDesc: "Toggle synthesized chord chimes on/off",
        aboutTitle: "About Ros1 Todo",
        aboutDesc: "Ros1 Todo is a visually stunning, offline-first efficiency app combining synthesized chimes and canvas particles for a premium productivity experience.",
        resetData: "⚠️ Reset All System Data",
        newNote: "➕ New Meeting Note",
        emptyNotesHistory: "📭 No meeting notes history",
        noteTitlePlaceholder: "Enter meeting title...",
        speechBtn: "Voice Dictation",
        speechBtnRecording: "Recording (Click to Stop)...",
        uploadAudio: "Upload Audio File",
        uploadAudioUploading: "Transcribing Audio...",
        aiSummarize: "AI Smart Summary",
        aiSummarizing: "AI Secretary Summarizing...",
        speechInterim: "🎙️ Real-time Dictation:",
        audioTranscribingAlert: "🔮 AI is transcribing your local audio file. Please hold on (do not close this page)...",
        editorPlaceholder: "Type notes here, or click 'Voice Dictation' above to transcribe your voice in real-time...",
        aiSummaryHeader: "🤖 AI Smart Summary Results",
        aiSummaryImportBtn: "⚡ Extract Action Items",
        aiSummaryLoading: "🔮 Your AI secretary is extracting topics, decisions, and action items. Please wait...",
        aiSummaryPlaceholder: "Your AI secretary is ready. Type note details above and click 'AI Smart Summary' to generate action items!",
        emptyNoteSelection: "Please click 'New Meeting Note' on the left to start!",
        aiSecretatiryConfig: "AI Secretary Configurations",
        apiProviderLabel: "API Provider",
        apiKeyLabel: "API Key",
        apiBaseUrlLabel: "Custom Base URL (Optional)",
        testAiBtn: "🔮 Test AI Connection",
        testAiBtnTesting: "Connecting to AI...",
        langLabel: "Interface Language (System Language)",
        radiusLabel: "Body Style - Card Corners",
        radiusRounded: "Rounded Modern",
        radiusSharp: "Cyber Sharp",
        radiusClassic: "Classic Flat",
        accentLabel: "Theme Accent (Body Color)",
        accentDefault: "Theme Default",
        accentCyan: "Space Cyan",
        accentGreen: "Aurora Green",
        accentPink: "Sakura Pink",
        accentPurple: "Royal Purple",
        accentOrange: "Sunset Orange"
      }
    };

    const t = (key) => {
      return translations[lang.value]?.[key] || translations['zh']?.[key] || key;
    };

    // 8. 🌟 STYLING PREFERENCE IMPLEMENTATION ENGINES
    const applyRadiusStyle = () => {
      const style = radiusStyle.value;
      const root = document.documentElement;
      if (style === 'sharp') {
        root.style.setProperty('--radius-lg', '0px');
        root.style.setProperty('--radius-md', '0px');
        root.style.setProperty('--radius-sm', '0px');
      } else if (style === 'classic') {
        root.style.setProperty('--radius-lg', '8px');
        root.style.setProperty('--radius-md', '4px');
        root.style.setProperty('--radius-sm', '2px');
      } else {
        // default rounded
        root.style.setProperty('--radius-lg', '20px');
        root.style.setProperty('--radius-md', '14px');
        root.style.setProperty('--radius-sm', '8px');
      }
    };

    const applyAccentColor = () => {
      const color = accentColor.value;
      const root = document.documentElement;
      if (color === 'default') {
        root.style.removeProperty('--accent');
        root.style.removeProperty('--accent-hover');
        root.style.removeProperty('--accent-rgb');
        root.style.removeProperty('--glow-color');
      } else {
        let hex = '#5d6b59';
        let hover = '#485444';
        let rgb = '93, 107, 89';
        let glow = 'rgba(93, 107, 89, 0.25)';
        
        if (color === 'cyan') {
          hex = '#00f2fe';
          hover = '#4facfe';
          rgb = '0, 242, 254';
          glow = 'rgba(0, 242, 254, 0.35)';
        } else if (color === 'green') {
          hex = '#10b981';
          hover = '#059669';
          rgb = '16, 185, 129';
          glow = 'rgba(16, 185, 129, 0.3)';
        } else if (color === 'pink') {
          hex = '#ff007f';
          hover = '#e0006c';
          rgb = '255, 0, 127';
          glow = 'rgba(255, 0, 127, 0.3)';
        } else if (color === 'purple') {
          hex = '#bc00dd';
          hover = '#a300c0';
          rgb = '188, 0, 221';
          glow = 'rgba(188, 0, 221, 0.35)';
        } else if (color === 'orange') {
          hex = '#f59e0b';
          hover = '#d97706';
          rgb = '245, 158, 11';
          glow = 'rgba(245, 158, 11, 0.3)';
        }
        
        root.style.setProperty('--accent', hex);
        root.style.setProperty('--accent-hover', hover);
        root.style.setProperty('--accent-rgb', rgb);
        root.style.setProperty('--glow-color', glow);
      }
    };

    // 9. 🌟 ASYNCHRONOUS AI CONNECTION TESTER
    const testAiConnection = async () => {
      if (!apiKey.value || apiKey.value.trim() === '') {
        alert(t('apiKeyLabel') + ' 为空，请输入后再进行测试！', '未输入密钥');
        return;
      }

      isTestingConnection.value = true;
      SoundEffects.playClick();

      try {
        let textResult = '';

        if (apiProvider.value === 'gemini') {
          const endpoint = (apiBaseUrl.value && apiBaseUrl.value.trim() !== '') 
            ? apiBaseUrl.value.trim() 
            : 'https://generativelanguage.googleapis.com';
            
          const url = `${endpoint}/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.value}`;

          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: 'Please reply exactly with "OK" (no other text).' }]
              }]
            })
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'Gemini API Error ' + response.status);
          }

          const data = await response.json();
          textResult = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } 
        
        else {
          const endpoint = (apiBaseUrl.value && apiBaseUrl.value.trim() !== '') 
            ? apiBaseUrl.value.trim() 
            : 'https://api.openai.com/v1';
            
          const url = `${endpoint}/chat/completions`;
          const modelName = apiProvider.value === 'openai' ? 'gpt-4o-mini' : 'deepseek-chat';

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey.value}`
            },
            body: JSON.stringify({
              model: modelName,
              messages: [{ role: 'user', content: 'Please reply exactly with "OK"' }],
              max_tokens: 5,
              temperature: 0.1
            })
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'API Error ' + response.status);
          }

          const data = await response.json();
          textResult = data.choices?.[0]?.message?.content || '';
        }

        if (textResult && textResult.trim().toUpperCase().includes('OK')) {
          SoundEffects.playSuccess();
          alert('测试成功！AI 秘书连接畅通，已成功握手联络。AI回复：' + textResult.trim(), '测试连接成功');
        } else {
          throw new Error('握手失败。AI 接口联络成功，但响应格式异常：' + textResult);
        }

      } catch (err) {
        console.error('AI Connection Test failed:', err);
        alert('测试连接失败！错误详情：' + err.message, '测试连接失败');
      } finally {
        isTestingConnection.value = false;
      }
    };

    // 🌟 Time Updater Method
    const updateTime = () => {
      const d = new Date();
      
      // 1. Time string (HH:MM:SS)
      currentTime.value = d.toLocaleTimeString('zh-CN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      // 2. Date string (YYYY年MM月DD日 星期X)
      const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
      currentDate.value = d.toLocaleDateString(lang.value === 'zh' ? 'zh-CN' : 'en-US', options);
      
      // 3. Diurnal Greeting
      const hr = d.getHours();
      if (lang.value === 'zh') {
        if (hr < 6) timeGreeting.value = '凌晨好 🌌';
        else if (hr < 9) timeGreeting.value = '早上好 🌅';
        else if (hr < 12) timeGreeting.value = '上午好 ☕';
        else if (hr < 14) timeGreeting.value = '中午好 ☀️';
        else if (hr < 17) timeGreeting.value = '下午好 🍵';
        else if (hr < 19) timeGreeting.value = '傍晚好 🌇';
        else timeGreeting.value = '晚上好 🌃';
      } else {
        if (hr < 6) timeGreeting.value = 'Good early morning 🌌';
        else if (hr < 12) timeGreeting.value = 'Good morning 🌅';
        else if (hr < 17) timeGreeting.value = 'Good afternoon ☕';
        else if (hr < 21) timeGreeting.value = 'Good evening 🌇';
        else timeGreeting.value = 'Good night 🌃';
      }
    };

    // 🌟 Slogan Editing Methods
    const startEditSlogan = () => {
      SoundEffects.playClick();
      isEditingSlogan.value = true;
      originalSlogan.value = slogan.value;
      nextTick(() => {
        if (sloganInputRef.value) sloganInputRef.value.focus();
      });
    };

    const finishEditSlogan = () => {
      if (slogan.value.trim() === '') {
        slogan.value = originalSlogan.value;
      } else {
        slogan.value = slogan.value.trim();
      }
      isEditingSlogan.value = false;
      SoundEffects.playClick();
    };

    const cancelEditSlogan = () => {
      slogan.value = originalSlogan.value;
      isEditingSlogan.value = false;
      SoundEffects.playClick();
    };

    // 10. TIME FUNCTION UPDATER ON INTERVAL
    const startClock = () => {
      updateTime();
      setInterval(updateTime, 1000);
    };

    // Todo management
    const addTodo = () => {
      if (newTodoTitle.value.trim() === '') {
        checkEmpty.value = true;
        SoundEffects.playClick();
        setTimeout(() => checkEmpty.value = false, 500); // Reset shaking alert
        return;
      }
      
      const uid = Date.now();
      todos.value.unshift({
        id: uid,
        title: newTodoTitle.value.trim(),
        completed: false,
        removed: false,
        tags: [...newTodoTags.value],
        subtasks: []
      });

      // Clear input fields
      newTodoTitle.value = '';
      newTodoTags.value = [];
      checkEmpty.value = false;
      SoundEffects.playClick();
    };

    // Inline tags editing on add
    const toggleAddTag = (tag) => {
      SoundEffects.playClick();
      const idx = newTodoTags.value.indexOf(tag);
      if (idx > -1) {
        newTodoTags.value.splice(idx, 1);
      } else {
        newTodoTags.value.push(tag);
      }
    };

    // Filtering by tag click
    const toggleFilterTag = (tag) => {
      SoundEffects.playClick();
      const idx = selectedTagsFilter.value.indexOf(tag);
      if (idx > -1) {
        selectedTagsFilter.value.splice(idx, 1);
      } else {
        selectedTagsFilter.value.push(tag);
      }
    };

    // Completion toggle
    const toggleTodoComplete = (todo, event) => {
      todo.completed = !todo.completed;
      if (todo.completed) {
        SoundEffects.playSuccess();
        // Spawn sparks on click target coordinates
        if (event && event.clientX) {
          ParticleSystem.spawn(event.clientX, event.clientY);
        } else {
          ParticleSystem.spawn(window.innerWidth / 2, window.innerHeight / 2);
        }
      } else {
        SoundEffects.playClick();
      }
    };

    // Inline todo title editing
    const startEditTodo = (todo) => {
      SoundEffects.playClick();
      editedTodo.value = {
        id: todo.id,
        title: todo.title
      };
      nextTick(() => {
        const inp = document.getElementById(`edit-input-${todo.id}`);
        if (inp) inp.focus();
      });
    };

    const finishEditTodo = (todo) => {
      if (todo.title.trim() === '') {
        removeTodo(todo);
      } else {
        todo.title = todo.title.trim();
      }
      editedTodo.value = null;
      SoundEffects.playClick();
    };

    const cancelEditTodo = (todo) => {
      if (editedTodo.value) {
        todo.title = editedTodo.value.title;
      }
      editedTodo.value = null;
      SoundEffects.playClick();
    };

    // Single item removal (Triggers Recycle Bin transfer)
    const removeTodo = (todo) => {
      SoundEffects.playClick();
      const index = todos.value.findIndex(t => t.id === todo.id);
      if (index > -1) {
        const removedItem = todos.value.splice(index, 1)[0];
        removedItem.removed = true;
        recycleBin.value.unshift(removedItem);
      }
    };

    // Single item restoration
    const restoreTodo = (todo) => {
      SoundEffects.playClick();
      const index = recycleBin.value.findIndex(t => t.id === todo.id);
      if (index > -1) {
        const restoredItem = recycleBin.value.splice(index, 1)[0];
        restoredItem.removed = false;
        todos.value.unshift(restoredItem);
      }
    };

    // Single item hard deletion from Recycle Bin
    const hardDeleteTodo = (todo) => {
      confirm('该操作将永久删除此待办，无法恢复！确认删除？').then((confirmed) => {
        if (confirmed) {
          const index = recycleBin.value.findIndex(t => t.id === todo.id);
          if (index > -1) {
            recycleBin.value.splice(index, 1);
            SoundEffects.playClick();
          }
        }
      });
    };

    // SUBTASKS FUNCTIONAL METHODS
    const addSubtask = (todo) => {
      const title = newSubtaskTitles.value[todo.id] || '';
      if (title.trim() === '') return;

      if (!todo.subtasks) todo.subtasks = [];
      
      todo.subtasks.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        title: title.trim(),
        completed: false
      });

      newSubtaskTitles.value[todo.id] = '';
      SoundEffects.playClick();
    };

    const toggleSubtask = (todo, subtask, event) => {
      subtask.completed = !subtask.completed;
      if (subtask.completed) {
        SoundEffects.playSuccess();
        if (event && event.clientX) {
          ParticleSystem.spawn(event.clientX, event.clientY, 12);
        } else {
          ParticleSystem.spawn(window.innerWidth / 2, window.innerHeight / 2, 12);
        }
      } else {
        SoundEffects.playClick();
      }
    };

    const removeSubtask = (todo, subtask) => {
      const idx = todo.subtasks.indexOf(subtask);
      if (idx > -1) {
        todo.subtasks.splice(idx, 1);
        SoundEffects.playClick();
      }
    };

    const getSubtaskStats = (todo) => {
      const total = todo.subtasks ? todo.subtasks.length : 0;
      const completed = todo.subtasks ? todo.subtasks.filter(s => s.completed).length : 0;
      const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
      return { completed, total, percentage };
    };

    // MEETING NOTES (CRUD) METHODS
    const createNewNote = () => {
      SoundEffects.playClick();
      const newId = Date.now();
      const dateString = new Date().toLocaleDateString('zh-CN', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      meetingNotes.value.unshift({
        id: newId,
        title: '新会议纪要 ' + new Date().toLocaleDateString().slice(5),
        date: dateString,
        content: '',
        summary: ''
      });
      activeNoteId.value = newId;
    };

    const selectNote = (note) => {
      SoundEffects.playClick();
      activeNoteId.value = note.id;
    };

    const deleteNote = (note) => {
      confirm('确认删除这篇会议纪要吗？（永久删除不可恢复）').then((confirmed) => {
        if (confirmed) {
          const idx = meetingNotes.value.findIndex(n => n.id === note.id);
          if (idx > -1) {
            meetingNotes.value.splice(idx, 1);
            SoundEffects.playClick();
            if (activeNoteId.value === note.id) {
              activeNoteId.value = meetingNotes.value[0]?.id || null;
            }
          }
        }
      });
    };

    // SPEECH TRANSCRIPTION ENGINE WRAPPER
    let recognition = null;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'zh-CN';
    }

    const toggleVoiceRecording = (note) => {
      if (!recognition) {
        alert('您的浏览器不支持 Web Speech API 语音录制，推荐使用最新版 Chrome、Edge 或 Safari。', '不支持录音');
        return;
      }

      if (isRecording.value) {
        recognition.stop();
        isRecording.value = false;
        SoundEffects.playClick();
      } else {
        SoundEffects.playClick();
        isRecording.value = true;
        recordingInterimText.value = '';

        recognition.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          recordingInterimText.value = interimTranscript;
          if (finalTranscript) {
            note.content = (note.content || '') + finalTranscript;
          }
        };

        recognition.onerror = (err) => {
          console.error('Speech Recognition Error:', err);
          isRecording.value = false;
        };

        recognition.onend = () => {
          isRecording.value = false;
        };

        recognition.start();
      }
    };

    // AUDIO FILE TRANSCRIPTION ENGINE
    const triggerAudioUpload = () => {
      SoundEffects.playClick();
      if (audioUploadFileInputRef.value) {
        audioUploadFileInputRef.value.click();
      }
    };

    const handleAudioUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      // Validate File Size (Maximum 20MB)
      if (file.size > 20 * 1024 * 1024) {
        alert('音频文件体积过大，请选择 20MB 以下的录音文件进行转文字！', '文件超出限制');
        event.target.value = '';
        return;
      }

      if (!apiKey.value || apiKey.value.trim() === '') {
        alert('上传音频转写需要调用 AI 服务，请先点击右上角 [设置] 填入接口 API Key！', '未配置 API Key');
        settingsActive.value = true;
        event.target.value = '';
        return;
      }

      if (!activeNote.value) {
        alert('当前没有选中的会议纪要，请先点击左侧“新增会议纪要”或选择一篇记录后再上传音频！');
        event.target.value = '';
        return;
      }

      isAudioTranscribing.value = true;
      SoundEffects.playClick();

      try {
        let textResult = '';

        if (apiProvider.value === 'gemini') {
          const base64Audio = await fileToBase64(file);
          const mimeType = file.type || 'audio/mp3';

          const endpoint = (apiBaseUrl.value && apiBaseUrl.value.trim() !== '') 
            ? apiBaseUrl.value.trim() 
            : 'https://generativelanguage.googleapis.com';
            
          const url = `${endpoint}/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.value}`;

          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  {
                    inlineData: {
                      mimeType: mimeType,
                      data: base64Audio
                    }
                  },
                  {
                    text: '请仔细听这段会议录音文件，并将其完整、一字不漏地转写为中文文本（如果音频中包含英文，请直接保留英文）。请直接输出全部文字内容，不要进行总结或添加修饰，做最纯粹的语音转文字记录。'
                  }
                ]
              }]
            })
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'Gemini STT Error ' + response.status);
          }

          const data = await response.json();
          textResult = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } 
        
        else {
          const endpoint = (apiBaseUrl.value && apiBaseUrl.value.trim() !== '') 
            ? apiBaseUrl.value.trim() 
            : 'https://api.openai.com/v1';
            
          const url = `${endpoint}/audio/transcriptions`;

          // Prepare Multipart payload
          const formData = new FormData();
          formData.append('file', file);
          formData.append('model', 'whisper-1');
          formData.append('language', 'zh');

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey.value}`
            },
            body: formData
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'Whisper Error ' + response.status);
          }

          const data = await response.json();
          textResult = data.text || '';
        }

        if (textResult && textResult.trim() !== '') {
          activeNote.value.content = (activeNote.value.content || '') + '\n' + textResult.trim();
          SoundEffects.playSuccess();
          alert('录音文件识别转文字成功，已自动追加到当前纪要编辑器中！', '识别成功');
        } else {
          throw new Error('AI 返回的识别结果为空，请确保录音文件中包含清晰的语音。');
        }

      } catch (err) {
        console.error('Audio file transcription failed:', err);
        alert('上传录音文件转文字失败，错误详情：' + err.message, '识别失败');
      } finally {
        isAudioTranscribing.value = false;
        event.target.value = '';
      }
    };

    // AI POWERED SUMMARIZATION ENGINE
    const generateAiSummary = async (note) => {
      if (!note.content || note.content.trim() === '') {
        alert('会议纪要内容为空，请输入或录入会议内容后再发起AI总结！');
        return;
      }
      
      if (!apiKey.value || apiKey.value.trim() === '') {
        alert('未配置 AI API Key，请打开右上角 [设置] 进行 AI API 接口配置！', '未配置 API Key');
        settingsActive.value = true;
        return;
      }

      isAiSummarizing.value = true;
      SoundEffects.playClick();

      const systemPrompt = `你是一个专业的高效会议秘书。请将以下会议纪要内容整理提炼成一份结构化、高可读性的中文纪要总结。
必须包含三个部分：
1. 【会议核心要点】（以结构化列表呈现议题和结论）
2. 【核心决策】（提炼本会做出的重要决断）
3. 【待办行动指南】（必须以 "- [ ] 任务标题 @责任人" 的格式详细列出待办列表，以便后续系统提取行动项）。
请使用清晰、高雅的 Markdown 格式输出。`;

      try {
        let textResult = '';

        if (apiProvider.value === 'gemini') {
          const endpoint = (apiBaseUrl.value && apiBaseUrl.value.trim() !== '') 
            ? apiBaseUrl.value.trim() 
            : 'https://generativelanguage.googleapis.com';
            
          const url = `${endpoint}/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.value}`;
          
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: systemPrompt + '\n\n会议纪要原始文本如下：\n' + note.content }]
              }]
            })
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'HTTP Error ' + response.status);
          }

          const data = await response.json();
          textResult = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } 
        
        else {
          const endpoint = (apiBaseUrl.value && apiBaseUrl.value.trim() !== '') 
            ? apiBaseUrl.value.trim() 
            : 'https://api.openai.com/v1';
            
          const url = `${endpoint}/chat/completions`;
          const modelName = apiProvider.value === 'openai' ? 'gpt-4o-mini' : 'deepseek-chat';

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey.value}`
            },
            body: JSON.stringify({
              model: modelName,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: note.content }
              ],
              temperature: 0.3
            })
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'HTTP Error ' + response.status);
          }

          const data = await response.json();
          textResult = data.choices?.[0]?.message?.content || '';
        }

        if (textResult) {
          note.summary = textResult;
          SoundEffects.playSuccess();
        } else {
          throw new Error('AI 返回内容为空');
        }

      } catch (err) {
        console.error('AI Summary generation failed:', err);
        alert('AI 生成总结失败，错误信息：' + err.message, '生成失败');
      } finally {
        isAiSummarizing.value = false;
      }
    };

    // EXTRACT ACTION ITEMS AND INJECT TO TODO LIST
    const convertSummaryToTodos = (note) => {
      if (!note.summary) return;

      const lines = note.summary.split('\n');
      let extractedCount = 0;
      
      lines.forEach(line => {
        const match = line.match(/^\s*[-\*]\s*\[\s*\]\s*(.*)$/);
        if (match && match[1]) {
          let taskTitle = match[1].trim();
          if (taskTitle) {
            todos.value.unshift({
              id: Date.now() + Math.random(),
              title: taskTitle,
              completed: false,
              removed: false,
              tags: ['会议'],
              subtasks: []
            });
            extractedCount++;
          }
        }
      });

      if (extractedCount > 0) {
        SoundEffects.playSuccess();
        ParticleSystem.spawn(window.innerWidth / 2, window.innerHeight / 3, 40);
        alert(lang.value === 'zh' ? `一键成功提取并导入 ${extractedCount} 个待办事项！已为您打上「会议」分类标签。` : `Successfully extracted and imported ${extractedCount} action items tagged under 'Meeting'!`, 'Extraction Successful');
        activeTab.value = 'todo';
        intention.value = 'all';
      } else {
        alert(lang.value === 'zh' ? '未能从 AI 总结中找到符合格式的 “- [ ] 待办项”。您可以尝试双击手动添加！' : 'Failed to extract "- [ ]" checklists from AI summary.', 'No Tasks Found');
      }
    };

    // BATCH AND FILTER UTILITIES
    const markAllCompleted = () => {
      if (leftTodosCount.value === 0) return;
      confirm('确认一键标为完成全部未完成的待办？').then((confirmed) => {
        if (confirmed) {
          todos.value.forEach(t => {
            if (!t.completed) {
              t.completed = true;
            }
          });
          SoundEffects.playSuccess();
          ParticleSystem.spawn(window.innerWidth / 2, window.innerHeight / 3, 50);
        }
      });
    };

    const clearCompleted = () => {
      if (completedTodosCount.value === 0) return;
      confirm('确认清除全部已完成的待办？ (将移至回收站)').then((confirmed) => {
        if (confirmed) {
          const completed = todos.value.filter(t => t.completed);
          completed.forEach(t => {
            t.removed = true;
            recycleBin.value.unshift(t);
          });
          todos.value = todos.value.filter(t => !t.completed);
          SoundEffects.playClick();
        }
      });
    };

    const clearAll = () => {
      if (todos.value.length === 0) return;
      confirm('确认一键清空当前全部待办？ (将移至回收站)').then((confirmed) => {
        if (confirmed) {
          todos.value.forEach(t => {
            t.removed = true;
            recycleBin.value.unshift(t);
          });
          todos.value = [];
          SoundEffects.playClick();
        }
      });
    };

    const clearRecycleBin = () => {
      if (recycleBin.value.length === 0) return;
      confirm('确认彻底清空回收站？ (永久清除无法恢复)').then((confirmed) => {
        if (confirmed) {
          recycleBin.value = [];
          SoundEffects.playClick();
        }
      });
    };

    // DATA BACKUP & PORTABILITY
    const exportData = () => {
      SoundEffects.playClick();
      const payload = {
        todos: todos.value,
        bin: recycleBin.value,
        notes: meetingNotes.value,
        slogan: slogan.value,
        exportDate: new Date().toISOString()
      };
      
      const jsonString = JSON.stringify(payload, null, 2);
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const filename = `ros1-todo-backup-${date}.json`;
      
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 0);
    };

    const triggerImportFile = () => {
      SoundEffects.playClick();
      if (fileImportRef.value) {
        fileImportRef.value.click();
      }
    };

    const handleImportFile = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          if (data && (Array.isArray(data.todos) || Array.isArray(data))) {
            confirm('导入数据将追加到您当前的待办及纪要列表，是否继续？').then((confirmed) => {
              if (confirmed) {
                const importedTodos = Array.isArray(data.todos) ? data.todos : data;
                const importedBin = Array.isArray(data.bin) ? data.bin : [];
                const importedNotes = Array.isArray(data.notes) ? data.notes : [];
                
                importedTodos.forEach(item => {
                  if (item.title) {
                    todos.value.push({
                      id: item.id || Date.now() + Math.random(),
                      title: item.title,
                      completed: !!item.completed,
                      removed: false,
                      tags: Array.isArray(item.tags) ? item.tags : [],
                      subtasks: Array.isArray(item.subtasks) ? item.subtasks : []
                    });
                  }
                });

                importedBin.forEach(item => {
                  if (item.title) {
                    recycleBin.value.push({
                      id: item.id || Date.now() + Math.random(),
                      title: item.title,
                      completed: !!item.completed,
                      removed: true,
                      tags: Array.isArray(item.tags) ? item.tags : [],
                      subtasks: Array.isArray(item.subtasks) ? item.subtasks : []
                    });
                  }
                });

                importedNotes.forEach(item => {
                  if (item.title) {
                    meetingNotes.value.push({
                      id: item.id || Date.now() + Math.random(),
                      title: item.title,
                      date: item.date || new Date().toLocaleDateString(),
                      content: item.content || '',
                      summary: item.summary || ''
                    });
                  }
                });

                if (data.slogan && typeof data.slogan === 'string') {
                  slogan.value = data.slogan;
                }

                alert('数据导入合并成功！');
                SoundEffects.playSuccess();
              }
            });
          } else {
            alert('文件解析成功，但格式不匹配。请导入有效的 Ros1 Todo 备份文件。');
          }
        } catch (err) {
          alert('解析导入文件失败，可能不是标准的 JSON 数据：' + err.message);
        }
        
        event.target.value = '';
      };
      
      reader.readAsText(file);
    };

    // DRAG AND DROP REORDERING (MOUSE & MOBILE TOUCH)
    const handleDragStart = (index, event) => {
      if (editedTodo.value !== null) {
        event.preventDefault();
        return;
      }
      dragIndex.value = index;
      event.dataTransfer.effectAllowed = 'move';
      
      setTimeout(() => {
        const el = event.target;
        el.classList.add('dragging');
      }, 0);
    };

    const handleDragEnd = (event) => {
      const el = event.target;
      el.classList.remove('dragging');
      dragIndex.value = null;
      
      const items = document.querySelectorAll('.todo-item');
      items.forEach(it => it.classList.remove('drag-over'));
      
      SoundEffects.playClick();
    };

    const handleDragOver = (index, event) => {
      event.preventDefault();
    };

    const handleDragEnter = (index, event) => {
      event.preventDefault();
      if (dragIndex.value === null || dragIndex.value === index) return;
      
      const activeTodos = [...filteredTodos.value];
      const sourceIndexInMain = todos.value.indexOf(activeTodos[dragIndex.value]);
      const targetIndexInMain = todos.value.indexOf(activeTodos[index]);
      
      if (sourceIndexInMain > -1 && targetIndexInMain > -1) {
        const temp = todos.value[sourceIndexInMain];
        todos.value.splice(sourceIndexInMain, 1);
        todos.value.splice(targetIndexInMain, 0, temp);
        dragIndex.value = index;
      }
    };

    const handleTouchStart = (index, event) => {
      if (editedTodo.value !== null) return;
      touchStartItemIndex.value = index;
    };

    const handleTouchMove = (event) => {
      if (touchStartItemIndex.value === null) return;
      
      const touch = event.touches[0];
      const elem = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (!elem) return;
      
      const itemCard = elem.closest('.todo-item');
      if (!itemCard) return;
      
      const targetId = Number(itemCard.getAttribute('data-id'));
      if (isNaN(targetId)) return;
      
      const activeList = [...filteredTodos.value];
      const sourceItem = activeList[touchStartItemIndex.value];
      if (!sourceItem || sourceItem.id === targetId) return;
      
      const targetIndex = activeList.findIndex(t => t.id === targetId);
      if (targetIndex === -1) return;
      
      const sourceIndexInMain = todos.value.findIndex(t => t.id === sourceItem.id);
      const targetIndexInMain = todos.value.findIndex(t => t.id === targetId);
      
      if (sourceIndexInMain > -1 && targetIndexInMain > -1) {
        const temp = todos.value[sourceIndexInMain];
        todos.value.splice(sourceIndexInMain, 1);
        todos.value.splice(targetIndexInMain, 0, temp);
        touchStartItemIndex.value = targetIndex;
      }
    };

    const handleTouchEnd = () => {
      touchStartItemIndex.value = null;
      SoundEffects.playClick();
    };

    // GENERAL UTILITIES
    const toggleSettings = () => {
      SoundEffects.playClick();
      settingsActive.value = !settingsActive.value;
    };

    const changeTheme = (newTheme) => {
      theme.value = newTheme;
      SoundEffects.playClick();
    };

    const toggleSound = () => {
      SoundEffects.playClick();
      soundToggle.value = !soundToggle.value;
    };

    const resetSystemData = () => {
      confirm(lang.value === 'zh' ? '这会永久抹去您所有的代办及纪要数据，恢复默认设置。确定要重置吗？' : 'This will permanently delete all your tasks and notes, restoring default settings. Are you sure?').then((confirmed) => {
        if (confirmed) {
          localStorage.clear();
          todos.value = [];
          recycleBin.value = [];
          meetingNotes.value = [];
          activeNoteId.value = null;
          slogan.value = '今日事今日毕，勿将今事待明日! ☕';
          theme.value = 'light';
          soundToggle.value = true;
          lang.value = 'zh';
          radiusStyle.value = 'rounded';
          accentColor.value = 'default';
          settingsActive.value = false;
          SoundEffects.playSuccess();
          alert('重置成功 / Reset successful!');
        }
      });
    };

    // Lifecycle mount initialization
    onMounted(() => {
      fetchStorage();
      ParticleSystem.init('particle-canvas');
      startClock();
      
      // Apply style preference on boot
      applyRadiusStyle();
      applyAccentColor();
    });

    return {
      todos,
      recycleBin,
      slogan,
      theme,
      soundToggle,
      newTodoTitle,
      newTodoTags,
      availableTags,
      selectedTagsFilter,
      intention,
      checkEmpty,
      settingsActive,
      isEditingSlogan,
      originalSlogan,
      sloganInputRef,
      editTodoInputRef,
      fileImportRef,
      editedTodo,
      leftTodosCount,
      completedTodosCount,
      totalTodosCount,
      progressRate,
      filteredTodos,
      showEmptyTips,
      
      // Clock returns
      currentTime,
      currentDate,
      timeGreeting,

      // Subtasks returns
      newSubtaskTitles,
      addSubtask,
      toggleSubtask,
      removeSubtask,
      getSubtaskStats,
      
      // MEETING NOTES & AI RETURNS
      activeTab,
      meetingNotes,
      activeNoteId,
      activeNote,
      apiProvider,
      apiKey,
      apiBaseUrl,
      isRecording,
      recordingInterimText,
      isAiSummarizing,
      
      // AUDIO FILE UPLOAD STT RETURNS
      isAudioTranscribing,
      audioUploadFileInputRef,
      triggerAudioUpload,
      handleAudioUpload,

      // 🌟 MULTILINGUAL & PREFERENCE STYLE RETURNS
      lang,
      radiusStyle,
      accentColor,
      isTestingConnection,
      t, // translation helper
      testAiConnection,
      
      // Note CRUD methods
      createNewNote,
      selectNote,
      deleteNote,
      toggleVoiceRecording,
      generateAiSummary,
      convertSummaryToTodos,
      
      // Methods
      startEditSlogan,
      finishEditSlogan,
      cancelEditSlogan,
      addTodo,
      toggleAddTag,
      toggleFilterTag,
      toggleTodoComplete,
      startEditTodo,
      finishEditTodo,
      cancelEditTodo,
      removeTodo,
      restoreTodo,
      hardDeleteTodo,
      markAllCompleted,
      clearCompleted,
      clearAll,
      clearRecycleBin,
      exportData,
      triggerImportFile,
      handleImportFile,
      
      // Drag/Drop Desktop
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDragEnter,
      
      // Drag/Drop Mobile Touch
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      
      // Settings UI
      toggleSettings,
      changeTheme,
      toggleSound,
      resetSystemData
    };
  }
});

// Directives for auto autofocusing
app.directive('focus', {
  mounted(el) {
    el.focus();
  }
});

app.mount('#todo-app');
