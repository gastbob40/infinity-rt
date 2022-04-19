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

async function init() {
    if (!matchingUrls.some(url => document.location.href.includes(url))) return;

    const config = await browser.storage.local.get(['disableSubmit', 'enableSignature', 'signature']);

    /** @type {HTMLDivElement} */
    const rightSection = document.querySelector('#ticket-update-metadata');
    if (!rightSection) {
        console.error('Could not find right section');
        return;
    }

    const rtBlock = document.createElement('div');
    rtBlock.classList.add('ticket-info-basics')
    console.log(config.disableSubmit);
    console.log('aze')
    rtBlock.innerHTML = `
<div class="titlebox body-content-class card ticket-info-links  " id="">
  <div class="titlebox-title card-header">
    <span class="toggle " data-toggle="collapse" data-target="#netiquette-checker" title="Toggle visibility"></span>
    <span class="left">Netiquette Checker - Infinity RT</span>
    <span class="right" id="netiquette-switcher"><svg class="svg-inline--fa fa-cog fa-w-16 icon-bordered fa-2x" alt="Options" data-toggle="tooltip" data-placement="top" data-original-title="Options" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cog" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path></svg></span>
  </div>
  <div class="titlebox-content collapse show " id="netiquette-checker">
    <div class="card-body" id="netiquette-body">
    </div>
    
    <div class="card-body" id="netiquette-options" style="display: none;">
        <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" name="netiquette-disable-submit" id="netiquette-disable-submit" ${config.disableSubmit ? 'checked' : ''}>
            <label class="custom-control-label" for="netiquette-disable-submit">
                Disabled submit if netiquette is not respected
            </label>
        </div>
        
        <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" name="netiquette-enable-signature" id="netiquette-enable-signature" ${config.enableSignature ? 'checked' : ''}>
            <label class="custom-control-label" for="netiquette-enable-signature">
                Enable signature
            </label>
        </div>
        
        <textarea autocomplete="off" class="form-control messagebox " wrap="soft" id="netiquette-signature" placeholder="Signature" rows="4">${config.signature !== undefined ? config.signature : ''}</textarea>
        
        <button id="netiquette-options-submit" class="button btn btn-primary form-control">Save</button>
    </div>
  </div>
</div>`;

    rightSection.appendChild(rtBlock);
    console.log('[Infinity RT] Netiquette checker loaded');

    /** @type {HTMLTextAreaElement} */
    const textInput = document.querySelector('#UpdateContent');
    const netiquetteBody = document.querySelector('#netiquette-body');
    const netiquetteSwitcher = document.querySelector('#netiquette-switcher');
    const netiquetteOptions = document.querySelector('#netiquette-options');
    const netiquetteOptionsSubmit = document.querySelector('#netiquette-options-submit');
    const submitButton = document.querySelector("input[name='SubmitTicket']");
    const headerBlock = netiquetteBody.parentElement.parentElement;

    if (!textInput) return;

    if (config.enableSignature) {
        textInput.value += `\n-- \n${config.signature}`;
    }

    textInput.addEventListener('input', () => checkNetiquette(textInput, headerBlock, netiquetteBody, submitButton, config));
    checkNetiquette(textInput, headerBlock, netiquetteBody, submitButton, config);

    netiquetteSwitcher.addEventListener('click', () => switchNetiquetteView(netiquetteBody, netiquetteOptions));
    netiquetteOptionsSubmit.addEventListener('click', (e) => saveNetiquetteOptions(e));
}

/**
 * @param e {Event}
 */
function saveNetiquetteOptions(e) {
    e.preventDefault()
    const disableSubmit = document.querySelector('#netiquette-disable-submit').checked;
    const enableSignature = document.querySelector('#netiquette-enable-signature').checked;
    const signature = document.querySelector('#netiquette-signature').value;
    browser.storage.local.set({
        disableSubmit: disableSubmit,
        enableSignature: enableSignature,
        signature: signature
    }).then(() => {
        console.log('[Infinity RT] Netiquette options saved');
    });

    switchNetiquetteView(document.querySelector('#netiquette-body'), document.querySelector('#netiquette-options'));
}

/**
 * @param {HTMLDivElement} netiquetteBody
 * @param {HTMLDivElement} netiquetteOptions
 */
function switchNetiquetteView(netiquetteBody, netiquetteOptions) {
    const oldElement = netiquetteBody.style.display === 'none' ? netiquetteOptions : netiquetteBody;
    const newElement = netiquetteBody.style.display === 'none' ? netiquetteBody : netiquetteOptions;

    newElement.style.display = 'block';
    const oldHeight = oldElement.scrollHeight + 'px';
    const newHeight = newElement.scrollHeight + 'px';
    oldElement.style.display = 'none';
    newElement.style.height = oldHeight;
    newElement.style.animation = 'none';
    newElement.animate({
            height: newHeight
        }, {
            duration: 150,
        }
    );
    setTimeout(() => {
        newElement.style.height = '';
    }, 150);
}

/**
 * @param {HTMLTextAreaElement} textInput
 * @param {HTMLDivElement} headerBlock
 * @param {HTMLDivElement} netiquetteBodyElement
 * @param {HTMLButtonElement} submitButton
 * @param {Object} config
 */
function checkNetiquette(textInput, headerBlock, netiquetteBodyElement, submitButton, config) {
    netiquetteBodyElement.innerHTML = '';

    let hasErrors = !checkGreetingLine(textInput.value, netiquetteBodyElement);
    hasErrors |= !checkLinesLength(textInput.value, netiquetteBodyElement);
    hasErrors |= !checkQuote(textInput.value, netiquetteBodyElement);
    hasErrors |= !checkSalutationLine(textInput.value, netiquetteBodyElement);
    hasErrors |= !checkSignature(textInput.value, netiquetteBodyElement);

    headerBlock.classList.remove('ticket-info-links', 'ticket-info-basics');
    headerBlock.classList.add(hasErrors ? 'ticket-info-basics' : 'ticket-info-links');

    if (config.disableSubmit) {
        submitButton.disabled = hasErrors;
    }
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
    let hasPassedSignature = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.match('^(?!>|(-- )).*\\s$')) {
            errorLines.push(`<li>Line #${i + 1} - The line has a trailing whitespace</li>`);
        }

        hasPassedSignature |= line.includes('-- ');

        if (!hasPassedSignature && line.length !== 0 && line.length < 60 && lines.length > i + 1 && lines[i + 1] !== '' && !line.startsWith('>') && !lines[i + 1].startsWith('>')) {
            errorLines.push(`<li>Line #${i + 1} - The line is too short (<b>${line.length}</b> characters instead of more than <b>60</b>)</li>`);
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
        netiquetteBodyElement.innerHTML += `<div class="netiquette__error"><ul><li>No salutation line (a blank line must be inserted before and after the salutation line)</li></li></ul></div>`;
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

/*
  disableSubmit: disableSubmit,
        activeSignature: activeSignature,
        signature: signature
 */
init();

