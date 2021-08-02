/* Append modal inner HTML */
const modalInnerHTML = (action, selected) => {
    switch (action) {
        case 'role':
            document.getElementById('actionModalLabel').innerText = 'Change Role';
            document.getElementById('modalForm').innerHTML = `
                <form method="POST" action="/admin/users/role">
                    <div class="modal-body">
                        <div class="form-group">
                            <select name="role" class="fm1-form-select-field" placeholder="Role" required>
                                <option value="basic" selected>Basic</option>
                                <option value="author">Author</option>
                                <option value="editor">Editor (ΔΣ / ΡΟΗ)</option>
                                <option value="admin">Admin</option>
                            </select>
                            <label for="role" class="form-label">Assign new role to ${selected.length} producers</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button id="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            `;
            break;
        case 'status':
            document.getElementById('actionModalLabel').innerText = 'Change Status';
            document.getElementById('modalForm').innerHTML = `
                <form method="POST" action="/admin/users/status">
                    <div class="modal-body">
                        <div class="form-group">
                            <select name="status" class="fm1-form-select-field" placeholder="Status" required>
                                <option value="active" selected>Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <label for="status" class="form-label">Change status to ${selected.length} producers</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button id="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            `;
            break;
        case 'delete':
            const producerList = [];
            selected.forEach(el => {
                const producer = JSON.parse(el.dataset.producer);
                producerList.push(`<br>${producer.profile.firstName} ${producer.profile.lastName}`);
            });

            document.getElementById('actionModalLabel').innerText = 'Delete';
            document.getElementById('modalForm').innerHTML = `
                <form id="actionForm" method="POST" action="/admin/users/delete">
                    <div class="modal-body">
                        <p>
                            Delete ${selected.length} producers?
                            <b>${producerList}</b>
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button id="submit" class="btn btn-danger">Delete</button>
                    </div>
                </form>
            `;
            break;
    }
};

/* Add event listeners on checkboxes */
const addCheckboxEvents = () => {
    /* Master checkboxes events */
    const masterCheckboxes = [...document.querySelectorAll('.master-checkbox')];
    masterCheckboxes.forEach(masterCheckbox => {
        masterCheckbox.addEventListener('change', e => {
            /* Get row checkboxes */
            const checkboxes = [...document.querySelectorAll(`.action-checkbox[data-role="${masterCheckbox.dataset.role}"]`)];
            checkboxes.forEach(checkbox => (checkbox.checked = masterCheckbox.checked));
        });
    });

    /* Row checkboxes events */
    const checkboxes = [...document.querySelectorAll('.action-checkbox')];
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', e => {
            /* Get master checkbox */
            const masterCheckbox = document.querySelector(`.master-checkbox[data-role="${checkbox.dataset.role}"]`);
            if (masterCheckbox.checked && !masterCheckbox.indeterminate) masterCheckbox.indeterminate = true;
        });
    });
};

/* Add action modal events */
const actionModal = document.getElementById('actionModal');
actionModal.addEventListener('show.bs.modal', e => {
    /* Get selected checkboxes */
    const selected = [...document.querySelectorAll('.action-checkbox:checked')];
    /* Setup action modal title and form */
    modalInnerHTML(e.relatedTarget.dataset.action, selected);
});
