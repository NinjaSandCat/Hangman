var guessForm = document.getElementById("guessForm");
guessForm.addEventListener("input", inputHandle, false); // ah yeah
guessForm.focus();
var hCanvas = document.getElementById('hCanvas');
var vis = hCanvas.getContext('2d');;
var textOut = document.getElementById("textOut");
var textOut2 = document.getElementById("textOut2");
var textOut3 = document.getElementById("textOut3");
var inputEcho = document.getElementById("inputEcho");

const alphabet = 'abcdefghijklmnopqrstuvwxyz';
var guessedLetters = '';
var letters = alphabet;
var gameState = 0;
var secretWord;
var tries = 0;
var wordtry = 0;


function write(txt) {
    textOut.textContent = txt;
}

function writeLine2(txt) {
    textOut2.textContent = txt;
}

function writeLine3(txt) {
    textOut3.textContent = txt;
}

function log(txt) {
    console.log(txt);
}

function pyramid(steps) {
    if (!(typeof steps === 'number')) {
        log('failure');
        return;
    }
    // If you pass no value to steps, it defaults to 2
    // got this method of default value from stack exchange	
    // does not work if function is supposed to accept values that evaluate to false as valid.
    var str = '';
    for (var ii = 0; steps > ii; ++ii) {
        str = str + '#';
        console.log(str);
    }
    while (1 < str.length) {
        str = str.substr(0, str.length - 1)
        console.log(str);
    }
}

function dealWithIt(it) {
    log(it.target.value);
    //log(it);
}

function drawClear() {
    vis.clearRect(0, 0, hCanvas.width, hCanvas.height);
}

function inputHandle(event) {
    var input = event.target.value;
    input = input.toLowerCase();
    inputEcho.textContent = input;
    guessForm.value = '';
    logic(input);
}

function genRevealedString(aa, bb) {

    // aa should be a string
    // bb should be a string
    var cc = '';
    var place = 0;

    for (var i = 0; bb.length > i; ++i) {
        cc = cc + '☠'; // alt character placeholders: ◘⚑_-•—☼☠
    }
    cc = cc.split('');
    for (var i = 0; aa.length > i; ++i) {
        place = -1;
        do {
            place = bb.indexOf(aa[i], place + 1)
            cc[place] = bb[place];

        }
        while ((!(-1 === place)));

    }
    return cc.join('');
}

function drawHangman(lines) {
    vis.lineCap = 'round';
    vis.lineJoin = 'round';
    vis.lineWidth = 2;
    vis.strokeStyle = 'black';
    switch (lines) {
        case 99:
            vis.lineWidth = 3;
            vis.strokeStyle = 'red';
        case 13:
            // right leg
            vis.beginPath();
            vis.moveTo(96, 132);
            vis.lineTo(114, 156);
            vis.closePath();
            vis.stroke();

        case 12:
            // left leg
            vis.beginPath();
            vis.moveTo(84, 132);
            vis.lineTo(66, 156);
            vis.closePath();
            vis.stroke();
        case 11:
            // right arm
            vis.beginPath();
            vis.moveTo(100, 100);
            vis.lineTo(118, 88);
            vis.closePath();
            vis.stroke();
        case 10:
            // left arm
            vis.beginPath();
            vis.moveTo(80, 100);
            vis.lineTo(62, 88);
            vis.closePath();
            vis.stroke();
        case 9:
            // body
            vis.beginPath();
            vis.moveTo(90, 94);
            vis.lineTo(90, 126);
            vis.closePath();
            vis.stroke();
        case 8:
            // head
            vis.beginPath();
            vis.arc(90, 74, 12, Math.PI * 2, 0);
            vis.stroke();
        case 7:
            // rope
            vis.beginPath();
            vis.moveTo(90, 30);
            vis.lineTo(90, 50);
            vis.closePath();
            vis.stroke();
        case 6:
            // beam support
            vis.beginPath();
            vis.moveTo(240, 50);
            vis.lineTo(260, 30);
            vis.closePath();
            vis.stroke();
        case 5:
            // beam
            vis.beginPath();
            vis.moveTo(275, 20);
            vis.lineTo(90, 20);
            vis.closePath();
            vis.stroke();
        case 4:
            // pillar
            vis.beginPath();
            vis.moveTo(230, 164);
            vis.lineTo(230, 30);
            vis.closePath();
            vis.stroke();
        case 3:
            // table
            vis.beginPath();
            vis.moveTo(170, 174);
            vis.lineTo(290, 174);
            vis.closePath();
            vis.stroke();
        case 2:
            // Left table leg
            vis.beginPath();
            vis.moveTo(190, 224);
            vis.lineTo(190, 184);
            vis.closePath();
            vis.stroke();
        case 1:
            // right table leg
            vis.beginPath();
            vis.moveTo(270, 224);
            vis.lineTo(270, 184);
            vis.closePath();
            vis.stroke();
        default:

            break;
    }
}

