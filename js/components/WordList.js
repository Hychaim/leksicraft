class WordList extends HTMLElement {
    static css = `
        *{
            box-sizing: border-box;
        }
        :host {
            display: flex;
            flex-direction: column;
            margin-bottom: 1rem !important;
            padding-bottom: 0.75rem !important;
            border-radius: var(--border-radius);
            padding-inline: 1em !important;
        }
        .title-container {
            display: flex;
            align-items: center;
            margin: var(--margin-h);
            padding: 0.25em 0.75em;
            line-height: var(--line-height-h);
            border-radius: var(--border-radius);
            background-color: hsl(var(--primary-color-dark));
            box-shadow: inset var(--box-shadow);
        }
        .title-container > h4 {
            margin: 0;
            font-size: var(--font-size-h4);
            font-family: var(--font-family-h);
            font-weight: var(--font-weight-h);
            word-break: break-all;
        }
        .title-container > button {
            margin-inline: 0.25em;
            border: none;
            background: none;
            color: hsl(var(--accent-color));
            font-size: var(--font-size-h5);
            font-family: var(--font-family-h);
            font-weight: var(--font-weight-h);
            cursor: pointer;
        }
        .title-container > .regen-btn {
            margin-left: auto;
        }
        .title-container > span {
            color: hsl(var(--secondary-color-light));
            font-style: italic;
        }
        ul {
            --gap: 2rem;
            --line-offset: calc(var(--gap) / 2);
            --line-thickness: 2px;
            --line-color: hsl(var(--primary-color-dark));

            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(7em, 1fr));
            gap: 1.5em;
            margin: 0;
            padding: 0 0 1rem 0;
            list-style: none;
            text-align: center;
            font-family: var(--font-family-simple);
            overflow: hidden;
        }
        li {
            position: relative;
            word-break: break-all;
        }
        li::after {
            content: '';
            position: absolute;
            background-color: var(--line-color);
            z-index: 1;
            inline-size: 100vw;
            block-size: var(--line-thickness);
            inset-inline-start: 0;
            bottom: 0;
        }
    `

    titleContainer = document.createElement("div")
    title = document.createElement("h4")
    sortBtn = document.createElement("button")
    regenBtn = document.createElement("button")
    uniqueCombinationsCount = document.createElement("span")
    wordList = document.createElement("ul")

    _language = null
    _pattern = ""
    _uniqueCombinationsCount = 0
    _words = []

    constructor() {
        super()
        this.attachShadow({ mode: "open" })

        const style = document.createElement("style")
        style.innerHTML = WordList.css

        this.shadowRoot.append(style)

        this.sortWords = this.sortWords.bind(this)
        this.regenWords = this.regenWords.bind(this)
    }

    get language() {
        return this._language
    }
    set language(value) {
        this._language = value
        this.updateWordsData()
    }

    get pattern() {
        return this._pattern
    }
    set pattern(value) {
        this._pattern = value
        this.title.innerText = this._pattern
    }

    connectedCallback() {
        if (this.hasAttribute("pattern")) {
            this._pattern = this.getAttribute("pattern")
        }
        this.render()
    }

    render() {
        this.title.innerText = this.pattern
        this.titleContainer.className = "title-container"
        this.sortBtn.innerText = "⚂"
        this.sortBtn.title = "Sort words"
        this.regenBtn.innerText = "↺"
        this.regenBtn.title = "Regenerate words"
        this.regenBtn.classList.add("regen-btn")
        this.titleContainer.append(this.title, this.sortBtn, this.regenBtn, this.uniqueCombinationsCount)
        this.shadowRoot.append(this.titleContainer, this.wordList)

        this.sortBtn.addEventListener("click", this.sortWords)
        this.regenBtn.addEventListener("click", this.regenWords)
    }

    updateWordsData() {
        this.displayUniqueCombinationsCount()
        this.displayWords()
    }

    displayWords() {
        this._words = this.language.wordsData[this.pattern].words
        this.wordList.innerHTML = ""
        if (this._uniqueCombinationsCount === 0) {
            this.wordList.innerHTML = "No words found"
            return
        }
        this._words.forEach((word) => {
            const listItem = document.createElement("li")
            listItem.textContent = word
            this.wordList.appendChild(listItem)
        })
    }

    displayUniqueCombinationsCount() {
        this._uniqueCombinationsCount = this.language.wordsData[this.pattern].uniqueCombinationsCount
        this.uniqueCombinationsCount.title = Intl.NumberFormat("en-US", {}).format(this._uniqueCombinationsCount) + " unique combinations"
        this.uniqueCombinationsCount.innerText = this.formatUniqueCombinationNumber(this._uniqueCombinationsCount)
    }

    formatUniqueCombinationNumber(number, maxThreshold = 100000000000000) {
        return Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(
            number > maxThreshold ? maxThreshold : number
        )
    }

    sortWords() {
        switch (this.sortBtn.innerText) {
            case "⚂":
                this.sortBtn.innerText = "↑"
                this.updateWordsData({ words: this._words.sort() })
                break;
            case "↑":
                this.sortBtn.innerText = "↓"
                this.updateWordsData({ words: this._words.sort().reverse() })
                break;
            case "↓":
                this.sortBtn.innerText = "⚂"
                this.updateWordsData({ words: this._words.sort(() => 0.5 - Math.random()) })
                break;
        }
    }

    regenWords() {
        this.language.generateWords()
        this.updateWordsData()
        this.sortBtn.innerText = "⚂"
    }
}

customElements.define("word-list", WordList)
