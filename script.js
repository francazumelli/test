class Artista {
    constructor(id, nome, descrizione, genere, foto, curiosita) {
        this.nome = nome;
        this.id = id;
        this.descrizione = descrizione;
        this.genere = genere;
        this.foto = foto;
        this.curiosita = curiosita

    }
}
class Concerto {
    constructor(id, idArtista, localita, via, nCivico, data, ora, nBiglietti, prezzo, colore, barcode) {
        this.id = id;
        this.idArtista = idArtista;
        this.localita = localita;
        this.via = via;
        this.nCivico = nCivico;
        this.data = data;
        this.ora = ora;
        this.nBiglietti = nBiglietti;
        this.prezzo = prezzo;
        this.colore = colore;
        this.barcode = barcode;
    }
}

class Utente {
    constructor(id, nome, cognome, dataNascita, email, password, foto) {
        this.id = id;
        this.nome = nome;
        this.cognome = cognome;
        this.dataNascita = dataNascita;
        this.email = email;
        this.password = password;
        this.foto = foto;
    }
}

class Ordine {
    constructor(id, data, nTransazione, idConcerto, idUtente) {
        this.id = id;
        this.data = data;
        this.nTransazione = nTransazione;
        this.idConcerto = idConcerto;
        this.idUtente = idUtente;
    }
}
// Funzione per leggere il file JSON
function leggiFileJSON() {
    return new Promise((resolve, reject) => {
        let percorsoFile = 'db.json';

        fetch(percorsoFile)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Errore nella richiesta al server.');
                }
                return response.json();
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}
leggiFileJSON()
    .then(dati => {
        elaboraDati(dati);
    })
    .catch(error => {
        console.error('Errore durante la lettura del file:', error);
    });


let artisti = [];
let concerti = [];
let utenti = [];
let ordini = [];
let regioni = [];
var loginSession = false;
var paymentValid = false;
var userId = "";
let colorIndex = 0;
var isBirthdateValid = true;
// Funzione per elaborare i dati letti dal file JSON
function elaboraDati(dati) {


    //inserimento dati negli array
    artisti = dati.artisti.map(artisti => new Artista(artisti.id, artisti.nome, artisti.descrizione, artisti.genere, artisti.foto, artisti.curiosita));
    concerti = dati.concerti.map(concerto => new Concerto(concerto.id, concerto.idArtista, concerto.localita, concerto.via, concerto.nCivico, concerto.data, concerto.ora, concerto.nBiglietti, concerto.prezzo, concerto.colore, concerto.barcode));
    concerti = shuffle(concerti);
    utenti = dati.utenti.map(utente => new Utente(utente.id, utente.nome, utente.cognome, utente.dataNascita, utente.email, utente.password, utente.foto));
    ordini = dati.ordini.map(ordine => new Ordine(ordine.id, ordine.data, ordine.nTransazione, ordine.idConcerto, ordine.idUtente));
    dati.regioni.forEach(regione => {
        regioni.push(regione);
    });

    // Utilizza gli array in un'altra funzione
    main(artisti, concerti, utenti, ordini, regioni);
    /* printHomePage(artisti, concerti);
    printFilters(artisti, regioni); */



}
let colors = ['rgba(187, 134, 252, 1)', 'rgba(3, 218, 198, 1)', 'rgba(244, 212, 124, 1)',
    'rgba(255, 104, 104, 1)', 'rgba(152, 33, 118, 1)', 'rgba(255, 120, 240, 1)', 'rgba(36, 120, 129, 1)',
    'rgba(100, 223, 223, 1)', 'rgba(217, 237, 146, 1)', 'rgba(52, 160, 164, 1)', 'rgba(224, 30, 55, 1)',
    'rgba(22, 138, 173, 1)', 'rgba(255, 255, 63, 1)'
];



function main(artisti, concerti, utenti, ordini, regioni) {
    printHomePage(artisti, concerti);
    printFilters(artisti, regioni);
}
function printHomePage(artisti, concerti, isFiltered = false) {
    //CONTROLLA SE ESISTE LA SEZIONE ALTRIMENTI LA CREA
    let homePageSection = document.getElementById("homePageSection");
    if (!homePageSection) {
        homePageSection = document.createElement("section");
        homePageSection.setAttribute("id", "homePageSection");
        document.body.appendChild(homePageSection);
    } else {
        homePageSection.innerHTML = "";
    }
    enableNavDiv();

    //FILTRA OGNI CONCERTO E TROVA L'ARTISTA CORRISPONDENTE
    concerti.forEach(concerto => {
        let selectedArtist;

        artisti.forEach(artista => {
            if (artista.id === concerto.idArtista) {
                selectedArtist = artista;
            }
        });
        if (isFiltered && !selectedArtist) {
            return;
        }

        // Crea il div del biglietto
        let div = document.createElement("div");
        div.setAttribute("class", "concertDiv");

        let rand = Math.floor(Math.random() * colors.length);
        // Imposta il colore del biglietto
        let ticketColor = concerto.colore;
        div.style.boxShadow = "inset 0 0 40vh 0 " + ticketColor;
        div.setAttribute("data-color", ticketColor);

        // Crea l'elemento span per l'artista
        let span = document.createElement("span");

        // Crea l'immagine dell'artista
        let img = document.createElement("img");
        img.src = "./img/" + selectedArtist.foto;
        img.style.borderRight = "1vh solid " + ticketColor;
        img.style.borderBottom = "1vh solid " + ticketColor;
        span.appendChild(img);

        // Crea il paragrafo per il nome dell'artista
        let name = document.createElement("p");
        name.innerText = selectedArtist.nome; // Utilizza l'artista trovato
        span.appendChild(name);

        // Crea il div per le informazioni sul concerto
        let infoDiv = document.createElement("div");
        let infoDivContainer = document.createElement("div");
        infoDivContainer.setAttribute("class", "infoDivContainer");

        // Crea l'elemento span per l'indirizzo, data e ora
        let address = document.createElement("span");
        address.setAttribute("class", "addressDate");
        address.innerHTML = "<b>" + concerto.localita + "</b><br>" + concerto.via + " " + concerto.nCivico;

        let date = document.createElement("span");
        date.setAttribute("class", "addressDate");
        date.style.fontSize = "5vh";
        date.style.fontWeight = "lighter";
        date.innerText = concerto.data + " - " + concerto.ora;

        let barcode = document.createElement("span");
        barcode.innerText = concerto.barcode;
        barcode.setAttribute("class", "barcode");

        // Crea l'elemento span per il numero dei biglietti
        let nTicket = document.createElement("span");
        nTicket.innerText = "N°: " + concerto.nBiglietti;
        nTicket.setAttribute("class", "nTicketSpan");
        nTicket.style.background = "linear-gradient(to top ," + ticketColor + ", white 70%)";
        div.appendChild(nTicket);
        div.appendChild(span);
        infoDiv.appendChild(address);
        infoDiv.appendChild(date);

        concerto.nBiglietti <= 0 ? (div.classList.add("soldOut")) : null

        infoDivContainer.appendChild(infoDiv);
        infoDivContainer.appendChild(barcode);

        let priceSpan = document.createElement("span");
        priceSpan.setAttribute("id", "priceSpan");
        priceSpan.innerText = concerto.prezzo + "€";

        div.appendChild(infoDivContainer);
        div.appendChild(priceSpan);
        div.setAttribute("onclick", "buyNow(" + concerto.id + ")");
        div.setAttribute("onmouseover", "buyHover(this)");
        div.setAttribute("onmouseleave", "buyHoverR(this)");
        homePageSection.appendChild(div);
    });
}
function printFilteredHomePage(artisti, concerti) {

    // Ottenere i valori dei filtri
    let genreValue = document.getElementById("genreSelect").value.toLowerCase();
    let countrySelect = document.getElementById("countrySelect").value.toLowerCase();

    let artistiFilter = Array.from(artisti);
    let concertiFilter = Array.from(concerti);

    // Applicare i filtri solo se sono selezionati filtri validi
    if (genreValue !== "nofilter") {
        artistiFilter = artisti.filter(artista => artista.genere.toLowerCase() === genreValue);
        console.log("filtro");
    }

    if (countrySelect !== "nofilter") {
        // Filtra i concerti in base alla località selezionata
        concertiFilter = concertiFilter.filter(concerto => concerto.localita.toLowerCase() === countrySelect);
    }

    let orderBySelect = document.getElementById("orderBySelect");
    let fromPriceInput = document.getElementById("fromPrice");
    let toPriceInput = document.getElementById("toPrice");
    let searchBarInput = document.getElementById("searchBar");

    switch (orderBySelect ? orderBySelect.value : "") {
        case "latest":
            concertiFilter = sortByDate(concertiFilter);
            break;
        case "oldest":
            concertiFilter = sortByDate(concertiFilter);
            concertiFilter = concertiFilter.reverse();
            break;
        case "lessRelevant":
            concertiFilter = sortByNumberOfTickets(concertiFilter);
            concertiFilter = concertiFilter.reverse();
            break;
        case "mostRelevant":
            concertiFilter = sortByNumberOfTickets(concertiFilter);
            break;
        case "ascPrice":
            concertiFilter = sortByPrice(concertiFilter);
            break;
        case "descPrice":
            concertiFilter = sortByPrice(concertiFilter);
            concertiFilter = concertiFilter.reverse();
            break;
        default:
            break;
    }

    if (fromPriceInput && toPriceInput && parseInt(fromPriceInput.value) >= 0 && parseInt(toPriceInput.value) >= 0) {
        concertiFilter = fromPriceToPrice(concertiFilter);
    }

    printHomePage(artistiFilter, concertiFilter, true);

}
function buyHover(div) {
    div.childNodes.forEach(element => {
        element.id !== "priceSpan" ? (element.style.opacity = "0.5") : null;
    });
}
function buyHoverR(div) {
    div.childNodes.forEach(element => {
        element.style.opacity = "1";
    });
}
function populateSelects(id, array, attribute) {
    let select = document.getElementById(id);
    let addedValues = [];
    let value = "";
    select.innerHTML = "";
    let defOption = document.createElement("option");
    defOption.setAttribute("value", "noFilter");
    defOption.innerText = "---";
    select.appendChild(defOption);
    for (let i = 0; i < array.length; i++) {
        if (attribute) {
            value = array[i][attribute];
        } else {
            value = array[i];
        }

        if (!addedValues.includes(value)) { // controllo doppioni
            let option = document.createElement("option");
            option.value = value;
            option.innerText = value.toUpperCase();
            select.appendChild(option);
            addedValues.push(value);
        }
    }
}
function printFilters(artisti, regioni) {
    populateSelects("genreSelect", artisti, "genere");
    populateSelects("countrySelect", regioni, null);
}
function buyNow(idConcerto) {
    if (!loginSession) {
        login();
        return;
    }
    let homePageSection = document.getElementById("homePageSection");
    document.body.removeChild(homePageSection);

    let container = document.createElement("section");
    container.setAttribute("class", "sectionConcertContainer");
    container.setAttribute("id", "sectionConcertContainer");
    disableNavDiv()

    // Trova il concerto corrispondente all'idConcerto
    let selectedConcert = concerti.find(concerto => concerto.id === idConcerto);
    if (selectedConcert) {
        let selectedArtist = artisti.find(artista => selectedConcert.idArtista === artista.id);

        let div = document.createElement("div");
        let img = document.createElement("img");
        let buyBtn = document.createElement("button");
        buyBtn.innerText = "ACQUISTA";
        buyBtn.setAttribute("onclick", "paymentPage(" + idConcerto + ")");

        img.src = "./img/" + selectedArtist.foto;

        let title = document.createElement("h2");
        title.innerText = "Compra ORA";
        container.appendChild(title);

        let info = document.createElement("p");
        info.innerHTML = "<span>Località: </span>" + selectedConcert.localita
            + "<br><span>Data: </span>" + selectedConcert.data + "<br><span>Ora: </span>" + selectedConcert.ora
            + "<br><span>Indirizzo: </span>" + selectedConcert.via + " - " + selectedConcert.nCivico
            + "<br><span>Biglietti disponibili: </span>" + selectedConcert.nBiglietti;


        div.appendChild(img);
        div.appendChild(buyBtn);
        container.appendChild(div);
        container.appendChild(info);

        let backBtn = document.createElement("span");
        backBtn.setAttribute("onclick", "goBack()");
        backBtn.innerText = "<-- GO BACK";
        container.appendChild(backBtn);

        // Aggiungi ulteriori dettagli se necessario
    } else {
        // Gestisci il caso in cui il concerto non sia stato trovato
        let error = document.createElement("p");
        error.innerText = "Concerto non trovato";
        container.appendChild(error);
    }
    console.log("!!!!");
    // Aggiungi il container alla pagina
    document.body.appendChild(container);
}
function orderByFilter(select) {
    let orderDiv = select.parentNode;

    // Verifica se è selezionato "noFilter"
    if (select.value.toLowerCase() == "nofilter") {
        // Rimuove la select e gli input dei prezzi se presenti
        if (document.getElementById("orderBySelect")) {
            orderDiv.removeChild(document.getElementById("orderBySelect"));
        }
        if (document.getElementById("spanContainerPrice")) {
            orderDiv.removeChild(document.getElementById("spanContainerPrice"));
        }
    } else {
        let newSelect;
        let spanContainer = document.createElement("span");
        spanContainer.setAttribute("id", "spanContainerPrice");

        if (!document.getElementById("orderBySelect")) {
            // Altrimenti, crea la select e gli input dei prezzi
            newSelect = document.createElement("select");
            newSelect.setAttribute("id", "orderBySelect");
            newSelect.setAttribute("onchange", "printFilteredHomePage(artisti,concerti)");
            let firstOption = document.createElement("option");
            firstOption.setAttribute("id", "firstOption");
            let disabledOption = document.createElement("option");
            disabledOption.innerText = "---";
            disabledOption.setAttribute("selected", "selected");
            disabledOption.setAttribute("disabled", "disabled");
            let secondOption = document.createElement("option");
            secondOption.setAttribute("id", "secondOption");
            newSelect.appendChild(disabledOption);
            newSelect.appendChild(firstOption);
            newSelect.appendChild(secondOption);
            orderDiv.appendChild(newSelect);
        } else {
            newSelect = document.getElementById("orderBySelect");
        }
        let opt1 = document.getElementById("firstOption");
        let opt2 = document.getElementById("secondOption");


        // Modifica il valore delle opzioni in base alla selezione
        if (select.value == "data") {
            opt1.innerText = "PIÙ RECENTE";
            opt1.value = "latest";
            opt2.innerText = "MENO RECENTE";
            opt2.value = "oldest";
        } else if (select.value == "rilevanza") {
            opt1.innerText = "PIÙ RILEVANTE";
            opt1.value = "mostRelevant";
            opt2.innerText = "MENO RILEVANTE";
            opt2.value = "lessRelevant";
        } else if (select.value == "prezzo") {
            opt1.innerText = "CRESCENTE";
            opt1.value = "ascPrice";
            opt2.innerText = "DECRESCENTE";
            opt2.value = "descPrice";
            // Aggiunge 2 input per il prezzo custom
            if (!document.getElementById("fromPrice") && !document.getElementById("toPrice")) {
                let fromPrice = document.createElement("input");
                fromPrice.setAttribute("id", "fromPrice");
                fromPrice.placeholder = "Da";
                fromPrice.setAttribute("oninput", "checkPrice(this)");
                fromPrice.setAttribute("onchange", "checkPriceProprierty()");
                fromPrice.setAttribute("type", "number");
                let toPrice = document.createElement("input");
                toPrice.setAttribute("id", "toPrice");
                toPrice.placeholder = "A";
                toPrice.setAttribute("oninput", "checkPrice(this)");
                toPrice.setAttribute("onchange", "checkPriceProprierty()");
                toPrice.setAttribute("type", "number");
                spanContainer.appendChild(fromPrice);
                spanContainer.appendChild(toPrice);
                orderDiv.appendChild(spanContainer);
            }
        }
    }
}
// funzione che controlla se e' un numero
var isNumber = function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
}

