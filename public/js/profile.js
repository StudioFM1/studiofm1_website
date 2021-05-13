'use strict';

/* Toggle form */
function toggleForm(editBtn) {
    const form = document.getElementById('profileForm');

    form.classList.toggle('isDisabled');

    if (form.classList.contains('isDisabled')) editBtn.innerText = 'Edit profile';
    else editBtn.innerText = 'Cancel';

    const formElements = form.elements;
    for (let element of formElements) {
        element.classList.toggle('disabled-field');
        element.disabled = !element.disabled;
    }
}

/* Form request and submit form */
const submitForm = async (submitButton) => {
    submitButton.disabled = true;
    const form = document.getElementById('profileForm');
    const formFields = new FormData(form);

    let data = {};
    for (const [name, value] of formFields) data[name] = value;

    let res = await fetch(form.action, {
        method: form.method,
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    submitButton.disabled = false;

    try {
        res = await res.json();
    } catch (err) {
        throw err;
    }

    if (res.redirect) return (window.location = res.redirect);
};

/* When document is ready */
document.onreadystatechange = () => {
    if (document.readyState == 'complete') {
        /* Add event listener on submit button */
        const editBtn = document.getElementById('editProfile');
        const submitButton = document.getElementById('submitButton');

        toggleForm(editBtn);

        editBtn.addEventListener('click', e => {
            e.preventDefault();
            toggleForm(editBtn);
        });

        submitButton.addEventListener('click', e => {
            e.preventDefault();
            submitForm(submitButton);
        });
    }
};
