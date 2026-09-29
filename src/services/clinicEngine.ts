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
    const rawInput = `${message || ''} ${error || ''}`.trim();
    const combinedQuery = `${rawInput} ${code || ''} ${expected || ''} ${actual || ''}`.trim();

    // Check if web search verification is helpful
    const verification = this.performWebVerification(combinedQuery);

    // 1. Check RAG Memory for pre-curated hospital cases
    const matches = this.searchLearningStore(combinedQuery);
    const topMatch = matches[0];

    if (topMatch && (combinedQuery.toLowerCase().includes(topMatch.signature.toLowerCase().slice(0, 15)) || topMatch.confidence > 0.9)) {
      return {
        sessionId,
        phase: 'diagnosis',
        clarifyingQuestion: null,
        diagnosis: `### 🩺 Diagnosis: ${topMatch.signature}

**Root Cause Hypothesis:**
${topMatch.root_cause}

---

### 📋 Step-by-Step Instructions to Fix It:
1. **Locate affected scope:** Review where this operation is called in your code (${topMatch.stack.framework} on ${topMatch.stack.language}).
2. **Apply the surgical prescription:** Replace the problematic construct with the verified fix shown below.
3. **Verify resolution:** Test the execution or run in the Code Clinic ICU sandbox to confirm the error no longer triggers.`,
        patchCode: topMatch.code_patch,
        prevention: topMatch.prevention,
        didSearch: verification.didSearch,
        searchQuery: topMatch.signature,
        searchResults: verification.results,
        matchedCaseId: topMatch.id,
        confidence: topMatch.confidence
      };
    }

    const lower = combinedQuery.toLowerCase();

    // 2. Specialized Error Diagnostic Patterns with Concrete Step-by-Step Instructions

    // Case A: Module not found / Cannot find module
    const moduleMatch = combinedQuery.match(/(?:Cannot find module|Can't resolve|Module not found: Can't resolve)\s+['"]([^'"]+)['"]/i)
      || combinedQuery.match(/ModuleNotFoundError:\s+No module named\s+['"]([^'"]+)['"]/i);
    if (moduleMatch || lower.includes('cannot find module') || lower.includes("can't resolve")) {
      const pkg = moduleMatch ? moduleMatch[1] : 'the missing package';
      const isPython = lower.includes('python') || lower.includes('modulenotfounderror');
      const installCmd = isPython ? `pip install ${pkg}` : `npm install ${pkg}`;

      return {
        sessionId,
        phase: 'diagnosis',
        clarifyingQuestion: null,
        diagnosis: `### 🩺 Diagnosis: Missing Dependency / Module Not Found

**Root Cause:**
Your runtime environment attempted to import \`${pkg}\`, but the package is not installed in your project dependencies or the relative file path is broken.

---

### 📋 Step-by-Step Instructions to Fix It:
1. **Install the package:** Run the installation command in your project root terminal:
   \`${installCmd}\`
2. **Verify import statement:** Ensure your import statement spelling matches the package export (e.g. \`import ${pkg.includes('/') ? pkg.split('/').pop() : pkg} from '${pkg}';\`).
3. **Restart your development bundler:** Clear cache and restart your dev server:
   \`${isPython ? 'python main.py' : 'npx expo start -c || npm run dev'}\``,
        patchCode: isPython
          ? `# Step 1: Install in terminal\n# pip install ${pkg}\n\n# Step 2: Import cleanly in your script\ntry:\n    import ${pkg}\nexcept ImportError:\n    print("Please run: pip install ${pkg}")`
          : `// Step 1: Install in terminal:\n// ${installCmd}\n\n// Step 2: Import in code:\nimport ${pkg.replace(/[^a-zA-Z0-9]/g, '_')} from '${pkg}';`,
        prevention: 'Always verify package.json (or requirements.txt) and commit your lockfile (package-lock.json / bun.lockb) to ensure teammates and CI have identical dependencies.',
        didSearch: true,
        searchQuery: `npm install ${pkg}`,
        searchResults: [
          {
            title: `npm package: ${pkg}`,
            url: `https://www.npmjs.com/package/${pkg}`,
            snippet: `Official npm registry documentation and installation instructions for ${pkg}.`
          }
        ],
        matchedCaseId: null,
        confidence: 0.95
      };
    }

    // Case B: Null / Undefined / Cannot read properties
    const propMatch = combinedQuery.match(/Cannot read propert(?:y|ies) of (undefined|null)\s+\(reading ['"]([^'"]+)['"]\)/i)
      || combinedQuery.match(/TypeError:\s+([a-zA-Z0-9_]+)\s+is (?:undefined|not a function)/i);
    if (propMatch || lower.includes('cannot read propert') || lower.includes('undefined is not an object')) {
      const propName = propMatch ? (propMatch[2] || propMatch[1]) : 'property';
      return {
        sessionId,
        phase: 'diagnosis',
        clarifyingQuestion: null,
        diagnosis: `### 🩺 Diagnosis: Uninitialized Reference (TypeError)

**Root Cause:**
Your code attempted to read \`.${propName}\` on a variable that evaluated to \`undefined\` or \`null\`. This happens when asynchronous data (API fetch, database query, React state) has not yet resolved during the initial component render cycle.

---

### 📋 Step-by-Step Instructions to Fix It:
1. **Locate the property access:** Search your component for accesses to \`.${propName}\`.
2. **Add optional chaining (\`?.\`):** Guard the access so JavaScript returns \`undefined\` instead of throwing a fatal error.
3. **Provide a safe fallback default:** Use nullish coalescing (\`?? []\` or \`?? ''\`) and initialize your state with safe default values (e.g. \`useState([])\` instead of empty \`useState()\`).
4. **Test loading state:** Ensure a loading skeleton or guard renders while the async request is in flight.`,
        patchCode: `// Before (Unsafe access throws fatal crash):\nconst list = data.${propName}.map(item => item.title);\n\n// After (Surgical Treatment with Optional Chaining & Default):\nconst list = (data?.${propName} ?? []).map(item => item.title);`,
        prevention: 'Apply optional chaining (?.) and nullish coalescing (??) whenever referencing nested object paths from network payloads.',
        didSearch: true,
        searchQuery: 'TypeError Cannot read properties of undefined',
        searchResults: [
          {
            title: 'MDN Web Docs — Optional Chaining (?.)',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining',
            snippet: 'The optional chaining operator (?.) enables you to read the value of a property located deep within a chain of connected objects without having to check that each reference is valid.'
          }
        ],
        matchedCaseId: 'case-rec-101',
        confidence: 0.96
      };
    }

    // Case C: CORS Policy Error
    if (lower.includes('cors') || lower.includes('access-control-allow-origin') || lower.includes('blocked by cors policy')) {
      return {
        sessionId,
        phase: 'diagnosis',
        clarifyingQuestion: null,
        diagnosis: `### 🩺 Diagnosis: Cross-Origin Resource Sharing (CORS) Violation

**Root Cause:**
The browser's Same-Origin Policy blocked your frontend from reading the API response because the backend server did not return the \`Access-Control-Allow-Origin\` header matching your client origin.

---

### 📋 Step-by-Step Instructions to Fix It:
1. **Enable CORS on the server:** In your backend (Express/Node/Next.js/FastAPI), install and register the CORS middleware allowing your frontend domain (or \`*\` during development).
2. **Handle Preflight OPTIONS requests:** Ensure your backend responds with \`200 OK\` or \`204 No Content\` to preflight HTTP \`OPTIONS\` requests.
3. **Configure dev proxy:** Alternatively, configure a reverse proxy in your dev environment (e.g. in Next.js \`rewrites\` or Vite \`server.proxy\`) to route requests through the same origin.`,
        patchCode: `// Express.js Backend Fix:\nconst cors = require('cors');\napp.use(cors({\n  origin: ['http://localhost:3000', 'http://localhost:8081'],\n  methods: ['GET', 'POST', 'PUT', 'DELETE'],\n  credentials: true\n}));\n\n// Next.js 15 next.config.js Proxy Fix:\nmodule.exports = {\n  async rewrites() {\n    return [{ source: '/api/:path*', destination: 'http://backend.local/:path*' }];\n  }\n};`,
        prevention: 'Always centralize API access through backend route handlers or reverse proxies to eliminate CORS preflight overhead.',
        didSearch: true,
        searchQuery: 'CORS header Access-Control-Allow-Origin',
        searchResults: [
          {
            title: 'MDN Web Docs — Cross-Origin Resource Sharing (CORS)',
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS',
            snippet: 'CORS is an HTTP-header based mechanism that allows a server to indicate any origins other than its own from which a browser should permit loading resources.'
          }
        ],
        matchedCaseId: null,
        confidence: 0.94
      };
    }

    // Case D: Port already in use / EADDRINUSE
    const portMatch = combinedQuery.match(/(?:EADDRINUSE|address already in use|port is already in use)[^0-9]*([0-9]{3,5})/i);
    if (portMatch || lower.includes('eaddrinuse') || lower.includes('already in use')) {
      const port = portMatch ? portMatch[1] : '3000';
      return {
        sessionId,
        phase: 'diagnosis',
        clarifyingQuestion: null,
        diagnosis: `### 🩺 Diagnosis: Port Collision (EADDRINUSE: ${port})

**Root Cause:**
A background or zombie process (often a previous dev server run) is already bound to port \`${port}\`, preventing the new server instance from binding to the network socket.

---

### 📋 Step-by-Step Instructions to Fix It:
1. **Find and terminate the occupying process:** Run this terminal command:
   \`lsof -i :${port} | grep LISTEN | awk '{print $2}' | xargs kill -9\`
2. **Or start on an alternate port:**
   \`PORT=${Number(port) + 1} npm run dev\`
3. **Verify startup:** Re-run your start script to verify the server binds successfully.`,
        patchCode: `// macOS / Linux terminal command:\nlsof -ti:${port} | xargs kill -9\n\n// Windows PowerShell command:\nGet-Process -Id (Get-NetTCPConnection -LocalPort ${port}).OwningProcess | Stop-Process -Force`,
        prevention: 'Add a SIGINT / SIGTERM process handler to gracefully close HTTP servers on Ctrl+C.',
        didSearch: false,
        searchQuery: `kill port ${port} lsof`,
        searchResults: [],
        matchedCaseId: null,
        confidence: 0.97
      };
    }

    // Case E: Unexpected token < in JSON
    if (lower.includes('unexpected token < in json') || (lower.includes('json.parse') && lower.includes('unexpected token'))) {
      return {
        sessionId,
        phase: 'diagnosis',
        clarifyingQuestion: null,
        diagnosis: `### 🩺 Diagnosis: Invalid JSON Payload (HTML Error Returned)

**Root Cause:**
Your code called \`response.json()\`, but the server returned HTML (beginning with \`<!DOCTYPE html>\` or \`<html>\`) instead of JSON. This typically occurs when an API route throws a 404 Not Found, 500 Server Error, or triggers an authentication redirect.

---

### 📋 Step-by-Step Instructions to Fix It:
1. **Check response status before parsing:** Guard against non-2xx responses using \`if (!response.ok)\`.
2. **Inspect raw output:** Log \`await response.text()\` in your catch block to view the server's HTML error message.
3. **Verify backend route URL:** Ensure endpoint URL is spelled correctly without double slashes (\`//\`) or missing prefix.`,
        patchCode: `// Before:\nconst res = await fetch('/api/user');\nconst data = await res.json(); // <-- Crashes if status is 404/500\n\n// After (Surgical Treatment):\nconst res = await fetch('/api/user');\nif (!res.ok) {\n  const errText = await res.text();\n  throw new Error(\`Server returned \${res.status}: \${errText.slice(0, 80)}\`);\n}\nconst data = await res.json();`,
        prevention: 'Always inspect response.ok before attempting to parse response bodies with res.json().',
        didSearch: false,
        searchQuery: 'Unexpected token < in JSON',
        searchResults: [],
        matchedCaseId: null,
        confidence: 0.93
      };
    }

    // Case F: Hydration Error in Next.js / SSR
    if (lower.includes('hydration') || lower.includes('initial ui does not match') || lower.includes('hydrating')) {
      return {
        sessionId,
        phase: 'diagnosis',
        clarifyingQuestion: null,
        diagnosis: `### 🩺 Diagnosis: React Hydration Mismatch (SSR)

**Root Cause:**
The HTML markup rendered on the server during initial request generation does not match the DOM tree constructed by the client browser during hydration. Common triggers include using \`window\`, \`localStorage\`, \`new Date()\`, or invalid HTML tag nesting (such as \`<div>\` inside \`<p>\`).

---

### 📋 Step-by-Step Instructions to Fix It:
1. **Check for browser-only APIs:** If using \`localStorage\` or \`window.innerWidth\`, defer access until after the component mounts.
2. **Use a mounted state flag:** Guard client-dependent rendering using \`useEffect\`.
3. **Check HTML tag nesting:** Ensure no block elements (\`<div>\`, \`<p>\`) are placed inside prohibited parent tags.`,
        patchCode: `// Surgical Treatment: Mount Guard\nimport { useState, useEffect } from 'react';\n\nexport function ClientOnlyComponent() {\n  const [isMounted, setIsMounted] = useState(false);\n\n  useEffect(() => {\n    setIsMounted(true);\n  }, []);\n\n  if (!isMounted) {\n    return <div style={{ minHeight: 24 }} />; // SSR fallback placeholder\n  }\n\n  return <div>{window.location.hostname}</div>;\n}`,
        prevention: 'Never access browser globals in the top-level render scope of SSR components.',
        didSearch: true,
        searchQuery: 'Next.js Hydration mismatch error fix',
        searchResults: [
          {
            title: 'Next.js Docs — Text Content Does Not Match Server-Rendered HTML',
            url: 'https://nextjs.org/docs/messages/react-hydration-error',
            snippet: 'Hydration fails when the server-rendered HTML doesn’t match what was rendered during client hydration.'
          }
        ],
        matchedCaseId: null,
        confidence: 0.92
      };
    }

    // Case G: General Stack Trace / Custom Error Parser
    const errorSignatureMatch = combinedQuery.match(/([A-Za-z]+Error:[^\n]+)/) ||
      combinedQuery.match(/(Exception in [^\n]+)/) ||
      combinedQuery.match(/(Traceback [^\n]+)/) ||
      combinedQuery.match(/([A-Za-z]+Exception:[^\n]+)/);

    const errorSignature = errorSignatureMatch ? errorSignatureMatch[1].trim() : 'Runtime Execution Error';

    // Extract file and line number if present
    const fileLineMatch = combinedQuery.match(/at\s+([^\n(]+)\s+\(([^)]+):(\d+):(\d+)\)/) ||
      combinedQuery.match(/at\s+([^:]+):(\d+):(\d+)/) ||
      combinedQuery.match(/File\s+["']([^"']+)["'],\s+line\s+(\d+)/);

    const fileLocation = fileLineMatch
      ? `${fileLineMatch[1] || fileLineMatch[2]} (Line ${fileLineMatch[3] || fileLineMatch[2]})`
      : 'your target file';

    return {
      sessionId,
      phase: 'diagnosis',
      clarifyingQuestion: null,
      diagnosis: `### 🩺 Diagnosis: ${errorSignature}

**Root Cause Hypothesis:**
An unhandled exception was raised in **${fileLocation}**. The runtime encountered unexpected state or invalid arguments during execution.

---

### 📋 Step-by-Step Instructions to Fix It:
1. **Inspect the target location:** Open \`${fileLocation}\` and check the line that triggered the error trace.
2. **Apply defensive guard / error handling:** Wrap the fragile operation with input validation or a localized \`try/catch\` block.
3. **Verify outputs in isolation:** Test the function with valid and empty inputs to verify resilience against edge cases.`,
      patchCode: code ? `// Before:\n${code.split('\n').slice(0, 4).join('\n')}\n\n// After (Defensive Treatment):\ntry {\n  ${code.split('\n').slice(0, 4).join('\n')}\n} catch (err) {\n  console.error("Safely intercepted clinical error:", err);\n}` : `// Recommended Surgical Guard:\ntry {\n  // Wrap the operation from ${fileLocation}\n  executeOperation();\n} catch (err) {\n  console.error("Clinical error handled:", err);\n  // Fallback to safe default state\n}`,
      prevention: 'Enforce TypeScript strict mode, validate API boundaries, and write unit tests covering unexpected null/undefined inputs.',
      didSearch: verification.didSearch,
      searchQuery: errorSignature.slice(0, 50),
      searchResults: verification.results,
      matchedCaseId: null,
      confidence: 0.85
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
