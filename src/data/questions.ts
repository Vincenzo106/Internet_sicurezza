import { advancedQuestions, hardQuestionIds } from "./advancedQuestions";
import { historicalQuestions } from "./historicalQuestions";
import { securityExtraQuestions } from "./securityExtraQuestions";
import type { Question, TopicGroup } from "../types";
import { applyQuestionAudit, type QuestionAuditOverride } from "./questionAudit";

type BaseQuestion = Omit<Question, "examLikelihood" | "sourceType">;

export const topicGroups: TopicGroup[] = [
  {
    category: "Internet",
    title: "Fondamenti Internet e Reti",
    topics: [
      "Introduzione a Internet",
      "ISP, router, switch, modem, access point",
      "Client-server e P2P",
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
      "livello collegamento",
      "Ethernet",
      "MAC address",
      "ARP",
      "switch",
      "Wi-Fi e reti mobili",
    ],
  },
  {
    category: "Sicurezza",
    title: "Sicurezza e Crittografia",
    topics: [
      "concetti base CIA: confidenzialità, integrità, disponibilità",
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
      "Kerberos",
      "VPN",
      "IPsec",
      "attacchi principali",
    ],
  },
];

function guide(
  conceptToReview: string,
  miniSummary: string,
  memoryTrick: string,
  similarExamQuestion: string,
) {
  return {
    conceptToReview,
    miniSummary,
    memoryTrick,
    similarExamQuestion,
  };
}

