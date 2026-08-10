import type { Category, Difficulty, Question } from "../types";

import { applyQuestionAudit, type QuestionAuditOverride } from "./questionAudit";

type HardSeed = {
  id: string;
  category: Category;
  topic: string;
  difficulty: Difficulty;
  question: string;
  options: [string, string, string, string];
  correctAnswer: string;
  explanation: string;
  source?: string;
  conceptToReview?: string;
  memoryTrick?: string;
  similarExamQuestion?: string;
  whyOthersAreWrong?: Record<string, string>;
};

const SOURCE_BY_TOPIC: Record<string, string> = {
  "Introduzione a Internet": "Capitolo 1 - Reti Di Calcolatori E Di Internet.pdf",
  "ISP, router, switch, modem, access point":
    "Architettura_Internet_C.Lorenzo.pdf",
  "Client-server e P2P": "Capitolo 2 - Livello Di Applicazione.pdf",
  "HTTP/HTTPS": "Capitolo 2 - Livello Di Applicazione.pdf",
  DNS: "Capitolo 2 - Livello Di Applicazione.pdf",
  "SMTP, POP3, IMAP": "Capitolo 2 - Livello Di Applicazione.pdf",
  "TCP e UDP": "Capitolo 3 - Livello Di Trasporto.pdf",
  "porte e socket": "Capitolo 3 - Livello Di Trasporto.pdf",
  "affidabilità TCP": "Capitolo 3 - Livello Di Trasporto.pdf",
  "sliding window": "Capitolo 3 - Livello Di Trasporto.pdf",
  "congestion control": "Capitolo 3 - Livello Di Trasporto.pdf",
  "IP, indirizzamento, subnet, CIDR":
    "Capitolo 4 - Livello Di Rete- Il Piano Dei Dati.pdf",
  "forwarding e routing":
    "Capitolo 5 - Livello Di Rete- Il Piano Di Controllo.pdf",
  NAT: "Capitolo 4 - Livello Di Rete- Il Piano Dei Dati.pdf",
  DHCP: "Capitolo 2 - Livello Di Applicazione.pdf",
  "livello collegamento":
    "Capitolo 6 - Livello Di Collegamento E Reti Locali.pdf",
  Ethernet: "Capitolo 6 - Livello Di Collegamento E Reti Locali.pdf",
  "MAC address": "Capitolo 6 - Livello Di Collegamento E Reti Locali.pdf",
  ARP: "Capitolo 6 - Livello Di Collegamento E Reti Locali.pdf",
  switch: "Capitolo 6 - Livello Di Collegamento E Reti Locali.pdf",
  "Wi-Fi e reti mobili": "Capitolo 6-7 - Wireless E Reti Mobile.pdf",
  "concetti base CIA: confidenzialità, integrità, disponibilità":
    "note_crittografia_2025.pdf",
  "crittografia simmetrica": "note_crittografia_2025.pdf",
  "crittografia asimmetrica": "note_crittografia_2025.pdf",
  RSA: "note_crittografia_2025.pdf",
  "Diffie-Hellman": "note_crittografia_2025.pdf",
  hash: "note_crittografia_2025.pdf",
  HMAC: "note_crittografia_2025.pdf",
  "firma digitale": "note_crittografia_2025.pdf",
  "certificati e PKI": "note_crittografia_2025.pdf",
  "HTTPS/TLS": "note_crittografia_2025.pdf",
  autenticazione: "note_crittografia_2025.pdf",
  Kerberos: "note_crittografia_2025.pdf",
  VPN: "note_crittografia_2025.pdf",
  IPsec: "note_crittografia_2025.pdf",
  "attacchi principali": "note_crittografia_2025.pdf",
};

function buildHardQuestion(seed: HardSeed): Omit<Question, "examLikelihood" | "sourceType"> {
  const wrongOptions = seed.options.filter((option) => option !== seed.correctAnswer);

  return {
    id: seed.id,
    category: seed.category,
    topic: seed.topic,
    difficulty: seed.difficulty,
    question: seed.question,
    options: [...seed.options],
    correctAnswer: seed.correctAnswer,
    explanation: seed.explanation,
    whyOthersAreWrong: Object.fromEntries(
      wrongOptions.map((option) => [
        option,
        seed.whyOthersAreWrong?.[option] ??
          `Questa opzione non descrive correttamente ${seed.topic} nel contesto della domanda e confonde livello, funzione o protocollo richiesto.`,
      ]),
    ),
    source: seed.source ?? SOURCE_BY_TOPIC[seed.topic] ?? "risposte_simulatore_internet.pdf",
    studyGuide: {
      conceptToReview:
        seed.conceptToReview ??
        `Ripassa ${seed.topic} distinguendo bene il servizio offerto, il livello coinvolto e i casi in cui si usa davvero.`,
      miniSummary: seed.explanation,
      memoryTrick:
        seed.memoryTrick ??
        `Se la risposta corretta e "${seed.correctAnswer}", chiediti quale proprieta la rende diversa dalle altre tre.`,
      similarExamQuestion:
        seed.similarExamQuestion ??
        `Quale affermazione descrive correttamente ${seed.topic} senza confonderlo con un altro protocollo o livello?`,
    },
  };
}

