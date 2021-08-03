/* Append modal inner HTML */
const modalInnerHTML = (action, idList) => {
    const form = document.getElementById('fm1_form');
    switch (action) {
        case 'create':
            document.getElementById('actionModalLabel').innerText = 'Create Producer';
            form.action = '/admin/producers/register';
            form.innerHTML = `
                <div class="form-group">
                    <input type="text" name="username" class="fm1-form-field" id="username" placeholder="Username" required>
                    <label for="username" class="form-label">Username</label>
                    <div class="errorTag" data-target-field="username"></div>
                </div>
                <div class="form-group">
                    <input type="text" name="firstName" class="fm1-form-field" id="firstName" placeholder="First name" required>
                    <label for="firstName" class="form-label">First name</label>
                    <div class="errorTag" data-target-field="firstName"></div>
                </div>
                <div class="form-group">
                    <input type="text" name="lastName" class="fm1-form-field" id="lastName" placeholder="Last name" required>
                    <label for="lastName" class="form-label">Last name</label>
                    <div class="errorTag" data-target-field="lastName"></div>
                </div>
                <div class="form-group">
                    <input type="tel" name="mobilePhone" class="fm1-form-field" id="mobilePhone" placeholder="Mobile phone" required>
                    <label for="mobilePhone" class="form-label">Mobile phone</label>
                    <div class="errorTag" data-target-field="mobilePhone"></div>
                </div>
                <div class="form-group">
                    <input type="email" name="email" class="fm1-form-field" id="email" placeholder="Email" required>
                    <label for="email" class="form-label">Email Address</label>
                    <div class="errorTag" data-target-field="email"></div>
                </div>
                <div class="form-group">
                    <select name="role" class="fm1-form-select-field" placeholder="Role" required>
                        <option value="basic" selected>Basic</option>
                        <option value="author">Author</option>
                        <option value="editor">Editor (ΔΣ / ΡΟΗ)</option>
                        <option value="admin">Admin</option>
                    </select>
                    <label for="role" class="form-label">Role</label>
                    <div class="errorTag" data-target-field="role"></div>
                </div>
            `;
            break;
        case 'role':
            document.getElementById('actionModalLabel').innerText = 'Change Role';
            form.action = '/admin/producers/bulk?action=role';
            form.innerHTML = `
            <input type="hidden" name="idList" value="${idList}"/>
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
                <input type="hidden" name="idList" value="${idList}"/>
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
                <input type="hidden" name="idList" value="${idList}"/>
                <p>You are about to <b>delete ${idList.length} producer(s)</b>. This action is <b>permanent</b>.<br>Are you sure???</p>
            `;
            break;
    }
};

/* Add event listeners on checkboxes */
const addCheckboxEvents = () => {
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
};

/* Add action modal events */
const actionModal = document.getElementById('actionModal');
actionModal.addEventListener('show.bs.modal', e => {
    /* Get selected checkboxes */
    const idList = [];
    [...document.querySelectorAll('.action-checkbox:checked')].forEach(el => idList.push(el.dataset.id));
    /* Setup action modal title and form */
    modalInnerHTML(e.relatedTarget.dataset.action, idList);
});
