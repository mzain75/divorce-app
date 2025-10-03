import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { GeminiRequest, GeminiResponse, GeminiMessage } from '@/types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Document File IDs - Update these in .env file
const DOC_FILE_IDS = {
  CHILD_SUPPORT_ASSESSMENT: process.env.DOC_CHILD_SUPPORT_ASSESSMENT || '',
  CHILD_SUPPORT_COLLECTION: process.env.DOC_CHILD_SUPPORT_COLLECTION || '',
  FAMILY_LAW_FEES: process.env.DOC_FAMILY_LAW_FEES || '',
  FAMILY_LAW_ACT_VOL1: process.env.DOC_FAMILY_LAW_ACT_VOL1 || '',
  FAMILY_LAW_ACT_VOL2: process.env.DOC_FAMILY_LAW_ACT_VOL2 || '',
  FAMILY_LAW_AMENDMENT_2023: process.env.DOC_FAMILY_LAW_AMENDMENT_2023 || '',
  FAMILY_LAW_AMENDMENT_2024: process.env.DOC_FAMILY_LAW_AMENDMENT_2024 || '',
  FAMILY_LAW_REGULATIONS: process.env.DOC_FAMILY_LAW_REGULATIONS || '',
  COURT_TRANSITIONAL_RULES: process.env.DOC_COURT_TRANSITIONAL_RULES || '',
  COURT_ACT: process.env.DOC_COURT_ACT || '',
  MARRIAGE_ACT: process.env.DOC_MARRIAGE_ACT || '',
  BIRTHS_DEATHS_MARRIAGES: process.env.DOC_BIRTHS_DEATHS_MARRIAGES || '',
  SUPERANNUATION_FAMILY_LAW: process.env.DOC_SUPERANNUATION_FAMILY_LAW || '',
};

