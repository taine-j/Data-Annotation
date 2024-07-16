const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

imageInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    const image = new Image();
    image.src = event.target.result; 
    image.onload = function() {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height); 
    };
  };

  reader.readAsDataURL(file);
});

const addTextButton = document.getElementById('addTextButton');
let selectedTextBox = null;

addTextButton.addEventListener('click', function() {
  // Create a text element (e.g., using Canvas API)
  // ...

  // Make it draggable (add event listeners)
  // ...
});

const fontFamilySelect = document.getElementById('fontFamily');
const fontSizeSelect = document.getElementById('fontSize');

// ... Event listener to update font family and size of selectedTextBox 







/* const canvasContainer = document.getElementById('canvas-container');
const canvas = document.getElementById('myCanvas');
const textContainer = document.getElementById('text-container');
const ctx = canvas.getContext('2d');
const uploadImageInput = document.getElementById('upload-image');
const fontFamilySelector = document.getElementById('font-family-selector');
const fontSizeSelector = document.getElementById('font-size-selector');

let dragging = false;
let offsetX, offsetY;

// Resize canvas to fit container
canvas.width = canvasContainer.clientWidth;
canvas.height = canvasContainer.clientHeight;

// Function to upload and fit image to canvas
uploadImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
        img.src = event.target.result;
    };

    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    reader.readAsDataURL(file);
});

// Function to add draggable text
function addText() {
    // Set new text properties
    textContainer.textContent = 'Your Text Here';
    textContainer.setAttribute('contenteditable', 'true');
}

// Make text draggable
textContainer.addEventListener('mousedown', (event) => {
    dragging = true;
    offsetX = event.clientX - textContainer.offsetLeft;
    offsetY = event.clientY - textContainer.offsetTop;
});

window.addEventListener('mouseup', () => {
    dragging = false;
});

window.addEventListener('mousemove', (event) => {
    if (dragging) {
        textContainer.style.left = `${event.clientX - offsetX}px`;
        textContainer.style.top = `${event.clientY - offsetY}px`;
    }
});

// Font family selection
fontFamilySelector.addEventListener('change', (event) => {
    textContainer.style.fontFamily = event.target.value;
});

// Font size selection
fontSizeSelector.addEventListener('input', (event) => {
    textContainer.style.fontSize = `${event.target.value}px`;
}); */

// Add additional functionalities (flip, curve, etc) here...