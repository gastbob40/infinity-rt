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
    </div>
  </div>
</div>`;

    rightSection.appendChild(rtBlock);

    /** @type {HTMLTextAreaElement} */
    const textInput = document.querySelector('#UpdateContent');
    const netiquetteBody = document.querySelector('#netiquette-body');
    const headerBlock = netiquetteBody.parentElement.parentElement;

    if (!textInput) return;

    textInput.addEventListener('input', () => checkNetiquette(textInput, headerBlock, netiquetteBody));
    checkNetiquette(textInput, headerBlock, netiquetteBody);

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
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${validSvg}<span style="padding-left: 8px">Presence of a greeting line</span></div>`;
    } else {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${invalidSvg}<span style="padding-left: 8px">Missing greeting line</span></div>`;
        netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul><li>Line #1 - No greeting line (an empty line must be inserted after the greeting line)</li></li></ul></div>`;
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
            errorLines.push(`<li>Line #${i + 1} - The line has a trailing whitespace</li>`);
        }

        if (line.length <= 72)
            continue;

        const charLimit = line.startsWith(">") ? 80 : 72;

        if (line.length <= charLimit)
            continue;

        errorLines.push(`<li>Ligne #${i + 1} - <b>${line.length}</b> characters instead of <b>${charLimit}</b></li>`);
    }

    if (errorLines.length === 0) {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${validSvg}<span style="padding-left: 8px">The lines respect the constraints</span></div>`;
    } else {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${invalidSvg}<span style="padding-left: 8px">${errorLines.length} lines do not respect the constraints</span></div>`;
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
                errorLines.push(`<li>Line #${i + 1} - Quote attribution must be preceded by an empty line</li>`);
                continue
            }

            inQuoteSection = true;

            // Quote attribution lookup
            if (!isQuoteAttributed) {
                if (i > 0 && lines[i - 1] !== '') {
                    isQuoteAttributed = true;
                } else {
                    errorLines.push(`<li>Line #${i + 1} - Quote section must be attributed</li>`);
                }
            }

            // Multiple quoting rules
            for (let j = 0; j < lines.length; j++) {
                if (line.charAt(j) === '>')
                    continue;

                if (line.charAt(j) === ' ') {
                    if (j + 1 < line.length && line.charAt(j + 1) === '>') {
                        errorLines.push(`<li>Line #${i + 1} - Quoting multiple times should use multiple > without spaces in between</li>`);
                    }

                    break;
                }

                errorLines.push("<li>Line #" + (i + 1) + " - Quoting needs a space between the last > and its content</li>");
                break
            }
        } else if (line !== '' && inQuoteSection) {
            errorLines.push("<li>Line #" + (i + 1) + " - Quoting sections must be separated by empty lines</li>");
        } else {
            inQuoteSection = false;
        }
    }

    const isValid = errorLines.length === 0;
    netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${isValid ? validSvg : invalidSvg}<span style="padding-left: 8px">${isValid ? 'Valid quotes' : 'Invalid quotes'}</span></div>`;

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
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${validSvg}<span style="padding-left: 8px">Presence of a salutation line</span></div>`;
    } else {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${invalidSvg}<span style="padding-left: 8px">Missing a salutation line</span></div>`;
        netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul><li>Line #${index - 1} - No salutation line (a blank line must be inserted before and after the salutation line)</li></li></ul></div>`;
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
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${invalidSvg}<span style="padding-left: 8px">Invalid signature</span></div>`;
        if (signatureLines.length > 1) {
            netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul>${signatureLines.map(e => `<li>Line #${e + 1} - Presence of <b>-- </b></li>`).join('')}</ul></div>`;
        } else {
            netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul><li>No signature</li></ul></div>`;
        }

        return false;
    }

    const signatureIndex = signatureLines[0];

    if (lines.length === signatureIndex + 1) {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${invalidSvg}<span style="padding-left: 8px">Invalid signature</span></div>`;
        netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul><li>Empty signature</li></ul></div>`;
        return false;
    }

    if (lines.length > signatureIndex + 5) {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${invalidSvg}<span style="padding-left: 8px">Invalid signature</span></div>`;
        netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul><li>Signature too long</li></ul></div>`;
        return false;
    }

    if (lines[signatureIndex + 1] === '') {
        netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${invalidSvg}<span style="padding-left: 8px">Invalid signature</span></div>`;
        netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul><li>A signature must not start with an empty line</li></ul></div>`;
        return false;
    }

    netiquetteBodyElement.innerHTML += `<div class="netiquette__info">${validSvg}<span style="padding-left: 8px">Valid Signature</span></div>`;

    return true;
}

init();


