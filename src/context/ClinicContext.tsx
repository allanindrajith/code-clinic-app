import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  clinicService,
  DiagnosisResult,
  PatientFacts,
  ConsultationMessage,
  TriageTemplate,
  LearningRecord,
  TRIAGE_TEMPLATES
} from '@/services/clinicEngine';
import {
  aiProviderService,
  AISettings,
  AIProviderType
} from '@/services/aiProviderService';

export interface ConsultationDraft {
  symptom: string;
  code: string;
  error: string;
  expected: string;
  actual: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ConsultationMessage[];
  patientStatus: 'intake' | 'diagnosing' | 'prescribed' | 'cured';
  patientFacts: PatientFacts;
  latestDiagnosis: DiagnosisResult | null;
  draft: ConsultationDraft;
}

interface ClinicContextType {
  sessionId: string;
  currentSessionId: string;
  sessions: ChatSession[];
  switchSession: (id: string) => void;
  newSession: (initialTitle?: string) => string;
  deleteSession: (id: string) => void;
  renameSession: (id: string, newTitle: string) => void;
  patientStatus: 'intake' | 'diagnosing' | 'prescribed' | 'cured';
  messages: ConsultationMessage[];
  patientFacts: PatientFacts;
  latestDiagnosis: DiagnosisResult | null;
  draft: ConsultationDraft;
  updateDraft: (updates: Partial<ConsultationDraft>) => void;
  clearDraft: () => void;
  loadTriageCase: (templateId: string) => void;
  submitConsultation: (customDraft?: ConsultationDraft) => void;
  answerClarifyingQuestion: (answer: string) => void;
  recordOutcome: (solved: boolean) => void;
  resetPatient: () => void;
  triageTemplates: TriageTemplate[];
  learningStore: LearningRecord[];
  activeTriageId: string | null;
  sandboxCode: string;
  setSandboxCode: (code: string) => void;
  sandboxLanguage: 'javascript' | 'python';
  setSandboxLanguage: (lang: 'javascript' | 'python') => void;
  sandboxOutput: string;
  sandboxStatus: 'Ready' | 'Running' | 'Success' | 'Error';
  runSandbox: (codeToRun?: string, langToRun?: 'javascript' | 'python') => void;
  aiSettings: AISettings;
  updateAISettings: (updates: Partial<AISettings>) => void;
  testAIConnection: (provider?: AIProviderType, key?: string) => Promise<{ success: boolean; message: string }>;
}

const ClinicContext = createContext<ClinicContextType | null>(null);

const SESSIONS_STORAGE_KEY = 'code_clinic_sessions_v2';

const DEFAULT_SANDBOX_CODE = `// Code Clinic ICU Sandbox
// Execute surgical patches or test bug hypotheses safely:
function checkUserAccess(user) {
  // Defensive guard against uninitialized state:
  const role = user?.role ?? 'guest';
  const permissions = user?.permissions ?? [];
  return { role, count: permissions.length };
}

console.log("Registered User:", checkUserAccess({ role: 'admin', permissions: ['read', 'write'] }));
console.log("Uninitialized User:", checkUserAccess(null));
`;

function createNewSessionData(id?: string, initialTitle?: string): ChatSession {
  const sessionId = id || `CC-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = Date.now();
  return {
    id: sessionId,
    title: initialTitle || 'New Consultation',
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: `welcome-${sessionId}`,
        role: 'assistant',
        content: `🩺 **Dr. Debug on Duty — Patient Chart (${sessionId})**\n\nExamining room is open. Paste your terminal error message, crash trace, or broken code snippet below. I will analyze the root cause and provide clear, step-by-step instructions and surgical fixes to cure it.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ],
    patientStatus: 'intake',
    patientFacts: {
      language: null,
      framework: null,
      os: 'Cross-platform / Web',
      versions: {},
      errorSignature: null,
      diagnosedBugs: [],
      resolvedCount: 0
    },
    latestDiagnosis: null,
    draft: {
      symptom: '',
      code: '',
      error: '',
      expected: '',
      actual: ''
    }
  };
}

