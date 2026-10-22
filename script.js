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

// Extra-chunky pixel dimensions on 100x60 viewBox
const PIXEL_SIZE = 10;
const GRID_COLS = 10; // 100 / 10
const GRID_ROWS = 6;  // 60 / 10

// Cloud shape blueprints designed for big 10x10 pixel blocks
const rawShapes = [
    // Shape 1 (Classic Cushy)
    [
        "..........",
        "....###...",
        "..#######.",
        "..#######.",
        ".########.",
        "..######.."
    ],
    // Shape 2 (Asymmetric Fluffy)
    [
        "..........",
        "...###....",
        ".#######..",
        ".########.",
        ".########.",
        "..######.."
    ],
    // Shape 3 (Wide Flat Cloud)
    [
        "..........",
        "..........",
        "...#####..",
        ".########.",
        "##########",
        "..######.."
    ],
    // Shape 4 (Tall Puffy Cumulus)
    [
        "....##....",
        "....##....",
        "..######..",
        "..######..",
        ".########.",
        "...####..."
    ],
    // Shape 5 (Compact / Mellow Cloud)
    [
        "..........",
        ".....##...",
        "...####...",
        "..######..",
        ".########.",
        "..######.."
    ]
];

// Compile shapes into sets of discrete big pixel cells
const cloudShapes = rawShapes.map(asciiRows => {
    const cells = [];
    let minR = GRID_ROWS, maxR = 0;
    asciiRows.forEach((rowStr, r) => {
        for (let c = 0; c < rowStr.length; c++) {
            if (rowStr[c] === '#') {
                cells.push({ c, r });
                if (r < minR) minR = r;
                if (r > maxR) maxR = r;
            }
        }
    });
    const rowSpan = Math.max(1, maxR - minR);
    return { cells, minR, rowSpan };
});

// Color palettes for clouds (base HSL values)
const cloudPalettes = [
    { name: 'Sky Blue',      h: 203, s: 92,  l: 75 },
    { name: 'Neon Pink',     h: 323, s: 100, l: 72 },
    { name: 'Neon Green',    h: 110, s: 100, l: 54 },
    { name: 'Electric Blue', h: 180, s: 100, l: 50 },
    { name: 'Bright Yellow', h: 56,  s: 100, l: 56 },
    { name: 'Purple',        h: 278, s: 100, l: 57 },
    { name: 'Orange',        h: 16,  s: 100, l: 50 },
    { name: 'Fluffy White',  h: 210, s: 25,  l: 88 }
];

// Generate an SVG where big pixels with slightly different colors make up the cloud
function generateCloudSVG(shape, palette) {
    const pixelRects = shape.cells.map(({ c, r }) => {
        // Subtle vertical lighting gradient (lighter on top, deeper at bottom)
        const relY = (r - shape.minR) / shape.rowSpan;
        const shadeL = (0.5 - relY) * 18;
        
        // Randomized per-pixel color jitter
        const jitterL = (Math.random() - 0.5) * 22;
        const jitterS = (Math.random() - 0.5) * 16;
        const jitterH = (Math.random() - 0.5) * 12;

        const h = (palette.h + jitterH + 360) % 360;
        const s = Math.min(100, Math.max(15, palette.s + jitterS));
        const l = Math.min(96, Math.max(15, palette.l + shadeL + jitterL));

        return `<rect x="${c * PIXEL_SIZE}" y="${r * PIXEL_SIZE}" width="${PIXEL_SIZE}" height="${PIXEL_SIZE}" fill="hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)"/>`;
    }).join('');

    return `
        <svg width="100%" height="100%" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" style="shape-rendering: crispEdges;">
            <g>${pixelRects}</g>
        </svg>
    `;
}

function createCloud(isInitial = false) {
    if (document.hidden && !isInitial) return;
    if (document.querySelectorAll('.flying-cloud').length >= 30) return;

    const wrapper = document.createElement('div');
    wrapper.classList.add('flying-cloud');
    
    // Pick random shape and color palette
    const shape = cloudShapes[Math.floor(Math.random() * cloudShapes.length)];
    const palette = cloudPalettes[Math.floor(Math.random() * cloudPalettes.length)];
    
    // Construct pixelated SVG
    wrapper.innerHTML = generateCloudSVG(shape, palette);
    
    // Randomize size - Bigger clouds (100px to 350px)
    const size = Math.random() * 250 + 100;
    wrapper.style.width = size + 'px';
    
    // Randomize position
    const maxTop = Math.max(window.innerHeight - 80, 50);
    wrapper.style.top = Math.random() * maxTop + 'px';
    
    // Randomize speed
    const duration = Math.random() * 15 + 10; // 10s to 25s
    wrapper.style.animation = `flyRight ${duration}s linear`;
    
    // If pre-populating on load, randomize position along flight path
    if (isInitial) {
        wrapper.style.animationDelay = `-${Math.random() * duration}s`;
    }
    
    // Randomize z-index
    wrapper.style.zIndex = Math.random() > 0.6 ? 20 : 5;
    
    document.body.appendChild(wrapper);
    
    // Remove after animation finishes
    wrapper.addEventListener('animationend', () => {
        wrapper.remove();
    });
}

let cloudInterval = null;

function startCloudSpawning() {
    if (!cloudInterval && !document.hidden) {
        cloudInterval = setInterval(() => createCloud(false), 800);
    }
}

function stopCloudSpawning() {
    if (cloudInterval) {
        clearInterval(cloudInterval);
        cloudInterval = null;
    }
}

// Pause animation and stop spawning when the tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopCloudSpawning();
        document.body.classList.add('paused');
    } else {
        document.body.classList.remove('paused');
        startCloudSpawning();
    }
});

// Pre-populate some drifting clouds immediately on page load
for (let i = 0; i < 8; i++) {
    createCloud(true);
}

// Continuously spawn new clouds every 0.8 seconds
startCloudSpawning();
