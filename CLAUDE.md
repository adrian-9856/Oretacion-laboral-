# CLAUDE.md - AI Assistant Guide
## Sistema de Evaluación Laboral PRO

This document provides comprehensive guidance for AI assistants working with this codebase.

---

## 📋 Project Overview

**Project Name**: Sistema de Evaluación Laboral PRO (Labor Evaluation System PRO)

**Purpose**: A comprehensive web-based platform for job interview preparation, skills assessment, and labor competency evaluation. Features include interactive quizzes, CV building tools, interview simulators with AI-powered audio analysis, and gamification elements.

**Primary Language**: Spanish (ES)

**Target Users**:
- Job seekers preparing for interviews
- HR professionals evaluating candidates
- Training institutions for workforce development

---

## 🏗️ Architecture

### Application Type
- **Pattern**: Single Page Application (SPA)
- **Navigation**: Screen-based (show/hide div elements)
- **State Management**: JavaScript global variables + LocalStorage
- **Data Persistence**: LocalStorage (client-side) + Google Sheets (optional server-side)

### Technology Stack

#### Core Technologies
- **HTML5**: Semantic structure with embedded SVG icons
- **CSS3**: Custom properties (CSS variables), gradients, animations
- **JavaScript**: Vanilla ES6+ (no frameworks)

#### Browser APIs
- **Web Speech API**: Voice recognition and text-to-speech
- **MediaRecorder API**: Audio recording functionality
- **LocalStorage API**: Client-side data persistence
- **Fetch API**: HTTP requests (Google Sheets integration)

#### External Libraries
- **jsPDF** (v2.5.1): PDF certificate generation
- **DiceBear API** (v7.x): Avatar generation service
- **Google Fonts**: Inter font family

#### External Services
- **DiceBear API**: `https://api.dicebear.com/7.x/` - Avatar generation
- **Google Apps Script**: Optional data export endpoint

---

## 📁 File Structure

```
Oretacion-laboral-/
│
├── index.html              # Main HTML (all screens/views)
├── script-pro.js          # Main JavaScript logic
├── styles.css             # Complete styling
├── README.md              # Basic project info
├── NUEVAS_FUNCIONALIDADES.md  # Feature documentation
└── CLAUDE.md              # This file (AI assistant guide)
```

**Note**: This is a single-file SPA. All screens are in `index.html`, all logic in `script-pro.js`, all styles in `styles.css`.

---

## 🎯 Core Features

### 1. Authentication System
**Location**: `index.html` (lines 14-108), `script-pro.js` (lines 347-445)

#### User Roles
- **Regular Users**: Can take tests, track progress, create avatars
- **Admin Users**: Access dashboard, view all user data, export reports

#### User Flow
1. Login/Register screen (default)
2. Credentials stored in LocalStorage (`users` key)
3. Current session stored in LocalStorage (`currentUser` key)
4. Admin credentials: `admin` / `admin123` (hardcoded)

#### Key Functions
- `showLoginTab(tab)` - Switch between login/register
- `showAdminLogin()` - Navigate to admin login
- `logout()` - Clear session and return to login

### 2. Test System
**Location**: `script-pro.js` (lines 32-288 for questions)

#### Test Types
1. **Cuestionario (Quiz)**: Multiple choice questions
2. **Detectar Errores (Error Detection)**: Find errors in a CV
3. **Construir CV (CV Builder)**: Step-by-step CV creation
4. **Simulador de Entrevista (Interview Simulator)**: Practice with audio

#### Difficulty Levels
- **PRE-TEST** (Easy): `questionsEasy` - 10 basic questions
- **POST-TEST** (Hard): `questionsHard` - 15 advanced questions