function loadSavedSessions(): ChatSession[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore parse error
    }
  }
  return [createNewSessionData()];
}

function persistSessions(sessions: ChatSession[]) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // Ignore storage error
    }
  }
}

export function ClinicProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>(() => loadSavedSessions());
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    const initial = loadSavedSessions();
    return initial[0]?.id || `CC-${Math.floor(1000 + Math.random() * 9000)}`;
  });

  const activeSession = useMemo(() => {
    return sessions.find(s => s.id === currentSessionId) || sessions[0] || createNewSessionData(currentSessionId);
  }, [sessions, currentSessionId]);

  const [activeTriageId, setActiveTriageId] = useState<string | null>(null);

  const [aiSettings, setAiSettings] = useState<AISettings>(() => aiProviderService.getSettings());

  const updateAISettings = useCallback((updates: Partial<AISettings>) => {
    aiProviderService.updateSettings(updates);
    setAiSettings(aiProviderService.getSettings());
  }, []);

  const testAIConnection = useCallback(async (provider?: AIProviderType, key?: string) => {
    return await aiProviderService.testConnection(provider, key);
  }, []);

  // Sandbox state
  const [sandboxCode, setSandboxCode] = useState<string>(DEFAULT_SANDBOX_CODE);
  const [sandboxLanguage, setSandboxLanguage] = useState<'javascript' | 'python'>('javascript');
  const [sandboxOutput, setSandboxOutput] = useState<string>('Terminal Ready. Press "Execute Code" to run.');
  const [sandboxStatus, setSandboxStatus] = useState<'Ready' | 'Running' | 'Success' | 'Error'>('Ready');

  // Helper to update active session state and persist
  const updateActiveSession = useCallback((updater: (prev: ChatSession) => ChatSession) => {
    setSessions(prevSessions => {
      const idx = prevSessions.findIndex(s => s.id === currentSessionId);
      if (idx === -1) {
        const fresh = updater(createNewSessionData(currentSessionId));
        const updated = [fresh, ...prevSessions];
        persistSessions(updated);
        return updated;
      }
      const updatedSession = updater(prevSessions[idx]);
      const nextSessions = [...prevSessions];
      nextSessions[idx] = updatedSession;
      persistSessions(nextSessions);
      return nextSessions;
    });
  }, [currentSessionId]);

  const switchSession = useCallback((id: string) => {
    const target = sessions.find(s => s.id === id);
    if (target) {
      setCurrentSessionId(id);
      if (target.latestDiagnosis?.patchCode) {
        setSandboxCode(target.latestDiagnosis.patchCode);
      }
    }
  }, [sessions]);

  const newSession = useCallback((initialTitle?: string): string => {
    const fresh = createNewSessionData(undefined, initialTitle);
    setSessions(prev => {
      const updated = [fresh, ...prev];
      persistSessions(updated);
      return updated;
    });
    setCurrentSessionId(fresh.id);
    return fresh.id;
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      const remaining = filtered.length > 0 ? filtered : [createNewSessionData()];
      persistSessions(remaining);
      if (currentSessionId === id) {
        setCurrentSessionId(remaining[0].id);
      }
      return remaining;
    });
  }, [currentSessionId]);

  const renameSession = useCallback((id: string, newTitle: string) => {
    setSessions(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, title: newTitle.trim() || s.title, updatedAt: Date.now() } : s);
      persistSessions(updated);
      return updated;
    });
  }, []);

  const updateDraft = useCallback((updates: Partial<ConsultationDraft>) => {
    updateActiveSession(prev => ({
      ...prev,
      draft: { ...prev.draft, ...updates },
      updatedAt: Date.now()
    }));
  }, [updateActiveSession]);

  const clearDraft = useCallback(() => {
    updateActiveSession(prev => ({
      ...prev,
      draft: {
        symptom: '',
        code: '',
        error: '',
        expected: '',
        actual: ''
      },
      updatedAt: Date.now()
    }));
    setActiveTriageId(null);
  }, [updateActiveSession]);

  const runSandbox = useCallback((codeToRun?: string, langToRun?: 'javascript' | 'python') => {
    const code = codeToRun ?? sandboxCode;
    const lang = langToRun ?? sandboxLanguage;
    setSandboxStatus('Running');
    
    setTimeout(() => {
      const res = clinicService.executeSandbox(lang, code);
      if (res.success) {
        setSandboxStatus('Success');
        setSandboxOutput(`[Status: OK (Exit Code 0)]\n\n${res.stdout}`);
      } else {
        setSandboxStatus('Error');
        setSandboxOutput(`[Status: FAILED (Exit Code ${res.exitCode})]\n\n${res.stderr}\n${res.stdout}`);
      }
    }, 150);
  }, [sandboxCode, sandboxLanguage]);

  const submitConsultationWithParams = useCallback((params: ConsultationDraft) => {
    if (!params.symptom && !params.error && !params.code) return;

    // Add user message
    const userMsg: ConsultationMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: params.symptom || 'Examining reported code error and stack trace.',
      code: params.code,
      error: params.error,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Auto-generate title if this is the first user message or session has default title
    const firstLine = (params.error || params.symptom || 'Consultation').split('\n')[0].replace(/^(Error:\s*|TypeError:\s*)/i, '').trim();
    const autoTitle = firstLine ? firstLine.slice(0, 36) + (firstLine.length > 36 ? '...' : '') : 'Bug Consultation';

    // Extract facts
    const extracted = clinicService.extractFacts(`${params.symptom} ${params.error}`, params.code);

    updateActiveSession(prev => {
      const isDefaultTitle = prev.title === 'New Consultation' || prev.title.startsWith('CC-');
      return {
        ...prev,
        title: isDefaultTitle ? autoTitle : prev.title,
        messages: [...prev.messages, userMsg],
        patientStatus: 'diagnosing',
        patientFacts: {
          ...prev.patientFacts,
          ...extracted,
          versions: { ...prev.patientFacts.versions, ...(extracted.versions || {}) },
          errorSignature: extracted.errorSignature || params.error || prev.patientFacts.errorSignature
        },
        draft: {
          symptom: '',
          code: '',
          error: '',
          expected: '',
          actual: ''
        },
        updatedAt: Date.now()
      };
    });

    const activeId = currentSessionId;

    // Run diagnosis engine with live AI (Gemini / Agent token) or instant local fallback
    (async () => {
      try {
        const diagnosis = await aiProviderService.diagnoseWithAI({
          sessionId: activeId,
          message: params.symptom,
          code: params.code,
          error: params.error,
          expected: params.expected,
          actual: params.actual
        });

        const doctorMsg: ConsultationMessage = {
          id: `doc-${Date.now()}`,
          role: 'assistant',
          content: diagnosis.diagnosis,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          payload: diagnosis
        };

        setSessions(prevSessions => {
          const idx = prevSessions.findIndex(s => s.id === activeId);
          if (idx === -1) return prevSessions;
          const s = prevSessions[idx];
          const newStatus = diagnosis.phase === 'intake' ? 'intake' : 'prescribed';
          const updated: ChatSession = {
            ...s,
            messages: [...s.messages, doctorMsg],
            patientStatus: newStatus,
            latestDiagnosis: diagnosis,
            patientFacts: {
              ...s.patientFacts,
              diagnosedBugs: [...s.patientFacts.diagnosedBugs, diagnosis.searchQuery || 'Clinical Bug Case'],
              lastDiagnosis: diagnosis.diagnosis,
              lastTreatment: diagnosis.prevention,
              lastCodePatch: diagnosis.patchCode
            },
            updatedAt: Date.now()
          };
          const next = [...prevSessions];
          next[idx] = updated;
          persistSessions(next);
          return next;
        });

        // Load patch into sandbox
        if (diagnosis.patchCode) {
          setSandboxCode(diagnosis.patchCode);
          if (extracted.language === 'Python') {
            setSandboxLanguage('python');
          } else {
            setSandboxLanguage('javascript');
          }
        }
      } catch (err) {
        console.error('Diagnostic error:', err);
      }
    })();
  }, [currentSessionId, updateActiveSession]);

  const submitConsultation = useCallback((customDraft?: ConsultationDraft) => {
    submitConsultationWithParams(customDraft || activeSession.draft);
  }, [activeSession.draft, submitConsultationWithParams]);

  const loadTriageCase = useCallback((templateId: string) => {
    const template = TRIAGE_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    setActiveTriageId(template.id);
    const newDraft: ConsultationDraft = {
      symptom: `Expected: ${template.expected}\nActual: ${template.actual}`,
      code: template.code,
      error: template.error,
      expected: template.expected,
      actual: template.actual
    };

    updateActiveSession(prev => ({
      ...prev,
      title: template.title,
      draft: newDraft
    }));

    // Auto-diagnose this emergency triage case
    submitConsultationWithParams(newDraft);
  }, [submitConsultationWithParams, updateActiveSession]);

  const answerClarifyingQuestion = useCallback((answer: string) => {
    const updatedDraft = {
      ...activeSession.draft,
      symptom: `${activeSession.draft.symptom}\n\nClinical Clarification: ${answer}`
    };
    submitConsultationWithParams(updatedDraft);
  }, [activeSession.draft, submitConsultationWithParams]);

  const recordOutcome = useCallback((solved: boolean) => {
    const latestDiag = activeSession.latestDiagnosis;
    if (latestDiag) {
      clinicService.recordFeedback(latestDiag.matchedCaseId, solved);
      if (solved) {
        updateActiveSession(prev => ({
          ...prev,
          patientStatus: 'cured',
          patientFacts: {
            ...prev.patientFacts,
            resolvedCount: prev.patientFacts.resolvedCount + 1
          },
          messages: [
            ...prev.messages,
            {
              id: `cure-${Date.now()}`,
              role: 'assistant',
              content: `🩺 **Case Resolved & Marked Cured!**\n\nPrescription outcome verified. This clinical cure has been committed to long-term memory with elevated confidence.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ],
          updatedAt: Date.now()
        }));
      } else {
        updateActiveSession(prev => ({
          ...prev,
          patientStatus: 'diagnosing',
          messages: [
            ...prev.messages,
            {
              id: `followup-${Date.now()}`,
              role: 'assistant',
              content: `Understood. The primary prescription did not resolve the symptom. Let us investigate secondary causes: what new error or terminal output did you receive when applying the patch?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ],
          updatedAt: Date.now()
        }));
      }
    }
  }, [activeSession.latestDiagnosis, updateActiveSession]);

  const resetPatient = useCallback(() => {
    newSession();
  }, [newSession]);

  const value = useMemo(() => ({
    sessionId: activeSession.id,
    currentSessionId,
    sessions,
    switchSession,
    newSession,
    deleteSession,
    renameSession,
    patientStatus: activeSession.patientStatus,
    messages: activeSession.messages,
    patientFacts: activeSession.patientFacts,
    latestDiagnosis: activeSession.latestDiagnosis,
    draft: activeSession.draft,
    updateDraft,
    clearDraft,
    loadTriageCase,
    submitConsultation,
    answerClarifyingQuestion,
    recordOutcome,
    resetPatient,
    triageTemplates: TRIAGE_TEMPLATES,
    learningStore: clinicService.getLearningStore(),
    activeTriageId,
    sandboxCode,
    setSandboxCode,
    sandboxLanguage,
    setSandboxLanguage,
    sandboxOutput,
    sandboxStatus,
    runSandbox,
    aiSettings,
    updateAISettings,
    testAIConnection
  }), [
    activeSession,
    currentSessionId,
    sessions,
    switchSession,
    newSession,
    deleteSession,
    renameSession,
    updateDraft,
    clearDraft,
    loadTriageCase,
    submitConsultation,
    answerClarifyingQuestion,
    recordOutcome,
    resetPatient,
    activeTriageId,
    sandboxCode,
    sandboxLanguage,
    sandboxOutput,
    sandboxStatus,
    runSandbox,
    aiSettings,
    updateAISettings,
    testAIConnection
  ]);

  return (
    <ClinicContext.Provider value={value}>
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
}
