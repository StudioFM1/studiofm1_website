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

/* When document is ready */
document.onreadystatechange = () => {
    if (document.readyState == 'complete') {
        /* Add event listener on submit button */
        const editBtn = document.getElementById('editProfile');
        toggleForm(editBtn);
        editBtn.addEventListener('click', e => {
            e.preventDefault();
            toggleForm(editBtn);
        });
    }
};