#### Configuration (CONFIG object)
```javascript
MAX_ATTEMPTS: 3             // Max attempts per test type
QUIZ_TIME_LIMIT: 900        // 15 minutes (seconds)
CV_ERRORS_TIME_LIMIT: 600   // 10 minutes
CV_BUILDER_TIME_LIMIT: 1200 // 20 minutes
PASSING_SCORE: 70           // Minimum passing score (%)
PRACTICE_MODE: false        // Enable unlimited attempts
```

### 3. Interview Simulator with AI Analysis
**Location**: `index.html` (lines 571-696)

#### Modes
1. **Options Mode**: Multiple choice answers
2. **Audio Mode**: Record voice responses

#### Audio Recording Features
- Start/stop recording controls
- Real-time transcription (Web Speech API)
- Audio playback
- Recording duration tracking

#### AI Analysis Metrics
- **Duration**: Ideal 30-90 seconds
- **Word Count**: Optimal 50-150 words
- **Keywords**: Detects competency-related terms
  - Responsabilidad (responsibility)
  - Trabajo en equipo (teamwork)
  - Liderazgo (leadership)
  - Resolución de problemas (problem solving)
  - Adaptabilidad (adaptability)
  - Profesionalismo (professionalism)
  - Comunicación (communication)
  - Iniciativa (initiative)
- **Fluency**: Detects filler words (eh, mmm, este, pues)
- **Scoring**: 0-100 automatic score with feedback

### 4. Avatar Creator PRO
**Location**: `index.html` (lines 866-1026)

#### DiceBear Integration
- **API Base URL**: `https://api.dicebear.com/7.x/`
- **Available Styles**:
  - `avataaars` (Popular)
  - `adventurer`
  - `avataaars-neutral`
  - `big-smile` (New)
  - `bottts` (Robots)
  - `personas`
  - `lorelei`
  - `micah`

#### Customization Options
- Style selection (8 styles)
- Custom seed (text-based generation)
- Background color (8 presets + transparent)
- Size (128px, 256px, 512px)
- Horizontal flip
- Export formats (SVG, PNG)

#### Storage
- Saved per user in LocalStorage
- Mini avatar displayed in navigation

### 5. Gamification System
**Location**: `index.html` (lines 697-864)

#### Elements
- **XP System**: Experience points for actions
- **Levels**: Progressive user levels
- **Badges**: Achievement system
- **Challenges**: Daily and weekly tasks
- **Leaderboard**: Global ranking
- **Streak**: Consecutive day tracking

#### Display Components
- Stats cards (Level, Rank, Badges, Streak)
- Progress bars (XP to next level)
- Challenge grids (daily/weekly)
- Podium visualization (top 3 users)
- Leaderboard table

### 6. Admin Dashboard
**Location**: `index.html` (lines 110-222)

#### Features
- User statistics overview
- Test completion metrics
- Average scores and times
- Search and filter functionality
- Export to Excel capability
- Real-time data refresh

#### Statistics Displayed
- Total users
- Tests completed
- Average score
- Average time

---

## 🔄 Application Flow

### Screen Navigation
**Function**: `showScreen(screenId)`

```
loginScreen (default)
    ├─> adminLoginScreen ─> adminDashboard
    └─> welcomeScreen
            ├─> testMenuScreen
            │       ├─> quizScreen ─> resultsScreen
            │       ├─> errorDetectionScreen ─> resultsScreen
            │       ├─> cvBuilderScreen ─> resultsScreen
            │       └─> interviewSimulatorScreen ─> resultsScreen
            ├─> progressScreen
            ├─> challengesScreen
            └─> avatarCreatorScreen
```

### Global State Variables
```javascript
currentUser           // Logged-in user object
currentTestType       // 'pre' or 'post'
currentQuizQuestion   // Current question index
quizAnswers          // Array of user answers
startTime            // Test start timestamp
timerInterval        // Timer reference
countdownInterval    // Countdown reference
currentDifficulty    // 'easy' or 'hard'
isPracticeMode       // Boolean flag
modalCallback        // Modal action callback
lastTestResult       // Last test result object
```

---

