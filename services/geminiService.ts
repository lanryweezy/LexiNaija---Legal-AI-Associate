import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ContractParams, CaseSummary } from "../types";

const apiKey = process.env.API_KEY || '';

// System instruction to enforce the persona
const SYSTEM_INSTRUCTION = `
You are LexiNaija, a Senior Advocate of Nigeria (SAN) and expert legal AI assistant.
Your knowledge base includes:
1. The Constitution of the Federal Republic of Nigeria 1999 (as amended).
2. The Companies and Allied Matters Act (CAMA) 2020.
3. The Evidence Act 2011.
4. Land Use Act.
5. Key Supreme Court of Nigeria judgments.
6. Criminal Code and Penal Code.
7. Legal Practitioners (Remuneration for Legal Documentation and Other Land Matters) Order.

Tone: Professional, precise, authoritative, yet accessible. 
Always cite relevant Nigerian statutes or case law principles when applicable.
Do not provide definitive legal advice for court; always include a disclaimer that you are an AI assistant.
`;

const ai = new GoogleGenAI({ apiKey });

export const generateLegalResearch = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3, // Low temperature for factual accuracy
      }
    });
    return response.text || "I could not generate a response.";
  } catch (error) {
    console.error("Research Error:", error);
    throw new Error("Failed to conduct legal research.");
  }
};

export const draftContract = async (params: ContractParams): Promise<string> => {
  const prompt = `
    Draft a legal document with the following details:
    Type: ${params.type}
    Party A: ${params.partyA}
    Party B: ${params.partyB}
    Jurisdiction/State in Nigeria: ${params.jurisdiction}
    Key Terms/Notes: ${params.keyTerms}

    Ensure the draft adheres to Nigerian legal standards (e.g., using "Naira", proper date formatting, citing relevant laws like Tenancy Laws of Lagos State if applicable, or CAMA 2020 for corporate agreements).
    Structure it clearly with defined clauses.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "Drafting failed.";
  } catch (error) {
    console.error("Drafting Error:", error);
    throw new Error("Failed to draft document.");
  }
};

export const getClauseSuggestions = async (contractType: string): Promise<string[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: { type: Type.STRING },
    description: "List of recommended contract clauses"
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert Nigerian solicitor. List 6 essential, specific legal clauses that should be included in a "${contractType}" to protect the client's interest under Nigerian law. Return only the names of the clauses as a JSON array of strings.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text) as string[];
    }
    return [];
  } catch (error) {
    console.error("Suggestion Error:", error);
    return [];
  }
};

export const summarizeCaseText = async (text: string): Promise<CaseSummary> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Suggested title or case name based on text" },
      ratioDecidendi: { type: Type.STRING, description: "The legal principle established (The reason for the decision)" },
      summary: { type: Type.STRING, description: "A concise summary of the facts and judgment (max 200 words)" },
      relevantStatutes: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING }, 
        description: "List of Nigerian statutes mentioned or relevant" 
      }
    },
    required: ["title", "ratioDecidendi", "summary", "relevantStatutes"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following legal text from a Nigerian legal perspective:\n\n${text}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text) as CaseSummary;
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Summarization Error:", error);
    throw new Error("Failed to summarize text.");
  }
};

export const generateFeeNoteDescription = async (details: string): Promise<string> => {
  const prompt = `
  Write a professional narrative description for a Legal Fee Note (Invoice) based on these details: "${details}".
  
  It should sound formal and justify the professional fees charged. 
  Use standard Nigerian legal billing terminology (e.g., "Professional fees for...", "Perfection of Title", "Solicitor's fees", "Appearance fees").
  Keep it to one concise paragraph suitable for an invoice line item.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5
      }
    });
    return response.text || details;
  } catch (error) {
    return details;
  }
};

export const refineLegalText = async (text: string, instruction: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
      You are a legal editor for the Nigerian jurisdiction.
      Task: Rewrite the following text selection based on the instruction: "${instruction}"
      
      Text selection:
      """
      ${text}
      """
      
      Return ONLY the rewritten text. Ensure high legal precision.
      `,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text || text;
  } catch (error) {
    console.error("Refine Error:", error);
    throw new Error("Failed to refine text.");
  }
};

export const generateDailyBrief = async (scheduleData: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `
            You are an efficient Legal Practice Manager in Nigeria.
            Based on the following schedule of Court Dates and Tasks, generate a "Daily Brief" for the lawyer.
            
            Schedule Data:
            ${scheduleData}
            
            Format:
            - Start with a professional greeting (e.g., "Good morning, Counsel").
            - Highlight the most urgent item (High Priority or Today's Court date).
            - Summarize the court appearances.
            - Summarize the administrative tasks.
            - End with a motivational closing relevant to the legal profession.
            - Keep it concise (under 150 words).
            `,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.5,
            }
        });
        return response.text || "Could not generate brief.";
    } catch (e) {
        return "System error: Unable to generate brief.";
    }
};

export const generateCaseStrategy = async (facts: string, role: string, jurisdiction: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
      You are a Senior Advocate of Nigeria (SAN) and strategic legal advisor.
      
      CASE DETAILS:
      - Client's Role: ${role}
      - Jurisdiction: ${jurisdiction}
      - Facts/Instructions:
      """
      ${facts}
      """
      
      TASK:
      Generate a strategic legal opinion and action plan. Format the output using Markdown.
      
      STRUCTURE:
      1. **Executive Summary**: Brief assessment of the case strength (High/Medium/Low probability).
      2. **Cause of Action**: Identify the specific legal wrongs (e.g., Breach of Contract, Negligence) and relevant Statutes.
      3. **SWOT Analysis**:
         - Strengths (Facts favoring the client)
         - Weaknesses (Legal pitfalls, missing evidence, Limitation Law issues)
         - Opportunities (Settlement, ADR)
         - Threats (Counter-claims, reputational risk)
      4. **Evidentiary Requirements**: What specific documents or witnesses are needed under the Evidence Act 2011 to prove the case?
      5. **Recommended Strategy**: Step-by-step litigation or settlement plan.
      
      Ensure you cite specific Nigerian laws (e.g. Constitution, CAMA, Land Use Act, Rules of Court) where applicable.
      `,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4, // Balanced creativity and precision
      }
    });
    return response.text || "Unable to generate strategy.";
  } catch (error) {
    console.error("Strategy Error:", error);
    throw new Error("Failed to generate case strategy.");
  }
};

