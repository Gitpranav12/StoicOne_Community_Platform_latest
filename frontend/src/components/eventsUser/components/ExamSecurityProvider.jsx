import { useEffect, useState, useRef } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

export function ExamSecurityProvider({ children, onViolation, enabled }) {
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const isFullscreenRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // Prevent right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      onViolation('right-click');
    };

    // Prevent keyboard shortcuts (F12, Ctrl+Shift+I, etc.)
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        onViolation('devtools-attempt');
      }

      // Prevent copy in non-editor areas
      if (e.ctrlKey && e.key === 'c') {
        const target = e.target;
        if (!target.closest('textarea')) {
          e.preventDefault();
          onViolation('copy-attempt');
        }
      }
    };

    // Detect tab switching/window blur
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onViolation('tab-switch');
        setWarningMessage('Tab switching detected! This activity has been logged.');
        setShowWarning(true);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, onViolation]);

  useEffect(() => {
    if (!enabled) return;

    // Check if fullscreen is available
    const fullscreenAvailable = document.fullscreenEnabled !== undefined && document.fullscreenEnabled;

    // Request fullscreen (optional feature)
    const enterFullscreen = async () => {
      try {
        if (fullscreenAvailable) {
          await document.documentElement.requestFullscreen();
          isFullscreenRef.current = true;
        }
      } catch (err) {
        // Silently handle fullscreen errors (user dismissed, iframe restrictions, etc.)
        console.info('Fullscreen not available or declined by user');
      }
    };

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      
      // Only show warning if fullscreen was active and user exits (not on initial decline)
      if (!isCurrentlyFullscreen && enabled && isFullscreenRef.current && fullscreenAvailable) {
        onViolation('fullscreen-exit');
        setWarningMessage('Exiting fullscreen mode has been logged.');
        setShowWarning(true);
      }
      
      isFullscreenRef.current = isCurrentlyFullscreen;
    };

    // Only request fullscreen if available
    if (fullscreenAvailable) {
      enterFullscreen();
      document.addEventListener('fullscreenchange', handleFullscreenChange);
    }

    return () => {
      if (fullscreenAvailable) {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };
  }, [enabled, onViolation]);

  return (
    <>
      {children}
      
      {/* Warning Modal */}
      {showWarning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '0.5rem',
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
            maxWidth: '500px',
            width: '100%',
            margin: '0 1rem'
          }}>
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid #dee2e6',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FaExclamationTriangle style={{ color: '#dc3545' }} />
              <h5 style={{ margin: 0, fontSize: '1.25rem' }}>Exam Integrity Warning</h5>
            </div>
            <div style={{ padding: '1rem' }}>
              <p style={{ margin: 0 }}>{warningMessage}</p>
            </div>
            <div style={{
              padding: '1rem',
              borderTop: '1px solid #dee2e6',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button 
                onClick={() => setShowWarning(false)}
                style={{
                  backgroundColor: '#0d6efd',
                  color: '#fff',
                  border: '1px solid #0d6efd',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