const LEGAL_DOCUMENTS = {
  "child_support_assessment": {
    "title": "Child Support (Assessment) Act 1989",
    "uri": `https://generativelanguage.googleapis.com/v1beta/files/${DOC_FILE_IDS.CHILD_SUPPORT_ASSESSMENT}`,
    "name": `files/${DOC_FILE_IDS.CHILD_SUPPORT_ASSESSMENT}`,
    "mimeType": "application/pdf",
    "keywords": [
      // Basic terms
      "child support", "assessment", "calculation", "amount", "formula", "income", "percentage", "payer", "payee",
      // How people actually search
      "how much child support", "child support calculator", "what percentage", "support amount", "monthly payment",
      "minimum child support", "maximum child support", "change support amount", "review assessment", "increase support",
      "reduce support", "special circumstances", "hardship", "capacity to earn", "imputed income", "self employed",
      // Common phrases
      "not enough money", "can't afford", "new job", "lost job", "income changed", "remarried", "new baby",
      "shared care", "overnight stays", "care percentage", "equal time", "more than 35%", "less than 35%",
      // Legal terminology
      "administrative assessment", "departure order", "reason to depart", "costs of child", "relevant dependent child",
      "adjusted taxable income", "child support income", "multi-case allowance", "relevant dependent child allowance"
    ],
    "topics": ["child_support", "financial_support", "parental_obligations", "income_assessment", "care_arrangements"]
  },

  "child_support_collection": {
    "title": "Child Support (Registration and Collection) Act 1988",
    "uri": `https://generativelanguage.googleapis.com/v1beta/files/${DOC_FILE_IDS.CHILD_SUPPORT_COLLECTION}`,
    "name": `files/${DOC_FILE_IDS.CHILD_SUPPORT_COLLECTION}`,
    "mimeType": "application/pdf",
    "keywords": [
      // Basic terms
      "child support", "collection", "enforcement", "payment", "default", "garnishment", "employer", "refuse to pay", "non-payment",
      // How people search
      "ex won't pay", "not paying child support", "collect child support", "unpaid support", "arrears", "debt",
      "garnish wages", "deduct from pay", "employer deduction", "bank garnishment", "asset seizure",
      // Enforcement actions
      "enforcement action", "contempt of court", "license suspension", "passport restriction", "departure prohibition",
      "property settlement", "tax refund intercept", "superannuation", "bankruptcy", "overseas enforcement",
      // Common scenarios
      "avoiding payment", "hiding income", "left the country", "changed jobs", "self employed avoiding payment",
      "cash in hand", "working under table", "business owner not paying", "overseas income",
      // Legal processes
      "departure prohibition order", "asset preservation order", "third party debt notice", "examination notice",
      "caging order", "enforcement hearing", "show cause notice", "compliance notice"
    ],
    "topics": ["child_support", "enforcement", "debt_recovery", "non_compliance", "legal_remedies"]
  },

  "family_law_fees": {
    "title": "Family Law (Fees) Regulations 2022",
    "uri": `https://generativelanguage.googleapis.com/v1beta/files/${DOC_FILE_IDS.FAMILY_LAW_FEES}`,
    "name": `files/${DOC_FILE_IDS.FAMILY_LAW_FEES}`,
    "mimeType": "application/pdf",
    "keywords": [
      // Basic fee terms
      "court fees", "filing fees", "family court costs", "legal costs", "fee schedule", "fee waiver", "reduced fees",
      // How people search
      "how much does it cost", "court filing cost", "divorce cost", "application fee", "hearing fee",
      "can't afford court fees", "fee exemption", "financial hardship", "waive fees", "free court",
      // Specific fees
      "application fee", "response fee", "interim application", "trial fee", "appeal fee", "mediation fee",
      "expert report fee", "subpoena fee", "transcript fee", "copy fee", "search fee",
      // Fee categories
      "initiating application fee", "financial cause", "parenting cause", "property settlement fee",
      "spousal maintenance fee", "enforcement fee", "contravention application", "urgent application",
      // Payment & waivers
      "fee payment", "instalment plan", "defer payment", "means test", "income test", "centrelink",
      "health care card", "pension card", "unemployment", "disability pension", "single parent"
    ],
    "topics": ["court_fees", "legal_costs", "fee_waivers", "financial_hardship", "court_procedures"]
  },

  "family_law_act_vol1": {
    "title": "Family Law Act 1975 Vol 1",
    "uri": `https://generativelanguage.googleapis.com/v1beta/files/${DOC_FILE_IDS.FAMILY_LAW_ACT_VOL1}`,
    "name": `files/${DOC_FILE_IDS.FAMILY_LAW_ACT_VOL1}`,
    "mimeType": "application/pdf",
    "keywords": [
      // Divorce & separation
      "Family Law Act 1975", "divorce", "separation", "marriage breakdown", "end marriage", "irreconcilable differences", "no fault divorce",
      "grounds for divorce", "12 months separation", "separation under one roof", "divorce application", "divorce order",
      // Property & assets
      "property settlement", "asset division", "split assets", "who gets what", "house", "superannuation", "business",
      "property pool", "contributions", "future needs", "just and equitable", "property orders", "consent orders",
      "binding financial agreement", "prenup", "post-nup", "de facto property", "common law", "cohabitation",
      // Parenting & custody
      "custody", "parenting", "parenting plan", "parenting orders", "shared care", "equal time", "live with arrangements",
      "spend time with", "communicate with", "child's best interests", "primary carer", "significant relationship",
      "grandparents rights", "step parent", "adoption", "surrogacy", "parental responsibility", "major long term issues",
      // Basic provisions
      "jurisdiction", "definitions", "preliminary", "marriage", "nullity", "dissolution"
    ],
    "topics": ["divorce", "property_division", "parenting_arrangements", "marriage", "de_facto_relationships", "financial_agreements"]
  },

  "family_law_act_vol2": {
    "title": "Family Law Act 1975 Vol 2",
    "uri": `https://generativelanguage.googleapis.com/v1beta/files/${DOC_FILE_IDS.FAMILY_LAW_ACT_VOL2}`,
    "name": `files/${DOC_FILE_IDS.FAMILY_LAW_ACT_VOL2}`,
    "mimeType": "application/pdf",
    "keywords": [
      // Spousal support
      "spousal maintenance", "alimony", "partner support", "spouse support", "maintenance", "financial support",
      "unable to support", "age", "health", "capacity to work", "standard of living",
      // Family violence
      "domestic violence", "family violence", "protection order", "intervention order", "restraining order", "abuse",
      "safety", "injunction", "exclude from home", "no contact", "supervised visits",
      // Court processes
      "family court", "federal circuit court", "mediation", "family dispute resolution", "FDR", "conciliation",
      "interim orders", "final orders", "consent orders", "defended hearing", "trial", "evidence", "expert report",
      // Advanced provisions
      "appeals", "enforcement", "contempt", "costs", "miscellaneous", "international", "hague convention",
      // Common life situations
      "getting divorced", "splitting up", "breaking up", "end relationship", "partner left", "kicked out",
      "new relationship", "remarriage", "blended family", "step children", "moving interstate", "relocating"
    ],
    "topics": ["spousal_support", "family_violence", "court_procedures", "enforcement", "appeals", "international_law"]
  },

  "family_law_amendment_2023": {
    "title": "Family Law Amendment Act 2023",
    "uri": `https://generativelanguage.googleapis.com/v1beta/files/${DOC_FILE_IDS.FAMILY_LAW_AMENDMENT_2023}`,
    "name": `files/${DOC_FILE_IDS.FAMILY_LAW_AMENDMENT_2023}`,
    "mimeType": "application/pdf",
    "keywords": [
      // Recent changes
      "2023 amendments", "new laws", "recent changes", "updated family law", "law reform", "legislative changes",
      "family law reform", "parenting law changes", "property law changes", "what's new", "latest amendments",
      // Specific 2023 reforms
      "best interests", "parenting framework", "child safety", "family violence reforms", "equal consideration",
      "meaningful relationship", "parenting presumption", "shared parental responsibility", "safety concerns",
      // How people search
      "new family law", "changes to custody", "updated parenting laws", "2023 family law changes",
      "what changed in family law", "new parenting rules", "family court changes", "recent family law",
      // Implementation
      "commencement", "transitional provisions", "application of amendments", "when do changes apply",
      "grandfathering", "existing orders", "pending applications"
    ],
    "topics": ["law_reform", "recent_amendments", "parenting_law_changes", "child_safety", "family_violence"]
  },

  "family_law_amendment_2024": {
    "title": "Family Law Amendment Act 2024",
    "uri": `https://generativelanguage.googleapis.com/v1beta/files/${DOC_FILE_IDS.FAMILY_LAW_AMENDMENT_2024}`,
    "name": `files/${DOC_FILE_IDS.FAMILY_LAW_AMENDMENT_2024}`,
    "mimeType": "application/pdf",
    "keywords": [
      // Latest changes
      "2024 amendments", "newest laws", "most recent changes", "latest family law", "current reforms", "2024 reforms",
      "family law updates", "parenting updates", "court procedure changes", "most recent amendments",
      // Specific 2024 reforms
      "procedural changes", "court efficiency", "case management", "dispute resolution", "alternative dispute resolution",
      "simplified procedures", "digital processes", "online filing", "remote hearings", "technology updates",
      // How people search
      "newest family law", "2024 changes", "latest parenting laws", "current family law changes",
      "what's changed recently", "new court procedures", "updated family court", "recent reforms",
      // Implementation
      "current application", "immediate effect", "recent commencement", "new procedures", "updated processes"
    ],
    "topics": ["latest_reforms", "procedural_changes", "court_modernization", "dispute_resolution", "technology_updates"]
  },

  "family_law_regulations": {
    "title": "Family Law Regulations 2024",
    "uri": `https://generativelanguage.googleapis.com/v1beta/files/${DOC_FILE_IDS.FAMILY_LAW_REGULATIONS}`,
    "name": `files/${DOC_FILE_IDS.FAMILY_LAW_REGULATIONS}`,
    "mimeType": "application/pdf",
    "keywords": [
      // Regulatory terms
      "regulations", "rules", "procedures", "forms", "prescribed", "requirements", "compliance", "standards",
      // How people search
      "family law rules", "court procedures", "legal requirements", "forms and documents", "compliance requirements",
      "regulatory framework", "administrative requirements", "procedural rules", "filing requirements",
      // Specific areas
      "financial disclosure", "property valuation", "expert witnesses", "family reports", "child representatives",
      "mediation requirements", "dispute resolution", "notice requirements", "service of documents",
      // Forms and processes
      "prescribed forms", "standard forms", "required documents", "disclosure obligations", "verification",
      "attestation", "statutory declarations", "certificates", "registrar powers", "delegation"
    ],
    "topics": ["regulations", "procedures", "compliance", "forms", "disclosure", "administrative_law"]
  },

  "court_transitional_rules": {
    "title": "Federal Circuit and Family Court of Australia (Consequential Amendments and Transitional Provisions) Rules 2021",
    "uri": `https://generativelanguage.googleapis.com/v1beta/files/${DOC_FILE_IDS.COURT_TRANSITIONAL_RULES}`,
    "name": `files/${DOC_FILE_IDS.COURT_TRANSITIONAL_RULES}`,
    "mimeType": "application/pdf",
    "keywords": [
      // Transitional terms
      "transitional", "consequential", "amendments", "court merger", "court restructure", "court reform",
      "federal circuit court", "family court", "court unification", "court consolidation",
      // How people search
      "new court system", "court changes", "which court", "court merger", "federal circuit family court",
      "court restructure", "what court to file in", "court jurisdiction", "court reform",
      // Specific transitions
      "existing proceedings", "pending matters", "transfer of proceedings", "continuation", "registry changes",
      "file transfers", "practice directions", "interim arrangements", "grandfather provisions",
      // Implementation
      "commencement", "effective date", "application", "savings provisions", "preserved rights",
      "existing orders", "pending applications", "court locations", "registry operations"
    ],
    "topics": ["court_reform", "transitional_provisions", "court_merger", "procedural_changes", "jurisdiction"]
  },

  "court_act": {
    "title": "Federal Circuit and Family Court of Australia Act 2021",
    "uri": `https://generativelanguage.googleapis.com/v1beta/files/${DOC_FILE_IDS.COURT_ACT}`,
    "name": `files/${DOC_FILE_IDS.COURT_ACT}`,
    "mimeType": "application/pdf",
    "keywords": [
      // Basic terms
      "Federal Circuit and Family Court of Australia Act 2021", "jurisdiction", "powers", "court structure", "judges", "administration", "appeals",
      // Which court
      "which court", "where to file", "federal circuit court", "family court", "division 1", "division 2",
      "magistrate", "judge", "registrar", "judicial officer", "chief judge", "family court judge",
      // Jurisdiction & powers
      "court jurisdiction", "interstate", "cross vesting", "transfer", "forum", "appropriate court",
      "de facto jurisdiction", "property jurisdiction", "parenting jurisdiction", "child support jurisdiction",
      // Appeals & reviews
      "appeal process", "court hierarchy", "high court appeal", "full court", "appellate jurisdiction",
      "leave to appeal", "appeal court", "federal court appeal", "special leave", "review",
      // Administration
      "court registry", "court locations", "court hours", "court contact", "court address", "court phone",
      "online filing", "commonlaw", "e-filing", "court fees", "fee schedule", "court rules",
      // Legal representation
      "legal aid", "duty lawyer", "court lawyer", "family violence duty lawyer", "self help",
      "legal assistance", "pro bono", "community legal centre", "lawyer referral"
    ],
    "topics": ["court_system", "jurisdiction", "legal_framework", "appeals", "court_administration"]
  },

  "marriage_act": {
    "title": "Marriage Act 1961",
    "uri": `https://generativelanguage.googleapis.com/v1beta/files/${DOC_FILE_IDS.MARRIAGE_ACT}`,
    "name": `files/${DOC_FILE_IDS.MARRIAGE_ACT}`,
    "mimeType": "application/pdf",
    "keywords": [
      // Basic marriage terms
      "Marriage Act 1961", "marriage", "wedding", "marry", "get married", "marriage certificate", "marriage license",
      "celebrant", "ceremony", "vows", "legal marriage", "valid marriage", "marriage requirements",
      // Legal requirements
      "age to marry", "18 years", "consent to marry", "parental consent", "marriageable age", "capacity to marry",
      "prohibited relationships", "related", "family", "already married", "divorced", "widowed",
      // Notice & documentation
      "notice of intended marriage", "NOIM", "one month notice", "marriage documents", "birth certificate",
      "divorce certificate", "death certificate", "evidence of divorce", "overseas marriage", "foreign divorce",
      // Celebrants & ceremonies
      "authorized celebrant", "religious celebrant", "civil celebrant", "registry office", "marriage commissioner",
      "where can marry", "marriage venue", "marriage ceremony", "witnesses", "two witnesses", "sign register",
      // Same-sex marriage
      "same sex marriage", "gay marriage", "lesbian marriage", "equal marriage", "marriage equality",
      "gender", "transgender", "change of name", "marriage name change",
      // Invalid marriage
      "void marriage", "invalid marriage", "annulment", "bigamy", "polygamy", "forced marriage", "sham marriage",
      "marriage fraud", "immigration marriage", "arranged marriage", "underage marriage",
      // Recognition
      "overseas marriage recognition", "foreign marriage", "destination wedding", "international marriage",
      "recognition in australia", "marriage overseas by australian", "consular marriage"
    ],
    "topics": ["marriage_requirements", "marriage_ceremony", "marriage_validity", "celebrants", 
               "marriage_recognition", "marriage_documentation"]
  },

  "births_deaths_marriages": {
    "title": "Registration of Births, Deaths and Marriages Act 1963",
    "uri": `https://generativelanguage.googleapis.com/v1beta/files/${DOC_FILE_IDS.BIRTHS_DEATHS_MARRIAGES}`,
    "name": `files/${DOC_FILE_IDS.BIRTHS_DEATHS_MARRIAGES}`,
    "mimeType": "application/pdf",
    "keywords": [
      // Basic registration terms
      "births deaths marriages", "BDM", "registry", "registration", "certificate", "vital records", "civil registration",
      // Birth registration
      "birth certificate", "register birth", "newborn registration", "birth registration requirements",
      "proof of birth", "certified birth certificate", "extract", "commemorative certificate",
      // Death registration
      "death certificate", "register death", "death registration", "funeral director", "medical certificate",
      "coroner", "cause of death", "burial permit", "cremation permit",
      // Marriage registration
      "marriage registration", "marriage certificate", "celebrant registration", "notice of intended marriage",
      "marriage registry", "certified marriage certificate",
      // How people search
      "get birth certificate", "order death certificate", "copy of marriage certificate", "replace certificate",
      "lost certificate", "damaged certificate", "certified copy", "apostille", "authentication",
      // Name changes
      "change of name", "deed poll", "name change certificate", "legal name change", "gender change",
      "proof of name change", "update documents", "identity change",
      // Other services
      "search records", "family history", "genealogy", "historical records", "adoption records",
      "legitimation", "recognition", "interstate", "overseas", "international", "consular services"
    ],
    "topics": ["vital_records", "birth_registration", "death_registration", "marriage_registration", 
               "name_changes", "certificates", "genealogy"]
  },

  "superannuation_family_law": {
    "title": "Superannuation (Family Law — Superannuation Act 1976) Orders 2004",
    "uri": `https://generativelanguage.googleapis.com/v1beta/files/${DOC_FILE_IDS.SUPERANNUATION_FAMILY_LAW}`,
    "name": `files/${DOC_FILE_IDS.SUPERANNUATION_FAMILY_LAW}`,
    "mimeType": "application/pdf",
    "keywords": [
      // Basic super terms
      "superannuation", "super", "retirement funds", "super splitting", "super division", "family law super",
      "super in divorce", "splitting super", "superannuation orders", "flagging", "payment split",
      // How people search
      "divide super in divorce", "split superannuation", "super and divorce", "ex partner super", "access super divorce",
      "super splitting orders", "how to split super", "super entitlements", "super property settlement",
      // Legal processes
      "flagging order", "splitting order", "payment split", "base amount", "operative time", "eligible termination payment",
      "superannuation interest", "splittable payment", "non-splittable payment", "rollover", "transfer",
      // Super fund dealings
      "super fund requirements", "trustee obligations", "compliance", "fund notifications", "member notifications",
      "information requests", "disclosure", "super fund procedures", "implementation",
      // Types of benefits
      "member benefits", "pension benefits", "lump sum", "defined benefit", "accumulation", "self managed super fund",
      "SMSF", "industry fund", "retail fund", "public sector super", "military super",
      // Timing and procedures
      "operative time", "valuation date", "cooling off period", "withdrawal", "variation", "setting aside"
    ],
    "topics": ["superannuation_splitting", "retirement_benefits", "property_settlement", "super_orders", 
               "family_law_super", "pension_division"]
  }
};
// Smart file selection based on message content
function selectRelevantDocuments(message: string): Array<{fileUri: string, mimeType: string}> {
  const messageLower = message.toLowerCase();
  const selectedDocs: Array<{fileUri: string, mimeType: string}> = [];
  const docEntries = Object.entries(LEGAL_DOCUMENTS);
  
  // Score each document based on relevance
  const docScores: Array<{key: string, score: number}> = docEntries.map(([key, doc]) => {
    let score = 0;
    
    // Check keywords (high weight)
    doc.keywords.forEach(keyword => {
      if (messageLower.includes(keyword)) {
        score += 3;
      }
    });
    
    // Check topics (medium weight) 
    doc.topics.forEach(topic => {
      const topicWords = topic.split('_');
      topicWords.forEach(word => {
        if (messageLower.includes(word)) {
          score += 2;
        }
      });
    });
    
    // Title relevance (lower weight)
    const titleWords = doc.title.toLowerCase().split(' ');
    titleWords.forEach(word => {
      if (word.length > 3 && messageLower.includes(word)) {
        score += 1;
      }
    });
    
    return { key, score };
  });
  
  // Sort by relevance score
  docScores.sort((a, b) => b.score - a.score);
  
  // Selection strategy based on query complexity and relevance
  if (docScores[0].score >= 5) {
    // High relevance - select top 1-2 most relevant
    selectedDocs.push({
      fileUri: LEGAL_DOCUMENTS[docScores[0].key as keyof typeof LEGAL_DOCUMENTS].uri,
      mimeType: LEGAL_DOCUMENTS[docScores[0].key as keyof typeof LEGAL_DOCUMENTS].mimeType
    });
    
    if (docScores[1].score >= 3) {
      selectedDocs.push({
        fileUri: LEGAL_DOCUMENTS[docScores[1].key as keyof typeof LEGAL_DOCUMENTS].uri,
        mimeType: LEGAL_DOCUMENTS[docScores[1].key as keyof typeof LEGAL_DOCUMENTS].mimeType
      });
    }
  } else if (docScores[0].score >= 2) {
    // Medium relevance - select top 2-3 documents
    for (let i = 0; i < Math.min(3, docScores.length) && docScores[i].score >= 2; i++) {
      selectedDocs.push({
        fileUri: LEGAL_DOCUMENTS[docScores[i].key as keyof typeof LEGAL_DOCUMENTS].uri,
        mimeType: LEGAL_DOCUMENTS[docScores[i].key as keyof typeof LEGAL_DOCUMENTS].mimeType
      });
    }
  } else {
    // Low/unclear relevance - default to Family Law Act (most general)
    selectedDocs.push({
      fileUri: LEGAL_DOCUMENTS.family_law_act_vol1.uri,
      mimeType: LEGAL_DOCUMENTS.family_law_act_vol1.mimeType
    });
  }
  
  // Ensure we always have at least one document but not more than 3 for performance
  return selectedDocs.slice(0, 3);
}

