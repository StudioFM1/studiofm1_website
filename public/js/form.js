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

/* Clear any message on the DOM */
function clearMessages() {
    /* Remove success messages */    
    const message = document.getElementById('message');
    message.classList.add('d-none');
    message.innerText = '';

    /* Remove errors */
    const fields = document.querySelectorAll('.form-field');
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

    if(data.success) {
        const message = document.getElementById('message');
        message.classList.remove('d-none');
        message.innerText = data.success;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        /* Clear passwords */
        document.getElementById('newPassword').value = '';
        document.getElementById('password').value = '';
    }
    /* Check for errors and display them if any */
    else if(data.errors?.length) {
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
const submitForm = async submitButton => {
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

    return res;
};

/* Add nescessary event listeners on form */
function addUserFormEvents() {
    /* Remove errors on focus */
    const fields = document.querySelectorAll('.form-field');
    fields.forEach(field => {
        field.addEventListener('focus', () => {
            if (field.classList.contains('error')) {
                const errorTag = [...document.querySelectorAll('.errorTag')].find(el => el.dataset.targetField === field.id);
                field.classList.remove('error');
                errorTag.innerText = '';
            }
        });
    });

    /* Show the eye on input or focus */
    const passwords = [...document.getElementsByTagName('input')].filter(el => el.type === 'password');
    passwords.forEach(field => {
        const eye = [...document.querySelectorAll('.toggle-password-view')].find(el => el.dataset.targetField === field.id);
        
        field.addEventListener('input', () => {
            if (field.value.length && eye.classList.contains('d-none')) eye.classList.remove('d-none');
            else if (!field.value.length && !eye.classList.contains('d-none')) eye.classList.add('d-none');
        });

        field.addEventListener('focus', () => {
            if (field.value.length && eye.classList.contains('d-none')) eye.classList.remove('d-none');
        });
    });

    /* Change the password field type to text when pressed, reset to password when released */
    const eyes = document.querySelectorAll('.toggle-password-view');
    eyes.forEach(eye => {
        /* While clicked set password input type to text to show password */
        eye.addEventListener('mousedown', () => (document.getElementById(eye.dataset.targetField).type = 'text'));

        /* On release reset to hide password */
        eye.addEventListener('mouseup', () => (document.getElementById(eye.dataset.targetField).type = 'password'));
    });

    /* Submit form, display feedback if any or redirect in any */
    const submit = document.getElementById('submit');
    submit.addEventListener('click', async e => {
        e.preventDefault();
        /* Submit query and get response */
        const res = await submitForm(submit);
        /* Hide the eyes */
        const eyes = document.querySelectorAll('.toggle-password-view');
        eyes.forEach(eye => {
            if (!eye.classList.contains('d-none')) eye.classList.add('d-none');
        });
        /* Redirect or display feedback */
        if (res.redirect) return (window.location = res.redirect);
        displayFeedback(res);
    });
}
