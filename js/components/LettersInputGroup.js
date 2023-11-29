class LettersInputGroup extends HTMLElement {
    static css = `
        *{
            box-sizing: border-box;
        }
        :host {
            padding-bottom: 0.75rem !important;
            border: var(--secondary-color-light) 2px solid;
            border-radius: var(--border-radius);
            padding-inline: 1em !important;
            box-shadow: var(--box-shadow);
        }
        h4 {
            display: flex;
            justify-content: space-between;
            margin: var(--margin-h);
            font-size: var(--font-size-h4);
            font-family: var(--font-family-h);
            font-weight: var(--font-weight-h);
            line-height: var(--line-height-h);
        }
        h4 span {
            display: inline-block;
            font-size: var(--font-size-h4);
            width: calc(1em + 0.5em);
            height: calc(1em + 0.5em);
            line-height: calc(1em + 0.25em);
            text-align: center;
            border: 2px solid;
            border-color: var(--accent-color-light);
            border-radius: var(--border-radius);
            background-color: var(--accent-color);
            color: var(--text-light-primary);
            box-shadow: var(--box-shadow);
            cursor: pointer;
            transition: var(--btn-transition);
        }
        h4 span:hover{
            border-color: var(--accent-color);
            background-color: var(--accent-color-light)
        }
        h4 span:active {
            background-color: var(--accent-color-dark)
        }
    `

    titleEl = document.createElement("h4")
    symbolicCharEl = document.createElement("span")

    _letterInputs = []

    constructor() {
        super()
        this.attachShadow({ mode: "open" })

        const style = document.createElement("style")
        style.innerHTML = LettersInputGroup.css

        this.shadowRoot.append(style)
    }

    connectedCallback() {
        this.render()
    }

    get title() {
        return this.getAttribute("title")
    }
    set title(value) {
        this.setAttribute("title", value)
    }

    get letters() {
        try {
            return JSON.parse(this.getAttribute("letters"))
        } catch (error) {
            console.error("Invalid JSON for letters attribute")
            return {}
        }
    }
    set letters(value) {
        this.setAttribute("letters", value)
    }

    get symbolicChar() {
        return this.getAttribute("symbolic-char")
    }
    set symbolicChar(value) {
        this.setAttribute("symbolic-char", value)
    }

    render() {
        this.titleEl.innerText = this.title.charAt(0).toUpperCase() + this.title.slice(1)
        this.symbolicCharEl.innerText = this.symbolicChar
        this.symbolicCharEl.title = 'Click to select all'
        this.titleEl.append(this.symbolicCharEl)
        this.shadowRoot.append(this.titleEl)

        for (const [letter, phonetic] of Object.entries(this.letters)) {
            const input = document.createElement("letter-input")
            input.setAttribute("letter", letter)
            input.setAttribute("phonetic", phonetic)
            this.shadowRoot.append(input)
            this._letterInputs.push(input)
        }

        this.symbolicCharEl.addEventListener("click", () => {
            this.toggleChecked()
        })
    }

    toggleChecked() {
        // console.log(this._inputs)
        let isAnyChecked = false
        this._letterInputs.forEach((letterInput) => {
            if (letterInput.checked) {
                isAnyChecked = true
            }
        })

        this._letterInputs.map((letterInput) => {
            letterInput.checked = !isAnyChecked
        })
    }

    getCheckedLetters() {
        let letterInputs = Array.from(this.shadowRoot.querySelectorAll("letter-input"))

        let checkedLetters = letterInputs
            .filter((letterInput) => {
                return letterInput.checked ? true : false
            })
            .map((letterInput) => {
                return letterInput.letter
            })

        return checkedLetters
    }
}

customElements.define("letter-input-group", LettersInputGroup)
