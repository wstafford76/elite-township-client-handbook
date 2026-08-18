/* ==========================================================
   Elite Township Properties
   Client Handbook Router
   Version 3.3
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

                if (!button) return;

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


    async loadPage(
        page,
        sectionTitle = null,
        searchTerm = null
    ) {

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

                this.scrollToSection(
                    sectionTitle,
                    searchTerm
                );

            } else {

                window.scrollTo(0, 0);

            }

        }

        catch (error) {

            this.showError(page);

            console.error(error);

        }

    },


scrollToSection(
    sectionTitle,
    searchTerm = null
) {

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


    setTimeout(() => {

        /*
        Scroll to the section.
        */

        target.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });


        /*
        Wait for the scroll animation
        before applying the highlight.
        */

        setTimeout(() => {

            target.classList.add(
                "search-section-highlight"
            );


            /*
            Highlight searched words
            inside this section.
            */

            if (searchTerm) {

                this.highlightSearchTerm(
                    target,
                    searchTerm
                );

            }


            /*
            Remove section highlight.
            */

            setTimeout(() => {

                target.classList.remove(
                    "search-section-highlight"
                );

            }, 3000);


            /*
            Remove word highlights.
            */

            setTimeout(() => {

                this.removeSearchHighlights();

            }, 5000);

        }, 700);

    }, 100);

},


    highlightSearchTerm(
        target,
        searchTerm
    ) {

        const sectionElements = [];

        let currentElement =
            target.nextElementSibling;


        /*
        Collect everything after the heading
        until the next heading.
        */

        while (currentElement) {

            if (
                /^H[1-6]$/.test(
                    currentElement.tagName
                )
            ) {

                break;

            }


            sectionElements.push(
                currentElement
            );


            currentElement =
                currentElement.nextElementSibling;

        }


        const expression = new RegExp(
            `(${this.escapeRegExp(searchTerm)})`,
            "gi"
        );


        sectionElements.forEach(element => {

            this.highlightTextInElement(
                element,
                expression
            );

        });

    },


    highlightTextInElement(
        element,
        expression
    ) {

        const walker =
            document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                {

                    acceptNode(node) {

                        if (
                            !node.nodeValue
                                .trim()
                                .match(expression)
                        ) {

                            return NodeFilter.FILTER_REJECT;

                        }


                        if (
                            node.parentElement.closest(
                                "script, style, mark"
                            )
                        ) {

                            return NodeFilter.FILTER_REJECT;

                        }


                        return NodeFilter.FILTER_ACCEPT;

                    }

                }
            );


        const nodes = [];


        while (walker.nextNode()) {

            nodes.push(
                walker.currentNode
            );

        }


        nodes.forEach(node => {

            const fragment =
                document.createDocumentFragment();


            const parts =
                node.nodeValue.split(
                    expression
                );


            parts.forEach(part => {

                if (!part) return;


                if (
                    part.toLowerCase() ===
                    searchTerm.toLowerCase()
                ) {

                    const mark =
                        document.createElement("mark");


                    mark.className =
                        "search-word-highlight";


                    mark.textContent =
                        part;


                    fragment.appendChild(
                        mark
                    );

                } else {

                    fragment.appendChild(
                        document.createTextNode(part)
                    );

                }

            });


            node.parentNode.replaceChild(
                fragment,
                node
            );

        });

    },


    removeSearchHighlights() {

        const highlights =
            this.container.querySelectorAll(
                ".search-word-highlight"
            );


        highlights.forEach(mark => {

            const textNode =
                document.createTextNode(
                    mark.textContent
                );


            mark.parentNode.replaceChild(
                textNode,
                mark
            );

        });


        this.container.normalize();

    },


    escapeRegExp(text) {

        return text.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

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
