import { FaStar, FaCheckCircle, FaEye } from 'react-icons/fa';

const CURRENT_PROBLEM = {
  id: 172,
  title: 'Leap Year',
  difficulty: 'Easy',
  acceptanceRate: 68.5,
  submissions: 987654,
  tags: ['Math', 'Logic'],
  description: `An extra day is added to the calendar almost every four years as February 29, and the day is called a leap day. It corrects the calendar for the fact that our planet takes approximately 365.25 days to orbit the sun. A leap year contains a leap day.

In the Gregorian calendar, three criteria are used to identify leap years:

• The year can be evenly divided by 4, is a leap year, unless:
  ◦ The year can be evenly divided by 100, it is NOT a leap year, unless:
    • The year is also evenly divisible by 400. Then it is a leap year.

This means that in the Gregorian calendar, the years 2000 and 2400 are leap years, while 1800, 1900, 2100, 2200, 2300 and 2500 are NOT leap years.

**Task**

Given a year, determine whether it is a leap year. If it is a leap year, return the Boolean True, otherwise return False.

Note that the code stub provided reads from STDIN and passes arguments to the is_leap function. It is only necessary to complete the is_leap function.`,
  examples: [
    {
      input: '1990',
      output: 'False',
      explanation: '1990 is not a multiple of 4 hence it\'s not a leap year.'
    },
  ],
  constraints: [
    '1900 ≤ year ≤ 10⁵',
  ],
};

export function ProblemDescription() {
  const problem = CURRENT_PROBLEM;

  const difficultyColor = {
    'Easy': '#198754',
    'Medium': '#ffc107',
    'Hard': '#dc3545'
  }[problem.difficulty];

  return (
    <div style={{ padding: '1.5rem', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
            {problem.id}. {problem.title}
          </h2>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
            <FaStar style={{ color: '#ffc107' }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{
            backgroundColor: difficultyColor,
            color: '#fff',
            padding: '0.25rem 0.75rem',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            {problem.difficulty}
          </span>
          {problem.tags.map((tag) => (
            <span key={tag} style={{
              backgroundColor: '#f8f9fa',
              color: '#212529',
              border: '1px solid #dee2e6',
              padding: '0.25rem 0.75rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem'
            }}>
              {tag}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#6c757d' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FaCheckCircle size={12} />
            <span>Acceptance: {problem.acceptanceRate}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FaEye size={12} />
            <span>{problem.submissions.toLocaleString()} submissions</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {problem.description}
        </div>
      </div>

      {/* Examples */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Examples</h5>
        {problem.examples.map((example, index) => (
          <div key={index} className="card" style={{ marginBottom: '1rem' }}>
            <div className="card-body">
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.875rem' }}>Input:</strong>
                <div style={{ backgroundColor: '#f8f9fa', padding: '0.5rem', borderRadius: '0.25rem', marginTop: '0.25rem' }}>
                  <pre style={{ fontSize: '0.875rem', fontFamily: 'monospace', margin: 0 }}>{example.input}</pre>
                </div>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.875rem' }}>Output:</strong>
                <div style={{ backgroundColor: '#f8f9fa', padding: '0.5rem', borderRadius: '0.25rem', marginTop: '0.25rem' }}>
                  <pre style={{ fontSize: '0.875rem', fontFamily: 'monospace', margin: 0 }}>{example.output}</pre>
                </div>
              </div>
              {example.explanation && (
                <div>
                  <strong style={{ fontSize: '0.875rem' }}>Explanation:</strong>
                  <p style={{ fontSize: '0.875rem', margin: 0, marginTop: '0.25rem' }}>{example.explanation}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Constraints */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Constraints</h5>
        <ul style={{ fontSize: '0.875rem' }}>
          {problem.constraints.map((constraint, index) => (
            <li key={index} style={{ fontFamily: 'monospace' }}>{constraint}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
