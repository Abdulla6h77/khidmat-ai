const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, 'screens');
const previewsDir = path.join(__dirname, 'previews');

// Ensure previews directory exists
if (!fs.existsSync(previewsDir)) {
  fs.mkdirSync(previewsDir, { recursive: true });
}

// Design tokens to embed
const designTokens = {
  colors: {
    primary: "#1B5E20",
    primary_gradient: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)",
    secondary: "#2E7D32",
    accent: "#FFC107",
    background: "#F5F5F5",
    card_background: "#FFFFFF",
    error_dispute: "#D32F2F",
    success: "#388E3C",
    text_primary: "#212121",
    text_secondary: "#757575",
    divider: "#E0E0E0",
    shadow_color: "rgba(0, 0, 0, 0.08)"
  }
};

// Global CSS styles to be injected into all preview files
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+Arabic:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500;700;900&display=swap');
  
  :root {
    --primary: ${designTokens.colors.primary};
    --primary-gradient: ${designTokens.colors.primary_gradient};
    --secondary: ${designTokens.colors.secondary};
    --accent: ${designTokens.colors.accent};
    --background: ${designTokens.colors.background};
    --card: ${designTokens.colors.card_background};
    --error: ${designTokens.colors.error_dispute};
    --success: ${designTokens.colors.success};
    --text-primary: ${designTokens.colors.text_primary};
    --text-secondary: ${designTokens.colors.text_secondary};
    --divider: ${designTokens.colors.divider};
    --shadow: ${designTokens.colors.shadow_color};
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', 'Roboto', sans-serif;
    background-color: #121212;
    color: #e0e0e0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 24px;
    overflow-x: hidden;
  }

  /* Interactive Dashboard Shell */
  .dashboard-container {
    display: flex;
    width: 100%;
    max-width: 1100px;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    overflow: hidden;
  }

  .sidebar {
    width: 320px;
    padding: 32px 24px;
    background: rgba(0, 0, 0, 0.2);
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .sidebar-header h2 {
    font-size: 22px;
    font-weight: 800;
    color: #4CAF50;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sidebar-header p {
    font-size: 13px;
    color: #888;
    line-height: 1.4;
  }

  .screens-menu {
    list-style: none;
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .screens-menu a {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    color: #b0bec5;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    border: 1px solid transparent;
  }

  .screens-menu a:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }

  .screens-menu li.active a {
    background: rgba(76, 175, 80, 0.15);
    border-color: rgba(76, 175, 80, 0.3);
    color: #4CAF50;
    font-weight: 600;
  }

  .screens-menu-index {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
  }

  .screens-menu li.active .screens-menu-index {
    background: #4CAF50;
    color: #121212;
  }

  .sidebar-footer {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .sidebar-footer-title {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #666;
    margin-bottom: 8px;
  }

  .design-rules {
    font-size: 12px;
    color: #aaa;
    line-height: 1.5;
  }

  /* Phone Mockup Frame */
  .preview-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    position: relative;
  }

  .phone-frame {
    width: 375px;
    height: 812px;
    background: var(--background);
    border-radius: 48px;
    box-shadow: 0 0 0 12px #2b2b2b, 0 0 0 13px #3d3d3d, 0 20px 40px rgba(0,0,0,0.6);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    user-select: none;
  }

  /* Phone Notch & Speaker */
  .phone-notch {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 26px;
    background: #2b2b2b;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .phone-speaker {
    width: 40px;
    height: 4px;
    background: #111;
    border-radius: 2px;
    margin-bottom: 4px;
  }

  .phone-camera {
    width: 8px;
    height: 8px;
    background: #111;
    border-radius: 50%;
    position: absolute;
    right: 28px;
    top: 8px;
  }

  /* Phone Status Bar */
  .status-bar {
    height: 38px;
    background: transparent;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 24px 6px 24px;
    font-size: 12px;
    font-weight: 600;
    color: #212121;
    z-index: 999;
    position: relative;
  }

  .status-bar.dark-text {
    color: #212121;
  }

  .status-bar.light-text {
    color: #FFFFFF;
  }

  .status-bar-icons {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .status-bar-icon {
    font-size: 10px;
  }

  /* Interactive State Controller Overlay */
  .state-controller {
    position: absolute;
    right: 24px;
    top: 24px;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 1001;
    backdrop-filter: blur(10px);
  }

  .state-controller h4 {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #aaa;
    margin-bottom: 4px;
  }

  .state-btn {
    background: rgba(255,255,255,0.08);
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    text-align: left;
  }

  .state-btn:hover {
    background: rgba(255,255,255,0.15);
  }

  .state-btn.active {
    background: #4CAF50;
    color: #121212;
    font-weight: 600;
  }

  /* App Native Components Base styling */
  .app-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    background: var(--background);
    position: relative;
    padding-bottom: 60px; /* Space for Bottom Navigation */
  }

  .app-container::-webkit-scrollbar {
    display: none;
  }

  .bilingual-label {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .bilingual-label .en {
    font-family: 'Inter', sans-serif;
    font-weight: 500;
  }

  .bilingual-label .ur {
    font-family: 'Noto Sans Arabic', sans-serif;
    color: var(--text-secondary);
    direction: rtl;
    text-align: right;
  }

  /* Mode Selectors */
  body.mode-en .bilingual-label .ur { display: none !important; }
  body.mode-ur .bilingual-label .en { display: none !important; }
  body.mode-ur .bilingual-label .ur { text-align: left; direction: ltr; } /* Align cleanly in single mode */

  /* Common App Header */
  .app-bar {
    background: var(--card);
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--divider);
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  }

  .app-bar-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .back-btn {
    font-size: 20px;
    color: var(--primary);
    cursor: pointer;
    background: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .app-bar-title .en {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .app-bar-title .ur {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .lang-toggle-btn {
    font-size: 11px;
    font-weight: 700;
    color: var(--primary);
    border: 1px solid var(--primary);
    background: transparent;
    padding: 4px 10px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .lang-toggle-btn:hover {
    background: rgba(27, 94, 32, 0.05);
  }

  /* Bottom Navigation Bar */
  .app-bottom-nav {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: #FFFFFF;
    border-top: 1px solid var(--divider);
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 100;
  }

  .app-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: var(--text-secondary);
    gap: 4px;
    flex: 1;
    height: 100%;
    transition: all 0.2s;
  }

  .app-nav-item i {
    font-size: 18px;
  }

  .app-nav-item span {
    font-size: 10px;
    font-weight: 500;
  }

  .app-nav-item.active {
    color: var(--primary);
  }

  .app-nav-item.active span {
    font-weight: 700;
  }

  /* Material Icons Helper */
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
  
  .material-icons {
    font-family: 'Material Icons' !important;
    font-style: normal;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
    -webkit-font-smoothing: antialiased;
    display: inline-block;
  }
`;

// Left Sidebar generation function
function getSidebarHtml(activeIndex) {
  const screens = [
    { name: "01_home.html", title: "HomeScreen" },
    { name: "02_providers.html", title: "ProvidersScreen" },
    { name: "03_detail.html", title: "ProviderDetailScreen" },
    { name: "04_booking_confirmation.html", title: "BookingConfirmationScreen" },
    { name: "05_follow_up.html", title: "FollowUpScreen" },
    { name: "06_agent_trace.html", title: "AgentTraceScreen" },
    { name: "07_dispute.html", title: "DisputeScreen" },
    { name: "08_compare.html", title: "BaselineCompareScreen" }
  ];

  return `
    <div class="sidebar">
      <div class="sidebar-header">
        <h2><i class="material-icons">dashboard</i> KhidmatAI</h2>
        <p>Bilingual AI-powered home service marketplace UI preview showcase.</p>
        <ul class="screens-menu">
          ${screens.map((s, idx) => `
            <li class="${idx + 1 === activeIndex ? 'active' : ''}">
              <a href="${s.name}">
                <span class="screens-menu-index">${idx + 1}</span>
                <span>${s.title}</span>
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
      <div class="sidebar-footer">
        <div class="sidebar-footer-title">Bilingual Design Rules</div>
        <p class="design-rules">
          1. Englishstacked on top, Urdu translation directly below.<br>
          2. Language Toggle in Header simulates localized user contexts.<br>
          3. Minimal, clean Careem-inspired geometry and soft gradients.
        </p>
      </div>
    </div>
  `;
}

// Top Status Bar component
function getStatusBarHtml(isLight) {
  return `
    <div class="status-bar ${isLight ? 'light-text' : 'dark-text'}">
      <span>15:00</span>
      <div class="status-bar-icons">
        <i class="material-icons status-bar-icon">signal_cellular_4_bar</i>
        <i class="material-icons status-bar-icon">wifi</i>
        <i class="material-icons status-bar-icon">battery_full</i>
      </div>
    </div>
  `;
}

// Global script block
const globalScripts = `
  function toggleLanguage() {
    const currentMode = document.body.className;
    if (currentMode === '') {
      document.body.className = 'mode-en';
      updateLangBtnText('ENGLISH');
    } else if (currentMode === 'mode-en') {
      document.body.className = 'mode-ur';
      updateLangBtnText('اردو');
    } else {
      document.body.className = '';
      updateLangBtnText('EN / اردو');
    }
  }

  function updateLangBtnText(text) {
    const btns = document.querySelectorAll('.lang-toggle-btn');
    btns.forEach(btn => btn.innerText = text);
  }

  // Inject language click event automatically
  document.addEventListener('DOMContentLoaded', () => {
    const btns = document.querySelectorAll('.lang-toggle-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', toggleLanguage);
    });
  });
`;

// Helper to write file
function writePreviewFile(fileName, htmlContent) {
  const filePath = path.join(previewsDir, fileName);
  let processedContent = htmlContent;
  if (fileName.endsWith('.html') && fileName !== 'index.html') {
    processedContent = htmlContent.replace('</head>', `
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+Arabic:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet">
</head>`);
  }
  fs.writeFileSync(filePath, processedContent, 'utf8');
}

// Generate screen 1: HomeScreen
const screen1 = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KhidmatAI HomeScreen Preview</title>
  <style>
    ${globalStyles}
    
    /* HomeScreen CSS overrides */
    .home-header {
      background: var(--primary-gradient);
      padding: 12px 20px 48px 20px;
      color: #fff;
    }
    
    .home-header h1 {
      font-size: 24px;
      font-weight: 800;
      line-height: 1.3;
    }
    .home-header h2 {
      font-family: 'Noto Sans Arabic', sans-serif;
      font-size: 20px;
      font-weight: 500;
      color: #E8F5E9;
      margin-top: 6px;
      direction: rtl;
    }
    
    .search-card {
      background: #FFFFFF;
      border-radius: 12px;
      margin: -24px 16px 16px 16px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      box-shadow: 0 8px 24px rgba(0,0,0,0.06);
      gap: 12px;
      border: 1px solid var(--divider);
      position: relative;
      z-index: 10;
    }
    
    .search-card i {
      color: var(--text-secondary);
      font-size: 20px;
    }
    
    .search-card-inputs {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .search-card-inputs input {
      border: none;
      outline: none;
      font-size: 14px;
      font-family: inherit;
      color: var(--text-primary);
    }
    
    .search-card-inputs .placeholder-ur {
      font-family: 'Noto Sans Arabic', sans-serif;
      font-size: 12px;
      color: #9E9E9E;
      direction: rtl;
      text-align: right;
    }

    /* Scrollable chips */
    .category-scroll {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding: 8px 16px 16px 16px;
      scrollbar-width: none;
    }
    
    .category-scroll::-webkit-scrollbar {
      display: none;
    }
    
    .cat-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #fff;
      border: 1.5px solid var(--divider);
      padding: 8px 14px;
      border-radius: 20px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    
    .cat-chip.selected {
      border-color: var(--primary);
      background: rgba(27, 94, 32, 0.05);
      color: var(--primary);
      font-weight: 700;
    }
    
    .cat-chip-icon {
      font-size: 16px;
    }

    .cat-chip-labels {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .cat-chip-labels .en {
      font-size: 12px;
    }
    .cat-chip-labels .ur {
      font-family: 'Noto Sans Arabic', sans-serif;
      font-size: 10px;
    }

    /* Recent request section */
    .section-title {
      padding: 8px 16px;
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary);
    }
    
    .recent-card {
      background: #fff;
      border: 1.5px solid var(--divider);
      border-radius: 12px;
      margin: 8px 16px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    }
    
    .recent-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #E8F5E9;
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    
    .recent-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .recent-title .en {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-primary);
    }
    .recent-title .ur {
      font-family: 'Noto Sans Arabic', sans-serif;
      font-size: 12px;
      color: var(--text-secondary);
    }
    
    .status-badge {
      display: inline-block;
      background: #FFF9C4;
      border: 1px solid #FFF59D;
      color: #F57F17;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 12px;
      margin-top: 6px;
      width: max-content;
    }

    .status-badge .ur {
      font-family: 'Noto Sans Arabic', sans-serif;
      font-weight: 500;
      font-size: 10px;
    }
    
    .find-btn {
      background: var(--primary);
      border: none;
      color: #fff;
      font-weight: 700;
      font-size: 16px;
      height: 50px;
      border-radius: 12px;
      margin: 24px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(27, 94, 32, 0.3);
      transition: all 0.2s;
    }
    
    .find-btn:hover {
      background: #154c19;
    }
  </style>
</head>
<body>
  <div class="dashboard-container">
    ${getSidebarHtml(1)}
    
    <div class="preview-area">
      <!-- Phone Frame Mockup -->
      <div class="phone-frame">
        <div class="phone-notch">
          <div class="phone-speaker"></div>
        </div>
        ${getStatusBarHtml(true)}
        
        <div class="app-container">
          <!-- AppBar -->
          <div class="app-bar" style="background: var(--primary-gradient); border-bottom: none; padding-top: 8px;">
            <div class="app-bar-left">
              <div class="app-bar-title">
                <span class="en" style="color: #fff; font-size: 18px;">KhidmatAI</span>
                <span class="ur" style="color: #E8F5E9; font-size: 13px; display: block; margin-top: 2px;">خدمت اے آئی</span>
              </div>
            </div>
            <button class="lang-toggle-btn" style="color: #fff; border-color: rgba(255,255,255,0.4);">EN / اردو</button>
          </div>
          
          <!-- Welcome Section -->
          <div class="home-header">
            <h1 class="en">What service do you need?</h1>
            <h2 class="ur">آپ کو کون سی سروس چاہیے؟</h2>
          </div>
          
          <!-- Search Card -->
          <div class="search-card">
            <i class="material-icons">search</i>
            <div class="search-card-inputs">
              <input type="text" class="en" placeholder="Search plumbing, AC, cleaning..." readonly>
              <div class="placeholder-ur ur">صفائی، پلمبر، اے سی سروس تلاش کریں...</div>
            </div>
            <i class="material-icons" style="color: var(--primary); cursor: pointer;">mic</i>
          </div>
          
          <!-- Categories Scroll -->
          <div class="section-title">
            <div class="bilingual-label">
              <span class="en">Services</span>
              <span class="ur">خدمات</span>
            </div>
          </div>
          
          <div class="category-scroll">
            <div class="cat-chip">
              <span class="cat-chip-icon">🔧</span>
              <div class="cat-chip-labels">
                <span class="en">AC Tech</span>
                <span class="ur">اے سی</span>
              </div>
            </div>
            <div class="cat-chip selected">
              <span class="cat-chip-icon">🔨</span>
              <div class="cat-chip-labels">
                <span class="en">Plumber</span>
                <span class="ur">پلمبر</span>
              </div>
            </div>
            <div class="cat-chip">
              <span class="cat-chip-icon">⚡</span>
              <div class="cat-chip-labels">
                <span class="en">Electrician</span>
                <span class="ur">الیکٹریشن</span>
              </div>
            </div>
            <div class="cat-chip">
              <span class="cat-chip-icon">🏠</span>
              <div class="cat-chip-labels">
                <span class="en">Cleaner</span>
                <span class="ur">صفائی</span>
              </div>
            </div>
          </div>
          
          <!-- Recent Requests -->
          <div class="section-title" style="margin-top: 8px;">
            <div class="bilingual-label">
              <span class="en">Recent Request</span>
              <span class="ur">حالیہ درخواستیں</span>
            </div>
          </div>
          
          <div class="recent-card">
            <div class="recent-avatar">🔨</div>
            <div class="recent-details">
              <div class="recent-title">
                <span class="en">Plumber Needed in F-8</span>
                <span class="ur">F-8 میں پلمبر کی ضرورت ہے</span>
              </div>
              <div class="status-badge">
                <span class="en">Standardizing Booking Formats</span>
                <span class="ur">بکنگ فارمیٹ کو ترتیب دیا جا رہا ہے</span>
              </div>
            </div>
            <i class="material-icons" style="color: #BDBDBD;">chevron_right</i>
          </div>
          
          <!-- Find Service button -->
          <button class="find-btn" onclick="location.href='02_providers.html'">
            <div class="bilingual-label" style="align-items: center; gap: 0;">
              <span class="en" style="color:#fff;">Find Service</span>
              <span class="ur" style="color:#E8F5E9; font-size:12px;">سروس تلاش کریں</span>
            </div>
          </button>
          
          <!-- Bottom Navigation -->
          <div class="app-bottom-nav">
            <a href="01_home.html" class="app-nav-item active">
              <i class="material-icons">home</i>
              <span>ہوم / Home</span>
            </a>
            <a href="02_providers.html" class="app-nav-item">
              <i class="material-icons">people</i>
              <span>پلمبرز / Providers</span>
            </a>
            <a href="06_agent_trace.html" class="app-nav-item">
              <i class="material-icons">analytics</i>
              <span>ٹریس / AI Trace</span>
            </a>
            <a href="08_compare.html" class="app-nav-item">
              <i class="material-icons">compare_arrows</i>
              <span>موازنہ / Compare</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    ${globalScripts}
  </script>
</body>
</html>
`;
writePreviewFile('01_home.html', screen1);

// Generate screen 2: ProvidersScreen
const screen2 = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KhidmatAI ProvidersScreen Preview</title>
  <style>
    ${globalStyles}
    
    /* Providers CSS */
    .amber-alert {
      background: var(--accent);
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #212121;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
    
    .amber-alert i {
      font-size: 20px;
    }
    
    .sort-scroll {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 12px 16px;
      scrollbar-width: none;
    }
    
    .sort-scroll::-webkit-scrollbar {
      display: none;
    }
    
    .sort-chip {
      background: #fff;
      border: 1px solid var(--divider);
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
      transition: all 0.2s;
    }
    
    .sort-chip.selected {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
      font-weight: 700;
    }
    
    .providers-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 4px 16px 80px 16px;
    }
    
    .provider-card {
      background: #fff;
      border-radius: 12px;
      border: 1.5px solid var(--divider);
      padding: 16px;
      display: flex;
      gap: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
      cursor: pointer;
      transition: border-color 0.2s;
    }
    
    .provider-card:hover {
      border-color: var(--primary);
    }
    
    .provider-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #C8E6C9;
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
    }
    
    .provider-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .provider-name {
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary);
    }
    
    .provider-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--text-secondary);
    }
    
    .rating-star {
      color: #FFC107;
      display: flex;
      align-items: center;
      gap: 2px;
      font-weight: 700;
    }
    
    .price-tag {
      font-size: 16px;
      font-weight: 800;
      color: var(--primary);
      text-align: right;
    }
    
    .availability-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      width: max-content;
      margin-top: 4px;
    }
    
    .availability-badge.green {
      background: #E8F5E9;
      color: #388E3C;
    }
    
    .availability-badge.orange {
      background: #FFF3E0;
      color: #E65100;
    }
    
    .availability-badge i {
      font-size: 10px;
    }
    
    .sticky-footer-btn {
      position: absolute;
      bottom: 60px;
      left: 0;
      right: 0;
      background: #fff;
      padding: 12px 16px;
      border-top: 1px solid var(--divider);
      display: flex;
      justify-content: center;
      z-index: 90;
    }
    
    .compare-btn {
      width: 100%;
      height: 46px;
      background: var(--primary);
      border: none;
      color: #fff;
      font-weight: 700;
      font-size: 15px;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(27, 94, 32, 0.2);
    }
  </style>
</head>
<body>
  <div class="dashboard-container">
    ${getSidebarHtml(2)}
    
    <div class="preview-area">
      <!-- Phone Frame Mockup -->
      <div class="phone-frame">
        <div class="phone-notch">
          <div class="phone-speaker"></div>
        </div>
        ${getStatusBarHtml(false)}
        
        <div class="app-container">
          <!-- AppBar -->
          <div class="app-bar">
            <div class="app-bar-left">
              <button class="back-btn" onclick="location.href='01_home.html'"><i class="material-icons">arrow_back</i></button>
              <div class="app-bar-title">
                <span class="en">3 Plumbers found in F-8</span>
                <span class="ur">F-8 میں 3 پلمبر ملے</span>
              </div>
            </div>
            <button class="lang-toggle-btn">EN / اردو</button>
          </div>
          
          <!-- Amber Suggestion Banner -->
          <div class="amber-alert">
            <i class="material-icons">info_outline</i>
            <div class="bilingual-label">
              <span class="en" style="color: #212121;">Sham not available. Showing nearest: 3 PM</span>
              <span class="ur" style="color: #424242;">شام دستیاب نہیں۔ قریب ترین: 3 بجے</span>
            </div>
          </div>
          
          <!-- Sort Row -->
          <div class="sort-scroll">
            <div class="sort-chip selected">
              <i class="material-icons">directions_car</i>
              <div class="bilingual-label">
                <span class="en">Distance</span>
                <span class="ur">فاصلہ</span>
              </div>
            </div>
            <div class="sort-chip">
              <div class="bilingual-label">
                <span class="en">Rating</span>
                <span class="ur">درجہ بندی</span>
              </div>
            </div>
            <div class="sort-chip">
              <div class="bilingual-label">
                <span class="en">Price</span>
                <span class="ur">قیمت</span>
              </div>
            </div>
          </div>
          
          <!-- Providers List -->
          <div class="providers-list">
            <!-- Tariq Mahmood -->
            <div class="provider-card" onclick="location.href='03_detail.html'">
              <div class="provider-avatar">TM</div>
              <div class="provider-details">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <span class="provider-name">Tariq Mahmood</span>
                  <span class="price-tag">PKR 1,360</span>
                </div>
                <div class="provider-meta">
                  <span class="rating-star"><i class="material-icons">star</i> 4.8</span>
                  <span>•</span>
                  <span>120 reviews</span>
                  <span>•</span>
                  <span style="font-weight: 700; color: var(--primary);">1.2 km</span>
                </div>
                <div class="availability-badge green">
                  <i class="material-icons">check_circle</i>
                  <div class="bilingual-label">
                    <span class="en">Available 3 PM</span>
                    <span class="ur">دستیاب ٣ بجے</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Sajid Ali -->
            <div class="provider-card" onclick="location.href='03_detail.html'">
              <div class="provider-avatar" style="background:#FFE0B2; color:#E65100;">SA</div>
              <div class="provider-details">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <span class="provider-name">Sajid Ali</span>
                  <span class="price-tag">PKR 1,200</span>
                </div>
                <div class="provider-meta">
                  <span class="rating-star"><i class="material-icons">star</i> 4.5</span>
                  <span>•</span>
                  <span>80 reviews</span>
                  <span>•</span>
                  <span style="font-weight: 700; color: var(--primary);">2.5 km</span>
                </div>
                <div class="availability-badge orange">
                  <i class="material-icons">schedule</i>
                  <div class="bilingual-label">
                    <span class="en">Next Available: 4 PM</span>
                    <span class="ur">دستیاب ٤ بجے</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Muhammad Rafiq -->
            <div class="provider-card" onclick="location.href='03_detail.html'">
              <div class="provider-avatar" style="background:#FFE0B2; color:#E65100;">MR</div>
              <div class="provider-details">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <span class="provider-name">Muhammad Rafiq</span>
                  <span class="price-tag">PKR 1,150</span>
                </div>
                <div class="provider-meta">
                  <span class="rating-star"><i class="material-icons">star</i> 4.2</span>
                  <span>•</span>
                  <span>45 reviews</span>
                  <span>•</span>
                  <span style="font-weight: 700; color: var(--primary);">3.8 km</span>
                </div>
                <div class="availability-badge orange">
                  <i class="material-icons">schedule</i>
                  <div class="bilingual-label">
                    <span class="en">Next Available: 5 PM</span>
                    <span class="ur">دستیاب ٥ بجے</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Sticky compare footer button -->
          <div class="sticky-footer-btn">
            <button class="compare-btn" onclick="location.href='08_compare.html'">
              <div class="bilingual-label" style="align-items: center; gap: 0;">
                <span class="en" style="color:#fff;">Compare Providers</span>
                <span class="ur" style="color:#E8F5E9; font-size:12px;">فراہم کنندگان کا موازنہ</span>
              </div>
            </button>
          </div>
          
          <!-- Bottom Navigation -->
          <div class="app-bottom-nav">
            <a href="01_home.html" class="app-nav-item">
              <i class="material-icons">home</i>
              <span>ہوم / Home</span>
            </a>
            <a href="02_providers.html" class="app-nav-item active">
              <i class="material-icons">people</i>
              <span>پلمبرز / Providers</span>
            </a>
            <a href="06_agent_trace.html" class="app-nav-item">
              <i class="material-icons">analytics</i>
              <span>ٹریس / AI Trace</span>
            </a>
            <a href="08_compare.html" class="app-nav-item">
              <i class="material-icons">compare_arrows</i>
              <span>موازنہ / Compare</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    ${globalScripts}
  </script>
</body>
</html>
`;
writePreviewFile('02_providers.html', screen2);

// Generate screen 3: ProviderDetailScreen
const screen3 = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KhidmatAI ProviderDetailScreen Preview</title>
  <style>
    ${globalStyles}
    
    /* Detail screen styles */
    .profile-hero {
      background: #FFFFFF;
      padding: 24px 16px 16px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-bottom: 1px solid var(--divider);
    }
    
    .large-avatar {
      width: 76px;
      height: 76px;
      border-radius: 50%;
      background: #C8E6C9;
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      font-weight: 800;
      box-shadow: 0 4px 12px rgba(27,94,32,0.1);
    }
    
    .profile-name-en {
      font-size: 22px;
      font-weight: 800;
      color: var(--text-primary);
      margin-top: 12px;
    }
    .profile-name-ur {
      font-family: 'Noto Sans Arabic', sans-serif;
      font-size: 18px;
      font-weight: 500;
      color: var(--text-secondary);
      margin-top: 2px;
    }
    
    .detail-tag-row {
      display: flex;
      gap: 6px;
      margin-top: 12px;
    }
    
    .detail-tag {
      background: var(--background);
      border: 1px solid var(--divider);
      border-radius: 20px;
      padding: 6px 12px;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-primary);
    }
    
    .stats-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      padding: 16px;
    }
    
    .stat-box {
      background: #fff;
      border-radius: 12px;
      border: 1px solid var(--divider);
      padding: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.01);
    }
    
    .stat-value {
      font-size: 20px;
      font-weight: 800;
      color: var(--primary);
    }
    
    .stat-label-en {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-top: 4px;
    }
    .stat-label-ur {
      font-family: 'Noto Sans Arabic', sans-serif;
      font-size: 10px;
      color: #9E9E9E;
    }
    
    .slots-section {
      padding: 0 16px;
    }
    
    .section-subtitle {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 8px;
    }
    
    .slots-row {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 4px 0 12px 0;
      scrollbar-width: none;
    }
    
    .slots-row::-webkit-scrollbar { display: none; }
    
    .slot-chip {
      background: #fff;
      border: 1.5px solid var(--divider);
      border-radius: 10px;
      padding: 10px 16px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      min-width: 70px;
    }
    
    .slot-chip.selected {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
      box-shadow: 0 4px 10px rgba(27,94,32,0.2);
    }
    
    .price-card {
      background: #fff;
      border: 1px solid var(--divider);
      border-radius: 12px;
      margin: 16px;
      padding: 16px;
    }
    
    .price-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }
    
    .price-row.total {
      border-top: 1.5px dashed var(--divider);
      margin-top: 12px;
      padding-top: 12px;
      font-size: 15px;
      font-weight: 800;
      color: var(--text-primary);
    }
    
    .ai-purple-card {
      background: #F3E5F5;
      border: 1.5px solid #E1BEE7;
      border-radius: 12px;
      margin: 0 16px 80px 16px;
      padding: 16px;
      display: flex;
      gap: 12px;
    }
    
    .ai-purple-card i {
      color: #8E24AA;
      font-size: 24px;
    }
    
    .ai-purple-title {
      font-size: 13px;
      font-weight: 700;
      color: #8E24AA;
    }
    .ai-purple-desc {
      font-size: 12px;
      color: #4A148C;
      line-height: 1.4;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="dashboard-container">
    ${getSidebarHtml(3)}
    
    <div class="preview-area">
      <!-- Phone Frame Mockup -->
      <div class="phone-frame">
        <div class="phone-notch">
          <div class="phone-speaker"></div>
        </div>
        ${getStatusBarHtml(false)}
        
        <div class="app-container">
          <!-- AppBar -->
          <div class="app-bar">
            <div class="app-bar-left">
              <button class="back-btn" onclick="location.href='02_providers.html'"><i class="material-icons">arrow_back</i></button>
              <div class="app-bar-title">
                <span class="en">Provider Profile</span>
                <span class="ur">پروفائل فراہم کنندہ</span>
              </div>
            </div>
            <button class="lang-toggle-btn">EN / اردو</button>
          </div>
          
          <!-- Hero section -->
          <div class="profile-hero">
            <div class="large-avatar">TM</div>
            <div class="profile-name-en">Tariq Mahmood</div>
            <div class="profile-name-ur">طارق محمود</div>
            <div class="detail-tag-row">
              <span class="detail-tag">🔧 Plumber / پلمبر</span>
              <span class="detail-tag">⚡ Leakage Expert</span>
            </div>
          </div>
          
          <!-- Quick stats grid -->
          <div class="stats-container">
            <div class="stat-box">
              <span class="stat-value" style="color: var(--accent);">4.8 ⭐</span>
              <span class="stat-label-en">Rating</span>
              <span class="stat-label-ur">درجہ بندی</span>
            </div>
            <div class="stat-box">
              <span class="stat-value">120</span>
              <span class="stat-label-en">Reviews</span>
              <span class="stat-label-ur">جائزے</span>
            </div>
            <div class="stat-box">
              <span class="stat-value">98%</span>
              <span class="stat-label-en">On-Time %</span>
              <span class="stat-label-ur">وقت پرآمد</span>
            </div>
            <div class="stat-box">
              <span class="stat-value" style="color: var(--error);">1.2%</span>
              <span class="stat-label-en">Cancel Rate</span>
              <span class="stat-label-ur">منسوخی شرح</span>
            </div>
          </div>
          
          <!-- Select availability slots -->
          <div class="slots-section">
            <div class="section-subtitle">
              <div class="bilingual-label">
                <span class="en">Select Availability Slot</span>
                <span class="ur">دستیاب وقت کا انتخاب کریں</span>
              </div>
            </div>
            <div class="slots-row">
              <div class="slot-chip">1 PM</div>
              <div class="slot-chip">2 PM</div>
              <div class="slot-chip selected">3 PM</div>
              <div class="slot-chip">4 PM</div>
              <div class="slot-chip">5 PM</div>
            </div>
          </div>
          
          <!-- Price breakdown card -->
          <div class="price-card">
            <div class="section-subtitle" style="margin-bottom: 12px;">
              <div class="bilingual-label">
                <span class="en">Price Breakdown</span>
                <span class="ur">قیمت کی تفصیل</span>
              </div>
            </div>
            
            <div class="price-row">
              <div class="bilingual-label">
                <span class="en">Base Service</span>
                <span class="ur">بنیادی سروس</span>
              </div>
              <span style="font-weight: 600;">PKR 1,300</span>
            </div>
            <div class="price-row">
              <div class="bilingual-label">
                <span class="en">Distance Fee</span>
                <span class="ur">فاصلہ چارجز</span>
              </div>
              <span style="font-weight: 600; color: var(--primary);">+ PKR 60</span>
            </div>
            <div class="price-row">
              <div class="bilingual-label">
                <span class="en">Urgency Multiplier</span>
                <span class="ur">جلدی گتانک</span>
              </div>
              <span style="font-weight: 600;">x 1.0</span>
            </div>
            
            <div class="price-row total">
              <div class="bilingual-label">
                <span class="en" style="font-weight: 800;">Total Price</span>
                <span class="ur" style="font-weight: 700; color: var(--text-secondary);">کل قیمت</span>
              </div>
              <span style="font-size: 18px; font-weight: 900; color: var(--primary);">PKR 1,360</span>
            </div>
          </div>
          
          <!-- AI Agent reasoning card -->
          <div class="ai-purple-card">
            <i class="material-icons">psychology</i>
            <div>
              <div class="ai-purple-title">
                <div class="bilingual-label">
                  <span class="en">AI Agent Matching Reasoning</span>
                  <span class="ur">اے آئی ایجنٹ کے انتخاب کی وجہ</span>
                </div>
              </div>
              <div class="ai-purple-desc">
                <div class="bilingual-label">
                  <span class="en">Tariq is chosen because of 1.2km distance, highest rating 4.8, and 3 PM availability match.</span>
                  <span class="ur">طارق کا انتخاب اس لیے کیا گیا کیونکہ فاصلہ کم ہے، سب سے زیادہ درجہ بندی ہے، اور ٣ بجے دستیاب ہے۔</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Persistent footer bar -->
          <div class="sticky-footer-btn">
            <button class="compare-btn" onclick="location.href='04_booking_confirmation.html'">
              <div class="bilingual-label" style="align-items: center; gap: 0;">
                <span class="en" style="color:#fff;">Book Now</span>
                <span class="ur" style="color:#E8F5E9; font-size:12px;">ابھی بک کریں</span>
              </div>
            </button>
          </div>
          
          <!-- Bottom Navigation -->
          <div class="app-bottom-nav">
            <a href="01_home.html" class="app-nav-item">
              <i class="material-icons">home</i>
              <span>ہوم / Home</span>
            </a>
            <a href="02_providers.html" class="app-nav-item active">
              <i class="material-icons">people</i>
              <span>پلمبرز / Providers</span>
            </a>
            <a href="06_agent_trace.html" class="app-nav-item">
              <i class="material-icons">analytics</i>
              <span>ٹریس / AI Trace</span>
            </a>
            <a href="08_compare.html" class="app-nav-item">
              <i class="material-icons">compare_arrows</i>
              <span>موازنہ / Compare</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    ${globalScripts}
  </script>
</body>
</html>
`;
writePreviewFile('03_detail.html', screen3);

// Generate screen 4: BookingConfirmationScreen
const screen4 = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KhidmatAI BookingConfirmationScreen Preview</title>
  <style>
    ${globalStyles}
    
    /* Confirmation screen CSS */
    .success-hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 16px 16px 16px;
    }
    
    .checkmark-container {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #E8F5E9;
      color: var(--success);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pop 0.4s ease-out;
    }
    
    .checkmark-container i {
      font-size: 48px;
    }
    
    @keyframes pop {
      0% { transform: scale(0.6); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    .confirm-title-en {
      font-size: 22px;
      font-weight: 800;
      color: var(--primary);
      margin-top: 12px;
    }
    .confirm-title-ur {
      font-family: 'Noto Sans Arabic', sans-serif;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-top: 2px;
    }
    
    .receipt-card {
      background: #fff;
      border-radius: 12px;
      border: 1px solid var(--divider);
      margin: 16px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.02);
    }
    
    .code-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: var(--text-secondary);
    }
    
    .receipt-code {
      font-size: 40px;
      font-weight: 900;
      color: var(--accent);
      margin: 6px 0 16px 0;
      letter-spacing: 1px;
    }
    
    .receipt-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-top: 1px solid var(--divider);
    }
    
    .receipt-row i {
      color: var(--text-secondary);
      font-size: 20px;
    }
    
    .whatsapp-container {
      background: #ECE5DD;
      border-radius: 12px;
      margin: 16px;
      padding: 16px;
      border: 1px solid #E0D4C5;
      position: relative;
    }
    
    .whatsapp-title {
      font-size: 11px;
      font-weight: 700;
      color: #075E54;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
    }
    
    .whatsapp-bubble {
      background: #DCF8C6;
      border-radius: 12px;
      border-top-left-radius: 0;
      padding: 10px 12px;
      color: #303030;
      font-size: 12px;
      line-height: 1.4;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    
    .double-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      margin-bottom: 80px;
    }
    
    .track-btn {
      background: var(--primary);
      color: #fff;
      border: none;
      height: 48px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(27,94,32,0.2);
    }
    
    .trace-btn {
      background: transparent;
      border: 1.5px solid var(--primary);
      color: var(--primary);
      height: 48px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div class="dashboard-container">
    ${getSidebarHtml(4)}
    
    <div class="preview-area">
      <!-- Phone Frame Mockup -->
      <div class="phone-frame">
        <div class="phone-notch">
          <div class="phone-speaker"></div>
        </div>
        ${getStatusBarHtml(false)}
        
        <div class="app-container">
          <!-- AppBar -->
          <div class="app-bar">
            <div class="app-bar-left">
              <button class="back-btn" onclick="location.href='03_detail.html'"><i class="material-icons">arrow_back</i></button>
              <div class="app-bar-title">
                <span class="en">Booking Confirmed</span>
                <span class="ur">بکنگ کی تصدیق ہو گئی</span>
              </div>
            </div>
            <button class="lang-toggle-btn">EN / اردو</button>
          </div>
          
          <!-- Success Hero Header -->
          <div class="success-hero">
            <div class="checkmark-container">
              <i class="material-icons">check_circle</i>
            </div>
            <div class="confirm-title-en">Booking Confirmed!</div>
            <div class="confirm-title-ur">بکنگ کی تصدیق ہو گئی!</div>
          </div>
          
          <!-- Booking Receipt Card -->
          <div class="receipt-card">
            <div class="code-title">
              <div class="bilingual-label">
                <span class="en">Confirmation Code</span>
                <span class="ur">تصدیقی کوڈ</span>
              </div>
            </div>
            <div class="receipt-code">526377</div>
            
            <div class="receipt-row">
              <div class="provider-avatar" style="width:36px; height:36px; font-size:13px;">TM</div>
              <div style="flex:1;">
                <div class="bilingual-label">
                  <span class="en" style="font-size:13px; font-weight:700;">Tariq Mahmood (Plumber)</span>
                  <span class="ur" style="font-size:11px;">طارق محمود (پلمبر)</span>
                </div>
              </div>
            </div>
            
            <div class="receipt-row">
              <i class="material-icons">schedule</i>
              <div class="bilingual-label">
                <span class="en" style="font-size:13px; font-weight:700;">Today, 3:00 PM</span>
                <span class="ur" style="font-size:11px;">آج، ٣ بجے</span>
              </div>
            </div>
            
            <div class="receipt-row">
              <i class="material-icons">payment</i>
              <div class="bilingual-label">
                <span class="en" style="font-size:13px; font-weight:700;">Paid Total: PKR 1,360</span>
                <span class="ur" style="font-size:11px;">کل رقم: ١،٣٦٠ روپے</span>
              </div>
            </div>
            
            <div style="font-size:10px; color:#9E9E9E; margin-top:12px; font-weight:700;">
              ID: BK-2026-98B50E
            </div>
          </div>
          
          <!-- WhatsApp Notification bubble preview -->
          <div class="whatsapp-container">
            <div class="whatsapp-title">
              <i class="material-icons" style="font-size:14px;">chat</i>
              <span>WhatsApp Notification Opt-in</span>
            </div>
            <div class="whatsapp-bubble">
              <div class="bilingual-label">
                <span class="en"><strong>KhidmatAI:</strong> Your booking with Tariq Mahmood is confirmed for Today 3:00 PM. Code: 526377. Total: PKR 1,360.</span>
                <span class="ur"><strong>خدمت اے آئی:</strong> طارق محمود کے ساتھ آپ کی بکنگ آج ٣ بجے کے لئے تصدیق ہو گئی ہے۔ کوڈ: 526377۔ کل قیمت: 1360 روپے</span>
              </div>
            </div>
          </div>
          
          <!-- Buttons -->
          <div class="double-buttons">
            <button class="track-btn" onclick="location.href='05_follow_up.html'">
              <div class="bilingual-label" style="align-items: center; gap: 0;">
                <span class="en" style="color:#fff;">Track Service</span>
                <span class="ur" style="color:#E8F5E9; font-size:12px;">سروس ٹریک کریں</span>
              </div>
            </button>
            <button class="trace-btn" onclick="location.href='06_agent_trace.html'">
              <div class="bilingual-label" style="align-items: center; gap: 0;">
                <span class="en" style="color:var(--primary);">View Agent Trace</span>
                <span class="ur" style="color:var(--secondary); font-size:12px;">ایجنٹ ٹریس دیکھیں</span>
              </div>
            </button>
          </div>
          
          <!-- Bottom Navigation -->
          <div class="app-bottom-nav">
            <a href="01_home.html" class="app-nav-item">
              <i class="material-icons">home</i>
              <span>ہوم / Home</span>
            </a>
            <a href="02_providers.html" class="app-nav-item">
              <i class="material-icons">people</i>
              <span>پلمبرز / Providers</span>
            </a>
            <a href="06_agent_trace.html" class="app-nav-item">
              <i class="material-icons">analytics</i>
              <span>ٹریس / AI Trace</span>
            </a>
            <a href="08_compare.html" class="app-nav-item">
              <i class="material-icons">compare_arrows</i>
              <span>موازنہ / Compare</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    ${globalScripts}
  </script>
</body>
</html>
`;
writePreviewFile('04_booking_confirmation.html', screen4);

// Generate screen 5: FollowUpScreen
const screen5 = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KhidmatAI FollowUpScreen Preview</title>
  <style>
    ${globalStyles}
    
    /* FollowUp screen CSS overrides */
    .map-container {
      height: 250px;
      background: #E0F2F1;
      position: relative;
      overflow: hidden;
      border-bottom: 1px solid var(--divider);
    }
    
    /* Simulated map elements with animations */
    .simulated-map {
      width: 100%;
      height: 100%;
      position: relative;
    }
    
    .map-grid-line {
      position: absolute;
      background: rgba(0,0,0,0.04);
    }
    
    .route-path {
      position: absolute;
      width: 150px;
      height: 80px;
      border: 4px solid var(--primary);
      border-top: none;
      border-right: none;
      left: 100px;
      top: 90px;
      border-bottom-left-radius: 20px;
      z-index: 1;
    }
    
    .marker-customer {
      position: absolute;
      left: 90px;
      top: 160px;
      z-index: 5;
      color: var(--accent);
      transform: translate(-50%, -50%);
      font-size: 28px;
    }
    
    .marker-provider {
      position: absolute;
      left: 235px;
      top: 75px;
      z-index: 5;
      color: var(--primary);
      transform: translate(-50%, -50%);
      font-size: 28px;
      transition: all 1.5s ease-in-out;
    }
    
    .eta-floating-card {
      background: #FFFFFF;
      border-radius: 12px;
      margin: -24px 16px 16px 16px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      border: 1px solid var(--divider);
      position: relative;
      z-index: 10;
    }
    
    .timeline-container {
      background: #fff;
      border: 1px solid var(--divider);
      border-radius: 12px;
      margin: 16px;
      padding: 16px;
    }
    
    .step-item {
      display: flex;
      gap: 16px;
      position: relative;
      padding-bottom: 24px;
    }
    
    .step-item:last-child {
      padding-bottom: 0;
    }
    
    .step-item::after {
      content: '';
      position: absolute;
      left: 11px;
      top: 24px;
      bottom: 0;
      width: 2px;
      background: var(--divider);
    }
    
    .step-item:last-child::after {
      display: none;
    }
    
    .step-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #eee;
      color: #999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      z-index: 2;
    }
    
    .step-item.completed .step-icon {
      background: var(--primary);
      color: #fff;
    }
    
    .step-item.completed::after {
      background: var(--primary);
    }
    
    .step-item.active .step-icon {
      background: var(--accent);
      color: #212121;
      box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.2);
    }
    
    .step-content {
      flex: 1;
    }
    
    .step-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-primary);
    }
    
    .step-item.upcoming .step-title {
      color: #9E9E9E;
    }
    
    .step-subtext {
      font-size: 11px;
      color: var(--text-secondary);
      margin-top: 2px;
    }
    
    .simulation-panel {
      background: #EEEEEE;
      border-radius: 12px;
      margin: 16px;
      padding: 12px;
      border: 1px dashed #BDBDBD;
    }
    
    .sim-buttons {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      margin-top: 8px;
    }
    
    .sim-btn {
      border: none;
      background: #fff;
      color: var(--text-primary);
      border-radius: 6px;
      padding: 6px;
      font-size: 10px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      transition: all 0.2s;
    }
    
    .sim-btn.active {
      background: var(--primary);
      color: #fff;
    }
    
    /* Star Rating feedback styling */
    .modal-feedback {
      background: #fff;
      border: 1px solid var(--divider);
      border-radius: 12px;
      margin: 16px 16px 80px 16px;
      padding: 16px;
      display: none;
      animation: slideUp 0.3s ease-out;
    }
    
    @keyframes slideUp {
      0% { transform: translateY(20px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    
    .stars-row {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin: 12px 0;
    }
    
    .stars-row i {
      font-size: 28px;
      color: #eee;
      cursor: pointer;
      transition: color 0.1s;
    }
    
    .stars-row i.selected {
      color: var(--accent);
    }
    
    .feedback-input {
      width: 100%;
      height: 60px;
      border-radius: 8px;
      border: 1px solid var(--divider);
      padding: 8px 12px;
      font-size: 12px;
      resize: none;
      outline: none;
      margin-bottom: 12px;
    }
  </style>
</head>
<body>
  <div class="dashboard-container">
    ${getSidebarHtml(5)}
    
    <div class="preview-area">
      <!-- Phone Frame Mockup -->
      <div class="phone-frame">
        <div class="phone-notch">
          <div class="phone-speaker"></div>
        </div>
        ${getStatusBarHtml(false)}
        
        <div class="app-container">
          <!-- AppBar -->
          <div class="app-bar">
            <div class="app-bar-left">
              <button class="back-btn" onclick="location.href='04_booking_confirmation.html'"><i class="material-icons">arrow_back</i></button>
              <div class="app-bar-title">
                <span class="en">Service Tracking</span>
                <span class="ur">سروس ٹریکنگ</span>
              </div>
            </div>
            <button class="lang-toggle-btn">EN / اردو</button>
          </div>
          
          <!-- Map Section -->
          <div class="map-container">
            <div class="simulated-map">
              <!-- Grid background -->
              <div class="map-grid-line" style="width:100%; height:1px; top:50px;"></div>
              <div class="map-grid-line" style="width:100%; height:1px; top:100px;"></div>
              <div class="map-grid-line" style="width:100%; height:1px; top:150px;"></div>
              <div class="map-grid-line" style="width:1px; height:100%; left:100px;"></div>
              <div class="map-grid-line" style="width:1px; height:100%; left:200px;"></div>
              <div class="map-grid-line" style="width:1px; height:100%; left:300px;"></div>
              
              <!-- Draw path -->
              <div class="route-path"></div>
              
              <!-- Markers -->
              <i class="material-icons marker-customer">home</i>
              <i class="material-icons marker-provider" id="providerMarker">directions_run</i>
            </div>
          </div>
          
          <!-- Provider Floating Card -->
          <div class="eta-floating-card">
            <div class="provider-avatar" style="width:40px; height:40px; font-size:14px;">TM</div>
            <div style="flex:1;">
              <div class="bilingual-label">
                <span class="en" style="font-size:13px; font-weight:700;">Tariq Mahmood</span>
                <span class="ur" style="font-size:11px;">طارق محمود</span>
              </div>
              <span style="font-size:10px; color:var(--accent); font-weight:700;">4.8 ⭐ Plumber</span>
            </div>
            <div style="text-align:right;" id="etaDisplay">
              <div class="bilingual-label">
                <span class="en" style="font-size:12px; font-weight:700; color:var(--success);" id="etaEn">Arriving in 12 mins</span>
                <span class="ur" style="font-size:10px; color:var(--success);" id="etaUr">١٢ منٹ میں آمد</span>
              </div>
            </div>
          </div>
          
          <!-- Stepper timeline -->
          <div class="timeline-container">
            <div class="step-item completed" id="step1">
              <div class="step-icon"><i class="material-icons" style="font-size:12px;">check</i></div>
              <div class="step-content">
                <div class="step-title">
                  <div class="bilingual-label">
                    <span class="en">Booking Confirmed</span>
                    <span class="ur">بکنگ کی تصدیق ہو گئی</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="step-item active" id="step2">
              <div class="step-icon"><i class="material-icons" style="font-size:12px;">directions_run</i></div>
              <div class="step-content">
                <div class="step-title">
                  <div class="bilingual-label">
                    <span class="en" id="step2TitleEn">Provider En Route</span>
                    <span class="ur" id="step2TitleUr">فراہم کنندہ راستے میں ہے</span>
                  </div>
                </div>
                <div class="step-subtext" id="step2Sub">
                  <div class="bilingual-label">
                    <span class="en">Tariq is 1.2 km away</span>
                    <span class="ur">طارق ١.٢ کلومیٹر دور ہے</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="step-item upcoming" id="step3">
              <div class="step-icon"><i class="material-icons" style="font-size:12px;">location_on</i></div>
              <div class="step-content">
                <div class="step-title">
                  <div class="bilingual-label">
                    <span class="en">Arrived</span>
                    <span class="ur">پہنچ گئے</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="step-item upcoming" id="step4">
              <div class="step-icon"><i class="material-icons" style="font-size:12px;">handyman</i></div>
              <div class="step-content">
                <div class="step-title">
                  <div class="bilingual-label">
                    <span class="en">Work In Progress</span>
                    <span class="ur">کام جاری ہے</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="step-item upcoming" id="step5">
              <div class="step-icon"><i class="material-icons" style="font-size:12px;">task_alt</i></div>
              <div class="step-content">
                <div class="step-title">
                  <div class="bilingual-label">
                    <span class="en">Service Completed</span>
                    <span class="ur">کام مکمل ہو گیا</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Test simulation panel -->
          <div class="simulation-panel">
            <span style="font-size:11px; font-weight:700; color:#666; text-transform:uppercase;">Demo Simulation Controls</span>
            <div class="sim-buttons">
              <button class="sim-btn active" onclick="simState('EN_ROUTE')">En Route</button>
              <button class="sim-btn" onclick="simState('ARRIVED')">Arrived</button>
              <button class="sim-btn" onclick="simState('IN_PROGRESS')">Working</button>
              <button class="sim-btn" onclick="simState('COMPLETED')">Complete</button>
            </div>
          </div>
          
          <!-- Rate feedback card modal (revealed on completed status) -->
          <div class="modal-feedback" id="feedbackModal">
            <div class="section-subtitle" style="text-align:center;">
              <div class="bilingual-label">
                <span class="en">Rate Your Service</span>
                <span class="ur">سروس کی درجہ بندی کریں</span>
              </div>
            </div>
            <div class="stars-row" id="starsContainer">
              <i class="material-icons" onclick="rateStar(1)">star</i>
              <i class="material-icons" onclick="rateStar(2)">star</i>
              <i class="material-icons" onclick="rateStar(3)">star</i>
              <i class="material-icons" onclick="rateStar(4)">star</i>
              <i class="material-icons" onclick="rateStar(5)">star</i>
            </div>
            <textarea class="feedback-input" placeholder="Write your review... / اپنا جائزہ لکھیں..."></textarea>
            <button class="compare-btn" style="height:40px; font-size:13px;" onclick="location.href='07_dispute.html'">
              <div class="bilingual-label" style="align-items: center; gap: 0;">
                <span class="en" style="color:#fff;">Submit Feedback</span>
                <span class="ur" style="color:#E8F5E9; font-size:10px;">جائزہ جمع کروائیں</span>
              </div>
            </button>
          </div>
          
          <!-- Bottom Navigation -->
          <div class="app-bottom-nav">
            <a href="01_home.html" class="app-nav-item">
              <i class="material-icons">home</i>
              <span>ہوم / Home</span>
            </a>
            <a href="02_providers.html" class="app-nav-item">
              <i class="material-icons">people</i>
              <span>پلمبرز / Providers</span>
            </a>
            <a href="06_agent_trace.html" class="app-nav-item">
              <i class="material-icons">analytics</i>
              <span>ٹریس / AI Trace</span>
            </a>
            <a href="08_compare.html" class="app-nav-item">
              <i class="material-icons">compare_arrows</i>
              <span>موازنہ / Compare</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    ${globalScripts}
    
    // Star Rating
    let rating = 0;
    function rateStar(num) {
      rating = num;
      const stars = document.querySelectorAll('#starsContainer i');
      stars.forEach((star, index) => {
        if (index < num) {
          star.classList.add('selected');
        } else {
          star.classList.remove('selected');
        }
      });
    }
    
    // Status Simulator
    function simState(state) {
      // Clear active sim btn styling
      const btns = document.querySelectorAll('.sim-btn');
      btns.forEach(btn => btn.classList.remove('active'));
      
      const marker = document.getElementById('providerMarker');
      const etaEn = document.getElementById('etaEn');
      const etaUr = document.getElementById('etaUr');
      const feedbackModal = document.getElementById('feedbackModal');
      
      // Default classes resetting
      document.getElementById('step2').className = 'step-item upcoming';
      document.getElementById('step3').className = 'step-item upcoming';
      document.getElementById('step4').className = 'step-item upcoming';
      document.getElementById('step5').className = 'step-item upcoming';
      feedbackModal.style.display = 'none';
      
      if (state === 'EN_ROUTE') {
        event.target.classList.add('active');
        document.getElementById('step2').className = 'step-item active';
        marker.style.left = '235px';
        marker.style.top = '75px';
        marker.innerText = 'directions_run';
        etaEn.innerText = 'Arriving in 12 mins';
        etaUr.innerText = '١٢ منٹ میں آمد';
      } 
      else if (state === 'ARRIVED') {
        event.target.classList.add('active');
        document.getElementById('step2').className = 'step-item completed';
        document.getElementById('step3').className = 'step-item active';
        marker.style.left = '100px';
        marker.style.top = '145px';
        marker.innerText = 'handyman';
        etaEn.innerText = 'Tariq Mahmood Arrived';
        etaUr.innerText = 'پہنچ گئے ہیں';
      } 
      else if (state === 'IN_PROGRESS') {
        event.target.classList.add('active');
        document.getElementById('step2').className = 'step-item completed';
        document.getElementById('step3').className = 'step-item completed';
        document.getElementById('step4').className = 'step-item active';
        marker.style.left = '90px';
        marker.style.top = '160px';
        marker.innerText = 'handyman';
        etaEn.innerText = 'Job In Progress';
        etaUr.innerText = 'کام جاری ہے';
      } 
      else if (state === 'COMPLETED') {
        event.target.classList.add('active');
        document.getElementById('step2').className = 'step-item completed';
        document.getElementById('step3').className = 'step-item completed';
        document.getElementById('step4').className = 'step-item completed';
        document.getElementById('step5').className = 'step-item completed';
        marker.style.left = '90px';
        marker.style.top = '160px';
        marker.innerText = 'task_alt';
        etaEn.innerText = 'Service Done successfully';
        etaUr.innerText = 'کام مکمل ہو گیا ہے';
        feedbackModal.style.display = 'block';
      }
    }
  </script>
</body>
</html>
`;
writePreviewFile('05_follow_up.html', screen5);

// Generate screen 6: AgentTraceScreen
const screen6 = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KhidmatAI AgentTraceScreen Preview</title>
  <style>
    ${globalStyles}
    
    /* Agent Trace screen overrides */
    .duration-banner {
      background: #FFF9C4;
      border: 1px solid #FFF59D;
      padding: 12px 16px;
      margin: 16px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #F57F17;
      font-size: 13px;
      font-weight: 700;
    }
    
    .trace-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 0 16px 80px 16px;
    }
    
    .trace-card {
      background: #fff;
      border: 1px solid var(--divider);
      border-left-width: 6px !important;
      border-radius: 12px;
      padding: 16px;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0,0,0,0.01);
      transition: all 0.2s;
    }
    
    .trace-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .trace-card-title {
      font-size: 14px;
      font-weight: 800;
      color: var(--text-primary);
    }
    
    .trace-card-title.ur {
      font-family: 'Noto Sans Arabic', sans-serif;
      font-size: 11px;
      color: var(--text-secondary);
      margin-top: 1px;
    }
    
    .trace-card-desc {
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 8px;
      line-height: 1.4;
    }
    
    .json-payload {
      background: #1e1e1e;
      border-radius: 8px;
      color: #CE9178;
      padding: 12px;
      font-family: monospace;
      font-size: 11px;
      margin-top: 12px;
      overflow-x: auto;
      display: none;
      line-height: 1.5;
    }
    
    .trace-card.expanded .json-payload {
      display: block;
    }
    
    .trace-card.expanded i.expand-arrow {
      transform: rotate(180deg);
    }
  </style>
</head>
<body>
  <div class="dashboard-container">
    ${getSidebarHtml(6)}
    
    <div class="preview-area">
      <!-- Phone Frame Mockup -->
      <div class="phone-frame">
        <div class="phone-notch">
          <div class="phone-speaker"></div>
        </div>
        ${getStatusBarHtml(false)}
        
        <div class="app-container">
          <!-- AppBar -->
          <div class="app-bar">
            <div class="app-bar-left">
              <button class="back-btn" onclick="location.href='04_booking_confirmation.html'"><i class="material-icons">arrow_back</i></button>
              <div class="app-bar-title">
                <span class="en">AI Decision Log</span>
                <span class="ur">اے آئی فیصلے</span>
              </div>
            </div>
            <i class="material-icons" style="color:var(--primary); cursor:pointer;">share</i>
          </div>
          
          <!-- Duration Banner -->
          <div class="duration-banner">
            <i class="material-icons" style="font-size:20px;">alarm</i>
            <div class="bilingual-label">
              <span class="en" style="color:#F57F17;">Total Processing Duration: 1.8 seconds</span>
              <span class="ur" style="color:#F57F17; font-size:11px;">کل پروسیسنگ وقت: ١.٨ سیکنڈ</span>
            </div>
          </div>
          
          <!-- Trace cards list -->
          <div class="trace-list">
            <!-- Intent Agent -->
            <div class="trace-card" style="border-left-color:#2196F3;" onclick="toggleCard(this)">
              <div class="trace-card-header">
                <div>
                  <div class="trace-card-title en">Intent Agent</div>
                  <div class="trace-card-title ur">نیت کا ایجنٹ</div>
                </div>
                <i class="material-icons expand-arrow" style="color:#999; transition:0.3s;">expand_more</i>
              </div>
              <div class="trace-card-desc">
                <div class="bilingual-label">
                  <span class="en">Identified 'Plumbing request in F-8' with 98% confidence.</span>
                  <span class="ur">٩٨٪ فیصد یقین کے ساتھ ایف-٨ میں پلمبنگ سروس کی شناخت کی گئی۔</span>
                </div>
              </div>
              <pre class="json-payload">{"intent": "plumbing", "area": "F-8", "confidence": 0.98}</pre>
            </div>
            
            <!-- Discovery Agent -->
            <div class="trace-card" style="border-left-color:#9C27B0;" onclick="toggleCard(this)">
              <div class="trace-card-header">
                <div>
                  <div class="trace-card-title en">Discovery Agent</div>
                  <div class="trace-card-title ur">تلاش کا ایجنٹ</div>
                </div>
                <i class="material-icons expand-arrow" style="color:#999; transition:0.3s;">expand_more</i>
              </div>
              <div class="trace-card-desc">
                <div class="bilingual-label">
                  <span class="en">Discovered 4 available plumbers in F-8 matching search.</span>
                  <span class="ur">ایف-٨ میں تلاش سے مطابقت رکھنے والے ٤ دستیاب پلمبر ملے۔</span>
                </div>
              </div>
              <pre class="json-payload">{"found_providers": ["P001", "P003", "P005", "P006"]}</pre>
            </div>
            
            <!-- Ranking Agent -->
            <div class="trace-card" style="border-left-color:#FF9800;" onclick="toggleCard(this)">
              <div class="trace-card-header">
                <div>
                  <div class="trace-card-title en">Ranking Agent</div>
                  <div class="trace-card-title ur">درجہ بندی کا ایجنٹ</div>
                </div>
                <i class="material-icons expand-arrow" style="color:#999; transition:0.3s;">expand_more</i>
              </div>
              <div class="trace-card-desc">
                <div class="bilingual-label">
                  <span class="en">Ranked Tariq Mahmood #1 based on 1.2km distance, 4.8 rating, and 98% on-time rate.</span>
                  <span class="ur">طارق محمود کو ١.٢ کلومیٹر فاصلے اور ٤.٨ ریٹنگ کی بنیاد پر پہلے نمبر پر رکھا۔</span>
                </div>
              </div>
              <pre class="json-payload">{"ranked_providers": [{"id": "P005", "score": 0.94}]}</pre>
            </div>
            
            <!-- Pricing Agent -->
            <div class="trace-card" style="border-left-color:#FFC107;" onclick="toggleCard(this)">
              <div class="trace-card-header">
                <div>
                  <div class="trace-card-title en">Pricing Agent</div>
                  <div class="trace-card-title ur">قیمت کا ایجنٹ</div>
                </div>
                <i class="material-icons expand-arrow" style="color:#999; transition:0.3s;">expand_more</i>
              </div>
              <div class="trace-card-desc">
                <div class="bilingual-label">
                  <span class="en">Calculated price PKR 1,360 based on Base 1300 + Distance 60.</span>
                  <span class="ur">بنیادی قیمت ١٣٠٠ + فاصلہ ٦٠ کی بنیاد پر کل قیمت ١٣٦٠ روپے شمار کی۔</span>
                </div>
              </div>
              <pre class="json-payload">{"calculated_price": 1360, "breakdown": {"base": 1300, "distance": 60}}</pre>
            </div>
            
            <!-- Booking Agent -->
            <div class="trace-card" style="border-left-color:#4CAF50;" onclick="toggleCard(this)">
              <div class="trace-card-header">
                <div>
                  <div class="trace-card-title en">Booking Agent</div>
                  <div class="trace-card-title ur">بکنگ کا ایجنٹ</div>
                </div>
                <i class="material-icons expand-arrow" style="color:#999; transition:0.3s;">expand_more</i>
              </div>
              <div class="trace-card-desc">
                <div class="bilingual-label">
                  <span class="en">Locked slot at 3:00 PM and reserved Tariq Mahmood.</span>
                  <span class="ur">دوپہر ٣:٠٠ بجے کا سلاٹ لاک کر کے طارق محمود کو بک کر لیا۔</span>
                </div>
              </div>
              <pre class="json-payload">{"booking_status": "locked", "slot": "15:00"}</pre>
            </div>
            
            <!-- Notification Agent -->
            <div class="trace-card" style="border-left-color:#009688;" onclick="toggleCard(this)">
              <div class="trace-card-header">
                <div>
                  <div class="trace-card-title en">Notification Agent</div>
                  <div class="trace-card-title ur">نوٹیفکیشن کا ایجنٹ</div>
                </div>
                <i class="material-icons expand-arrow" style="color:#999; transition:0.3s;">expand_more</i>
              </div>
              <div class="trace-card-desc">
                <div class="bilingual-label">
                  <span class="en">Sent WhatsApp notification bubble with code 526377.</span>
                  <span class="ur">کوڈ 526377 کے ساتھ واٹس ایپ نوٹیفکیشن کامیابی سے بھیج دیا گیا۔</span>
                </div>
              </div>
              <pre class="json-payload">{"channels": ["whatsapp", "sms"], "message_delivered": true}</pre>
            </div>
          </div>
          
          <!-- Persistent footer button -->
          <div class="sticky-footer-btn">
            <button class="compare-btn" style="background:transparent; border:1.5px solid var(--primary); color:var(--primary);">
              <div class="bilingual-label" style="align-items: center; gap: 0;">
                <span class="en" style="color:var(--primary);">Export Logs</span>
                <span class="ur" style="color:var(--secondary); font-size:12px;">لاگز ایکسپورٹ کریں</span>
              </div>
            </button>
          </div>
          
          <!-- Bottom Navigation -->
          <div class="app-bottom-nav">
            <a href="01_home.html" class="app-nav-item">
              <i class="material-icons">home</i>
              <span>ہوم / Home</span>
            </a>
            <a href="02_providers.html" class="app-nav-item">
              <i class="material-icons">people</i>
              <span>پلمبرز / Providers</span>
            </a>
            <a href="06_agent_trace.html" class="app-nav-item active">
              <i class="material-icons">analytics</i>
              <span>ٹریس / AI Trace</span>
            </a>
            <a href="08_compare.html" class="app-nav-item">
              <i class="material-icons">compare_arrows</i>
              <span>موازنہ / Compare</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    ${globalScripts}
    
    function toggleCard(card) {
      card.classList.toggle('expanded');
    }
  </script>
</body>
</html>
`;
writePreviewFile('06_agent_trace.html', screen6);

// Generate screen 7: DisputeScreen
const screen7 = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KhidmatAI DisputeScreen Preview</title>
  <style>
    ${globalStyles}
    
    /* Dispute specific CSS overrides */
    .dispute-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      padding: 0 16px;
    }
    
    .dispute-card {
      background: #fff;
      border: 1.5px solid var(--divider);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.01);
      transition: all 0.2s;
    }
    
    .dispute-card i {
      color: var(--error);
      font-size: 28px;
    }
    
    .dispute-card.selected {
      border-color: var(--error);
      background: #FFEBEE;
      box-shadow: 0 4px 12px rgba(211,47,47,0.1);
    }
    
    .dispute-card-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-primary);
    }
    .dispute-card-title.ur {
      font-family: 'Noto Sans Arabic', sans-serif;
      font-size: 11px;
      color: var(--text-secondary);
      margin-top: 1px;
    }
    
    /* Sliding Resolution Sheet Overlay styles */
    .bottom-sheet {
      position: absolute;
      bottom: 60px;
      left: 0;
      right: 0;
      background: #fff;
      border-top-left-radius: 24px;
      border-top-right-radius: 24px;
      box-shadow: 0 -8px 30px rgba(0,0,0,0.15);
      padding: 24px 20px 20px 20px;
      z-index: 95;
      animation: slideUpSheet 0.4s cubic-bezier(0.1, 0.76, 0.55, 0.94);
    }
    
    @keyframes slideUpSheet {
      0% { transform: translateY(100%); }
      100% { transform: translateY(0); }
    }
    
    .badge-row {
      display: flex;
      gap: 8px;
      margin: 12px 0;
    }
    
    .amber-badge {
      background: var(--accent);
      color: #212121;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
    }
    
    .green-badge {
      background: #E8F5E9;
      color: #388E3C;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
    }
    
    .compensation-banner {
      background: #FFF9C4;
      border: 1px solid #FFF59D;
      border-radius: 8px;
      padding: 12px;
      color: #F57F17;
      font-weight: 800;
      text-align: center;
      margin-bottom: 16px;
      font-size: 14px;
    }
    
    .reason-box {
      background: var(--background);
      border-radius: 12px;
      padding: 14px;
      font-size: 12px;
      color: var(--text-primary);
      line-height: 1.45;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="dashboard-container">
    ${getSidebarHtml(7)}
    
    <div class="preview-area">
      <!-- Phone Frame Mockup -->
      <div class="phone-frame">
        <div class="phone-notch">
          <div class="phone-speaker"></div>
        </div>
        ${getStatusBarHtml(false)}
        
        <div class="app-container" style="padding-bottom:280px;">
          <!-- AppBar -->
          <div class="app-bar">
            <div class="app-bar-left">
              <button class="back-btn" onclick="location.href='05_follow_up.html'"><i class="material-icons">arrow_back</i></button>
              <div class="app-bar-title">
                <span class="en">Report an Issue</span>
                <span class="ur">مسئلہ رپورٹ کریں</span>
              </div>
            </div>
            <button class="lang-toggle-btn">EN / اردو</button>
          </div>
          
          <!-- Booking Context card -->
          <div class="recent-card" style="margin-top: 16px;">
            <div style="flex:1;">
              <div class="bilingual-label">
                <span class="en" style="font-size:13px; font-weight:700;">Booking Plumber Tariq Mahmood on May 17, 3 PM</span>
                <span class="ur" style="font-size:11px;">بکنگ پلمبر طارق محمود، ١٧ مئی دوپہر ٣ بجے</span>
              </div>
            </div>
          </div>
          
          <!-- Dispute Categories Grid -->
          <div class="dispute-grid">
            <div class="dispute-card">
              <i class="material-icons">person_off</i>
              <div>
                <div class="dispute-card-title en">Provider No Show</div>
                <div class="dispute-card-title ur">فراہم کنندہ نہیں آیا</div>
              </div>
            </div>
            
            <div class="dispute-card selected">
              <i class="material-icons">attach_money</i>
              <div>
                <div class="dispute-card-title en">Price Disagreement</div>
                <div class="dispute-card-title ur">قیمت پر اختلاف</div>
              </div>
            </div>
            
            <div class="dispute-card">
              <i class="material-icons">report_problem</i>
              <div>
                <div class="dispute-card-title en">Quality Complaint</div>
                <div class="dispute-card-title ur">کام کے معیار پر شکایت</div>
              </div>
            </div>
            
            <div class="dispute-card">
              <i class="material-icons">cancel</i>
              <div>
                <div class="dispute-card-title en">Cancellation</div>
                <div class="dispute-card-title ur">منسوخی</div>
              </div>
            </div>
          </div>
          
          <!-- Bottom Resolution Drawer Sheet -->
          <div class="bottom-sheet">
            <div class="bilingual-label">
              <span class="en" style="font-size: 18px; font-weight:800; color:var(--primary);">Price Disagreement Resolution</span>
              <span class="ur" style="font-size: 15px; font-weight:500; color:var(--secondary);">قیمت کے بارے میں حل</span>
            </div>
            
            <div class="badge-row">
              <span class="amber-badge">
                <div class="bilingual-label">
                  <span class="en">Level 1: Auto-Refund</span>
                  <span class="ur">لیول ۱: خودکار ریفنڈ</span>
                </div>
              </span>
              <span class="green-badge">
                <div class="bilingual-label">
                  <span class="en">Severity: LOW</span>
                  <span class="ur">شدت: کم</span>
                </div>
              </span>
            </div>
            
            <!-- Compensation banner -->
            <div class="compensation-banner">
              <div class="bilingual-label">
                <span class="en" style="color:#F57F17;">PKR 300 Wallet Credit</span>
                <span class="ur" style="color:#F57F17; font-size:12px;">٣٠٠ روپے والیٹ کریڈٹ</span>
              </div>
            </div>
            
            <!-- Reasoning Explanation -->
            <div class="reason-box">
              <div class="bilingual-label">
                <span class="en">AI detected Tariq Mahmood charged PKR 60 extra distance fee incorrectly. The extra amount will be credited to your wallet.</span>
                <span class="ur">اے آئی نے پایا کہ طارق نے اضافی فاصلہ چارجز غلط لگا دیے۔ اضافی رقم آپ کے والیٹ میں منتقل کی جائے گی۔</span>
              </div>
            </div>
            
            <!-- CTA action button -->
            <button class="compare-btn" onclick="location.href='08_compare.html'">
              <div class="bilingual-label" style="align-items: center; gap: 0;">
                <span class="en" style="color:#fff;">Accept Resolution</span>
                <span class="ur" style="color:#E8F5E9; font-size:12px;">حل منظور کریں</span>
              </div>
            </button>
          </div>
          
          <!-- Bottom Navigation -->
          <div class="app-bottom-nav">
            <a href="01_home.html" class="app-nav-item">
              <i class="material-icons">home</i>
              <span>ہوم / Home</span>
            </a>
            <a href="02_providers.html" class="app-nav-item">
              <i class="material-icons">people</i>
              <span>پلمبرز / Providers</span>
            </a>
            <a href="06_agent_trace.html" class="app-nav-item">
              <i class="material-icons">analytics</i>
              <span>ٹریس / AI Trace</span>
            </a>
            <a href="08_compare.html" class="app-nav-item">
              <i class="material-icons">compare_arrows</i>
              <span>موازنہ / Compare</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    ${globalScripts}
  </script>
</body>
</html>
`;
writePreviewFile('07_dispute.html', screen7);

// Generate screen 8: BaselineCompareScreen
const screen8 = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KhidmatAI BaselineCompareScreen Preview</title>
  <style>
    ${globalStyles}
    
    /* Comparison screen CSS overrides */
    .intro-box {
      padding: 16px;
    }
    
    .intro-text-en {
      font-size: 15px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.4;
    }
    .intro-text-ur {
      font-family: 'Noto Sans Arabic', sans-serif;
      font-size: 13px;
      color: var(--text-secondary);
      margin-top: 4px;
      line-height: 1.4;
    }
    
    .table-card {
      background: #fff;
      border: 1px solid var(--divider);
      border-radius: 12px;
      margin: 0 16px 16px 16px;
      padding: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.01);
    }
    
    .comp-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .comp-table th {
      text-align: left;
      font-size: 12px;
      font-weight: 800;
      padding-bottom: 8px;
      border-bottom: 1.5px solid var(--divider);
    }
    
    .comp-table td {
      padding: 10px 0;
      border-bottom: 1px solid rgba(0,0,0,0.05);
      font-size: 12px;
      vertical-align: middle;
    }
    
    .comp-table tr:last-child td {
      border-bottom: none;
    }
    
    .col-feature {
      font-weight: 700;
      color: var(--text-primary);
      width: 30%;
    }
    
    .col-simple {
      color: var(--error);
      font-weight: 600;
      width: 30%;
    }
    
    .col-khidmat {
      color: var(--primary);
      font-weight: 800;
      width: 40%;
    }
    
    .live-compare-header {
      padding: 0 16px;
      margin-top: 8px;
    }
    
    .live-card {
      border-radius: 12px;
      padding: 16px;
      margin: 12px 16px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.01);
    }
    
    .live-card.simple {
      background: #FFEBEE;
      border: 1.5px solid #FFCDD2;
    }
    
    .live-card.khidmat {
      background: #E8F5E9;
      border: 1.5px solid #C8E6C9;
      margin-bottom: 80px; /* Space for Bottom Navigation */
    }
    
    .live-title {
      font-size: 13px;
      font-weight: 800;
    }
    
    .live-status {
      font-size: 12px;
      font-weight: 900;
      margin: 6px 0;
      letter-spacing: 0.5px;
    }
    
    .live-desc {
      font-size: 11px;
      line-height: 1.45;
    }
  </style>
</head>
<body>
  <div class="dashboard-container">
    ${getSidebarHtml(8)}
    
    <div class="preview-area">
      <!-- Phone Frame Mockup -->
      <div class="phone-frame">
        <div class="phone-notch">
          <div class="phone-speaker"></div>
        </div>
        ${getStatusBarHtml(false)}
        
        <div class="app-container">
          <!-- AppBar -->
          <div class="app-bar">
            <div class="app-bar-left">
              <button class="back-btn" onclick="location.href='07_dispute.html'"><i class="material-icons">arrow_back</i></button>
              <div class="app-bar-title">
                <span class="en">Why KhidmatAI?</span>
                <span class="ur">کیوں خدمت اے آئی؟</span>
              </div>
            </div>
            <button class="lang-toggle-btn">EN / اردو</button>
          </div>
          
          <!-- Introduction header -->
          <div class="intro-box">
            <div class="intro-text-en">Comparing standard service apps with our AI-powered intelligent matches</div>
            <div class="intro-text-ur">عام سروس ایپس کا ہمارے اے آئی سے چلنے والے ذہین میچز سے موازنہ</div>
          </div>
          
          <!-- Feature comparison table card -->
          <div class="table-card">
            <table class="comp-table">
              <thead>
                <tr>
                  <th>
                    <div class="bilingual-label">
                      <span class="en">Feature</span>
                      <span class="ur">خصوصیت</span>
                    </div>
                  </th>
                  <th style="color:var(--error);">
                    <div class="bilingual-label">
                      <span class="en">Simple App</span>
                      <span class="ur">عام ایپ</span>
                    </div>
                  </th>
                  <th style="color:var(--primary);">
                    <div class="bilingual-label">
                      <span class="en">KhidmatAI</span>
                      <span class="ur">خدمت اے آئی</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="col-feature">
                    <div class="bilingual-label">
                      <span class="en">Urdu Search</span>
                      <span class="ur">اردو تلاش</span>
                    </div>
                  </td>
                  <td class="col-simple">
                    <div class="bilingual-label">
                      <span class="en">No (Error)</span>
                      <span class="ur">نہیں</span>
                    </div>
                  </td>
                  <td class="col-khidmat">
                    <div class="bilingual-label">
                      <span class="en">Yes (98% Acc)</span>
                      <span class="ur">جی ہاں</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="col-feature">
                    <div class="bilingual-label">
                      <span class="en">Matching</span>
                      <span class="ur">میچنگ</span>
                    </div>
                  </td>
                  <td class="col-simple">
                    <div class="bilingual-label">
                      <span class="en">Basic</span>
                      <span class="ur">بنیادی</span>
                    </div>
                  </td>
                  <td class="col-khidmat">
                    <div class="bilingual-label">
                      <span class="en">7-Factor AI</span>
                      <span class="ur">۷-فیکٹر اے آئی</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="col-feature">
                    <div class="bilingual-label">
                      <span class="en">Slot Suggest</span>
                      <span class="ur">سلاٹ تجویز</span>
                    </div>
                  </td>
                  <td class="col-simple">
                    <div class="bilingual-label">
                      <span class="en">❌ None</span>
                      <span class="ur">❌ کوئی نہیں</span>
                    </div>
                  </td>
                  <td class="col-khidmat">
                    <div class="bilingual-label">
                      <span class="en">✅ Smart Shift</span>
                      <span class="ur">✅ سمارٹ شفٹ</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="col-feature">
                    <div class="bilingual-label">
                      <span class="en">Pricing</span>
                      <span class="ur">قیمت</span>
                    </div>
                  </td>
                  <td class="col-simple">
                    <div class="bilingual-label">
                      <span class="en">Fixed</span>
                      <span class="ur">مقررہ</span>
                    </div>
                  </td>
                  <td class="col-khidmat">
                    <div class="bilingual-label">
                      <span class="en">Dynamic Fair</span>
                      <span class="ur">منصفانہ</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="col-feature">
                    <div class="bilingual-label">
                      <span class="en">Disputes</span>
                      <span class="ur">تنازعات حل</span>
                    </div>
                  </td>
                  <td class="col-simple">
                    <div class="bilingual-label">
                      <span class="en">Manual (Days)</span>
                      <span class="ur">دستی (دن)</span>
                    </div>
                  </td>
                  <td class="col-khidmat">
                    <div class="bilingual-label">
                      <span class="en">AI-Instant (Secs)</span>
                      <span class="ur">اے آئی (سیکنڈ)</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Live Comparison header -->
          <div class="live-compare-header">
            <div class="bilingual-label">
              <span class="en" style="font-size: 15px; font-weight:800; color:var(--primary);">Live Query Matching Comparison</span>
              <span class="ur" style="font-size: 13px; font-weight:500; color:var(--text-secondary);">لائیو میچنگ کا موازنہ</span>
            </div>
          </div>
          
          <!-- Simple app fail card -->
          <div class="live-card simple">
            <div class="live-title" style="color:#C62828;">
              <div class="bilingual-label">
                <span class="en">Simple App Search</span>
                <span class="ur">عام ایپ کی تلاش</span>
              </div>
            </div>
            <div class="live-status" style="color:#D32F2F;">
              <div class="bilingual-label">
                <span class="en">NO PROVIDERS FOUND</span>
                <span class="ur">کوئی فراہم کنندہ نہیں ملا</span>
              </div>
            </div>
            <div class="live-desc" style="color:#C62828;">
              <div class="bilingual-label">
                <span class="en">Failed to search "Aaj sham ko plumber chahiye F-8 mein" because it has Urdu words and doesn't match direct keyword "plumber" at exactly 3:00 PM.</span>
                <span class="ur">اردو الفاظ کی وجہ سے سرچ فیل ہوئی، اور پلمبر کی تلاش دوپہر ٣:٠٠ بجے پر میچ نہیں ہوئی۔</span>
              </div>
            </div>
          </div>
          
          <!-- Khidmat app success card -->
          <div class="live-card khidmat">
            <div class="live-title" style="color:#2E7D32;">
              <div class="bilingual-label">
                <span class="en">KhidmatAI Intelligent Search</span>
                <span class="ur">خدمت اے آئی</span>
              </div>
            </div>
            <div class="live-status" style="color:#388E3C;">
              <div class="bilingual-label">
                <span class="en">TARIQ MAHMOOD FOUND</span>
                <span class="ur">طارق محمود مل گئے</span>
              </div>
            </div>
            <div class="live-desc" style="color:#2E7D32;">
              <div class="bilingual-label">
                <span class="en">AI parsed Urdu query, extracted plumbing intent in F-8, and suggested shifting the slot by 30 mins to match Tariq Mahmood successfully.</span>
                <span class="ur">اے آئی نے اردو سرچ کو سمجھا، ایف-٨ میں پلمبر کی نیت کو نکالا اور طارق محمود کے لیے ٣٠ منٹ سلاٹ شفٹ کی سمارٹ تجویز دی سروس میچ کرنے کے لیے۔</span>
              </div>
            </div>
          </div>
          
          <!-- Bottom Navigation -->
          <div class="app-bottom-nav">
            <a href="01_home.html" class="app-nav-item">
              <i class="material-icons">home</i>
              <span>ہوم / Home</span>
            </a>
            <a href="02_providers.html" class="app-nav-item">
              <i class="material-icons">people</i>
              <span>پلمبرز / Providers</span>
            </a>
            <a href="06_agent_trace.html" class="app-nav-item">
              <i class="material-icons">analytics</i>
              <span>ٹریس / AI Trace</span>
            </a>
            <a href="08_compare.html" class="app-nav-item active">
              <i class="material-icons">compare_arrows</i>
              <span>موازنہ / Compare</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    ${globalScripts}
  </script>
</body>
</html>
`;
writePreviewFile('08_compare.html', screen8);

// Generate interactive hub page inside previews named index.html
const hubHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KhidmatAI UI Preview Hub</title>
  <script>
    // Redirect directly to Home screen to display within the interactive shell!
    window.location.href = "01_home.html";
  </script>
</head>
<body>
</body>
</html>
`;
writePreviewFile('index.html', hubHtml);

console.log("Previews built successfully!");
