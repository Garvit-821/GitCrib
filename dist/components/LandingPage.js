export function getLandingPageHtml() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GitCrib // Technical Career Infographic Generator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-canvas: #0f0f0f;
      --color-canvas-deep: #000000;
      --color-surface-card: #181818;
      --color-surface-elevated: #222222;
      --color-surface-strong: #2a2a2a;
      --color-primary: #0007cd;
      --color-primary-active: #0005a3;
      --color-primary-glow: #1a26ff;
      --color-ink: #ffffff;
      --color-body: #a8a8a8;
      --color-muted: #888888;
      --color-success: #33d17a;
      --color-error: #ff4d4d;
      --color-hairline: #222222;
      --color-hairline-strong: #333333;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--color-canvas);
      color: var(--color-ink);
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }

    /* Top Navigation bar */
    .top-nav {
      height: 64px;
      background-color: var(--color-canvas);
      border-bottom: 1px solid var(--color-hairline);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: var(--color-ink);
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }

    .nav-brand span {
      background-color: var(--color-primary);
      color: var(--color-ink);
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .nav-link {
      color: var(--color-body);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .nav-link:hover {
      color: var(--color-ink);
    }

    .nav-cta {
      background-color: var(--color-surface-elevated);
      color: var(--color-ink);
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid var(--color-hairline-strong);
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s ease;
    }

    .nav-cta:hover {
      background-color: var(--color-surface-strong);
      border-color: var(--color-body);
    }

    /* Hero Section with 96px rhythm */
    .hero-section {
      padding: 96px 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;
      background-color: var(--color-canvas);
    }

    .hero-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.88px;
      text-transform: uppercase;
      color: var(--color-body);
      background-color: var(--color-surface-elevated);
      padding: 4px 10px;
      border-radius: 9999px;
      margin-bottom: 1.5rem;
      display: inline-block;
    }

    .hero-title {
      font-size: 56px;
      font-weight: 500;
      line-height: 1.05;
      letter-spacing: -1.68px;
      color: var(--color-ink);
      max-width: 800px;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 640px) {
      .hero-title {
        font-size: 36px;
        letter-spacing: -1px;
      }
    }

    .hero-subtitle {
      font-size: 18px;
      color: var(--color-body);
      max-width: 600px;
      margin-bottom: 3rem;
    }

    /* Main Grid: Control panel left, Preview right */
    .main-container {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 0 2rem 96px 2rem;
      display: grid;
      grid-template-columns: 420px 1fr;
      gap: 24px;
      position: relative;
      z-index: 1;
    }

    @media (max-width: 1024px) {
      .main-container {
        grid-template-columns: 1fr;
      }
    }

    /* Left Control Panel Card */
    .control-panel {
      background: var(--color-surface-card);
      border: 1px solid var(--color-hairline-strong);
      border-radius: 12px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      height: fit-content;
    }

    .panel-section-title {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.88px;
      text-transform: uppercase;
      color: var(--color-body);
      margin-bottom: 4px;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-size: 13px;
      font-weight: 600;
      color: var(--color-ink);
    }

    .username-input-container {
      position: relative;
      display: flex;
      background: var(--color-surface-elevated);
      border: 1px solid var(--color-hairline-strong);
      border-radius: 8px;
      overflow: hidden;
      transition: border-color 0.2s ease;
    }

    .username-input-container:focus-within {
      border-color: var(--color-primary-glow);
    }

    input[type="text"] {
      width: 100%;
      background: transparent;
      border: none;
      padding: 12px 16px;
      color: var(--color-ink);
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      outline: none;
    }

    .submit-btn {
      background: var(--color-primary);
      border: none;
      color: var(--color-ink);
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      padding: 0 18px;
      transition: background-color 0.2s ease;
    }

    .submit-btn:hover {
      background-color: var(--color-primary-active);
    }

    select {
      background: var(--color-surface-elevated);
      border: 1px solid var(--color-hairline-strong);
      color: var(--color-ink);
      padding: 12px 16px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      border-radius: 8px;
      outline: none;
      cursor: pointer;
      width: 100%;
      transition: border-color 0.2s ease;
    }

    select:focus {
      border-color: var(--color-primary-glow);
    }

    .actions-panel {
      margin-top: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .btn {
      width: 100%;
      height: 40px;
      border-radius: 8px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-primary {
      background-color: var(--color-primary);
      border: none;
      color: var(--color-ink);
    }

    .btn-primary:hover {
      background-color: var(--color-primary-active);
      box-shadow: 0 0 15px rgba(26, 38, 255, 0.3);
    }

    .btn-secondary {
      background-color: var(--color-surface-elevated);
      border: 1px solid var(--color-hairline-strong);
      color: var(--color-ink);
    }

    .btn-secondary:hover {
      background-color: var(--color-surface-strong);
      border-color: var(--color-body);
    }

    /* Right Preview Window with Spotlight Backdrop Glow */
    .preview-wrapper {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 600px;
    }

    .spotlight-glow {
      position: absolute;
      width: 700px;
      height: 700px;
      background: radial-gradient(circle, rgba(26, 38, 255, 0.12) 0%, rgba(26, 38, 255, 0) 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 0;
      filter: blur(40px);
    }

    /* 2x2 Terminal Mockup Grid Frame */
    .terminal-mockup {
      width: 100%;
      background: var(--color-canvas-deep);
      border: 1px solid var(--color-hairline-strong);
      border-radius: 16px;
      padding: 24px;
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }

    .preview-img {
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      transition: opacity 0.3s ease;
      background: #05050a;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 15, 15, 0.9);
      backdrop-filter: blur(8px);
      display: none;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 16px;
      border-radius: 16px;
      z-index: 5;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 3px solid rgba(26, 38, 255, 0.1);
      border-radius: 50%;
      border-top-color: var(--color-primary-glow);
      animation: spin 1s infinite linear;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    .loading-text {
      font-family: 'JetBrains Mono', monospace;
      color: var(--color-primary-glow);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    /* Modal / Star lock Popup */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(15px);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal {
      background: var(--color-surface-card);
      border: 1px solid var(--color-hairline-strong);
      border-radius: 16px;
      padding: 48px;
      max-width: 500px;
      width: 90%;
      text-align: center;
      position: relative;
      box-shadow: 0 24px 48px rgba(0,0,0,0.8);
    }

    .modal-close {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      font-size: 1.8rem;
      color: var(--color-body);
      cursor: pointer;
      background: none;
      border: none;
      outline: none;
    }

    .modal-close:hover {
      color: var(--color-ink);
    }

    .modal-title {
      font-size: 24px;
      font-weight: 500;
      letter-spacing: -0.5px;
      color: var(--color-ink);
      margin-bottom: 1rem;
    }

    .modal-description {
      font-size: 14px;
      line-height: 1.6;
      color: var(--color-body);
      margin-bottom: 2rem;
    }

    .star-btn {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border: none;
      color: #000000;
      padding: 12px 24px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 14px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      cursor: pointer;
      box-shadow: 0 0 15px rgba(245, 158, 11, 0.25);
    }

    .star-btn:hover {
      transform: scale(1.03);
      box-shadow: 0 0 25px rgba(245, 158, 11, 0.55);
    }

    /* Clipboard toast notification */
    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--color-success);
      color: #000000;
      padding: 12px 24px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: bold;
      font-size: 13px;
      box-shadow: 0 10px 25px rgba(51, 209, 122, 0.25);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 2000;
    }

    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }

    /* Footer conforming to 64px 48px padding dark-footer */
    footer.page-footer {
      background-color: var(--color-canvas);
      padding: 64px 48px;
      border-top: 1px solid var(--color-hairline);
      text-align: center;
      font-size: 14px;
      color: var(--color-body);
      margin-top: auto;
    }

    footer.page-footer a {
      color: var(--color-ink);
      text-decoration: none;
      font-weight: 500;
    }

    footer.page-footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>

  <!-- Top Nav dark conforming to spec -->
  <nav class="top-nav">
    <a href="#" class="nav-brand">
      GitCrib <span>ENGINE</span>
    </a>
    <div class="nav-links">
      <a href="https://github.com/Garvit-821/GitCrib" target="_blank" class="nav-link">Documentation</a>
      <a href="https://github.com/Garvit-821/GitCrib" target="_blank" class="nav-link">Source Code</a>
      <a href="https://github.com/Garvit-821/GitCrib" target="_blank" class="nav-cta">
        ★ Star on GitHub
      </a>
    </div>
  </nav>

  <!-- Hero block (96px padding, Inter tracking -1.68px) -->
  <header class="hero-section">
    <div class="hero-label">GITCRIB BLUEPRINT ORCHESTRATION</div>
    <h1 class="hero-title">Developer Workspace Infographic Poster Engine</h1>
    <p class="hero-subtitle">
      Generate extremely detailed visual blueprints of your GitHub career analytics, streaks, languages, and activity history.
    </p>
  </header>

  <!-- Main grid layout -->
  <main class="main-container">
    <!-- Left panel -->
    <div class="control-panel">
      <div class="input-group">
        <label for="username">GitHub Username</label>
        <div class="username-input-container">
          <input type="text" id="username" placeholder="Garvit-821" value="Garvit-821">
          <button class="submit-btn" id="generate-btn">→</button>
        </div>
      </div>

      <div class="input-group">
        <label for="theme">Visual Theme</label>
        <select id="theme">
          <option value="blueprint">Technical Blueprint</option>
          <option value="cyberpunk">Cyberpunk Neon</option>
          <option value="matrix">Matrix Green</option>
          <option value="amber">Academic Amber</option>
        </select>
      </div>

      <div class="input-group">
        <label for="preset">Output Dimension preset</label>
        <select id="preset">
          <option value="poster">Standard Poster (1200x1600)</option>
          <option value="banner">Standard Banner (1200x400)</option>
          <option value="twitter">X / Twitter Post (1200x675)</option>
          <option value="linkedin">LinkedIn Banner (1584x396)</option>
          <option value="instagram_story">Instagram Story (1080x1920)</option>
          <option value="instagram_post">Instagram Post (1080x1080)</option>
        </select>
      </div>

      <div class="actions-panel">
        <div class="panel-section-title">Export Workspace</div>
        <button class="btn btn-primary" id="export-svg-btn">Export as SVG</button>
        <button class="btn btn-secondary" id="export-png-btn">Export as PNG</button>
        <button class="btn btn-secondary" id="export-jpeg-btn">Export as JPEG</button>
        <button class="btn btn-secondary" id="copy-iframe-btn">Get iframe Embed Code</button>
      </div>
    </div>

    <!-- Right preview window with spotlight glow background -->
    <div class="preview-wrapper">
      <div class="spotlight-glow"></div>
      
      <div class="terminal-mockup">
        <div class="loading-overlay" id="loading-overlay">
          <div class="spinner"></div>
          <div class="loading-text">CONNECTING TO GITHUB API...</div>
        </div>
        <img src="/?username=Garvit-821&theme=blueprint&layout=poster" alt="GitCrib Preview" class="preview-img" id="preview-img">
      </div>
    </div>
  </main>

  <!-- Dark Footer -->
  <footer class="page-footer">
    Developed by <a href="https://github.com/Garvit-821" target="_blank">Garvit-821</a> // Open Source under MIT spec // GitCrib_Compatible
  </footer>

  <!-- Star Lock Modal -->
  <div class="modal-backdrop" id="modal-backdrop">
    <div class="modal">
      <button class="modal-close" id="modal-close-btn">&times;</button>
      <div class="modal-title">🌟 Support GitCrib</div>
      <div class="modal-description">
        Support the project by starring the repository on GitHub. This instantly unlocks all high-resolution download formats!
      </div>
      <a href="https://github.com/Garvit-821/GitCrib" target="_blank" class="star-btn" id="star-github-link">
        ★ STAR GITCRIB ON GITHUB
      </a>
    </div>
  </div>

  <!-- Toast notification -->
  <div class="toast" id="toast">CODE COPIED TO CLIPBOARD!</div>

  <script>
    const themeBgMap = {
      blueprint: '#05050a',
      cyberpunk: '#0a0512',
      matrix: '#020804',
      amber: '#120d0a'
    };

    let isStarred = localStorage.getItem('gitcrib_starred') === 'true';
    let pendingDownloadFn = null;

    const usernameInput = document.getElementById('username');
    const generateBtn = document.getElementById('generate-btn');
    const themeSelect = document.getElementById('theme');
    const presetSelect = document.getElementById('preset');
    const previewImg = document.getElementById('preview-img');
    const loadingOverlay = document.getElementById('loading-overlay');
    
    const exportSvgBtn = document.getElementById('export-svg-btn');
    const exportPngBtn = document.getElementById('export-png-btn');
    const exportJpegBtn = document.getElementById('export-jpeg-btn');
    const copyIframeBtn = document.getElementById('copy-iframe-btn');
    
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const starGithubLink = document.getElementById('star-github-link');
    const toast = document.getElementById('toast');

    function updatePreview() {
      const username = usernameInput.value.trim() || 'Garvit-821';
      const theme = themeSelect.value;
      const preset = presetSelect.value;
      
      const layout = (preset === 'banner' || preset === 'twitter' || preset === 'linkedin') ? 'banner' : 'poster';
      
      loadingOverlay.style.display = 'flex';
      
      const newSrc = '/?username=' + encodeURIComponent(username) + '&theme=' + theme + '&layout=' + layout + '&t=' + Date.now();
      
      const tempImg = new Image();
      tempImg.src = newSrc;
      tempImg.onload = () => {
        previewImg.src = newSrc;
        loadingOverlay.style.display = 'none';
      };
      tempImg.onerror = () => {
        previewImg.src = newSrc;
        loadingOverlay.style.display = 'none';
      };
    }

    generateBtn.addEventListener('click', updatePreview);
    usernameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') updatePreview();
    });
    themeSelect.addEventListener('change', updatePreview);
    presetSelect.addEventListener('change', updatePreview);

    function checkStarLock(actionFn) {
      if (isStarred) {
        actionFn();
      } else {
        pendingDownloadFn = actionFn;
        modalBackdrop.style.display = 'flex';
      }
    }

    modalCloseBtn.addEventListener('click', () => {
      modalBackdrop.style.display = 'none';
    });

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.style.display = 'none';
      }
    });

    starGithubLink.addEventListener('click', () => {
      localStorage.setItem('gitcrib_starred', 'true');
      isStarred = true;
      modalBackdrop.style.display = 'none';
      
      setTimeout(() => {
        if (pendingDownloadFn) {
          pendingDownloadFn();
          pendingDownloadFn = null;
        }
      }, 500);
    });

    exportSvgBtn.addEventListener('click', () => {
      checkStarLock(() => {
        const username = usernameInput.value.trim() || 'Garvit-821';
        const theme = themeSelect.value;
        const preset = presetSelect.value;
        const layout = (preset === 'banner' || preset === 'twitter' || preset === 'linkedin') ? 'banner' : 'poster';
        
        const url = '/?username=' + encodeURIComponent(username) + '&theme=' + theme + '&layout=' + layout;
        
        fetch(url)
          .then(res => res.text())
          .then(svgText => {
            const blob = new Blob([svgText], { type: 'image/svg+xml' });
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'gitcrib-' + username + '-' + preset + '.svg';
            a.click();
            URL.revokeObjectURL(downloadUrl);
          })
          .catch(err => alert('Failed to download SVG: ' + err));
      });
    });

    function canvasRender(format) {
      const username = usernameInput.value.trim() || 'Garvit-821';
      const theme = themeSelect.value;
      const preset = presetSelect.value;
      const layout = (preset === 'banner' || preset === 'twitter' || preset === 'linkedin') ? 'banner' : 'poster';
      
      let canvasWidth = 1200;
      let canvasHeight = 1600;
      
      if (preset === 'twitter') {
        canvasWidth = 1200;
        canvasHeight = 675;
      } else if (preset === 'linkedin') {
        canvasWidth = 1584;
        canvasHeight = 396;
      } else if (preset === 'instagram_story') {
        canvasWidth = 1080;
        canvasHeight = 1920;
      } else if (preset === 'instagram_post') {
        canvasWidth = 1080;
        canvasHeight = 1080;
      } else if (preset === 'banner') {
        canvasWidth = 1200;
        canvasHeight = 400;
      }

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = themeBgMap[theme] || '#05050a';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      const img = new Image();
      const url = '/?username=' + encodeURIComponent(username) + '&theme=' + theme + '&layout=' + layout;
      
      fetch(url)
        .then(res => res.text())
        .then(svgText => {
          const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
          const blobUrl = URL.createObjectURL(blob);
          
          img.src = blobUrl;
          img.onload = () => {
            if (preset === 'twitter') {
              const drawHeight = 400;
              const yOffset = (675 - drawHeight) / 2;
              ctx.drawImage(img, 0, yOffset, 1200, drawHeight);
            } else if (preset === 'linkedin') {
              ctx.drawImage(img, 0, 0, 1584, 396);
            } else if (preset === 'instagram_story') {
              const scale = 1080 / 1200;
              const drawHeight = 1600 * scale;
              const yOffset = (1920 - drawHeight) / 2;
              ctx.drawImage(img, 0, yOffset, 1080, drawHeight);
            } else if (preset === 'instagram_post') {
              const scale = 1080 / 1600;
              const drawWidth = 1200 * scale;
              const xOffset = (1080 - drawWidth) / 2;
              ctx.drawImage(img, xOffset, 0, drawWidth, 1080);
            } else {
              ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
            }

            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.font = '11px monospace';
            ctx.textAlign = 'right';
            ctx.fillText('Developed by github.com/Garvit-821', canvasWidth - 35, canvasHeight - 20);

            const dataUrl = canvas.toDataURL(\`image/\${format}\`);
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = 'gitcrib-' + username + '-' + preset + '.' + (format === 'jpeg' ? 'jpg' : 'png');
            a.click();
            
            URL.revokeObjectURL(blobUrl);
          };
        })
        .catch(err => alert('Export failed: ' + err));
    }

    exportPngBtn.addEventListener('click', () => {
      checkStarLock(() => canvasRender('png'));
    });

    exportJpegBtn.addEventListener('click', () => {
      checkStarLock(() => canvasRender('jpeg'));
    });

    copyIframeBtn.addEventListener('click', () => {
      const username = usernameInput.value.trim() || 'Garvit-821';
      const theme = themeSelect.value;
      const preset = presetSelect.value;
      const layout = (preset === 'banner' || preset === 'twitter' || preset === 'linkedin') ? 'banner' : 'poster';
      
      const width = layout === 'banner' ? '1200' : '1200';
      const height = layout === 'banner' ? '400' : '1600';
      const origin = window.location.origin;
      
      const iframeCode = \`<iframe src="\${origin}/?username=\${encodeURIComponent(username)}&theme=\${theme}&layout=\${layout}" width="100%" style="aspect-ratio: \${width}/\${height}; border: none;" scrolling="no"></iframe>\`;
      
      navigator.clipboard.writeText(iframeCode)
        .then(() => {
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2000);
        })
        .catch(err => alert('Failed to copy code: ' + err));
    });
  </script>
</body>
</html>`;
}
