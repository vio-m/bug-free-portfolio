var effectsInitialized = false;

window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    if (scrollPos > 1200 && !effectsInitialized) {
        initializeEffects();
        effectsInitialized = true;
    }
});

var text = 'Communication \n Problem-Solving \n Adaptability \n Collaboration \n Attention to Detail \n Time Management \n Critical Thinking \n Continuous Learning';
var messages = [
    '<i class="fa-brands fa-html5"></i>',
    '<i class="fa-brands fa-css3"></i>',
    '<i class="fa-brands fa-square-js"></i>',
    '<i class="fa-brands fa-react"></i>',
    '<i class="fa-brands fa-node-js"></i>',
    '<i class="fa-brands fa-python"></i>',
            ];

var textblock = null;
var textIndex = 0;
var typeMax = 0;
var typeInter = null;
var fadeInter = null;
var ytFrame = null;
var ytVids = null;
var rgbGlow = [255, 255, 255];
var fade = true;
var blocks = [];

function createScrollBlock(i, container) {
    var ele = document.createElement('span');
    blocks.push(ele);
    ele.innerHTML = messages[Math.floor(Math.random() * messages.length)];
    ele.style.transform = 'rotate(' + (Math.random() * 30 - 15) + 'deg)';
    container.querySelector('#skills-messages-container').appendChild(ele);
    lolblock(ele);
    setInterval(lolblock, Math.floor(Math.random() * 200) + 1000, ele);
  }

function type(textBlock) {
    textblock = textBlock;
    typeMax = text.length;

    typeInter = setInterval(
        function () {
        if (textIndex == typeMax) {
            clearInterval(typeInter);
        } else {
            if (text[textIndex] == '\n') {
            textblock.innerHTML += '<br />';
            clearInterval(typeInter);
            setTimeout(type, 1000, textBlock);
            } else {
            textblock.innerHTML += text[textIndex];
            }

            textIndex += 1;
            textblock.scrollTop = textblock.scrollHeight;
        }
        }, 100
    );
}


function lolblock(e) {
    e.style.fontSize = Math.floor(Math.random() * 200) + '%';
    e.style.left = Math.floor(Math.random() * (document.body.clientWidth - e.offsetWidth)) + 'px';
    e.style.top = Math.floor(Math.random() * (document.body.clientHeight - e.offsetHeight)) + 'px';
}

function initializeEffects() {
    var skillsSection = document.getElementById('skills');
    var textBlock = skillsSection.querySelector('#textblock');

    type(textBlock);

    for (var i = 0; i < 20; i++) {
        createScrollBlock(i, skillsSection);
    }
}


/*


*/