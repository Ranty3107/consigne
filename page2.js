// Remplace cette URL par l'URL exacte de ton déploiement Google Script (/exec)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxj-27E0JkdxgZW5411zj1ARuHdUhj-KRBC4ohzNsZKMoMc2cY3uqPlRObqgSvHNkBg/exec";

let donneesProduits = [];

// --- 1. CHARGEMENT DEPUIS GOOGLE SHEETS VIA FETCH ---
function chargerBaseDeDonnees() {
    const infoZone = document.getElementById("infoZone");
    const tbody = document.getElementById("resultTableBody");
    
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Chargement des données depuis Google Sheets en cours...</td></tr>`;
    infoZone.textContent = "Veuillez patienter...";

    // Ajout de redirect: "follow" obligatoire pour Google Apps Script
    fetch(WEB_APP_URL, {
        method: "GET",
        redirect: "follow"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur HTTP ! Statut : " + response.status);
        }
        return response.json();
    })
    .then(donnees => {
        if (donnees.error) {
            throw new Error(donnees.error);
        }

        donneesProduits = donnees || [];
        tbody.innerHTML = ""; 
        
        if (donneesProduits.length === 0) {
            infoZone.textContent = "Attention : La base de données est actuellement vide.";
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: #d9534f; font-weight: bold;">Aucun produit n'a encore été ajouté dans la base de données.</td></tr>`;
        } else {
            infoZone.textContent = `${donneesProduits.length} produits chargés. Prêt pour la recherche.`;
            afficherResultats(donneesProduits);
        }
    })
    .catch(erreur => {
        infoZone.textContent = "Erreur lors du chargement des données.";
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: red;">Erreur : ${erreur.message}</td></tr>`;
        console.error("Détail erreur Fetch :", erreur);
    });
}

// --- 2. SUPPRESSION DES ACCENTS ET CASSE ---
function normaliserTexte(texte) {
    if (!texte) return "";
    return texte
        .toLowerCase()
        .normalize("NFD")             
        .replace(/[\u0300-\u036f]/g, ""); 
}

// --- 3. LOGIQUE DE RECHERCHE ---
function executerRecherche() {
    const saisie = document.getElementById("searchInput").value.trim();
    const tbody = document.getElementById("resultTableBody");
    const infoZone = document.getElementById("infoZone");
    
    tbody.innerHTML = ""; 

    if (donneesProduits.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="no-result" style="text-align:center; color: #d9534f;">La base de données est vide, aucune recherche possible.</td></tr>`;
        infoZone.textContent = "Recherche annulée : Base vide.";
        return;
    }

    if (saisie === "") {
        afficherResultats(donneesProduits);
        infoZone.textContent = "Tous les produits sont affichés.";
        return;
    }

    let saisieNettoyee = normaliserTexte(saisie);

    let patternRegex = saisieNettoyee
        .replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&') 
        .replace(/\*/g, '.*');
    
    if (!saisie.includes('*')) {
        patternRegex = '.*' + patternRegex + '.*';
    }

    const regex = new RegExp('^' + patternRegex + '$');

    const resultatsFiltres = donneesProduits.filter(produit => {
        const ref = normaliserTexte(produit.refcode);
        const code = normaliserTexte(produit.code);
        const desc = normaliserTexte(produit.desclong);

        return regex.test(ref) || regex.test(code) || regex.test(desc);
    });

    if (resultatsFiltres.length > 0) {
        afficherResultats(resultatsFiltres);
        infoZone.textContent = `${resultatsFiltres.length} résultat(s) trouvé(s) pour "${saisie}".`;
    } else {
        tbody.innerHTML = `<tr><td colspan="3" class="no-result" style="text-align:center;">Aucun résultat correspondant à "${saisie}".</td></tr>`;
        infoZone.textContent = `0 résultat pour "${saisie}".`;
    }
}

// --- 4. INJECTION DU HTML ---
function afficherResultats(liste) {
    const tbody = document.getElementById("resultTableBody");
    liste.forEach(produit => {
        const ligne = document.createElement("tr");
        ligne.innerHTML = `
            <td><strong>${produit.refcode}</strong></td>
            <td>${produit.code}</td>
            <td>${produit.desclong}</td>
        `;
        tbody.appendChild(ligne);
    });
}

// --- 5. ÉCOUTEURS D'ÉVÉNEMENTS ---
document.getElementById("searchBtn").addEventListener("click", executerRecherche);

document.getElementById("searchInput").addEventListener("keyup", function(e) {
    if (e.key === "Enter") {
        executerRecherche();
    }
});

// --- 6. FOOTER DE SIGNATURE ---
const footer = document.createElement('footer');
footer.style.textAlign = 'center';
footer.style.padding = '20px 10px';
footer.style.marginTop = '40px';
footer.style.border = '1px solid black';
footer.style.fontFamily = 'Arial, sans-serif';
footer.style.fontSize = '14px';
footer.style.color = '#666';
footer.style.backgroundColor = 'white';

footer.innerHTML = `
    <p>Créé par 
        <a href="mailto:rjnasolo@gmail.com" style="color: #0076ff; text-decoration: none; font-weight: bold;">
            rjnasolo@gmail.com
        </a>
    </p>
`;
document.body.appendChild(footer);

// --- 7. INITIALISATION AU CHARGEMENT DE LA PAGE ---
document.addEventListener("DOMContentLoaded", chargerBaseDeDonnees);