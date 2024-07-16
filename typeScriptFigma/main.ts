const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Plugin UI</title>
</head>
<body>
  <h1>Hello Figma Plugin!</h1>
  <button id="createRect">Click Me</button>
  <script>
    document.getElementById('createRect').addEventListener('click', function() {
      parent.postMessage({ pluginMessage: { type: 'create-rectangle' } }, '*');
    });
  </script>
</body>
</html>
`;


// code.ts (TypeScript file)
figma.showUI(htmlContent); // Show the HTML interface
figma.ui.resize(300, 400); // Set the initial size

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === "create-rectangle") {
    const rect = figma.createRectangle();
    rect.x = figma.viewport.center.x;
    rect.y = figma.viewport.center.y;
    figma.currentPage.appendChild(rect);
    figma.currentPage.selection = [rect];
    figma.viewport.scrollAndZoomIntoView([rect]);

    // Notify the UI that the rectangle is created
    figma.ui.postMessage({ type: "rectangle-created" });
  }
};