'use strict'

/* Clear any message on the DOM */
function clearMessages() {
    const fields = document.querySelectorAll('.form-field');
    /* Remove error class from fields */
    fields.forEach(field => {
        if(field.classList.contains('error'))
            field.classList.remove('error');
    });

    /* Remove error messages */
    const errorTags = document.querySelectorAll('.errorTag');
    errorTags.forEach(tag => tag.innerText = '');
}

/* Dispaly feedback from the server */
function displayFeedback(data) {
    /* Clear previous messages */
    clearMessages();

    /* Check for errors and display them if any */
    if(data.errors?.length) {
        for(const error of data.errors) {
            /* Get incorrect field and it's error tag */
            const field = document.getElementById(error.field);
            const errorTag = [...document.querySelectorAll('.errorTag')].find(el => el.dataset.targetField === error.field);

            field.classList.add('error');
            errorTag.innerText = error.msg;
        }
    }
}

/* Form request and submit form */
const submitForm = async (submitButton) => {
    submitButton.disabled = true;
    const form = document.getElementById('userForm');
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

    displayFeedback(res);
};

/* When document is ready */
document.onreadystatechange = () => {
    if (document.readyState == 'complete') {
        /* Add event listeners on form fields to erase any error message on input change */
        const requiredFields = document.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('change', () => {
                if (field.classList.contains('error') && field.value.length) {
                    const errorTag = [...document.querySelectorAll('.errorTag')].find(el => el.dataset.targetField === field.id);
                    field.classList.remove('error');
                    errorTag.innerText = '';
                }
            });
        });

        /* Add event listener on submit button to submit form */
        const submit = document.getElementById('submit');
        submit.addEventListener('click', e => {
            e.preventDefault();
            submitForm(submit);
        });
    }
};