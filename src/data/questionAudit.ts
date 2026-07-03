import type {
  ExamLikelihood,
  Question,
  SourceType,
  StudyGuide,
} from "../types";

type AuditableQuestion = Omit<Question, "examLikelihood" | "sourceType"> &
  Partial<Pick<Question, "examLikelihood" | "sourceType">>;

export type QuestionAuditOverride = Partial<AuditableQuestion>;

const HIGH_LIKELIHOOD_TOPICS = new Set([
  "HTTP/HTTPS",
  "DNS",
  "SMTP, POP3, IMAP",
  "TCP e UDP",
  "porte e socket",
  "affidabilità TCP",
  "sliding window",
  "congestion control",
  "IP, indirizzamento, subnet, CIDR",
  "forwarding e routing",
  "NAT",
  "DHCP",
  "Ethernet",
  "MAC address",
  "ARP",
  "switch",
  "crittografia simmetrica",
  "crittografia asimmetrica",
  "RSA",
  "Diffie-Hellman",
  "hash",
  "HMAC",
  "firma digitale",
  "certificati e PKI",
  "HTTPS/TLS",
  "autenticazione",
  "VPN",
  "IPsec",
  "attacchi principali",
]);

const MEDIUM_LIKELIHOOD_TOPICS = new Set([
  "Introduzione a Internet",
  "ISP, router, switch, modem, access point",
  "Client-server e P2P",
  "livello collegamento",
  "Wi-Fi e reti mobili",
  "concetti base CIA: confidenzialità, integrità, disponibilità",
  "Kerberos",
]);

function inferSourceType(question: AuditableQuestion): SourceType {
  if (question.sourceType) {
    return question.sourceType;
  }

  if (question.source === "risposte_simulatore_internet.pdf") {
    return "storica";
  }

  if (question.id.startsWith("evil-")) {
    return "generata";
  }

  return "simile";
}

function inferExamLikelihood(
  question: AuditableQuestion,
  sourceType: SourceType,
): ExamLikelihood {
  if (question.examLikelihood) {
    return question.examLikelihood;
  }

  if (sourceType === "storica") {
    return "alta";
  }

  const isHighFrequencyTopic = HIGH_LIKELIHOOD_TOPICS.has(question.topic);
  const isMediumFrequencyTopic = MEDIUM_LIKELIHOOD_TOPICS.has(question.topic);

  if (sourceType === "simile") {
    if (isHighFrequencyTopic && question.difficulty !== "difficile") {
      return "alta";
    }

    if (isHighFrequencyTopic || isMediumFrequencyTopic) {
      return "media";
    }

    return "bassa";
  }

  if (isHighFrequencyTopic) {
    return "media";
  }

  if (isMediumFrequencyTopic && question.difficulty === "facile") {
    return "media";
  }

  return "bassa";
}

function buildStudyGuide(question: AuditableQuestion): StudyGuide {
  return (
    question.studyGuide ?? {
      conceptToReview: `Ripassa ${question.topic} distinguendo funzione, livello e limiti operativi.`,
      miniSummary: question.explanation,
      memoryTrick: `Quando leggi le opzioni, elimina prima quelle che spostano il concetto su un livello o un protocollo diverso da ${question.topic}.`,
      similarExamQuestion: `Quale affermazione descrive correttamente ${question.topic} senza confonderlo con un servizio vicino?`,
    }
  );
}

function normalizeWhyOthers(question: AuditableQuestion) {
  const wrongOptions = question.options.filter(
    (option) => option !== question.correctAnswer,
  );

  return Object.fromEntries(
    wrongOptions.map((option) => [
      option,
      question.whyOthersAreWrong?.[option]?.trim() ||
        `Questa alternativa confonde ${question.topic} con un protocollo, un livello o una funzione diversa da quella richiesta nel testo.`,
    ]),
  );
}

function buildStructuredExplanation(
  question: AuditableQuestion,
  whyOthersAreWrong: Record<string, string>,
  studyGuide: StudyGuide,
) {
  if (question.explanation.startsWith("Risposta corretta:")) {
    return question.explanation;
  }

  const wrongAnswersSection = Object.entries(whyOthersAreWrong)
    .map(([option, reason]) => `${option}: ${reason}`)
    .join(" ");

  return [
    `Risposta corretta: ${question.correctAnswer}. ${question.explanation.trim()}`,
    `Perché le altre sono sbagliate: ${wrongAnswersSection}`,
    `Concetto da ricordare: ${studyGuide.conceptToReview}`,
    `Trucchetto da esame: ${studyGuide.memoryTrick}`,
  ].join(" ");
}

export function applyQuestionAudit(
  question: AuditableQuestion,
  override?: QuestionAuditOverride,
): Question {
  const mergedQuestion: AuditableQuestion = {
    ...question,
    ...override,
    options: override?.options ?? question.options,
    whyOthersAreWrong: override?.whyOthersAreWrong ?? question.whyOthersAreWrong,
    studyGuide: override?.studyGuide ?? question.studyGuide,
  };
  const sourceType = inferSourceType(mergedQuestion);
  const studyGuide = buildStudyGuide(mergedQuestion);
  const whyOthersAreWrong = normalizeWhyOthers(mergedQuestion);

  return {
    ...mergedQuestion,
    examLikelihood: inferExamLikelihood(mergedQuestion, sourceType),
    explanation: buildStructuredExplanation(
      mergedQuestion,
      whyOthersAreWrong,
      studyGuide,
    ),
    sourceType,
    studyGuide,
    whyOthersAreWrong,
  } as Question;
}
