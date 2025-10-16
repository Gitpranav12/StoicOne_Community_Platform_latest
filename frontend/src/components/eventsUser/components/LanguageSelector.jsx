export const LANGUAGES = [
  {
    id: 'cpp',
    name: 'C++',
    template: `#include <iostream>
using namespace std;

bool is_leap(int year) {
    // Write your code here
    
}

int main() {
    int year;
    cin >> year;
    cout << (is_leap(year) ? "true" : "false") << endl;
    return 0;
}`,
  },
  {
    id: 'java',
    name: 'Java',
    template: `import java.util.Scanner;

public class Main {
    public static boolean isLeap(int year) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int year = scanner.nextInt();
        System.out.println(isLeap(year));
    }
}`,
  },
  {
    id: 'python',
    name: 'Python',
    template: `def is_leap(year):
    # Write your code here
    

year = int(input())
print(is_leap(year))`,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    template: `function isLeap(year) {
    // Write your code here
    
}

// Read from stdin
const year = parseInt(require('fs').readFileSync(0, 'utf-8').trim());
console.log(isLeap(year));`,
  },
  {
    id: 'c',
    name: 'C',
    template: `#include <stdio.h>
#include <stdbool.h>

bool is_leap(int year) {
    // Write your code here
    
}

int main() {
    int year;
    scanf("%d", &year);
    printf("%s\\n", is_leap(year) ? "true" : "false");
    return 0;
}`,
  },
];

export function LanguageSelector({ value, onChange }) {
  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '180px',
        padding: '0.375rem 2.25rem 0.375rem 0.75rem',
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.5,
        color: '#212529',
        backgroundColor: '#fff',
        border: '1px solid #ced4da',
        borderRadius: '0.25rem',
        cursor: 'pointer'
      }}
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.id} value={lang.id}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