const baseQuestions: BaseQuestion[] = [
  {
    id: "internet-001",
    category: "Internet",
    topic: "Introduzione a Internet",
    difficulty: "facile",
    question:
      "Quale definizione descrive meglio Internet secondo l’approccio top-down?",
    options: [
      "Un insieme di reti interconnesse che comunicano tramite protocolli condivisi",
      "Un unico supercomputer distribuito in tutti gli ISP",
      "Una rete privata usata solo dai provider per il routing interno",
      "Un insieme di pagine web statiche raggiungibili via browser",
    ],
    correctAnswer:
      "Un insieme di reti interconnesse che comunicano tramite protocolli condivisi",
    explanation:
      "Internet non è una singola rete né un singolo calcolatore: è una rete di reti. Host, router, link e applicazioni cooperano grazie a protocolli standard come IP, TCP, UDP, HTTP e DNS. L’idea chiave del corso è proprio questa: servizi diversi possono interoperare perché condividono regole comuni di comunicazione.",
    whyOthersAreWrong: {
      "Un unico supercomputer distribuito in tutti gli ISP":
        "Internet distribuisce risorse e servizi, ma non si comporta come un solo elaboratore centralizzato.",
      "Una rete privata usata solo dai provider per il routing interno":
        "I provider partecipano all’infrastruttura, ma Internet include anche host finali, server e reti locali pubbliche o private.",
      "Un insieme di pagine web statiche raggiungibili via browser":
        "Il Web è solo una delle applicazioni che usano Internet, non Internet stesso.",
    },
    source: "Capitolo 1 - Reti Di Calcolatori E Di Internet.pdf",
    studyGuide: guide(
      "Distinzione tra Internet come infrastruttura e Web come applicazione.",
      "Internet fornisce il trasporto dei dati tra sistemi eterogenei; il Web è uno dei servizi che sfrutta questa infrastruttura.",
      "Se senti 'rete di reti', pensa subito a Internet; se senti 'pagine e browser', pensa al Web.",
      "Quale affermazione distingue correttamente Internet dal World Wide Web?",
    ),
  },
  {
    id: "internet-002",
    category: "Internet",
    topic: "Introduzione a Internet",
    difficulty: "media",
    question:
      "Quale caratteristica appartiene al packet switching e non al circuit switching?",
    options: [
      "Le risorse del collegamento vengono condivise dinamicamente tra più flussi",
      "Prima di trasmettere serve riservare in modo stabile banda end-to-end",
      "Ogni comunicazione usa sempre lo stesso ritardo per tutta la sessione",
      "Ogni pacchetto viene trasmesso solo dopo un setup di circuito dedicato",
    ],
    correctAnswer:
      "Le risorse del collegamento vengono condivise dinamicamente tra più flussi",
    explanation:
      "Nel packet switching i pacchetti di utenti diversi condividono i link in modo statistico e vengono inoltrati man mano che arrivano. Questo aumenta l’efficienza quando il traffico è bursty, ma introduce variabilità nei ritardi e possibili code. Il circuit switching, invece, tende a riservare capacità in anticipo.",
    whyOthersAreWrong: {
      "Prima di trasmettere serve riservare in modo stabile banda end-to-end":
        "Questa è la logica del circuit switching, non del packet switching di Internet.",
      "Ogni comunicazione usa sempre lo stesso ritardo per tutta la sessione":
        "Nel packet switching i ritardi dipendono da code, congestione e percorso.",
      "Ogni pacchetto viene trasmesso solo dopo un setup di circuito dedicato":
        "I pacchetti IP possono essere inviati senza una prenotazione end-to-end del canale.",
    },
    source: "Capitolo 1 - Reti Di Calcolatori E Di Internet.pdf",
    studyGuide: guide(
      "Differenza tra commutazione di pacchetto e di circuito.",
      "Internet è packet-switched: i link non vengono dedicati a un solo utente, ma condivisi dinamicamente.",
      "Packet switching = flessibilità; circuit switching = prenotazione.",
      "Perché Internet adotta la commutazione di pacchetto invece di circuiti dedicati?",
    ),
  },
  {
    id: "internet-003",
    category: "Internet",
    topic: "Introduzione a Internet",
    difficulty: "media",
    question:
      "Che cosa rappresenta il ritardo di propagazione in una rete di comunicazione?",
    options: [
      "Il tempo necessario al segnale per attraversare fisicamente il mezzo trasmissivo",
      "Il tempo richiesto per inserire tutti i bit del pacchetto sul link",
      "Il tempo richiesto dal router per decidere il next hop",
      "Il tempo medio che un pacchetto passa nella coda di uscita",
    ],
    correctAnswer:
      "Il tempo necessario al segnale per attraversare fisicamente il mezzo trasmissivo",
    explanation:
      "Il ritardo di propagazione dipende dalla distanza tra i nodi e dalla velocità del segnale nel mezzo, per esempio rame, fibra o aria. Non dipende dalla dimensione del pacchetto. Va distinto dal ritardo di trasmissione, che invece dipende da lunghezza del pacchetto e bitrate del link.",
    whyOthersAreWrong: {
      "Il tempo richiesto per inserire tutti i bit del pacchetto sul link":
        "Questa è la definizione di ritardo di trasmissione.",
      "Il tempo richiesto dal router per decidere il next hop":
        "Questo è ritardo di elaborazione del nodo intermedio.",
      "Il tempo medio che un pacchetto passa nella coda di uscita":
        "Questo descrive il ritardo di accodamento.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Le quattro componenti classiche del ritardo nodale.",
      "Propagazione = distanza/velocità del segnale; trasmissione = lunghezza del pacchetto/banda del link.",
      "Se la formula contiene la distanza, stai guardando la propagazione.",
      "Quale ritardo cresce al crescere della distanza fisica tra due nodi?",
    ),
  },
  {
    id: "internet-004",
    category: "Internet",
    topic: "ISP, router, switch, modem, access point",
    difficulty: "facile",
    question:
      "Quale dispositivo inoltra pacchetti tra reti IP diverse analizzando l’indirizzo di livello 3?",
    options: ["Router", "Switch Ethernet", "Modem", "Access point"],
    correctAnswer: "Router",
    explanation:
      "Il router prende decisioni di instradamento guardando l’indirizzo IP di destinazione e la propria tabella di forwarding. Lo switch Ethernet lavora tipicamente a livello 2 e usa indirizzi MAC. Modem e access point hanno ruoli diversi: il primo adatta il segnale al mezzo, il secondo fornisce accesso wireless alla LAN.",
    whyOthersAreWrong: {
      "Switch Ethernet":
        "Lo switch classico inoltra frame all’interno della stessa rete locale usando MAC address.",
      Modem:
        "Il modem si occupa di modulazione/demodulazione o adattamento del collegamento, non di routing IP tra reti diverse.",
      "Access point":
        "L’access point collega client Wi-Fi a una rete locale, ma non sostituisce il ruolo logico del router.",
    },
    source: "Capitolo 4 - Livello Di Rete- Il Piano Dei Dati.pdf",
    studyGuide: guide(
      "Differenza tra dispositivi di livello 2 e di livello 3.",
      "Router = IP e reti diverse; switch = MAC e stessa LAN; AP = accesso radio; modem = adattamento fisico.",
      "Se la domanda parla di 'reti diverse', il router è quasi sempre il candidato giusto.",
      "Quale dispositivo usa una tabella di forwarding per scegliere il next hop verso una rete remota?",
    ),
  },
  {
    id: "internet-005",
    category: "Internet",
    topic: "ISP, router, switch, modem, access point",
    difficulty: "media",
    question:
      "Qual è il ruolo principale di un access point in una rete locale?",
    options: [
      "Permettere ai dispositivi wireless di accedere alla LAN",
      "Tradurre indirizzi IP privati in indirizzi pubblici",
      "Instradare pacchetti tra sistemi autonomi differenti",
      "Eseguire la consegna affidabile dei segmenti TCP",
    ],
    correctAnswer: "Permettere ai dispositivi wireless di accedere alla LAN",
    explanation:
      "Un access point realizza il punto di accesso radio alla rete locale e fa da ponte tra il dominio wireless 802.11 e la LAN cablata o infrastrutturale. Non sostituisce NAT o routing inter-AS. Il suo compito è permettere ai client Wi-Fi di entrare nella rete e parlare con il resto dell’infrastruttura.",
    whyOthersAreWrong: {
      "Tradurre indirizzi IP privati in indirizzi pubblici":
        "Questo è tipicamente il compito del NAT sul router di frontiera.",
      "Instradare pacchetti tra sistemi autonomi differenti":
        "Questo riguarda il routing interdominio, per esempio con BGP, non il ruolo di un access point.",
      "Eseguire la consegna affidabile dei segmenti TCP":
        "L’affidabilità TCP viene gestita dagli host finali a livello di trasporto.",
    },
    source: "Capitolo 6-7 - Wireless E Reti Mobile.pdf",
    studyGuide: guide(
      "Relazione tra rete Wi-Fi e LAN cablata.",
      "L’access point estende la LAN nel dominio radio, ma non prende decisioni di trasporto o routing globale.",
      "AP = porta d’ingresso wireless alla stessa rete locale.",
      "Quale apparato collega i client 802.11 all’infrastruttura di rete locale?",
    ),
  },
  {
    id: "internet-006",
    category: "Internet",
    topic: "Client-server e P2P",
    difficulty: "facile",
    question:
      "Quale affermazione descrive correttamente il modello client-server?",
    options: [
      "I client richiedono servizi a un server sempre attivo e identificabile",
      "Ogni nodo agisce solo come server e mai come client",
      "Tutti i nodi condividono sempre lo stesso stato senza coordinamento centrale",
      "Non esistono host dedicati a offrire contenuti o servizi",
    ],
    correctAnswer:
      "I client richiedono servizi a un server sempre attivo e identificabile",
    explanation:
      "Nel paradigma client-server il server è un host tipicamente sempre acceso, con indirizzo noto o facilmente risolvibile, che fornisce un servizio a più client. I client sono i consumatori del servizio e iniziano la comunicazione. Questo modello è comune per web, posta, autenticazione e molti servizi centralizzati.",
    whyOthersAreWrong: {
      "Ogni nodo agisce solo come server e mai come client":
        "Nel modello client-server i client esistono eccome e avviano le richieste verso il server.",
      "Tutti i nodi condividono sempre lo stesso stato senza coordinamento centrale":
        "Questa non è una proprietà tipica del modello client-server.",
      "Non esistono host dedicati a offrire contenuti o servizi":
        "Nel client-server gli host dedicati sono proprio i server.",
    },
    source: "Capitolo 2 - Livello Di Applicazione.pdf",
    studyGuide: guide(
      "Architetture applicative di base.",
      "Client-server significa servizio centralizzato o concentrato su uno o più server sempre disponibili.",
      "Se c’è un server noto e clienti che bussano, sei nel modello client-server.",
      "Quale architettura applicativa usa host permanenti per offrire un servizio a più utenti?",
    ),
  },
  {
    id: "internet-007",
    category: "Internet",
    topic: "Client-server e P2P",
    difficulty: "media",
    question:
      "Qual è un vantaggio classico dell’architettura peer-to-peer rispetto a quella puramente client-server?",
    options: [
      "La capacità totale può crescere aggiungendo peer che contribuiscono risorse",
      "Le prestazioni sono indipendenti dal numero di utenti connessi",
      "Non esistono problemi di churn o coordinamento tra nodi",
      "I dati viaggiano senza bisogno di protocolli applicativi",
    ],
    correctAnswer:
      "La capacità totale può crescere aggiungendo peer che contribuiscono risorse",
    explanation:
      "Nel P2P i nodi possono essere contemporaneamente client e fornitori di contenuti o banda. Questo rende l’architettura potenzialmente più scalabile perché nuovi utenti possono aggiungere capacità oltre a consumarla. Il prezzo da pagare è una gestione più complessa di disponibilità, coordinamento e churn.",
    whyOthersAreWrong: {
      "Le prestazioni sono indipendenti dal numero di utenti connessi":
        "Anche nel P2P l’aumento degli utenti può creare colli di bottiglia o overhead di coordinamento.",
      "Non esistono problemi di churn o coordinamento tra nodi":
        "Il churn è uno dei problemi tipici dei sistemi P2P.",
      "I dati viaggiano senza bisogno di protocolli applicativi":
        "Anche le applicazioni P2P usano protocolli e logiche di comunicazione ben definite.",
    },
    source: "Capitolo 2 - Livello Di Applicazione.pdf",
    studyGuide: guide(
      "Scalabilità nelle architetture applicative.",
      "Nel P2P ogni peer può contribuire banda, storage o contenuti, riducendo la dipendenza da un unico server.",
      "Più peer non significa solo più richieste: può voler dire anche più capacità.",
      "Perché un sistema P2P ben progettato può scalare meglio di un server centrale?",
    ),
  },
  {
    id: "internet-008",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "facile",
    question:
      "Quali campi compongono la request line di una richiesta HTTP?",
    options: [
      "Metodo, URL, versione del protocollo",
      "Metodo, indirizzo MAC, checksum",
      "URL, certificato, porta sorgente",
      "Versione, indirizzo IP, finestra di ricezione",
    ],
    correctAnswer: "Metodo, URL, versione del protocollo",
    explanation:
      "La request line HTTP contiene il metodo, il percorso o URL richiesto e la versione del protocollo, per esempio `GET /index.html HTTP/1.1`. È la prima riga del messaggio e permette al server di capire subito che cosa deve fare e con quale sintassi interpretare la richiesta.",
    whyOthersAreWrong: {
      "Metodo, indirizzo MAC, checksum":
        "MAC e checksum non fanno parte della request line HTTP ma dei livelli più bassi.",
      "URL, certificato, porta sorgente":
        "Il certificato non è un campo della request line e la porta è gestita dal trasporto.",
      "Versione, indirizzo IP, finestra di ricezione":
        "IP e finestra di ricezione appartengono ai livelli rete e trasporto.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Struttura minima di una richiesta HTTP.",
      "La request line è il pezzo più sintetico del messaggio: azione, risorsa, versione.",
      "HTTP chiede sempre: cosa vuoi fare, su cosa, con quale versione.",
      "Quali tre elementi si leggono nella prima riga di una richiesta HTTP/1.1?",
    ),
  },
  {
    id: "internet-009",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "media",
    question:
      "Qual è la differenza fondamentale tra HTTP e HTTPS?",
    options: [
      "HTTPS incapsula HTTP sopra TLS per aggiungere confidenzialità, integrità e autenticazione del server",
      "HTTPS sostituisce completamente TCP con UDP",
      "HTTP usa DNS mentre HTTPS no",
      "HTTPS elimina la necessità di certificati digitali",
    ],
    correctAnswer:
      "HTTPS incapsula HTTP sopra TLS per aggiungere confidenzialità, integrità e autenticazione del server",
    explanation:
      "HTTPS non cambia l’idea applicativa di HTTP, ma aggiunge uno strato crittografico TLS sopra TCP. Il risultato è che il contenuto viene cifrato, le modifiche in transito possono essere rilevate e il client può verificare l’identità del server tramite certificato. Per questo HTTPS è la base della navigazione sicura moderna.",
    whyOthersAreWrong: {
      "HTTPS sostituisce completamente TCP con UDP":
        "Nel caso classico HTTPS usa TCP come trasporto; TLS si appoggia a TCP.",
      "HTTP usa DNS mentre HTTPS no":
        "Entrambi possono usare DNS per risolvere il nome del server.",
      "HTTPS elimina la necessità di certificati digitali":
        "I certificati sono centrali proprio per autenticare il server durante il TLS handshake.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Relazione tra HTTP, TLS e autenticazione del server.",
      "HTTPS = HTTP + TLS sopra TCP: stessa logica applicativa, ma con protezione crittografica.",
      "Se vedi la S finale, pensa a TLS e certificati.",
      "Quale livello aggiunge HTTPS rispetto a HTTP per proteggere il traffico?",
    ),
  },
  {
    id: "internet-010",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "media",
    question:
      "Perché un proxy HTTP usa il GET condizionale?",
    options: [
      "Per verificare se una copia in cache è ancora valida senza riscaricare sempre tutto l’oggetto",
      "Per trasformare automaticamente una richiesta GET in POST",
      "Per assegnare indirizzi IP ai client del browser",
      "Per forzare l’uso di un circuito dedicato verso il server web",
    ],
    correctAnswer:
      "Per verificare se una copia in cache è ancora valida senza riscaricare sempre tutto l’oggetto",
    explanation:
      "Il GET condizionale, ad esempio con `If-Modified-Since`, permette alla cache di controllare se l’oggetto remoto è cambiato. Se il server risponde `304 Not Modified`, il proxy riusa la copia locale e risparmia tempo e banda. È un meccanismo classico di coerenza della cache HTTP.",
    whyOthersAreWrong: {
      "Per trasformare automaticamente una richiesta GET in POST":
        "Il GET condizionale non cambia il metodo applicativo della richiesta.",
      "Per assegnare indirizzi IP ai client del browser":
        "L’assegnazione dinamica di indirizzi IP riguarda DHCP, non HTTP.",
      "Per forzare l’uso di un circuito dedicato verso il server web":
        "HTTP non opera con circuiti dedicati di questo tipo.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Cache validation in HTTP.",
      "Il proxy non vuole riscaricare file invariati: usa header condizionali per chiedere al server se la copia è ancora buona.",
      "304 = 'usa pure quello che hai in cache'.",
      "Qual è lo scopo dell’header `If-Modified-Since` in HTTP?",
    ),
  },
  {
    id: "internet-011",
    category: "Internet",
    topic: "DNS",
    difficulty: "media",
    question:
      "Qual è la sequenza logica corretta nella risoluzione DNS iterativa di un nome di dominio?",
    options: [
      "Root server, TLD server, authoritative server",
      "Authoritative server, root server, switch Ethernet",
      "TLD server, DHCP server, root server",
      "Root server, proxy HTTP, authoritative server",
    ],
    correctAnswer: "Root server, TLD server, authoritative server",
    explanation:
      "Quando il resolver non conosce la risposta, tipicamente parte dai root server, che indicano i TLD server competenti. I TLD rimandano poi al server autorevole del dominio, cioè quello che possiede il record cercato. È un meccanismo gerarchico fondamentale per scalare su Internet.",
    whyOthersAreWrong: {
      "Authoritative server, root server, switch Ethernet":
        "Lo switch Ethernet non c’entra con la gerarchia DNS e l’ordine è scorretto.",
      "TLD server, DHCP server, root server":
        "DHCP non partecipa alla risoluzione DNS del nome.",
      "Root server, proxy HTTP, authoritative server":
        "Il proxy HTTP è un componente applicativo diverso e non fa parte della catena DNS.",
    },
    source: "Capitolo 2 - Livello Di Applicazione.pdf",
    studyGuide: guide(
      "Gerarchia DNS: root, TLD, autoritativi.",
      "Il resolver non conosce subito l’IP: riceve prima indicazioni su chi chiedere dopo, fino al server autorevole.",
      "DNS iterativo = una caccia al tesoro guidata: root ti dice il TLD, TLD ti dice l’autorevole.",
      "Quale server DNS contiene i record finali di un dominio specifico?",
    ),
  },
  {
    id: "internet-012",
    category: "Internet",
    topic: "DNS",
    difficulty: "facile",
    question:
      "Quale protocollo di trasporto usa normalmente DNS per una richiesta di lookup standard?",
    options: ["UDP", "TCP", "ICMP", "ARP"],
    correctAnswer: "UDP",
    explanation:
      "Nel caso normale, una richiesta DNS usa UDP sulla porta 53 perché il modello domanda-risposta è leggero e rapido. TCP viene usato solo in casi particolari, per esempio trasferimenti di zona o risposte troppo grandi per il limite storico del datagramma. Per il lookup standard, quindi, la risposta attesa è UDP.",
    whyOthersAreWrong: {
      TCP: "TCP può essere usato da DNS, ma non è la scelta standard per i lookup normali.",
      ICMP: "ICMP serve per controllo ed errori di rete, non per risoluzione dei nomi.",
      ARP: "ARP risolve MAC address in una LAN, non nomi di dominio.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Uso di UDP e TCP nel DNS.",
      "DNS preferisce UDP per velocità e semplicità nelle interrogazioni brevi.",
      "Lookup normale? Pensa a UDP/53. Zone transfer o casi speciali? TCP.",
      "In quale caso DNS passa tipicamente da UDP a TCP?",
    ),
  },
  {
    id: "internet-013",
    category: "Internet",
    topic: "DNS",
    difficulty: "media",
    question:
      "Quale tipo di resource record DNS viene usato per definire un alias canonico?",
    options: ["CNAME", "MX", "NS", "PTR"],
    correctAnswer: "CNAME",
    explanation:
      "Il record `CNAME` associa un nome alias a un nome canonico. È utile quando vuoi che più nomi puntino logicamente allo stesso host senza duplicare record A o AAAA in più punti. Gli altri record hanno scopi diversi: posta, delega di zona o reverse lookup.",
    whyOthersAreWrong: {
      MX: "MX specifica il mail server responsabile per un dominio.",
      NS: "NS indica i name server autoritativi per una zona.",
      PTR: "PTR si usa tipicamente per la risoluzione inversa da IP a nome.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Tipi principali di record DNS.",
      "Alias logico di un nome verso un altro nome: questa è l’idea del CNAME.",
      "CNAME = 'chiama questo host con un altro nome'.",
      "Quale record DNS useresti per far puntare `www.esempio.it` a un nome canonico già esistente?",
    ),
  },
  {
    id: "internet-014",
    category: "Internet",
    topic: "SMTP, POP3, IMAP",
    difficulty: "facile",
    question:
      "Quale protocollo è usato tipicamente per l’invio della posta elettronica dal client al mail server?",
    options: ["SMTP", "POP3", "IMAP", "DNS"],
    correctAnswer: "SMTP",
    explanation:
      "SMTP è il protocollo standard per l’invio e il relay della posta elettronica. POP3 e IMAP sono invece usati soprattutto per leggere o sincronizzare i messaggi già presenti sulla casella. DNS può aiutare a trovare il mail exchanger, ma non trasporta il contenuto della mail.",
    whyOthersAreWrong: {
      POP3: "POP3 riguarda il recupero dei messaggi dalla mailbox, non l’invio verso il server.",
      IMAP: "IMAP serve a gestire e sincronizzare i messaggi sul server, non è il protocollo di submit classico.",
      DNS: "DNS risolve nomi o record MX, ma non consegna le email applicative.",
    },
    source: "Capitolo 2 - Livello Di Applicazione.pdf",
    studyGuide: guide(
      "Ruoli diversi dei protocolli di posta.",
      "SMTP spinge i messaggi verso il server; POP3 e IMAP li recuperano o li sincronizzano.",
      "S di SMTP = Send, utile da ricordare anche se non è l’espansione dell’acronimo.",
      "Quale protocollo usa un server di posta per inoltrare una mail a un altro server?",
    ),
  },
  {
    id: "internet-015",
    category: "Internet",
    topic: "SMTP, POP3, IMAP",
    difficulty: "media",
    question:
      "Quale affermazione distingue correttamente IMAP da POP3?",
    options: [
      "IMAP mantiene più stato sul server e favorisce la sincronizzazione tra dispositivi",
      "POP3 consente di gestire cartelle remote meglio di IMAP",
      "IMAP viene usato solo per la risoluzione dei record MX",
      "POP3 è connectionless e usa UDP per il download dei messaggi",
    ],
    correctAnswer:
      "IMAP mantiene più stato sul server e favorisce la sincronizzazione tra dispositivi",
    explanation:
      "IMAP è progettato per lavorare con i messaggi ancora presenti sul server, consentendo cartelle, flag e sincronizzazione tra più client. POP3 è più semplice e storicamente orientato allo scaricamento locale dei messaggi. Per questo IMAP è la scelta più naturale su smartphone, tablet e PC usati insieme.",
    whyOthersAreWrong: {
      "POP3 consente di gestire cartelle remote meglio di IMAP":
        "È il contrario: IMAP è molto più ricco per la gestione remota della mailbox.",
      "IMAP viene usato solo per la risoluzione dei record MX":
        "I record MX appartengono al DNS, non a IMAP.",
      "POP3 è connectionless e usa UDP per il download dei messaggi":
        "POP3 si appoggia a TCP, non a UDP.",
    },
    source: "Capitolo 2 - Livello Di Applicazione.pdf",
    studyGuide: guide(
      "Differenza di filosofia tra POP3 e IMAP.",
      "IMAP tratta il server come archivio principale e sincronizza lo stato tra client; POP3 è più scarica-e-leggi.",
      "Più dispositivi e cartelle condivise? Ricorda IMAP.",
      "Quale protocollo di lettura mail è più adatto se vuoi tenere i messaggi organizzati sul server?",
    ),
  },
  {
    id: "internet-016",
    category: "Internet",
    topic: "TCP e UDP",
    difficulty: "facile",
    question:
      "Quale affermazione descrive correttamente UDP?",
    options: [
      "È un protocollo connectionless e inaffidabile",
      "Garantisce consegna in ordine con ritrasmissione automatica",
      "Stabilisce una connessione tramite three-way handshake",
      "Usa una finestra di congestione per adattare il rate del mittente",
    ],
    correctAnswer: "È un protocollo connectionless e inaffidabile",
    explanation:
      "UDP non effettua setup di connessione e non offre garanzie di consegna, ordine o ritrasmissione. Proprio per questo ha overhead ridotto ed è utile quando la tempestività vale più dell’affidabilità completa, come in streaming real-time o gaming. L’applicazione, se vuole, deve aggiungere da sola meccanismi ulteriori.",
    whyOthersAreWrong: {
      "Garantisce consegna in ordine con ritrasmissione automatica":
        "Queste sono funzionalità tipiche del TCP.",
      "Stabilisce una connessione tramite three-way handshake":
        "Anche questo è un comportamento del TCP, non di UDP.",
      "Usa una finestra di congestione per adattare il rate del mittente":
        "La congestion window è un meccanismo del TCP classico.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Servizio offerto da UDP rispetto a TCP.",
      "UDP offre un trasporto minimo: multiplexing e checksum, ma niente affidabilità end-to-end completa.",
      "UDP = rapido e leggero, ma senza garanzie forti.",
      "Perché VoIP e gaming in tempo reale preferiscono spesso UDP a TCP?",
    ),
  },
  {
    id: "internet-017",
    category: "Internet",
    topic: "porte e socket",
    difficulty: "facile",
    question:
      "A livello di trasporto, quale elemento identifica il processo applicativo di destinazione su un host?",
    options: ["Numero di porta", "Indirizzo MAC", "TTL", "OUI del produttore"],
    correctAnswer: "Numero di porta",
    explanation:
      "Il numero di porta serve al livello di trasporto per consegnare i segmenti al processo giusto, per esempio browser, server web o server DNS. L’indirizzo IP identifica l’host, la porta identifica l’applicazione sull’host. È il meccanismo di multiplexing e demultiplexing del trasporto.",
    whyOthersAreWrong: {
      "Indirizzo MAC":
        "Il MAC serve nel dominio locale a livello data link, non per identificare il processo applicativo.",
      TTL: "Il TTL è un campo dell’header IP usato per limitare la vita del datagramma.",
      "OUI del produttore":
        "L’OUI è parte del MAC address e identifica il vendor, non il processo destinatario.",
    },
    source: "Capitolo 3 - Livello Di Trasporto.pdf",
    studyGuide: guide(
      "Host vs processo: chi identifica cosa.",
      "IP dice a quale macchina andare; la porta dice a quale applicazione consegnare i dati.",
      "Macchina = IP, processo = porta.",
      "Che differenza c’è tra indirizzo IP e numero di porta in una comunicazione TCP?",
    ),
  },
  {
    id: "internet-018",
    category: "Internet",
    topic: "porte e socket",
    difficulty: "media",
    question:
      "Che cosa identifica univocamente una socket TCP di connessione sul server?",
    options: [
      "La quaterna: IP sorgente, porta sorgente, IP destinazione, porta destinazione",
      "Il solo indirizzo IP del server",
      "La sola porta del server, indipendentemente dal client",
      "Il MAC address del server e il TTL del datagramma",
    ],
    correctAnswer:
      "La quaterna: IP sorgente, porta sorgente, IP destinazione, porta destinazione",
    explanation:
      "Una connessione TCP è connection-oriented e deve distinguere sessioni contemporanee verso la stessa porta server. Per questo si usa la quaterna completa: chi manda, da quale porta, verso quale host e quale porta. È il modo con cui un server web sulla porta 80 può parlare con migliaia di client allo stesso tempo senza confonderli.",
    whyOthersAreWrong: {
      "Il solo indirizzo IP del server":
        "Non basta a distinguere connessioni simultanee provenienti da client diversi.",
      "La sola porta del server, indipendentemente dal client":
        "Più client condividono la stessa porta server, quindi serve informazione anche sul lato sorgente.",
      "Il MAC address del server e il TTL del datagramma":
        "MAC e TTL non identificano una sessione TCP end-to-end.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Identificazione di una connessione TCP.",
      "TCP deve mantenere stato per ogni dialogo: per questo usa la quaterna completa e non solo la porta locale.",
      "Una socket in ascolto usa la porta; una connessione attiva usa la quaterna.",
      "Perché la sola porta 80 non basta a identificare una connessione TCP attiva?",
    ),
  },
  {
    id: "internet-019",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "facile",
    question:
      "Quale flag TCP viene usato normalmente per chiudere in modo ordinato una connessione?",
    options: ["FIN", "RST", "PSH", "URG"],
    correctAnswer: "FIN",
    explanation:
      "Il flag `FIN` segnala che un lato non ha più dati da inviare ma consente una chiusura ordinata della connessione. In TCP la chiusura normale richiede che entrambe le direzioni vengano terminate esplicitamente. Il flag `RST`, invece, interrompe la connessione in modo brusco e non rappresenta la chiusura graziosa standard.",
    whyOthersAreWrong: {
      RST: "RST serve per un reset abortivo, non per la chiusura ordinata standard.",
      PSH: "PSH chiede di consegnare subito i dati bufferizzati, ma non chiude la connessione.",
      URG: "URG segnala la presenza di dati urgenti, non la fine della sessione.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Differenza tra chiusura normale e reset.",
      "FIN chiude con grazia; RST stronca la connessione senza il rituale ordinato di teardown.",
      "F di FIN = Finish, R di RST = Reset drastico.",
      "Quale flag useresti per terminare senza perdere i dati già in volo?",
    ),
  },
  {
    id: "internet-020",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "media",
    question:
      "Quale combinazione di meccanismi contribuisce direttamente all’affidabilità del TCP?",
    options: [
      "Numeri di sequenza, ACK, timer di ritrasmissione e checksum",
      "TTL, ARP cache, CIDR e OSPF",
      "Root server, proxy HTTP e TLD server",
      "NAT, DHCP e indirizzi MAC broadcast",
    ],
    correctAnswer:
      "Numeri di sequenza, ACK, timer di ritrasmissione e checksum",
    explanation:
      "L’affidabilità TCP nasce dalla cooperazione di più strumenti: i numeri di sequenza ordinano i byte, gli ACK confermano ciò che è arrivato, i timer fanno scattare le ritrasmissioni e il checksum rileva errori sull’intestazione e sui dati. Nessuno di questi da solo basta: è la combinazione a costruire il canale affidabile percepito dall’applicazione.",
    whyOthersAreWrong: {
      "TTL, ARP cache, CIDR e OSPF":
        "Questi concetti appartengono ad altri livelli o ad altre funzioni di rete.",
      "Root server, proxy HTTP e TLD server":
        "Si tratta di elementi applicativi o DNS, non di affidabilità del trasporto.",
      "NAT, DHCP e indirizzi MAC broadcast":
        "Sono temi di rete locale o indirizzamento, non meccanismi di reliability TCP.",
    },
    source: "Capitolo 3 - Livello Di Trasporto.pdf",
    studyGuide: guide(
      "Come TCP trasforma IP best effort in un servizio affidabile per l’applicazione.",
      "TCP aggiunge controllo di sequenza, riscontri e ritrasmissioni sopra un livello rete che non garantisce consegna.",
      "Sequenza + ACK + timer = trio base della reliability TCP.",
      "Perché il solo checksum non basta a rendere affidabile il servizio TCP?",
    ),
  },
  {
    id: "internet-021",
    category: "Internet",
    topic: "sliding window",
    difficulty: "media",
    question:
      "Nel TCP, a cosa serve principalmente il campo receive window annunciato dal destinatario?",
    options: [
      "A comunicare quanto spazio libero resta nel buffer di ricezione",
      "A indicare il numero totale di router presenti nel percorso",
      "A stabilire il valore del TTL del prossimo datagramma IP",
      "A scegliere la porta sorgente del prossimo segmento",
    ],
    correctAnswer:
      "A comunicare quanto spazio libero resta nel buffer di ricezione",
    explanation:
      "Il receive window è il meccanismo classico di flow control: il ricevitore dice al mittente quanti byte può ancora accettare senza andare in overflow. In questo modo il mittente non satura il buffer remoto. È diverso dalla congestion window, che invece ragiona sulla congestione della rete.",
    whyOthersAreWrong: {
      "A indicare il numero totale di router presenti nel percorso":
        "Il receive window non descrive il percorso ma la capacità del ricevitore.",
      "A stabilire il valore del TTL del prossimo datagramma IP":
        "Il TTL è un campo IP e non viene impostato tramite receive window TCP.",
      "A scegliere la porta sorgente del prossimo segmento":
        "Le porte identificano i processi applicativi, non il controllo di flusso.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Differenza tra flow control e congestion control.",
      "Receive window protegge il buffer del destinatario; congestion window protegge la rete dalla saturazione.",
      "Receive window = quanto posso ricevere, congestion window = quanto conviene spedire.",
      "Quale campo TCP impedisce il data overflow nel ricevitore?",
    ),
  },
  {
    id: "internet-022",
    category: "Internet",
    topic: "sliding window",
    difficulty: "media",
    question:
      "Quale affermazione su Go-Back-N è corretta?",
    options: [
      "Il mittente usa tipicamente un solo timer per il pacchetto non ancora riscontrato più vecchio",
      "Il ricevitore accetta sempre fuori ordine tutti i pacchetti e li consegna subito all’applicazione",
      "Ogni pacchetto usa obbligatoriamente un timer indipendente sul mittente",
      "Gli ACK non sono cumulativi",
    ],
    correctAnswer:
      "Il mittente usa tipicamente un solo timer per il pacchetto non ancora riscontrato più vecchio",
    explanation:
      "Go-Back-N mantiene una finestra di trasmissione ma usa normalmente un solo timer legato al pacchetto più vecchio senza ACK. Se il timer scade, il mittente ritrasmette quel pacchetto e tutti i successivi della finestra ancora non confermati. Gli ACK sono cumulativi e il ricevitore non gestisce bene l’out-of-order come farebbe Selective Repeat.",
    whyOthersAreWrong: {
      "Il ricevitore accetta sempre fuori ordine tutti i pacchetti e li consegna subito all’applicazione":
        "Questo è più vicino al comportamento di Selective Repeat, non di Go-Back-N.",
      "Ogni pacchetto usa obbligatoriamente un timer indipendente sul mittente":
        "Il timer per pacchetto è tipico di Selective Repeat, non di GBN.",
      "Gli ACK non sono cumulativi":
        "In Go-Back-N gli ACK sono invece cumulativi.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Differenza tra Go-Back-N e Selective Repeat.",
      "GBN è più semplice: pochi stati e ACK cumulativi, ma quando perde un pacchetto può dover ritrasmettere a blocco.",
      "GBN = se cade uno, si torna indietro e si rimanda il treno.",
      "Quale protocollo di sliding window usa timer individuali e accetta pacchetti fuori ordine?",
    ),
  },
  {
    id: "internet-023",
    category: "Internet",
    topic: "sliding window",
    difficulty: "media",
    question:
      "Quale caratteristica distingue Selective Repeat da Go-Back-N?",
    options: [
      "Permette ritrasmissioni selettive dei soli pacchetti realmente persi",
      "Usa solo ACK negativi e mai ACK positivi",
      "Elimina completamente l’uso di numeri di sequenza",
      "Richiede un circuito dedicato prima dell’invio dei dati",
    ],
    correctAnswer:
      "Permette ritrasmissioni selettive dei soli pacchetti realmente persi",
    explanation:
      "Selective Repeat migliora l’efficienza in presenza di perdite isolate perché evita di ritrasmettere tutto il blocco successivo. Il ricevitore può bufferizzare pacchetti arrivati fuori ordine e il mittente può gestire timer per singolo pacchetto. Il prezzo è una maggiore complessità di gestione degli stati.",
    whyOthersAreWrong: {
      "Usa solo ACK negativi e mai ACK positivi":
        "Selective Repeat continua a usare riscontri positivi; non si basa esclusivamente su NAK.",
      "Elimina completamente l’uso di numeri di sequenza":
        "I numeri di sequenza sono indispensabili per distinguere e riordinare i pacchetti.",
      "Richiede un circuito dedicato prima dell’invio dei dati":
        "Non c’entra nulla con la logica di affidabilità a finestra scorrevole.",
    },
    source: "Capitolo 3 - Livello Di Trasporto.pdf",
    studyGuide: guide(
      "Perché Selective Repeat è più efficiente di Go-Back-N su link con perdite occasionali.",
      "Selective Repeat ritrasmette solo quello che davvero manca, mentre GBN può ripetere anche pacchetti già arrivati.",
      "Selective Repeat = chirurgia; Go-Back-N = bombardamento a tappeto.",
      "Quale protocollo usa buffer lato ricevitore per tenere pacchetti arrivati fuori ordine?",
    ),
  },
  {
    id: "internet-024",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "media",
    question:
      "Che cosa rappresenta la Maximum Segment Size (MSS) in TCP?",
    options: [
      "La quantità massima di dati applicativi contenuti nel payload di un segmento TCP",
      "La dimensione massima dell’intero datagramma IP comprensivo di tutti gli header di rete",
      "Il numero massimo di segmenti che il server può accettare in una connessione",
      "La dimensione del buffer totale del ricevitore",
    ],
    correctAnswer:
      "La quantità massima di dati applicativi contenuti nel payload di un segmento TCP",
    explanation:
      "La MSS indica quanti byte di dati applicativi TCP può inserire in un segmento senza contare gli header TCP e IP. Viene negoziata durante l’apertura della connessione e serve a evitare frammentazione o inefficienze rispetto alla MTU del percorso. Non va confusa con la dimensione complessiva del pacchetto IP.",
    whyOthersAreWrong: {
      "La dimensione massima dell’intero datagramma IP comprensivo di tutti gli header di rete":
        "Questa descrizione è più vicina alla MTU o alla dimensione del datagramma, non alla MSS.",
      "Il numero massimo di segmenti che il server può accettare in una connessione":
        "La MSS misura byte per segmento, non il numero di segmenti.",
      "La dimensione del buffer totale del ricevitore":
        "Il buffer del ricevitore è legato al flow control, non alla MSS.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Differenza tra MSS e MTU.",
      "MTU riguarda il livello rete/link; MSS riguarda il solo carico dati del segmento TCP.",
      "MSS = quanto testo posso mettere nella busta TCP.",
      "Perché una MSS troppo grande può portare a frammentazione IP?",
    ),
  },
  {
    id: "internet-025",
    category: "Internet",
    topic: "congestion control",
    difficulty: "media",
    question:
      "Quale comportamento descrive la fase di slow start del TCP?",
    options: [
      "La congestion window cresce rapidamente, circa raddoppiando ogni RTT",
      "La congestion window resta fissa a 1 MSS per tutta la connessione",
      "Il mittente invia dati solo dopo aver ricevuto tre ACK duplicati",
      "Il controllo di congestione viene disattivato fino al primo timeout",
    ],
    correctAnswer:
      "La congestion window cresce rapidamente, circa raddoppiando ogni RTT",
    explanation:
      "In slow start il TCP parte con una finestra piccola e la aumenta in modo aggressivo finché non raggiunge la soglia o un segnale di congestione. La crescita è esponenziale a livello di RTT perché ogni ACK ricevuto permette di espandere la finestra. Serve per sondare rapidamente la capacità disponibile all’inizio della comunicazione.",
    whyOthersAreWrong: {
      "La congestion window resta fissa a 1 MSS per tutta la connessione":
        "Parte da un valore piccolo ma poi cresce proprio per sfruttare meglio il canale.",
      "Il mittente invia dati solo dopo aver ricevuto tre ACK duplicati":
        "I tre ACK duplicati sono un segnale di perdita, non la condizione normale per trasmettere.",
      "Il controllo di congestione viene disattivato fino al primo timeout":
        "Il controllo di congestione è attivo fin dall’inizio.",
    },
    source: "Capitolo 3 - Livello Di Trasporto.pdf",
    studyGuide: guide(
      "Crescita di cwnd nelle prime fasi della connessione.",
      "Slow start non significa crescita lenta: significa ripartenza da piccolo con crescita molto rapida.",
      "Nome ingannevole: 'slow' start ma crescita veloce.",
      "Quando il TCP passa tipicamente da slow start a congestion avoidance?",
    ),
  },
  {
    id: "internet-026",
    category: "Internet",
    topic: "congestion control",
    difficulty: "media",
    question:
      "Se il TCP rileva una perdita tramite timeout di ritrasmissione, quale reazione classica adotta?",
    options: [
      "Riduce drasticamente la congestion window fino a ripartire da 1 MSS",
      "Aumenta subito la congestion window per recuperare il tempo perso",
      "Disattiva gli ACK cumulativi e passa a UDP",
      "Azzera la receive window del destinatario",
    ],
    correctAnswer:
      "Riduce drasticamente la congestion window fino a ripartire da 1 MSS",
    explanation:
      "Il timeout è interpretato come un segnale di congestione severa. Per questo il mittente riduce la soglia e reimposta la congestion window a un valore minimo, tornando di fatto in slow start. È una reazione più drastica rispetto al caso di tre ACK duplicati, che suggerisce una perdita meno catastrofica.",
    whyOthersAreWrong: {
      "Aumenta subito la congestion window per recuperare il tempo perso":
        "Sarebbe pericoloso perché aggraverebbe la congestione invece di alleviarla.",
      "Disattiva gli ACK cumulativi e passa a UDP":
        "TCP non si trasforma in UDP e non cambia protocollo in questo modo.",
      "Azzera la receive window del destinatario":
        "La receive window riguarda il buffer del ricevitore, non la stima di congestione della rete.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Differenza tra perdita via timeout e perdita via duplicate ACK.",
      "Timeout = rete messa peggio, quindi TCP torna molto conservativo riducendo fortemente cwnd.",
      "Timeout = allarme serio, riparti piano.",
      "Qual è la differenza di reazione tra TCP Tahoe/Reno davanti a timeout e davanti a 3 duplicate ACK?",
    ),
  },
  {
    id: "internet-027",
    category: "Internet",
    topic: "congestion control",
    difficulty: "difficile",
    question:
      "Che cosa indica il raggiungimento della soglia `ssthresh` nel controllo di congestione TCP?",
    options: [
      "Il passaggio da slow start a congestion avoidance",
      "La chiusura automatica della connessione per eccesso di traffico",
      "Il reset della sequence number a zero",
      "La cancellazione degli ACK ricevuti finora",
    ],
    correctAnswer: "Il passaggio da slow start a congestion avoidance",
    explanation:
      "La `ssthresh` è la soglia che separa la crescita esponenziale iniziale dalla crescita più prudente lineare della congestion avoidance. Finché la `cwnd` resta sotto soglia, il TCP può aumentare rapidamente. Una volta raggiunta o superata la soglia, il protocollo rallenta la crescita per evitare di saturare la rete troppo bruscamente.",
    whyOthersAreWrong: {
      "La chiusura automatica della connessione per eccesso di traffico":
        "La soglia non chiude la connessione; modula solo la strategia di crescita di cwnd.",
      "Il reset della sequence number a zero":
        "I numeri di sequenza non vengono reimpostati da `ssthresh`.",
      "La cancellazione degli ACK ricevuti finora":
        "Gli ACK già ricevuti non vengono annullati da questo parametro.",
    },
    source: "Capitolo 3 - Livello Di Trasporto.pdf",
    studyGuide: guide(
      "Ruolo di `ssthresh` nell’algoritmo TCP.",
      "La soglia serve a dire 'fin qui puoi crescere forte, da qui in poi vai più prudente'.",
      "SSTHRESH = spartiacque tra crescita aggressiva e crescita cauta.",
      "Perché TCP non continua per sempre con la crescita esponenziale di slow start?",
    ),
  },
  {
    id: "internet-028",
    category: "Internet",
    topic: "congestion control",
    difficulty: "difficile",
    question:
      "Su quale principio si basa il calcolo del Retransmission Timeout (RTO) nel TCP?",
    options: [
      "Su una stima adattiva del RTT e della sua variabilità nel tempo",
      "Solo sulla dimensione della finestra di ricezione annunciata",
      "Sul numero di router attraversati dal pacchetto",
      "Sul valore del TTL impostato dall’applicazione",
    ],
    correctAnswer: "Su una stima adattiva del RTT e della sua variabilità nel tempo",
    explanation:
      "Il TCP non usa un timeout fisso perché la rete cambia continuamente. Per questo misura gli RTT osservati, ne stima la media e la variabilità e calcola un RTO abbastanza ampio da evitare ritrasmissioni premature ma non così grande da rallentare troppo il recupero dagli errori. È un compromesso dinamico basato sull’esperienza recente del flusso.",
    whyOthersAreWrong: {
      "Solo sulla dimensione della finestra di ricezione annunciata":
        "La receive window non è il fattore principale nel calcolo dell’RTO.",
      "Sul numero di router attraversati dal pacchetto":
        "Il numero di hop può influire indirettamente sui ritardi, ma non è il parametro diretto usato nella formula.",
      "Sul valore del TTL impostato dall’applicazione":
        "Il TTL è un campo IP e non guida il timer di ritrasmissione TCP.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Perché un timeout TCP deve essere adattivo.",
      "La rete non ha ritardi costanti: TCP osserva gli RTT storici e aggiunge margine di sicurezza in base alla variabilità.",
      "Timer intelligente = media dei ritardi + cuscinetto contro la variabilità.",
      "Perché un RTO troppo piccolo è dannoso quanto uno troppo grande?",
    ),
  },
  {
    id: "internet-029",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "facile",
    question:
      "Quale caratteristica NON appartiene al servizio IP?",
    options: ["Congestion managed", "Connectionless", "Best effort", "Unreliable"],
    correctAnswer: "Congestion managed",
    explanation:
      "IP offre un servizio connectionless, best effort e inaffidabile: i pacchetti vengono inoltrati senza garanzie di consegna, ordine o recupero automatico. La gestione della congestione non è una proprietà nativa del servizio IP. I meccanismi classici di adattamento al traffico sono demandati soprattutto agli host e al trasporto, in particolare a TCP.",
    whyOthersAreWrong: {
      Connectionless:
        "IP non richiede una fase di setup della connessione prima di inviare datagrammi.",
      "Best effort":
        "La rete prova a consegnare i pacchetti ma senza promesse forti di successo.",
      Unreliable:
        "IP non garantisce né consegna né riordino né ritrasmissione end-to-end.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Servizio base offerto da IP.",
      "IP è volutamente minimale: inoltra pacchetti e lascia a livelli superiori gran parte delle garanzie.",
      "IP = meglio sforzo, non servizio premium garantito.",
      "Perché si dice che TCP aggiunge valore sopra un IP best effort?",
    ),
  },
  {
    id: "internet-030",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "facile",
    question:
      "Dato l’indirizzo IPv4 151.97.6.4/24, qual è l’indirizzo di rete?",
    options: ["151.97.6.0", "151.97.0.0", "151.97.6.255", "151.0.0.0"],
    correctAnswer: "151.97.6.0",
    explanation:
      "Con prefisso `/24` i primi 24 bit identificano la rete, quindi i primi tre ottetti restano invariati e l’ultimo viene azzerato. Il risultato è 151.97.6.0. L’indirizzo 151.97.6.255, con la parte host tutta a 1, sarebbe invece il broadcast della sottorete.",
    whyOthersAreWrong: {
      "151.97.0.0":
        "Sarebbe coerente con una maschera più corta, per esempio /16, non con /24.",
      "151.97.6.255":
        "È l’indirizzo di broadcast della sottorete /24, non l’indirizzo di rete.",
      "151.0.0.0":
        "Anche questo implicherebbe una maschera molto più corta della /24 indicata.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Calcolo dell’indirizzo di rete a partire da IP e prefisso.",
      "Trova quanti bit sono di rete e azzera la parte host.",
      "/24 = i primi tre ottetti sono rete, l’ultimo è host.",
      "Come riconosci velocemente il broadcast in una rete /24?",
    ),
  },
  {
    id: "internet-031",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "media",
    question:
      "Quale suffisso CIDR identifica una rete IPv4 che contiene 1024 indirizzi totali?",
    options: ["/22", "/23", "/24", "/21"],
    correctAnswer: "/22",
    explanation:
      "Con IPv4 il numero di indirizzi totali in una sottorete è `2^(32-prefisso)`. Per ottenere 1024 indirizzi serve `2^10`, quindi la parte host deve avere 10 bit e il prefisso deve essere `32-10 = 22`. Attenzione a distinguere gli indirizzi totali dagli host utilizzabili, che in una sottorete classica sarebbero 1022.",
    whyOthersAreWrong: {
      "/23": "Lascia 9 bit host, quindi produce 512 indirizzi totali.",
      "/24": "Lascia 8 bit host, quindi produce 256 indirizzi totali.",
      "/21": "Lascia 11 bit host, quindi produce 2048 indirizzi totali.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Relazione tra prefisso CIDR e numero di indirizzi disponibili.",
      "Più piccolo è il prefisso, più grande è la sottorete. Qui servono 10 bit host per arrivare a 1024 indirizzi.",
      "1024 = 2^10, quindi 10 bit host.",
      "Quale prefisso useresti per una rete con circa 500 indirizzi totali?",
    ),
  },
  {
    id: "internet-032",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "facile",
    question:
      "Quale dei seguenti indirizzi IPv4 non è sintatticamente valido?",
    options: ["192.168.1.1", "151.97.6.4", "1.1.1.1", "257.70.3.46"],
    correctAnswer: "257.70.3.46",
    explanation:
      "Ogni ottetto IPv4 rappresenta 8 bit, quindi può assumere solo valori da 0 a 255. L’indirizzo 257.70.3.46 è invalido perché il primo ottetto supera il limite massimo consentito. Gli altri esempi, pur avendo significati diversi, sono tutti sintatticamente corretti.",
    whyOthersAreWrong: {
      "192.168.1.1":
        "È un indirizzo privato comune e sintatticamente perfettamente valido.",
      "151.97.6.4":
        "Ogni ottetto è nel range corretto, quindi la sintassi è valida.",
      "1.1.1.1":
        "Anche questo indirizzo è formalmente corretto dal punto di vista della sintassi IPv4.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Vincolo di valore per ogni ottetto IPv4.",
      "IPv4 usa 4 ottetti da 8 bit: nessun blocco può uscire dall’intervallo 0-255.",
      "Se vedi 256 o più, l’indirizzo è morto subito.",
      "Quali controlli fai al volo per capire se un IPv4 è almeno sintatticamente corretto?",
    ),
  },
  {
    id: "internet-033",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "media",
    question:
      "Quando un host deve inviare un datagramma IP, come determina se il destinatario è nella stessa rete locale o in una rete remota?",
    options: [
      "Confronta la propria subnet mask con l’IP di destinazione per capire se la rete coincide",
      "Guarda il MAC address del destinatario dentro l’URL richiesto",
      "Interroga direttamente un root DNS server",
      "Usa sempre il router, anche se il destinatario è nella stessa LAN",
    ],
    correctAnswer:
      "Confronta la propria subnet mask con l’IP di destinazione per capire se la rete coincide",
    explanation:
      "L’host applica la subnet mask al proprio indirizzo e a quello di destinazione. Se la parte di rete risultante coincide, il destinatario è locale e si può usare ARP per ottenere il MAC corrispondente; altrimenti il pacchetto viene inviato al default gateway. È una decisione basilare del livello rete sull’host.",
    whyOthersAreWrong: {
      "Guarda il MAC address del destinatario dentro l’URL richiesto":
        "L’URL non contiene il MAC e il MAC non è il criterio usato per capire se la rete è locale o remota.",
      "Interroga direttamente un root DNS server":
        "Il DNS risolve nomi, non decide se il destinatario è sulla stessa subnet.",
      "Usa sempre il router, anche se il destinatario è nella stessa LAN":
        "Se il destinatario è locale, l’host può inviare direttamente al suo MAC address.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Decisione locale vs remoto sul nodo sorgente.",
      "Prima si valuta la rete di appartenenza con la subnet mask; solo dopo si sceglie tra ARP diretto e gateway.",
      "Stessa rete? ARP. Rete diversa? Gateway.",
      "Quale informazione deve conoscere un host oltre all’IP di destinazione per sapere se usare il router?",
    ),
  },
  {
    id: "internet-034",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "media",
    question:
      "Che cosa modifica certamente un router IP quando inoltra un normale datagramma senza NAT?",
    options: [
      "TTL e header checksum",
      "Indirizzo IP sorgente e destinatario",
      "Numero di porta sorgente e destinatario",
      "Payload applicativo e metodo HTTP",
    ],
    correctAnswer: "TTL e header checksum",
    explanation:
      "Ogni router decrementa almeno di uno il TTL per evitare loop infiniti. Siccome l’header IP cambia, deve anche ricalcolare il checksum dell’intestazione. Gli indirizzi IP restano invariati durante il normale forwarding, a meno di meccanismi specifici come NAT.",
    whyOthersAreWrong: {
      "Indirizzo IP sorgente e destinatario":
        "Nel routing normale gli IP restano quelli degli endpoint finali.",
      "Numero di porta sorgente e destinatario":
        "Le porte sono nell’header di trasporto e non vengono toccate da un router normale.",
      "Payload applicativo e metodo HTTP":
        "Il router non deve interpretare né modificare il contenuto applicativo in un forwarding ordinario.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Campi IP che cambiano hop-by-hop.",
      "TTL scende a ogni router; proprio per questo il checksum dell’header va ricalcolato.",
      "Se cambia l’header, cambia anche il suo checksum.",
      "Perché traceroute può stimare il numero di hop usando il TTL?",
    ),
  },
  {
    id: "internet-035",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "facile",
    question:
      "Quale protocollo è usato per comunicare errori e informazioni di controllo a livello di rete?",
    options: ["ICMP", "UDP", "TCP", "DHCP"],
    correctAnswer: "ICMP",
    explanation:
      "ICMP accompagna IP e viene usato per segnalare condizioni come destinazione irraggiungibile, TTL scaduto o altri eventi diagnostici. Non sostituisce il routing, ma fornisce messaggi di supporto fondamentali per il controllo operativo della rete. Strumenti come `ping` e `traceroute` sfruttano proprio ICMP o i suoi effetti.",
    whyOthersAreWrong: {
      UDP: "UDP è un protocollo di trasporto e non nasce per segnalare errori di rete.",
      TCP: "Anche TCP è di trasporto e gestisce l’affidabilità end-to-end, non gli errori IP generali.",
      DHCP: "DHCP assegna configurazione IP ai client, non comunica errori di rete.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Ruolo di ICMP nel supportare il livello IP.",
      "IP inoltra datagrammi, ICMP racconta cosa è andato storto o fornisce feedback diagnostico.",
      "Quando la rete si lamenta, spesso lo fa in ICMP.",
      "Quale messaggio ICMP viene generato quando il TTL arriva a zero?",
    ),
  },
  {
    id: "internet-036",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "media",
    question:
      "Su quale principio si basa il funzionamento di traceroute?",
    options: [
      "Inviare pacchetti con TTL crescente e osservare i messaggi ICMP generati dai router",
      "Inviare ARP request a tutti i router di Internet",
      "Leggere la tabella BGP completa dal DNS locale",
      "Confrontare i numeri di sequenza TCP dei gateway attraversati",
    ],
    correctAnswer:
      "Inviare pacchetti con TTL crescente e osservare i messaggi ICMP generati dai router",
    explanation:
      "Traceroute forza la scadenza progressiva del TTL lungo il percorso. Ogni router che riceve un pacchetto con TTL diventato zero lo scarta e manda indietro un ICMP `Time Exceeded`, rivelando così la propria presenza. Aumentando gradualmente il TTL, si ricostruisce il cammino hop-by-hop.",
    whyOthersAreWrong: {
      "Inviare ARP request a tutti i router di Internet":
        "ARP vale solo nella rete locale e non può essere usato per scandire l’intero percorso Internet.",
      "Leggere la tabella BGP completa dal DNS locale":
        "Traceroute non usa DNS per ottenere le rotte.",
      "Confrontare i numeri di sequenza TCP dei gateway attraversati":
        "I router non espongono il percorso in questo modo e la logica di traceroute è diversa.",
    },
    source: "Capitolo 4 - Livello Di Rete- Il Piano Dei Dati.pdf",
    studyGuide: guide(
      "Uso diagnostico del TTL.",
      "Traceroute non chiede il percorso: lo fa emergere costringendo i router a rispondere quando il TTL scade.",
      "TTL crescente = scala che rivela un hop alla volta.",
      "Perché traceroute riceve spesso messaggi `Time Exceeded` invece della risposta finale dell’applicazione?",
    ),
  },
  {
    id: "internet-037",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "facile",
    question:
      "Quale frase distingue correttamente forwarding e routing?",
    options: [
      "Il forwarding decide l’uscita per un singolo pacchetto; il routing costruisce le informazioni usate per prendere quella decisione",
      "Il forwarding sceglie il sistema autonomo, il routing assegna l’indirizzo MAC",
      "Il forwarding opera solo a livello applicativo, il routing solo a livello fisico",
      "I due termini sono sinonimi perfetti e descrivono la stessa funzione",
    ],
    correctAnswer:
      "Il forwarding decide l’uscita per un singolo pacchetto; il routing costruisce le informazioni usate per prendere quella decisione",
    explanation:
      "Il forwarding è l’azione locale e veloce del data plane: guardo la destinazione e scelgo l’interfaccia d’uscita. Il routing è il processo del control plane che calcola o distribuisce le rotte da installare nelle tabelle. In breve: il routing prepara le mappe, il forwarding le usa.",
    whyOthersAreWrong: {
      "Il forwarding sceglie il sistema autonomo, il routing assegna l’indirizzo MAC":
        "La descrizione mescola livelli e funzioni in modo scorretto.",
      "Il forwarding opera solo a livello applicativo, il routing solo a livello fisico":
        "Entrambi riguardano il livello rete, seppur con ruoli diversi.",
      "I due termini sono sinonimi perfetti e descrivono la stessa funzione":
        "Sono collegati ma non equivalenti.",
    },
    source: "Capitolo 5 - Livello Di Rete- Il Piano Di Controllo.pdf",
    studyGuide: guide(
      "Piano dati vs piano di controllo.",
      "Routing costruisce conoscenza del percorso; forwarding usa quella conoscenza sul pacchetto che sta arrivando.",
      "Routing pensa, forwarding esegue.",
      "Quale componente deve essere veloce per linea di velocità sul router: routing o forwarding?",
    ),
  },
  {
    id: "internet-038",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "media",
    question:
      "Quale affermazione sull’algoritmo di Dijkstra usato nei protocolli link-state è errata?",
    options: [
      "È un algoritmo distribuito basato su sola conoscenza locale",
      "Usa una visione globale della topologia raccolta tramite informazioni di stato dei link",
      "Può essere usato in un protocollo dinamico di routing",
      "Permette di calcolare i cammini minimi da un nodo sorgente",
    ],
    correctAnswer: "È un algoritmo distribuito basato su sola conoscenza locale",
    explanation:
      "La formulazione classica di Dijkstra richiede che ciascun router abbia una vista completa della topologia o almeno del link-state database. Per questo si parla di approccio globale o centralizzato nella conoscenza, anche se il calcolo avviene localmente su ogni router. La logica distribuita pura è più tipica del distance vector basato su Bellman-Ford.",
    whyOthersAreWrong: {
      "Usa una visione globale della topologia raccolta tramite informazioni di stato dei link":
        "Questa descrive correttamente la famiglia link-state.",
      "Può essere usato in un protocollo dinamico di routing":
        "Protocolli come OSPF si adattano dinamicamente ai cambiamenti di topologia.",
      "Permette di calcolare i cammini minimi da un nodo sorgente":
        "È proprio il risultato classico dell’algoritmo di Dijkstra.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Differenza teorica tra link-state e distance vector.",
      "Dijkstra lavora bene quando il router conosce la mappa intera; Bellman-Ford quando ogni nodo parla solo coi vicini.",
      "Dijkstra = mappa completa, Bellman-Ford = passaparola tra vicini.",
      "Perché OSPF viene associato alla famiglia link-state e non distance vector?",
    ),
  },
  {
    id: "internet-039",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "media",
    question:
      "Quale meccanismo usa un protocollo distance vector per scambiare informazioni di routing?",
    options: [
      "Aggiornamenti iterativi tra router vicini basati sul costo verso le destinazioni",
      "Trasmissione del solo indirizzo MAC del gateway di default",
      "Interrogazioni HTTP periodiche al router root",
      "Broadcast globale di tutte le tabelle applicative del data center",
    ],
    correctAnswer:
      "Aggiornamenti iterativi tra router vicini basati sul costo verso le destinazioni",
    explanation:
      "Nei protocolli distance vector ogni router comunica ai vicini la propria stima del costo per raggiungere le varie destinazioni. Le informazioni vengono raffinate iterativamente tramite la relazione di Bellman-Ford. Il router non ha necessariamente la mappa completa della rete: costruisce la propria visione attraverso lo scambio con i vicini.",
    whyOthersAreWrong: {
      "Trasmissione del solo indirizzo MAC del gateway di default":
        "L’indirizzo MAC non è il cuore del routing di livello 3.",
      "Interrogazioni HTTP periodiche al router root":
        "Il routing non usa HTTP in questo modo.",
      "Broadcast globale di tutte le tabelle applicative del data center":
        "Questa descrizione non rappresenta il funzionamento classico dei distance vector.",
    },
    source: "Capitolo 5 - Livello Di Rete- Il Piano Di Controllo.pdf",
    studyGuide: guide(
      "Idea base dei protocolli distance vector.",
      "Ogni router dice ai vicini quanto pensa costi arrivare alle destinazioni; poi tutti aggiornano le stime.",
      "Distance vector = 'io per arrivare lì spendo X'.",
      "Quale problema classico può emergere nei protocolli distance vector quando una rotta diventa guasta?",
    ),
  },
  {
    id: "internet-040",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "media",
    question:
      "A quale categoria appartiene il protocollo BGP?",
    options: [
      "Protocollo di routing interdominio tra sistemi autonomi",
      "Protocollo di accesso multiplo per reti Wi-Fi",
      "Protocollo di risoluzione dei MAC address",
      "Protocollo di trasporto affidabile orientato alla connessione",
    ],
    correctAnswer: "Protocollo di routing interdominio tra sistemi autonomi",
    explanation:
      "BGP governa il routing tra sistemi autonomi distinti, cioè tra grandi domini amministrativi come ISP, backbone e reti enterprise. Non sceglie solo il cammino minimo: incorpora anche politiche, preferenze e relazioni economiche. È quindi il pilastro del routing inter-AS su Internet.",
    whyOthersAreWrong: {
      "Protocollo di accesso multiplo per reti Wi-Fi":
        "L’accesso al mezzo in Wi-Fi riguarda CSMA/CA, non BGP.",
      "Protocollo di risoluzione dei MAC address":
        "La risoluzione IP-to-MAC è compito di ARP.",
      "Protocollo di trasporto affidabile orientato alla connessione":
        "Questa descrizione è quella del TCP, non di BGP.",
    },
    source: "Capitolo 5 - Livello Di Rete- Il Piano Di Controllo.pdf",
    studyGuide: guide(
      "Differenza tra routing intra-AS e inter-AS.",
      "BGP serve a far parlare tra loro domini amministrativi diversi, non solo router della stessa organizzazione.",
      "Se la domanda parla di sistemi autonomi, annusa BGP.",
      "Perché BGP viene definito policy-based oltre che distance/path vector?",
    ),
  },
  {
    id: "internet-041",
    category: "Internet",
    topic: "NAT",
    difficulty: "media",
    question:
      "Qual è lo scopo principale del NAT overload (PAT) in una rete domestica o aziendale?",
    options: [
      "Permettere a più host privati di condividere uno stesso indirizzo IP pubblico distinguendo i flussi tramite porte",
      "Sostituire il DNS nella traduzione dei nomi di dominio",
      "Garantire che non si verifichino collisioni Ethernet nella LAN",
      "Offrire cifratura automatica a tutti i segmenti TCP in uscita",
    ],
    correctAnswer:
      "Permettere a più host privati di condividere uno stesso indirizzo IP pubblico distinguendo i flussi tramite porte",
    explanation:
      "Il NAT overload o PAT mappa molte connessioni provenienti da host privati su un singolo indirizzo pubblico. Per distinguerle usa tipicamente il numero di porta lato pubblico, creando una tabella di traduzione. È uno dei motivi per cui le reti locali possono usare indirizzi privati senza esporre un IP pubblico per ogni host.",
    whyOthersAreWrong: {
      "Sostituire il DNS nella traduzione dei nomi di dominio":
        "Il DNS traduce nomi in indirizzi IP, non indirizzi privati in pubblici.",
      "Garantire che non si verifichino collisioni Ethernet nella LAN":
        "Le collisioni sono un tema di accesso al mezzo e switching, non di NAT.",
      "Offrire cifratura automatica a tutti i segmenti TCP in uscita":
        "NAT non è un meccanismo crittografico.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Funzione operativa del NAT con traduzione di porta.",
      "NAT non è solo cambio di IP: spesso è anche cambio di porta per multiplexare molti flussi su un solo IP pubblico.",
      "Un IP pubblico, tante porte: questa è l’idea del PAT.",
      "Perché due host interni possono aprire sessioni verso lo stesso server usando un solo IP pubblico condiviso?",
    ),
  },
  {
    id: "internet-042",
    category: "Internet",
    topic: "NAT",
    difficulty: "media",
    question:
      "Perché si dice che un singolo NAT con un solo indirizzo pubblico ha un limite pratico sul numero di connessioni simultanee?",
    options: [
      "Perché il numero di porte disponibili per distinguere i flussi è finito",
      "Perché il NAT può gestire al massimo un host nella LAN",
      "Perché i router non possono inoltrare più di 255 datagrammi al secondo",
      "Perché il NAT elimina il campo checksum dai pacchetti tradotti",
    ],
    correctAnswer:
      "Perché il numero di porte disponibili per distinguere i flussi è finito",
    explanation:
      "Quando molti host condividono un solo indirizzo pubblico, il NAT deve riutilizzare il campo porta per distinguere le varie sessioni attive. Poiché lo spazio delle porte è di 16 bit, il numero di mappature contemporanee disponibili non è infinito. Nella pratica esistono anche ulteriori vincoli implementativi, ma il concetto teorico parte da qui.",
    whyOthersAreWrong: {
      "Perché il NAT può gestire al massimo un host nella LAN":
        "Proprio il contrario: NAT nasce per permettere a molti host di condividere pochi IP pubblici.",
      "Perché i router non possono inoltrare più di 255 datagrammi al secondo":
        "Non esiste un limite del genere legato al NAT.",
      "Perché il NAT elimina il campo checksum dai pacchetti tradotti":
        "Il NAT non elimina il checksum; deve anzi aggiornare i campi che modifica.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Perché il NAT ha un limite naturale di multiplexing con un solo IP pubblico.",
      "Se tanti flussi condividono un IP, la distinzione avviene soprattutto tramite le porte disponibili.",
      "Pensa al NAT come a un centralino con un numero finito di interni.",
      "In che modo l’aggiunta di un secondo IP pubblico aumenta la capacità del NAT?",
    ),
  },
  {
    id: "internet-043",
    category: "Internet",
    topic: "DHCP",
    difficulty: "facile",
    question:
      "Quale protocollo viene usato per assegnare dinamicamente un indirizzo IP a un host in una LAN?",
    options: ["DHCP", "ARP", "ICMP", "SMTP"],
    correctAnswer: "DHCP",
    explanation:
      "DHCP permette a un host di ottenere automaticamente indirizzo IP, subnet mask, default gateway, DNS server e altri parametri di configurazione. Questo evita la configurazione manuale macchina per macchina. È il protocollo standard di bootstrap della configurazione IPv4 in molte reti locali.",
    whyOthersAreWrong: {
      ARP: "ARP associa IP e MAC nella stessa LAN, ma non assegna un indirizzo IP nuovo.",
      ICMP: "ICMP serve per diagnostica e segnalazione errori, non per la configurazione degli host.",
      SMTP: "SMTP è un protocollo applicativo per la posta elettronica.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Configurazione automatica degli host.",
      "Un client appena acceso può chiedere in rete locale i parametri minimi per iniziare a comunicare: questo è il lavoro del DHCP.",
      "DHCP = il protocollo che ti dà l’identità di rete.",
      "Quali parametri, oltre all’IP, può consegnare un server DHCP?",
    ),
  },
  {
    id: "internet-044",
    category: "Internet",
    topic: "DHCP",
    difficulty: "media",
    question:
      "Quale sequenza riassume correttamente il tipico scambio iniziale di DHCP in IPv4?",
    options: [
      "Discover, Offer, Request, Acknowledge",
      "Hello, Certificate, Key Exchange, Data",
      "Query, Response, Query, Response",
      "SYN, SYN-ACK, ACK, FIN",
    ],
    correctAnswer: "Discover, Offer, Request, Acknowledge",
    explanation:
      "La sequenza classica è spesso ricordata come DORA: il client scopre i server, riceve una proposta, richiede formalmente la configurazione e ottiene l’ack finale. È una negoziazione semplice ma cruciale perché il client inizialmente non conosce ancora il proprio IP definitivo. Per questo molte fasi usano broadcast all’interno della LAN.",
    whyOthersAreWrong: {
      "Hello, Certificate, Key Exchange, Data":
        "Questa sequenza ricorda più un handshake crittografico che il DHCP.",
      "Query, Response, Query, Response":
        "È troppo generica e non rappresenta i messaggi specifici del protocollo.",
      "SYN, SYN-ACK, ACK, FIN":
        "Questa è logica da TCP, non da DHCP.",
    },
    source: "Capitolo 2 - Livello Di Applicazione.pdf",
    studyGuide: guide(
      "Fasi iniziali del DHCP.",
      "DORA è la mnemonica classica per ricordare come il client ottiene la configurazione di rete.",
      "DHCP ama DORA: Discover, Offer, Request, Ack.",
      "Perché DHCP usa spesso broadcast nelle sue prime fasi?",
    ),
  },
  {
    id: "internet-045",
    category: "Internet",
    topic: "DHCP",
    difficulty: "media",
    question:
      "Quale coppia di protocolli/porte descrive correttamente DHCP nella sua forma IPv4 classica?",
    options: [
      "UDP, porte 67 e 68",
      "TCP, porte 80 e 443",
      "UDP, porta 53",
      "TCP, porte 25 e 110",
    ],
    correctAnswer: "UDP, porte 67 e 68",
    explanation:
      "DHCP usa UDP perché il client non è ancora nella condizione ideale per instaurare una connessione TCP tradizionale. Le porte coinvolte sono tipicamente la 67 lato server e la 68 lato client. Questa scelta è coerente con la fase di bootstrap e con l’uso frequente del broadcast.",
    whyOthersAreWrong: {
      "TCP, porte 80 e 443":
        "Sono porte tipiche del Web, non di DHCP.",
      "UDP, porta 53":
        "La porta 53 è associata al DNS, non al DHCP.",
      "TCP, porte 25 e 110":
        "Queste riguardano tipicamente posta elettronica, non configurazione IP.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Scelte di trasporto nel DHCP.",
      "DHCP deve funzionare quando il client è ancora 'immaturo' dal punto di vista della configurazione, quindi preferisce UDP.",
      "DHCP = UDP 67/68, come coppia da ricordare a memoria.",
      "Perché sarebbe scomodo usare TCP nella prima fase di assegnazione IP?",
    ),
  },
  {
    id: "internet-046",
    category: "Internet",
    topic: "livello collegamento",
    difficulty: "media",
    question:
      "Quale funzione appartiene al livello di collegamento e non al livello di trasporto?",
    options: [
      "Framing e consegna hop-by-hop tra nodi adiacenti",
      "Gestione dei nomi di dominio",
      "Cifratura end-to-end del traffico HTTPS",
      "Instradamento tra sistemi autonomi",
    ],
    correctAnswer: "Framing e consegna hop-by-hop tra nodi adiacenti",
    explanation:
      "Il livello di collegamento si occupa di trasferire frame tra dispositivi direttamente connessi sullo stesso link o la stessa LAN. Qui troviamo framing, indirizzi MAC, controllo accesso al mezzo ed error detection locale. Trasporto, applicazione e routing interdominio fanno altro.",
    whyOthersAreWrong: {
      "Gestione dei nomi di dominio":
        "Questa è una funzione applicativa del DNS.",
      "Cifratura end-to-end del traffico HTTPS":
        "Qui entriamo nel dominio di TLS e dell’applicazione, non del data link.",
      "Instradamento tra sistemi autonomi":
        "Questo è un tema di livello rete e routing BGP.",
    },
    source: "Capitolo 6 - Livello Di Collegamento E Reti Locali.pdf",
    studyGuide: guide(
      "Ruolo locale del data link.",
      "Il livello di collegamento ragiona hop-by-hop, non end-to-end su tutta Internet.",
      "Data link = vicino a vicino, non capo a capo.",
      "Perché uno switch opera tipicamente al livello di collegamento e non a quello di trasporto?",
    ),
  },
  {
    id: "internet-047",
    category: "Internet",
    topic: "Ethernet",
    difficulty: "facile",
    question:
      "Quale elemento è contenuto tipicamente nel trailer di un frame Ethernet?",
    options: ["CRC/FCS per il rilevamento di errori", "Numero di porta TCP", "TTL", "Record DNS"],
    correctAnswer: "CRC/FCS per il rilevamento di errori",
    explanation:
      "Il trailer Ethernet contiene il Frame Check Sequence, basato su CRC, che serve a rilevare errori introdotti sul link. Se il controllo fallisce, il frame viene scartato. Non si tratta di correzione automatica dell’errore, ma di rilevazione locale al livello di collegamento.",
    whyOthersAreWrong: {
      "Numero di porta TCP":
        "Le porte appartengono al livello di trasporto e non stanno nel trailer Ethernet.",
      TTL: "Il TTL è un campo dell’header IP.",
      "Record DNS":
        "I record DNS sono contenuti applicativi, non parti del trailer data-link.",
    },
    source: "Capitolo 6 - Livello Di Collegamento E Reti Locali.pdf",
    studyGuide: guide(
      "Error detection locale in Ethernet.",
      "Il trailer chiude il frame con una firma numerica che aiuta a capire se i bit si sono corrotti sul link.",
      "Ethernet chiude con un controllo, non con una porta.",
      "Che differenza c’è tra rilevare un errore con CRC e recuperarlo con ritrasmissione end-to-end?",
    ),
  },
  {
    id: "internet-048",
    category: "Internet",
    topic: "MAC address",
    difficulty: "facile",
    question:
      "Come viene identificata univocamente, a livello data link, una scheda di rete Ethernet?",
    options: ["MAC address", "Numero di porta TCP", "Hostname DNS", "TTL"],
    correctAnswer: "MAC address",
    explanation:
      "Il MAC address è l’identificatore usato nel dominio Ethernet per la consegna locale dei frame. È lungo 48 bit nella forma classica e viene scritto in esadecimale. L’indirizzo IP serve a livello rete, ma su un singolo link Ethernet ciò che conta per la consegna diretta è il MAC.",
    whyOthersAreWrong: {
      "Numero di porta TCP":
        "La porta identifica un processo, non una scheda di rete.",
      "Hostname DNS":
        "Il nome DNS è un identificatore applicativo, non di livello data link.",
      TTL: "Il TTL è legato alla vita del datagramma IP, non all’identità della NIC.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Indirizzamento locale nel data link.",
      "Su Ethernet il frame deve sapere a quale interfaccia locale consegnarsi: per questo usa il MAC address.",
      "IP trova l’host logico, MAC trova la porta fisica sulla LAN.",
      "Quale indirizzo viene risolto da ARP quando conosci l’IP del vicino?",
    ),
  },
  {
    id: "internet-049",
    category: "Internet",
    topic: "MAC address",
    difficulty: "media",
    question:
      "Che cosa rappresentano i primi 24 bit di un MAC address Ethernet tradizionale?",
    options: [
      "L’OUI assegnato al produttore della scheda",
      "Il numero di porta del servizio applicativo",
      "La subnet mask della rete locale",
      "Il valore iniziale del TTL consigliato",
    ],
    correctAnswer: "L’OUI assegnato al produttore della scheda",
    explanation:
      "I primi 24 bit formano l’Organizationally Unique Identifier, assegnato al vendor. I restanti bit identificano la specifica interfaccia prodotta da quell’organizzazione. È uno dei motivi per cui osservando un MAC si può spesso intuire il produttore della NIC.",
    whyOthersAreWrong: {
      "Il numero di porta del servizio applicativo":
        "Le porte non hanno nulla a che fare con la struttura del MAC address.",
      "La subnet mask della rete locale":
        "La subnet mask è un parametro di livello rete e non è codificata nel MAC.",
      "Il valore iniziale del TTL consigliato":
        "Il TTL è un campo IP e non è rappresentato nel MAC address.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Struttura del MAC classico a 48 bit.",
      "Metà iniziale circa del MAC identifica il costruttore, la parte restante la singola interfaccia.",
      "OUI = firma del produttore.",
      "Perché due schede dello stesso vendor condividono spesso lo stesso prefisso MAC?",
    ),
  },
  {
    id: "internet-050",
    category: "Internet",
    topic: "ARP",
    difficulty: "facile",
    question:
      "A cosa serve il protocollo ARP in una rete IPv4 locale?",
    options: [
      "A risolvere l’indirizzo MAC corrispondente a un indirizzo IP noto",
      "A tradurre nomi DNS in indirizzi IPv4 pubblici",
      "A instradare pacchetti tra sistemi autonomi",
      "A cifrare il traffico tra browser e server web",
    ],
    correctAnswer: "A risolvere l’indirizzo MAC corrispondente a un indirizzo IP noto",
    explanation:
      "Quando un host deve inviare un frame Ethernet a un vicino di cui conosce l’IP ma non il MAC, usa ARP. Il protocollo chiede in broadcast 'chi ha questo IP?' e il destinatario risponde con il proprio indirizzo fisico. È un ponte essenziale tra livello rete e livello collegamento nella LAN IPv4.",
    whyOthersAreWrong: {
      "A tradurre nomi DNS in indirizzi IPv4 pubblici":
        "Questa è la funzione del DNS, non di ARP.",
      "A instradare pacchetti tra sistemi autonomi":
        "Il routing inter-AS è tema da BGP e livello rete, non ARP.",
      "A cifrare il traffico tra browser e server web":
        "La cifratura del Web è compito di TLS/HTTPS.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Relazione tra IP e MAC in una LAN.",
      "ARP entra in scena solo quando il destinatario è sul link locale o quando devi raggiungere il gateway locale.",
      "Conosco l’IP ma non il MAC? Chiedo con ARP.",
      "Perché ARP non è necessario oltre il primo hop del percorso Internet?",
    ),
  },
  {
    id: "internet-051",
    category: "Internet",
    topic: "ARP",
    difficulty: "media",
    question:
      "Quale indirizzo MAC di destinazione usa tipicamente una ARP request Ethernet?",
    options: [
      "FF:FF:FF:FF:FF:FF",
      "00:00:00:00:00:00",
      "L’indirizzo MAC del router root",
      "L’OUI del produttore della scheda di destinazione",
    ],
    correctAnswer: "FF:FF:FF:FF:FF:FF",
    explanation:
      "La ARP request viene trasmessa in broadcast a livello Ethernet perché il mittente non conosce ancora il MAC della macchina cercata. Tutti gli host della LAN la ricevono, ma solo quello che possiede l’IP richiesto risponde. È importante non confondere il broadcast MAC del frame con il target IP contenuto nel payload ARP.",
    whyOthersAreWrong: {
      "00:00:00:00:00:00":
        "Non è l’indirizzo di broadcast Ethernet usato per diffondere la richiesta.",
      "L’indirizzo MAC del router root":
        "Non esiste un 'router root' coinvolto nella logica ARP locale.",
      "L’OUI del produttore della scheda di destinazione":
        "L’OUI non basta a raggiungere una scheda e non è l’indirizzo di broadcast.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Broadcast a livello 2 per trovare un vicino sconosciuto.",
      "ARP request parla a tutti perché ancora non sa chi è il destinatario fisico corretto.",
      "Se non sai chi è, urli in broadcast.",
      "Perché l’ARP request è broadcast ma l’ARP reply è normalmente unicast?",
    ),
  },
  {
    id: "internet-052",
    category: "Internet",
    topic: "switch",
    difficulty: "media",
    question:
      "Come funziona l’auto-apprendimento di uno switch Ethernet?",
    options: [
      "Osserva il MAC sorgente dei frame ricevuti e associa quel MAC alla porta d’ingresso",
      "Legge il TTL dei datagrammi e associa il router più vicino alla porta",
      "Chiede periodicamente ai client di inviare il proprio indirizzo IP via HTTP",
      "Assegna in modo casuale un MAC virtuale a ogni porta fisica",
    ],
    correctAnswer:
      "Osserva il MAC sorgente dei frame ricevuti e associa quel MAC alla porta d’ingresso",
    explanation:
      "Lo switch impara in modo passivo: quando riceve un frame, usa il MAC sorgente per arricchire la forwarding table, associandolo alla porta su cui il frame è entrato. In questo modo, col tempo, sa dove inoltrare i frame destinati a quel MAC. Non serve configurare a mano ogni associazione in una LAN normale.",
    whyOthersAreWrong: {
      "Legge il TTL dei datagrammi e associa il router più vicino alla porta":
        "Il TTL è un campo IP e non viene usato per l’apprendimento MAC dello switch.",
      "Chiede periodicamente ai client di inviare il proprio indirizzo IP via HTTP":
        "Lo switch non usa HTTP per costruire la tabella di forwarding.",
      "Assegna in modo casuale un MAC virtuale a ogni porta fisica":
        "Lo switch apprende MAC reali osservati sul traffico, non li inventa casualmente.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Come nasce una tabella MAC senza configurazione manuale.",
      "Lo switch guarda chi parla e da dove parla: così impara dove si trova ciascun MAC.",
      "Switch impara dal mittente, non dal destinatario.",
      "Perché uno switch appena acceso può inizialmente fare più flooding del necessario?",
    ),
  },
  {
    id: "internet-053",
    category: "Internet",
    topic: "switch",
    difficulty: "media",
    question:
      "Che cosa fa normalmente uno switch Ethernet quando riceve un frame unicast destinato a un MAC non presente nella sua tabella?",
    options: [
      "Esegue flooding su tutte le porte tranne quella di ingresso",
      "Scarta subito il frame perché la destinazione è ignota",
      "Invia il frame al DNS locale per risolvere il MAC corretto",
      "Trasforma automaticamente il frame in broadcast IP",
    ],
    correctAnswer:
      "Esegue flooding su tutte le porte tranne quella di ingresso",
    explanation:
      "Finché non conosce la posizione del MAC di destinazione, lo switch si comporta in modo prudente e replica il frame sulle altre porte della LAN. Se il destinatario esiste, risponderà e consentirà allo switch di imparare la sua posizione. È il comportamento standard per gli unknown unicast frames.",
    whyOthersAreWrong: {
      "Scarta subito il frame perché la destinazione è ignota":
        "Così la comunicazione non potrebbe mai iniziare su una tabella ancora incompleta.",
      "Invia il frame al DNS locale per risolvere il MAC corretto":
        "DNS non risolve MAC address.",
      "Trasforma automaticamente il frame in broadcast IP":
        "Non cambia il protocollo né il significato del traffico in questo modo.",
    },
    source: "Capitolo 6 - Livello Di Collegamento E Reti Locali.pdf",
    studyGuide: guide(
      "Comportamento di default dello switch davanti a un destino sconosciuto.",
      "Se non sa dove si trova il MAC, prova dappertutto tranne dove il frame è entrato.",
      "Ignoto unicast = flooding controllato.",
      "In che modo il flooding iniziale aiuta poi a ridurre il traffico futuro nella LAN?",
    ),
  },
  {
    id: "internet-054",
    category: "Internet",
    topic: "Ethernet",
    difficulty: "media",
    question:
      "Quale tecnica di accesso al mezzo è storicamente associata a Ethernet condivisa (IEEE 802.3 classica)?",
    options: ["CSMA/CD", "CSMA/CA", "TDMA", "ALOHA puro in fibra"],
    correctAnswer: "CSMA/CD",
    explanation:
      "Nelle versioni classiche di Ethernet condivisa, i nodi ascoltano il mezzo, trasmettono se libero e rilevano eventuali collisioni: è la logica del CSMA/CD. Nelle LAN switchate moderne le collisioni sono molto meno rilevanti, ma il principio resta storico e teoricamente importante. CSMA/CA è invece la tecnica tipica del Wi-Fi.",
    whyOthersAreWrong: {
      "CSMA/CA":
        "È la tecnica caratteristica dell’accesso wireless 802.11.",
      TDMA: "Non è il metodo classico associato a Ethernet 802.3 nel contesto del corso.",
      "ALOHA puro in fibra":
        "Non descrive lo standard Ethernet tradizionale.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Differenza tra Collision Detection e Collision Avoidance.",
      "Ethernet classica cablata poteva rilevare collisioni sul mezzo condiviso; il Wi-Fi preferisce evitarle prima.",
      "D di CD = detect, A di CA = avoid.",
      "Perché il Wi-Fi usa CSMA/CA invece di CSMA/CD?",
    ),
  },
  {
    id: "internet-055",
    category: "Internet",
    topic: "Ethernet",
    difficulty: "facile",
    question:
      "Quale dei seguenti è un indirizzo broadcast a livello data link Ethernet?",
    options: [
      "FF:FF:FF:FF:FF:FF",
      "255.255.255.255",
      "00:00:00:00:00:00",
      "127.0.0.1",
    ],
    correctAnswer: "FF:FF:FF:FF:FF:FF",
    explanation:
      "L’indirizzo broadcast Ethernet è composto da tutti 1 e si scrive `FF:FF:FF:FF:FF:FF`. Il valore `255.255.255.255` è invece un broadcast IPv4 di livello rete. Confondere i due piani è un errore classico da esame.",
    whyOthersAreWrong: {
      "255.255.255.255":
        "È un indirizzo broadcast IPv4, non un MAC address Ethernet.",
      "00:00:00:00:00:00":
        "Non è il valore di broadcast standard Ethernet.",
      "127.0.0.1":
        "È l’indirizzo loopback IPv4 locale, non un broadcast data link.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Distinzione tra broadcast livello 2 e broadcast livello 3.",
      "Broadcast Ethernet e broadcast IPv4 esistono su livelli diversi e hanno formati diversi.",
      "Se vedi esadecimale a FF, stai pensando a MAC broadcast.",
      "Perché una ARP request usa broadcast MAC ma non necessariamente broadcast IP nel payload?",
    ),
  },
  {
    id: "internet-056",
    category: "Internet",
    topic: "livello collegamento",
    difficulty: "difficile",
    question:
      "Supponendo uno switch store-and-forward tra due link di capacità R1 e R2, trascurando propagazione, accodamento ed elaborazione, quanto vale il ritardo totale per un pacchetto di lunghezza L?",
    options: [
      "L/R1 + L/R2",
      "L/(R1 + R2)",
      "max(L/R1, L/R2)",
      "2L/(R1 * R2)",
    ],
    correctAnswer: "L/R1 + L/R2",
    explanation:
      "Con store-and-forward lo switch deve ricevere tutto il pacchetto sul primo link prima di poterlo ritrasmettere sul secondo. Per questo i ritardi di trasmissione si sommano: prima `L/R1`, poi `L/R2`. Non basta prendere il massimo e non si può trattare il sistema come un unico link di banda aggregata.",
    whyOthersAreWrong: {
      "L/(R1 + R2)":
        "Le capacità non si sommano come se i due link fossero un unico canale parallelo.",
      "max(L/R1, L/R2)":
        "Questo sottostima il ritardo perché ignora che le due trasmissioni avvengono in fasi consecutive.",
      "2L/(R1 * R2)":
        "La formula non ha significato fisico corretto per il caso descritto.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Effetto dello store-and-forward sui ritardi.",
      "Se lo switch deve ricevere tutto prima di reinviare, paghi un tempo di trasmissione per ogni tratto.",
      "Store-and-forward = un pedaggio per ogni link.",
      "Come cambierebbe il ragionamento con un dispositivo cut-through ideale?",
    ),
  },
  {
    id: "internet-057",
    category: "Internet",
    topic: "Wi-Fi e reti mobili",
    difficulty: "media",
    question:
      "Quale tecnica di accesso al mezzo usa tipicamente il Wi-Fi 802.11?",
    options: ["CSMA/CA", "CSMA/CD", "Bellman-Ford", "ARP flooding"],
    correctAnswer: "CSMA/CA",
    explanation:
      "Nel Wi-Fi i nodi cercano di evitare la collisione prima di trasmettere, usando attesa, ascolto del canale e backoff casuale: è la logica del CSMA/CA. Rilevare collisioni come sull’Ethernet cablata è molto più difficile in ambiente radio. Per questo il meccanismo è di collision avoidance e non di collision detection.",
    whyOthersAreWrong: {
      "CSMA/CD":
        "È il paradigma storico di Ethernet condivisa cablata, non del Wi-Fi.",
      "Bellman-Ford":
        "È un algoritmo di routing, non di accesso al mezzo radio.",
      "ARP flooding":
        "ARP è un protocollo di risoluzione indirizzi, non una tecnica MAC di accesso.",
    },
    source: "Capitolo 6-7 - Wireless E Reti Mobile.pdf",
    studyGuide: guide(
      "Perché il wireless evita le collisioni invece di rilevarle dopo.",
      "In radio è difficile ascoltare e trasmettere bene contemporaneamente, quindi conviene evitare la collisione prima che avvenga.",
      "Wi-Fi prima pensa, poi parla.",
      "Qual è il ruolo del backoff casuale nel CSMA/CA?",
    ),
  },
  {
    id: "internet-058",
    category: "Internet",
    topic: "Wi-Fi e reti mobili",
    difficulty: "media",
    question:
      "Quanti campi indirizzo può contenere l’intestazione MAC di un frame 802.11?",
    options: ["4", "2", "3", "1"],
    correctAnswer: "4",
    explanation:
      "L’header 802.11 prevede fisicamente lo spazio per quattro campi indirizzo. Nella pratica non sempre sono tutti valorizzati, ma la struttura esiste perché i frame wireless possono dover rappresentare mittente, destinatario, BSSID e altri ruoli intermedi. Questa flessibilità è una differenza importante rispetto a Ethernet.",
    whyOthersAreWrong: {
      "2":
        "Due indirizzi sono tipici del frame Ethernet semplice, non dell’header 802.11 completo.",
      "3":
        "Tre indirizzi sono spesso usati in casi comuni, ma la struttura completa può contenerne quattro.",
      "1":
        "Un solo indirizzo non basterebbe a rappresentare gli attori di una comunicazione wireless infrastrutturata.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Perché 802.11 ha header più ricchi di Ethernet.",
      "La rete wireless deve poter esprimere più ruoli logici, specialmente in presenza di infrastruttura e distribuzione.",
      "Wi-Fi ha più identità in gioco, quindi più campi indirizzo.",
      "Quando il quarto indirizzo 802.11 diventa particolarmente utile?",
    ),
  },
  {
    id: "internet-059",
    category: "Internet",
    topic: "ISP, router, switch, modem, access point",
    difficulty: "facile",
    question:
      "Qual è il compito tipico di un modem nel contesto dell’accesso a Internet?",
    options: [
      "Adattare o modulare il segnale per il mezzo d’accesso usato dal collegamento",
      "Gestire gli ACK cumulativi del TCP",
      "Risolvere nomi di dominio in indirizzi IPv4",
      "Memorizzare i cookie del browser",
    ],
    correctAnswer:
      "Adattare o modulare il segnale per il mezzo d’accesso usato dal collegamento",
    explanation:
      "Il modem lavora vicino al livello fisico e adatta il segnale al mezzo di accesso, per esempio linea telefonica, cavo o altre tecnologie. Non è il componente che decide il routing né quello che gestisce applicazioni come DNS o cookie. In casa spesso convive nello stesso apparato con router e access point, ma il ruolo logico resta distinto.",
    whyOthersAreWrong: {
      "Gestire gli ACK cumulativi del TCP":
        "Gli ACK TCP sono gestiti dagli host finali a livello di trasporto.",
      "Risolvere nomi di dominio in indirizzi IPv4":
        "Questa è funzione del DNS o del resolver configurato.",
      "Memorizzare i cookie del browser":
        "I cookie sono dati applicativi gestiti da browser e server.",
    },
    source: "Architettura_Internet_C.Lorenzo.pdf",
    studyGuide: guide(
      "Ruoli distinti dei componenti spesso presenti nello stesso 'router di casa'.",
      "Lo stesso scatolotto può includere modem, router, switch e AP, ma ogni funzione resta concettualmente separata.",
      "Modem tocca il mezzo, router tocca le rotte.",
      "Perché un accesso FTTH o xDSL richiede comunque un componente diverso dal semplice switch Ethernet?",
    ),
  },
  {
    id: "internet-060",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "media",
    question:
      "Qual è l’utilità principale dei cookie nel protocollo HTTP?",
    options: [
      "Permettere al server di mantenere stato applicativo tra richieste altrimenti stateless",
      "Ridurre il TTL dei pacchetti per migliorare la latenza",
      "Assegnare un indirizzo IP dinamico al browser",
      "Sostituire il TLS per autenticare il server",
    ],
    correctAnswer:
      "Permettere al server di mantenere stato applicativo tra richieste altrimenti stateless",
    explanation:
      "HTTP, per sua natura, non ricorda automaticamente il contesto tra una richiesta e la successiva. I cookie permettono di associare richieste diverse allo stesso utente o alla stessa sessione applicativa, abilitando login persistente, carrelli, preferenze e tracking. Non sono sicurezza di trasporto né configurazione di rete.",
    whyOthersAreWrong: {
      "Ridurre il TTL dei pacchetti per migliorare la latenza":
        "Il TTL è un campo IP e i cookie non hanno alcun effetto su di esso.",
      "Assegnare un indirizzo IP dinamico al browser":
        "L’assegnazione IP è compito del DHCP, non dei cookie.",
      "Sostituire il TLS per autenticare il server":
        "L’autenticazione del server in HTTPS dipende da TLS e certificati, non dai cookie.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Statelessness di HTTP e stato applicativo.",
      "Il protocollo è stateless, ma le applicazioni web reali hanno bisogno di ricordare chi sei e cosa stavi facendo.",
      "Cookie = memoria esterna per un protocollo senza memoria.",
      "Perché i cookie sono utili anche se HTTP è un protocollo stateless?",
    ),
  },
  {
    id: "security-061",
    category: "Sicurezza",
    topic: "concetti base CIA: confidenzialità, integrità, disponibilità",
    difficulty: "facile",
    question:
      "Quale proprietà NON è garantita direttamente dalla crittografia da sola?",
    options: ["Disponibilità", "Confidenzialità", "Integrità", "Autenticità del contenuto firmato"],
    correctAnswer: "Disponibilità",
    explanation:
      "La crittografia è ottima per proteggere confidenzialità e integrità, e in certi contesti anche autenticità tramite firme o MAC. Non può però garantire da sola che un servizio resti disponibile: se un server viene spento, saturato o scollegato, la cifratura non basta a tenerlo accessibile. La disponibilità richiede anche ridondanza, capacità e resilienza operativa.",
    whyOthersAreWrong: {
      Confidenzialità:
        "La cifratura nasce proprio per impedire la lettura del contenuto a chi non è autorizzato.",
      Integrità:
        "Hash, MAC e firme digitali aiutano a rilevare alterazioni del messaggio.",
      "Autenticità del contenuto firmato":
        "Una firma digitale ben verificata può supportare l’autenticità dell’origine.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Cosa copre davvero la triade CIA.",
      "Crittografia aiuta molto su C e I, ma A richiede anche misure infrastrutturali e operative.",
      "Puoi cifrare un server perfettamente, ma se è giù resta giù.",
      "Quale tipo di attacco colpisce soprattutto la disponibilità di un servizio?",
    ),
  },
  {
    id: "security-062",
    category: "Sicurezza",
    topic: "crittografia simmetrica",
    difficulty: "facile",
    question:
      "Qual è la caratteristica fondamentale della crittografia simmetrica?",
    options: [
      "La stessa chiave segreta viene usata sia per cifrare sia per decifrare",
      "Si usano sempre due chiavi pubbliche diverse",
      "Non serve alcun segreto condiviso tra mittente e destinatario",
      "La chiave privata del destinatario è nota a tutti",
    ],
    correctAnswer:
      "La stessa chiave segreta viene usata sia per cifrare sia per decifrare",
    explanation:
      "Nella crittografia simmetrica il problema centrale è condividere in modo sicuro la chiave segreta. Una volta ottenuta, cifratura e decifratura sono in genere molto efficienti dal punto di vista computazionale. Proprio per questo gli algoritmi simmetrici sono usatissimi per proteggere grandi quantità di dati.",
    whyOthersAreWrong: {
      "Si usano sempre due chiavi pubbliche diverse":
        "Questa non è la logica della crittografia simmetrica.",
      "Non serve alcun segreto condiviso tra mittente e destinatario":
        "Serve eccome: la forza del sistema ruota attorno a quel segreto comune.",
      "La chiave privata del destinatario è nota a tutti":
        "Una chiave privata non dovrebbe mai essere pubblica.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Differenza tra simmetrica e asimmetrica.",
      "Simmetrica = stessa chiave segreta per le due operazioni principali.",
      "Una chiave sola, ma va condivisa bene.",
      "Perché la distribuzione della chiave è il problema classico della cifratura simmetrica?",
    ),
  },
  {
    id: "security-063",
    category: "Sicurezza",
    topic: "crittografia simmetrica",
    difficulty: "media",
    question:
      "Perché gli algoritmi simmetrici sono spesso usati per cifrare il traffico di una sessione HTTPS dopo l’handshake?",
    options: [
      "Perché sono molto più efficienti nel trattare grandi volumi di dati rispetto alla crittografia asimmetrica",
      "Perché non richiedono alcuna chiave di sessione",
      "Perché possono sostituire il certificato del server",
      "Perché rendono inutile l’autenticazione dell’endpoint remoto",
    ],
    correctAnswer:
      "Perché sono molto più efficienti nel trattare grandi volumi di dati rispetto alla crittografia asimmetrica",
    explanation:
      "La crittografia asimmetrica è preziosa per autenticare e scambiare segreti, ma è troppo costosa per proteggere continuamente tutto il traffico applicativo. Per questo, dopo il TLS handshake, si passa di solito a una chiave di sessione simmetrica. È il cuore dei sistemi ibridi moderni.",
    whyOthersAreWrong: {
      "Perché non richiedono alcuna chiave di sessione":
        "Al contrario, la sessione sicura si appoggia proprio a una chiave simmetrica condivisa.",
      "Perché possono sostituire il certificato del server":
        "Il certificato resta necessario per autenticare il server nella fase iniziale.",
      "Perché rendono inutile l’autenticazione dell’endpoint remoto":
        "Efficienza e autenticazione sono problemi diversi: la seconda resta fondamentale.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Perché i protocolli moderni sono ibridi.",
      "Asimmetrica per iniziare la fiducia, simmetrica per portare tanti dati a costo basso.",
      "La chiave pubblica apre la porta, la chiave simmetrica fa il lavoro pesante.",
      "Perché TLS non usa solo RSA o solo Diffie-Hellman per cifrare ogni byte della sessione?",
    ),
  },
  {
    id: "security-064",
    category: "Sicurezza",
    topic: "crittografia asimmetrica",
    difficulty: "facile",
    question:
      "Quale affermazione descrive correttamente la crittografia asimmetrica?",
    options: [
      "Usa una coppia di chiavi correlate: una pubblica e una privata",
      "Usa sempre la stessa chiave segreta su entrambe le estremità",
      "Non consente in alcun modo la verifica di firme digitali",
      "È nata per sostituire completamente ogni algoritmo simmetrico",
    ],
    correctAnswer: "Usa una coppia di chiavi correlate: una pubblica e una privata",
    explanation:
      "La crittografia asimmetrica introduce due chiavi matematicamente legate ma con ruoli distinti. Una può essere diffusa pubblicamente, l’altra deve restare segreta. Questo abilita casi d’uso cruciali come scambio di chiavi, firme digitali e autenticazione basata su certificati.",
    whyOthersAreWrong: {
      "Usa sempre la stessa chiave segreta su entrambe le estremità":
        "Questa è la definizione della crittografia simmetrica.",
      "Non consente in alcun modo la verifica di firme digitali":
        "Le firme digitali sono proprio uno dei casi d’uso classici dell’asimmetrica.",
      "È nata per sostituire completamente ogni algoritmo simmetrico":
        "Nella pratica i due mondi collaborano spesso in schemi ibridi.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Ruolo delle due chiavi nell’asimmetrica.",
      "La chiave pubblica può circolare, la privata no: questa separazione cambia completamente le possibilità operative.",
      "Pubblica per distribuire fiducia, privata per custodire potere crittografico.",
      "Perché l’asimmetrica è utile anche quando mittente e destinatario non hanno mai condiviso prima un segreto?",
    ),
  },
  {
    id: "security-065",
    category: "Sicurezza",
    topic: "RSA",
    difficulty: "media",
    question:
      "Su quale difficoltà computazionale si basa classicamente la sicurezza dell’RSA?",
    options: [
      "Sulla difficoltà di fattorizzare il prodotto di due grandi numeri primi",
      "Sulla difficoltà di risolvere il problema dei cammini minimi",
      "Sulla difficoltà di rilevare collisioni Ethernet",
      "Sulla difficoltà di indovinare un MAC address a 48 bit",
    ],
    correctAnswer:
      "Sulla difficoltà di fattorizzare il prodotto di due grandi numeri primi",
    explanation:
      "RSA costruisce il proprio modulo come prodotto di due grandi primi. Se un attaccante riuscisse a fattorizzarlo facilmente, potrebbe ricostruire informazioni critiche legate alla chiave privata. La sicurezza pratica dipende anche da implementazione, padding e dimensione delle chiavi, ma la base teorica classica è questa.",
    whyOthersAreWrong: {
      "Sulla difficoltà di risolvere il problema dei cammini minimi":
        "Quello riguarda algoritmi di routing, non crittografia RSA.",
      "Sulla difficoltà di rilevare collisioni Ethernet":
        "Collisioni Ethernet e sicurezza RSA non hanno relazione.",
      "Sulla difficoltà di indovinare un MAC address a 48 bit":
        "Il MAC address è un identificatore di rete, non il fondamento matematico di RSA.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Fondamento matematico elementare dell’RSA.",
      "Moltiplicare due grandi primi è facile; tornare indietro fattorizzando il risultato è la parte difficile.",
      "RSA ama il prodotto, odia la fattorizzazione.",
      "Perché scegliere primi piccoli o moduli corti rende RSA fragile?",
    ),
  },
  {
    id: "security-066",
    category: "Sicurezza",
    topic: "RSA",
    difficulty: "media",
    question:
      "Nel caso di firma digitale con RSA, quale chiave viene usata per generare la firma?",
    options: [
      "La chiave privata del firmatario",
      "La chiave pubblica del firmatario",
      "La chiave privata del destinatario",
      "La chiave pubblica della Certification Authority",
    ],
    correctAnswer: "La chiave privata del firmatario",
    explanation:
      "La firma deve dimostrare che solo il titolare della chiave privata poteva produrre quel risultato. Per questo la generazione della firma usa la chiave privata del soggetto che firma, mentre la verifica usa la sua chiave pubblica. È il duale logico della cifratura pensata per la confidenzialità.",
    whyOthersAreWrong: {
      "La chiave pubblica del firmatario":
        "La chiave pubblica serve per verificare, non per generare la firma.",
      "La chiave privata del destinatario":
        "La firma prova l’identità del mittente, non del destinatario.",
      "La chiave pubblica della Certification Authority":
        "La CA firma i certificati, non i documenti dell’utente in questo scenario.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Direzione corretta della firma digitale.",
      "Si firma con il segreto del mittente e si verifica con il pubblico del mittente.",
      "Firma = privata in uscita, pubblica in verifica.",
      "Perché sarebbe assurdo firmare con una chiave pubblica?",
    ),
  },
  {
    id: "security-067",
    category: "Sicurezza",
    topic: "Diffie-Hellman",
    difficulty: "media",
    question:
      "Qual è lo scopo principale del protocollo Diffie-Hellman?",
    options: [
      "Permettere a due parti di concordare una chiave condivisa su un canale insicuro",
      "Firmare documenti con non ripudio nativo",
      "Emettere certificati X.509 a nome di una CA",
      "Assegnare indirizzi IP dinamici ai client di rete",
    ],
    correctAnswer:
      "Permettere a due parti di concordare una chiave condivisa su un canale insicuro",
    explanation:
      "Diffie-Hellman non nasce per cifrare da solo tutti i dati né per firmare documenti. Il suo obiettivo è permettere a due soggetti di arrivare allo stesso segreto di sessione anche se l’ascoltatore osserva il canale. Questo lo rende fondamentale negli handshake moderni per ottenere segreti effimeri.",
    whyOthersAreWrong: {
      "Firmare documenti con non ripudio nativo":
        "Quello è un caso d’uso più tipico di algoritmi di firma come RSA o ECDSA.",
      "Emettere certificati X.509 a nome di una CA":
        "L’emissione di certificati riguarda la PKI, non DH.",
      "Assegnare indirizzi IP dinamici ai client di rete":
        "Questa è la funzione del DHCP.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Uso di Diffie-Hellman nei protocolli sicuri.",
      "DH serve a creare un segreto comune, non a sostituire tutto il resto della sicurezza.",
      "DH = accordiamoci su una chiave senza spedirla in chiaro.",
      "Perché Diffie-Hellman è prezioso nelle suite TLS con forward secrecy?",
    ),
  },
  {
    id: "security-068",
    category: "Sicurezza",
    topic: "Diffie-Hellman",
    difficulty: "difficile",
    question:
      "Quale vulnerabilità ha il Diffie-Hellman se usato senza un meccanismo di autenticazione aggiuntivo?",
    options: [
      "È esposto a un attacco man-in-the-middle",
      "Non può generare una chiave condivisa",
      "Produce sempre la stessa chiave per qualunque coppia di utenti",
      "Rivela automaticamente la chiave privata di entrambi i partecipanti",
    ],
    correctAnswer: "È esposto a un attacco man-in-the-middle",
    explanation:
      "Diffie-Hellman da solo consente di generare una chiave comune, ma non prova con chi stai davvero parlando. Un attaccante nel mezzo può instaurare due scambi separati e fingere di essere ciascuna delle due parti. Per questo, nei protocolli reali, DH viene combinato con certificati, firme o altre forme di autenticazione.",
    whyOthersAreWrong: {
      "Non può generare una chiave condivisa":
        "Generarla è proprio il suo obiettivo principale.",
      "Produce sempre la stessa chiave per qualunque coppia di utenti":
        "La chiave dipende dai parametri e dai segreti scelti dai partecipanti.",
      "Rivela automaticamente la chiave privata di entrambi i partecipanti":
        "Questo non è il comportamento del protocollo corretto.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Distinzione tra accordo su chiave e autenticazione dell’identità.",
      "Puoi concordare un segreto con qualcuno... ma senza autenticazione potresti concordarlo col nemico in mezzo.",
      "DH protegge dal curioso passivo, non dall’impostore attivo.",
      "Quale componente impedisce il man-in-the-middle in un handshake TLS con Diffie-Hellman?",
    ),
  },
  {
    id: "security-069",
    category: "Sicurezza",
    topic: "hash",
    difficulty: "facile",
    question:
      "Qual è lo scopo principale di una funzione hash crittografica?",
    options: [
      "Produrre un digest compatto utile a verificare l’integrità dei dati",
      "Cifrare reversibilmente un messaggio con una chiave segreta",
      "Assegnare un indirizzo IP a un host appena acceso",
      "Effettuare il routing dei pacchetti tra sistemi autonomi",
    ],
    correctAnswer:
      "Produrre un digest compatto utile a verificare l’integrità dei dati",
    explanation:
      "Una funzione hash crittografica prende un input arbitrario e restituisce un’impronta di dimensione fissa. Piccole variazioni dell’input devono produrre cambiamenti grandi e imprevedibili nel digest. Per questo è utilissima per controllare integrità, firme digitali, HMAC e archiviazione sicura di password.",
    whyOthersAreWrong: {
      "Cifrare reversibilmente un messaggio con una chiave segreta":
        "L’hash non è una cifratura reversibile e in genere non usa una chiave.",
      "Assegnare un indirizzo IP a un host appena acceso":
        "Questa è la funzione del DHCP.",
      "Effettuare il routing dei pacchetti tra sistemi autonomi":
        "Questo riguarda BGP e il livello rete.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Digest, non cifratura.",
      "Hash significa impronta: serve a riassumere e controllare, non a nascondere e poi recuperare il contenuto.",
      "Hash = sigillo breve del contenuto.",
      "Perché una funzione hash non dovrebbe essere facilmente invertibile?",
    ),
  },
  {
    id: "security-070",
    category: "Sicurezza",
    topic: "hash",
    difficulty: "media",
    question:
      "Che cosa significa resistenza alle collisioni per una funzione hash crittografica?",
    options: [
      "È difficile trovare due input diversi che producano lo stesso digest",
      "È impossibile che due input diversi producano lo stesso digest",
      "Il digest cambia solo se cambia la chiave privata",
      "L’algoritmo usa sempre due chiavi pubbliche indipendenti",
    ],
    correctAnswer:
      "È difficile trovare due input diversi che producano lo stesso digest",
    explanation:
      "Poiché lo spazio degli input è enorme e il digest ha dimensione fissa, collisioni teoriche esistono necessariamente. La proprietà richiesta è che trovarle in pratica sia computazionalmente infeasible. È una caratteristica essenziale per la solidità di firme digitali, certificati e sistemi di integrità.",
    whyOthersAreWrong: {
      "È impossibile che due input diversi producano lo stesso digest":
        "Matematicamente, con output finito e input arbitrari, qualche collisione deve esistere.",
      "Il digest cambia solo se cambia la chiave privata":
        "Le funzioni hash classiche non dipendono da una chiave privata.",
      "L’algoritmo usa sempre due chiavi pubbliche indipendenti":
        "Le chiavi pubbliche non definiscono la collision resistance di un hash.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Tre proprietà classiche: preimage, second preimage, collision resistance.",
      "Collision resistance non vuol dire collisioni impossibili, ma collisioni praticamente ingestibili da trovare.",
      "Possibili in teoria, impraticabili in pratica.",
      "Perché una collisione trovabile facilmente sarebbe pericolosa in una firma digitale?",
    ),
  },
  {
    id: "security-071",
    category: "Sicurezza",
    topic: "HMAC",
    difficulty: "media",
    question:
      "Che cosa aggiunge un HMAC rispetto a un semplice hash del messaggio?",
    options: [
      "L’uso di una chiave segreta condivisa per rafforzare autenticità e integrità",
      "La possibilità di decifrare il digest originale",
      "La sostituzione del certificato X.509 del server",
      "Un indirizzo IP di fallback in caso di errore",
    ],
    correctAnswer:
      "L’uso di una chiave segreta condivisa per rafforzare autenticità e integrità",
    explanation:
      "Un hash semplice ti dice se il contenuto cambia, ma non dimostra chi lo abbia prodotto. L’HMAC combina il messaggio con una chiave segreta condivisa, così solo chi conosce quella chiave può generare correttamente il tag. Per questo è molto usato nei protocolli che vogliono integrità autenticata senza firme asimmetriche.",
    whyOthersAreWrong: {
      "La possibilità di decifrare il digest originale":
        "Un digest non si 'decifra': non è una cifratura reversibile.",
      "La sostituzione del certificato X.509 del server":
        "HMAC e certificati risolvono problemi diversi.",
      "Un indirizzo IP di fallback in caso di errore":
        "Non ha alcuna relazione con l’indirizzamento di rete.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Differenza tra integrità nuda e integrità autenticata.",
      "Hash da solo controlla alterazioni; HMAC controlla alterazioni e presunta provenienza da chi condivide la chiave.",
      "Hash + chiave = HMAC.",
      "Perché un attaccante che non conosce la chiave non può forgiare facilmente un HMAC valido?",
    ),
  },
  {
    id: "security-072",
    category: "Sicurezza",
    topic: "firma digitale",
    difficulty: "media",
    question:
      "Quale insieme di proprietà è associato più direttamente a una firma digitale ben verificata?",
    options: [
      "Integrità, autenticità dell’origine e supporto al non ripudio",
      "Disponibilità, anonimato e bilanciamento del carico",
      "Routing, frammentazione e controllo di flusso",
      "Assegnazione IP, risoluzione DNS e NAT",
    ],
    correctAnswer:
      "Integrità, autenticità dell’origine e supporto al non ripudio",
    explanation:
      "La firma digitale permette di verificare che il messaggio non sia stato alterato e che provenga da chi possiede la chiave privata corrispondente. In un contesto ben gestito, supporta anche il non ripudio perché il firmatario non dovrebbe poter negare con facilità di aver generato quella firma. Non è però uno strumento per rendere un servizio disponibile o anonimo.",
    whyOthersAreWrong: {
      "Disponibilità, anonimato e bilanciamento del carico":
        "Queste non sono le finalità tipiche della firma digitale.",
      "Routing, frammentazione e controllo di flusso":
        "Sono concetti di rete e trasporto, non di crittografia applicata.",
      "Assegnazione IP, risoluzione DNS e NAT":
        "Appartengono all’amministrazione di rete, non alla firma digitale.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Cosa prova davvero una firma digitale.",
      "Firma = integrità del contenuto + prova crittografica legata al titolare della chiave privata.",
      "Se il contenuto cambia, la firma salta.",
      "Perché firmare direttamente un hash del documento è più pratico che firmare l’intero file byte per byte?",
    ),
  },
  {
    id: "security-073",
    category: "Sicurezza",
    topic: "certificati e PKI",
    difficulty: "media",
    question:
      "Che cosa attesta un certificato digitale X.509 in una PKI classica?",
    options: [
      "L’associazione tra un’identità e una chiave pubblica firmata da una CA fidata",
      "La password in chiaro del server autenticato",
      "Il MAC address fisico del browser dell’utente",
      "La dimensione della finestra TCP consigliata per la sessione",
    ],
    correctAnswer:
      "L’associazione tra un’identità e una chiave pubblica firmata da una CA fidata",
    explanation:
      "Il certificato contiene o riferisce una chiave pubblica e la lega a un’identità o a un nome tramite la firma della Certification Authority. Il client non si fida del certificato 'da solo', ma del fatto che la firma della CA sia verificabile nella catena di fiducia. Questo è il cuore della PKI usata sul Web.",
    whyOthersAreWrong: {
      "La password in chiaro del server autenticato":
        "Un certificato non deve contenere segreti del server.",
      "Il MAC address fisico del browser dell’utente":
        "Il MAC dell’utente non è lo scopo del certificato X.509.",
      "La dimensione della finestra TCP consigliata per la sessione":
        "La finestra TCP è un parametro di trasporto, non un contenuto PKI.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Che cosa stai davvero controllando quando guardi un certificato.",
      "Un certificato non dice 'fidati di me' da solo: dice 'questa chiave pubblica è stata legata a questa identità da una CA che conosci'.",
      "Certificato = carta d’identità della chiave pubblica.",
      "Perché verificare solo il certificato senza verificarne la catena non basta?",
    ),
  },
  {
    id: "security-074",
    category: "Sicurezza",
    topic: "certificati e PKI",
    difficulty: "media",
    question:
      "Qual è il ruolo principale di una Certification Authority nella PKI?",
    options: [
      "Firmare certificati che legano una chiave pubblica a un’identità",
      "Distribuire automaticamente indirizzi IP ai client interni",
      "Instradare i pacchetti crittografati tra sistemi autonomi",
      "Memorizzare le password di tutti gli utenti in chiaro",
    ],
    correctAnswer:
      "Firmare certificati che legano una chiave pubblica a un’identità",
    explanation:
      "La CA è un soggetto fidato che verifica certe informazioni e poi firma un certificato. La sua firma consente ai client di accettare la relazione tra nome e chiave pubblica, purché la CA o la catena relativa sia nella trust store. È il meccanismo di base dell’autenticazione dei server HTTPS.",
    whyOthersAreWrong: {
      "Distribuire automaticamente indirizzi IP ai client interni":
        "Questa è funzione del DHCP, non della CA.",
      "Instradare i pacchetti crittografati tra sistemi autonomi":
        "La CA non è un router né un protocollo di routing.",
      "Memorizzare le password di tutti gli utenti in chiaro":
        "Sarebbe una pessima pratica e non descrive il ruolo di una CA.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Perché esiste un terzo soggetto fidato nel modello PKI.",
      "Il browser deve potersi fidare della chiave pubblica del server: la CA firma proprio questa associazione.",
      "La CA presta fiducia alla chiave pubblica del server.",
      "Cosa succede se un certificato è valido formalmente ma è firmato da una CA non presente nella trust store del client?",
    ),
  },
  {
    id: "security-075",
    category: "Sicurezza",
    topic: "HTTPS/TLS",
    difficulty: "media",
    question:
      "Nel modello classico HTTPS, in quale fase il client verifica l’identità del server?",
    options: [
      "Durante il TLS handshake, analizzando il certificato e la relativa catena",
      "Dopo aver già scaricato tutto il contenuto applicativo in chiaro",
      "Durante il DHCP discover iniziale",
      "Nel momento in cui il router decrementa il TTL",
    ],
    correctAnswer:
      "Durante il TLS handshake, analizzando il certificato e la relativa catena",
    explanation:
      "La verifica dell’identità del server avviene prima di fidarsi del canale protetto, non alla fine. Il client controlla certificato, catena di certificazione, nome del server, validità temporale e altre condizioni. Solo così può evitare di cifrare i dati verso un impostore.",
    whyOthersAreWrong: {
      "Dopo aver già scaricato tutto il contenuto applicativo in chiaro":
        "Sarebbe troppo tardi: il danno sarebbe già fatto.",
      "Durante il DHCP discover iniziale":
        "DHCP non autentica il server web remoto.",
      "Nel momento in cui il router decrementa il TTL":
        "Il TTL è del livello rete e non autentica l’identità del server.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Sequenza logica del TLS handshake.",
      "Prima si negozia e si verifica la controparte, poi si accetta di usare il canale per i dati applicativi.",
      "Se non verifichi il certificato, stai cifrando forse con il nemico.",
      "Perché il controllo del nome host nel certificato è fondamentale quanto la firma della CA?",
    ),
  },
  {
    id: "security-076",
    category: "Sicurezza",
    topic: "HTTPS/TLS",
    difficulty: "media",
    question:
      "Dopo il completamento dell’handshake TLS, come viene protetto tipicamente il traffico dati della sessione?",
    options: [
      "Con cifratura simmetrica usando una chiave di sessione condivisa",
      "Con ARP request firmate digitalmente a ogni pacchetto",
      "Con cifratura asimmetrica completa di ogni byte della sessione",
      "Con broadcast dei certificati su tutta la LAN",
    ],
    correctAnswer:
      "Con cifratura simmetrica usando una chiave di sessione condivisa",
    explanation:
      "Una volta terminato l’handshake, client e server possiedono materiali chiave concordati o derivati in modo sicuro. Da lì in poi il canale usa algoritmi simmetrici per ragioni di efficienza e prestazioni. È la scelta naturale per proteggere grandi flussi di dati a basso overhead relativo.",
    whyOthersAreWrong: {
      "Con ARP request firmate digitalmente a ogni pacchetto":
        "ARP non è il meccanismo di protezione della sessione HTTPS.",
      "Con cifratura asimmetrica completa di ogni byte della sessione":
        "Sarebbe troppo costosa rispetto alla soluzione ibrida usata realmente.",
      "Con broadcast dei certificati su tutta la LAN":
        "I certificati non vengono diffusi così per proteggere i dati della sessione.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Perché TLS è ibrido.",
      "L’asimmetrica prepara il terreno; la simmetrica protegge davvero il grosso del traffico.",
      "Handshake per la fiducia, session key per il lavoro quotidiano.",
      "Quale vantaggio pratico ottieni passando a una chiave di sessione simmetrica dopo l’handshake?",
    ),
  },
  {
    id: "security-077",
    category: "Sicurezza",
    topic: "autenticazione",
    difficulty: "facile",
    question:
      "Quale delle seguenti è una corretta classificazione dei fattori di autenticazione?",
    options: [
      "Qualcosa che sai, qualcosa che hai, qualcosa che sei",
      "Qualcosa che instradi, qualcosa che firmi, qualcosa che NATti",
      "Qualcosa che trasmetti, qualcosa che subnetti, qualcosa che propaghi",
      "Qualcosa che broadcasti, qualcosa che switchi, qualcosa che routi",
    ],
    correctAnswer: "Qualcosa che sai, qualcosa che hai, qualcosa che sei",
    explanation:
      "La classificazione classica parla di conoscenza, possesso e inerenza. Una password è qualcosa che sai, un token o smartphone è qualcosa che hai, una biometria è qualcosa che sei. La multi-factor authentication combina categorie diverse per alzare la sicurezza.",
    whyOthersAreWrong: {
      "Qualcosa che instradi, qualcosa che firmi, qualcosa che NATti":
        "Sono verbi o concetti di rete, non fattori di autenticazione.",
      "Qualcosa che trasmetti, qualcosa che subnetti, qualcosa che propaghi":
        "Non rappresentano le categorie riconosciute di autenticazione.",
      "Qualcosa che broadcasti, qualcosa che switchi, qualcosa che routi":
        "Anche questi sono concetti di rete e non fattori identitari.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Fondamenti dell’autenticazione a più fattori.",
      "Aggiungere due codici dello stesso tipo non vale come usare due fattori diversi.",
      "Due password sono ancora 'qualcosa che sai'.",
      "Perché password + OTP sul telefono è più robusto di due password statiche?",
    ),
  },
  {
    id: "security-078",
    category: "Sicurezza",
    topic: "Kerberos",
    difficulty: "media",
    question:
      "Qual è il ruolo del Ticket Granting Ticket (TGT) in Kerberos?",
    options: [
      "Permettere all’utente di richiedere ticket di servizio senza reinserire ogni volta la password",
      "Cifrare tutto il traffico IP della LAN come farebbe IPsec",
      "Sostituire definitivamente i certificati digitali X.509",
      "Assegnare porte TCP ai servizi autenticati",
    ],
    correctAnswer:
      "Permettere all’utente di richiedere ticket di servizio senza reinserire ogni volta la password",
    explanation:
      "Kerberos separa l’autenticazione iniziale dall’accesso ai singoli servizi. Dopo aver ottenuto il TGT dall’Authentication Server, il client può presentarlo al Ticket Granting Server per ricevere ticket specifici per i vari servizi. Questo abilita il single sign-on all’interno del dominio Kerberos.",
    whyOthersAreWrong: {
      "Cifrare tutto il traffico IP della LAN come farebbe IPsec":
        "Kerberos è un sistema di autenticazione e ticketing, non un protocollo IP di tunnel.",
      "Sostituire definitivamente i certificati digitali X.509":
        "Kerberos e PKI risolvono problemi in modi diversi e possono coesistere.",
      "Assegnare porte TCP ai servizi autenticati":
        "Le porte non sono assegnate dal TGT.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Flusso base di Kerberos: AS, TGS, service ticket.",
      "Il TGT è come un lasciapassare iniziale che ti evita di riscrivere la password per ogni servizio interno.",
      "TGT = biglietto per ottenere altri biglietti.",
      "Che differenza c’è tra TGT e service ticket in Kerberos?",
    ),
  },
  {
    id: "security-079",
    category: "Sicurezza",
    topic: "VPN",
    difficulty: "facile",
    question:
      "Qual è lo scopo principale di una VPN?",
    options: [
      "Creare un canale logico protetto sopra una rete non fidata",
      "Sostituire completamente il DNS in tutte le comunicazioni",
      "Ridurre a zero la latenza di Internet",
      "Eliminare la necessità di autenticare gli utenti remoti",
    ],
    correctAnswer: "Creare un canale logico protetto sopra una rete non fidata",
    explanation:
      "Una VPN incapsula e protegge il traffico in modo che due estremità possano comunicare come se fossero collegate da un canale privato, pur usando Internet o altre reti pubbliche. A seconda della tecnologia può offrire cifratura, autenticazione e integrità. Non rende la rete magicamente più veloce né sostituisce tutti gli altri servizi.",
    whyOthersAreWrong: {
      "Sostituire completamente il DNS in tutte le comunicazioni":
        "La VPN può trasportare query DNS, ma non sostituisce il sistema di naming.",
      "Ridurre a zero la latenza di Internet":
        "Anzi, spesso aggiunge overhead e un percorso logico ulteriore.",
      "Eliminare la necessità di autenticare gli utenti remoti":
        "Le VPN sicure richiedono autenticazione forte proprio perché aprono accesso remoto.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "VPN come tunnel logico sicuro.",
      "La VPN non rende pubblica la rete privata: la estende in modo protetto sopra una rete esterna.",
      "VPN = tunnel, non teletrasporto.",
      "Perché una VPN aziendale richiede spesso anche autenticazione utente o dispositivo?",
    ),
  },
  {
    id: "security-080",
    category: "Sicurezza",
    topic: "IPsec",
    difficulty: "media",
    question:
      "Quale componente di IPsec fornisce tipicamente confidenzialità del payload attraverso cifratura?",
    options: ["ESP", "AH", "ARP", "BGP"],
    correctAnswer: "ESP",
    explanation:
      "ESP, Encapsulating Security Payload, è il meccanismo IPsec tipicamente associato alla cifratura dei dati e alla protezione di integrità/autenticità a seconda della configurazione. AH, invece, è legato soprattutto ad autenticazione e integrità dell’header/payload senza fornire cifratura del contenuto. Questa distinzione è classica da esame.",
    whyOthersAreWrong: {
      AH: "AH può proteggere integrità e autenticità, ma non offre confidenzialità del payload tramite cifratura.",
      ARP: "ARP non appartiene alla suite IPsec.",
      BGP: "BGP è routing interdominio, non protezione IP end-to-end.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Differenza funzionale tra ESP e AH.",
      "Se vuoi cifrare davvero il contenuto, pensi a ESP; AH non basta per la confidenzialità.",
      "ESP nasconde, AH autentica.",
      "Perché molte implementazioni moderne di IPsec preferiscono ESP anche quando l’obiettivo non è solo la cifratura?",
    ),
  },
  {
    id: "security-081",
    category: "Sicurezza",
    topic: "IPsec",
    difficulty: "media",
    question:
      "Che cosa caratterizza la modalità tunnel di IPsec rispetto alla modalità transport?",
    options: [
      "Viene incapsulato e protetto un intero pacchetto IP dentro un nuovo pacchetto IP",
      "Protegge solo il payload applicativo HTTP e mai il pacchetto IP",
      "Funziona solo su rete locale Ethernet e non su Internet",
      "Richiede obbligatoriamente l’uso di DNSSEC",
    ],
    correctAnswer:
      "Viene incapsulato e protetto un intero pacchetto IP dentro un nuovo pacchetto IP",
    explanation:
      "In modalità tunnel l’intero pacchetto IP originario diventa payload di un nuovo pacchetto IPsec, soluzione molto utile tra gateway o per VPN site-to-site. In modalità transport, invece, si protegge il payload del pacchetto originale lasciando più visibile l’header IP iniziale. La differenza è importante per capire cosa resta esposto e dove si applica la protezione.",
    whyOthersAreWrong: {
      "Protegge solo il payload applicativo HTTP e mai il pacchetto IP":
        "IPsec non è limitato a HTTP e lavora a livello IP.",
      "Funziona solo su rete locale Ethernet e non su Internet":
        "IPsec è pensato proprio per proteggere comunicazioni IP anche su reti non fidate.",
      "Richiede obbligatoriamente l’uso di DNSSEC":
        "DNSSEC è un altro sistema, indipendente da IPsec.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Transport mode vs tunnel mode.",
      "Tunnel = impacchetti un intero IP dentro un altro; transport = proteggi soprattutto il contenuto del pacchetto originale.",
      "Tunnel mode = busta dentro un’altra busta.",
      "Perché la modalità tunnel è naturale per una VPN tra due gateway aziendali?",
    ),
  },
  {
    id: "security-082",
    category: "Sicurezza",
    topic: "attacchi principali",
    difficulty: "media",
    question:
      "Quale meccanismo aiuta a mitigare gli attacchi di replay nei protocolli sicuri?",
    options: [
      "L’uso di nonce, sequence number o timestamp verificabili",
      "La semplice presenza di un indirizzo MAC univoco",
      "L’uso esclusivo di HTTP senza TLS",
      "L’assegnazione dinamica dell’indirizzo IP tramite DHCP",
    ],
    correctAnswer: "L’uso di nonce, sequence number o timestamp verificabili",
    explanation:
      "Un replay ripresenta messaggi validi ma vecchi, quindi serve un modo per capire che un messaggio è fresco e non duplicato. Nonce, numeri di sequenza o timestamp consentono proprio questo controllo. Senza questi meccanismi, autenticità e integrità da sole potrebbero non bastare a distinguere un messaggio nuovo da uno riciclato.",
    whyOthersAreWrong: {
      "La semplice presenza di un indirizzo MAC univoco":
        "Il MAC non dimostra che un messaggio non sia stato ritrasmesso malevolmente.",
      "L’uso esclusivo di HTTP senza TLS":
        "HTTP in chiaro non mitiga affatto il replay, semmai espone di più il traffico.",
      "L’assegnazione dinamica dell’indirizzo IP tramite DHCP":
        "DHCP non è una contromisura contro il replay crittografico.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Perché autenticità non implica automaticamente freschezza.",
      "Un messaggio può essere autentico ma vecchio: il replay sfrutta proprio questo.",
      "Serve un marcatore di novità, non solo una firma valida.",
      "Perché firmare un messaggio senza includere un nonce può essere insufficiente contro un replay?",
    ),
  },
  {
    id: "security-083",
    category: "Sicurezza",
    topic: "attacchi principali",
    difficulty: "facile",
    question:
      "Quale descrizione corrisponde meglio a un attacco di phishing?",
    options: [
      "Un tentativo di ingannare l’utente per farsi consegnare credenziali o dati sensibili fingendo un’identità affidabile",
      "Una tecnica di routing link-state per bilanciare i cammini minimi",
      "Un metodo per comprimere in modo sicuro i certificati digitali",
      "Un algoritmo di controllo di congestione del TCP",
    ],
    correctAnswer:
      "Un tentativo di ingannare l’utente per farsi consegnare credenziali o dati sensibili fingendo un’identità affidabile",
    explanation:
      "Il phishing è soprattutto un attacco sociale: l’obiettivo è convincere la vittima a collaborare spontaneamente, per esempio inserendo password su un sito falso o aprendo allegati malevoli. Non è un problema di solo algoritmo crittografico: spesso sfrutta fiducia, fretta o distrazione dell’utente. Per questo formazione e verifica del contesto restano essenziali.",
    whyOthersAreWrong: {
      "Una tecnica di routing link-state per bilanciare i cammini minimi":
        "Non ha nulla a che vedere con il phishing.",
      "Un metodo per comprimere in modo sicuro i certificati digitali":
        "Il phishing non è una tecnica di compressione né un formato PKI.",
      "Un algoritmo di controllo di congestione del TCP":
        "Il controllo di congestione è un problema di trasporto, non di ingegneria sociale.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Attacco tecnico vs attacco sociale.",
      "Il phishing sfrutta più spesso il comportamento umano che una falla matematica nell’algoritmo.",
      "Se ti convincono a regalare la password, la crittografia non ti salva.",
      "Quali segnali in un’email o in una pagina web dovrebbero farti sospettare phishing?",
    ),
  },
  {
    id: "security-084",
    category: "Sicurezza",
    topic: "attacchi principali",
    difficulty: "media",
    question:
      "Perché si usa il salt nell’archiviazione delle password hashate?",
    options: [
      "Per rendere inefficaci o molto meno convenienti attacchi basati su tabelle precomputate e hash uguali tra utenti",
      "Per permettere di recuperare la password originale dal digest quando serve",
      "Per sostituire la necessità di usare una funzione hash robusta",
      "Per abbassare il costo computazionale della verifica delle password",
    ],
    correctAnswer:
      "Per rendere inefficaci o molto meno convenienti attacchi basati su tabelle precomputate e hash uguali tra utenti",
    explanation:
      "Il salt introduce casualità per utente, così due password identiche non producono lo stesso hash archiviato. Questo ostacola rainbow table e confronti immediati su larga scala. Non rende le password invulnerabili, ma alza moltissimo il costo degli attacchi offline se combinato con funzioni lente e robuste.",
    whyOthersAreWrong: {
      "Per permettere di recuperare la password originale dal digest quando serve":
        "Un archivio di password ben progettato non deve permettere il recupero in chiaro.",
      "Per sostituire la necessità di usare una funzione hash robusta":
        "Il salt aiuta, ma non sostituisce algoritmi adeguati e parametrizzati correttamente.",
      "Per abbassare il costo computazionale della verifica delle password":
        "Lo scopo non è rendere più facile la verifica, ma più costoso l’attacco.",
    },
    source: "note_crittografia_2025.pdf",
    studyGuide: guide(
      "Perché hashare le password non basta se lo fai male.",
      "Il salt personalizza ogni hash e rompe molte scorciatoie dell’attaccante basate su precomputazione.",
      "Stessa password, hash diversi grazie al salt.",
      "Perché avere due utenti con lo stesso hash password è un problema informativo per l’attaccante?",
    ),
  },
];

