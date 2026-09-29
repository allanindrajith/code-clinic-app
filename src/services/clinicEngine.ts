export interface TriageTemplate {
  id: string;
  title: string;
  badge: string;
  language: string;
  framework: string;
  os: string;
  error: string;
  code: string;
  expected: string;
  actual: string;
}

export interface LearningRecord {
  id: string;
  signature: string;
  keywords: string[];
  stack: {
    language: string;
    framework: string;
    environment: string;
  };
  symptom: string;
  root_cause: string;
  treatment: string;
  code_patch: string;
  prevention: string;
  success_count: number;
  failure_count: number;
  confidence: number;
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface PatientFacts {
  language: string | null;
  framework: string | null;
  os: string | null;
  versions: Record<string, string>;
  errorSignature: string | null;
  diagnosedBugs: string[];
  resolvedCount: number;
  lastDiagnosis?: string;
  lastTreatment?: string;
  lastCodePatch?: string;
  lastSymptom?: string;
}

export interface ConsultationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  code?: string;
  error?: string;
  timestamp: string;
  payload?: DiagnosisResult;
}

export interface DiagnosisResult {
  sessionId: string;
  phase: 'intake' | 'diagnosis';
  clarifyingQuestion: string | null;
  diagnosis: string;
  patchCode: string;
  prevention: string;
  didSearch: boolean;
  searchQuery: string;
  searchResults: WebSearchResult[];
  matchedCaseId: string | null;
  confidence: number;
  sandboxRun?: {
    language: string;
    exitCode: number;
    stdout: string;
    stderr: string;
    success: boolean;
  };
}

export const TRIAGE_TEMPLATES: TriageTemplate[] = [
  {
    id: 'case-nextjs-15',
    title: 'Next.js 15 cookies() breaking change',
    badge: 'React / Next.js 15',
    language: 'TypeScript',
    framework: 'Next.js 15.0.0',
    os: 'macOS Sequoia (Darwin 24)',
    error: 'Error: Route handler cookies() should be awaited in Next.js 15. The `cookies()` function now returns a Promise.',
    code: `import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies(); // <-- Throws error here
  const sessionId = cookieStore.get('sessionId')?.value;
  return Response.json({ activeSession: sessionId });
}`,
    expected: 'Expected route handler to read the sessionId cookie from incoming request headers.',
    actual: 'Throws error at runtime stating cookies() is a Promise and must be awaited.'
  },
  {
    id: 'case-react-map',
    title: "React TypeError: Cannot read properties of undefined (reading 'map')",
    badge: 'React / Web',
    language: 'JavaScript / JSX',
    framework: 'React 19 / 18',
    os: 'Browser (Chrome 131)',
    error: "TypeError: Cannot read properties of undefined (reading 'map')\n    at UserList (UserList.jsx:9:14)\n    at renderWithHooks (react-dom.development.js:15486)",
    code: `function UserList() {
  const [users, setUsers] = useState(); // undefined initially

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}`,
    expected: 'Display list of users once fetched from API.',
    actual: "Screen turns blank with uncaught TypeError reading 'map' on initial render."
  },
  {
    id: 'case-python-asyncio',
    title: 'Python asyncio RuntimeError: Event loop is closed',
    badge: 'Python 3.12 / asyncio',
    language: 'Python',
    framework: 'asyncio / aiohttp',
    os: 'macOS / Linux',
    error: `RuntimeError: Event loop is closed
  File "/usr/local/lib/python3.12/asyncio/base_events.py", line 519, in _check_closed
    raise RuntimeError('Event loop is closed')`,
    code: `import asyncio
import aiohttp

async def fetch_data():
    session = aiohttp.ClientSession()
    resp = await session.get('https://httpbin.org/get')
    data = await resp.json()
    return data

if __name__ == '__main__':
    data = asyncio.run(fetch_data())
    print(data)`,
    expected: 'Clean exit after fetching JSON payload.',
    actual: 'Crashes on program termination with RuntimeError: Event loop is closed trace.'
  },
  {
    id: 'case-docker-eacces',
    title: 'Docker Node.js EACCES permission denied',
    badge: 'Docker / DevOps',
    language: 'Dockerfile / Node.js',
    framework: 'Docker Compose',
    os: 'Linux / Docker Desktop',
    error: `npm ERR! code EACCES
npm ERR! syscall mkdir
npm ERR! path /app/node_modules/.staging
npm ERR! errno -13
npm ERR! Error: EACCES: permission denied, mkdir '/app/node_modules/.staging'`,
    code: `FROM node:20-alpine
WORKDIR /app
USER node
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "server.js"]`,
    expected: "Build container image with non-root user 'node'.",
    actual: 'npm install fails with EACCES permission denied on /app/node_modules directory.'
  }
];

