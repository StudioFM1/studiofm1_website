/* Get rounded canvas */
function getRoundedCanvas(sourceCanvas) {
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
}

/* Crop image and return rounded canvas */
function cropImage(cropper) {
    /* Crop, Round image and Show */
    const croppedCanvas = cropper.getCroppedCanvas({ width: 210, height: 210 });
    return getRoundedCanvas(croppedCanvas);
}

/* Show new image as avatar, show edit and submit buttons */
function modifyForm(roundedCanvas) {
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
}

/* Load nescessary linteners for avatar load, crop and upload */
function addAvatarFormEvents() {
    /* File input */
    const fileInput = document.getElementById('avatarInput');
    /* Modal element and Bootstap Modal instance */
    const avatarModal = document.getElementById('avatarModal');
    const modalInstance = new bootstrap.Modal(avatarModal, { keyboard: false });
    /* New avatar img element */
    const image = document.getElementById('newAvatar');
    /* Crop button */
    const cropButton = document.getElementById('cropButton');

    /* Cropper variables */
    let cropper = null;
    let croppable = false;
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
                croppable = true;
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
    fileInput.addEventListener('change', () => {
        image.src = URL.createObjectURL(fileInput.files[0]);
        modalInstance.show();
    });

    /* On crop button click, crop iamge, modify form elements, hide modal */
    cropButton.addEventListener('click', () => {
        if (!croppable) return;
        const roundedCanvas = cropImage(cropper);
        modifyForm(roundedCanvas);
        modalInstance.hide();
    });
}
