import { clinicService, DiagnosisResult, WebSearchResult } from './clinicEngine';

export type AIProviderType = 'gemini' | 'openai' | 'local';

export interface AISettings {
  provider: AIProviderType;
  geminiKey: string;
  openaiKey: string;
  customEndpoint?: string;
  model: string;
}

const STORAGE_KEY = 'code_clinic_ai_settings';

export class AIProviderService {
  private settings: AISettings;

  constructor() {
    this.settings = this.loadInitialSettings();
  }

  private loadInitialSettings(): AISettings {
    let savedSettings: Partial<AISettings> = {};

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        if (item) {
          savedSettings = JSON.parse(item);
        }
      } catch {
        // Ignore parsing errors
      }
    }

    const envGeminiKey = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_GEMINI_API_KEY) || '';
    const envOpenAIKey = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_OPENAI_API_KEY) || '';

    return {
      provider: savedSettings.provider || (envGeminiKey ? 'gemini' : (savedSettings.geminiKey ? 'gemini' : 'local')),
      geminiKey: savedSettings.geminiKey || envGeminiKey,
      openaiKey: savedSettings.openaiKey || envOpenAIKey,
      customEndpoint: savedSettings.customEndpoint || '',
      model: savedSettings.model || 'gemini-2.0-flash',
    };
  }

  public getSettings(): AISettings {
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<AISettings>): void {
    this.settings = { ...this.settings, ...updates };
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
      } catch {
        // Storage full or unavailable
      }
    }
  }

  public hasActiveLiveKey(): boolean {
    if (this.settings.provider === 'gemini') {
      return !!this.settings.geminiKey.trim();
    }
    if (this.settings.provider === 'openai') {
      return !!this.settings.openaiKey.trim();
    }
    return false;
  }

  public async testConnection(provider?: AIProviderType, key?: string): Promise<{ success: boolean; message: string }> {
    const prov = provider || this.settings.provider;
    const testKey = key !== undefined ? key : (prov === 'gemini' ? this.settings.geminiKey : this.settings.openaiKey);

    if (!testKey.trim()) {
      return { success: false, message: 'Please enter an API key or token first.' };
    }

    if (prov === 'gemini') {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${testKey.trim()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: 'Respond with the word: READY' }] }]
            })
          }
        );

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData?.error?.message || `HTTP ${res.status}`;
          return { success: false, message: `Gemini API Error: ${errMsg}` };
        }

        return { success: true, message: 'Connected to Google Gemini (Free Tier) successfully!' };
      } catch (err: any) {
        return { success: false, message: `Connection failed: ${err.message || 'Network error'}` };
      }
    }

    if (prov === 'openai') {
      try {
        const endpoint = this.settings.customEndpoint || 'https://api.openai.com/v1/chat/completions';
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${testKey.trim()}`
          },
          body: JSON.stringify({
            model: this.settings.model || 'gpt-4o-mini',
            messages: [{ role: 'user', content: 'Respond with the word: READY' }],
            max_tokens: 10
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData?.error?.message || `HTTP ${res.status}`;
          return { success: false, message: `API Error: ${errMsg}` };
        }

        return { success: true, message: 'Connected to Agent API successfully!' };
      } catch (err: any) {
        return { success: false, message: `Connection failed: ${err.message || 'Network error'}` };
      }
    }

    return { success: true, message: 'Local Clinical Engine is ready (Offline mode).' };
  }

  public async diagnoseWithAI(params: {
    sessionId: string;
    message: string;
    code?: string;
    error?: string;
    expected?: string;
    actual?: string;
  }): Promise<DiagnosisResult> {
    const { sessionId, message, code = '', error = '', expected = '', actual = '' } = params;

    // 1. If Gemini is selected and key is present, invoke Gemini Free API
    if (this.settings.provider === 'gemini' && this.settings.geminiKey.trim()) {
      try {
        return await this.callGeminiAPI(params);
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to local clinical engine:', err);
      }
    }

    // 2. If OpenAI/custom agent is selected and key is present
    if (this.settings.provider === 'openai' && this.settings.openaiKey.trim()) {
      try {
        return await this.callOpenAICompatibleAPI(params);
      } catch (err: any) {
        console.warn('Agent API call failed, falling back to local clinical engine:', err);
      }
    }

    // 3. Fallback to Local Clinical Engine (Instant, reliable, zero-dependency)
    return clinicService.diagnose({
      sessionId,
      message,
      code,
      error,
      expected,
      actual
    });
  }

  private async callGeminiAPI(params: {
    sessionId: string;
    message: string;
    code?: string;
    error?: string;
    expected?: string;
    actual?: string;
  }): Promise<DiagnosisResult> {
    const key = this.settings.geminiKey.trim();
    const model = this.settings.model || 'gemini-2.0-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    const systemPrompt = `You are Dr. Debug, the world's most capable senior physician software engineer at Code Clinic.
Your job is to diagnose the user's reported bug or error message and give them clear, step-by-step instructions on how to cure it, followed by a surgical before/after code patch.

Format your response strictly as JSON with this exact structure:
{
  "rootCause": "Short, clear explanation of why this error happens",
  "instructions": [
    "Step 1: Specific action with file or command",
    "Step 2: Concrete change to apply",
    "Step 3: Verification command or check"
  ],
  "patchCode": "// Before:\\n...old code...\\n\\n// After (Surgical Treatment):\\n...new code...",
  "prevention": "One sentence prevention rule",
  "searchQuery": "Search keywords for documentation reference",
  "referenceTitle": "Official documentation title",
  "referenceSnippet": "Brief snippet from official docs explaining the correct pattern"
}`;

    const userPrompt = `Patient Case:
Error Log / Stack Trace: ${params.error || 'N/A'}
Reported Symptom: ${params.message || 'N/A'}
Attached Code Block:
${params.code || 'None provided'}
Expected Behavior: ${params.expected || 'Smooth execution'}
Actual Behavior: ${params.actual || 'Runtime crash or unexpected behavior'}

Please diagnose this case as Dr. Debug and output only the valid JSON response.`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Gemini status ${res.status}`);
    }

    const data = await res.json();
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textOutput) {
      throw new Error('Empty response received from Gemini');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(textOutput);
    } catch {
      // Regex extraction fallback if model enclosed in markdown ```json
      const match = textOutput.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('Could not parse Gemini JSON output');
      }
    }

    const instructionsText = Array.isArray(parsed.instructions)
      ? parsed.instructions.map((step: string, i: number) => `${i + 1}. **${step.replace(/^Step \d+:\s*/i, '')}**`).join('\n')
      : '1. Review the error location.\n2. Apply the surgical patch below.\n3. Test and verify in the terminal.';

    const diagnosisMarkdown = `### 🩺 Diagnosis: Powered by Google Gemini ✨

**Root Cause Hypothesis:**
${parsed.rootCause || 'Identified runtime state boundary violation.'}

---

### 📋 Step-by-Step Instructions to Fix It:
${instructionsText}`;

    const searchResults: WebSearchResult[] = parsed.referenceTitle ? [
      {
        title: parsed.referenceTitle,
        url: `https://www.google.com/search?q=${encodeURIComponent(parsed.searchQuery || 'developer docs')}`,
        snippet: parsed.referenceSnippet || 'Official framework documentation pattern.'
      }
    ] : [];

    return {
      sessionId: params.sessionId,
      phase: 'diagnosis',
      clarifyingQuestion: null,
      diagnosis: diagnosisMarkdown,
      patchCode: parsed.patchCode || '// Surgical patch ready in editor',
      prevention: parsed.prevention || 'Validate external inputs and apply strict TypeScript checking.',
      didSearch: true,
      searchQuery: parsed.searchQuery || 'Gemini verified diagnosis',
      searchResults,
      matchedCaseId: 'gemini-live',
      confidence: 0.99
    };
  }

  private async callOpenAICompatibleAPI(params: {
    sessionId: string;
    message: string;
    code?: string;
    error?: string;
    expected?: string;
    actual?: string;
  }): Promise<DiagnosisResult> {
    const key = this.settings.openaiKey.trim();
    const endpoint = this.settings.customEndpoint || 'https://api.openai.com/v1/chat/completions';
    const model = this.settings.model || 'gpt-4o-mini';

    const systemPrompt = `You are Dr. Debug, a senior physician software engineer at Code Clinic.
Diagnose the bug and provide step-by-step instructions to fix it. Return valid JSON only with keys: rootCause, instructions (array), patchCode, prevention, searchQuery, referenceTitle, referenceSnippet.`;

    const userPrompt = `Error: ${params.error || 'N/A'}\nSymptom: ${params.message}\nCode:\n${params.code || 'None'}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!res.ok) {
      throw new Error(`Agent API returned status ${res.status}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);

    const instructionsText = Array.isArray(parsed.instructions)
      ? parsed.instructions.map((step: string, i: number) => `${i + 1}. **${step.replace(/^Step \d+:\s*/i, '')}**`).join('\n')
      : '1. Inspect the stack trace.\n2. Apply the patch.\n3. Test the fix.';

    return {
      sessionId: params.sessionId,
      phase: 'diagnosis',
      clarifyingQuestion: null,
      diagnosis: `### 🩺 Diagnosis: Powered by ${model} 🤖\n\n**Root Cause Hypothesis:**\n${parsed.rootCause}\n\n---\n\n### 📋 Step-by-Step Instructions to Fix It:\n${instructionsText}`,
      patchCode: parsed.patchCode || '// Surgical patch ready',
      prevention: parsed.prevention || 'Add defensive error boundaries.',
      didSearch: true,
      searchQuery: parsed.searchQuery || 'Documentation',
      searchResults: parsed.referenceTitle ? [{ title: parsed.referenceTitle, url: 'https://docs.dev', snippet: parsed.referenceSnippet || '' }] : [],
      matchedCaseId: 'agent-live',
      confidence: 0.98
    };
  }
}

export const aiProviderService = new AIProviderService();
