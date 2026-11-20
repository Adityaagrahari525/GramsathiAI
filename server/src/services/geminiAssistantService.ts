import { GoogleGenAI } from '@google/genai';
import { ENV } from '../config/env.js';
import { schemeRepository } from '../repositories/schemeRepository.js';
import type { Scheme } from '../types/scheme.js';

export interface AssistantChatOptions {
  message: string;
  language?: 'en' | 'mr' | 'hi';
  conversationHistory?: Array<{ sender: 'user' | 'assistant'; content: string }>;
}

export interface AssistantChatResult {
  reply: string;
  source: 'gemini_grounded' | 'deterministic_fallback';
  isConfigured: boolean;
  sources: string[];
  matchedSchemes: Array<{
    id: string;
    name: string;
    nameMr?: string;
    department?: string;
    officialUrl: string;
    benefitAmount: string;
  }>;
}

export class GeminiAssistantService {
  private static aiClient: GoogleGenAI | null = null;

  private static getClient(): GoogleGenAI | null {
    if (!this.aiClient && ENV.GEMINI_API_KEY && ENV.GEMINI_API_KEY.trim() !== '') {
      try {
        this.aiClient = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });
      } catch (e) {
        console.warn('[GeminiAssistantService] Failed to initialize GoogleGenAI client:', e);
        this.aiClient = null;
      }
    }
    return this.aiClient;
  }

  /**
   * Check whether a live valid Gemini API key is configured
   */
  public static isApiKeyConfigured(): boolean {
    return !!(ENV.GEMINI_API_KEY && ENV.GEMINI_API_KEY.trim().length > 10);
  }

  /**
   * Main assistant query handler: Uses Gemini with strict scheme grounding when configured;
   * seamlessly falls back to deterministic verified scheme knowledge base otherwise.
   */
  public static async answer(options: AssistantChatOptions): Promise<AssistantChatResult> {
    const { message, language = 'mr' } = options;
    const isConfigured = this.isApiKeyConfigured();

    // 1. Retrieve all verified schemes for context grounding
    const { schemes } = await schemeRepository.getAll();
    const queryLower = message.toLowerCase();

    // 2. Identify top relevant schemes based on citizen keywords
    const relevantSchemes = schemes.filter((s) => {
      const q = queryLower;
      return (
        s.name.toLowerCase().includes(q) ||
        (s.nameMr && s.nameMr.toLowerCase().includes(q)) ||
        s.sector.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q)) ||
        (q.includes('solar') && s.id.includes('saur')) ||
        (q.includes('ladki') && s.id.includes('ladki')) ||
        (q.includes('kisan') && s.id.includes('kisan')) ||
        (q.includes('farm') && s.sector === 'agriculture') ||
        (q.includes('loan') && s.benefitType === 'loan') ||
        (q.includes('scholarship') && s.sector === 'education')
      );
    }).slice(0, 4);

    const targetList = relevantSchemes.length > 0 ? relevantSchemes : schemes.slice(0, 3);

    // 3. If Gemini API is configured, invoke Gemini with strict anti-fabrication prompt
    if (isConfigured) {
      const client = this.getClient();
      if (client) {
        try {
          const schemeContext = targetList
            .map(
              (s, idx) =>
                `[Scheme ${idx + 1}]:\n- ID: ${s.id}\n- Title: ${s.name}\n- Marathi: ${s.nameMr}\n- Department: ${s.department}\n- Benefit: ${s.benefitAmount}\n- Target: ${s.targetBeneficiaries.join(', ')}\n- Official Portal: ${s.officialUrl}\n- Eligibility: ${s.eligibility.join('; ')}\n- Mandatory Docs: ${s.mandatoryDocs?.join(', ') || s.documents.join(', ')}`
            )
            .join('\n\n');

          const systemPrompt = `You are GramSathi AI, an official civic public service assistant for rural citizens, farmers, women, and youth in Maharashtra, India.
STRICT CIVIC RULES:
1. ONLY explain schemes based on the provided verified scheme records below. NEVER fabricate scheme names, eligibility rules, subsidy amounts, or application portals.
2. If asked about something not in the scheme context, state clearly and politely that the citizen should verify with their local Talathi, Gram Sevak, or MahaDBT portal (https://mahadbt.maharashtra.gov.in).
3. Always explain in simple, accessible, trustworthy language.
4. If language is 'mr', reply in fluent Marathi. If 'en', reply in English. If 'hi', reply in Hindi.
5. Emphasize that GramSathi AI is a civic guidance assistant, not the government sanctioning authority.
6. Clearly cite the official portal and government department.`;

          const prompt = `Language requested: ${language}\n\nVERIFIED SCHEME RECORDS:\n${schemeContext}\n\nCITIZEN QUERY:\n"${message}"\n\nProvide a simple, clear, grounded explanation:`;

          // Try models available on this API key tier
          const candidateModels = ['gemini-2.5-flash', 'gemma-4-26b-a4b-it', 'gemini-flash-latest'];
          let generatedText: string | null = null;

          for (const m of candidateModels) {
            try {
              const response = await client.models.generateContent({
                model: m,
                contents: prompt,
                config: {
                  systemInstruction: systemPrompt,
                  temperature: 0.2, // Low temperature for high factual accuracy
                },
              });
              if (response && response.text) {
                generatedText = response.text;
                break;
              }
            } catch (mErr: any) {
              // Try next candidate model
            }
          }

          if (generatedText) {
            return {
              reply: generatedText,
              source: 'gemini_grounded',
              isConfigured: true,
              sources: targetList.map((s) => `${s.name} (${s.officialUrl})`),
              matchedSchemes: targetList.map((s) => ({
                id: s.id,
                name: s.name,
                nameMr: s.nameMr,
                department: s.departmentShort || s.department,
                officialUrl: s.officialUrl,
                benefitAmount: s.benefitAmount,
              })),
            };
          }
        } catch (genErr) {
          console.warn('[GeminiAssistantService] Gemini API call failed, falling back to deterministic engine:', genErr);
        }
      }
    }

    // 4. Reliable Non-AI Fallback using verified scheme data
    return this.buildDeterministicFallback(message, targetList, language, isConfigured);
  }

  /**
   * Deterministic verified scheme fallback when API key is missing or offline
   */
  private static buildDeterministicFallback(
    query: string,
    schemes: Scheme[],
    language: 'en' | 'mr' | 'hi',
    isConfigured: boolean
  ): AssistantChatResult {
    const primary = schemes[0];
    let reply = '';

    if (language === 'mr') {
      if (primary) {
        reply = `【प्रमाणित शासकीय माहिती — अधिकृत राजपत्रानुसार】\n\nयोजना: ${primary.nameMr || primary.name}\nविभाग: ${primary.department}\nअनुदान / लाभ: ${primary.benefitAmount}\n\nपात्रता निकष:\n${primary.eligibility.slice(0, 3).map((e) => `• ${e}`).join('\n')}\n\nआवश्यक कागदपत्रे:\n${(primary.mandatoryDocs || primary.documents).slice(0, 4).map((d) => `• ${d}`).join('\n')}\n\nअधिकृत अर्ज पोर्टल: ${primary.officialUrl}\n\n(टीप: ग्रामसाथी AI ही नागरिक मार्गदर्शक प्रणाली आहे. अंतिम मंजुरी शासकीय पडताळणीवर अवलंबून असते.)`;
      } else {
        reply = `आपल्या प्रश्नाबाबत (${query}):\nमहाराष्ट्र शासनाच्या महाडीबीटी (MahaDBT) आणि आपले सरकार पोर्टलवर विविध कल्याणकारी योजना उपलब्ध आहेत. आपण जवळच्या ग्रामपंचायत सीएससी केंद्र किंवा तालुका कृषी कार्यालयाशी संपर्क साधू शकता.`;
      }
    } else {
      if (primary) {
        reply = `[Verified Government Information — Based on Official Gazette]\n\nScheme: ${primary.name}\nDepartment: ${primary.department}\nBenefit / Subsidy: ${primary.benefitAmount}\n\nKey Eligibility Criteria:\n${primary.eligibility.slice(0, 3).map((e) => `• ${e}`).join('\n')}\n\nMandatory Documents:\n${(primary.mandatoryDocs || primary.documents).slice(0, 4).map((d) => `• ${d}`).join('\n')}\n\nOfficial Application Portal: ${primary.officialUrl}\n\n(Notice: GramSathi AI provides civic preparation guidance. Official sanction is granted by competent authorities via MahaDBT).`;
      } else {
        reply = `Civic Guidance for: "${query}":\nVarious central and Maharashtra state welfare benefits are accessible via MahaDBT (https://mahadbt.maharashtra.gov.in) and Aaple Sarkar. Please consult your local Gram Sevak or Talathi for physical submission.`;
      }
    }

    return {
      reply,
      source: 'deterministic_fallback',
      isConfigured,
      sources: schemes.map((s) => `${s.name} (${s.officialUrl})`),
      matchedSchemes: schemes.map((s) => ({
        id: s.id,
        name: s.name,
        nameMr: s.nameMr,
        department: s.departmentShort || s.department,
        officialUrl: s.officialUrl,
        benefitAmount: s.benefitAmount,
      })),
    };
  }
}