function searchBar(input, artisti, concerti) {
    let searchTerm = input.value.toLowerCase().trim();
    let filteredArtists = artisti.filter(artista => artista.nome.toLowerCase().includes(searchTerm));
    let filteredConcerts = concerti.filter(concerto =>
        concerto.data.includes(searchTerm) || concerto.via.toLowerCase().includes(searchTerm)
    );

    printHomePage(filteredArtists, filteredConcerts);
}


function login() {
    if (!loginSession) {
        disableNavDiv();
        let homepage = document.getElementById("homePageSection");

        if (homepage) document.body.removeChild(homepage);

        let navDiv = document.getElementById("navDiv");
        navDiv.style.display = "none";

        let sectionContainer = document.createElement("section");
        sectionContainer.setAttribute("id", "sectionContainer");
        let loginDiv = document.createElement("div");
        let signupDiv = document.createElement("div");
        let title = document.createElement("h1");
        let title2 = document.createElement("h1");
        title.innerText = "LOGIN";
        loginDiv.appendChild(title);
        title2.innerText = "SIGN-UP";

        signupDiv.appendChild(title2);

        //registrazione
        formS = document.createElement("form");
        formS.setAttribute("method", "post");
        let emailInputS = document.createElement("input");
        emailInputS.setAttribute("type", "email");
        emailInputS.setAttribute("id", "emailInputS");
        emailInputS.setAttribute("name", "email");
        emailInputS.placeholder = "Email"
        emailInputS.required = "required";
        emailInputS.autocomplete = "email";

        let passwordInputS = document.createElement("input");
        passwordInputS.setAttribute("type", "password");
        passwordInputS.setAttribute("id", "passwordInputS");
        passwordInputS.setAttribute("min", "8");
        passwordInputS.setAttribute("name", "password");
        passwordInputS.placeholder = "Password";
        passwordInputS.required = "required";

        let passwordInputS2 = document.createElement("input");
        passwordInputS2.setAttribute("type", "password");
        passwordInputS2.setAttribute("id", "passwordInputS2");
        passwordInputS2.placeholder = "Ripeti la password";
        passwordInputS2.required = "required";

        let signupBtn = document.createElement("button");
        signupBtn.setAttribute("onclick", "signUp()");
        signupBtn.innerText = "REGISTRATI";
        signupBtn.type = "button";

        let output = document.createElement("p");
        output.setAttribute("id", "outputSignUp");

        let nameInputS = document.createElement("input");
        nameInputS.setAttribute("id", "nameInputS");
        nameInputS.placeholder = "Nome";
        nameInputS.required = "required";
        nameInputS.autocomplete = "given-name";

        let surnameInputS = document.createElement("input");
        surnameInputS.setAttribute("id", "surnameInputS");
        surnameInputS.placeholder = "Cognome";
        surnameInputS.required = "required";
        surnameInputS.autocomplete = "family-name";

        let nameSpan = document.createElement("span");

        let birthdate = document.createElement("input");
        birthdate.setAttribute("id", "birthdateInputS");
        birthdate.setAttribute("type", "date");
        birthdate.required = "required";
        birthdate.setAttribute("onchange", "checkBirthdate(this, 'outputSignUp')");
        birthdate.autocomplete = "bday";


        nameSpan.appendChild(nameInputS);
        nameSpan.appendChild(surnameInputS);
        formS.appendChild(nameSpan);
        formS.appendChild(birthdate);
        formS.appendChild(emailInputS);
        formS.appendChild(passwordInputS);
        formS.appendChild(passwordInputS2);
        formS.appendChild(signupBtn);
        signupDiv.appendChild(formS);
        signupDiv.appendChild(output);

        // login
        let form = document.createElement("form");
        let emailInputL = document.createElement("input");
        emailInputL.setAttribute("type", "email");
        emailInputL.setAttribute("id", "emailInputL");
        emailInputL.placeholder = "Email";
        emailInputL.autocomplete = "email";

        let passwordInputL = document.createElement("input");
        passwordInputL.placeholder = "Password";
        passwordInputL.setAttribute("type", "password");
        passwordInputL.setAttribute("id", "passwordInputL");
        passwordInputL.autocomplete = "current-password";

        let loginBtn = document.createElement("button");
        loginBtn.innerText = "ACCEDI";
        loginBtn.setAttribute("onclick", "checkCredentials()");
        loginBtn.type = "button";
        console.log(loginBtn.type);
        let output2 = document.createElement("p");
        output2.setAttribute("id", "outputLogin");

        form.appendChild(emailInputL);
        form.appendChild(passwordInputL);
        form.appendChild(loginBtn);
        loginDiv.appendChild(form);
        loginDiv.appendChild(output2);

        sectionContainer.appendChild(loginDiv);
        sectionContainer.appendChild(signupDiv);
        document.body.appendChild(sectionContainer);
    }

}

