'use strict'

/* Form request and submit form */
const submitForm = async (submitButton) => {
    submitButton.disabled = true;
    const form = document.getElementsByTagName('form')[0];
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
        const submit = document.getElementById('submit');
        submit.addEventListener('click', e => {
            e.preventDefault();
            submitForm(submit);
        });
    }
};