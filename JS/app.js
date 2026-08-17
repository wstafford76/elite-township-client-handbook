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

    },

    bindEvents() {

        if (this.menuButton) {

            this.menuButton.addEventListener("click", () => {

                this.toggleSidebar();

            });

        }

        window.addEventListener("resize", () => {

            this.handleResize();

        });

        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {

                this.closeSidebar();

            }

        });

    },

    toggleSidebar() {

        if (!this.sidebar) return;

        this.sidebar.classList.toggle("sidebar-open");

    },

    closeSidebar() {

        if (!this.sidebar) return;

        this.sidebar.classList.remove("sidebar-open");

    },

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