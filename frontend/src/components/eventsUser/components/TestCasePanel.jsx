import { useState } from 'react';

export function TestCasePanel({ testCases, customInput, onCustomInputChange }) {
  const [activeTab, setActiveTab] = useState('custom');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ul className="nav-tabs" style={{ marginBottom: '1rem' }}>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            Custom Input
          </button>
        </li>
        {testCases.map((testCase) => (
          <li className="nav-item" key={testCase.id}>
            <button 
              className={`nav-link ${activeTab === `test-${testCase.id}` ? 'active' : ''}`}
              onClick={() => setActiveTab(`test-${testCase.id}`)}
              style={{
                color: testCase.passed !== undefined ? (testCase.passed ? '#198754' : '#dc3545') : undefined
              }}
            >
              {testCase.passed !== undefined && (testCase.passed ? '✓' : '✗')} Sample Test case {testCase.id}
            </button>
          </li>
        ))}
      </ul>

      <div style={{ flex: '1 1 auto', overflow: 'auto' }}>
        {activeTab === 'custom' && (
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
              Custom Input:
            </label>
            <textarea
              rows={8}
              value={customInput}
              onChange={(e) => onCustomInputChange(e.target.value)}
              placeholder="Enter custom input here..."
              style={{
                width: '100%',
                fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
                fontSize: '0.875rem',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
        )}

        {testCases.map((testCase) => (
          activeTab === `test-${testCase.id}` && (
            <div key={testCase.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold', color: '#6c757d' }}>
                  Input:
                </label>
                <div style={{ backgroundColor: '#f8f9fa', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #dee2e6' }}>
                  <pre style={{ fontSize: '0.875rem', fontFamily: 'monospace', margin: 0 }}>{testCase.input}</pre>
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold', color: '#6c757d' }}>
                  Expected Output:
                </label>
                <div style={{ backgroundColor: '#f8f9fa', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #dee2e6' }}>
                  <pre style={{ fontSize: '0.875rem', fontFamily: 'monospace', margin: 0 }}>{testCase.expectedOutput}</pre>
                </div>
              </div>

              {testCase.actualOutput !== undefined && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold', color: '#6c757d' }}>
                    Your Output:
                  </label>
                  <div style={{
                    padding: '0.5rem',
                    borderRadius: '0.25rem',
                    border: `1px solid ${testCase.passed ? '#198754' : '#dc3545'}`,
                    backgroundColor: testCase.passed ? 'rgba(25, 135, 84, 0.1)' : 'rgba(220, 53, 69, 0.1)'
                  }}>
                    <pre style={{ fontSize: '0.875rem', fontFamily: 'monospace', margin: 0 }}>{testCase.actualOutput}</pre>
                  </div>
                </div>
              )}

              {testCase.executionTime !== undefined && (
                <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                  Execution time: {testCase.executionTime}ms
                </div>
              )}
            </div>
          )
        ))}
      </div>
    </div>
  );
}
