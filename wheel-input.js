'use strict';

export class WheelInput extends HTMLElement {

    css = `
        .wrapper {
            position: relative;
            width: fit-content;

            --line-height: 1.2em;
        }

        .wheel {
            width: auto;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            height: var(--line-height);
            padding: calc(var(--line-height)*1.75) .1em;
            padding-right: .2em;
            overflow-y: scroll;
            scroll-snap-type: y mandatory;
            mask-image: radial-gradient(circle at center, #000, #fff0);
            mask-mode: alpha;
            scrollbar-width: none;
        }

        .wheel::-webkit-scrollbar { 
            display: none;
        }


        .intersection {
            position: absolute;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            align-self: center;
            top: 50%;
            left: 0;
            padding-left: 100%;
            height: var(--line-height);
            /* border: 1px dashed red; */
            background: #aaa5;
            border-radius: .2em;
            transform: translateY(-50%);
            pointer-events: none;
        }

        .intersection label {
            margin-left: 1ch;
        }

        .wheel span {
            transition: .15s;
            /*border: 1px dashed green;*/
            height: var(--line-height);
            line-height: var(--line-height);
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            scroll-snap-align: center;
            scroll-snap-stop: always;
            color: inherit;
            cursor: pointer;
            transform: scale(1);
            user-select: none;
        }

        .wheel .active {
            transform: scale(1.1);
            color: red;
        }

        .wheel .active + span + span,
        .wheel span:has(+ span + .active){
            transform: scale(.8);
        }
    `;


    // Static properties to configures the element
    static observedAttributes = ["values", "label"];
    static formAssociated = true;
    _internals;

    // internal properties for management
    initialized = false;
    values = null;
    label = null;
    _value = undefined;

    constructor(){
        super();
        this._internals = this.attachInternals();
    }

    connectedCallback() {
        if (this.initialized) return;

        this._internals.setFormValue('');

        const shadow = this.attachShadow({mode:"open"});

        const wrapper = document.createElement("div");
        wrapper.setAttribute("class", "wrapper");

        this.wheel = document.createElement("div");
        this.wheel.setAttribute("class", "wheel");

        this.intersection = document.createElement("div");
        this.intersection.setAttribute("class", "intersection");

        const style = document.createElement("style");

        const options = {
            root: this.wheel,
            rootMargin: '-50% 0% -50% 0%',
            threshold: 0,
        };
        let self = this;
        this.observer = new IntersectionObserver((e,o) => { this._updateActive(e,o, self); }, options);

        style.textContent = this.css;

        if (this.values) {
            this._updateValuesDOM(this.values);
        }

        if (this.label) {
            this._updateLabelDOM(this.label);
        }

        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        wrapper.appendChild(this.wheel);
        wrapper.appendChild(this.intersection);
        this.initialized = true;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "values":
                this.values = JSON.parse(newValue);
                if (this.initialized) {
                    this._updateValuesDOM(this.values);
                }
                break;
            case "label":
                this.label = newValue;
                if (this.initialized) {
                    this._updateLabelDOM(this.label);
                }
                break;
            default:
                break;
        }
    }

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
        this._internals.setFormValue(val);
        let selectedValueDOM = null;
        for (let n of this.wheel.children) {
            if (n.innerText === val) {
                selectedValueDOM = n;
                break;
            }
        }
        if (selectedValueDOM) {
            this.wheel.querySelector("span.active")?.classList.remove('active');
            this._displayActive(selectedValueDOM);
        }
    }

    _updateActive(entries, observer, self) {
        if (entries && entries.length) {
            let lines = entries.filter(e => e.isIntersecting);
            if (!lines.length) {
                return;
            };

            observer.root.querySelector("span.active")?.classList.remove('active');
            let span = lines[0].target;            
            span.classList.add('active');
            self._value = span.innerText;
            self._internals.setFormValue(self._value);
        }
    }

    _displayActive(el) {
        el.classList.add('active');
        this._value = el.innerText;
        this._internals.setFormValue(this._value);
        el.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }

    _updateValuesDOM(values) {
        try {
            this.wheel.innerText = '';
            if (values) {
                for (const val of values) {
                    const line = document.createElement("span");
                    line.innerText = val;
                    this.wheel.appendChild(line);
    
                    this.observer.observe(line);
                    line.addEventListener('click', (e) => {
                        this.wheel.querySelector("span.active")?.classList.remove('active');
                        this._displayActive(line);
                    });
                }
            }
        } catch(err) {
            console.error(err)
        }
    }

    _updateLabelDOM(label) {
        this.intersection.innerText = '';
        if (label) {
            const labelDom = document.createElement("label");
            labelDom.innerText = label;
            this.intersection.appendChild(labelDom);
        }
    }
}

customElements.define("wheel-input", WheelInput);