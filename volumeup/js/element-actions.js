let blockLinks = document.querySelectorAll(".expand-block a");
// No need for a global 'openBlock' flag with this improved logic

blockLinks.forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior (e.g., navigating to #)

    let expandBlock = link.parentNode;
    let blockContent = expandBlock.querySelector("p");
    let h3Tag = link.querySelector("h3"); // Define h3Tag here

    // Get all currently open content blocks and their associated h3s
    let currentlyOpenContents = document.querySelectorAll(".expand-content");
    let currentlyOpenH3s = document.querySelectorAll(".expand-content").length > 0 ?
                           document.querySelectorAll(".expand-block p.expand-content").forEach(p => p.previousElementSibling.querySelector("h3")) : [];

    // 1. If the clicked block is already open, close it
    if (blockContent.classList.contains('expand-content')) {
      blockContent.classList.remove("expand-content");
      blockContent.style.opacity = 0; // Ensure opacity is set back to 0
      h3Tag.style.setProperty('--suffix-text', '"▶    "'); // Change arrow to right
    } else {
      // 2. If a different block is open, close it
      currentlyOpenContents.forEach(content => {
        content.classList.remove("expand-content");
        content.style.opacity = 0; // Ensure opacity is set back to 0
        // Find the h3 associated with this closed content block
        let associatedH3 = content.closest('.expand-block').querySelector('h3');
        if (associatedH3) {
          associatedH3.style.setProperty('--suffix-text', '"▶    "'); // Change arrow to right for the closed one
        }
      });

      // 3. Open the clicked block
      blockContent.classList.add("expand-content");
      blockContent.style.opacity = 1; // Set opacity to 1 for the transition
      h3Tag.style.setProperty('--suffix-text', '"▼    "'); // Change arrow to down
    }
  });
});

// The following lines are outside the loop and likely for testing.
// They will cause an error because .my-element is not defined in your news.html.
// Remove them unless you specifically have an element with class 'my-element'.
// const myElement = document.querySelector('.my-element');
// myElement.style.setProperty('--suffix-text', '" (New Suffix)"');