function checkCredentials() {
    let email = document.getElementById("emailInputL").value.toLowerCase().trim();
    let password = document.getElementById("passwordInputL").value.trim();
    let output;
    let foundUser;
    utenti.forEach(utente => { utente.email.toLowerCase().trim() === email && utente.password === password ? (foundUser = utente) : null })

    if (!foundUser) {
        output = document.getElementById("outputLogin");
        output.innerText = "CREDENZIALI NON VALIDE";
    } else {
        output = document.getElementById("outputLogin");
        console.log("Accesso riuscito per l 'utente:", foundUser);
        loginSession = true;
        userId = foundUser.id;
        let section = document.getElementById("sectionContainer");
        document.body.removeChild(section);
        printHomePage(artisti, concerti);
        document.getElementById("navDiv").style.display = "block";
    }
}
function signUp() {
    let email = document.getElementById("emailInputS").value.toLowerCase().trim();
    let password = document.getElementById("passwordInputS").value.trim();
    let password2 = document.getElementById("passwordInputS2").value.trim();
    let nome = document.getElementById("nameInputS").value;
    let cognome = document.getElementById("surnameInputS").value;
    let birthdate = document.getElementById("birthdateInputS").value;
    let output = document.getElementById("outputSignUp");

    if (nome.length <= 0 || cognome.length <= 0) {
        output.innerText = "COMPILA TUTTI I CAMPI";
        return;
    }
    if (!isBirthdateValid) {
        output.innerText = "CONTROLLA LA DATA DI NASCITA"; return;
    }
    if (!isEmailValid(email)) {
        output.innerText = "EMAIL NON VALIDA";
        return;
    }

    if (email.length < 8 || password.length < 8) {
        output.innerText = "L'email e la password devono contenere almeno 8 caratteri.";
    } else if (password !== password2) {
        output.innerText = "Le password non corrispondono.";
    } else {
        // Tutte le condizioni sono soddisfatte, procedere con la registrazione
        output.innerText = "";
        let nuovoUtente = new Utente(utenti.length + 1, nome, cognome, birthdate, email, password, "default.png");
        salvaFileJSON(nuovoUtente);
        utenti.push(nuovoUtente);
        userId = utenti.length;
        console.log(userId);
        loginSession = true;
        let sectionContainer = document.getElementById("sectionContainer");
        output.innerText = "REGISTRATO CORRETTAMENTE, ORA PUOI EFFETTUARE IL LOGIN";
        document.body.removeChild(sectionContainer);
        let navDiv = document.getElementById("navDiv");
        navDiv.style.display = "block";
        printHomePage(artisti, concerti);
    }
}


