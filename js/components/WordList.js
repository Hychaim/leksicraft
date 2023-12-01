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
            justify-content: space-between;
            align-items: center;
            margin: var(--margin-h);
            padding-inline: 0.5em;
            line-height: var(--line-height-h);
            border-radius: var(--border-radius);
            background-color: var(--primary-color-dark);
            box-shadow: inset var(--box-shadow);
        }
        .title-container > h4 {
            margin: 0;
            font-size: var(--font-size-h4);
            font-family: var(--font-family-h);
            font-weight: var(--font-weight-h);
            word-break: break-all;
        }
        .title-container > span {
            color: var(--accent-color);
            font-style: italic;
        }
        ul {
            --gap: 2rem;
            --line-offset: calc(var(--gap) / 2);
            --line-thickness: 2px;
            --line-color: var(--primary-color-dark);

            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(7em, 1fr));
            gap: 1.5em;
            margin: 0;
            padding: 0 0 1rem 0;
            text-align: center;
            list-style: none;
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
    uniqueCombinationsCount = document.createElement("span")
    wordList = document.createElement("ul")

    _pattern = ""

    constructor() {
        super()
        this.attachShadow({ mode: "open" })

        const style = document.createElement("style")
        style.innerHTML = WordList.css

        this.shadowRoot.append(style)
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
        this.titleContainer.append(this.title, this.uniqueCombinationsCount)
        this.shadowRoot.append(this.titleContainer, this.wordList)
    }

    updateWords(wordsData) {
        this.wordList.innerHTML = ""

        this.uniqueCombinationsCount.title = Intl.NumberFormat("en-US", {}).format(wordsData.uniqueCombinationsCount)
        let uniqueCombinationsCount = this.formatUniqueCombinationNumber(wordsData.uniqueCombinationsCount)
        this.uniqueCombinationsCount.innerText = uniqueCombinationsCount

        if (wordsData.uniqueCombinationsCount === 0) {
            this.wordList.innerHTML = "No words found"
            return
        }
        wordsData.words.forEach((word) => {
            const listItem = document.createElement("li")
            listItem.textContent = word
            this.wordList.appendChild(listItem)
        })
    }

    formatUniqueCombinationNumber(number, maxThreshold = 100000000000000) {
        if (number > maxThreshold) {
            return `+${new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(maxThreshold)}`
        } else {
            return Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(number)
        }
    }
}

customElements.define("word-list", WordList)