const baseQuestionAudits: Record<string, QuestionAuditOverride> = {
  "internet-004": {
    question: "In una rete IP, quale apparato prende nativamente decisioni di inoltro tra reti diverse guardando il prefisso di destinazione?",
  },
  "internet-012": {
    question: "In un lookup DNS standard, quale protocollo di trasporto usa tipicamente il client per la richiesta iniziale?",
  },
  "internet-014": {
    question: "Quale protocollo applicativo usa tipicamente un client per sottomettere un messaggio al proprio mail server?",
  },
  "internet-017": {
    question: "Nel multiplexing e demultiplexing del livello di trasporto, quale informazione identifica il processo destinatario sull'host di arrivo?",
  },
  "internet-043": {
    question: "Quale protocollo di configurazione assegna dinamicamente un indirizzo IP e altri parametri di rete a un host appena collegato alla LAN?",
  },
  "internet-048": {
    question: "Quale campo identifica univocamente un'interfaccia Ethernet a livello di collegamento dati?",
  },
  "internet-050": {
    question: "In una LAN IPv4, quale funzione svolge il protocollo ARP quando l'host conosce già l'indirizzo IP di destinazione locale?",
    options: ["Risolvere l’indirizzo MAC corrispondente a un indirizzo IP locale già noto", "Assegnare dinamicamente un indirizzo IP libero all’host che si collega alla LAN", "Verificare se l’indirizzo IP di destinazione appartiene a una subnet remota", "Aggiornare la tabella di routing con il costo minimo verso ogni destinazione"],
    correctAnswer: "Risolvere l’indirizzo MAC corrispondente a un indirizzo IP locale già noto",
    whyOthersAreWrong: {
      "Assegnare dinamicamente un indirizzo IP libero all’host che si collega alla LAN": "L’assegnazione dinamica di un indirizzo IP è compito del DHCP, non di ARP, che risolve IP noti in indirizzi MAC.",
      "Verificare se l’indirizzo IP di destinazione appartiene a una subnet remota": "Il confronto tra subnet mask e IP di destinazione per capire se la rete è locale o remota è un calcolo fatto dall’host stesso, non da ARP.",
      "Aggiornare la tabella di routing con il costo minimo verso ogni destinazione": "L’aggiornamento delle tabelle di routing è compito dei protocolli di routing (es. distance vector o link-state), non di ARP.",
    },
  },
  "internet-059": {
    question: "Nel collegamento d'accesso, quale funzione appartiene propriamente al modem e non al routing IP?",
    options: ["Modulare il segnale elettrico o ottico per adattarlo al mezzo fisico d’accesso", "Instradare i pacchetti IP tra reti diverse in base alla tabella di routing", "Inoltrare i frame Ethernet tra le porte in base agli indirizzi MAC appresi", "Gestire l’associazione wireless e l’autenticazione dei client radio collegati"],
    correctAnswer: "Modulare il segnale elettrico o ottico per adattarlo al mezzo fisico d’accesso",
    whyOthersAreWrong: {
      "Instradare i pacchetti IP tra reti diverse in base alla tabella di routing": "L’instradamento dei pacchetti tra reti è compito del router, non del modem, che si limita ad adattare il segnale sul mezzo fisico.",
      "Inoltrare i frame Ethernet tra le porte in base agli indirizzi MAC appresi": "L’inoltro dei frame in base al MAC è una funzione dello switch, non del modem, che opera sul segnale fisico del collegamento d’accesso.",
      "Gestire l’associazione wireless e l’autenticazione dei client radio collegati": "La gestione dell’associazione e autenticazione radio è tipica dell’access point Wi-Fi, non del modem del collegamento d’accesso.",
    },
  },
  "security-062": {
    question: "Quale proprietà definisce correttamente la crittografia simmetrica in uno scenario reale?",
    options: ["La medesima chiave segreta serve sia per cifrare sia per decifrare il messaggio", "Si usa sempre una coppia distinta di chiavi, una pubblica e una privata", "La chiave usata per cifrare viene rigenerata automaticamente ad ogni bit trasmesso", "Il destinatario non deve mai conoscere la chiave usata dal mittente"],
    correctAnswer: "La medesima chiave segreta serve sia per cifrare sia per decifrare il messaggio",
    whyOthersAreWrong: {
      "Si usa sempre una coppia distinta di chiavi, una pubblica e una privata": "L’uso di una coppia di chiavi pubblica/privata distinte è caratteristico della crittografia asimmetrica, non di quella simmetrica.",
      "La chiave usata per cifrare viene rigenerata automaticamente ad ogni bit trasmesso": "La chiave in un cifrario simmetrico non si rigenera automaticamente per ogni bit: resta la stessa per l’intera operazione, salvo eventuali chiavi di sessione stabilite a priori.",
      "Il destinatario non deve mai conoscere la chiave usata dal mittente": "Nella crittografia simmetrica il destinatario deve conoscere esattamente la stessa chiave segreta usata dal mittente per poter decifrare.",
    },
  },
  "security-064": {
    question: "Quale affermazione coglie il tratto distintivo della crittografia asimmetrica rispetto a quella simmetrica?",
  },
  "security-069": {
    question: "Qual è lo scopo principale di una funzione hash crittografica quando viene usata per verificare l'integrità dei dati?",
    options: ["Produrre un digest compatto e a lunghezza fissa per verificare l’integrità dei dati", "Cifrare in modo reversibile un messaggio utilizzando una chiave segreta condivisa", "Comprimere senza perdita i dati per ridurne le dimensioni di archiviazione", "Generare una coppia di chiavi asimmetriche da usare per la comunicazione"],
    correctAnswer: "Produrre un digest compatto e a lunghezza fissa per verificare l’integrità dei dati",
    whyOthersAreWrong: {
      "Cifrare in modo reversibile un messaggio utilizzando una chiave segreta condivisa": "Una funzione hash non è una cifratura reversibile e in genere non richiede alcuna chiave: il digest non può essere invertito per riottenere il messaggio.",
      "Comprimere senza perdita i dati per ridurne le dimensioni di archiviazione": "L’obiettivo dell’hash crittografico non è ridurre la dimensione dei dati per l’archiviazione, ma produrre un’impronta che ne verifichi l’integrità.",
      "Generare una coppia di chiavi asimmetriche da usare per la comunicazione": "La generazione di coppie di chiavi asimmetriche appartiene alla crittografia a chiave pubblica, non alle funzioni hash.",
    },
  },
  "security-079": {
    question: "Quale funzione svolge principalmente una VPN in un contesto di accesso remoto o collegamento site-to-site?",
  },
  "internet-009": {
    options: ["HTTPS incapsula HTTP sopra TLS aggiungendo confidenzialità, integrità e autenticazione del server", "HTTPS usa semplicemente una porta diversa (443) senza introdurre alcun meccanismo crittografico aggiuntivo", "HTTPS comprime i messaggi HTTP per ridurre il tempo di trasferimento, senza toccare la sicurezza", "HTTPS richiede che il client, non il server, presenti un certificato digitale per instaurare la connessione"],
    correctAnswer: "HTTPS incapsula HTTP sopra TLS aggiungendo confidenzialità, integrità e autenticazione del server",
    whyOthersAreWrong: {
      "HTTPS usa semplicemente una porta diversa (443) senza introdurre alcun meccanismo crittografico aggiuntivo": "In realtà la porta 443 è solo una convenzione: la sicurezza di HTTPS deriva dal livello TLS sottostante, non dal numero di porta.",
      "HTTPS comprime i messaggi HTTP per ridurre il tempo di trasferimento, senza toccare la sicurezza": "HTTPS non introduce compressione: il suo scopo è cifrare e autenticare la comunicazione, non ottimizzare la dimensione dei dati.",
      "HTTPS richiede che il client, non il server, presenti un certificato digitale per instaurare la connessione": "Nel modello classico è il server a presentare il certificato durante l’handshake; l’autenticazione del client è opzionale e non la norma.",
    },
  },
  "internet-047": {
    options: ["Il CRC/FCS, usato per rilevare errori di trasmissione nel frame", "Il preambolo, usato per la sincronizzazione bit del ricevitore", "L’indirizzo MAC di destinazione, ripetuto per ridondanza", "Il numero di sequenza, usato per riordinare i frame ricevuti"],
    correctAnswer: "Il CRC/FCS, usato per rilevare errori di trasmissione nel frame",
    whyOthersAreWrong: {
      "Il preambolo, usato per la sincronizzazione bit del ricevitore": "Il preambolo serve a sincronizzare il ricevitore con il clock del trasmettitore, ma si trova all’inizio del frame, non nel trailer.",
      "L’indirizzo MAC di destinazione, ripetuto per ridondanza": "L’indirizzo MAC di destinazione compare una sola volta, nell’header del frame, non ripetuto nel trailer.",
      "Il numero di sequenza, usato per riordinare i frame ricevuti": "Ethernet non gestisce un numero di sequenza a livello di frame: il riordino è compito eventualmente dei livelli superiori.",
    },
  },
  "internet-041": {
    options: ["Far condividere a più host privati un solo IP pubblico, distinguendo i flussi tramite le porte", "Assegnare a ogni host della LAN un indirizzo IP pubblico differente in modo dinamico", "Tradurre gli indirizzi MAC dei client della LAN in altrettanti indirizzi IP pubblici instradabili", "Mantenere fissa la corrispondenza tra porta privata e porta pubblica per ogni nuova connessione"],
    correctAnswer: "Far condividere a più host privati un solo IP pubblico, distinguendo i flussi tramite le porte",
    whyOthersAreWrong: {
      "Assegnare a ogni host della LAN un indirizzo IP pubblico differente in modo dinamico": "È l’opposto del NAT overload: qui un solo IP pubblico è condiviso da più host, non assegnato individualmente a ciascuno.",
      "Tradurre gli indirizzi MAC dei client della LAN in altrettanti indirizzi IP pubblici instradabili": "NAT traduce indirizzi IP privati in un IP pubblico (livello 3), non indirizzi MAC (livello 2) in indirizzi IP.",
      "Mantenere fissa la corrispondenza tra porta privata e porta pubblica per ogni nuova connessione": "Nel NAT overload la corrispondenza porta privata/porta pubblica viene creata dinamicamente per ogni nuova connessione, non mantenuta fissa.",
    },
  },
  "internet-013": {
    options: ["Il record CNAME, che definisce un alias canonico per un nome host", "Il record MX, che indica il server di posta responsabile del dominio", "Il record NS, che indica i name server autoritativi della zona", "Il record PTR, usato per la risoluzione inversa da indirizzo IP a nome"],
    correctAnswer: "Il record CNAME, che definisce un alias canonico per un nome host",
    whyOthersAreWrong: {
      "Il record MX, che indica il server di posta responsabile del dominio": "MX indica il server di posta (mail exchanger) per il dominio, non un alias canonico per un host.",
      "Il record NS, che indica i name server autoritativi della zona": "NS elenca i name server autoritativi per la zona, non un alias per un nome host.",
      "Il record PTR, usato per la risoluzione inversa da indirizzo IP a nome": "PTR si usa per la risoluzione inversa (da IP a nome), non per definire un alias canonico.",
    },
  },
  "internet-020": {
    options: ["Numeri di sequenza, ACK, timer di ritrasmissione e checksum end-to-end", "Slow start, congestion avoidance, fast retransmit e fast recovery", "Three-way handshake, bit FIN/RST e opzione di window scaling negoziata", "Algoritmo di Nagle, ACK ritardati, keep-alive e puntatore urgente"],
    correctAnswer: "Numeri di sequenza, ACK, timer di ritrasmissione e checksum end-to-end",
    whyOthersAreWrong: {
      "Slow start, congestion avoidance, fast retransmit e fast recovery": "Questi sono meccanismi di controllo della congestione, non gli strumenti che garantiscono la consegna affidabile dei dati.",
      "Three-way handshake, bit FIN/RST e opzione di window scaling negoziata": "Handshake, flag di controllo e window scaling servono a gestire la connessione e la negoziazione, non a garantire l’affidabilità della consegna dati.",
      "Algoritmo di Nagle, ACK ritardati, keep-alive e puntatore urgente": "Sono ottimizzazioni e funzionalità accessorie del TCP, non i meccanismi fondamentali che assicurano affidabilità.",
    },
  },
  "internet-037": {
    options: ["Il forwarding decide l’interfaccia d’uscita per un singolo pacchetto; il routing costruisce le informazioni per quella decisione", "Il forwarding calcola i percorsi con algoritmi come Dijkstra; il routing applica solo la tabella già calcolata", "Il forwarding riguarda esclusivamente i pacchetti IPv6, mentre il routing riguarda esclusivamente i pacchetti IPv4", "Il forwarding avviene tra sistemi autonomi diversi, mentre il routing avviene solo all’interno dello stesso AS"],
    correctAnswer: "Il forwarding decide l’interfaccia d’uscita per un singolo pacchetto; il routing costruisce le informazioni per quella decisione",
    whyOthersAreWrong: {
      "Il forwarding calcola i percorsi con algoritmi come Dijkstra; il routing applica solo la tabella già calcolata": "È il contrario: gli algoritmi di routing (come quelli link-state) calcolano i percorsi, mentre il forwarding si limita ad applicare la tabella già costruita a ciascun pacchetto.",
      "Il forwarding riguarda esclusivamente i pacchetti IPv6, mentre il routing riguarda esclusivamente i pacchetti IPv4": "La distinzione forwarding/routing non dipende dalla versione del protocollo IP: entrambe le funzioni esistono sia in IPv4 sia in IPv6.",
      "Il forwarding avviene tra sistemi autonomi diversi, mentre il routing avviene solo all’interno dello stesso AS": "Il forwarding avviene a ogni hop, sia dentro sia tra sistemi autonomi; non è limitato all’attraversamento dei confini tra AS.",
    },
  },
  "internet-060": {
    options: ["Permettere al server di mantenere uno stato applicativo tra richieste HTTP altrimenti stateless", "Ridurre il numero di round trip TCP necessari per stabilire ogni nuova connessione HTTP", "Comprimere il corpo delle risposte HTTP per velocizzare il trasferimento dei dati", "Garantire che ogni richiesta GET venga automaticamente messa in cache dal proxy HTTP"],
    correctAnswer: "Permettere al server di mantenere uno stato applicativo tra richieste HTTP altrimenti stateless",
    whyOthersAreWrong: {
      "Ridurre il numero di round trip TCP necessari per stabilire ogni nuova connessione HTTP": "I cookie non intervengono sull’instaurazione della connessione TCP: il loro scopo è mantenere lo stato applicativo tra richieste.",
      "Comprimere il corpo delle risposte HTTP per velocizzare il trasferimento dei dati": "La compressione del corpo della risposta è gestita da meccanismi HTTP separati (es. Content-Encoding), non dai cookie.",
      "Garantire che ogni richiesta GET venga automaticamente messa in cache dal proxy HTTP": "Il caching delle risposte è un meccanismo distinto (header di cache-control, GET condizionale), non una funzione dei cookie.",
    },
  },
  "internet-010": {
    options: ["Per verificare se la copia in cache è ancora valida, evitando di riscaricare l’intero oggetto", "Per forzare il server a restituire sempre una risposta 404 se l’oggetto non esiste più", "Per negoziare automaticamente la versione del protocollo HTTP da usare nella connessione", "Per suddividere il download dell’oggetto in più richieste parallele al server"],
    correctAnswer: "Per verificare se la copia in cache è ancora valida, evitando di riscaricare l’intero oggetto",
    whyOthersAreWrong: {
      "Per forzare il server a restituire sempre una risposta 404 se l’oggetto non esiste più": "Il GET condizionale restituisce 304 Not Modified se la cache è valida, non uno stato di errore come 404.",
      "Per negoziare automaticamente la versione del protocollo HTTP da usare nella connessione": "La negoziazione della versione HTTP avviene in fase di connessione/handshake applicativo, non tramite il GET condizionale.",
      "Per suddividere il download dell’oggetto in più richieste parallele al server": "Il download parallelo a più richieste è una tecnica diversa (es. range request), non lo scopo del GET condizionale.",
    },
  },
  "internet-018": {
    options: ["La quaterna IP sorgente, porta sorgente, IP destinazione, porta destinazione", "La sola coppia di indirizzi IP sorgente e destinazione, senza le porte", "Il solo numero di sequenza iniziale (ISN) scelto durante l’handshake", "L’indirizzo MAC del client abbinato alla porta di ascolto del server"],
    correctAnswer: "La quaterna IP sorgente, porta sorgente, IP destinazione, porta destinazione",
    whyOthersAreWrong: {
      "La sola coppia di indirizzi IP sorgente e destinazione, senza le porte": "Gli indirizzi IP da soli non bastano: più connessioni tra la stessa coppia di host si distinguono solo aggiungendo le porte.",
      "Il solo numero di sequenza iniziale (ISN) scelto durante l’handshake": "Il numero di sequenza iniziale identifica il flusso di byte scambiato, non la socket in sé, che è definita dalla quaterna di indirizzi e porte.",
      "L’indirizzo MAC del client abbinato alla porta di ascolto del server": "Una socket TCP end-to-end è definita da indirizzi IP e porte, non da indirizzi MAC, che valgono solo localmente sul link.",
    },
  },
  "internet-015": {
    options: ["IMAP mantiene più stato sul server, favorendo la sincronizzazione tra più dispositivi", "POP3 replica automaticamente i messaggi su più server per garantire ridondanza", "IMAP utilizza il protocollo UDP per velocizzare il download iniziale della mailbox", "POP3 richiede sempre l’uso di TLS implicito sulla porta 995 per funzionare"],
    correctAnswer: "IMAP mantiene più stato sul server, favorendo la sincronizzazione tra più dispositivi",
    whyOthersAreWrong: {
      "POP3 replica automaticamente i messaggi su più server per garantire ridondanza": "POP3 non replica su più server: tipicamente scarica i messaggi su un singolo client, senza gestire ridondanza server-side.",
      "IMAP utilizza il protocollo UDP per velocizzare il download iniziale della mailbox": "IMAP, come POP3, si appoggia su TCP per garantire una consegna affidabile della sessione, non su UDP.",
      "POP3 richiede sempre l’uso di TLS implicito sulla porta 995 per funzionare": "TLS può essere usato con POP3 (es. porta 995) ma non è un requisito obbligatorio del protocollo di base.",
    },
  },
  "internet-036": {
    options: ["Inviare pacchetti con TTL crescente e osservare i messaggi ICMP time exceeded dei router", "Inviare richieste DNS ricorsive a ciascun router lungo il percorso verso la destinazione", "Misurare il round trip time completando un handshake TCP con ciascun hop intermedio", "Interrogare direttamente la tabella BGP di ogni router per ricostruire il percorso"],
    correctAnswer: "Inviare pacchetti con TTL crescente e osservare i messaggi ICMP time exceeded dei router",
    whyOthersAreWrong: {
      "Inviare richieste DNS ricorsive a ciascun router lungo il percorso verso la destinazione": "Traceroute non interroga il DNS per il percorso: sfrutta invece la scadenza del TTL per far generare messaggi ICMP dai router intermedi.",
      "Misurare il round trip time completando un handshake TCP con ciascun hop intermedio": "Traceroute non richiede un handshake TCP completo con ogni hop: si basa su pacchetti con TTL crescente e sulle risposte ICMP generate quando il TTL scade.",
      "Interrogare direttamente la tabella BGP di ogni router per ricostruire il percorso": "I router intermedi non espongono la propria tabella BGP a chi esegue il traceroute: il percorso emerge dai messaggi ICMP restituiti.",
    },
  },
  "internet-033": {
    options: ["Confronta la propria subnet mask con l’IP di destinazione per verificare se la rete coincide", "Interroga il server DHCP a ogni invio per sapere se il destinatario è nella LAN locale", "Controlla se il TTL residuo nel pacchetto di destinazione è ancora maggiore di zero", "Verifica se l’indirizzo MAC di destinazione inizia con lo stesso prefisso del proprio"],
    correctAnswer: "Confronta la propria subnet mask con l’IP di destinazione per verificare se la rete coincide",
    whyOthersAreWrong: {
      "Interroga il server DHCP a ogni invio per sapere se il destinatario è nella LAN locale": "Il DHCP assegna la configurazione IP una tantum all’avvio, non viene interrogato per ogni pacchetto da inviare.",
      "Controlla se il TTL residuo nel pacchetto di destinazione è ancora maggiore di zero": "Il TTL serve a limitare il numero di hop attraversati dal pacchetto, non a stabilire se la destinazione è locale o remota.",
      "Verifica se l’indirizzo MAC di destinazione inizia con lo stesso prefisso del proprio": "L’indirizzo MAC non ha alcun prefisso legato alla subnet IP: è la subnet mask applicata all’IP a determinare se la rete è locale.",
    },
  },
  "internet-029": {
    options: ["Servizio con gestione attiva della congestione end-to-end", "Servizio privo di connessione, senza fase di setup preliminare", "Servizio a consegna best effort, senza garanzie di qualità", "Servizio inaffidabile, senza garanzie di consegna dei pacchetti"],
    correctAnswer: "Servizio con gestione attiva della congestione end-to-end",
    whyOthersAreWrong: {
      "Servizio privo di connessione, senza fase di setup preliminare": "IP è effettivamente connectionless: non prevede una fase di apertura di connessione prima di inviare i datagrammi, quindi questa proprietà appartiene al servizio IP.",
      "Servizio a consegna best effort, senza garanzie di qualità": "IP è realmente un servizio best effort: la rete si limita a provare a consegnare i pacchetti, senza garanzie forti, quindi questa proprietà è propria di IP.",
      "Servizio inaffidabile, senza garanzie di consegna dei pacchetti": "IP è realmente inaffidabile: non garantisce consegna, ordine o assenza di duplicati, quindi anche questa proprietà appartiene al servizio IP.",
    },
  },
  "internet-023": {
    options: ["Permette ritrasmissioni selettive dei soli pacchetti effettivamente persi o corrotti", "Ritrasmette sempre l’intera finestra a partire dal primo pacchetto non riscontrato", "Usa una finestra di trasmissione di dimensione fissata a un solo pacchetto per volta", "Richiede che il ricevente scarti sempre i pacchetti fuori sequenza ricevuti in anticipo"],
    correctAnswer: "Permette ritrasmissioni selettive dei soli pacchetti effettivamente persi o corrotti",
    whyOthersAreWrong: {
      "Ritrasmette sempre l’intera finestra a partire dal primo pacchetto non riscontrato": "Questo è il comportamento di Go-Back-N, che ritrasmette l’intera finestra; Selective Repeat ritrasmette solo i singoli pacchetti persi.",
      "Usa una finestra di trasmissione di dimensione fissata a un solo pacchetto per volta": "Una finestra di un solo pacchetto per volta descrive lo stop-and-wait, non Selective Repeat, che usa una finestra scorrevole più ampia.",
      "Richiede che il ricevente scarti sempre i pacchetti fuori sequenza ricevuti in anticipo": "In Selective Repeat il ricevente bufferizza i pacchetti fuori sequenza correttamente ricevuti, non li scarta come avviene in Go-Back-N.",
    },
  },
  "internet-039": {
    options: ["Scambio iterativo di aggiornamenti tra router vicini in base al costo di ogni destinazione", "Diffusione dell’intera topologia di rete a tutti i router tramite flooding periodico", "Elezione di un router designato che calcola centralmente tutte le rotte della rete", "Scambio di certificati digitali tra i router per autenticare ogni rotta annunciata"],
    correctAnswer: "Scambio iterativo di aggiornamenti tra router vicini in base al costo di ogni destinazione",
    whyOthersAreWrong: {
      "Diffusione dell’intera topologia di rete a tutti i router tramite flooding periodico": "Il flooding dell’intera topologia a tutti i router è tipico dei protocolli link-state (es. OSPF), non del distance vector, che scambia solo informazioni con i vicini diretti.",
      "Elezione di un router designato che calcola centralmente tutte le rotte della rete": "Il distance vector è un algoritmo distribuito senza un router centrale che calcola tutte le rotte: ogni router calcola le proprie basandosi sugli scambi con i vicini.",
      "Scambio di certificati digitali tra i router per autenticare ogni rotta annunciata": "Il distance vector non prevede autenticazione tramite certificati digitali: si basa sullo scambio di vettori di costo tra router adiacenti.",
    },
  },
  "internet-046": {
    options: ["Framing dei dati e consegna hop-by-hop tra nodi adiacenti sullo stesso link", "Apertura e chiusura della connessione end-to-end tramite handshake a tre vie", "Controllo di flusso end-to-end basato sulla finestra ricevente annunciata", "Numerazione dei segmenti e ritrasmissione in caso di perdita end-to-end"],
    correctAnswer: "Framing dei dati e consegna hop-by-hop tra nodi adiacenti sullo stesso link",
    whyOthersAreWrong: {
      "Apertura e chiusura della connessione end-to-end tramite handshake a tre vie": "L’apertura e chiusura della connessione con handshake a tre vie è una funzione del TCP a livello di trasporto, non del livello di collegamento.",
      "Controllo di flusso end-to-end basato sulla finestra ricevente annunciata": "Il controllo di flusso basato sulla finestra ricevente è un meccanismo del livello di trasporto (TCP), non del livello di collegamento.",
      "Numerazione dei segmenti e ritrasmissione in caso di perdita end-to-end": "La numerazione dei segmenti e la ritrasmissione end-to-end sono compiti del livello di trasporto, non della consegna hop-by-hop del livello di collegamento.",
    },
  },
  "internet-003": {
    options: ["Il tempo necessario al segnale per attraversare fisicamente il mezzo trasmissivo", "Il tempo necessario per inserire tutti i bit del pacchetto sul collegamento in uscita", "Il tempo che il router impiega per elaborare l’header e decidere il next hop", "Il tempo medio che un pacchetto trascorre in coda in attesa di trasmissione"],
    correctAnswer: "Il tempo necessario al segnale per attraversare fisicamente il mezzo trasmissivo",
    whyOthersAreWrong: {
      "Il tempo necessario per inserire tutti i bit del pacchetto sul collegamento in uscita": "Questo descrive il ritardo di trasmissione (tempo per immettere i bit sul link), non il ritardo di propagazione del segnale sul mezzo.",
      "Il tempo che il router impiega per elaborare l’header e decidere il next hop": "Questo descrive il ritardo di elaborazione (processing delay) del router, non il tempo di propagazione del segnale.",
      "Il tempo medio che un pacchetto trascorre in coda in attesa di trasmissione": "Questo descrive il ritardo di accodamento (queuing delay), non il tempo di propagazione fisica del segnale.",
    },
  },
  "internet-007": {
    options: ["La capacità complessiva del sistema cresce aggiungendo peer che contribuiscono risorse", "Il sistema garantisce sempre latenza costante indipendentemente dal numero di peer", "Ogni peer richiede una connessione permanente e dedicata al server centrale", "La rete elimina completamente il bisogno di un meccanismo di indicizzazione dei contenuti"],
    correctAnswer: "La capacità complessiva del sistema cresce aggiungendo peer che contribuiscono risorse",
    whyOthersAreWrong: {
      "Il sistema garantisce sempre latenza costante indipendentemente dal numero di peer": "Anche nei sistemi P2P la latenza dipende da fattori come topologia, distanza tra i peer e congestione: non è garantita costante.",
      "Ogni peer richiede una connessione permanente e dedicata al server centrale": "Questo descrive proprio il modello client-server, l’opposto del P2P, dove i peer comunicano tra loro senza dipendere da un server centrale sempre connesso.",
      "La rete elimina completamente il bisogno di un meccanismo di indicizzazione dei contenuti": "Molti sistemi P2P necessitano comunque di un meccanismo di indicizzazione o ricerca dei contenuti (centralizzato o distribuito), che non scompare automaticamente.",
    },
  },
  "internet-001": {
    options: ["Un insieme di reti eterogenee interconnesse che comunicano tramite protocolli condivisi", "Un unico grande computer centrale distribuito fisicamente presso tutti gli ISP", "Una rete privata riservata ai soli provider per il routing interno tra loro", "Un insieme di pagine web statiche raggiungibili unicamente tramite browser"],
    correctAnswer: "Un insieme di reti eterogenee interconnesse che comunicano tramite protocolli condivisi",
    whyOthersAreWrong: {
      "Un unico grande computer centrale distribuito fisicamente presso tutti gli ISP": "Internet non è un singolo elaboratore centralizzato: è un insieme distribuito di reti e host indipendenti che cooperano tramite protocolli standard.",
      "Una rete privata riservata ai soli provider per il routing interno tra loro": "Internet non è limitata al traffico interno tra provider: include anche host finali, reti aziendali e domestiche pubbliche e private.",
      "Un insieme di pagine web statiche raggiungibili unicamente tramite browser": "Il Web (pagine e browser) è solo una delle applicazioni che girano su Internet, non una definizione di Internet stessa.",
    },
  },
  "internet-052": {
    options: ["Osserva l’indirizzo MAC sorgente dei frame ricevuti e lo associa alla porta d’ingresso", "Interroga periodicamente tutte le porte inviando richieste ARP di broadcast agli host", "Copia la tabella di forwarding da un router adiacente via protocollo di routing", "Assegna un indirizzo IP a ciascuna porta appena rileva un nuovo host collegato"],
    correctAnswer: "Osserva l’indirizzo MAC sorgente dei frame ricevuti e lo associa alla porta d’ingresso",
    whyOthersAreWrong: {
      "Interroga periodicamente tutte le porte inviando richieste ARP di broadcast agli host": "Lo switch non interroga attivamente le porte con ARP: apprende passivamente osservando il MAC sorgente del traffico che riceve.",
      "Copia la tabella di forwarding da un router adiacente via protocollo di routing": "Uno switch di livello 2 non scambia tabelle di forwarding con i router: costruisce la propria tabella osservando autonomamente il traffico.",
      "Assegna un indirizzo IP a ciascuna porta appena rileva un nuovo host collegato": "Lo switch non assegna indirizzi IP alle porte: lavora sugli indirizzi MAC per costruire la tabella di inoltro dei frame.",
    },
  },
  "security-083": {
    options: ["Un tentativo di ingannare l’utente per farsi consegnare credenziali fingendo un’identità affidabile", "Un attacco che intercetta passivamente il traffico di rete cifrato senza mai contattare la vittima", "Un attacco che sfrutta un buffer overflow per eseguire codice arbitrario sul server remoto", "Un attacco che inonda un server di richieste per esaurire tutte le sue risorse disponibili"],
    correctAnswer: "Un tentativo di ingannare l’utente per farsi consegnare credenziali fingendo un’identità affidabile",
    whyOthersAreWrong: {
      "Un attacco che intercetta passivamente il traffico di rete cifrato senza mai contattare la vittima": "Il phishing è un attacco attivo di social engineering che coinvolge direttamente la vittima, non un’intercettazione passiva del traffico.",
      "Un attacco che sfrutta un buffer overflow per eseguire codice arbitrario sul server remoto": "Lo sfruttamento di un buffer overflow è un attacco tecnico contro il software, diverso dall’inganno psicologico tipico del phishing.",
      "Un attacco che inonda un server di richieste per esaurire tutte le sue risorse disponibili": "Questo descrive un attacco di tipo denial-of-service, che mira a saturare risorse, non a carpire credenziali con l’inganno.",
    },
  },
  "security-063": {
    options: ["Perché sono nettamente più efficienti della crittografia asimmetrica nel cifrare grandi volumi di dati", "Perché offrono un livello di sicurezza matematicamente superiore a quello della crittografia asimmetrica", "Perché permettono di eliminare completamente la necessità di uno scambio di chiavi tra client e server", "Perché generano automaticamente il certificato digitale usato durante il TLS handshake"],
    correctAnswer: "Perché sono nettamente più efficienti della crittografia asimmetrica nel cifrare grandi volumi di dati",
    whyOthersAreWrong: {
      "Perché offrono un livello di sicurezza matematicamente superiore a quello della crittografia asimmetrica": "La sicurezza non è 'superiore' in senso assoluto: simmetrica e asimmetrica offrono garanzie diverse; il motivo dell’uso in sessione è l’efficienza computazionale, non un livello di sicurezza maggiore.",
      "Perché permettono di eliminare completamente la necessità di uno scambio di chiavi tra client e server": "La crittografia simmetrica richiede comunque uno scambio (o accordo) sicuro della chiave di sessione, tipicamente ottenuto tramite l’asimmetrica durante l’handshake.",
      "Perché generano automaticamente il certificato digitale usato durante il TLS handshake": "Il certificato digitale è generato ed emesso dalla CA, non dall’algoritmo di cifratura simmetrica usato per il traffico.",
    },
  },
  "security-078": {
    options: ["Permettere all’utente di ottenere ticket di servizio successivi senza reinserire la password", "Cifrare in modo permanente l’intero disco del client usando la chiave di sessione ottenuta", "Generare la coppia di chiavi pubblica e privata usata dal servizio richiesto dall’utente", "Registrare nel server DNS l’indirizzo IP autoritativo del Key Distribution Center"],
    correctAnswer: "Permettere all’utente di ottenere ticket di servizio successivi senza reinserire la password",
    whyOthersAreWrong: {
      "Cifrare in modo permanente l’intero disco del client usando la chiave di sessione ottenuta": "Kerberos non cifra il disco del client: il TGT serve solo per ottenere ticket di servizio senza ripetere l’autenticazione con password.",
      "Generare la coppia di chiavi pubblica e privata usata dal servizio richiesto dall’utente": "Kerberos è basato su crittografia simmetrica con chiavi condivise con il KDC, non su una coppia di chiavi pubblica/privata generata dal TGT.",
      "Registrare nel server DNS l’indirizzo IP autoritativo del Key Distribution Center": "L’indirizzo del KDC è configurato o scoperto separatamente (es. tramite DNS o configurazione statica), non è il ruolo funzionale del TGT.",
    },
  },
  "security-067": {
    options: ["Permettere a due parti di concordare una chiave condivisa su un canale insicuro", "Firmare digitalmente messaggi garantendo un non ripudio verificabile da terzi", "Emettere certificati digitali X.509 per conto di un’autorità di certificazione", "Cifrare direttamente grandi volumi di dati al posto degli algoritmi simmetrici"],
    correctAnswer: "Permettere a due parti di concordare una chiave condivisa su un canale insicuro",
    whyOthersAreWrong: {
      "Firmare digitalmente messaggi garantendo un non ripudio verificabile da terzi": "La firma digitale con non ripudio è tipica di algoritmi come RSA o ECDSA, non lo scopo primario di Diffie-Hellman, che serve a concordare una chiave.",
      "Emettere certificati digitali X.509 per conto di un’autorità di certificazione": "L’emissione di certificati è compito di una CA nella PKI, non del protocollo Diffie-Hellman, che riguarda l’accordo su una chiave.",
      "Cifrare direttamente grandi volumi di dati al posto degli algoritmi simmetrici": "Diffie-Hellman non cifra direttamente i dati applicativi: produce una chiave condivisa che poi viene usata, tipicamente, da un algoritmo simmetrico.",
    },
  },
  "security-071": {
    options: ["L’impiego di una chiave segreta condivisa che rafforza autenticità e integrità del messaggio", "La possibilità di ricostruire il messaggio originale a partire dal digest calcolato", "La capacità di cifrare l’intero messaggio in modo da renderlo illeggibile a terzi", "L’eliminazione della necessità di scambiare in anticipo un segreto condiviso"],
    correctAnswer: "L’impiego di una chiave segreta condivisa che rafforza autenticità e integrità del messaggio",
    whyOthersAreWrong: {
      "La possibilità di ricostruire il messaggio originale a partire dal digest calcolato": "Né l’hash né l’HMAC sono invertibili: dal digest non si può ricostruire il messaggio originale, che non è la loro funzione.",
      "La capacità di cifrare l’intero messaggio in modo da renderlo illeggibile a terzi": "HMAC non cifra il messaggio: produce un codice di autenticazione, il testo resta in chiaro salvo cifratura separata.",
      "L’eliminazione della necessità di scambiare in anticipo un segreto condiviso": "HMAC richiede proprio una chiave segreta condivisa in anticipo tra le parti: non elimina questo requisito, lo sfrutta.",
    },
  },
  "security-084": {
    options: ["Per rendere inefficaci gli attacchi con tabelle precomputate e gli hash uguali tra utenti", "Per permettere all’amministratore di recuperare la password originale se smarrita", "Per velocizzare il calcolo dell’hash della password durante ogni login dell’utente", "Per comprimere la lunghezza del digest della password memorizzato nel database"],
    correctAnswer: "Per rendere inefficaci gli attacchi con tabelle precomputate e gli hash uguali tra utenti",
    whyOthersAreWrong: {
      "Per permettere all’amministratore di recuperare la password originale se smarrita": "Un sistema ben progettato non deve permettere di recuperare la password in chiaro: l’hash resta non invertibile anche con il salt.",
      "Per velocizzare il calcolo dell’hash della password durante ogni login dell’utente": "Il salt non velocizza il calcolo: l’obiettivo di tecniche correlate (es. costo computazionale elevato) è semmai rallentare gli attacchi, non il login legittimo.",
      "Per comprimere la lunghezza del digest della password memorizzato nel database": "Il salt non comprime nulla: viene concatenato alla password prima dell’hash e in genere aumenta, non riduce, i dati memorizzati.",
    },
  },
  "security-073": {
    options: ["L’associazione firmata da una CA fidata tra un’identità e la relativa chiave pubblica", "La chiave privata del server, cifrata e allegata al certificato per sicurezza", "L’elenco completo delle porte TCP che il server è autorizzato ad aprire", "La cronologia di tutte le connessioni TLS precedenti effettuate dal client"],
    correctAnswer: "L’associazione firmata da una CA fidata tra un’identità e la relativa chiave pubblica",
    whyOthersAreWrong: {
      "La chiave privata del server, cifrata e allegata al certificato per sicurezza": "Un certificato X.509 contiene la chiave pubblica, non la chiave privata: quest’ultima deve restare segreta e non viene mai distribuita nel certificato.",
      "L’elenco completo delle porte TCP che il server è autorizzato ad aprire": "Le porte autorizzate sono una configurazione del firewall o del servizio, non un contenuto del certificato digitale.",
      "La cronologia di tutte le connessioni TLS precedenti effettuate dal client": "Il certificato non registra lo storico delle connessioni: attesta staticamente l’identità e la chiave pubblica del titolare.",
    },
  },
  "security-081": {
    options: ["Un intero pacchetto IP originale viene incapsulato e protetto dentro un nuovo pacchetto IP", "Viene protetto solo il payload di trasporto, mantenendo invisibile l’header IP originale", "Vengono scambiate le chiavi di sessione senza incapsulare alcun pacchetto aggiuntivo", "Viene autenticato solo l’header IP originale, lasciando sempre il payload in chiaro"],
    correctAnswer: "Un intero pacchetto IP originale viene incapsulato e protetto dentro un nuovo pacchetto IP",
    whyOthersAreWrong: {
      "Viene protetto solo il payload di trasporto, mantenendo invisibile l’header IP originale": "Questo si avvicina piuttosto alla modalità transport, dove è protetto solo il payload; nel tunnel mode è l’intero pacchetto IP originale, header incluso, a essere incapsulato.",
      "Vengono scambiate le chiavi di sessione senza incapsulare alcun pacchetto aggiuntivo": "Lo scambio delle chiavi di sessione è gestito da IKE, un processo separato: la modalità tunnel riguarda invece come viene incapsulato il pacchetto IP protetto.",
      "Viene autenticato solo l’header IP originale, lasciando sempre il payload in chiaro": "IPsec in modalità tunnel (con ESP) può cifrare anche il payload, non limitarsi ad autenticare il solo header lasciando i dati in chiaro.",
    },
  },
  "security-072": {
    options: ["Integrità del messaggio, autenticità dell’origine e supporto al non ripudio", "Riservatezza totale del contenuto e anonimato assoluto del mittente", "Disponibilità del servizio e bilanciamento del carico tra i server", "Compressione dei dati e riduzione della latenza di trasmissione"],
    correctAnswer: "Integrità del messaggio, autenticità dell’origine e supporto al non ripudio",
    whyOthersAreWrong: {
      "Riservatezza totale del contenuto e anonimato assoluto del mittente": "La firma digitale non garantisce di per sé riservatezza né anonimato: anzi, lega esplicitamente il messaggio a un firmatario identificabile.",
      "Disponibilità del servizio e bilanciamento del carico tra i server": "Disponibilità e bilanciamento del carico riguardano l’affidabilità dei sistemi, non le proprietà crittografiche di una firma digitale.",
      "Compressione dei dati e riduzione della latenza di trasmissione": "La firma digitale non si occupa di compressione o di prestazioni di trasmissione: riguarda l’autenticazione e l’integrità del contenuto firmato.",
    },
  },
  "security-065": {
    options: ["Sulla difficoltà di fattorizzare il prodotto di due grandi numeri primi", "Sulla difficoltà di calcolare il logaritmo discreto in un campo finito", "Sulla difficoltà di invertire una funzione hash crittografica come SHA-256", "Sulla difficoltà di trovare collisioni in un cifrario a blocchi simmetrico"],
    correctAnswer: "Sulla difficoltà di fattorizzare il prodotto di due grandi numeri primi",
    whyOthersAreWrong: {
      "Sulla difficoltà di calcolare il logaritmo discreto in un campo finito": "Il problema del logaritmo discreto è alla base di Diffie-Hellman e di ElGamal, non della sicurezza classica dell’RSA, che si fonda sulla fattorizzazione.",
      "Sulla difficoltà di invertire una funzione hash crittografica come SHA-256": "L’inversione di una funzione hash è un problema diverso, legato alla resistenza alla preimmagine, non al fondamento matematico dell’RSA.",
      "Sulla difficoltà di trovare collisioni in un cifrario a blocchi simmetrico": "La ricerca di collisioni riguarda i cifrari simmetrici e le funzioni hash, non il problema di fattorizzazione su cui si basa l’RSA.",
    },
  },
  "security-075": {
    options: ["Durante il TLS handshake, verificando certificato del server e catena di fiducia", "Dopo la chiusura della connessione, confrontando i log salvati dal client", "Durante la risoluzione DNS del nome host, tramite un record TXT dedicato", "All’apertura della connessione TCP, tramite un campo speciale dell’header IP"],
    correctAnswer: "Durante il TLS handshake, verificando certificato del server e catena di fiducia",
    whyOthersAreWrong: {
      "Dopo la chiusura della connessione, confrontando i log salvati dal client": "Verificare l’identità dopo la chiusura della connessione sarebbe inutile: il controllo avviene prima, durante l’handshake TLS, non a posteriori sui log.",
      "Durante la risoluzione DNS del nome host, tramite un record TXT dedicato": "Il DNS risolve nomi in indirizzi IP e non effettua l’autenticazione del server: quella avviene tramite il certificato durante l’handshake TLS.",
      "All’apertura della connessione TCP, tramite un campo speciale dell’header IP": "Né TCP né l’header IP trasportano informazioni di identità del server applicativo: l’autenticazione avviene a livello TLS, sopra il trasporto.",
    },
  },
  "security-074": {
    options: ["Firmare digitalmente certificati che legano una chiave pubblica a un’identità verificata", "Distribuire dinamicamente indirizzi IP a tutti i client della rete interna", "Instradare il traffico cifrato tra sistemi autonomi diversi su Internet", "Calcolare direttamente la chiave di sessione condivisa usata durante l’handshake TLS"],
    correctAnswer: "Firmare digitalmente certificati che legano una chiave pubblica a un’identità verificata",
    whyOthersAreWrong: {
      "Distribuire dinamicamente indirizzi IP a tutti i client della rete interna": "La distribuzione di indirizzi IP è compito del DHCP, non della Certification Authority, che si occupa di firmare certificati.",
      "Instradare il traffico cifrato tra sistemi autonomi diversi su Internet": "L’instradamento del traffico tra sistemi autonomi è un compito dei router e dei protocolli di routing (es. BGP), non della CA.",
      "Calcolare direttamente la chiave di sessione condivisa usata durante l’handshake TLS": "La chiave di sessione TLS viene concordata tra client e server durante l’handshake (es. tramite Diffie-Hellman), non calcolata dalla CA.",
    },
  },
};

const auditedBaseQuestions: Question[] = baseQuestions.map((question) =>
  applyQuestionAudit(question, baseQuestionAudits[question.id]),
);

export const questions: Question[] = [
  ...auditedBaseQuestions,
  ...advancedQuestions,
  ...securityExtraQuestions,
  ...historicalQuestions,
];

export { hardQuestionIds };