function logic(guess) {
    drawClear();
    switch (gameState) {

        //----------------
        case 'success':
            write('You succeeded in discovering: \'\'' + secretWord + '\'\'');
            gameState = 0;
            drawHangman(tries);
            break;
            //----------------
        case 'failure':
            write('You failed to discover: \'\'' + secretWord + '\'\'');
            gameState = 0;
            drawHangman(99);
            break;
            //----------------
        case 0:
            write('Ready?')
            inputEcho.textContent = '';

            gameState = 'start'
            
            // Random Wordpick (without removal from wordpool)
            secretWord = wordList[Math.floor(Math.random() * wordList.length)];
            
            //Ordered Wordpick
            //secretWord = wordList[wordtry];
            
            
            wordtry++;
            if (wordtry==wordList) {wordtry=0;}
            
            
            guessedLetters = '';
            letters = alphabet;
            writeLine2(letters);
            writeLine3(guessedLetters);
            tries = 0;
            break;

        case 'start':
            write(genRevealedString(guessedLetters, secretWord));
            inputEcho.textContent = '';
            gameState = 'step';
            break;
            //----------------
        case 'step':
            var rep;
            rep = guessedLetters.indexOf(guess); // tests if this guess is a repeat
            if (-1 == rep) {

                var ig;
                ig = letters.indexOf(guess) // tests if this guess is a character from the possible characters in the secretWord
                if (-1 !== ig) {

                    guessedLetters = guessedLetters + letters.charAt(ig);
                    letters = letters.substr(0, ig) + letters.substr(ig + 1);

                    writeLine2(letters);
                    writeLine3(guessedLetters);

                    var gg
                    gg = secretWord.indexOf(guess) // tests if this guess is a character in the secretWord
                    if (-1 !== gg) {
                        var gr;
                        gr = genRevealedString(guessedLetters, secretWord);
                        write(gr);
                        if (gr === secretWord) {
                            gameState = 'success';
                            logic();
                        }

                    } else {
                        tries++;
                    }
                }
            }
            //write(genRevealedString(guessedLetters,secretWord));
            drawHangman(tries);

            if (13 < tries) {
                gameState = 'failure';
                logic();
            }
            break;
            //----------------
        default:
            gameState = 0;
            break;
            //----------------
    }
}

{ // wordList
    var wordList = [
        'extreme',
        'geometry',
        'hangman',
        'submarine',
        'garbage',
        'protocol',
        'information',
        'destination',
        'abstract',
        'obstruct',
        'sunshine',
        'temperature',
        'technical',
        'demonstrate',
        'radiation',
        'iridescence',
        'arbitrary',
        'conventional',
        'instruction',
        'covalent',
        'argument',
        'substantial',
        'tangent',
        'quantify',
        'indomitable',
        'omnivore',
        'subcontinental',
        'imperious',
        'equilateral',
        'infestation',
        'ferrous',
        'paramagnetic',
        'soluble',
        'obsidian',
        'contemptible',
        'scorn',
        'derision',
        'obstinate',
        'argumentative',
        'desolation',
        'irresponsible',
        'grandiose',
        'especially',
        'dogmatic',
        'superfluous',
        'linear',
        'alchemy',
        'efficiency',
        'queasy'
    ]
}


logic();
