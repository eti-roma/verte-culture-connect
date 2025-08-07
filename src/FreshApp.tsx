// New minimal entry point - cache buster v4
import React from "react";

function FreshApp() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1rem'
        }}>
          ✅ Application Fonctionnelle
        </h1>
        <p style={{
          color: '#6b7280',
          marginBottom: '1rem'
        }}>
          Cache complètement nettoyé et application redémarrée.
        </p>
        <div style={{
          fontSize: '0.875rem',
          color: '#9ca3af'
        }}>
          Version 4 - Fresh Start
        </div>
      </div>
    </div>
  );
}

export default FreshApp;