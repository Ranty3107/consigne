const footer = document.createElement('footer');

// Style pour maintenir le footer en bas de la page
footer.style.position = 'fixed';
footer.style.bottom = '0';
footer.style.left = '0';
footer.style.width = '100%';
footer.style.textAlign = 'center';
footer.style.backgroundColor = '#ffffff'; // Optionnel : fond blanc pour éviter la transparence sur le contenu
footer.style.padding = '10px 0';
footer.style.boxShadow = '0 -2px 5px rgba(0,0,0,0.05)'; // Optionnel : petite ombre élégante
footer.style.zIndex = '1000'; // Pour s'assurer qu'il reste au-dessus des autres éléments

footer.innerHTML = `
    <p style="margin: 0;">Créé par 
        <a href="mailto:rjnasolo@gmail.com" style="color: #0076ff; text-decoration: none; font-weight: bold;">
            rjnasolo@gmail.com
        </a>
    </p>
`;

document.body.appendChild(footer);
