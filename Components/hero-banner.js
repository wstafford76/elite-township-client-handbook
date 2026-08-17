/* ==========================================================
   Elite Township Properties
   Hero Banner Component
   Version 3.2
========================================================== */

"use strict";

class HeroBanner extends HTMLElement {

    connectedCallback() {

        this.innerHTML = `
            <section class="hero-banner">

                <div class="hero-content">

                    <h1>${CONFIG.company.name}</h1>

                    <p class="hero-tagline">
                        ${CONFIG.company.tagline}
                    </p>

                    <p class="hero-subtitle">
                        ${CONFIG.handbook.title}
                    </p>

                </div>

            </section>
        `;

    }

}

customElements.define("hero-banner", HeroBanner);