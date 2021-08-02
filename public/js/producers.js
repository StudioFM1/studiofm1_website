/* Update status indicator colors and text */
const updateStatusIndicator = producer => {
    const statusIndicator = document.getElementById(`${producer._id}_statusIndicator`);
    const statusTextIndicator = document.getElementById(`${producer._id}_statusTextIndicator`);

    statusIndicator.setAttribute('class', `text-${producer.status.isActive ? (producer.status.isVisible ? 'success' : 'warning') : 'danger'} me-3`);
    statusTextIndicator.innerText = `${producer.status.isActive ? 'Active' : 'Inactive'} / ${producer.status.isVisible ? 'Visible' : 'Hidden'} `;
};

/* Request to change producer's status */
const changeStatusRequest = (producerId, status) =>
    new Promise((resolve, reject) => {
        isVisible.disabled = true;
        isActive.disabled = true;

        fetch(`/admin/producers/status/${producerId}`, {
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
    const deleteProducerModal = document.getElementById('deleteProducerModal');
    deleteProducerModal.addEventListener('show.bs.modal', e => {
        const producer = JSON.parse(e.relatedTarget.dataset.producer);
        document.getElementById('producerDeleteTag').innerHTML = `<b>${producer.profile.firstName} ${producer.profile.lastName}</b>`;
    });

    /* Setup stuatus modal */
    const producerStatusModal = document.getElementById('producerStatusModal');
    producerStatusModal.addEventListener('show.bs.modal', e => {
        const producer = JSON.parse(e.relatedTarget.dataset.producer);
        document.getElementById('producerStatusTag').innerText = `${producer.profile.firstName} ${producer.profile.lastName}`;

        const statusSwitches = [...document.querySelectorAll('.status-switch')];
        statusSwitches.forEach(s_switch => {
            if (s_switch.id === 'isActive') s_switch.checked = producer.status.isActive;
            else if (s_switch.id === 'isVisible') s_switch.checked = producer.status.isVisible;

            s_switch.addEventListener('click', async e => {
                let status = {};
                status[`${e.target.id}`] = e.target.checked;
                const producerStatus = await changeStatusRequest(producer._id, status);
                updateStatusIndicator(producerStatus);
            });
        });

        document.getElementById('isVerified').checked = producer.status.isVerified;
    });
};