## 💾 Data Storage

### LocalStorage Schema

#### Users
```javascript
// Key: 'users'
[
  {
    name: string,
    lastName: string,
    email: string,
    phone: string,
    age: number,
    password: string,
    registeredAt: ISO8601 string
  }
]
```

#### Current Session
```javascript
// Key: 'currentUser'
{
  // Same structure as user object
}
```

#### Test Attempts
```javascript
// Key: 'attempts'
{
  "user@email.com": {
    "pre": number,
    "post": number
  }
}
```

#### Test Results
```javascript
// Key: 'testResults'
[
  {
    userName: string,
    userEmail: string,
    testName: string,
    testType: 'pre' | 'post',
    score: number,
    timeSpent: number,
    timestamp: ISO8601 string,
    passed: boolean
  }
]
```

#### Avatars
```javascript
// Key: 'userAvatars'
{
  "user@email.com": {
    style: string,
    seed: string,
    background: string,
    size: number,
    flip: boolean,
    url: string
  }
}
```

#### Other Keys
- `theme`: 'light' | 'dark'
- `gamificationData`: User XP, levels, badges
- `challenges`: Challenge completion status

---

## 🎨 Styling System

### CSS Variables (Design Tokens)
```css
--primary: #E86C4A      /* Coral */
--secondary: #F4A261    /* Light orange */
--accent: #2A9D8F       /* Teal */
--dark: #264653         /* Dark blue */
--white: #FFFFFF
--gray-100 to --gray-900  /* Gray scale */
```

### Component Classes

#### Buttons
- `.btn-submit` - Primary action buttons
- `.btn-logout` - Navigation/logout buttons
- `.btn-nav` - Quiz navigation buttons
- `.btn-action` - Dashboard action buttons

#### Cards
- `.login-card` - Authentication card
- `.test-card` - Test type selection cards
- `.stat-card` - Statistics display cards
- `.results-card` - Results display card

#### Layouts
- `.container` - Main content container (1400px max)
- `.container-narrow` - Narrow content (900px max)
- `.navbar` - Top navigation bar
- `.screen` - Full-screen view container

### Dark Theme
**Toggle Function**: `toggleTheme()`
- Class added to body: `.dark-theme`
- Persisted in LocalStorage
- Icon changes dynamically

---

## 🔧 Key Functions Reference

### Navigation
```javascript
showScreen(screenId)           // Switch between screens
goToWelcome()                 // Return to welcome screen
goToMenu()                    // Return to test menu
backToLogin()                 // Return to login
```

### Tests
```javascript
selectTest(type)              // Select pre/post test
startTest(testType)           // Start specific test
nextQuestion()                // Move to next quiz question
submitTest()                  // Submit and calculate results
showResults(score, time)      // Display results screen
```

### Interview Simulator
```javascript
switchInterviewMode(mode)     // Switch between options/audio
startRecording()              // Start audio recording
stopRecording()               // Stop and analyze recording
speakQuestion()               // Text-to-speech for question
analyzeAudioResponse(text)    // AI analysis of transcript
```

### Avatar
```javascript
changeAvatarStyle(style)      // Change DiceBear style
applyCustomSeed()             // Apply custom seed
randomizeAvatar()             // Generate random avatar
changeBackground(color)       // Change background color
changeSize(pixels)            // Change avatar size
toggleFlip()                  // Flip avatar horizontally
saveAvatarPro()              // Save avatar to LocalStorage
exportAvatar(format)          // Download SVG or PNG
```

### Utilities
```javascript
showToast(message, type)      // Show notification toast
showModal(message, callback)  // Show confirmation modal
closeModal()                  // Close modal
confirmAction()               // Execute modal callback
```

### Admin
```javascript
loadDashboardData()           // Load admin dashboard data
exportToExcel()               // Export data to Excel
refreshDashboard()            // Refresh dashboard stats
```

---

## 🚀 Development Conventions

