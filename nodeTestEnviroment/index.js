var libraryName = "LibraryA";

function librarySystem(libraryName, callbackFn) {
    librarySystem.libraries = librarySystem.libraries || {};
    if (typeof callbackFn === "function") {
        librarySystem.libraries[libraryName] = callbackFn();
    } else {
        return librarySystem.libraries[libraryName];
    }
}

(function() {
    var libraryName = "LibraryB";
    librarySystem(libraryName, function() {
        return { getBookTitle: function() { return "Insanely Simple"; }}
    });
})();

console.log(libraryName); 
console.log(librarySystem("LibraryB").getBookTitle()); 