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
    rtBlock.classList.add('ticket-info-basics')

    rtBlock.innerHTML = `
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
</div>`;

    rightSection.appendChild(rtBlock);

    /** @type {HTMLTextAreaElement} */
    const textInput = document.querySelector('#UpdateContent');
    const netiquetteBody = document.querySelector('#netiquette-body');
    const headerBlock = netiquetteBody.parentElement.parentElement;
    console.log(headerBlock);
    if (!textInput) return;

    textInput.addEventListener('input', () => checkNetiquette(textInput, headerBlock, netiquetteBody));

    textInput.textContent += `\n-- \nQuentin Briolant <quentin.briolant@epita.fr>\nIng2 - 2023\nYAKA - LAB SI - 2023`
}

/**
 * @param {HTMLTextAreaElement} textInput
 * @param {HTMLDivElement} headerBlock
 * @param {HTMLDivElement} netiquetteBodyElement
 */
function checkNetiquette(textInput, headerBlock, netiquetteBodyElement) {
    netiquetteBodyElement.innerHTML = '';

    let hasErrors = !checkGreetingLine(textInput.value, netiquetteBodyElement);
    hasErrors |= !checkLinesLength(textInput.value, netiquetteBodyElement);
    hasErrors |= !checkQuote(textInput.value, netiquetteBodyElement);
    hasErrors |= !checkSalutationLine(textInput.value, netiquetteBodyElement);
    hasErrors |= !checkSignature(textInput.value, netiquetteBodyElement);

    headerBlock.classList.remove('ticket-info-links', 'ticket-info-basics');
    headerBlock.classList.add(hasErrors ? 'ticket-info-basics' : 'ticket-info-links');
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

/**
 * @param {string} text
 * @param {HTMLDivElement} netiquetteBodyElement
 * @returns {boolean}
 */
function checkLinesLength(text, netiquetteBodyElement) {
    const lines = text.split('\n');
    const errorLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.match('^(?!>|(-- )).*\\s$')) {
            errorLines.push(`<li>Ligne #${i + 1} - La ligne contient un espace à la fin</li>`);
        }

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
function checkQuote(text, netiquetteBodyElement) {
    const lines = text.split('\n');
    const errorLines = [];

    let isQuoteAttributed = false;
    let inQuoteSection = false;
    let sectionIndex = 0;


    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes("-- "))
            break;

        sectionIndex = line !== '' ? sectionIndex + 1 : 0;

        if (line.startsWith('>')) {
            if (!inQuoteSection && sectionIndex > 2) {
                errorLines.push(`<li>Ligne #${i + 1} - Quote attribution must be preceded by an empty line</li>`);
                continue
            }

            inQuoteSection = true;

            // Quote attribution lookup
            if (!isQuoteAttributed) {
                if (i > 0 && lines[i - 1] !== '') {
                    isQuoteAttributed = true;
                } else {
                    errorLines.push(`<li>Ligne #${i + 1} - Quote section must be attributed</li>`);
                }
            }

            // Multiple quoting rules
            for (let j = 0; j < lines.length; j++) {
                if (line.charAt(j) === '>')
                    continue;

                if (line.charAt(j) === ' ') {
                    if (j + 1 < line.length && line.charAt(j + 1) === '>') {
                        errorLines.push(`<li>Ligne #${i + 1} - Quoting multiple times should use multiple > without spaces in between</li>`);
                    }

                    break;
                }

                errorLines.push("<li>Ligne #" + (i + 1) + " - Quoting needs a space between the last > and its content</li>");
                break
            }
        } else if (line !== '' && inQuoteSection) {
            errorLines.push("<li>Ligne #" + (i + 1) + " - Quoting sections must be separated by empty lines</li>");
        } else {
            inQuoteSection = false;
        }
    }

    const isValid = errorLines.length === 0;
    netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${isValid ? validSvg : invalidSvg}<span style="padding-left: 8px">Citations valides</span></div>`;

    if (!isValid) {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul>${errorLines.join('')}</ul></div>`;
    }

    return isValid;
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

    if (signatureLines.length > 1 || signatureLines.length === 0) {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${invalidSvg}<span style="padding-left: 8px">Signature invalide</span></div>`;
        if (signatureLines.length > 1) {
            netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul>${signatureLines.map(e => `<li>Ligne #${e + 1} - Présence de <b>-- </b></li>`).join('')}</ul></div>`;
        } else {
            netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul><li>Aucune signature</li></ul></div>`;
        }

        return false;
    }

    const signatureIndex = signatureLines[0];

    if (lines.length === signatureIndex + 1) {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${invalidSvg}<span style="padding-left: 8px">Signature invalide</span></div>`;
        netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul><li>Signature vide</li></ul></div>`;
        return false;
    }

    if (lines.length > signatureIndex + 5) {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${invalidSvg}<span style="padding-left: 8px">Signature invalide</span></div>`;
        netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul><li>Signature trop longue</li></ul></div>`;
        return false;
    }

    if (lines[signatureIndex + 1] === '') {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${invalidSvg}<span style="padding-left: 8px">Signature invalide</span></div>`;
        netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul><li>Une signature ne doit pas démarrer par une ligne vide</li></ul></div>`;
        return false;
    }

    netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${validSvg}<span style="padding-left: 8px">Signature valide</span></div>`;

    return true;
}

init();


