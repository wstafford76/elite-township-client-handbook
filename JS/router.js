/* ==========================================================
   Elite Township Properties
   Client Handbook Router
   Version 3.1
========================================================== */

"use strict";

const Router = {

    pages: {
        dashboard: "Pages/dashboard.html",
        buyer: "Pages/buyer.html",
        seller: "Pages/seller.html",
        tenant: "Pages/tenant.html",
        landlord: "Pages/landlord.html",
        resources: "Pages/resources.html",
        forms: "Pages/forms.html",
        faq: "Pages/faq.html",
        contact: "Pages/contact.html"
    },

    container: null,

    async initialize() {

        this.container = document.getElementById("page-container");

        this.bindNavigation();

        await this.loadPage("dashboard");

    },

    bindNavigation() {

    document.addEventListener("click", async (event) => {

        const button = event.target.closest("[data-page]");

        if (!button) {
            return;
        }

        const page = button.dataset.page;

        await this.loadPage(page);

        document
            .querySelectorAll(".nav-link")
            .forEach(btn => btn.classList.remove("active"));

        if (button.classList.contains("nav-link")) {
            button.classList.add("active");
        }

    });

},

    async loadPage(page) {

        if (!this.pages[page]) {

            this.showError(page);

            return;

        }

        try {

            this.container.innerHTML = `
                <div class="loading-screen">
                    <h2>Loading...</h2>
                </div>
            `;

            const response = await fetch(this.pages[page]);

            if (!response.ok) {

                throw new Error("Unable to load page.");

            }

            const html = await response.text();

            this.container.innerHTML = html;
            window.scrollTo(0, 0);

            document.title =
                `Elite Township Properties | ${this.getTitle(page)}`;

        }

        catch (error) {

            this.showError(page);

            console.error(error);

        }

    },

    getTitle(page) {

        const titles = {

            dashboard: "Dashboard",

            buyer: "Buyer Guide",

            seller: "Seller Guide",

            tenant: "Tenant Guide",

            landlord: "Landlord Guide",

            resources: "Resources",

            forms: "Forms",

            faq: "Frequently Asked Questions",

            contact: "Contact"

        };

        return titles[page] || "Client Handbook";

    },

    showError(page) {

        this.container.innerHTML = `

            <section class="error-page">

                <h2>Page Not Found</h2>

                <p>

                    The page "${page}" could not be loaded.

                </p>

            </section>

        `;

    }

};

document.addEventListener("DOMContentLoaded", () => {

    Router.initialize();

});