const hardSeeds: HardSeed[] = [
  {
    id: "evil-internet-001",
    category: "Internet",
    topic: "Introduzione a Internet",
    difficulty: "difficile",
    question: "Quale affermazione è falsa sul modello a strati usato in Internet?",
    options: [
      "Il livello di rete di Internet garantisce consegna affidabile e ordinata dei pacchetti",
      "Il livello applicazione può usare protocolli diversi sopra lo stesso trasporto",
      "Ogni livello offre un servizio al livello superiore",
      "La modularità riduce l'impatto delle modifiche interne a un singolo livello",
    ],
    correctAnswer:
      "Il livello di rete di Internet garantisce consegna affidabile e ordinata dei pacchetti",
    explanation:
      "IP offre un servizio best effort, connectionless e non affidabile. Garanzie come ordine, ritrasmissione e controllo di flusso appartengono al trasporto, non al livello rete.",
  },
  {
    id: "evil-internet-002",
    category: "Internet",
    topic: "Introduzione a Internet",
    difficulty: "difficile",
    question:
      "In una rete a commutazione di pacchetto, quale frase descrive meglio un effetto della multiplexing statistico?",
    options: [
      "Più flussi condividono dinamicamente la stessa capacità, ma i ritardi possono variare nel tempo",
      "Ogni flusso riceve una banda fissa end-to-end prenotata prima della trasmissione",
      "I pacchetti di uno stesso flusso usano sempre lo stesso circuito fisico dedicato",
      "I ritardi di accodamento diventano impossibili per definizione",
    ],
    correctAnswer:
      "Più flussi condividono dinamicamente la stessa capacità, ma i ritardi possono variare nel tempo",
    explanation:
      "La commutazione di pacchetto sfrutta la condivisione statistica del link: questo aumenta l'efficienza, ma lascia aperta la possibilità di code e ritardi variabili in presenza di traffico bursty o congestione.",
  },
  {
    id: "evil-internet-003",
    category: "Internet",
    topic: "Introduzione a Internet",
    difficulty: "difficile",
    question:
      "Quale ritardo non dipende direttamente dalla lunghezza del pacchetto L?",
    options: [
      "Il ritardo di propagazione",
      "Il ritardo di trasmissione",
      "Il tempo necessario a spingere tutti i bit sul link",
      "Il tempo di serializzazione sul mezzo",
    ],
    correctAnswer: "Il ritardo di propagazione",
    explanation:
      "Il ritardo di propagazione dipende soprattutto da distanza e velocità del segnale nel mezzo. Ritardo di trasmissione, serializzazione e tempo per mettere i bit sul link dipendono invece da L/R.",
  },
  {
    id: "evil-internet-004",
    category: "Internet",
    topic: "Introduzione a Internet",
    difficulty: "difficile",
    question:
      "Se un'applicazione richiede perdita quasi nulla ma tollera un po' di ritardo in più, quale coppia livello rete/trasporto descrive meglio la situazione tipica su Internet?",
    options: [
      "IP best effort sotto TCP affidabile",
      "IP affidabile sotto UDP affidabile",
      "Ethernet affidabile sotto HTTP connectionless",
      "ARP orientato alla connessione sotto TLS non affidabile",
    ],
    correctAnswer: "IP best effort sotto TCP affidabile",
    explanation:
      "Il modello tipico è proprio questo: IP non garantisce affidabilità end-to-end, mentre TCP la costruisce sopra con ACK, numeri di sequenza e ritrasmissioni. Le altre opzioni mischiano livelli o proprietà errate.",
  },
  {
    id: "evil-internet-005",
    category: "Internet",
    topic: "Introduzione a Internet",
    difficulty: "difficile",
    question:
      "Quale affermazione confronta correttamente Internet e Web?",
    options: [
      "Il Web è un'applicazione che gira sopra Internet; Internet non coincide con il Web",
      "Internet è l'insieme dei soli server HTTP raggiungibili via browser",
      "Il Web è il livello rete, mentre Internet è il livello applicazione",
      "Internet e Web sono sinonimi se si usa HTTPS invece di HTTP",
    ],
    correctAnswer:
      "Il Web è un'applicazione che gira sopra Internet; Internet non coincide con il Web",
    explanation:
      "Il Web è solo uno dei servizi applicativi costruiti sull'infrastruttura Internet. DNS, posta, VoIP e molte altre applicazioni usano Internet senza coincidere con il Web.",
  },
  {
    id: "evil-internet-006",
    category: "Internet",
    topic: "Introduzione a Internet",
    difficulty: "difficile",
    question:
      "Quale frase è più corretta sul rapporto tra standard e interoperabilità in rete?",
    options: [
      "L'interoperabilità nasce dal fatto che host e apparati seguono protocolli e formati condivisi",
      "L'interoperabilità è garantita solo se tutti usano lo stesso sistema operativo",
      "Basta condividere la stessa marca di router per evitare problemi di compatibilità",
      "I protocolli servono solo a descrivere i cavi, non il comportamento dei nodi",
    ],
    correctAnswer:
      "L'interoperabilità nasce dal fatto che host e apparati seguono protocolli e formati condivisi",
    explanation:
      "Senza standard condivisi, host e apparati non saprebbero interpretare header, stati e messaggi. Il punto della rete è proprio far comunicare sistemi eterogenei grazie a regole comuni.",
  },
  {
    id: "evil-internet-007",
    category: "Internet",
    topic: "ISP, router, switch, modem, access point",
    difficulty: "difficile",
    question:
      "Quale dispositivo prende decisioni di inoltro usando in modo nativo l'indirizzo IP di destinazione?",
    options: ["Router", "Switch layer 2", "Access point puro", "Modem"],
    correctAnswer: "Router",
    explanation:
      "Il router legge l'header IP e usa tabelle di forwarding/route per scegliere il next hop. Uno switch layer 2 usa MAC address, mentre modem e access point non svolgono quel compito di livello 3.",
  },
  {
    id: "evil-internet-008",
    category: "Internet",
    topic: "ISP, router, switch, modem, access point",
    difficulty: "difficile",
    question:
      "Quale affermazione è falsa su uno switch Ethernet classico?",
    options: [
      "Costruisce una tabella di forwarding osservando i MAC sorgente",
      "Riduce i domini di collisione separando le porte",
      "Instrada pacchetti verso reti remote usando prefissi IP",
      "Può effettuare flooding quando il MAC di destinazione è sconosciuto",
    ],
    correctAnswer: "Instrada pacchetti verso reti remote usando prefissi IP",
    explanation:
      "Questa è una funzione da router. Lo switch Ethernet classico resta nel dominio di livello 2, impara MAC e inoltra frame all'interno della LAN.",
  },
  {
    id: "evil-internet-009",
    category: "Internet",
    topic: "ISP, router, switch, modem, access point",
    difficulty: "difficile",
    question:
      "In una rete domestica, quale coppia di funzioni è più facile trovare nello stesso apparato fisico ma resta concettualmente distinta?",
    options: [
      "Router e access point",
      "DNS root server e TLD server",
      "TCP sender e TCP receiver",
      "Client HTTP e authoritative DNS server",
    ],
    correctAnswer: "Router e access point",
    explanation:
      "Molti apparati casalinghi integrano più ruoli: router, switch, access point e talvolta modem. Il fatto che stiano nello stesso scatolotto non elimina la distinzione logica tra le funzioni.",
  },
  {
    id: "evil-internet-010",
    category: "Internet",
    topic: "ISP, router, switch, modem, access point",
    difficulty: "difficile",
    question:
      "Quale descrizione del modem è la più accurata nel contesto dell'accesso?",
    options: [
      "Adatta il segnale al mezzo di accesso e non sostituisce il routing IP",
      "Sceglie il cammino minimo tra sistemi autonomi",
      "Assegna numeri di porta ai processi applicativi locali",
      "Risolva nomi di dominio tramite interrogazioni iterative",
    ],
    correctAnswer: "Adatta il segnale al mezzo di accesso e non sostituisce il routing IP",
    explanation:
      "Il modem opera vicino al livello fisico e al collegamento. Può stare nello stesso apparato del router, ma il suo compito non è calcolare rotte né gestire porte applicative o DNS.",
  },
  {
    id: "evil-internet-011",
    category: "Internet",
    topic: "Client-server e P2P",
    difficulty: "difficile",
    question:
      "Quale caratteristica NON è tipica di un'architettura puramente client-server?",
    options: [
      "Ogni nuovo client aggiunge automaticamente capacità di servizio pari al proprio carico",
      "I server sono spesso sempre attivi e con indirizzi noti",
      "I client iniziano la comunicazione verso il server",
      "Il collo di bottiglia può concentrarsi sul lato server",
    ],
    correctAnswer:
      "Ogni nuovo client aggiunge automaticamente capacità di servizio pari al proprio carico",
    explanation:
      "Questa è una promessa più vicina ai sistemi P2P ben progettati. Nel client-server, se il numero di client cresce, il server può diventare il collo di bottiglia.",
  },
  {
    id: "evil-internet-012",
    category: "Internet",
    topic: "Client-server e P2P",
    difficulty: "difficile",
    question:
      "Perché il churn è considerato un problema tipico nelle architetture peer-to-peer?",
    options: [
      "Perché i peer possono entrare e uscire spesso, rendendo instabile la disponibilità delle risorse",
      "Perché i server centralizzati cambiano chiave pubblica a ogni richiesta",
      "Perché i router ricalcolano Dijkstra per ogni pacchetto ricevuto",
      "Perché il protocollo HTTP vieta la cache locale nei peer",
    ],
    correctAnswer:
      "Perché i peer possono entrare e uscire spesso, rendendo instabile la disponibilità delle risorse",
    explanation:
      "Il churn descrive proprio l'instabilità del set di nodi partecipanti. In P2P questo impatta localizzazione dei contenuti, ridondanza e tempi di recupero.",
  },
  {
    id: "evil-internet-013",
    category: "Internet",
    topic: "Client-server e P2P",
    difficulty: "difficile",
    question:
      "Quale confronto è corretto tra client-server e P2P?",
    options: [
      "Il P2P può scalare meglio perché i peer contribuiscono risorse; il client-server semplifica maggiormente il controllo centralizzato",
      "Il client-server elimina ogni singolo punto di guasto meglio del P2P",
      "Il P2P garantisce per definizione identità e autenticazione migliori del client-server",
      "Il client-server non può usare DNS, mentre il P2P sì",
    ],
    correctAnswer:
      "Il P2P può scalare meglio perché i peer contribuiscono risorse; il client-server semplifica maggiormente il controllo centralizzato",
    explanation:
      "Questa è la sintesi più onesta del trade-off. Il P2P guadagna spesso in scalabilità distribuita, mentre il client-server semplifica coordinamento, politiche e gestione centralizzata.",
  },
  {
    id: "evil-internet-014",
    category: "Internet",
    topic: "Client-server e P2P",
    difficulty: "difficile",
    question:
      "Quale scenario somiglia di più a un modello ibrido e non a uno P2P puro?",
    options: [
      "Un tracker centrale aiuta i peer a trovarsi, ma il file viene poi scambiato tra peer",
      "Ogni host comunica solo con un server fisso per scaricare tutti i dati",
      "Un browser invia una richiesta HTTP a un singolo origin server",
      "Un client DNS interroga soltanto il proprio resolver locale",
    ],
    correctAnswer:
      "Un tracker centrale aiuta i peer a trovarsi, ma il file viene poi scambiato tra peer",
    explanation:
      "Questo è un esempio classico di architettura ibrida: controllo o indicizzazione centrale, trasferimento dei dati distribuito tra pari.",
  },
  {
    id: "evil-internet-015",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "difficile",
    question:
      "Quale affermazione è falsa su HTTP/1.1?",
    options: [
      "Ogni risposta deve sempre contenere un body, anche ai codici che semanticamente non lo prevedono",
      "La request line contiene metodo, risorsa e versione del protocollo",
      "Le intestazioni terminano con una riga vuota",
      "HTTP è di base stateless dal punto di vista del protocollo",
    ],
    correctAnswer:
      "Ogni risposta deve sempre contenere un body, anche ai codici che semanticamente non lo prevedono",
    explanation:
      "Esistono risposte che non portano un body utile o previsto, per esempio alcuni codici e il caso di HEAD. Le altre tre affermazioni descrivono correttamente il comportamento di HTTP.",
  },
  {
    id: "evil-internet-016",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "difficile",
    question:
      "Quale differenza tra GET e POST è formulata correttamente senza semplificazioni scorrette?",
    options: [
      "GET è comunemente usato per recuperare risorse, mentre POST è spesso usato per inviare dati al server o richiedere elaborazioni lato server",
      "GET è affidabile, POST è inaffidabile perché usa UDP",
      "GET può essere usato solo con HTTP/1.0, POST solo con HTTP/2",
      "POST non può avere body, mentre GET deve averlo sempre",
    ],
    correctAnswer:
      "GET è comunemente usato per recuperare risorse, mentre POST è spesso usato per inviare dati al server o richiedere elaborazioni lato server",
    explanation:
      "È la distinzione funzionale più corretta a livello pratico. Le altre opzioni attribuiscono differenze di trasporto o di sintassi che non esistono in quei termini.",
  },
  {
    id: "evil-internet-017",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "difficile",
    question:
      "Perché il protocollo HTTP viene definito stateless anche se un sito può ricordare chi sei?",
    options: [
      "Perché lo stato applicativo viene mantenuto da meccanismi esterni come cookie, sessioni o token, non dal protocollo di base",
      "Perché HTTP non permette in alcun modo l'autenticazione di un utente",
      "Perché ogni pagina web ha un solo pacchetto IP e quindi non esiste memoria",
      "Perché HTTPS cancella automaticamente ogni informazione dopo ogni request",
    ],
    correctAnswer:
      "Perché lo stato applicativo viene mantenuto da meccanismi esterni come cookie, sessioni o token, non dal protocollo di base",
    explanation:
      "Il protocollo non conserva da solo un contesto implicito tra richieste. Se un'applicazione ricostruisce la sessione, lo fa tramite dati aggiuntivi gestiti a livello applicativo.",
  },
  {
    id: "evil-internet-018",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "difficile",
    question:
      "Quale affermazione sui proxy HTTP di cache è la più accurata?",
    options: [
      "Possono ridurre latenza e traffico ripetuto, ma devono gestire la coerenza delle copie memorizzate",
      "Eliminano la necessità di DNS perché memorizzano anche tutte le risoluzioni autoritative",
      "Garantiscono che gli oggetti richiesti siano sempre presenti localmente",
      "Sostituiscono il TCP con ARP nelle richieste servite dalla cache",
    ],
    correctAnswer:
      "Possono ridurre latenza e traffico ripetuto, ma devono gestire la coerenza delle copie memorizzate",
    explanation:
      "Il vantaggio della cache è reale, ma richiede verifiche di validità degli oggetti, per esempio tramite GET condizionali. Le altre opzioni attribuiscono ai proxy funzioni che non hanno.",
  },
  {
    id: "evil-internet-019",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "difficile",
    question:
      "Quale header o meccanismo è più direttamente legato al conditional GET?",
    options: ["If-Modified-Since", "Time-To-Live", "Set-Cookie", "Content-Length minimo"],
    correctAnswer: "If-Modified-Since",
    explanation:
      "Il conditional GET usa header come If-Modified-Since per chiedere al server se la copia in cache è ancora valida. TTL e Content-Length non svolgono quel ruolo semantico.",
  },
  {
    id: "evil-internet-020",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "difficile",
    question:
      "Che cosa rende HTTPS diverso da HTTP senza cambiare la logica applicativa di richiesta e risposta?",
    options: [
      "Aggiunge TLS sopra TCP, proteggendo il canale senza riscrivere il modello HTTP di base",
      "Sostituisce il DNS con una tabella locale di MAC address firmati",
      "Trasforma ogni GET in un pacchetto UDP cifrato",
      "Elimina il bisogno di qualsiasi autenticazione del server",
    ],
    correctAnswer:
      "Aggiunge TLS sopra TCP, proteggendo il canale senza riscrivere il modello HTTP di base",
    explanation:
      "HTTPS non inventa un Web nuovo: protegge lo stesso scambio applicativo con un livello crittografico che garantisce confidenzialità, integrità e autenticazione del server.",
  },
  {
    id: "evil-internet-021",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "difficile",
    question:
      "Quale descrizione del codice 304 Not Modified è corretta nel contesto della cache HTTP?",
    options: [
      "Indica che il server conferma la validità della copia in cache senza reinviare l'oggetto completo",
      "Indica che la richiesta deve essere ritrasmessa via UDP anziché TCP",
      "Indica che il certificato TLS del server è scaduto",
      "Indica che la risorsa è stata rimossa definitivamente",
    ],
    correctAnswer:
      "Indica che il server conferma la validità della copia in cache senza reinviare l'oggetto completo",
    explanation:
      "304 è la risposta ideale al conditional GET quando il contenuto non è cambiato. Così si risparmia banda e si preserva la coerenza della cache.",
  },
  {
    id: "evil-internet-022",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "difficile",
    question:
      "Quale frase confronta correttamente URL e indirizzi di basso livello?",
    options: [
      "L'URL identifica una risorsa e include almeno schema e host; non contiene di per sé MAC address o gateway locale",
      "L'URL deve sempre contenere anche il MAC del server per funzionare",
      "L'URL è un sostituto della tabella ARP del client",
      "L'URL rappresenta direttamente la socket TCP completa della connessione",
    ],
    correctAnswer:
      "L'URL identifica una risorsa e include almeno schema e host; non contiene di per sé MAC address o gateway locale",
    explanation:
      "L'URL vive a livello applicativo e descrive una risorsa. MAC, gateway e dettagli del collegamento appartengono a livelli differenti e vengono risolti o usati più tardi nello stack.",
  },
  {
    id: "evil-internet-023",
    category: "Internet",
    topic: "DNS",
    difficulty: "difficile",
    question:
      "Quale affermazione è falsa sulla gerarchia DNS?",
    options: [
      "I root server contengono direttamente tutti gli indirizzi IP finali di ogni host Internet",
      "I TLD server sanno indicare i server autoritativi per i domini del loro livello",
      "Il server autoritativo possiede i record finali della zona di competenza",
      "La delega gerarchica serve a distribuire il carico e la responsabilità amministrativa",
    ],
    correctAnswer:
      "I root server contengono direttamente tutti gli indirizzi IP finali di ogni host Internet",
    explanation:
      "I root non contengono il dettaglio finale di tutti gli host: indicano piuttosto dove trovare i TLD competenti. La risoluzione procede poi verso server sempre più specifici.",
  },
  {
    id: "evil-internet-024",
    category: "Internet",
    topic: "DNS",
    difficulty: "difficile",
    question:
      "In una risoluzione iterativa, quale risposta tipica fornisce un root server a un resolver?",
    options: [
      "Un riferimento ai server del TLD pertinente, non necessariamente l'IP finale richiesto",
      "Il MAC address del server autoritativo finale",
      "La chiave pubblica del browser client",
      "Un messaggio DHCP Offer",
    ],
    correctAnswer:
      "Un riferimento ai server del TLD pertinente, non necessariamente l'IP finale richiesto",
    explanation:
      "La risoluzione iterativa è una catena di indicazioni: il root reindirizza verso il TLD, che a sua volta rimanda verso l'autoritativo del dominio.",
  },
  {
    id: "evil-internet-025",
    category: "Internet",
    topic: "DNS",
    difficulty: "difficile",
    question:
      "Quale record DNS è più adatto a esprimere un alias canonico di un nome host?",
    options: ["CNAME", "MX", "NS", "SOA"],
    correctAnswer: "CNAME",
    explanation:
      "CNAME collega un nome alias a un nome canonico. MX riguarda la posta, NS la delega dei name server e SOA le informazioni di autorità della zona.",
  },
  {
    id: "evil-internet-026",
    category: "Internet",
    topic: "DNS",
    difficulty: "difficile",
    question:
      "Quando DNS usa più facilmente TCP invece di UDP?",
    options: [
      "Quando deve trasferire zone o gestire risposte che eccedono il caso classico leggero",
      "Quando deve risolvere un MAC address su una LAN Ethernet",
      "Quando il client invia una richiesta HTTP POST",
      "Solo quando l'host ha un prefisso IPv6",
    ],
    correctAnswer:
      "Quando deve trasferire zone o gestire risposte che eccedono il caso classico leggero",
    explanation:
      "Il lookup comune preferisce UDP per leggerezza. TCP entra in gioco in casi come zone transfer o risposte che richiedono un meccanismo più robusto del semplice datagramma standard.",
  },
  {
    id: "evil-internet-027",
    category: "Internet",
    topic: "DNS",
    difficulty: "difficile",
    question:
      "Quale confronto tra DNS iterativo e ricorsivo è corretto?",
    options: [
      "Nel ricorsivo il resolver incaricato completa la catena di ricerca; nell'iterativo riceve riferimenti intermedi",
      "Nel ricorsivo ogni server manda solo MAC address, nell'iterativo solo IP pubblici",
      "La ricorsione DNS esiste solo nei browser, non nei resolver",
      "Iterativo e ricorsivo sono due nomi per lo stesso identico comportamento",
    ],
    correctAnswer:
      "Nel ricorsivo il resolver incaricato completa la catena di ricerca; nell'iterativo riceve riferimenti intermedi",
    explanation:
      "La differenza è nel lavoro svolto dal server che riceve la domanda: o risolve per conto del client, o lo indirizza passo dopo passo verso il prossimo nodo da interrogare.",
  },
  {
    id: "evil-internet-028",
    category: "Internet",
    topic: "DNS",
    difficulty: "difficile",
    question:
      "Quale affermazione sui cache resolver è più accurata?",
    options: [
      "Ridurre il numero di interrogazioni esterne è utile, ma la cache deve rispettare tempi di validità e aggiornamento dei record",
      "Una volta risolto un nome, il resolver può considerarlo valido per sempre",
      "La cache DNS sostituisce la tabella di routing del router locale",
      "La cache DNS memorizza solo record MX e non record A o AAAA",
    ],
    correctAnswer:
      "Ridurre il numero di interrogazioni esterne è utile, ma la cache deve rispettare tempi di validità e aggiornamento dei record",
    explanation:
      "La cache migliora latenza e riduce traffico, ma non può ignorare la validità temporale dei record. Altrimenti servirebbe dati obsoleti.",
  },
  {
    id: "evil-internet-029",
    category: "Internet",
    topic: "DNS",
    difficulty: "difficile",
    question:
      "Quale elemento del DNS è direttamente legato alla posta elettronica a livello di naming?",
    options: [
      "Il record MX",
      "Il record PTR usato come alias web",
      "Il campo TTL dell'header IP",
      "L'indirizzo MAC del mail server",
    ],
    correctAnswer: "Il record MX",
    explanation:
      "Il record MX indica quali mail server sono responsabili per la ricezione della posta di un dominio. Non va confuso con altri record o con parametri di livello rete.",
  },
  {
    id: "evil-internet-030",
    category: "Internet",
    topic: "DNS",
    difficulty: "difficile",
    question:
      "Quale informazione fornisce tipicamente un record PTR?",
    options: [
      "Una mappatura inversa da indirizzo IP a nome",
      "La chiave di sessione TLS per cifrare la risposta",
      "L'elenco delle porte TCP aperte su un server",
      "Il MAC address del gateway predefinito",
    ],
    correctAnswer: "Una mappatura inversa da indirizzo IP a nome",
    explanation:
      "PTR è usato nella reverse resolution. Non sostituisce record A/AAAA e non trasporta informazioni di trasporto o di livello 2.",
  },
  {
    id: "evil-internet-031",
    category: "Internet",
    topic: "SMTP, POP3, IMAP",
    difficulty: "difficile",
    question:
      "Quale affermazione è corretta sul ruolo di SMTP rispetto a POP3 e IMAP?",
    options: [
      "SMTP è orientato all'invio e al relay della posta, mentre POP3 e IMAP servono soprattutto a recuperarla o gestirla",
      "SMTP è il protocollo di lettura remota delle cartelle mail sul server",
      "POP3 e IMAP vengono usati per risolvere i record MX dei domini",
      "SMTP trasporta posta solo via UDP perché la mail non richiede affidabilità",
    ],
    correctAnswer:
      "SMTP è orientato all'invio e al relay della posta, mentre POP3 e IMAP servono soprattutto a recuperarla o gestirla",
    explanation:
      "La distinzione principale è questa: SMTP spinge i messaggi, POP3 e IMAP li espongono al client per il recupero o la sincronizzazione.",
  },
  {
    id: "evil-internet-032",
    category: "Internet",
    topic: "SMTP, POP3, IMAP",
    difficulty: "difficile",
    question:
      "Quale vantaggio rende IMAP più adatto di POP3 all'uso su più dispositivi?",
    options: [
      "Mantiene sul server più stato condiviso, come cartelle e flag dei messaggi",
      "Permette di saltare il DNS nella consegna della posta",
      "Usa direttamente ARP per trovare il mail server remoto",
      "Trasforma automaticamente ogni allegato in un record DNS",
    ],
    correctAnswer:
      "Mantiene sul server più stato condiviso, come cartelle e flag dei messaggi",
    explanation:
      "IMAP tratta il server come archivio principale della casella, favorendo la sincronizzazione tra client diversi. POP3 è più vicino allo scaricamento semplice.",
  },
  {
    id: "evil-internet-033",
    category: "Internet",
    topic: "SMTP, POP3, IMAP",
    difficulty: "difficile",
    question:
      "Quale frase è falsa sul trasferimento della posta tra server?",
    options: [
      "I mail server si scambiano messaggi usando POP3 come protocollo di relay principale",
      "I record MX aiutano a individuare i server di posta di un dominio",
      "La consegna della mail richiede affidabilità, quindi il trasporto tipico è TCP",
      "SMTP è centrale nel trasferimento della posta tra server",
    ],
    correctAnswer:
      "I mail server si scambiano messaggi usando POP3 come protocollo di relay principale",
    explanation:
      "Il relay tra server è un compito da SMTP. POP3 è usato tipicamente dal client per recuperare messaggi già presenti nella mailbox.",
  },
  {
    id: "evil-internet-034",
    category: "Internet",
    topic: "SMTP, POP3, IMAP",
    difficulty: "difficile",
    question:
      "Perché è scorretto dire che IMAP e POP3 sono concorrenti perfetti di SMTP?",
    options: [
      "Perché risolvono fasi diverse del servizio di posta: accesso alla mailbox contro invio/relay",
      "Perché usano sistemi operativi incompatibili tra loro",
      "Perché IMAP e POP3 non hanno porte di rete",
      "Perché SMTP esiste solo dentro HTTPS",
    ],
    correctAnswer:
      "Perché risolvono fasi diverse del servizio di posta: accesso alla mailbox contro invio/relay",
    explanation:
      "Confrontarli come se facessero lo stesso mestiere è concettualmente errato. SMTP e POP3/IMAP si completano dentro lo stesso servizio mail.",
  },
  {
    id: "evil-internet-035",
    category: "Internet",
    topic: "TCP e UDP",
    difficulty: "difficile",
    question:
      "Quale affermazione è falsa su UDP?",
    options: [
      "Essendo connectionless, garantisce comunque consegna in ordine e ritrasmissione automatica",
      "Ha overhead ridotto rispetto a TCP",
      "Può essere adatto a streaming real-time o gaming online",
      "Non prevede una fase di handshake come il three-way handshake del TCP",
    ],
    correctAnswer:
      "Essendo connectionless, garantisce comunque consegna in ordine e ritrasmissione automatica",
    explanation:
      "UDP non offre ordine, ritrasmissione o affidabilità end-to-end. Proprio l'assenza di queste garanzie lo rende più leggero.",
  },
  {
    id: "evil-internet-036",
    category: "Internet",
    topic: "TCP e UDP",
    difficulty: "difficile",
    question:
      "Quale confronto TCP/UDP è corretto senza essere fuorviante?",
    options: [
      "TCP è orientato alla connessione e fornisce affidabilità; UDP è connectionless e lascia più responsabilità all'applicazione",
      "TCP e UDP differiscono solo nel numero di porta usato",
      "UDP è sempre più veloce in valore assoluto di TCP in ogni contesto",
      "TCP non usa checksum, UDP sì",
    ],
    correctAnswer:
      "TCP è orientato alla connessione e fornisce affidabilità; UDP è connectionless e lascia più responsabilità all'applicazione",
    explanation:
      "Questa è la distinzione strutturale corretta. Dire che UDP sia sempre più veloce o che il checksum esista solo lì è sbagliato o troppo semplicistico.",
  },
  {
    id: "evil-internet-037",
    category: "Internet",
    topic: "TCP e UDP",
    difficulty: "difficile",
    question:
      "Perché si dice che UDP è message-oriented mentre TCP è stream-oriented?",
    options: [
      "Perché UDP conserva l'idea di datagramma separato, mentre TCP presenta all'applicazione un flusso continuo di byte",
      "Perché TCP invia solo un messaggio per connessione",
      "Perché UDP non ha header, ma solo dati applicativi puri",
      "Perché TCP segmenta in base ai nomi DNS e UDP in base ai MAC address",
    ],
    correctAnswer:
      "Perché UDP conserva l'idea di datagramma separato, mentre TCP presenta all'applicazione un flusso continuo di byte",
    explanation:
      "La differenza non sta solo nell'header, ma nell'astrazione offerta all'applicazione. TCP nasconde la segmentazione interna dentro uno stream ordinato di byte.",
  },
  {
    id: "evil-internet-038",
    category: "Internet",
    topic: "TCP e UDP",
    difficulty: "difficile",
    question:
      "Quale applicazione soffrirebbe di più se usasse per forza UDP senza meccanismi aggiuntivi propri?",
    options: [
      "Il trasferimento affidabile di un file grande in cui conta arrivare completo e in ordine",
      "Uno stream audio dal vivo che tollera piccole perdite",
      "Un videogioco online che privilegia bassa latenza e aggiornamenti rapidi",
      "Una query DNS standard a bassa occupazione",
    ],
    correctAnswer:
      "Il trasferimento affidabile di un file grande in cui conta arrivare completo e in ordine",
    explanation:
      "Se vuoi integrità completa del flusso e riordino, lasciar fare tutto all'applicazione sopra UDP è oneroso. È il territorio naturale di TCP o di protocolli applicativi che ricostruiscono affidabilità equivalente.",
  },
  {
    id: "evil-internet-039",
    category: "Internet",
    topic: "TCP e UDP",
    difficulty: "difficile",
    question:
      "Quale delle seguenti frasi definisce meglio il motivo per cui UDP è detto connectionless?",
    options: [
      "Ogni datagramma viene trattato indipendentemente, senza stato di connessione mantenuto dal trasporto",
      "UDP non può essere usato su Internet ma solo in LAN isolate",
      "UDP non può avere checksum perché non ha connessione",
      "UDP costringe tutti i datagrammi a percorrere la stessa rotta",
    ],
    correctAnswer:
      "Ogni datagramma viene trattato indipendentemente, senza stato di connessione mantenuto dal trasporto",
    explanation:
      "Connectionless significa proprio assenza di setup e di stato di connessione gestito come in TCP. Non significa assenza di header o impossibilità di usare Internet.",
  },
  {
    id: "evil-internet-040",
    category: "Internet",
    topic: "TCP e UDP",
    difficulty: "difficile",
    question:
      "Quale coppia protocollo-servizio è associata correttamente?",
    options: [
      "DNS lookup standard su UDP, HTTP classico su TCP",
      "ARP su TCP, SMTP su ICMP",
      "DHCP su TCP, traceroute su SMTP",
      "TLS handshake su ARP, IMAP su ICMP",
    ],
    correctAnswer: "DNS lookup standard su UDP, HTTP classico su TCP",
    explanation:
      "È la coppia corretta nel caso base del corso. Le altre opzioni mescolano protocolli di livelli diversi o abbinamenti inesistenti.",
  },
  {
    id: "evil-internet-041",
    category: "Internet",
    topic: "TCP e UDP",
    difficulty: "difficile",
    question:
      "Quale frase sul checksum di UDP è la più corretta?",
    options: [
      "Serve a rilevare errori sul datagramma, ma non aggiunge da solo affidabilità end-to-end completa",
      "Rende UDP equivalente a TCP dal punto di vista della consegna affidabile",
      "Controlla solo l'indirizzo MAC e ignora dati e pseudo-header",
      "È usato per calcolare la subnet mask del mittente",
    ],
    correctAnswer:
      "Serve a rilevare errori sul datagramma, ma non aggiunge da solo affidabilità end-to-end completa",
    explanation:
      "Un checksum aiuta a rilevare corruzioni, ma non produce ACK, ritrasmissioni o riordino. Affidabilità completa e semplice detection degli errori sono concetti diversi.",
  },
  {
    id: "evil-internet-042",
    category: "Internet",
    topic: "TCP e UDP",
    difficulty: "difficile",
    question:
      "Quale affermazione sui numeri di porta è corretta?",
    options: [
      "Servono a identificare il processo applicativo locale o remoto coinvolto nella comunicazione",
      "Identificano in modo globale una scheda Ethernet in tutta Internet",
      "Sostituiscono l'indirizzo IP nel routing tra sottoreti",
      "Determinano il TTL iniziale del datagramma",
    ],
    correctAnswer:
      "Servono a identificare il processo applicativo locale o remoto coinvolto nella comunicazione",
    explanation:
      "La porta completa l'IP per individuare il servizio o il processo. Non sostituisce né MAC né IP e non definisce il TTL.",
  },
  {
    id: "evil-internet-043",
    category: "Internet",
    topic: "porte e socket",
    difficulty: "difficile",
    question:
      "Quale quaterna identifica una connessione TCP attiva?",
    options: [
      "IP sorgente, porta sorgente, IP destinazione, porta destinazione",
      "Solo porta sorgente e porta destinazione",
      "MAC sorgente, MAC destinazione, TTL e checksum",
      "Hostname del client, hostname del server, MTU e MSS",
    ],
    correctAnswer:
      "IP sorgente, porta sorgente, IP destinazione, porta destinazione",
    explanation:
      "TCP deve distinguere connessioni simultanee verso la stessa porta server. La quaterna completa evita ambiguità tra flussi provenienti da client diversi.",
  },
  {
    id: "evil-internet-044",
    category: "Internet",
    topic: "porte e socket",
    difficulty: "difficile",
    question:
      "Perché la sola porta 80 non basta a identificare una specifica connessione TCP su un server web?",
    options: [
      "Perché molti client diversi possono comunicare contemporaneamente con quella stessa porta del server",
      "Perché le porte TCP cambiano significato a ogni hop del percorso",
      "Perché la porta 80 è usata solo da ARP e non da HTTP",
      "Perché la porta del server è sempre casuale e non nota",
    ],
    correctAnswer:
      "Perché molti client diversi possono comunicare contemporaneamente con quella stessa porta del server",
    explanation:
      "La porta locale del server identifica il servizio, ma non la singola sessione. Per quella serve l'intera quaterna di indirizzi e porte.",
  },
  {
    id: "evil-internet-045",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "difficile",
    question:
      "Quale meccanismo NON contribuisce direttamente all'affidabilità end-to-end del TCP?",
    options: [
      "Il campo TTL del datagramma IP",
      "Gli ACK cumulativi",
      "I numeri di sequenza",
      "Il timer di ritrasmissione",
    ],
    correctAnswer: "Il campo TTL del datagramma IP",
    explanation:
      "Il TTL aiuta la rete a evitare loop infiniti, ma non garantisce consegna ordinata o ritrasmissioni. Quelli sono meccanismi propri del TCP.",
  },
  {
    id: "evil-internet-046",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "difficile",
    question:
      "Quale differenza tra FIN e RST è descritta correttamente?",
    options: [
      "FIN supporta una chiusura ordinata; RST interrompe in modo brusco la connessione",
      "FIN è usato solo per aprire la connessione, RST solo per trasportare dati urgenti",
      "RST garantisce la consegna dei dati in volo meglio di FIN",
      "FIN e RST sono sinonimi storici dello stesso flag",
    ],
    correctAnswer:
      "FIN supporta una chiusura ordinata; RST interrompe in modo brusco la connessione",
    explanation:
      "FIN chiude con un teardown regolare, mentre RST abbatte la connessione senza il normale scambio di chiusura. Sono flag con semantica molto diversa.",
  },
  {
    id: "evil-internet-047",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "difficile",
    question:
      "Se un segmento TCP parte con sequence number 1000 e trasporta 500 byte di dati, quale ACK cumulativo ci si aspetta idealmente dal destinatario dopo la ricezione corretta?",
    options: ["1500", "1499", "1001", "500"],
    correctAnswer: "1500",
    explanation:
      "L'ACK cumulativo indica il prossimo byte atteso. Se sono arrivati i byte da 1000 a 1499 inclusi, il prossimo atteso è 1500.",
  },
  {
    id: "evil-internet-048",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "difficile",
    question:
      "Quale affermazione descrive meglio il ruolo della MSS?",
    options: [
      "Indica quanti byte di dati applicativi un segmento TCP può portare senza contare gli header",
      "È la dimensione massima della finestra di ricezione",
      "È il numero massimo di connessioni aperte dal server",
      "Coincide sempre con la MTU del link fisico",
    ],
    correctAnswer:
      "Indica quanti byte di dati applicativi un segmento TCP può portare senza contare gli header",
    explanation:
      "MSS e MTU sono correlate ma non identiche. La MSS riguarda il payload TCP, non l'intero pacchetto IP sul link.",
  },
  {
    id: "evil-internet-049",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "difficile",
    question:
      "Perché un timeout di ritrasmissione è considerato un segnale di congestione più severo di tre ACK duplicati?",
    options: [
      "Perché suggerisce che non sta tornando alcun riscontro utile, quindi la rete può essere in difficoltà più seria",
      "Perché dimostra che il TTL del pacchetto è aumentato",
      "Perché implica che ARP abbia perso la cache locale",
      "Perché obbliga a cambiare porta TCP a metà connessione",
    ],
    correctAnswer:
      "Perché suggerisce che non sta tornando alcun riscontro utile, quindi la rete può essere in difficoltà più seria",
    explanation:
      "Tre ACK duplicati indicano spesso una perdita isolata con rete ancora viva. Il timeout, invece, racconta un'assenza prolungata di feedback e porta a una reazione più drastica.",
  },
  {
    id: "evil-internet-050",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "difficile",
    question:
      "Quale affermazione sul three-way handshake è corretta?",
    options: [
      "Serve a sincronizzare gli stati iniziali della connessione e a negoziare parametri come i numeri di sequenza iniziali",
      "Serve a risolvere i nomi DNS del server prima del collegamento",
      "Serve a costruire la tabella ARP degli switch Ethernet",
      "Serve a trasferire il body HTTP prima ancora che la connessione esista",
    ],
    correctAnswer:
      "Serve a sincronizzare gli stati iniziali della connessione e a negoziare parametri come i numeri di sequenza iniziali",
    explanation:
      "Il handshake non trasporta il servizio applicativo finale, ma prepara il canale affidabile TCP con stato condiviso tra le due estremità.",
  },
  {
    id: "evil-internet-051",
    category: "Internet",
    topic: "sliding window",
    difficulty: "difficile",
    question:
      "Quale affermazione è falsa su Go-Back-N?",
    options: [
      "Il ricevitore conserva e consegna in ordine qualsiasi pacchetto fuori sequenza come in Selective Repeat",
      "Gli ACK sono tipicamente cumulativi",
      "Alla scadenza del timer il mittente può ritrasmettere un blocco di pacchetti non confermati",
      "La finestra del mittente limita quanti pacchetti possono restare in volo senza ACK",
    ],
    correctAnswer:
      "Il ricevitore conserva e consegna in ordine qualsiasi pacchetto fuori sequenza come in Selective Repeat",
    explanation:
      "Quel comportamento è tipico di Selective Repeat, non di Go-Back-N. In GBN il ricevitore è molto più semplice e non gestisce allo stesso modo l'out-of-order.",
  },
  {
    id: "evil-internet-052",
    category: "Internet",
    topic: "sliding window",
    difficulty: "difficile",
    question:
      "Perché Selective Repeat può essere più efficiente di Go-Back-N quando le perdite sono isolate?",
    options: [
      "Perché ritrasmette solo i pacchetti persi, non necessariamente tutto il blocco successivo",
      "Perché elimina del tutto i numeri di sequenza",
      "Perché non usa ACK e quindi non spreca banda di ritorno",
      "Perché sposta il controllo di errore al livello rete",
    ],
    correctAnswer:
      "Perché ritrasmette solo i pacchetti persi, non necessariamente tutto il blocco successivo",
    explanation:
      "Selective Repeat paga una maggiore complessità di stato, ma evita molte ritrasmissioni inutili in presenza di perdite non troppo frequenti.",
  },
  {
    id: "evil-internet-053",
    category: "Internet",
    topic: "sliding window",
    difficulty: "difficile",
    question:
      "Quale frase descrive meglio il receive window annunciato dal destinatario TCP?",
    options: [
      "Comunica quanto spazio libero resta nel buffer di ricezione del destinatario",
      "Misura il numero di router ancora da attraversare",
      "Indica quanti ACK duplicati sono arrivati finora",
      "Definisce il valore iniziale del TTL nel prossimo datagramma",
    ],
    correctAnswer:
      "Comunica quanto spazio libero resta nel buffer di ricezione del destinatario",
    explanation:
      "Il receive window è il cuore del flow control: serve a non saturare il buffer remoto. Non va confuso con la congestion window.",
  },
  {
    id: "evil-internet-054",
    category: "Internet",
    topic: "sliding window",
    difficulty: "difficile",
    question:
      "Quale coppia associa correttamente i due concetti TCP?",
    options: [
      "Receive window -> protegge il ricevitore; congestion window -> protegge la rete",
      "Receive window -> protegge la rete; congestion window -> protegge solo il DNS",
      "Entrambe proteggono esclusivamente il livello di collegamento",
      "Entrambe misurano soltanto la velocità fisica del cavo",
    ],
    correctAnswer:
      "Receive window -> protegge il ricevitore; congestion window -> protegge la rete",
    explanation:
      "Flow control e congestion control sono due problemi distinti. Una finestra guarda alla capacità del ricevitore, l'altra alla salute della rete.",
  },
  {
    id: "evil-internet-055",
    category: "Internet",
    topic: "congestion control",
    difficulty: "difficile",
    question:
      "Quale affermazione è corretta sulla fase di slow start?",
    options: [
      "La crescita della congestion window è rapida, circa esponenziale per RTT, finché non si raggiunge la soglia o un segnale di perdita",
      "La congestion window resta ferma a 1 per tutta la connessione",
      "Il mittente invia nuovi dati solo dopo tre FIN consecutivi",
      "Slow start serve a calcolare il MAC address del gateway",
    ],
    correctAnswer:
      "La crescita della congestion window è rapida, circa esponenziale per RTT, finché non si raggiunge la soglia o un segnale di perdita",
    explanation:
      "Il nome inganna: slow start non significa crescita lenta, ma partenza prudente con aumento veloce per capire quanta capacità c'è.",
  },
  {
    id: "evil-internet-056",
    category: "Internet",
    topic: "congestion control",
    difficulty: "difficile",
    question:
      "Che cosa segnala tipicamente il passaggio oltre la soglia ssthresh?",
    options: [
      "Il passaggio da slow start a congestion avoidance",
      "La chiusura automatica della connessione",
      "La ricostruzione della tabella ARP",
      "L'obbligo di passare da TCP a UDP",
    ],
    correctAnswer: "Il passaggio da slow start a congestion avoidance",
    explanation:
      "ssthresh è lo spartiacque tra crescita aggressiva e crescita più prudente della finestra di congestione.",
  },
  {
    id: "evil-internet-057",
    category: "Internet",
    topic: "congestion control",
    difficulty: "difficile",
    question:
      "Perché il timer di ritrasmissione TCP non può essere fissato una volta per tutte con un numero costante?",
    options: [
      "Perché i ritardi di rete cambiano e il valore deve adattarsi a RTT e variabilità osservati",
      "Perché il timer viene deciso dal DNS root server a ogni connessione",
      "Perché il TTL dell'IP impone casualmente un nuovo timeout",
      "Perché ogni applicazione decide il timer leggendo il MAC del router",
    ],
    correctAnswer:
      "Perché i ritardi di rete cambiano e il valore deve adattarsi a RTT e variabilità osservati",
    explanation:
      "Un valore fisso sarebbe troppo piccolo in certi momenti e troppo grande in altri. TCP usa stime adattive proprio per bilanciare reattività e falsi timeout.",
  },
  {
    id: "evil-internet-058",
    category: "Internet",
    topic: "congestion control",
    difficulty: "difficile",
    question:
      "Quale affermazione sul fast retransmit è la più corretta?",
    options: [
      "Consente di reagire a una probabile perdita prima del timeout, sfruttando ACK duplicati come indizio",
      "Serve a cifrare più in fretta il payload TCP",
      "È il meccanismo con cui DHCP assegna la subnet mask",
      "Sostituisce completamente il bisogno di un timer di ritrasmissione",
    ],
    correctAnswer:
      "Consente di reagire a una probabile perdita prima del timeout, sfruttando ACK duplicati come indizio",
    explanation:
      "L'idea è recuperare più rapidamente una perdita plausibile senza attendere la scadenza del timer. Il timer però resta comunque necessario.",
  },
  {
    id: "evil-internet-059",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "difficile",
    question:
      "Quale affermazione è falsa sul servizio IP?",
    options: [
      "Garantisce consegna ordinata e senza perdite come parte del suo servizio di base",
      "È connectionless",
      "È best effort",
      "Può scartare pacchetti in presenza di congestione",
    ],
    correctAnswer:
      "Garantisce consegna ordinata e senza perdite come parte del suo servizio di base",
    explanation:
      "Questa garanzia non appartiene a IP. Il livello rete Internet è volutamente minimale e non promette ordine o consegna certa.",
  },
  {
    id: "evil-internet-060",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "difficile",
    question:
      "Un host con indirizzo 10.10.14.129/26 qual è il suo indirizzo di rete?",
    options: ["10.10.14.128", "10.10.14.64", "10.10.14.192", "10.10.14.255"],
    correctAnswer: "10.10.14.128",
    explanation:
      "Con prefisso /26 la dimensione del blocco è 64 indirizzi. Il valore 129 cade nell'intervallo 128-191, quindi la rete è 10.10.14.128/26.",
  },
  {
    id: "evil-internet-061",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "difficile",
    question:
      "Quale indirizzo rappresenta il broadcast della sottorete 172.16.8.0/21?",
    options: ["172.16.15.255", "172.16.8.255", "172.16.7.255", "172.16.16.0"],
    correctAnswer: "172.16.15.255",
    explanation:
      "Un /21 copre 2048 indirizzi, cioè blocchi da 8 sul terzo ottetto. La rete 172.16.8.0/21 va da 172.16.8.0 a 172.16.15.255.",
  },
  {
    id: "evil-internet-062",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "difficile",
    question:
      "Quale prefisso CIDR lascia 10 bit per la parte host in IPv4?",
    options: ["/22", "/24", "/20", "/26"],
    correctAnswer: "/22",
    explanation:
      "IPv4 ha 32 bit totali. Se 10 restano agli host, il prefisso di rete è 32 - 10 = 22.",
  },
  {
    id: "evil-internet-063",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "difficile",
    question:
      "Quale frase è più corretta sugli indirizzi IP e MAC lungo un percorso multi-hop senza NAT?",
    options: [
      "Gli IP sorgente e destinazione restano stabili end-to-end, mentre i MAC cambiano a ogni hop",
      "IP e MAC restano invariati dal client fino al server finale",
      "Gli IP cambiano a ogni router, i MAC restano fissi",
      "I MAC restano fissi e gli IP cambiano solo se il TTL scende a zero",
    ],
    correctAnswer:
      "Gli IP sorgente e destinazione restano stabili end-to-end, mentre i MAC cambiano a ogni hop",
    explanation:
      "I frame di livello 2 vengono ricostruiti a ogni tratto locale, quindi cambiano i MAC. Gli IP, invece, identificano gli endpoint del dialogo e restano uguali se non interviene NAT.",
  },
  {
    id: "evil-internet-064",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "difficile",
    question:
      "Quale indirizzo IPv4 è sintatticamente invalido?",
    options: ["192.0.2.1", "151.97.6.4", "203.0.113.300", "8.8.8.8"],
    correctAnswer: "203.0.113.300",
    explanation:
      "Ogni ottetto IPv4 deve stare tra 0 e 255. Il valore 300 nel quarto ottetto rende l'indirizzo sintatticamente scorretto.",
  },
  {
    id: "evil-internet-065",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "difficile",
    question:
      "Che cosa significa davvero la notazione CIDR /28?",
    options: [
      "I primi 28 bit identificano la rete e restano 4 bit per gli host",
      "Restano 28 bit per gli host e 4 per la rete",
      "Il datagramma ha sempre 28 byte di header IP",
      "Ogni pacchetto può attraversare al massimo 28 router",
    ],
    correctAnswer:
      "I primi 28 bit identificano la rete e restano 4 bit per gli host",
    explanation:
      "La notazione CIDR descrive la lunghezza del prefisso di rete. In /28 restano solo 16 indirizzi totali per blocco, di cui 14 host usabili nel caso classico.",
  },
  {
    id: "evil-internet-066",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "difficile",
    question:
      "Perché l'indirizzo 255.255.255.255 non va confuso con il broadcast Ethernet?",
    options: [
      "Perché è un broadcast IPv4 di livello rete, mentre Ethernet usa un indirizzo MAC tutto a FF",
      "Perché è il loopback IPv4 locale del router",
      "Perché è un record DNS speciale e non un indirizzo",
      "Perché identifica un socket UDP predefinito",
    ],
    correctAnswer:
      "Perché è un broadcast IPv4 di livello rete, mentre Ethernet usa un indirizzo MAC tutto a FF",
    explanation:
      "Sono broadcast di livelli diversi: uno vive nell'header IP, l'altro nell'header Ethernet. Confonderli significa mischiare piano di rete e piano di collegamento.",
  },
  {
    id: "evil-internet-067",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "difficile",
    question:
      "Quale operazione fa un host per capire se il destinatario è locale o remoto?",
    options: [
      "Applica la subnet mask al proprio IP e all'IP di destinazione e confronta le parti di rete",
      "Confronta solo i numeri di porta TCP",
      "Invia subito una ARP request al root DNS server",
      "Guarda il TTL del pacchetto di destinazione prima di inviarlo",
    ],
    correctAnswer:
      "Applica la subnet mask al proprio IP e all'IP di destinazione e confronta le parti di rete",
    explanation:
      "Se la parte di rete coincide, il destinatario è locale e si può risolvere il suo MAC. In caso contrario si usa il default gateway.",
  },
  {
    id: "evil-internet-068",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "difficile",
    question:
      "Quale dei seguenti blocchi offre più indirizzi totali?",
    options: ["/20", "/22", "/24", "/27"],
    correctAnswer: "/20",
    explanation:
      "Più corto è il prefisso, più grande è la porzione host. Un /20 lascia 12 bit host e quindi 4096 indirizzi totali.",
  },
  {
    id: "evil-internet-069",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "difficile",
    question:
      "Quale distinzione è corretta tra control plane e data plane?",
    options: [
      "Il control plane costruisce e distribuisce le informazioni di rotta; il data plane inoltra i pacchetti usando quelle informazioni",
      "Il data plane sceglie i sistemi autonomi, il control plane assegna indirizzi MAC ai browser",
      "Il control plane si occupa solo di cavi, il data plane solo di HTML",
      "Sono sinonimi perfetti dello stesso sottosistema",
    ],
    correctAnswer:
      "Il control plane costruisce e distribuisce le informazioni di rotta; il data plane inoltra i pacchetti usando quelle informazioni",
    explanation:
      "Questa separazione è centrale nei capitoli su forwarding e routing. Un piano decide e mantiene la conoscenza, l'altro esegue velocemente per-packet.",
  },
  {
    id: "evil-internet-070",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "difficile",
    question:
      "Quale campo dell'header IP deve certamente cambiare a ogni hop?",
    options: ["TTL", "Indirizzo IP sorgente", "Indirizzo IP destinazione", "Numero di porta"],
    correctAnswer: "TTL",
    explanation:
      "Ogni router decrementa il TTL per evitare loop infiniti. Di conseguenza aggiorna anche l'header checksum, ma il campo che sicuramente cambia è il TTL.",
  },
  {
    id: "evil-internet-071",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "difficile",
    question:
      "Quale protocollo viene usato per segnalare errori come destination unreachable o time exceeded?",
    options: ["ICMP", "DHCP", "ARP", "SMTP"],
    correctAnswer: "ICMP",
    explanation:
      "ICMP affianca IP per funzioni di controllo ed errore. Non è un protocollo applicativo come SMTP né un meccanismo di indirizzamento come ARP o DHCP.",
  },
  {
    id: "evil-internet-072",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "difficile",
    question:
      "Perché traceroute riesce a rivelare il percorso hop-by-hop?",
    options: [
      "Perché sfrutta la scadenza progressiva del TTL e osserva le risposte ICMP dei router intermedi",
      "Perché legge la tabella NAT di ogni gateway remoto",
      "Perché tutti i router pubblicano il proprio MAC nel DNS",
      "Perché il server finale invia indietro la lista completa dei router attraversati",
    ],
    correctAnswer:
      "Perché sfrutta la scadenza progressiva del TTL e osserva le risposte ICMP dei router intermedi",
    explanation:
      "Traceroute non riceve la rotta 'in regalo': la ricostruisce forzando il TTL a scadere progressivamente lungo il cammino.",
  },
  {
    id: "evil-internet-073",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "difficile",
    question:
      "Quale affermazione su Dijkstra è falsa?",
    options: [
      "Lavora solo con informazione locale dei vicini e non richiede una vista globale della topologia",
      "Calcola cammini minimi a partire da un nodo sorgente",
      "È associato alla famiglia link-state",
      "Può essere usato in protocolli di routing dinamici",
    ],
    correctAnswer:
      "Lavora solo con informazione locale dei vicini e non richiede una vista globale della topologia",
    explanation:
      "Questa è la descrizione più vicina al distance vector. Dijkstra lavora bene proprio quando il router possiede o ricostruisce una vista globale della topologia.",
  },
  {
    id: "evil-internet-074",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "difficile",
    question:
      "Quale descrizione del distance vector è corretta?",
    options: [
      "Ogni router aggiorna la propria stima dei costi scambiando informazioni con i vicini",
      "Ogni router ha da subito la mappa completa e non scambia nulla",
      "L'algoritmo ignora totalmente i costi dei link",
      "Serve solo a distribuire indirizzi IP via broadcast",
    ],
    correctAnswer:
      "Ogni router aggiorna la propria stima dei costi scambiando informazioni con i vicini",
    explanation:
      "È proprio il cuore dell'approccio distance vector: conoscenza locale, scambio iterativo e aggiornamento delle stime verso le destinazioni.",
  },
  {
    id: "evil-internet-075",
    category: "Internet",
    topic: "NAT",
    difficulty: "difficile",
    question:
      "Quale affermazione è falsa sul NAT overload?",
    options: [
      "Garantisce anonimato assoluto verso l'ISP e i servizi remoti",
      "Permette a più host privati di condividere un indirizzo pubblico",
      "Usa tipicamente le porte per distinguere flussi diversi",
      "Costruisce una tabella di traduzione che associa comunicazioni interne ed esterne",
    ],
    correctAnswer: "Garantisce anonimato assoluto verso l'ISP e i servizi remoti",
    explanation:
      "NAT non equivale ad anonimato forte. Nasconde la struttura interna della LAN, ma non elimina la visibilità dell'indirizzo pubblico o di altre informazioni contestuali.",
  },
  {
    id: "evil-internet-076",
    category: "Internet",
    topic: "NAT",
    difficulty: "difficile",
    question:
      "Perché un singolo IP pubblico condiviso via NAT non supporta connessioni illimitate contemporanee?",
    options: [
      "Perché lo spazio delle porte usate per distinguere i flussi non è infinito",
      "Perché IP vieta più di una connessione per indirizzo",
      "Perché ARP limita a 255 i client dietro al NAT",
      "Perché TTL e NAT condividono lo stesso campo da 16 bit",
    ],
    correctAnswer:
      "Perché lo spazio delle porte usate per distinguere i flussi non è infinito",
    explanation:
      "Il NAT overload multiplexa molti flussi su poche risorse esterne distinguendoli soprattutto con le porte. Proprio per questo esiste un limite pratico e teorico.",
  },
  {
    id: "evil-internet-077",
    category: "Internet",
    topic: "DHCP",
    difficulty: "difficile",
    question:
      "Quale sequenza rappresenta correttamente il bootstrap DHCP IPv4?",
    options: [
      "Discover, Offer, Request, Acknowledge",
      "SYN, SYN-ACK, ACK, FIN",
      "Hello, Certificate, Key Exchange, Data",
      "ARP, ARP Reply, TTL, ICMP",
    ],
    correctAnswer: "Discover, Offer, Request, Acknowledge",
    explanation:
      "La sequenza DORA è quella classica di DHCP. Le altre descrivono invece altri protocolli o un miscuglio di concetti diversi.",
  },
  {
    id: "evil-internet-078",
    category: "Internet",
    topic: "DHCP",
    difficulty: "difficile",
    question:
      "Perché DHCP usa comunemente UDP invece di TCP nella fase iniziale?",
    options: [
      "Perché il client non ha ancora una configurazione completa adatta a instaurare una sessione TCP classica",
      "Perché DHCP richiede per definizione consegna ordinata byte-stream",
      "Perché UDP aggiunge autenticazione del server tramite certificati",
      "Perché TCP non ha numeri di porta",
    ],
    correctAnswer:
      "Perché il client non ha ancora una configurazione completa adatta a instaurare una sessione TCP classica",
    explanation:
      "DHCP deve funzionare proprio quando l'host è ancora in fase di bootstrap. L'uso di UDP e del broadcast si adatta bene a questo contesto.",
  },
  {
    id: "evil-internet-079",
    category: "Internet",
    topic: "Ethernet",
    difficulty: "difficile",
    question:
      "Quale affermazione è falsa su Ethernet 802.3 classica?",
    options: [
      "Usa CSMA/CA come meccanismo storico tipico del mezzo condiviso",
      "È associata al livello di collegamento",
      "Fornisce un servizio best effort e non affidabile",
      "Può includere un FCS basato su CRC per rilevare errori",
    ],
    correctAnswer:
      "Usa CSMA/CA come meccanismo storico tipico del mezzo condiviso",
    explanation:
      "CSMA/CA è la logica tipica del Wi-Fi. L'Ethernet condivisa classica è associata a CSMA/CD.",
  },
  {
    id: "evil-internet-080",
    category: "Internet",
    topic: "MAC address",
    difficulty: "difficile",
    question:
      "Quale affermazione sul MAC address è corretta?",
    options: [
      "Identifica l'interfaccia nel dominio di collegamento e non sostituisce l'indirizzo IP nel routing",
      "Resta invariato end-to-end come unico riferimento per i router Internet",
      "È il numero di porta dell'applicazione locale scritto in esadecimale",
      "È assegnato dal DNS ogni volta che cambia l'IP dell'host",
    ],
    correctAnswer:
      "Identifica l'interfaccia nel dominio di collegamento e non sostituisce l'indirizzo IP nel routing",
    explanation:
      "Il MAC serve alla consegna locale dei frame. Il routing multi-hop usa IP e tabelle di livello 3.",
  },
  {
    id: "evil-internet-081",
    category: "Internet",
    topic: "ARP",
    difficulty: "difficile",
    question:
      "Quale frase è falsa su una ARP request standard?",
    options: [
      "Il campo IP target del payload ARP viene posto uguale a 255.255.255.255",
      "Il frame Ethernet che la trasporta viene tipicamente inviato in broadcast",
      "Il mittente include nel payload il proprio MAC e il proprio IP",
      "Serve a ottenere il MAC associato a un IP noto nella LAN",
    ],
    correctAnswer:
      "Il campo IP target del payload ARP viene posto uguale a 255.255.255.255",
    explanation:
      "Nel payload ARP compare l'IP specifico che si vuole risolvere. Il broadcast riguarda il MAC di livello 2 del frame, non il target IP richiesto nel messaggio ARP.",
  },
  {
    id: "evil-internet-082",
    category: "Internet",
    topic: "ARP",
    difficulty: "difficile",
    question:
      "Perché una ARP reply non ha bisogno di essere broadcast come la request?",
    options: [
      "Perché il mittente originario è già noto e la risposta può essere inviata direttamente al suo MAC",
      "Perché le ARP reply viaggiano sempre sopra TCP",
      "Perché una reply ARP contiene solo il TTL e non l'indirizzo target",
      "Perché gli switch vietano i frame unicast nel caso di ARP",
    ],
    correctAnswer:
      "Perché il mittente originario è già noto e la risposta può essere inviata direttamente al suo MAC",
    explanation:
      "La request serve proprio a farsi conoscere e a raccogliere una risposta. Una volta noto il richiedente, la reply può essere unicast.",
  },
  {
    id: "evil-internet-083",
    category: "Internet",
    topic: "switch",
    difficulty: "difficile",
    question:
      "Quale comportamento è corretto per uno switch quando riceve un frame destinato a un MAC sconosciuto?",
    options: [
      "Fa flooding sulle altre porte, mantenendo però l'apprendimento del MAC sorgente",
      "Scarta sempre il frame per sicurezza",
      "Lo invia al router di default per chiedere dove inoltrarlo",
      "Converte il frame in datagramma IP e poi lo ritrasmette",
    ],
    correctAnswer:
      "Fa flooding sulle altre porte, mantenendo però l'apprendimento del MAC sorgente",
    explanation:
      "Lo switch impara dal MAC sorgente e, se non conosce il destinatario, diffonde il frame sulle altre porte per tentare la consegna.",
  },
  {
    id: "evil-internet-084",
    category: "Internet",
    topic: "switch",
    difficulty: "difficile",
    question:
      "Quale vantaggio offre lo switching rispetto a un hub classico?",
    options: [
      "Può isolare meglio i domini di collisione e inoltrare in modo selettivo in base ai MAC",
      "Sostituisce direttamente il DNS e il DHCP",
      "Rende inutile il livello di rete",
      "Trasforma ogni LAN in un sistema autonomo BGP",
    ],
    correctAnswer:
      "Può isolare meglio i domini di collisione e inoltrare in modo selettivo in base ai MAC",
    explanation:
      "Lo switch non si limita a rigenerare il segnale come un hub: osserva gli indirizzi MAC e inoltra in modo molto più mirato.",
  },
  {
    id: "evil-internet-085",
    category: "Internet",
    topic: "livello collegamento",
    difficulty: "difficile",
    question:
      "Che cosa contiene tipicamente il trailer di un frame Ethernet?",
    options: ["Un FCS/CRC per rilevamento errori", "Il record MX del dominio", "Il TTL", "La porta TCP di destinazione"],
    correctAnswer: "Un FCS/CRC per rilevamento errori",
    explanation:
      "Il trailer Ethernet chiude il frame con una firma numerica utile a rilevare corruzioni sul link. Non contiene campi di rete o trasporto.",
  },
  {
    id: "evil-internet-086",
    category: "Internet",
    topic: "livello collegamento",
    difficulty: "difficile",
    question:
      "Perché si dice che il livello di collegamento offre una consegna hop-by-hop e non end-to-end?",
    options: [
      "Perché ogni frame vale solo sul singolo tratto locale tra nodi adiacenti e viene ricostruito ai salti successivi",
      "Perché ogni frame attraversa Internet senza mai essere ritoccato",
      "Perché il livello di collegamento garantisce la semantica delle richieste HTTP",
      "Perché ARP e DNS svolgono sempre lo stesso compito",
    ],
    correctAnswer:
      "Perché ogni frame vale solo sul singolo tratto locale tra nodi adiacenti e viene ricostruito ai salti successivi",
    explanation:
      "Il frame è un contenitore locale. A ogni hop cambia il contesto di livello 2 e il pacchetto IP viene reincapsulato in un nuovo frame adatto al collegamento successivo.",
  },
  {
    id: "evil-internet-087",
    category: "Internet",
    topic: "Wi-Fi e reti mobili",
    difficulty: "difficile",
    question:
      "Perché il Wi-Fi adotta CSMA/CA invece di CSMA/CD come Ethernet classica?",
    options: [
      "Perché in radio è molto più pratico tentare di evitare la collisione prima che rilevarla con affidabilità durante la trasmissione",
      "Perché il Wi-Fi non usa indirizzi MAC",
      "Perché il Wi-Fi lavora solo a livello applicativo",
      "Perché i frame 802.11 non possono avere più di un indirizzo",
    ],
    correctAnswer:
      "Perché in radio è molto più pratico tentare di evitare la collisione prima che rilevarla con affidabilità durante la trasmissione",
    explanation:
      "In ambiente wireless trasmettere e ascoltare contemporaneamente in modo utile è difficile. Per questo si punta molto sull'evitare collisioni tramite ascolto e backoff.",
  },
  {
    id: "evil-internet-088",
    category: "Internet",
    topic: "Wi-Fi e reti mobili",
    difficulty: "difficile",
    question:
      "Quale affermazione è corretta sull'header MAC 802.11?",
    options: [
      "Può contenere fino a quattro campi indirizzo perché deve rappresentare più ruoli in scenari wireless",
      "Contiene sempre e soltanto un indirizzo, come i pacchetti UDP",
      "Non usa mai il concetto di mittente e destinatario distinti",
      "È identico bit per bit a un frame Ethernet 802.3",
    ],
    correctAnswer:
      "Può contenere fino a quattro campi indirizzo perché deve rappresentare più ruoli in scenari wireless",
    explanation:
      "Wi-Fi deve gestire non solo sorgente e destinazione, ma anche il ruolo dell'access point e di eventuali sistemi di distribuzione. Per questo l'header è più flessibile.",
  },
  {
    id: "evil-internet-089",
    category: "Internet",
    topic: "Wi-Fi e reti mobili",
    difficulty: "difficile",
    question:
      "Che cosa fa il backoff casuale in una rete 802.11?",
    options: [
      "Riduce la probabilità che più stazioni ritrasmettano nello stesso istante dopo un canale occupato o una collisione percepita",
      "Ricalcola il prefisso CIDR della WLAN",
      "Rinnova il certificato TLS dell'access point",
      "Determina la mailbox SMTP del client mobile",
    ],
    correctAnswer:
      "Riduce la probabilità che più stazioni ritrasmettano nello stesso istante dopo un canale occupato o una collisione percepita",
    explanation:
      "Il backoff distribuisce nel tempo i tentativi dei nodi e aiuta a evitare nuove collisioni immediate sul mezzo radio condiviso.",
  },
  {
    id: "evil-internet-090",
    category: "Internet",
    topic: "Wi-Fi e reti mobili",
    difficulty: "difficile",
    question:
      "Quale descrizione è più corretta per un access point 802.11 in una WLAN infrastrutturata?",
    options: [
      "Agisce come punto di accesso al dominio wireless e ponte verso la rete locale",
      "Sostituisce ogni funzione del router di frontiera verso Internet",
      "Calcola le rotte interdominio con BGP",
      "Firma digitalmente tutti i pacchetti IP in uscita",
    ],
    correctAnswer:
      "Agisce come punto di accesso al dominio wireless e ponte verso la rete locale",
    explanation:
      "L'access point fornisce accesso radio e integrazione con la LAN. Non è automaticamente un router Internet né un protocollo di sicurezza crittografica.",
  },
  {
    id: "evil-security-091",
    category: "Sicurezza",
    topic: "concetti base CIA: confidenzialità, integrità, disponibilità",
    difficulty: "difficile",
    question:
      "Quale situazione colpisce più direttamente la disponibilità e non la sola confidenzialità dei dati?",
    options: [
      "Un attacco che rende il servizio irraggiungibile agli utenti legittimi",
      "La lettura non autorizzata di un file cifrato",
      "La verifica di una firma digitale su un documento",
      "La generazione di una chiave pubblica per HTTPS",
    ],
    correctAnswer:
      "Un attacco che rende il servizio irraggiungibile agli utenti legittimi",
    explanation:
      "Disponibilità significa poter usare davvero il servizio quando serve. Un sistema perfettamente cifrato ma non raggiungibile resta comunque un problema di sicurezza.",
  },
  {
    id: "evil-security-092",
    category: "Sicurezza",
    topic: "concetti base CIA: confidenzialità, integrità, disponibilità",
    difficulty: "difficile",
    question:
      "Quale affermazione è falsa sulla triade CIA?",
    options: [
      "La crittografia da sola garantisce automaticamente anche la disponibilità del servizio",
      "L'integrità riguarda la non alterazione non autorizzata dei dati",
      "La confidenzialità punta a impedire la lettura da parte di soggetti non autorizzati",
      "La disponibilità richiede anche misure operative e infrastrutturali",
    ],
    correctAnswer:
      "La crittografia da sola garantisce automaticamente anche la disponibilità del servizio",
    explanation:
      "La crittografia è fortissima su confidenzialità e, con gli strumenti giusti, anche su integrità e autenticità. La disponibilità però richiede capacità, ridondanza e resilienza operativa.",
  },
  {
    id: "evil-security-093",
    category: "Sicurezza",
    topic: "crittografia simmetrica",
    difficulty: "difficile",
    question:
      "Quale problema rimane centrale anche se un algoritmo simmetrico è matematicamente robusto?",
    options: [
      "La distribuzione sicura della chiave condivisa",
      "La scelta del MAC address del server",
      "La compilazione della tabella ARP del client",
      "L'assegnazione di record MX alla casella mail",
    ],
    correctAnswer: "La distribuzione sicura della chiave condivisa",
    explanation:
      "La forza della cifratura simmetrica dipende tantissimo dal fatto che la chiave resti segreta. Condividerla in modo sicuro è il problema classico di questa famiglia.",
  },
  {
    id: "evil-security-094",
    category: "Sicurezza",
    topic: "crittografia simmetrica",
    difficulty: "difficile",
    question:
      "Perché i sistemi moderni usano spesso cifratura simmetrica dopo un handshake iniziale asimmetrico?",
    options: [
      "Perché la cifratura simmetrica è molto più efficiente nel trattare grandi volumi di dati",
      "Perché l'asimmetrica non può mai autenticare il server",
      "Perché la simmetrica elimina il bisogno della chiave di sessione",
      "Perché TLS vieta l'uso della crittografia asimmetrica per scambiare segreti",
    ],
    correctAnswer:
      "Perché la cifratura simmetrica è molto più efficiente nel trattare grandi volumi di dati",
    explanation:
      "L'ibridazione è una scelta pratica: asimmetrica per autenticare e accordarsi, simmetrica per trasportare i dati di sessione senza costi computazionali troppo alti.",
  },
  {
    id: "evil-security-095",
    category: "Sicurezza",
    topic: "crittografia simmetrica",
    difficulty: "difficile",
    question:
      "Quale frase distingue correttamente cifratura simmetrica e hash crittografico?",
    options: [
      "La cifratura simmetrica è reversibile con la chiave giusta; l'hash non nasce per essere invertito",
      "Entrambi servono solo a costruire subnet IPv4",
      "L'hash usa sempre la stessa chiave segreta del cifrario",
      "La cifratura simmetrica non può proteggere alcun contenuto applicativo",
    ],
    correctAnswer:
      "La cifratura simmetrica è reversibile con la chiave giusta; l'hash non nasce per essere invertito",
    explanation:
      "Sono strumenti diversi: uno serve a nascondere e poi recuperare il contenuto, l'altro a produrre un'impronta utile per integrità o altre funzioni.",
  },
  {
    id: "evil-security-096",
    category: "Sicurezza",
    topic: "crittografia asimmetrica",
    difficulty: "difficile",
    question:
      "Quale frase è corretta sulla crittografia asimmetrica?",
    options: [
      "Usa una coppia di chiavi correlate con ruoli diversi, una pubblica e una privata",
      "Usa sempre un solo segreto condiviso da tutte le parti coinvolte",
      "Non può essere usata in alcun modo per firme digitali",
      "Serve solo per il routing tra sistemi autonomi",
    ],
    correctAnswer:
      "Usa una coppia di chiavi correlate con ruoli diversi, una pubblica e una privata",
    explanation:
      "La separazione tra chiave pubblica e privata è l'idea che rende possibile autenticazione, scambio di segreti e firme senza un segreto condiviso iniziale.",
  },
  {
    id: "evil-security-097",
    category: "Sicurezza",
    topic: "RSA",
    difficulty: "difficile",
    question:
      "Quale problema matematico sostiene classicamente la sicurezza di RSA?",
    options: [
      "La difficoltà di fattorizzare il prodotto di grandi numeri primi",
      "La difficoltà di fare broadcast Ethernet senza collisioni",
      "La difficoltà di risolvere record MX autoritativi",
      "La difficoltà di calcolare il TTL corretto del pacchetto",
    ],
    correctAnswer:
      "La difficoltà di fattorizzare il prodotto di grandi numeri primi",
    explanation:
      "RSA costruisce il proprio modulo come prodotto di primi grandi. Se la fattorizzazione diventasse semplice, la sicurezza del sistema crollerebbe.",
  },
  {
    id: "evil-security-098",
    category: "Sicurezza",
    topic: "RSA",
    difficulty: "difficile",
    question:
      "Nel caso di una firma RSA, quale chiave produce la firma e quale la verifica?",
    options: [
      "La privata del firmatario produce la firma, la pubblica del firmatario la verifica",
      "La pubblica del firmatario produce la firma, la privata del destinatario la verifica",
      "La privata della CA produce sempre ogni firma applicativa utente",
      "La pubblica del server produce la firma, il DNS la verifica",
    ],
    correctAnswer:
      "La privata del firmatario produce la firma, la pubblica del firmatario la verifica",
    explanation:
      "La firma è credibile proprio perché solo chi possiede la chiave privata poteva generarla. La verifica usa invece la corrispondente chiave pubblica.",
  },
  {
    id: "evil-security-099",
    category: "Sicurezza",
    topic: "RSA",
    difficulty: "difficile",
    question:
      "Perché non si usa normalmente RSA puro per cifrare grandi flussi di dati della sessione?",
    options: [
      "Perché è molto più costoso della cifratura simmetrica e viene usato meglio per handshake, scambio segreti o firme",
      "Perché RSA non può gestire numeri binari",
      "Perché RSA funziona solo dentro i pacchetti ARP",
      "Perché RSA non usa mai chiavi pubbliche",
    ],
    correctAnswer:
      "Perché è molto più costoso della cifratura simmetrica e viene usato meglio per handshake, scambio segreti o firme",
    explanation:
      "La crittografia asimmetrica è preziosa ma costosa. Nei sistemi reali viene tipicamente usata per avviare la fiducia, non per cifrare ogni byte del traffico.",
  },
  {
    id: "evil-security-100",
    category: "Sicurezza",
    topic: "RSA",
    difficulty: "difficile",
    question:
      "Quale affermazione è falsa su RSA?",
    options: [
      "La chiave pubblica deve restare segreta come la chiave privata",
      "La sicurezza pratica dipende anche da padding e implementazione, non solo dalla matematica ideale",
      "Chiavi troppo corte rendono il sistema più attaccabile",
      "RSA è un esempio di crittografia a chiave pubblica",
    ],
    correctAnswer:
      "La chiave pubblica deve restare segreta come la chiave privata",
    explanation:
      "La chiave pubblica, per definizione, può essere distribuita. Proteggere quella privata è invece essenziale.",
  },
  {
    id: "evil-security-101",
    category: "Sicurezza",
    topic: "Diffie-Hellman",
    difficulty: "difficile",
    question:
      "Quale scopo ha Diffie-Hellman in un protocollo moderno?",
    options: [
      "Far concordare a due parti una chiave condivisa anche su un canale non fidato",
      "Firmare da solo certificati X.509 come una CA",
      "Sostituire l'indirizzamento IP locale",
      "Fornire routing intra-AS basato su costo",
    ],
    correctAnswer:
      "Far concordare a due parti una chiave condivisa anche su un canale non fidato",
    explanation:
      "Diffie-Hellman nasce per questo: accordarsi su un segreto comune senza inviarlo direttamente in chiaro sul canale osservabile.",
  },
  {
    id: "evil-security-102",
    category: "Sicurezza",
    topic: "Diffie-Hellman",
    difficulty: "difficile",
    question:
      "Quale debolezza ha Diffie-Hellman se usato senza autenticazione della controparte?",
    options: [
      "È vulnerabile al man-in-the-middle",
      "Non può produrre alcun segreto condiviso",
      "Rivela automaticamente la chiave privata finale",
      "Impedisce la forward secrecy",
    ],
    correctAnswer: "È vulnerabile al man-in-the-middle",
    explanation:
      "DH può produrre un segreto anche con un aggressore in mezzo se nessuno autentica davvero con chi sta parlando. È qui che entrano in gioco firme e certificati.",
  },
  {
    id: "evil-security-103",
    category: "Sicurezza",
    topic: "Diffie-Hellman",
    difficulty: "difficile",
    question:
      "Perché le varianti effimere di Diffie-Hellman sono apprezzate nei protocolli sicuri?",
    options: [
      "Perché aiutano a ottenere forward secrecy, limitando l'impatto della compromissione futura di chiavi a lungo termine",
      "Perché eliminano per sempre il bisogno di autenticazione",
      "Perché sostituiscono la necessità di hash o HMAC",
      "Perché rendono impossibile ogni attacco di replay senza altri meccanismi",
    ],
    correctAnswer:
      "Perché aiutano a ottenere forward secrecy, limitando l'impatto della compromissione futura di chiavi a lungo termine",
    explanation:
      "La forward secrecy è preziosa: se una chiave a lungo termine viene rubata in futuro, non deve permettere di decifrare automaticamente tutte le sessioni passate.",
  },
  {
    id: "evil-security-104",
    category: "Sicurezza",
    topic: "hash",
    difficulty: "difficile",
    question:
      "Quale proprietà di una funzione hash rende poco pratico trovare due input diversi con lo stesso digest?",
    options: [
      "La resistenza alle collisioni",
      "L'orientamento alla connessione",
      "Il controllo di flusso",
      "La capacità di fare routing distribuito",
    ],
    correctAnswer: "La resistenza alle collisioni",
    explanation:
      "Collision resistance significa proprio questo: trovare due input con lo stesso hash deve essere computazionalmente impraticabile.",
  },
  {
    id: "evil-security-105",
    category: "Sicurezza",
    topic: "hash",
    difficulty: "difficile",
    question:
      "Perché è scorretto trattare un hash come se fosse una cifratura reversibile?",
    options: [
      "Perché l'hash produce un'impronta a dimensione fissa e non nasce per essere invertito come un cifrario",
      "Perché usa sempre la chiave privata del destinatario",
      "Perché ogni hash contiene il MAC address del mittente",
      "Perché un hash può essere letto solo da chi possiede il DNS locale",
    ],
    correctAnswer:
      "Perché l'hash produce un'impronta a dimensione fissa e non nasce per essere invertito come un cifrario",
    explanation:
      "Hash e cifratura risolvono problemi diversi. L'hash non serve a recuperare il contenuto originale, ma a riassumerlo e verificare proprietà di integrità.",
  },
  {
    id: "evil-security-106",
    category: "Sicurezza",
    topic: "HMAC",
    difficulty: "difficile",
    question:
      "Che cosa aggiunge HMAC rispetto a un semplice hash del messaggio?",
    options: [
      "Una chiave segreta condivisa che rafforza autenticità e integrità del messaggio",
      "La possibilità di ricostruire il plaintext originale dal digest",
      "Un meccanismo di instradamento verso il server corretto",
      "La sostituzione dei certificati TLS sul server",
    ],
    correctAnswer:
      "Una chiave segreta condivisa che rafforza autenticità e integrità del messaggio",
    explanation:
      "Con un semplice hash chiunque può ricalcolare il digest. Con HMAC, invece, solo chi conosce la chiave segreta può produrre un tag valido.",
  },
  {
    id: "evil-security-107",
    category: "Sicurezza",
    topic: "HMAC",
    difficulty: "difficile",
    question:
      "Quale frase su HMAC è falsa?",
    options: [
      "Sostituisce completamente il bisogno di chiavi condivise perché usa solo informazione pubblica",
      "Può essere usato per autenticare l'integrità di un messaggio tra parti che condividono un segreto",
      "Non è la stessa cosa di una firma digitale asimmetrica",
      "È costruito combinando una funzione hash con una chiave segreta",
    ],
    correctAnswer:
      "Sostituisce completamente il bisogno di chiavi condivise perché usa solo informazione pubblica",
    explanation:
      "HMAC vive proprio sull'idea di chiave segreta condivisa. Senza quel segreto non otterresti l'effetto di autenticazione desiderato.",
  },
  {
    id: "evil-security-108",
    category: "Sicurezza",
    topic: "hash",
    difficulty: "difficile",
    question:
      "Perché il salt è utile nella memorizzazione delle password hashate?",
    options: [
      "Perché rende meno convenienti tabelle precomputate e impedisce che password uguali producano sempre hash identici tra utenti",
      "Perché permette di decifrare la password in caso di dimenticanza",
      "Perché sostituisce il bisogno di usare una funzione hash robusta",
      "Perché abbassa il costo computazionale dell'attaccante offline",
    ],
    correctAnswer:
      "Perché rende meno convenienti tabelle precomputate e impedisce che password uguali producano sempre hash identici tra utenti",
    explanation:
      "Il salt spezza molte scorciatoie basate sulla riusabilità del lavoro dell'attaccante. Va però combinato con algoritmi adeguati e parametrizzati bene.",
  },
  {
    id: "evil-security-109",
    category: "Sicurezza",
    topic: "firma digitale",
    difficulty: "difficile",
    question:
      "Quale combinazione di proprietà è più legata a una firma digitale correttamente verificata?",
    options: [
      "Integrità del contenuto, autenticità dell'origine e supporto al non ripudio",
      "Disponibilità garantita del server e bilanciamento del carico",
      "Instradamento hop-by-hop e traduzione DNS",
      "Assegnazione IP e gestione del buffer TCP",
    ],
    correctAnswer:
      "Integrità del contenuto, autenticità dell'origine e supporto al non ripudio",
    explanation:
      "Una firma digitale non rende disponibile un servizio né instrada pacchetti. Serve a legare autore e contenuto in modo verificabile.",
  },
  {
    id: "evil-security-110",
    category: "Sicurezza",
    topic: "firma digitale",
    difficulty: "difficile",
    question:
      "Perché si firma spesso l'hash del documento e non l'intero documento raw con un algoritmo asimmetrico puro?",
    options: [
      "Per efficienza e praticità, mantenendo comunque il legame con l'integrità del contenuto",
      "Perché gli algoritmi di firma non possono accettare input binari",
      "Perché il DNS richiede sempre un digest di 48 bit",
      "Perché l'hash contiene già il certificato della CA",
    ],
    correctAnswer:
      "Per efficienza e praticità, mantenendo comunque il legame con l'integrità del contenuto",
    explanation:
      "Firmare il digest è molto più efficiente e conserva il legame semantico con l'intero documento, perché ogni modifica significativa cambierebbe l'hash.",
  },
  {
    id: "evil-security-111",
    category: "Sicurezza",
    topic: "certificati e PKI",
    difficulty: "difficile",
    question:
      "Che cosa attesta davvero un certificato X.509 in una PKI classica?",
    options: [
      "L'associazione tra una chiave pubblica e un'identità o nome, firmata da una CA fidata",
      "La password in chiaro del server per emergenze",
      "Il MAC address fisico del browser client",
      "La finestra TCP massima concessa dal server",
    ],
    correctAnswer:
      "L'associazione tra una chiave pubblica e un'identità o nome, firmata da una CA fidata",
    explanation:
      "Il certificato non è magia autonoma: è una dichiarazione firmata che lega una chiave a un'identità secondo la fiducia riposta nella CA.",
  },
  {
    id: "evil-security-112",
    category: "Sicurezza",
    topic: "certificati e PKI",
    difficulty: "difficile",
    question:
      "Quale ruolo ha una Certification Authority nella PKI?",
    options: [
      "Firma certificati dopo aver verificato le informazioni previste dal proprio processo di emissione",
      "Assegna porte TCP casuali ai browser che aprono HTTPS",
      "Converte ogni record DNS in chiave pubblica",
      "Gestisce le collisioni Ethernet nelle LAN aziendali",
    ],
    correctAnswer:
      "Firma certificati dopo aver verificato le informazioni previste dal proprio processo di emissione",
    explanation:
      "La CA è il nodo di fiducia che permette ai client di accettare l'associazione tra identità e chiave pubblica attraverso la propria firma.",
  },
  {
    id: "evil-security-113",
    category: "Sicurezza",
    topic: "certificati e PKI",
    difficulty: "difficile",
    question:
      "Perché verificare solo la presenza di un certificato non basta a fidarsi del server?",
    options: [
      "Perché bisogna validare anche firma, catena, nome richiesto e periodo di validità",
      "Perché un certificato basta solo se il server usa UDP",
      "Perché la fiducia viene data dal MAC address e non dalla PKI",
      "Perché il certificato non contiene mai alcuna chiave pubblica",
    ],
    correctAnswer:
      "Perché bisogna validare anche firma, catena, nome richiesto e periodo di validità",
    explanation:
      "La sicurezza di HTTPS non dipende dal semplice possesso di un file certificato, ma dalla corretta validazione di tutto il contesto di fiducia.",
  },
  {
    id: "evil-security-114",
    category: "Sicurezza",
    topic: "HTTPS/TLS",
    difficulty: "difficile",
    question:
      "In quale momento il client dovrebbe verificare l'identità del server in HTTPS?",
    options: [
      "Durante il TLS handshake, prima di affidare dati sensibili al canale",
      "Solo dopo aver ricevuto tutto il body applicativo",
      "Durante la fase DHCP iniziale del boot",
      "Quando il router decrementa per la prima volta il TTL",
    ],
    correctAnswer:
      "Durante il TLS handshake, prima di affidare dati sensibili al canale",
    explanation:
      "Se la verifica arrivasse dopo, il client potrebbe aver già consegnato informazioni a un impostore. L'autenticazione va fatta prima di fidarsi del canale.",
  },
  {
    id: "evil-security-115",
    category: "Sicurezza",
    topic: "HTTPS/TLS",
    difficulty: "difficile",
    question:
      "Quale frase è falsa sul rapporto tra HTTPS e TLS?",
    options: [
      "HTTPS elimina la necessità di autenticare il server tramite certificati",
      "HTTPS sfrutta TLS per aggiungere confidenzialità e integrità al traffico HTTP",
      "Dopo l'handshake TLS è tipico l'uso di chiavi di sessione simmetriche",
      "Il server può presentare una catena di certificati durante la fase iniziale",
    ],
    correctAnswer:
      "HTTPS elimina la necessità di autenticare il server tramite certificati",
    explanation:
      "È il contrario: i certificati sono un pezzo centrale del modello HTTPS classico per l'autenticazione del server.",
  },
  {
    id: "evil-security-116",
    category: "Sicurezza",
    topic: "HTTPS/TLS",
    difficulty: "difficile",
    question:
      "Perché un attacco man-in-the-middle diventa molto più difficile quando TLS è usato correttamente?",
    options: [
      "Perché il client verifica l'identità del server e negozia chiavi di sessione solo dopo quella validazione",
      "Perché TLS elimina la necessità di qualunque chiave",
      "Perché ogni pacchetto IP contiene il MAC address della CA",
      "Perché il browser passa automaticamente a un circuito dedicato",
    ],
    correctAnswer:
      "Perché il client verifica l'identità del server e negozia chiavi di sessione solo dopo quella validazione",
    explanation:
      "Il punto non è 'cifrare a caso', ma cifrare con la controparte giusta. La validazione del certificato impedisce proprio la sostituzione dell'identità remota.",
  },
  {
    id: "evil-security-117",
    category: "Sicurezza",
    topic: "autenticazione",
    difficulty: "difficile",
    question:
      "Quale combinazione rappresenta davvero autenticazione a più fattori e non due fattori della stessa categoria?",
    options: [
      "Password più token temporaneo su smartphone",
      "Password più PIN diverso",
      "Due password lunghe in due schermate consecutive",
      "Password più domanda segreta",
    ],
    correctAnswer: "Password più token temporaneo su smartphone",
    explanation:
      "Qui si combinano conoscenza e possesso. Due password o una password più una domanda segreta restano esempi della stessa famiglia 'qualcosa che sai'.",
  },
  {
    id: "evil-security-118",
    category: "Sicurezza",
    topic: "Kerberos",
    difficulty: "difficile",
    question:
      "Che ruolo ha il Ticket Granting Ticket in Kerberos?",
    options: [
      "Permette di ottenere ticket di servizio successivi senza reinserire ogni volta la password",
      "Sostituisce l'intero protocollo IPsec per il tunneling",
      "Assegna indirizzi IPv4 ai client del dominio",
      "Calcola la finestra di congestione del trasporto",
    ],
    correctAnswer:
      "Permette di ottenere ticket di servizio successivi senza reinserire ogni volta la password",
    explanation:
      "Il TGT abilita il single sign-on nel dominio Kerberos. Dopo l'autenticazione iniziale, il client usa quel ticket per chiedere ticket specifici ai servizi.",
  },
  {
    id: "evil-security-119",
    category: "Sicurezza",
    topic: "VPN",
    difficulty: "difficile",
    question:
      "Quale descrizione di una VPN è la più accurata?",
    options: [
      "Crea un canale logico protetto sopra una rete non fidata, spesso tramite incapsulamento, autenticazione e cifratura",
      "È un sostituto del DNS che elimina la necessità di record autoritativi",
      "Rende impossibile qualsiasi forma di autenticazione utente",
      "Riduce sempre la latenza fisica di propagazione tra due continenti",
    ],
    correctAnswer:
      "Crea un canale logico protetto sopra una rete non fidata, spesso tramite incapsulamento, autenticazione e cifratura",
    explanation:
      "Questa è l'idea di base della VPN. Non è un acceleratore magico né un sostituto dei servizi di naming o autenticazione.",
  },
  {
    id: "evil-security-120",
    category: "Sicurezza",
    topic: "attacchi principali",
    difficulty: "difficile",
    question:
      "Quale meccanismo aiuta più direttamente a fermare un replay di un messaggio autentico ma vecchio?",
    options: [
      "Nonce, sequence number o timestamp verificabili",
      "Il solo MAC address del mittente",
      "Il semplice uso di una cache HTTP locale",
      "Una subnet mask più lunga sul router",
    ],
    correctAnswer: "Nonce, sequence number o timestamp verificabili",
    explanation:
      "Un replay sfrutta il fatto che un messaggio vecchio possa sembrare ancora valido. Serve quindi un indicatore di freschezza oltre all'integrità o autenticità del contenuto.",
  },
];

