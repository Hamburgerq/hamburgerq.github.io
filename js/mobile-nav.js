let headerMain = document.querySelector(".header-main");
let headerMobileBtn = document.querySelector(".mobile-menu-btn");
let navLinks = document.querySelectorAll(".header-main nav ul li a"); // Get all navigation links
let body = document.querySelector("body"); // Get the body element


let isMenuOpen = false;
const MOBILE_WIDTH_THRESHOLD = 768;

headerMobileBtn.onclick = function() {
    if (window.innerWidth <= MOBILE_WIDTH_THRESHOLD){
      if (!isMenuOpen) {
          headerMain.classList.add("mobile-menu-open");
          body.classList.add("no-scroll");
          isMenuOpen = true;
      }
      else if (isMenuOpen){
          headerMain.classList.remove("mobile-menu-open");
          body.classList.remove("no-scroll");
          isMenuOpen = false;
      }
    }
}



// Add event listeners to each navigation link
navLinks.forEach(link => {
    link.addEventListener('click', function(event) {

        const tempLink = document.createElement('a');
        tempLink.href = this.href; // 'this' refers to the clicked link (<a> tag)

        // Get the current page's hostname and pathname
        const currentHostname = window.location.hostname;
        const currentPathname = window.location.pathname;

        // Get the clicked link's hostname and pathname
        const clickedHostname = tempLink.hostname;
        const clickedPathname = tempLink.pathname;

        // Compare hostnames and pathnames
        // If the hostname or pathname is different, it's a new page
        // If the hostname and pathname are the same, but the hash is different, it's an anchor on the same page
        if (currentHostname !== clickedHostname || currentPathname !== clickedPathname) {
            // This is a new page (or different domain), js will reload while load html
            headerMain.classList.remove("mobile-menu-open");
            body.classList.remove("no-scroll"); 
            isMenuOpen = false;
        } else if (tempLink.hash && tempLink.hash !== window.location.hash) {
            // This is an anchor link on the same page (e.g., #previous-version-h1)
            // In this case, no full page reload occurs, so we must close the menu explicitly.
            headerMain.classList.remove("mobile-menu-open");
            body.classList.remove("no-scroll"); 
            isMenuOpen = false;
        }
        // If it's the same page and same hash (or no hash), do nothing,
        // or add specific handling if needed (e.g., prevent default if already at anchor).
        
    })
})

window.addEventListener('resize', () => {
    if (window.innerWidth >= MOBILE_WIDTH_THRESHOLD){
      headerMain.style.display = "flex"; // For desktop, always show as flex
      headerMain.classList.remove("mobile-menu-open"); // Ensure class is removed if resizing up
      body.classList.remove("no-scroll"); 
      isMenuOpen = false; // Reset flag for desktop
    } else {
      // When resizing down to mobile, if not already open, hide it

      headerMain.classList.remove("mobile-menu-open"); // Hide if not explicitly open
      body.classList.remove("no-scroll"); 
      isMenuOpen = false; // Reset flag for mobile
    }
})