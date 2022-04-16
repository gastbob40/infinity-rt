const matchingUrls = ['https://tickets.cri.epita.fr/Ticket/Update.html']

function init() {
    if (!matchingUrls.some(url => document.location.href.includes(url))) return;

    /** @type {HTMLDivElement} */
    const rightSection = document.querySelector('#ticket-update-metadata');
    if (!rightSection) return;

    const rtBlock = document.createElement('div');
    const invalidSvg = `<svg width="17px" height="16px" viewBox="0 0 17 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Check (invalid)</title>
    <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g id="RÃ¨gle" transform="translate(1.000000, -1.000000)" stroke="#E12525" stroke-width="2">
            <path d="M0.639096518,16 L14.6390965,2 M0.639096518,2 L14.6390965,16" id="Check-(invalid)"></path>
        </g>
    </g>
</svg>`;

    const validSvg = `<svg width="19px" height="15px" viewBox="0 0 19 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Check (valid)</title>
    <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
        <g id="RÃ¨gle" transform="translate(1.000000, -1.000000)" stroke="#48B54E" stroke-width="2">
            <polyline id="Check-(valid)" points="0 8.5 5.35294118 15 16.0588235 2"></polyline>
        </g>
    </g>
</svg>`;

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
 * @param {HTMLDivElement} netiquetteBody
 */
function checkNetiquette(textInput, netiquetteBody) {
    console.log(textInput.value)
}

init();

