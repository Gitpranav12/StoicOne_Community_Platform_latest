import { useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export function OutputConsole({ result, testResults }) {
  const [activeTab, setActiveTab] = useState('compiler');

  if (!result) {
    return (
      <div style={{ textAlign: 'center', color: '#6c757d', paddingTop: '3rem', paddingBottom: '3rem' }}>
        <p style={{ fontSize: '0.875rem' }}>Run your code to see the output here</p>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {testResults && (
        <div style={{
          marginBottom: '1rem',
          padding: '1rem',
          borderRadius: '0.25rem',
          border: `1px solid ${testResults.passed === testResults.total ? '#198754' : '#dc3545'}`,
          backgroundColor: testResults.passed === testResults.total ? 'rgba(25, 135, 84, 0.1)' : 'rgba(220, 53, 69, 0.1)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {testResults.passed === testResults.total ? (
                <>
                  <FaCheckCircle style={{ color: '#198754' }} />
                  <h6 style={{ margin: 0, color: '#198754' }}>Correct Answer</h6>
                </>
              ) : (
                <>
                  <FaTimesCircle style={{ color: '#dc3545' }} />
                  <h6 style={{ margin: 0, color: '#dc3545' }}>Wrong Answer :(</h6>
                </>
              )}
            </div>
            <p style={{ fontSize: '0.875rem', color: '#6c757d', margin: 0, marginLeft: '1.5rem' }}>
              {testResults.passed}/{testResults.total} test case{testResults.total > 1 ? 's' : ''} passed
            </p>
          </div>
        </div>
      )}

      <ul className="nav-tabs" style={{ marginBottom: '1rem' }}>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'compiler' ? 'active' : ''}`}
            onClick={() => setActiveTab('compiler')}
          >
            Compiler Message
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'output' ? 'active' : ''}`}
            onClick={() => setActiveTab('output')}
          >
            Output
          </button>
        </li>
      </ul>

      <div style={{ flex: '1 1 auto', overflow: 'auto' }}>
        {activeTab === 'compiler' && (
          <div>
            {result.stderr ? (
              <div>
                <h6 style={{ fontSize: '0.875rem', color: '#dc3545' }}>Error</h6>
                <div style={{
                  backgroundColor: 'rgba(220, 53, 69, 0.1)',
                  border: '1px solid #dc3545',
                  padding: '1rem',
                  borderRadius: '0.25rem'
                }}>
                  <pre style={{
                    fontSize: '0.875rem',
                    fontFamily: 'monospace',
                    color: '#dc3545',
                    margin: 0,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {result.stderr}
                  </pre>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.875rem', color: '#198754' }}>
                ✓ Compiled successfully
              </div>
            )}
          </div>
        )}

        {activeTab === 'output' && (
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold', color: '#6c757d' }}>
              Your Output (stdout)
            </label>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '1rem',
              borderRadius: '0.25rem',
              border: '1px solid #dee2e6'
            }}>
              <pre style={{
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                margin: 0,
                whiteSpace: 'pre-wrap'
              }}>
                {result.stdout || '~ no response on stdout ~'}
              </pre>
            </div>
            {result.executionTime && (
              <div style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '0.5rem' }}>
                Execution time: {result.executionTime}ms
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
