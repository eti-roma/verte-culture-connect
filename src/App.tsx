import React from "react";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Cache Clear Required</h1>
        <p className="mb-4">Please restart your development server:</p>
        <div className="bg-gray-100 p-4 rounded text-left font-mono text-sm">
          <div>1. Stop server: Ctrl+C</div>
          <div>2. Clear cache: rm -rf .vite dist</div>
          <div>3. Restart: npm run dev --force</div>
        </div>
      </div>
    </div>
  );
}

export default App;