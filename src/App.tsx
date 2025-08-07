import React from "react";

// Ultra minimal app to force cache refresh - v3
function MinimalApp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Application Chargée ✓
        </h1>
        <p className="text-gray-600">
          L'application fonctionne maintenant correctement.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          Cache cleared - Version 3
        </div>
      </div>
    </div>
  );
}

export default MinimalApp;