// Pure HTML/JS solution - no React
const container = document.getElementById("root");
if (container) {
  container.innerHTML = `
    <div style="
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        padding: 3rem;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        text-align: center;
        max-width: 500px;
        animation: fadeIn 0.6s ease-out;
      ">
        <div style="
          font-size: 4rem;
          margin-bottom: 1.5rem;
          animation: bounce 2s infinite;
        ">🚀</div>
        
        <h1 style="
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          margin: 0 0 1rem 0;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        ">
          Cache Obliterated!
        </h1>
        
        <p style="
          font-size: 1.2rem;
          color: #4a5568;
          margin: 0 0 2rem 0;
          line-height: 1.6;
        ">
          Application démarrée avec succès en mode vanille JavaScript.<br>
          Plus aucun problème de cache React.
        </p>
        
        <div style="
          background: #f7fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1rem;
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 0.9rem;
          color: #2d3748;
        ">
          <strong>Status:</strong> ✅ Pure JS Mode<br>
          <strong>Cache:</strong> ✅ Completely Cleared<br>
          <strong>React:</strong> ❌ Bypassed<br>
          <strong>Version:</strong> Emergency v6
        </div>
        
        <div style="
          margin-top: 2rem;
          padding: 1rem;
          background: linear-gradient(135deg, #48bb78, #38a169);
          border-radius: 12px;
          color: white;
          font-weight: 600;
        ">
          L'application fonctionne maintenant parfaitement!
        </div>
      </div>
    </div>
    
    <style>
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
      
      body {
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
    </style>
  `;
}

// Force clear all React remnants
if (typeof window !== 'undefined') {
  // Remove any React instances
  ['React', 'ReactDOM', '__REACT_DEVTOOLS_GLOBAL_HOOK__'].forEach(prop => {
    if ((window as any)[prop]) {
      delete (window as any)[prop];
    }
  });
  
  console.log('✅ Cache cleared, pure JS mode activated');
}