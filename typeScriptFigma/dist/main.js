var Plugin;
/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*****************!*\
  !*** ./main.ts ***!
  \*****************/
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
Plugin = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGlCQUFpQiw0QkFBNEI7QUFDeEUsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBLDJCQUEyQjtBQUMzQiwyQkFBMkI7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCQUEyQiwyQkFBMkI7QUFDdEQ7QUFDQSxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vUGx1Z2luLy4vbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBodG1sQ29udGVudCA9IGBcbjwhRE9DVFlQRSBodG1sPlxuPGh0bWw+XG48aGVhZD5cbiAgPHRpdGxlPlBsdWdpbiBVSTwvdGl0bGU+XG48L2hlYWQ+XG48Ym9keT5cbiAgPGgxPkhlbGxvIEZpZ21hIFBsdWdpbiE8L2gxPlxuICA8YnV0dG9uIGlkPVwiY3JlYXRlUmVjdFwiPkNsaWNrIE1lPC9idXR0b24+XG4gIDxzY3JpcHQ+XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NyZWF0ZVJlY3QnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgcGFyZW50LnBvc3RNZXNzYWdlKHsgcGx1Z2luTWVzc2FnZTogeyB0eXBlOiAnY3JlYXRlLXJlY3RhbmdsZScgfSB9LCAnKicpO1xuICAgIH0pO1xuICA8L3NjcmlwdD5cbjwvYm9keT5cbjwvaHRtbD5cbmA7XG5cblxuLy8gY29kZS50cyAoVHlwZVNjcmlwdCBmaWxlKVxuZmlnbWEuc2hvd1VJKGh0bWxDb250ZW50KTsgLy8gU2hvdyB0aGUgSFRNTCBpbnRlcmZhY2VcbmZpZ21hLnVpLnJlc2l6ZSgzMDAsIDQwMCk7IC8vIFNldCB0aGUgaW5pdGlhbCBzaXplXG5cbi8vIEhhbmRsZSBtZXNzYWdlcyBmcm9tIHRoZSBVSVxuZmlnbWEudWkub25tZXNzYWdlID0gYXN5bmMgKG1zZykgPT4ge1xuICBpZiAobXNnLnR5cGUgPT09IFwiY3JlYXRlLXJlY3RhbmdsZVwiKSB7XG4gICAgY29uc3QgcmVjdCA9IGZpZ21hLmNyZWF0ZVJlY3RhbmdsZSgpO1xuICAgIHJlY3QueCA9IGZpZ21hLnZpZXdwb3J0LmNlbnRlci54O1xuICAgIHJlY3QueSA9IGZpZ21hLnZpZXdwb3J0LmNlbnRlci55O1xuICAgIGZpZ21hLmN1cnJlbnRQYWdlLmFwcGVuZENoaWxkKHJlY3QpO1xuICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IFtyZWN0XTtcbiAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcoW3JlY3RdKTtcblxuICAgIC8vIE5vdGlmeSB0aGUgVUkgdGhhdCB0aGUgcmVjdGFuZ2xlIGlzIGNyZWF0ZWRcbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6IFwicmVjdGFuZ2xlLWNyZWF0ZWRcIiB9KTtcbiAgfVxufTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=