export const analyzeWitnessStatement = async (statement: string, type: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
      You are a brilliant Nigerian Litigation Lawyer specializing in Cross-Examination and Evidence.
      
      Task: Analyze the following Witness Statement on Oath.
      Context: This statement is filed by the ${type} (the Opposing Party). We are the opposing counsel.
      
      WITNESS STATEMENT:
      """
      ${statement}
      """
      
      OUTPUT:
      Provide a strategic report in Markdown covering:
      1. **Evidentiary Objections**: Identify specific paragraphs that violate the Evidence Act 2011 (e.g., Hearsay under S.37/38, Opinion Evidence, Non-expert conclusion).
      2. **Inconsistencies & Gaps**: Point out logical flaws, missing details, or contradictions with common sense.
      3. **Cross-Examination Strategy**:
         - List 5-7 "Yes/No" leading questions designed to corner the witness and impeach their credibility.
         - List 3 open questions to expose lack of personal knowledge.
      4. **Documentary Demands**: What documents mentioned (or implied) should be demanded via "Notice to Produce" to verify these claims?
      
      Tone: Aggressive, strategic, and professional.
      `,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
      }
    });
    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Witness Analysis Error:", error);
    throw new Error("Failed to analyze witness statement.");
  }
};

export const generateLegalArgument = async (issue: string, stance: string, facts: string, jurisdiction: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
      You are a highly skilled Litigation Lawyer in Nigeria, drafting a Written Address.
      
      TASK:
      Write a persuasive legal argument for the following ISSUE for Determination.
      
      PARAMETERS:
      - **Issue**: ${issue}
      - **Our Stance/Party**: ${stance} (Argue IN FAVOR of this stance)
      - **Jurisdiction/Court**: ${jurisdiction}
      - **Relevant Facts**: ${facts}
      
      FORMAT (IRAC Style):
      1. **Issue**: Restate the issue concisely.
      2. **Rule**: State the applicable principle of law (Cite relevant Nigerian Statutes, Constitution, or famous Supreme Court cases like *Macfoy v. UAC*, *Madukolu v. Nkemdilim* if relevant to jurisdiction, etc. - Hallucinate plausible citations if specific names are unknown, but prefer well-known principles).
      3. **Analysis**: Apply the law to the facts provided. Argue why our client fits the rule. Distinguish unfavorable authorities if necessary.
      4. **Conclusion**: Urge the court to resolve the issue in favor of the ${stance}.
      
      Tone: Persuasive, Courtroom Formal.
      `,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5,
      }
    });
    return response.text || "Drafting failed.";
  } catch (error) {
    console.error("Briefs Error:", error);
    throw new Error("Failed to generate legal argument.");
  }
};

export const generateCorporateObjects = async (businessDescription: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
      You are a Corporate Solicitor specializing in CAC registrations in Nigeria.
      
      TASK:
      Draft a comprehensive "Objects Clause" for the Memorandum of Association of a company engaging in: "${businessDescription}".
      
      OUTPUT FORMAT:
      - Provide 5-8 distinct, detailed object clauses.
      - Start each clause with "To carry on the business of..." or similar standard legal phrasing.
      - Ensure coverage of related ancillary businesses.
      - Add a general omnibus clause at the end.
      - Output as a Markdown list.
      `,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6,
      }
    });
    return response.text || "Could not generate objects.";
  } catch (error) {
    console.error("Corporate Objects Error:", error);
    throw new Error("Failed to generate objects.");
  }
};

export const generateCorporateResolution = async (action: string, companyName: string, directors: string, type: 'Board' | 'General'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
      You are a Company Secretary. Draft a formal ${type} Resolution for "${companyName}".
      
      ACTION TO BE RESOLVED:
      ${action}
      
      DIRECTORS/MEMBERS PRESENT:
      ${directors}
      
      REQUIREMENTS:
      - Comply with CAMA 2020.
      - Standard formatting (HEADER, PREAMBLE, RESOLUTIONS, SIGNATURES).
      - Professional legal tone.
      `,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
      }
    });
    return response.text || "Could not generate resolution.";
  } catch (error) {
    console.error("Corporate Resolution Error:", error);
    throw new Error("Failed to generate resolution.");
  }
};

export const generateComplianceAdvice = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
      You are a Corporate Compliance Expert in Nigeria (CAMA 2020 & CAC Regulations).
      
      QUERY: ${query}
      
      Provide a concise advisory note on the requirements, potential penalties, and procedure.
      `,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      }
    });
    return response.text || "Could not generate advice.";
  } catch (error) {
    console.error("Compliance Error:", error);
    throw new Error("Failed to generate advice.");
  }
};