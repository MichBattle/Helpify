Helpify
=======

Helpify è un'applicazione web che permette agli utenti di interagire con il proprio account Spotify attraverso un sistema di autenticazione OAuth2. Offre una serie di funzionalità avanzate per migliorare l'esperienza di ascolto, tra cui la creazione di playlist personalizzate, visualizzazione di statistiche dettagliate, confronto tra artisti e brani, gestione avanzata delle playlist e una speciale funzione "Time Capsule".

Caratteristiche
---------------

### 1\. Login con Spotify tramite OAuth2

Autentica gli utenti in modo sicuro utilizzando il sistema OAuth2 di Spotify, garantendo l'accesso alle funzionalità personalizzate senza compromettere la sicurezza dei dati.

### 2\. Playlist Personalizzate

Genera playlist su misura in base a diversi criteri:

-   **Mood:** Seleziona uno stato d'animo tra felice, triste, energetico o calmo. L'algoritmo determina il mood delle canzoni analizzando tonalità, valence, energia, danceability, acousticness, liveness e loudness.
-   **Meteo:** Crea playlist in base alle condizioni meteorologiche attuali utilizzando l'API OpenWeather.
-   **Consigliata:** Suggerisce canzoni degli autori tra i top 10 artisti dell'utente.

### 3\. Statistiche

Visualizza le statistiche di ascolto personalizzate:

-   **Top 10 Brani**
-   **Top 10 Artisti**
-   **Top 5 Generi**

Gli utenti possono selezionare il periodo di analisi tra 4 settimane, 6 mesi e sempre.

### 4\. Confronto

Permette di confrontare fino a 3 artisti o brani tramite grafici a barre:

-   **Artisti:** Confronta la popolarità o il numero di follower.
-   **Brani:** Confronta parametri come danceability, valence, energia, acousticness, liveness e loudness.

### 5\. Gestione Playlist

Gestisce tutte le playlist dell'account:

-   Visualizza tutte le playlist e i brani che contengono.
-   Per le playlist modificabili sarà possibile rimuovere i brani duplicati.

### 6\. Time Capsule

Genera una playlist speciale contenente le 30 canzoni più ascoltate dall'utente nelle ultime 4 settimane.

API Utilizzate
--------------

-   **Spotify Web API:** Per accedere ai dati dell'utente, creare e gestire playlist, ottenere informazioni su brani e artisti.
-   **OpenWeather API:** Per ottenere le condizioni meteorologiche attuali e generare playlist basate sul meteo.
