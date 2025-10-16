import { useRef } from 'react';

export function CodeEditor({ value, onChange, language, onCursorChange }) {
  const textareaRef = useRef(null);

  // Handle tab key for indentation
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after the tab
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
        updateCursorPosition(target);
      }, 0);
    }
  };

  // Update cursor position
  const updateCursorPosition = (target) => {
    const cursorPos = target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);
    const lines = textBeforeCursor.split('\n');
    const lineNumber = lines.length;
    const columnNumber = lines[lines.length - 1].length + 1;
    
    onCursorChange?.(lineNumber, columnNumber);
  };

  const handleClick = (e) => {
    updateCursorPosition(e.currentTarget);
  };

  const handleKeyUp = (e) => {
    updateCursorPosition(e.currentTarget);
  };

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', overflow: 'auto' }}>
      <div style={{ display: 'flex', height: '100%', minHeight: '100%' }}>
        {/* Line Numbers */}
        <div style={{ 
          padding: '1rem', 
          textAlign: 'right', 
          userSelect: 'none', 
          color: '#6c757d', 
          fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
          fontSize: '0.875rem',
          backgroundColor: '#f8f9fa', 
          borderRight: '1px solid #dee2e6',
          minWidth: '50px'
        }}>
          {value.split('\n').map((_, index) => (
            <div key={index} style={{ lineHeight: '1.5rem', height: '1.5rem' }}>
              {index + 1}
            </div>
          ))}
        </div>
        
        {/* Code Area */}
        <div style={{ flex: '1 1 auto', position: 'relative', minHeight: '100%' }}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              updateCursorPosition(e.currentTarget);
            }}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onClick={handleClick}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
              fontSize: '0.875rem',
              padding: '1rem',
              resize: 'none',
              outline: 'none',
              lineHeight: '1.5rem',
              backgroundColor: '#fff'
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder="// Write your code here..."
          />
        </div>
      </div>
    </div>
  );
}