function salvaFileJSON(utente) {
    let utenteJSON = JSON.stringify(utente);
    let output = document.getElementById("outputSignUp");
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "data_save.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("Dati aggiunti con successo al file JSON.");
                //loginSession = true;
                output.innerText = "REGISTRATO CORRETTAMENTE, VAI AL LOGIN";
            } else {
                console.error("Si è verificato un errore durante l'aggiunta dei dati al file JSON.");
                output.innerText = "Si è verificato un errore durante la registrazione.";
            }
        }
    };
    xhr.send(utenteJSON);
}
function goBack() {
    let sectionConcertContainer = document.getElementById("sectionConcertContainer");
    document.body.removeChild(sectionConcertContainer);
    printHomePage(artisti, concerti);
}
function paymentPage(idConcert) {
    console.log(idConcert);
    let sectionConcertContainer = document.getElementById("sectionConcertContainer");
    sectionConcertContainer.innerHTML = "";
    disableNavDiv();
    let form = document.createElement("form");
    let h1 = document.createElement("h1");
    h1.innerText = "PROCEDI AL PAGAMENTO";

    let paymentDiv = document.createElement("div");
    paymentDiv.setAttribute("id", "paymentDiv");
    let image = document.createElement("img");

    let ccLabel = document.createElement("label");
    ccLabel.innerText = "Numero di carta";
    let ccInput = document.createElement("input");
    ccInput.setAttribute("id", "ccInput");
    ccInput.setAttribute("type", "tel");
    ccInput.setAttribute("inputmode", "numeric");
    ccInput.placeholder = "0000 0000 0000 0000";
    ccInput.inputMode = "numeric";
    ccInput.setAttribute("oninput", "checkCardNumber(this)");
    ccInput.pattern = "[0-9\s]{13,19}";
    ccInput.maxLength = "19";
    ccInput.required = "required";
    ccInput.autocomplete = "cc-number";

    let cvvLabel = document.createElement("label");
    cvvLabel.innerText = "codice di verifica";
    let cvvInput = document.createElement("input");
    cvvInput.placeholder = "CVV";
    cvvInput.maxLength = "3";
    cvvInput.setAttribute("id", "cvvInput");
    cvvInput.setAttribute("oninput", "checkCardNumber(this)");
    cvvInput.required = "required";
    cvvInput.autocomplete = "cc-csc";

    let output = document.createElement("p");
    output.setAttribute("id", "paymentOutput");

    let expDateLabel = document.createElement("label");
    expDateLabel.innerText = "Data di scadenza";
    let expDateInput = document.createElement("input");
    expDateInput.setAttribute("type", "date");
    expDateInput.required = "required";
    expDateInput.autocomplete = "cc-exp";

    let payBtn = document.createElement("button");
    payBtn.setAttribute("id", "payBtn");
    payBtn.innerText = "COMPLETA IL PAGAMENTO";
    payBtn.setAttribute("onclick", "paymentTransition(this,'" + idConcert + "')");
    payBtn.type = "button";
    console.log(payBtn.type);

    image.setAttribute("id", "paymentsImage");
    image.src = "./img/payments_images.png";

    paymentDiv.appendChild(h1);
    form.appendChild(ccLabel);
    form.appendChild(ccInput);
    form.appendChild(cvvLabel);
    form.appendChild(cvvInput);
    form.appendChild(expDateLabel);
    form.appendChild(expDateInput);
    form.appendChild(output);
    expDateInput.setAttribute("onchange", "checkExpDate(this,'paymentOutput')");
    form.appendChild(payBtn);
    paymentDiv.appendChild(form);
    paymentDiv.appendChild(image);
    sectionConcertContainer.appendChild(paymentDiv);
}

