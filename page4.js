// --- 6. AJOUT DYNAMIQUE DU FOOTER DE SIGNATURE ---
    const footer = document.createElement('footer');
    footer.style.textAlign = 'center';
    footer.style.padding = '20px 10px';
    footer.style.marginTop = '40px';
    footer.style.border = '1px solid #eaeaea';
    footer.style.fontFamily = 'Arial, sans-serif';
    footer.style.fontSize = '30px';
    footer.style.color = 'green';
footer.style.backgroundColor = '#f4f4f4';
    footer.innerHTML = `
        <p>Créé par 
           <a href="mailto:rjnasolo@gmail.com" style="color: #0076ff; text-decoration: none; font-weight: bold;">
              rjnasolo@gmail.com
           </a>
        </p>
    `;
    document.body.appendChild(footer);