const hardQuestionAudits: Record<string, QuestionAuditOverride> = {
  "evil-security-106": {
    question: "Perché un HMAC valido non fornisce non ripudio nello stesso modo di una firma digitale?",
    options: ["Tutte le parti che condividono la chiave segreta possono generare lo stesso HMAC valido", "HMAC si basa su una coppia di chiavi pubblica e privata, quindi chiunque potrebbe generarlo", "Un HMAC valido non garantisce in alcun modo l'integrità del messaggio a cui è associato", "HMAC può essere calcolato e verificato soltanto all'interno di una rete locale Ethernet"],
    correctAnswer: "Tutte le parti che condividono la chiave segreta possono generare lo stesso HMAC valido",
    explanation: "HMAC garantisce integrità e autenticazione simmetrica tra soggetti che condividono lo stesso segreto, ma proprio per questo non permette di attribuire il messaggio a un unico autore. In una firma digitale, invece, solo il titolare della chiave privata può produrre la firma verificabile da terzi.",
    whyOthersAreWrong: {
      "HMAC si basa su una coppia di chiavi pubblica e privata, quindi chiunque potrebbe generarlo": "HMAC non usa chiavi pubbliche: si basa su un'unica chiave segreta condivisa tra le parti autorizzate.",
      "Un HMAC valido non garantisce in alcun modo l'integrità del messaggio a cui è associato": "L'integrità è proprio una delle proprietà principali garantite da un HMAC valido, non qualcosa che manca.",
      "HMAC può essere calcolato e verificato soltanto all'interno di una rete locale Ethernet": "HMAC è un costrutto crittografico indipendente dal mezzo trasmissivo: funziona identicamente su Internet o su qualsiasi altro canale.",
    },
  },
  "evil-security-111": {
    question: "Quale controllo collega davvero il certificato HTTPS al sito che il browser voleva raggiungere?",
    options: ["La corrispondenza tra il nome richiesto dal browser e i campi SAN o CN del certificato", "La corrispondenza tra l'indirizzo MAC del server e quello riportato dalla CA", "Il fatto che il server utilizzi una porta TCP superiore a 1024 per il servizio", "La presenza di un record DHCP valido assegnato al client nella rete locale"],
    correctAnswer: "La corrispondenza tra il nome richiesto dal browser e i campi SAN o CN del certificato",
    explanation: "Nel modello HTTPS il client non si fida di un certificato solo perché esiste: deve verificare anche che il nome richiesto, per esempio `www.example.com`, sia effettivamente coperto dai campi di identità presenti nel certificato, oggi soprattutto nel Subject Alternative Name.",
    whyOthersAreWrong: {
      "La corrispondenza tra l'indirizzo MAC del server e quello riportato dalla CA": "I MAC address non hanno alcun ruolo nella validazione dell'identità X.509 sul Web: le CA non li registrano nei certificati.",
      "Il fatto che il server utilizzi una porta TCP superiore a 1024 per il servizio": "Il numero di porta usato dal servizio non certifica in alcun modo l'identità del server presentato nel certificato.",
      "La presenza di un record DHCP valido assegnato al client nella rete locale": "DHCP assegna configurazione di rete al client, ma non partecipa in alcun modo alla verifica del certificato del server remoto.",
    },
  },
  "evil-security-112": {
    question: "Perché un certificato firmato da una Certification Authority intermedia può essere accettato dal browser?",
    options: ["Perché il client valida una catena di firme che risale fino a una root CA fidata", "Perché ogni certificato intermedio è automaticamente fidato senza controlli", "Perché il server invia insieme al certificato anche la propria password privata", "Perché il browser si basa sul TTL del pacchetto per capire se la CA è autentica"],
    correctAnswer: "Perché il client valida una catena di firme che risale fino a una root CA fidata",
    explanation: "La fiducia in PKI è gerarchica: il browser non deve conoscere personalmente ogni server o ogni CA intermedia, ma deve riuscire a costruire e verificare una catena di certificati che termini in una root CA già presente nel trust store del sistema o del browser.",
    whyOthersAreWrong: {
      "Perché ogni certificato intermedio è automaticamente fidato senza controlli": "Una CA intermedia viene accettata solo se la sua firma e la catena risultano valide.",
      "Perché il server invia insieme al certificato anche la propria password privata": "Una chiave privata non va mai inviata al client.",
      "Perché il browser si basa sul TTL del pacchetto per capire se la CA è autentica": "Il TTL è un campo IP e non ha alcun ruolo nella fiducia PKI.",
    },
  },
  "evil-security-118": {
    question: "Dopo che il client ha ottenuto il Ticket Granting Ticket in Kerberos, che cosa richiede tipicamente al Ticket Granting Server?",
    options: ["Un service ticket valido per un servizio specifico del dominio", "Un nuovo indirizzo IP per parlare con il server applicativo", "La chiave privata della KDC per firmare da solo le richieste", "Un certificato X.509 da usare al posto di tutti i ticket"],
    correctAnswer: "Un service ticket valido per un servizio specifico del dominio",
    explanation: "Il TGT serve come credenziale intermedia per evitare di reinserire la password a ogni accesso. Una volta autenticato, il client lo presenta al Ticket Granting Server per ottenere ticket di servizio separati, ciascuno destinato a uno specifico server o servizio.",
    whyOthersAreWrong: {
      "Un nuovo indirizzo IP per parlare con il server applicativo": "Kerberos gestisce autenticazione e ticket, non configurazione IP.",
      "La chiave privata della KDC per firmare da solo le richieste": "Le chiavi segrete della KDC non vengono mai distribuite ai client.",
      "Un certificato X.509 da usare al posto di tutti i ticket": "Kerberos e PKI possono coesistere, ma il TGS non sostituisce il protocollo con certificati X.509.",
    },
  },
  "evil-internet-089": {
    options: ["Riduce la probabilità che più stazioni ritrasmettano nello stesso istante dopo aver rilevato il canale occupato", "Garantisce che ogni stazione trasmetta a turno secondo uno schedule fisso deciso dall'access point", "Aumenta progressivamente la potenza del segnale radio per superare le interferenze rilevate sul canale", "Assegna alla stazione un nuovo canale a 20 MHz per evitare la congestione appena rilevata"],
    correctAnswer: "Riduce la probabilità che più stazioni ritrasmettano nello stesso istante dopo aver rilevato il canale occupato",
    whyOthersAreWrong: {
      "Garantisce che ogni stazione trasmetta a turno secondo uno schedule fisso deciso dall'access point": "Questo descrive un accesso a turni centralizzato (polling), non il CSMA/CA a contesa usato da 802.11: il backoff è casuale, non uno schedule fisso.",
      "Aumenta progressivamente la potenza del segnale radio per superare le interferenze rilevate sul canale": "Il backoff non tocca la potenza di trasmissione: agisce solo sul momento in cui la stazione riprova a trasmettere.",
      "Assegna alla stazione un nuovo canale a 20 MHz per evitare la congestione appena rilevata": "Il cambio canale è una decisione di gestione RF, non una funzione del backoff casuale del protocollo di accesso al mezzo.",
    },
  },
  "evil-internet-016": {
    options: ["GET è tipicamente usato per recuperare risorse, mentre POST invia dati al server o richiede elaborazioni lato server", "POST è idempotente per specifica, mentre GET può modificare liberamente lo stato del server senza restrizioni", "GET non è mai memorizzabile in cache dai proxy, mentre POST viene sempre salvato in cache di default", "GET cifra i parametri nell'URL tramite TLS, mentre POST li trasmette sempre in chiaro anche su HTTPS"],
    correctAnswer: "GET è tipicamente usato per recuperare risorse, mentre POST invia dati al server o richiede elaborazioni lato server",
    whyOthersAreWrong: {
      "POST è idempotente per specifica, mentre GET può modificare liberamente lo stato del server senza restrizioni": "In realtà è GET a essere considerato sicuro e idempotente per convenzione HTTP, mentre POST può avere effetti collaterali sullo stato del server.",
      "GET non è mai memorizzabile in cache dai proxy, mentre POST viene sempre salvato in cache di default": "È il contrario: GET è cacheable di default dai proxy HTTP, mentre le risposte POST non vengono normalmente salvate in cache.",
      "GET cifra i parametri nell'URL tramite TLS, mentre POST li trasmette sempre in chiaro anche su HTTPS": "La cifratura TLS in HTTPS copre l'intera richiesta indipendentemente dal metodo usato: non distingue GET da POST.",
    },
  },
  "evil-internet-087": {
    options: ["In radio è più pratico evitare la collisione in anticipo che rilevarla con affidabilità durante la trasmissione", "Perché il Wi-Fi rileva le collisioni misurando la potenza del segnale ricevuto durante ogni trasmissione", "Perché gli access point assegnano uno slot temporale fisso a ciascuna stazione per evitare ogni collisione", "Perché il mezzo radio garantisce che due trasmissioni simultanee non si sovrappongano mai in frequenza"],
    correctAnswer: "In radio è più pratico evitare la collisione in anticipo che rilevarla con affidabilità durante la trasmissione",
    whyOthersAreWrong: {
      "Perché il Wi-Fi rileva le collisioni misurando la potenza del segnale ricevuto durante ogni trasmissione": "Una stazione Wi-Fi non riesce a misurare in modo affidabile la propria ricezione mentre trasmette (problema half-duplex/near-far), quindi non può rilevare le collisioni così come fa Ethernet via cavo.",
      "Perché gli access point assegnano uno slot temporale fisso a ciascuna stazione per evitare ogni collisione": "Questo descrive un accesso a divisione di tempo (TDMA) pianificato dall'AP, non il meccanismo a contesa CSMA/CA usato da 802.11.",
      "Perché il mezzo radio garantisce che due trasmissioni simultanee non si sovrappongano mai in frequenza": "Le trasmissioni radio simultanee sulla stessa frequenza possono benissimo sovrapporsi e collidere: è proprio per questo che serve evitare la collisione, non perché sia impossibile.",
    },
  },
  "evil-internet-055": {
    options: ["La cwnd cresce circa esponenzialmente a ogni RTT, finché non raggiunge la soglia o si verifica una perdita", "La cwnd cresce in modo lineare di un MSS per ogni RTT già dalla prima fase della connessione", "La cwnd viene dimezzata a ogni ACK ricevuto per prevenire in anticipo la congestione della rete", "La cwnd resta bloccata al valore della finestra di ricezione annunciata fino al termine della connessione"],
    correctAnswer: "La cwnd cresce circa esponenzialmente a ogni RTT, finché non raggiunge la soglia o si verifica una perdita",
    whyOthersAreWrong: {
      "La cwnd cresce in modo lineare di un MSS per ogni RTT già dalla prima fase della connessione": "La crescita lineare di un MSS per RTT è tipica della congestion avoidance, non dello slow start, che invece cresce in modo esponenziale.",
      "La cwnd viene dimezzata a ogni ACK ricevuto per prevenire in anticipo la congestione della rete": "Il dimezzamento della cwnd è la reazione a un segnale di perdita, non il comportamento dello slow start, che invece la fa crescere.",
      "La cwnd resta bloccata al valore della finestra di ricezione annunciata fino al termine della connessione": "Questo confonde la finestra di congestione (cwnd) con la finestra di ricezione annunciata (rwnd), che è un limite imposto dal ricevente e non blocca la crescita della cwnd.",
    },
  },
  "evil-internet-049": {
    options: ["Perché non arriva alcun riscontro utile, segno che la rete potrebbe essere in difficoltà più seria", "Perché il timeout raddoppia automaticamente la dimensione della finestra di ricezione annunciata", "Perché tre ACK duplicati indicano che il segmento è stato consegnato due volte allo strato applicativo", "Perché il timeout obbliga il mittente a rinegoziare un nuovo numero di sequenza iniziale con SYN"],
    correctAnswer: "Perché non arriva alcun riscontro utile, segno che la rete potrebbe essere in difficoltà più seria",
    whyOthersAreWrong: {
      "Perché il timeout raddoppia automaticamente la dimensione della finestra di ricezione annunciata": "Il timeout di ritrasmissione non modifica la finestra di ricezione: quella è annunciata dal ricevente indipendentemente dagli eventi di perdita.",
      "Perché tre ACK duplicati indicano che il segmento è stato consegnato due volte allo strato applicativo": "Tre ACK duplicati significano che segmenti successivi sono arrivati fuori sequenza al ricevente, non che un segmento sia stato consegnato due volte all'applicazione.",
      "Perché il timeout obbliga il mittente a rinegoziare un nuovo numero di sequenza iniziale con SYN": "Un timeout non comporta un nuovo handshake SYN: la connessione resta la stessa, solo il segmento perso viene ritrasmesso.",
    },
  },
  "evil-internet-024": {
    options: ["Un riferimento ai server del TLD pertinente, non necessariamente l'IP finale richiesto", "L'indirizzo IP definitivo dell'host richiesto, ottenuto direttamente dalla cache del root server", "Un elenco di server DNS autoritativi di secondo livello già completo di tutti i record A associati", "Un messaggio di errore NXDOMAIN ogni volta che il nome non è già in cache al root"],
    correctAnswer: "Un riferimento ai server del TLD pertinente, non necessariamente l'IP finale richiesto",
    whyOthersAreWrong: {
      "L'indirizzo IP definitivo dell'host richiesto, ottenuto direttamente dalla cache del root server": "Il root server normalmente non conosce né restituisce l'IP finale: delega la risoluzione rimandando al server del TLD competente.",
      "Un elenco di server DNS autoritativi di secondo livello già completo di tutti i record A associati": "Il root server indica solo i server del TLD di competenza, senza fornire già i record A degli host finali: quella risoluzione avviene ai livelli successivi.",
      "Un messaggio di errore NXDOMAIN ogni volta che il nome non è già in cache al root": "Il root server non genera NXDOMAIN per la mancanza in cache: risponde comunque con un rimando al TLD pertinente, dato che gestisce delegazioni, non una cache di risoluzione.",
    },
  },
  "evil-internet-084": {
    options: ["Isola meglio i domini di collisione e inoltra i frame in modo selettivo in base all'indirizzo MAC", "Elimina completamente la necessità di configurare indirizzi IP sugli host della rete locale", "Inoltra comunque ogni frame in broadcast su tutte le porte, proprio come farebbe un hub tradizionale", "Assegna dinamicamente un indirizzo IP a ciascun dispositivo collegato alle proprie porte"],
    correctAnswer: "Isola meglio i domini di collisione e inoltra i frame in modo selettivo in base all'indirizzo MAC",
    whyOthersAreWrong: {
      "Elimina completamente la necessità di configurare indirizzi IP sugli host della rete locale": "Lo switch opera a livello di collegamento e non elimina il bisogno di indirizzamento IP: quello resta necessario per la comunicazione di livello rete.",
      "Inoltra comunque ogni frame in broadcast su tutte le porte, proprio come farebbe un hub tradizionale": "Proprio questo comportamento da broadcast indiscriminato è ciò che lo switching evita rispetto all'hub, inoltrando invece in modo selettivo in base al MAC.",
      "Assegna dinamicamente un indirizzo IP a ciascun dispositivo collegato alle proprie porte": "L'assegnazione dinamica degli indirizzi IP è compito del DHCP, non una funzione dello switching di livello collegamento.",
    },
  },
  "evil-internet-036": {
    options: ["TCP è orientato alla connessione e affidabile; UDP è connectionless e lascia più responsabilità all'applicazione", "TCP garantisce sempre una latenza minore di UDP, perché la connessione viene aperta una sola volta all'inizio", "UDP effettua un proprio handshake a due vie con il ricevente prima di iniziare a inviare i datagrammi", "TCP frammenta i dati in datagrammi indipendenti gestiti singolarmente, mentre UDP mantiene un flusso di byte continuo"],
    correctAnswer: "TCP è orientato alla connessione e affidabile; UDP è connectionless e lascia più responsabilità all'applicazione",
    whyOthersAreWrong: {
      "TCP garantisce sempre una latenza minore di UDP, perché la connessione viene aperta una sola volta all'inizio": "L'apertura della connessione (three-way handshake) e il controllo di congestione di TCP aggiungono overhead: UDP è generalmente più veloce, non il contrario.",
      "UDP effettua un proprio handshake a due vie con il ricevente prima di iniziare a inviare i datagrammi": "UDP è privo di handshake: non stabilisce alcuno stato di connessione prima di inviare i datagrammi, a differenza di TCP.",
      "TCP frammenta i dati in datagrammi indipendenti gestiti singolarmente, mentre UDP mantiene un flusso di byte continuo": "È l'esatto contrario: TCP presenta un flusso continuo di byte all'applicazione, mentre UDP preserva i confini dei singoli datagrammi.",
    },
  },
  "evil-internet-073": {
    options: ["Usa solo informazioni locali sui vicini e non richiede una vista globale della topologia", "Calcola i cammini a costo minimo partendo da un singolo nodo sorgente verso tutti gli altri nodi", "È l'algoritmo associato alla famiglia dei protocolli di routing link-state come OSPF", "Può essere eseguito periodicamente all'interno di protocolli di routing dinamici per aggiornare le rotte"],
    correctAnswer: "Usa solo informazioni locali sui vicini e non richiede una vista globale della topologia",
    whyOthersAreWrong: {
      "Calcola i cammini a costo minimo partendo da un singolo nodo sorgente verso tutti gli altri nodi": "Questa affermazione è vera: Dijkstra calcola effettivamente i cammini minimi da un nodo sorgente a tutti gli altri, quindi non è la risposta falsa cercata.",
      "È l'algoritmo associato alla famiglia dei protocolli di routing link-state come OSPF": "Questa affermazione è vera: Dijkstra è alla base degli algoritmi link-state, quindi non è l'affermazione falsa richiesta dalla domanda.",
      "Può essere eseguito periodicamente all'interno di protocolli di routing dinamici per aggiornare le rotte": "Questa affermazione è vera: Dijkstra viene rieseguito periodicamente nei protocolli link-state dinamici, quindi non è la risposta falsa cercata.",
    },
  },
  "evil-internet-066": {
    options: ["È l'indirizzo di loopback IPv4, riservato esclusivamente ai test di rete interni eseguiti sullo stesso host locale", "È un broadcast IPv4 di livello rete, mentre Ethernet usa l'indirizzo MAC tutto a FF per il proprio broadcast", "È un indirizzo speciale riservato esclusivamente agli aggiornamenti automatici delle zone primarie del servizio DNS", "Identifica esclusivamente la porta UDP predefinita utilizzata dai messaggi del protocollo DHCP sulla rete locale"],
    correctAnswer: "È un broadcast IPv4 di livello rete, mentre Ethernet usa l'indirizzo MAC tutto a FF per il proprio broadcast",
    whyOthersAreWrong: {
      "È l'indirizzo di loopback IPv4, riservato esclusivamente ai test di rete interni eseguiti sullo stesso host locale": "Il loopback IPv4 è 127.0.0.1 (rete 127.0.0.0/8), non 255.255.255.255, che è invece l'indirizzo di broadcast limitato.",
      "È un indirizzo speciale riservato esclusivamente agli aggiornamenti automatici delle zone primarie del servizio DNS": "255.255.255.255 non è un record né un meccanismo DNS: è un indirizzo IPv4 di broadcast usato a livello di rete, indipendente dal DNS.",
      "Identifica esclusivamente la porta UDP predefinita utilizzata dai messaggi del protocollo DHCP sulla rete locale": "255.255.255.255 non identifica una porta né è specifico di DHCP: è l'indirizzo di destinazione broadcast che DHCP (tra vari protocolli) può usare, non una porta.",
    },
  },
  "evil-internet-048": {
    options: ["Indica i byte di dati applicativi che un segmento TCP può trasportare, esclusi gli header", "Indica la dimensione massima in byte della finestra di ricezione annunciata dal destinatario", "Indica il numero massimo di connessioni TCP simultanee che il server può accettare", "Corrisponde sempre esattamente alla MTU del livello di collegamento sottostante"],
    correctAnswer: "Indica i byte di dati applicativi che un segmento TCP può trasportare, esclusi gli header",
    whyOthersAreWrong: {
      "Indica la dimensione massima in byte della finestra di ricezione annunciata dal destinatario": "Questo descrive la receive window (rwnd), un parametro di controllo di flusso annunciato dal ricevente, non la MSS che riguarda la dimensione del payload per segmento.",
      "Indica il numero massimo di connessioni TCP simultanee che il server può accettare": "La MSS non ha nulla a che fare con il numero di connessioni: è un parametro per-connessione sulla dimensione dei segmenti, non un limite di concorrenza del server.",
      "Corrisponde sempre esattamente alla MTU del livello di collegamento sottostante": "La MSS è tipicamente derivata dalla MTU meno gli header IP/TCP, ma non coincide sempre con la MTU: dipende anche dalla negoziazione e da eventuali percorsi con MTU minore.",
    },
  },
  "evil-internet-034": {
    options: ["Risolvono fasi diverse del servizio di posta: accesso alla mailbox contro invio e relay dei messaggi", "Sono protocolli concorrenti solo perché operano su porte TCP diverse ma con funzione identica", "IMAP e POP3 gestiscono l'invio della posta, mentre SMTP si occupa esclusivamente della lettura", "SMTP viene usato dal client solo per scaricare i messaggi già recapitati nella mailbox remota"],
    correctAnswer: "Risolvono fasi diverse del servizio di posta: accesso alla mailbox contro invio e relay dei messaggi",
    whyOthersAreWrong: {
      "Sono protocolli concorrenti solo perché operano su porte TCP diverse ma con funzione identica": "Non è solo una questione di porte: IMAP/POP3 e SMTP svolgono funzioni realmente diverse (accesso alla mailbox contro invio/relay), non la stessa funzione su porte diverse.",
      "IMAP e POP3 gestiscono l'invio della posta, mentre SMTP si occupa esclusivamente della lettura": "È il contrario: SMTP gestisce l'invio e il relay della posta, mentre IMAP e POP3 servono ad accedere e leggere i messaggi già nella mailbox.",
      "SMTP viene usato dal client solo per scaricare i messaggi già recapitati nella mailbox remota": "SMTP è usato per inviare o inoltrare la posta, non per scaricarla dalla mailbox: quel compito spetta a POP3 o IMAP.",
    },
  },
  "evil-internet-028": {
    options: ["Ridurre le interrogazioni esterne è utile, ma la cache deve rispettare i tempi di validità (TTL) dei record", "Una volta risolto un nome a dominio, il resolver può considerarlo valido a tempo indeterminato senza mai riverificarlo", "La cache del resolver DNS sostituisce completamente la tabella di routing utilizzata dal router locale", "La cache DNS conserva esclusivamente i record MX, escludendo sistematicamente quelli di tipo A o AAAA"],
    correctAnswer: "Ridurre le interrogazioni esterne è utile, ma la cache deve rispettare i tempi di validità (TTL) dei record",
    whyOthersAreWrong: {
      "Una volta risolto un nome a dominio, il resolver può considerarlo valido a tempo indeterminato senza mai riverificarlo": "I record DNS hanno un TTL che ne limita la validità: un resolver corretto deve far scadere e rinnovare la voce in cache, non trattarla come eterna.",
      "La cache del resolver DNS sostituisce completamente la tabella di routing utilizzata dal router locale": "La cache DNS risolve nomi in indirizzi IP: non contiene né sostituisce le informazioni di instradamento usate dal router per inoltrare i pacchetti.",
      "La cache DNS conserva esclusivamente i record MX, escludendo sistematicamente quelli di tipo A o AAAA": "La cache DNS memorizza qualunque tipo di record risolto, inclusi A e AAAA, non solo gli MX.",
    },
  },
  "evil-internet-037": {
    options: ["UDP conserva l'idea di datagramma separato, mentre TCP presenta all'applicazione un flusso continuo di byte", "TCP invia un solo messaggio applicativo per l'intera durata della connessione stabilita", "UDP incapsula i dati senza alcun header, trasportando solo il payload applicativo puro", "TCP suddivide i dati in base ai nomi di dominio, mentre UDP li suddivide in base agli indirizzi MAC"],
    correctAnswer: "UDP conserva l'idea di datagramma separato, mentre TCP presenta all'applicazione un flusso continuo di byte",
    whyOthersAreWrong: {
      "TCP invia un solo messaggio applicativo per l'intera durata della connessione stabilita": "TCP può trasportare molti messaggi applicativi nello stesso flusso continuo: non è limitato a uno solo per connessione.",
      "UDP incapsula i dati senza alcun header, trasportando solo il payload applicativo puro": "UDP ha comunque un proprio header (porte, lunghezza, checksum) prima dei dati applicativi: non è mai privo di intestazione.",
      "TCP suddivide i dati in base ai nomi di dominio, mentre UDP li suddivide in base agli indirizzi MAC": "Né TCP né UDP segmentano i dati in base a nomi DNS o indirizzi MAC: questi appartengono ad altri livelli e non determinano la suddivisione dei dati di trasporto.",
    },
  },
  "evil-internet-050": {
    options: ["Sincronizza gli stati iniziali della connessione e negozia parametri come i numeri di sequenza iniziali", "Risolve il nome a dominio del server tramite query DNS prima di stabilire il collegamento", "Costruisce e aggiorna le voci della tabella ARP presenti su tutti gli switch attraversati dalla connessione", "Trasferisce già il body della richiesta HTTP prima che la connessione TCP sia stabilita"],
    correctAnswer: "Sincronizza gli stati iniziali della connessione e negozia parametri come i numeri di sequenza iniziali",
    whyOthersAreWrong: {
      "Risolve il nome a dominio del server tramite query DNS prima di stabilire il collegamento": "La risoluzione del nome tramite DNS avviene prima e in modo indipendente dal three-way handshake, che è una fase del protocollo di trasporto TCP, non del DNS.",
      "Costruisce e aggiorna le voci della tabella ARP presenti su tutti gli switch attraversati dalla connessione": "Gli switch non gestiscono tabelle ARP, che è un meccanismo tra host di livello rete/collegamento; il three-way handshake è tra client e server, non uno strumento di configurazione degli switch.",
      "Trasferisce già il body della richiesta HTTP prima che la connessione TCP sia stabilita": "Il body HTTP può essere trasmesso solo dopo che la connessione TCP è stata stabilita: il handshake avviene prima, senza dati applicativi.",
    },
  },
  "evil-internet-025": {
    options: ["Il record di tipo CNAME", "Il record di tipo MX", "Il record di tipo NS", "Il record di tipo SOA"],
    correctAnswer: "Il record di tipo CNAME",
    whyOthersAreWrong: {
      "Il record di tipo MX": "Il record MX indica il server di posta responsabile per il dominio, non un alias per un nome host.",
      "Il record di tipo NS": "Il record NS indica i server dei nomi autoritativi per una zona, non un alias per un host.",
      "Il record di tipo SOA": "Il record SOA contiene i parametri amministrativi della zona (server primario, seriale, timer), non un alias di un nome host.",
    },
  },
  "evil-internet-039": {
    options: ["Ogni datagramma è trattato indipendentemente, senza stato di connessione mantenuto dal livello di trasporto", "UDP può essere usato solo all'interno di reti locali isolate, non attraverso Internet pubblico", "UDP non può includere un campo di checksum proprio perché non stabilisce alcuna connessione preventiva", "UDP obbliga tutti i datagrammi appartenenti a uno stesso flusso a seguire sempre lo stesso percorso di rete"],
    correctAnswer: "Ogni datagramma è trattato indipendentemente, senza stato di connessione mantenuto dal livello di trasporto",
    whyOthersAreWrong: {
      "UDP può essere usato solo all'interno di reti locali isolate, non attraverso Internet pubblico": "UDP è ampiamente usato su Internet pubblico (DNS, streaming, VoIP, ecc.): non è limitato alle reti locali isolate.",
      "UDP non può includere un campo di checksum proprio perché non stabilisce alcuna connessione preventiva": "UDP include comunque un campo checksum opzionale nel proprio header: l'assenza di connessione non implica l'assenza di checksum.",
      "UDP obbliga tutti i datagrammi appartenenti a uno stesso flusso a seguire sempre lo stesso percorso di rete": "Il routing dei singoli datagrammi è deciso hop-by-hop dal livello di rete (IP), indipendentemente da UDP: pacchetti dello stesso flusso possono seguire percorsi diversi.",
    },
  },
  "evil-internet-088": {
    options: ["Può contenere fino a quattro campi indirizzo, perché deve rappresentare più ruoli negli scenari wireless", "Contiene sempre e soltanto un unico campo indirizzo, in modo analogo ai datagrammi UDP privi di connessione", "Non distingue mai concettualmente tra stazione mittente e stazione destinataria del frame", "È identico bit per bit a un frame Ethernet 802.3 che trasporta lo stesso payload applicativo"],
    correctAnswer: "Può contenere fino a quattro campi indirizzo, perché deve rappresentare più ruoli negli scenari wireless",
    whyOthersAreWrong: {
      "Contiene sempre e soltanto un unico campo indirizzo, in modo analogo ai datagrammi UDP privi di connessione": "L'header 802.11 può avere fino a quattro campi indirizzo (per gestire AP, BSS, distribuzione), non uno solo; inoltre il confronto con UDP è concettualmente estraneo, dato che UDP opera a un altro livello.",
      "Non distingue mai concettualmente tra stazione mittente e stazione destinataria del frame": "L'header MAC 802.11 distingue esplicitamente ruoli come indirizzo sorgente, destinazione, trasmittente e ricevente per gestire scenari con access point.",
      "È identico bit per bit a un frame Ethernet 802.3 che trasporta lo stesso payload applicativo": "L'header 802.11 differisce da quello Ethernet 802.3 proprio per i campi indirizzo aggiuntivi e i bit di controllo specifici del wireless: non sono identici.",
    },
  },
  "evil-internet-059": {
    options: ["Garantisce consegna ordinata e senza perdite come parte del suo servizio di base", "È un servizio di tipo connectionless, senza instaurazione preventiva di un percorso", "Fornisce un servizio best-effort, senza garanzie formali di consegna dei pacchetti", "Può scartare pacchetti quando i buffer dei router lungo il percorso sono congestionati"],
    correctAnswer: "Garantisce consegna ordinata e senza perdite come parte del suo servizio di base",
    whyOthersAreWrong: {
      "È un servizio di tipo connectionless, senza instaurazione preventiva di un percorso": "Questa affermazione è vera: IP è effettivamente un servizio connectionless, quindi non è la falsa affermazione richiesta.",
      "Fornisce un servizio best-effort, senza garanzie formali di consegna dei pacchetti": "Questa affermazione è vera: IP è per definizione un servizio best-effort, quindi non è la risposta cercata.",
      "Può scartare pacchetti quando i buffer dei router lungo il percorso sono congestionati": "Questa affermazione è vera: i router possono scartare pacchetti in caso di congestione dei buffer, quindi non è l'affermazione falsa richiesta.",
    },
  },
  "evil-internet-052": {
    options: ["Ritrasmette solo i pacchetti effettivamente persi, non necessariamente l'intero blocco successivo", "Elimina completamente l'uso dei numeri di sequenza in ciascun pacchetto trasmesso", "Non utilizza mai riscontri (ACK) espliciti e quindi non consuma banda nel canale di ritorno", "Sposta interamente la gestione della ritrasmissione degli errori dal trasporto al livello di rete"],
    correctAnswer: "Ritrasmette solo i pacchetti effettivamente persi, non necessariamente l'intero blocco successivo",
    whyOthersAreWrong: {
      "Elimina completamente l'uso dei numeri di sequenza in ciascun pacchetto trasmesso": "Sia Selective Repeat sia Go-Back-N si basano sui numeri di sequenza per identificare i pacchetti: nessuno dei due li elimina.",
      "Non utilizza mai riscontri (ACK) espliciti e quindi non consuma banda nel canale di ritorno": "Entrambi i protocolli usano ACK (cumulativi o selettivi) per segnalare la ricezione: l'assenza di ACK non è ciò che li differenzia.",
      "Sposta interamente la gestione della ritrasmissione degli errori dal trasporto al livello di rete": "Il controllo di errore tramite ARQ resta una funzione del livello di trasporto (o collegamento): non viene delegato al livello di rete.",
    },
  },
  "evil-internet-022": {
    options: ["L'URL identifica una risorsa e include almeno schema e host; non contiene MAC address o gateway locale", "L'URL deve sempre includere anche l'indirizzo MAC del server per poter funzionare correttamente", "L'URL costituisce di fatto un sostituto diretto della tabella ARP mantenuta dal client", "L'URL rappresenta di per sé l'intera socket TCP completa già stabilita per la connessione"],
    correctAnswer: "L'URL identifica una risorsa e include almeno schema e host; non contiene MAC address o gateway locale",
    whyOthersAreWrong: {
      "L'URL deve sempre includere anche l'indirizzo MAC del server per poter funzionare correttamente": "Un URL non contiene mai un indirizzo MAC: l'indirizzo fisico viene risolto separatamente tramite ARP quando serve, non fa parte della sintassi URL.",
      "L'URL costituisce di fatto un sostituto diretto della tabella ARP mantenuta dal client": "L'URL identifica una risorsa a livello applicativo (schema, host, path); la tabella ARP è una struttura di livello collegamento che mappa IP a MAC e non ha relazione diretta con l'URL.",
      "L'URL rappresenta di per sé l'intera socket TCP completa già stabilita per la connessione": "La socket TCP è definita da IP e porta di entrambi gli estremi della connessione: l'URL non la rappresenta interamente, al più ne suggerisce l'host e implicitamente la porta di default.",
    },
  },
  "evil-internet-078": {
    options: ["Il client non ha ancora una configurazione completa adatta a instaurare una sessione TCP classica", "DHCP richiede per sua definizione una consegna ordinata dei dati in stile byte-stream, come TCP", "UDP fornisce nativamente un meccanismo di autenticazione del server DHCP basato su certificati digitali", "TCP risulta inutilizzabile in questo scenario perché non dispone di numeri di porta per identificare il servizio"],
    correctAnswer: "Il client non ha ancora una configurazione completa adatta a instaurare una sessione TCP classica",
    whyOthersAreWrong: {
      "DHCP richiede per sua definizione una consegna ordinata dei dati in stile byte-stream, come TCP": "Non è DHCP a richiedere consegna byte-stream ordinata: anzi usa UDP proprio perché quel livello di garanzia non serve nella fase iniziale di configurazione.",
      "UDP fornisce nativamente un meccanismo di autenticazione del server DHCP basato su certificati digitali": "DHCP non prevede un meccanismo di autenticazione tramite certificati: la scelta di UDP riguarda la fattibilità pratica prima che il client abbia un indirizzo, non la sicurezza.",
      "TCP risulta inutilizzabile in questo scenario perché non dispone di numeri di porta per identificare il servizio": "TCP dispone regolarmente di numeri di porta; il motivo per cui DHCP evita TCP è che il client non ha ancora un indirizzo IP configurato per stabilire una sessione.",
    },
  },
  "evil-internet-011": {
    options: ["Ogni nuovo client aggiunge automaticamente capacità di servizio pari al proprio carico", "I server sono tipicamente sempre attivi e raggiungibili a un indirizzo IP noto e stabile", "Sono sempre i client a iniziare la comunicazione verso il server, non il contrario", "Il collo di bottiglia tende a concentrarsi lato server quando il numero di client cresce"],
    correctAnswer: "Ogni nuovo client aggiunge automaticamente capacità di servizio pari al proprio carico",
    whyOthersAreWrong: {
      "I server sono tipicamente sempre attivi e raggiungibili a un indirizzo IP noto e stabile": "Questa affermazione è vera per il modello client-server: i server hanno indirizzi noti e stabili, quindi non è la caratteristica atipica cercata.",
      "Sono sempre i client a iniziare la comunicazione verso il server, non il contrario": "Questa affermazione è vera: nel modello client-server è sempre il client a iniziare la comunicazione, quindi non è la risposta cercata.",
      "Il collo di bottiglia tende a concentrarsi lato server quando il numero di client cresce": "Questa affermazione è vera: nel client-server puro la capacità non scala con i client, per cui il server diventa facilmente collo di bottiglia; non è la caratteristica atipica richiesta.",
    },
  },
  "evil-internet-044": {
    options: ["Molti client diversi possono comunicare contemporaneamente con la stessa porta del server", "Le porte TCP cambiano significato logico a ogni singolo hop attraversato lungo il percorso", "La porta 80 è riservata esclusivamente al protocollo ARP e non viene mai usata da HTTP", "La porta lato server viene scelta sempre in modo casuale e non è mai nota in anticipo"],
    correctAnswer: "Molti client diversi possono comunicare contemporaneamente con la stessa porta del server",
    whyOthersAreWrong: {
      "Le porte TCP cambiano significato logico a ogni singolo hop attraversato lungo il percorso": "Le porte TCP hanno significato end-to-end tra i due host della connessione: i router intermedi non le reinterpretano hop-by-hop.",
      "La porta 80 è riservata esclusivamente al protocollo ARP e non viene mai usata da HTTP": "ARP non usa porte TCP/UDP, poiché opera a un livello diverso; la porta 80 è invece la porta ben nota assegnata a HTTP.",
      "La porta lato server viene scelta sempre in modo casuale e non è mai nota in anticipo": "La porta del server è tipicamente fissa e nota (es. 80 per HTTP): è la porta del client a essere scelta dinamicamente, non quella del server.",
    },
  },
  "evil-internet-031": {
    options: ["SMTP è orientato all'invio e al relay della posta; POP3 e IMAP servono soprattutto a recuperarla o gestirla", "SMTP è il protocollo usato per leggere e gestire da remoto le cartelle di posta sul server", "POP3 e IMAP vengono impiegati dai client per risolvere i record MX associati ai domini di posta", "SMTP trasporta la posta esclusivamente tramite UDP, poiché la consegna della mail non richiede affidabilità"],
    correctAnswer: "SMTP è orientato all'invio e al relay della posta; POP3 e IMAP servono soprattutto a recuperarla o gestirla",
    whyOthersAreWrong: {
      "SMTP è il protocollo usato per leggere e gestire da remoto le cartelle di posta sul server": "La lettura e gestione remota delle cartelle è compito di IMAP (e in parte POP3), non di SMTP, che si occupa dell'invio e del relay.",
      "POP3 e IMAP vengono impiegati dai client per risolvere i record MX associati ai domini di posta": "La risoluzione dei record MX è compito del sistema DNS, non di POP3 o IMAP, che si limitano ad accedere alla mailbox già nota.",
      "SMTP trasporta la posta esclusivamente tramite UDP, poiché la consegna della mail non richiede affidabilità": "SMTP utilizza TCP, non UDP, proprio perché la consegna affidabile dei messaggi di posta è un requisito del protocollo.",
    },
  },
  "evil-internet-013": {
    options: ["Il P2P scala meglio perché i peer contribuiscono risorse; il client-server semplifica il controllo centralizzato", "Il modello client-server elimina meglio del P2P ogni singolo punto di guasto presente in rete", "Il P2P garantisce per definizione un'identità e un'autenticazione migliori rispetto al client-server", "Il modello client-server non può in alcun modo appoggiarsi al servizio DNS, a differenza del P2P"],
    correctAnswer: "Il P2P scala meglio perché i peer contribuiscono risorse; il client-server semplifica il controllo centralizzato",
    whyOthersAreWrong: {
      "Il modello client-server elimina meglio del P2P ogni singolo punto di guasto presente in rete": "È il contrario: il server centralizzato è tipicamente il singolo punto di guasto, mentre il P2P distribuisce il carico su più peer, risultando spesso più resiliente.",
      "Il P2P garantisce per definizione un'identità e un'autenticazione migliori rispetto al client-server": "Il P2P non garantisce automaticamente identità o autenticazione migliori: anzi, la natura decentralizzata rende spesso più complesso verificare l'identità dei peer.",
      "Il modello client-server non può in alcun modo appoggiarsi al servizio DNS, a differenza del P2P": "Il DNS è un servizio generale di risoluzione dei nomi usato da entrambi i modelli: nulla impedisce a un'architettura client-server di utilizzarlo.",
    },
  },
  "evil-internet-058": {
    options: ["Consente di reagire a una probabile perdita prima del timeout, sfruttando gli ACK duplicati come indizio", "Serve a cifrare più rapidamente il payload applicativo trasportato all'interno del segmento TCP", "È il meccanismo attraverso cui il server DHCP assegna la subnet mask al client richiedente", "Sostituisce completamente la necessità di mantenere attivo un timer di ritrasmissione in TCP"],
    correctAnswer: "Consente di reagire a una probabile perdita prima del timeout, sfruttando gli ACK duplicati come indizio",
    whyOthersAreWrong: {
      "Serve a cifrare più rapidamente il payload applicativo trasportato all'interno del segmento TCP": "TCP non si occupa di cifratura, compito che spetta a TLS a un livello superiore: il fast retransmit riguarda solo la rilevazione rapida di perdite.",
      "È il meccanismo attraverso cui il server DHCP assegna la subnet mask al client richiedente": "L'assegnazione della subnet mask è una funzione di DHCP, del tutto indipendente dal fast retransmit, che è un meccanismo di TCP.",
      "Sostituisce completamente la necessità di mantenere attivo un timer di ritrasmissione in TCP": "TCP mantiene comunque il timer di ritrasmissione come meccanismo di backup: il fast retransmit lo affianca per i casi rilevabili dagli ACK duplicati, non lo sostituisce del tutto.",
    },
  },
  "evil-internet-026": {
    options: ["Quando deve trasferire zone intere o gestire risposte che eccedono il caso classico leggero", "Quando deve risolvere un indirizzo MAC per un host collegato a una LAN Ethernet locale", "Quando il client sta inviando al server web una richiesta HTTP di tipo POST", "Soltanto quando l'host interrogato dispone già di un prefisso di rete IPv6 assegnato"],
    correctAnswer: "Quando deve trasferire zone intere o gestire risposte che eccedono il caso classico leggero",
    whyOthersAreWrong: {
      "Quando deve risolvere un indirizzo MAC per un host collegato a una LAN Ethernet locale": "La risoluzione degli indirizzi MAC su una LAN è compito di ARP, non del DNS, che risolve nomi in indirizzi IP indipendentemente dal trasporto usato.",
      "Quando il client sta inviando al server web una richiesta HTTP di tipo POST": "Il metodo HTTP usato dal client (GET, POST, ecc.) è indipendente dal trasporto scelto da DNS: non è un fattore che determina l'uso di TCP nel DNS.",
      "Soltanto quando l'host interrogato dispone già di un prefisso di rete IPv6 assegnato": "L'uso di TCP nel DNS dipende dalla dimensione della risposta (es. trasferimenti di zona) o da opzioni come EDNS0, non dal fatto che l'host abbia un prefisso IPv6.",
    },
  },
  "evil-internet-067": {
    options: ["Applica la propria subnet mask al proprio IP e a quello di destinazione, confrontando le parti di rete", "Confronta esclusivamente i numeri di porta TCP sorgente e destinazione della connessione", "Invia immediatamente una richiesta ARP broadcast indirizzata direttamente al server DNS root", "Osserva il valore del campo TTL del pacchetto di destinazione prima ancora di inviarlo"],
    correctAnswer: "Applica la propria subnet mask al proprio IP e a quello di destinazione, confrontando le parti di rete",
    whyOthersAreWrong: {
      "Confronta esclusivamente i numeri di porta TCP sorgente e destinazione della connessione": "Il confronto tra le porte TCP non determina la località del destinatario: quella valutazione avviene a livello IP confrontando le porzioni di rete degli indirizzi.",
      "Invia immediatamente una richiesta ARP broadcast indirizzata direttamente al server DNS root": "ARP non si usa per raggiungere un server DNS root né per determinare se una destinazione è locale: serve a risolvere un IP locale già noto in un MAC.",
      "Osserva il valore del campo TTL del pacchetto di destinazione prima ancora di inviarlo": "Il TTL indica solo il numero massimo di hop residui, non se la destinazione appartiene alla stessa rete locale.",
    },
  },
  "evil-internet-082": {
    options: ["Il mittente originario è già noto e la risposta può essere inviata direttamente al suo indirizzo MAC", "Le risposte ARP viaggiano sempre incapsulate sopra una connessione TCP già stabilita", "Una risposta ARP contiene soltanto il campo TTL e non l'indirizzo MAC del nodo target", "Gli switch vietano per policy l'inoltro dei frame unicast quando riguardano il protocollo ARP"],
    correctAnswer: "Il mittente originario è già noto e la risposta può essere inviata direttamente al suo indirizzo MAC",
    whyOthersAreWrong: {
      "Le risposte ARP viaggiano sempre incapsulate sopra una connessione TCP già stabilita": "ARP opera direttamente sopra Ethernet (livello collegamento), non sopra TCP: non richiede alcuna connessione di trasporto.",
      "Una risposta ARP contiene soltanto il campo TTL e non l'indirizzo MAC del nodo target": "ARP non ha un campo TTL: la risposta contiene invece gli indirizzi IP e MAC sia del mittente sia del richiedente.",
      "Gli switch vietano per policy l'inoltro dei frame unicast quando riguardano il protocollo ARP": "Gli switch inoltrano normalmente i frame unicast, incluse le risposte ARP: non esiste un divieto di questo tipo.",
    },
  },
  "evil-internet-021": {
    options: ["Indica che il server conferma la validità della copia in cache senza reinviare l'oggetto completo", "Indica che la richiesta deve essere ritrasmessa utilizzando UDP anziché TCP come trasporto", "Indica che il certificato TLS presentato dal server web è scaduto e va rinnovato", "Indica che la risorsa richiesta è stata rimossa in modo definitivo dal server d'origine"],
    correctAnswer: "Indica che il server conferma la validità della copia in cache senza reinviare l'oggetto completo",
    whyOthersAreWrong: {
      "Indica che la richiesta deve essere ritrasmessa utilizzando UDP anziché TCP come trasporto": "HTTP opera su TCP indipendentemente dal codice di stato restituito: 304 non implica alcun cambio di trasporto verso UDP.",
      "Indica che il certificato TLS presentato dal server web è scaduto e va rinnovato": "Lo stato del certificato TLS riguarda il livello di trasporto sicuro, indipendente dal codice di stato HTTP 304, che riguarda la cache applicativa.",
      "Indica che la risorsa richiesta è stata rimossa in modo definitivo dal server d'origine": "La rimozione definitiva di una risorsa è indicata dal codice 410 Gone (o 404 Not Found), non da 304, che segnala anzi che la risorsa in cache è ancora valida.",
    },
  },
  "evil-internet-086": {
    options: ["Ogni frame vale solo sul singolo tratto locale tra nodi adiacenti e viene ricostruito ai salti successivi", "Ogni frame attraversa l'intera rete Internet end-to-end senza mai essere ritoccato lungo il percorso", "Il livello di collegamento garantisce direttamente la semantica delle richieste e risposte HTTP", "ARP e DNS svolgono in pratica sempre lo stesso identico compito di risoluzione degli indirizzi"],
    correctAnswer: "Ogni frame vale solo sul singolo tratto locale tra nodi adiacenti e viene ricostruito ai salti successivi",
    whyOthersAreWrong: {
      "Ogni frame attraversa l'intera rete Internet end-to-end senza mai essere ritoccato lungo il percorso": "È il contrario: un frame di livello collegamento viene incapsulato e ricreato a ogni hop (router), non attraversa l'intera rete inalterato come farebbe un pacchetto end-to-end.",
      "Il livello di collegamento garantisce direttamente la semantica delle richieste e risposte HTTP": "La semantica delle richieste e risposte HTTP è definita al livello applicativo, non dal livello di collegamento, che si occupa solo della consegna locale hop-by-hop.",
      "ARP e DNS svolgono in pratica sempre lo stesso identico compito di risoluzione degli indirizzi": "ARP risolve indirizzi IP in MAC all'interno di una LAN, mentre DNS risolve nomi di dominio in indirizzi IP su scala globale: sono compiti diversi, a livelli diversi.",
    },
  },
  "evil-internet-069": {
    options: ["Il control plane costruisce e distribuisce le informazioni di rotta; il data plane inoltra i pacchetti usando quelle informazioni", "Il data plane calcola le rotte con protocolli come OSPF, mentre il control plane si limita all'inoltro hardware dei pacchetti", "Control plane e data plane coincidono entrambi con il livello di trasporto e gestiscono la segmentazione dei dati TCP", "Il data plane assegna dinamicamente gli indirizzi IP tramite DHCP, mentre il control plane si occupa di cifrare il payload con TLS"],
    correctAnswer: "Il control plane costruisce e distribuisce le informazioni di rotta; il data plane inoltra i pacchetti usando quelle informazioni",
    whyOthersAreWrong: {
      "Il data plane calcola le rotte con protocolli come OSPF, mentre il control plane si limita all'inoltro hardware dei pacchetti": "È l'opposto di quanto avviene realmente: è il control plane a eseguire protocolli come OSPF per calcolare le rotte, mentre il data plane si occupa solo dell'inoltro dei pacchetti in hardware.",
      "Control plane e data plane coincidono entrambi con il livello di trasporto e gestiscono la segmentazione dei dati TCP": "Control plane e data plane sono sottosistemi distinti di router e switch, non coincidono con il livello di trasporto: la segmentazione TCP è una funzione degli host, non di questi piani.",
      "Il data plane assegna dinamicamente gli indirizzi IP tramite DHCP, mentre il control plane si occupa di cifrare il payload con TLS": "Il DHCP e il TLS non sono funzioni del control o del data plane del router: il primo riguarda l'instradamento, il secondo l'inoltro dei pacchetti già instradati.",
    },
  },
  "evil-internet-040": {
    options: ["DNS lookup standard su UDP, HTTP classico su TCP", "DNS lookup standard su TCP, HTTP classico su UDP", "DNS lookup standard su UDP, HTTP classico anch'esso su UDP", "DNS lookup standard su UDP, HTTP classico invece su ICMP"],
    correctAnswer: "DNS lookup standard su UDP, HTTP classico su TCP",
    whyOthersAreWrong: {
      "DNS lookup standard su TCP, HTTP classico su UDP": "In realtà è l'opposto: il lookup DNS standard viaggia su UDP per la sua leggerezza, mentre HTTP si affida a TCP per il trasporto affidabile del flusso.",
      "DNS lookup standard su UDP, HTTP classico anch'esso su UDP": "HTTP classico si appoggia su TCP, non su UDP: ha bisogno di un trasporto connection-oriented e affidabile per il flusso di byte della risposta.",
      "DNS lookup standard su UDP, HTTP classico invece su ICMP": "ICMP non è un protocollo di trasporto usato dalle applicazioni: HTTP funziona sopra TCP, non sopra ICMP.",
    },
  },
  "evil-internet-042": {
    options: ["Servono a identificare il processo applicativo locale o remoto coinvolto nella comunicazione", "Identificano in modo univoco l'host in tutta Internet, al posto dell'indirizzo IP", "Vengono usati dal livello di collegamento per scegliere il MAC di destinazione del frame", "Indicano il numero massimo di connessioni TCP che il sistema può tenere aperte insieme"],
    correctAnswer: "Servono a identificare il processo applicativo locale o remoto coinvolto nella comunicazione",
    whyOthersAreWrong: {
      "Identificano in modo univoco l'host in tutta Internet, al posto dell'indirizzo IP": "L'host è identificato dall'indirizzo IP, non dalla porta: quest'ultima identifica il processo all'interno dell'host.",
      "Vengono usati dal livello di collegamento per scegliere il MAC di destinazione del frame": "Il livello di collegamento non usa i numeri di porta: l'inoltro dei frame si basa sugli indirizzi MAC, le porte appartengono al livello di trasporto.",
      "Indicano il numero massimo di connessioni TCP che il sistema può tenere aperte insieme": "Il numero di porta non è un contatore di connessioni: è un identificatore a 16 bit usato per multiplexare i flussi verso i processi.",
    },
  },
  "evil-internet-063": {
    options: ["Gli IP sorgente e destinazione restano stabili end-to-end, mentre i MAC cambiano a ogni hop", "Sia gli indirizzi IP sia i MAC restano identici dal client fino al server finale lungo tutto il percorso", "Gli indirizzi IP cambiano a ogni router attraversato, mentre i MAC restano fissi per l'intero percorso", "I MAC restano fissi lungo il percorso, mentre gli IP cambiano soltanto quando il TTL raggiunge lo zero"],
    correctAnswer: "Gli IP sorgente e destinazione restano stabili end-to-end, mentre i MAC cambiano a ogni hop",
    whyOthersAreWrong: {
      "Sia gli indirizzi IP sia i MAC restano identici dal client fino al server finale lungo tutto il percorso": "In realtà solo gli IP restano invariati end-to-end: i MAC vengono riscritti a ogni hop dal router che inoltra il pacchetto sulla rete successiva.",
      "Gli indirizzi IP cambiano a ogni router attraversato, mentre i MAC restano fissi per l'intero percorso": "È l'opposto di quanto avviene realmente: sono gli indirizzi IP a restare stabili end-to-end, mentre i MAC cambiano a ogni hop nel dominio di collegamento locale.",
      "I MAC restano fissi lungo il percorso, mentre gli IP cambiano soltanto quando il TTL raggiunge lo zero": "Il TTL regola solo la scadenza del pacchetto e non ha alcun legame con la variazione degli indirizzi IP lungo il percorso, che restano sempre gli stessi.",
    },
  },
  "evil-internet-027": {
    options: ["Nel ricorsivo il resolver incaricato completa la catena di ricerca; nell'iterativo riceve riferimenti intermedi", "Nell'iterativo il resolver incaricato completa la catena di ricerca, mentre nel ricorsivo riceve solo riferimenti intermedi", "Nel ricorsivo ogni server contattato restituisce l'intero record cifrato con TLS, a differenza dell'iterativo", "La modalità ricorsiva viene usata solo per i domini di primo livello, quella iterativa solo per gli host finali"],
    correctAnswer: "Nel ricorsivo il resolver incaricato completa la catena di ricerca; nell'iterativo riceve riferimenti intermedi",
    whyOthersAreWrong: {
      "Nell'iterativo il resolver incaricato completa la catena di ricerca, mentre nel ricorsivo riceve solo riferimenti intermedi": "È l'opposto: nella risoluzione ricorsiva è il resolver a cui il client si rivolge a portare avanti l'intera catena, mentre in quella iterativa riceve solo riferimenti ad altri server.",
      "Nel ricorsivo ogni server contattato restituisce l'intero record cifrato con TLS, a differenza dell'iterativo": "Le risposte DNS non sono cifrate con TLS per definizione (salvo estensioni come DoT/DoH): la differenza tra ricorsivo e iterativo riguarda chi prosegue la ricerca, non la cifratura.",
      "La modalità ricorsiva viene usata solo per i domini di primo livello, quella iterativa solo per gli host finali": "La distinzione iterativo/ricorsivo riguarda il comportamento del resolver nella catena di interrogazioni, non è legata al tipo di dominio interrogato.",
    },
  },
  "evil-internet-076": {
    options: ["Perché lo spazio delle porte usate per distinguere i flussi non è infinito", "Perché il protocollo IP consente un solo socket attivo per ciascun indirizzo pubblico", "Perché la tabella ARP del NAT può contenere al massimo 255 voci per interfaccia", "Perché il campo TTL condiviso tra NAT e IP limita il numero di traduzioni simultanee"],
    correctAnswer: "Perché lo spazio delle porte usate per distinguere i flussi non è infinito",
    whyOthersAreWrong: {
      "Perché il protocollo IP consente un solo socket attivo per ciascun indirizzo pubblico": "IP non impone un limite di un socket per indirizzo: è lo spazio a 16 bit dei numeri di porta a limitare quante traduzioni NAT possono coesistere su un solo IP pubblico.",
      "Perché la tabella ARP del NAT può contenere al massimo 255 voci per interfaccia": "ARP opera solo nella LAN locale per risolvere indirizzi MAC e non ha alcun ruolo nella tabella delle traduzioni NAT né in un limite di 255 client.",
      "Perché il campo TTL condiviso tra NAT e IP limita il numero di traduzioni simultanee": "Il TTL è un campo dell'header IP che limita la vita del pacchetto in rete e non ha alcuna relazione con il numero di porte disponibili per il NAT.",
    },
  },
  "evil-internet-080": {
    options: ["Identifica l'interfaccia nel dominio di collegamento e non sostituisce l'indirizzo IP nel routing", "Resta invariato end-to-end ed è l'unico indirizzo usato dai router Internet per l'inoltro", "Viene riscritto dal DNS ogni volta che l'host ottiene un nuovo indirizzo IP tramite DHCP", "Rappresenta il numero di porta del processo applicativo, codificato in formato esadecimale"],
    correctAnswer: "Identifica l'interfaccia nel dominio di collegamento e non sostituisce l'indirizzo IP nel routing",
    whyOthersAreWrong: {
      "Resta invariato end-to-end ed è l'unico indirizzo usato dai router Internet per l'inoltro": "È vero il contrario: il MAC cambia a ogni hop e i router Internet instradano in base all'indirizzo IP, non al MAC, che ha validità solo nel singolo dominio di collegamento.",
      "Viene riscritto dal DNS ogni volta che l'host ottiene un nuovo indirizzo IP tramite DHCP": "Il DNS risolve nomi in indirizzi IP e non ha alcun ruolo nell'assegnazione o riscrittura degli indirizzi MAC, che sono tipicamente fissati dalla scheda di rete.",
      "Rappresenta il numero di porta del processo applicativo, codificato in formato esadecimale": "Il MAC address opera al livello di collegamento e identifica un'interfaccia fisica, non un processo applicativo: i numeri di porta appartengono al livello di trasporto.",
    },
  },
  "evil-internet-083": {
    options: ["Fa flooding sulle altre porte, mantenendo però l'apprendimento del MAC sorgente", "Scarta il frame e invia un messaggio ICMP destination unreachable al mittente", "Lo inoltra al router di default affinché consulti la tabella di routing", "Lo incapsula in un nuovo pacchetto IP prima di ritrasmetterlo su tutte le porte"],
    correctAnswer: "Fa flooding sulle altre porte, mantenendo però l'apprendimento del MAC sorgente",
    whyOthersAreWrong: {
      "Scarta il frame e invia un messaggio ICMP destination unreachable al mittente": "Uno switch di livello 2 non genera messaggi ICMP: quando non conosce il MAC di destinazione fa flooding del frame su tutte le porte tranne quella di ingresso, non lo scarta.",
      "Lo inoltra al router di default affinché consulti la tabella di routing": "Lo switch opera al livello di collegamento e non consulta un router né una tabella di routing IP: la decisione di inoltro si basa solo sulla tabella dei MAC appresi.",
      "Lo incapsula in un nuovo pacchetto IP prima di ritrasmetterlo su tutte le porte": "Uno switch non incapsula i frame in datagrammi IP: inoltra il frame Ethernet così com'è, in flooding, senza intervenire al livello di rete.",
    },
  },
  "evil-internet-074": {
    options: ["Ogni router aggiorna la propria stima dei costi scambiando informazioni con i vicini", "Ogni router conosce fin dall'inizio la topologia completa e calcola le rotte localmente senza scambi", "Ogni router inonda l'intera rete con lo stato di tutti i suoi collegamenti a ogni variazione", "Ogni router assegna dinamicamente gli indirizzi IP ai vicini per calcolare il costo del percorso"],
    correctAnswer: "Ogni router aggiorna la propria stima dei costi scambiando informazioni con i vicini",
    whyOthersAreWrong: {
      "Ogni router conosce fin dall'inizio la topologia completa e calcola le rotte localmente senza scambi": "Questa è la logica del link-state (es. OSPF), non del distance vector: nel distance vector nessun router ha da subito la mappa completa, ma la costruisce scambiando stime con i vicini.",
      "Ogni router inonda l'intera rete con lo stato di tutti i suoi collegamenti a ogni variazione": "L'inondazione dello stato dei collegamenti a tutta la rete è tipica del link-state, mentre il distance vector scambia informazioni solo con i router direttamente vicini.",
      "Ogni router assegna dinamicamente gli indirizzi IP ai vicini per calcolare il costo del percorso": "Il distance vector riguarda il calcolo dei costi di instradamento, non l'assegnazione di indirizzi IP, che è compito di protocolli come DHCP.",
    },
  },
  "evil-internet-012": {
    options: ["Perché i peer possono entrare e uscire spesso, rendendo instabile la disponibilità delle risorse", "Perché i tracker centralizzati rigenerano le chiavi di sessione TLS ad ogni nuova richiesta", "Perché ogni peer deve ricalcolare l'albero di instradamento OSPF prima di ogni scambio", "Perché il protocollo HTTP impedisce ai peer di mantenere una cache locale dei contenuti"],
    correctAnswer: "Perché i peer possono entrare e uscire spesso, rendendo instabile la disponibilità delle risorse",
    whyOthersAreWrong: {
      "Perché i tracker centralizzati rigenerano le chiavi di sessione TLS ad ogni nuova richiesta": "Il churn riguarda l'ingresso e l'uscita frequente dei peer dalla rete, non la gestione delle chiavi TLS, che è un problema di sicurezza del canale, non di disponibilità dei peer.",
      "Perché ogni peer deve ricalcolare l'albero di instradamento OSPF prima di ogni scambio": "OSPF è un protocollo di routing IP usato dai router, non qualcosa che i peer applicativi calcolano prima di scambiarsi dati in un'architettura P2P.",
      "Perché il protocollo HTTP impedisce ai peer di mantenere una cache locale dei contenuti": "HTTP non vieta la cache locale: anzi la prevede esplicitamente, e comunque il churn è un fenomeno legato alla disponibilità dei peer, non al caching HTTP.",
    },
  },
  "evil-internet-020": {
    options: ["Aggiunge TLS sopra TCP, proteggendo il canale senza riscrivere il modello HTTP di base", "Sostituisce TCP con un trasporto UDP cifrato dedicato esclusivamente alle richieste GET", "Introduce un nuovo schema di indirizzamento che rimpiazza il DNS con MAC address firmati", "Rimuove la necessità di autenticare il server, delegandola interamente al browser"],
    correctAnswer: "Aggiunge TLS sopra TCP, proteggendo il canale senza riscrivere il modello HTTP di base",
    whyOthersAreWrong: {
      "Sostituisce TCP con un trasporto UDP cifrato dedicato esclusivamente alle richieste GET": "HTTPS non sostituisce TCP: TLS viene incapsulato sopra TCP, non su UDP, e la protezione riguarda l'intera connessione, non solo le richieste GET.",
      "Introduce un nuovo schema di indirizzamento che rimpiazza il DNS con MAC address firmati": "HTTPS non tocca la risoluzione dei nomi: continua a usare il DNS normalmente, non una tabella di MAC address firmati.",
      "Rimuove la necessità di autenticare il server, delegandola interamente al browser": "È vero il contrario: TLS introduce proprio l'autenticazione del server tramite certificato, un elemento che HTTP puro non prevede.",
    },
  },
  "evil-internet-057": {
    options: ["Perché i ritardi di rete cambiano e il valore deve adattarsi a RTT e variabilità osservati", "Perché il timer viene rinegoziato ogni volta tramite un nuovo three-way handshake", "Perché il valore dipende dal TTL residuo del datagramma IP in transito", "Perché ogni sistema operativo impone un timer fisso definito dallo standard IEEE 802.3"],
    correctAnswer: "Perché i ritardi di rete cambiano e il valore deve adattarsi a RTT e variabilità osservati",
    whyOthersAreWrong: {
      "Perché il timer viene rinegoziato ogni volta tramite un nuovo three-way handshake": "Il timer di ritrasmissione non richiede un nuovo handshake: TCP lo ricalcola dinamicamente stimando RTT e sua variabilità durante la connessione già stabilita.",
      "Perché il valore dipende dal TTL residuo del datagramma IP in transito": "Il TTL è un campo del datagramma IP che limita il numero di hop attraversabili e non determina il valore del timer di ritrasmissione TCP.",
      "Perché ogni sistema operativo impone un timer fisso definito dallo standard IEEE 802.3": "IEEE 802.3 riguarda Ethernet, il livello di collegamento: il timer di ritrasmissione è una funzione di TCP, calcolata dinamicamente e non fissata da uno standard di livello inferiore.",
    },
  },
  "evil-internet-032": {
    options: ["Mantiene sul server più stato condiviso, come cartelle e flag dei messaggi", "Evita completamente l'uso del DNS per individuare il server di posta in arrivo", "Si appoggia direttamente al protocollo ARP per localizzare il mail server remoto", "Converte automaticamente ogni allegato ricevuto in una nuova voce della zona DNS"],
    correctAnswer: "Mantiene sul server più stato condiviso, come cartelle e flag dei messaggi",
    whyOthersAreWrong: {
      "Evita completamente l'uso del DNS per individuare il server di posta in arrivo": "Sia IMAP sia POP3 richiedono comunque la risoluzione DNS del nome del server di posta: il vantaggio di IMAP riguarda lo stato condiviso su server, non l'uso del DNS.",
      "Si appoggia direttamente al protocollo ARP per localizzare il mail server remoto": "ARP risolve indirizzi MAC nella LAN locale e non viene usato per raggiungere un mail server remoto, che richiede instradamento IP e risoluzione DNS.",
      "Converte automaticamente ogni allegato ricevuto in una nuova voce della zona DNS": "Gli allegati di posta non hanno alcun rapporto con le zone DNS: IMAP gestisce messaggi e cartelle sul server, non record del sistema dei nomi.",
    },
  },
  "evil-internet-035": {
    options: ["Essendo connectionless, garantisce comunque consegna in ordine e ritrasmissione automatica", "Ha un header più leggero rispetto a quello di TCP, riducendo l'overhead per pacchetto", "È spesso preferito per streaming in tempo reale o per applicazioni di gaming online", "Non prevede una fase di apertura della connessione come il three-way handshake di TCP"],
    correctAnswer: "Essendo connectionless, garantisce comunque consegna in ordine e ritrasmissione automatica",
    whyOthersAreWrong: {
      "Ha un header più leggero rispetto a quello di TCP, riducendo l'overhead per pacchetto": "Questa affermazione è vera: l'header UDP è effettivamente più leggero di quello TCP, quindi non è la risposta cercata poiché la domanda chiede l'affermazione falsa.",
      "È spesso preferito per streaming in tempo reale o per applicazioni di gaming online": "È un'affermazione corretta: UDP è effettivamente adatto a streaming e gaming online grazie alla bassa latenza, quindi non è l'affermazione falsa richiesta.",
      "Non prevede una fase di apertura della connessione come il three-way handshake di TCP": "È vero: UDP è connectionless e non prevede un three-way handshake come TCP, quindi anche questa affermazione è corretta e non risponde alla domanda.",
    },
  },
  "evil-internet-064": {
    options: ["203.0.113.300", "192.168.100.1", "172.16.254.10", "10.100.200.50"],
    correctAnswer: "203.0.113.300",
    whyOthersAreWrong: {
      "192.168.100.1": "È un indirizzo IPv4 sintatticamente valido: tutti e quattro gli ottetti rientrano nell'intervallo consentito da 0 a 255.",
      "172.16.254.10": "È un indirizzo IPv4 valido, con ogni ottetto compreso tra 0 e 255, quindi non è la risposta cercata.",
      "10.100.200.50": "È un indirizzo IPv4 valido: nessun ottetto supera il valore massimo consentito di 255, a differenza di 300 nell'opzione corretta.",
    },
  },
  "evil-internet-065": {
    options: ["I primi 28 bit identificano la rete e restano 4 bit per gli host", "I primi 4 bit identificano la rete e restano 28 bit per gli host", "La maschera /28 indica che l'header IP occupa sempre 28 byte complessivi", "Il valore /28 stabilisce che il pacchetto può attraversare al massimo 28 hop"],
    correctAnswer: "I primi 28 bit identificano la rete e restano 4 bit per gli host",
    whyOthersAreWrong: {
      "I primi 4 bit identificano la rete e restano 28 bit per gli host": "È l'opposto: nella notazione /28 sono i primi 28 bit a identificare la rete, lasciando solo 4 bit per la parte host, non il contrario.",
      "La maschera /28 indica che l'header IP occupa sempre 28 byte complessivi": "La lunghezza del prefisso di rete non ha relazione con la dimensione dell'header IP, che è un campo distinto e tipicamente di 20 byte senza opzioni.",
      "Il valore /28 stabilisce che il pacchetto può attraversare al massimo 28 hop": "Il prefisso CIDR descrive quanti bit dell'indirizzo identificano la rete, non un limite al numero di router attraversabili, che è invece regolato dal TTL.",
    },
  },
  "evil-internet-056": {
    options: ["Il passaggio da slow start a congestion avoidance", "L'ingresso in fast recovery dopo tre ACK duplicati", "Il reset del timer di ritrasmissione al valore RTT iniziale", "La rinegoziazione del MSS concordato all'apertura"],
    correctAnswer: "Il passaggio da slow start a congestion avoidance",
    whyOthersAreWrong: {
      "L'ingresso in fast recovery dopo tre ACK duplicati": "Il fast recovery si attiva dopo tre ACK duplicati per una perdita rilevata, non quando cwnd supera ssthresh: sono due meccanismi distinti del controllo di congestione.",
      "Il reset del timer di ritrasmissione al valore RTT iniziale": "Il timer di ritrasmissione viene ricalcolato in base a RTT stimato e RTO, non resettato al superamento di ssthresh, che riguarda invece la crescita della finestra di congestione.",
      "La rinegoziazione del MSS concordato all'apertura": "Il MSS viene negoziato in apertura di connessione tramite le opzioni TCP e resta fisso per la connessione: non ha relazione con il superamento della soglia ssthresh.",
    },
  },
  "evil-internet-005": {
    options: ["Il Web è un'applicazione che gira sopra Internet; Internet non coincide con il Web", "Internet coincide esattamente con il Web, perché entrambi si basano solo su HTTP", "Il Web opera al livello di trasporto, mentre Internet è un'applicazione di livello superiore", "Internet include solo i server raggiungibili tramite browser con protocollo HTTPS"],
    correctAnswer: "Il Web è un'applicazione che gira sopra Internet; Internet non coincide con il Web",
    whyOthersAreWrong: {
      "Internet coincide esattamente con il Web, perché entrambi si basano solo su HTTP": "Internet è un'infrastruttura di rete che supporta molte applicazioni, non solo HTTP: email, VoIP, file sharing e altro girano su Internet indipendentemente dal Web.",
      "Il Web opera al livello di trasporto, mentre Internet è un'applicazione di livello superiore": "È l'opposto: il Web è un'applicazione di livello applicativo che si appoggia su Internet, non un livello di trasporto, mentre Internet è l'infrastruttura sottostante.",
      "Internet include solo i server raggiungibili tramite browser con protocollo HTTPS": "Internet comprende molti più host e servizi dei soli server web raggiungibili da browser: include posta, DNS, VoIP e infrastrutture non HTTP.",
    },
  },
  "evil-internet-038": {
    options: ["Il trasferimento affidabile di un file grande in cui conta arrivare completo e in ordine", "Uno stream video in diretta che tollera occasionali perdite di pacchetti", "Una sessione di gioco online che privilegia la bassa latenza sugli aggiornamenti", "Una singola interrogazione DNS di piccola dimensione verso il resolver locale"],
    correctAnswer: "Il trasferimento affidabile di un file grande in cui conta arrivare completo e in ordine",
    whyOthersAreWrong: {
      "Uno stream video in diretta che tollera occasionali perdite di pacchetti": "Uno stream live tollera bene piccole perdite pur di mantenere bassa latenza: è proprio il tipo di applicazione per cui UDP è adatto, non svantaggiato.",
      "Una sessione di gioco online che privilegia la bassa latenza sugli aggiornamenti": "Il gaming online beneficia della minore latenza di UDP rispetto a TCP: la tolleranza a qualche perdita è preferibile a ritardi di ritrasmissione.",
      "Una singola interrogazione DNS di piccola dimensione verso il resolver locale": "Una query DNS è piccola, richiede una singola richiesta/risposta e tollera bene un'eventuale ritrasmissione applicativa: è un caso tipico e adatto per UDP.",
    },
  },
  "evil-internet-090": {
    options: ["Agisce come punto di accesso al dominio wireless e ponte verso la rete locale", "Sostituisce completamente il router di frontiera nella connessione verso Internet", "Calcola le rotte tra sistemi autonomi utilizzando il protocollo BGP", "Applica la firma digitale a ogni pacchetto IP prima di inoltrarlo in uscita"],
    correctAnswer: "Agisce come punto di accesso al dominio wireless e ponte verso la rete locale",
    whyOthersAreWrong: {
      "Sostituisce completamente il router di frontiera nella connessione verso Internet": "L'access point fa da ponte tra la rete wireless e quella locale cablata, ma non svolge le funzioni di un router di frontiera verso Internet, che restano del gateway.",
      "Calcola le rotte tra sistemi autonomi utilizzando il protocollo BGP": "BGP è un protocollo di routing tra sistemi autonomi usato dai router di backbone, non una funzione svolta da un access point 802.11 a livello di accesso.",
      "Applica la firma digitale a ogni pacchetto IP prima di inoltrarlo in uscita": "L'access point opera principalmente al livello di collegamento e non applica firme digitali ai pacchetti IP: non è una funzione tipica di un AP.",
    },
  },
  "evil-internet-014": {
    options: ["Un tracker centrale aiuta i peer a trovarsi, ma il file viene poi scambiato tra peer", "Ogni host scarica l'intero file esclusivamente da un unico server centrale dedicato", "Un browser richiede una singola pagina HTTP a un solo server di origine", "Un resolver DNS interroga esclusivamente la cache del proprio server locale"],
    correctAnswer: "Un tracker centrale aiuta i peer a trovarsi, ma il file viene poi scambiato tra peer",
    whyOthersAreWrong: {
      "Ogni host scarica l'intero file esclusivamente da un unico server centrale dedicato": "Questo è un modello client-server puro, senza alcuno scambio diretto tra host: non c'è nulla di ibrido perché tutto il traffico dati passa dal server centrale.",
      "Un browser richiede una singola pagina HTTP a un solo server di origine": "È un classico scenario client-server: il browser dialoga con un solo origin server, senza alcuna componente peer-to-peer nello scambio dei dati.",
      "Un resolver DNS interroga esclusivamente la cache del proprio server locale": "L'interrogazione della sola cache locale è un comportamento puramente client-server verso il resolver, senza alcuno scambio diretto tra peer.",
    },
  },
  "evil-internet-002": {
    options: ["Più flussi condividono dinamicamente la stessa capacità, ma i ritardi possono variare nel tempo", "Ogni flusso riserva in anticipo una banda fissa dedicata per l'intera durata della trasmissione", "I pacchetti di uno stesso flusso percorrono sempre lo stesso circuito fisico dedicato", "Il ritardo di accodamento nei router viene eliminato completamente dalla commutazione di pacchetto"],
    correctAnswer: "Più flussi condividono dinamicamente la stessa capacità, ma i ritardi possono variare nel tempo",
    whyOthersAreWrong: {
      "Ogni flusso riserva in anticipo una banda fissa dedicata per l'intera durata della trasmissione": "Questa è la logica della commutazione di circuito con riserva di banda, non della multiplexing statistica a pacchetto, dove la capacità è condivisa dinamicamente senza riserva fissa.",
      "I pacchetti di uno stesso flusso percorrono sempre lo stesso circuito fisico dedicato": "L'uso di un circuito fisico dedicato è tipico della commutazione di circuito, mentre nella commutazione di pacchetto ogni pacchetto può seguire percorsi diversi.",
      "Il ritardo di accodamento nei router viene eliminato completamente dalla commutazione di pacchetto": "La commutazione di pacchetto introduce proprio ritardi di accodamento variabili nei router, non li elimina: è uno degli effetti tipici della multiplexing statistica.",
    },
  },
  "evil-internet-085": {
    options: ["Un FCS/CRC per il rilevamento di errori", "Il numero di sequenza TCP del segmento", "La porta di destinazione del socket", "Il valore TTL residuo del pacchetto IP"],
    correctAnswer: "Un FCS/CRC per il rilevamento di errori",
    whyOthersAreWrong: {
      "Il numero di sequenza TCP del segmento": "Il numero di sequenza è un campo dell'header TCP, un protocollo di livello trasporto: non fa parte del trailer di un frame Ethernet, che opera al livello di collegamento.",
      "La porta di destinazione del socket": "Le porte appartengono al livello di trasporto (TCP/UDP) e non compaiono nel frame Ethernet, il cui trailer contiene invece un campo per il controllo degli errori.",
      "Il valore TTL residuo del pacchetto IP": "Il TTL è un campo dell'header IP, non del frame Ethernet: il trailer Ethernet contiene invece il FCS/CRC per la rilevazione di errori di trasmissione.",
    },
  },
  "evil-internet-072": {
    options: ["Perché sfrutta la scadenza progressiva del TTL e osserva le risposte ICMP dei router intermedi", "Perché interroga direttamente la tabella di routing BGP di ogni router del percorso", "Perché ogni router inserisce il proprio indirizzo MAC in un campo dedicato dell'header IP", "Perché il server di destinazione registra e rispedisce l'elenco completo dei router attraversati"],
    correctAnswer: "Perché sfrutta la scadenza progressiva del TTL e osserva le risposte ICMP dei router intermedi",
    whyOthersAreWrong: {
      "Perché interroga direttamente la tabella di routing BGP di ogni router del percorso": "Traceroute non interroga le tabelle BGP dei router: si basa sulla scadenza del TTL e sui messaggi ICMP Time Exceeded restituiti dai router intermedi.",
      "Perché ogni router inserisce il proprio indirizzo MAC in un campo dedicato dell'header IP": "L'header IP non contiene un campo per l'indirizzo MAC dei router attraversati: il MAC ha significato solo nel singolo dominio di collegamento, non lungo tutto il percorso.",
      "Perché il server di destinazione registra e rispedisce l'elenco completo dei router attraversati": "Il server di destinazione non tiene traccia dei router attraversati: è il client a ricostruire il percorso osservando le risposte ICMP generate dai router intermedi.",
    },
  },
  "evil-internet-045": {
    options: ["Il campo TTL dell'header IP, usato per limitare il numero di hop attraversabili dal pacchetto", "Gli ACK cumulativi, che confermano al mittente la ricezione in sequenza dei byte", "I numeri di sequenza, che permettono di riordinare e individuare i segmenti mancanti", "Il timer di ritrasmissione, che fa ripartire l'invio se l'ACK atteso non arriva in tempo"],
    correctAnswer: "Il campo TTL dell'header IP, usato per limitare il numero di hop attraversabili dal pacchetto",
    whyOthersAreWrong: {
      "Gli ACK cumulativi, che confermano al mittente la ricezione in sequenza dei byte": "Gli ACK cumulativi sono uno dei meccanismi cardine dell'affidabilità TCP: confermano al mittente fino a che punto i dati sono stati ricevuti correttamente, quindi non sono la risposta cercata.",
      "I numeri di sequenza, che permettono di riordinare e individuare i segmenti mancanti": "I numeri di sequenza sono essenziali per rilevare perdite e riordinare i segmenti: contribuiscono direttamente all'affidabilità TCP, quindi non sono la risposta corretta a questa domanda.",
      "Il timer di ritrasmissione, che fa ripartire l'invio se l'ACK atteso non arriva in tempo": "Il timer di ritrasmissione è ciò che innesca il recupero delle perdite quando un ACK non arriva in tempo: è un meccanismo di affidabilità TCP, non la risposta cercata.",
    },
  },
  "evil-internet-006": {
    options: ["L'interoperabilità nasce dal fatto che host e apparati seguono protocolli e formati condivisi", "L'interoperabilità è garantita solo quando tutti gli host usano lo stesso sistema operativo", "Basta acquistare router della stessa marca per evitare ogni problema di compatibilità", "I protocolli descrivono esclusivamente le caratteristiche fisiche dei cavi di rete"],
    correctAnswer: "L'interoperabilità nasce dal fatto che host e apparati seguono protocolli e formati condivisi",
    whyOthersAreWrong: {
      "L'interoperabilità è garantita solo quando tutti gli host usano lo stesso sistema operativo": "L'interoperabilità dipende dal rispetto di protocolli e formati comuni, non dal sistema operativo: host con OS diversi comunicano regolarmente seguendo gli stessi standard.",
      "Basta acquistare router della stessa marca per evitare ogni problema di compatibilità": "La compatibilità tra apparati di rete dipende dal supporto agli stessi standard e protocolli, non dalla marca del produttore, anche se produttori diversi la implementano correttamente.",
      "I protocolli descrivono esclusivamente le caratteristiche fisiche dei cavi di rete": "I protocolli di rete definiscono formati dei messaggi e comportamenti dei nodi a più livelli, non solo caratteristiche fisiche dei cavi, che riguardano il solo livello fisico.",
    },
  },
  "evil-internet-079": {
    options: ["Usa CSMA/CA come meccanismo storico tipico del mezzo condiviso", "È associata al livello di collegamento dello stack protocollare", "Fornisce un servizio di consegna best effort, non affidabile", "Può includere un trailer FCS basato su CRC per rilevare errori"],
    correctAnswer: "Usa CSMA/CA come meccanismo storico tipico del mezzo condiviso",
    whyOthersAreWrong: {
      "È associata al livello di collegamento dello stack protocollare": "È un'affermazione vera: Ethernet opera al livello di collegamento, quindi non è l'affermazione falsa richiesta dalla domanda.",
      "Fornisce un servizio di consegna best effort, non affidabile": "È corretto: Ethernet offre un servizio best effort senza garanzie di affidabilità, quindi questa affermazione è vera e non risponde alla domanda.",
      "Può includere un trailer FCS basato su CRC per rilevare errori": "È vero: il frame Ethernet include tipicamente un FCS basato su CRC nel trailer per il rilevamento di errori, quindi non è l'affermazione falsa cercata.",
    },
  },
  "evil-internet-051": {
    options: ["Il ricevitore conserva e consegna in ordine qualsiasi pacchetto fuori sequenza come in Selective Repeat", "Gli ACK inviati dal ricevitore sono tipicamente cumulativi e confermano l'ultimo byte in ordine ricevuto", "Alla scadenza del timer il mittente può ritrasmettere l'intero blocco di pacchetti non ancora confermati", "La dimensione della finestra del mittente limita quanti pacchetti possono restare in transito senza ACK"],
    correctAnswer: "Il ricevitore conserva e consegna in ordine qualsiasi pacchetto fuori sequenza come in Selective Repeat",
    whyOthersAreWrong: {
      "Gli ACK inviati dal ricevitore sono tipicamente cumulativi e confermano l'ultimo byte in ordine ricevuto": "È un'affermazione corretta: in Go-Back-N gli ACK sono cumulativi, quindi questa non è l'affermazione falsa richiesta dalla domanda.",
      "Alla scadenza del timer il mittente può ritrasmettere l'intero blocco di pacchetti non ancora confermati": "È vero: alla scadenza del timer Go-Back-N ritrasmette in blocco tutti i pacchetti non confermati nella finestra, quindi questa affermazione è corretta e non è la risposta.",
      "La dimensione della finestra del mittente limita quanti pacchetti possono restare in transito senza ACK": "È corretto: la finestra del mittente limita il numero di pacchetti non confermati in volo, quindi questa affermazione è vera e non risponde alla domanda.",
    },
  },
  "evil-internet-018": {
    options: ["Possono ridurre latenza e traffico ripetuto, ma devono gestire la coerenza delle copie memorizzate", "Eliminano completamente la necessità del DNS memorizzando tutte le risoluzioni autoritative", "Garantiscono che l'oggetto richiesto sia sempre disponibile localmente senza mai contattare l'origin", "Sostituiscono il trasporto TCP con il protocollo ARP per servire più rapidamente le richieste già in cache"],
    correctAnswer: "Possono ridurre latenza e traffico ripetuto, ma devono gestire la coerenza delle copie memorizzate",
    whyOthersAreWrong: {
      "Eliminano completamente la necessità del DNS memorizzando tutte le risoluzioni autoritative": "Un proxy cache non elimina il bisogno del DNS: continua a risolvere i nomi degli origin server anche quando serve contenuti già memorizzati.",
      "Garantiscono che l'oggetto richiesto sia sempre disponibile localmente senza mai contattare l'origin": "Un proxy cache non garantisce la disponibilità locale di ogni oggetto: in caso di cache miss o scadenza deve comunque contattare l'origin server.",
      "Sostituiscono il trasporto TCP con il protocollo ARP per servire più rapidamente le richieste già in cache": "ARP risolve indirizzi MAC nella LAN locale e non è un sostituto di TCP: le richieste HTTP, anche servite da cache, continuano a viaggiare su connessioni TCP.",
    },
  },
  "evil-internet-001": {
    options: ["Il livello di rete di Internet garantisce consegna affidabile e ordinata dei pacchetti", "Il livello applicazione può utilizzare protocolli diversi sopra lo stesso livello di trasporto", "Ogni livello dello stack offre un servizio al livello immediatamente superiore", "La modularità a livelli riduce l'impatto delle modifiche interne a un singolo livello"],
    correctAnswer: "Il livello di rete di Internet garantisce consegna affidabile e ordinata dei pacchetti",
    whyOthersAreWrong: {
      "Il livello applicazione può utilizzare protocolli diversi sopra lo stesso livello di trasporto": "È un'affermazione vera: più protocolli applicativi come HTTP, SMTP e FTP possono girare sopra lo stesso TCP, quindi non è l'affermazione falsa cercata.",
      "Ogni livello dello stack offre un servizio al livello immediatamente superiore": "È corretto: nel modello a strati ogni livello offre servizi a quello superiore nascondendone i dettagli, quindi questa affermazione è vera e non risponde alla domanda.",
      "La modularità a livelli riduce l'impatto delle modifiche interne a un singolo livello": "È vero: l'incapsulamento a livelli isola le modifiche interne a un livello dagli altri, quindi questa affermazione è corretta e non è la risposta cercata.",
    },
  },
  "evil-internet-053": {
    options: ["Comunica quanto spazio libero resta nel buffer di ricezione del destinatario", "Indica quanti router restano ancora da attraversare fino a destinazione", "Conta il numero di ACK duplicati ricevuti fino a questo momento", "Stabilisce il valore iniziale del TTL per il prossimo datagramma inviato"],
    correctAnswer: "Comunica quanto spazio libero resta nel buffer di ricezione del destinatario",
    whyOthersAreWrong: {
      "Indica quanti router restano ancora da attraversare fino a destinazione": "Il numero di hop residui è legato al TTL del datagramma IP, non alla receive window TCP, che comunica invece lo spazio libero nel buffer di ricezione.",
      "Conta il numero di ACK duplicati ricevuti fino a questo momento": "Il conteggio degli ACK duplicati è usato per rilevare perdite, ad esempio nel fast retransmit, ma non è ciò che il campo receive window comunica al mittente.",
      "Stabilisce il valore iniziale del TTL per il prossimo datagramma inviato": "Il TTL è un campo dell'header IP impostato dal mittente del datagramma, non un valore derivato dalla finestra di ricezione TCP annunciata dal destinatario.",
    },
  },
  "evil-internet-043": {
    options: ["IP sorgente, porta sorgente, IP destinazione, porta destinazione", "Solo l'indirizzo MAC sorgente e l'indirizzo MAC di destinazione del frame", "IP sorgente, IP destinazione, valore del TTL e checksum dell'header", "Hostname del client, hostname del server e valore negoziato del MSS"],
    correctAnswer: "IP sorgente, porta sorgente, IP destinazione, porta destinazione",
    whyOthersAreWrong: {
      "Solo l'indirizzo MAC sorgente e l'indirizzo MAC di destinazione del frame": "Gli indirizzi MAC identificano le interfacce nel dominio di collegamento locale e cambiano a ogni hop: una connessione TCP è identificata da IP e porte, non da MAC.",
      "IP sorgente, IP destinazione, valore del TTL e checksum dell'header": "TTL e checksum sono campi dell'header IP legati al singolo datagramma, non elementi che identificano una connessione TCP: servono gli IP e le porte di entrambi gli estremi.",
      "Hostname del client, hostname del server e valore negoziato del MSS": "Una connessione TCP è identificata da indirizzi IP e numeri di porta, non da hostname: la risoluzione dei nomi avviene prima, tramite DNS, e non fa parte della tupla di connessione.",
    },
  },
  "evil-internet-010": {
    options: ["Adatta il segnale al mezzo di accesso e non sostituisce il routing IP", "Sceglie il cammino a costo minimo tra sistemi autonomi differenti", "Assegna i numeri di porta ai processi applicativi in esecuzione", "Risolve i nomi di dominio tramite interrogazioni DNS iterative"],
    correctAnswer: "Adatta il segnale al mezzo di accesso e non sostituisce il routing IP",
    whyOthersAreWrong: {
      "Sceglie il cammino a costo minimo tra sistemi autonomi differenti": "La scelta del percorso tra sistemi autonomi è compito di protocolli di routing come BGP eseguiti dai router, non una funzione del modem, che adatta il segnale al mezzo fisico.",
      "Assegna i numeri di porta ai processi applicativi in esecuzione": "L'assegnazione dei numeri di porta ai processi è una funzione del sistema operativo e dello stack di trasporto TCP/UDP, non del modem.",
      "Risolve i nomi di dominio tramite interrogazioni DNS iterative": "La risoluzione dei nomi di dominio è compito del DNS e dei resolver, non del modem, che opera a un livello diverso adattando il segnale al mezzo di accesso.",
    },
  },
  "evil-security-108": {
    options: ["Rende meno convenienti le tabelle precomputate ed evita hash identici per password uguali", "Permette di recuperare la password originale nel caso in cui l'utente se la dimentichi", "Sostituisce la necessità di usare una funzione hash robusta come bcrypt o Argon2", "Riduce il costo computazionale che un attaccante deve sostenere in un attacco offline"],
    correctAnswer: "Rende meno convenienti le tabelle precomputate ed evita hash identici per password uguali",
    whyOthersAreWrong: {
      "Permette di recuperare la password originale nel caso in cui l'utente se la dimentichi": "L'hashing, salt incluso, è una trasformazione a senso unico: non permette in alcun modo di risalire alla password originale.",
      "Sostituisce la necessità di usare una funzione hash robusta come bcrypt o Argon2": "Il salt si aggiunge alla scelta di una funzione hash robusta, non la sostituisce: servono entrambi per una memorizzazione sicura.",
      "Riduce il costo computazionale che un attaccante deve sostenere in un attacco offline": "Il salt fa esattamente l'opposto: aumenta il costo dell'attacco offline impedendo il riuso di tabelle precomputate su più account.",
    },
  },
  "evil-security-101": {
    options: ["Permette a due parti di concordare una chiave condivisa anche su un canale osservabile da terzi", "Permette a una delle due parti di firmare da sola certificati X.509 come farebbe una CA", "Cifra direttamente i dati applicativi della sessione con la chiave concordata, sostituendo AES", "Garantisce l'autenticazione reciproca delle parti anche senza certificati o chiavi a lungo termine"],
    correctAnswer: "Permette a due parti di concordare una chiave condivisa anche su un canale osservabile da terzi",
    whyOthersAreWrong: {
      "Permette a una delle due parti di firmare da sola certificati X.509 come farebbe una CA": "Diffie-Hellman è un protocollo di key agreement, non un meccanismo di emissione o firma di certificati.",
      "Cifra direttamente i dati applicativi della sessione con la chiave concordata, sostituendo AES": "DH produce solo un segreto condiviso: la cifratura dei dati viene poi affidata a un cifrario simmetrico come AES, non a DH stesso.",
      "Garantisce l'autenticazione reciproca delle parti anche senza certificati o chiavi a lungo termine": "Il DH puro non autentica le parti: senza certificati o firme è vulnerabile a un attacco man-in-the-middle durante lo scambio.",
    },
  },
  "evil-security-116": {
    options: ["Il client verifica l'identità del server e negozia le chiavi di sessione solo dopo quella validazione", "TLS elimina completamente la necessità di qualsiasi gestione delle chiavi crittografiche", "Il certificato del server viene distribuito automaticamente a ogni router lungo il percorso", "La sola cifratura simmetrica della sessione impedisce che un attaccante si frapponga durante l'handshake"],
    correctAnswer: "Il client verifica l'identità del server e negozia le chiavi di sessione solo dopo quella validazione",
    whyOthersAreWrong: {
      "TLS elimina completamente la necessità di qualsiasi gestione delle chiavi crittografiche": "TLS si basa proprio sulla gestione di chiavi (asimmetriche per l'handshake, simmetriche per la sessione): non le elimina affatto.",
      "Il certificato del server viene distribuito automaticamente a ogni router lungo il percorso": "I router intermedi non ricevono né elaborano il certificato del server: la verifica avviene solo tra client e server durante l'handshake.",
      "La sola cifratura simmetrica della sessione impedisce che un attaccante si frapponga durante l'handshake": "La cifratura simmetrica protegge la riservatezza dopo l'handshake, ma è l'autenticazione del server basata sul certificato a impedire il MITM.",
    },
  },
  "evil-security-119": {
    options: ["Crea un canale logico protetto sopra una rete non fidata, tramite incapsulamento, autenticazione e cifratura", "Sostituisce il DNS eliminando la necessità di risolvere nomi tramite server autoritativi", "Garantisce la riservatezza dei dati ma rende impossibile qualunque forma di autenticazione dell'utente", "Elimina sempre la latenza di propagazione fisica dovuta alla distanza geografica tra gli host"],
    correctAnswer: "Crea un canale logico protetto sopra una rete non fidata, tramite incapsulamento, autenticazione e cifratura",
    whyOthersAreWrong: {
      "Sostituisce il DNS eliminando la necessità di risolvere nomi tramite server autoritativi": "Una VPN opera a livello di canale di trasporto/rete e non ha alcun ruolo nella risoluzione dei nomi DNS.",
      "Garantisce la riservatezza dei dati ma rende impossibile qualunque forma di autenticazione dell'utente": "Al contrario, molte VPN includono meccanismi di autenticazione dell'utente o dell'endpoint come parte dell'instaurazione del tunnel.",
      "Elimina sempre la latenza di propagazione fisica dovuta alla distanza geografica tra gli host": "La VPN incapsula e cifra il traffico, ma non può ridurre la latenza fisica dovuta alla distanza; anzi introduce overhead aggiuntivo.",
    },
  },
  "evil-security-105": {
    options: ["L'hash produce un'impronta a dimensione fissa e non è progettato per essere invertito come un cifrario", "Perché un hash usa sempre la chiave privata del destinatario per generare il proprio digest", "Perché ogni valore hash incorpora l'indirizzo MAC del mittente che ha generato il messaggio", "Perché un digest hash può essere decifrato soltanto da chi conosce il server DNS locale"],
    correctAnswer: "L'hash produce un'impronta a dimensione fissa e non è progettato per essere invertito come un cifrario",
    whyOthersAreWrong: {
      "Perché un hash usa sempre la chiave privata del destinatario per generare il proprio digest": "Le funzioni hash crittografiche standard non utilizzano alcuna chiave: sono funzioni pubbliche e deterministiche.",
      "Perché ogni valore hash incorpora l'indirizzo MAC del mittente che ha generato il messaggio": "Un digest hash dipende esclusivamente dal contenuto in input, non da informazioni di rete come l'indirizzo MAC.",
      "Perché un digest hash può essere decifrato soltanto da chi conosce il server DNS locale": "L'hash non è cifratura e non esiste un'operazione di 'decifratura': il concetto di DNS locale è del tutto estraneo alla proprietà di irreversibilità.",
    },
  },
  "evil-security-091": {
    options: ["Un attacco che rende il servizio irraggiungibile agli utenti legittimi che ne hanno diritto", "La lettura non autorizzata di un file cifrato da parte di un utente esterno alla comunicazione", "La modifica non rilevata di un pacchetto durante il transito lungo la rete verso il destinatario", "L'intercettazione passiva di credenziali trasmesse in chiaro su un canale non protetto"],
    correctAnswer: "Un attacco che rende il servizio irraggiungibile agli utenti legittimi che ne hanno diritto",
    whyOthersAreWrong: {
      "La lettura non autorizzata di un file cifrato da parte di un utente esterno alla comunicazione": "Questo scenario compromette la confidenzialità dei dati, non la disponibilità del servizio.",
      "La modifica non rilevata di un pacchetto durante il transito lungo la rete verso il destinatario": "Questo caso riguarda una violazione dell'integrità dei dati, non della loro disponibilità.",
      "L'intercettazione passiva di credenziali trasmesse in chiaro su un canale non protetto": "L'intercettazione passiva è un attacco alla confidenzialità: il servizio resta comunque raggiungibile dagli utenti legittimi.",
    },
  },
  "evil-security-095": {
    options: ["La cifratura simmetrica è reversibile con la chiave giusta; l'hash non nasce per essere invertito", "Entrambe le tecniche richiedono necessariamente una coppia di chiavi, una pubblica e una privata", "L'hash utilizza la stessa chiave segreta impiegata dal cifrario simmetrico corrispondente", "La cifratura simmetrica produce sempre un output di lunghezza fissa come un digest hash"],
    correctAnswer: "La cifratura simmetrica è reversibile con la chiave giusta; l'hash non nasce per essere invertito",
    whyOthersAreWrong: {
      "Entrambe le tecniche richiedono necessariamente una coppia di chiavi, una pubblica e una privata": "La cifratura simmetrica usa un'unica chiave condivisa e l'hash non usa alcuna chiave: nessuna delle due richiede una coppia pubblica/privata.",
      "L'hash utilizza la stessa chiave segreta impiegata dal cifrario simmetrico corrispondente": "Le funzioni hash crittografiche non utilizzano alcuna chiave, a differenza della cifratura simmetrica.",
      "La cifratura simmetrica produce sempre un output di lunghezza fissa come un digest hash": "Il ciphertext di un cifrario simmetrico ha lunghezza legata al testo in chiaro (a meno di padding), non una lunghezza fissa come un digest hash.",
    },
  },
  "evil-security-110": {
    options: ["Per efficienza e praticità, mantenendo comunque il legame crittografico con l'integrità del contenuto", "Perché gli algoritmi di firma asimmetrica non possono operare su un input in formato binario", "Perché firmare il documento intero anziché il suo hash ne impedirebbe la verifica dell'autenticità", "Perché firmare l'hash del documento ne cifra automaticamente l'intero contenuto originale"],
    correctAnswer: "Per efficienza e praticità, mantenendo comunque il legame crittografico con l'integrità del contenuto",
    whyOthersAreWrong: {
      "Perché gli algoritmi di firma asimmetrica non possono operare su un input in formato binario": "Gli algoritmi di firma possono operare su qualunque input binario: il vero motivo per firmare l'hash è l'efficienza su documenti grandi.",
      "Perché firmare il documento intero anziché il suo hash ne impedirebbe la verifica dell'autenticità": "Firmare il documento intero è comunque tecnicamente verificabile, semplicemente molto più costoso in termini di calcolo.",
      "Perché firmare l'hash del documento ne cifra automaticamente l'intero contenuto originale": "La firma di un hash non cifra il documento: il contenuto resta in chiaro, la firma ne garantisce solo integrità e autenticità.",
    },
  },
  "evil-security-113": {
    options: ["Bisogna validare anche firma, catena di fiducia, nome richiesto e periodo di validità", "Un certificato è sufficiente da solo se la connessione avviene su una porta cifrata", "La fiducia nel server deriva dal suo indirizzo MAC e non dalla gerarchia della PKI", "Un certificato X.509 valido non contiene mai la chiave pubblica del server"],
    correctAnswer: "Bisogna validare anche firma, catena di fiducia, nome richiesto e periodo di validità",
    whyOthersAreWrong: {
      "Un certificato è sufficiente da solo se la connessione avviene su una porta cifrata": "Il numero o il tipo di porta non ha alcun ruolo nella validazione crittografica del certificato.",
      "La fiducia nel server deriva dal suo indirizzo MAC e non dalla gerarchia della PKI": "L'indirizzo MAC non ha alcun ruolo nella PKI: la fiducia deriva dalla catena di certificazione fino a una CA radice fidata.",
      "Un certificato X.509 valido non contiene mai la chiave pubblica del server": "Un certificato X.509 contiene proprio la chiave pubblica del server, elemento essenziale del certificato stesso.",
    },
  },
  "evil-security-114": {
    options: ["Durante il TLS handshake, prima di affidare dati sensibili al canale appena stabilito", "Solo dopo aver ricevuto e processato l'intero corpo della risposta applicativa", "Durante la negoziazione DHCP che precede l'apertura della connessione TCP", "Nel momento in cui il primo router decrementa il TTL del pacchetto in transito"],
    correctAnswer: "Durante il TLS handshake, prima di affidare dati sensibili al canale appena stabilito",
    whyOthersAreWrong: {
      "Solo dopo aver ricevuto e processato l'intero corpo della risposta applicativa": "Verificare l'identità solo dopo aver già ricevuto dati applicativi vanificherebbe la protezione: la verifica avviene durante l'handshake, prima dello scambio dati.",
      "Durante la negoziazione DHCP che precede l'apertura della connessione TCP": "DHCP riguarda l'assegnazione di configurazione di rete e non ha alcun ruolo nella verifica dell'identità TLS del server.",
      "Nel momento in cui il primo router decrementa il TTL del pacchetto in transito": "Il TTL è un campo IP gestito dai router per evitare loop di instradamento, estraneo alla verifica dell'identità del server.",
    },
  },
  "evil-security-096": {
    options: ["Usa una coppia di chiavi correlate con ruoli diversi, una pubblica e una privata", "Usa sempre un unico segreto condiviso da entrambe le parti della comunicazione", "Non può in alcun caso essere impiegata per generare firme digitali verificabili", "Richiede che il destinatario conosca in anticipo la chiave privata del mittente"],
    correctAnswer: "Usa una coppia di chiavi correlate con ruoli diversi, una pubblica e una privata",
    whyOthersAreWrong: {
      "Usa sempre un unico segreto condiviso da entrambe le parti della comunicazione": "Questa è la caratteristica della crittografia simmetrica, non di quella asimmetrica, che usa coppie di chiavi distinte.",
      "Non può in alcun caso essere impiegata per generare firme digitali verificabili": "La crittografia asimmetrica è proprio alla base delle firme digitali, generate con la chiave privata e verificate con quella pubblica.",
      "Richiede che il destinatario conosca in anticipo la chiave privata del mittente": "La chiave privata non viene mai condivisa: il destinatario usa solo la chiave pubblica corrispondente, che è per definizione pubblica.",
    },
  },
  "evil-security-109": {
    options: ["Integrità del contenuto, autenticità dell'origine e supporto al non ripudio", "Riservatezza del contenuto, poiché la firma cifra il documento rendendolo illeggibile", "Disponibilità del servizio, garantendo che il documento firmato sia sempre online", "Anonimato del firmatario, poiché la chiave privata non è mai legata alla sua identità"],
    correctAnswer: "Integrità del contenuto, autenticità dell'origine e supporto al non ripudio",
    whyOthersAreWrong: {
      "Riservatezza del contenuto, poiché la firma cifra il documento rendendolo illeggibile": "La firma digitale non cifra il documento e non garantisce riservatezza: il contenuto resta leggibile, viene solo firmato.",
      "Disponibilità del servizio, garantendo che il documento firmato sia sempre online": "La disponibilità del servizio non è una proprietà legata alla firma digitale, che riguarda il documento e la sua provenienza.",
      "Anonimato del firmatario, poiché la chiave privata non è mai legata alla sua identità": "È vero il contrario: la firma digitale lega esplicitamente il documento all'identità del firmatario associata alla chiave pubblica.",
    },
  },
  "evil-security-120": {
    options: ["Nonce, sequence number o timestamp verificabili associati a ciascun messaggio", "Il solo indirizzo MAC del mittente incluso nell'intestazione del messaggio", "La cifratura simmetrica del payload con una chiave di sessione condivisa", "Il calcolo di un HMAC sul messaggio senza alcun contatore o timestamp"],
    correctAnswer: "Nonce, sequence number o timestamp verificabili associati a ciascun messaggio",
    whyOthersAreWrong: {
      "Il solo indirizzo MAC del mittente incluso nell'intestazione del messaggio": "L'indirizzo MAC identifica una scheda di rete ma non varia tra un invio e la sua ripetizione: non impedisce il replay.",
      "La cifratura simmetrica del payload con una chiave di sessione condivisa": "Cifrare il payload protegge la riservatezza, ma un messaggio cifrato può comunque essere ricatturato e ritrasmesso identico.",
      "Il calcolo di un HMAC sul messaggio senza alcun contatore o timestamp": "Un HMAC garantisce integrità e autenticità, ma senza un elemento di freschezza un messaggio autentico vecchio resta comunque riproponibile.",
    },
  },
  "evil-security-094": {
    options: ["La cifratura simmetrica è molto più efficiente nel trattare grandi volumi di dati", "La crittografia asimmetrica non è mai in grado di autenticare l'identità del server", "La cifratura simmetrica elimina completamente la necessità di una chiave di sessione", "Il protocollo TLS vieta esplicitamente l'uso dell'asimmetrica per scambiare segreti"],
    correctAnswer: "La cifratura simmetrica è molto più efficiente nel trattare grandi volumi di dati",
    whyOthersAreWrong: {
      "La crittografia asimmetrica non è mai in grado di autenticare l'identità del server": "È proprio la crittografia asimmetrica, tramite certificati e firme, a permettere l'autenticazione del server nell'handshake iniziale.",
      "La cifratura simmetrica elimina completamente la necessità di una chiave di sessione": "La cifratura simmetrica funziona proprio grazie a una chiave di sessione: non ne elimina il bisogno, la utilizza direttamente.",
      "Il protocollo TLS vieta esplicitamente l'uso dell'asimmetrica per scambiare segreti": "TLS fa esattamente l'opposto: usa la crittografia asimmetrica nell'handshake per scambiare o concordare il segreto iniziale.",
    },
  },
  "evil-security-097": {
    options: ["La difficoltà di fattorizzare il prodotto di due grandi numeri primi", "La difficoltà di risolvere il problema del logaritmo discreto su curve ellittiche", "La difficoltà di invertire una funzione di hash crittografica a senso unico", "La difficoltà di trovare collisioni in uno spazio di chiavi simmetriche a 256 bit"],
    correctAnswer: "La difficoltà di fattorizzare il prodotto di due grandi numeri primi",
    whyOthersAreWrong: {
      "La difficoltà di risolvere il problema del logaritmo discreto su curve ellittiche": "Questo è il fondamento della crittografia a curve ellittiche (ECC), non della sicurezza classica di RSA, basata sulla fattorizzazione.",
      "La difficoltà di invertire una funzione di hash crittografica a senso unico": "L'irreversibilità dell'hash è una proprietà delle funzioni hash, un meccanismo crittografico diverso e indipendente da RSA.",
      "La difficoltà di trovare collisioni in uno spazio di chiavi simmetriche a 256 bit": "Questo riguarda la resistenza a brute force di un cifrario simmetrico, non il problema matematico su cui si fonda RSA.",
    },
  },
  "evil-internet-015": {
    options: [
      "Ogni risposta HTTP deve sempre includere un body, anche nei codici che non lo prevedono",
      "La request line indica metodo, risorsa richiesta e versione del protocollo usato",
      "Le intestazioni della risposta terminano sempre con una riga vuota separata",
      "Il protocollo HTTP è di base stateless, senza memoria tra richieste diverse",
    ],
    correctAnswer:
      "Ogni risposta HTTP deve sempre includere un body, anche nei codici che non lo prevedono",
    whyOthersAreWrong: {
      "La request line indica metodo, risorsa richiesta e versione del protocollo usato":
        "Questa è una descrizione corretta della request line HTTP, quindi non è l'affermazione falsa richiesta.",
      "Le intestazioni della risposta terminano sempre con una riga vuota separata":
        "È corretto: una riga vuota separa le intestazioni dal body, quindi non è l'affermazione falsa.",
      "Il protocollo HTTP è di base stateless, senza memoria tra richieste diverse":
        "È corretto: HTTP di base non mantiene stato tra richieste, quindi non è l'affermazione falsa.",
    },
  },
  "evil-internet-017": {
    options: [
      "Perché lo stato viene mantenuto da cookie, sessioni o token esterni al protocollo",
      "Perché HTTP non permette in alcun modo di autenticare un utente collegato",
      "Perché ogni pagina viene trasportata in un solo pacchetto IP senza memoria",
      "Perché HTTPS cancella automaticamente ogni dato dopo ciascuna richiesta",
    ],
    correctAnswer:
      "Perché lo stato viene mantenuto da cookie, sessioni o token esterni al protocollo",
    whyOthersAreWrong: {
      "Perché HTTP non permette in alcun modo di autenticare un utente collegato":
        "HTTP supporta meccanismi di autenticazione (header, cookie, token); l'affermazione è falsa.",
      "Perché ogni pagina viene trasportata in un solo pacchetto IP senza memoria":
        "Il numero di pacchetti IP usati per trasportare una pagina non ha nulla a che fare con la natura stateless di HTTP.",
      "Perché HTTPS cancella automaticamente ogni dato dopo ciascuna richiesta":
        "HTTPS aggiunge solo cifratura al trasporto: non cancella dati applicativi né modifica la natura stateless del protocollo.",
    },
  },
  "evil-internet-041": {
    options: [
      "Rileva errori nel datagramma, ma non garantisce da solo affidabilità end-to-end",
      "Rende UDP equivalente a TCP per quanto riguarda la consegna affidabile dei dati",
      "Verifica soltanto l'indirizzo MAC del mittente, ignorando dati e pseudo-header",
      "Serve a calcolare la subnet mask utilizzata dal mittente del pacchetto",
    ],
    correctAnswer:
      "Rileva errori nel datagramma, ma non garantisce da solo affidabilità end-to-end",
    whyOthersAreWrong: {
      "Rende UDP equivalente a TCP per quanto riguarda la consegna affidabile dei dati":
        "Il checksum rileva solo corruzioni: non introduce ACK, ritrasmissioni o ordinamento come TCP.",
      "Verifica soltanto l'indirizzo MAC del mittente, ignorando dati e pseudo-header":
        "Il checksum UDP copre dati e pseudo-header IP, non l'indirizzo MAC, che appartiene al livello di collegamento.",
      "Serve a calcolare la subnet mask utilizzata dal mittente del pacchetto":
        "La subnet mask è un parametro di configurazione IP, non qualcosa calcolato dal checksum UDP.",
    },
  },
  "evil-security-099": {
    options: [
      "Perché è molto più oneroso della cifratura simmetrica, quindi si preferisce per handshake e firme",
      "Perché l'algoritmo RSA non è in grado di elaborare dati rappresentati in forma binaria",
      "Perché RSA, per come è definito, funziona solo all'interno dei pacchetti ARP della rete locale",
      "Perché RSA, per definizione, non fa mai uso di una coppia di chiavi pubblica e privata",
    ],
    correctAnswer:
      "Perché è molto più oneroso della cifratura simmetrica, quindi si preferisce per handshake e firme",
    whyOthersAreWrong: {
      "Perché l'algoritmo RSA non è in grado di elaborare dati rappresentati in forma binaria":
        "RSA opera su rappresentazioni numeriche di qualunque dato binario: non è questa la ragione dell'uso limitato.",
      "Perché RSA, per come è definito, funziona solo all'interno dei pacchetti ARP della rete locale":
        "RSA è un algoritmo crittografico indipendente da ARP e dal livello di collegamento locale.",
      "Perché RSA, per definizione, non fa mai uso di una coppia di chiavi pubblica e privata":
        "È vero il contrario: RSA si basa proprio su una coppia di chiavi pubblica/privata.",
    },
  },
  "evil-security-103": {
    options: [
      "Perché offrono forward secrecy, limitando i danni di una futura compromissione della chiave a lungo termine",
      "Perché eliminano del tutto e per sempre la necessità di autenticare la controparte remota",
      "Perché sostituiscono completamente la funzione di integrità svolta da hash e HMAC nel protocollo",
      "Perché rendono impossibile qualsiasi attacco di replay anche senza altri accorgimenti aggiuntivi",
    ],
    correctAnswer:
      "Perché offrono forward secrecy, limitando i danni di una futura compromissione della chiave a lungo termine",
    whyOthersAreWrong: {
      "Perché eliminano del tutto e per sempre la necessità di autenticare la controparte remota":
        "L'autenticazione resta necessaria: senza di essa DH effimero è comunque esposto al man-in-the-middle.",
      "Perché sostituiscono completamente la funzione di integrità svolta da hash e HMAC nel protocollo":
        "DH effimero riguarda l'accordo sulla chiave, non l'integrità dei messaggi, che resta compito di hash/HMAC.",
      "Perché rendono impossibile qualsiasi attacco di replay anche senza altri accorgimenti aggiuntivi":
        "Il replay va gestito con meccanismi dedicati (nonce, contatori); DH effimero da solo non lo impedisce.",
    },
  },
};

export const advancedQuestions: Question[] = hardSeeds.map((seed) =>
  applyQuestionAudit(buildHardQuestion(seed), hardQuestionAudits[seed.id]),
);

export const hardQuestionIds = advancedQuestions.map((question) => question.id);