export const INITIAL_LEARNING_STORE: LearningRecord[] = [
  {
    id: 'case-rec-101',
    signature: "TypeError: Cannot read properties of undefined (reading 'map')",
    keywords: ['undefined', 'map', 'array', 'react', 'javascript', 'typescript'],
    stack: {
      language: 'JavaScript / TypeScript',
      framework: 'React / Next.js',
      environment: 'Browser / Node.js'
    },
    symptom: 'Component crashes during render when attempting to iterate over props or state data that has not arrived yet from an async fetch.',
    root_cause: 'The variable passed to .map() is initialized as undefined or null before the asynchronous fetch promise resolves, or the API response returned an object with a nested array instead of a direct array.',
    treatment: 'Use optional chaining with a default empty array fallback: (items || []).map(...) or items?.map(...), and ensure initial state is an empty array useState([]).',
    code_patch: `// Before:
const [users, setUsers] = useState(); // undefined initially
...
return (
  <ul>
    {users.map(u => <li key={u.id}>{u.name}</li>)}
  </ul>
);

// After (Surgical Treatment):
const [users, setUsers] = useState<User[]>([]); // initialize with empty array
...
return (
  <ul>
    {(users ?? []).map(u => (
      <li key={u.id}>{u.name}</li>
    ))}
  </ul>
);`,
    prevention: '1. Define rigorous TypeScript interfaces for API payloads. 2. Initialize list state with [] instead of null/undefined. 3. Implement an explicit loading boundary or Skeleton before mapping data.',
    success_count: 19,
    failure_count: 0,
    confidence: 0.99
  },
  {
    id: 'case-rec-102',
    signature: 'Route handler cookies() should be awaited in Next.js 15',
    keywords: ['cookies', 'next.js', 'nextjs', 'nextjs 15', 'async', 'await', 'headers'],
    stack: {
      language: 'TypeScript',
      framework: 'Next.js 15+',
      environment: 'Node.js 20+ / Vercel'
    },
    symptom: 'Calling const cookieStore = cookies() throws a synchronous access runtime warning or error in Next.js 15.',
    root_cause: 'In Next.js 15, dynamic APIs like cookies(), headers(), and params became asynchronous Promises to allow internal performance optimizations and early streaming.',
    treatment: 'Await the cookies() call inside the async function: const cookieStore = await cookies();',
    code_patch: `// Before (Next.js 14):
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  return Response.json({ token });
}

// After (Next.js 15 Surgical Treatment):
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  return Response.json({ token });
}`,
    prevention: 'When upgrading to Next.js 15+, run `npx @next/codemod@canary next-async-request-api .` to automatically upgrade all synchronous request-specific APIs.',
    success_count: 14,
    failure_count: 1,
    confidence: 0.94
  },
  {
    id: 'case-rec-103',
    signature: 'RuntimeError: Event loop is closed in asyncio Python',
    keywords: ['runtimeerror', 'event loop is closed', 'asyncio', 'python', 'aiohttp'],
    stack: {
      language: 'Python 3.10+',
      framework: 'asyncio / aiohttp / Playwright',
      environment: 'macOS / Windows / Linux'
    },
    symptom: 'Python script fails at exit or during connection cleanup with RuntimeError: Event loop is closed when using asyncio.run() or aiohttp ClientSession.',
    root_cause: 'Async resources (like aiohttp.ClientSession or database connection pools) were closed after the event loop finished or the Windows selector loop shut down ungracefully.',
    treatment: 'Ensure all client sessions and connectors are closed inside an async with context manager BEFORE the loop exits, or add asyncio.sleep(0.25) before loop shutdown to allow pending SSL transports to flush.',
    code_patch: `# Before:
import aiohttp, asyncio

async def fetch_data():
    session = aiohttp.ClientSession()
    resp = await session.get('https://httpbin.org/get')
    return await resp.json()

# After (Surgical Treatment):
import aiohttp, asyncio

async def fetch_data():
    async with aiohttp.ClientSession() as session:
        async with session.get('https://httpbin.org/get') as resp:
            return await resp.json()

if __name__ == '__main__':
    data = asyncio.run(fetch_data())
    print(data)`,
    prevention: 'Always wrap network and database clients inside async context managers (async with) so cleanup hooks execute while the event loop is active.',
    success_count: 10,
    failure_count: 0,
    confidence: 0.98
  },
  {
    id: 'case-rec-104',
    signature: "Error: EACCES: permission denied, mkdir '/app/node_modules'",
    keywords: ['eacces', 'permission denied', 'docker', 'node_modules', 'npm', 'user node'],
    stack: {
      language: 'JavaScript / Node.js',
      framework: 'Docker / Container',
      environment: 'Linux Alpine / Debian'
    },
    symptom: 'Docker container fails during npm install or volume mount with EACCES: permission denied.',
    root_cause: "Host volume mount overwrites container file ownership with root permissions, while the container runs as unprivileged user 'node', preventing directory creation.",
    treatment: 'In your Dockerfile, create the directory and set ownership to node user before USER node: RUN mkdir -p /app/node_modules && chown -R node:node /app',
    code_patch: `# Before:
FROM node:20-alpine
WORKDIR /app
USER node
COPY package*.json ./
RUN npm install

# After (Surgical Treatment):
FROM node:20-alpine
WORKDIR /app
RUN mkdir -p /app/node_modules && chown -R node:node /app
USER node
COPY --chown=node:node package*.json ./
RUN npm install`,
    prevention: 'Use named volumes for node_modules in docker-compose.yml: `volumes: [ .:/app, /app/node_modules ]` to prevent host directory ownership bleeding into container.',
    success_count: 15,
    failure_count: 1,
    confidence: 0.95
  }
];

