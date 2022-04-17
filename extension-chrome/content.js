const matchingUrls = ['https://tickets.cri.epita.fr/Ticket/Update.html']

const validSvg = `<svg width="19px" height="15px" viewBox="0 0 19 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> 
    <title>Check (valid)</title>
    <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
        <g id="RÃ¨gle" transform="translate(1.000000, -1.000000)" stroke="#48B54E" stroke-width="2">
            <polyline id="Check-(valid)" points="0 8.5 5.35294118 15 16.0588235 2"></polyline>
        </g>
    </g>
</svg>`;

const invalidSvg = `<svg width="17px" height="16px" viewBox="0 0 17 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Check (invalid)</title>
    <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g id="RÃ¨gle" transform="translate(1.000000, -1.000000)" stroke="#E12525" stroke-width="2">
            <path d="M0.639096518,16 L14.6390965,2 M0.639096518,2 L14.6390965,16" id="Check-(invalid)"></path>
        </g>
    </g>
</svg>`;

function init() {
    if (!matchingUrls.some(url => document.location.href.includes(url))) return;

    /** @type {HTMLDivElement} */
    const rightSection = document.querySelector('#ticket-update-metadata');
    if (!rightSection) return;

    const rtBlock = document.createElement('div');

    rtBlock.innerHTML = `
<div class="ticket-info-basics">
  <div class="titlebox body-content-class card ticket-info-links  " id="">
  <div class="titlebox-title card-header">
    <span class="toggle " data-toggle="collapse" data-target="#netiquette-checker" title="Toggle visibility"></span>
    <span class="left">Netiquette Checker - Infinity RT</span>
    <span class="right-empty"></span>
  </div>
  <div class="titlebox-content collapse show " id="netiquette-checker">
    <div class="card-body" id="netiquette-body">
        <div class="netiquette__info">
            ${validSvg}
            <span style="padding-left: 8px">Présence d'une formule de salutation</span>
        </div>
        <div class="netiquette__info">
            ${invalidSvg}
            <span style="padding-left: 8px">2 lignes ne respectent pas les contraintes de tailles</span>
        </div>
        <div class="netiquette__error">
            <ul>
                <li>Ligne #23 - <b>78</b> caractères au lieu de <b>72</b></li>
                <li>Ligne #24 - <b>82</b> caractères au lieu de <b>80</b> (citation)</li>
            </ul>
        </div>
        <div class="netiquette__info">
            ${validSvg}
            <span style="padding-left: 8px">Présence d'une formule de politesse</span>
        </div>
        <div class="netiquette__info">
            ${validSvg}
            <span style="padding-left: 8px">Signature valide</span>
        </div>
        <div class="netiquette__info">
            ${validSvg}
            <span style="padding-left: 8px">Citation valide</span>
        </div>
    </div>
  </div>
</div>
</div>`;

    rightSection.appendChild(rtBlock);

    /** @type {HTMLTextAreaElement} */
    const textInput = document.querySelector('#UpdateContent');
    const netiquetteBody = document.querySelector('#netiquette-body');
    if (!textInput) return;

    textInput.addEventListener('input', () => checkNetiquette(textInput, netiquetteBody));

    textInput.textContent += `\n-- \nQuentin Briolant <quentin.briolant@epita.fr>\nIng2 - 2023\nYAKA - LAB SI - 2023`
}

/**
 * @param {HTMLTextAreaElement} textInput
 * @param {HTMLDivElement} netiquetteBodyElement
 */
function checkNetiquette(textInput, netiquetteBodyElement) {
    netiquetteBodyElement.innerHTML = '';
    checkGreetingLine(textInput.value, netiquetteBodyElement);
    checkLinesLength(textInput.value, netiquetteBodyElement);
    checkSalutationLine(textInput.value, netiquetteBodyElement);
    checkSignature(textInput.value, netiquetteBodyElement);
}


/**
 * @param {string} text
 * @param {HTMLDivElement} netiquetteBodyElement
 * @returns {boolean}
 */
function checkGreetingLine(text, netiquetteBodyElement) {
    const lines = text.split('\n');
    const isValid = lines[0] !== '' && lines[1] === '';

    if (isValid) {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${validSvg}<span style="padding-left: 8px">Présence d'une formule de salutation</span></div>`;
    } else {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${invalidSvg}<span style="padding-left: 8px">Absence d'une formule de salutation</span></div>`;
        netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul><li>Ligne #1 - Pas de ligne de salutation (une ligne vide doit être insérée après la ligne de salutation) </li></li></ul></div>`;
    }

    return isValid;
}


function checkLinesLength(text, netiquetteBodyElement) {
    const lines = text.split('\n');
    const errorLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // TODO : missing check for space at end of the line

        if (line.length <= 72)
            continue;

        const charLimit = line.startsWith(">") ? 80 : 72;

        if (line.length <= charLimit)
            continue;

        errorLines.push(`<li>Ligne #${i + 1} - <b>${line.length}</b> caractères au lieu de <b>${charLimit}</b></li>`);
    }

    if (errorLines.length === 0) {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${validSvg}<span style="padding-left: 8px">Les lignes respectent les contraintes de tailles</span></div>`;
    } else {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${invalidSvg}<span style="padding-left: 8px">${errorLines.length} lignes ne respectent pas les contraintes de tailles</span></div>`;
        netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul>${errorLines.join('')}</ul></div>`;
    }

    return errorLines.length === 0;
}

/**
 * @param {string} text
 * @param {HTMLDivElement} netiquetteBodyElement
 * @returns {boolean}
 */
function checkSalutationLine(text, netiquetteBodyElement) {
    const lines = text.split('\n');
    const index = lines.findIndex(line => line === '-- ');
    const isValid = index >= 3 && (lines[index - 1] === '' && lines[index - 2] !== '' && lines[index - 3] === '');

    if (isValid) {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${validSvg}<span style="padding-left: 8px">Présence d'une formule de politesse</span></div>`;
    } else {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${invalidSvg}<span style="padding-left: 8px">Absence d'une formule de politesse</span></div>`;
        netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul><li>Ligne #${index - 1} - Pas de ligne de politesse (une ligne vide doit être insérée avant et après la ligne de politesse) </li></li></ul></div>`;
    }

    return isValid;
}


/**
 * @param {string} text
 * @param {HTMLDivElement} netiquetteBodyElement
 */
function checkSignature(text, netiquetteBodyElement) {
    const lines = text.split('\n');
    const signatureLines = lines.map((e, i) => e.includes('-- ') ? i : null).filter(e => e !== null);
    const isValid = signatureLines.length === 1;

    // TODO: missing information about lines count

    netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${isValid ? validSvg : invalidSvg}<span style="padding-left: 8px">Signature ${isValid ? 'valide' : 'invalide'}</span></div>`;

    if (signatureLines.length === 0) {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul><li>Aucune signature</li></ul></div>`;
    } else if (signatureLines.length > 1) {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul>${signatureLines.map(e => `<li>Ligne #${e + 1} - Présence de <b>-- </b></li>`).join('')}</ul></div>`;
    }

    return isValid;
}

init();


