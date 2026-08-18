/* ==========================================================
   Elite Township Properties
   Interactive Client Handbook
   Version 3.1
   app.js
   Handles application UI and handbook search.
   Page routing is handled by router.js.
========================================================== */

"use strict";

const App = {

    searchPages: {
        dashboard: {
            title: "Dashboard",
            path: "Pages/dashboard.html"
        },

        buyer: {
            title: "Buyer Guide",
            path: "Pages/buyer.html"
        },

        seller: {
            title: "Seller Guide",
            path: "Pages/seller.html"
        },

        tenant: {
            title: "Tenant Guide",
            path: "Pages/tenant.html"
        },

        landlord: {
            title: "Landlord Guide",
            path: "Pages/landlord.html"
        },

        resources: {
            title: "Resources",
            path: "Pages/resources.html"
        },

        forms: {
            title: "Forms",
            path: "Pages/forms.html"
        },

        faq: {
            title: "Frequently Asked Questions",
            path: "Pages/faq.html"
        },

        contact: {
            title: "Contact",
            path: "Pages/contact.html"
        }
    },


    initialize() {

        this.cacheElements();
        this.bindEvents();
        this.handleResize();

        console.log("Elite Township Properties UI Loaded");

    },


    cacheElements() {

        this.sidebar = document.getElementById("sidebar");
        this.menuButton = document.getElementById("menuToggle");

        this.searchToggle = document.getElementById("searchToggle");
        this.searchOverlay = document.getElementById("searchOverlay");
        this.searchClose = document.getElementById("searchClose");
        this.searchInput = document.getElementById("searchInput");
        this.searchResults = document.getElementById("searchResults");

    },


    bindEvents() {

        /* ==============================
           SIDEBAR MENU
        ============================== */

        if (this.menuButton) {

            this.menuButton.addEventListener("click", () => {

                this.toggleSidebar();

            });

        }


        /* ==============================
           SEARCH OPEN
        ============================== */

        if (this.searchToggle) {

            this.searchToggle.addEventListener("click", () => {

                this.openSearch();

            });

        }


        /* ==============================
           SEARCH CLOSE
        ============================== */

        if (this.searchClose) {

            this.searchClose.addEventListener("click", () => {

                this.closeSearch();

            });

        }


        /* ==============================
           SEARCH INPUT
        ============================== */

        if (this.searchInput) {

            this.searchInput.addEventListener("input", () => {

                this.searchHandbook(this.searchInput.value);

            });

        }


        /* ==============================
           SEARCH RESULT CLICK
        ============================== */

        if (this.searchResults) {

            this.searchResults.addEventListener("click", async (event) => {

                const result = event.target.closest("[data-search-page]");

                if (!result) return;

                const page = result.dataset.searchPage;

                this.closeSearch();

                if (typeof Router !== "undefined") {

                    await Router.loadPage(page);

                    document
                        .querySelectorAll(".nav-link")
                        .forEach(button => {

                            button.classList.remove("active");

                        });

                    const navButton = document.querySelector(
                        `.nav-link[data-page="${page}"]`
                    );

                    if (navButton) {

                        navButton.classList.add("active");

                    }

                }

            });

        }


        /* ==============================
           WINDOW RESIZE
        ============================== */

        window.addEventListener("resize", () => {

            this.handleResize();

        });


        /* ==============================
           ESCAPE KEY
        ============================== */

        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {

                this.closeSidebar();
                this.closeSearch();

            }

        });


        /* ==============================
           CLOSE SEARCH WHEN CLICKING
           OUTSIDE SEARCH PANEL
        ============================== */

        if (this.searchOverlay) {

            this.searchOverlay.addEventListener("click", (event) => {

                if (event.target === this.searchOverlay) {

                    this.closeSearch();

                }

            });

        }


        /* ==============================
           SHARE HANDBOOK
        ============================== */

        document.addEventListener("click", async (event) => {

            const shareButton = event.target.closest("#shareHandbook");

            if (!shareButton) return;

            const shareData = {

                title: "Elite Township Properties | Client Handbook",

                text: "Check out the Elite Township Properties Interactive Client Handbook.",

                url: window.location.href

            };

            try {

                if (navigator.share) {

                    await navigator.share(shareData);

                } else {

                    await navigator.clipboard.writeText(window.location.href);

                    const originalText = shareButton.textContent;

                    shareButton.textContent = "✓ Link Copied!";

                    setTimeout(() => {

                        shareButton.textContent = originalText;

                    }, 2000);

                }

            } catch (error) {

                console.log("Share cancelled or unavailable.");

            }

        });

    },


    /* ==============================
       SIDEBAR FUNCTIONS
    ============================== */

    toggleSidebar() {

        if (!this.sidebar) return;

        this.sidebar.classList.toggle("sidebar-open");

    },


    closeSidebar() {

        if (!this.sidebar) return;

        this.sidebar.classList.remove("sidebar-open");

    },


    /* ==============================
       SEARCH FUNCTIONS
    ============================== */

    openSearch() {

        if (!this.searchOverlay) return;

        this.searchOverlay.classList.add("search-open");

        setTimeout(() => {

            if (this.searchInput) {

                this.searchInput.focus();

            }

        }, 50);

    },


    closeSearch() {

        if (!this.searchOverlay) return;

        this.searchOverlay.classList.remove("search-open");

    },


    async searchHandbook(query) {

        if (!this.searchResults) return;

        const searchTerm = query.trim().toLowerCase();


        if (searchTerm.length < 2) {

            this.searchResults.innerHTML = `

                <p class="search-placeholder">

                    Search for topics like closing, inspection,
                    deposits, financing, or leases.

                </p>

            `;

            return;

        }


        this.searchResults.innerHTML = `

            <p class="search-placeholder">

                Searching the handbook...

            </p>

        `;


        const matches = [];


        for (const [page, details] of Object.entries(this.searchPages)) {

            try {

                const response = await fetch(details.path);

                if (!response.ok) continue;

                const html = await response.text();

                const temporaryElement = document.createElement("div");

                temporaryElement.innerHTML = html;

                const text = temporaryElement.textContent
                    .replace(/\s+/g, " ")
                    .trim();

                const lowerText = text.toLowerCase();

                const position = lowerText.indexOf(searchTerm);


                if (position !== -1) {

                    const start = Math.max(0, position - 80);

                    const end = Math.min(
                        text.length,
                        position + searchTerm.length + 120
                    );

                    let preview = text.substring(start, end);

                    if (start > 0) {

                        preview = "..." + preview;

                    }

                    if (end < text.length) {

                        preview = preview + "...";

                    }


                    matches.push({

                        page,
                        title: details.title,
                        preview

                    });

                }

            } catch (error) {

                console.error(
                    `Unable to search ${details.path}`,
                    error
                );

            }

        }


        this.displaySearchResults(matches, searchTerm);

    },


    displaySearchResults(matches, searchTerm) {

        if (!this.searchResults) return;


        if (matches.length === 0) {

            this.searchResults.innerHTML = `

                <p class="search-placeholder">

                    No results found for "<strong>${this.escapeHTML(searchTerm)}</strong>".

                </p>

            `;

            return;

        }


        this.searchResults.innerHTML = matches.map(result => `

            <button
                class="search-result"
                data-search-page="${result.page}">

                <span class="search-result-title">

                    ${result.title}

                </span>

                <span class="search-result-preview">

                    ${this.escapeHTML(result.preview)}

                </span>

            </button>

        `).join("");

    },


    escapeHTML(text) {

        const element = document.createElement("div");

        element.textContent = text;

        return element.innerHTML;

    },


    /* ==============================
       RESPONSIVE HANDLING
    ============================== */

    handleResize() {

        if (!this.sidebar) return;

        if (window.innerWidth > 768) {

            this.sidebar.classList.remove("sidebar-open");

        }

    }

};


document.addEventListener("DOMContentLoaded", () => {

    App.initialize();

});
