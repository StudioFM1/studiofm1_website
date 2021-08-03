'use strict'

/**
 * @description
 * This script is used by the registration,
 * login and profile update forms. It collects the 
 * data from the form ande sends the corresponding 
 * API request to the server for each form
 * 
 * On server response, the script redirects the browser
 * if the response contains a redirect property, or displays 
 * a feedback (success message or possible errors).
 */

/* Dispaly feedback from the server */
const logFormErrors = errors => {
    /* Remove error messages and classes */
    document.querySelectorAll('.fm1-form-field').forEach(field => field.classList.remove('error'));
    document.querySelectorAll('.errorTag').forEach(tag => (tag.innerText = ''));

    /* Check for errors and display them if any */
    for (const error of errors) {
        /* Get incorrect field and it's error tag */
        const field = document.getElementById(error.field);
        const errorTag = [...document.querySelectorAll('.errorTag')].find(el => el.dataset.targetField === error.field);

        field.classList.add('error');
        errorTag.innerText = error.msg;
    }
};

/* Form request and submit form */
const submitForm = () =>
    new Promise((resolve, reject) => {
        const form = document.getElementById('fm1_form');
        const formFields = new FormData(form);

        let data = {};
        for (const [name, value] of formFields) data[name] = value;

        fetch(form.action, {
            method: form.method,
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
    });

/* Add nescessary event listeners on form */
const addFm1FormEvents = () => {
    /* Remove errors on focus */
    const fields = document.querySelectorAll('.fm1-form-field');
    fields.forEach(field => {
        field.addEventListener('focus', () => {
            if (field.classList.contains('error')) {
                const errorTag = [...document.querySelectorAll('.errorTag')].find(el => el.dataset.targetField === field.id);
                field.classList.remove('error');
                errorTag.innerText = '';
            }
        });
    });

    /* Submit form, display feedback if any or redirect in any */
    const submit = document.getElementById('submit');
    submit.addEventListener('click', async e => {
        e.preventDefault();

        try {
            /* Submit query and get response */
            submit.disabled = false;
            const res = await submitForm();
            submit.disabled = false;
            /* Redirect if needed, display errors on error, reload on success */
            if (res.redirect) return (window.location = res.redirect);
            else if (res.errors?.length) logFormErrors(res.errors);
            else location.reload();
        } catch (err) {
            console.log(err);
        }
    });
};
