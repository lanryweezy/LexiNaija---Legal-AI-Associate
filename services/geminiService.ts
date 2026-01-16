import { ContractParams, CaseSummary } from "../types";

// Mock implementation of AI services for offline capability

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateLegalResearch = async (query: string): Promise<string> => {
  await delay(1500);
  
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes("tenancy") || lowerQuery.includes("landlord")) {
    return `**Legal Research Memorandum: Tenancy Law in Nigeria**

**Summary:**
The relationship between landlord and tenant in Nigeria is primarily governed by the Tenancy Laws of various states (e.g., Tenancy Law of Lagos State 2011) and the Recovery of Premises Act (Abuja).

**Key Principles:**
1. **Notice to Quit:** A valid Notice to Quit must be issued based on the tenancy type (e.g., 6 months for yearly tenancy). *See Iheanacho v. Uzochukwu (1997)*.
2. **Seven Days Notice:** Following the expiration of the Notice to Quit, a 7-Days Notice of Owner's Intention to Recover Possession must be served.
3. **Mesne Profits:** The landlord is entitled to mesne profits for the period the tenant holds over.

**Relevant Statutes:**
- Tenancy Law of Lagos State 2011, Section 13.
- Recovery of Premises Act.

**Conclusion:**
Ensure strict compliance with statutory notices to avoid the suit being struck out for procedural irregularity.`;
  }

  if (lowerQuery.includes("contract") || lowerQuery.includes("agreement")) {
    return `**Legal Research: Contract Law Principles**

**Summary:**
Under Nigerian law, a valid contract requires Offer, Acceptance, Consideration, Intention to Create Legal Relations, and Capacity.

**Key Cases:**
- *Orient Bank (Nig.) Plc v. Bilante Int’l Ltd (1997)*: Defined the essential elements of a valid contract.
- *Best (Nigeria) Ltd v. Blackwood Hodge (Nigeria) Ltd (2011)*: Emphasized the binding nature of signed agreements.

**Statutory Framework:**
- Common Law (received English Law).
- Sale of Goods Act (where applicable).

**Advice:**
Ensure all material terms are expressly stated to avoid ambiguity.`;
  }

  return `**Legal Research Result**

Based on your query regarding "${query}", here is a summary of the legal position in Nigeria:

**General Principles:**
The Nigerian legal system is based on English Common Law, Nigerian Legislation, and Customary Law. In matters not expressly covered by statute, judicial precedent (stare decisis) applies.

**Relevant Authorities:**
Please consult the Constitution of the Federal Republic of Nigeria 1999 (as amended) and recent Supreme Court judgments relevant to this specific area.

**Recommendation:**
Further review of specific case law in the Nigerian Weekly Law Reports (NWLR) is recommended for a definitive position.`;
};

export const draftContract = async (params: ContractParams): Promise<string> => {
  await delay(2000);

  return `**${params.type.toUpperCase()}**

**THIS AGREEMENT** is made this ____ day of ________, 20____.

**BETWEEN:**

**${params.partyA}** of [Address], (hereinafter referred to as "THE FIRST PARTY") which expression shall where the context so admits include heirs, legal representatives, and assigns of the one part.

**AND**

**${params.partyB}** of [Address], (hereinafter referred to as "THE SECOND PARTY") which expression shall where the context so admits include heirs, legal representatives, and assigns of the other part.

**WHEREAS:**
1. The First Party is...
2. The Second Party is desirous of...
3. Both parties have agreed to the terms herein contained.

**NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:**

**1. CONSIDERATION**
In consideration of the mutual covenants herein contained...

**2. KEY TERMS**
${params.keyTerms}

**3. JURISDICTION AND GOVERNING LAW**
This Agreement shall be governed by and construed in accordance with the laws of ${params.jurisdiction}, Nigeria.

**4. DISPUTE RESOLUTION**
Any dispute arising from this Agreement shall be settled amicably or referred to arbitration in accordance with the Arbitration and Mediation Act 2023.

**IN WITNESS WHEREOF** the parties have set their hands and seals the day and year first above written.

**SIGNED, SEALED AND DELIVERED**
by the within named **${params.partyA}**

_________________________
Signature

**In the presence of:**
Name: ___________________
Address: _________________
Signature: _______________

**SIGNED, SEALED AND DELIVERED**
by the within named **${params.partyB}**

_________________________
Signature
`;
};