### Code Style
1. **Language**: All user-facing text in Spanish
2. **Comments**: JavaScript comments in Spanish
3. **Naming**:
   - camelCase for variables and functions
   - PascalCase for constants/config
   - Descriptive Spanish names (e.g., `preguntaActual`, `tiempoRestante`)

### HTML Structure
- One `<div class="screen">` per view/page
- Only one screen has `.active` class at a time
- All screens included in single HTML file
- SVG icons embedded inline

### JavaScript Patterns
- Global state variables at top of file
- Functions grouped by feature (comments with `===`)
- Event listeners attached via `addEventListener`
- Async/await for API calls
- Try/catch for error handling

### CSS Organization
1. Variables and reset
2. Layout components (navbar, container)
3. Screen-specific styles
4. Component styles (buttons, cards)
5. Utility classes
6. Animations
7. Dark theme overrides
8. Media queries (responsive)

---

## 🔒 Security Considerations

### Current Implementation
⚠️ **Not production-ready**. Uses client-side only authentication.

#### Known Limitations
1. **Passwords in Plain Text**: Stored unencrypted in LocalStorage
2. **No Session Security**: No JWT or token-based auth
3. **Hardcoded Admin Credentials**: In source code
4. **Client-Side Validation Only**: No server verification
5. **CORS Mode**: Google Sheets uses `no-cors` mode

### Recommendations for Production
1. Implement backend authentication (Node.js, Python, etc.)
2. Use bcrypt or similar for password hashing
3. Implement JWT or session tokens
4. Move admin credentials to environment variables
5. Add HTTPS requirement
6. Implement rate limiting
7. Add CSRF protection
8. Sanitize all user inputs
9. Implement Content Security Policy

---

## 🧪 Testing Strategy

### Browser Compatibility
✅ **Supported**:
- Google Chrome 80+
- Microsoft Edge 80+
- Opera 67+

⚠️ **Limited Support**:
- Firefox (Web Speech API limitations)

❌ **Not Supported**:
- Safari (Web Speech API not fully supported)

### Required Permissions
- **Microphone**: For audio recording in interview simulator
- **Audio Playback**: For text-to-speech questions

### Testing Checklist for AI Assistants
When making changes, verify:
1. [ ] Login/registration flow works
2. [ ] All test types load correctly
3. [ ] Timer countdown functions properly
4. [ ] Results calculate accurately
5. [ ] LocalStorage data persists
6. [ ] Avatar creator generates images
7. [ ] Audio recording works (Chrome/Edge)
8. [ ] Admin dashboard displays data
9. [ ] Dark theme toggles correctly
10. [ ] Responsive layout on mobile

---

## 📊 Key Algorithms

### Quiz Scoring
```javascript
// Simple percentage calculation
score = (correctAnswers / totalQuestions) * 100
```

### Audio Analysis Scoring
```javascript
// Weighted scoring system
durationScore = normalizeToRange(duration, 30, 90)  // 30%
keywordScore = normalizeToRange(keywords, 3, 6)     // 35%
wordCountScore = normalizeToRange(words, 50, 150)   // 25%
fluencyScore = penalizeFillers(fillerCount)         // 10%

totalScore = (durationScore * 0.3) +
             (keywordScore * 0.35) +
             (wordCountScore * 0.25) +
             (fluencyScore * 0.1)

// Normalized to 0-100 range
```

### Attempt Limiting
```javascript
function canTakeTest(testType) {
    if (isPracticeMode) return true;
    return getAttempts(testType) < CONFIG.MAX_ATTEMPTS;
}
```

### Timer Countdown
```javascript
// Counts down from time limit to 0
// Updates DOM every second
// Auto-submits when reaching 0
```

---

## 🛠️ Common Tasks for AI Assistants

### Adding a New Test Type
1. Add button in test menu grid (line ~365 in `index.html`)
2. Create new screen div with class `screen`
3. Add navigation function in `script-pro.js`
4. Implement test logic
5. Connect to results screen

