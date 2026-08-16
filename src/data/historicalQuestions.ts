import type { Question, StudyGuide } from "../types";

import { applyQuestionAudit } from "./questionAudit";

/**
 * Domande realmente presenti nel simulatore d'esame storico, trascritte da
 * materials/risposte_simulatore_internet.pdf. Sono la parte piu' vicina allo
 * scritto vero: vengono marcate automaticamente come sourceType "storica".
 */
type HistoricalSeed = Omit<Question, "examLikelihood" | "sourceType">;

function guide(
  conceptToReview: string,
  miniSummary: string,
  memoryTrick: string,
  similarExamQuestion: string,
): StudyGuide {
  return { conceptToReview, miniSummary, memoryTrick, similarExamQuestion };
}

const historicalSeeds: HistoricalSeed[] = [
  {
    id: "hist-001",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "facile",
    question:
      "Quale dei seguenti flag nell'intestazione TCP è richiesto, in condizioni normali, per chiudere una connessione?",
    options: [
      "FIN",
      "PSH",
      "RST",
      "URG",
    ],
    correctAnswer:
      "FIN",
    explanation:
      "In condizioni operative normali la chiusura di una connessione TCP è un processo controllato. Il flag FIN indica che il mittente ha terminato l'invio dei dati ma resta in ascolto; poiché TCP è full-duplex, la chiusura completa richiede che entrambe le parti inviino il proprio FIN e ricevano il relativo ACK, con una procedura a quattro vie. Questo garantisce che tutti i dati in transito vengano consegnati e confermati prima della chiusura definitiva.",
    whyOthersAreWrong: {
      "PSH":
        "Il flag PSH (Push) forza l'invio immediato dei dati bufferizzati all'applicazione, non ha alcun ruolo nella chiusura della connessione.",
      "RST":
        "RST abbatte la connessione istantaneamente (abortive release) in caso di errori gravi o porte non in ascolto, perdendo i dati in transito: non è la chiusura ordinata richiesta in condizioni normali.",
      "URG":
        "URG segnala la presenza di dati urgenti da consegnare con priorità, non riguarda la terminazione della connessione.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Chiusura ordinata di una connessione TCP e differenza tra FIN e RST.",
      "FIN chiude in modo pulito con handshake a quattro vie; RST interrompe brutalmente perdendo i dati in transito.",
      "FIN = 'fine educata', RST = 'strappo della spina'. In condizioni normali si esce dalla porta, non dalla finestra.",
      "Quanti segmenti sono necessari per la chiusura completa di una connessione TCP full-duplex?",
    ),
  },
  {
    id: "hist-002",
    category: "Internet",
    topic: "MAC address",
    difficulty: "facile",
    question:
      "Come viene identificato univocamente un dispositivo ethernet a livello data link?",
    options: [
      "IP address",
      "TCP port number e IP address",
      "UDP port number",
      "MAC address",
    ],
    correctAnswer:
      "MAC address",
    explanation:
      "Il livello di collegamento dati si occupa del trasferimento dei frame tra nodi adiacenti sullo stesso segmento di rete, e l'indirizzo usato a questo scopo è il MAC address. Si tratta di un identificativo fisico di 48 bit assegnato alla scheda di rete, rappresentato in esadecimale: i primi 24 bit costituiscono l'OUI del produttore, gli ultimi 24 identificano la specifica scheda.",
    whyOthersAreWrong: {
      "IP address":
        "L'indirizzo IP identifica il dispositivo a livello di rete ed è necessario per l'instradamento tra reti diverse, non per la consegna diretta sul segmento Ethernet.",
      "TCP port number e IP address":
        "La coppia porta più indirizzo IP identifica un processo applicativo a livello di trasporto, non il dispositivo hardware a livello data link.",
      "UDP port number":
        "Le porte UDP identificano un servizio a livello di trasporto e non hanno alcun ruolo nell'indirizzamento di livello 2.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Indirizzamento del livello 2 e struttura a 48 bit del MAC address.",
      "Sul cavo si consegna per MAC, tra reti si instrada per IP, ai processi si consegna per porta.",
      "Associa sempre il livello all'indirizzo: L2 = MAC, L3 = IP, L4 = porta. Se la domanda dice 'data link', la risposta è MAC.",
      "Quanti bit compone un indirizzo MAC e come sono suddivisi?",
    ),
  },
  {
    id: "hist-003",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "media",
    question:
      "Quale delle seguenti caratteristiche NON descrive il servizio a livello di rete (IP)?",
    options: [
      "Congestion managed",
      "Connectionless",
      "Best effort",
      "Unreliable",
    ],
    correctAnswer:
      "Congestion managed",
    explanation:
      "Il servizio offerto dal livello di rete IP è definito best effort, connectionless e unreliable. Il protocollo IP non gestisce la congestione: non possiede meccanismi nativi per dire al mittente di rallentare, e questa responsabilità è delegata interamente al livello di trasporto, in particolare a TCP, che rileva la perdita di pacchetti come segnale di congestione e riduce la finestra di trasmissione.",
    whyOthersAreWrong: {
      "Connectionless":
        "È vera per IP: non esiste una fase di setup della connessione e ogni pacchetto è trattato indipendentemente, quindi non è la caratteristica cercata.",
      "Best effort":
        "È vera per IP: la rete fa del suo meglio per consegnare i pacchetti senza offrire garanzie, quindi non è la caratteristica cercata.",
      "Unreliable":
        "È vera per IP: non ci sono garanzie su consegna, ordine di arrivo o integrità, quindi non è la caratteristica cercata.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Proprietà del servizio IP e divisione dei compiti con il livello di trasporto.",
      "IP è best effort, connectionless e inaffidabile; la congestione la gestisce TCP, non IP.",
      "Nelle domande al negativo cerca l'unica proprietà che 'promette troppo': IP non promette nulla.",
      "Quale livello dello stack si occupa realmente del controllo di congestione?",
    ),
  },
  {
    id: "hist-004",
    category: "Internet",
    topic: "sliding window",
    difficulty: "media",
    question:
      "Quale campo dell'intestazione TCP, posizionato subito dopo i flag e prima del checksum, comunica al mittente quanto spazio libero è rimasto nel buffer di ricezione?",
    options: [
      "Checksum",
      "Puntatore ai dati urgenti",
      "Numero di sequenza",
      "Finestra di ricezione",
    ],
    correctAnswer:
      "Finestra di ricezione",
    explanation:
      "Il campo Finestra di ricezione (Receive Window) è un campo a 16 bit fondamentale per il meccanismo di controllo di flusso. Serve al ricevitore per comunicare al mittente quanto spazio libero ha nel proprio buffer di ricezione: il mittente non può inviare più dati non riscontrati di quanti indicati in questo valore, evitando così di mandare in overflow il buffer del destinatario.",
    whyOthersAreWrong: {
      "Checksum":
        "Il checksum serve a rilevare errori sui bit del segmento e si trova dopo la finestra di ricezione nell'header TCP.",
      "Puntatore ai dati urgenti":
        "L'Urgent Pointer indica la posizione dei dati prioritari nel segmento e ha senso solo con il flag URG attivo.",
      "Numero di sequenza":
        "Il numero di sequenza identifica la posizione dei byte nel flusso e si trova nella parte iniziale dell'header, non dopo i flag.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Posizione e funzione del campo Window Size nell'header TCP.",
      "La receive window è la dichiarazione di capienza del ricevitore: è il cuore del flow control.",
      "Flow control = 'quanto ci sta nel tuo buffer', ed è il ricevitore a dirlo dentro l'header.",
      "Cosa accade al mittente TCP quando la finestra di ricezione annunciata scende a zero?",
    ),
  },
  {
    id: "hist-005",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "media",
    question:
      "Quale dei seguenti meccanismi del protocollo TCP non serve per garantire l'affidabilità?",
    options: [
      "Valori della porta sorgente e destinazione",
      "Sliding window",
      "Acknowledgments",
      "Numero di sequenza",
    ],
    correctAnswer:
      "Valori della porta sorgente e destinazione",
    explanation:
      "I numeri di porta servono unicamente per il multiplexing e demultiplexing: permettono di indirizzare i dati verso la corretta applicazione all'interno dell'host, ma non giocano alcun ruolo nel garantire che i dati arrivino corretti o in ordine. L'affidabilità è costruita invece su numeri di sequenza, riscontri e finestra scorrevole.",
    whyOthersAreWrong: {
      "Sliding window":
        "La finestra scorrevole gestisce il controllo di flusso e il pipelining, contribuendo direttamente al trasferimento affidabile ed efficiente.",
      "Acknowledgments":
        "Gli ACK confermano al mittente che i dati sono arrivati correttamente e innescano le ritrasmissioni in caso di assenza: sono un pilastro dell'affidabilità.",
      "Numero di sequenza":
        "I numeri di sequenza permettono di riordinare i pacchetti fuori sequenza e di rilevare duplicati o perdite.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Distinzione tra multiplexing e meccanismi di affidabilità in TCP.",
      "Le porte dicono 'a chi', non 'se è arrivato bene': l'affidabilità la fanno sequenze, ACK e finestra.",
      "Chiediti: se togliessi questo campo, i dati arriverebbero comunque corretti? Le porte servono all'indirizzo, non all'integrità.",
      "Quale funzione svolgono i numeri di porta nel livello di trasporto?",
    ),
  },
  {
    id: "hist-006",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "media",
    question:
      "Dato l'indirizzo IP 151.97.6.4/24, indicare l'indirizzo di rete.",
    options: [
      "151.97.0.0",
      "151.97.6.0",
      "151.97.6.255",
      "151.0.0.0",
    ],
    correctAnswer:
      "151.97.6.0",
    explanation:
      "Il suffisso /24 indica che i primi 24 bit, cioè i primi tre ottetti, identificano la rete, mentre gli ultimi 8 bit identificano l'host. Per ottenere l'indirizzo di rete si mantengono invariati i bit della parte di rete e si azzerano tutti i bit della parte host: 151.97.6 resta invariato e l'ultimo ottetto diventa 0, quindi 151.97.6.0.",
    whyOthersAreWrong: {
      "151.97.0.0":
        "Corrisponderebbe a una maschera /16, cioè azzererebbe anche il terzo ottetto che invece appartiene alla parte di rete con /24.",
      "151.97.6.255":
        "Con la parte host tutta a 1 questo è l'indirizzo di broadcast della sottorete, non l'indirizzo di rete.",
      "151.0.0.0":
        "Corrisponderebbe a una maschera /8, azzerando due ottetti che con /24 fanno parte del prefisso di rete.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Calcolo dell'indirizzo di rete tramite AND logico con la subnet mask.",
      "Indirizzo di rete = bit host a zero; indirizzo di broadcast = bit host a uno.",
      "/24 significa 255.255.255.0: tieni i primi tre numeri e metti 0 nell'ultimo.",
      "Dato 192.168.10.77/26, qual è l'indirizzo di rete della sottorete di appartenenza?",
    ),
  },
  {
    id: "hist-007",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "facile",
    question:
      "Quanti byte aggiunge al messaggio una intestazione TCP in assenza di opzioni?",
    options: [
      "8",
      "64",
      "16",
      "20",
    ],
    correctAnswer:
      "20",
    explanation:
      "L'intestazione TCP ha lunghezza variabile ma i primi 20 byte sono obbligatori per ogni segmento e contengono i campi essenziali: porte (4 byte), numero di sequenza (4 byte), numero di riscontro (4 byte), header length e flag (2 byte), window size (2 byte), checksum (2 byte) e urgent pointer (2 byte). Le opzioni, quando presenti, possono estendere l'header fino a un massimo di 60 byte.",
    whyOthersAreWrong: {
      "8":
        "8 byte è la dimensione fissa dell'intestazione UDP, molto più leggera di quella TCP.",
      "16":
        "Non corrisponde ad alcuna dimensione standard dell'header TCP: i soli campi obbligatori superano già questo valore.",
      "64":
        "64 byte è la dimensione minima di un frame Ethernet, non dell'header TCP, che al massimo arriva a 60 byte con tutte le opzioni.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Dimensione fissa e variabile dell'intestazione TCP.",
      "TCP: 20 byte minimi, 60 massimi con opzioni. UDP: 8 byte fissi.",
      "20 come l'header IPv4: entrambi partono da 20 byte, UDP invece è il 'leggero' da 8.",
      "Quanti byte occupa l'intestazione UDP e perché è più corta di quella TCP?",
    ),
  },
  {
    id: "hist-008",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "facile",
    question:
      "Quali sono i tre campi che compongono la request line di un messaggio di richiesta HTTP?",
    options: [
      "Metodo, indirizzamento, server, versione",
      "Metodo, URL, oggetto",
      "Metodo, URL, versione",
      "Metodo, URL, indirizzo server",
    ],
    correctAnswer:
      "Metodo, URL, versione",
    explanation:
      "La prima riga di una richiesta HTTP, chiamata request line, è composta da tre elementi separati da spazi: il metodo, che indica l'azione da compiere come GET o POST; l'URL o request-URI, che indica la risorsa su cui operare; e la versione del protocollo, ad esempio HTTP/1.1. La riga termina con la sequenza CRLF.",
    whyOthersAreWrong: {
      "Metodo, indirizzamento, server, versione":
        "Elenca quattro elementi e introduce campi come indirizzamento e server che non fanno parte della sintassi della request line.",
      "Metodo, URL, oggetto":
        "L'oggetto non è un campo della request line: la risorsa richiesta è già indicata dall'URL.",
      "Metodo, URL, indirizzo server":
        "L'indirizzo del server non compare nella request line: l'host viaggia semmai nell'header Host, non nella prima riga.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Struttura della request line HTTP.",
      "Request line = metodo + URL + versione, separati da spazi e chiusi da CRLF.",
      "Pensa a 'GET /index.html HTTP/1.1': cosa faccio, su cosa, con quale versione.",
      "Come viene indicata la fine della sezione di intestazione in un messaggio HTTP?",
    ),
  },
  {
    id: "hist-009",
    category: "Internet",
    topic: "DNS",
    difficulty: "media",
    question:
      "Quali informazioni contengono i Root Domain Server?",
    options: [
      "Gli indirizzi dell'host richiesto",
      "Gli indirizzi dei top level domain",
      "Nessun'informazione, mantengono la cache della richiesta",
      "Gli indirizzi della zona d'interesse",
    ],
    correctAnswer:
      "Gli indirizzi dei top level domain",
    explanation:
      "Il sistema DNS è organizzato in una struttura ad albero gerarchica e al vertice ci sono i root name server. Questi non conoscono l'indirizzo IP di ogni singolo sito: quando ricevono una query per un dominio che non conoscono restituiscono l'indirizzo dei server responsabili del Top Level Domain corrispondente, ad esempio i server che gestiscono tutti i domini .com o .it.",
    whyOthersAreWrong: {
      "Gli indirizzi dell'host richiesto":
        "L'indirizzo finale dell'host è noto al server autoritativo della zona, non ai root server.",
      "Nessun'informazione, mantengono la cache della richiesta":
        "Il caching è tipico dei local DNS server, mentre i root contengono realmente i riferimenti ai TLD.",
      "Gli indirizzi della zona d'interesse":
        "I record di una specifica zona sono mantenuti dal server autoritativo di quella zona, non dalla radice della gerarchia.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Gerarchia DNS: root, TLD e server autoritativi.",
      "Il root non sa dove sta il sito: sa a chi chiedere, cioè al TLD competente.",
      "Ogni livello DNS ti passa al livello più specifico: root → TLD → autoritativo → IP.",
      "Qual è la sequenza di server interrogati in una risoluzione DNS iterativa completa?",
    ),
  },
  {
    id: "hist-010",
    category: "Internet",
    topic: "DNS",
    difficulty: "facile",
    question:
      "Indicare quale protocollo utilizza DNS nella fase di ricerca dell'indirizzo.",
    options: [
      "DHCP",
      "ARP",
      "UDP",
      "TCP",
    ],
    correctAnswer:
      "UDP",
    explanation:
      "Nella fase comune di risoluzione, quando un client chiede l'indirizzo IP di un dominio, il DNS utilizza il protocollo di trasporto UDP sulla porta 53. La motivazione è la velocità: essendo connectionless, UDP non richiede l'handshake a tre vie tipico di TCP, e poiché una richiesta DNS è composta da un solo pacchetto di domanda e uno di risposta, l'uso di TCP raddoppierebbe inutilmente il tempo di attesa.",
    whyOthersAreWrong: {
      "DHCP":
        "DHCP serve ad assegnare dinamicamente la configurazione di rete a un host, non è un protocollo di trasporto usato dal DNS.",
      "ARP":
        "ARP risolve indirizzi IP in indirizzi MAC nella rete locale e opera a un livello diverso da quello di trasporto.",
      "TCP":
        "TCP viene usato dal DNS solo in casi particolari, come il trasferimento di zona o risposte che superano i 512 byte, non nella normale fase di lookup.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Scelta del protocollo di trasporto nel DNS e relative eccezioni.",
      "Lookup DNS su UDP porta 53; TCP solo per zone transfer o risposte molto grandi.",
      "Una domanda e una risposta: perché aprire una connessione per due pacchetti?",
      "In quali situazioni il DNS ricorre al protocollo TCP invece che a UDP?",
    ),
  },
  {
    id: "hist-011",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "media",
    question:
      "Quale affermazione descrive correttamente il campo Header Checksum dell'intestazione IPv4?",
    options: [
      "Rileva errori solo all'interno dell'intestazione IP e va ricalcolato a ogni router",
      "Rileva errori sull'intero datagramma, intestazione e dati applicativi compresi",
      "Viene calcolato una sola volta dal mittente e non cambia mai lungo il percorso",
      "Sostituisce il checksum del livello di trasporto rendendolo superfluo",
    ],
    correctAnswer:
      "Rileva errori solo all'interno dell'intestazione IP e va ricalcolato a ogni router",
    explanation:
      "L'Header Checksum si trova nella terza parola dell'intestazione IPv4, subito dopo i campi Time To Live e Protocol, e serve a rilevare bit errati esclusivamente all'interno dell'intestazione IP: non controlla i dati del payload, che hanno un proprio checksum a livello di trasporto. Poiché il TTL viene decrementato a ogni hop, l'intestazione cambia e il checksum deve essere ricalcolato da ogni router lungo il percorso.",
    whyOthersAreWrong: {
      "Rileva errori sull'intero datagramma, intestazione e dati applicativi compresi":
        "Il controllo sui dati applicativi è compito del checksum TCP o UDP, che copre header e payload del segmento più uno pseudo-header.",
      "Viene calcolato una sola volta dal mittente e non cambia mai lungo il percorso":
        "È falso proprio perché il TTL cambia a ogni hop: il checksum diventerebbe immediatamente non valido.",
      "Sostituisce il checksum del livello di trasporto rendendolo superfluo":
        "I due controlli coprono porzioni diverse del pacchetto e sono complementari, non alternativi.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Ambito di copertura del checksum IP rispetto a quello di trasporto.",
      "Il checksum IP protegge solo l'header e si ricalcola a ogni hop perché il TTL cambia.",
      "IP controlla la busta, TCP controlla la lettera dentro la busta.",
      "Quali campi dell'intestazione IP vengono modificati da un router durante l'inoltro?",
    ),
  },
  {
    id: "hist-012",
    category: "Internet",
    topic: "switch",
    difficulty: "facile",
    question:
      "Come funziona l'auto-apprendimento degli switch Ethernet?",
    options: [
      "Gli switch richiedono agli amministratori di rete di fornire informazioni sugli indirizzi MAC dei dispositivi",
      "Gli switch monitorano i pacchetti in rete per apprendere gli indirizzi MAC dei dispositivi connessi",
      "Gli switch utilizzano protocolli di routing per apprendere le rotte disponibili nella rete",
      "Questa funzione non è prevista in questo tipo di switch",
    ],
    correctAnswer:
      "Gli switch monitorano i pacchetti in rete per apprendere gli indirizzi MAC dei dispositivi connessi",
    explanation:
      "Gli switch Ethernet costruiscono la propria tabella di inoltro in modo dinamico e autonomo, con un meccanismo detto backward learning. Quando un frame arriva su un'interfaccia, il dispositivo esamina l'indirizzo MAC sorgente e impara che quel dispositivo si trova collegato a quella porta, memorizzando l'associazione nella CAM table.",
    whyOthersAreWrong: {
      "Gli switch richiedono agli amministratori di rete di fornire informazioni sugli indirizzi MAC dei dispositivi":
        "La configurazione manuale è possibile ma non è il funzionamento normale: l'apprendimento è automatico e non richiede intervento umano.",
      "Gli switch utilizzano protocolli di routing per apprendere le rotte disponibili nella rete":
        "I protocolli di routing operano a livello 3 sugli indirizzi IP, mentre lo switch lavora a livello 2 sugli indirizzi MAC.",
      "Questa funzione non è prevista in questo tipo di switch":
        "L'auto-apprendimento è proprio la caratteristica distintiva degli switch Ethernet rispetto agli hub.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Backward learning e costruzione della CAM table.",
      "Lo switch impara guardando il MAC sorgente dei frame in ingresso e la porta da cui arrivano.",
      "Impara da chi parla, non da chi ascolta: si guarda sempre il MAC sorgente.",
      "Cosa fa uno switch quando riceve un frame per un MAC non presente nella sua tabella?",
    ),
  },
  {
    id: "hist-013",
    category: "Internet",
    topic: "sliding window",
    difficulty: "media",
    question:
      "Quale delle seguenti affermazioni descrive il parametro receive window?",
    options: [
      "Non viene comunicato al mittente la sua dimensione",
      "Fornisce al mittente un'indicazione dello spazio libero nel ricevente",
      "Nessuna delle precedenti",
      "Indica la quantità di dati ricevuta dal destinatario",
    ],
    correctAnswer:
      "Fornisce al mittente un'indicazione dello spazio libero nel ricevente",
    explanation:
      "Il campo receive window, spesso abbreviato in rwnd, è il meccanismo principale con cui TCP implementa il controllo di flusso. Ogni volta che il destinatario invia un segmento, tipicamente un ACK, inserisce in questo campo a 16 bit il numero di byte che è attualmente in grado di accettare nel proprio buffer. Serve a garantire che un mittente veloce non inondi un ricevitore lento.",
    whyOthersAreWrong: {
      "Non viene comunicato al mittente la sua dimensione":
        "È esattamente il contrario: il valore viene annunciato esplicitamente nell'header di ogni segmento inviato dal ricevitore.",
      "Nessuna delle precedenti":
        "Una delle opzioni descrive correttamente il parametro, quindi questa alternativa non è valida.",
      "Indica la quantità di dati ricevuta dal destinatario":
        "La quantità di dati già ricevuta è comunicata dal numero di acknowledgment, non dalla finestra di ricezione, che indica invece lo spazio ancora libero.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Controllo di flusso TCP tramite finestra di ricezione.",
      "rwnd = spazio libero residuo nel buffer del ricevitore, annunciato a ogni segmento.",
      "Non è quanto ho ricevuto, è quanto ancora ci sta: è una capienza, non un conteggio.",
      "Qual è la differenza tra receive window e congestion window in TCP?",
    ),
  },
  {
    id: "hist-014",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "media",
    question:
      "Quando un host invia un datagramma, come viene determinato se il destinatario è nella stessa rete o in una remota?",
    options: [
      "Si usa la maschera di rete (CIDR) per confrontare l'indirizzo sorgente con quello di destinazione",
      "Si verifica se esiste un router di default",
      "Si confrontano gli indirizzi MAC del mittente e del destinatario",
      "Non viene fatto niente, sarà il router a gestire il datagramma",
    ],
    correctAnswer:
      "Si usa la maschera di rete (CIDR) per confrontare l'indirizzo sorgente con quello di destinazione",
    explanation:
      "Prima di trasmettere, l'host esegue un AND logico tra il proprio IP e la propria subnet mask per ottenere il proprio ID di rete, e ripete l'operazione con l'IP di destinazione usando la stessa maschera. Se i due ID di rete coincidono la destinazione è locale e l'host cercherà direttamente il MAC del destinatario tramite ARP; se sono diversi invierà il pacchetto al MAC del default gateway.",
    whyOthersAreWrong: {
      "Si verifica se esiste un router di default":
        "Il default gateway viene usato solo dopo aver stabilito che la destinazione è remota: è la conseguenza della decisione, non il criterio con cui la si prende.",
      "Si confrontano gli indirizzi MAC del mittente e del destinatario":
        "Il MAC del destinatario remoto non è nemmeno noto all'host e gli indirizzi fisici non contengono informazione di rete.",
      "Non viene fatto niente, sarà il router a gestire il datagramma":
        "L'host deve decidere da solo a quale MAC consegnare il frame, altrimenti non saprebbe nemmeno a chi inviarlo sul segmento locale.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Test locale/remoto tramite AND con la subnet mask.",
      "Stessa rete: ARP diretto al destinatario. Rete diversa: frame verso il MAC del gateway.",
      "Prima di parlare l'host si chiede: 'sei il mio vicino di casa o abiti lontano?'.",
      "A quale indirizzo MAC viene inviato un frame destinato a un host di una rete remota?",
    ),
  },
  {
    id: "hist-015",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "facile",
    question:
      "Indicare quale dei seguenti campi del datagramma IP viene decrementato da ogni router attraversato.",
    options: [
      "Checksum",
      "Protocol number",
      "TOS",
      "TTL",
    ],
    correctAnswer:
      "TTL",
    explanation:
      "Il campo Time To Live serve a evitare che i pacchetti IP vaghino all'infinito nella rete a causa di loop di routing. Il mittente imposta un valore iniziale, tipicamente 64 o 128, e ogni router che riceve e inoltra il pacchetto decrementa il valore di uno. Se il valore raggiunge lo zero il router scarta il pacchetto e invia al mittente un messaggio ICMP Time Exceeded, principio su cui si basa il comando traceroute.",
    whyOthersAreWrong: {
      "Checksum":
        "L'header checksum viene ricalcolato dal router perché il TTL è cambiato, ma non viene decrementato: è un valore di controllo, non un contatore.",
      "Protocol number":
        "Il campo Protocol identifica il protocollo di livello superiore trasportato, ad esempio TCP o UDP, e resta invariato lungo il percorso.",
      "TOS":
        "Il campo Type Of Service indica il trattamento desiderato per il pacchetto e non viene decrementato hop by hop.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Funzione del TTL e prevenzione dei loop di instradamento.",
      "Il TTL è un contatore di salti residui: a zero il pacchetto muore e nasce un ICMP Time Exceeded.",
      "TTL = vite rimaste. Ogni router ne toglie una.",
      "Su quale meccanismo dell'header IP si basa il funzionamento di traceroute?",
    ),
  },
  {
    id: "hist-016",
    category: "Internet",
    topic: "Introduzione a Internet",
    difficulty: "difficile",
    question:
      "Supponendo che le velocità di trasmissione fra il commutatore e gli host siano R1 e R2, e che il commutatore adotti la strategia store-and-forward, qual è il ritardo totale da un capo all'altro per inviare un pacchetto di lunghezza L, ignorando i ritardi di accodamento, propagazione ed elaborazione?",
    options: [
      "2L/R2",
      "L/R1 + L/R2",
      "L/(R1 + R2)",
      "L/R1",
    ],
    correctAnswer:
      "L/R1 + L/R2",
    explanation:
      "Il meccanismo store-and-forward implica che il commutatore debba ricevere l'intero pacchetto prima di poter iniziare a trasmettere il primo bit sul collegamento successivo. Il tempo per inviare il pacchetto di lunghezza L alla velocità R1 è L/R1; solo dopo aver ricevuto l'ultimo bit lo switch inizia a trasmettere verso la destinazione alla velocità R2, impiegando L/R2. Il ritardo totale è quindi la somma dei due tempi di trasmissione.",
    whyOthersAreWrong: {
      "2L/R2":
        "Assume che entrambi i collegamenti abbiano velocità R2, ignorando completamente il primo tratto che viaggia a R1.",
      "L/(R1 + R2)":
        "Sommare le velocità presupporrebbe una trasmissione parallela sui due collegamenti, mentre lo store-and-forward li rende rigorosamente sequenziali.",
      "L/R1":
        "Considera solo il primo tratto e trascura il tempo necessario allo switch per ritrasmettere il pacchetto verso la destinazione.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Ritardo di trasmissione e semantica dello store-and-forward.",
      "Con store-and-forward i tempi di trasmissione dei singoli link si sommano, non si sovrappongono.",
      "Il pacchetto deve entrare tutto prima di poter uscire: ogni salto costa un L/R intero.",
      "Qual è il ritardo end-to-end per un pacchetto su N collegamenti tutti di velocità R con store-and-forward?",
    ),
  },
  {
    id: "hist-017",
    category: "Internet",
    topic: "switch",
    difficulty: "difficile",
    question:
      "In una LAN quattro host sono collegati a uno switch: PC1 sulla porta 4, PC3 sulla porta 2, PC4 sulla porta 1 e PC2 sulla porta 3. La MAC address table contiene solo due voci, quelle relative alla porta 1 e alla porta 3. Se PC1 invia un frame destinato a PC3, qual è il comportamento dello switch?",
    options: [
      "Lo switch invia il frame solo alla porta 2",
      "Lo switch invia il frame a tutte le porte eccetto la 4",
      "Lo switch scarta il frame",
      "Lo switch invia il frame a tutte le porte",
    ],
    correctAnswer:
      "Lo switch invia il frame a tutte le porte eccetto la 4",
    explanation:
      "La tabella di inoltro non contiene alcuna voce per PC3, che si trova sulla porta 2, quindi lo switch non sa dove sia il destinatario: siamo nel caso di unknown unicast. Per garantire comunque la consegna lo switch ricorre al flooding, inoltrando il frame su tutte le interfacce attive tranne quella da cui il frame è arrivato, cioè la porta 4 collegata al mittente PC1, così da evitare di rimandarlo indietro.",
    whyOthersAreWrong: {
      "Lo switch invia il frame solo alla porta 2":
        "Sarebbe il comportamento corretto solo se il MAC di PC3 fosse già presente in tabella, ma la porta 2 non compare tra le voci apprese.",
      "Lo switch scarta il frame":
        "Lo switch non scarta i frame con destinazione sconosciuta: è proprio per questo che esiste il meccanismo di flooding.",
      "Lo switch invia il frame a tutte le porte":
        "Il frame non viene mai reinviato sulla porta di ingresso, altrimenti tornerebbe al mittente e si rischierebbero loop.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Gestione dell'unknown unicast e flooding selettivo.",
      "MAC sconosciuto significa flooding su tutte le porte tranne quella di provenienza.",
      "Lo switch grida a tutti tranne che a chi gli ha appena parlato.",
      "Come si comporta uno switch quando riceve un frame destinato all'indirizzo di broadcast?",
    ),
  },
  {
    id: "hist-018",
    category: "Internet",
    topic: "DHCP",
    difficulty: "facile",
    question:
      "Quale protocollo è usato per ottenere dinamicamente un indirizzo IP in una rete locale?",
    options: [
      "DNS",
      "DHCP",
      "ARP",
      "Ethernet",
    ],
    correctAnswer:
      "DHCP",
    explanation:
      "DHCP è un protocollo di livello applicativo che permette a un server di assegnare automaticamente indirizzi IP e altri parametri di configurazione come subnet mask, gateway predefinito e server DNS ai client della rete. Questo semplifica la gestione evitando la configurazione manuale con IP statico su ogni host.",
    whyOthersAreWrong: {
      "DNS":
        "Il DNS traduce nomi di dominio in indirizzi IP, ma non assegna alcun indirizzo agli host.",
      "ARP":
        "ARP risolve un indirizzo IP già noto nel corrispondente indirizzo MAC per la consegna locale, non distribuisce configurazioni.",
      "Ethernet":
        "Ethernet è lo standard tecnologico dei livelli fisico e data link, non un protocollo di configurazione IP.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Ruolo del DHCP nella configurazione automatica degli host.",
      "DHCP assegna IP, maschera, gateway e DNS; ARP e DNS risolvono, non assegnano.",
      "DHCP ti dà l'indirizzo, DNS ti dà il nome, ARP ti dà la scheda di rete.",
      "Quali parametri di rete oltre all'indirizzo IP può fornire un server DHCP?",
    ),
  },
  {
    id: "hist-019",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "facile",
    question:
      "Indicare come viene modificato il campo TTL dei datagrammi IP ogni volta che attraversa un router.",
    options: [
      "Il campo TTL viene incrementato di uno",
      "Il campo TTL non viene modificato se non ci sono errori",
      "Il campo TTL viene reinizializzato a zero",
      "Il campo TTL viene decrementato di uno",
    ],
    correctAnswer:
      "Il campo TTL viene decrementato di uno",
    explanation:
      "Il campo Time To Live impedisce che i pacchetti circolino all'infinito nella rete a causa di cicli di instradamento. Ogni router che riceve un pacchetto IP deve obbligatoriamente decrementare il valore del TTL di almeno uno prima di inoltrarlo; se il valore raggiunge lo zero il router scarta il pacchetto e invia al mittente un messaggio ICMP di tipo Time Exceeded.",
    whyOthersAreWrong: {
      "Il campo TTL viene incrementato di uno":
        "Un incremento renderebbe il meccanismo inutile: il pacchetto non scadrebbe mai e i loop non verrebbero interrotti.",
      "Il campo TTL non viene modificato se non ci sono errori":
        "Il decremento avviene sempre, indipendentemente dalla presenza di errori: è la regola base dell'inoltro IP.",
      "Il campo TTL viene reinizializzato a zero":
        "Azzerare il TTL a ogni hop farebbe scartare immediatamente ogni pacchetto già al primo router.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Decremento del TTL hop by hop e messaggio ICMP Time Exceeded.",
      "Ogni router toglie uno al TTL; a zero il pacchetto viene scartato con notifica ICMP al mittente.",
      "Il TTL è un conto alla rovescia di salti, non un contatore che cresce.",
      "Quale messaggio ICMP viene generato quando il TTL di un datagramma raggiunge lo zero?",
    ),
  },
  {
    id: "hist-020",
    category: "Internet",
    topic: "MAC address",
    difficulty: "facile",
    question:
      "Quale fra i seguenti è un indirizzo di broadcast a livello data-link?",
    options: [
      "01-00-5E-00-00-03",
      "00-26-0F-4B-00-3E",
      "FF-FF-FF-FF-FF-FF",
      "E5C-26-0A-4B-19-3E",
    ],
    correctAnswer:
      "FF-FF-FF-FF-FF-FF",
    explanation:
      "A livello data link l'indirizzo speciale riservato alla comunicazione broadcast, cioè destinata a tutti i dispositivi della rete locale, è costituito da 48 bit tutti impostati a 1. Poiché ogni cifra esadecimale rappresenta 4 bit, un indirizzo di 48 bit a uno si scrive come una sequenza di dodici F, tipicamente raggruppate a coppie.",
    whyOthersAreWrong: {
      "01-00-5E-00-00-03":
        "Il prefisso 01-00-5E identifica un indirizzo multicast, usato per mappare gruppi multicast IP su Ethernet, non il broadcast.",
      "00-26-0F-4B-00-3E":
        "È un normale indirizzo unicast assegnato a una singola scheda di rete.",
      "E5C-26-0A-4B-19-3E":
        "Non è nemmeno un indirizzo sintatticamente valido: il primo gruppo contiene tre cifre esadecimali invece di due.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Indirizzi Ethernet unicast, multicast e broadcast.",
      "Broadcast di livello 2 = tutti i 48 bit a uno = FF:FF:FF:FF:FF:FF.",
      "Tutti a uno significa 'a tutti'. Se vedi solo F, è broadcast.",
      "Qual è l'indirizzo di destinazione usato nel frame di una ARP request?",
    ),
  },
  {
    id: "hist-021",
    category: "Internet",
    topic: "Ethernet",
    difficulty: "media",
    question:
      "In quale protocollo è utilizzato l'algoritmo di backoff esponenziale binario?",
    options: [
      "PIGGYBACK",
      "CSMA/CA",
      "GOBACK-N",
      "CSMA/CD",
    ],
    correctAnswer:
      "CSMA/CD",
    explanation:
      "In una rete Ethernet cablata, quando due stazioni trasmettono contemporaneamente avviene una collisione. Per risolverla le stazioni coinvolte interrompono la trasmissione e attendono un tempo casuale prima di riprovare: l'algoritmo di backoff esponenziale binario determina questo tempo raddoppiando l'intervallo di estrazione a ogni collisione consecutiva, riducendo drasticamente la probabilità che le stazioni scelgano di nuovo lo stesso istante.",
    whyOthersAreWrong: {
      "PIGGYBACK":
        "Il piggybacking è la tecnica che trasporta riscontri e dati nella stessa unità informativa, non ha nulla a che vedere con la gestione delle collisioni.",
      "CSMA/CA":
        "Anche il Wi-Fi usa un meccanismo di backoff, ma il termine backoff esponenziale binario è storicamente e tecnicamente associato allo standard Ethernet 802.3 e al rilevamento delle collisioni.",
      "GOBACK-N":
        "Go-Back-N è un protocollo di trasferimento affidabile a finestra del livello di trasporto o collegamento, estraneo all'accesso al mezzo condiviso.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Risoluzione delle collisioni in Ethernet e crescita esponenziale della finestra di contesa.",
      "Dopo m collisioni la stazione estrae k in [0, 2^m − 1] e attende k volte 512 bit-time.",
      "Più ci si scontra, più si aspetta: l'intervallo raddoppia a ogni scontro.",
      "Dopo quante collisioni consecutive un frame Ethernet viene definitivamente scartato?",
    ),
  },
  {
    id: "hist-022",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "media",
    question:
      "Durante la comunicazione tra due host che attraversa più router, cosa accade agli indirizzi?",
    options: [
      "Gli indirizzi IP e gli indirizzi MAC variano in ogni tratto intermedio",
      "Gli indirizzi IP rimangono fissi mentre gli indirizzi MAC variano in ogni tratto",
      "Gli indirizzi IP e gli indirizzi MAC rimangono fissi lungo tutto il percorso",
      "Gli indirizzi IP contenuti nei vari pacchetti variano in ogni tratto di collegamento fra i router",
    ],
    correctAnswer:
      "Gli indirizzi IP rimangono fissi mentre gli indirizzi MAC variano in ogni tratto",
    explanation:
      "Gli indirizzi IP sorgente e destinazione identificano i capolinea della comunicazione e devono restare invariati per tutto il viaggio, salvo scenari con NAT: è il principio end-to-end. Gli indirizzi MAC servono invece solo a spostare il frame da un dispositivo al successivo all'interno della stessa rete locale, quindi ogni router rimuove il vecchio header di livello 2 e ne crea uno nuovo con il proprio MAC come sorgente e quello del next hop come destinazione.",
    whyOthersAreWrong: {
      "Gli indirizzi IP e gli indirizzi MAC variano in ogni tratto intermedio":
        "Se cambiassero anche gli IP il pacchetto perderebbe l'informazione su mittente e destinatario finali e non potrebbe essere consegnato né riscontrato.",
      "Gli indirizzi IP e gli indirizzi MAC rimangono fissi lungo tutto il percorso":
        "I MAC hanno significato solo sul singolo segmento locale: non possono restare gli stessi attraversando reti diverse.",
      "Gli indirizzi IP contenuti nei vari pacchetti variano in ogni tratto di collegamento fra i router":
        "È esattamente il contrario di quanto avviene nel normale instradamento IP senza NAT.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Principio end-to-end degli indirizzi IP contro l'indirizzamento hop-by-hop dei MAC.",
      "IP = destinazione finale invariata; MAC = prossimo salto, riscritto a ogni router.",
      "L'IP è l'indirizzo scritto sulla lettera, il MAC è il postino del tratto successivo.",
      "Quali operazioni compie un router sull'intestazione di livello 2 di un pacchetto in transito?",
    ),
  },
  {
    id: "hist-023",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "difficile",
    question:
      "Indicare quale affermazione relativa all'algoritmo di Dijkstra utilizzato per il routing è errata.",
    options: [
      "Utilizza il flooding per inviare le informazioni agli altri router",
      "Centralizzato",
      "Dinamico",
      "Distribuito",
    ],
    correctAnswer:
      "Distribuito",
    explanation:
      "Nei testi di riferimento gli algoritmi di routing si dividono in globali, di tipo link state come Dijkstra, e decentrati o distribuiti, di tipo distance vector basati su Bellman-Ford. Dijkstra richiede una conoscenza completa e centralizzata della topologia: ogni router possiede la mappa completa della rete e calcola localmente i cammini minimi su quei dati globali, quindi definirlo distribuito è scorretto.",
    whyOthersAreWrong: {
      "Utilizza il flooding per inviare le informazioni agli altri router":
        "È vero: il flooding è il meccanismo con cui i protocolli link state diffondono le informazioni sullo stato dei collegamenti a tutta la rete.",
      "Centralizzato":
        "È vero nel senso che l'algoritmo lavora su un database che rappresenta la visione globale della rete, come se avesse una vista centrale.",
      "Dinamico":
        "È vero: l'algoritmo reagisce automaticamente ai cambiamenti della topologia.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Classificazione degli algoritmi di routing in globali e decentrati.",
      "Dijkstra è link state e lavora su informazione globale; distribuito è invece il distance vector.",
      "Chi ha la mappa intera non è distribuito: il distribuito si fida solo dei vicini.",
      "Su quale equazione si basano invece gli algoritmi di tipo distance vector?",
    ),
  },
  {
    id: "hist-024",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "media",
    question:
      "Quale delle seguenti definizioni è più corretta per definire il TCP MSS (Maximum Segment Size)?",
    options: [
      "Tutti i dati inclusi nel segmento TCP includendo solo le intestazioni TCP e IP",
      "Tutti i dati inclusi nel segmento TCP compreso le intestazioni del livello 2, IP e TCP",
      "Tutti i dati inclusi nel segmento TCP inclusa solo l'intestazione TCP",
      "Tutti i dati inclusi nel segmento TCP escludendo tutte le intestazioni",
    ],
    correctAnswer:
      "Tutti i dati inclusi nel segmento TCP escludendo tutte le intestazioni",
    explanation:
      "Il Maximum Segment Size definisce la quantità massima di dati applicativi, cioè di payload, che un host è disposto ad accettare in un singolo segmento TCP. Nonostante il nome faccia pensare all'intero segmento, il valore non include né l'intestazione TCP né quella IP: l'MSS si ricava dall'MTU sottraendo i 20 byte di header IP e i 20 di header TCP, per cui con MTU 1500 l'MSS tipico è 1460 byte.",
    whyOthersAreWrong: {
      "Tutti i dati inclusi nel segmento TCP includendo solo le intestazioni TCP e IP":
        "Se comprendesse gli header il valore coinciderebbe con l'MTU, non con l'MSS che è esattamente l'MTU meno gli header.",
      "Tutti i dati inclusi nel segmento TCP compreso le intestazioni del livello 2, IP e TCP":
        "L'MSS è un parametro del livello di trasporto e non tiene conto dell'incapsulamento di livello 2.",
      "Tutti i dati inclusi nel segmento TCP inclusa solo l'intestazione TCP":
        "Anche i soli 20 byte di header TCP sono esclusi dal conteggio dell'MSS.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Relazione tra MTU e MSS.",
      "MSS = MTU − header IP (20) − header TCP (20). Con MTU 1500 si ottiene 1460.",
      "Il nome inganna: 'Segment Size' misura solo i dati, non il segmento intero.",
      "Quanto vale l'MSS su un collegamento Ethernet standard e come si calcola?",
    ),
  },
  {
    id: "hist-025",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "facile",
    question:
      "Qual è il significato dell'acronimo CIDR?",
    options: [
      "Classless Inter-Domain Routing",
      "Classless Internet Destination Routing",
      "Classfull Inter-Destination Routing",
      "Classfull Identification Routing",
    ],
    correctAnswer:
      "Classless Inter-Domain Routing",
    explanation:
      "Introdotto nel 1993, il CIDR è nato per sostituire la vecchia architettura di indirizzamento classful basata sulle classi rigide A, B e C, che stava portando al rapido esaurimento degli indirizzi IPv4 e all'esplosione delle tabelle di routing. Il termine classless indica che non si seguono più le regole rigide delle classi e permette di assegnare blocchi con maschere di lunghezza arbitraria, oltre a consentire l'aggregazione di più reti contigue in un'unica voce di routing.",
    whyOthersAreWrong: {
      "Classless Internet Destination Routing":
        "Le parole Internet e Destination non fanno parte dell'acronimo: il riferimento corretto è a Inter-Domain.",
      "Classfull Inter-Destination Routing":
        "Classful è esattamente il modello che il CIDR ha superato, quindi il termine è in contraddizione con il concetto stesso.",
      "Classfull Identification Routing":
        "Sia Classful sia Identification sono errati: il CIDR è classless e riguarda l'instradamento tra domini.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Passaggio dall'indirizzamento classful al CIDR e route aggregation.",
      "CIDR = Classless Inter-Domain Routing: maschere di lunghezza libera e aggregazione delle rotte.",
      "La parola chiave è Classless: se un'opzione dice Classful, è sbagliata per definizione.",
      "Quale vantaggio introduce la route aggregation resa possibile dal CIDR?",
    ),
  },
  {
    id: "hist-026",
    category: "Internet",
    topic: "ARP",
    difficulty: "facile",
    question:
      "A cosa serve il protocollo ARP?",
    options: [
      "Trova l'indirizzo IP dato l'indirizzo MAC",
      "Trova l'indirizzo MAC dato l'indirizzo IP",
      "Risolvere il campo TYPE dell'indirizzo MAC",
      "Trova l'indirizzo del router",
    ],
    correctAnswer:
      "Trova l'indirizzo MAC dato l'indirizzo IP",
    explanation:
      "Per inviare un frame Ethernet all'interno di una rete locale il mittente deve conoscere l'indirizzo fisico del destinatario, mentre le applicazioni lavorano con indirizzi logici IP. L'Address Resolution Protocol colma questa distanza: il mittente invia in broadcast una ARP request chiedendo chi possiede un dato indirizzo IP, il dispositivo interessato risponde in unicast con il proprio MAC, e la coppia viene salvata nella ARP table per evitare di ripetere la richiesta.",
    whyOthersAreWrong: {
      "Trova l'indirizzo IP dato l'indirizzo MAC":
        "Questa è la funzione inversa svolta da RARP, protocollo ormai obsoleto e sostituito da DHCP.",
      "Risolvere il campo TYPE dell'indirizzo MAC":
        "Il campo Type appartiene all'intestazione del frame Ethernet e indica il protocollo trasportato: non viene risolto da ARP.",
      "Trova l'indirizzo del router":
        "L'indirizzo del gateway è un parametro di configurazione ottenuto staticamente o via DHCP, non scoperto da ARP.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Risoluzione IP verso MAC e caching ARP.",
      "ARP chiede in broadcast 'chi ha questo IP?' e riceve in unicast il MAC corrispondente.",
      "ARP va da logico a fisico: parti dall'IP, arrivi alla scheda di rete.",
      "Quale informazione è l'unica sconosciuta al mittente in un pacchetto di ARP request?",
    ),
  },
  {
    id: "hist-027",
    category: "Internet",
    topic: "sliding window",
    difficulty: "difficile",
    question:
      "Nella macchina a stati finiti del protocollo RDT 3.0 lato sender, quale evento provoca la ritrasmissione del pacchetto e il riavvio del timer restando nello stesso stato di attesa dell'ACK?",
    options: [
      "Ricezione di dati dal livello superiore",
      "Ricezione di un pacchetto corrotto",
      "Ricezione di un ack",
      "Timeout",
    ],
    correctAnswer:
      "Timeout",
    explanation:
      "RDT 3.0 è un protocollo stop-and-wait progettato per canali con perdita di pacchetti. Nella sua macchina a stati la transizione che parte dallo stato di attesa dell'ACK e vi ritorna, eseguendo udt_send del pacchetto e start_timer, è innescata dallo scadere del tempo massimo di attesa: se il timer scade senza aver ricevuto l'ACK il protocollo assume che il pacchetto sia andato perso e lo rimanda.",
    whyOthersAreWrong: {
      "Ricezione di dati dal livello superiore":
        "Questo evento provoca una transizione a partire dagli stati di attesa di chiamata dall'alto, non dallo stato di attesa dell'ACK.",
      "Ricezione di un pacchetto corrotto":
        "Un ACK corrotto viene semplicemente ignorato in attesa del timeout, non provoca da solo la ritrasmissione immediata con riavvio del timer.",
      "Ricezione di un ack":
        "Un ACK valido e atteso fa avanzare il protocollo allo stato successivo e ferma il timer, non causa alcuna ritrasmissione.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Ruolo del timer nei protocolli di trasferimento dati affidabile.",
      "Solo il timeout permette al mittente di reagire alla perdita totale di un pacchetto.",
      "Checksum e numeri di sequenza gestiscono errori e duplicati; contro la perdita serve il timer.",
      "Perché nei protocolli rdt viene introdotto il timer e quale problema risolve rispetto a checksum e ACK?",
    ),
  },
  {
    id: "hist-028",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "media",
    question:
      "Se si considera il funzionamento dei proxy HTTP (web cache), indicare quale delle seguenti affermazioni è vera.",
    options: [
      "Il proxy HTTP è un dispositivo di rete che serve a mascherare gli indirizzi IP",
      "Un proxy HTTP ha sempre nella sua cache gli oggetti richiesti dai client",
      "Un proxy HTTP usa il GET condizionale per gestire l'aggiornamento degli oggetti nella propria cache",
      "Il proxy HTTP serve principalmente per bilanciare le richieste che vengono fatte ai server web",
    ],
    correctAnswer:
      "Un proxy HTTP usa il GET condizionale per gestire l'aggiornamento degli oggetti nella propria cache",
    explanation:
      "Il problema principale di una web cache è assicurarsi che i dati salvati localmente siano ancora aggiornati rispetto al server originale. Per verificarlo il proxy invia una richiesta includendo l'header If-Modified-Since: se l'oggetto non è cambiato il server risponde con 304 Not Modified senza reinviare i dati e il proxy usa la copia in cache, altrimenti invia il nuovo oggetto con codice 200 OK.",
    whyOthersAreWrong: {
      "Il proxy HTTP è un dispositivo di rete che serve a mascherare gli indirizzi IP":
        "Il mascheramento degli indirizzi è compito del NAT: la finalità di una web cache è ridurre latenza e traffico.",
      "Un proxy HTTP ha sempre nella sua cache gli oggetti richiesti dai client":
        "La cache contiene solo un sottoinsieme degli oggetti; in caso di miss il proxy deve inoltrare la richiesta al server d'origine.",
      "Il proxy HTTP serve principalmente per bilanciare le richieste che vengono fatte ai server web":
        "Il bilanciamento del carico è una funzione diversa, svolta da load balancer o dal DNS, non lo scopo principale di una cache.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Coerenza della cache HTTP e GET condizionale.",
      "If-Modified-Since più risposta 304 Not Modified: si valida la copia senza riscaricarla.",
      "La cache non chiede 'dammelo', chiede 'è cambiato?'.",
      "Cosa significa il codice di stato HTTP 304 e in quale scenario viene restituito?",
    ),
  },
  {
    id: "hist-029",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "facile",
    question:
      "Indicare quale dei seguenti indirizzi IPv4 non è valido.",
    options: [
      "192.168.1.1",
      "151.97.6.4",
      "1.1.1.1",
      "257.70.3.46",
    ],
    correctAnswer:
      "257.70.3.46",
    explanation:
      "Un indirizzo IPv4 è una stringa di 32 bit divisa in quattro segmenti da 8 bit ciascuno, chiamati ottetti e separati da punti. Con 8 bit a disposizione il valore decimale massimo rappresentabile è 2^8 − 1 = 255, quindi ogni numero deve essere compreso tra 0 e 255. Il valore 257 nel primo ottetto supera il limite consentito e rende l'indirizzo sintatticamente invalido.",
    whyOthersAreWrong: {
      "192.168.1.1":
        "È un indirizzo privato perfettamente valido, molto comune nelle reti domestiche.",
      "151.97.6.4":
        "Tutti gli ottetti rientrano nell'intervallo ammesso, quindi l'indirizzo è sintatticamente corretto.",
      "1.1.1.1":
        "È un indirizzo valido e realmente utilizzato, notoriamente come resolver DNS pubblico.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Sintassi degli indirizzi IPv4 e intervallo ammesso per ogni ottetto.",
      "Quattro ottetti, ciascuno tra 0 e 255: oltre 255 l'indirizzo non è rappresentabile su 8 bit.",
      "Cerca subito il numero maggiore di 255: è sempre quello il trucco della domanda.",
      "Quanti indirizzi distinti sono rappresentabili complessivamente in IPv4 e perché?",
    ),
  },
  {
    id: "hist-030",
    category: "Internet",
    topic: "porte e socket",
    difficulty: "media",
    question:
      "Considerata una connessione TCP fra gli host A e B, supponendo che i segmenti in viaggio da A a B abbiano numero di porta di origine x e numero di porta di destinazione y, quali sono i numeri di porta per i segmenti che viaggiano da B ad A?",
    options: [
      "I valori non dipendono né da x né da y",
      "Porta origine y, porta destinazione x",
      "Porta origine x, porta destinazione y",
      "Porta origine: y+1, porta destinazione x+1",
    ],
    correctAnswer:
      "Porta origine y, porta destinazione x",
    explanation:
      "Una connessione TCP è composta da due flussi di dati e i numeri di porta identificano i processi comunicanti su ciascun host. Nel viaggio da A a B il mittente è A con porta x e il destinatario è B con porta y; nel viaggio di ritorno i ruoli si invertono, quindi B usa la propria porta y come origine e indirizza i pacchetti alla porta x di A come destinazione.",
    whyOthersAreWrong: {
      "I valori non dipendono né da x né da y":
        "I valori dipendono strettamente da x e y: sono gli stessi numeri, semplicemente scambiati di ruolo.",
      "Porta origine x, porta destinazione y":
        "Sarebbe corretto per il verso A verso B, non per il traffico di ritorno, dove mittente e destinatario si invertono.",
      "Porta origine: y+1, porta destinazione x+1":
        "I numeri di porta non vengono incrementati durante la connessione: restano fissi per tutta la sua durata.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Simmetria delle porte nei due versi di una connessione TCP.",
      "Nel verso di ritorno le porte si scambiano semplicemente di ruolo: origine e destinazione si invertono.",
      "Come il mittente e il destinatario di una busta: al ritorno basta girarla.",
      "Quali quattro parametri identificano univocamente una socket TCP?",
    ),
  },
  {
    id: "hist-031",
    category: "Internet",
    topic: "livello collegamento",
    difficulty: "facile",
    question:
      "Che cos'è un Cyclical Redundance Check (CRC)?",
    options: [
      "Una tecnica che permette a più LAN logiche di funzionare sullo stesso dispositivo",
      "I dati effettivamente trasportati da un frame ethernet",
      "Un meccanismo che permette la sincronizzazione dei clock di due computer",
      "Una formula matematica usata per verificare che i dati arrivati siano integri (non modificati)",
    ],
    correctAnswer:
      "Una formula matematica usata per verificare che i dati arrivati siano integri (non modificati)",
    explanation:
      "Il CRC è un codice di rilevazione degli errori utilizzato principalmente nel livello data link, come in Ethernet e Wi-Fi, per garantire l'integrità dei dati. Il mittente tratta i bit del messaggio come un polinomio e lo divide per un polinomio generatore standard: il resto della divisione costituisce il codice CRC, inserito nel campo FCS in coda al frame. Il destinatario ripete l'operazione e, se il risultato non coincide, scarta il pacchetto perché corrotto.",
    whyOthersAreWrong: {
      "Una tecnica che permette a più LAN logiche di funzionare sullo stesso dispositivo":
        "Questa è la definizione di VLAN, un meccanismo di segmentazione logica del tutto estraneo al controllo di errore.",
      "I dati effettivamente trasportati da un frame ethernet":
        "I dati trasportati sono il payload del frame, mentre il CRC è un valore di controllo aggiunto nel trailer.",
      "Un meccanismo che permette la sincronizzazione dei clock di due computer":
        "La sincronizzazione dei clock in Ethernet è affidata al preambolo, non al CRC.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Rilevazione degli errori tramite CRC e campo FCS.",
      "Il CRC è il resto di una divisione polinomiale: se non torna, il frame viene scartato.",
      "Il CRC rileva l'errore ma non lo corregge: chi sbaglia viene buttato, non riparato.",
      "In quale parte del frame Ethernet è contenuto il valore calcolato con il CRC?",
    ),
  },
  {
    id: "hist-032",
    category: "Internet",
    topic: "Ethernet",
    difficulty: "facile",
    question:
      "Quante coppie di fili in rame sono presenti in un cavo UTP?",
    options: [
      "4",
      "5",
      "2",
      "8",
    ],
    correctAnswer:
      "4",
    explanation:
      "Un cavo UTP standard usato nelle reti Ethernet contiene al suo interno otto fili conduttori in rame, intrecciati a due a due per formare quattro coppie. L'operazione di intreccio è fondamentale per annullare le interferenze elettromagnetiche generate dai cavi adiacenti. Le quattro coppie sono identificate dai colori standard arancione, verde, blu e marrone e i cavi terminano solitamente con connettori RJ-45.",
    whyOthersAreWrong: {
      "2":
        "Due coppie erano sufficienti per il vecchio 10BASE-T e 100BASE-TX, ma il cavo ne contiene comunque quattro.",
      "5":
        "Non corrisponde ad alcuno standard: i cavi UTP per Ethernet hanno sempre quattro coppie.",
      "8":
        "Otto è il numero dei singoli fili, non delle coppie: raggruppandoli a due a due si ottengono quattro coppie.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Struttura fisica del cavo UTP e funzione dell'intreccio.",
      "8 fili intrecciati a due a due danno 4 coppie; l'intreccio annulla il crosstalk.",
      "Attenzione al tranello: la domanda chiede le coppie, non i fili.",
      "Che differenza c'è tra un cavo UTP e uno STP?",
    ),
  },
  {
    id: "hist-033",
    category: "Internet",
    topic: "Ethernet",
    difficulty: "media",
    question:
      "Quale affermazione è corretta riguardo allo standard IEEE 802.3?",
    options: [
      "È best effort",
      "Non è usato per reti locali",
      "Ha come modalità CSMA/CA",
      "Riguarda il livello di rete",
    ],
    correctAnswer:
      "È best effort",
    explanation:
      "Lo standard IEEE 802.3, cioè Ethernet, fornisce un servizio connectionless e non affidabile. Non prevede meccanismi di riscontro a livello data link: se un frame viene scartato per errori di CRC o per congestione, il protocollo non lo ritrasmette e si limita a fare del suo meglio per consegnarlo, lasciando il recupero degli errori ai protocolli superiori come TCP.",
    whyOthersAreWrong: {
      "Non è usato per reti locali":
        "È esattamente il contrario: 802.3 è lo standard de facto proprio per le reti locali cablate.",
      "Ha come modalità CSMA/CA":
        "Ethernet usa CSMA/CD con rilevamento delle collisioni; CSMA/CA con collision avoidance è del Wi-Fi 802.11.",
      "Riguarda il livello di rete":
        "Ethernet opera ai livelli fisico e data link, in particolare nel sottolivello MAC, non al livello di rete.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Natura non affidabile del servizio Ethernet e collocazione nello stack.",
      "Ethernet consegna al meglio senza ACK: chi recupera gli errori è il livello di trasporto.",
      "802.3 = cavo = CD (Detection). 802.11 = radio = CA (Avoidance).",
      "Quale livello dello stack si fa carico del recupero degli errori scartati da Ethernet?",
    ),
  },
  {
    id: "hist-034",
    category: "Internet",
    topic: "sliding window",
    difficulty: "difficile",
    question:
      "Indicare l'affermazione NON corretta per un protocollo Go-back-N.",
    options: [
      "Il mittente, quando scatta il timer, trasmette tutti i pacchetti senza riscontro (ack)",
      "Il ricevitore invia solo ack cumulativi",
      "Il mittente attiva un timer per ogni pacchetto senza riscontro (ack)",
      "Il mittente può avere fino a N pacchetti senza riscontro nella pipeline",
    ],
    correctAnswer:
      "Il mittente attiva un timer per ogni pacchetto senza riscontro (ack)",
    explanation:
      "Nel protocollo Go-Back-N il mittente utilizza un solo timer logico, associato al pacchetto più vecchio non ancora riscontrato, cioè alla base della finestra. Se questo timer scade vengono ritrasmessi tutti i pacchetti inviati e non ancora riscontrati. L'affermazione sui timer individuali descrive invece il Selective Repeat, che gestisce un timer per pacchetto per ritrasmettere selettivamente solo quello perso.",
    whyOthersAreWrong: {
      "Il mittente, quando scatta il timer, trasmette tutti i pacchetti senza riscontro (ack)":
        "È vera: è esattamente il comportamento che dà il nome al protocollo, tornare indietro di N e ritrasmettere l'intero blocco.",
      "Il ricevitore invia solo ack cumulativi":
        "È vera: in Go-Back-N l'ACK n conferma la corretta ricezione di tutti i pacchetti fino a n compreso.",
      "Il mittente può avere fino a N pacchetti senza riscontro nella pipeline":
        "È vera: N rappresenta proprio la dimensione della finestra di trasmissione.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Differenze tra Go-Back-N e Selective Repeat nella gestione dei timer.",
      "Go-Back-N: un timer sulla base della finestra. Selective Repeat: un timer per ogni pacchetto.",
      "Un solo timer, una sola marcia indietro in blocco: è il Go-Back-N.",
      "Quale vantaggio offre Selective Repeat rispetto a Go-Back-N in caso di perdita di un singolo pacchetto?",
    ),
  },
  {
    id: "hist-035",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "difficile",
    question:
      "Il funzionamento del protocollo TCP si può definire come?",
    options: [
      "A prova di errori",
      "Connectionless",
      "STOP and WAIT",
      "Un misto tra GOBACK-N e ripetizione selettiva",
    ],
    correctAnswer:
      "Un misto tra GOBACK-N e ripetizione selettiva",
    explanation:
      "TCP non aderisce perfettamente a nessuno dei due modelli teorici puri ma ne combina le caratteristiche migliori. Come Go-Back-N utilizza ACK cumulativi e un unico timer associato al pacchetto più vecchio non riscontrato; come Selective Repeat però bufferizza i segmenti arrivati fuori ordine e, grazie a Fast Retransmit e alle opzioni SACK, evita di ritrasmettere l'intera finestra ritrasmettendo solo il segmento mancante.",
    whyOthersAreWrong: {
      "A prova di errori":
        "Nessun protocollo è a prova di errori: TCP rileva e recupera gli errori, ma non può impedirne il verificarsi sul canale.",
      "Connectionless":
        "TCP è connection-oriented e richiede il three-way handshake prima di scambiare dati; connectionless è UDP.",
      "STOP and WAIT":
        "Stop-and-wait invia un solo pacchetto per volta attendendone il riscontro, mentre TCP usa il pipelining con una finestra.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Natura ibrida dei meccanismi di ritrasmissione di TCP.",
      "ACK cumulativi e timer unico come GBN, ma buffering fuori ordine e SACK come Selective Repeat.",
      "TCP prende il meglio dei due mondi: non è né l'uno né l'altro in forma pura.",
      "Cosa fa TCP quando riceve tre ACK duplicati per lo stesso numero di sequenza?",
    ),
  },
  {
    id: "hist-036",
    category: "Internet",
    topic: "NAT",
    difficulty: "difficile",
    question:
      "Riguardo al NAT, indicare quale delle seguenti affermazioni è corretta.",
    options: [
      "Ogni NAT è in grado di gestire al più 65536 comunicazioni contemporanee",
      "In una rete con dispositivo NAT ci possono essere infiniti host",
      "Il NAT garantisce che non ci siano collisioni all'interno della rete locale",
      "Il NAT garantisce l'anonimato degli utenti",
    ],
    correctAnswer:
      "Ogni NAT è in grado di gestire al più 65536 comunicazioni contemporanee",
    explanation:
      "Nella sua implementazione più comune, il NAT overload o PAT, il router mappa molti indirizzi IP privati su un unico indirizzo pubblico distinguendo le connessioni tramite il numero di porta. Poiché il campo porta nell'header TCP e UDP è di 16 bit, esistono 2^16 = 65536 porte possibili: questo è il limite teorico massimo di connessioni simultanee gestibili attraverso un singolo indirizzo IP pubblico.",
    whyOthersAreWrong: {
      "In una rete con dispositivo NAT ci possono essere infiniti host":
        "Il numero di host è limitato sia dallo spazio di indirizzamento privato sia dal numero di porte disponibili per le traduzioni.",
      "Il NAT garantisce che non ci siano collisioni all'interno della rete locale":
        "Le collisioni sono un fenomeno di livello 2 gestito da switch e protocolli di accesso al mezzo, mentre il NAT opera ai livelli 3 e 4.",
      "Il NAT garantisce l'anonimato degli utenti":
        "Il NAT nasconde gli indirizzi interni verso l'esterno ma non fornisce anonimato: l'ISP conosce l'IP pubblico assegnato e il NAT stesso mantiene la tabella delle traduzioni.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Funzionamento del PAT e limite imposto dal campo porta a 16 bit.",
      "Il NAT distingue le connessioni per porta, quindi il tetto teorico è 65536 per IP pubblico.",
      "Il limite del NAT non è il numero di host, è il numero di porte: 2^16.",
      "Quale principio architetturale di Internet viene violato dall'uso del NAT?",
    ),
  },
  {
    id: "hist-037",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "facile",
    question:
      "Indicare uno degli elementi presenti nell'URL.",
    options: [
      "L'indirizzo MAC del server",
      "Il protocollo usato",
      "L'indirizzo IP del gateway",
      "La versione del browser",
    ],
    correctAnswer:
      "Il protocollo usato",
    explanation:
      "Un URL segue una struttura standardizzata del tipo protocollo://hostname[:porta]/percorso. Il protocollo, detto anche scheme, è il primo elemento visibile, ad esempio http, https, ftp o mailto, e definisce le regole di comunicazione che il browser deve usare per recuperare la risorsa.",
    whyOthersAreWrong: {
      "L'indirizzo MAC del server":
        "Il MAC è un parametro di livello data link, mai presente in un indirizzo web: viene semmai risolto localmente tramite ARP.",
      "L'indirizzo IP del gateway":
        "Il gateway è una configurazione di rete locale del client e non compare in alcun modo nell'URL.",
      "La versione del browser":
        "La versione del browser viaggia nell'header HTTP User-Agent, non fa parte dell'URL.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Sintassi di un URL e significato dello scheme.",
      "URL = protocollo + host + eventuale porta + percorso della risorsa.",
      "Quello che vedi prima dei due punti nella barra degli indirizzi è il protocollo.",
      "Quale porta viene usata implicitamente quando l'URL non la specifica in http e https?",
    ),
  },
  {
    id: "hist-038",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "facile",
    question:
      "Indicare quale protocollo è usato per comunicare gli errori a livello di rete.",
    options: [
      "UDP",
      "ICMP",
      "TCP",
      "Traceroute",
    ],
    correctAnswer:
      "ICMP",
    explanation:
      "Il protocollo IP è best effort e non ha meccanismi interni per segnalare errori. ICMP è il protocollo di supporto usato da router e host per comunicare informazioni di controllo e di errore: viaggia incapsulato direttamente dentro i pacchetti IP ed è considerato parte del livello di rete. Messaggi tipici sono Destination Unreachable e Time Exceeded.",
    whyOthersAreWrong: {
      "UDP":
        "UDP è un protocollo di trasporto per i dati applicativi, non un protocollo di controllo e diagnostica della rete.",
      "TCP":
        "Anche TCP è un protocollo di trasporto: gestisce l'affidabilità del proprio flusso, non la segnalazione di errori di rete.",
      "Traceroute":
        "Traceroute non è un protocollo ma un'applicazione diagnostica, che peraltro utilizza proprio i messaggi ICMP per funzionare.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Ruolo di ICMP come protocollo di controllo del livello di rete.",
      "ICMP non trasporta dati utente: trasporta segnalazioni di errore e diagnostica per IP.",
      "ICMP è il meccanico di IP: non guida, ma ti dice cosa si è rotto.",
      "ICMP viaggia sopra TCP, sopra UDP o direttamente dentro IP?",
    ),
  },
  {
    id: "hist-039",
    category: "Internet",
    topic: "Introduzione a Internet",
    difficulty: "media",
    question:
      "Cos'è il ritardo di propagazione in una rete di comunicazione?",
    options: [
      "Il tempo richiesto per inviare un pacchetto da uno all'altro",
      "Il tempo richiesto per elaborare un pacchetto nei nodi intermedi della rete",
      "Il tempo richiesto per propagare un segnale elettrico o ottico tra due punti nella rete",
      "Il tempo richiesto per effettuare la codifica e la decodifica del pacchetto durante la trasmissione",
    ],
    correctAnswer:
      "Il tempo richiesto per propagare un segnale elettrico o ottico tra due punti nella rete",
    explanation:
      "Il ritardo di propagazione è il tempo necessario affinché un singolo bit viaggi fisicamente attraverso il mezzo trasmissivo, che sia rame, fibra o aria, dal trasmettitore al ricevitore. Si calcola come d/s, dove d è la distanza fisica tra i due nodi e s è la velocità di propagazione del segnale nel mezzo, tipicamente vicina alla velocità della luce.",
    whyOthersAreWrong: {
      "Il tempo richiesto per inviare un pacchetto da uno all'altro":
        "Questo descrive il ritardo di trasmissione, che dipende dalla lunghezza del pacchetto e dalla larghezza di banda, non dalla distanza.",
      "Il tempo richiesto per elaborare un pacchetto nei nodi intermedi della rete":
        "Questo è il ritardo di elaborazione, il tempo che il router impiega ad analizzare l'header e decidere l'inoltro.",
      "Il tempo richiesto per effettuare la codifica e la decodifica del pacchetto durante la trasmissione":
        "La codifica e decodifica non costituiscono una delle quattro componenti classiche del ritardo nodale.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Le quattro componenti del ritardo nodale e loro dipendenze.",
      "Propagazione dipende dalla distanza (d/s), trasmissione dipende dalla banda (L/R).",
      "Propagazione = quanto è lungo il cavo. Trasmissione = quanto è grosso il pacchetto.",
      "Da quali quattro contributi è composto il ritardo nodale totale?",
    ),
  },
  {
    id: "hist-040",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "difficile",
    question:
      "Qual è il corretto suffisso CIDR per una organizzazione che necessita di 1023 indirizzi IP?",
    options: [
      "/21",
      "/24",
      "/22",
      "/23",
    ],
    correctAnswer:
      "/22",
    explanation:
      "Per accomodare 1023 indirizzi bisogna trovare la potenza di due immediatamente superiore o uguale: 2^10 = 1024. Servono quindi 10 bit dedicati alla parte host e, poiché un indirizzo IPv4 è lungo 32 bit, il prefisso di rete risulta 32 − 10 = 22. Una subnet /22 fornisce esattamente 1024 indirizzi totali, il blocco più piccolo capace di contenere la richiesta.",
    whyOthersAreWrong: {
      "/21":
        "Un /21 offre 2^11 = 2048 indirizzi: conterrebbe la richiesta ma sprecherebbe metà del blocco, quindi non è la scelta ottimale.",
      "/24":
        "Un /24 offre solo 2^8 = 256 indirizzi, largamente insufficienti per i 1023 richiesti.",
      "/23":
        "Un /23 offre 2^9 = 512 indirizzi, ancora insufficienti a coprire il fabbisogno.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Dimensionamento di una subnet a partire dal numero di indirizzi richiesti.",
      "Trova la potenza di 2 che copre la richiesta, conta i bit host e sottrai da 32.",
      "1024 = 2^10, quindi 32 − 10 = 22. Ragiona sempre a potenze di due.",
      "Quale prefisso CIDR serve per una rete che deve ospitare 500 host?",
    ),
  },
  {
    id: "hist-041",
    category: "Internet",
    topic: "ARP",
    difficulty: "facile",
    question:
      "Quale protocollo è usato per trovare l'indirizzo della scheda (MAC address) di un dispositivo locale?",
    options: [
      "RIP",
      "ARP",
      "UDP",
      "TCP",
    ],
    correctAnswer:
      "ARP",
    explanation:
      "ARP è il protocollo che funge da ponte tra il livello di rete, dove si usano gli indirizzi IP logici, e il livello data link, dove servono gli indirizzi MAC fisici per la consegna locale. Quando un host deve inviare un pacchetto a un dispositivo della stessa rete locale conosce l'IP di destinazione ma spesso non il MAC, quindi invia una richiesta ARP in broadcast e memorizza la risposta nella cache ARP.",
    whyOthersAreWrong: {
      "RIP":
        "RIP è un protocollo di routing di tipo distance vector che serve a costruire tabelle di instradamento, non a risolvere indirizzi fisici.",
      "UDP":
        "UDP è un protocollo di trasporto: ARP non viaggia nemmeno sopra UDP, ma direttamente dentro i frame Ethernet.",
      "TCP":
        "TCP è un protocollo di trasporto orientato alla connessione e non ha alcun ruolo nella risoluzione degli indirizzi di livello 2.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "ARP come ponte tra indirizzamento logico e fisico.",
      "Serve il MAC di un host sulla mia stessa LAN? Si usa ARP e si mette in cache il risultato.",
      "Address Resolution Protocol: risolve un indirizzo in un altro, da IP a MAC.",
      "Cosa contiene la ARP table e perché viene mantenuta?",
    ),
  },
  {
    id: "hist-042",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "difficile",
    question:
      "L'host A manda due segmenti consecutivi all'host B, il primo di 60 byte e il secondo di 30. Il numero di sequenza del primo è 127, la porta sorgente è 412 e la porta destinazione è 80. Qual è il valore di ack che l'host B manda dopo aver ricevuto il secondo segmento?",
    options: [
      "129",
      "217",
      "216",
      "413",
    ],
    correctAnswer:
      "217",
    explanation:
      "In TCP il numero di riscontro indica sempre il numero di sequenza del prossimo byte che l'host si aspetta di ricevere. Il primo segmento parte da 127 e contiene 60 byte, quindi copre fino al byte 186; il secondo parte da 187 e contiene 30 byte, arrivando fino al byte 216. Avendo ricevuto correttamente tutto fino al 216, l'host B richiede il byte successivo: 127 + 60 + 30 = 217.",
    whyOthersAreWrong: {
      "129":
        "Sarebbe il riscontro di appena due byte a partire da 127, ignorando completamente le dimensioni dei due segmenti.",
      "216":
        "216 è l'ultimo byte effettivamente ricevuto, ma l'ACK indica il prossimo byte atteso, quindi va incrementato di uno.",
      "413":
        "413 deriva dal numero di porta sorgente 412, che non ha alcun rapporto con il calcolo dei numeri di sequenza.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Semantica cumulativa del numero di acknowledgment in TCP.",
      "ACK = numero di sequenza iniziale + totale dei byte ricevuti correttamente.",
      "L'ACK non dice 'ho ricevuto fin qui', dice 'ora mandami questo'.",
      "Se un segmento ha sequence number 201 e lunghezza 100, quale ACK restituisce il destinatario?",
    ),
  },
  {
    id: "hist-043",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "media",
    question:
      "Qual è il meccanismo principale utilizzato dall'algoritmo Distance Vector per scambiare informazioni di routing tra i nodi di una rete?",
    options: [
      "Invio di messaggi di aggiornamento periodici",
      "Invio di richieste di routing specifiche",
      "Invio di tabelle di routing complete",
      "Invio di pacchetti di controllo multicast",
    ],
    correctAnswer:
      "Invio di tabelle di routing complete",
    explanation:
      "Gli algoritmi Distance Vector funzionano secondo un principio iterativo e distribuito nel quale ogni nodo condivide la propria conoscenza della rete, cioè il suo vettore delle distanze, solo con i vicini diretti. A differenza dei link state, che diffondono in flooding lo stato dei collegamenti a tutta la rete, qui ogni router invia ai vicini l'intera lista delle destinazioni raggiungibili con il relativo costo stimato, e il vicino aggiorna la propria tabella applicando l'equazione di Bellman-Ford.",
    whyOthersAreWrong: {
      "Invio di messaggi di aggiornamento periodici":
        "La periodicità è una caratteristica implementativa di protocolli come RIP, ma non descrive che cosa venga effettivamente scambiato.",
      "Invio di richieste di routing specifiche":
        "Il distance vector non funziona a richiesta puntuale: l'aggiornamento è un annuncio spontaneo verso i vicini.",
      "Invio di pacchetti di controllo multicast":
        "Il trasporto multicast è un dettaglio implementativo di alcune versioni, non il meccanismo concettuale dello scambio.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Routing by rumor e scambio dei vettori delle distanze.",
      "Ogni nodo dice ai vicini tutto quello che sa raggiungere e a che costo.",
      "Distance vector = mi fido del sentito dire dei vicini; link state = ho la mappa completa.",
      "Quale problema tipico affligge gli algoritmi distance vector e come viene mitigato?",
    ),
  },
  {
    id: "hist-044",
    category: "Internet",
    topic: "livello collegamento",
    difficulty: "media",
    question:
      "Quale elemento è contenuto nel trailer (coda) del frame data-link?",
    options: [
      "Indirizzo fisico",
      "Dati",
      "Indirizzo logico",
      "Correzione di errore",
    ],
    correctAnswer:
      "Correzione di errore",
    explanation:
      "Un frame data link è composto da tre parti: l'header con le informazioni di indirizzamento fisico e il tipo di protocollo, il payload con il pacchetto del livello superiore, e il trailer finale. Il trailer contiene il campo FCS, all'interno del quale viene inserito il valore calcolato tramite l'algoritmo CRC, che serve al destinatario per verificare che il frame non si sia corrotto durante il viaggio.",
    whyOthersAreWrong: {
      "Indirizzo fisico":
        "Gli indirizzi MAC di sorgente e destinazione si trovano nell'header, all'inizio del frame, non in coda.",
      "Dati":
        "Il payload occupa la parte centrale del frame, tra header e trailer.",
      "Indirizzo logico":
        "L'indirizzo IP appartiene all'intestazione del pacchetto di livello 3, incapsulato nel payload del frame.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Struttura header, payload e trailer di un frame di livello 2.",
      "Nel trailer c'è l'FCS con il CRC: è l'ultima cosa che il ricevitore controlla.",
      "Il controllo di integrità si mette in fondo, perché va calcolato su tutto ciò che precede.",
      "Quale valore viene inserito nel campo FCS e come lo verifica il destinatario?",
    ),
  },
  {
    id: "hist-045",
    category: "Internet",
    topic: "switch",
    difficulty: "facile",
    question:
      "Indicare il livello in cui opera lo switch.",
    options: [
      "Network",
      "Transport",
      "Data link",
      "Physical",
    ],
    correctAnswer:
      "Data link",
    explanation:
      "Uno switch di rete tradizionale opera al livello di collegamento dati, cioè il livello 2 del modello OSI. Prende le decisioni di inoltro analizzando gli indirizzi fisici MAC presenti nell'intestazione dei frame Ethernet, a differenza dell'hub che lavora al livello fisico rigenerando solo il segnale, e del router che lavora al livello di rete usando gli indirizzi IP.",
    whyOthersAreWrong: {
      "Network":
        "Il livello di rete è quello del router, che instrada tra reti diverse basandosi sugli indirizzi IP.",
      "Transport":
        "Il livello di trasporto è implementato solo negli host terminali e riguarda porte, segmenti e affidabilità end-to-end.",
      "Physical":
        "Il livello fisico è quello dell'hub e dei ripetitori, che rigenerano il segnale senza interpretare gli indirizzi.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Collocazione di hub, switch e router nei livelli dello stack.",
      "Hub livello 1, switch livello 2 sui MAC, router livello 3 sugli IP.",
      "Se il dispositivo guarda i MAC è di livello 2; se guarda gli IP è di livello 3.",
      "Quali livelli dello stack protocollare deve implementare un router?",
    ),
  },
  {
    id: "hist-046",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "media",
    question:
      "Nel formato generale dei messaggi di richiesta HTTP, i tre campi della prima riga sono evidenziati nell'ordine con i colori rosso, verde e giallo. Indicare la corretta corrispondenza tra colore e contenuto.",
    options: [
      "Rosso = URL, verde = metodo, giallo = protocollo",
      "Rosso = GET, verde = URL, giallo = versione",
      "Rosso = metodo, verde = URL, giallo = versione",
      "Rosso = protocollo, verde = URL, giallo = versione",
    ],
    correctAnswer:
      "Rosso = metodo, verde = URL, giallo = versione",
    explanation:
      "La prima riga di una richiesta HTTP è la request line e segue una sintassi rigida con i campi separati da spazi: metodo, URL e versione, seguiti da CRLF. Il primo campo è il metodo, come GET, POST o HEAD, che indica l'azione da eseguire sulla risorsa; il secondo è l'URL, spesso relativo come /index.html, che identifica la risorsa richiesta; il terzo è la versione del protocollo, ad esempio HTTP/1.1, necessaria affinché client e server si capiscano.",
    whyOthersAreWrong: {
      "Rosso = URL, verde = metodo, giallo = protocollo":
        "Inverte i primi due campi: il metodo precede sempre l'URL nella request line.",
      "Rosso = GET, verde = URL, giallo = versione":
        "GET è solo uno dei metodi possibili, non il nome del campo: il primo campo si chiama genericamente metodo.",
      "Rosso = protocollo, verde = URL, giallo = versione":
        "Il protocollo non è un campo autonomo della request line: compare come versione nel terzo campo.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Ordine dei campi nella request line HTTP.",
      "Metodo, URL e versione, in quest'ordine, separati da spazi.",
      "Leggi come una frase: cosa faccio, su cosa, con quale versione.",
      "Quali sono i tre campi che compongono la request line di un messaggio HTTP?",
    ),
  },
  {
    id: "hist-047",
    category: "Internet",
    topic: "ARP",
    difficulty: "difficile",
    question:
      "Indicare, in relazione al protocollo ARP, quale delle seguenti affermazioni relative alla request NON è corretta.",
    options: [
      "L'indirizzo IP del destinatario è posto uguale a 255.255.255.255",
      "ARP request contiene l'indirizzo fisico del mittente",
      "ARP request contiene l'indirizzo IP del mittente",
      "L'indirizzo fisico del destinatario è posto uguale a FF:FF:FF:FF:FF:FF",
    ],
    correctAnswer:
      "L'indirizzo IP del destinatario è posto uguale a 255.255.255.255",
    explanation:
      "Lo scopo di una ARP request è trovare il MAC address associato a uno specifico indirizzo IP, quindi nel campo Target Protocol Address del pacchetto ARP deve esserci scritto l'indirizzo IP specifico del nodo cercato, non l'indirizzo di broadcast IP. La distinzione è fondamentale: a livello Ethernet il frame viene inviato all'indirizzo MAC di broadcast affinché tutti lo ricevano, ma nel payload ARP l'IP di destinazione è quello puntuale che si vuole risolvere.",
    whyOthersAreWrong: {
      "ARP request contiene l'indirizzo fisico del mittente":
        "È vera: il mittente include il proprio MAC per permettere al destinatario di rispondere in unicast.",
      "ARP request contiene l'indirizzo IP del mittente":
        "È vera: il mittente include anche il proprio IP, così il destinatario può aggiornare la propria cache ARP.",
      "L'indirizzo fisico del destinatario è posto uguale a FF:FF:FF:FF:FF:FF":
        "È vera: a livello data link il frame viaggia in broadcast proprio perché il MAC cercato non è ancora noto.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Contenuto di una ARP request e differenza tra broadcast di livello 2 e livello 3.",
      "Broadcast sul MAC di destinazione, ma IP di destinazione puntuale nel payload ARP.",
      "Il broadcast serve per farsi sentire da tutti, non per indicare chi si sta cercando.",
      "Quale componente è l'unico sconosciuto al mittente in un pacchetto di ARP request?",
    ),
  },
  {
    id: "hist-048",
    category: "Internet",
    topic: "TCP e UDP",
    difficulty: "media",
    question:
      "Selezionare la risposta in cui sono elencati tutti e soli i servizi fra DHCP, SMTP, HTTP, ICMP che utilizzano TCP.",
    options: [
      "HTTP",
      "ICMP, SMTP, HTTP",
      "SMTP, HTTP",
      "DHCP, SMTP, HTTP",
    ],
    correctAnswer:
      "SMTP, HTTP",
    explanation:
      "SMTP e HTTP sono protocolli applicativi che richiedono un trasferimento dati affidabile, senza perdite e in ordine, quindi si appoggiano a TCP che stabilisce una connessione e garantisce la consegna. DHCP invece usa UDP, perché si basa su messaggi di broadcast in una fase in cui l'host potrebbe non avere ancora un indirizzo IP valido. ICMP infine non usa né TCP né UDP: opera direttamente al livello di rete, incapsulato dentro i pacchetti IP.",
    whyOthersAreWrong: {
      "HTTP":
        "L'elenco è incompleto: anche SMTP richiede affidabilità e si appoggia a TCP.",
      "ICMP, SMTP, HTTP":
        "ICMP non è trasportato da TCP: viaggia direttamente dentro IP come protocollo di controllo.",
      "DHCP, SMTP, HTTP":
        "DHCP utilizza UDP sulle porte 67 e 68, non TCP.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Scelta del protocollo di trasporto da parte dei protocolli applicativi.",
      "SMTP e HTTP su TCP, DHCP su UDP, ICMP direttamente su IP.",
      "Chi non può perdere niente usa TCP; chi deve essere veloce o parlare prima di avere un IP usa UDP.",
      "Perché DHCP non può appoggiarsi a TCP nella fase iniziale di configurazione?",
    ),
  },
  {
    id: "hist-049",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "media",
    question:
      "Quali livelli dello stack protocollare devono essere supportati in un router?",
    options: [
      "Fisico, datalink, rete, trasporto",
      "Rete",
      "Fisico, datalink, rete",
      "Fisico, datalink, rete, trasporto, applicativo",
    ],
    correctAnswer:
      "Fisico, datalink, rete",
    explanation:
      "Un router è per definizione un dispositivo che opera al livello di rete, ma per accedere alle informazioni di quel livello deve necessariamente implementare anche i livelli sottostanti: il livello fisico per ricevere i segnali dai cavi, il livello data link per elaborare il frame e rimuovere l'intestazione di livello 2, e il livello rete per leggere l'indirizzo IP di destinazione e determinare il percorso. I livelli trasporto e applicativo sono implementati solo negli host finali.",
    whyOthersAreWrong: {
      "Fisico, datalink, rete, trasporto":
        "Il livello di trasporto è end-to-end e vive solo sugli host terminali: il router non lo elabora.",
      "Rete":
        "Il solo livello di rete non basterebbe: senza fisico e data link il router non potrebbe nemmeno ricevere il frame dal cavo.",
      "Fisico, datalink, rete, trasporto, applicativo":
        "Descrive lo stack completo di un host terminale, non quello di un nodo intermedio di instradamento.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Stack protocollare implementato nei nodi intermedi rispetto agli host.",
      "Il router si ferma al livello 3; trasporto e applicazione sono affari degli estremi.",
      "Per leggere l'IP devi prima aprire la busta del frame, ma non devi aprire la lettera.",
      "Perché i livelli di trasporto e applicativo sono definiti end-to-end?",
    ),
  },
  {
    id: "hist-050",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "media",
    question:
      "L'uso dei cookies nel protocollo http permette di?",
    options: [
      "Poter associare fra loro più richieste fatte da uno stesso browser o utente",
      "Inviare comandi al server",
      "Gestire l'autenticazione di un utente",
      "Evitare di essere tracciati",
    ],
    correctAnswer:
      "Poter associare fra loro più richieste fatte da uno stesso browser o utente",
    explanation:
      "HTTP è nativamente stateless: il server tratta ogni richiesta in modo indipendente, senza conservare memoria di quelle precedenti. I cookie sono piccoli file di testo che il server invia al client e che il client rispedisce a ogni richiesta successiva, fungendo da identificativo e permettendo al server di capire che due richieste provengono dallo stesso utente. Su questa capacità si costruiscono poi sessioni, carrelli e personalizzazione.",
    whyOthersAreWrong: {
      "Inviare comandi al server":
        "I comandi al server si esprimono con i metodi HTTP e il corpo della richiesta, non tramite i cookie.",
      "Gestire l'autenticazione di un utente":
        "Il mantenimento del login è una conseguenza possibile dell'associazione tra richieste, non la funzione primaria del meccanismo.",
      "Evitare di essere tracciati":
        "È l'opposto: i cookie sono proprio lo strumento che rende possibile il tracciamento della navigazione.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Natura stateless di HTTP e ruolo dei cookie.",
      "Il cookie è un identificativo che il client ripresenta ogni volta, ricucendo richieste separate.",
      "HTTP dimentica tutto; il cookie è il biglietto che ti fa riconoscere all'ingresso.",
      "Quali funzionalità applicative diventano possibili grazie ai cookie?",
    ),
  },
  {
    id: "hist-051",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "media",
    question:
      "Il protocollo BGP si compone di?",
    options: [
      "Un insieme di AS",
      "Un insieme di reti private",
      "Nessuna delle precedenti",
      "Un insieme di ISP",
    ],
    correctAnswer:
      "Un insieme di AS",
    explanation:
      "BGP è il protocollo di routing inter-dominio che fa funzionare Internet e, dal suo punto di vista, Internet non è una rete di singoli computer ma una rete di reti chiamate Sistemi Autonomi. Un AS è un gruppo di router e reti sotto il controllo di una singola autorità amministrativa, ad esempio un ISP, un'università o una grande azienda, che definisce una politica di routing unitaria.",
    whyOthersAreWrong: {
      "Un insieme di reti private":
        "Le reti private sono un concetto di indirizzamento interno e non hanno alcun ruolo nella struttura logica del routing inter-dominio.",
      "Nessuna delle precedenti":
        "Una delle opzioni descrive correttamente la struttura su cui opera BGP, quindi questa alternativa non è valida.",
      "Un insieme di ISP":
        "È riduttivo: tutti gli ISP sono AS, ma esistono AS che non sono Internet Service Provider, come università e grandi aziende.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Concetto di Sistema Autonomo e routing inter-dominio.",
      "BGP vede Internet come una rete di AS, ciascuno con la propria politica di routing.",
      "AS non significa provider: significa autorità amministrativa unica.",
      "Qual è la differenza tra eBGP e iBGP?",
    ),
  },
  {
    id: "hist-052",
    category: "Internet",
    topic: "Ethernet",
    difficulty: "facile",
    question:
      "Quale tecnica di accesso al canale trasmissivo è usata da Ethernet?",
    options: [
      "Token passing",
      "CSMA/CA",
      "CSMA/CD",
      "Turn taking",
    ],
    correctAnswer:
      "CSMA/CD",
    explanation:
      "CSMA/CD è il protocollo MAC utilizzato nelle reti Ethernet cablate. Prima di trasmettere la stazione ascolta il canale e, se è libero, trasmette; durante la trasmissione continua ad ascoltare e, se rileva una collisione, interrompe subito l'invio e lancia un segnale di jamming; infine attende un tempo casuale calcolato con il backoff esponenziale prima di riprovare.",
    whyOthersAreWrong: {
      "Token passing":
        "Il passaggio del gettone è la tecnica di Token Ring (802.5), che elimina alla radice le collisioni invece di rilevarle.",
      "CSMA/CA":
        "Il collision avoidance è usato dalle reti wireless 802.11, che non possono rilevare le collisioni mentre trasmettono.",
      "Turn taking":
        "L'accesso a turni è una famiglia di protocolli diversa, in cui le stazioni si alternano secondo uno schema prestabilito.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Protocolli di accesso al mezzo condiviso e loro classificazione.",
      "Ethernet ascolta, trasmette, rileva la collisione e riprova dopo un backoff casuale.",
      "Sul cavo puoi accorgerti dello scontro mentre parli: CD, Collision Detection.",
      "Perché il Wi-Fi non può usare CSMA/CD e ricorre a CSMA/CA?",
    ),
  },
  {
    id: "hist-053",
    category: "Internet",
    topic: "congestion control",
    difficulty: "difficile",
    question:
      "In un grafico che confronta due versioni di TCP, al round di trasmissione 8 si verifica una perdita: la curva blu scende verticalmente da 12 a 1, mentre la curva nera scende a circa 9. Quale delle curve rappresentate è relativa alla versione TCP-Tahoe?",
    options: [
      "Tutta la curva blu",
      "La curva nera",
      "Non è rappresentata in figura",
      "Sia la curva nera che quella blu",
    ],
    correctAnswer:
      "Tutta la curva blu",
    explanation:
      "TCP Tahoe non implementa il meccanismo di Fast Recovery, quindi ogni volta che rileva una perdita, sia per timeout sia per tre ACK duplicati, si comporta nello stesso modo drastico: imposta la soglia ssthresh a metà della finestra corrente, resetta la finestra di congestione a 1 MSS e ricomincia dalla fase di Slow Start. La discesa verticale da 12 a 1 è esattamente questo comportamento, mentre la curva nera che scende a circa 9 rappresenta il Fast Recovery tipico di TCP Reno.",
    whyOthersAreWrong: {
      "La curva nera":
        "La discesa a metà finestra invece che a 1 è la firma del Fast Recovery, quindi di TCP Reno e non di Tahoe.",
      "Non è rappresentata in figura":
        "Il comportamento di Tahoe è chiaramente visibile nel crollo verticale della finestra fino a 1 MSS.",
      "Sia la curva nera che quella blu":
        "Le due curve mostrano reazioni diverse alla stessa perdita, quindi non possono rappresentare entrambe Tahoe.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Differenza di reazione alla perdita tra TCP Tahoe e TCP Reno.",
      "Tahoe torna sempre a 1 MSS; Reno dimezza la finestra ed entra in Fast Recovery.",
      "Se la curva precipita fino in fondo è Tahoe; se si ferma a metà è Reno.",
      "Quale affermazione è vera per TCP Tahoe e non per TCP Reno?",
    ),
  },
  {
    id: "hist-054",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "media",
    question:
      "La formula di Bellman-Ford è utilizzata?",
    options: [
      "Dall'algoritmo di Dijkstra per calcolare i campi minimi",
      "Dall'algoritmo distance vector per determinare i percorsi di costo minimo",
      "Dall'algoritmo distance vector per evitare il conteggio all'infinito",
      "Dall'algoritmo OSPF per diminuire la complessità legata allo scambio dei messaggi",
    ],
    correctAnswer:
      "Dall'algoritmo distance vector per determinare i percorsi di costo minimo",
    explanation:
      "Gli algoritmi di routing di tipo Distance Vector, come il protocollo RIP, si basano iterativamente sull'equazione di Bellman-Ford, secondo cui il costo del percorso minimo dal nodo x al nodo y è il minimo, calcolato su tutti i vicini v, della somma tra il costo per raggiungere il vicino e il costo che il vicino impiega per raggiungere la destinazione.",
    whyOthersAreWrong: {
      "Dall'algoritmo di Dijkstra per calcolare i campi minimi":
        "Dijkstra è un algoritmo greedy di tipo Link State e non utilizza l'equazione di Bellman-Ford.",
      "Dall'algoritmo distance vector per evitare il conteggio all'infinito":
        "Il conteggio all'infinito è un difetto intrinseco degli algoritmi basati su Bellman-Ford, non un problema che l'equazione risolve: servono tecniche extra come il Poison Reverse.",
      "Dall'algoritmo OSPF per diminuire la complessità legata allo scambio dei messaggi":
        "OSPF è un protocollo Link State e usa Dijkstra, non Bellman-Ford.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Equazione di Bellman-Ford alla base del distance vector.",
      "Il costo minimo verso y è il minimo, sui vicini, di costo(x,v) più costo(v,y).",
      "Bellman-Ford va con distance vector, Dijkstra con link state: sono coppie fisse.",
      "A cosa serve la tecnica del Poisoned Reverse nell'algoritmo distance vector?",
    ),
  },
  {
    id: "hist-055",
    category: "Internet",
    topic: "ARP",
    difficulty: "facile",
    question:
      "Qual è l'indirizzo di destinazione usato in un frame ARP request?",
    options: [
      "255.255.255.255",
      "FFFF.FFFF.FFFF",
      "0.0.0.0",
      "127.0.0.1",
    ],
    correctAnswer:
      "FFFF.FFFF.FFFF",
    explanation:
      "ARP non è trasportato da IP ma viaggia direttamente dentro i frame Ethernet, quindi l'indirizzo di destinazione del frame deve essere un indirizzo MAC. Poiché il mittente non conosce ancora il MAC del destinatario, che è proprio ciò che vuole scoprire, deve inviare il messaggio a tutti i dispositivi della rete locale usando l'indirizzo MAC di broadcast, costituito da 48 bit tutti a uno.",
    whyOthersAreWrong: {
      "255.255.255.255":
        "È l'indirizzo di broadcast di livello 3, usato in ambito IP, ma non compare nell'intestazione del frame Ethernet di una ARP request.",
      "0.0.0.0":
        "Indica un indirizzo IP non specificato, tipicamente usato da un host non ancora configurato, e non è un indirizzo di destinazione di livello 2.",
      "127.0.0.1":
        "È l'indirizzo di loopback, riservato al traffico interno all'host stesso, e non ha alcun senso come destinazione di un broadcast locale.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Livello di incapsulamento di ARP e indirizzo di broadcast di livello 2.",
      "ARP viaggia dentro Ethernet, quindi il broadcast è FF:FF:FF:FF:FF:FF, non 255.255.255.255.",
      "Se il campo è del frame, l'indirizzo è MAC; le quaterne puntate sono di livello 3.",
      "In quale modalità viene inviata una ARP reply e perché?",
    ),
  },
  {
    id: "hist-056",
    category: "Internet",
    topic: "TCP e UDP",
    difficulty: "facile",
    question:
      "Se si considera il protocollo UDP, indicare quale delle seguenti affermazioni è vera.",
    options: [
      "È un protocollo principalmente utilizzato per il trasferimento dei messaggi di posta elettronica",
      "È un protocollo connectionless affidabile",
      "È un protocollo connectionless inaffidabile",
      "È un protocollo che garantisce un canale affidabile",
    ],
    correctAnswer:
      "È un protocollo connectionless inaffidabile",
    explanation:
      "A differenza di TCP, UDP non esegue alcuna procedura di handshaking prima di inviare i dati: il mittente inizia semplicemente a trasmettere. Offre inoltre un servizio best effort, senza garantire che i pacchetti arrivino a destinazione né che arrivino in ordine, e senza prevedere riscontri o ritrasmissioni. Proprio per la sua leggerezza è ideale per applicazioni sensibili al ritardo come streaming, gaming online e VoIP.",
    whyOthersAreWrong: {
      "È un protocollo principalmente utilizzato per il trasferimento dei messaggi di posta elettronica":
        "La posta elettronica usa SMTP appoggiato a TCP, perché richiede affidabilità totale.",
      "È un protocollo connectionless affidabile":
        "Connectionless è corretto, ma affidabile no: UDP non offre alcuna garanzia di consegna.",
      "È un protocollo che garantisce un canale affidabile":
        "Descrive TCP: UDP non garantisce nulla sul canale.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Caratteristiche del servizio offerto da UDP.",
      "UDP: nessun handshake, nessun ACK, nessuna ritrasmissione, massima leggerezza.",
      "UDP spara e non guarda: veloce, ma senza garanzie.",
      "Perché si preferisce UDP per lo streaming audio e video?",
    ),
  },
  {
    id: "hist-057",
    category: "Internet",
    topic: "Wi-Fi e reti mobili",
    difficulty: "media",
    question:
      "Qual è il ruolo del meccanismo di \"backoff\" nel protocollo CSMA/CA?",
    options: [
      "Assegnare priorità di accesso al canale ai nodi della rete",
      "Gestire le collisioni tra pacchetti trasmessi contemporaneamente dai nodi",
      "Regolare l'intervallo di tempo tra le ritrasmissioni dei pacchetti",
      "Calcolare la larghezza di banda disponibile nel sistema di comunicazione",
    ],
    correctAnswer:
      "Regolare l'intervallo di tempo tra le ritrasmissioni dei pacchetti",
    explanation:
      "Nelle reti wireless non è possibile rilevare le collisioni mentre avvengono, quindi il protocollo mira a evitarle. Quando un nodo trova il canale occupato o non riceve un ACK non riprova immediatamente appena il canale si libera, altrimenti tutti i nodi in attesa trasmetterebbero insieme causando una collisione certa: il backoff calcola un tempo di attesa casuale, regolando così l'intervallo di ritrasmissione e desincronizzando i nodi.",
    whyOthersAreWrong: {
      "Assegnare priorità di accesso al canale ai nodi della rete":
        "Il backoff è casuale proprio per non privilegiare nessuno: le priorità si gestiscono con meccanismi diversi come gli spazi interframe.",
      "Gestire le collisioni tra pacchetti trasmessi contemporaneamente dai nodi":
        "In CSMA/CA l'obiettivo è prevenire le collisioni, non gestirle dopo che sono avvenute come fa CSMA/CD.",
      "Calcolare la larghezza di banda disponibile nel sistema di comunicazione":
        "Il backoff non misura né stima la banda: agisce solo sul momento in cui si ritenta la trasmissione.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Funzione del backoff nella desincronizzazione dei nodi wireless.",
      "Il backoff sparpaglia nel tempo i tentativi di trasmissione per evitare collisioni certe.",
      "Se tutti riprovassero nello stesso istante, si scontrerebbero di nuovo: serve il caso.",
      "Come si può risolvere il problema del terminale nascosto in una rete 802.11?",
    ),
  },
  {
    id: "hist-058",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "facile",
    question:
      "Il protocollo che prevede uno schema di indirizzamento di 128 bit è?",
    options: [
      "NAT",
      "ARP",
      "IPv4",
      "IPv6",
    ],
    correctAnswer:
      "IPv6",
    explanation:
      "Lo standard IPv6 utilizza indirizzi lunghi 128 bit, il che permette uno spazio di indirizzamento enorme, circa 3,4 per 10 alla 38, risolvendo definitivamente il problema dell'esaurimento degli indirizzi. Gli indirizzi sono rappresentati come otto gruppi di quattro cifre esadecimali separati da due punti, mentre IPv4 usa soli 32 bit.",
    whyOthersAreWrong: {
      "NAT":
        "Il NAT non è uno schema di indirizzamento ma una tecnica di traduzione degli indirizzi, nata proprio per far fronte alla scarsità di indirizzi IPv4.",
      "ARP":
        "ARP è un protocollo di risoluzione tra indirizzi logici e fisici, non definisce alcuno spazio di indirizzamento.",
      "IPv4":
        "IPv4 utilizza indirizzi a 32 bit, per un totale di circa 4,3 miliardi di indirizzi.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Dimensione degli indirizzi in IPv4 e IPv6.",
      "IPv4 = 32 bit in decimale puntato; IPv6 = 128 bit in esadecimale con due punti.",
      "128 è quattro volte 32: IPv6 quadruplica la lunghezza dell'indirizzo.",
      "Come vengono rappresentati tipicamente gli indirizzi IPv6?",
    ),
  },
  {
    id: "hist-059",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "media",
    question:
      "Uno schema di rete mostra un router centrale con tre interfacce: alla prima sono collegati gli host 223.1.1.1, 223.1.1.2 e 223.1.1.3 con l'interfaccia 223.1.1.4; alla seconda gli host 223.1.2.1 e 223.1.2.2 con l'interfaccia 223.1.2.9; alla terza gli host 223.1.3.1 e 223.1.3.2 con l'interfaccia 223.1.3.27. Quante sono le sottoreti presenti?",
    options: [
      "1",
      "3",
      "6",
      "2",
    ],
    correctAnswer:
      "3",
    explanation:
      "Una sottorete è costituita da un gruppo di host e dall'interfaccia del router che li connette, in grado di comunicare direttamente tra loro senza attraversare un router. Qui si riconoscono tre gruppi distinti, identificati dai prefissi 223.1.1.x, 223.1.2.x e 223.1.3.x. La regola pratica è contare quante interfacce del router sono connesse a segmenti di rete distinti: in questo caso tre.",
    whyOthersAreWrong: {
      "1":
        "Gli host appartengono a prefissi di rete diversi e non possono quindi far parte di un'unica sottorete.",
      "2":
        "Ignora uno dei tre segmenti collegati alle interfacce del router.",
      "6":
        "Conterebbe separatamente elementi che appartengono allo stesso segmento: le sottoreti sono i gruppi, non i singoli dispositivi.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Identificazione delle sottoreti in uno schema di rete.",
      "Ogni interfaccia del router connessa a un segmento distinto individua una sottorete.",
      "Conta le isole attaccate al router, non i computer dentro le isole.",
      "Come si riconosce che due host appartengono alla stessa sottorete?",
    ),
  },
  {
    id: "hist-060",
    category: "Internet",
    topic: "livello collegamento",
    difficulty: "difficile",
    question:
      "Nel caso dello slotted ALOHA, indicare quale affermazione è falsa.",
    options: [
      "In caso di collisione, il nodo ritrasmette il file con probabilità p",
      "Qualora ci sia collisione, tutti i nodi la rilevano prima del termine dello slot",
      "I nodi cominciano la trasmissione solo all'inizio di ogni slot",
      "Ogni frame può avere dimensioni differente",
    ],
    correctAnswer:
      "Ogni frame può avere dimensioni differente",
    explanation:
      "Nello slotted ALOHA il tempo è suddiviso in intervalli discreti chiamati slot e la durata di ogni slot è calcolata esattamente per contenere il tempo di trasmissione di un singolo pacchetto. Affinché il meccanismo funzioni e la sincronizzazione sia mantenuta è fondamentale che tutti i frame abbiano la stessa dimensione fissa, quindi affermare che possano avere dimensioni differenti è falso.",
    whyOthersAreWrong: {
      "In caso di collisione, il nodo ritrasmette il file con probabilità p":
        "È vera: è la strategia di ritrasmissione standard prevista dal protocollo per risolvere le collisioni.",
      "Qualora ci sia collisione, tutti i nodi la rilevano prima del termine dello slot":
        "È vera: la durata dello slot include il tempo di propagazione, così il feedback è noto entro la fine dello slot.",
      "I nodi cominciano la trasmissione solo all'inizio di ogni slot":
        "È vera: è proprio la caratteristica che distingue lo slotted ALOHA dal Pure ALOHA.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Vincoli di sincronizzazione e dimensione dei frame nello slotted ALOHA.",
      "Slot di durata pari alla trasmissione di un frame, quindi frame tutti della stessa dimensione.",
      "Se lo slot è tagliato su misura del pacchetto, i pacchetti devono avere tutti la stessa misura.",
      "Qual è l'efficienza massima teorica dello slotted ALOHA?",
    ),
  },
  {
    id: "hist-061",
    category: "Internet",
    topic: "sliding window",
    difficulty: "media",
    question:
      "Quale parte dell'intestazione del pacchetto TCP è utilizzata per gestire il problema del data overflow?",
    options: [
      "ack",
      "window size",
      "numero di sequenza",
      "porta sorgente",
    ],
    correctAnswer:
      "window size",
    explanation:
      "Se un mittente invia dati troppo velocemente per la capacità di elaborazione del ricevitore, il buffer di ricezione si riempie e i pacchetti successivi vengono scartati. TCP gestisce il problema tramite il controllo di flusso: in ogni segmento il ricevitore inserisce nel campo Window Size, a 16 bit, quanti byte di spazio libero sono rimasti nel proprio buffer, e il mittente limita a quel valore la quantità di dati non ancora riscontrati. Se la finestra scende a zero il mittente smette di trasmettere.",
    whyOthersAreWrong: {
      "ack":
        "Il numero di riscontro conferma i byte ricevuti e serve all'affidabilità, ma non comunica la capienza residua del buffer.",
      "numero di sequenza":
        "Il numero di sequenza ordina i byte nel flusso e permette di rilevare perdite e duplicati, non regola la velocità di invio.",
      "porta sorgente":
        "La porta identifica il processo applicativo e non ha alcun ruolo nel controllo di flusso.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Controllo di flusso e prevenzione dell'overflow del buffer di ricezione.",
      "Il campo Window Size annuncia lo spazio libero e mette un tetto ai dati in volo.",
      "Overflow del ricevitore significa flow control, quindi finestra di ricezione.",
      "Cosa succede quando la finestra di ricezione annunciata vale zero?",
    ),
  },
  {
    id: "hist-062",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "media",
    question:
      "Quale delle seguenti non è una funzione del livello di rete?",
    options: [
      "Routing",
      "Congestion Control",
      "Nessuna delle tre",
      "Error control",
    ],
    correctAnswer:
      "Error control",
    explanation:
      "Il livello di rete nel modello Internet fornisce un servizio inaffidabile e best effort. Sebbene IPv4 abbia un checksum, questo controlla solo l'integrità dell'intestazione e non dei dati; inoltre il livello di rete non possiede meccanismi per rilevare la perdita di pacchetti o richiedere ritrasmissioni. Il controllo e il recupero degli errori sono funzioni del livello data link, hop-by-hop, e del livello di trasporto, end-to-end.",
    whyOthersAreWrong: {
      "Routing":
        "Il routing è la funzione principale del livello 3: determinare il percorso verso la destinazione.",
      "Congestion Control":
        "Il livello di rete partecipa alla gestione della congestione scartando pacchetti o segnalandola, quindi rientra tra le sue funzioni.",
      "Nessuna delle tre":
        "Una delle opzioni non appartiene effettivamente al livello di rete, quindi questa alternativa non è valida.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Ripartizione delle funzioni tra livello di rete, collegamento e trasporto.",
      "IP instrada e può scartare, ma non recupera: il recupero è di data link e trasporto.",
      "IP consegna al meglio e non torna indietro a rimediare.",
      "Quale checksum copre anche i dati e non solo l'intestazione?",
    ),
  },
  {
    id: "hist-063",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "media",
    question:
      "Quale affermazione non è vera per l'algoritmo di routing distance vector?",
    options: [
      "Ogni router ha una mappa completa della rete",
      "Tutte e tre",
      "È un tipo di algoritmo di routing dinamico",
      "È basato sull'algoritmo di Bellman-Ford",
    ],
    correctAnswer:
      "Ogni router ha una mappa completa della rete",
    explanation:
      "Negli algoritmi Distance Vector il router non conosce la topologia dell'intera rete: sa solo a quale vicino inoltrare il pacchetto per raggiungere una destinazione e quanto costa, una conoscenza limitata spesso definita routing by rumor. L'affermazione sulla mappa completa è invece vera per gli algoritmi Link State come OSPF, dove ogni router costruisce un grafo dell'intera rete prima di calcolare i percorsi con Dijkstra.",
    whyOthersAreWrong: {
      "Tutte e tre":
        "Due delle affermazioni elencate sono effettivamente vere per il distance vector, quindi non possono essere tutte false.",
      "È un tipo di algoritmo di routing dinamico":
        "È vera: l'algoritmo si adatta ai cambiamenti della rete scambiando aggiornamenti con i vicini.",
      "È basato sull'algoritmo di Bellman-Ford":
        "È vera: Bellman-Ford è proprio l'equazione su cui si basa il calcolo dei percorsi minimi.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Conoscenza parziale nel distance vector contro visione globale del link state.",
      "Distance vector: so solo distanza e direzione. Link state: ho la mappa intera.",
      "Chi ha la mappa completa non è distance vector: quello si fida dei vicini.",
      "Quale categoria di algoritmi di routing costruisce un Link State Database?",
    ),
  },
  {
    id: "hist-064",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "facile",
    question:
      "Quale metodo di richiesta HTTP viene comunemente utilizzato per recuperare risorse specifiche da un server web?",
    options: [
      "POST",
      "PUT",
      "DELETE",
      "GET",
    ],
    correctAnswer:
      "GET",
    explanation:
      "Il metodo GET è lo standard fondamentale del protocollo HTTP per richiedere la rappresentazione di una risorsa specifica identificata da un URL, ad esempio caricare una pagina web o scaricare un'immagine. È definito un metodo safe, cioè la sua esecuzione non deve comportare modifiche allo stato del server: si limita a leggere i dati.",
    whyOthersAreWrong: {
      "POST":
        "POST serve a inviare dati al server affinché vengano elaborati, ad esempio l'invio di un modulo, non a recuperare risorse.",
      "PUT":
        "PUT viene usato per caricare una risorsa o sostituirne integralmente una esistente.",
      "DELETE":
        "DELETE richiede la cancellazione della risorsa specificata, l'opposto del recupero.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Semantica dei metodi HTTP principali.",
      "GET legge, POST invia, PUT sostituisce, DELETE cancella.",
      "GET è l'unico metodo safe tra quelli elencati: non cambia nulla sul server.",
      "Quale dei metodi HTTP non è valido in una richiesta standard?",
    ),
  },
  {
    id: "hist-065",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "media",
    question:
      "Considerando il protocollo HTTP, indicare come viene indicata la fine dell'intestazione.",
    options: [
      "Con il testo EOH: (End Of Header)",
      "Non è previsto uno specifico separatore",
      "Doppio ritorno a capo",
      "Nell'intestazione è presente un campo che indica il numero di righe presenti nell'intestazione",
    ],
    correctAnswer:
      "Doppio ritorno a capo",
    explanation:
      "I messaggi HTTP sono divisi in due macro-sezioni, le intestazioni e il corpo del messaggio. Per permettere al software di capire dove finiscono i metadati e dove iniziano i dati, lo standard richiede una riga vuota: ogni riga di intestazione termina con i caratteri CRLF e, per segnalare la fine della sezione header, si invia un ulteriore CRLF. La sequenza risultante CRLF CRLF corrisponde visivamente a premere due volte Invio.",
    whyOthersAreWrong: {
      "Con il testo EOH: (End Of Header)":
        "Non esiste alcun marcatore testuale di questo tipo nello standard HTTP.",
      "Non è previsto uno specifico separatore":
        "Un separatore esiste ed è indispensabile, altrimenti sarebbe impossibile distinguere header e body.",
      "Nell'intestazione è presente un campo che indica il numero di righe presenti nell'intestazione":
        "Non esiste un campo che conti le righe di intestazione: la delimitazione è posizionale, tramite riga vuota.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Struttura di un messaggio HTTP e delimitazione tra header e body.",
      "Una riga vuota, cioè CRLF CRLF, separa le intestazioni dal corpo.",
      "Due Invio di fila: da lì in poi cominciano i dati veri.",
      "Da quali tre campi è composta la prima riga di una richiesta HTTP?",
    ),
  },
  {
    id: "hist-066",
    category: "Internet",
    topic: "DNS",
    difficulty: "media",
    question:
      "In quale tipo di risoluzione un server DNS restituisce direttamente l'indirizzo IP del nodo che deve risolvere?",
    options: [
      "Diretta",
      "Iterativa",
      "Nessuna di quelle indicate",
      "Ricorsiva",
    ],
    correctAnswer:
      "Ricorsiva",
    explanation:
      "Nella risoluzione ricorsiva il client delega completamente il compito al server DNS: il messaggio implicito è trovami questo indirizzo IP. Il server contattato si fa carico di tutto il lavoro, interrogando a catena altri server se necessario, e risponde al client solo quando ha ottenuto l'indirizzo IP finale o un errore. Restituisce quindi direttamente il risultato cercato.",
    whyOthersAreWrong: {
      "Diretta":
        "La risoluzione diretta, o forward lookup, indica la traduzione da nome a IP contrapposta a quella inversa: descrive l'obiettivo, non la modalità di interazione.",
      "Iterativa":
        "Nella modalità iterativa il server risponde con il riferimento a un altro server DNS, non con l'indirizzo IP del nodo cercato.",
      "Nessuna di quelle indicate":
        "Una delle modalità elencate corrisponde esattamente alla descrizione, quindi l'alternativa non è valida.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Differenza tra query ricorsive e iterative nel DNS.",
      "Ricorsiva: il server fa tutto e ti dà l'IP. Iterativa: ti dice a chi chiedere.",
      "Ricorsiva come una delega totale; iterativa come un rimpallo.",
      "Quale tipo di risoluzione applica il Local DNS Server verso la gerarchia?",
    ),
  },
  {
    id: "hist-067",
    category: "Internet",
    topic: "TCP e UDP",
    difficulty: "media",
    question:
      "UDP è definito connectionless per il seguente motivo.",
    options: [
      "Tutti i segmenti UDP sono trattati indipendentemente dal livello di trasporto",
      "UDP invia i dati come uno stream di segmenti correlati",
      "UDP fornisce un controllo dell'integrità dei segmenti mandati",
      "UDP garantisce che i segmenti siano ricevuti nello stesso ordine in cui vengono spediti",
    ],
    correctAnswer:
      "Tutti i segmenti UDP sono trattati indipendentemente dal livello di trasporto",
    explanation:
      "UDP non stabilisce alcuna connessione logica prima di inviare i dati: ogni datagramma è un'entità autonoma e il livello di trasporto non mantiene alcuno stato sulla sequenza dei pacchetti. Di conseguenza ogni pacchetto può prendere percorsi diversi ed essere trattato senza relazione con quelli precedenti o successivi. È esattamente questa indipendenza a definire il comportamento connectionless.",
    whyOthersAreWrong: {
      "UDP invia i dati come uno stream di segmenti correlati":
        "Lo stream di byte correlati e ordinati è la caratteristica di TCP, non di UDP.",
      "UDP fornisce un controllo dell'integrità dei segmenti mandati":
        "Il checksum esiste in UDP, ma è presente anche in TCP e non è il motivo per cui UDP è definito connectionless.",
      "UDP garantisce che i segmenti siano ricevuti nello stesso ordine in cui vengono spediti":
        "UDP non garantisce alcun ordine di consegna: questa è una proprietà di TCP.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Significato tecnico di connectionless nel livello di trasporto.",
      "Nessuno stato di connessione, nessuna relazione tra datagrammi successivi.",
      "Connectionless non significa senza controlli: significa senza memoria tra pacchetti.",
      "Quale campo di UDP consente comunque un controllo di integrità?",
    ),
  },
  {
    id: "hist-068",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "media",
    question:
      "I timer nel TCP vengono impostati ad un valore.",
    options: [
      "In base alle dimensioni della finestra di trasmissione",
      "Viene fissata all'apertura della connessione TCP",
      "In base alla velocità di trasmissione del mittente",
      "Secondo una formula che tiene conto degli RTT dei segmenti inviati in passato",
    ],
    correctAnswer:
      "Secondo una formula che tiene conto degli RTT dei segmenti inviati in passato",
    explanation:
      "I ritardi su Internet variano costantemente a causa della congestione e dei percorsi di routing, quindi un timer fisso sarebbe inefficiente: troppo breve causerebbe ritrasmissioni inutili, troppo lungo ritarderebbe il recupero degli errori. TCP misura continuamente il Round Trip Time e calcola il timeout di ritrasmissione stimando una media mobile dei ritardi passati e aggiungendo un margine basato sulla loro variabilità.",
    whyOthersAreWrong: {
      "In base alle dimensioni della finestra di trasmissione":
        "La finestra regola quanti dati inviare, non quanto attendere prima di considerare perso un segmento.",
      "Viene fissata all'apertura della connessione TCP":
        "Un valore fissato una volta per tutte non si adatterebbe alle variazioni di ritardo durante la connessione.",
      "In base alla velocità di trasmissione del mittente":
        "Il timeout dipende dal tempo di andata e ritorno sulla rete, non dalla velocità con cui il mittente immette i dati.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Calcolo adattivo del Retransmission Timeout in TCP.",
      "RTO = media stimata degli RTT più un margine proporzionale alla loro variabilità.",
      "Il timer si adatta alla rete: misura quanto ci mette davvero un ACK a tornare.",
      "Qual è la formula corretta per il timer di ritrasmissione RTO?",
    ),
  },
  {
    id: "hist-069",
    category: "Internet",
    topic: "congestion control",
    difficulty: "media",
    question:
      "Nel caso di perdita di segmenti identificata mediante un Timeout che scade, la dimensione della finestra corrente del trasmettitore TCP.",
    options: [
      "Non viene variata",
      "Viene portata ad un valore pari al valore della soglia",
      "Viene riportata al valore iniziale, pari ad un segmento",
      "Viene portata ad un valore pari a metà della soglia",
    ],
    correctAnswer:
      "Viene riportata al valore iniziale, pari ad un segmento",
    explanation:
      "Per TCP il timeout è l'evento di congestione più grave, perché significa che la rete è così intasata da non far tornare indietro alcun ACK. Indipendentemente dalla versione, quando scade il timer di ritrasmissione il mittente imposta la soglia ssthresh a metà della finestra corrente e resetta la finestra di congestione a 1 MSS, ripartendo dalla fase di Slow Start. Se invece la perdita fosse rilevata tramite tre ACK duplicati, evento meno grave, la finestra verrebbe dimezzata anziché azzerata.",
    whyOthersAreWrong: {
      "Non viene variata":
        "Ignorare un timeout significherebbe continuare a immettere traffico in una rete già congestionata, peggiorando la situazione.",
      "Viene portata ad un valore pari al valore della soglia":
        "La soglia viene aggiornata a metà finestra, ma la finestra di congestione riparte da 1, non dal valore della soglia.",
      "Viene portata ad un valore pari a metà della soglia":
        "Il dimezzamento riguarda la soglia rispetto alla finestra precedente, mentre la finestra torna al valore iniziale di un segmento.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Reazione di TCP al timeout rispetto ai tre ACK duplicati.",
      "Timeout: ssthresh a metà e cwnd a 1 con ripartenza in Slow Start.",
      "Silenzio totale sulla rete significa ripartire da zero; tre ACK duplicati significano solo rallentare.",
      "Come reagisce TCP Reno alla ricezione di tre ACK duplicati?",
    ),
  },
  {
    id: "hist-070",
    category: "Internet",
    topic: "sliding window",
    difficulty: "media",
    question:
      "Quale delle seguenti affermazioni descrive il compito del window size in TCP?",
    options: [
      "Comunicare le dimensioni del buffer del mittente",
      "Serve per il controllo della congestione",
      "Serve per garantire l'affidabilità del canale",
      "Comunicare le dimensioni dei buffer del ricevente",
    ],
    correctAnswer:
      "Comunicare le dimensioni dei buffer del ricevente",
    explanation:
      "Il campo Window Size presente nell'intestazione TCP implementa il controllo di flusso: il valore viene impostato dal ricevitore e inviato al mittente per comunicargli quanto spazio libero è rimasto nel proprio buffer di ricezione. Serve a impedire che un mittente veloce inondi un ricevitore lento causando overflow. La finestra di congestione esiste, ma è una variabile interna del mittente e non viaggia nell'header.",
    whyOthersAreWrong: {
      "Comunicare le dimensioni del buffer del mittente":
        "Il campo riguarda esclusivamente il buffer del ricevitore: al mittente non serve annunciare la propria capienza.",
      "Serve per il controllo della congestione":
        "Il controllo di congestione usa la cwnd, una variabile locale del mittente che non è trasmessa nell'intestazione.",
      "Serve per garantire l'affidabilità del canale":
        "L'affidabilità è affidata a numeri di sequenza, ACK e ritrasmissioni, non alla finestra annunciata.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Distinzione tra receive window annunciata e congestion window interna.",
      "Nell'header viaggia solo rwnd, la capienza del ricevitore; cwnd resta nel mittente.",
      "Se il valore è scritto nel pacchetto riguarda il ricevitore; la congestione la stima chi invia.",
      "Quale valore non è mai contenuto nell'intestazione TCP?",
    ),
  },
  {
    id: "hist-071",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "media",
    question:
      "Quale delle seguenti affermazioni è scorretta per l'utility traceroute?",
    options: [
      "Usa il campo TTL per identificare i router intermedi",
      "Traccia il cammino percorso da un pacchetto IP per raggiungere la destinazione",
      "Permette di verificare la presenza di connessione fra due nodi",
      "Usa il protocollo TCP",
    ],
    correctAnswer:
      "Usa il protocollo TCP",
    explanation:
      "L'implementazione standard di traceroute sui sistemi Unix e Linux utilizza pacchetti UDP inviati a porte alte improbabili, mentre l'implementazione Windows tracert utilizza messaggi ICMP Echo Request. TCP non è usato dall'utility di base: esiste un tool specifico chiamato tcptraceroute per casi particolari, ma non rappresenta il funzionamento standard.",
    whyOthersAreWrong: {
      "Usa il campo TTL per identificare i router intermedi":
        "È vera: traceroute invia pacchetti con TTL incrementale e sfrutta i messaggi ICMP Time Exceeded per identificare ogni router.",
      "Traccia il cammino percorso da un pacchetto IP per raggiungere la destinazione":
        "È vera: raccogliendo gli indirizzi dei router che rispondono, l'utility ricostruisce il percorso.",
      "Permette di verificare la presenza di connessione fra due nodi":
        "È vera: la raggiungibilità della destinazione viene verificata indirettamente durante la traccia.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Protocolli realmente utilizzati da traceroute e ruolo del TTL.",
      "TTL crescente più ICMP Time Exceeded; il trasporto è UDP o ICMP, non TCP.",
      "Traceroute vive di TTL e ICMP: il TCP non c'entra nella versione standard.",
      "Quale messaggio ICMP permette a traceroute di identificare i router intermedi?",
    ),
  },
  {
    id: "hist-072",
    category: "Internet",
    topic: "Wi-Fi e reti mobili",
    difficulty: "difficile",
    question:
      "Indicare quanti sono i campi che possono contenere un indirizzo nell'intestazione di 802.11.",
    options: [
      "1",
      "3",
      "4",
      "2",
    ],
    correctAnswer:
      "4",
    explanation:
      "A differenza del frame Ethernet che ha solo due indirizzi, sorgente e destinazione, l'intestazione del frame MAC 802.11 prevede fisicamente lo spazio per quattro indirizzi. Nella normale comunicazione tra un dispositivo e un access point ne vengono usati solo tre: destinazione, sorgente e BSSID. Il quarto viene utilizzato esclusivamente in modalità Wireless Distribution System, cioè in un ponte radio tra due access point, dove servono mittente originale, destinatario finale, trasmettitore intermedio e ricevitore intermedio.",
    whyOthersAreWrong: {
      "1":
        "Un solo indirizzo non basterebbe nemmeno a distinguere mittente e destinatario del frame.",
      "2":
        "Due indirizzi sono quelli del frame Ethernet, non del frame 802.11.",
      "3":
        "Tre sono gli indirizzi effettivamente compilati nell'uso standard con un access point, ma la domanda chiede quanti campi possono contenerne.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Struttura dell'header MAC 802.11 e uso dei bit To DS e From DS.",
      "Quattro campi previsti, tre usati di norma, il quarto solo in modalità WDS.",
      "Il wireless ha bisogno di più indirizzi perché il frame può passare da un AP intermedio.",
      "In quale scenario vengono effettivamente usati tutti e quattro gli indirizzi 802.11?",
    ),
  },
  {
    id: "hist-073",
    category: "Internet",
    topic: "porte e socket",
    difficulty: "media",
    question:
      "Come viene identificata univocamente una socket TCP?",
    options: [
      "Indirizzo IP mittente, porta mittente, numero di sequenza, numero di ack",
      "Indirizzo IP mittente, porta mittente, indirizzo IP destinazione, porta destinatario",
      "Indirizzo IP mittente, indirizzo IP destinazione",
      "Porta mittente, porta destinatario",
    ],
    correctAnswer:
      "Indirizzo IP mittente, porta mittente, indirizzo IP destinazione, porta destinatario",
    explanation:
      "Una socket TCP è definita univocamente dalla combinazione di quattro parametri, la cosiddetta 4-tupla: indirizzo IP e porta del mittente, indirizzo IP e porta del destinatario. A differenza di UDP, dove basta la porta di destinazione per consegnare il pacchetto, TCP è connection-oriented: un server web sulla porta 80 può gestire migliaia di connessioni simultanee e deve poterle distinguere, cosa possibile solo controllando l'intera quaterna.",
    whyOthersAreWrong: {
      "Indirizzo IP mittente, porta mittente, numero di sequenza, numero di ack":
        "Numeri di sequenza e riscontro servono all'affidabilità del flusso, non a identificare la connessione.",
      "Indirizzo IP mittente, indirizzo IP destinazione":
        "Senza le porte non si potrebbero distinguere connessioni diverse tra gli stessi due host.",
      "Porta mittente, porta destinatario":
        "Senza gli indirizzi IP non si potrebbero distinguere client diversi che usano lo stesso numero di porta.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Identificazione di una connessione TCP tramite 4-tupla.",
      "Due indirizzi IP più due porte: solo insieme identificano la connessione.",
      "Il server distingue mille client sulla stessa porta 80 grazie a IP e porta sorgente.",
      "Quale differenza c'è tra il demultiplexing di TCP e quello di UDP?",
    ),
  },
  {
    id: "hist-074",
    category: "Internet",
    topic: "DNS",
    difficulty: "facile",
    question:
      "Quale tipo di resource record è usato dal DNS per configurare un alias?",
    options: [
      "CNAME",
      "NS",
      "ALIAS",
      "MX",
    ],
    correctAnswer:
      "CNAME",
    explanation:
      "Il record CNAME, cioè Canonical Name, viene utilizzato per creare un alias di un nome di dominio esistente. Se un server ha nome reale server1.esempio.it si può creare un record CNAME www.esempio.it che punta a esso: in questo modo, se l'indirizzo IP del server cambia, basta aggiornare il record A del nome canonico.",
    whyOthersAreWrong: {
      "NS":
        "Il record NS indica quali sono i server DNS autorevoli per una specifica zona o dominio.",
      "ALIAS":
        "Non è un record standard definito nelle RFC originali del DNS, sebbene alcuni provider lo offrano come funzionalità interna.",
      "MX":
        "Il record MX specifica i server responsabili della ricezione della posta elettronica per quel dominio.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Tipi principali di resource record DNS e loro scopo.",
      "CNAME per gli alias, A per gli indirizzi, NS per i server di zona, MX per la posta.",
      "CNAME sta per Canonical Name: punta a un altro nome, non a un indirizzo.",
      "Quali servizi aggiuntivi oltre alla traduzione nome-IP offre il DNS?",
    ),
  },
  {
    id: "hist-075",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "media",
    question:
      "Un router IP dopo aver calcolato l'instradamento:",
    options: [
      "Modifica gli indirizzi IP sorgente e destinazione del datagramma",
      "Modifica esclusivamente il campo Time To Live nell'intestazione del datagramma",
      "Modifica i campi Time To Live e Header Checksum nell'intestazione del datagramma",
      "Modifica il campo Header Checksum nell'intestazione del datagramma",
    ],
    correctAnswer:
      "Modifica i campi Time To Live e Header Checksum nell'intestazione del datagramma",
    explanation:
      "Ogni router che riceve un pacchetto deve decrementare di uno il valore del campo TTL per evitare che i pacchetti circolino all'infinito in caso di loop di routing. Poiché il TTL cambia a ogni salto, l'intestazione IP viene modificata e di conseguenza il checksum calcolato in precedenza non è più valido: deve essere ricalcolato dal router prima dell'inoltro. Gli indirizzi IP invece rimangono invariati, salvo operazioni di NAT.",
    whyOthersAreWrong: {
      "Modifica gli indirizzi IP sorgente e destinazione del datagramma":
        "Gli indirizzi IP identificano i capolinea della comunicazione e restano invariati nel normale routing.",
      "Modifica esclusivamente il campo Time To Live nell'intestazione del datagramma":
        "È incompleta: cambiando il TTL diventa obbligatorio ricalcolare anche l'header checksum.",
      "Modifica il campo Header Checksum nell'intestazione del datagramma":
        "È incompleta nel senso opposto: il checksum cambia proprio perché è stato modificato il TTL.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Campi dell'header IP modificati durante l'inoltro.",
      "Il router tocca TTL e header checksum; gli indirizzi IP restano quelli originali.",
      "Se cambi un campo dell'intestazione devi rifare il conto che la protegge.",
      "In quale caso un router modifica anche gli indirizzi IP di un datagramma?",
    ),
  },
  {
    id: "hist-076",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "difficile",
    question:
      "Quale delle seguenti formule è corretta per il timer di ritrasmissione (RTO), dove SRTT è la media dei valori di RTT misurati e RTTVAR la stima della deviazione standard di RTT?",
    options: [
      "RTO = SRTT + 4 * RTTVAR",
      "RTO = RTT",
      "RTO = SRTT + 2 * RTTVAR",
      "RTO = SRTT * 2 + RTTVAR",
    ],
    correctAnswer:
      "RTO = SRTT + 4 * RTTVAR",
    explanation:
      "SRTT rappresenta la media mobile dei tempi di andata e ritorno misurati e fornisce una stima stabile del ritardo attuale della rete, mentre RTTVAR rappresenta la variazione dei campioni rispetto alla media. Lo standard TCP utilizza un fattore moltiplicativo pari a 4 per la variazione, così da garantire che il timer non scada prematuramente in presenza di alta varianza nei ritardi, lasciando un margine di sicurezza sufficientemente ampio.",
    whyOthersAreWrong: {
      "RTO = RTT":
        "Usare il singolo RTT misurato renderebbe il timer estremamente instabile e soggetto a scadenze premature a ogni fluttuazione.",
      "RTO = SRTT + 2 * RTTVAR":
        "Il coefficiente corretto previsto dallo standard è 4, non 2: un margine troppo stretto causerebbe ritrasmissioni inutili.",
      "RTO = SRTT * 2 + RTTVAR":
        "Raddoppiare la media invece di pesare la variabilità non è la formula standard e produrrebbe timeout sistematicamente troppo lunghi.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Formula del Retransmission Timeout e ruolo della variabilità.",
      "RTO somma la media degli RTT a quattro volte la loro variabilità.",
      "Il quattro è il margine di sicurezza: più la rete è instabile, più il timer si allarga.",
      "Perché un valore di RTO troppo basso è dannoso quanto uno troppo alto?",
    ),
  },
  {
    id: "hist-077",
    category: "Internet",
    topic: "Wi-Fi e reti mobili",
    difficulty: "facile",
    question:
      "Da quale protocollo è adottato CSMA/CA?",
    options: [
      "802.5",
      "802.11",
      "802.3",
      "Nessuna delle precedenti",
    ],
    correctAnswer:
      "802.11",
    explanation:
      "CSMA/CA è il metodo di accesso al mezzo utilizzato nelle reti wireless. Poiché un'interfaccia radio non può rilevare una collisione mentre sta trasmettendo, a causa del problema del nodo nascosto e di limiti hardware, il protocollo cerca di prevenire le collisioni: prima di trasmettere il nodo ascolta il canale e, se occupato, attende un tempo casuale di backoff. Spesso utilizza anche i messaggi RTS/CTS.",
    whyOthersAreWrong: {
      "802.5":
        "Token Ring utilizza il passaggio di un gettone per regolare l'accesso al mezzo, eliminando alla base il concetto di collisione.",
      "802.3":
        "Ethernet utilizza CSMA/CD, dove le collisioni vengono rilevate dopo che sono avvenute e gestite di conseguenza.",
      "Nessuna delle precedenti":
        "Uno degli standard elencati adotta effettivamente CSMA/CA, quindi l'alternativa non è valida.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Corrispondenza tra standard IEEE 802 e metodo di accesso al mezzo.",
      "802.3 con CSMA/CD, 802.11 con CSMA/CA, 802.5 con token passing.",
      "Nel wireless non puoi ascoltare mentre parli, quindi devi evitare, non rilevare.",
      "Qual è il nome del protocollo di accesso al mezzo usato nella rete Wi-Fi?",
    ),
  },
  {
    id: "hist-078",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "media",
    question:
      "Supponendo che tra i nodi A e B esista una connessione TCP nello stato established, e che il segmento inviato dal nodo A contenga un sequence number pari a 201 e un valore di length pari a 100, quale valore inserisce il nodo B nel campo acknowledgment del segmento di ACK inviato ad A?",
    options: [
      "301",
      "200",
      "300",
      "201",
    ],
    correctAnswer:
      "301",
    explanation:
      "Il segmento inizia dal byte numero 201 e ha una lunghezza di 100 byte, quindi i byte contenuti vanno dal 201 al 300 compreso. In TCP il numero di acknowledgment non conferma l'ultimo byte ricevuto ma comunica al mittente qual è il prossimo byte atteso: avendo ricevuto correttamente fino al 300, il nodo B richiede il 301. La formula rapida è sequence number più length.",
    whyOthersAreWrong: {
      "200":
        "È precedente al primo byte del segmento e indicherebbe che B non ha ricevuto nulla di quanto inviato.",
      "201":
        "È il numero di sequenza iniziale del segmento, non il riscontro dei dati ricevuti.",
      "300":
        "È l'ultimo byte effettivamente ricevuto, ma l'ACK deve indicare il byte successivo atteso.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Calcolo del numero di acknowledgment in TCP.",
      "ACK = sequence number + length, cioè il prossimo byte che il ricevitore si aspetta.",
      "L'ACK guarda avanti, non indietro: dice cosa vuole, non cosa ha avuto.",
      "Quale ACK invia il ricevitore dopo due segmenti consecutivi da 60 e 30 byte con sequenza iniziale 127?",
    ),
  },
  {
    id: "hist-079",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "facile",
    question:
      "Indicare a quale categoria appartiene il protocollo OSPF.",
    options: [
      "Routed protocol",
      "Path Vector Protocol",
      "Distance Vector Protocol",
      "Link State",
    ],
    correctAnswer:
      "Link State",
    explanation:
      "In un protocollo Link State come OSPF ogni router invia informazioni sullo stato dei propri collegamenti, i Link State Advertisement, a tutti gli altri router dell'area. Ogni nodo costruisce così una visione identica e completa della topologia e, una volta ottenuta la mappa, utilizza l'algoritmo SPF di Dijkstra per calcolare l'albero dei cammini minimi verso ogni destinazione.",
    whyOthersAreWrong: {
      "Routed protocol":
        "Un routed protocol è quello che viene instradato e trasporta i dati dell'utente, come IP, non quello che decide le rotte.",
      "Path Vector Protocol":
        "Il path vector è la categoria di BGP, che memorizza l'intero percorso in termini di sistemi autonomi.",
      "Distance Vector Protocol":
        "Il distance vector è la categoria di RIP, dove i router conoscono solo distanza e direzione basandosi sui vicini.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Classificazione dei protocolli di routing e loro algoritmi.",
      "OSPF è link state e usa Dijkstra; RIP è distance vector e usa Bellman-Ford.",
      "Open Shortest Path First: il nome stesso richiama Shortest Path First, cioè Dijkstra.",
      "Quale algoritmo utilizza OSPF per determinare le tabelle di forwarding?",
    ),
  },
  {
    id: "hist-080",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "media",
    question:
      "Indicare quale dei seguenti indirizzi in sintassi CIDR è corretto per indicare una rete che permette 1024 indirizzi di host.",
    options: [
      "100.200.20.40",
      "100.200.20.40/23",
      "100.200.20.40/22",
      "100.200.20.40/24",
    ],
    correctAnswer:
      "100.200.20.40/22",
    explanation:
      "Per avere 1024 combinazioni servono 10 bit dedicati alla parte host, poiché 2 elevato a 10 fa 1024. Un indirizzo IPv4 è composto da 32 bit totali, quindi i bit rimanenti per la maschera di rete sono 32 meno 10, cioè 22. In una rete reale gli host utilizzabili sarebbero 1022, togliendo indirizzo di rete e di broadcast, ma la dimensione del blocco resta definita dal prefisso /22.",
    whyOthersAreWrong: {
      "100.200.20.40":
        "Senza prefisso non definisce una rete ma un singolo host: non si può determinare l'estensione della sottorete.",
      "100.200.20.40/23":
        "Un /23 lascia 9 bit per gli host, cioè 512 indirizzi, insufficienti rispetto ai 1024 richiesti.",
      "100.200.20.40/24":
        "Un /24 lascia 8 bit per gli host, cioè 256 indirizzi, molto meno di quanto richiesto.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Relazione tra prefisso CIDR e numero di indirizzi disponibili.",
      "Bit host = log2(indirizzi richiesti); prefisso = 32 meno i bit host.",
      "1024 è 2^10, quindi 32 − 10 = 22. Ogni bit in meno raddoppia il blocco.",
      "Qual è il suffisso CIDR corretto per un'organizzazione che necessita di 1023 indirizzi?",
    ),
  },
  {
    id: "hist-081",
    category: "Internet",
    topic: "SMTP, POP3, IMAP",
    difficulty: "facile",
    question:
      "Quale fra i seguenti è il protocollo utilizzato per il recupero dei messaggi di posta elettronica inviati tramite SMTP?",
    options: [
      "FTP",
      "POP3",
      "HTTP",
      "Sempre SMTP",
    ],
    correctAnswer:
      "POP3",
    explanation:
      "SMTP è utilizzato esclusivamente per il trasferimento e l'invio della posta elettronica, sia dal client verso il server sia tra server diversi. POP3 è invece un protocollo di accesso alla posta, usato dal client per recuperare i messaggi dal server: tradizionalmente li scarica in locale e li cancella dal server, anche se le configurazioni moderne permettono di mantenerne copia.",
    whyOthersAreWrong: {
      "FTP":
        "FTP è usato per il trasferimento di file generici e non ha alcun ruolo nella gestione della posta elettronica.",
      "HTTP":
        "HTTP è usato dalle webmail come trasporto nel browser, ma il protocollo specifico per la gestione della posta resta POP3 o IMAP.",
      "Sempre SMTP":
        "SMTP serve a inviare e trasferire i messaggi, non a scaricarli dalla casella del destinatario.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Divisione dei ruoli tra protocolli di invio e di accesso alla posta.",
      "SMTP spinge i messaggi, POP3 e IMAP li tirano giù dalla casella.",
      "SMTP è push, POP e IMAP sono pull.",
      "Quale protocollo permette di mantenere le email sul server e organizzarle in cartelle?",
    ),
  },
  {
    id: "hist-082",
    category: "Internet",
    topic: "Ethernet",
    difficulty: "media",
    question:
      "Quale delle seguenti affermazioni è vera per CSMA/CD?",
    options: [
      "Quando un dispositivo verifica la presenza della portante, può trasmettere senza rischio di collisione",
      "Tutti i dispositivi di rete devono verificare la presenza della portante prima di trasmettere",
      "I dispositivi trasmettono immediatamente e poi verificano una eventuale collisione",
      "I dispositivi coinvolti in una collisione acquisiscono priorità sugli altri presenti in rete",
    ],
    correctAnswer:
      "Tutti i dispositivi di rete devono verificare la presenza della portante prima di trasmettere",
    explanation:
      "La prima regola del protocollo è ascolta prima di parlare: ogni nodo deve verificare se c'è un segnale sul cavo e, se il canale è occupato, attende. Questo è il Carrier Sense da cui prende il nome il protocollo, ed è un obbligo per tutte le stazioni della rete condivisa.",
    whyOthersAreWrong: {
      "Quando un dispositivo verifica la presenza della portante, può trasmettere senza rischio di collisione":
        "Anche con il canale apparentemente libero resta un rischio dovuto al ritardo di propagazione: due nodi possono iniziare quasi contemporaneamente senza essersi ancora sentiti.",
      "I dispositivi trasmettono immediatamente e poi verificano una eventuale collisione":
        "Trasmettere senza ascoltare prima contraddice il Carrier Sense: l'ascolto preventivo è obbligatorio.",
      "I dispositivi coinvolti in una collisione acquisiscono priorità sugli altri presenti in rete":
        "È il contrario: dopo una collisione devono attendere un tempo casuale di backoff e competere di nuovo per il canale.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Fasi del protocollo CSMA/CD e residuo rischio di collisione.",
      "Ascolta, trasmetti, continua ad ascoltare: il rischio residuo dipende dalla propagazione.",
      "Carrier Sense significa ascoltare prima; Collision Detection significa ascoltare anche durante.",
      "Cosa fa una stazione Ethernet subito dopo aver rilevato una collisione?",
    ),
  },
  {
    id: "hist-083",
    category: "Internet",
    topic: "DHCP",
    difficulty: "facile",
    question:
      "Quale dei seguenti non è un messaggio del protocollo DHCP?",
    options: [
      "DHCP Accept",
      "DHCP Discover",
      "DHCP Offer",
      "DHCP Request",
    ],
    correctAnswer:
      "DHCP Accept",
    explanation:
      "Il ciclo di vita standard del protocollo DHCP segue l'acronimo DORA: Discover, con cui il client cerca in broadcast i server disponibili; Offer, con cui il server propone un indirizzo IP e altri parametri; Request, con cui il client richiede formalmente quell'indirizzo; e Acknowledgment, con cui il server conferma l'assegnazione. Non esiste alcun messaggio chiamato Accept: la conferma finale è sempre un ACK, o un NAK in caso di rifiuto.",
    whyOthersAreWrong: {
      "DHCP Discover":
        "È il primo messaggio del ciclo DORA, inviato in broadcast dal client per individuare i server.",
      "DHCP Offer":
        "È la risposta del server che propone un indirizzo IP disponibile dal proprio pool.",
      "DHCP Request":
        "È il messaggio con cui il client accetta l'offerta e richiede formalmente l'assegnazione.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Sequenza DORA del protocollo DHCP.",
      "Discover, Offer, Request, Acknowledgment: nessun messaggio si chiama Accept.",
      "Ricorda DORA: se un nome non sta in queste quattro lettere, è inventato.",
      "Qual è la risposta attesa al messaggio DHCP Discover?",
    ),
  },
  {
    id: "hist-084",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "difficile",
    question:
      "Indicare quale affermazione è corretta per un algoritmo di tipo Link State.",
    options: [
      "I pacchetti di link-state inviati da un router non vengono ricevuti dagli altri router",
      "Nessuna delle altre affermazioni è corretta",
      "Ogni router ha una mappa completa della rete e tutti i router cooperano per calcolare l'albero dei cammini minimi che è identico per tutti",
      "Ogni router ha una mappa completa della rete e calcola, indipendentemente dagli altri router, i cammini",
    ],
    correctAnswer:
      "Ogni router ha una mappa completa della rete e calcola, indipendentemente dagli altri router, i cammini",
    explanation:
      "In un algoritmo Link State ogni router possiede il Link State Database, una copia esatta della topologia dell'intera rete. Una volta sincronizzato il database, ogni router esegue l'algoritmo di Dijkstra localmente e in modo indipendente: i router cooperano per scambiarsi le informazioni, ma non per eseguire il calcolo.",
    whyOthersAreWrong: {
      "I pacchetti di link-state inviati da un router non vengono ricevuti dagli altri router":
        "È falsa: gli LSA vengono diffusi in flooding proprio perché tutti i router li ricevano e costruiscano lo stesso database.",
      "Nessuna delle altre affermazioni è corretta":
        "Una delle affermazioni descrive correttamente il funzionamento, quindi l'alternativa non è valida.",
      "Ogni router ha una mappa completa della rete e tutti i router cooperano per calcolare l'albero dei cammini minimi che è identico per tutti":
        "L'albero risultante non è identico per tutti: ogni nodo calcola i percorsi mettendo se stesso come radice, quindi il risultato dipende dal punto di partenza.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Sincronizzazione del database contro indipendenza del calcolo nei link state.",
      "Database condiviso e identico, ma calcolo locale con se stessi come radice.",
      "Stessa mappa per tutti, percorso diverso per ciascuno: dipende da dove parti.",
      "Quale struttura dati sincronizzano tra loro i router che usano OSPF?",
    ),
  },
  {
    id: "hist-085",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "media",
    question:
      "Quale protocollo utilizza il BGP per trasferire informazioni?",
    options: [
      "TCP",
      "UDP",
      "IP",
      "Nessuno di quelli indicati",
    ],
    correctAnswer:
      "TCP",
    explanation:
      "BGP è un protocollo di tipo Path Vector utilizzato per il routing tra diversi Sistemi Autonomi. Poiché deve scambiare enormi quantità di dati, cioè le tabelle di routing globali, necessita della consegna garantita, del controllo degli errori e della gestione del flusso offerti da TCP, sul quale opera usando la porta 179. Questo gli evita di dover implementare internamente meccanismi di frammentazione, riordinamento e ritrasmissione.",
    whyOthersAreWrong: {
      "UDP":
        "UDP è usato da RIP sulla porta 520, che privilegia la velocità e gestisce internamente i propri timer, ma non da BGP.",
      "IP":
        "Girare direttamente sopra IP è la scelta di OSPF, che usa il numero di protocollo 89, non di BGP.",
      "Nessuno di quelli indicati":
        "BGP si appoggia effettivamente a uno dei protocolli elencati, quindi l'alternativa non è valida.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Protocollo di trasporto usato dai principali protocolli di routing.",
      "BGP su TCP porta 179, RIP su UDP porta 520, OSPF direttamente su IP.",
      "Chi scambia tabelle enormi non può permettersi di perderne pezzi: serve TCP.",
      "Quali sono gli attributi obbligatori in eBGP?",
    ),
  },
  {
    id: "hist-086",
    category: "Internet",
    topic: "livello collegamento",
    difficulty: "media",
    question:
      "Qual è la funzione fondamentale del sottolivello MAC?",
    options: [
      "Quella di fornire un'interfaccia unificata verso il livello di rete",
      "Quella di offrire servizi per la frammentazione delle frame",
      "Quella di offrire servizi orientati alla connessione",
      "Quella di risolvere il problema della condivisione del mezzo trasmissivo",
    ],
    correctAnswer:
      "Quella di risolvere il problema della condivisione del mezzo trasmissivo",
    explanation:
      "Il sottolivello MAC è responsabile della gestione dell'accesso al mezzo trasmissivo quando questo è condiviso tra più dispositivi. Senza un protocollo MAC, due dispositivi che trasmettessero contemporaneamente sovrapporrebbero i segnali causando una collisione: il MAC implementa quindi le regole, come CSMA/CD o CSMA/CA, che stabiliscono chi può trasmettere e quando.",
    whyOthersAreWrong: {
      "Quella di fornire un'interfaccia unificata verso il livello di rete":
        "Questo è compito del sottolivello LLC, che si occupa dell'interfaccia verso il livello superiore e del controllo di errore e flusso.",
      "Quella di offrire servizi per la frammentazione delle frame":
        "La frammentazione è tipicamente una funzione del livello di rete, non lo scopo fondamentale del sottolivello MAC.",
      "Quella di offrire servizi orientati alla connessione":
        "Il livello data link nelle LAN offre normalmente un servizio connectionless e non affidabile.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Divisione del livello data link in sottolivelli LLC e MAC.",
      "MAC decide chi parla sul mezzo condiviso; LLC guarda verso il livello di rete.",
      "Medium Access Control: il nome dice già che controlla l'accesso al mezzo.",
      "Quale sottolivello del data link si occupa dell'indirizzamento fisico?",
    ),
  },
  {
    id: "hist-087",
    category: "Internet",
    topic: "Ethernet",
    difficulty: "difficile",
    question:
      "Nell'algoritmo Ethernet CSMA/CD, quanto tempo attende il NIC prima di ritrasmettere il frame (binary backoff) dopo m collisioni?",
    options: [
      "k · 512 con k appartenente a {0, 1, 2, ..., 2^(m−1)}",
      "k secondi con k appartenente a {0, 1, 2, ..., m}",
      "k · 512 con k appartenente a {0, 1, 2, ..., m}",
      "k · 512 con k appartenente a {0, 1, 2, ..., 2^m − 1}",
    ],
    correctAnswer:
      "k · 512 con k appartenente a {0, 1, 2, ..., 2^m − 1}",
    explanation:
      "Dopo la m-esima collisione consecutiva il trasmettitore sceglie un numero intero casuale k nell'intervallo da 0 a 2 elevato a m meno 1, e lo moltiplica per 512 bit-time, che corrisponde al tempo di trasmissione di un frame minimo di 64 byte. Dopo la prima collisione k vale 0 o 1, dopo la seconda va da 0 a 3, dopo la terza da 0 a 7: l'intervallo raddoppia ogni volta, diluendo i tentativi quando la rete è congestionata.",
    whyOthersAreWrong: {
      "k · 512 con k appartenente a {0, 1, 2, ..., 2^(m−1)}":
        "L'estremo superiore corretto è 2^m − 1, non 2^(m−1): questa versione restringe erroneamente l'intervallo di contesa.",
      "k secondi con k appartenente a {0, 1, 2, ..., m}":
        "L'unità di misura non è il secondo ma il bit-time, e l'intervallo cresce esponenzialmente, non linearmente.",
      "k · 512 con k appartenente a {0, 1, 2, ..., m}":
        "Una crescita lineare in m non ridurrebbe abbastanza la probabilità di collisioni ripetute: la crescita è esponenziale.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Formula del backoff esponenziale binario e unità di misura in bit-time.",
      "k casuale in [0, 2^m − 1] moltiplicato per 512 bit-time.",
      "L'intervallo raddoppia a ogni collisione: è binario ed esponenziale, non lineare.",
      "Dopo quante collisioni consecutive un frame viene definitivamente scartato?",
    ),
  },
  {
    id: "hist-088",
    category: "Internet",
    topic: "DHCP",
    difficulty: "facile",
    question:
      "Indicare quale delle seguenti affermazioni è vera.",
    options: [
      "DHCP usa il protocollo HTTP",
      "DHCP usa il protocollo UDP",
      "Nessuna delle precedenti",
      "DHCP usa il protocollo TCP",
    ],
    correctAnswer:
      "DHCP usa il protocollo UDP",
    explanation:
      "Il processo di assegnazione degli indirizzi avviene spesso prima che l'host abbia uno stack IP completamente configurato, e UDP è adatto a questo compito perché permette l'invio di messaggi in broadcast, cosa che TCP non può fare. Il protocollo si appoggia a due porte specifiche: la 67 usata dal server per ricevere le richieste e la 68 usata dal client per ricevere le risposte. Trattandosi di pochi messaggi, l'overhead di una connessione TCP sarebbe controproducente.",
    whyOthersAreWrong: {
      "DHCP usa il protocollo HTTP":
        "HTTP è un protocollo applicativo per il web e non ha alcun ruolo nella configurazione automatica degli indirizzi.",
      "Nessuna delle precedenti":
        "Una delle affermazioni è corretta, quindi questa alternativa non è valida.",
      "DHCP usa il protocollo TCP":
        "TCP non supporta il broadcast e richiederebbe un handshake impossibile per un host privo di indirizzo IP.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Motivazioni della scelta di UDP in DHCP e porte utilizzate.",
      "DHCP su UDP, porte 67 lato server e 68 lato client, con messaggi in broadcast.",
      "Non hai ancora un indirizzo IP: non puoi aprire una connessione, devi gridare a tutti.",
      "Perché DHCP deve poter usare messaggi di broadcast nella fase iniziale?",
    ),
  },
  {
    id: "hist-089",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "media",
    question:
      "Il protocollo TCP:",
    options: [
      "Fornisce un rilevamento di errore sui dati di ogni segmento mediante un checksum",
      "Non fornisce un rilevamento e recupero di errore sui dati",
      "Non è affidabile",
      "Fornisce un rilevamento di errore solo sull'intestazione del segmento",
    ],
    correctAnswer:
      "Fornisce un rilevamento di errore sui dati di ogni segmento mediante un checksum",
    explanation:
      "A differenza del protocollo IP, il cui checksum protegge solo l'intestazione del pacchetto, il checksum di TCP viene calcolato su tutto il segmento, header e dati, e include anche uno pseudo-header con informazioni provenienti dal livello IP come gli indirizzi sorgente e destinazione. Se il checksum rivela un errore o se un segmento non viene confermato, TCP provvede alla ritrasmissione.",
    whyOthersAreWrong: {
      "Non fornisce un rilevamento e recupero di errore sui dati":
        "TCP non solo rileva l'errore ma lo recupera attivamente, richiedendo al mittente una nuova copia corretta dei dati.",
      "Non è affidabile":
        "TCP è per definizione un protocollo reliable: garantisce consegna, ordine e integrità.",
      "Fornisce un rilevamento di errore solo sull'intestazione del segmento":
        "Il controllo limitato alla sola intestazione è caratteristico di IPv4, non di TCP.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Copertura del checksum TCP rispetto a quello IP.",
      "Il checksum TCP copre header, dati e pseudo-header; quello IP solo l'intestazione.",
      "Il router controlla solo la busta per andare veloce; gli host controllano anche il contenuto.",
      "Qual è la dimensione del campo Internet Checksum nei protocolli di trasporto?",
    ),
  },
  {
    id: "hist-090",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "media",
    question:
      "Quale delle seguenti affermazioni è vera riguardo eBGP e iBGP?",
    options: [
      "eBGP e iBGP sono entrambi utilizzati all'interno di un singolo AS",
      "eBGP e iBGP sono due nomi diversi per la stessa cosa",
      "eBGP viene utilizzato tra router in AS diversi, mentre iBGP viene utilizzato tra router all'interno dello stesso AS",
      "iBGP viene utilizzato tra router in AS diversi, mentre eBGP viene utilizzato tra router all'interno dello stesso AS",
    ],
    correctAnswer:
      "eBGP viene utilizzato tra router in AS diversi, mentre iBGP viene utilizzato tra router all'interno dello stesso AS",
    explanation:
      "eBGP, cioè External BGP, viene stabilito tra router che appartengono a Sistemi Autonomi differenti ed è il protocollo che permette a Internet di funzionare come rete di reti scambiando rotte tra provider. iBGP, cioè Internal BGP, viene stabilito tra router dello stesso Sistema Autonomo e serve a distribuire internamente le rotte esterne apprese via eBGP.",
    whyOthersAreWrong: {
      "eBGP e iBGP sono entrambi utilizzati all'interno di un singolo AS":
        "Solo iBGP opera all'interno di un AS: eBGP nasce proprio per collegare AS distinti.",
      "eBGP e iBGP sono due nomi diversi per la stessa cosa":
        "Pur condividendo il formato dei messaggi hanno regole diverse, ad esempio nella gestione del next-hop e nella propagazione.",
      "iBGP viene utilizzato tra router in AS diversi, mentre eBGP viene utilizzato tra router all'interno dello stesso AS":
        "I ruoli sono invertiti: la e sta per external e la i per internal.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Distinzione tra sessioni BGP interne ed esterne.",
      "eBGP collega AS diversi, iBGP distribuisce le rotte dentro lo stesso AS.",
      "La lettera iniziale dice tutto: e come esterno, i come interno.",
      "Perché iBGP ha regole di propagazione più stringenti rispetto a eBGP?",
    ),
  },
  {
    id: "hist-091",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "media",
    question:
      "Indicare cosa permette la tecnica detta \"piggyback\".",
    options: [
      "Rimandare al trasmettitore eventuali unità dati che hanno subito errori di trasmissione",
      "Far sì che il ricevitore segnali esplicitamente al trasmettitore eventuali perdite di unità dati",
      "Concatenare più riscontri in un'unica unità di dati",
      "Trasportare informazioni di riscontro e dati utente nella stessa unità di dati",
    ],
    correctAnswer:
      "Trasportare informazioni di riscontro e dati utente nella stessa unità di dati",
    explanation:
      "Quando un nodo riceve dati e deve inviare sia un riscontro sia dei propri dati verso il mittente, invece di spedire due pacchetti separati inserisce il numero di ACK nell'intestazione del pacchetto che contiene i dati. Un esempio tipico è una sessione SSH o Telnet, dove il server risponde con un segmento che contiene sia l'ACK del carattere ricevuto sia il carattere di eco. Il vantaggio è la riduzione del numero di pacchetti piccoli in rete.",
    whyOthersAreWrong: {
      "Rimandare al trasmettitore eventuali unità dati che hanno subito errori di trasmissione":
        "Questa è la ritrasmissione, un meccanismo di recupero degli errori, non un'ottimizzazione dei riscontri.",
      "Far sì che il ricevitore segnali esplicitamente al trasmettitore eventuali perdite di unità dati":
        "Questo descrive i riscontri negativi o gli ACK duplicati, non il piggybacking.",
      "Concatenare più riscontri in un'unica unità di dati":
        "Questo si avvicina al concetto di ACK cumulativo, ma il piggyback riguarda l'unione di riscontro e dati, non di più riscontri tra loro.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Ottimizzazione del traffico tramite riscontri trasportati insieme ai dati.",
      "Un solo pacchetto porta sia i dati sia l'ACK, riducendo overhead e numero di invii.",
      "Piggyback significa a cavalluccio: l'ACK viaggia sulle spalle dei dati.",
      "Quali vantaggi concreti porta il piggybacking in termini di efficienza del canale?",
    ),
  },
  {
    id: "hist-092",
    category: "Internet",
    topic: "Introduzione a Internet",
    difficulty: "facile",
    question:
      "In che periodo Tim Berners-Lee propose HTML e HTTP?",
    options: [
      "Anni 90",
      "Anni 70",
      "Anni 60",
      "Anni 80",
    ],
    correctAnswer:
      "Anni 80",
    explanation:
      "Tim Berners-Lee scrisse la sua prima proposta per un sistema di gestione delle informazioni distribuito, che sarebbe diventato il World Wide Web, nel marzo del 1989 mentre lavorava al CERN di Ginevra. Tra la fine del 1989 e il 1990 vennero definiti i concetti base: il linguaggio HTML, il protocollo HTTP, il primo server web e il primo browser.",
    whyOthersAreWrong: {
      "Anni 90":
        "È l'errore più comune: negli anni 90 il Web è stato reso pubblico e diffuso, ma la proposta e l'invenzione dei protocolli appartengono al decennio precedente.",
      "Anni 70":
        "Negli anni 70 si sviluppava ARPANET e la commutazione di pacchetto, ma il Web non esisteva ancora nemmeno come idea.",
      "Anni 60":
        "Negli anni 60 si ponevano le basi teoriche delle reti a commutazione di pacchetto, molto prima del Web.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Cronologia della nascita del World Wide Web.",
      "Proposta nel 1989 al CERN, quindi anni 80; diffusione pubblica negli anni 90.",
      "1989 è ancora anni 80: la data di nascita non coincide con quella di popolarità.",
      "In quale anno il CERN rilasciò il codice del Web nel pubblico dominio?",
    ),
  },
  {
    id: "hist-093",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "facile",
    question:
      "La subnet mask (maschera di sotto rete) serve a identificare?",
    options: [
      "Quale porzione di un indirizzo IP indica l'ID di rete e quale invece l'ID dell'host",
      "L'indirizzo MAC di un host",
      "Quale porzione di un indirizzo IP indica l'ID sorgente e quale invece l'ID broadcast",
      "Quanti indirizzi IP posso usare",
    ],
    correctAnswer:
      "Quale porzione di un indirizzo IP indica l'ID di rete e quale invece l'ID dell'host",
    explanation:
      "La subnet mask funziona tramite un'operazione di AND logico bit a bit con l'indirizzo IP: i bit impostati a 1 indicano che i corrispondenti bit dell'indirizzo appartengono all'ID di rete, mentre i bit a 0 indicano la parte assegnata ai singoli dispositivi. Con 192.168.1.10 e maschera 255.255.255.0 i primi 24 bit sono la rete e gli ultimi 8 identificano l'host.",
    whyOthersAreWrong: {
      "L'indirizzo MAC di un host":
        "Il MAC è un indirizzo fisico di livello 2 e non ha alcuna relazione con la maschera di sottorete.",
      "Quale porzione di un indirizzo IP indica l'ID sorgente e quale invece l'ID broadcast":
        "Sorgente e broadcast non sono porzioni di un indirizzo: sono indirizzi distinti e completi.",
      "Quanti indirizzi IP posso usare":
        "La maschera permette indirettamente di calcolare il numero di indirizzi disponibili, ma la sua funzione primaria è separare prefisso di rete e parte host.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Funzione della subnet mask e operazione di AND logico.",
      "Bit a 1 indicano la rete, bit a 0 indicano l'host.",
      "La maschera copre la parte di rete e lascia scoperta quella degli host.",
      "Come si determina se due host appartengono alla stessa sottorete?",
    ),
  },
  {
    id: "hist-094",
    category: "Internet",
    topic: "DNS",
    difficulty: "media",
    question:
      "Quale tipo di risoluzione applica il Local Domain Name Server per trovare l'indirizzo IP corrispondente ad un nome logico?",
    options: [
      "Iterativa",
      "Nessuna delle precedenti",
      "Diretta",
      "Ricorsiva",
    ],
    correctAnswer:
      "Iterativa",
    explanation:
      "Bisogna distinguere due tipi di interrogazione. Il client invia una query ricorsiva al Local DNS, delegandogli l'intera ricerca e aspettandosi una risposta definitiva. Il Local DNS, per non sovraccaricare i server Root e TLD mondiali, effettua invece ricerche iterative: chiede al Root, che rimanda al TLD, chiede al TLD, che rimanda al server autoritativo, e infine chiede a quest'ultimo, che fornisce l'indirizzo IP.",
    whyOthersAreWrong: {
      "Nessuna delle precedenti":
        "Una delle modalità elencate descrive correttamente il comportamento del Local DNS verso la gerarchia.",
      "Diretta":
        "La risoluzione diretta indica la traduzione da nome a IP contrapposta a quella inversa: descrive l'obiettivo, non la modalità di interazione tra server.",
      "Ricorsiva":
        "La query ricorsiva è quella che il client invia al Local DNS, non quella che il Local DNS usa verso la gerarchia.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Ruolo del Local DNS tra query ricorsive e iterative.",
      "Client verso Local DNS: ricorsiva. Local DNS verso la gerarchia: iterativa.",
      "Il Local DNS accetta una delega, ma poi lavora a rimbalzi tra i server.",
      "In quale tipo di risoluzione un server DNS restituisce direttamente l'indirizzo IP cercato?",
    ),
  },
  {
    id: "hist-095",
    category: "Internet",
    topic: "SMTP, POP3, IMAP",
    difficulty: "facile",
    question:
      "Quale protocollo applicativo è usato per scambiare i contenuti fra i server mail?",
    options: [
      "IMAP",
      "http",
      "SMTP",
      "POP3",
    ],
    correctAnswer:
      "SMTP",
    explanation:
      "SMTP è un protocollo di tipo push il cui compito è spingere il messaggio dal mittente verso il destinatario. Viene usato sia dal client verso il proprio server di posta, sia soprattutto tra server di posta: quando un server deve consegnare un'email a un altro server utilizza esclusivamente SMTP, tipicamente sulla porta TCP 25.",
    whyOthersAreWrong: {
      "IMAP":
        "IMAP è un protocollo di accesso usato dall'utente finale per consultare la posta già consegnata, mai per lo scambio diretto tra server.",
      "http":
        "HTTP viene usato per accedere alle webmail dal browser, ma non è il protocollo con cui i server si scambiano i messaggi.",
      "POP3":
        "POP3 serve a scaricare i messaggi dal proprio server sul dispositivo locale, non a trasferirli tra server.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Protocolli di trasferimento contro protocolli di accesso alla posta.",
      "Tra server si usa sempre SMTP; IMAP e POP3 servono solo all'utente finale.",
      "SMTP è l'unico che consegna; gli altri due si limitano a farti leggere.",
      "Su quale porta TCP avviene tipicamente lo scambio SMTP tra server?",
    ),
  },
  {
    id: "hist-096",
    category: "Internet",
    topic: "sliding window",
    difficulty: "media",
    question:
      "Quale meccanismo viene utilizzato in TCP per evitare che alcuni segmenti vengano scartati perché uno dei due host è molto più veloce dell'altro?",
    options: [
      "Ritrasmissione",
      "Congestion control",
      "Flow control",
      "Handshake a tre vie",
    ],
    correctAnswer:
      "Flow control",
    explanation:
      "Il controllo di flusso garantisce che un mittente veloce non affoghi un ricevitore lento inviando dati a una velocità superiore a quella con cui il destinatario può processarli e liberare il proprio buffer. Il ricevitore comunica lo spazio libero rimasto tramite il campo Receive Window nell'header TCP, e il mittente è obbligato a non inviare più dati di quanti indicati.",
    whyOthersAreWrong: {
      "Ritrasmissione":
        "La ritrasmissione interviene dopo che un pacchetto è già andato perduto, non previene la saturazione del buffer.",
      "Congestion control":
        "Il controllo di congestione protegge la rete e i router intermedi dal collasso, mentre qui il problema è la differenza di velocità tra i due host.",
      "Handshake a tre vie":
        "L'handshake serve soltanto a instaurare la connessione, non a regolarne la velocità durante il trasferimento.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Differenza tra controllo di flusso e controllo di congestione.",
      "Flow control protegge il ricevitore, congestion control protegge la rete.",
      "Se il problema è il destinatario lento è flusso; se è la rete intasata è congestione.",
      "Quale campo dell'header TCP implementa concretamente il controllo di flusso?",
    ),
  },
  {
    id: "hist-097",
    category: "Internet",
    topic: "TCP e UDP",
    difficulty: "media",
    question:
      "Indicare quale affermazione è falsa in relazione al protocollo UDP.",
    options: [
      "La consegna dei dati non è garantita",
      "Supporta il meccanismo di correzione degli errori elementare",
      "La lunghezza dell'header non è variabile",
      "È possibile la ritrasmissione dei pacchetti",
    ],
    correctAnswer:
      "È possibile la ritrasmissione dei pacchetti",
    explanation:
      "UDP non mantiene traccia dei segmenti inviati e non attende riscontri, quindi non può sapere se un pacchetto è arrivato e non può ritrasmetterlo in caso di perdita. Le altre affermazioni sono vere: la consegna non è garantita perché il servizio è best effort, il checksum permette un rilevamento elementare degli errori, e l'header ha lunghezza fissa di 8 byte a differenza di quello TCP che varia per via delle opzioni.",
    whyOthersAreWrong: {
      "La consegna dei dati non è garantita":
        "È vera: UDP è best effort e se la rete è congestionata il pacchetto viene scartato senza recupero.",
      "Supporta il meccanismo di correzione degli errori elementare":
        "È vera nel senso del rilevamento: il checksum permette di accorgersi di un errore e scartare il pacchetto.",
      "La lunghezza dell'header non è variabile":
        "È vera: l'header UDP è fisso a 8 byte, con quattro campi da 2 byte ciascuno.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Limiti del servizio UDP e struttura del suo header.",
      "UDP rileva errori ma non li recupera, e non ritrasmette mai nulla.",
      "Senza ACK non puoi sapere cosa manca, quindi non puoi rispedirlo.",
      "Quanti byte aggiunge al messaggio un'intestazione UDP?",
    ),
  },
  {
    id: "hist-098",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "facile",
    question:
      "L'algoritmo di Dijkstra in quale categoria rientra?",
    options: [
      "Link state",
      "Distance vector",
      "È utilizzabile in quelli indicati",
      "Path oriented",
    ],
    correctAnswer:
      "Link state",
    explanation:
      "Gli algoritmi Link State si basano sulla diffusione a tutti i router delle informazioni relative allo stato dei collegamenti, così che ogni router costruisca una mappa completa della topologia. Una volta ottenuta la mappa, il router applica l'algoritmo di Dijkstra per calcolare l'albero dei cammini minimi ponendo se stesso come radice.",
    whyOthersAreWrong: {
      "Distance vector":
        "Gli algoritmi distance vector come RIP utilizzano Bellman-Ford, basato su scambi periodici con i soli vicini immediati.",
      "È utilizzabile in quelli indicati":
        "Dijkstra richiede la conoscenza globale della topologia, che il distance vector per definizione non possiede.",
      "Path oriented":
        "Non è una delle due categorie classiche di algoritmi di routing: la classificazione standard distingue link state e distance vector.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Abbinamento tra algoritmi matematici e categorie di routing.",
      "Dijkstra con link state, Bellman-Ford con distance vector.",
      "Dijkstra ha bisogno del grafo intero: solo il link state glielo fornisce.",
      "Quale protocollo di routing concreto implementa l'algoritmo di Dijkstra?",
    ),
  },
  {
    id: "hist-099",
    category: "Internet",
    topic: "HTTP/HTTPS",
    difficulty: "facile",
    question:
      "Quale dei seguenti metodi non è valido in una http request?",
    options: [
      "REMOVE",
      "DELETE",
      "GET",
      "POST",
    ],
    correctAnswer:
      "REMOVE",
    explanation:
      "I metodi standard del protocollo HTTP più utilizzati sono GET per richiedere una risorsa, POST per inviare dati al server, PUT per aggiornare completamente una risorsa e DELETE per eliminarla, oltre a HEAD, OPTIONS e PATCH per scopi specifici. REMOVE non fa parte del set di istruzioni riconosciute e causerebbe un errore 405 Method Not Allowed o 400 Bad Request nella maggior parte dei server.",
    whyOthersAreWrong: {
      "DELETE":
        "È un metodo standard, usato per richiedere la cancellazione della risorsa specificata.",
      "GET":
        "È il metodo fondamentale del protocollo, usato per recuperare la rappresentazione di una risorsa.",
      "POST":
        "È un metodo standard, usato per inviare dati al server affinché vengano elaborati.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Insieme dei metodi HTTP standard.",
      "GET, POST, PUT, DELETE, HEAD, OPTIONS e PATCH sono validi; REMOVE non esiste.",
      "Per cancellare si dice DELETE, non REMOVE: è un falso amico.",
      "Quale metodo HTTP viene comunemente usato per recuperare risorse da un server web?",
    ),
  },
  {
    id: "hist-100",
    category: "Internet",
    topic: "Ethernet",
    difficulty: "facile",
    question:
      "Un cavo di rete presenta otto fili di rame intrecciati a due a due in quattro coppie, senza alcuna pellicola metallica o treccia di schermatura attorno alle coppie o sotto la guaina. Di che tipo di cavo si tratta?",
    options: [
      "Altro",
      "Fibra ottica",
      "UTP",
      "Coassiale",
    ],
    correctAnswer:
      "UTP",
    explanation:
      "Le caratteristiche descritte identificano un cavo UTP, cioè Unshielded Twisted Pair. La struttura a otto fili intrecciati in quattro coppie serve ad annullare le interferenze elettromagnetiche tramite il principio della cancellazione, mentre l'assenza di schermatura è proprio ciò che distingue l'UTP dalle varianti schermate come STP o FTP. L'eventuale spline centrale a croce che separa le coppie è tipica dei cavi di Categoria 6.",
    whyOthersAreWrong: {
      "Altro":
        "Le caratteristiche descritte corrispondono precisamente a una tipologia standard ben identificabile.",
      "Fibra ottica":
        "La fibra trasporta segnali luminosi in filamenti di vetro o plastica e non contiene coppie di fili di rame intrecciati.",
      "Coassiale":
        "Il cavo coassiale ha un singolo conduttore centrale circondato da un isolante e da una schermatura, non quattro coppie intrecciate.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Riconoscimento dei mezzi trasmissivi e significato della sigla UTP.",
      "Quattro coppie intrecciate e nessuna schermatura significano UTP.",
      "La U di UTP sta per Unshielded: se non c'è schermatura, è UTP.",
      "Quante coppie di fili in rame sono presenti in un cavo UTP?",
    ),
  },
  {
    id: "hist-101",
    category: "Internet",
    topic: "SMTP, POP3, IMAP",
    difficulty: "facile",
    question:
      "Il protocollo POP3:",
    options: [
      "Può essere usato per inviare email da un client su PC a un server email",
      "Utilizza come protocollo UDP",
      "Può essere usato per vedere le immagini",
      "Può essere usato per trasferire email da un server ad un client email installato su un PC",
    ],
    correctAnswer:
      "Può essere usato per trasferire email da un server ad un client email installato su un PC",
    explanation:
      "POP3 segue un modello pull: serve a scaricare le email dal server al dispositivo locale. Utilizza TCP sulla porta 110 per garantire che i messaggi non vadano persi durante il download. Tradizionalmente cancella i messaggi dal server dopo averli scaricati, anche se le configurazioni moderne permettono di mantenerne copia.",
    whyOthersAreWrong: {
      "Può essere usato per inviare email da un client su PC a un server email":
        "L'invio è gestito da SMTP: POP3 è un protocollo di sola consultazione e scaricamento.",
      "Utilizza come protocollo UDP":
        "POP3 si appoggia a TCP, perché il download della posta richiede affidabilità totale.",
      "Può essere usato per vedere le immagini":
        "La visualizzazione degli allegati è compito del client di posta, non una funzione del protocollo POP3.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Modello pull di POP3 e porta di trasporto utilizzata.",
      "POP3 scarica la posta dal server via TCP sulla porta 110.",
      "POP tira giù, SMTP spinge su.",
      "Quale differenza principale c'è tra POP3 e IMAP nella gestione dei messaggi?",
    ),
  },
  {
    id: "hist-102",
    category: "Internet",
    topic: "DHCP",
    difficulty: "media",
    question:
      "Quale protocollo permette di automatizzare la configurazione del livello di rete DNS?",
    options: [
      "RIP",
      "SMTP",
      "ARP",
      "DHCP",
    ],
    correctAnswer:
      "DHCP",
    explanation:
      "All'interno dei messaggi di risposta del server, DHCP Offer e DHCP ACK, sono presenti delle opzioni, in particolare l'Opzione 6, che comunicano al client l'indirizzo IP di uno o più server DNS da interrogare. Senza DHCP l'utente dovrebbe inserire manualmente l'indirizzo del server DNS nelle impostazioni di rete a ogni nuova connessione.",
    whyOthersAreWrong: {
      "RIP":
        "RIP è un protocollo di routing di livello 3 e non distribuisce parametri di configurazione agli host.",
      "SMTP":
        "SMTP è un protocollo applicativo per il trasferimento della posta elettronica.",
      "ARP":
        "ARP serve a mappare indirizzi IP su indirizzi MAC nella rete locale, non a fornire la configurazione DNS.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Parametri di configurazione distribuiti tramite le opzioni DHCP.",
      "DHCP fornisce IP, maschera, gateway e anche gli indirizzi dei server DNS.",
      "Tutto ciò che ti arriva automaticamente all'accensione passa da DHCP.",
      "Quale protocollo è usato per ottenere dinamicamente un indirizzo IP in una rete locale?",
    ),
  },
  {
    id: "hist-103",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "difficile",
    question:
      "Una tabella di forwarding contiene le seguenti righe: 0.0.0.0/0 verso Eth0; 192.168.10.0/24 verso Eth0; 192.168.11.1/24 verso Eth1; 209.165.200.0/16 verso Eth2. Quale azione intraprende il router all'arrivo di un datagramma il cui indirizzo di destinazione è 209.165.201.16?",
    options: [
      "Instrada il datagramma su Eth2",
      "Instrada il datagramma su Eth0",
      "Restituisce il datagramma al mittente",
      "Instrada il datagramma su Eth1",
    ],
    correctAnswer:
      "Instrada il datagramma su Eth2",
    explanation:
      "Il processo di decisione del router segue la regola del longest prefix match, cioè la corrispondenza del prefisso più lungo. La riga 209.165.200.0/16 indica che tutti gli indirizzi che iniziano con 209.165 devono essere inviati a Eth2, e l'indirizzo di destinazione inizia esattamente con 209.165. Sebbene corrisponda anche alla rotta di default 0.0.0.0/0, il router sceglie sempre la riga con la maschera più specifica.",
    whyOthersAreWrong: {
      "Instrada il datagramma su Eth0":
        "Eth0 corrisponde alla rotta di default e alla rete 192.168.10.0/24: la default viene usata solo se nessuna rotta più specifica corrisponde.",
      "Restituisce il datagramma al mittente":
        "Esiste una rotta valida per la destinazione, quindi non c'è motivo di generare un errore di irraggiungibilità.",
      "Instrada il datagramma su Eth1":
        "Eth1 serve la rete 192.168.11.0/24, che non ha alcuna corrispondenza con l'indirizzo 209.165.201.16.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Regola del longest prefix match nella consultazione della tabella di forwarding.",
      "Tra più rotte corrispondenti vince sempre quella con il prefisso più lungo.",
      "La rotta di default è l'ultima spiaggia: si usa solo se nient'altro corrisponde.",
      "Quale interfaccia viene scelta se un indirizzo corrisponde sia a un prefisso /21 sia a uno /24?",
    ),
  },
  {
    id: "hist-104",
    category: "Internet",
    topic: "livello collegamento",
    difficulty: "media",
    question:
      "Indicare quale delle seguenti corrispondenze tra livello e PDU è scorretta.",
    options: [
      "IP - Datagram",
      "IP - Frame",
      "Nessuna corrispondenza è scorretta",
      "TCP - Segmento",
    ],
    correctAnswer:
      "IP - Frame",
    explanation:
      "Ogni livello dello stack ha la propria PDU: al livello di trasporto TCP corrisponde il segmento, al livello di rete IP corrisponde il datagramma o pacchetto, al livello data link corrisponde il frame e al livello fisico il bit. Associare IP al frame è quindi scorretto, perché il frame appartiene al livello di collegamento, dove il datagramma viene incapsulato con header e trailer contenenti gli indirizzi MAC.",
    whyOthersAreWrong: {
      "IP - Datagram":
        "È corretta: la PDU del livello di rete si chiama datagramma, o equivalentemente pacchetto.",
      "Nessuna corrispondenza è scorretta":
        "Una delle corrispondenze elencate è effettivamente errata, quindi l'alternativa non è valida.",
      "TCP - Segmento":
        "È corretta: la PDU del livello di trasporto in TCP si chiama segmento.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Nomenclatura delle PDU nei vari livelli dello stack.",
      "Bit, frame, datagramma, segmento, messaggio: dal livello 1 al livello applicativo.",
      "Il frame è sempre di livello 2: se lo vedi accostato a IP, è sbagliato.",
      "Quale nome assume la PDU del livello di trasporto quando si usa UDP?",
    ),
  },
  {
    id: "hist-105",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "facile",
    question:
      "Il protocollo OSPF per determinare le tabelle di forwarding utilizza:",
    options: [
      "L'algoritmo Distance Vector",
      "BGP",
      "Algoritmo Link State",
      "RIP",
    ],
    correctAnswer:
      "Algoritmo Link State",
    explanation:
      "Il funzionamento di OSPF si basa su tre fasi: i router scoprono i vicini e scambiano i Link State Advertisement contenenti informazioni sui propri collegamenti diretti; ogni router raccoglie gli LSA di tutti gli altri costruendo un database topologico completo dell'area; infine su questa mappa esegue l'algoritmo SPF di Dijkstra per determinare i cammini minimi e popolare la tabella di forwarding.",
    whyOthersAreWrong: {
      "L'algoritmo Distance Vector":
        "Il distance vector è usato da RIP e si basa su Bellman-Ford e sullo scambio di tabelle con i soli vicini.",
      "BGP":
        "BGP è un altro protocollo di routing, di tipo path vector e usato tra sistemi autonomi diversi, non un algoritmo impiegato da OSPF.",
      "RIP":
        "RIP è un protocollo distinto e alternativo a OSPF, non un algoritmo che OSPF utilizza al suo interno.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Fasi di funzionamento di OSPF e ruolo del Link State Database.",
      "LSA in flooding, database topologico sincronizzato, poi Dijkstra in locale.",
      "OSPF significa Open Shortest Path First: il cammino minimo è calcolato da Dijkstra.",
      "A quale categoria di protocolli di routing appartiene OSPF?",
    ),
  },
  {
    id: "hist-107",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "media",
    question:
      "Qualora un router (o un host destinazione) riceva un pacchetto IP che incapsula un segmento TCP la cui intestazione ha come destinatario una porta TCP inesistente, cosa avviene?",
    options: [
      "Lo scarta ed invia un pacchetto ICMP alla destinazione",
      "Lo scarta ed invia un pacchetto ICMP alla sorgente",
      "Lo passa ad un processo applicativo di default che gestisce tutti i pacchetti TCP",
      "Ignora il valore della porta TCP ed inoltra il pacchetto",
    ],
    correctAnswer:
      "Lo scarta ed invia un pacchetto ICMP alla sorgente",
    explanation:
      "Quando il livello di trasporto rileva che la porta di destinazione non è attiva, il pacchetto viene scartato perché non può essere consegnato a nessuna applicazione. Per notificare l'accaduto viene inviato un pacchetto ICMP di tipo 3, Destination Unreachable, con codice 3, Port Unreachable. Il messaggio deve necessariamente essere inviato alla sorgente, cioè al mittente originale, affinché possa gestire l'errore.",
    whyOthersAreWrong: {
      "Lo scarta ed invia un pacchetto ICMP alla destinazione":
        "La destinazione è proprio il nodo che ha rilevato il problema: avvisare se stesso non avrebbe alcun senso.",
      "Lo passa ad un processo applicativo di default che gestisce tutti i pacchetti TCP":
        "Non esiste alcun processo di default che raccolga il traffico destinato a porte chiuse.",
      "Ignora il valore della porta TCP ed inoltra il pacchetto":
        "La porta è l'informazione che identifica il processo destinatario: ignorarla renderebbe impossibile la consegna.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Gestione degli errori di consegna e messaggi ICMP Destination Unreachable.",
      "Porta chiusa significa scarto del pacchetto e notifica ICMP al mittente.",
      "Le notifiche di errore tornano sempre indietro verso chi ha inviato.",
      "Quale flag TCP viene spesso usato in aggiunta per rifiutare una connessione verso una porta chiusa?",
    ),
  },
  {
    id: "hist-108",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "media",
    question:
      "Quale campo dell'intestazione IP corrisponde a questa descrizione: \"è un campo di quattro bit che dice la lunghezza dell'intestazione IP in parole da 32 bit\"?",
    options: [
      "Total length",
      "Type Of Service",
      "Header length",
      "Identifier",
    ],
    correctAnswer:
      "Header length",
    explanation:
      "Il valore contenuto in questi 4 bit non indica il numero di byte ma il numero di parole da 32 bit, cioè da 4 byte. Poiché l'intestazione IP standard senza opzioni è lunga 20 byte, il valore minimo del campo è 5, dato che 5 per 4 fa 20. Essendo un campo di 4 bit il valore massimo è 15, il che significa che l'intestazione può arrivare al massimo a 60 byte.",
    whyOthersAreWrong: {
      "Total length":
        "Il campo Total Length è di 16 bit e indica la lunghezza complessiva dell'intero datagramma, intestazione più dati.",
      "Type Of Service":
        "Il campo TOS indica il trattamento desiderato per il pacchetto in termini di priorità e qualità del servizio.",
      "Identifier":
        "Il campo Identifier è un identificativo a 16 bit usato per riassemblare i frammenti di uno stesso datagramma.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Campi dell'intestazione IPv4 e unità di misura dell'header length.",
      "Header length conta parole da 32 bit: minimo 5 (20 byte), massimo 15 (60 byte).",
      "Se il campo è di soli 4 bit non può contare byte: conta blocchi da 4 byte.",
      "Qual è la dimensione massima che può raggiungere l'intestazione di un datagramma IPv4?",
    ),
  },
  {
    id: "hist-109",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "media",
    question:
      "In IPv4, qualora i pacchetti siano frammentati, dove vengono riassemblati?",
    options: [
      "Router",
      "Host di destinazione",
      "Switch",
      "In base alle caratteristiche sia nei router che nell'host di destinazione",
    ],
    correctAnswer:
      "Host di destinazione",
    explanation:
      "I router devono essere il più veloci possibile nell'inoltro, e attendere tutti i frammenti per riassemblarli richiederebbe memoria e cicli di calcolo eccessivi. Inoltre, poiché i pacchetti IP possono seguire percorsi diversi, non è garantito che tutti i frammenti passino per lo stesso router intermedio. L'host di destinazione utilizza i campi Identification, Flags e Fragment Offset per rimettere insieme i dati nell'ordine corretto.",
    whyOthersAreWrong: {
      "Router":
        "Il router può frammentare in IPv4, ma non riassembla: dovrebbe attendere e memorizzare tutti i frammenti, rallentando l'inoltro.",
      "Switch":
        "Lo switch opera a livello 2 e non interpreta nemmeno l'intestazione IP, quindi non può occuparsi di frammentazione.",
      "In base alle caratteristiche sia nei router che nell'host di destinazione":
        "Il riassemblaggio avviene esclusivamente nell'host finale, mai nei nodi intermedi.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Frammentazione e riassemblaggio dei datagrammi IPv4.",
      "Frammentare può farlo anche un router; riassemblare solo la destinazione finale.",
      "Il riassemblaggio richiede di aspettare tutti i pezzi: un router non può permetterselo.",
      "Come cambia la gestione della frammentazione in IPv6 rispetto a IPv4?",
    ),
  },
  {
    id: "hist-110",
    category: "Internet",
    topic: "Wi-Fi e reti mobili",
    difficulty: "facile",
    question:
      "Qual è lo standard di riferimento per le comunicazioni wireless?",
    options: [
      "802.1",
      "802.24",
      "802.3",
      "802.11",
    ],
    correctAnswer:
      "802.11",
    explanation:
      "Lo standard 802.11 è il set di protocolli che gestisce l'accesso al mezzo tramite onde radio, utilizzando il metodo CSMA/CA per evitare le collisioni. Nel tempo si è evoluto in diverse varianti, come a, b, g, n, ac e ax, che hanno progressivamente aumentato la velocità di trasmissione e l'efficienza nell'uso dello spettro.",
    whyOthersAreWrong: {
      "802.1":
        "Il gruppo 802.1 si occupa della gestione delle reti, del bridging e di protocolli come lo Spanning Tree.",
      "802.24":
        "Non è lo standard di riferimento per le reti locali wireless.",
      "802.3":
        "802.3 è lo standard Ethernet per le reti locali cablate e utilizza CSMA/CD.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Numerazione degli standard IEEE 802 e relativi ambiti.",
      "802.3 è il cavo, 802.11 è il wireless, 802.1 è la gestione della rete.",
      "Undici come le onde: 802.11 è il Wi-Fi.",
      "Quale metodo di accesso al mezzo adotta lo standard 802.11?",
    ),
  },
  {
    id: "hist-111",
    category: "Internet",
    topic: "Introduzione a Internet",
    difficulty: "facile",
    question:
      "Quale fra i seguenti servizi è sensibile al tempo (esempio ritardo costante)?",
    options: [
      "Posta elettronica",
      "Trasferimento dati",
      "Video conferenza",
      "E-commerce",
    ],
    correctAnswer:
      "Video conferenza",
    explanation:
      "I servizi real-time come la videoconferenza richiedono una consegna dei pacchetti tempestiva e con ritardo costante: un ritardo eccessivo o variabile impedisce la comunicazione interattiva e causa artefatti nel video o interruzioni nell'audio. Per questo utilizzano spesso UDP, evitando i ritardi dovuti alle ritrasmissioni di TCP. Gli altri servizi sono invece elastici e tollerano ritardi anche significativi.",
    whyOthersAreWrong: {
      "Posta elettronica":
        "L'email tollera ritardi di secondi o minuti senza alcun degrado del servizio: conta l'affidabilità, non la tempestività.",
      "Trasferimento dati":
        "Un trasferimento file privilegia l'integrità totale dei dati rispetto alla velocità di consegna istantanea.",
      "E-commerce":
        "Le transazioni web tollerano ritardi variabili e richiedono soprattutto affidabilità e correttezza dei dati.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Distinzione tra applicazioni real-time ed elastiche.",
      "Le applicazioni interattive tollerano perdite ma non ritardi; le elastiche il contrario.",
      "Se il dato scade nel tempo, il servizio è sensibile al ritardo.",
      "Perché le applicazioni di streaming preferiscono UDP a TCP?",
    ),
  },
  {
    id: "hist-112",
    category: "Internet",
    topic: "porte e socket",
    difficulty: "facile",
    question:
      "Quali sono le dimensioni del campo che contiene la porta socket nel segmento TCP?",
    options: [
      "4 bit",
      "8 bit",
      "32 bit",
      "16 bit",
    ],
    correctAnswer:
      "16 bit",
    explanation:
      "L'header TCP dedica i primi 32 bit alle porte: i primi 16 alla porta sorgente e i successivi 16 alla porta destinazione. Con 16 bit a disposizione il protocollo può indirizzare fino a 65536 porte diverse per ogni host, suddivise in well-known ports da 0 a 1023, registered ports da 1024 a 49151 e dynamic ports da 49152 a 65535.",
    whyOthersAreWrong: {
      "4 bit":
        "Quattro bit permetterebbero appena 16 valori distinti, del tutto insufficienti a identificare i servizi di un host.",
      "8 bit":
        "Otto bit darebbero solo 256 porte, molte meno delle sole well-known ports più i servizi registrati.",
      "32 bit":
        "32 bit sono lo spazio complessivo occupato dalle due porte insieme, non da una sola.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Dimensione del campo porta e classificazione degli intervalli.",
      "16 bit per porta, quindi 65536 valori possibili per host.",
      "65536 è 2^16: il numero di porte ti ricorda la dimensione del campo.",
      "Perché il NAT può gestire al più circa 65536 comunicazioni contemporanee per IP pubblico?",
    ),
  },
  {
    id: "hist-114",
    category: "Internet",
    topic: "Ethernet",
    difficulty: "media",
    question:
      "Indicare lo scopo del preambolo aggiunto ai frame IEEE 802.3.",
    options: [
      "Permette agli switch di ritrasmettere le unità dati alla stessa velocità alla quale sono state inviate",
      "Permette di mantenere l'intera rete sincrona",
      "Consente la sincronizzazione del trasmettitore e del ricevitore",
      "Nessuno dei precedenti",
    ],
    correctAnswer:
      "Consente la sincronizzazione del trasmettitore e del ricevitore",
    explanation:
      "Nelle reti Ethernet il ricevitore deve agganciare la frequenza dei bit in arrivo, e il pattern alternato di uno e zero del preambolo fornisce le transizioni necessarie a sincronizzare i clock locali. Dopo i sette byte di preambolo, l'ottavo byte, chiamato SFD, indica che i bit immediatamente successivi appartengono all'indirizzo MAC di destinazione.",
    whyOthersAreWrong: {
      "Permette agli switch di ritrasmettere le unità dati alla stessa velocità alla quale sono state inviate":
        "La velocità di ritrasmissione dipende dalla configurazione della porta, non dal preambolo.",
      "Permette di mantenere l'intera rete sincrona":
        "Ethernet è una rete asincrona: il preambolo serve proprio perché non esiste un clock comune a tutta la rete.",
      "Nessuno dei precedenti":
        "Una delle opzioni descrive correttamente lo scopo del preambolo.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Funzione del preambolo e dello Start Frame Delimiter.",
      "Sette byte alternati per sincronizzare il clock, poi l'SFD che segna l'inizio del frame.",
      "Il preambolo è il conto alla rovescia prima del via: serve a mettersi a tempo.",
      "Da quanti byte è composto il preambolo di un frame Ethernet e con quale pattern?",
    ),
  },
  {
    id: "hist-115",
    category: "Internet",
    topic: "Wi-Fi e reti mobili",
    difficulty: "facile",
    question:
      "Indicare il nome del protocollo di accesso al mezzo usato nella rete Wi-Fi (802.11).",
    options: [
      "CSMA/CA",
      "ALOHA",
      "CSMA/CD",
      "TDMA",
    ],
    correctAnswer:
      "CSMA/CA",
    explanation:
      "Il protocollo CSMA/CA è progettato per i mezzi wireless perché una stazione Wi-Fi non può ascoltare il canale mentre trasmette, a causa della differenza di potenza tra segnale inviato e ricevuto, e quindi non può rilevare le collisioni. Per questo ascolta prima di trasmettere e attende un tempo casuale di backoff se il canale è occupato. Inoltre, a differenza di Ethernet, ogni frame ricevuto correttamente deve essere confermato con un ACK esplicito.",
    whyOthersAreWrong: {
      "ALOHA":
        "ALOHA è un protocollo storico ad accesso casuale puro, privo dell'ascolto preventivo del canale.",
      "CSMA/CD":
        "CSMA/CD è usato nelle reti cablate Ethernet, dove è possibile interrompere la trasmissione appena si rileva una collisione sul cavo.",
      "TDMA":
        "TDMA divide il canale in slot temporali assegnati, un approccio a partizionamento e non a contesa.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Motivazioni del collision avoidance nelle reti radio.",
      "Nel wireless non si rilevano collisioni mentre si trasmette, quindi si cerca di evitarle.",
      "CA come Avoidance: prevenire, perché non puoi accorgerti dello scontro.",
      "Perché in Wi-Fi ogni frame ricevuto correttamente richiede un ACK esplicito?",
    ),
  },
  {
    id: "hist-116",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "media",
    question:
      "Quale delle seguenti affermazioni è scorretta relativamente alla utility traceroute?",
    options: [
      "Usa TTL per determinare i router intermedi",
      "Mostra il cammino del datagramma IP",
      "Verifica la connettività IP fra due host",
      "Usa i segmenti TCP incapsulati in datagrammi IP",
    ],
    correctAnswer:
      "Usa i segmenti TCP incapsulati in datagrammi IP",
    explanation:
      "Per impostazione predefinita traceroute utilizza datagrammi UDP con porte di destinazione molto alte e poco probabili, oppure messaggi ICMP. Esistono versioni specifiche che possono usare TCP, come tcptraceroute, ma non rappresentano il funzionamento standard descritto nei testi di base.",
    whyOthersAreWrong: {
      "Usa TTL per determinare i router intermedi":
        "È vera: traceroute invia pacchetti con TTL crescente da 1 e sfrutta i messaggi ICMP Time Exceeded per identificare ogni router.",
      "Mostra il cammino del datagramma IP":
        "È vera: raccogliendo gli indirizzi dei router che rispondono, l'utility ricostruisce l'intero percorso.",
      "Verifica la connettività IP fra due host":
        "È vera: la raggiungibilità della destinazione viene confermata indirettamente al termine della traccia.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Funzionamento standard di traceroute e protocolli realmente impiegati.",
      "TTL crescente più ICMP Time Exceeded; il trasporto standard è UDP o ICMP.",
      "Traceroute non apre connessioni: gli basta far scadere il TTL.",
      "Quale utility diagnostica sfrutta i messaggi ICMP Echo Request e Echo Reply?",
    ),
  },
  {
    id: "hist-117",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "difficile",
    question:
      "Una tabella di forwarding associa i seguenti intervalli di indirizzi alle interfacce: 11001000 00010111 00010*** ******** verso il link 0; 11001000 00010111 00011000 ******** verso il link 1; 11001000 00010111 00011*** ******** verso il link 2; qualsiasi altro indirizzo verso il link 3. Quale link viene scelto per l'indirizzo 11001000 00010111 00011000 10101010?",
    options: [
      "3",
      "2",
      "0",
      "1",
    ],
    correctAnswer:
      "1",
    explanation:
      "Il router confronta l'indirizzo bit a bit con i prefissi disponibili. I primi tre ottetti dell'indirizzo sono 11001000 00010111 00011000: il prefisso del link 2 corrisponde per 21 bit, mentre quello del link 1 corrisponde per 24 bit. Poiché entrambi corrispondono, il router applica la regola del longest prefix match e sceglie la riga con il prefisso più lungo e specifico, cioè l'interfaccia 1.",
    whyOthersAreWrong: {
      "0":
        "Il prefisso del link 0 richiede 00010 nel terzo ottetto, mentre l'indirizzo presenta 00011: non c'è corrispondenza.",
      "2":
        "Il prefisso del link 2 corrisponde effettivamente, ma solo per 21 bit: viene battuto dal prefisso più lungo del link 1.",
      "3":
        "Il link 3 corrisponde alla voce di default, usata solo quando nessun altro prefisso corrisponde all'indirizzo.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Applicazione del longest prefix match su prefissi binari.",
      "Tra più corrispondenze vince quella che specifica più bit.",
      "Conta i bit fissati: più sono, più la rotta è specifica e prioritaria.",
      "Quale interfaccia sceglie il router se un indirizzo corrisponde solo alla rotta di default?",
    ),
  },
  {
    id: "hist-119",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "facile",
    question:
      "Quale delle seguenti notazioni CIDR per un indirizzo IP è corretta?",
    options: [
      "192.168.1.0/24",
      "192.168.1.0 + 255.255.255.0",
      "192.168.1.0;24",
      "192.168.1.0:4",
    ],
    correctAnswer:
      "192.168.1.0/24",
    explanation:
      "La notazione CIDR è stata introdotta per sostituire il vecchio sistema delle classi e prevede la forma indirizzo seguito da slash e lunghezza del prefisso. Il suffisso /24 indica che i primi 24 bit appartengono alla parte di rete mentre i restanti 8 sono disponibili per gli host, ed equivale esattamente alla maschera decimale puntata 255.255.255.0.",
    whyOthersAreWrong: {
      "192.168.1.0 + 255.255.255.0":
        "Esprime gli stessi parametri ma non usa la notazione compatta standard con lo slash.",
      "192.168.1.0;24":
        "Il punto e virgola non è un separatore previsto dalla sintassi CIDR.",
      "192.168.1.0:4":
        "I due punti si usano per indicare una porta o negli indirizzi IPv6, non per definire una maschera CIDR.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Sintassi corretta della notazione CIDR.",
      "Indirizzo, slash e numero di bit di rete: qualsiasi altro separatore è errato.",
      "Solo lo slash è ammesso: né punto e virgola né due punti.",
      "A quale maschera decimale puntata corrisponde il prefisso /26?",
    ),
  },
  {
    id: "hist-120",
    category: "Internet",
    topic: "ARP",
    difficulty: "media",
    question:
      "Quale componente non è noto nel pacchetto di richiesta ARP?",
    options: [
      "L'indirizzo di scheda del mittente",
      "L'indirizzo IP del destinatario",
      "L'indirizzo IP del mittente",
      "L'indirizzo della scheda del destinatario",
    ],
    correctAnswer:
      "L'indirizzo della scheda del destinatario",
    explanation:
      "Nella ARP request il mittente inserisce il proprio indirizzo IP e il proprio indirizzo MAC, insieme all'indirizzo IP del destinatario che vuole raggiungere. L'indirizzo MAC del destinatario è l'unica informazione mancante ed è proprio l'oggetto della richiesta: per questo il pacchetto viene inviato in broadcast a tutti gli host della rete locale, e solo chi possiede quell'IP risponde fornendo il proprio indirizzo di scheda.",
    whyOthersAreWrong: {
      "L'indirizzo di scheda del mittente":
        "È noto e viene incluso nel pacchetto, così il destinatario può rispondere direttamente in unicast.",
      "L'indirizzo IP del destinatario":
        "È noto ed è il dato di partenza della richiesta: è l'IP di cui si cerca il MAC corrispondente.",
      "L'indirizzo IP del mittente":
        "È noto e viene incluso, permettendo al destinatario di aggiornare la propria cache ARP.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Informazioni note e incognite in una ARP request.",
      "L'unica incognita è il MAC del destinatario: tutto il resto è già noto al mittente.",
      "Si chiede solo ciò che non si sa: l'indirizzo fisico di chi ha quell'IP.",
      "In quale modalità viene inviata una ARP request e in quale una ARP reply?",
    ),
  },
  {
    id: "hist-121",
    category: "Internet",
    topic: "NAT",
    difficulty: "difficile",
    question:
      "Il NAT (Network Address Translation) viola almeno il seguente principio:",
    options: [
      "Indipendenza tra i livelli (Trasparenza)",
      "Obbligo di crittografia end-to-end",
      "Possibilità di usare indirizzi privati su reti pubbliche",
      "Frammentazione obbligatoria dei datagrammi",
    ],
    correctAnswer:
      "Indipendenza tra i livelli (Trasparenza)",
    explanation:
      "Un router dovrebbe operare solo al livello di rete, ma il NAT deve modificare anche i numeri di porta, che appartengono al livello di trasporto, per distinguere le connessioni: questo rompe la separazione netta tra i livelli. Inoltre impedisce che due host comunichino direttamente senza intermediari che alterino il pacchetto, rendendo problematici i protocolli che includono l'indirizzo IP dentro il payload.",
    whyOthersAreWrong: {
      "Obbligo di crittografia end-to-end":
        "Non esiste alcun obbligo generale di cifratura end-to-end tra i principi architetturali di Internet.",
      "Possibilità di usare indirizzi privati su reti pubbliche":
        "Non è un principio violato ma lo scopo stesso per cui il NAT è stato creato, cioè far fronte alla scarsità di indirizzi IPv4.",
      "Frammentazione obbligatoria dei datagrammi":
        "La frammentazione non è un principio obbligatorio e non viene violata dal funzionamento del NAT.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Violazione della stratificazione e del principio end-to-end da parte del NAT.",
      "Il NAT è di livello 3 ma tocca le porte di livello 4: rompe l'indipendenza tra i livelli.",
      "Se un dispositivo di livello 3 guarda le porte, sta sconfinando di livello.",
      "Quante comunicazioni contemporanee può gestire al massimo un NAT su un singolo IP pubblico?",
    ),
  },
  {
    id: "hist-122",
    category: "Internet",
    topic: "DNS",
    difficulty: "facile",
    question:
      "Qual è il protocollo di trasporto usato dal DNS (Domain Name System)?",
    options: [
      "IP",
      "TCP",
      "UDP",
      "ICMP",
    ],
    correctAnswer:
      "UDP",
    explanation:
      "UDP è connectionless e permette di ottenere risposte rapide alle query DNS senza il sovraccarico dell'apertura e chiusura di una sessione TCP con handshake a tre vie. Il DNS opera sulla porta 53. Il ricorso a TCP avviene solo quando l'affidabilità è critica o i dati sono troppo voluminosi per un singolo datagramma UDP, come nei trasferimenti di zona.",
    whyOthersAreWrong: {
      "IP":
        "IP è un protocollo di livello 3, cioè di rete, non un protocollo di trasporto.",
      "TCP":
        "TCP viene usato dal DNS solo in casi particolari, non nella normale fase di risoluzione.",
      "ICMP":
        "ICMP è un protocollo di servizio per messaggi di controllo ed errore e non trasporta dati applicativi.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Protocollo di trasporto del DNS e relative eccezioni.",
      "DNS su UDP porta 53; TCP solo per zone transfer o risposte oltre i 512 byte.",
      "Una domanda e una risposta non giustificano il costo di aprire una connessione.",
      "In quali casi il DNS ricorre a TCP invece che a UDP?",
    ),
  },
  {
    id: "hist-123",
    category: "Internet",
    topic: "TCP e UDP",
    difficulty: "media",
    question:
      "Quale dei seguenti elementi dello stack protocollare TCP/IP rientra nella categoria end-to-end?",
    options: [
      "ARP",
      "TCP e UDP",
      "Tutti quelli indicati",
      "IP",
    ],
    correctAnswer:
      "TCP e UDP",
    explanation:
      "TCP e UDP gestiscono la comunicazione tra i processi applicativi sugli host terminali: il router non legge né modifica i numeri di sequenza o le porte, e il controllo degli errori e del flusso avviene solo alle estremità del cammino. IP è invece considerato hop-by-hop perché viene elaborato da ogni nodo lungo il percorso per decidere il prossimo salto.",
    whyOthersAreWrong: {
      "ARP":
        "ARP opera solo all'interno di una singola rete locale per mappare indirizzi IP su MAC, quindi non ha portata end-to-end.",
      "Tutti quelli indicati":
        "IP e ARP non sono end-to-end: il primo è hop-by-hop, il secondo puramente locale.",
      "IP":
        "Il protocollo IP viene elaborato da ogni router intermedio, quindi è per definizione hop-by-hop.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Distinzione tra protocolli end-to-end e hop-by-hop.",
      "Il livello di trasporto vive solo agli estremi; IP viene toccato a ogni salto.",
      "Se un router lo elabora non è end-to-end.",
      "Quali livelli dello stack deve implementare un router?",
    ),
  },
  {
    id: "hist-124",
    category: "Internet",
    topic: "livello collegamento",
    difficulty: "difficile",
    question:
      "Considerando il protocollo slotted ALOHA, qual è la massima efficienza possibile (approssimata)?",
    options: [
      "0,52",
      "0,1",
      "0,37",
      "0,80",
    ],
    correctAnswer:
      "0,37",
    explanation:
      "Nello slotted ALOHA il tempo è diviso in slot discreti e un invio ha successo se esattamente un nodo trasmette in uno slot. Se p è la probabilità di trasmissione, l'efficienza è N per p per (1 − p) elevato a N−1. Per un numero elevato di nodi il valore massimo di questa funzione tende a 1 diviso e, cioè circa 0,368. Lo slotted ALOHA raddoppia l'efficienza rispetto ad ALOHA puro, che si ferma attorno al 18 per cento.",
    whyOthersAreWrong: {
      "0,52":
        "Nessuna delle due varianti di ALOHA raggiunge un'efficienza superiore al 37 per cento circa.",
      "0,1":
        "È un valore troppo basso: sottostima anche l'efficienza dell'ALOHA puro.",
      "0,80":
        "Efficienze così elevate si ottengono con protocolli a partizionamento o a turni, non con l'accesso casuale puro.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Efficienza teorica dei protocolli ad accesso casuale.",
      "Slotted ALOHA circa 0,37, cioè 1/e; ALOHA puro circa la metà.",
      "Il valore magico è 1 diviso e: circa 37 per cento.",
      "Perché lo slotted ALOHA è più efficiente dell'ALOHA puro?",
    ),
  },
  {
    id: "hist-125",
    category: "Internet",
    topic: "SMTP, POP3, IMAP",
    difficulty: "facile",
    question:
      "Quale dei seguenti elementi NON è un componente dei sistemi di posta elettronica?",
    options: [
      "Spool file",
      "User Agent",
      "Multimedia Viewer",
      "Message Transfer Agent",
    ],
    correctAnswer:
      "Multimedia Viewer",
    explanation:
      "I componenti reali del sistema di posta sono lo User Agent, cioè l'interfaccia con cui l'utente compone e legge le email; il Message Transfer Agent, cioè il server che invia e riceve i messaggi tramite SMTP; e lo spool file o mailbox, lo spazio sul server dove i messaggi sono accodati o depositati. Un visualizzatore multimediale può servire ad aprire un allegato, ma non partecipa in alcun modo all'invio, all'instradamento o alla ricezione del messaggio.",
    whyOthersAreWrong: {
      "Spool file":
        "È un componente reale: la coda o casella dove i messaggi restano in attesa di essere inviati o scaricati.",
      "User Agent":
        "È un componente reale: il client di posta con cui l'utente interagisce.",
      "Message Transfer Agent":
        "È un componente reale: il server che si occupa del trasferimento dei messaggi tra i nodi.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Architettura di un sistema di posta elettronica.",
      "User Agent, Message Transfer Agent e spool file sono i tre componenti del sistema.",
      "Chiediti se serve a spedire, instradare o conservare: se no, non è del sistema di posta.",
      "Quale protocollo usano i Message Transfer Agent per scambiarsi i messaggi?",
    ),
  },
  {
    id: "hist-126",
    category: "Internet",
    topic: "porte e socket",
    difficulty: "facile",
    question:
      "Il livello di trasporto introduce il concetto di porta. Qual è la dimensione di questo campo?",
    options: [
      "4 bit",
      "8 bit",
      "32 bit",
      "16 bit",
    ],
    correctAnswer:
      "16 bit",
    explanation:
      "Con 16 bit il sistema può gestire porte da 0 a 65535. Le porte permettono al livello di trasporto di distinguere tra le diverse applicazioni che girano contemporaneamente sullo stesso host con un unico indirizzo IP, realizzando il multiplexing. La IANA suddivide l'intervallo in well-known ports da 0 a 1023, registered ports da 1024 a 49151 e dynamic ports da 49152 a 65535.",
    whyOthersAreWrong: {
      "4 bit":
        "Sedici valori possibili non basterebbero nemmeno per i servizi di sistema più comuni.",
      "8 bit":
        "256 porte sarebbero insufficienti a coprire anche solo le well-known ports più i servizi registrati.",
      "32 bit":
        "32 bit corrispondono allo spazio occupato dalle due porte insieme nell'header, non da una singola porta.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Dimensione del campo porta e suddivisione IANA degli intervalli.",
      "16 bit per porta, da 0 a 65535, divise in well-known, registered e dynamic.",
      "Le porte arrivano a 65535 perché 2^16 − 1: la dimensione è nel numero stesso.",
      "Quale intervallo di porte viene assegnato dinamicamente ai client?",
    ),
  },
  {
    id: "hist-128",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "media",
    question:
      "Indicare a cosa serve la tecnica detta \"Poisoned reverse\" nell'algoritmo distance vector.",
    options: [
      "Impedisce che si possano formare cicli",
      "Riparare degli errori",
      "La tecnica non si applica a questo algoritmo ma ad uno di tipo link state",
      "Garantire che tutte le destinazioni siano presenti",
    ],
    correctAnswer:
      "Impedisce che si possano formare cicli",
    explanation:
      "Se il nodo A instrada i pacchetti verso la destinazione Z passando per il nodo B, allora A annuncia a B che la propria distanza verso Z è infinita. Questa bugia a fin di bene assicura che B non provi mai a instradare traffico verso Z passando per A, eliminando alla radice la possibilità che si crei un ciclo tra i due nodi in caso di guasto di un collegamento e mitigando il problema del conteggio all'infinito.",
    whyOthersAreWrong: {
      "Riparare degli errori":
        "Il poisoned reverse è una tecnica di prevenzione dei loop di instradamento, non un meccanismo di correzione di errori sui dati.",
      "La tecnica non si applica a questo algoritmo ma ad uno di tipo link state":
        "È specifica proprio dei protocolli distance vector: i link state non ne hanno bisogno perché ogni router possiede la mappa completa.",
      "Garantire che tutte le destinazioni siano presenti":
        "La completezza delle destinazioni deriva dallo scambio delle tabelle, non da questa tecnica.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Prevenzione dei loop e conteggio all'infinito nel distance vector.",
      "Dichiaro distanza infinita verso chi mi fa da tramite, così non mi rimanda il traffico.",
      "Avveleno la rotta all'indietro per non farmela restituire.",
      "In cosa consiste il problema del count-to-infinity negli algoritmi distance vector?",
    ),
  },
  {
    id: "hist-129",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "media",
    question:
      "Quale delle seguenti funzioni NON è fornita da TCP?",
    options: [
      "Indirizzamento dei nodi",
      "Ritrasmissione dei pacchetti",
      "Congestion control",
      "Flow control",
    ],
    correctAnswer:
      "Indirizzamento dei nodi",
    explanation:
      "La responsabilità di identificare univocamente un nodo nella rete spetta agli indirizzi IP, quindi al livello di rete: TCP utilizza questi indirizzi ma non li assegna né li gestisce. Sono invece funzioni proprie di TCP la ritrasmissione dei segmenti persi o corrotti, il controllo di flusso per non saturare il ricevitore e il controllo di congestione per non saturare la rete.",
    whyOthersAreWrong: {
      "Ritrasmissione dei pacchetti":
        "È una funzione di TCP: se un segmento va perso o arriva corrotto, il mittente lo ritrasmette.",
      "Congestion control":
        "È una funzione di TCP, gestita tramite la finestra di congestione per evitare il collasso dei router intermedi.",
      "Flow control":
        "È una funzione di TCP, realizzata tramite la finestra di ricezione annunciata dal destinatario.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Ripartizione delle responsabilità tra livello di rete e di trasporto.",
      "TCP gestisce affidabilità, flusso e congestione; l'indirizzamento dei nodi è di IP.",
      "TCP parla ai processi, IP parla ai nodi.",
      "Quale proprietà fondamentale è garantita dal protocollo TCP?",
    ),
  },
  {
    id: "hist-130",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "facile",
    question:
      "Quale fra i seguenti NON è un algoritmo/protocollo di routing?",
    options: [
      "OSPF",
      "Hop Selector",
      "Link State",
      "Distance vector",
    ],
    correctAnswer:
      "Hop Selector",
    explanation:
      "Non esiste alcun protocollo o tecnica di routing chiamato Hop Selector: è un termine costruito a partire dal concetto di hop count, che è una metrica di routing ma non un algoritmo a sé stante. Link State e Distance Vector sono invece le due grandi famiglie di algoritmi di routing, e OSPF è il protocollo link state più diffuso.",
    whyOthersAreWrong: {
      "OSPF":
        "È un protocollo di routing reale ed è l'implementazione link state più diffusa all'interno dei sistemi autonomi.",
      "Link State":
        "È una delle due famiglie fondamentali di algoritmi di routing, in cui ogni router costruisce la mappa completa della rete.",
      "Distance vector":
        "È l'altra famiglia fondamentale, in cui i router scambiano informazioni di distanza solo con i vicini diretti.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Nomi reali degli algoritmi e dei protocolli di routing.",
      "Le famiglie sono link state e distance vector; hop count è una metrica, non un algoritmo.",
      "Se il nome suona plausibile ma non l'hai mai visto sul libro, probabilmente è inventato.",
      "Quale attributo non è previsto nel protocollo BGP?",
    ),
  },
  {
    id: "hist-131",
    category: "Internet",
    topic: "Wi-Fi e reti mobili",
    difficulty: "media",
    question:
      "Qual è il nome del meccanismo utilizzato nel protocollo 802.11 per la gestione dei terminali nascosti durante la comunicazione wireless?",
    options: [
      "NAV (Network Allocation Vector)",
      "DIFS (Distributed Interframe Space)",
      "ACK (Acknowledgement)",
      "RTS/CTS (Request To Send/Clear To Send)",
    ],
    correctAnswer:
      "RTS/CTS (Request To Send/Clear To Send)",
    explanation:
      "Il mittente invia un pacchetto Request To Send e, se il ricevente è libero, risponde con un Clear To Send. Il CTS viene ricevuto da tutti i nodi nel raggio del destinatario, compresi quelli nascosti al mittente, avvisandoli di non trasmettere per la durata specificata. È proprio questo che risolve il problema del terminale nascosto.",
    whyOthersAreWrong: {
      "NAV (Network Allocation Vector)":
        "Il NAV è il timer mantenuto dai nodi che sentono RTS o CTS, cioè il valore contenuto nei pacchetti, non il meccanismo di risoluzione in sé.",
      "DIFS (Distributed Interframe Space)":
        "Il DIFS è il tempo di attesa minimo prima che una stazione possa tentare di trasmettere, parte del normale CSMA/CA.",
      "ACK (Acknowledgement)":
        "L'ACK conferma la ricezione corretta di un frame, ma non previene la collisione tra terminali che non si sentono.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Problema del terminale nascosto e prenotazione del canale.",
      "RTS e CTS prenotano il canale e silenziano i vicini del destinatario.",
      "Il CTS è la voce che sentono anche quelli che non sentono il mittente.",
      "Qual è la sequenza corretta di eventi nel protocollo 802.11 con RTS/CTS?",
    ),
  },
  {
    id: "hist-132",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "facile",
    question:
      "Qual è la dimensione corretta di un indirizzo IPv6?",
    options: [
      "32 bit",
      "128 bit",
      "64 bit",
      "16 bit",
    ],
    correctAnswer:
      "128 bit",
    explanation:
      "128 bit corrispondono a 2 elevato a 128 indirizzi possibili, circa 3,4 per 10 alla 38. A differenza degli indirizzi IPv4 in decimale puntato, gli indirizzi IPv6 sono scritti in notazione esadecimale, divisi in otto gruppi di quattro cifre separati da due punti. La dimensione maggiore permette anche una gerarchia di indirizzamento più strutturata, migliorando l'efficienza del routing globale.",
    whyOthersAreWrong: {
      "32 bit":
        "32 bit è la dimensione degli indirizzi IPv4, ormai insufficiente per il numero di dispositivi connessi.",
      "64 bit":
        "64 bit corrispondono alla metà di un indirizzo IPv6, spesso usata come parte di rete, ma non all'indirizzo completo.",
      "16 bit":
        "16 bit è la dimensione di un singolo gruppo esadecimale di IPv6, non dell'intero indirizzo.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Spazio di indirizzamento e rappresentazione di IPv6.",
      "128 bit in otto gruppi esadecimali separati da due punti.",
      "Otto gruppi da quattro cifre esadecimali: 8 per 16 bit fa 128.",
      "Quale protocollo prevede uno schema di indirizzamento di 128 bit?",
    ),
  },
  {
    id: "hist-133",
    category: "Internet",
    topic: "sliding window",
    difficulty: "media",
    question:
      "I protocolli a finestre sono anche chiamati ARQ, perché?",
    options: [
      "Non esiste una tecnica ARQ",
      "Nel caso di arrivo di un pacchetto errato il ricevitore richiede la ritrasmissione",
      "Nel caso di un mancato ritorno di un ACK il ricevitore chiede la ritrasmissione",
      "Lo scadere del timeout del trasmettitore corrisponde ad una richiesta automatica di ritrasmissione",
    ],
    correctAnswer:
      "Lo scadere del timeout del trasmettitore corrisponde ad una richiesta automatica di ritrasmissione",
    explanation:
      "Il cuore dei protocolli ARQ, cioè Automatic Repeat reQuest, risiede nell'automatismo: il trasmettitore fa partire un timer ogni volta che invia un pacchetto e, se il timer scade prima della ricezione dell'ACK, interpreta questo silenzio come una richiesta implicita di rinvio. I protocolli a finestra migliorano l'ARQ di base permettendo di avere più pacchetti in volo contemporaneamente.",
    whyOthersAreWrong: {
      "Non esiste una tecnica ARQ":
        "ARQ esiste ed è la famiglia che comprende Stop-and-Wait, Go-Back-N e Selective Repeat.",
      "Nel caso di arrivo di un pacchetto errato il ricevitore richiede la ritrasmissione":
        "Esistono i riscontri negativi, ma molti protocolli moderni si affidano ai timeout o agli ACK duplicati: la richiesta è automatica lato mittente.",
      "Nel caso di un mancato ritorno di un ACK il ricevitore chiede la ritrasmissione":
        "Il ricevitore non può accorgersi di un ACK mancante, perché è lui stesso a doverlo inviare: è il mittente a rilevare l'assenza.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Significato dell'automatismo nei protocolli ARQ.",
      "Il timeout del mittente equivale a una richiesta automatica di ritrasmissione.",
      "Automatic Repeat reQuest: la richiesta non arriva da nessuno, scatta da sola.",
      "Perché nei protocolli rdt viene introdotto il timer?",
    ),
  },
  {
    id: "hist-134",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "facile",
    question:
      "Quale dei seguenti formati denota correttamente un indirizzo IP con il formato CIDR (Classless Inter-Domain Routing)?",
    options: [
      "128.119.40.0/25",
      "Ip = 128.119.40.0, netmask = 255.255.255.255",
      "128.119.40.0",
      "Nessuno dei precedenti",
    ],
    correctAnswer:
      "128.119.40.0/25",
    explanation:
      "Il formato CIDR è standardizzato come indirizzo IP seguito da slash e lunghezza del prefisso. Il suffisso /25 indica esplicitamente che i primi 25 bit dell'indirizzo identificano la rete, mentre i restanti 7 bit sono disponibili per gli host.",
    whyOthersAreWrong: {
      "Ip = 128.119.40.0, netmask = 255.255.255.255":
        "Descrive i parametri in forma estesa senza usare la notazione compatta standard, e la maschera indicata identificherebbe peraltro un singolo host.",
      "128.119.40.0":
        "Il solo indirizzo non è in formato CIDR: senza la maschera esplicita non si può determinare l'estensione della sottorete.",
      "Nessuno dei precedenti":
        "Una delle opzioni rispetta esattamente la sintassi CIDR, quindi l'alternativa non è valida.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Notazione CIDR e significato del suffisso.",
      "Indirizzo più slash più numero di bit di rete: è l'unica forma corretta.",
      "Senza lo slash non stai definendo una rete ma un singolo indirizzo.",
      "Quale notazione CIDR corrisponde a una rete con 1024 indirizzi?",
    ),
  },
  {
    id: "hist-135",
    category: "Internet",
    topic: "Ethernet",
    difficulty: "facile",
    question:
      "Quale categoria fra le seguenti descrive meglio CSMA/CD?",
    options: [
      "Metodo di accesso",
      "Tecnica di encapsulating dei messaggi",
      "Controlli di flusso",
      "Codifica dei messaggi",
    ],
    correctAnswer:
      "Metodo di accesso",
    explanation:
      "CSMA/CD definisce le regole con cui più dispositivi che condividono lo stesso mezzo decidono chi può trasmettere e quando. Carrier Sense indica l'ascolto preventivo del canale, Multiple Access il fatto che più dispositivi condividono il cavo, e Collision Detection il rilevamento delle collisioni con successivo backoff casuale.",
    whyOthersAreWrong: {
      "Tecnica di encapsulating dei messaggi":
        "L'incapsulamento riguarda la costruzione del frame con header e trailer, non la contesa per il mezzo.",
      "Controlli di flusso":
        "Il controllo di flusso regola la velocità tra mittente e destinatario, come fa la finestra TCP, non l'accesso al canale condiviso.",
      "Codifica dei messaggi":
        "La codifica riguarda la rappresentazione fisica dei bit sul mezzo, ad esempio la codifica Manchester.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Classificazione di CSMA/CD tra le funzioni del livello data link.",
      "CSMA/CD stabilisce chi parla e quando su un mezzo condiviso.",
      "Multiple Access nel nome: è una regola di accesso al mezzo.",
      "Qual è la funzione fondamentale del sottolivello MAC?",
    ),
  },
  {
    id: "hist-136",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "facile",
    question:
      "Quale dei seguenti Flag dell'intestazione TCP causa la chiusura immediata della connessione?",
    options: [
      "PSH",
      "FIN",
      "URG",
      "RST",
    ],
    correctAnswer:
      "RST",
    explanation:
      "Il flag RST forza l'interruzione immediata della connessione e viene inviato quando si verifica un errore irrecuperabile, quando arriva un pacchetto per una porta chiusa, oppure quando un host vuole terminare bruscamente la comunicazione senza ripulire i buffer. Non richiede alcun ACK di conferma: la connessione cessa di esistere all'istante.",
    whyOthersAreWrong: {
      "PSH":
        "Il flag PSH forza la consegna immediata dei dati bufferizzati all'applicazione e non chiude nulla.",
      "FIN":
        "FIN avvia la procedura di chiusura ordinata a quattro vie: il mittente non ha più dati da inviare ma resta in ascolto, quindi la chiusura non è immediata.",
      "URG":
        "URG segnala la presenza di dati prioritari nel segmento e non riguarda la terminazione della connessione.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Differenza tra chiusura ordinata con FIN e chiusura brusca con RST.",
      "RST abbatte subito la connessione; FIN la chiude con una procedura concordata.",
      "Reset significa strappo immediato, senza saluti né conferme.",
      "Quale flag TCP è richiesto in condizioni normali per chiudere una connessione?",
    ),
  },
  {
    id: "hist-137",
    category: "Internet",
    topic: "DNS",
    difficulty: "media",
    question:
      "Quale dei seguenti protocolli prevede una modalità iterativa?",
    options: [
      "HTTP",
      "UDP",
      "TCP",
      "DNS",
    ],
    correctAnswer:
      "DNS",
    explanation:
      "Quando un server DNS riceve una query iterativa, se non possiede la risposta non interroga altri server per conto del client, ma restituisce un riferimento al server DNS successivo nella gerarchia, ad esempio l'indirizzo del server che gestisce i domini .it. Il client deve quindi iterare il processo contattando il nuovo server. La modalità alternativa è quella ricorsiva, in cui il server si fa carico dell'intera ricerca.",
    whyOthersAreWrong: {
      "HTTP":
        "HTTP non possiede una logica di navigazione gerarchica con rimandi progressivi tra server di livelli diversi.",
      "UDP":
        "UDP è un protocollo di trasporto e non prevede alcuna modalità di risoluzione iterativa.",
      "TCP":
        "Anche TCP è un protocollo di trasporto: gestisce connessioni e affidabilità, non interrogazioni gerarchiche.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Modalità iterativa e ricorsiva nella risoluzione dei nomi.",
      "Iterativa significa ricevere un rimando; ricorsiva significa ricevere la risposta finale.",
      "Iterare vuol dire ripetere: il client rifà la domanda a un altro server.",
      "Quale tipo di risoluzione applica il Local DNS Server verso la gerarchia?",
    ),
  },
  {
    id: "hist-138",
    category: "Internet",
    topic: "DHCP",
    difficulty: "facile",
    question:
      "Quale dei seguenti NON è una delle fasi del protocollo DHCP?",
    options: [
      "DHCP Request",
      "DHCP Terminate",
      "DHCP Discover",
      "DHCP Offer",
    ],
    correctAnswer:
      "DHCP Terminate",
    explanation:
      "Le fasi standard del protocollo DHCP sono quattro e seguono l'acronimo DORA: Discover, con cui il client cerca un server in broadcast; Offer, con cui il server propone un indirizzo; Request, con cui il client richiede formalmente quell'indirizzo; e Acknowledge, con cui il server conferma l'assegnazione. Il messaggio Terminate non esiste: per chiudere e liberare l'indirizzo si usa DHCPRELEASE.",
    whyOthersAreWrong: {
      "DHCP Request":
        "È la terza fase del ciclo DORA, con cui il client accetta formalmente l'offerta ricevuta.",
      "DHCP Discover":
        "È la prima fase, con cui il client cerca in broadcast i server DHCP disponibili.",
      "DHCP Offer":
        "È la seconda fase, con cui il server propone un indirizzo IP disponibile dal proprio pool.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Messaggi previsti dal protocollo DHCP.",
      "Le fasi sono Discover, Offer, Request e Acknowledge; per rilasciare si usa Release.",
      "Se il nome non rientra in DORA o in Release, non esiste.",
      "Quale dei seguenti non è un messaggio del protocollo DHCP?",
    ),
  },
  {
    id: "hist-139",
    category: "Internet",
    topic: "Ethernet",
    difficulty: "media",
    question:
      "Indicare l'affermazione corretta per il campo preambolo del frame ethernet.",
    options: [
      "È composto da 7 byte 10101010 e un byte 10101011",
      "È composto da 6 byte 10101010",
      "È composto da 6 byte 10101010 e un byte 10101011",
      "È composto da 8 byte 10101010",
    ],
    correctAnswer:
      "È composto da 7 byte 10101010 e un byte 10101011",
    explanation:
      "Il preambolo è formato da sette byte identici con pattern 10101010, che servono a svegliare il ricevitore e a sincronizzare il clock. L'ottavo byte è lo Start Frame Delimiter e ha pattern 10101011: i primi sei bit continuano la sincronizzazione, mentre gli ultimi due bit a 11 interrompono il pattern alternato segnalando che il bit successivo è l'inizio dell'indirizzo MAC di destinazione.",
    whyOthersAreWrong: {
      "È composto da 6 byte 10101010":
        "Il conteggio è errato e manca completamente lo Start Frame Delimiter che chiude il preambolo.",
      "È composto da 6 byte 10101010 e un byte 10101011":
        "La struttura è corretta ma il numero di byte di preambolo è sette, non sei.",
      "È composto da 8 byte 10101010":
        "Gli otto byte totali sono corretti, ma l'ultimo non ripete il pattern alternato: è l'SFD con terminazione 11.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Composizione del preambolo e ruolo dello Start Frame Delimiter.",
      "Sette byte 10101010 più un byte 10101011 che segnala l'inizio del frame vero.",
      "Il doppio 1 finale rompe l'alternanza: è il segnale di via.",
      "Qual è lo scopo del preambolo aggiunto ai frame IEEE 802.3?",
    ),
  },
  {
    id: "hist-140",
    category: "Internet",
    topic: "DHCP",
    difficulty: "facile",
    question:
      "Indicare la sequenza di eventi corretta usata da DHCP per ottenere un indirizzo IP la prima volta.",
    options: [
      "DHCP request > DHCP discover > DHCP offer > DHCP ack",
      "DHCP offer > DHCP discover > DHCP request > DHCP ack",
      "DHCP discover > DHCP request > DHCP offer > DHCP ack",
      "DHCP discover > DHCP offer > DHCP request > DHCP ack",
    ],
    correctAnswer:
      "DHCP discover > DHCP offer > DHCP request > DHCP ack",
    explanation:
      "Il processo di assegnazione avviene in quattro passi noti come DORA. Il client appena connesso invia un Discover in broadcast cercando un server; uno o più server rispondono con un Offer proponendo un indirizzo disponibile; il client sceglie un'offerta e invia una Request per chiedere formalmente quell'indirizzo; infine il server conferma con un Ack inviando anche i parametri di configurazione come DNS e gateway.",
    whyOthersAreWrong: {
      "DHCP request > DHCP discover > DHCP offer > DHCP ack":
        "Il client non può richiedere un indirizzo prima di aver scoperto quali server esistono e cosa offrono.",
      "DHCP offer > DHCP discover > DHCP request > DHCP ack":
        "Il server non può offrire un indirizzo prima di aver ricevuto una richiesta di scoperta dal client.",
      "DHCP discover > DHCP request > DHCP offer > DHCP ack":
        "Inverte Offer e Request: il client deve prima ricevere una proposta e solo dopo può accettarla.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Sequenza DORA nell'assegnazione di un indirizzo IP.",
      "Discover, Offer, Request, Ack: scoprire, proporre, richiedere, confermare.",
      "L'acronimo DORA ti dà già l'ordine esatto.",
      "Qual è la risposta attesa al messaggio DHCP Discover?",
    ),
  },
  {
    id: "hist-141",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "facile",
    question:
      "Indicare quale delle seguenti proprietà è garantita dal protocollo TCP.",
    options: [
      "Affidabilità",
      "Nessun controllo di flusso",
      "Connectionless",
      "Reinvio di qualsiasi pacchetto non ricevuto",
    ],
    correctAnswer:
      "Affidabilità",
    explanation:
      "L'affidabilità è la proprietà fondamentale di TCP: offre un servizio di trasferimento dati affidabile a flusso di byte sopra un livello di rete inaffidabile come IP. Questa proprietà generale comprende non solo la ritrasmissione dei dati persi, ma anche l'ordinamento dei segmenti e il controllo degli errori tramite checksum.",
    whyOthersAreWrong: {
      "Nessun controllo di flusso":
        "È falsa: TCP implementa il controllo di flusso tramite la finestra di ricezione annunciata dal destinatario.",
      "Connectionless":
        "È falsa: TCP è connection-oriented e richiede il three-way handshake prima di scambiare dati.",
      "Reinvio di qualsiasi pacchetto non ricevuto":
        "Il reinvio è il meccanismo concreto, ma l'affidabilità è la proprietà complessiva che include anche ordinamento e controllo degli errori.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Proprietà garantite dal protocollo TCP.",
      "TCP è affidabile e orientato alla connessione, con flusso e congestione controllati.",
      "Affidabilità è l'ombrello: ritrasmissione, ordine e integrità stanno tutti sotto.",
      "Quale tipo di servizio offre il protocollo TCP?",
    ),
  },
  {
    id: "hist-142",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "facile",
    question:
      "Qual è la dimensione dei campi Internet Checksum dei protocolli di trasporto?",
    options: [
      "8 bit",
      "32 bit",
      "16 bit",
      "Non è presente il campo checksum",
    ],
    correctAnswer:
      "16 bit",
    explanation:
      "Sia l'intestazione TCP sia quella UDP contengono un campo Checksum di 16 bit. Il valore si ottiene effettuando la somma in complemento a uno di tutte le parole da 16 bit che compongono il segmento, inclusi uno pseudo-header IP, l'intestazione e i dati. A differenza del CRC a 32 bit di Ethernet, questo checksum è computazionalmente più leggero da verificare via software.",
    whyOthersAreWrong: {
      "8 bit":
        "Otto bit offrirebbero una capacità di rilevamento degli errori troppo bassa per un segmento di dati.",
      "32 bit":
        "32 bit è la dimensione del CRC usato a livello data link in Ethernet, non del checksum di trasporto.",
      "Non è presente il campo checksum":
        "Il campo è presente in entrambi i protocolli di trasporto, obbligatorio in TCP e opzionale in UDP.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Dimensione e calcolo del checksum nei protocolli di trasporto.",
      "16 bit sia in TCP sia in UDP, calcolati in complemento a uno su pseudo-header, header e dati.",
      "Il livello 2 usa 32 bit di CRC, il livello 4 si accontenta di 16 bit di checksum.",
      "Su quale porzione del segmento viene calcolato il checksum TCP?",
    ),
  },
  {
    id: "hist-143",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "media",
    question:
      "La frammentazione di un datagramma IP può avvenire:",
    options: [
      "Non avviene più",
      "In un host di intermezzo mentre il datagramma viaggia",
      "Nell'host destinatario",
      "Nell'host di origine",
    ],
    correctAnswer:
      "In un host di intermezzo mentre il datagramma viaggia",
    explanation:
      "In IPv4, se un router riceve un datagramma più grande della MTU del collegamento successivo, lo divide in frammenti più piccoli: questo può accadere sia alla sorgente sia in qualsiasi nodo intermedio lungo il percorso. Il riassemblaggio invece avviene solo nell'host di destinazione, per non sovraccaricare i router con buffer e calcoli. In IPv6 i router non frammentano più: scartano il pacchetto e avvisano la sorgente.",
    whyOthersAreWrong: {
      "Non avviene più":
        "In IPv4 la frammentazione avviene ancora regolarmente; è in IPv6 che i router non frammentano più.",
      "Nell'host destinatario":
        "Nell'host di destinazione avviene il riassemblaggio, cioè l'operazione inversa della frammentazione.",
      "Nell'host di origine":
        "L'origine può frammentare, ma l'affermazione è incompleta perché esclude i nodi intermedi, dove il fenomeno si verifica tipicamente.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Dove avvengono frammentazione e riassemblaggio in IPv4.",
      "Frammenta chi incontra una MTU più piccola; riassembla solo la destinazione.",
      "Tagliare si può lungo la strada, ricomporre solo all'arrivo.",
      "In IPv4, dove vengono riassemblati i pacchetti frammentati?",
    ),
  },
  {
    id: "hist-144",
    category: "Internet",
    topic: "DHCP",
    difficulty: "facile",
    question:
      "Qual è la risposta attesa al messaggio DHCP DISCOVER?",
    options: [
      "DHCP release",
      "DHCP request",
      "DHCP ACK",
      "DHCP OFFER",
    ],
    correctAnswer:
      "DHCP OFFER",
    explanation:
      "Il DHCP Discover è inviato in broadcast dal client per trovare un server disponibile. Il server riceve la richiesta e risponde con un Offer, proponendo un indirizzo IP disponibile dal proprio pool insieme ad altri parametri preliminari. Solo successivamente il client invierà una Request e il server confermerà con un ACK.",
    whyOthersAreWrong: {
      "DHCP release":
        "Il Release è inviato dal client per liberare volontariamente un indirizzo già assegnato, non è una risposta al Discover.",
      "DHCP request":
        "La Request è inviata dal client dopo aver ricevuto l'offerta, quindi viene dopo, non è la risposta al Discover.",
      "DHCP ACK":
        "L'ACK è la conferma finale del server, successiva alla Request del client.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Ordine dei messaggi nella sequenza DORA.",
      "Al Discover risponde sempre un Offer: è il secondo passo del ciclo.",
      "D poi O: la lettera successiva dell'acronimo ti dà la risposta.",
      "Qual è la sequenza corretta dei messaggi DHCP per ottenere un indirizzo la prima volta?",
    ),
  },
  {
    id: "hist-145",
    category: "Internet",
    topic: "congestion control",
    difficulty: "difficile",
    question:
      "Indicare quale affermazione è vera per TCP Tahoe e non per TCP Reno.",
    options: [
      "Sono tutte vere per entrambi",
      "Dopo la ricezione di tre ack duplicati riparte dal valore di ssthresh",
      "Gestisce la ricezione di tre ack duplicati nello stesso modo del Timeout",
      "Alla ricezione di ack duplicati successivi al terzo incrementa di 1 la cwnd",
    ],
    correctAnswer:
      "Gestisce la ricezione di tre ack duplicati nello stesso modo del Timeout",
    explanation:
      "TCP Tahoe non implementa il Fast Recovery, quindi tratta i tre ACK duplicati esattamente come un timeout: imposta ssthresh a metà della finestra corrente, riporta cwnd a 1 e riparte in Slow Start. TCP Reno invece reagisce ai tre ACK duplicati in modo più ottimizzato, eseguendo il Fast Retransmit, portando cwnd a ssthresh più 3 ed entrando in Fast Recovery senza tornare a 1.",
    whyOthersAreWrong: {
      "Sono tutte vere per entrambi":
        "Le versioni si distinguono proprio per la diversa reazione ai tre ACK duplicati, quindi non tutto vale per entrambe.",
      "Dopo la ricezione di tre ack duplicati riparte dal valore di ssthresh":
        "Questo è il comportamento di Reno con il Fast Recovery, non di Tahoe che riparte da 1.",
      "Alla ricezione di ack duplicati successivi al terzo incrementa di 1 la cwnd":
        "L'inflazione della finestra durante il Fast Recovery è una caratteristica di Reno, assente in Tahoe.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Differenze operative tra TCP Tahoe e TCP Reno.",
      "Tahoe non distingue i due eventi e torna sempre a 1; Reno tratta i 3 ACK duplicati come evento lieve.",
      "Tahoe è drastico e tratta tutto come un timeout; Reno ha una marcia in più.",
      "Quale curva del grafico di congestione corrisponde a TCP Tahoe?",
    ),
  },
  {
    id: "hist-146",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "facile",
    question:
      "Indicare quale dei seguenti protocolli di routing è di tipo link state.",
    options: [
      "RIP",
      "OSPF",
      "EBGP",
      "DiJkstra",
    ],
    correctAnswer:
      "OSPF",
    explanation:
      "In OSPF ogni router costruisce una mappa completa della rete tramite lo scambio di Link State Advertisement e calcola poi il percorso migliore in autonomia con l'algoritmo di Dijkstra. È il protocollo link state più diffuso all'interno dei sistemi autonomi.",
    whyOthersAreWrong: {
      "RIP":
        "RIP è di tipo distance vector: i router conoscono solo distanza e direzione basandosi sulle tabelle dei vicini.",
      "EBGP":
        "EBGP è un protocollo path vector usato per il routing tra sistemi autonomi diversi, non un IGP link state.",
      "DiJkstra":
        "Dijkstra è l'algoritmo matematico usato dai protocolli link state, non il nome di un protocollo.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Classificazione dei protocolli di routing per famiglia algoritmica.",
      "OSPF link state, RIP distance vector, BGP path vector.",
      "Dijkstra è l'algoritmo, OSPF è il protocollo che lo usa: non confonderli.",
      "A quale categoria appartiene il protocollo RIP?",
    ),
  },
  {
    id: "hist-147",
    category: "Internet",
    topic: "TCP e UDP",
    difficulty: "media",
    question:
      "Perché si preferisce il protocollo UDP per lo streaming video e audio?",
    options: [
      "Lo streaming richiede la ricevuta di ogni pacchetto a prescindere dal ritardo di consegna",
      "UDP prevede un handshake iniziale che permette di valutare la banda disponibile",
      "UDP è un protocollo affidabile che garantisce la consegna dei pacchetti",
      "Lo streaming non tollera il ritardo dovuto ad eventuali ritrasmissioni",
    ],
    correctAnswer:
      "Lo streaming non tollera il ritardo dovuto ad eventuali ritrasmissioni",
    explanation:
      "In TCP, se un pacchetto viene perso, quelli successivi devono attendere in coda finché non viene recuperato, fenomeno noto come Head-of-Line Blocking: in una videochiamata questo causerebbe un blocco dell'immagine. I dati audio e video in diretta hanno inoltre una scadenza: un fotogramma che arriva con due secondi di ritardo è inutile. UDP evita l'overhead dell'handshake e del mantenimento dello stato, permettendo una trasmissione più fluida.",
    whyOthersAreWrong: {
      "Lo streaming richiede la ricevuta di ogni pacchetto a prescindere dal ritardo di consegna":
        "È l'opposto: lo streaming preferisce perdere qualche pacchetto piuttosto che attendere, perché il ritardo è il vero nemico.",
      "UDP prevede un handshake iniziale che permette di valutare la banda disponibile":
        "UDP non prevede alcun handshake: è proprio questa assenza a renderlo leggero.",
      "UDP è un protocollo affidabile che garantisce la consegna dei pacchetti":
        "UDP non è affidabile e non garantisce alcuna consegna: offre un servizio best effort.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Compromesso tra affidabilità e latenza nelle applicazioni real-time.",
      "Meglio un fotogramma perso che un fotogramma in ritardo: per questo si sceglie UDP.",
      "Il dato in diretta ha una scadenza: se arriva tardi è già inutile.",
      "Quale servizio fra posta, trasferimento dati e videoconferenza è sensibile al ritardo?",
    ),
  },
  {
    id: "hist-148",
    category: "Internet",
    topic: "ARP",
    difficulty: "facile",
    question:
      "Riguardo al protocollo ARP, quale delle seguenti affermazioni è vera?",
    options: [
      "ARP viene utilizzato per ottenere l'indirizzo IP di un host a partire dall'hostname",
      "ARP è un protocollo di livello 4",
      "ARP viene utilizzato per ottenere l'indirizzo MAC di un host a partire dall'IP",
      "ARP viene utilizzato per determinare la rotta migliore su internet",
    ],
    correctAnswer:
      "ARP viene utilizzato per ottenere l'indirizzo MAC di un host a partire dall'IP",
    explanation:
      "ARP colma la distanza tra il livello di rete, che usa indirizzi IP logici, e il livello data link, che richiede indirizzi MAC fisici per la consegna locale. Il mittente conosce l'IP di destinazione ma non il MAC, quindi invia una richiesta in broadcast sulla rete locale e riceve in risposta l'indirizzo fisico corrispondente.",
    whyOthersAreWrong: {
      "ARP viene utilizzato per ottenere l'indirizzo IP di un host a partire dall'hostname":
        "La traduzione da nome a indirizzo IP è compito del DNS, non di ARP.",
      "ARP è un protocollo di livello 4":
        "ARP opera tra il livello 2 e il livello 3, incapsulato direttamente in frame Ethernet, non al livello di trasporto.",
      "ARP viene utilizzato per determinare la rotta migliore su internet":
        "La determinazione delle rotte è gestita da protocolli di routing come OSPF o BGP; ARP lavora solo dentro la LAN.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Funzione e collocazione di ARP nello stack.",
      "Da IP a MAC, solo all'interno della rete locale.",
      "DNS traduce nomi, ARP traduce indirizzi: due traduzioni diverse.",
      "Come fa un dispositivo ad apprendere l'indirizzo MAC dato l'indirizzo IP?",
    ),
  },
  {
    id: "hist-149",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "facile",
    question:
      "Indicare a quale categoria appartiene il protocollo RIP.",
    options: [
      "Distance Vector Protocol",
      "Path Vector Protocol",
      "Routed protocol",
      "Link State",
    ],
    correctAnswer:
      "Distance Vector Protocol",
    explanation:
      "In un protocollo Distance Vector ogni router conosce solo due cose per ogni destinazione: la distanza, che nel caso di RIP è il numero di salti, e il vettore, cioè a quale vicino inviare il pacchetto. I router scambiano periodicamente le loro intere tabelle di routing solo con i vicini diretti, applicando l'algoritmo di Bellman-Ford.",
    whyOthersAreWrong: {
      "Path Vector Protocol":
        "Il path vector è la categoria di BGP, che memorizza l'intero percorso in termini di sistemi autonomi per evitare cicli.",
      "Routed protocol":
        "Un routed protocol è quello che trasporta i dati e viene instradato, come IP: RIP è invece un routing protocol.",
      "Link State":
        "Nei link state come OSPF ogni router possiede la mappa completa della topologia, cosa che RIP non ha.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Categoria di appartenenza di RIP e metrica utilizzata.",
      "RIP è distance vector, usa l'hop count e si basa su Bellman-Ford.",
      "RIP conta i salti e si fida dei vicini: è distance vector.",
      "Quale protocollo di trasporto utilizza RIP per i propri aggiornamenti?",
    ),
  },
  {
    id: "hist-150",
    category: "Internet",
    topic: "congestion control",
    difficulty: "difficile",
    question:
      "Nell'intestazione (header) TCP non sono mai contenuti?",
    options: [
      "Flag RST",
      "Riscontro dei pacchetti ricevuti",
      "Il valore della cwnd, dimensione corrente della finestra di trasmissione",
      "Checksum",
    ],
    correctAnswer:
      "Il valore della cwnd, dimensione corrente della finestra di trasmissione",
    explanation:
      "Il campo Window a 16 bit dell'header trasporta la Receive Window, comunicata dal ricevitore per il controllo di flusso. La Congestion Window è invece una variabile calcolata solo localmente dal mittente in base agli ACK ricevuti o persi: il mittente non annuncia mai la propria finestra di congestione, si limita a inviare dati finché i byte non riscontrati restano sotto il minimo tra cwnd e rwnd.",
    whyOthersAreWrong: {
      "Flag RST":
        "Il flag RST è un campo standard dell'intestazione TCP, usato per abbattere immediatamente la connessione.",
      "Riscontro dei pacchetti ricevuti":
        "Il numero di acknowledgment è un campo obbligatorio dell'intestazione TCP.",
      "Checksum":
        "Il checksum a 16 bit è un campo standard e obbligatorio dell'intestazione TCP.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Distinzione tra receive window annunciata e congestion window locale.",
      "rwnd viaggia nell'header, cwnd resta una variabile interna del mittente.",
      "La congestione la stima chi invia, quindi non ha bisogno di comunicarla.",
      "Quale campo dell'header TCP implementa il controllo di flusso?",
    ),
  },
  {
    id: "hist-151",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "difficile",
    question:
      "In una sessione TCP in cui l'utente digita il carattere 'c', l'host A invia un primo segmento con Seq=14, ACK=18 e 1 byte di dati. L'host B risponde con un segmento (verde) che riscontra la ricezione e contiene l'eco del carattere, cioè 1 byte di dati. Infine l'host A invia un terzo segmento (rosso) che riscontra l'eco ricevuto. Quali sono i valori corretti dei numeri di sequenza e di riscontro?",
    options: [
      "Seq V = 19; ack V = 16, Seq R = 20, ack R = 17",
      "Seq V = 19; ack V = 15, Seq R = 20, ack R = 16",
      "Seq V = 18; ack V = 15, Seq R = 15, ack R = 20",
      "Seq V = 18; ack V = 15, Seq R = 15, ack R = 19",
    ],
    correctAnswer:
      "Seq V = 18; ack V = 15, Seq R = 15, ack R = 19",
    explanation:
      "L'host B deve usare come numero di sequenza il valore che A si aspettava, cioè l'ACK del pacchetto precedente: Seq V vale quindi 18. B conferma inoltre di aver ricevuto il byte 14 inviato da A, quindi il prossimo byte atteso è 15 e ACK V vale 15. Nel terzo segmento A usa come sequenza il valore richiesto da B, cioè 15, e conferma di aver ricevuto l'eco partito dal byte 18, quindi ACK R vale 19.",
    whyOthersAreWrong: {
      "Seq V = 19; ack V = 16, Seq R = 20, ack R = 17":
        "Incrementa erroneamente tutti i valori di uno: il numero di sequenza di B deve coincidere con l'ACK atteso da A, cioè 18.",
      "Seq V = 19; ack V = 15, Seq R = 20, ack R = 16":
        "Il numero di sequenza di B non può essere 19: A si aspettava il byte 18, come indicato nell'ACK del primo segmento.",
      "Seq V = 18; ack V = 15, Seq R = 15, ack R = 20":
        "I primi tre valori sono corretti, ma l'ultimo ACK è errato: avendo ricevuto un solo byte a partire dal 18, il prossimo atteso è 19, non 20.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Evoluzione incrociata di sequence number e acknowledgment in una sessione TCP.",
      "Il Seq di una parte coincide con l'ACK che l'altra si aspettava; l'ACK è sempre l'ultimo byte più uno.",
      "Segui i due flussi separatamente: ognuno numera i propri byte e riscontra quelli altrui.",
      "Quale ACK invia il ricevitore dopo un segmento con Seq 201 e lunghezza 100?",
    ),
  },
  {
    id: "hist-152",
    category: "Internet",
    topic: "TCP e UDP",
    difficulty: "facile",
    question:
      "Quanti byte aggiunge al messaggio una intestazione UDP?",
    options: [
      "8 byte",
      "16 byte",
      "4 byte",
      "20 byte",
    ],
    correctAnswer:
      "8 byte",
    explanation:
      "L'header UDP è composto da soli quattro campi, ciascuno di 2 byte: porta sorgente, porta destinazione, lunghezza e checksum. Il totale è quindi 8 byte fissi. Per confronto, un'intestazione TCP standard senza opzioni occupa 20 byte, così come l'intestazione IPv4.",
    whyOthersAreWrong: {
      "16 byte":
        "Non corrisponde ad alcuna intestazione standard: i quattro campi UDP da 2 byte danno 8, non 16.",
      "4 byte":
        "Quattro byte basterebbero appena per le due porte, lasciando fuori lunghezza e checksum.",
      "20 byte":
        "20 byte è la dimensione minima dell'intestazione TCP e di quella IPv4, non di UDP.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Struttura e dimensione dell'intestazione UDP.",
      "Quattro campi da 2 byte: porte, lunghezza e checksum, per 8 byte totali.",
      "UDP è il protocollo leggero: 8 byte contro i 20 di TCP.",
      "Quanti byte aggiunge un'intestazione TCP in assenza di opzioni?",
    ),
  },
  {
    id: "hist-153",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "facile",
    question:
      "In fase di progettazione dell'indirizzamento di una rete locale viene assegnato lo schema 192.168.30.0/24 e gli indirizzi 192.168.30.255 e 192.168.30.0 vengono esclusi. Spiegare perché.",
    options: [
      "192.168.30.0 è l'indirizzo di rete e 192.168.30.255 è l'indirizzo di broadcast",
      "192.168.30.0 e 192.168.30.255 sono riservati per il gestore della mail e del DNS",
      "192.168.30.0 è l'indirizzo di rete riservato al gateway di default e 192.168.30.255 è l'indirizzo riservato ai server DHCP",
      "192.168.30.0 e 192.168.30.255 sono riservati per permettere l'accesso alla rete esterna",
    ],
    correctAnswer:
      "192.168.30.0 è l'indirizzo di rete e 192.168.30.255 è l'indirizzo di broadcast",
    explanation:
      "In una rete /24 l'ultimo ottetto è dedicato agli host. L'indirizzo con tutti i bit host a zero identifica la rete stessa e nessun dispositivo può assumerlo, perché i router lo usano per indirizzare il traffico verso l'intera sottorete. L'indirizzo con tutti i bit host a uno è l'indirizzo di broadcast diretto, ricevuto da tutti gli host della rete. Restano quindi utilizzabili gli indirizzi da .1 a .254, cioè 254 host.",
    whyOthersAreWrong: {
      "192.168.30.0 e 192.168.30.255 sono riservati per il gestore della mail e del DNS":
        "Mail e DNS sono servizi applicativi e non hanno alcun indirizzo riservato per convenzione nella sottorete.",
      "192.168.30.0 è l'indirizzo di rete riservato al gateway di default e 192.168.30.255 è l'indirizzo riservato ai server DHCP":
        "Il gateway riceve un normale indirizzo host, tipicamente .1 o .254, e il DHCP non ha indirizzi riservati per standard.",
      "192.168.30.0 e 192.168.30.255 sono riservati per permettere l'accesso alla rete esterna":
        "L'accesso esterno passa dal gateway, che è un host ordinario della sottorete.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Indirizzi non assegnabili in una sottorete IPv4.",
      "Bit host tutti a zero identificano la rete, tutti a uno il broadcast: entrambi non assegnabili.",
      "In ogni sottorete perdi sempre due indirizzi: il primo e l'ultimo.",
      "Quanti host utilizzabili offre effettivamente una sottorete /26?",
    ),
  },
  {
    id: "hist-154",
    category: "Internet",
    topic: "TCP e UDP",
    difficulty: "facile",
    question:
      "Indicare il tipo di servizio offerto da TCP.",
    options: [
      "Un servizio affidabile, orientato alla connessione",
      "Un servizio inaffidabile, non orientato alla connessione",
      "Un servizio affidabile, non orientato alla connessione",
      "Un servizio inaffidabile, orientato alla connessione",
    ],
    correctAnswer:
      "Un servizio affidabile, orientato alla connessione",
    explanation:
      "TCP è orientato alla connessione perché prima di inviare qualsiasi dato applicativo client e server devono sincronizzarsi tramite il three-way handshake con SYN, SYN-ACK e ACK. È inoltre affidabile perché garantisce la consegna dei dati senza errori, senza perdite e nel giusto ordine: se un pacchetto viene perso o arriva corrotto, TCP se ne accorge e lo ritrasmette automaticamente.",
    whyOthersAreWrong: {
      "Un servizio inaffidabile, non orientato alla connessione":
        "Questa è la descrizione esatta di UDP, il protocollo complementare a TCP.",
      "Un servizio affidabile, non orientato alla connessione":
        "L'affidabilità di TCP si costruisce proprio sullo stato mantenuto dalla connessione: le due proprietà non sono separabili in questo modo.",
      "Un servizio inaffidabile, orientato alla connessione":
        "TCP è affidabile per definizione: sarebbe contraddittorio mantenere una connessione senza garantire la consegna.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Le due proprietà fondamentali del servizio TCP.",
      "Connection-oriented grazie all'handshake e reliable grazie ad ACK e ritrasmissioni.",
      "TCP e UDP sono opposti su entrambe le proprietà: se una descrizione è di uno, non è dell'altro.",
      "Quale sequenza di flag caratterizza il three-way handshake?",
    ),
  },
  {
    id: "hist-155",
    category: "Internet",
    topic: "congestion control",
    difficulty: "media",
    question:
      "L'incremento della finestra corrente del trasmettitore TCP:",
    options: [
      "È regolata dalla sola fase di controllo di congestione dello slow-start",
      "È regolata dalla sola fase di fast recovery",
      "È regolata dalle fasi di controllo di congestione dette slow-start e di congestion avoidance",
      "È regolata da sola dal ricevitore",
    ],
    correctAnswer:
      "È regolata dalle fasi di controllo di congestione dette slow-start e di congestion avoidance",
    explanation:
      "Il trasmettitore gestisce la crescita della finestra di congestione in due fasi principali. Nello slow start, all'inizio della connessione o dopo un timeout, la cwnd cresce in modo esponenziale raddoppiando a ogni RTT finché resta sotto la soglia ssthresh. Superata la soglia si entra in congestion avoidance, dove la crescita diventa lineare con un incremento di 1 MSS per ogni RTT, per sondare il limite della banda con prudenza.",
    whyOthersAreWrong: {
      "È regolata dalla sola fase di controllo di congestione dello slow-start":
        "Lo slow start governa solo la crescita iniziale: superata la soglia subentra la congestion avoidance.",
      "È regolata dalla sola fase di fast recovery":
        "Il fast recovery è una fase di ripristino dopo una perdita, non il meccanismo ordinario di crescita della finestra.",
      "È regolata da sola dal ricevitore":
        "Il ricevitore impone un tetto massimo tramite la receive window, ma la logica di incremento progressivo è dell'algoritmo del trasmettitore.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Fasi di crescita della finestra di congestione.",
      "Crescita esponenziale sotto la soglia, lineare sopra la soglia.",
      "Slow start è veloce nonostante il nome; congestion avoidance è quella prudente.",
      "Cosa accade alla finestra di congestione allo scadere di un timeout?",
    ),
  },
  {
    id: "hist-156",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "facile",
    question:
      "Qual è il compito principale del protocollo ICMP e a quale livello appartiene?",
    options: [
      "Errore e diagnosi, livello di rete",
      "Indirizzamento, livello di rete",
      "Errore e diagnosi, livello di trasporto",
      "Errore e diagnosi, datalink",
    ],
    correctAnswer:
      "Errore e diagnosi, livello di rete",
    explanation:
      "ICMP è il protocollo di servizio del livello IP: poiché IP è best effort e non garantito, quando un router deve scartare un pacchetto perché è scaduto il TTL o la rete non è raggiungibile, usa ICMP per avvisare il mittente. Appartiene strettamente al livello di rete e lavora a fianco di IP. Usi comuni sono Echo Request e Reply per il comando ping e Time Exceeded per traceroute.",
    whyOthersAreWrong: {
      "Indirizzamento, livello di rete":
        "Il livello è corretto ma il compito no: l'indirizzamento è di IP, mentre ICMP si occupa di controllo e diagnostica.",
      "Errore e diagnosi, livello di trasporto":
        "Il compito è corretto ma il livello no: ICMP non usa né TCP né UDP e non appartiene al livello di trasporto.",
      "Errore e diagnosi, datalink":
        "Il compito è corretto ma il livello no: ICMP viaggia incapsulato dentro i pacchetti IP, quindi opera al livello di rete.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Ruolo e collocazione di ICMP nello stack protocollare.",
      "ICMP segnala errori e diagnostica per conto di IP, al livello di rete.",
      "Viaggia dentro IP, quindi sta allo stesso livello di IP.",
      "Quale protocollo è usato per comunicare gli errori a livello di rete?",
    ),
  },
  {
    id: "hist-157",
    category: "Internet",
    topic: "Ethernet",
    difficulty: "media",
    question:
      "Nel formato del frame Ethernet i campi si susseguono così: un primo campo di 7 byte evidenziato in rosso, l'SFD di 1 byte, l'indirizzo di destinazione di 6 byte, l'indirizzo sorgente di 6 byte, un campo di 2 byte evidenziato in blu, i dati da 46 a 1500 byte e infine un campo di 4 byte evidenziato in giallo. Indicare le corrispondenze corrette.",
    options: [
      "Rosso = preambolo, blu = crc, giallo = lunghezza",
      "Rosso = lunghezza, blu = preambolo, giallo = crc",
      "Rosso = preambolo, blu = lunghezza, giallo = crc",
      "Rosso = versione, blu = lunghezza, giallo = crc",
    ],
    correctAnswer:
      "Rosso = preambolo, blu = lunghezza, giallo = crc",
    explanation:
      "Il frame IEEE 802.3 inizia con 7 byte di preambolo con bit alternati per la sincronizzazione fisica, seguiti dallo Start Frame Delimiter di 1 byte. Dopo i due indirizzi MAC da 6 byte ciascuno si trova un campo di 2 byte che indica la lunghezza dei dati se il valore è minore o uguale a 1500, oppure il tipo di protocollo trasportato se è maggiore o uguale a 1536. Il frame si chiude con 4 byte di FCS contenenti il CRC per rilevare errori di trasmissione.",
    whyOthersAreWrong: {
      "Rosso = preambolo, blu = crc, giallo = lunghezza":
        "Inverte gli ultimi due campi: il CRC occupa 4 byte in coda, mentre la lunghezza sta nei 2 byte prima dei dati.",
      "Rosso = lunghezza, blu = preambolo, giallo = crc":
        "Il preambolo è sempre il primo campo del frame e occupa 7 byte, non può trovarsi dopo gli indirizzi.",
      "Rosso = versione, blu = lunghezza, giallo = crc":
        "Il frame Ethernet non contiene alcun campo versione: quello iniziale è il preambolo.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Struttura completa del frame Ethernet e dimensione dei campi.",
      "Preambolo, SFD, MAC destinazione, MAC sorgente, lunghezza/tipo, dati, FCS.",
      "Il controllo di integrità sta sempre in coda: 4 byte finali di CRC.",
      "Quale elemento è contenuto nel trailer del frame data-link?",
    ),
  },
  {
    id: "hist-158",
    category: "Internet",
    topic: "Ethernet",
    difficulty: "media",
    question:
      "Qual è la dimensione dei dati che può essere inserita in un normale frame ethernet?",
    options: [
      "Da 64 a 2048 bytes",
      "Da 0 a 1500 bytes",
      "Da 0 a 1024 bytes",
      "Da 46 a 1500 bytes",
    ],
    correctAnswer:
      "Da 46 a 1500 bytes",
    explanation:
      "Un frame Ethernet standard ha dimensione massima di 1518 byte: sottraendo i 18 byte di intestazione, cioè 6 di destinazione, 6 di sorgente, 2 di tipo o lunghezza e 4 di CRC, restano 1500 byte per i dati, che costituiscono la MTU. Il minimo è invece imposto dal rilevamento delle collisioni: un frame non può essere più piccolo di 64 byte, quindi il campo dati deve essere almeno di 46 byte, con padding se necessario.",
    whyOthersAreWrong: {
      "Da 64 a 2048 bytes":
        "64 byte è la dimensione minima dell'intero frame, non del solo campo dati, e 2048 supera la MTU standard.",
      "Da 0 a 1500 bytes":
        "Il limite superiore è corretto, ma il campo dati non può scendere sotto 46 byte, altrimenti si aggiunge padding.",
      "Da 0 a 1024 bytes":
        "Entrambi gli estremi sono errati rispetto allo standard Ethernet.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Dimensione minima e massima del payload Ethernet e ruolo del padding.",
      "Payload tra 46 e 1500 byte; sotto i 46 si riempie con padding.",
      "Il minimo esiste per far funzionare il rilevamento delle collisioni, non per i dati.",
      "Perché un frame Ethernet non può essere più piccolo di 64 byte?",
    ),
  },
  {
    id: "hist-159",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "media",
    question:
      "Supponiamo di avere un ISP che gestisce il blocco di indirizzi 128.119.40.0/24 a partire dal quale si vogliono creare due sottoreti di dimensione uguale. Quali sono i prefissi delle due sottoreti?",
    options: [
      "128.119.40.32/25 e 128.119.40.64/25",
      "128.119.40.0/25 e 128.119.40.128/25",
      "128.119.40.0/25 e 128.119.40.255/25",
      "128.119.40.0/24 e 128.119.40.128/24",
    ],
    correctAnswer:
      "128.119.40.0/25 e 128.119.40.128/25",
    explanation:
      "Per dividere un blocco in due sottoreti bisogna incrementare il prefisso di un bit, passando quindi da /24 a /25. Un blocco /25 contiene 2 elevato a 7, cioè 128 indirizzi: la prima sottorete va da .0 a .127 e ha come indirizzo di rete 128.119.40.0/25, la seconda va da .128 a .255 e ha come indirizzo di rete 128.119.40.128/25.",
    whyOthersAreWrong: {
      "128.119.40.32/25 e 128.119.40.64/25":
        "Non sono indirizzi di rete validi per blocchi /25: i confini corretti cadono su .0 e .128.",
      "128.119.40.0/25 e 128.119.40.255/25":
        "Il valore .255 è l'indirizzo di broadcast del blocco originale, non l'indirizzo di rete della seconda sottorete.",
      "128.119.40.0/24 e 128.119.40.128/24":
        "Mantenere il prefisso /24 non divide nulla: entrambe le voci descriverebbero lo stesso blocco di partenza.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Suddivisione di un blocco in sottoreti tramite estensione del prefisso.",
      "Per 2^n sottoreti si aggiungono n bit al prefisso: da /24 a /25 per due parti.",
      "Dividere in due significa un bit in più nella maschera e metà indirizzi per parte.",
      "Quale prefisso serve per suddividere un /24 in quattro sottoreti uguali?",
    ),
  },
  {
    id: "hist-160",
    category: "Internet",
    topic: "SMTP, POP3, IMAP",
    difficulty: "facile",
    question:
      "Indicare quale dei seguenti protocolli permette di mantenere le e-mail sul server e organizzarle in cartelle.",
    options: [
      "HTTP",
      "POP3",
      "SMTP",
      "IMAP",
    ],
    correctAnswer:
      "IMAP",
    explanation:
      "IMAP mantiene la posta sul server e la sincronizza, supportando la gestione delle cartelle lato server: l'utente vede la stessa struttura organizzata da qualsiasi dispositivo. POP3 invece scarica la posta sul dispositivo locale e solitamente la cancella dal server, senza sincronizzare le cartelle, che restano puramente locali.",
    whyOthersAreWrong: {
      "HTTP":
        "HTTP è usato per accedere alla webmail dal browser, ma non è un protocollo di gestione della posta in sé.",
      "POP3":
        "POP3 scarica i messaggi in locale e non supporta la sincronizzazione di cartelle sul server.",
      "SMTP":
        "SMTP serve solo a inviare la posta o a trasferirla tra server, non a consultarla o organizzarla.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Differenza tra IMAP e POP3 nella gestione dei messaggi.",
      "IMAP sincronizza e lascia tutto sul server; POP3 scarica e tipicamente cancella.",
      "Se vuoi vedere le stesse cartelle da telefono e PC ti serve IMAP.",
      "Quale protocollo viene usato per il recupero dei messaggi inviati tramite SMTP?",
    ),
  },
  {
    id: "hist-161",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "difficile",
    question:
      "Quale dei seguenti insiemi di attributi è obbligatorio in EBGP?",
    options: [
      "AGGREGATOR, ORIGIN, NEXT-HOP",
      "ORIGIN, AS-PATH, NEXT-HOP",
      "AGGREGATOR, AS-PATH, NEXT-HOP",
      "ORIGIN, AS-PATH",
    ],
    correctAnswer:
      "ORIGIN, AS-PATH, NEXT-HOP",
    explanation:
      "Questi tre sono gli attributi well-known mandatory di BGP. ORIGIN definisce l'origine dell'informazione di instradamento, ad esempio se appresa da IGP o EGP; AS-PATH elenca i sistemi autonomi attraversati ed è fondamentale in eBGP per evitare i loop di instradamento; NEXT-HOP indica l'indirizzo IP del router successivo verso la destinazione.",
    whyOthersAreWrong: {
      "AGGREGATOR, ORIGIN, NEXT-HOP":
        "AGGREGATOR è un attributo optional transitive, quindi non obbligatorio, e manca AS-PATH che invece lo è.",
      "AGGREGATOR, AS-PATH, NEXT-HOP":
        "Include AGGREGATOR che è opzionale e omette ORIGIN, che è obbligatorio.",
      "ORIGIN, AS-PATH":
        "L'elenco è incompleto: manca NEXT-HOP, anch'esso well-known mandatory.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Attributi obbligatori e opzionali del protocollo BGP.",
      "I tre obbligatori sono ORIGIN, AS-PATH e NEXT-HOP.",
      "Da dove viene, per dove è passata, a chi la mando: sono le tre domande essenziali.",
      "Quale attributo non è previsto nel protocollo BGP?",
    ),
  },
  {
    id: "hist-162",
    category: "Internet",
    topic: "Wi-Fi e reti mobili",
    difficulty: "media",
    question:
      "Qual è la sequenza corretta di eventi nel caso del protocollo 802.11 RTS/CTS?",
    options: [
      "RTS > CTS > DATA > CTS",
      "CTS > RTS > DATA > CTS",
      "CTS > RTS > DATA > ACK",
      "RTS > CTS > DATA > ACK",
    ],
    correctAnswer:
      "RTS > CTS > DATA > ACK",
    explanation:
      "La sequenza serve a riservare il mezzo trasmissivo e a confermare la ricezione. Il mittente chiede il permesso di trasmettere con un Request To Send; il destinatario lo accorda con un Clear To Send, silenziando i nodi vicini che lo sentono; il mittente invia i dati; infine il destinatario conferma la ricezione corretta con un ACK, fondamentale perché nel wireless interferenze e collisioni sono frequenti.",
    whyOthersAreWrong: {
      "RTS > CTS > DATA > CTS":
        "La conferma finale della ricezione è un ACK, non un secondo CTS che serve solo a concedere il canale.",
      "CTS > RTS > DATA > CTS":
        "Inverte l'ordine iniziale: il permesso CTS non può precedere la richiesta RTS, e chiude con un CTS invece che con un ACK.",
      "CTS > RTS > DATA > ACK":
        "La conclusione è corretta ma l'apertura è invertita: si chiede prima con RTS e si riceve poi il CTS.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Handshake di prenotazione del canale in 802.11.",
      "Chiedo, ricevo il permesso, trasmetto, ottengo conferma: RTS, CTS, DATA, ACK.",
      "È una conversazione educata: permesso, prego, parlo, ricevuto.",
      "Quale meccanismo risolve il problema del terminale nascosto in 802.11?",
    ),
  },
  {
    id: "hist-163",
    category: "Internet",
    topic: "ARP",
    difficulty: "facile",
    question:
      "Quale tipo di messaggio viene utilizzato nel protocollo ARP (Address Resolution Protocol) per ottenere l'indirizzo MAC di un host nella rete locale?",
    options: [
      "ARP Probe",
      "ARP Reply",
      "ARP request",
      "ARP Announcement",
    ],
    correctAnswer:
      "ARP request",
    explanation:
      "Il mittente conosce l'IP di destinazione ma non il MAC, quindi invia una ARP request in broadcast all'indirizzo FF:FF:FF:FF:FF:FF chiedendo chi possiede quell'indirizzo IP. L'host che riconosce il proprio indirizzo risponde poi in unicast con una ARP reply contenente il proprio indirizzo MAC.",
    whyOthersAreWrong: {
      "ARP Probe":
        "L'ARP Probe serve a verificare eventuali conflitti di indirizzo IP, cioè la Duplicate Address Detection.",
      "ARP Reply":
        "La reply è la risposta che fornisce il MAC, non il messaggio con cui lo si richiede.",
      "ARP Announcement":
        "L'announcement, o Gratuitous ARP, serve ad aggiornare spontaneamente le cache degli altri host.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Tipi di messaggio del protocollo ARP e relative funzioni.",
      "Request per chiedere, reply per rispondere, probe e announcement per casi particolari.",
      "Chi cerca fa una richiesta: request. Chi sa risponde: reply.",
      "In quale modalità viene inviata una ARP request?",
    ),
  },
  {
    id: "hist-164",
    category: "Internet",
    topic: "ARP",
    difficulty: "media",
    question:
      "Come fa un dispositivo ad apprendere l'indirizzo MAC dato l'indirizzo IP?",
    options: [
      "Verifica la sua presenza nella tabella ARP, se non è presente usa il protocollo DHCP",
      "Genera un pacchetto con indirizzo di destinazione vuoto e lo invia",
      "Verifica la sua presenza nella tabella ARP, se non è presente invia una ARP request",
      "Genera un pacchetto con indirizzo di destinazione il valore IP di broadcast e lo invia",
    ],
    correctAnswer:
      "Verifica la sua presenza nella tabella ARP, se non è presente invia una ARP request",
    explanation:
      "Il sistema operativo consulta prima la ARP table locale: se la corrispondenza tra IP e MAC è già in cache la usa direttamente, senza generare traffico di rete. Solo in caso di cache miss il dispositivo invia una ARP request in broadcast chiedendo chi possiede quell'indirizzo IP, e memorizza poi la risposta per gli usi successivi.",
    whyOthersAreWrong: {
      "Verifica la sua presenza nella tabella ARP, se non è presente usa il protocollo DHCP":
        "DHCP serve a ottenere la propria configurazione IP all'avvio, non a scoprire gli indirizzi fisici degli altri host.",
      "Genera un pacchetto con indirizzo di destinazione vuoto e lo invia":
        "Un frame senza indirizzo di destinazione non sarebbe processabile da nessun dispositivo della rete.",
      "Genera un pacchetto con indirizzo di destinazione il valore IP di broadcast e lo invia":
        "Il broadcast della ARP request avviene a livello MAC, non usando l'indirizzo IP di broadcast come destinazione.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Consultazione della cache ARP e gestione del cache miss.",
      "Prima si guarda in tabella, e solo se manca si chiede in broadcast.",
      "Si controlla sempre la memoria locale prima di disturbare tutta la rete.",
      "Perché la coppia IP-MAC viene salvata nella ARP table dopo la risposta?",
    ),
  },
  {
    id: "hist-165",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "facile",
    question:
      "Dato il seguente indirizzo 178.12.34.1/28, cosa rappresenta il 28?",
    options: [
      "Il numero di bit nella porzione di rete",
      "Il numero di bit nella porzione di nodo",
      "Il numero di nodi nella rete",
      "La classe di appartenenza",
    ],
    correctAnswer:
      "Il numero di bit nella porzione di rete",
    explanation:
      "Un indirizzo IPv4 è composto da 32 bit totali e la notazione /28 indica che i primi 28 bit sono assegnati all'identificativo della rete. I restanti 4 bit sono disponibili per indirizzare i singoli nodi, il che consente 2 elevato a 4, cioè 16 combinazioni, da cui vanno tolti indirizzo di rete e broadcast per un totale di 14 host utilizzabili.",
    whyOthersAreWrong: {
      "Il numero di bit nella porzione di nodo":
        "I bit riservati agli host sono quelli rimanenti, cioè 32 meno 28 uguale 4.",
      "Il numero di nodi nella rete":
        "Il numero di nodi si calcola a partire dai bit host ed è 14, non 28.",
      "La classe di appartenenza":
        "Le classi appartengono al vecchio modello classful, superato proprio dalla notazione CIDR.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Significato del suffisso nella notazione CIDR.",
      "Il numero dopo lo slash conta i bit di rete; gli host sono ciò che resta fino a 32.",
      "Il suffisso indica quanto è lunga la maschera, non quanti host ci stanno.",
      "Quanti host utilizzabili offre una sottorete con prefisso /28?",
    ),
  },
  {
    id: "hist-166",
    category: "Internet",
    topic: "sliding window",
    difficulty: "media",
    question:
      "Indicare quale affermazione NON è corretta per il meccanismo di controllo del traffico \"Flow Control\".",
    options: [
      "Con questo meccanismo si evita che il destinatario riceva più dati di quelli che può gestire",
      "Questo meccanismo agisce rallentando il traffico in uscita",
      "Viene controllato il traffico del core e non quello tra sorgente e destinazione",
      "I livelli di data link e Transport gestiscono questo meccanismo",
    ],
    correctAnswer:
      "Viene controllato il traffico del core e non quello tra sorgente e destinazione",
    explanation:
      "Il controllo di flusso è una negoziazione tra due estremi: se il buffer del ricevitore è pieno, questi comunica al mittente di rallentare. Non si occupa di ciò che accade nel core della rete, che è invece competenza del controllo di congestione: quest'ultimo interviene quando i router intermedi sono saturi, per evitare il collasso della rete.",
    whyOthersAreWrong: {
      "Con questo meccanismo si evita che il destinatario riceva più dati di quelli che può gestire":
        "È vera: è esattamente la definizione di controllo di flusso.",
      "Questo meccanismo agisce rallentando il traffico in uscita":
        "È vera: il mittente riduce la quantità di dati in volo in base alla finestra annunciata dal ricevitore.",
      "I livelli di data link e Transport gestiscono questo meccanismo":
        "È vera: il controllo di flusso esiste sia a livello 2, con i PAUSE frame, sia a livello 4 con la finestra TCP.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Confine tra controllo di flusso e controllo di congestione.",
      "Flow control guarda al ricevitore, congestion control guarda alla rete.",
      "Se il problema è nel mezzo della rete non è flusso, è congestione.",
      "Quale meccanismo TCP evita che segmenti vengano scartati per differenza di velocità tra host?",
    ),
  },
  {
    id: "hist-167",
    category: "Internet",
    topic: "MAC address",
    difficulty: "facile",
    question:
      "Indicare quale delle seguenti descrizioni è corretta per un indirizzo MAC.",
    options: [
      "Permette di identificare univocamente il processo all'interno di un nodo",
      "È l'indirizzo fisico (hardware) assegnato ad una scheda ethernet dal produttore",
      "È diviso in due parti: rete e nodo",
      "La lunghezza è pari a 128 bit",
    ],
    correctAnswer:
      "È l'indirizzo fisico (hardware) assegnato ad una scheda ethernet dal produttore",
    explanation:
      "L'indirizzo MAC è composto da 48 bit, cioè 6 byte, rappresentati in esadecimale. I primi 24 bit costituiscono l'OUI, che identifica il produttore della scheda, mentre gli ultimi 24 bit sono assegnati univocamente dal produttore alla singola scheda di rete.",
    whyOthersAreWrong: {
      "Permette di identificare univocamente il processo all'interno di un nodo":
        "L'identificazione del processo è compito delle porte, al livello di trasporto.",
      "È diviso in due parti: rete e nodo":
        "La divisione tra parte di rete e parte host è propria dell'indirizzo IP: il MAC si divide invece in OUI e identificativo della scheda.",
      "La lunghezza è pari a 128 bit":
        "128 bit è la lunghezza di un indirizzo IPv6: il MAC è lungo 48 bit.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Struttura e natura dell'indirizzo MAC.",
      "48 bit divisi in OUI del produttore e identificativo della singola scheda.",
      "Il MAC è fisico e assegnato in fabbrica; l'IP è logico e assegnato dalla rete.",
      "Come viene identificato univocamente un dispositivo ethernet a livello data link?",
    ),
  },
  {
    id: "hist-168",
    category: "Internet",
    topic: "TCP e UDP",
    difficulty: "facile",
    question:
      "Quale protocollo di trasporto fornisce un trasferimento best-effort senza garanzia di consegna?",
    options: [
      "nessuno di quelli indicati",
      "TCP",
      "UDP",
      "http",
    ],
    correctAnswer:
      "UDP",
    explanation:
      "UDP spedisce i dati senza stabilire prima alcuna connessione e non utilizza riscontri, quindi il mittente non sa se il destinatario ha ricevuto il messaggio. Eliminando l'overhead dei controlli di errore e di flusso risulta molto più veloce ed efficiente per applicazioni che tollerano qualche perdita, come lo streaming video o il DNS, ma non garantisce l'integrità del trasferimento.",
    whyOthersAreWrong: {
      "nessuno di quelli indicati":
        "Uno dei protocolli elencati offre effettivamente un servizio best effort, quindi l'alternativa non è valida.",
      "TCP":
        "TCP è affidabile e orientato alla connessione: garantisce consegna, ordine e integrità dei dati.",
      "http":
        "HTTP è un protocollo di livello applicativo, non di trasporto.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Caratteristiche del servizio best effort di UDP.",
      "Nessuna connessione, nessun ACK, nessuna garanzia: è UDP.",
      "Best effort significa ci provo: nessuna promessa di riuscita.",
      "Perché UDP viene definito connectionless?",
    ),
  },
  {
    id: "hist-169",
    category: "Internet",
    topic: "Introduzione a Internet",
    difficulty: "media",
    question:
      "Supponendo che il ritardo introdotto dal router sia nullo, che L sia la dimensione di tutti i pacchetti trasmessi in bit e R la velocità del canale in bps, e che la trasmissione sia di tipo store-and-forward, calcolare il ritardo end-to-end fra i due sistemi periferici per trasmettere 1 pacchetto su un percorso di N collegamenti (N − 1 router).",
    options: [
      "3NL/R",
      "2NL/R",
      "NL/R",
      "L/R",
    ],
    correctAnswer:
      "NL/R",
    explanation:
      "Il tempo necessario per mettere un intero pacchetto di lunghezza L su un collegamento con velocità R è L/R. Con la strategia store-and-forward il router deve ricevere tutto il pacchetto prima di poter iniziare a ritrasmetterlo sul collegamento successivo, quindi le trasmissioni sono rigorosamente sequenziali. Poiché i collegamenti sono N, il pacchetto viene trasmesso per intero N volte, per un totale di N per L/R.",
    whyOthersAreWrong: {
      "3NL/R":
        "Il fattore 3 non ha alcuna giustificazione: ogni collegamento contribuisce esattamente con un L/R.",
      "2NL/R":
        "Raddoppierebbe il contributo di ogni collegamento, mentre ciascuno richiede una sola trasmissione completa.",
      "L/R":
        "Considera un solo collegamento e ignora che il pacchetto deve attraversarne N in sequenza.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Ritardo end-to-end con store-and-forward su più collegamenti.",
      "Ogni collegamento costa L/R e i costi si sommano: totale N per L/R.",
      "Conta i collegamenti, non i router: N link significano N trasmissioni complete.",
      "Qual è il ritardo totale con velocità diverse R1 e R2 su due collegamenti?",
    ),
  },
  {
    id: "hist-170",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "media",
    question:
      "Indicare quale dei seguenti attributi non è previsto nel protocollo BGP.",
    options: [
      "AS-PATH",
      "Nessuno di quelli indicati",
      "AS-NEXT",
      "NEXT-HOP",
    ],
    correctAnswer:
      "AS-NEXT",
    explanation:
      "L'attributo AS-NEXT non esiste: è un nome costruito per confondere, simile a termini reali. AS-PATH è l'attributo che elenca la sequenza di sistemi autonomi attraversati per raggiungere la destinazione ed è fondamentale per evitare i loop; NEXT-HOP indica l'indirizzo IP del prossimo router a cui inviare il pacchetto. Esistono inoltre attributi reali come Local Preference, MED e Origin.",
    whyOthersAreWrong: {
      "AS-PATH":
        "È un attributo reale e obbligatorio, che elenca i sistemi autonomi attraversati dall'annuncio.",
      "Nessuno di quelli indicati":
        "Uno degli attributi elencati non esiste realmente, quindi l'alternativa non è valida.",
      "NEXT-HOP":
        "È un attributo reale e obbligatorio, che indica il prossimo salto verso la destinazione.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Attributi realmente definiti nel protocollo BGP.",
      "AS-PATH e NEXT-HOP esistono e sono obbligatori; AS-NEXT è inventato.",
      "Il percorso è AS-PATH e il salto è NEXT-HOP: non esiste una fusione dei due.",
      "Quale insieme di attributi è obbligatorio in eBGP?",
    ),
  },
  {
    id: "hist-171",
    category: "Internet",
    topic: "switch",
    difficulty: "facile",
    question:
      "Per aggiornare la propria tabella, uno switch?",
    options: [
      "Agisce in autonomia ed in modo automatico sulla base dei frame ricevuti",
      "Chiede esplicitamente agli host di comunicare il proprio indirizzo MAC",
      "Utilizza il protocollo DHCP",
      "Utilizza il protocollo ARP",
    ],
    correctAnswer:
      "Agisce in autonomia ed in modo automatico sulla base dei frame ricevuti",
    explanation:
      "Quando un frame arriva su una porta, lo switch esamina l'indirizzo MAC sorgente contenuto nell'intestazione Ethernet e deduce che l'host proprietario di quel MAC si trova collegato a quella porta, aggiornando di conseguenza la propria tabella di commutazione. Il processo è completamente automatico e non richiede alcuna interrogazione esplicita.",
    whyOthersAreWrong: {
      "Chiede esplicitamente agli host di comunicare il proprio indirizzo MAC":
        "Lo switch non interroga nessuno: si limita a osservare passivamente i frame che transitano.",
      "Utilizza il protocollo DHCP":
        "DHCP assegna configurazioni IP agli host e non ha alcun ruolo nella costruzione della tabella di commutazione.",
      "Utilizza il protocollo ARP":
        "ARP serve agli host per trovare un MAC dato un IP: lo switch non ne ha bisogno perché legge direttamente i MAC dai frame.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Apprendimento automatico della tabella di commutazione.",
      "Lo switch impara osservando il MAC sorgente e la porta di ingresso dei frame.",
      "Non chiede, ascolta: impara da chi parla.",
      "Come funziona l'auto-apprendimento degli switch Ethernet?",
    ),
  },
  {
    id: "hist-173",
    category: "Internet",
    topic: "DNS",
    difficulty: "media",
    question:
      "Oltre alla traduzione degli hostname in indirizzi IP, il DNS mette a disposizione altri servizi. Indicare quale tra i seguenti NON è un servizio offerto dal DNS.",
    options: [
      "Load distribution",
      "Mail server caching",
      "Virtual Private Network Management",
      "Host aliasing",
    ],
    correctAnswer:
      "Virtual Private Network Management",
    explanation:
      "I servizi aggiuntivi standard del DNS sono l'host aliasing, che permette di avere alias per nomi canonici più complessi tramite i record CNAME; il mail server aliasing, che indirizza la posta verso il server corretto tramite i record MX; e la load distribution, che associa più indirizzi IP a un singolo nome ruotandone l'ordine per distribuire il carico. La gestione di una VPN è invece una tecnologia di tunneling e cifratura gestita da gateway e protocolli dedicati come IPsec, del tutto estranea al DNS.",
    whyOthersAreWrong: {
      "Load distribution":
        "È un servizio reale del DNS: più indirizzi IP associati a un nome vengono restituiti in ordine variabile per bilanciare il carico.",
      "Mail server caching":
        "Fa riferimento alla gestione dei server di posta tramite record MX, che è effettivamente un servizio del DNS.",
      "Host aliasing":
        "È un servizio reale del DNS, realizzato tramite i record CNAME.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Servizi aggiuntivi offerti dal DNS oltre alla risoluzione dei nomi.",
      "Alias di host, alias di mail server e distribuzione del carico; la VPN non c'entra.",
      "Il DNS traduce e smista nomi: se il servizio riguarda cifratura o tunnel, non è suo.",
      "Quale resource record permette di realizzare l'host aliasing?",
    ),
  },
  {
    id: "hist-174",
    category: "Internet",
    topic: "Wi-Fi e reti mobili",
    difficulty: "media",
    question:
      "Cosa è possibile usare per risolvere il problema del terminale nascosto?",
    options: [
      "Ridurre la potenza del segnale",
      "Forzare l'uso di RTS/CTS",
      "Non è possibile risolvere il problema",
      "Cambiare i canali di trasmissione degli access point",
    ],
    correctAnswer:
      "Forzare l'uso di RTS/CTS",
    explanation:
      "Il problema nasce quando due nodi non si sentono a vicenda pur vedendo entrambi lo stesso access point: se trasmettono insieme i segnali collidono. Forzando l'handshake RTS/CTS, quando un nodo vuole trasmettere invia un RTS e l'access point risponde con un CTS; poiché anche il nodo nascosto è nel raggio dell'access point, sente il CTS e capisce di dover restare in silenzio, evitando la collisione.",
    whyOthersAreWrong: {
      "Ridurre la potenza del segnale":
        "Ridurre la potenza aggraverebbe il problema, rendendo ancora meno probabile che i due nodi si sentano a vicenda.",
      "Non è possibile risolvere il problema":
        "Il problema ha una soluzione standard prevista proprio dal protocollo 802.11.",
      "Cambiare i canali di trasmissione degli access point":
        "Il cambio di canale mitiga le interferenze tra reti diverse, ma non risolve la mancata visibilità tra nodi della stessa rete.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Terminale nascosto e ruolo della prenotazione del canale.",
      "Il CTS dell'access point raggiunge anche chi non sente il mittente, silenziandolo.",
      "Se due non si sentono tra loro, deve parlare qualcuno che sentono entrambi.",
      "Qual è il nome del meccanismo previsto da 802.11 per i terminali nascosti?",
    ),
  },
  {
    id: "hist-175",
    category: "Internet",
    topic: "porte e socket",
    difficulty: "media",
    question:
      "Quali informazioni usa un processo in esecuzione su un host per identificare un processo in un altro host?",
    options: [
      "Porta destinazione, porta sorgente",
      "Indirizzo sorgente, porta sorgente",
      "Indirizzo destinazione, porta destinazione, indirizzo sorgente, porta sorgente",
      "Indirizzo destinazione, porta destinazione",
    ],
    correctAnswer:
      "Indirizzo destinazione, porta destinazione",
    explanation:
      "L'indirizzo IP è come l'indirizzo civico di un palazzo e identifica la macchina, mentre la porta è come il numero dell'interno e identifica il processo che vi è in esecuzione. Per indicare a quale processo remoto ci si vuole rivolgere bastano quindi indirizzo e porta di destinazione. La quadrupla completa identifica invece univocamente una connessione TCP già stabilita, che è un concetto diverso.",
    whyOthersAreWrong: {
      "Porta destinazione, porta sorgente":
        "Senza l'indirizzo IP non si saprebbe nemmeno su quale host si trova il processo da raggiungere.",
      "Indirizzo sorgente, porta sorgente":
        "Questi identificano il processo mittente, non quello destinatario che si vuole contattare.",
      "Indirizzo destinazione, porta destinazione, indirizzo sorgente, porta sorgente":
        "La quadrupla identifica una connessione TCP stabilita, mentre per individuare il processo remoto bastano i due parametri di destinazione.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Identificazione di un processo remoto contro identificazione di una connessione.",
      "Per raggiungere un processo servono IP e porta di destinazione.",
      "Palazzo più interno: l'IP dice dove, la porta dice chi.",
      "Come viene identificata univocamente una socket TCP?",
    ),
  },
  {
    id: "hist-176",
    category: "Internet",
    topic: "livello collegamento",
    difficulty: "facile",
    question:
      "Quale delle seguenti associazioni livello e nome del pacchetto è scorretta?",
    options: [
      "Frame – datalink",
      "Datagram – livello di rete",
      "Segmento – livello di rete",
      "Segmento – livello di trasporto",
    ],
    correctAnswer:
      "Segmento – livello di rete",
    explanation:
      "La nomenclatura standard delle PDU associa il messaggio o i dati al livello applicazione, il segmento al livello di trasporto per TCP, il datagramma o pacchetto al livello di rete, il frame al livello data link e il bit al livello fisico. Associare il segmento al livello di rete è quindi scorretto, perché il segmento appartiene al livello di trasporto.",
    whyOthersAreWrong: {
      "Frame – datalink":
        "È corretta: la PDU del livello di collegamento si chiama frame o trama.",
      "Datagram – livello di rete":
        "È corretta: la PDU del livello di rete si chiama datagramma o pacchetto.",
      "Segmento – livello di trasporto":
        "È corretta: la PDU del livello di trasporto in TCP si chiama segmento.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Nomenclatura delle PDU per ciascun livello dello stack.",
      "Bit, frame, datagramma, segmento e messaggio, dal livello 1 al livello applicativo.",
      "Il segmento è sempre di livello 4: se lo vedi accostato alla rete, è sbagliato.",
      "Quale corrispondenza tra protocollo e PDU è scorretta?",
    ),
  },
  {
    id: "hist-177",
    category: "Internet",
    topic: "forwarding e routing",
    difficulty: "difficile",
    question:
      "L'algoritmo di routing distance vector è?",
    options: [
      "Statico",
      "autodeterminante",
      "Centralizzato",
      "Utilizzato da OSPF",
    ],
    correctAnswer:
      "autodeterminante",
    explanation:
      "Gli algoritmi Distance Vector sono iterativi, asincroni e distribuiti: ogni router riceve informazioni dai vicini, ricalcola la propria tabella e la ridistribuisce, determinando la rotta autonomamente senza alcun controllore centrale. È in questo senso che si può definire autodeterminante.",
    whyOthersAreWrong: {
      "Statico":
        "Il distance vector è dinamico e si adatta automaticamente ai cambiamenti della topologia della rete.",
      "Centralizzato":
        "L'aggettivo centralizzato descrive piuttosto gli algoritmi link state, che lavorano su una visione globale della rete.",
      "Utilizzato da OSPF":
        "OSPF utilizza l'algoritmo link state con Dijkstra, non il distance vector.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Natura distribuita e asincrona degli algoritmi distance vector.",
      "Ogni nodo decide da sé, in modo iterativo e senza coordinamento centrale.",
      "Nessuno comanda dall'alto: ogni router si arrangia con quello che sanno i vicini.",
      "Quale affermazione non è vera per l'algoritmo di routing distance vector?",
    ),
  },
  {
    id: "hist-178",
    category: "Internet",
    topic: "IP, indirizzamento, subnet, CIDR",
    difficulty: "facile",
    question:
      "Quale delle seguenti affermazioni è vera per il protocollo ICMP?",
    options: [
      "ICMP sta per Internet Control Mail Protocol",
      "ICMP non serve per inviare messaggi di eventuali errori di trasmissione",
      "ICMP usa TCP",
      "ICMP fornisce all'host l'informazione su eventuali problemi della rete",
    ],
    correctAnswer:
      "ICMP fornisce all'host l'informazione su eventuali problemi della rete",
    explanation:
      "ICMP è il protocollo di servizio del livello IP: se un router non può inoltrare un pacchetto, usa ICMP per avvisare il mittente del problema, ad esempio con un messaggio Destination Unreachable. È lo strumento con cui la rete comunica agli host le proprie anomalie.",
    whyOthersAreWrong: {
      "ICMP sta per Internet Control Mail Protocol":
        "L'acronimo corretto è Internet Control Message Protocol: non ha alcun rapporto con la posta elettronica.",
      "ICMP non serve per inviare messaggi di eventuali errori di trasmissione":
        "È esattamente l'opposto della sua funzione principale, che è proprio segnalare errori.",
      "ICMP usa TCP":
        "ICMP non usa né TCP né UDP: viaggia direttamente incapsulato nel pacchetto IP, con numero di protocollo 1.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Funzione e incapsulamento del protocollo ICMP.",
      "ICMP segnala problemi di rete e viaggia dentro IP, non sopra TCP o UDP.",
      "La M sta per Message, non per Mail.",
      "A quale livello appartiene il protocollo ICMP?",
    ),
  },
  {
    id: "hist-179",
    category: "Internet",
    topic: "porte e socket",
    difficulty: "media",
    question:
      "Quale parte dell'intestazione del pacchetto TCP permette di identificare univocamente l'applicazione del livello superiore (processo)?",
    options: [
      "Porta sorgente",
      "Porta sorgente e porta destinazione",
      "Porta di destinazione",
      "Il campo Protocol Number",
    ],
    correctAnswer:
      "Porta sorgente e porta destinazione",
    explanation:
      "Le porte a 16 bit sono l'indirizzo del livello di trasporto. La porta di destinazione dice al ricevente a quale servizio consegnare i dati, ad esempio la 80 per un server web, mentre la porta sorgente indica a quale processo inviare la risposta. A differenza di UDP, in TCP il sistema operativo usa entrambe le porte, insieme agli indirizzi IP, per dirigere il segmento alla socket corretta.",
    whyOthersAreWrong: {
      "Porta sorgente":
        "Da sola indica solo il mittente e non basta a individuare il servizio destinatario.",
      "Porta di destinazione":
        "Da sola basterebbe in UDP, ma in TCP il demultiplexing richiede anche la porta sorgente per distinguere connessioni diverse.",
      "Il campo Protocol Number":
        "Il Protocol Number si trova nell'header IP, non in quello TCP, e serve a distinguere TCP da UDP.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Demultiplexing in TCP e ruolo delle due porte.",
      "In TCP servono entrambe le porte, in UDP basta quella di destinazione.",
      "Il server deve poter rispondere: senza porta sorgente non saprebbe a chi.",
      "Quali quattro parametri identificano univocamente una socket TCP?",
    ),
  },
  {
    id: "hist-180",
    category: "Internet",
    topic: "ARP",
    difficulty: "facile",
    question:
      "Indicare la modalità di invio di una ARP request.",
    options: [
      "Anycast",
      "Broadcast",
      "Unicast",
      "Multicast",
    ],
    correctAnswer:
      "Broadcast",
    explanation:
      "Il mittente chiede chi possiede un determinato indirizzo IP e il messaggio viene incapsulato in un frame Ethernet con indirizzo MAC di destinazione FF:FF:FF:FF:FF:FF. In questo modo gli switch inoltrano il frame su tutte le porte e tutti gli host lo ricevono ed elaborano. L'ARP reply è invece unicast, perché l'host che risponde conosce già il MAC del richiedente.",
    whyOthersAreWrong: {
      "Anycast":
        "L'anycast consegna a uno qualsiasi di un gruppo di destinatari e non è previsto per la risoluzione ARP.",
      "Unicast":
        "L'unicast è la modalità della ARP reply, non della request: il mittente non conosce ancora il destinatario.",
      "Multicast":
        "Il multicast consegna a un gruppo specifico, mentre la richiesta ARP deve raggiungere tutti gli host del segmento.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Modalità di invio di request e reply nel protocollo ARP.",
      "Request in broadcast a tutti, reply in unicast al solo richiedente.",
      "Non sai chi cerchi, quindi lo chiedi a tutti; chi risponde invece sa già a chi parlare.",
      "Qual è l'indirizzo di destinazione usato nel frame di una ARP request?",
    ),
  },
  {
    id: "hist-181",
    category: "Internet",
    topic: "affidabilità TCP",
    difficulty: "facile",
    question:
      "Indicare l'ordine corretto dei flag relativo al Three-way Handshake.",
    options: [
      "SYN → ACK → FIN",
      "SYN → ACK → SYN → ACK",
      "SYN → SYN/ACK → ACK",
      "FIN → FIN/ACK → ACK",
    ],
    correctAnswer:
      "SYN → SYN/ACK → ACK",
    explanation:
      "La connessione avviene in tre passi. Il client invia un segmento con il flag SYN per chiedere l'apertura e proporre il proprio numero di sequenza iniziale. Il server risponde con un segmento che ha attivi entrambi i flag SYN e ACK, per sincronizzarsi a sua volta e confermare la ricezione. Infine il client invia un ACK per confermare il SYN del server: da quel momento la connessione è stabilita.",
    whyOthersAreWrong: {
      "SYN → ACK → FIN":
        "Il flag FIN appartiene alla procedura di chiusura, non a quella di apertura della connessione.",
      "SYN → ACK → SYN → ACK":
        "Descrive quattro passi separati, mentre nel three-way handshake il server unisce SYN e ACK in un unico segmento.",
      "FIN → FIN/ACK → ACK":
        "Questa è la procedura di chiusura basata sul flag FIN, non l'apertura della connessione.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Sequenza di flag nell'apertura di una connessione TCP.",
      "SYN, poi SYN/ACK, poi ACK: tre segmenti e la connessione è stabilita.",
      "Si chiama three-way proprio perché i passi sono tre, non quattro.",
      "Quale flag TCP è richiesto in condizioni normali per chiudere una connessione?",
    ),
  },
  {
    id: "hist-182",
    category: "Internet",
    topic: "sliding window",
    difficulty: "media",
    question:
      "Nello studio dei protocolli che permettono di implementare una trasmissione affidabile (nel testo rdt) perché viene inserito il timer?",
    options: [
      "Per gestire la perdita di un segmento",
      "Per gestire i segmenti duplicati",
      "Per gestire l'efficienza di trasmissione",
      "Per gestire gli errori di trasmissione rilevabili con l'Internet checksum",
    ],
    correctAnswer:
      "Per gestire la perdita di un segmento",
    explanation:
      "Meccanismi come checksum, ACK e numeri di sequenza gestiscono bene errori di bit e duplicati, ma non possono fare nulla se il pacchetto non arriva affatto. Il timer è l'unico meccanismo che permette al mittente di concludere che è passato troppo tempo senza ricevere l'ACK, quindi il pacchetto si è probabilmente perso, e di rinviarlo.",
    whyOthersAreWrong: {
      "Per gestire i segmenti duplicati":
        "I duplicati sono gestiti dai numeri di sequenza, che permettono al ricevitore di riconoscere e scartare le copie.",
      "Per gestire l'efficienza di trasmissione":
        "L'efficienza si ottiene con il pipelining e le finestre scorrevoli, non con il timer, che anzi introduce attesa.",
      "Per gestire gli errori di trasmissione rilevabili con l'Internet checksum":
        "Gli errori sui bit sono già rilevati dal checksum: il timer serve per un problema diverso, l'assenza totale del pacchetto.",
    },
    source: "risposte_simulatore_internet.pdf",
    studyGuide: guide(
      "Ruolo del timer nella gestione della perdita di pacchetti.",
      "Checksum per gli errori, sequenze per i duplicati, timer per le perdite.",
      "Se il pacchetto non arriva non c'è niente da controllare: serve qualcuno che conti il tempo.",
      "Quale evento provoca la ritrasmissione nella macchina a stati di RDT 3.0 lato sender?",
    ),
  },
];

export const historicalQuestions: Question[] = historicalSeeds.map((seed) =>
  applyQuestionAudit(seed),
);
