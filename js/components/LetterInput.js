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
            border: var(--primary-color-dark) 2px solid;
            border-radius: var(--border-radius);
            background-color: var(--primary-color-light);
            box-shadow: var(--box-shadow);
            transition: .25s ease;
        }
        input:hover ~ label {
            border-color: var(--secondary-color-light);
        }
        input:active ~ label {
            background: var(--primary-color);
        }

        input[type=checkbox]:checked ~ label {
            background-color: var(--primary-color-dark);
            border-color: var(--secondary-color-light);
            box-shadow: inset var(--box-shadow);
        }
        input[type=checkbox]:checked:active ~ label {
            background-color: var(--primary-color-light);
        }
    `

    input = document.createElement('input')
    label = document.createElement('label')

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        const style = document.createElement('style')
        style.innerHTML = LetterInput.css

        this.shadowRoot.append(style)
    }

    get checked() {
        return this.shadowRoot.querySelector('input').checked
    }

    get name() {
        return String(this.getAttribute('name'))
    }
    set name(value) {
        this.setAttribute('name', value)
    }

    get letter() {
        return String(this.getAttribute('letter'))
    }
    set letter(value) {
        this.setAttribute('letter', value)
    }

    get phonetic() {
        return String(this.getAttribute('phonetic'))
    }
    set phonetic(value) {
        this.setAttribute('phonetic', value)
    }

    connectedCallback() {
        this.render()
    
        this.input.name = this.name
        this.input.id = this.letter
        this.input.value = this.letter
    
        this.label.innerText = this.letter
        this.label.htmlFor = this.letter
    }

    render() {
        this.input.type = 'checkbox'
        
        this.shadowRoot.append(this.input, this.label)
    }
}

customElements.define('letter-input', LetterInput)