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

const cloudShapes = [
    // Shape 1 (Original)
    `<g>
        <rect x="10" y="40" width="80" height="10"/>
        <rect x="20" y="50" width="60" height="10"/>
        <rect x="20" y="20" width="20" height="20"/>
        <rect x="40" y="10" width="30" height="30"/>
        <rect x="70" y="20" width="20" height="20"/>
    </g>`,
    // Shape 2 (Original 2)
    `<g>
        <rect x="10" y="40" width="80" height="10"/>
        <rect x="20" y="50" width="60" height="10"/>
        <rect x="15" y="25" width="25" height="15"/>
        <rect x="40" y="15" width="25" height="25"/>
        <rect x="65" y="25" width="20" height="20"/>
    </g>`,
    // Shape 3 (Wide Flat)
    `<g>
        <rect x="5" y="40" width="90" height="10"/>
        <rect x="15" y="50" width="70" height="10"/>
        <rect x="10" y="25" width="30" height="15"/>
        <rect x="40" y="20" width="40" height="20"/>
        <rect x="75" y="30" width="15" height="10"/>
    </g>`,
    // Shape 4 (Tall Puffy)
    `<g>
        <rect x="20" y="40" width="60" height="10"/>
        <rect x="30" y="50" width="40" height="10"/>
        <rect x="20" y="20" width="20" height="20"/>
        <rect x="40" y="5" width="20" height="35"/>
        <rect x="60" y="20" width="20" height="20"/>
    </g>`
];

const retroColors = [
    '#87CEFA', // Sky Blue (Original)
    '#FF6EC7', // Neon Pink
    '#39FF14', // Neon Green
    '#00FFFF', // Electric Blue
    '#FFF01F', // Bright Yellow
    '#B026FF', // Purple
    '#FF4500'  // Orange
];

function createCloud() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('flying-cloud');
    
    // Pick random shape and color
    const shape = cloudShapes[Math.floor(Math.random() * cloudShapes.length)];
    const color = retroColors[Math.floor(Math.random() * retroColors.length)];
    
    // Construct SVG
    wrapper.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
            <g fill="${color}" style="shape-rendering: crispEdges;">${shape}</g>
        </svg>
    `;
    
    // Randomize size
    const size = Math.random() * 150 + 50; // 50px to 200px
    wrapper.style.width = size + 'px';
    
    // Randomize position
    wrapper.style.top = Math.random() * window.innerHeight + 'px';
    
    // Randomize speed
    const duration = Math.random() * 15 + 10; // 10s to 25s
    wrapper.style.animation = `flyRight ${duration}s linear`;
    
    // Randomize z-index
    wrapper.style.zIndex = Math.random() > 0.6 ? 20 : 5;
    
    document.body.appendChild(wrapper);
    
    // Remove after animation
    setTimeout(() => {
        wrapper.remove();
    }, duration * 1000);
}

setInterval(createCloud, 2000);
