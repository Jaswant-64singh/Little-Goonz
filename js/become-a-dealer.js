(function () {
    var header = document.querySelector('header.reference-navbar');
    if (!header) return;
    var toggle = header.querySelector('.responsive-menu .slicknav_btn');
    var slot = header.querySelector('.navbar-toggle');
    if (toggle && slot) {
        toggle.setAttribute('aria-label', 'Toggle navigation');
        slot.appendChild(toggle);
    }
})();

(function () {
    'use strict';
    var form = document.getElementById('dealerEnquiryForm');
    if (!form) return;
    var fields = form.elements;
    var textFields = ['fullName', 'businessName', 'cityState'];
    function validateText(input) {
        input.setCustomValidity(input.value.trim().length < 2 ? 'Please enter at least two characters.' : '');
    }
    function validatePhone() {
        var phone = fields.phone.value.trim();
        var digits = phone.replace(/\D/g, '');
        var valid = /^\+?[0-9\s().-]+$/.test(phone) && digits.length >= 8 && digits.length <= 15;
        fields.phone.setCustomValidity(valid ? '' : 'Please enter a phone number with 8 to 15 digits.');
    }
    textFields.forEach(function (name) {
        fields[name].addEventListener('input', function () { validateText(fields[name]); });
        fields[name].addEventListener('blur', function () { validateText(fields[name]); });
    });
    fields.phone.addEventListener('input', validatePhone);
    fields.phone.addEventListener('blur', validatePhone);
    form.addEventListener('input', function () {
        document.getElementById('dealer-form-status').hidden = true;
        document.getElementById('dealer-email-link').href = 'mailto:hello@littlegoonz.com';
    });
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        textFields.forEach(function (name) { validateText(fields[name]); });
        validatePhone();
        if (!form.reportValidity()) return;
        var subject = 'Little Goonz Dealer Enquiry - ' + fields.businessName.value.trim();
        var body = [
            'Hello Little Goonz Team,',
            '',
            'I would like to enquire about becoming a dealer.',
            '',
            'Full Name: ' + fields.fullName.value.trim(),
            'Business / Store Name: ' + fields.businessName.value.trim(),
            'Email Address: ' + fields.email.value.trim(),
            'Phone Number: ' + fields.phone.value.trim(),
            'City & State: ' + fields.cityState.value.trim(),
            'Business Type: ' + fields.businessType.value,
            '',
            'Your Message:',
            fields.message.value.trim() || 'Not provided.'
        ].join('\r\n');
        var mailto = 'mailto:hello@littlegoonz.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        document.getElementById('dealer-email-link').href = mailto;
        document.getElementById('dealer-form-status').hidden = false;
        window.location.assign(mailto);
    });
})();
