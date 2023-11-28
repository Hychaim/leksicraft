import "./components/LetterInput.js"
import "./components/LettersInputGroup.js"
import "./components/PatternInput.js"
import "./components/WordList.js"
import Language from "./class/Language.js"

const lettersGroups = await fetch("../resource/letters.json").then((res) => res.json())

// DOM elements
const inputsContainer = document.querySelector("#inputs")
const generateBtn = document.querySelector("#generate")
const wordListsContainer = document.querySelector("#word-lists")

function populateConfigPanel() {
    Object.entries(lettersGroups).forEach(([title, lettersData]) => {
        const lettersInputGroup = document.createElement("letter-input-group")
        lettersInputGroup.title = title
        lettersInputGroup.symbolicChar = lettersData.symbolicLetter
        lettersInputGroup.letters = JSON.stringify(lettersData.letters)
        inputsContainer.append(lettersInputGroup)
    })

    const patternInput = document.createElement("pattern-input")
    patternInput.validChars = JSON.stringify(Object.values(lettersGroups).map((lettersGroup) => lettersGroup.symbolicLetter))
    inputsContainer.append(patternInput)
}

function getAllCheckedLetters() {
    const lettersInputGroup = document.querySelectorAll("letter-input-group")
    let checkedLetters = []
    Array.from(lettersInputGroup).forEach((lettersInputGroup) => {
        checkedLetters[lettersInputGroup.getAttribute("symbolic-char")] = lettersInputGroup.getCheckedLetters()
    })
    return checkedLetters
}

function getLanguage() {
    const patternInput = document.querySelector("pattern-input")
    return new Language(getAllCheckedLetters(), patternInput.patterns, patternInput.wordCount)
}

function displaWordLists(wordLists) {
    wordListsContainer.innerHTML = ""
    Object.entries(wordLists).forEach(([pattern, words]) => {
        const wordList = document.createElement("word-list")
        wordList.pattern = pattern
        wordList.updateWords(words)
        wordListsContainer.append(wordList)
    })
}

function generate() {
    const language = getLanguage()
    displaWordLists(language.words)
}

function main() {
    populateConfigPanel()
    generateBtn.addEventListener("click", generate)
}

main()
