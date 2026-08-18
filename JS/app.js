/* ==========================================================
   Elite Township Properties
   Interactive Client Handbook
   Version 3.1
   app.js
   Handles application UI only.
   Page routing is handled by router.js.
========================================================== */

"use strict";

const App = {

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
           SEARCH CLOSE BUTTON
        ============================== */

        if (this.searchClose) {

            this.searchClose.addEventListener("click", () => {

                this.closeSearch();

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
           OUTSIDE THE SEARCH PANEL
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
