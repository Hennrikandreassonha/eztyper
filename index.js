import puppeteer from "puppeteer";

async function startScraping() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    await page.goto("https://play.typeracer.com/", {
        waitUntil: "domcontentloaded",
    });

    async function test() {

        //Cheat diven laddas in automatiskt.
        //Klicka på Start när gamet har börjat.
        // Profit
        await page.evaluate(() => {
            const quote = document.querySelector(".quote");
            const tables = document.querySelectorAll('table');

            let cDiv = makeCheatDiv(tables[1], document);
            let startBtn = appendBtn(cDiv, document);

            let textInput = getGameInput(document);

            startBtn.addEventListener("click", function () {
                let gameText = findText(document);

                startType(gameText, document, textInput);
            });

            function getGameInput(document) {
                const textInputs = document.querySelector('input[type="text"]');

                return textInputs;
            }
            function startType(gameText, document, textInput) {

                let index = 0;
                const textInputs = document.querySelector('input[type="text"]');

                textInput.value = "";

                function typeNextCharacter() {
                    if (index < gameText.length) {

                        const character = gameText[index];

                        textInputs.value += character;

                        index++;
                        //Här ändrar man hastighet.
                        //500 är tex en halv sekund
                        setTimeout(typeNextCharacter, 50);
                    }
                }

                typeNextCharacter();
            }

            function findText(document) {

                table = document.querySelector(".gameView");
                let gameText = "";

                if (table != undefined) {

                    let allDivs = table.querySelectorAll('div');

                    let textDiv = allDivs[allDivs.length - 2];
                    gameText = textDiv.innerText;
                }

                return gameText;
            }

            function appendBtn(cDiv, document) {
                var startBtn = document.createElement('button');

                startBtn.textContent = 'Start';
                startBtn.style.padding = "0.3rem";
                startBtn.style.fontSize = "large"
                startBtn.style.margin = "auto";

                cDiv.appendChild(startBtn);
                return startBtn;
            }

            function makeCheatDiv(correctTable, document) {
                let cDiv = document.createElement('div');

                cDiv.id = "cheatDiv";
                cDiv.style.width = "100px";
                cDiv.style.height = "100px";
                cDiv.style.border = "2px solid red";
                cDiv.style.margin = "auto";

                if (correctTable.firstChild && correctTable.querySelector('#cheatDiv') === null) {
                    correctTable.insertBefore(cDiv, correctTable.firstChild);
                }

                return cDiv;
            }
        });
    }
    
    //Obs detta är 2.5 sek
    const interval = 2500;
    setInterval(test, interval);
}

startScraping();