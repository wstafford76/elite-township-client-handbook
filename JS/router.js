/* ==========================================================
   Elite Township Properties
   Client Handbook Router
   Version 3.2
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

        this.container =
            document.getElementById("page-container");

        this.bindNavigation();

        await this.loadPage("dashboard");

    },


    bindNavigation() {

        document.addEventListener(
            "click",
            async (event) => {

                const button =
                    event.target.closest("[data-page]");

                if (!button) {

                    return;

                }

                const page =
                    button.dataset.page;

                await this.loadPage(page);


                document
                    .querySelectorAll(".nav-link")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );


                if (
                    button.classList.contains("nav-link")
                ) {

                    button.classList.add("active");

                }

            }
        );

    },


    async loadPage(page, sectionTitle = null) {

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


            const response =
                await fetch(this.pages[page]);


            if (!response.ok) {

                throw new Error(
                    "Unable to load page."
                );

            }


            const html =
                await response.text();


            this.container.innerHTML = html;


            document.title =
                `Elite Township Properties | ${this.getTitle(page)}`;


            /*
            =====================================
            SEARCH RESULT NAVIGATION
            =====================================
            */

            if (sectionTitle) {

                this.scrollToSection(sectionTitle);

            } else {

                window.scrollTo(0, 0);

            }

        }

        catch (error) {

            this.showError(page);

            console.error(error);

        }

    },


    scrollToSection(sectionTitle) {

        const headings =
            this.container.querySelectorAll(
                "h1, h2, h3, h4, h5, h6"
            );


        let target = null;


        headings.forEach(heading => {

            const headingText =
                heading.textContent
                    .trim()
                    .toLowerCase();


            if (
                headingText ===
                sectionTitle.trim().toLowerCase()
            ) {

                target = heading;

            }

        });


        if (!target) {

            window.scrollTo(0, 0);

            return;

        }


        /*
        Small delay ensures the page has
        fully rendered before scrolling.
        */

        setTimeout(() => {

            target.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });


            target.classList.add(
                "search-section-highlight"
            );


            setTimeout(() => {

                target.classList.remove(
                    "search-section-highlight"
                );

            }, 2500);

        }, 100);

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

        return titles[page] ||
            "Client Handbook";

    },


    showError(page) {

        this.container.innerHTML = `

            <section class="error-page">

                <h2>Page Not Found</h2>

                <p>

                    The page "${page}"
                    could not be loaded.

                </p>

            </section>

        `;

    }

};


document.addEventListener(
    "DOMContentLoaded",
    () => {

        Router.initialize();

    }
);