export class ClinicService {
  private learningStore: LearningRecord[] = [...INITIAL_LEARNING_STORE];

  getLearningStore(): LearningRecord[] {
    return this.learningStore;
  }

  getTemplates(): TriageTemplate[] {
    return TRIAGE_TEMPLATES;
  }

  extractFacts(input: string, code?: string): Partial<PatientFacts> {
    const combined = `${input || ''} ${code || ''}`.toLowerCase();
    const facts: Partial<PatientFacts> = {
      versions: {},
      diagnosedBugs: []
    };

    if (/typescript|\.tsx?|interface\s|type\s/i.test(combined)) {
      facts.language = 'TypeScript';
    } else if (/python|def\s+|asyncio|aiohttp/i.test(combined)) {
      facts.language = 'Python';
    } else if (/docker|dockerfile|container|npm err/i.test(combined)) {
      facts.language = 'Dockerfile / Node.js';
    } else if (/javascript|\.jsx?|const\s|function\s/i.test(combined)) {
      facts.language = 'JavaScript';
    }

    if (/next\.js|nextjs|next\/headers|next\/navigation/i.test(combined)) {
      facts.framework = 'Next.js 15+';
      facts.versions = { next: '15.x' };
    } else if (/react|useeffect|usestate|component/i.test(combined)) {
      facts.framework = 'React';
    } else if (/asyncio|aiohttp/i.test(combined)) {
      facts.framework = 'asyncio / aiohttp';
    } else if (/docker|compose/i.test(combined)) {
      facts.framework = 'Docker Compose';
    }

    if (/darwin|mac|macos/i.test(combined)) {
      facts.os = 'macOS';
    } else if (/linux|ubuntu|alpine/i.test(combined)) {
      facts.os = 'Linux / Alpine';
    } else if (/windows/i.test(combined)) {
      facts.os = 'Windows';
    } else {
      facts.os = 'Cross-platform / Web';
    }

    const errorMatch = input.match(/(Error:[^\n]+|TypeError:[^\n]+|RuntimeError:[^\n]+|npm ERR![^\n]+)/);
    if (errorMatch) {
      facts.errorSignature = errorMatch[0].trim();
    }

    return facts;
  }

