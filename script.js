const text = document.querySelector('h1');
const strText = text.textContent;
const splitText = strText.split('');
text.textContent = '';

for (let i = 0; i < splitText.length; i++) {
    text.innerHTML += '<span>' + splitText[i] + '</span>';
}

let char = 0;
let timer = setInterval(onTick, 50);

function onTick() {
    const span = text.querySelectorAll('span')[char];
    span.classList.add('fade');
    char++;
    if (char === splitText.length) {
        complete();
        return;
    }
}

function complete() {
    clearInterval(timer);
    timer = null;
}

function createCloud() {
    const cloud = document.createElement('img');
    const cloudType = Math.random() > 0.5 ? 'cloud.svg' : 'cloud2.svg';
    cloud.src = cloudType;
    cloud.classList.add('flying-cloud');
    
    // Randomize size
    const size = Math.random() * 150 + 50; // 50px to 200px
    cloud.style.width = size + 'px';
    
    // Randomize position
    cloud.style.top = Math.random() * window.innerHeight + 'px';
    
    // Randomize speed
    const duration = Math.random() * 15 + 10; // 10s to 25s - slow and steady retro feel
    cloud.style.animation = `flyRight ${duration}s linear`;
    
    // Randomize z-index to be behind or in front of text
    // Text container is z-index 10
    cloud.style.zIndex = Math.random() > 0.7 ? 20 : 5;
    
    document.body.appendChild(cloud);
    
    // Remove after animation
    setTimeout(() => {
        cloud.remove();
    }, duration * 1000);
}

setInterval(createCloud, 2000);