export const getClauseSuggestions = async (contractType: string): Promise<string[]> => {
  await delay(1000);
  
  const commonClauses = [
    "Force Majeure Clause",
    "Dispute Resolution / Arbitration Clause",
    "Governing Law and Jurisdiction Clause",
    "Confidentiality Clause",
    "Termination Clause",
    "Indemnity Clause"
  ];

  if (contractType.toLowerCase().includes("tenancy") || contractType.toLowerCase().includes("lease")) {
    return [
      "Covenant to Pay Rent",
      "Covenant to Keep Premises in Good Repair",
      "Covenant Not to Sublet or Assign",
      "Quiet Enjoyment Clause",
      "Termination and Re-entry Clause",
      "Option to Renew Clause"
    ];
  }

  if (contractType.toLowerCase().includes("employment")) {
    return [
      "Probation Period Clause",
      "Job Description and Duties",
      "Remuneration and Benefits",
      "Non-Compete and Non-Solicitation",
      "Termination and Notice Period",
      "Code of Conduct"
    ];
  }

  return commonClauses;
};

export const summarizeCaseText = async (text: string): Promise<CaseSummary> => {
  await delay(2000);

  return {
    title: "Analyzed Legal Text / Judgment",
    ratioDecidendi: "The court held that where there is a clear and unambiguous contract between parties, the court must give effect to the intention of the parties as expressed in the document.",
    summary: "This text appears to be a legal submission or judgment. The core issue revolves around the interpretation of rights and obligations. The analysis suggests that the text emphasizes strict adherence to procedural or substantive legal requirements as outlined in the provided excerpt.",
    relevantStatutes: ["Constitution of the Federal Republic of Nigeria 1999", "Evidence Act 2011"]
  };
};

export const generateFeeNoteDescription = async (details: string): Promise<string> => {
  await delay(800);
  return `Professional fees for ${details.toLowerCase()}, including review of relevant documents, necessary consultations, and perfecting all required legal instruments.`;
};

export const refineLegalText = async (text: string, instruction: string): Promise<string> => {
  await delay(1500);
  return `${text}\n\n[Refined based on instruction: "${instruction}" - Ensure clarity, precision, and removal of ambiguity in accordance with legal drafting standards.]`;
};

export const generateDailyBrief = async (scheduleData: string): Promise<string> => {
  await delay(1500);
  return `**Daily Brief for Counsel**

**Good morning, Learned Counsel.**

Based on your schedule, here is your brief for the day:

**Overview:**
You have a busy schedule ahead. Please prioritize court appearances.

**Schedule Summary:**
${scheduleData}

**Action Items:**
1. Ensure all case files for today's hearings are in order.
2. Review the motion papers for the upcoming application.
3. Confirm attendance with clients for meetings.

**Note:**
"Preparation is the key to success at the Bar." - *Afe Babalola, SAN*

Best regards,
**LexiNaija Assistant**`;
};

export const generateCaseStrategy = async (facts: string, role: string, jurisdiction: string): Promise<string> => {
  await delay(2000);
  return `**Case Strategy Report**

**Jurisdiction:** ${jurisdiction}
**Client Role:** ${role}

**1. SWOT Analysis**
*   **Strengths:** Based on the facts, your position appears supported by document evidence (if available).
*   **Weaknesses:** Potential gaps in oral evidence; ensure witnesses are credible.
*   **Opportunities:** Explore settlement (ADR) if the opposing party shows willingness.
*   **Threats:** Delays in court processes; potential counter-claims.

**2. Legal Issues**
*   Whether the Claimant has established a cause of action.
*   Whether the proper parties are before the court.

**3. Recommended Strategy**
*   **Immediate:** File necessary originating processes or defense within time.
*   **Evidence:** Gather all original documents.
*   **Pre-Trial:** Issue a formal demand letter (if Claimant) or Request for Further and Better Particulars (if Defendant).

**4. Relevant Statutes**
*   High Court Civil Procedure Rules of ${jurisdiction.split(' ')[0] || 'Lagos'} State.
*   Evidence Act 2011.

**Disclaimer:** This is an AI-generated strategy guide. Please exercise professional judgment.`;
};