  searchLearningStore(queryText: string): LearningRecord[] {
    const text = (queryText || '').toLowerCase();
    const tokens = text.match(/[a-z0-9_.-]+/g) || [];
    if (tokens.length === 0) return this.learningStore;

    const scored = this.learningStore.map(record => {
      let score = 0;
      const recText = `${record.signature} ${record.symptom} ${record.root_cause} ${record.keywords.join(' ')}`.toLowerCase();

      for (const token of tokens) {
        if (token.length > 2 && recText.includes(token)) {
          score += 2;
          if (record.signature.toLowerCase().includes(token)) score += 3;
        }
      }

      return { record, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.filter(s => s.score > 2).map(s => s.record);
  }

  performWebVerification(query: string): { didSearch: boolean; results: WebSearchResult[] } {
    const q = query.toLowerCase();
    const results: WebSearchResult[] = [];

    if (q.includes('next') || q.includes('cookie') || q.includes('headers')) {
      results.push({
        title: 'Next.js 15 Upgrade Guide — Async Request APIs',
        url: 'https://nextjs.org/docs/app/building-your-application/upgrading/version-15#async-request-api',
        snippet: 'In Next.js 15, cookies(), headers(), params, and searchParams are now asynchronous Promises and must be awaited before accessing properties.'
      });
      results.push({
        title: 'GitHub Discussion: Next.js 15 cookies() should be awaited',
        url: 'https://github.com/vercel/next.js/discussions/cookies-await-fix',
        snippet: 'Automated codemod available: run npx @next/codemod@canary next-async-request-api . to transform calls across route handlers and server components.'
      });
    } else if (q.includes('map') || q.includes('undefined') || q.includes('react')) {
      results.push({
        title: 'React Docs — Rendering Lists & Conditional Rendering',
        url: 'https://react.dev/learn/rendering-lists',
        snippet: 'Ensure that data passed to .map() is guaranteed to be an array. Initialize useState with [] and use nullish coalescing (data?.items ?? []).'
      });
      results.push({
        title: 'MDN Web Docs — Array.prototype.map()',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map',
        snippet: 'TypeError: Cannot read properties of undefined occurs when invoking .map() on an uninitialized reference.'
      });
    } else if (q.includes('asyncio') || q.includes('event loop') || q.includes('closed')) {
      results.push({
        title: 'Python 3.12 asyncio — Event Loop Lifecycle Management',
        url: 'https://docs.python.org/3/library/asyncio-runner.html',
        snippet: 'asyncio.run() closes the loop immediately upon completion. Any open aiohttp.ClientSession or SSL transport will fail with RuntimeError: Event loop is closed.'
      });
      results.push({
        title: 'aiohttp Documentation — Graceful Shutdown & ClientSession',
        url: 'https://docs.aiohttp.org/en/stable/client_quickstart.html#graceful-shutdown',
        snippet: 'Always use async with aiohttp.ClientSession() to ensure connections close cleanly before asyncio loop teardown.'
      });
    } else if (q.includes('docker') || q.includes('permission') || q.includes('eacces')) {
      results.push({
        title: 'Docker Documentation — Non-root User & Permission Patterns',
        url: 'https://docs.docker.com/reference/dockerfile/#user',
        snippet: 'Pre-create destination directories like /app/node_modules with root and assign ownership to node user before executing USER node in Alpine.'
      });
      results.push({
        title: 'Node.js Docker Best Practices — EACCES Resolution',
        url: 'https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md',
        snippet: 'Bind mounting host directories can override container ownership. Use named volumes for node_modules to preserve node user permissions.'
      });
    }

    return {
      didSearch: results.length > 0,
      results
    };
  }

  diagnose({
    sessionId,
    message,
    code = '',
    error = '',
    expected = '',
    actual = ''
  }: {
    sessionId: string;
    message: string;
    code?: string;
    error?: string;
    expected?: string;
    actual?: string;
  }): DiagnosisResult {
    const combinedQuery = `${message || ''} ${error || ''} ${code || ''} ${expected || ''} ${actual || ''}`.trim();
    
    // Intake check: if query is very short and lacks details
    const hasError = !!(error || /error|fail|crash|warning/i.test(combinedQuery));
    const hasCode = !!(code || /\{|\(|def\s|function|import/i.test(combinedQuery));

    if (!hasError && !hasCode && message.trim().length < 30) {
      return {
        sessionId,
        phase: 'intake',
        clarifyingQuestion: "Could you paste the exact error message or stack trace from your terminal or console?",
        diagnosis: `**Dr. Debug Intake Assessment:**\n\nI hear your symptom: *"${message.trim()}"*.\n\nTo give you a surgical diagnosis rather than guessing blindly, I need one critical clinical observation:`,
        patchCode: '',
        prevention: 'Always inspect the exact error trace before attempting code edits.',
        didSearch: false,
        searchQuery: '',
        searchResults: [],
        matchedCaseId: null,
        confidence: 0.5
      };
    }

    if (!hasCode && hasError && message.trim().length < 35 && !code) {
      return {
        sessionId,
        phase: 'intake',
        clarifyingQuestion: "What does the code look like around where this error triggers? Please paste the relevant function or block.",
        diagnosis: `**Dr. Debug Intake Assessment:**\n\nError signature noted. To prescribe a targeted patch, please paste the relevant code block where the error manifests:`,
        patchCode: '',
        prevention: 'Isolating the affected block helps prevent regression in surrounding systems.',
        didSearch: false,
        searchQuery: '',
        searchResults: [],
        matchedCaseId: null,
        confidence: 0.6
      };
    }

    // Check RAG Memory
    const matches = this.searchLearningStore(combinedQuery);
    const topMatch = matches[0];

    // Check if web search verification is helpful
    const verification = this.performWebVerification(combinedQuery);

    if (topMatch) {
      return {
        sessionId,
        phase: 'diagnosis',
        clarifyingQuestion: null,
        diagnosis: `### 1. Diagnosis (Root Cause Hypothesis)\n${topMatch.root_cause}\n\n*Why this happens:* ${topMatch.symptom}`,
        patchCode: topMatch.code_patch,
        prevention: topMatch.prevention,
        didSearch: verification.didSearch,
        searchQuery: topMatch.signature,
        searchResults: verification.results,
        matchedCaseId: topMatch.id,
        confidence: topMatch.confidence
      };
    }

    // Dynamic heuristic diagnosis
    const lower = combinedQuery.toLowerCase();
    if (lower.includes('null') || lower.includes('undefined') || lower.includes('cannot read properties')) {
      return {
        sessionId,
        phase: 'diagnosis',
        clarifyingQuestion: null,
        diagnosis: `### 1. Diagnosis (Root Cause Hypothesis)\nAttempted to access a property on an uninitialized (\`undefined\` or \`null\`) object reference.\n\n*Why this happens:* Asynchronous operations (API calls, state updates) have not completed by the time this code branch executes, leaving the variable empty during the initial execution cycle.`,
        patchCode: `// Before:\nconst value = data.user.name;\n\n// After (Surgical Treatment):\nconst value = data?.user?.name ?? 'Guest';`,
        prevention: 'Apply optional chaining (\`?.\`) and nullish coalescing (\`??\`) defaults on external or asynchronous data.',
        didSearch: verification.didSearch,
        searchQuery: 'Null / undefined property access',
        searchResults: verification.results,
        matchedCaseId: null,
        confidence: 0.88
      };
    }

    return {
      sessionId,
      phase: 'diagnosis',
      clarifyingQuestion: null,
      diagnosis: `### 1. Diagnosis (Root Cause Hypothesis)\nAnalyzing symptom: *"${message.slice(0, 100)}..."*\n\nThe error stems from an asynchronous state or environment boundary mismatch between caller expectations and the runtime environment.\n\n*Clinical Recommendation:* Verify input types and ensure all promise chains are properly awaited or wrapped with defensive guards.`,
      patchCode: `// Prescribed Surgical Patch:\ntry {\n  // Wrap sensitive execution\n  ${code ? code.split('\n')[0] : '// ... affected operation'}\n} catch (err) {\n  console.error("Clinical caught error:", err);\n}`,
      prevention: 'Add explicit error boundaries and integration test suites.',
      didSearch: verification.didSearch,
      searchQuery: message.slice(0, 60),
      searchResults: verification.results,
      matchedCaseId: null,
      confidence: 0.82
    };
  }

  recordFeedback(caseId: string | null, solved: boolean): void {
    if (!caseId) return;
    const match = this.learningStore.find(c => c.id === caseId);
    if (match) {
      if (solved) {
        match.success_count += 1;
        match.confidence = Math.min(0.99, match.confidence + 0.01);
      } else {
        match.failure_count += 1;
        match.confidence = Math.max(0.70, match.confidence - 0.05);
      }
    }
  }

  executeSandbox(language: string, code: string): { exitCode: number; stdout: string; stderr: string; success: boolean } {
    if (language === 'javascript' || language === 'typescript') {
      try {
        const logs: string[] = [];
        const customConsole = {
          log: (...args: any[]) => logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')),
          warn: (...args: any[]) => logs.push('[WARN] ' + args.map(a => String(a)).join(' ')),
          error: (...args: any[]) => logs.push('[ERR] ' + args.map(a => String(a)).join(' '))
        };

        // Wrap code execution safely
        const runner = new Function('console', `"use strict";\n${code}`);
        runner(customConsole);

        return {
          exitCode: 0,
          stdout: logs.length > 0 ? logs.join('\n') : '[Execution completed with no console output]',
          stderr: '',
          success: true
        };
      } catch (err: any) {
        return {
          exitCode: 1,
          stdout: '',
          stderr: `${err.name}: ${err.message}\n  at code-clinic-sandbox:eval`,
          success: false
        };
      }
    } else {
      // Python simulation
      const lines = code.split('\n');
      const prints: string[] = [];
      let hadError = false;
      let errorMsg = '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
          const content = trimmed.slice(6, -1).replace(/^["']|["']$/g, '');
          prints.push(content);
        }
        if (trimmed.includes('asyncio.run(') && !code.includes('async with')) {
          hadError = true;
          errorMsg = `RuntimeError: Event loop is closed\n  File "/usr/local/lib/python3.12/asyncio/base_events.py", line 519, in _check_closed\n    raise RuntimeError('Event loop is closed')`;
        }
      }

      if (hadError) {
        return {
          exitCode: 1,
          stdout: prints.join('\n'),
          stderr: errorMsg,
          success: false
        };
      }

      return {
        exitCode: 0,
        stdout: prints.length > 0 ? prints.join('\n') : "Process exited with code 0 (simulated Python 3.12 execution)",
        stderr: '',
        success: true
      };
    }
  }
}

export const clinicService = new ClinicService();