function checkCardNumber(input) {
    let output = document.getElementById("paymentOutput");
    let value = input.value.trim().toLowerCase();
    value = value.replace(/\s/g, '');
    if (input.id === "ccInput") {
        if (value.length > 16) {
            output.innerText = "MASSIMO 16 CARATTERI";
            paymentValid = false;
        } else {
            output.innerText = "";
            paymentValid = true;
        }
    } else if (input.id === "cvvInput") {
        if (value.length < 3) {
            output.innerText = "CONTROLLA IL CVV";
            paymentValid = false;
        } else {
            output.innerText = "";
            paymentValid = true;
        }
    }
}
const date = new Date();
function checkExpDate(input, outputId) {
    let output = document.getElementById(outputId);
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth() + 1;
    let currentDay = currentDate.getDate();

    let inputYear = parseInt(input.value.substr(0, 4));
    let inputMonth = parseInt(input.value.substr(5, 2));
    let inputDay = parseInt(input.value.substr(8, 2));

    if (inputYear > currentYear ||
        (inputYear === currentYear && inputMonth > currentMonth) ||
        (inputYear === currentYear && inputMonth === currentMonth && inputDay >= currentDay)) {
        output.innerText = "";
        paymentValid = true; // Imposta lo stato del pagamento su vero se non ci sono errori
    } else {
        output.innerText = "Data di scadenza non valida";
        paymentValid = false; // Imposta lo stato del pagamento su falso se c'è un errore
    }
}
function paymentTransition(button, idConcert) {
    if (paymentValid) {
        let div = button.parentNode;

        // Creazione della barra di transizione
        let progressBarContainer = document.createElement("div");
        progressBarContainer.setAttribute("id", "progressBarContainer");
        progressBarContainer.style.width = "100%";
        progressBarContainer.style.backgroundColor = "#f3f3f3";

        let progressBar = document.createElement("div");
        progressBar.setAttribute("id", "progressBar");
        progressBar.style.width = "0";
        progressBar.style.height = "30px";
        progressBar.style.backgroundColor = "#4caf50";
        progressBar.style.transition = "width 1s";

        progressBarContainer.appendChild(progressBar);
        div.appendChild(progressBarContainer);
        let transitionSpan = document.createElement("span");
        transitionSpan.innerText = "ELABORAZIONE PAGAMENTO";
        div.appendChild(transitionSpan);

        let width = 1;
        let interval = setInterval(function () {
            if (width >= 100) {

                clearInterval(interval);
                transitionSpan.innerText = "PAGAMENTO COMPLETATO!\nVAI ALLA SEZIONE ACCOUNT>ORDINI";
                updateOrders(idConcert, userId);


                setTimeout(() => {
                    div.removeChild(progressBarContainer);
                    div.removeChild(transitionSpan);

                    document.body.removeChild(document.getElementById("sectionConcertContainer"));
                }, 1000);
                printHomePage(artisti, concerti);
            } else {
                width++;
                progressBar.style.width = width + '%';
            }
        }, 30);
    }
}
function showArtists(button) {
    if (document.getElementById("sectionContainer") && document.getElementById("sectionConcertContainer")) return;
    disableSelects();


    if (document.getElementById("homePageSection")) {
        document.body.removeChild(document.getElementById("homePageSection"));
    } else {
        printHomePage(artisti, concerti);
    }

    if (document.getElementById("artistSection")) {
        document.body.removeChild(document.getElementById("artistSection"));
        enableSelects();
    }

    button.style.borderColor = button.style.borderColor != "gray" ? "gray" : "rgb(50,50,50)";

    if (!document.getElementById("homePageSection") && !document.getElementById("artistSection") && !document.getElementById("sectionContainer")) {
        let artistSection = document.createElement("section");
        artistSection.setAttribute("id", "artistSection");
        document.body.appendChild(artistSection);

        artisti.forEach(artist => {
            let artistDiv = document.createElement("div");
            let imgContainer = document.createElement("div");
            let img = document.createElement("img");
            img.src = "./img/" + artist.foto;

            let spanContainer = document.createElement("span");

            let nameLabel = document.createElement("label");
            let nameParag = document.createElement("p");
            nameLabel.innerText = artist.nome;
            nameParag.innerText = "NOME: ";

            let descLabel = document.createElement("label");
            let descParag = document.createElement("p");
            descParag.innerText = "DESCRIZIONE: ";
            descLabel.innerText = artist.descrizione;

            let genreLabel = document.createElement("label");
            let genreParag = document.createElement("p");
            genreParag.innerText = "GENERE: ";
            genreLabel.innerText = artist.genere;

            let infoLabel = document.createElement("label");
            infoLabel.setAttribute("class", "infoLabel");
            let infoParag = document.createElement("p");
            infoParag.innerText = "CURIOSITÀ: ";
            infoLabel.innerText = artist.curiosita;
            infoParag.setAttribute("class", "infoLabel");

            nameParag.appendChild(nameLabel);
            descParag.appendChild(descLabel);
            genreParag.appendChild(genreLabel);

            spanContainer.appendChild(nameParag);
            spanContainer.appendChild(descParag);
            spanContainer.appendChild(genreParag);
            infoLabel.prepend(infoParag);
            spanContainer.appendChild(infoLabel);

            imgContainer.appendChild(img);
            artistDiv.appendChild(imgContainer);
            artistDiv.appendChild(spanContainer);
            artistSection.appendChild(artistDiv);
        })
    }
}

