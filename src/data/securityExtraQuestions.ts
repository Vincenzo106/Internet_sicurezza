import type { Question } from "../types";

import { applyQuestionAudit } from "./questionAudit";

type SecurityExtraSeed = Omit<Question, "examLikelihood" | "sourceType">;

const securityExtraSeeds: SecurityExtraSeed[] = [
  {
    id: "security-ext-001",
    category: "Sicurezza",
    topic: "concetti base CIA: confidenzialità, integrità, disponibilità",
    difficulty: "facile",
    question:
      "Se un attaccante intercetta e legge il contenuto di una comunicazione cifrata male, quale proprietà della triade CIA viene violata per prima?",
    options: [
      "La confidenzialità, perché un soggetto non autorizzato accede al contenuto dei dati",
      "L'integrità, perché il contenuto del messaggio viene modificato durante il transito",
      "La disponibilità, perché il servizio smette del tutto di rispondere alle richieste",
      "Il non ripudio, perché il mittente nega in seguito di aver inviato il messaggio",
    ],
    correctAnswer:
      "La confidenzialità, perché un soggetto non autorizzato accede al contenuto dei dati",
    explanation:
      "Leggere un contenuto che dovrebbe restare segreto è una violazione di confidenzialità: qualcuno non autorizzato accede all'informazione. Integrità e disponibilità riguardano invece la correttezza dei dati e l'accesso al servizio, aspetti diversi dalla semplice lettura non autorizzata.",
    whyOthersAreWrong: {
      "L'integrità, perché il contenuto del messaggio viene modificato durante il transito":
        "La modifica dei dati riguarda l'integrità, non è ciò che accade quando si legge soltanto un contenuto intercettato.",
      "La disponibilità, perché il servizio smette del tutto di rispondere alle richieste":
        "La disponibilità riguarda l'accesso al servizio, non la lettura non autorizzata di un contenuto già trasmesso.",
      "Il non ripudio, perché il mittente nega in seguito di aver inviato il messaggio":
        "Il non ripudio è legato alla firma digitale, non fa parte della triade CIA classica.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-002",
    category: "Sicurezza",
    topic: "concetti base CIA: confidenzialità, integrità, disponibilità",
    difficulty: "media",
    question:
      "Un server web resta raggiungibile e i dati che restituisce non vengono alterati, ma chiunque sulla rete può leggerli in chiaro. Quale proprietà della CIA manca in questo scenario?",
    options: [
      "La confidenzialità, perché i dati non sono protetti da lettura non autorizzata",
      "L'integrità, perché i dati potrebbero comunque essere alterati in transito",
      "La disponibilità, perché il server potrebbe smettere di rispondere",
      "L'autenticazione, perché il client non verifica mai l'identità del server",
    ],
    correctAnswer:
      "La confidenzialità, perché i dati non sono protetti da lettura non autorizzata",
    explanation:
      "Nello scenario descritto il servizio funziona e i dati arrivano integri: quello che manca è la protezione da lettura non autorizzata, cioè la confidenzialità. Le altre proprietà non sono messe in discussione dai fatti descritti.",
    whyOthersAreWrong: {
      "L'integrità, perché i dati potrebbero comunque essere alterati in transito":
        "Lo scenario dice esplicitamente che i dati non vengono alterati: l'integrità non è il problema descritto.",
      "La disponibilità, perché il server potrebbe smettere di rispondere":
        "Il server resta raggiungibile nello scenario: la disponibilità non è compromessa.",
      "L'autenticazione, perché il client non verifica mai l'identità del server":
        "Lo scenario riguarda la lettura del contenuto in chiaro, non la verifica dell'identità del server.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-003",
    category: "Sicurezza",
    topic: "crittografia simmetrica",
    difficulty: "facile",
    question: "Quale caratteristica descrive correttamente la crittografia simmetrica?",
    options: [
      "Usa la stessa identica chiave segreta sia per cifrare sia per decifrare i dati",
      "Usa una chiave pubblica per cifrare e una privata diversa per decifrare",
      "Non richiede mai la condivisione di alcuna chiave tra le parti",
      "Cifra i dati usando esclusivamente funzioni hash a senso unico",
    ],
    correctAnswer:
      "Usa la stessa identica chiave segreta sia per cifrare sia per decifrare i dati",
    explanation:
      "Nella crittografia simmetrica mittente e destinatario condividono lo stesso segreto: quella chiave serve sia per cifrare sia per decifrare. È questo che la distingue nettamente dalla crittografia asimmetrica.",
    whyOthersAreWrong: {
      "Usa una chiave pubblica per cifrare e una privata diversa per decifrare":
        "Chiave pubblica e privata distinte sono proprie della crittografia asimmetrica, non di quella simmetrica.",
      "Non richiede mai la condivisione di alcuna chiave tra le parti":
        "La crittografia simmetrica richiede proprio che entrambe le parti condividano in modo sicuro la stessa chiave.",
      "Cifra i dati usando esclusivamente funzioni hash a senso unico":
        "Le funzioni hash non sono reversibili e non servono a cifrare o decifrare dati.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-004",
    category: "Sicurezza",
    topic: "crittografia simmetrica",
    difficulty: "media",
    question:
      "Perché la crittografia simmetrica viene tipicamente preferita per cifrare grandi volumi di dati rispetto a quella asimmetrica?",
    options: [
      "Perché le sue operazioni sono molto più veloci su grandi quantità di dati",
      "Perché non richiede mai la generazione di una chiave prima dell'uso",
      "Perché garantisce automaticamente anche l'autenticazione del mittente",
      "Perché produce sempre un ciphertext più corto del testo in chiaro originale",
    ],
    correctAnswer: "Perché le sue operazioni sono molto più veloci su grandi quantità di dati",
    explanation:
      "Gli algoritmi simmetrici sono computazionalmente molto meno onerosi di quelli asimmetrici, quindi sono la scelta naturale per cifrare grandi flussi di dati. È per questo che TLS usa l'asimmetrica solo per lo scambio iniziale della chiave e poi passa al simmetrico.",
    whyOthersAreWrong: {
      "Perché non richiede mai la generazione di una chiave prima dell'uso":
        "Anche la crittografia simmetrica richiede una chiave, che va generata e condivisa in modo sicuro prima dell'uso.",
      "Perché garantisce automaticamente anche l'autenticazione del mittente":
        "La sola cifratura simmetrica non garantisce di per sé l'autenticazione: servono meccanismi aggiuntivi come HMAC.",
      "Perché produce sempre un ciphertext più corto del testo in chiaro originale":
        "La dimensione del ciphertext non è il motivo della preferenza: dipende dalla modalità di cifratura, non dalla velocità.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-005",
    category: "Sicurezza",
    topic: "crittografia asimmetrica",
    difficulty: "facile",
    question: "Che cosa contraddistingue la crittografia asimmetrica rispetto a quella simmetrica?",
    options: [
      "L'uso di una coppia di chiavi distinte, una pubblica e una privata",
      "L'uso di un'unica chiave segreta condivisa tra mittente e destinatario",
      "L'assenza totale di qualunque forma di chiave crittografica",
      "L'impiego esclusivo di funzioni hash per proteggere i dati",
    ],
    correctAnswer: "L'uso di una coppia di chiavi distinte, una pubblica e una privata",
    explanation:
      "La crittografia asimmetrica si basa su una coppia matematicamente correlata di chiavi: quella pubblica può essere distribuita liberamente, quella privata resta segreta. È questa la differenza strutturale rispetto alla simmetrica.",
    whyOthersAreWrong: {
      "L'uso di un'unica chiave segreta condivisa tra mittente e destinatario":
        "Una singola chiave condivisa è il modello della crittografia simmetrica, non di quella asimmetrica.",
      "L'assenza totale di qualunque forma di chiave crittografica":
        "La crittografia asimmetrica usa comunque delle chiavi: semplicemente sono due, non una.",
      "L'impiego esclusivo di funzioni hash per proteggere i dati":
        "Le funzioni hash sono un meccanismo diverso, non reversibile, e non sono l'elemento distintivo dell'asimmetrica.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-006",
    category: "Sicurezza",
    topic: "crittografia asimmetrica",
    difficulty: "difficile",
    question:
      "In un sistema a chiave asimmetrica, se Alice vuole inviare un messaggio confidenziale che solo Bob possa leggere, quale chiave deve usare per cifrarlo?",
    options: [
      "La chiave pubblica di Bob, così solo la sua chiave privata potrà decifrarlo",
      "La propria chiave privata, così Bob la potrà verificare con quella pubblica",
      "La chiave pubblica propria di Alice, condivisa in anticipo con Bob",
      "Una chiave simmetrica generata casualmente e mai comunicata a Bob",
    ],
    correctAnswer: "La chiave pubblica di Bob, così solo la sua chiave privata potrà decifrarlo",
    explanation:
      "Per garantire che solo Bob possa leggere il messaggio, Alice deve cifrare con la chiave pubblica di Bob: solo la corrispondente chiave privata, che Bob tiene segreta, potrà decifrarlo. Usare altre chiavi non garantirebbe questa proprietà.",
    whyOthersAreWrong: {
      "La propria chiave privata, così Bob la potrà verificare con quella pubblica":
        "Cifrare con la propria chiave privata è tipico della firma digitale, non garantisce confidenzialità verso un destinatario specifico.",
      "La chiave pubblica propria di Alice, condivisa in anticipo con Bob":
        "La chiave pubblica di Alice non serve a Bob per decifrare: serve la chiave pubblica di Bob abbinata alla sua privata.",
      "Una chiave simmetrica generata casualmente e mai comunicata a Bob":
        "Una chiave mai comunicata a Bob non gli permetterebbe in alcun modo di decifrare il messaggio.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-007",
    category: "Sicurezza",
    topic: "RSA",
    difficulty: "media",
    question: "Quale affermazione su RSA è corretta?",
    options: [
      "La chiave pubblica si distribuisce liberamente, mentre la privata resta segreta",
      "Le chiavi pubblica e privata devono restare entrambe segrete per garantire sicurezza",
      "RSA utilizza sempre la stessa chiave sia per cifrare sia per decifrare",
      "RSA è più veloce della crittografia simmetrica su grandi volumi di dati",
    ],
    correctAnswer:
      "La chiave pubblica si distribuisce liberamente, mentre la privata resta segreta",
    explanation:
      "RSA è un algoritmo asimmetrico: la sicurezza si basa sul fatto che la chiave pubblica può essere nota a chiunque, mentre solo il titolare conosce la chiave privata corrispondente. Le altre affermazioni descrivono in modo scorretto il funzionamento di RSA.",
    whyOthersAreWrong: {
      "Le chiavi pubblica e privata devono restare entrambe segrete per garantire sicurezza":
        "La chiave pubblica è pensata per essere distribuita apertamente: solo quella privata deve restare segreta.",
      "RSA utilizza sempre la stessa chiave sia per cifrare sia per decifrare":
        "Usare la stessa chiave per cifrare e decifrare è tipico della crittografia simmetrica, non di RSA.",
      "RSA è più veloce della crittografia simmetrica su grandi volumi di dati":
        "È vero il contrario: RSA è molto più oneroso della crittografia simmetrica su grandi volumi di dati.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-008",
    category: "Sicurezza",
    topic: "RSA",
    difficulty: "difficile",
    question: "Quale scenario descrive correttamente un uso tipico di RSA nella pratica moderna?",
    options: [
      "Cifrare una piccola chiave di sessione simmetrica durante l'handshake iniziale",
      "Cifrare direttamente l'intero flusso video di una videochiamata in tempo reale",
      "Sostituire completamente la necessità di funzioni hash nei protocolli di integrità",
      "Instradare pacchetti IP tra sistemi autonomi diversi su Internet",
    ],
    correctAnswer:
      "Cifrare una piccola chiave di sessione simmetrica durante l'handshake iniziale",
    explanation:
      "Nella pratica RSA viene usato per operazioni piccole e poco frequenti, come cifrare o firmare una chiave di sessione durante un handshake, proprio perché è costoso su grandi quantità di dati. Il traffico applicativo vero e proprio viene poi protetto con crittografia simmetrica.",
    whyOthersAreWrong: {
      "Cifrare direttamente l'intero flusso video di una videochiamata in tempo reale":
        "Cifrare grandi flussi in tempo reale con RSA sarebbe troppo lento: si usa crittografia simmetrica per questo scopo.",
      "Sostituire completamente la necessità di funzioni hash nei protocolli di integrità":
        "RSA e le funzioni hash risolvono problemi diversi (confidenzialità/firma contro integrità): uno non sostituisce l'altro.",
      "Instradare pacchetti IP tra sistemi autonomi diversi su Internet":
        "L'instradamento tra sistemi autonomi è compito dei protocolli di routing come BGP, non di un algoritmo crittografico.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-009",
    category: "Sicurezza",
    topic: "Diffie-Hellman",
    difficulty: "media",
    question: "Che cosa NON fornisce, di per sé, il protocollo Diffie-Hellman di base?",
    options: [
      "L'autenticazione della controparte, motivo per cui va abbinato a firme o certificati",
      "Il calcolo di un segreto condiviso a partire da valori pubblici scambiati sul canale",
      "La resistenza a un attaccante puramente passivo che osserva il canale",
      "La possibilità di essere eseguito anche su un canale non protetto da cifratura",
    ],
    correctAnswer:
      "L'autenticazione della controparte, motivo per cui va abbinato a firme o certificati",
    explanation:
      "Diffie-Hellman di base permette di calcolare un segreto condiviso anche osservando il canale, ma non dice nulla sull'identità della controparte: per questo va combinato con firme digitali o certificati per evitare un man-in-the-middle.",
    whyOthersAreWrong: {
      "Il calcolo di un segreto condiviso a partire da valori pubblici scambiati sul canale":
        "Questo è esattamente ciò che DH fornisce: il calcolo di un segreto condiviso, quindi non è la proprietà mancante.",
      "La resistenza a un attaccante puramente passivo che osserva il canale":
        "DH resiste bene a un attaccante passivo che si limita a osservare: non è questa la sua lacuna.",
      "La possibilità di essere eseguito anche su un canale non protetto da cifratura":
        "DH è pensato proprio per funzionare su un canale non protetto: non è questa la sua lacuna.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-010",
    category: "Sicurezza",
    topic: "Diffie-Hellman",
    difficulty: "difficile",
    question: "Perché un attacco man-in-the-middle è possibile contro Diffie-Hellman non autenticato?",
    options: [
      "Perché l'attaccante crea due segreti separati, uno con ciascuna parte, senza farsi notare",
      "Perché il problema del logaritmo discreto è computazionalmente semplice da risolvere",
      "Perché Diffie-Hellman trasmette la chiave finale in chiaro sul canale osservato",
      "Perché ogni parte deve conoscere in anticipo la chiave privata dell'altra",
    ],
    correctAnswer:
      "Perché l'attaccante crea due segreti separati, uno con ciascuna parte, senza farsi notare",
    explanation:
      "Senza autenticazione, un attaccante può interporsi e completare uno scambio DH separato con ciascuna delle due parti, facendo credere a entrambe di aver concordato un segreto con l'altra, mentre in realtà parlano entrambe con lui. È per questo che serve autenticare la controparte.",
    whyOthersAreWrong: {
      "Perché il problema del logaritmo discreto è computazionalmente semplice da risolvere":
        "Il problema del logaritmo discreto resta difficile: non è questa la falla sfruttata dal man-in-the-middle.",
      "Perché Diffie-Hellman trasmette la chiave finale in chiaro sul canale osservato":
        "La chiave finale non viene mai trasmessa: viene calcolata separatamente da ciascuna parte a partire da valori pubblici.",
      "Perché ogni parte deve conoscere in anticipo la chiave privata dell'altra":
        "In DH nessuna delle due parti conosce mai la chiave privata dell'altra: è proprio questo il punto di forza del protocollo.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-011",
    category: "Sicurezza",
    topic: "hash",
    difficulty: "facile",
    question: "Quale proprietà è tipica di una funzione hash crittografica?",
    options: [
      "Produce un digest di lunghezza fissa a partire da un input di lunghezza qualsiasi",
      "Permette di risalire facilmente al messaggio originale a partire dal digest",
      "Richiede una chiave segreta condivisa per poter essere calcolata",
      "Cifra il messaggio rendendolo leggibile solo con la chiave corretta",
    ],
    correctAnswer:
      "Produce un digest di lunghezza fissa a partire da un input di lunghezza qualsiasi",
    explanation:
      "Una funzione hash crittografica trasforma un input di qualunque dimensione in un'impronta di lunghezza fissa, ed è progettata per essere praticamente impossibile da invertire. Non usa chiavi e non è pensata per essere reversibile come una cifratura.",
    whyOthersAreWrong: {
      "Permette di risalire facilmente al messaggio originale a partire dal digest":
        "È vero il contrario: una buona funzione hash è progettata per essere computazionalmente impraticabile da invertire.",
      "Richiede una chiave segreta condivisa per poter essere calcolata":
        "Una funzione hash standard è pubblica e non richiede alcuna chiave: chiunque può calcolarla sullo stesso input.",
      "Cifra il messaggio rendendolo leggibile solo con la chiave corretta":
        "L'hash non cifra e non è reversibile: è un meccanismo diverso dalla cifratura.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-012",
    category: "Sicurezza",
    topic: "hash",
    difficulty: "media",
    question:
      "Perché due file completamente diversi che producono lo stesso valore hash rappresentano un problema di sicurezza?",
    options: [
      "Perché è una collisione, sfruttabile per far accettare un file al posto di un altro",
      "Perché significa che la funzione hash ha cifrato male i dati in ingresso",
      "Perché indica che la chiave usata per calcolare l'hash era troppo corta",
      "Perché dimostra che il file è stato compresso invece che sottoposto a hashing",
    ],
    correctAnswer: "Perché è una collisione, sfruttabile per far accettare un file al posto di un altro",
    explanation:
      "Quando input diversi producono lo stesso digest si parla di collisione: un attaccante potrebbe sostituire un file legittimo con uno malevolo che genera lo stesso hash, aggirando i controlli di integrità basati su quel valore.",
    whyOthersAreWrong: {
      "Perché significa che la funzione hash ha cifrato male i dati in ingresso":
        "Le funzioni hash non cifrano: il problema non riguarda una cifratura mal fatta, ma la resistenza alle collisioni.",
      "Perché indica che la chiave usata per calcolare l'hash era troppo corta":
        "Le funzioni hash standard non usano alcuna chiave: il concetto di lunghezza della chiave non si applica qui.",
      "Perché dimostra che il file è stato compresso invece che sottoposto a hashing":
        "La compressione è un'operazione diversa e non ha relazione con il concetto di collisione hash.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-013",
    category: "Sicurezza",
    topic: "HMAC",
    difficulty: "media",
    question: "Che cosa aggiunge HMAC rispetto a un semplice hash calcolato sul messaggio?",
    options: [
      "L'uso di una chiave segreta condivisa, che garantisce anche autenticità",
      "La possibilità di decifrare il messaggio originale a partire dal codice HMAC",
      "La capacità di funzionare anche senza alcuna funzione hash sottostante",
      "La garanzia di non ripudio equivalente a quella di una firma digitale",
    ],
    correctAnswer: "L'uso di una chiave segreta condivisa, che garantisce anche autenticità",
    explanation:
      "Un hash semplice garantisce solo integrità: chiunque può ricalcolarlo. HMAC introduce una chiave segreta condivisa tra le parti, così il codice risultante dimostra anche che solo chi conosce la chiave può averlo generato, aggiungendo autenticità.",
    whyOthersAreWrong: {
      "La possibilità di decifrare il messaggio originale a partire dal codice HMAC":
        "HMAC resta una funzione non reversibile: non permette in alcun modo di recuperare il messaggio originale.",
      "La capacità di funzionare anche senza alcuna funzione hash sottostante":
        "HMAC è costruito proprio a partire da una funzione hash sottostante: non può farne a meno.",
      "La garanzia di non ripudio equivalente a quella di una firma digitale":
        "La chiave HMAC è condivisa da entrambe le parti, quindi non permette di attribuire il messaggio a un unico autore come fa una firma.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-014",
    category: "Sicurezza",
    topic: "HMAC",
    difficulty: "difficile",
    question: "Perché HMAC non fornisce non ripudio, a differenza di una firma digitale?",
    options: [
      "Perché la chiave è condivisa: chiunque delle due parti potrebbe averlo generato",
      "Perché HMAC non utilizza mai alcuna funzione hash nel proprio calcolo interno",
      "Perché HMAC può essere calcolato solo su messaggi già cifrati con RSA",
      "Perché il risultato di HMAC cambia ogni volta anche con lo stesso input",
    ],
    correctAnswer: "Perché la chiave è condivisa: chiunque delle due parti potrebbe averlo generato",
    explanation:
      "Il non ripudio richiede che solo un soggetto specifico possa aver prodotto un dato codice. Con HMAC la chiave è nota a entrambe le parti coinvolte, quindi non si può distinguere chi tra le due lo abbia effettivamente calcolato: per questo serve una firma digitale con chiave privata esclusiva.",
    whyOthersAreWrong: {
      "Perché HMAC non utilizza mai alcuna funzione hash nel proprio calcolo interno":
        "HMAC è costruito proprio attorno a una funzione hash: è falso che non la utilizzi.",
      "Perché HMAC può essere calcolato solo su messaggi già cifrati con RSA":
        "HMAC può essere applicato a qualsiasi messaggio, cifrato o meno, indipendentemente da RSA.",
      "Perché il risultato di HMAC cambia ogni volta anche con lo stesso input":
        "HMAC è deterministico: a parità di messaggio e chiave produce sempre lo stesso risultato.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-015",
    category: "Sicurezza",
    topic: "firma digitale",
    difficulty: "facile",
    question: "Quale chiave viene usata per verificare una firma digitale?",
    options: [
      "La chiave pubblica del soggetto che ha firmato il messaggio",
      "La chiave privata del soggetto che ha firmato il messaggio",
      "La chiave pubblica del destinatario che riceve il messaggio",
      "Una chiave simmetrica condivisa tra firmatario e destinatario",
    ],
    correctAnswer: "La chiave pubblica del soggetto che ha firmato il messaggio",
    explanation:
      "La firma viene generata con la chiave privata del firmatario e verificata da chiunque con la sua chiave pubblica corrispondente. Questo permette a chiunque di controllare l'autenticità senza mai conoscere il segreto del firmatario.",
    whyOthersAreWrong: {
      "La chiave privata del soggetto che ha firmato il messaggio":
        "La chiave privata serve per generare la firma, non per verificarla: deve restare segreta.",
      "La chiave pubblica del destinatario che riceve il messaggio":
        "La chiave del destinatario non ha alcun ruolo nella verifica di chi ha firmato il messaggio.",
      "Una chiave simmetrica condivisa tra firmatario e destinatario":
        "La firma digitale si basa su crittografia asimmetrica, non su una chiave simmetrica condivisa.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-016",
    category: "Sicurezza",
    topic: "firma digitale",
    difficulty: "media",
    question:
      "Perché firmare direttamente un messaggio molto lungo con RSA è inefficiente, e cosa si fa di solito al suo posto?",
    options: [
      "Si calcola prima l'hash del messaggio e si firma solo quel digest, molto più corto",
      "Si cifra l'intero messaggio con una chiave simmetrica e non si firma nulla",
      "Si spezza il messaggio in pacchetti IP e si firma solo il primo pacchetto",
      "Si invia il messaggio due volte, sperando che una delle due copie arrivi integra",
    ],
    correctAnswer:
      "Si calcola prima l'hash del messaggio e si firma solo quel digest, molto più corto",
    explanation:
      "Firmare un digest di lunghezza fissa è molto più veloce che firmare l'intero messaggio con un'operazione asimmetrica costosa. Chi verifica ricalcola l'hash del messaggio ricevuto e controlla che corrisponda a quello firmato.",
    whyOthersAreWrong: {
      "Si cifra l'intero messaggio con una chiave simmetrica e non si firma nulla":
        "Questo garantirebbe al più riservatezza, non la firma: la domanda riguarda proprio come firmare in modo efficiente.",
      "Si spezza il messaggio in pacchetti IP e si firma solo il primo pacchetto":
        "Firmare solo una parte del messaggio non protegge l'integrità del resto: non è la tecnica usata.",
      "Si invia il messaggio due volte, sperando che una delle due copie arrivi integra":
        "Questo non ha nulla a che vedere con la firma digitale né garantisce integrità o autenticità.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-017",
    category: "Sicurezza",
    topic: "certificati e PKI",
    difficulty: "facile",
    question: "Che cosa attesta principalmente un certificato digitale X.509?",
    options: [
      "Il legame tra un'identità e la relativa chiave pubblica, firmato da una CA fidata",
      "La cronologia completa delle connessioni effettuate dal titolare del certificato",
      "L'elenco delle porte di rete che il titolare è autorizzato a utilizzare",
      "La chiave privata del titolare, protetta da una password scelta dall'utente",
    ],
    correctAnswer:
      "Il legame tra un'identità e la relativa chiave pubblica, firmato da una CA fidata",
    explanation:
      "Un certificato X.509 lega un'identità, per esempio un nome di dominio, alla sua chiave pubblica, con una firma di una Certification Authority che garantisce l'associazione. Non contiene né la chiave privata né informazioni di rete come porte o cronologia.",
    whyOthersAreWrong: {
      "La cronologia completa delle connessioni effettuate dal titolare del certificato":
        "Un certificato è statico e non registra alcuno storico di connessioni.",
      "L'elenco delle porte di rete che il titolare è autorizzato a utilizzare":
        "Le porte autorizzate sono una configurazione del firewall o del servizio, non un contenuto del certificato.",
      "La chiave privata del titolare, protetta da una password scelta dall'utente":
        "La chiave privata non viene mai inclusa nel certificato: deve restare segreta presso il titolare.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-018",
    category: "Sicurezza",
    topic: "certificati e PKI",
    difficulty: "difficile",
    question:
      "Perché una catena di certificati che termina in una root CA sconosciuta al browser genera un avviso di sicurezza?",
    options: [
      "Perché il browser non può verificare la catena senza una root CA nel proprio trust store",
      "Perché ogni certificato intermedio deve essere necessariamente scaduto per generare un avviso",
      "Perché la connessione TLS non può mai essere stabilita senza una root CA riconosciuta",
      "Perché il nome a dominio richiesto coincide sempre con quello riportato nel certificato",
    ],
    correctAnswer:
      "Perché il browser non può verificare la catena senza una root CA nel proprio trust store",
    explanation:
      "Il browser accetta una catena di certificati solo se può risalire fino a una root CA già presente nel proprio trust store. Se la root non è nota o fidata, non può stabilire se la catena è davvero affidabile, e mostra un avviso.",
    whyOthersAreWrong: {
      "Perché ogni certificato intermedio deve essere necessariamente scaduto per generare un avviso":
        "L'avviso può comparire anche con certificati ancora validi: il problema è la mancanza di fiducia nella root, non la scadenza.",
      "Perché la connessione TLS non può mai essere stabilita senza una root CA riconosciuta":
        "La connessione TLS tecnicamente può comunque avvenire: è il browser che segnala il rischio e lascia scegliere all'utente.",
      "Perché il nome a dominio richiesto coincide sempre con quello riportato nel certificato":
        "Questa affermazione riguarda un controllo diverso (il matching del nome host) e non spiega l'avviso sulla root non fidata.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-019",
    category: "Sicurezza",
    topic: "HTTPS/TLS",
    difficulty: "media",
    question: "Dopo il TLS handshake, come viene tipicamente protetto il traffico applicativo della sessione?",
    options: [
      "Con crittografia simmetrica, usando una chiave di sessione concordata durante l'handshake",
      "Con crittografia asimmetrica applicata a ogni singolo pacchetto inviato",
      "Senza alcuna cifratura, perché l'handshake da solo basta a garantire sicurezza",
      "Con lo stesso certificato del server, usato direttamente come chiave di cifratura",
    ],
    correctAnswer:
      "Con crittografia simmetrica, usando una chiave di sessione concordata durante l'handshake",
    explanation:
      "Una volta completato l'handshake, client e server dispongono di una chiave di sessione simmetrica condivisa: da quel momento il traffico applicativo viene cifrato con quella chiave, molto più efficiente per grandi volumi di dati.",
    whyOthersAreWrong: {
      "Con crittografia asimmetrica applicata a ogni singolo pacchetto inviato":
        "Cifrare ogni pacchetto con crittografia asimmetrica sarebbe troppo lento: per questo si passa al simmetrico dopo l'handshake.",
      "Senza alcuna cifratura, perché l'handshake da solo basta a garantire sicurezza":
        "L'handshake stabilisce solo le chiavi e i parametri: senza cifratura successiva il traffico resterebbe leggibile.",
      "Con lo stesso certificato del server, usato direttamente come chiave di cifratura":
        "Il certificato contiene una chiave pubblica usata nell'handshake, non è la chiave di sessione simmetrica usata per il traffico.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-020",
    category: "Sicurezza",
    topic: "HTTPS/TLS",
    difficulty: "difficile",
    question: "Quale affermazione sul TLS handshake è falsa?",
    options: [
      "Il client invia sempre la propria chiave privata al server per completare l'handshake",
      "Client e server negoziano insieme la suite crittografica da utilizzare nella sessione",
      "Il server presenta il proprio certificato per farsi autenticare dal client",
      "Alla fine dell'handshake entrambe le parti dispongono di una chiave di sessione condivisa",
    ],
    correctAnswer: "Il client invia sempre la propria chiave privata al server per completare l'handshake",
    explanation:
      "Una chiave privata, per definizione, non deve mai essere trasmessa a nessuno: l'handshake TLS non prevede in alcun caso l'invio di una chiave privata dal client al server. Le altre tre affermazioni descrivono correttamente il comportamento del protocollo.",
    whyOthersAreWrong: {
      "Client e server negoziano insieme la suite crittografica da utilizzare nella sessione":
        "Questa affermazione è vera: la negoziazione della cipher suite fa parte dell'handshake, quindi non è la falsa affermazione cercata.",
      "Il server presenta il proprio certificato per farsi autenticare dal client":
        "Questa affermazione è vera: la presentazione del certificato è un passo standard dell'handshake TLS.",
      "Alla fine dell'handshake entrambe le parti dispongono di una chiave di sessione condivisa":
        "Questa affermazione è vera: è proprio l'obiettivo finale dell'handshake, quindi non è la risposta cercata.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-021",
    category: "Sicurezza",
    topic: "autenticazione",
    difficulty: "facile",
    question: "Quale fattore di autenticazione rappresenta una password?",
    options: [
      "Qualcosa che l'utente conosce e ricorda mentalmente",
      "Qualcosa che l'utente possiede fisicamente, come un token",
      "Qualcosa che caratterizza biometricamente l'utente",
      "Qualcosa che dipende dalla posizione geografica dell'utente",
    ],
    correctAnswer: "Qualcosa che l'utente conosce e ricorda mentalmente",
    explanation:
      "Le password appartengono alla categoria dei fattori di autenticazione basati sulla conoscenza: qualcosa che solo l'utente dovrebbe sapere. Le altre categorie riguardano il possesso, la biometria o altri elementi contestuali, diversi dalla semplice conoscenza di un segreto.",
    whyOthersAreWrong: {
      "Qualcosa che l'utente possiede fisicamente, come un token":
        "Il possesso fisico descrive un token hardware o una smart card, non una password ricordata mentalmente.",
      "Qualcosa che caratterizza biometricamente l'utente":
        "La biometria riguarda tratti fisici come l'impronta digitale, non un segreto memorizzato come la password.",
      "Qualcosa che dipende dalla posizione geografica dell'utente":
        "La posizione geografica non è un fattore di autenticazione classico legato alla conoscenza di un segreto.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-022",
    category: "Sicurezza",
    topic: "autenticazione",
    difficulty: "media",
    question: "Perché l'autenticazione a due fattori è considerata più robusta della sola password?",
    options: [
      "Perché richiede di compromettere due elementi indipendenti invece di uno solo",
      "Perché elimina completamente la possibilità di attacchi di phishing",
      "Perché sostituisce la password con una chiave crittografica asimmetrica",
      "Perché garantisce automaticamente la cifratura di tutto il traffico successivo",
    ],
    correctAnswer: "Perché richiede di compromettere due elementi indipendenti invece di uno solo",
    explanation:
      "Con due fattori indipendenti, per esempio qualcosa che si conosce e qualcosa che si possiede, un attaccante deve violarli entrambi per autenticarsi con successo: questo alza notevolmente la difficoltà rispetto alla sola password.",
    whyOthersAreWrong: {
      "Perché elimina completamente la possibilità di attacchi di phishing":
        "Il secondo fattore riduce il rischio ma non elimina del tutto il phishing, specialmente in attacchi più sofisticati.",
      "Perché sostituisce la password con una chiave crittografica asimmetrica":
        "L'autenticazione a due fattori si aggiunge alla password, non la sostituisce necessariamente con una chiave asimmetrica.",
      "Perché garantisce automaticamente la cifratura di tutto il traffico successivo":
        "L'autenticazione riguarda la verifica dell'identità, non implica automaticamente la cifratura del traffico successivo.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-023",
    category: "Sicurezza",
    topic: "Kerberos",
    difficulty: "media",
    question: "Qual è il ruolo del Key Distribution Center (KDC) in Kerberos?",
    options: [
      "Autenticare gli utenti e distribuire i ticket necessari per accedere ai servizi",
      "Instradare il traffico di rete tra i client e i server applicativi coinvolti",
      "Emettere certificati X.509 per conto di una Certification Authority esterna",
      "Assegnare dinamicamente indirizzi IP ai client collegati alla rete locale",
    ],
    correctAnswer: "Autenticare gli utenti e distribuire i ticket necessari per accedere ai servizi",
    explanation:
      "Il KDC è l'elemento centrale e fidato di Kerberos: verifica l'identità dell'utente e rilascia i ticket, a partire dal Ticket Granting Ticket, che permettono di accedere ai vari servizi senza dover reinserire le credenziali ogni volta.",
    whyOthersAreWrong: {
      "Instradare il traffico di rete tra i client e i server applicativi coinvolti":
        "L'instradamento del traffico è compito dei router e dei protocolli di rete, non del KDC.",
      "Emettere certificati X.509 per conto di una Certification Authority esterna":
        "Kerberos si basa su ticket, non su certificati X.509: quel compito appartiene a una PKI separata.",
      "Assegnare dinamicamente indirizzi IP ai client collegati alla rete locale":
        "L'assegnazione di indirizzi IP è compito del DHCP, un protocollo indipendente da Kerberos.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-024",
    category: "Sicurezza",
    topic: "Kerberos",
    difficulty: "difficile",
    question:
      "Dopo aver ottenuto il Ticket Granting Ticket (TGT), che cosa fa tipicamente un client Kerberos per accedere a un servizio specifico?",
    options: [
      "Presenta il TGT al Ticket Granting Server per ottenere un service ticket dedicato",
      "Usa direttamente la propria password per autenticarsi al servizio richiesto",
      "Genera da solo un nuovo certificato digitale valido per quel servizio",
      "Contatta il servizio richiesto senza alcuna ulteriore verifica di identità",
    ],
    correctAnswer: "Presenta il TGT al Ticket Granting Server per ottenere un service ticket dedicato",
    explanation:
      "Il TGT serve come credenziale intermedia: il client lo presenta al Ticket Granting Server per ottenere un ticket specifico per il servizio desiderato, evitando così di dover reinserire la password a ogni accesso.",
    whyOthersAreWrong: {
      "Usa direttamente la propria password per autenticarsi al servizio richiesto":
        "Il vantaggio di Kerberos è proprio evitare di reinserire la password: si usa il TGT già ottenuto, non la password diretta.",
      "Genera da solo un nuovo certificato digitale valido per quel servizio":
        "Kerberos funziona con ticket rilasciati dal KDC, non con certificati generati autonomamente dal client.",
      "Contatta il servizio richiesto senza alcuna ulteriore verifica di identità":
        "Senza un service ticket valido il servizio non avrebbe modo di verificare l'identità del client richiedente.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-025",
    category: "Sicurezza",
    topic: "VPN",
    difficulty: "facile",
    question: "Qual è lo scopo principale di una VPN?",
    options: [
      "Creare un tunnel cifrato tra due punti attraverso una rete non fidata",
      "Aumentare la velocità di connessione eliminando ogni forma di cifratura",
      "Sostituire completamente la necessità del protocollo DNS",
      "Assegnare automaticamente indirizzi IP pubblici a tutti i dispositivi",
    ],
    correctAnswer: "Creare un tunnel cifrato tra due punti attraverso una rete non fidata",
    explanation:
      "Una VPN incapsula e protegge il traffico tra due punti, tipicamente un client e una rete aziendale, facendolo transitare in modo cifrato anche attraverso reti pubbliche non fidate come Internet.",
    whyOthersAreWrong: {
      "Aumentare la velocità di connessione eliminando ogni forma di cifratura":
        "Una VPN aggiunge cifratura, che comporta un certo overhead: non elimina la cifratura per aumentare la velocità.",
      "Sostituire completamente la necessità del protocollo DNS":
        "La VPN protegge il trasporto dei dati, ma non elimina la necessità di risolvere nomi tramite DNS.",
      "Assegnare automaticamente indirizzi IP pubblici a tutti i dispositivi":
        "Le VPN spesso assegnano indirizzi IP privati interni alla rete virtuale, non necessariamente pubblici.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-026",
    category: "Sicurezza",
    topic: "VPN",
    difficulty: "media",
    question: "Quale differenza descrive correttamente le due modalità di IPsec spesso usate nelle VPN?",
    options: [
      "In modalità tunnel si incapsula l'intero pacchetto IP, in transport solo il payload",
      "In modalità tunnel non viene applicata alcuna cifratura, solo autenticazione",
      "In modalità transport viene sempre generato un nuovo indirizzo IP pubblico",
      "Le due modalità differiscono solo per l'algoritmo di hash utilizzato",
    ],
    correctAnswer: "In modalità tunnel si incapsula l'intero pacchetto IP, in transport solo il payload",
    explanation:
      "In modalità tunnel l'intero pacchetto IP originale, header incluso, viene incapsulato in un nuovo pacchetto, nascondendo così anche gli indirizzi interni. In modalità transport si protegge solo il payload, mantenendo visibile l'header IP originale.",
    whyOthersAreWrong: {
      "In modalità tunnel non viene applicata alcuna cifratura, solo autenticazione":
        "IPsec in modalità tunnel può cifrare il pacchetto incapsulato tramite ESP, non si limita alla sola autenticazione.",
      "In modalità transport viene sempre generato un nuovo indirizzo IP pubblico":
        "La modalità transport non genera un nuovo indirizzo IP: mantiene visibile l'header IP originale.",
      "Le due modalità differiscono solo per l'algoritmo di hash utilizzato":
        "La differenza principale riguarda che cosa viene incapsulato e protetto, non l'algoritmo di hash impiegato.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-027",
    category: "Sicurezza",
    topic: "IPsec",
    difficulty: "media",
    question: "Qual è la differenza principale tra i protocolli AH ed ESP in IPsec?",
    options: [
      "ESP offre anche riservatezza con cifratura, AH garantisce solo autenticità e integrità",
      "AH cifra i dati mentre ESP si limita ad autenticarli senza applicare cifratura",
      "AH funziona soltanto su IPv4, mentre ESP funziona soltanto su IPv6 nativo",
      "ESP e AH sono in realtà due nomi diversi per esattamente lo stesso protocollo",
    ],
    correctAnswer: "ESP offre anche riservatezza con cifratura, AH garantisce solo autenticità e integrità",
    explanation:
      "AH (Authentication Header) fornisce integrità e autenticazione dell'origine, ma non cifra i dati. ESP (Encapsulating Security Payload) può fornire anche riservatezza tramite cifratura, oltre a integrità e autenticazione: per questo è la scelta più usata nelle VPN moderne.",
    whyOthersAreWrong: {
      "AH cifra i dati mentre ESP si limita ad autenticarli senza applicare cifratura":
        "È l'esatto opposto: è ESP a poter cifrare, mentre AH garantisce solo autenticità e integrità senza cifratura.",
      "AH funziona soltanto su IPv4, mentre ESP funziona soltanto su IPv6 nativo":
        "Entrambi i protocolli sono definiti per funzionare sia con IPv4 sia con IPv6, non sono limitati a una sola versione.",
      "ESP e AH sono in realtà due nomi diversi per esattamente lo stesso protocollo":
        "Sono due protocolli distinti di IPsec, con formati e garanzie di sicurezza differenti.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-028",
    category: "Sicurezza",
    topic: "IPsec",
    difficulty: "difficile",
    question:
      "Perché IPsec in modalità tunnel è spesso scelto per collegare due sedi aziendali tramite Internet?",
    options: [
      "Perché protegge l'intero pacchetto e nasconde gli indirizzi IP interni della rete",
      "Perché elimina completamente la necessità di instradamento tra le due sedi",
      "Perché funziona esclusivamente su collegamenti fisici dedicati punto-punto",
      "Perché richiede che entrambe le sedi utilizzino lo stesso indirizzo IP pubblico",
    ],
    correctAnswer: "Perché protegge l'intero pacchetto e nasconde gli indirizzi IP interni della rete",
    explanation:
      "Incapsulando l'intero pacchetto IP originale dentro uno nuovo, la modalità tunnel protegge anche gli indirizzi IP privati interni delle due reti aziendali, che restano invisibili a chi osserva il traffico su Internet tra i due gateway VPN.",
    whyOthersAreWrong: {
      "Perché elimina completamente la necessità di instradamento tra le due sedi":
        "Il routing resta necessario: IPsec protegge i pacchetti, ma non elimina la necessità di instradarli correttamente.",
      "Perché funziona esclusivamente su collegamenti fisici dedicati punto-punto":
        "IPsec in modalità tunnel è pensato proprio per funzionare su reti pubbliche condivise come Internet, non solo su collegamenti dedicati.",
      "Perché richiede che entrambe le sedi utilizzino lo stesso indirizzo IP pubblico":
        "Le due sedi hanno tipicamente indirizzi IP pubblici diversi: non è richiesto che coincidano.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-029",
    category: "Sicurezza",
    topic: "attacchi principali",
    difficulty: "facile",
    question:
      "Quale attacco consiste nel far credere alla vittima di comunicare con un sito legittimo per sottrarle credenziali?",
    options: [
      "Il phishing, che inganna la vittima con un sito o messaggio che sembra legittimo",
      "Il replay, che ripete una comunicazione legittima già catturata in precedenza",
      "Lo spoofing, che falsifica l'identità o l'indirizzo di un mittente",
      "Lo sniffing, che intercetta passivamente il traffico su una rete condivisa",
    ],
    correctAnswer: "Il phishing, che inganna la vittima con un sito o messaggio che sembra legittimo",
    explanation:
      "Il phishing sfrutta l'inganno psicologico, imitando un servizio legittimo per convincere la vittima a inserire le proprie credenziali su un sito o modulo controllato dall'attaccante. Gli altri attacchi elencati seguono meccanismi tecnici diversi.",
    whyOthersAreWrong: {
      "Il replay, che ripete una comunicazione legittima già catturata in precedenza":
        "Il replay riutilizza dati già scambiati, non si basa sull'inganno tramite un sito falso.",
      "Lo spoofing, che falsifica l'identità o l'indirizzo di un mittente":
        "Lo spoofing falsifica un'identità tecnica, come un indirizzo IP o MAC, non necessariamente un intero sito web.",
      "Lo sniffing, che intercetta passivamente il traffico su una rete condivisa":
        "Lo sniffing è un ascolto passivo del traffico, non un inganno attivo verso la vittima.",
    },
    source: "note_crittografia_2025.pdf",
  },
  {
    id: "security-ext-030",
    category: "Sicurezza",
    topic: "attacchi principali",
    difficulty: "media",
    question: "In che cosa si distingue un attacco replay da un attacco man-in-the-middle attivo?",
    options: [
      "Il replay ritrasmette dati legittimi già catturati, senza intercettarli in tempo reale",
      "Il man-in-the-middle si limita a osservare passivamente il traffico senza mai intervenire",
      "Il replay richiede sempre di rompere prima l'algoritmo di cifratura usato",
      "Il man-in-the-middle può avvenire solo su reti cablate, mai su reti wireless",
    ],
    correctAnswer: "Il replay ritrasmette dati legittimi già catturati, senza intercettarli in tempo reale",
    explanation:
      "Un attacco replay si limita a registrare traffico legittimo e a rispedirlo in un secondo momento, senza bisogno di intercettare o modificare nulla in tempo reale. Un man-in-the-middle attivo, invece, si interpone nella comunicazione mentre avviene, potendo anche alterarla.",
    whyOthersAreWrong: {
      "Il man-in-the-middle si limita a osservare passivamente il traffico senza mai intervenire":
        "Un man-in-the-middle attivo, per definizione, si interpone e può alterare la comunicazione, non solo osservarla.",
      "Il replay richiede sempre di rompere prima l'algoritmo di cifratura usato":
        "Il replay può funzionare anche su dati cifrati, semplicemente ritrasmettendoli senza doverli decifrare.",
      "Il man-in-the-middle può avvenire solo su reti cablate, mai su reti wireless":
        "Il man-in-the-middle è possibile anche su reti wireless, spesso più esposte proprio per la natura condivisa del mezzo.",
    },
    source: "note_crittografia_2025.pdf",
  },
];

export const securityExtraQuestions: Question[] = securityExtraSeeds.map((seed) =>
  applyQuestionAudit(seed, { sourceType: "generata" }),
);
