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
];

export const historicalQuestions: Question[] = historicalSeeds.map((seed) =>
  applyQuestionAudit(seed),
);