function accountSection(utenti) {
    let accountDiv = document.getElementById("accountDiv");
    if (!loginSession) {
        login();
        return;
    }
    disableNavDiv();
    let accountSection = document.getElementById("accountSection");
    if (!accountSection) {
        accountDiv.style.backgroundColor = "black";
        accountSection = document.createElement("section");
        accountSection.setAttribute("id", "accountSection");
        document.getElementById("homePageSection") ? (document.body.removeChild(document.getElementById("homePageSection"))) : null
        document.getElementById("navDiv").style.display = "none";
        let div = document.createElement("div");

        let h1 = document.createElement("h1");
        h1.innerText = "ACCOUNT";

        let profileImg = document.createElement("img");
        let profileImgDiv = document.createElement("div");
        profileImgDiv.setAttribute("class", "profileImgDiv");

        let name, surname, birthdate, email;
        console.log(utenti);
        utenti.forEach(user => {
            if (user.id == userId) {
                profileImg.src = "./img/" + user.foto;
                name = user.nome;
                surname = user.cognome;
                birthdate = user.dataNascita;
                email = user.email;
                console.log(name, surname, birthdate, email);


            }
        })

        let profileImgInput = document.createElement("input");
        profileImgInput.setAttribute("type", "file");
        profileImgInput.setAttribute("accept", "image/*");
        profileImgInput.setAttribute("onchange", "updateProfileImage(this)");

        let nameInput = document.createElement("input");
        nameInput.value = name;
        nameInput.setAttribute("id", "nameInputAccount");
        nameInput.required = "required";
        nameInput.minLength = "3";

        let surnameInput = document.createElement("input");
        surnameInput.value = surname;
        surnameInput.required = "required";
        surnameInput.setAttribute("id", "surnameInputAccount");
        surnameInput.minLength = "3";



        let birthdateInput = document.createElement("Input");
        birthdateInput.setAttribute("type", "date");
        birthdateInput.setAttribute("readonly", "true");
        birthdateInput.value = birthdate;
        birthdateInput.required = "required";

        let emailInput = document.createElement("input");
        emailInput.value = email;
        emailInput.setAttribute("type", "email");
        emailInput.required = "required";
        emailInput.setAttribute("readonly", "true");


        let output = document.createElement("p");
        output.setAttribute("id", "accountOutput");

        let button = document.createElement("button");
        button.innerText = "MODIFICA";
        button.setAttribute("onclick", "updateAccount()");

        let orderHistoryBtn = document.createElement("button");
        orderHistoryBtn.innerText = "STORICO ORDINI";
        orderHistoryBtn.setAttribute("onclick", "printOrders(userId,artisti,concerti,ordini)");

        div.appendChild(h1);
        profileImgDiv.appendChild(profileImg);
        profileImgDiv.appendChild(profileImgInput);
        div.appendChild(profileImgDiv);
        div.appendChild(nameInput);
        div.appendChild(surnameInput);
        div.appendChild(birthdateInput);
        div.appendChild(emailInput);
        div.appendChild(button);
        div.appendChild(output);
        accountSection.appendChild(div);
        document.body.appendChild(output);
        accountSection.appendChild(orderHistoryBtn);
        document.body.appendChild(accountSection);


    } else {
        accountDiv.style.backgroundColor = "rgb(53,53,53)"
        accountSection.parentNode.removeChild(accountSection);
        printHomePage(artisti, concerti);

    }
}

