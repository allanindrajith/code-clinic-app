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

export interface ConsultationDraft {
  symptom: string;
  code: string;
  error: string;
  expected: string;
  actual: string;
}

interface ClinicContextType {
  sessionId: string;
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
}

const ClinicContext = createContext<ClinicContextType | null>(null);

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

export function ClinicProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string>(() => `CC-${Math.floor(1000 + Math.random() * 9000)}`);
  const [patientStatus, setPatientStatus] = useState<'intake' | 'diagnosing' | 'prescribed' | 'cured'>('intake');
  const [activeTriageId, setActiveTriageId] = useState<string | null>(null);

  const [patientFacts, setPatientFacts] = useState<PatientFacts>({
    language: null,
    framework: null,
    os: 'Cross-platform / Web',
    versions: {},
    errorSignature: null,
    diagnosedBugs: [],
    resolvedCount: 0
  });

  const [draft, setDraft] = useState<ConsultationDraft>({
    symptom: '',
    code: '',
    error: '',
    expected: '',
    actual: ''
  });

  const [messages, setMessages] = useState<ConsultationMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Welcome to the Code Clinic. Tell me what symptoms your program is experiencing. What were you trying to achieve, and what exact error or unexpected behavior occurred?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [latestDiagnosis, setLatestDiagnosis] = useState<DiagnosisResult | null>(null);

  // Sandbox state
  const [sandboxCode, setSandboxCode] = useState<string>(DEFAULT_SANDBOX_CODE);
  const [sandboxLanguage, setSandboxLanguage] = useState<'javascript' | 'python'>('javascript');
  const [sandboxOutput, setSandboxOutput] = useState<string>('Terminal Ready. Press "Execute Code" to run.');
  const [sandboxStatus, setSandboxStatus] = useState<'Ready' | 'Running' | 'Success' | 'Error'>('Ready');

  const updateDraft = useCallback((updates: Partial<ConsultationDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  }, []);

  const clearDraft = useCallback(() => {
    setDraft({
      symptom: '',
      code: '',
      error: '',
      expected: '',
      actual: ''
    });
    setActiveTriageId(null);
  }, []);

  const runSandbox = useCallback((codeToRun?: string, langToRun?: 'javascript' | 'python') => {
    const code = codeToRun ?? sandboxCode;
    const lang = langToRun ?? sandboxLanguage;
    setSandboxStatus('Running');
    
    // Slight tick for visual responsiveness
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

    // Extract facts
    const extracted = clinicService.extractFacts(`${params.symptom} ${params.error}`, params.code);
    setPatientFacts(prev => ({
      ...prev,
      ...extracted,
      versions: { ...prev.versions, ...(extracted.versions || {}) },
      errorSignature: extracted.errorSignature || params.error || prev.errorSignature
    }));

    setMessages(prev => [...prev, userMsg]);
    setPatientStatus('diagnosing');

    // Run diagnosis engine with a smooth diagnostic tick for realistic UX
    setTimeout(() => {
      const diagnosis = clinicService.diagnose({
        sessionId,
        message: params.symptom,
        code: params.code,
        error: params.error,
        expected: params.expected,
        actual: params.actual
      });

      setLatestDiagnosis(diagnosis);

      const doctorMsg: ConsultationMessage = {
        id: `doc-${Date.now()}`,
        role: 'assistant',
        content: diagnosis.diagnosis,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        payload: diagnosis
      };

      setMessages(prev => [...prev, doctorMsg]);

      if (diagnosis.phase === 'intake') {
        setPatientStatus('intake');
      } else {
        setPatientStatus('prescribed');
        setPatientFacts(prev => ({
          ...prev,
          diagnosedBugs: [...prev.diagnosedBugs, diagnosis.searchQuery || 'Clinical Bug Case'],
          lastDiagnosis: diagnosis.diagnosis,
          lastTreatment: diagnosis.prevention,
          lastCodePatch: diagnosis.patchCode
        }));

        // If there is a patch code, load it into sandbox for testing
        if (diagnosis.patchCode) {
          setSandboxCode(diagnosis.patchCode);
          if (extracted.language === 'Python') {
            setSandboxLanguage('python');
          } else {
            setSandboxLanguage('javascript');
          }
        }
      }
    }, 280);
  }, [sessionId]);

  const submitConsultation = useCallback((customDraft?: ConsultationDraft) => {
    submitConsultationWithParams(customDraft || draft);
  }, [draft, submitConsultationWithParams]);

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

    setDraft(newDraft);

    // Auto-diagnose this emergency triage case
    submitConsultationWithParams(newDraft);
  }, [submitConsultationWithParams]);

  const answerClarifyingQuestion = useCallback((answer: string) => {
    const updatedDraft = {
      ...draft,
      symptom: `${draft.symptom}\n\nClinical Clarification: ${answer}`
    };
    setDraft(updatedDraft);
    submitConsultationWithParams(updatedDraft);
  }, [draft, submitConsultationWithParams]);

  const recordOutcome = useCallback((solved: boolean) => {
    if (latestDiagnosis) {
      clinicService.recordFeedback(latestDiagnosis.matchedCaseId, solved);
      if (solved) {
        setPatientStatus('cured');
        setPatientFacts(prev => ({
          ...prev,
          resolvedCount: prev.resolvedCount + 1
        }));
        setMessages(prev => [
          ...prev,
          {
            id: `cure-${Date.now()}`,
            role: 'assistant',
            content: `🩺 **Case Resolved & Marked Cured!**\n\nPrescription outcome verified. This clinical cure has been committed to long-term memory with elevated confidence.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        setPatientStatus('diagnosing');
        setMessages(prev => [
          ...prev,
          {
            id: `followup-${Date.now()}`,
            role: 'assistant',
            content: `Understood. The primary prescription did not resolve the symptom. Let us investigate secondary causes: what new error or terminal output did you receive when applying the patch?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    }
  }, [latestDiagnosis]);

  const resetPatient = useCallback(() => {
    const newId = `CC-${Math.floor(1000 + Math.random() * 9000)}`;
    setSessionId(newId);
    setPatientStatus('intake');
    setActiveTriageId(null);
    setDraft({
      symptom: '',
      code: '',
      error: '',
      expected: '',
      actual: ''
    });
    setLatestDiagnosis(null);
    setPatientFacts({
      language: null,
      framework: null,
      os: 'Cross-platform / Web',
      versions: {},
      errorSignature: null,
      diagnosedBugs: [],
      resolvedCount: 0
    });
    setMessages([
      {
        id: `welcome-${newId}`,
        role: 'assistant',
        content: `Welcome to Code Clinic examining room. A fresh patient chart (${newId}) has been opened. Describe the symptoms of the broken code or pick an Emergency Room Triage case.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  const value = useMemo(() => ({
    sessionId,
    patientStatus,
    messages,
    patientFacts,
    latestDiagnosis,
    draft,
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
    runSandbox
  }), [
    sessionId,
    patientStatus,
    messages,
    patientFacts,
    latestDiagnosis,
    draft,
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
    runSandbox
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
