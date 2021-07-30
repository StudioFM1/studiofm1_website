/* Log messages about the avatar form submission */
const logAvatarError = error => {
    const avatarMessage = document.getElementById('avatarMessage');
    avatarMessage.innerHTML = error;
    avatarMessage.setAttribute('class', 'alert alert-danger');
};

/* Get rounded canvas */
const getRoundedCanvas = sourceCanvas => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const width = sourceCanvas.width;
    const height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
    context.fill();
    return canvas;
};

/* Crop image and return rounded canvas */
const cropImage = cropper => {
    /* Crop, Round image and Show */
    const croppedCanvas = cropper.getCroppedCanvas({ width: 210, height: 210 });
    return getRoundedCanvas(croppedCanvas);
};

/* Show new image as avatar, show edit and submit buttons */
const modifyForm = roundedCanvas => {
    /* Get form elements */
    const avatarButtons = document.getElementById('avatarButtons');
    const avatarFigure = document.getElementById('avatarFigure');
    let editButton = document.getElementById('editAvatar');

    if (!editButton) {
        /* Create button and set attributes */
        editButton = document.createElement('button');
        editButton.setAttribute('id', 'editAvatar');
        editButton.setAttribute('class', 'btn btn-secondary');
        editButton.setAttribute('type', 'button');
        editButton.setAttribute('data-bs-toggle', 'modal');
        editButton.setAttribute('data-bs-target', `#${avatarModal.id}`);
        editButton.innerText = 'Edit';
        /* Append as first child */
        avatarButtons.insertBefore(editButton, avatarButtons.firstChild);
    }

    avatarFigure.style.backgroundImage = `url("${roundedCanvas.toDataURL('image/png', 0.1)}")`;
    if (avatarButtons.classList.contains('d-none')) avatarButtons.classList.remove('d-none');
};

/* Validate size is up to 5 MB */
const sizeOk = file => {
    const fileSize = parseFloat((file.size / 1024 / 1024).toFixed(4)); // MB
    return fileSize > 5 ? false : true;
};

/* Form request and submit form */
const submitAvatarForm = () =>
    new Promise((resolve, reject) => {
        const form = document.getElementById('avatarForm');
        const formFields = new FormData(form);
        let data = {};
        for (const [name, value] of formFields) data[name] = value;

        fetch(form.action, {
            method: form.method,
            body: formFields,
        })
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
    });

/* Load nescessary linteners for avatar load, crop and upload */
const addAvatarFormEvents = () => {
    /* Modal elements */
    const avatarModal = document.getElementById('avatarModal');
    const modalInstance = new bootstrap.Modal(avatarModal, { keyboard: false });
    const image = document.getElementById('newAvatar'); // Image in modal-content

    /* Cropper variables */
    let cropper = null;
    let cropBoxData = null;
    let canvasData = null;

    /* Load cropper when modal is fully loaded */
    avatarModal.addEventListener('shown.bs.modal', () => {
        cropper = new Cropper(image, {
            autoCropArea: 0.5,
            aspectRatio: 1,
            viewMode: 1,
            dragMode: 'move',
            movable: true,
            ready: () => {
                cropper.zoomTo(1);
                cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
            },
        });
    });

    /* Destroy cropper when modal is goint to hide */
    avatarModal.addEventListener('hide.bs.modal', () => {
        cropBoxData = cropper.getCropBoxData();
        canvasData = cropper.getCanvasData();
        cropper.destroy();
    });

    /* On file input change, load new Avatar on modal body and show modal */
    const fileInput = document.getElementById('userAvatar');
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (sizeOk(file)) {
            image.src = URL.createObjectURL(file);
            modalInstance.show();
        } else {
            logAvatarError('The file is too large. Please choose a file up to <b>5 MB</b>');
        }
    });

    /* On crop button click, crop iamge, modify form elements, hide modal */
    const cropButton = document.getElementById('cropButton');
    cropButton.addEventListener('click', () => {
        const roundedCanvas = cropImage(cropper);
        modifyForm(roundedCanvas);
        modalInstance.hide();
    });

    /* Submit avatar form, display feedback if in any */
    const submitAvatar = document.getElementById('submitAvatar');
    submitAvatar.addEventListener('click', async e => {
        e.preventDefault(); /* Submit query and get response */

        try {
            submitAvatar.disabled = true;
            const res = await submitAvatarForm();
            submitAvatar.disabled = false;

            if (res.errors?.length) return logAvatarError(...res.errors);
            location.reload();
        } catch (err) {
            logAvatarError(err);
        }
    });
};