function updateProfileImage(input) {
    const file = input.files[0];
    let fileName = file.name;
    utenti.forEach(user => {
        user.id == userId ? (user.foto = fileName) : null
        updateProfileImageJSON(user, input);

        loadingTransition();
    })

}
function updateProfileImageJSON(user, input) {
    // Crea un oggetto FormData per inviare i dati con l'immagine
    const formData = new FormData();
    formData.append('id', user.id);
    formData.append('nome', user.nome);
    formData.append('cognome', user.cognome);
    formData.append('foto', input.files[0]);

    // Invia una richiesta POST al server per aggiornare l'immagine del profilo
    fetch('update_profile_image.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Messaggio di conferma o eventuale errore dal server
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function loadingTransition() {
    // Crea un elemento div per il cerchio di caricamento
    const loader = document.createElement('div');
    loader.classList.add('loader');

    // Aggiungi stili per posizionare il cerchio di caricamento al centro della pagina
    loader.style.position = 'absolute';
    loader.style.top = '50%';
    loader.style.left = '48.5%';
    loader.style.zIndex = '9999';

    // Aggiungi il cerchio di caricamento alla pagina
    document.body.appendChild(loader);

    // Rimuovi il cerchio di caricamento dopo 2 secondi
    setTimeout(() => {
        document.body.removeChild(loader);
        accountSection(utenti);

    }, 2000);
}


function updateAccount() {
    // Ottieni i nuovi valori dai campi di input
    let newName = document.getElementById("nameInputAccount").value.trim();
    let newSurname = document.getElementById("surnameInputAccount").value.trim();
    // Cerca l'utente corrispondente nell'array degli utenti e aggiorna le informazioni
    utenti.forEach(user => {
        if (user.id === userId) {
            user.nome = newName;
            user.cognome = newSurname;
            updateAccountJSON(user);
            console.log(newName, newSurname);
        }
    });

    // Aggiorna l'interfaccia utente con le informazioni aggiornate 
    console.log("updated");

}

function updateOrders(idConcert, userId) {
    let currentDate = new Date();
    let formattedDate = currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getDate();

    let newTransactionNumber = parseInt(ordini.length) + 1;

    let newOrder = {
        id: ordini.length + 1,
        data: formattedDate,
        nTransazione: newTransactionNumber.toString().padStart(8, '0'),
        idConcerto: idConcert,
        idUtente: userId
    };
    ordini.push(newOrder);
    ticketUpdate(idConcert);
    concerti.forEach(concert => {
        concert.id == idConcert ? (concert.nBiglietti--) : null
    })
    salvaOrdineJSON(newOrder);
}
function updateAccountJSON(user) {
    // Invia una richiesta POST al server per aggiornare i dati dell'utente nel file JSON
    fetch('update_user.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Messaggio di conferma o eventuale errore dal server
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function salvaOrdineJSON(ordine) {
    let ordineJSON = JSON.stringify(ordine);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "order_save.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("Ordine aggiunto con successo al database.");
            } else {
                console.error("Si è verificato un errore durante l'aggiunta dell'ordine al database.");
            }
        }
    };
    xhr.send(ordineJSON);
}



//decrementare numero biglietti concerti 
// SEZIONE ACCOUNT (aggiungere storico ordini)
// FILTRO RICERCA






leggiFileJSON()
    .then(elaboraDati)
    .catch(error => {
        console.error('Errore durante la lettura del file:', error);
    });

function joinArray(array, toFind, attribute) {
    for (let i = 0; i < array.length; i++) {
        if (array[i][attribute] == toFind) {
            return array[i];
        }
    }
}


function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}

function checkPriceProprierty() {
    if (parseInt(document.getElementById("toPrice").value) < parseInt(document.getElementById("fromPrice").value)) {
        document.getElementById("fromPrice").value = parseInt(document.getElementById("toPrice").value) - 1;
        if (parseInt(document.getElementById("fromPrice").value) < 0) document.getElementById("fromPrice").value = 0;
    }
}
function checkPrice(input) {
    if (!isNumber(parseInt(input.value))) input.value = "";
    if (parseInt(input.value) < 0) input.value = "";
    printFilteredHomePage(artisti, concerti);
}
function sortByDate(array) {
    return array.sort((a, b) => {
        // Ordina le date come stringhe direttamente
        return a.data.localeCompare(b.data);
    });
}
function sortByNumberOfTickets(concertiFilter) {
    return concertiFilter.sort((a, b) => {
        return a.nBiglietti - b.nBiglietti;
    });
}
function sortByPrice(concertiFilter) {

    return concertiFilter.sort((a, b) => {
        return a.prezzo - b.prezzo;
    });

}
function fromPriceToPrice(concertiFilter) {
    let from = parseFloat(document.getElementById("fromPrice").value);
    let to = parseFloat(document.getElementById("toPrice").value);

    if (from >= 0 && to > 0 && from != null && to != null) {
        concertiFilter = concertiFilter.filter(concerto => {
            let prezzo = parseFloat(concerto.prezzo);
            return prezzo >= from && prezzo <= to;
        });
    };

    return concertiFilter;
}