### Adding a New Question
1. Locate question arrays (`questionsEasy` or `questionsHard`)
2. Add object with structure:
```javascript
{
    q: "Question text in Spanish?",
    options: [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
    ],
    correct: 1  // 0-based index
}
```

### Modifying Score Calculation
1. Find `calculateScore()` or similar function
2. Update algorithm
3. Test with known inputs
4. Update threshold constants if needed

### Adding a New Avatar Style
1. Add style card in avatar gallery (line ~928)
2. Add click handler: `onclick="changeAvatarStyle('style-name')"`
3. Ensure DiceBear API supports the style
4. Test image generation

### Customizing Theme Colors
1. Modify CSS variables in `:root` (line 4-27 in `styles.css`)
2. Primary: `--primary`
3. Secondary: `--secondary`
4. Accent: `--accent`
5. Test both light and dark themes

### Adding a New Screen
1. Create `<div class="screen" id="newScreen">`
2. Add navigation logic
3. Add entry point button/link
4. Test navigation flow

---

## 🐛 Common Issues and Solutions

### Issue: Timer not stopping
**Solution**: Clear interval properly
```javascript
if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
}
```

### Issue: LocalStorage data lost
**Cause**: Browser privacy mode or storage quota exceeded
**Solution**:
- Check browser settings
- Implement data size limits
- Add error handling for quota exceeded

### Issue: Audio recording not working
**Causes**:
- Wrong browser (Safari)
- No microphone permission
- HTTP instead of HTTPS (required in production)

**Solution**:
- Test in Chrome/Edge
- Check browser console for permission errors
- Use HTTPS in production

### Issue: Avatar not loading
**Causes**:
- DiceBear API down
- Network error
- Invalid parameters

**Solution**:
- Check API URL structure
- Implement fallback placeholder
- Add error handling

### Issue: Modal not closing
**Cause**: Event bubbling or missing callback clear
**Solution**:
```javascript
function closeModal() {
    document.getElementById('confirmModal').style.display = 'none';
    modalCallback = null;  // Important!
}
```

---

## 🔄 Git Workflow

### Branch Naming
Follow pattern: `claude/description-sessionId`
Example: `claude/add-new-feature-abc123xyz`

### Commit Messages
Use Spanish and be descriptive:
- ✨ `Agregar nueva función X`
- 🐛 `Corregir error en Y`
- 🎨 `Mejorar diseño de Z`
- 📝 `Actualizar documentación`
- ♻️ `Refactorizar código de W`

### Development Branch
Currently working on: `claude/claude-md-mi504rvioxo0ribc-019Z9eoDJyRYrrm9YbyNeTB5`

---

## 📚 External Resources

### APIs Documentation
- **DiceBear**: https://www.dicebear.com/introduction
- **Web Speech API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- **MediaRecorder API**: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder

### Design Resources
- **Color Palette**: Warm tones (coral, orange, teal)
- **Typography**: Inter font family (Google Fonts)
- **Icons**: Inline SVG (Heroicons style)

### Future Integrations Planned
- **OpenAI Whisper**: More accurate transcription
- **Ready Player Me**: 3D avatars
- **Payment Gateway**: For premium features
- **Backend API**: Node.js/Express (planned)

---

## 🎯 AI Assistant Guidelines

### When Making Changes

#### DO:
- ✅ Keep all user-facing text in Spanish
- ✅ Maintain single-file architecture
- ✅ Test in Chrome/Edge browsers
- ✅ Preserve existing CSS variable names
- ✅ Follow established naming conventions
- ✅ Add comments for complex logic
- ✅ Update this CLAUDE.md file when adding features
- ✅ Test LocalStorage functionality
- ✅ Verify screen navigation flow

