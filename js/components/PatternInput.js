class PatternInput extends HTMLElement {
    static css = `
        *{
            box-sizing: border-box;
        }

        *:focus-visible {
            outline: var(--outline);
        }

        :host {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            padding-bottom: 0.75rem !important;
            border-radius: var(--border-radius);
            border: hsl(var(--secondary-color-light)) 2px solid;
            padding-inline: 1em !important;
            box-shadow: var(--box-shadow);
        }

        label {
            display: inline-block;
            margin: var(--margin-h);
            font-size: var(--font-size-h4);
            font-family: var(--font-family-h);
            font-weight: var(--font-weight-h);
            line-height: var(--line-height-h);
        }

        input {
            padding: 0.25em 0.5em;
            margin-left: 0.5rem;
            font-size: 1.25rem;
            font-family: var(--font-family);
            color: var(--text-primary);
            border: none;
            border-bottom: 2px solid;
            border-color: hsl(var(--accent-color-light));
            border-radius: var(--border-radius);
            background-color: hsl(var(--primary-color-light));
            box-shadow: inset var(--box-shadow);
        }
        input:invalid {
            border-color: hsl(var(--error-color));
        }
        input:invalid:focus-visible {
            outline-color: hsl(var(--error-color));
        }

        input[type=number] {
            width: 4em;
            text-align:center;
        }

        button {
            margin-inline: 0.5rem;
            padding: 0.25em 0.5em;
            font-size: 1.25rem;
            border: hsl(var(--secondary-color-dark)) 2px solid;
            border-radius: var(--border-radius);
            background: hsl(var(--secondary-color));
            color: var(--text-light-primary);
            font-family: var(--font-family);
            box-shadow: var(--box-shadow);
            cursor: pointer;
            transition: var(--btn-transition);
        }
        button:hover {
            border-color: hsl(var(--secondary-color));
            background: hsl(var(--secondary-color-light));
        }
        button:active {
            background: hsl(var(--secondary-color-dark));
        }

        #patternForm{
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }

        #wordCountForm {
            display: inline-block;
        }

        #patterns {
            flex-basis: 100%;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.5rem;
            margin-block: 1rem;
            margin-inline: 0.5rem;
        }

        #patterns > div {
            display: flex;
            align-items: center;
            padding-inline: 0.25em;
            border: hsl(var(--secondary-color-light)) 2px solid;
            border-radius: var(--border-radius);
            background-color: hsl(var(--primary-color-dark));
            box-shadow: svar(--box-shadow);
            font-size: var(--font-size-h5);
            box-shadow: var(--box-shadow);
            word-break: break-all;
        }

        #patterns > div > button {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 0.75em;
            aspect-ratio: 1/1;
            border: none;
            margin: 0 0 0 0.4rem;
            padding: 0;
            background-color: transparent;
            color: var(--text-secondary);
            font-size: 1.5rem;
            box-shadow: none;
            transform: translateY(1px);
        }

        #patternInputContainer {
            min-width: 6em;
            display: flex;
        }

        #patternInput {
            width: 100%;
        }
    `

    patternForm = document.createElement("div")
    patternLabel = document.createElement("label")
    patternInput = document.createElement("input")
    addBtn = document.createElement("button")

    wordCountForm = document.createElement("div")
    wordCountLabel = document.createElement("label")
    wordCountInput = document.createElement("input")

    patternsContainer = document.createElement("div")

    _patterns = []
    _wordCount = 10

    constructor() {
        super()
        this.attachShadow({ mode: "open" })

        const style = document.createElement("style")
        style.innerHTML = PatternInput.css

        this.shadowRoot.append(style)
    }

    get validChars() {
        try {
            return JSON.parse(String(this.getAttribute("valid-chars")))
        } catch (error) {
            console.error("Invalid JSON for valid-chars attribute")
            return {}
        }
    }
    set validChars(value) {
        this.setAttribute("valid-chars", value)
    }

    get patterns() {
        if (this._patterns.length === 0) {
            console.error("No pattern provided")
        }
        return this._patterns
    }

    get wordCount() {
        return this._wordCount
    }

    connectedCallback() {
        this.render()
    }

    render() {
        this.patternForm.id = "patternForm"
        this.patternLabel.innerText = "Pattern"
        this.patternLabel.htmlFor = "patternInput"

        this.patternInput.type = "text"
        this.patternInput.name = "pattern"
        this.patternInput.id = "patternInput"
        this.patternInput.placeholder = "PVAVF"
        this.patternInput.pattern = `[${this.validChars.join("")}${this.validChars.join("").toLowerCase()} ]+`
        
        this.addBtn.type = "button"
        this.addBtn.innerText = "Add"
        this.addBtn.title = "Add pattern"

        let patternInputContainer = document.createElement("div")
        patternInputContainer.id = "patternInputContainer"
        patternInputContainer.append(this.patternInput, this.addBtn)


        this.wordCountForm.id = "wordCountForm"
        this.wordCountLabel.innerText = "Word count"
        this.wordCountLabel.htmlFor = "wordCountInput"
        this.wordCountInput.type = "number"
        this.wordCountInput.name = "wordCount"
        this.wordCountInput.id = "wordCountInput"
        this.wordCountInput.min = 1
        this.wordCountInput.max = 10000
        this.wordCountInput.value = this._wordCount
        this.wordCountInput.previousValue = this.wordCountInput.value

        this.patternsContainer.id = "patterns"

        this.patternForm.append(this.patternLabel, patternInputContainer)
        this.wordCountForm.append(this.wordCountLabel, this.wordCountInput)
        this.shadowRoot.append(this.patternForm, this.wordCountForm, this.patternsContainer)

        this.addBtn.addEventListener("click", () => this.addPattern())
        this.patternInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault()
                this.addBtn.click()
            }
        })
        this.patternInput.addEventListener("keydown", (e) => {
            if(e.key === "ArrowUp" && this._patterns.length > 0 && this.patternInput.value === "") {
                this.patternInput.value = this._patterns[this._patterns.length - 1]
            }
            if(e.key === "ArrowDown" && this.patternInput.value.toUpperCase() === this._patterns[this._patterns.length - 1]) {
                this.patternInput.value = ""
            }
        })

        this.wordCountInput.addEventListener("change", (e) => {
            if (e.target.checkValidity()) {
                this._wordCount = Number(e.target.value)
                this.wordCountInput.previousValue = e.target.value
            } else {
                e.target.value = Number(e.target.previousValue)
            }
        })
    }

    addPattern() {
        if (!this.patternInput.value || !this.patternInput.checkValidity()) return
        let patternValue = this.patternInput.value.replace(/\s/g, "").toUpperCase()
        if (this._patterns.includes(patternValue)) return
        this.patternsContainer.append(this.createPattern(patternValue))
        this._patterns.push(patternValue)
        this.patternInput.value = ""
    }

    createPattern(pattern) {
        const patternEl = document.createElement("div")
        const valueEl = document.createElement("span")
        valueEl.innerText = pattern
        patternEl.append(valueEl)

        const removeBtn = document.createElement("button")
        removeBtn.innerText = "×"
        removeBtn.addEventListener("click", () => this.removePattern(patternEl))
        patternEl.append(removeBtn)

        return patternEl
    }

    removePattern(patternEl) {
        this._patterns.splice(this._patterns.indexOf(patternEl.firstChild.innerText), 1)
        patternEl.remove()
    }
}

customElements.define("pattern-input", PatternInput)
