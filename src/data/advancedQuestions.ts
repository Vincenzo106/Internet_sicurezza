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
    question:
      "Perché un HMAC valido non fornisce non ripudio nello stesso modo di una firma digitale?",
    options: [
      "Perché tutte le parti che condividono la chiave segreta possono generare un HMAC indistinguibile",
      "Perché HMAC usa solo chiavi pubbliche e quindi chiunque può firmare",
      "Perché HMAC non verifica in alcun modo l'integrità del messaggio",
      "Perché HMAC può essere calcolato solo su reti locali Ethernet",
    ],
    correctAnswer:
      "Perché tutte le parti che condividono la chiave segreta possono generare un HMAC indistinguibile",
    explanation:
      "HMAC garantisce integrità e autenticazione simmetrica tra soggetti che condividono lo stesso segreto, ma proprio per questo non permette di attribuire il messaggio a un unico autore. In una firma digitale, invece, solo il titolare della chiave privata può produrre la firma verificabile da terzi.",
    whyOthersAreWrong: {
      "Perché HMAC usa solo chiavi pubbliche e quindi chiunque può firmare":
        "HMAC non usa chiavi pubbliche: si basa su una chiave segreta condivisa.",
      "Perché HMAC non verifica in alcun modo l'integrità del messaggio":
        "Al contrario, l'integrità è una delle proprietà principali di HMAC.",
      "Perché HMAC può essere calcolato solo su reti locali Ethernet":
        "HMAC è un costrutto crittografico indipendente dal mezzo trasmissivo o dal livello di rete.",
    },
  },
  "evil-security-111": {
    question:
      "Quale controllo collega davvero il certificato HTTPS al sito che il browser voleva raggiungere?",
    options: [
      "La corrispondenza tra il nome richiesto e i campi SAN o CN del certificato",
      "La corrispondenza tra l'indirizzo MAC del server e quello della CA",
      "Il fatto che il server usi una porta TCP maggiore di 1024",
      "La presenza di un record DHCP valido nella LAN del client",
    ],
    correctAnswer:
      "La corrispondenza tra il nome richiesto e i campi SAN o CN del certificato",
    explanation:
      "Nel modello HTTPS il client non si fida di un certificato solo perché esiste: deve verificare anche che il nome richiesto, per esempio `www.example.com`, sia effettivamente coperto dai campi di identità presenti nel certificato, oggi soprattutto nel Subject Alternative Name.",
    whyOthersAreWrong: {
      "La corrispondenza tra l'indirizzo MAC del server e quello della CA":
        "I MAC address non hanno alcun ruolo nella validazione dell'identità X.509 sul Web.",
      "Il fatto che il server usi una porta TCP maggiore di 1024":
        "Il numero di porta non certifica l'identità del server.",
      "La presenza di un record DHCP valido nella LAN del client":
        "DHCP assegna configurazione di rete, ma non partecipa alla verifica del certificato remoto.",
    },
  },
  "evil-security-112": {
    question:
      "Perché un certificato firmato da una Certification Authority intermedia può essere accettato dal browser?",
    options: [
      "Perché il client valida una catena di firme che risale fino a una root CA fidata",
      "Perché ogni certificato intermedio è automaticamente fidato senza controlli",
      "Perché il server invia insieme al certificato anche la propria password privata",
      "Perché il browser si basa sul TTL del pacchetto per capire se la CA è autentica",
    ],
    correctAnswer:
      "Perché il client valida una catena di firme che risale fino a una root CA fidata",
    explanation:
      "La fiducia in PKI è gerarchica: il browser non deve conoscere personalmente ogni server o ogni CA intermedia, ma deve riuscire a costruire e verificare una catena di certificati che termini in una root CA già presente nel trust store del sistema o del browser.",
    whyOthersAreWrong: {
      "Perché ogni certificato intermedio è automaticamente fidato senza controlli":
        "Una CA intermedia viene accettata solo se la sua firma e la catena risultano valide.",
      "Perché il server invia insieme al certificato anche la propria password privata":
        "Una chiave privata non va mai inviata al client.",
      "Perché il browser si basa sul TTL del pacchetto per capire se la CA è autentica":
        "Il TTL è un campo IP e non ha alcun ruolo nella fiducia PKI.",
    },
  },
  "evil-security-118": {
    question:
      "Dopo che il client ha ottenuto il Ticket Granting Ticket in Kerberos, che cosa richiede tipicamente al Ticket Granting Server?",
    options: [
      "Un service ticket valido per un servizio specifico del dominio",
      "Un nuovo indirizzo IP per parlare con il server applicativo",
      "La chiave privata della KDC per firmare da solo le richieste",
      "Un certificato X.509 da usare al posto di tutti i ticket",
    ],
    correctAnswer:
      "Un service ticket valido per un servizio specifico del dominio",
    explanation:
      "Il TGT serve come credenziale intermedia per evitare di reinserire la password a ogni accesso. Una volta autenticato, il client lo presenta al Ticket Granting Server per ottenere ticket di servizio separati, ciascuno destinato a uno specifico server o servizio.",
    whyOthersAreWrong: {
      "Un nuovo indirizzo IP per parlare con il server applicativo":
        "Kerberos gestisce autenticazione e ticket, non configurazione IP.",
      "La chiave privata della KDC per firmare da solo le richieste":
        "Le chiavi segrete della KDC non vengono mai distribuite ai client.",
      "Un certificato X.509 da usare al posto di tutti i ticket":
        "Kerberos e PKI possono coesistere, ma il TGS non sostituisce il protocollo con certificati X.509.",
    },
  },
};

export const advancedQuestions: Question[] = hardSeeds.map((seed) =>
  applyQuestionAudit(buildHardQuestion(seed), hardQuestionAudits[seed.id]),
);

export const hardQuestionIds = advancedQuestions.map((question) => question.id);
