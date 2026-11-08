/* ============================================================
   features/contact-form.js
   CONTACT FORM — two independent channels, both fed straight from the form:
     1. sheetURL — the original Google Apps Script that stores the row in
        the Google Sheet (separate account; unchanged).
     2. mailURL  — the "Portfolio Mail Notification" Apps Script that
        e-mails Soham.
   The two requests are sent separately and know nothing about each other.
   The success screen follows the sheet request; a mail failure is only
   logged, so a visitor is never asked to resend and duplicate the row.
   CSS: assets/css/components/contact-form.css
   ============================================================ */
(function () {

    const sheetURL = 'https://script.google.com/macros/s/AKfycby_S7A8v_Rgg7a6eGySgg3ID62lUMo35Wk7RiW4oGxSNYrwWCC6B-zKJVzFpkey115W/exec'
    const mailURL  = 'https://script.google.com/macros/s/AKfycbwyCqLiYh63IXQGQqFRFpBaM-E-hTVod6l9wMSsxN_qJuV2K3yi1iLnrYqrgjZNKReC/exec'   // "Portfolio Mail Notification" web app

    const form = document.forms['Contact-form']
    const sendBtn = document.getElementById('sendBtn')
    const formWrap = document.querySelector('.contact-form-wrap')
    if (!form || !sendBtn || !formWrap) return
    const sendBtnHTML = sendBtn.innerHTML

    form.addEventListener('submit', e => {
        e.preventDefault()

        // instant feedback while the request is in flight
        sendBtn.disabled = true
        sendBtn.classList.add('sending')
        sendBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...'

        // channel 2: e-mail notification (independent, fire-and-forget)
        if (mailURL) {
            fetch(mailURL, { method: 'POST', body: new FormData(form) })
                .catch(error => console.error('Mail notification failed:', error.message))
        }

        // channel 1: store the row (drives the success screen)
        fetch(sheetURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
            form.reset()
            formWrap.classList.add('sent')
            setTimeout(() => {
                formWrap.classList.remove('sent')
                sendBtn.disabled = false
                sendBtn.classList.remove('sending')
                sendBtn.innerHTML = sendBtnHTML
            }, 3200)
        })
        .catch(error => {
            console.error('Error!', error.message)
            sendBtn.disabled = false
            sendBtn.classList.remove('sending')
            sendBtn.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Failed — try again'
            setTimeout(() => { sendBtn.innerHTML = sendBtnHTML }, 2800)
        })
    })

})();