#### DON'T:
- ❌ Split into multiple HTML files without discussion
- ❌ Add dependencies without justification
- ❌ Break existing screen navigation
- ❌ Remove backward compatibility
- ❌ Ignore mobile responsiveness
- ❌ Hardcode new credentials
- ❌ Assume Safari compatibility
- ❌ Modify LocalStorage schema without migration plan

### Code Review Checklist
Before committing changes:
1. [ ] Code follows Spanish naming conventions
2. [ ] No console.log statements left in production code
3. [ ] Error handling implemented for async operations
4. [ ] UI changes tested in both light and dark themes
5. [ ] Mobile responsive design maintained
6. [ ] LocalStorage data structure documented
7. [ ] Comments added for complex logic
8. [ ] No security vulnerabilities introduced
9. [ ] Existing tests still pass
10. [ ] CLAUDE.md updated if new patterns introduced

### Communication Style
When interacting with the developer:
- Use technical but friendly language
- Explain trade-offs when suggesting alternatives
- Reference specific line numbers when discussing code
- Suggest improvements but respect existing architecture
- Ask clarifying questions when requirements are ambiguous

---

## 📈 Future Roadmap

### Short-term (Documented in NUEVAS_FUNCIONALIDADES.md)
- Complete freemium system
- Additional interview questions
- Plan comparison panel
- More avatar customization

### Medium-term
- Voice tone analysis (confidence, nervousness)
- Speech rate calculation (words per minute)
- PDF export for analysis
- Full interview history

### Long-term
- OpenAI integration for advanced analysis
- Ready Player Me 3D avatars
- Conversational AI interviewer
- Mobile app (React Native)

---

## 🤝 Contributing

### For AI Assistants
When implementing new features:
1. Read this entire CLAUDE.md first
2. Review NUEVAS_FUNCIONALIDADES.md for context
3. Check existing code patterns
4. Maintain consistency with current architecture
5. Update documentation
6. Test thoroughly
7. Provide clear commit messages

### For Human Developers
This CLAUDE.md is designed to help AI assistants understand the codebase quickly. Feel free to update it as the project evolves.

---

## 📞 Support and Questions

### For AI Assistants
If you encounter:
- Ambiguous requirements → Ask clarifying questions
- Architectural decisions → Explain options and trade-offs
- Security concerns → Flag immediately and suggest alternatives
- Breaking changes needed → Discuss with developer first

### Debug Mode
To enable verbose logging:
```javascript
// Add to CONFIG object
DEBUG: true

// Then throughout code:
if (CONFIG.DEBUG) console.log('Debug info:', data);
```

---

## 🎓 Learning Resources

For understanding this codebase:
1. **SPA Pattern**: https://developer.mozilla.org/en-US/docs/Glossary/SPA
2. **LocalStorage**: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
3. **CSS Custom Properties**: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
4. **Modern JavaScript**: https://javascript.info/
5. **Web APIs**: https://developer.mozilla.org/en-US/docs/Web/API

---

## 📝 Version History

- **v1.0** (Current): Initial comprehensive documentation
  - Complete codebase analysis
  - Architecture documentation
  - Development guidelines
  - AI assistant instructions

---

## 🏁 Quick Start for AI Assistants

1. **Understand the context**: Labor evaluation platform in Spanish
2. **Know the stack**: Vanilla HTML/CSS/JS + Browser APIs
3. **Recognize the pattern**: Single-page app with screen navigation
4. **Respect conventions**: Spanish text, camelCase naming, single-file architecture
5. **Test thoroughly**: Chrome/Edge, light/dark theme, mobile responsive
6. **Update docs**: Keep this file current with changes

---

**Last Updated**: 2025-11-18
**Maintained By**: Claude AI Assistant
**Project Status**: Active Development
**License**: Not specified (check with project owner)

---

*This document is designed to be comprehensive yet concise. If you're an AI assistant working on this project, read this file thoroughly before making changes. If something is unclear, ask questions rather than making assumptions.*
