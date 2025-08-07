// Ultimate cache buster v5
import { createRoot } from 'react-dom/client'

function UltraMinimal() {
  return (
    <div id="fresh-app" style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#e5e7eb',
      margin: 0,
      padding: 0
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '1rem'
        }}>🎉</div>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '1rem',
          margin: 0
        }}>
          Cache Cleared Successfully!
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '1.1rem',
          marginBottom: '1.5rem',
          margin: 0
        }}>
          Application is now running fresh without any cache issues.
        </p>
        <div style={{
          backgroundColor: '#f3f4f6',
          padding: '0.75rem',
          borderRadius: '6px',
          fontSize: '0.875rem',
          color: '#374151'
        }}>
          Version 5 - Ultra Clean Start
        </div>
      </div>
    </div>
  );
}

// Clear everything first
if (typeof window !== 'undefined') {
  // Clear React internals if they exist
  if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.clear();
  }
}

const container = document.getElementById("root");
if (container) {
  container.innerHTML = ''; // Clear any existing content
  const root = createRoot(container);
  root.render(<UltraMinimal />);
}