class Artista {
    constructor(id, nome, descrizione, genere, foto) {
        this.nome = nome;
        this.id = id;
        this.descrizione = descrizione;
        this.genere = genere;
        this.foto = foto;

    }
}
class Concerto {
    constructor(id, idArtista, localita, via, nCivico, data, ora, nBiglietti, prezzo) {
        this.id = id;
        this.idArtista = idArtista;
        this.localita = localita;
        this.via = via;
        this.nCivico = nCivico;
        this.data = data;
        this.ora = ora;
        this.nBiglietti = nBiglietti;
        this.prezzo = prezzo;
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
    artisti = dati.artisti.map(artisti => new Artista(artisti.id, artisti.nome, artisti.descrizione, artisti.genere, artisti.foto));
    concerti = dati.concerti.map(concerto => new Concerto(concerto.id, concerto.idArtista, concerto.localita, concerto.via, concerto.nCivico, concerto.data, concerto.ora, concerto.nBiglietti, concerto.prezzo));
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
        let ticketColor = colors[rand];
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
        barcode.innerText = "...";
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
        case "mostRelevant":
            concertiFilter = sortByNumberOfTickets(concertiFilter);
            concertiFilter = concertiFilter.reverse();
            break;
        case "lessRelevant":
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

function login() {
    if (!loginSession) {
        let homepage = document.getElementById("homePageSection");

        if(homepage) document.body.removeChild(homepage);

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
    } else {
        console.log("ACCOUNT");
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
    let output;

    if(!isBirthdateValid) return;
    
    if (email.length >= 8 && password.length >= 8) {
        if (password === password2) {
            let nuovoUtente = {
                "nome": nome,
                "cognome": cognome,
                "dataNascita": birthdate,
                "email": email,
                "password": password,
                "foto": "default.png"
            };

            salvaFileJSON(nuovoUtente);
            let sectionContainer = document.getElementById("sectionContainer");
            output = document.getElementById("outputSignUp");
            output.innerText = "REGISTRATO CORRETTAMENTE, ORA PUOI EFFETTUARE IL LOGIN";
            document.body.removeChild(sectionContainer);
            login();
            let navDiv = document.getElementById("navDiv");
            navDiv.style.display = "block";
        } else {
            output = document.getElementById("outputSignUp");
            output.innerText = "LE PASSWORD NON CORRISPONDONO";
        }
    } else {
        output = document.getElementById("outputSignUp");
        output.innerText = "LA PASSWORD DEVE ESSERE DI ALMENO 8 CARATTERI";
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
                    printHomePage(artisti, concerti);
                }, 1000);
            } else {
                width++;
                progressBar.style.width = width + '%';
            }
        }, 30);
    }
}

function accountSection(accountDiv) {
    if (!loginSession) {
        login();
        return;
    }

    let accountSection = document.getElementById("accountSection");
    if (!accountSection) {
        accountDiv.style.backgroundColor = "black";
        accountSection = document.createElement("section");
        accountSection.setAttribute("id", "accountSection");
        document.body.removeChild(document.getElementById("homePageSection"));
        document.getElementById("navDiv").style.display = "none";
        let div = document.createElement("div");


        let h1 = document.createElement("h1");
        h1.innerText = "ACCOUNT";

        let profileImg = document.createElement("img");

        let name, surname, birthdate, email;
        utenti.forEach(user => {
            if (user.id === userId) {
                profileImg.src = "./img/" + user.foto;
                name = user.nome;
                surname = user.cognome;
                birthdate = user.dataNascita;
                email = user.email;


            }
        })

        let nameInput = document.createElement("input");
        nameInput.value = name;
        nameInput.required = "required";

        let surnameInput = document.createElement("input");
        surnameInput.value = surname;
        surnameInput.required = "required";


        let birthdateInput = document.createElement("Input");
        birthdateInput.setAttribute("type", "date");
        birthdateInput.setAttribute("onchange", "checkExpDate(this,'accountOutput')");
        birthdateInput.value = birthdate;
        birthdateInput.required = "required";

        let emailInput = document.createElement("input");
        emailInput.value = email;
        emailInput.setAttribute("type", "email");
        emailInput.required = "required";

        let output = document.createElement("p");
        output.setAttribute("id", "accountOutput");

        let button = document.createElement("button");
        button.innerText = "MODIFICA";
        button.setAttribute("onlclick", "updateAccount()");

        let orderHistoryBtn = document.createElement("button");
        orderHistoryBtn.innerText = "STORICO ORDINI";
        orderHistoryBtn.setAttribute("onclick", "printOrders(userId,artisti,concerti,ordini)");

        div.appendChild(h1);
        div.appendChild(profileImg);
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

//funzione updateAccount();
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
    salvaOrdineJSON(newOrder);
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

    return concertiFilter.filter(concerto => {
        let artista = artistiFilter.find(artist => artist.id === concerto.idArtista);
        return (
            artista.nome.toLowerCase().includes(searchString) ||
            artista.genere.toLowerCase().includes(searchString) ||
            concerto.data.toLowerCase().includes(searchString) ||
            concerto.localita.toLowerCase().includes(searchString)
        );
    });
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
    table = document.getElementById("orderHistoryTable")
    if (!table) {
        table = document.createElement("table");
        table.setAttribute("id", "orderHistoryTable");
    }
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

        userOrders.forEach(order => {
            let tr = document.createElement("tr");
            let date = document.createElement("td");
            let concertAddress = document.createElement("td");
            let concertPlace = document.createElement("td");
            let concertTime = document.createElement("td");
            let concertArtist = document.createElement("td");
            let artistImg = document.createElement("img");
            let transationN = document.createElement("td");


            date.innerText = order.data;
            console.log(order);
            transationN.innerText = order.nTransazione;
            concertPlace.innerText = order.concerto.localita;
            concertAddress.innerText = order.concerto.via + " - " + order.concerto.nCivico;
            concertTime.innerText = order.concerto.ora;
            concertArtist.innerText = order.artista.nome;
            artistImg.src = "./img/" + order.artista.foto;
            tr.appendChild(date);
            tr.appendChild(transationN);
            tr.appendChild(concertPlace);
            tr.appendChild(concertAddress);
            tr.appendChild(concertTime);
            tr.appendChild(concertArtist);
            tr.appendChild(artistImg);
            table.appendChild(tr);
        });
        accountSection.appendChild(table);
    } else {
        let orderOutput = document.createElement("h2");
        orderOutput.innerText = "NON CI SONO ORDINI";
        accountSection.appendChild(orderOutput);
    }
}

function checkBirthdate(input, id){
    let output = document.getElementById(id);
    let today = new Date();
    let birthdate = new Date(input);

    // Controllo se la data di nascita è nel futuro
    if (birthdate > today) {
        output.innerText = "INSERISCI UNA DATA VALIDA";
        isBirthdateValid = false;
        return; // Aggiunto per uscire dalla funzione in caso di data futura
    }
    
    // Se entrambi i controlli passano, la data è valida
    isBirthdateValid = true;
}






// MOSTRARE PREZZO BIGLIETTO
// SEZIONE ACCOUNT
// COMPRA BIGLIETTO
// SEARCHBAR
// TICKET COLOR