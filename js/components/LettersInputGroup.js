class LettersInputGroup extends HTMLElement {
    static css = `
        *{
            box-sizing: border-box;
            font-size: var(--font-size);
        }

        *:focus-visible{
            outline: var(--outline);
        }

        :host {
            padding-bottom: 0.75rem !important;
            border: hsl(var(--secondary-color-light)) 2px solid;
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
            text-align: center;
            border: 2px solid;
            border-color: hsl(var(--accent-color-light));
            border-radius: var(--border-radius);
            background-color: hsl(var(--accent-color));
            color: var(--text-light-primary);
            box-shadow: var(--box-shadow);
            cursor: pointer;
            transition: var(--btn-transition);
        }

        h4 span:hover{
            border-color: hsl(var(--accent-color));
            background-color: hsl(var(--accent-color-light));
        }
        h4 span:active {
            background-color: hsl(var(--accent-color-dark));
        }

        #add-phoneme-form {
            display: inline-flex;
            margin-block: 8px;
            height: 2em;
        }

        #add-phoneme-form button {
            height: 100%;
            aspect-ratio: 1/1;
            padding: 0;
            border-radius: var(--border-radius);
            font-family: var(--font-family-simple);
            box-shadow: var(--box-shadow);
        }

        #add-phoneme-form #show-phoneme-input {
            margin-inline: clamp(5px, 0.25em, 1em) calc(clamp(5px, 0.25em, 1em) * 0.75);
            padding: 0;
            border: hsl(var(--primary-color-dark)) 2px solid;
            background-color: hsl(var(--primary-color));
            color: var(--text-primary);
            transition: var(--input-transition);
            cursor: pointer;
        }
        #add-phoneme-form #show-phoneme-input:hover {
            border-color: hsl(var(--secondary-color-light));
        }
        #add-phoneme-form #show-phoneme-input:active {
            background-color: hsl(var(--primary-color-dark));
        }

        #add-phoneme-form #phoneme-input-container {
            height: 100%;
            display: flex;
            visibility: hidden;
            opacity: 0;
            transition: var(--btn-transition);
            transform: translateX(-50%);
        }
        #add-phoneme-form.active #phoneme-input-container {
            visibility: visible;
            opacity: 1;
            transform: translateX(0);
        }

        #add-phoneme-form #phoneme-input-container #phoneme-input {
            height: 100%;
            width: 4.5ch;
            padding: 0.25em 0.5em;
            font-family: var(--font-family-simple);
            color: var(--text-primary);
            border: none;
            border-bottom: 2px solid;
            border-color: hsl(var(--accent-color-light));
            border-radius: var(--border-radius);
            background-color: hsl(var(--primary-color-light));
            box-shadow: inset var(--box-shadow);
        }
        #add-phoneme-form #phoneme-input-container #phoneme-input:invalid {
            border-color: hsl(var(--error-color));
        }
        #add-phoneme-form #phoneme-input-container #phoneme-input:invalid:focus-visible {
            outline-color: hsl(var(--error-color));
        }

        #add-phoneme-form #submit-phoneme {
            margin-inline: calc(clamp(5px, 0.25em, 1em) * 0.75) clamp(5px, 0.25em, 1em);
            border: hsl(var(--secondary-color-dark)) 2px solid;
            background: hsl(var(--secondary-color));
            color: var(--text-light-primary);
            cursor: pointer;
        }
        #add-phoneme-form #submit-phoneme:hover {
            border-color: hsl(var(--secondary-color));
            background: hsl(var(--secondary-color-light));
        }
        #add-phoneme-form #submit-phoneme:active {
            background: hsl(var(--secondary-color-dark));
        }
    `

    titleEl = document.createElement("h4")
    symbolicCharEl = document.createElement("span")
    addPhonemeForm = document.createElement("form")
    showPhonemeInputBtn = document.createElement("button")
    phonemeInputContainer = document.createElement("div")
    phonemeInput = document.createElement("input")
    submitPhonemeBtn = document.createElement("button")

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

        this.buildAddPhonemeEl()
        this.shadowRoot.append(this.addPhonemeForm)

        this.showPhonemeInputBtn.addEventListener("click", () => {
            this.displayPhonemeInput()
        })
        
        this.phonemeInput.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.showPhonemeInputBtn.click()
                this.showPhonemeInputBtn.focus()
            }
        })

        this.addPhonemeForm.addEventListener("submit", (e) => {
            e.preventDefault()
            this.addPhoneme()
        })

        this.symbolicCharEl.addEventListener("click", () => {
            this.toggleChecked()
        })
    }

    buildAddPhonemeEl() {
        this.addPhonemeForm.id = "add-phoneme-form"
        this.addPhonemeForm.name = "add-phoneme-form"


        this.showPhonemeInputBtn.innerText = "+"
        this.showPhonemeInputBtn.type = "button"
        this.showPhonemeInputBtn.id = "show-phoneme-input"
        this.showPhonemeInputBtn.title = "Add new phoneme"

        this.phonemeInputContainer.id = "phoneme-input-container"
        this.phonemeInputContainer.ariaHidden = true

        this.phonemeInput.type = "text"
        this.phonemeInput.name = "phoneme-input"
        this.phonemeInput.id = "phoneme-input"
        this.phonemeInput.placeholder = "ã"
        this.phonemeInput.title = "Phoneme"
        this.phonemeInput.autocomplete = "off"
        this.phonemeInput.spellcheck = false
        this.phonemeInput.autocapitalize = "off"
        this.phonemeInput.autocorrect = "off"
        this.phonemeInput.maxLength = 3

        this.submitPhonemeBtn.innerText = "+"
        this.submitPhonemeBtn.type = "submit-phoneme"
        this.submitPhonemeBtn.id = "submit-phoneme"
        this.submitPhonemeBtn.title = "Add phoneme"

        this.phonemeInputContainer.append(this.phonemeInput, this.submitPhonemeBtn)
        this.addPhonemeForm.append(this.showPhonemeInputBtn, this.phonemeInputContainer)

        return this.addPhonemeForm
    }

    displayPhonemeInput() {
        this.addPhonemeForm.classList.toggle("active")                  
        this.phonemeInputContainer.ariaHidden = !this.addPhonemeForm.classList.contains("active")
        this.addPhonemeForm.classList.contains("active")
            ? this.showPhonemeInputBtn.innerText = "↩"
            : this.showPhonemeInputBtn.innerText = "+"
        setTimeout(() => {
            this.phonemeInput.focus()
            this.phonemeInput.select()
        }, 200)
    }

    addPhoneme() {
        const phoneme = this.phonemeInput.value
        if (phoneme.length === 0 || phoneme.trim().length === 0) {
            this.displayPhonemeInput()
            return
        }

        const letterInput = document.createElement("letter-input")
        letterInput.setAttribute("letter", phoneme)
        letterInput.setAttribute("phonetic", phoneme)
        this.shadowRoot.insertBefore(letterInput, this.addPhonemeForm)
        this._letterInputs.push(letterInput)

        this.displayPhonemeInput()
        this.phonemeInput.value = ""
    }

    toggleChecked() {
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
