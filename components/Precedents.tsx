import React, { useState } from 'react';
import { BookOpen, FileText, ChevronRight, Copy, Search, Scale, Briefcase, Building2, Shield, Feather, Gavel, FileSignature } from 'lucide-react';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { AppView } from '../types';

interface PrecedentsProps {
  onNavigate: (view: AppView) => void;
}

interface Template {
  id: string;
  category: string;
  title: string;
  description: string;
  content: string;
  jurisdiction?: string;
  court?: string;
}

const TEMPLATES: Template[] = [
  // --- CIVIL LITIGATION ---
  {
    id: 'lit1',
    category: 'Civil Litigation',
    title: 'Motion Ex-Parte for Substituted Service',
    description: 'Application to serve court processes by substitution (e.g. pasting at address).',
    jurisdiction: 'Lagos State',
    court: 'High Court',
    content: `# [COURT]
# [DIVISION]
# HOLDEN AT [LOCATION]

SUIT NO: ....................

BETWEEN:

[PLAINTIFF NAME]   ........................................   CLAIMANT/APPLICANT

AND

[DEFENDANT NAME]   ........................................   DEFENDANT/RESPONDENT

## MOTION EX-PARTE
**BROUGHT PURSUANT TO ORDER 7 RULE 5 OF THE HIGH COURT OF LAGOS STATE (CIVIL PROCEDURE) RULES 2019 AND UNDER THE INHERENT JURISDICTION OF THIS HONOURABLE COURT**

**TAKE NOTICE** that this Honourable Court will be moved on the ...... day of ...... 20.... at the hour of 9 o'clock in the forenoon or so soon thereafter as Counsel for the Claimant/Applicant may be heard praying the Court for the following orders:

1. **AN ORDER** of this Honourable Court granting leave to the Claimant/Applicant to serve the Writ of Summons and other originating processes in this suit on the Defendant by substituted means, to wit: by pasting same on the entrance gate or conspicuous part of the Defendant's last known address at [ADDRESS].

2. **AND FOR SUCH FURTHER ORDER(S)** as this Honourable Court may deem fit to make in the circumstances.

**DATED THIS ...... DAY OF ...... 20....**

__________________________
**[LAWYER NAME]**
Counsel to the Applicant
[FIRM ADDRESS]`
  },
  {
    id: 'lit2',
    category: 'Civil Litigation',
    title: 'Affidavit of Urgency',
    description: 'Supporting affidavit for urgent applications (e.g., Injunctions).',
    jurisdiction: 'Lagos State',
    court: 'High Court',
    content: `# [COURT]
# HOLDEN AT [LOCATION]

SUIT NO: ....................

BETWEEN:

[PLAINTIFF NAME]   .......   CLAIMANT

AND

[DEFENDANT NAME]   .......   DEFENDANT

## AFFIDAVIT OF URGENCY

I, [DEPONENT NAME], Male/Female, Christian/Muslim, Nigerian Citizen of [ADDRESS], do hereby make Oath and state as follows:

1. That I am the Claimant in this suit and by virtue of my position, I am conversant with the facts deposed herein.
2. That the res (subject matter) of this suit is at imminent risk of being destroyed/dissipated by the Defendant unless restrained.
3. That the Defendant has threatened to [Specific Threat] as shown in Exhibit A attached.
4. That unless this Honourable Court intervenes urgently, the judgment of this court will be rendered nugatory.
5. That it is in the interest of justice to grant this application.
6. That I swear to this Affidavit in good faith believing the contents to be true and correct in accordance with the Oaths Act.

__________________________
**DEPONENT**

**SWORN TO** at the High Court Registry, Lagos.
This ...... day of ...... 20....

**BEFORE ME**

**COMMISSIONER FOR OATHS**`
  },
  {
    id: 'lit3',
    category: 'Civil Litigation',
    title: 'Writ of Summons (General)',
    description: 'Standard Writ of Summons for commencing civil actions.',
    jurisdiction: 'Lagos State',
    court: 'High Court',
    content: `# [COURT]
# [DIVISION]
# HOLDEN AT [LOCATION]

SUIT NO: ....................

BETWEEN:

[PLAINTIFF NAME]   ........................................   CLAIMANT

AND

[DEFENDANT NAME]   ........................................   DEFENDANT

## WRIT OF SUMMONS

**TO THE DEFENDANT:** [DEFENDANT NAME] of [ADDRESS].

**YOU ARE HEREBY COMMANDED** that within forty-two (42) days after the service of this Writ on you, inclusive of the day of such service, you do cause an appearance to be entered for you in an action at the suit of [PLAINTIFF NAME]; and take notice that in default of your so doing, the Claimant may proceed therein, and judgment may be given in your absence.

**DATED THIS ...... DAY OF ...... 20....**

__________________________
**REGISTRAR**

**MEMORANDUM TO BE SUBSCRIBED ON THE WRIT**
N.B: This writ is to be served within six calendar months from the date thereof, or, if renewed, within three calendar months from the date of the last renewal, including the day of such date, and not afterwards.

**THE CLAIMANT'S CLAIM IS FOR:**
1. **A DECLARATION** that...
2. **DAMAGES** in the sum of...
3. **PERMANENT INJUNCTION** restraining...

__________________________
**[LAWYER NAME]**
Counsel to the Claimant
[FIRM ADDRESS]
[PHONE NUMBER]
[EMAIL]`
  },

  // --- PROPERTY & TENANCY ---
  {
    id: 'prop1',
    category: 'Property',
    title: 'Notice to Quit (Generic)',
    description: 'Statutory notice to determine tenancy.',
    jurisdiction: 'Generic',
    content: `[DATE]

TO:
[TENANT NAME]
[ADDRESS OF PROPERTY]

## NOTICE TO QUIT

**TAKE NOTICE** that you are required to quit and deliver up possession of the [DESCRIPTION OF PROPERTY e.g., 2 Bedroom Flat] with the appurtenances situate at [ADDRESS] which you hold of me as tenant thereof, on the ...... day of ...... 20.... or at the expiration of your current term of tenancy which shall expire next after the end of [NOTICE PERIOD] months from the service of this notice.

**DATED THIS ...... DAY OF ...... 20....**

__________________________
**[LANDLORD/SOLICITOR NAME]**
(Landlord / Solicitor to Landlord)`
  },
  {
    id: 'prop2',
    category: 'Property',
    title: "7 Days Notice of Owner's Intention",
    description: 'Notice to recover possession after expiry of Notice to Quit.',
    jurisdiction: 'Generic',
    content: `[DATE]

TO:
[TENANT NAME]
[ADDRESS OF PROPERTY]

## NOTICE OF OWNER'S INTENTION TO APPLY TO RECOVER POSSESSION

**I, [OWNER/AGENT NAME]**, the Owner (or Agent to the Owner) do hereby give you notice that unless peaceable possession of the premises situate at [ADDRESS] which you held of me under a tenancy from year to year (or as the case may be) which tenancy has been determined by a Notice to Quit dated the .... day of .... 20...., is given to me on or before the expiration of SEVEN (7) CLEAR DAYS from the service of this notice, I shall on [DATE] apply to the Magistrate Court District for a summons to eject any person therefrom.

**DATED THIS ...... DAY OF ...... 20....**

__________________________
**[SIGNATURE]**
Owner / Solicitor`
  },
  {
    id: 'prop3',
    category: 'Property',
    title: 'Deed of Assignment (Land)',
    description: 'Transfer of title to land between Assignor and Assignee.',
    jurisdiction: 'Generic',
    content: `**THIS DEED OF ASSIGNMENT** is made this ...... day of ...... 20....

**BETWEEN**

**[ASSIGNOR NAME]** of [ADDRESS] (hereinafter referred to as "THE ASSIGNOR") of the one part.

**AND**

**[ASSIGNEE NAME]** of [ADDRESS] (hereinafter referred to as "THE ASSIGNEE") of the other part.

**WHEREAS:**
1. The Assignor is the beneficial owner of the piece of land situate at [LAND ADDRESS] measuring approximately [SIZE] square meters.
2. The Assignor has agreed to assign his entire unexpired residue interest in the land to the Assignee for a consideration of N[AMOUNT].

**NOW THIS DEED WITNESSES AS FOLLOWS:**
1. **CONSIDERATION:** In consideration of the sum of N[AMOUNT] paid by the Assignee to the Assignor (the receipt whereof the Assignor hereby acknowledges).
2. **ASSIGNMENT:** The Assignor as Beneficial Owner hereby ASSIGNS unto the Assignee ALL that parcel of land situate at [ADDRESS] TO HOLD the same unto the Assignee for the unexpired residue of the term of years granted by the Certificate of Occupancy dated .... registered as No .... at Page .... in Volume .... of the Lands Registry, [STATE].
3. **INDEMNITY:** The Assignor covenants to indemnify the Assignee against any adverse claim.

**IN WITNESS WHEREOF** the parties have set their hands and seals.

**SIGNED, SEALED AND DELIVERED**
by the within named **ASSIGNOR**

__________________________
In the presence of:
Name: ....................
Address: .................
Signature: ...............

**SIGNED, SEALED AND DELIVERED**
by the within named **ASSIGNEE**

__________________________
In the presence of:
Name: ....................
Address: .................
Signature: ...............`
  },
  {
    id: 'prop4',
    category: 'Property',
    title: 'Tenancy Agreement (Residential)',
    description: 'Standard agreement for residential tenancy.',
    jurisdiction: 'Generic',
    content: `**THIS TENANCY AGREEMENT** is made this .... day of .... 20....

**BETWEEN**

**[LANDLORD NAME]** (The Landlord)
AND
**[TENANT NAME]** (The Tenant)

**PREMISES:** [Description of Apartment/House] at [Address].
**RENT:** N[Amount] per annum.
**TERM:** One (1) Year commencing on [Date] and ending on [Date].

**THE TENANT COVENANTS:**
1. To pay rent in advance.
2. To keep the interior in good repair.
3. Not to sublet without written consent.
4. To pay all utility bills (electricity, waste, water).
5. To use the premises for residential purposes only.

**THE LANDLORD COVENANTS:**
1. To ensure quiet enjoyment of the premises.
2. To keep the structural parts (roof, walls) in repair.

**TERMINATION:**
This tenancy requires [Number] months' notice in writing to determine.

**SIGNED** by the Parties.

____________________        ____________________
**LANDLORD**                **TENANT**`
  },

  // --- CORPORATE & COMMERCIAL ---
  {
    id: 'corp1',
    category: 'Corporate',
    title: 'Board Resolution (Generic)',
    description: 'Resolution of the Board of Directors for general matters.',
    jurisdiction: 'Generic',
    content: `**BOARD RESOLUTION OF [COMPANY NAME] LTD**
**Held at:** [Address]
**On:** [Date]

**PRESENT:**
1. [Director Name] - Chairman
2. [Director Name]
3. [Secretary Name]

**BUSINESS OF THE DAY:**
To consider and approve [Topic e.g., Opening of Bank Account].

**IT WAS RESOLVED:**
1. THAT the Company opens a corporate account with [Bank Name].
2. THAT the signatories to the account be [Name A] and [Name B].
3. THAT the mandate be "Both to sign".

**DATED THIS ...... DAY OF ...... 20....**

__________________________      __________________________
**DIRECTOR**                    **SECRETARY**`
  },
  {
    id: 'corp2',
    category: 'Corporate',
    title: 'Employment Contract',
    description: 'Standard contract of employment for staff.',
    jurisdiction: 'Generic',
    content: `**CONTRACT OF EMPLOYMENT**

**DATE:** [Date]
**EMPLOYER:** [Company Name]
**EMPLOYEE:** [Employee Name]

**1. POSITION**
You are employed as [Job Title].

**2. COMMENCEMENT & PROBATION**
Employment starts on [Date]. You will be on probation for [Number] months.

**3. REMUNERATION**
Your gross annual salary is N[Amount], payable monthly in arrears.

**4. HOURS OF WORK**
8:00am to 5:00pm, Monday to Friday.

**5. LEAVE**
You are entitled to [Number] working days annual leave.

**6. TERMINATION**
During probation: 2 weeks notice.
After confirmation: 1 month notice or salary in lieu.

**7. CONFIDENTIALITY**
You shall not disclose company trade secrets.

**ACCEPTED BY:**

__________________________
**[EMPLOYEE SIGNATURE]**`
  },
  {
    id: 'corp3',
    category: 'Corporate',
    title: 'Letter of Demand (Debt)',
    description: 'Formal demand for payment of outstanding debt.',
    jurisdiction: 'Generic',
    content: `[FIRM LETTERHEAD]

[DATE]

[DEBTOR NAME]
[ADDRESS]

Dear Sir/Madam,

**DEMAND FOR PAYMENT OF OUTSTANDING SUM OF N[AMOUNT]**

We act as Solicitors to **[CLIENT NAME]** ("our Client") on whose instruction we write.

It is our instruction that you are indebted to our Client in the sum of **N[Amount]** being the outstanding balance for [Goods/Services] supplied to you on [Date].

Despite repeated demands, you have failed, refused, or neglected to liquidate this debt.

**TAKE NOTICE** that unless the said sum of **N[Amount]** is paid to our Client within **SEVEN (7) DAYS** of the receipt of this letter, we have strict instructions to commence legal proceedings against you for the recovery of the debt, accrued interest, and legal costs without further recourse to you.

We advise you to heed this wise counsel.

Yours faithfully,

__________________________
**PP: [LAW FIRM NAME]**`
  },

  // --- FAMILY & PROBATE ---
  {
    id: 'fam1',
    category: 'Family',
    title: 'Simple Will',
    description: 'Last Will and Testament for simple estate distribution.',
    jurisdiction: 'Generic',
    content: `**THIS IS THE LAST WILL AND TESTAMENT** of me **[TESTATOR NAME]** of [Address].

1. **REVOCATION:** I REVOKE all former Wills and testamentary dispositions made by me.
2. **EXECUTORS:** I APPOINT [Name 1] and [Name 2] to be the Executors and Trustees of this my Will.
3. **BURIAL:** I wish to be buried in a Christian/Muslim manner at [Location].
4. **BEQUESTS:**
   a) I GIVE my house at [Address] to my wife/husband [Name].
   b) I GIVE my shares in [Company] to my son [Name].
   c) I GIVE the residue of my estate to my children in equal shares.

**IN WITNESS WHEREOF** I have hereunto set my hand this .... day of .... 20....

__________________________
**TESTATOR**

**SIGNED** by the Testator in our joint presence and then by us in his/her presence.

**WITNESS 1:**
Name: ....................
Signature: ...............

**WITNESS 2:**
Name: ....................
Signature: ...............`
  },
  {
    id: 'fam2',
    category: 'Family',
    title: 'Divorce Petition (Grounds)',
    description: 'Excerpt of grounds for dissolution of marriage.',
    jurisdiction: 'Generic',
    content: `**GROUNDS FOR RELIEF**

The Petitioner seeks a decree of dissolution of marriage on the ground that the marriage has broken down irretrievably in that:

(a) Since the marriage, the Respondent has willfully and persistently refused to consummate the marriage.
(b) Since the marriage, the Respondent has committed adultery and the Petitioner finds it intolerable to live with the Respondent.
(c) Since the marriage, the Respondent has behaved in such a way that the Petitioner cannot reasonably be expected to live with the Respondent.
(d) The Respondent has deserted the Petitioner for a continuous period of at least one year immediately preceding the presentation of this petition.
(e) The parties to the marriage have lived apart for a continuous period of at least two years immediately preceding the presentation of the petition and the Respondent does not object to a decree being granted.
(f) The parties to the marriage have lived apart for a continuous period of at least three years immediately preceding the presentation of the petition.

**PARTICULARS OF BEHAVIOUR:**
1. That on [Date], the Respondent...`
  },

  {
    id: 'lit4',
    category: 'Civil Litigation',
    title: 'Motion on Notice for Interlocutory Injunction',
    description: 'Application restraining the Defendant pending determination of the suit.',
    jurisdiction: 'FCT, Abuja',
    court: 'High Court',
    content: `# [COURT]
# [DIVISION]
# HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

BETWEEN:

[PLAINTIFF NAME]   ........................................   CLAIMANT/APPLICANT

AND

[DEFENDANT NAME]   ........................................   DEFENDANT/RESPONDENT

## MOTION ON NOTICE
BROUGHT PURSUANT TO ORDER 43 OF THE HIGH COURT OF THE FCT CIVIL PROCEDURE RULES AND UNDER THE INHERENT JURISDICTION OF THIS HONOURABLE COURT

TAKE NOTICE that the Court will be moved on the ...... day of ...... 20.... or so soon thereafter by Counsel to the Claimant praying for:

1. AN ORDER of interlocutory injunction restraining the Defendant, his servants, agents or privies from further interfering with the res pending the determination of this suit.
2. AND FOR SUCH FURTHER ORDER(S) as this Honourable Court may deem fit.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]
[FIRM ADDRESS]`
  },

  {
    id: 'lit5',
    category: 'Civil Litigation',
    title: 'Statement of Claim',
    description: 'Pleading setting out material facts and reliefs sought.',
    jurisdiction: 'Rivers State',
    court: 'High Court',
    content: `# [COURT]
# [DIVISION]
# HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

BETWEEN:

[PLAINTIFF NAME]   ........................................   CLAIMANT

AND

[DEFENDANT NAME]   ........................................   DEFENDANT

## STATEMENT OF CLAIM

1. The Claimant is a Nigerian citizen of address at [ADDRESS].
2. The Defendant is a Nigerian citizen whose address is [ADDRESS].
3. By a contract dated [DATE], the Defendant agreed to [Summary].
4. The Defendant breached the contract by [Particulars].
5. As a result, the Claimant suffered loss and damage.

WHEREOF the Claimant claims against the Defendant as follows:
1. Damages in the sum of N[AMOUNT].
2. Interest at the rate of [RATE]% per annum from [DATE] until judgment.
3. Costs of this action.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]
[FIRM ADDRESS]`
  },

  {
    id: 'lit6',
    category: 'Civil Litigation',
    title: 'Originating Summons (Federal High Court)',
    description: 'Proceedings commenced by originating summons under Federal High Court Rules.',
    jurisdiction: 'Federal',
    court: 'Federal High Court',
    content: `# FEDERAL HIGH COURT OF NIGERIA
# [DIVISION]
# HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

IN THE MATTER OF: [SUBJECT]

AND IN THE MATTER OF: [STATUTE/REGULATION]

BETWEEN:

[PLAINTIFF NAME]   ........................................   APPLICANT

AND

[DEFENDANT NAME]   ........................................   RESPONDENT

## ORIGINATING SUMMONS

Let the Respondent within 30 days after service of this Summons on him, inclusive of the day of such service, cause an appearance to be entered to this Summons, and take notice that in default of his so doing, the Applicant may proceed therein and judgment may be given in his absence.

Questions for determination:
1. Whether on the proper construction of [STATUTE], the Applicant is entitled to [Relief].

Reliefs sought:
1. A DECLARATION that ...
2. AN ORDER directing ...

DATED THIS ...... DAY OF ...... 20....

__________________________
REGISTRAR`
  },

  {
    id: 'prop5',
    category: 'Property',
    title: 'Notice to Quit (Lagos Tenancy Law)',
    description: 'State-specific notice in compliance with Lagos Tenancy Law 2011.',
    jurisdiction: 'Lagos State',
    court: 'Magistrate Court',
    content: `[DATE]

TO:
[TENANT NAME]
[ADDRESS]

TAKE NOTICE that pursuant to the Lagos State Tenancy Law 2011, you are required to quit and deliver up possession of the premises known as [ADDRESS] being a [MONTHLY/YEARLY] tenancy on or before the expiration of [NOTICE PERIOD] months from the service of this notice.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LANDLORD NAME]
or Counsel`
  },

  {
    id: 'prop6',
    category: 'Property',
    title: 'Commercial Tenancy Agreement',
    description: 'Lease agreement for commercial premises.',
    jurisdiction: 'Rivers State',
    court: 'High Court',
    content: `THIS COMMERCIAL TENANCY AGREEMENT is made this ...... day of ...... 20....

BETWEEN [LANDLORD NAME] and [TENANT NAME]

PREMISES: [Address]
RENT: N[Amount] per annum
TERM: [Years] years commencing [DATE]
USE: Commercial purposes only

Key Terms:
1. Service Charge: N[Amount] payable quarterly.
2. Repairs: Tenant responsible for internal; Landlord for structural.
3. Insurance: Tenant to insure contents; Landlord to insure building.
4. Termination: [Months] notice.

SIGNED:
LANDLORD ................................  TENANT ................................`
  },

  {
    id: 'corp4',
    category: 'Corporate',
    title: 'Special Resolution — Change of Company Name',
    description: 'Shareholders’ special resolution pursuant to CAMA 2020.',
    jurisdiction: 'Federal',
    content: `SPECIAL RESOLUTION OF [COMPANY NAME] LTD PASSED ON [DATE]

IT WAS RESOLVED THAT the name of the Company be changed from [OLD NAME] to [NEW NAME], subject to the approval of the Corporate Affairs Commission.

That the Directors be and are hereby authorized to take all steps necessary to give effect to this resolution.

__________________________
CHAIRMAN`
  },

  {
    id: 'crim1',
    category: 'Criminal',
    title: 'Bail Application (Magistrate Court)',
    description: 'Application for bail pending trial.',
    jurisdiction: 'Lagos State',
    court: 'Magistrate Court',
    content: `IN THE MAGISTRATE COURT OF LAGOS STATE HOLDEN AT [LOCATION]

CHARGE NO: [SUIT NO]

BETWEEN:

THE STATE   ........................................   COMPLAINANT

AND

[CLIENT NAME]   ........................................   DEFENDANT/APPLICANT

MOTION ON NOTICE

BROUGHT PURSUANT TO THE LAGOS STATE ADMINISTRATION OF CRIMINAL JUSTICE LAW AND UNDER THE INHERENT JURISDICTION OF THIS COURT

1. AN ORDER admitting the Applicant to bail on liberal terms.
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

GROUNDS:
1. The Applicant is presumed innocent.
2. The Applicant has reliable sureties and a fixed address at [ADDRESS].

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'crim2',
    category: 'Criminal',
    title: 'Motion for Variation of Bail Conditions',
    description: 'Application to vary onerous bail terms.',
    jurisdiction: 'Federal',
    court: 'Federal High Court',
    content: `IN THE FEDERAL HIGH COURT HOLDEN AT [LOCATION]

SUIT/CHARGE NO: [SUIT NO]

BETWEEN:

FEDERAL REPUBLIC OF NIGERIA   ................................   COMPLAINANT

AND

[CLIENT NAME]   ........................................   DEFENDANT/APPLICANT

MOTION ON NOTICE

1. AN ORDER varying the bail terms to allow the Applicant meet same.
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'prob1',
    category: 'Probate',
    title: 'Petition for Letters of Administration',
    description: 'Application for Letters of Administration over intestate estate.',
    jurisdiction: 'Lagos State',
    court: 'High Court (Probate)',
    content: `IN THE HIGH COURT OF LAGOS STATE (PROBATE REGISTRY) HOLDEN AT [LOCATION]

IN THE ESTATE OF [DECEASED NAME] (DECEASED)

PETITIONERS: [CLIENT NAME] and [CO-PETITIONER NAME]

The Petitioners humbly apply for the grant of Letters of Administration over the estate of the above-named deceased who died intestate on [DATE].

Grounds:
1. The Petitioners are lawful next-of-kin.
2. Assets include property at [ADDRESS] and bank accounts at [BANK].

DATED THIS ...... DAY OF ...... 20....

__________________________
PETITIONERS`
  },

  {
    id: 'prob2',
    category: 'Probate',
    title: 'Oath of Executor',
    description: 'Executor’s oath in support of probate grant.',
    jurisdiction: 'Ogun State',
    court: 'High Court (Probate)',
    content: `I, [CLIENT NAME], of [ADDRESS], do make Oath and say that I will well and truly administer the estate of [TESTATOR NAME], pay all debts, legacies and bequests, and render a true account when lawfully required.

SWORN TO at the Probate Registry, Ogun State this ...... day of ...... 20....

BEFORE ME
COMMISSIONER FOR OATHS`
  },

  {
    id: 'app1',
    category: 'Appellate',
    title: 'Notice of Appeal (Civil)',
    description: 'Appeal to the Court of Appeal against High Court judgment.',
    jurisdiction: 'Rivers State',
    court: 'Court of Appeal, Port Harcourt Division',
    content: `IN THE COURT OF APPEAL HOLDEN AT PORT HARCOURT

APPEAL NO: [SUIT NO]

BETWEEN:

[PLAINTIFF NAME]   ........................................   APPELLANT

AND

[DEFENDANT NAME]   ........................................   RESPONDENT

NOTICE OF APPEAL

Take notice that the Appellant appeals to the Court of Appeal against the whole of the decision of the High Court delivered on [DATE].

GROUNDS OF APPEAL:
1. The learned trial judge erred in law when ...

RELIEFS SOUGHT:
1. Allow the appeal and set aside the judgment.

DATED THIS ...... DAY OF ...... 20....

__________________________
COUNSEL TO THE APPELLANT`
  },

  {
    id: 'app2',
    category: 'Appellate',
    title: 'Motion for Extension of Time (Court of Appeal)',
    description: 'Application for extension of time to compile record or file brief.',
    jurisdiction: 'FCT, Abuja',
    court: 'Court of Appeal, Abuja Division',
    content: `IN THE COURT OF APPEAL HOLDEN AT ABUJA

APPEAL NO: [SUIT NO]

MOTION ON NOTICE

1. AN ORDER extending time within which the Appellant may file the Appellant’s Brief.
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

GROUNDS:
1. Delay was due to circumstances beyond control.

DATED THIS ...... DAY OF ...... 20....

__________________________
COUNSEL`
  },

  {
    id: 'fam3',
    category: 'Family',
    title: 'Petition for Custody',
    description: 'Matrimonial cause seeking custody of minor children.',
    jurisdiction: 'Kano State',
    court: 'High Court',
    content: `IN THE HIGH COURT OF KANO STATE HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

BETWEEN:

[PLAINTIFF NAME]   ........................................   PETITIONER

AND

[DEFENDANT NAME]   ........................................   RESPONDENT

RELIEFS:
1. An order granting custody of the minor children to the Petitioner.
2. An order for maintenance.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'lit7',
    category: 'Civil Litigation',
    title: 'Motion to Set Aside Default Judgment',
    description: 'Application to set aside judgment entered in default of appearance.',
    jurisdiction: 'Kaduna State',
    court: 'High Court',
    content: `MOTION ON NOTICE brought under Order [X] of the Kaduna State High Court Rules praying:

1. AN ORDER setting aside the default judgment entered on [DATE].
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

GROUNDS:
1. The Defendant was not served with the originating processes.
2. The Defendant has a meritorious defence.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'lit8',
    category: 'Civil Litigation',
    title: 'Witness Statement on Oath',
    description: 'Template of Witness Statement in support of pleadings.',
    jurisdiction: 'Oyo State',
    court: 'High Court',
    content: `I, [CLIENT NAME], of [ADDRESS], make Oath and state:

1. That I am the Claimant/Defendant in this suit.
2. That the facts herein are within my personal knowledge.
3. [Facts]

SWORN TO at the High Court Registry, [LOCATION] this ...... day of ...... 20....

BEFORE ME
COMMISSIONER FOR OATHS`
  },

  {
    id: 'lit9',
    category: 'Civil Litigation',
    title: 'Motion for Summary Judgment',
    description: 'Application under summary judgment procedure.',
    jurisdiction: 'Anambra State',
    court: 'High Court',
    content: `MOTION ON NOTICE brought pursuant to Order [X] of the Anambra State High Court (Civil Procedure) Rules praying:

1. AN ORDER entering summary judgment in favour of the Claimant for the sum of N[AMOUNT].
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'lit10',
    category: 'Civil Litigation',
    title: 'Statement of Defence',
    description: 'Defendant’s responsive pleading.',
    jurisdiction: 'Enugu State',
    court: 'High Court',
    content: `# [COURT]
# [DIVISION]
# HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

BETWEEN:

[PLAINTIFF NAME]   ........................................   CLAIMANT

AND

[DEFENDANT NAME]   ........................................   DEFENDANT

## STATEMENT OF DEFENCE

1. The Defendant denies paragraphs [X] of the Statement of Claim and puts the Claimant to the strictest proof.
2. In further answer, the Defendant states that [Facts].
3. The suit is frivolous and an abuse of court process.

WHEREFORE the Defendant prays the Court to dismiss the suit.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'prop7',
    category: 'Property',
    title: 'Notice to Quit (Delta State)',
    description: 'Recovery of premises procedure — state-tagged.',
    jurisdiction: 'Delta State',
    court: 'Magistrate Court',
    content: `[DATE]

TO: [TENANT NAME]
ADDRESS: [ADDRESS]

TAKE NOTICE that you are required to quit and deliver up possession of the premises known as [ADDRESS] on or before [NOTICE PERIOD] months from service of this notice.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LANDLORD NAME]`
  },

  {
    id: 'corp5',
    category: 'Corporate',
    title: 'Special Resolution — Increase of Share Capital',
    description: 'Shareholders’ special resolution under CAMA 2020.',
    jurisdiction: 'Federal',
    content: `SPECIAL RESOLUTION OF [COMPANY NAME] LTD

IT WAS RESOLVED THAT the issued share capital of the Company be increased from [OLD CAPITAL] to [NEW CAPITAL] by the creation of [NUMBER] shares of [VALUE] each.

Directors are authorized to file necessary returns with the CAC.

__________________________
CHAIRMAN`
  },

  {
    id: 'prob3',
    category: 'Probate',
    title: 'Affidavit of Next of Kin',
    description: 'In support of Letters of Administration.',
    jurisdiction: 'Anambra State',
    court: 'High Court (Probate)',
    content: `I, [CLIENT NAME], of [ADDRESS], make Oath and say:

1. That I am the lawful next of kin of [DECEASED NAME].
2. That the deceased died intestate on [DATE].
3. That I undertake to administer the estate according to law.

SWORN TO at the Probate Registry, Anambra State this ...... day of ...... 20....

BEFORE ME
COMMISSIONER FOR OATHS`
  },

  {
    id: 'app3',
    category: 'Appellate',
    title: 'Notice of Appeal (Criminal)',
    description: 'Appeal against conviction/sentence.',
    jurisdiction: 'Lagos State',
    court: 'Court of Appeal, Lagos Division',
    content: `IN THE COURT OF APPEAL HOLDEN AT LAGOS

APPEAL NO: [SUIT NO]

BETWEEN:

[APPELLANT NAME]   ........................................   APPELLANT

AND

THE STATE   ........................................   RESPONDENT

NOTICE OF APPEAL (CRIMINAL)

Grounds include:
1. The learned trial judge erred in law in admitting [Evidence].
2. The sentence is manifestly excessive.

RELIEF: Allow the appeal and set aside the conviction/sentence.

DATED THIS ...... DAY OF ...... 20....

__________________________
COUNSEL`
  },

  {
    id: 'fam4',
    category: 'Family',
    title: 'Application for Maintenance',
    description: 'Application for maintenance of spouse/children.',
    jurisdiction: 'Ebonyi State',
    court: 'High Court',
    content: `MOTION ON NOTICE praying:

1. AN ORDER directing the Respondent to pay monthly maintenance of N[AMOUNT] for the minor children.
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

GROUNDS: [Facts]

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'nicn1',
    category: 'Corporate',
    title: 'General Form of Complaint (NICN)',
    description: 'Commencing employment dispute at NICN.',
    jurisdiction: 'Federal',
    court: 'National Industrial Court of Nigeria',
    content: `IN THE NATIONAL INDUSTRIAL COURT OF NIGERIA HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

BETWEEN:

[CLAIMANT NAME]   ........................................   CLAIMANT

AND

[DEFENDANT NAME]   ........................................   DEFENDANT

GENERAL FORM OF COMPLAINT

The Claimant’s claim against the Defendant is as follows:
1. Payment of outstanding salaries in the sum of N[AMOUNT].
2. Damages for wrongful termination.

DATED THIS ...... DAY OF ...... 20....

__________________________
REGISTRAR`
  },

  {
    id: 'fhc1',
    category: 'Civil Litigation',
    title: 'Fundamental Rights Application (FHC)',
    description: 'Enforcement of Fundamental Rights under FREP Rules.',
    jurisdiction: 'Federal',
    court: 'Federal High Court',
    content: `IN THE FEDERAL HIGH COURT HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

IN THE MATTER OF AN APPLICATION FOR THE ENFORCEMENT OF FUNDAMENTAL RIGHTS

BETWEEN:

[APPLICANT NAME]   ........................................   APPLICANT

AND

[RESPONDENT NAME]   ........................................   RESPONDENT

MOTION ON NOTICE and STATEMENT in support seeking:
1. DECLARATION that the arrest/detention of the Applicant is unlawful.
2. ORDER compelling the Respondent to release the Applicant forthwith.
3. DAMAGES in the sum of N[AMOUNT].

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'lit11',
    category: 'Civil Litigation',
    title: 'Notice of Discontinuance',
    description: 'Claimant discontinues suit.',
    jurisdiction: 'Edo State',
    court: 'High Court',
    content: `# [COURT]
# [DIVISION]
# HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

BETWEEN:

[PLAINTIFF NAME]   ........................................   CLAIMANT

AND

[DEFENDANT NAME]   ........................................   DEFENDANT

## NOTICE OF DISCONTINUANCE

TAKE NOTICE that the Claimant hereby wholly discontinues this suit against the Defendant.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'lit12',
    category: 'Civil Litigation',
    title: 'Subpoena ad Testificandum',
    description: 'Command to attend court to give evidence.',
    jurisdiction: 'Kwara State',
    court: 'High Court',
    content: `TO: [WITNESS NAME] of [ADDRESS]

YOU ARE HEREBY COMMANDED to attend before the High Court of Kwara State holden at [LOCATION] on the ...... day of ...... 20.... at [TIME] to testify in the above suit and to remain until you are discharged.

DATED THIS ...... DAY OF ...... 20....

__________________________
REGISTRAR`
  },

  {
    id: 'lit13',
    category: 'Civil Litigation',
    title: 'Subpoena Duces Tecum',
    description: 'Command to produce documents in court.',
    jurisdiction: 'Oyo State',
    court: 'High Court',
    content: `TO: [WITNESS NAME] of [ADDRESS]

YOU ARE HEREBY COMMANDED to bring with you and produce at the High Court holden at [LOCATION] on the ...... day of ...... 20.... the following documents: [DOCUMENTS].

DATED THIS ...... DAY OF ...... 20....

__________________________
REGISTRAR`
  },

  {
    id: 'lit14',
    category: 'Civil Litigation',
    title: 'Motion for Joinder of Parties',
    description: 'Application to join necessary parties.',
    jurisdiction: 'Ogun State',
    court: 'High Court',
    content: `MOTION ON NOTICE praying:

1. AN ORDER joining [PARTY NAME] as a necessary party to this suit.
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'lit15',
    category: 'Civil Litigation',
    title: 'Motion for Leave to Amend Pleadings',
    description: 'Application to amend processes.',
    jurisdiction: 'Ekiti State',
    court: 'High Court',
    content: `MOTION ON NOTICE praying:

1. AN ORDER granting leave to amend the Statement of Claim in terms of the Schedule annexed.
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'lit16',
    category: 'Civil Litigation',
    title: 'Notice of Change of Counsel',
    description: 'Formal notice substituting counsel on record.',
    jurisdiction: 'Kano State',
    court: 'High Court',
    content: `TAKE NOTICE that henceforth **[NEW FIRM NAME]** of [FIRM ADDRESS] will represent the **[PLAINTIFF/DEFENDANT]** in place of **[OLD FIRM NAME]** in this suit.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'prop8',
    category: 'Property',
    title: 'Commercial Tenancy Agreement (Lagos)',
    description: 'Lease for commercial use under Lagos law.',
    jurisdiction: 'Lagos State',
    court: 'High Court',
    content: `THIS COMMERCIAL TENANCY AGREEMENT is made this ...... day of ...... 20....

BETWEEN [LANDLORD NAME] and [TENANT NAME]

PREMISES: [Address]
RENT: N[AMOUNT] per annum
TERM: [Years] years commencing [DATE]
USE: Commercial purposes only

Key Terms:
1. Service Charge: N[AMOUNT].
2. Repairs and maintenance responsibilities.
3. Insurance obligations.
4. Termination: [Months] notice.

SIGNED:
LANDLORD ................................  TENANT ................................`
  },

  {
    id: 'crim3',
    category: 'Criminal',
    title: 'Information (Criminal — High Court)',
    description: 'Prosecutor’s information to commence criminal trial.',
    jurisdiction: 'Ogun State',
    court: 'High Court',
    content: `IN THE HIGH COURT OF OGUN STATE HOLDEN AT [LOCATION]

CHARGE/CASE NO: [SUIT NO]

THE STATE
v.
[DEFENDANT NAME]

INFORMATION

Count 1: That you, [DEFENDANT NAME], on [DATE] at [LOCATION], did [OFFENCE DESCRIPTION], contrary to and punishable under [SECTION/LAW].

DATED THIS ...... DAY OF ...... 20....

__________________________
DIRECTOR OF PUBLIC PROSECUTIONS`
  },

  {
    id: 'crim4',
    category: 'Criminal',
    title: 'Charge Sheet (Magistrate Court)',
    description: 'Charge before Magistrate.',
    jurisdiction: 'FCT, Abuja',
    court: 'Magistrate Court',
    content: `IN THE MAGISTRATE COURT OF THE FCT HOLDEN AT [LOCATION]

CHARGE NO: [SUIT NO]

THE COMMISSIONER OF POLICE
v.
[DEFENDANT NAME]

Charge: That you did [OFFENCE DESCRIPTION] contrary to [SECTION/LAW].`
  },

  {
    id: 'crim5',
    category: 'Criminal',
    title: 'Bail Bond',
    description: 'Bond by surety for the accused’s bail.',
    jurisdiction: 'Lagos State',
    court: 'Magistrate Court',
    content: `I, [SURETY NAME], of [ADDRESS], hereby undertake to be surety for [DEFENDANT NAME] admitted to bail in the sum of N[AMOUNT]. I shall ensure the Defendant attends court as required.

DATED THIS ...... DAY OF ...... 20....

__________________________
SURETY`
  },

  {
    id: 'prob4',
    category: 'Probate',
    title: 'Inventory of Estate Assets',
    description: 'List of assets filed in probate.',
    jurisdiction: 'Cross River State',
    court: 'High Court (Probate)',
    content: `INVENTORY OF ASSETS of the Estate of [DECEASED NAME]

1. Real Property: [ADDRESS]
2. Bank Accounts: [BANKS]
3. Motor Vehicles: [DETAILS]
4. Shares/Investments: [DETAILS]

DATED THIS ...... DAY OF ...... 20....

__________________________
EXECUTOR/ADMINISTRATOR`
  },

  {
    id: 'prob5',
    category: 'Probate',
    title: "Administrators' Bond",
    description: 'Bond undertaking proper administration of estate.',
    jurisdiction: 'Bayelsa State',
    court: 'High Court (Probate)',
    content: `We, [ADMINISTRATOR NAME] of [ADDRESS] and [SURETY NAME] of [ADDRESS], are jointly and severally bound unto the Probate Registrar in the sum of N[AMOUNT] for due administration of the estate of [DECEASED NAME].`
  },

  {
    id: 'prob6',
    category: 'Probate',
    title: 'Affidavit of Attesting Witness',
    description: 'Affidavit by witness to the Will.',
    jurisdiction: 'Akwa Ibom State',
    court: 'High Court (Probate)',
    content: `I, [WITNESS NAME], of [ADDRESS], state that I was present and saw [TESTATOR NAME] sign the Will dated [DATE] and that I signed as a witness in his/her presence.

SWORN TO at the Probate Registry, Akwa Ibom State this ...... day of ...... 20....

BEFORE ME
COMMISSIONER FOR OATHS`
  },

  {
    id: 'app4',
    category: 'Appellate',
    title: 'Motion for Stay of Execution',
    description: 'Stay of execution pending appeal.',
    jurisdiction: 'Enugu State',
    court: 'Court of Appeal, Enugu Division',
    content: `IN THE COURT OF APPEAL HOLDEN AT ENUGU

APPEAL NO: [SUIT NO]

MOTION ON NOTICE praying:
1. AN ORDER staying execution of the judgment delivered on [DATE] pending determination of the appeal.
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

DATED THIS ...... DAY OF ...... 20....

__________________________
COUNSEL`
  },

  {
    id: 'app5',
    category: 'Appellate',
    title: 'Notice of Cross Appeal',
    description: 'Respondent cross-appeals.',
    jurisdiction: 'Edo State',
    court: 'Court of Appeal, Benin Division',
    content: `IN THE COURT OF APPEAL HOLDEN AT BENIN

APPEAL NO: [SUIT NO]

NOTICE OF CROSS APPEAL

The Respondent cross-appeals against the judgment delivered on [DATE] on the following grounds: [GROUNDS].`
  },

  {
    id: 'fam5',
    category: 'Family',
    title: 'Petition for Dissolution of Marriage',
    description: 'Full petition under Matrimonial Causes Act.',
    jurisdiction: 'Imo State',
    court: 'High Court',
    content: `IN THE HIGH COURT OF IMO STATE HOLDEN AT [LOCATION]

SUIT NO: [SUIT NO]

BETWEEN:
[PLAINTIFF NAME]   ........................................   PETITIONER

AND
[DEFENDANT NAME]   ........................................   RESPONDENT

PETITION FOR DISSOLUTION OF MARRIAGE on grounds of irretrievable breakdown per Section 15 MCA.

RELIEFS: Decree Nisi; Custody; Maintenance.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'fam6',
    category: 'Family',
    title: 'Consent Terms',
    description: 'Agreed terms filed by parties.',
    jurisdiction: 'Osun State',
    court: 'High Court',
    content: `The parties hereby agree to the following consent terms:
1. Custody to the Petitioner.
2. Maintenance of N[AMOUNT] monthly.
3. Access arrangements as follows: [DETAILS].

DATED THIS ...... DAY OF ...... 20....

__________________________
PARTIES`
  },

  {
    id: 'nicn2',
    category: 'Corporate',
    title: 'Motion on Notice (NICN)',
    description: 'Interlocutory application at NICN.',
    jurisdiction: 'Federal',
    court: 'National Industrial Court of Nigeria, Lagos',
    content: `MOTION ON NOTICE praying:
1. AN ORDER directing payment of outstanding salaries.
2. AND FOR SUCH FURTHER ORDER(S) as the Court may deem fit.

DATED THIS ...... DAY OF ...... 20....

__________________________
[LAWYER NAME]`
  },

  {
    id: 'nicn3',
    category: 'Corporate',
    title: 'Statement of Facts (NICN)',
    description: 'Employee’s concise statement of facts in support of complaint.',
    jurisdiction: 'Federal',
    court: 'National Industrial Court of Nigeria, Port Harcourt',
    content: `STATEMENT OF FACTS

1. The Claimant was employed on [DATE] as [POSITION].
2. The Defendant terminated employment on [DATE] without due process.
3. The Claimant is owed salaries of N[AMOUNT].

RELIEFS: As per Complaint.`
  },

  {
    id: 'sc1',
    category: 'Appellate',
    title: 'Notice of Appeal (Supreme Court)',
    description: 'Appeal to the Supreme Court of Nigeria.',
    jurisdiction: 'Federal',
    court: 'Supreme Court of Nigeria',
    content: `IN THE SUPREME COURT OF NIGERIA HOLDEN AT ABUJA

SC. [NUMBER]

BETWEEN:

[APPELLANT NAME]   ........................................   APPELLANT

AND

[RESPONDENT NAME]   ........................................   RESPONDENT

NOTICE OF APPEAL against the judgment of the Court of Appeal delivered on [DATE] on the grounds: [GROUNDS].

DATED THIS ...... DAY OF ...... 20....

__________________________
COUNSEL`
  }
];

export const Precedents: React.FC<PrecedentsProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingTemplate, setViewingTemplate] = useState<Template | null>(null);
  const [copied, setCopied] = useState(false);
  const { saveDocumentToCase, cases, setActiveDoc } = useLegalStore();
  const [showUseModal, setShowUseModal] = useState(false);
  const [useCaseId, setUseCaseId] = useState('');
  const [useTitle, setUseTitle] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('All');
  const [selectedCourt, setSelectedCourt] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(TEMPLATES.map(t => t.category)))];
  const jurisdictions = ['All', ...Array.from(new Set(TEMPLATES.map(t => t.jurisdiction).filter(Boolean))) as string[]];
  const courts = ['All', ...Array.from(new Set(TEMPLATES.map(t => t.court).filter(Boolean))) as string[]];

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJurisdiction = (selectedJurisdiction === 'All') || (t.jurisdiction === selectedJurisdiction);
    const matchesCourt = (selectedCourt === 'All') || (t.court === selectedCourt);
    return matchesCategory && matchesSearch && matchesJurisdiction && matchesCourt;
  });

  const handleCopy = () => {
    if (viewingTemplate) {
      navigator.clipboard.writeText(viewingTemplate.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUseTemplate = () => {
    if (!viewingTemplate) return;
    setUseTitle(`${viewingTemplate.title} - Draft`);
    setShowUseModal(true);
  };

  const confirmUseTemplate = () => {
    if (!viewingTemplate || !useCaseId || !useTitle) return;
    const newDocId = Date.now().toString();
    saveDocumentToCase(useCaseId, {
      id: newDocId,
      title: useTitle,
      content: viewingTemplate.content,
      type: 'Draft',
      createdAt: new Date()
    });
    setActiveDoc({ caseId: useCaseId, docId: newDocId });
    setShowUseModal(false);
    onNavigate(AppView.EDITOR);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-screen flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-legal-900">Precedents Library</h2>
          <p className="text-gray-600 mt-2">Professional legal templates and court forms.</p>
        </div>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Sidebar Categories */}
        <div className="w-64 flex-shrink-0 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit">
          <h3 className="font-semibold text-gray-700 mb-4 px-2">Categories</h3>
          <div className="space-y-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-legal-50 text-legal-900 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="mt-6 space-y-2">
            <label className="block text-xs font-semibold text-gray-500 px-2">Jurisdiction</label>
            <select
              className="w-full border border-gray-300 p-2 rounded"
              value={selectedJurisdiction}
              onChange={e => setSelectedJurisdiction(e.target.value)}
            >
              {jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
            <label className="block text-xs font-semibold text-gray-500 px-2 mt-2">Court</label>
            <select
              className="w-full border border-gray-300 p-2 rounded"
              value={selectedCourt}
              onChange={e => setSelectedCourt(e.target.value)}
            >
              {courts.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legal-gold focus:border-transparent"
            />
          </div>

          {!viewingTemplate ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 pb-4">
              {filteredTemplates.length === 0 && (
                <div className="col-span-2 text-center text-sm text-gray-500 py-12">
                  No templates match your filters. Try another category or search term.
                </div>
              )}
              {filteredTemplates.map(template => (
                <div 
                  key={template.id}
                  onClick={() => setViewingTemplate(template)}
                  className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:border-legal-gold cursor-pointer transition-all hover:shadow-md group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                      {template.category}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-legal-gold" />
                  </div>
                  <h3 className="font-serif font-bold text-legal-900 mb-2">{template.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{template.description}</p>
                  {(template.jurisdiction || template.court) && (
                    <div className="mt-3 flex gap-2">
                      {template.jurisdiction && (
                        <span className="px-2 py-0.5 text-xs bg-legal-50 text-legal-800 border border-legal-200 rounded">{template.jurisdiction}</span>
                      )}
                      {template.court && (
                        <span className="px-2 py-0.5 text-xs bg-gray-50 text-gray-700 border border-gray-200 rounded">{template.court}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div>
                  <button 
                    onClick={() => setViewingTemplate(null)}
                    className="text-sm text-gray-500 hover:text-legal-900 mb-1 hover:underline"
                  >
                    ← Back to Library
                  </button>
                  <h3 className="font-serif font-bold text-legal-900">{viewingTemplate.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {copied ? <Shield className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy Text'}
                  </button>
                  <button
                    onClick={handleUseTemplate}
                    className="flex items-center gap-2 px-3 py-1.5 bg-legal-900 text-white rounded text-sm font-medium hover:bg-legal-800"
                  >
                    <FileSignature className="w-4 h-4" />
                    Use in Editor
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                <div className="max-w-3xl mx-auto bg-white p-12 shadow-sm min-h-full">
                  {(viewingTemplate.jurisdiction || viewingTemplate.court) && (
                    <div className="mb-4 flex gap-2">
                      {viewingTemplate.jurisdiction && (
                        <span className="px-2 py-0.5 text-xs bg-legal-50 text-legal-800 border border-legal-200 rounded">{viewingTemplate.jurisdiction}</span>
                      )}
                      {viewingTemplate.court && (
                        <span className="px-2 py-0.5 text-xs bg-gray-50 text-gray-700 border border-gray-200 rounded">{viewingTemplate.court}</span>
                      )}
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
                    {viewingTemplate.content}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showUseModal && viewingTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-legal-900">Use in Document Editor</h3>
              <button onClick={() => setShowUseModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Matter</label>
                <select 
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none"
                  value={useCaseId}
                  onChange={e => setUseCaseId(e.target.value)}
                >
                  <option value="">-- Choose Case --</option>
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
                {cases.length === 0 && <p className="text-xs text-red-500 mt-1">No active cases found. Create a case first.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                <input 
                  type="text"
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-legal-gold outline-none"
                  value={useTitle}
                  onChange={e => setUseTitle(e.target.value)}
                  placeholder={`e.g. ${viewingTemplate.title} - Draft 1`}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowUseModal(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100">Cancel</button>
                <button 
                  onClick={confirmUseTemplate}
                  disabled={!useCaseId || !useTitle}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-legal-900 rounded-lg hover:bg-legal-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
