/* Update status indicator colors and text */
const updateStatusIndicator = user => {
    const statusIndicator = document.getElementById(`${user._id}_statusIndicator`);
    const statusTextIndicator = document.getElementById(`${user._id}_statusTextIndicator`);

    statusIndicator.setAttribute('class', `text-${user.status.isActive ? (user.status.isVisible ? 'success' : 'warning') : 'danger'} me-3`);
    statusTextIndicator.innerText = `${user.status.isActive ? 'Active' : 'Inactive'} / ${user.status.isVisible ? 'Visible' : 'Hidden'} `;
};

/* Request to change user's status */
const changeStatusRequest = (userId, status) =>
    new Promise((resolve, reject) => {
        isVisible.disabled = true;
        isActive.disabled = true;

        fetch(`/admin/users/status/${userId}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(status),
        })
            .then(res => res.json())
            .then(res => resolve(res))
            .then(() => {
                isVisible.disabled = false;
                isActive.disabled = false;
            })
            .catch(err => reject(err));
    });

/* Add modal events */
const addModalEvents = () => {
    /* Setup delete modal */
    const deleteUserModal = document.getElementById('deleteUserModal');
    deleteUserModal.addEventListener('show.bs.modal', e => {
        const user = JSON.parse(e.relatedTarget.dataset.user);
        document.getElementById('userDeleteTag').innerHTML = `<b>${user.profile.firstName} ${user.profile.lastName}</b>`;
    });

    /* Setup stuatus modal */
    const userStatusModal = document.getElementById('userStatusModal');
    userStatusModal.addEventListener('show.bs.modal', e => {
        const user = JSON.parse(e.relatedTarget.dataset.user);
        document.getElementById('userStatusTag').innerText = `${user.profile.firstName} ${user.profile.lastName}`;

        const statusSwitches = [...document.querySelectorAll('.status-switch')];
        statusSwitches.forEach(s_switch => {
            if (s_switch.id === 'isActive') s_switch.checked = user.status.isActive;
            else if (s_switch.id === 'isVisible') s_switch.checked = user.status.isVisible;

            s_switch.addEventListener('click', async e => {
                let status = {};
                status[`${e.target.id}`] = e.target.checked;
                const userStatus = await changeStatusRequest(user._id, status);
                updateStatusIndicator(userStatus);
            });
        });

        document.getElementById('isVerified').checked = user.status.isVerified;
    });
};
