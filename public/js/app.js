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
  },

  playLevelUp() {
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
      
      gain.gain.setValueAtTime(0.05, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    
    // Ascending majestic major chord run
    playNote(261.63, now, 0.18);        // C4
    playNote(329.63, now + 0.06, 0.18); // E4
    playNote(392.00, now + 0.12, 0.18); // G4
    playNote(523.25, now + 0.18, 0.18); // C5
    playNote(659.25, now + 0.24, 0.18); // E5
    playNote(783.99, now + 0.30, 0.18); // G5
    playNote(1046.50, now + 0.36, 0.35); // C6
  }
};

// 1.2 🌟 ADVANCED PROCEDURAL AMBIENT SOUND GENERATOR (Web Audio API)
const AmbientSoundEngine = {
  stop() {}
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

  spawnLevelUp(x, y) {
    const colors = ['#ffd700', '#ffdf00', '#00f2fe', '#00ffcc', '#ffffff', '#fae06d'];
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 4;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3, // Stronger upward bias
        radius: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.015 + 0.01, // Slower decay for epic feeling
        gravity: 0.18
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
  // 🌟 NEW MULTILINGUAL AND LAYOUT PREFERENCE STORAGE KEYS
  lang: 'ros1-todo-lang',
  radiusStyle: 'ros1-todo-radius-style',
  accentColor: 'ros1-todo-accent-color',
  appMode: 'ros1-todo-app-mode',
  focusDuration: 'ros1-todo-focus-dur',
  shortBreakDuration: 'ros1-todo-sbreak-dur',
  longBreakDuration: 'ros1-todo-lbreak-dur',
  notification: 'ros1-todo-notification-toggle',
  lastCheck: 'ros1-todo-last-check-date',
  currentView: 'ros1-todo-current-view',
  // 📈 PHASE 5: GAMIFICATION & STATS STORAGE KEYS
  xp: 'ros1-todo-xp',
  level: 'ros1-todo-level',
  totalXp: 'ros1-todo-total-xp',
  focusStreak: 'ros1-todo-focus-streak',
  totalFocusedMinutes: 'ros1-todo-total-focused-minutes',
  completedHistory: 'ros1-todo-completed-history',
  unlockedAchievements: 'ros1-todo-unlocked-achievements',
  tags: 'ros1-todo-tags'
};

const PRESET_ACHIEVEMENTS = [
  {
    id: 'first_step',
    icon: '🎓',
    titleZh: '初露锋芒',
    titleEn: 'First Step',
    descZh: '勾选完成第 1 个待办任务',
    descEn: 'Complete your first task',
    condition: (stats) => stats.completedCount >= 1
  },
  {
    id: 'efficiency_master',
    icon: '⚡',
    titleZh: '效率达人',
    titleEn: 'Efficiency Master',
    descZh: '累计完成 10 个待办任务',
    descEn: 'Complete 10 tasks in total',
    condition: (stats) => stats.completedCount >= 10
  },
  {
    id: 'focus_pioneer',
    icon: '🎯',
    titleZh: '专注先锋',
    titleEn: 'Focus Pioneer',
    descZh: '累计专注成功 3 个番茄钟',
    descEn: 'Focus successfully for 3 Pomodoro sessions',
    condition: (stats) => stats.pomodoroCount >= 3
  },
  {
    id: 'flow_warrior',
    icon: '🔥',
    titleZh: '心流武士',
    titleEn: 'Flow Warrior',
    descZh: '角色等级达到 Level 5',
    descEn: 'Reach Level 5',
    condition: (stats) => stats.level >= 5
  },
  {
    id: 'unstoppable',
    icon: '🗓️',
    titleZh: '坚持不懈',
    titleEn: 'Unstoppable',
    descZh: '连续 3 天都有完成任务',
    descEn: 'Have completed tasks for 3 consecutive days',
    condition: (stats) => stats.streak >= 3
  }
];

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
    const isAddingCustomTag = ref(false);
    const customTagInput = ref('');
    const customTagInputRef = ref(null);
    
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

    // 🌟 NEW MULTILINGUAL AND LAYOUT STYLING PREFERENCE STATES
    const lang = ref('zh');
    const radiusStyle = ref('rounded'); // 'rounded', 'sharp', 'classic'
    const accentColor = ref('default'); // 'default', 'cyan', 'green', 'pink', 'purple', 'orange'
    const appMode = ref('normal'); // 'normal' or 'advanced'
    const isPomodoroVisible = ref(true);

    // 🧭 Flow Pomodoro & Ambient Sound States
    const focusedTodoId = ref(null);
    const focusDuration = ref(25 * 60);
    const shortBreakDuration = ref(5 * 60);
    const longBreakDuration = ref(15 * 60);

    const timerTimeLeft = ref(25 * 60);
    const timerTotalDuration = ref(25 * 60);
    const isTimerRunning = ref(false);
    const timerMode = ref('focus'); // 'focus', 'shortBreak', 'longBreak'
    const ambientMode = ref(null);

    let timerInterval = null;
    let timerTargetEndTime = null;

    // 🔔 Notification, Priority, and Recurrence States (Phase 4)
    const notificationToggle = ref(false);
    const newTodoPriority = ref('normal'); // 'low', 'normal', 'high'
    const newTodoRecurrence = ref('none'); // 'none', 'daily', 'weekly', 'monthly'

    // 📊 Kanban Board States (Phase 3)
    const currentView = ref('list'); // 'list' or 'kanban'
    const draggedTodo = ref(null);
    const activeDragOverColumn = ref(null);

    // 📈 Gamification & Analytics States (Phase 5)
    const xp = ref(0);
    const level = ref(1);
    const totalXp = ref(0);
    const focusStreak = ref(0);
    const totalFocusedMinutes = ref(0);
    const completedHistory = ref([]);
    const unlockedAchievements = ref([]);

    // Fetch local storage initial state
    const fetchStorage = () => {
      try {
        todos.value = JSON.parse(localStorage.getItem(STORAGE_KEYS.todos) || '[]');
        recycleBin.value = JSON.parse(localStorage.getItem(STORAGE_KEYS.bin) || '[]');
        slogan.value = localStorage.getItem(STORAGE_KEYS.slogan) || '今日事今日毕，勿将今事待明日! ☕';
        theme.value = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
        soundToggle.value = localStorage.getItem(STORAGE_KEYS.sound) !== 'false';
        
        // Load multilingual and styling preferences
        lang.value = localStorage.getItem(STORAGE_KEYS.lang) || 'zh';
        radiusStyle.value = localStorage.getItem(STORAGE_KEYS.radiusStyle) || 'rounded';
        accentColor.value = localStorage.getItem(STORAGE_KEYS.accentColor) || 'default';
        appMode.value = localStorage.getItem(STORAGE_KEYS.appMode) || 'normal';
        isPomodoroVisible.value = localStorage.getItem('ros1-todo-pomodoro-visible') !== 'false';

        focusDuration.value = Number(localStorage.getItem(STORAGE_KEYS.focusDuration)) || 25 * 60;
        shortBreakDuration.value = Number(localStorage.getItem(STORAGE_KEYS.shortBreakDuration)) || 5 * 60;
        longBreakDuration.value = Number(localStorage.getItem(STORAGE_KEYS.longBreakDuration)) || 15 * 60;

        timerTotalDuration.value = focusDuration.value;
        timerTimeLeft.value = focusDuration.value;

        // Load Notification toggles (Phase 4)
        notificationToggle.value = localStorage.getItem(STORAGE_KEYS.notification) === 'true';

        // Load Kanban view preferences (Phase 3)
        currentView.value = localStorage.getItem(STORAGE_KEYS.currentView) || 'list';

        // Load Gamification XP & levels (Phase 5)
        xp.value = Number(localStorage.getItem(STORAGE_KEYS.xp)) || 0;
        level.value = Number(localStorage.getItem(STORAGE_KEYS.level)) || 1;
        totalXp.value = Number(localStorage.getItem(STORAGE_KEYS.totalXp)) || 0;
        focusStreak.value = Number(localStorage.getItem(STORAGE_KEYS.focusStreak)) || 0;
        totalFocusedMinutes.value = Number(localStorage.getItem(STORAGE_KEYS.totalFocusedMinutes)) || 0;
        
        try {
          unlockedAchievements.value = JSON.parse(localStorage.getItem(STORAGE_KEYS.unlockedAchievements) || '[]');
        } catch (e) {
          unlockedAchievements.value = [];
        }
        
        try {
          completedHistory.value = JSON.parse(localStorage.getItem(STORAGE_KEYS.completedHistory) || '[]');
        } catch (e) {
          completedHistory.value = [];
        }
        
        hydrateCompletedHistoryPlaceholders();

        try {
          const storedTags = localStorage.getItem(STORAGE_KEYS.tags);
          if (storedTags) {
            availableTags.value = JSON.parse(storedTags);
          }
        } catch (e) {
          console.error('Failed to load custom tags:', e);
        }

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
    


    // Save style and language preferences
    const saveLang = () => localStorage.setItem(STORAGE_KEYS.lang, lang.value);
    const saveRadiusStyle = () => localStorage.setItem(STORAGE_KEYS.radiusStyle, radiusStyle.value);
    const saveAccentColor = () => localStorage.setItem(STORAGE_KEYS.accentColor, accentColor.value);
    const saveAppMode = () => localStorage.setItem(STORAGE_KEYS.appMode, appMode.value);
    const saveFocusDuration = () => localStorage.setItem(STORAGE_KEYS.focusDuration, focusDuration.value.toString());
    const saveShortBreakDuration = () => localStorage.setItem(STORAGE_KEYS.shortBreakDuration, shortBreakDuration.value.toString());
    const saveLongBreakDuration = () => localStorage.setItem(STORAGE_KEYS.longBreakDuration, longBreakDuration.value.toString());
    const saveNotificationToggle = () => localStorage.setItem(STORAGE_KEYS.notification, notificationToggle.value.toString());

    // Watchers for continuous storage synchronization
    watch(todos, saveTodos, { deep: true });
    watch(recycleBin, saveBin, { deep: true });
    watch(slogan, saveSlogan);
    watch(theme, saveTheme);
    watch(soundToggle, saveSound);
    


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
    watch(focusDuration, saveFocusDuration);
    watch(shortBreakDuration, saveShortBreakDuration);
    watch(longBreakDuration, saveLongBreakDuration);
    watch(notificationToggle, saveNotificationToggle);
    watch(currentView, (newVal) => localStorage.setItem(STORAGE_KEYS.currentView, newVal));
    watch(isPomodoroVisible, (newVal) => {
      localStorage.setItem('ros1-todo-pomodoro-visible', newVal.toString());
    });
    watch(availableTags, () => {
      localStorage.setItem(STORAGE_KEYS.tags, JSON.stringify(availableTags.value));
    }, { deep: true });
    watch(appMode, (newMode) => {
      saveAppMode();
      if (newMode === 'normal') {
        // Stop timer
        if (isTimerRunning.value) {
          isTimerRunning.value = false;
          if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
          }
        }
        // Stop ambient sound
        if (ambientMode.value) {
          ambientMode.value = null;
          AmbientSoundEngine.stop();
        }
        // Clear focused target
        focusedTodoId.value = null;
      }
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

    // 📊 Kanban Board Column Filters (Phase 3)
    const kanbanTodoTasks = computed(() => {
      return filteredTodos.value.filter(t => !t.removed && (t.status === 'todo' || (!t.status && !t.completed)));
    });

    const kanbanProgressTasks = computed(() => {
      return filteredTodos.value.filter(t => !t.removed && t.status === 'progress');
    });

    const kanbanDoneTasks = computed(() => {
      return filteredTodos.value.filter(t => !t.removed && (t.status === 'done' || (!t.status && t.completed)));
    });

    const showEmptyTips = computed(() => {
      return filteredTodos.value.length === 0;
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
        accentOrange: "落日橙",
        appModeLabel: "应用模式 (App Mode)",
        appModeNormal: "普通极简",
        appModeAdvanced: "效能高级",
        pomodoroTitle: "心流专注番茄钟",
        pomodoroStart: "开始专注",
        pomodoroPause: "暂停",
        pomodoroResume: "继续",
        pomodoroReset: "重置",
        pomodoroModeFocus: "专注时间",
        pomodoroModeShortBreak: "短暂休息",
        pomodoroModeLongBreak: "系统休整",
        pomodoroTarget: "当前专注",
        pomodoroNoTarget: "暂无专注目标 (点击待办右侧 🎯 锁定)",
        ambientTitle: "环境心流音",
        ambientRain: "林间细雨 🌧️",
        ambientOcean: "深海巨浪 🌊",
        ambientSpace: "空灵宇宙 🌌"
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
        accentOrange: "Sunset Orange",
        appModeLabel: "App Mode",
        appModeNormal: "Normal Minimalist",
        appModeAdvanced: "Flow Advanced",
        pomodoroTitle: "Flow Pomodoro Timer",
        pomodoroStart: "Start Focus",
        pomodoroPause: "Pause",
        pomodoroResume: "Resume",
        pomodoroReset: "Reset",
        pomodoroModeFocus: "Focusing",
        pomodoroModeShortBreak: "Short Break",
        pomodoroModeLongBreak: "Long Break",
        pomodoroTarget: "Focusing on",
        pomodoroNoTarget: "No active target (Click 🎯 on task)",
        ambientTitle: "Ambient Flow Sound",
        ambientRain: "Forest Rain 🌧️",
        ambientOcean: "Ocean Waves 🌊",
        ambientSpace: "Cosmic Buzz 🌌"
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
        subtasks: [],
        priority: newTodoPriority.value, // 'low', 'normal', 'high'
        recurrence: newTodoRecurrence.value // 'none', 'daily', 'weekly', 'monthly'
      });

      // Clear input fields
      newTodoTitle.value = '';
      newTodoTags.value = [];
      newTodoPriority.value = 'normal';
      newTodoRecurrence.value = 'none';
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

    const startAddingCustomTag = () => {
      isAddingCustomTag.value = true;
      nextTick(() => {
        if (customTagInputRef.value) {
          customTagInputRef.value.focus();
        }
      });
    };

    const submitCustomTag = () => {
      const val = customTagInput.value.trim();
      if (val) {
        if (!availableTags.value.includes(val)) {
          availableTags.value.push(val);
          SoundEffects.playClick();
        }
        if (!newTodoTags.value.includes(val)) {
          newTodoTags.value.push(val);
        }
      }
      customTagInput.value = '';
      isAddingCustomTag.value = false;
    };

    const toggleClockWidget = () => {
      SoundEffects.playClick();
      if (appMode.value !== 'advanced') {
        appMode.value = 'advanced';
        saveAppMode();
      }
      isPomodoroVisible.value = !isPomodoroVisible.value;
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
        
        // Gamification XP Add (Phase 5)
        let xpReward = 50;
        if (todo.priority === 'high') xpReward = 100;
        else if (todo.priority === 'low') xpReward = 25;
        addXp(xpReward, event);
        
        // Log to history
        incrementCompletedToday();

        // Spawn sparks on click target coordinates
        if (event && event.clientX) {
          ParticleSystem.spawn(event.clientX, event.clientY);
        } else {
          ParticleSystem.spawn(window.innerWidth / 2, window.innerHeight / 2);
        }
        // Auto-clear focus target on completion
        if (focusedTodoId.value === todo.id) {
          focusedTodoId.value = null;
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
        // Auto-clear focus target on removal
        if (focusedTodoId.value === todo.id) {
          focusedTodoId.value = null;
        }
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
        
        // Gamification XP Add (Phase 5)
        addXp(10, event);

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
            // Clear if focused
            if (focusedTodoId.value === t.id) {
              focusedTodoId.value = null;
            }
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
          focusedTodoId.value = null; // Clear focus target since all tasks are gone
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

    // 📊 KANBAN BOARD DRAG & DROP ENGINE (Phase 3)
    const moveTodoToStatus = (todo, status) => {
      if (!todo) return;
      
      const prevStatus = todo.status || (todo.completed ? 'done' : 'todo');
      if (prevStatus === status) return;
      
      todo.status = status;
      
      if (status === 'done') {
        if (!todo.completed) {
          todo.completed = true;
          // Also complete all subtasks
          if (todo.subtasks && todo.subtasks.length > 0) {
            todo.subtasks.forEach(s => s.completed = true);
          }
          
          // Gamification XP Add (Phase 5)
          let xpReward = 50;
          if (todo.priority === 'high') xpReward = 100;
          else if (todo.priority === 'low') xpReward = 25;
          addXp(xpReward);
          
          // Log to history
          incrementCompletedToday();

          SoundEffects.playSuccess();
          // Fix legacy bug: replace createFirework() with ParticleSystem.spawn
          if (typeof ParticleSystem !== 'undefined' && ParticleSystem.spawn) {
            ParticleSystem.spawn(window.innerWidth / 2, window.innerHeight / 3, 50);
          }
        }
      } else {
        if (todo.completed) {
          todo.completed = false;
          SoundEffects.playClick();
        } else {
          SoundEffects.playClick();
        }
      }
      
      saveTodos();
    };

    const handleKanbanDragStart = (todo, event) => {
      if (editedTodo.value !== null) return;
      draggedTodo.value = todo;
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', todo.id.toString());
      }
    };

    const handleKanbanDragEnd = () => {
      draggedTodo.value = null;
      activeDragOverColumn.value = null;
    };

    const handleKanbanDragEnter = (status, event) => {
      event.preventDefault();
      activeDragOverColumn.value = status;
    };

    const handleKanbanDragLeave = (event) => {
      // Event placeholder
    };

    const handleKanbanDrop = (status, event) => {
      event.preventDefault();
      if (draggedTodo.value) {
        moveTodoToStatus(draggedTodo.value, status);
      }
      activeDragOverColumn.value = null;
      draggedTodo.value = null;
    };

    // Mobile touch controls for Kanban
    let touchDraggedTodo = null;
    let touchHoveredColumnStatus = null;

    const handleKanbanTouchStart = (todo, event) => {
      if (editedTodo.value !== null) return;
      touchDraggedTodo = todo;
    };

    const handleKanbanTouchMove = (event) => {
      if (!touchDraggedTodo) return;
      
      const touch = event.touches[0];
      const elem = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (!elem) return;
      
      const column = elem.closest('.kanban-column');
      
      // Clean up drag-over from all columns
      document.querySelectorAll('.kanban-column').forEach(col => {
        col.classList.remove('drag-over');
      });
      
      if (column) {
        column.classList.add('drag-over');
        const contentEl = column.querySelector('.kanban-column-content');
        if (contentEl) {
          touchHoveredColumnStatus = contentEl.getAttribute('data-status');
        }
      } else {
        touchHoveredColumnStatus = null;
      }
    };

    const handleKanbanTouchEnd = (columnStatus, event) => {
      if (!touchDraggedTodo) return;
      
      const targetStatus = touchHoveredColumnStatus || columnStatus;
      if (targetStatus) {
        moveTodoToStatus(touchDraggedTodo, targetStatus);
      }
      
      // Clean up columns drag-over state
      document.querySelectorAll('.kanban-column').forEach(col => {
        col.classList.remove('drag-over');
      });
      
      touchDraggedTodo = null;
      touchHoveredColumnStatus = null;
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
          slogan.value = '今日事今日毕，勿将今事待明日! ☕';
          theme.value = 'light';
          soundToggle.value = true;
          lang.value = 'zh';
          radiusStyle.value = 'rounded';
          accentColor.value = 'default';
          
          focusedTodoId.value = null;
          focusDuration.value = 25 * 60;
          shortBreakDuration.value = 5 * 60;
          longBreakDuration.value = 15 * 60;
          timerTimeLeft.value = 25 * 60;
          timerTotalDuration.value = 25 * 60;
          
          notificationToggle.value = false;
          newTodoPriority.value = 'normal';
          newTodoRecurrence.value = 'none';
          if (isTimerRunning.value) {
            isTimerRunning.value = false;
            if (timerInterval) {
              clearInterval(timerInterval);
              timerInterval = null;
            }
          }
          timerMode.value = 'focus';
          if (ambientMode.value) {
            ambientMode.value = null;
            AmbientSoundEngine.stop();
          }

          settingsActive.value = false;
          SoundEffects.playSuccess();
          alert('重置成功 / Reset successful!');
        }
      });
    };

    // ==========================================
    // 🧭 FLOW POMODORO & AMBIENT SOUND CONTROLLER
    // ==========================================
    
    const focusedTodo = computed(() => {
      return todos.value.find(t => t.id === focusedTodoId.value) || null;
    });

    const timerStrokeStyle = computed(() => {
      const circumference = 282.743;
      const offset = circumference * (1 - timerTimeLeft.value / timerTotalDuration.value);
      return {
        strokeDasharray: `${circumference}`,
        strokeDashoffset: `${offset}`
      };
    });

    const timerModeText = computed(() => {
      if (timerMode.value === 'focus') {
        return t('pomodoroModeFocus');
      } else if (timerMode.value === 'shortBreak') {
        return t('pomodoroModeShortBreak');
      } else if (timerMode.value === 'longBreak') {
        return t('pomodoroModeLongBreak');
      }
      return '';
    });

    const timerModeClass = computed(() => {
      return timerMode.value === 'focus' ? 'focus-mode' : 'break-mode';
    });

    const formattedTime = computed(() => {
      const minutes = Math.floor(timerTimeLeft.value / 60);
      const seconds = timerTimeLeft.value % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    });

    const lockTodoFocus = (todo) => {
      SoundEffects.playClick();
      if (focusedTodoId.value === todo.id) {
        focusedTodoId.value = null;
      } else {
        focusedTodoId.value = todo.id;
      }
    };

    const handleTimerComplete = () => {
      SoundEffects.playSuccess();
      
      if (typeof ParticleSystem !== 'undefined' && ParticleSystem.spawn) {
        ParticleSystem.spawn(window.innerWidth / 2, window.innerHeight / 3, 50);
      }

      if (timerMode.value === 'focus') {
        // Gamification XP Add (Phase 5)
        addXp(150);
        
        // Accumulate focus minutes
        const mins = Math.round(focusDuration.value / 60);
        totalFocusedMinutes.value += mins;
        localStorage.setItem(STORAGE_KEYS.totalFocusedMinutes, totalFocusedMinutes.value.toString());
        
        // Track completed Pomodoros in localStorage
        let poms = Number(localStorage.getItem('ros1-todo-completed-poms-count') || '0');
        poms += 1;
        localStorage.setItem('ros1-todo-completed-poms-count', poms.toString());

        // Send Notification (Phase 4)
        sendDesktopNotification(
          lang.value === 'zh' ? '🎯 专注完成！' : '🎯 Focus Complete!',
          lang.value === 'zh' ? '恭喜您完成了 1 个专注周期！快去短暂休息一下吧 ☕' : 'Congratulations on finishing 1 focus interval! Time for a short break ☕'
        );

        timerMode.value = 'shortBreak';
        timerTotalDuration.value = shortBreakDuration.value;
        timerTimeLeft.value = shortBreakDuration.value;
      } else if (timerMode.value === 'shortBreak') {
        // Send Notification (Phase 4)
        sendDesktopNotification(
          lang.value === 'zh' ? '☕ 休息结束！' : '☕ Break Ended!',
          lang.value === 'zh' ? '系统休整完毕，快回来开启下一个高效专注期吧 ⚡' : 'Break ended. Time to start the next high-performance focus session ⚡'
        );

        timerMode.value = 'focus';
        timerTotalDuration.value = focusDuration.value;
        timerTimeLeft.value = focusDuration.value;
      } else if (timerMode.value === 'longBreak') {
        // Send Notification (Phase 4)
        sendDesktopNotification(
          lang.value === 'zh' ? '🌌 系统长休结束！' : '🌌 Long Break Ended!',
          lang.value === 'zh' ? '系统已恢复满格能量，准备好开启全新的征程了吗？🎯' : 'Energy fully restored. Ready to start the next epic challenge? 🎯'
        );

        timerMode.value = 'focus';
        timerTotalDuration.value = focusDuration.value;
        timerTimeLeft.value = focusDuration.value;
      }
    };

    const toggleTimer = () => {
      SoundEffects.playClick();
      if (isTimerRunning.value) {
        isTimerRunning.value = false;
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
      } else {
        isTimerRunning.value = true;
        // High-precision clock scheduling to defeat requestAnimationFrame / setInterval thread drift
        timerTargetEndTime = Date.now() + timerTimeLeft.value * 1000;
        
        timerInterval = setInterval(() => {
          const delta = timerTargetEndTime - Date.now();
          if (delta <= 0) {
            timerTimeLeft.value = 0;
            isTimerRunning.value = false;
            clearInterval(timerInterval);
            timerInterval = null;
            handleTimerComplete();
          } else {
            timerTimeLeft.value = Math.ceil(delta / 1000);
          }
        }, 100);
      }
    };

    const resetTimer = () => {
      SoundEffects.playClick();
      isTimerRunning.value = false;
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      
      if (timerMode.value === 'focus') {
        timerTotalDuration.value = focusDuration.value;
        timerTimeLeft.value = focusDuration.value;
      } else if (timerMode.value === 'shortBreak') {
        timerTotalDuration.value = shortBreakDuration.value;
        timerTimeLeft.value = shortBreakDuration.value;
      } else if (timerMode.value === 'longBreak') {
        timerTotalDuration.value = longBreakDuration.value;
        timerTimeLeft.value = longBreakDuration.value;
      }
    };

    // Computed wrappers for settings inputs (with auto-sync on change)
    const focusDurationMin = computed({
      get: () => Math.round(focusDuration.value / 60),
      set: (val) => {
        const minutes = Number(val);
        if (isNaN(minutes) || minutes < 1) return;
        focusDuration.value = minutes * 60;
        if (!isTimerRunning.value && timerMode.value === 'focus') {
          timerTimeLeft.value = focusDuration.value;
          timerTotalDuration.value = focusDuration.value;
        }
      }
    });

    const shortBreakDurationMin = computed({
      get: () => Math.round(shortBreakDuration.value / 60),
      set: (val) => {
        const minutes = Number(val);
        if (isNaN(minutes) || minutes < 1) return;
        shortBreakDuration.value = minutes * 60;
        if (!isTimerRunning.value && timerMode.value === 'shortBreak') {
          timerTimeLeft.value = shortBreakDuration.value;
          timerTotalDuration.value = shortBreakDuration.value;
        }
      }
    });

    const longBreakDurationMin = computed({
      get: () => Math.round(longBreakDuration.value / 60),
      set: (val) => {
        const minutes = Number(val);
        if (isNaN(minutes) || minutes < 1) return;
        longBreakDuration.value = minutes * 60;
        if (!isTimerRunning.value && timerMode.value === 'longBreak') {
          timerTimeLeft.value = longBreakDuration.value;
          timerTotalDuration.value = longBreakDuration.value;
        }
      }
    });

    // Quick presets adjustment
    const adjustTime = (seconds) => {
      SoundEffects.playClick();
      let newTime = timerTimeLeft.value + seconds;
      if (newTime < 60) newTime = 60; // minimum 1 min
      if (newTime > 180 * 60) newTime = 180 * 60; // max 180 min
      
      timerTimeLeft.value = newTime;
      timerTotalDuration.value = newTime;
    };

    // Manual mode switching
    const switchTimerMode = (mode) => {
      SoundEffects.playClick();
      if (isTimerRunning.value) {
        isTimerRunning.value = false;
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
      }
      
      timerMode.value = mode;
      
      if (mode === 'focus') {
        timerTotalDuration.value = focusDuration.value;
        timerTimeLeft.value = focusDuration.value;
      } else if (mode === 'shortBreak') {
        timerTotalDuration.value = shortBreakDuration.value;
        timerTimeLeft.value = shortBreakDuration.value;
      } else if (mode === 'longBreak') {
        timerTotalDuration.value = longBreakDuration.value;
        timerTimeLeft.value = longBreakDuration.value;
      }
    };

    const toggleAmbient = () => {};

    // ==========================================
    // 🔔 WEB DESKTOP NOTIFICATIONS (Phase 4)
    // ==========================================
    const sendDesktopNotification = (title, body) => {
      if (!notificationToggle.value || !('Notification' in window)) return;
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: body,
          icon: './favicon.ico'
        });
      }
    };

    const toggleNotification = () => {
      SoundEffects.playClick();
      if (notificationToggle.value) {
        notificationToggle.value = false;
      } else {
        if (!('Notification' in window)) {
          alert(lang.value === 'zh' ? '抱歉，您的浏览器不支持桌面推送消息通知。' : 'Sorry, your browser does not support desktop notifications.');
          notificationToggle.value = false;
          return;
        }
        
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            notificationToggle.value = true;
            new Notification(lang.value === 'zh' ? '🔔 桌面推送通知已成功开启！' : '🔔 Desktop notifications successfully enabled!');
          } else {
            alert(lang.value === 'zh' ? '未获桌面通知授权，请在浏览器地址栏左侧允许此页面的通知权限！' : 'Notification permission denied. Please allow notifications in your browser settings!');
            notificationToggle.value = false;
          }
        });
      }
    };

    // ==========================================
    // 🔁 SMART OFFLINE TASK SCHEDULER (Phase 4)
    // ==========================================
    const runTaskScheduler = () => {
      try {
        const lastCheckStr = localStorage.getItem(STORAGE_KEYS.lastCheck);
        const today = new Date();
        const todayStr = today.toDateString(); // e.g. "Thu May 28 2026"
        
        if (!lastCheckStr) {
          localStorage.setItem(STORAGE_KEYS.lastCheck, todayStr);
          return;
        }
        
        if (lastCheckStr === todayStr) {
          return;
        }
        
        let countResets = 0;
        const lastCheckDate = new Date(lastCheckStr);
        const isNewDay = true;
        
        const getMonday = (d) => {
          const date = new Date(d);
          const day = date.getDay();
          const diff = date.getDate() - day + (day === 0 ? -6 : 1);
          return new Date(date.setDate(diff)).toDateString();
        };
        const isNewWeek = getMonday(lastCheckDate) !== getMonday(today);
        const isNewMonth = lastCheckDate.getMonth() !== today.getMonth() || lastCheckDate.getFullYear() !== today.getFullYear();
        
        todos.value.forEach(todo => {
          if (todo.recurrence && todo.recurrence !== 'none') {
            let shouldReset = false;
            
            if (todo.recurrence === 'daily' && isNewDay) {
              shouldReset = true;
            } else if (todo.recurrence === 'weekly' && isNewWeek) {
              shouldReset = true;
            } else if (todo.recurrence === 'monthly' && isNewMonth) {
              shouldReset = true;
            }
            
            if (shouldReset && todo.completed) {
              todo.completed = false;
              if (todo.subtasks && todo.subtasks.length > 0) {
                todo.subtasks.forEach(s => s.completed = false);
              }
              countResets++;
            }
          }
        });
        
        if (countResets > 0) {
          console.log(`Scheduler: Reset ${countResets} recurring tasks.`);
          saveTodos();
          
          setTimeout(() => {
            sendDesktopNotification(
              lang.value === 'zh' ? '🔄 周期任务重置提醒' : '🔄 Recurring Tasks Reset',
              lang.value === 'zh' ? `新的一天开启，系统已为您自动唤醒并重置了 ${countResets} 个周期任务！` : `A new cycle has started. ${countResets} recurring tasks have been reset for you!`
            );
          }, 3000);
        }
        
        localStorage.setItem(STORAGE_KEYS.lastCheck, todayStr);
      } catch (err) {
        console.error('Scheduler failure:', err);
      }
    };

    // ==========================================
    // 🎯 PRIORITY CYCLING (Phase 4)
    // ==========================================
    const cycleTodoPriority = (todo) => {
      SoundEffects.playClick();
      const current = todo.priority || 'normal';
      if (current === 'low') {
        todo.priority = 'normal';
      } else if (current === 'normal') {
        todo.priority = 'high';
      } else {
        todo.priority = 'low';
      }
      saveTodos();
    };

    // ==========================================
    // 📈 GAMIFICATION & DATA ANALYTICS (Phase 5)
    // ==========================================
    const xpToNextLevel = computed(() => {
      return 100 + (level.value - 1) * 50;
    });

    const addXp = (amount, event) => {
      if (appMode.value !== 'advanced') return;
      
      xp.value += amount;
      totalXp.value += amount;
      
      let leveledUp = false;
      while (xp.value >= xpToNextLevel.value) {
        xp.value -= xpToNextLevel.value;
        level.value += 1;
        leveledUp = true;
      }
      
      localStorage.setItem(STORAGE_KEYS.xp, xp.value.toString());
      localStorage.setItem(STORAGE_KEYS.level, level.value.toString());
      localStorage.setItem(STORAGE_KEYS.totalXp, totalXp.value.toString());
      
      if (leveledUp) {
        triggerLevelUpEffects(event);
      } else {
        spawnXpToast(amount, event);
      }
      
      checkAchievements();
    };

    const triggerLevelUpEffects = (event) => {
      SoundEffects.playLevelUp();
      
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;
      if (event && event.clientX) {
        x = event.clientX;
        y = event.clientY;
      }
      
      if (typeof ParticleSystem !== 'undefined' && ParticleSystem.spawnLevelUp) {
        ParticleSystem.spawnLevelUp(x, y);
        setTimeout(() => ParticleSystem.spawnLevelUp(x - 200, y - 100), 150);
        setTimeout(() => ParticleSystem.spawnLevelUp(x + 200, y - 100), 300);
      }
      
      showLevelUpNotification(level.value);
    };

    const showLevelUpNotification = (lvl) => {
      try {
        const toast = document.createElement('div');
        toast.className = 'levelup-toast';
        toast.innerHTML = `
          <div class="lvl-toast-content">
            <span class="lvl-toast-title">🎉 ${lang.value === 'zh' ? '恭喜升级！' : 'LEVEL UP!'} 🎉</span>
            <span class="lvl-toast-desc">${lang.value === 'zh' ? '您的效能段位提升至' : 'Your efficiency tier rises to'}</span>
            <span class="lvl-toast-badge">Lv. ${lvl}</span>
          </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.classList.add('fade-out');
          setTimeout(() => {
            if (toast && toast.parentNode) {
              toast.parentNode.removeChild(toast);
            }
          }, 500);
        }, 3500);
      } catch (e) {
        console.error('Level up toast spawn failed:', e);
      }
    };

    const spawnXpToast = (amount, event) => {
      try {
        const toast = document.createElement('div');
        toast.className = 'xp-toast';
        toast.innerText = `+${amount} XP`;
        
        let x = window.innerWidth / 2;
        let y = window.innerHeight * 0.8;
        if (event && event.clientX) {
          x = event.clientX;
          y = event.clientY;
        }
        
        toast.style.left = `${x}px`;
        toast.style.top = `${y}px`;
        
        document.body.appendChild(toast);
        setTimeout(() => {
          if (toast && toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 800);
      } catch (e) {
        console.error('Xp toast spawn failed:', e);
      }
    };

    const getTodayString = () => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const incrementCompletedToday = () => {
      if (appMode.value !== 'advanced') return;
      try {
        const todayStr = getTodayString();
        let history = [];
        try {
          history = JSON.parse(localStorage.getItem(STORAGE_KEYS.completedHistory) || '[]');
        } catch (e) {
          history = [];
        }
        
        let found = false;
        for (let i = 0; i < history.length; i++) {
          if (history[i].date === todayStr) {
            history[i].count += 1;
            found = true;
            break;
          }
        }
        
        if (!found) {
          history.push({ date: todayStr, count: 1 });
        }
        
        history.sort((a, b) => new Date(a.date) - new Date(b.date));
        if (history.length > 7) {
          history = history.slice(history.length - 7);
        }
        
        completedHistory.value = history;
        localStorage.setItem(STORAGE_KEYS.completedHistory, JSON.stringify(history));
        
        updateStreakDays();
      } catch (e) {
        console.error('Failed to log completed history:', e);
      }
    };

    const updateStreakDays = () => {
      try {
        let history = [];
        try {
          history = JSON.parse(localStorage.getItem(STORAGE_KEYS.completedHistory) || '[]');
        } catch (e) {
          history = [];
        }
        if (history.length === 0) {
          focusStreak.value = 0;
          return;
        }
        
        history.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const todayStr = getTodayString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
        
        let streak = 0;
        let lastDate = new Date();
        
        if (history[0].date === todayStr) {
          streak = 1;
          lastDate = new Date(todayStr);
        } else if (history[0].date === yesterdayStr) {
          streak = 1;
          lastDate = new Date(yesterdayStr);
        } else {
          focusStreak.value = 0;
          localStorage.setItem(STORAGE_KEYS.focusStreak, '0');
          return;
        }
        
        for (let i = 1; i < history.length; i++) {
          const nextDate = new Date(history[i].date);
          const diffTime = Math.abs(lastDate - nextDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            streak += 1;
            lastDate = nextDate;
          } else if (diffDays === 0) {
            continue;
          } else {
            break;
          }
        }
        
        focusStreak.value = streak;
        localStorage.setItem(STORAGE_KEYS.focusStreak, streak.toString());
      } catch (e) {
        console.error('Failed to update streak:', e);
      }
    };

    const hydrateCompletedHistoryPlaceholders = () => {
      try {
        let history = completedHistory.value;
        const result = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          
          const existing = history.find(h => h.date === dateStr);
          result.push({
            date: dateStr,
            count: existing ? existing.count : 0
          });
        }
        completedHistory.value = result;
        localStorage.setItem(STORAGE_KEYS.completedHistory, JSON.stringify(result));
      } catch (e) {
        console.error('History hydration failed:', e);
      }
    };

    const checkAchievements = () => {
      if (appMode.value !== 'advanced') return;
      try {
        const completedCount = todos.value.filter(t => t.completed && !t.removed).length 
                              + recycleBin.value.filter(t => t.completed).length;
        const pomodoroCount = Number(localStorage.getItem('ros1-todo-completed-poms-count') || '0');
        const currentLvl = level.value;
        const currentStreak = focusStreak.value;
        
        const stats = {
          completedCount,
          pomodoroCount,
          level: currentLvl,
          streak: currentStreak
        };
        
        PRESET_ACHIEVEMENTS.forEach(ach => {
          if (unlockedAchievements.value.includes(ach.id)) return;
          
          if (ach.condition(stats)) {
            unlockedAchievements.value.push(ach.id);
            localStorage.setItem(STORAGE_KEYS.unlockedAchievements, JSON.stringify(unlockedAchievements.value));
            triggerAchievementUnlock(ach);
          }
        });
      } catch (e) {
        console.error('Failed to check achievements:', e);
      }
    };

    const triggerAchievementUnlock = (ach) => {
      SoundEffects.playSuccess();
      
      const title = lang.value === 'zh' 
        ? `🏆 成就解锁：【${ach.titleZh}】！` 
        : `🏆 Achievement Unlocked: [${ach.titleEn}]!`;
      const body = lang.value === 'zh'
        ? `恭喜解锁新成就：${ach.descZh}！`
        : `Congratulations on unlocking: ${ach.descEn}!`;
      sendDesktopNotification(title, body);
      
      showAchievementToast(ach);
    };

    const showAchievementToast = (ach) => {
      try {
        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.innerHTML = `
          <div class="ach-toast-icon">${ach.icon}</div>
          <div class="ach-toast-details">
            <span class="ach-toast-tag">${lang.value === 'zh' ? '🏆 新成就解锁！' : '🏆 ACHIEVEMENT UNLOCKED!'}</span>
            <span class="ach-toast-title">${lang.value === 'zh' ? ach.titleZh : ach.titleEn}</span>
            <span class="ach-toast-desc">${lang.value === 'zh' ? ach.descZh : ach.descEn}</span>
          </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.classList.add('fade-out');
          setTimeout(() => {
            if (toast && toast.parentNode) {
              toast.parentNode.removeChild(toast);
            }
          }, 500);
        }, 4500);
      } catch (e) {
        console.error('Achievement toast spawn failed:', e);
      }
    };

    const completedChartPoints = computed(() => {
      const history = completedHistory.value;
      if (!history || history.length === 0) return { line: '', area: '', dots: [] };
      
      const M = Math.max(...history.map(h => h.count), 3);
      
      const dots = history.map((h, i) => {
        const x = 40 + i * 70;
        const y = 160 - (h.count / M) * 120;
        let label = h.date.substring(5); // 'MM-DD'
        return { x, y, count: h.count, date: label };
      });
      
      const linePath = dots.map((d, i) => `${i === 0 ? 'M' : 'L'} ${d.x} ${d.y}`).join(' ');
      const areaPath = `${linePath} L ${dots[6].x} 160 L ${dots[0].x} 160 Z`;
      
      return { line: linePath, area: areaPath, dots };
    });

    const achievementStatusList = computed(() => {
      return PRESET_ACHIEVEMENTS.map(ach => {
        const isUnlocked = unlockedAchievements.value.includes(ach.id);
        return {
          id: ach.id,
          icon: ach.icon,
          title: lang.value === 'zh' ? ach.titleZh : ach.titleEn,
          desc: lang.value === 'zh' ? ach.descZh : ach.descEn,
          unlocked: isUnlocked
        };
      });
    });

    // Lifecycle mount initialization
    onMounted(() => {
      fetchStorage();
      ParticleSystem.init('particle-canvas');
      startClock();
      
      // Apply style preference on boot
      applyRadiusStyle();
      applyAccentColor();

      // Trigger smart recurring scheduler (Phase 4)
      runTaskScheduler();
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
      
      // 🌟 MULTILINGUAL & PREFERENCE STYLE RETURNS
      lang,
      radiusStyle,
      accentColor,
      t, // translation helper
      
      // 🧭 Flow Pomodoro & Ambient Sound System Returns
      appMode,
      focusedTodoId,
      focusedTodo,
      lockTodoFocus,
      timerTimeLeft,
      timerTotalDuration,
      isTimerRunning,
      
      // 📈 Gamification & Analytics Phase 5
      xp,
      level,
      totalXp,
      focusStreak,
      totalFocusedMinutes,
      completedHistory,
      unlockedAchievements,
      xpToNextLevel,
      addXp,
      completedChartPoints,
      achievementStatusList,
      timerModeText,
      timerModeClass,
      timerStrokeStyle,
      formattedTime,
      toggleTimer,
      resetTimer,
      ambientMode,
      toggleAmbient,
      
      // 🔔 Phase 4 States & Methods
      notificationToggle,
      newTodoPriority,
      newTodoRecurrence,
      toggleNotification,
      cycleTodoPriority,

      // Durations & Setting Methods
      focusDuration,
      shortBreakDuration,
      longBreakDuration,
      focusDurationMin,
      shortBreakDurationMin,
      longBreakDurationMin,
      adjustTime,
      switchTimerMode,
      
      // Methods
      startEditSlogan,
      finishEditSlogan,
      cancelEditSlogan,
      addTodo,
      toggleAddTag,
      isAddingCustomTag,
      customTagInput,
      customTagInputRef,
      isPomodoroVisible,
      toggleClockWidget,
      startAddingCustomTag,
      submitCustomTag,
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
      
      // 📊 Kanban Board Phase 3
      currentView,
      draggedTodo,
      activeDragOverColumn,
      kanbanTodoTasks,
      kanbanProgressTasks,
      kanbanDoneTasks,
      handleKanbanDragStart,
      handleKanbanDragEnd,
      handleKanbanDragEnter,
      handleKanbanDragLeave,
      handleKanbanDrop,
      handleKanbanTouchStart,
      handleKanbanTouchMove,
      handleKanbanTouchEnd,
      moveTodoToStatus,
      
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
