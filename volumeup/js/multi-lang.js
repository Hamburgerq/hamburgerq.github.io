        document.addEventListener('DOMContentLoaded', function() { //要修改，值不對
            const languageSelect = document.querySelector('#language-select');
            // --- 1. Set the initial combobox selection based on the current URL ---
            // Get the language prefix from the current URL (e.g., 'en', 'es', 'fr')
            // Assumes URL structure like /en/page, /es/page
            const currentPathname = window.location.pathname; // /language/en/index.html
            const pathSegments = currentPathname.split('/');  //["", "language", "en", "index.html"]
            const currentLangPrefix = pathSegments[2];  // "en"

            //console.log(currentPathname)
            //console.log(pathSegments)
            //console.log(currentLangPrefix)
            // Set the combobox value to the current language
            if (currentLangPrefix && languageSelect.querySelector(`option[value="${currentLangPrefix}"]`)) {
                languageSelect.value = currentLangPrefix;
            } else {
                languageSelect.value = 'en';
            }


            // --- 2. Add event listener for language change ---
            languageSelect.addEventListener('change', function() {
                let newUrl;
                const selectedLang = this.value; // Get the chosen language code (e.g., 'es')

                // Get the current page's path without the language prefix
                // e.g., if currentPathname is "/en/about", we want "/about"
                //const pagePathWithoutLang = currentPathname.replace(/^\/(en|es|fr)\/?/, '/');
                const pagePathWithoutLang = currentPathname.split("/").pop();

                // The regex `^\/(en|es|fr)\/?` matches the leading slash, the language code, and an optional trailing slash
                // and replaces it with a single slash, ensuring we get "/about" or "/" for homepage

                // Construct the new URL
                    console.log(pathSegments.length);
                if (pathSegments.length > 3) {
                  newUrl = 	`../`+ `${selectedLang}` + `/` + `${pagePathWithoutLang}`;
                  //console.log(newUrl);
                } else {
                  newUrl = 	`language/` + `${selectedLang}` + `/index.html`;
                  //console.log(newUrl);
                }

                // Redirect the browser to the new URL
                // Using window.location.href will add an entry to the browser history
                // window.location.replace(newUrl) will replace the current history entry (better for language switching)
                window.location.href = newUrl;
            });
        });