function searchBarFilter(artistiFilter, concertiFilter) {
    let searchString = document.getElementById("searchBar").value.toLowerCase();

    // Filtra i concerti in base alla stringa di ricerca
    let filteredConcerts = concertiFilter.filter(concerto => {
        let artista = artistiFilter.find(artist => artist.id === concerto.idArtista);
        return artista.nome.toLowerCase().includes(searchString) ||
            artista.genere.toLowerCase().includes(searchString) ||
            concerto.data.toLowerCase().includes(searchString) ||
            concerto.localita.toLowerCase().includes(searchString) ||
            concerto.via.toLowerCase().includes(searchString) ||
            concerto.nCivico.toLowerCase().includes(searchString);


    });

    printHomePage(artistiFilter, filteredConcerts);
}

function ticketUpdate(idConcerto) {
    console.log("function Called");
    // Creazione di un oggetto FormData contenente l'ID del concerto
    let formData = new FormData();
    formData.append('idConcerto', idConcerto);

    // Effettua una richiesta POST al server
    fetch('ticket_update.php', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                console.log("Numero di biglietti decrementato con successo per il concerto con ID:", idConcerto);
                leggiFileJSON()
                    .then(dati => {
                        elaboraDati(dati);
                    })
                    .catch(error => {
                        console.error('Errore durante la lettura del file:', error);
                    });

            } else {
                console.error("Si è verificato un errore durante la richiesta al server.");
            }
        })
        .catch(error => {
            console.error("Si è verificato un errore durante la richiesta al server:", error);
        });
}

function printOrders(userId, artisti, concerti, ordini) {
    let accountSection = document.getElementById("accountSection");
    let table;
    table = document.getElementById("orderHistoryTable");
    if (!table) {
        table = document.createElement("table");
        table.setAttribute("id", "orderHistoryTable");
    }
    table.innerHTML = "";
    let userOrders = [];
    

    ordini.forEach(order => {
        if (order.idUtente == userId) {
            let concert = concerti.find(concerto => concerto.id == order.idConcerto);
            if (concert) {
                let artist = artisti.find(artist => artist.id == concert.idArtista);
                if (artist) {
                    userOrders.push({
                        nTransazione: order.nTransazione,
                        data: order.data,
                        concerto: concert,
                        artista: artist
                    });
                }
            }
        }
    });
    console.log(userOrders);

    if (userOrders.length > 0) {
        let title = document.createElement("h2");
        //intestazioni tabella
        table.innerHTML = "<tr><th>DATA</th><th>TRANSAZIONE</th><th>LOCALITÀ</th><th>LUOGO</th>" + 
                        "<th>ORA</th><th>ARTISTA</th><th id='thBarcode'>BARCODE</th><th class='thArtist'>FOTO</th></tr>";

        userOrders.forEach(order => {
            let tr = document.createElement("tr");
            let date = document.createElement("td");
            let concertAddress = document.createElement("td");
            let concertPlace = document.createElement("td");
            let concertTime = document.createElement("td");
            let concertArtist = document.createElement("td");
            let artistiImgContainer = document.createElement("td");
                artistiImgContainer.setAttribute("class","artistImgContainer");
            let artistImg = document.createElement("img");
            let transationN = document.createElement("td");
            let barcode = document.createElement("td");
                barcode.setAttribute("id","tdBarcode");


            date.innerText = order.data;
            console.log(order);
            transationN.innerText = order.nTransazione;
            concertPlace.innerText = order.concerto.localita;
            concertAddress.innerText = order.concerto.via + " - " + order.concerto.nCivico;
            concertTime.innerText = order.concerto.ora;
            concertArtist.innerText = order.artista.nome;
            artistImg.src = "./img/" + order.artista.foto;
            barcode.innerText = order.concerto.barcode;

            tr.appendChild(date);
            tr.appendChild(transationN);
            tr.appendChild(concertPlace);
            tr.appendChild(concertAddress);
            tr.appendChild(concertTime);
            tr.appendChild(concertArtist);
            tr.appendChild(barcode);
            artistiImgContainer.appendChild(artistImg);
            tr.appendChild(artistiImgContainer);
            table.appendChild(tr);
        });
        accountSection.appendChild(table);
    } else {
        let orderOutput = document.createElement("h2");
        orderOutput.innerText = "NON CI SONO ORDINI";
        accountSection.appendChild(orderOutput);
    }
}

function checkBirthdate(input, id) {
    let output = document.getElementById(id);
    let today = new Date();
    let birthdate = new Date(input.value);
    // Controllo se la data di nascita è nel futuro o antecedente al 1924
    if (birthdate > today || birthdate.getFullYear() < 1924) {
        output.innerText = birthdate > today ? "La data di nascita non può essere nel futuro." : "Hai più di 100 anni?😱";
        isBirthdateValid = false;
        return; // Aggiunto per uscire dalla funzione in caso di data non valida
    }
    // Se tutte le condizioni sono soddisfatte, la data di nascita è valida
    isBirthdateValid = true;
    output.innerText = "";
}


function disableNavDiv() {
    document.getElementById("navDiv").style.pointerEvents = "none";
}
function enableNavDiv() {
    document.getElementById("navDiv").style.pointerEvents = "auto";
}

function disableSelects() {
    document.getElementById("genreDiv").style.pointerEvents = "none";
    document.getElementById("countryDiv").style.pointerEvents = "none";
    document.getElementById("orderDiv").style.pointerEvents = "none";
    document.getElementById("searchBar").style.pointerEvents = "none";
    document.getElementById("accountDiv").style.pointerEvents = "none";
}
function enableSelects() {
    document.getElementById("genreDiv").style.pointerEvents = "auto";
    document.getElementById("countryDiv").style.pointerEvents = "auto";
    document.getElementById("orderDiv").style.pointerEvents = "auto";
    document.getElementById("searchBar").style.pointerEvents = "auto";
    document.getElementById("accountDiv").style.pointerEvents = "auto";
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
function isEmailValid(email) {
    // Utilizziamo un'espressione regolare per validare l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function findFavGenres(){

}
