/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./main.ts":
/*!*****************!*\
  !*** ./main.ts ***!
  \*****************/
/***/ (() => {

eval("const htmlContent = `\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Plugin UI</title>\n</head>\n<body>\n  <h1>Hello Figma Plugin!</h1>\n  <button id=\"createRect\">Click Me</button>\n  <script>\n    document.getElementById('createRect').addEventListener('click', function() {\n      parent.postMessage({ pluginMessage: { type: 'create-rectangle' } }, '*');\n    });\n  </script>\n</body>\n</html>\n`;\n\n\n// code.ts (TypeScript file)\nfigma.showUI(htmlContent); // Show the HTML interface\nfigma.ui.resize(300, 400); // Set the initial size\n\n// Handle messages from the UI\nfigma.ui.onmessage = async (msg) => {\n  if (msg.type === \"create-rectangle\") {\n    const rect = figma.createRectangle();\n    rect.x = figma.viewport.center.x;\n    rect.y = figma.viewport.center.y;\n    figma.currentPage.appendChild(rect);\n    figma.currentPage.selection = [rect];\n    figma.viewport.scrollAndZoomIntoView([rect]);\n\n    // Notify the UI that the rectangle is created\n    figma.ui.postMessage({ type: \"rectangle-created\" });\n  }\n};\n\n//# sourceURL=webpack://typescriptfigma/./main.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./main.ts"]();
/******/ 	
/******/ })()
;