/*!
 * content-slider.js v1.0.0
 * https://github.com/AstroCaleb/content-slider
 *
 * Copyright 2021-Present Caleb Dudley
 * Released under the MIT license
 */
class ContentSlider {
    /**
     * Create a new ContentSlider instance.
     * @param {String} wrapper - Selector string for the content slider wrapper.
     * @param {Object} [options={}] - The configuration options.
     */
    constructor(wrapper = '[data-content-slider]', options = {}) {
        this.sliderTransitioning = false;
        this.wrapper = wrapper;
        this.options = options;
        this.callback = options.callback || function(){};
        this.motion = (options.motion !== undefined) ? options.motion : true;
        this.injectCSS = (options.injectCSS !== undefined) ? options.injectCSS : true;
        this.startingIndex = (options.startingIndex !== undefined) ? options.startingIndex : 0;
        this.breadcrumbsEnabled = (options.breadcrumbsEnabled !== undefined) ? options.breadcrumbsEnabled : true;
        this.automaticBreadcrumbs = (options.automaticBreadcrumbs !== undefined) ? options.automaticBreadcrumbs : true;
        this.progressiveBreadcrumbs = (options.progressiveBreadcrumbs !== undefined) ? options.progressiveBreadcrumbs : false;
        this.css = (options.css !== undefined) ? options.css : {};
        this.cssDefaults = {
            linkHue: '204',
            linkSaturation: '82%',
            linkLightness: '36%',
            link: 'hsl(var(--cs-link-hue), var(--cs-link-saturation), var(--cs-link-lightness))',
            linkHover: 'hsl(var(--cs-link-hue), var(--cs-link-saturation), calc(var(--cs-link-lightness) + 10%))',
            background: '#FFF',
            separator: '\\276F',
            transitionSpeed: 0.35
        }

        if (!document.querySelector(this.wrapper)) {
            throw new Error('A content slider instance needs to accessible in the DOM');
        }

        if (document.querySelectorAll(this.wrapper).length > 1) {
            throw new Error("For multiple content slider instances you will need to instantiate `ContentSlider` per content slider wrapper and specify the `wrapper` selector. \n\n--> Example: `const slider = new ContentSlider('.my-content-slider');`\n");
        }

        if (typeof this.callback !== 'function') {
            throw new Error('`callback` needs to be a function');
        }

        if (this.injectCSS !== undefined && typeof this.injectCSS !== 'boolean') {
            throw new Error('`injectCSS` needs to be a boolean');
        }

        if (this.startingIndex !== undefined && typeof this.startingIndex !== 'number') {
            throw new Error('`startingIndex` needs to be a number');
        }

        if (this.breadcrumbsEnabled !== undefined && typeof this.breadcrumbsEnabled !== 'boolean') {
            throw new Error('`breadcrumbsEnabled` needs to be a boolean');
        }

        if (this.automaticBreadcrumbs !== undefined && typeof this.automaticBreadcrumbs !== 'boolean') {
            throw new Error('`automaticBreadcrumbs` needs to be a boolean');
        }

        if (this.progressiveBreadcrumbs !== undefined && typeof this.progressiveBreadcrumbs !== 'boolean') {
            throw new Error('`progressiveBreadcrumbs` needs to be a booleans');
        }

        if (this.css !== undefined && typeof this.css !== 'object') {
            throw new Error('`options.css` needs to be an object');
        }

        this.css = {...this.cssDefaults, ...this.css};

        if (this.injectCSS) {
            let existingStyleTag = document.querySelector('style[data-content-slider-style]');
            let customStyleTagExists = !!existingStyleTag;

            let contentSliderCSS = `html{--cs-background:${this.css.background};--cs-separator:"${this.css.separator}";--cs-link-hue:${this.css.linkHue};--cs-link-saturation:${this.css.linkSaturation};--cs-link-lightness:${this.css.linkLightness};--cs-link:${this.css.link};--cs-link-hover:${this.css.linkHover}}[data-content-slider]{height:auto;width:100%}[data-cs-breadcrumbs]{margin-bottom:20px}[data-cs-breadcrumbs] [data-cs-breadcrumb]{color:var(--cs-link);padding:5px}[data-cs-breadcrumbs] [data-cs-breadcrumb]:first-child{padding-left:0}[data-cs-breadcrumbs] [data-cs-breadcrumb]:hover{color:var(--cs-link-hover);cursor:pointer}[data-cs-breadcrumbs] [data-cs-breadcrumb]:not(:last-child):after{color:#222;content:var(--cs-separator);margin:0 0 0 12px}[data-cs-breadcrumbs] [data-cs-breadcrumb][data-slider-active],[data-cs-breadcrumbs] [data-cs-breadcrumb][data-slider-active]:focus,[data-cs-breadcrumbs] [data-cs-breadcrumb][data-slider-active]:hover{color:#222;cursor:default!important;outline:0!important;box-shadow:none!important}[data-cs-panes]{height:auto;overflow:hidden;position:static;transition:${this.css.transitionSpeed}s height ease;width:100%;z-index:1}[data-cs-panes]>[data-cs-pane]{background:var(--cs-background);box-sizing:border-box;display:inline-block;outline:0;padding:0 2px;transition:${this.css.transitionSpeed}s all ease;width:calc(100% - 4px)}[data-cs-panes].sliding{position:relative}[data-cs-panes].sliding>[data-cs-pane]{position:absolute!important}[data-cs-panes]>[data-cs-pane]:not(:first-child){position:absolute;-webkit-transform:translate(100.5%,0);-ms-transform:translate(100.5%,0);transform:translate(100.5%,0);top:0;z-index:3}[data-cs-panes]>[data-cs-pane].pane-in-view{opacity:1;position:relative;-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0);z-index:2}[data-cs-panes]>[data-cs-pane].pane-in-view.pane-behind{opacity:0;position:absolute!important;-webkit-transform:translate(-10%,0);-ms-transform:translate(-10%,0);transform:translate(-10%,0);z-index:1}[data-cs-no-motion] [data-cs-panes]>[data-cs-pane]:not(:first-child),[data-cs-no-motion] [data-cs-panes]>[data-cs-pane].pane-in-view.pane-behind {-webkit-transform: translate(0, 0) !important;-ms-transform: translate(0, 0) !important;transform: translate(0, 0) !important;}[data-cs-no-motion] [data-cs-panes]>[data-cs-pane]:not(:first-child) {opacity: 0 !important;}[data-cs-no-motion] [data-cs-panes]>[data-cs-pane].pane-in-view {opacity: 1 !important;}`;

            if (customStyleTagExists) {
                // if options.css are defined, update existing styles (impacts all slider instances)
                if (this.css) {
                    existingStyleTag.innerText = contentSliderCSS;
                }
            } else {
                let documentHead = document.head || document.getElementsByTagName('head')[0];
                let styleTag = document.createElement('style');
                styleTag.setAttribute('data-content-slider-style', 'content-slider');
                styleTag.appendChild(document.createTextNode(contentSliderCSS));
                documentHead.appendChild(styleTag);
            }
        }

        // Make sure we have the correct data attribute set based on the motion setting
        if (this.motion) {
            document.querySelector(this.wrapper).removeAttribute('data-cs-no-motion');
        } else {
            document.querySelector(this.wrapper).setAttribute('data-cs-no-motion', '');
        }

        let $panesWrapper = document.querySelector(this.wrapper).querySelector('[data-cs-panes]');
        let $panes = $panesWrapper.children;

        if (this.automaticBreadcrumbs && this.breadcrumbsEnabled) {
            if (this.progressiveBreadcrumbs) {
                let firstPaneID = $panes[0].id;
                let firstPaneBreadcrumbText = $panes[0].dataset.breadcrumbText;
                if (firstPaneID === '') {
                    firstPaneID = this.randomString();
                }
                for (let i = 0; i < $panes.length; i++) {
                    // Only inject breadcrumbs into other panes, not the first one
                    if (i !== 0) {
                        let currentPaneID = $panes[i].id;
                        let currentPaneBreadcrumbText = $panes[i].dataset.breadcrumbText;
                        if (currentPaneID === '') {
                            currentPaneID = this.randomString();
                        }
                        let breadcrumbUnit = `<div data-cs-breadcrumbs aria-label="Breadcrumb">
                            <span tabindex="0" data-cs-breadcrumb data-slider="#${firstPaneID}">${firstPaneBreadcrumbText}</span>
                            <span tabindex="-1" data-cs-breadcrumb data-slider="#${currentPaneID}" data-slider-active="active" aria-current="page">${currentPaneBreadcrumbText}</span>
                        </div>`;
                        document.querySelector(`#${currentPaneID}`).insertAdjacentHTML('afterbegin', breadcrumbUnit);
                    }
                }
            } else {
                let breadcrumbs = '';
                for (let i = 0; i < $panes.length; i++) {
                    let paneID = $panes[i].id;
                    let breadcrumbText = $panes[i].dataset.breadcrumbText;
                    if (paneID === '') {
                        paneID = this.randomString();
                    }
                    if (i === this.startingIndex) {
                        breadcrumbs += `<span tabindex="-1" data-cs-breadcrumb data-slider="#${paneID}" data-slider-active="active" aria-current="page">${breadcrumbText}</span>`;
                    } else {
                        breadcrumbs += `<span tabindex="0" data-cs-breadcrumb data-slider="#${paneID}">${breadcrumbText}</span>`;
                    }
                }
                let breadcrumbUnit = `<div data-cs-breadcrumbs aria-label="Breadcrumb">${breadcrumbs}</div>`;
                document.querySelector(this.wrapper).insertAdjacentHTML('afterbegin', breadcrumbUnit);
            }
        } else {
            // otherwise update existing ones to match starting index, in case markup was incorrect
            let existingBreadcrumbs = [];
            try {
                existingBreadcrumbs = document.querySelector(this.wrapper).querySelector('[data-cs-breadcrumbs]').children;
            } catch (e) {}
            for (let i = 0; i < existingBreadcrumbs.length; i++) {
                const crumb = existingBreadcrumbs[i];
                if (i === this.startingIndex) {
                    crumb.dataset.sliderActive = 'active';
                    crumb.ariaCurrent = 'page';
                    crumb.tabIndex = '-1';
                } else {
                    delete crumb.dataset.sliderActive;
                    crumb.removeAttribute('aria-current');
                    crumb.tabIndex = '0';
                }
            }
        }

        $panesWrapper.setAttribute('aria-live', 'polite');
        for (let i = 0; i < $panes.length; i++) {
            if (this.startingIndex > 0) {
                if (i !== this.startingIndex) {
                    $panes[i].tabIndex = '-1';
                    $panes[i].style = 'visibility: hidden; display: none;';
                    $panes[i].ariaHidden = 'true';

                    if (i < this.startingIndex) {
                        $panes[i].classList.add('pane-in-view');
                        $panes[i].classList.add('pane-behind');
                    }
                } else {
                    $panes[i].tabIndex = '0';
                    $panes[i].style = 'visibility: visible;';
                    $panes[i].ariaHidden = 'false';
                    $panes[i].classList.add('pane-in-view');
                }
            } else {
                if (i === 0) {
                    $panes[i].tabIndex = '0';
                    $panes[i].style = 'visibility: visible;';
                    $panes[i].ariaHidden = 'false';
                } else {
                    $panes[i].tabIndex = '-1';
                    $panes[i].style = 'visibility: hidden; display: none;';
                    $panes[i].ariaHidden = 'true';
                }
            }

            if ($panes[i].id === '') {
                if (this.breadcrumbsEnabled) {
                    if (this.automaticBreadcrumbs) {
                        $panes[i].id = document.querySelector(this.wrapper).querySelector('[data-cs-breadcrumbs]').children[i].dataset.slider.substring(1);
                    } else {
                        let newID = this.randomString();
                        $panes[i].id = newID;
                        document.querySelector(this.wrapper).querySelector('[data-cs-breadcrumbs]').children[i].dataset.slider = `#${newID}`;
                    }
                } else {
                    $panes[i].id = this.randomString();
                }
            }
        }

        const passiveSupported = false;
        try {
            window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
                get: () => { passiveSupported = true; }
            }));
        } catch(err) {}

        document.querySelector(this.wrapper).addEventListener('keydown', (e) => {
            try {
                if (e.key === 'Enter' &&
                    e.target &&
                    e.target.dataset['csBreadcrumb'] !== undefined &&
                    e.target.dataset['sliderActive'] === undefined) {
                    e.target.click();
                }
            } catch (e) {}
        }, passiveSupported ? { passive: true } : false);

        document.querySelector(this.wrapper).addEventListener('click', (e) => {
            try {
                if (e.target &&
                    e.target.dataset['csBreadcrumb'] !== undefined &&
                    e.target.dataset['sliderActive'] === undefined) {
                    this.showContentSliderPane(e.target.dataset['slider'], this.options);
                }
            } catch (e) {}
        }, passiveSupported ? { passive: true } : false);
    }

    randomString() {
        const letterPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let randomString = '';
        for (var L = 16; L > 0; --L) randomString += letterPool[Math.floor(Math.random() * letterPool.length)];
        return randomString;
    }

    updateBreadcrumbs(paneSelector) {
        let currentBreadcrumb = document.querySelector(`[data-cs-breadcrumb][data-slider="${paneSelector}"]`);
        let existingBreadcrumbs = [];
        try {
            existingBreadcrumbs = document.querySelector(`[data-cs-breadcrumb][data-slider="${paneSelector}"]`).parentNode.children;
        } catch (e) {}
        for (let i = 0; i < existingBreadcrumbs.length; i++) {
            // reset all breadcrumbs
            delete existingBreadcrumbs[i].dataset.sliderActive;
            existingBreadcrumbs[i].removeAttribute('aria-current');
            existingBreadcrumbs[i].tabIndex = '0';
        }

        if (currentBreadcrumb) {
            currentBreadcrumb.dataset.sliderActive = 'active';
            currentBreadcrumb.ariaCurrent = 'page';
            currentBreadcrumb.tabIndex = '-1';
        }
    }

    /**
     * Manually trigger showing a content slider pane.
     * @param {String} paneSelector - The specific pane to make visible.
     * @param {Function} callback - Optional callback triggered after a content pane is shown. This inherits from the constructor if nothing is provided.
     */
    showContentSliderPane(paneSelector, callback) {
        if (document.querySelectorAll(paneSelector).length > 1) {
            console.error(`Multiple panes found with the selector provided: ${paneSelector}`);
            return;
        }

        let sliderCallback = callback || this.callback
        let $pane = document.querySelector(paneSelector) || document.querySelector(`${this.wrapper} [data-cs-panes]`).children[0];
        let $paneWrapper = $pane.parentNode;
        let paneIndex = Array.prototype.indexOf.call($paneWrapper.children, $pane);

        if ($pane.classList.contains('pane-in-view') && !$pane.classList.contains('pane-behind')) {
            return;
        }

        if (this.sliderTransitioning) {
            return;
        }
        this.sliderTransitioning = true;

        $paneWrapper.setAttribute('style', 'height:' + $paneWrapper.clientHeight + 'px;');
        $paneWrapper.classList.add('sliding');

        // During sliding transitions, prevent a user from tabbing around
        // the UI as this may cause some unwanted UI shifting.
        let tabKeyHandler = (e) => {
            if (e.key === 'Tab') { e.preventDefault(); }
        };
        document.addEventListener('keydown', tabKeyHandler);

        if ($pane.previousElementSibling) {
            for (let i = 0; i < paneIndex; i++) {
                let $paneEl = $paneWrapper.children[i];
                $paneEl.classList.add('pane-in-view'); // in the case it's the first pane
                $paneEl.classList.add('pane-behind');
                $paneEl.setAttribute('aria-hidden', 'true');
                $paneEl.setAttribute('tabindex', '-1');
            }
            setTimeout(() => {
                for (let i = 0; i < paneIndex; i++) {
                    $paneWrapper.children[i].style.visibility = 'hidden';
                    $paneWrapper.children[i].style.display = 'none';
                }
            }, (this.css.transitionSpeed*1000)+50);
        }

        if ($pane.nextElementSibling) {
            for (let i = paneIndex + 1; i < $paneWrapper.children.length; i++) {
                let $paneEl = $paneWrapper.children[i];
                $paneEl.classList.remove('pane-in-view');
                $paneEl.classList.remove('pane-behind');
                $paneEl.setAttribute('aria-hidden', 'true');
                $paneEl.setAttribute('tabindex', '-1');
            }
            setTimeout(() => {
                for (let i = paneIndex + 1; i < $paneWrapper.children.length; i++) {
                    $paneWrapper.children[i].style.visibility = 'hidden';
                    $paneWrapper.children[i].style.display = 'none';
                }
            }, (this.css.transitionSpeed*1000)+50);
        }

        // setting specified pane to be in view and not behind any other panes
        $pane.style.removeProperty('display');

        // To fix a display issue, wait 10 milliseconds to continue changing styles
        setTimeout(() => {
            $pane.classList.remove('pane-behind');
            $pane.classList.add('pane-in-view');
            $pane.setAttribute('aria-hidden', 'false');
            $pane.setAttribute('tabindex', '0');
            $pane.style.visibility = 'visible';
            $paneWrapper.setAttribute('style', 'height:' + $pane.clientHeight + 'px;');
            this.updateBreadcrumbs(paneSelector);

            /**
             * When making the pane visible, check if it's the first child element.
             * Remove the `pane-in-view` class to avoid position related style
             * issues for absolutely positioned elements on the page.
             */
            if ($pane.previousElementSibling === null) {
                $pane.classList.remove('pane-in-view');
            }
        }, 10);

        setTimeout(() => {
            window.document.removeEventListener('keydown', tabKeyHandler);
            $paneWrapper.setAttribute('style', 'height:auto;');
            $paneWrapper.classList.remove('sliding');
            this.sliderTransitioning = false;
            if (sliderCallback && typeof sliderCallback === 'function') {
                sliderCallback();
            }
        }, (this.css.transitionSpeed*1000)+50);
    }
}

export default ContentSlider;
