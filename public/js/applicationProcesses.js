window.onload = () => {
    document.getElementById("platformNew").nextElementSibling.addEventListener('keydown', newRowEnter);
    document.getElementById("platformNew").addEventListener('change', newRowCheck);
    document.getElementById("categoryNew").nextElementSibling.addEventListener('keydown', newRowEnter);
    document.getElementById("categoryNew").addEventListener('change', newRowCheck);

    InitToolTips();
}

function resizeAndPreviewFile(selectedElement) {
    /** 
     * This function will try to resize the desired image using a canvas 
     * and send the resized image to the server for storage. 
     * If resizing fails, the original image file will be sent to the server
     * and the image will be resized on the server before storage.
    */
    var preview = document.querySelector(selectedElement);
    var imageFile = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();
    reader.onloadend = function (e) {
        var img = document.createElement("img");
        img.onload = function (event) {
            preview.removeAttribute("width");
            preview.removeAttribute("height");
            var MAX_WIDTH = 300;
            var MAX_HEIGHT = 300;
            /** 
             * Workaround for a bug in Firefox affecting certain
             * SVG image files without width or height properties
             */
            if (!img.width || !img.height) {
                preview.src = reader.result;
                // Resizing logic
                if (preview.width > preview.height) {
                    preview.height = preview.height * (MAX_WIDTH / preview.width);
                    preview.width = MAX_WIDTH;
                } else {
                    preview.width = preview.width * (MAX_HEIGHT / preview.height);
                    preview.height = MAX_HEIGHT;
                }
                let hiddenPhoto = document.getElementById("browserResizedImage");
                if (hiddenPhoto) {
                    hiddenPhoto.remove();
                }
                document.getElementById("displayPhoto").name = "displayPhoto";
            } else {
                var width = img.width;
                var height = img.height;
                var posX = 0;
                var posY = 0;

                // Resizing logic
                if (width > height) {
                    height = height * (MAX_WIDTH / width);
                    width = MAX_WIDTH;
                    posY = Math.abs(width - height) / 2;
                } else {
                    width = width * (MAX_HEIGHT / height);
                    height = MAX_HEIGHT;
                    posX = Math.abs(width - height) / 2;
                }
                // Dynamically create a canvas element
                var canvas = document.createElement("canvas");
                canvas.width = MAX_WIDTH;
                canvas.height = MAX_HEIGHT;

                // var canvas = document.getElementById("canvas");
                var ctx = canvas.getContext("2d");

                // Actual resizing
                ctx.drawImage(img, posX, posY, width, height);
                var dataurl = canvas.toDataURL(imageFile.type);
                preview.src = dataurl;

                /**
                 * Create a hiden input if necessary
                 */
                let hiddenPhoto = document.getElementById("browserResizedImage");
                if (!hiddenPhoto) {
                    hiddenPhoto = document.createElement("input");
                    hiddenPhoto.type = "hidden";
                    hiddenPhoto.id = "browserResizedImage";
                    hiddenPhoto.name = "displayPhoto";
                    preview.parentElement.appendChild(hiddenPhoto);
                }
                hiddenPhoto.value = dataurl;
                document.getElementById("displayPhoto").removeAttribute("name");
            }
        }
        img.src = e.target.result;
    }
    if (imageFile) {
        reader.readAsDataURL(imageFile);
    }
}

function newListElement(_this) {
    let type = _this.previousElementSibling.name;
    if (type != "platform" && type != "category" || _this.value.trim() == "") {
        return false;
    }
    let newDiv = document.createElement("div");
    let newElement = inputToLabel(_this);
    newElement.addEventListener('dblclick', editRow);
    _this.parentElement.appendChild(newElement);

    newDiv.className = "form-check";

    newElement = document.createElement("input");
    newElement.className = "form-check-input";
    newElement.type = "checkbox";
    newElement.id = type + "New";
    newElement.name = type;
    newElement.addEventListener('change', newRowCheck);
    newDiv.appendChild(newElement);

    newElement = document.createElement("input");
    newElement.className = "form-control";
    newElement.type = "text";
    newElement.setAttribute("placeHolder", "Create new " + type);
    newElement.setAttribute("data-bs-toggle", "tooltip");
    newElement.setAttribute("data-bs-placement", "top");
    newElement.setAttribute("data-bs-original-title", "Press Enter to create the " + type);
    newElement.setAttribute("aria-label", "Press Enter to create the " + type);
    newElement.addEventListener('keydown', newRowEnter);
    newDiv.appendChild(newElement);

    newElement = document.createElement("li");
    newElement.className = "list-group-item";
    newElement.setAttribute("aria-disabled", "true");
    newElement.appendChild(newDiv);
    document.getElementById(type + "-list").appendChild(newElement);
    _this.remove();
    [...document.getElementsByClassName("tooltip")].forEach(elem => { elem.remove(); });
    InitToolTips();
    return true;
}

function newRowEnter(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        if (e.target.value.trim() != "") {
            e.target.removeEventListener('keydown', newRowEnter);
            return newListElement(e.target);
        }
        return false;
    }
}

function editRow(e) {
    let _this = e.target;
    let input = document.createElement("input");
    // If the edition is incomplete, the checkbox must be empty
    _this.previousElementSibling.checked = false;
    input.className = "form-control";
    input.type = "text";
    input.setAttribute("data-bs-toggle", "tooltip");
    input.setAttribute("data-bs-placement", "top");
    input.setAttribute("title", "Press enter to finish editing");
    input.id = _this.id;
    input.value = _this.innerText;
    input.addEventListener('keydown', finishEdit);
    _this.parentElement.appendChild(input);
    _this.removeEventListener('dblclick', editRow);
    _this.remove();
}

function finishEdit(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        if (e.target.value.trim() != "") {
            let newElement = inputToLabel(e.target);
            newElement.addEventListener('dblclick', editRow);
            e.target.parentElement.appendChild(newElement);
            e.target.removeEventListener('keydown', finishEdit);
            e.target.remove();
        }
    }
}

function newRowCheck(e) {
    let _this = e.target;
    if (_this.checked) {
        if (newListElement(_this.nextElementSibling)) {
            _this.nextElementSibling.removeEventListener('keydown', newRowEnter);
        } else {
            // Do not allow a checked box for an empty text input
            _this.checked = false;
        }
    }
}

function InitToolTips() {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
}

function inputToLabel(_this) {
    let sibling = _this.previousElementSibling;
    let newElement = document.createElement("label");

    sibling.removeEventListener('change', newRowCheck);
    sibling.id = sibling.name + _this.value;
    sibling.value = _this.value;
    sibling.checked = true;

    newElement.setAttribute("class", "form-check-label");
    newElement.setAttribute("for", _this.previousElementSibling.id);
    newElement.innerText = _this.value;
    return newElement;
}