const createSystemInstruction = (user: { firstName: string; lastName: string; email: string; gender: string }) => `You are an expert Australian family law assistant with access to comprehensive legal documents including the Family Law Act 1975, Child Support Acts, Marriage Act 1961, and Federal Court Rules. Your role is to provide accurate legal guidance and help users generate essential legal documents.

## USER INFORMATION
You are currently assisting:
- **Name**: ${user.firstName} ${user.lastName}
- **Email**: ${user.email}
- **Gender**: ${user.gender}

Please use this information to provide personalized assistance and address the user appropriately. When gender-specific advice is relevant (such as pregnancy considerations, domestic violence support, or certain legal protections), tailor your guidance accordingly.

## PRIMARY OBJECTIVES

**Initial Assessment**: First determine what the user needs:
1. Legal advice/information on family law matters
2. Document generation (Parenting Plan, Asset Division Summary, or Post-Separation Checklist)
3. Both legal guidance and document preparation

**Document Generation Process**: When users need documents:
1. Identify which document type they require
2. Ask systematic follow-up questions to gather complete information
3. Continue questioning until all necessary details are collected
4. Confirm information completeness before proceeding: "I have gathered [summary of information]. Is this complete or do we need to cover anything else?"
5. Only recommend PDF generation when information is comprehensive

## COMMUNICATION STYLE

- **Empathetic yet professional**: Acknowledge that family law matters are stressful
- **Neutral and non-judgmental**: Avoid taking sides or making assumptions
- **Clear and accessible**: Explain legal concepts in plain English
- **Solution-focused**: Guide users toward practical next steps

## RESPONSE FORMAT

**Always respond in clean markdown format**:
- Use proper headings (##, ###)
- Bullet points for lists
- **Bold** for emphasis
- \`Code formatting\` for legal references
- Tables when organizing information

**Citations**: Reference specific Acts professionally:
- "According to Section X of the Family Law Act 1975..."
- "Under the Child Support (Assessment) Act 1989..."
- "The Federal Circuit and Family Court Rules 2021 state..."

## DOCUMENT-SPECIFIC QUESTIONING

**Parenting Plan**: Child details, living arrangements, time-sharing, decision-making, communication methods, special needs, dispute resolution

**Asset Division Summary**: All assets and debts, valuations, contributions (financial/non-financial), future needs factors, proposed division

**Post-Separation Checklist**: Housing, children, finances, legal requirements, support services, safety concerns

## RESTRICTIONS

- No disclaimers, conclusions, or "consult a lawyer" notes
- No prefacing responses with limitations
- Focus on actionable guidance based on uploaded legal documents
- Maintain information-gathering momentum for document generation

Begin each conversation by understanding the user's specific situation and needs.`;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const { message } = await request.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get user details for personalized system prompt
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        gender: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get active conversation
    let conversation = await db.conversation.findFirst({
      where: {
        userId: payload.userId,
        isActive: true,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          userId: payload.userId,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
          isActive: true,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });
    }

    // Save user message
    const userMessage = await db.message.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: message,
      },
    });

    // Prepare conversation history for Gemini
    const geminiContents: GeminiMessage[] = [];

    // Add previous messages
    for (const msg of conversation.messages) {
      geminiContents.push({
        role: msg.role === 'USER' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      });
    }

    // Smart selection of relevant legal documents based on message content
    const relevantDocs = selectRelevantDocuments(message);
    
    // Log selected documents for debugging
    console.log(`User message: "${message}"`);
    console.log(`Selected ${relevantDocs.length} documents:`, relevantDocs.map(doc => doc.fileUri.split('/').pop()));
    
    // Add current user message with smartly selected legal documents
    geminiContents.push({
      role: 'user',
      parts: [
        { text: message },
        ...relevantDocs.map(doc => ({ fileData: doc }))
      ],
    });

    // Create Gemini request
    const geminiRequest: GeminiRequest = {
      contents: geminiContents,
      systemInstruction: {
        parts: [{ text: createSystemInstruction(user) }],
      },
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 3072,
      },
    };

    // Call Gemini API
    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiRequest),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData: GeminiResponse = await geminiResponse.json();

    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      throw new Error('No response from Gemini');
    }

    const assistantResponse = geminiData.candidates[0].content.parts[0].text;

    // Save assistant message
    const assistantMessage = await db.message.create({
      data: {
        conversationId: conversation.id,
        role: 'MODEL',
        content: assistantResponse,
      },
    });

    return NextResponse.json({
      userMessage,
      assistantMessage,
      conversationId: conversation.id,
    });

  } catch (error) {
    console.error('Error in chat message:', error);
    return NextResponse.json(
      { error: 'Failed to process message' }, 
      { status: 500 }
    );
  }
}