export const generateLegalArgument = async (issue: string, stance: string, facts: string, jurisdiction: string): Promise<string> => {
  await delay(2000);
  return `**Legal Argument Draft**

**Court:** ${jurisdiction}
**Issue:** ${issue}
**Stance:** ${stance}

**My Lord,**

**Submission:**
It is our humble submission that, based on the facts before this Honourable Court, the position of the ${stance} is meritorious and grounded in law.

**Argument:**
1.  **On the Issue of ${issue}:**
    The law is trite that [General Legal Principle]. This was established in the *locus classicus* case of *Madukolu v. Nkemdilim (1962)* regarding jurisdiction (if applicable) or other relevant authorities.

2.  **Application to Facts:**
    Applying the law to the instant case, the facts show that [Reference to Facts provided]. Therefore, the requirements of the law have been satisfied.

**Prayer:**
We urge this Honourable Court to resolve this issue in favour of the ${stance}.

**Most Obliged.**`;
};

export const analyzeWitnessStatement = async (statement: string, role: string): Promise<string> => {
  await delay(1800);
  return `**Cross-Examination Strategy Analysis**

**Target Witness Role:** ${role}

**1. Inconsistencies & Gaps**
*   The statement appears generic in parts. Look for specific dates or times that are missing.
*   Check if the witness has personal knowledge of the facts or is relying on hearsay (Section 38, Evidence Act 2011).

**2. Credibility Check**
*   Does the witness have a motive to lie?
*   Is the statement consistent with pleaded facts?

**3. Suggested Questions**
*   "Mr. Witness, you stated X in paragraph Y. Is it not true that [Contradictory Fact]?"
*   "Were you personally present when this event occurred?"
*   "I put it to you that your account is a fabrication..."

**4. Strategic Goal**
*   Discredit the testimony regarding [Key Issue].
*   Elicit admission of [Favorable Fact].`;
};

export const generateCorporateObjects = async (description: string): Promise<string> => {
  await delay(1200);
  return `**Suggested Objects Clauses for Memorandum of Association**

1.  To carry on the business of ${description} and to act as manufacturers, distributors, agents, and general merchants.
2.  To borrow or raise money in such manner as the Company shall think fit.
3.  To do all such other things as may be deemed incidental or conducive to the attainment of the above objects or any of them.

**Note:** Ensure compliance with CAMA 2020 requirements for specific business types.`;
};

export const generateCorporateResolution = async (action: string, companyName: string, directors: string, type: 'Board' | 'General'): Promise<string> => {
  await delay(1200);
  return `**${type.toUpperCase()} RESOLUTION OF ${companyName.toUpperCase()}**

**HELD ON:** ${new Date().toLocaleDateString()}
**AT:** Registered Address of the Company

**PRESENT:**
${directors}

**WHEREAS:**
The Directors/Shareholders considered the need to ${action}.

**IT IS HEREBY RESOLVED:**
1.  **THAT** the Company do hereby approve ${action}.
2.  **THAT** the Directors be and are hereby authorized to take all necessary steps to give effect to this resolution.
3.  **THAT** any documents required to be signed in connection with the above be signed by any two Directors or a Director and the Secretary.

**DATED this ___ day of _______, 20__**

____________________
Director

____________________
Director/Secretary`;
};

export const generateComplianceAdvice = async (query: string): Promise<string> => {
  await delay(1500);
  return `**Corporate Compliance Advisory**

**Query:** ${query}

**Regulatory Framework:**
*   Companies and Allied Matters Act (CAMA) 2020
*   Tax Laws (CITA, PITA, VAT Act)

**Advice:**
Based on the current regulatory landscape in Nigeria:
1.  Ensure annual returns are filed with the Corporate Affairs Commission (CAC) to avoid penalties.
2.  If this involves foreign participation, ensure NIPC registration.
3.  Maintain statutory books (Register of Members, Directors, Secretaries) at the registered office.

**Action Point:**
Conduct a legal audit to verify specific compliance status regarding "${query}".`;
};
