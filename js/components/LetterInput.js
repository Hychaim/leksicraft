class LetterInput extends HTMLElement {
    static css = `
        *{
            box-sizing: border-box;
        }

        :host {
            position: relative;
            display: inline-block;
            width: 2em;
            aspect-ratio: 1/1;
            margin-inline: clamp(5px, 0.25em, 1em) !important;
            margin-block: 8px !important;
        }
        
        input{
            position: absolute;
            inset: 0;
            width: 100%;
            aspect-ratio: 1/1;
            margin: 0;
            opacity: 0;
            cursor: pointer;
        }

        label {
            width: 100%;
            aspect-ratio: 1/1;
            display: grid;
            justify-items: center;
            color: var(--text-primary);
            font-family: var(--font-family-simple);
            border: hsl(var(--primary-color-dark)) 2px solid;
            border-radius: var(--border-radius);
            background-color: hsl(var(--primary-color-light));
            box-shadow: var(--box-shadow);
            transition: var(--input-transition);
        }

        input:focus-visible ~ label{
            outline: var(--outline);
        }

        input:hover ~ label {
            border-color: hsl(var(--secondary-color-light));
        }
        input:active ~ label {
            background: hsl(var(--primary-color));
        }

        input[type=checkbox]:checked ~ label {
            background-color: hsl(var(--primary-color-dark));
            border-color: hsl(var(--secondary-color-light));
            box-shadow: inset var(--box-shadow);
        }

        input[type=checkbox]:checked:active ~ label {
            background-color: hsl(var(--primary-color-light));
        }
    `

    input = document.createElement("input")
    label = document.createElement("label")

    constructor() {
        super()
        this.attachShadow({ mode: "open" })

        const style = document.createElement("style")
        style.innerHTML = LetterInput.css

        this.shadowRoot.append(style)
    }

    get checked() {
        return this.input.checked
    }
    set checked(value) {
        this.input.checked = value
    }

    get name() {
        return String(this.getAttribute("name"))
    }
    set name(value) {
        this.setAttribute("name", value)
    }

    get letter() {
        return String(this.getAttribute("letter"))
    }
    set letter(value) {
        this.setAttribute("letter", value)
    }

    get phonetic() {
        return String(this.getAttribute("phonetic"))
    }
    set phonetic(value) {
        this.setAttribute("phonetic", value)
    }

    connectedCallback() {
        this.render()

        this.input.name = this.name
        this.input.id = this.letter
        this.input.value = this.letter
        this.input.title = this.phonetic

        this.label.innerText = this.letter
        this.label.htmlFor = this.letter
    }

    render() {
        this.input.type = "checkbox"

        this.shadowRoot.append(this.input, this.label)
    }
}

customElements.define("letter-input", LetterInput)
