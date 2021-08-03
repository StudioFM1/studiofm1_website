/* Append modal inner HTML */
const modalInnerHTML = (action, idList) => {
    const form = document.getElementById('fm1_form');
    switch (action) {
        case 'role':
            document.getElementById('actionModalLabel').innerText = 'Change Role';
            form.action = '/admin/producers/bulk?action=role';
            form.innerHTML = `
                <div class="form-group">
                    <select name="role" class="fm1-form-select-field" placeholder="Role" required>
                        <option value="basic" selected>Basic</option>
                        <option value="author">Author</option>
                        <option value="editor">Editor (ΔΣ / ΡΟΗ)</option>
                        <option value="admin">Admin</option>
                    </select>
                    <label for="role" class="form-label">Assign new role to ${idList.length} producers</label>
                </div>
            `;
            break;
        case 'status':
            document.getElementById('actionModalLabel').innerText = 'Change Status';
            form.action = '/admin/producers/bulk?action=status';
            form.innerHTML = `
                <div class="form-group">
                    <select name="status" class="fm1-form-select-field" placeholder="Status" required>
                        <option value="active" selected>Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <label for="status" class="form-label">Change status to ${idList.length} producers</label>
                </div>
            `;
            break;
        case 'delete':
            document.getElementById('actionModalLabel').innerText = 'Delete';
            form.action = '/admin/producers/bulk?action=delete';
            form.innerHTML = `
                <p>You are about to <b>delete ${idList.length} producer(s)</b>. This action is <b>permanent</b>.<br>Are you sure???</p>
            `;
            break;
    }
};

const submitRequest = (endpoint, data) =>
    new Promise((resolve, reject) => {
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(resolve)
            .catch(err => reject(err));
    });

/* Add events on DOM */
const addActionEvents = () => {
    /* Master checkboxes events */
    const masterCheckboxes = [...document.querySelectorAll('.master-checkbox')];
    masterCheckboxes.forEach(masterCheckbox => {
        masterCheckbox.checked = false;
        masterCheckbox.addEventListener('change', e => {
            /* Get row checkboxes */
            const checkboxes = [...document.querySelectorAll(`.action-checkbox[data-role="${masterCheckbox.dataset.role}"]`)];
            checkboxes.forEach(checkbox => (checkbox.checked = masterCheckbox.checked));
        });
    });

    /* Row checkboxes events */
    const checkboxes = [...document.querySelectorAll('.action-checkbox')];
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.addEventListener('change', e => {
            /* Get master checkbox */
            const masterCheckbox = document.querySelector(`.master-checkbox[data-role="${checkbox.dataset.role}"]`);
            if (masterCheckbox.checked && !masterCheckbox.indeterminate) masterCheckbox.indeterminate = true;
        });
    });

    /* Action modal events */
    const actionModal = document.getElementById('actionModal');
    actionModal.addEventListener('show.bs.modal', e => {
        /* Get selected checkboxes */
        const idList = [];
        [...document.querySelectorAll('.action-checkbox:checked')].forEach(el => idList.push(el.dataset.id));
        /* Setup action modal title and form */
        modalInnerHTML(e.relatedTarget.dataset.action, idList);
    });

    /* Sorting links */
    [...document.querySelectorAll('.sort-link')].forEach(anchor => {
        anchor.addEventListener('click', async e => {
            e.preventDefault();
            if (location.href.includes('?')) window.location.href = window.location.href.split('&')[0] + `&sorting=${e.target.dataset.sorting}`;
            else window.location.href += `?sorting=${e.target.dataset.sorting}`;
        });
    });

    /* Toggle status link */
    [...document.querySelectorAll('.toggle-status-link')].forEach(anchor => {
        anchor.addEventListener('click', async e => {
            e.preventDefault();
            e.target.disabled = true;
            await submitRequest(`/admin/producers/${e.target.dataset.id}/${e.target.dataset.action}`, { isActive: e.target.dataset.value });
            location.reload();
        });
    });

    /* Delete link */
    [...document.querySelectorAll('.delete-link')].forEach(anchor => {
        anchor.addEventListener('click', async e => {
            e.preventDefault();
            e.target.disabled = true;
            await submitRequest(`/admin/producers/${e.target.dataset.id}/${e.target.dataset.action}`, {});
            location.reload();
        });
    });
};
