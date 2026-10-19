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

// Pixel dimensions on 100x60 viewBox
const PIXEL_SIZE = 5;
const GRID_COLS = 20; // 100 / 5
const GRID_ROWS = 12; // 60 / 5

// Raw rectangle bounds for cloud shapes [x, y, width, height]
const rawShapes = [
    // Shape 1 (Original Cushy)
    [
        [10, 40, 80, 10],
        [20, 50, 60, 10],
        [20, 20, 20, 20],
        [40, 10, 30, 30],
        [70, 20, 20, 20]
    ],
    // Shape 2 (Original Cushy 2)
    [
        [10, 40, 80, 10],
        [20, 50, 60, 10],
        [15, 25, 25, 15],
        [40, 15, 25, 25],
        [65, 25, 20, 20]
    ],
    // Shape 3 (Wide Flat)
    [
        [5, 40, 90, 10],
        [15, 50, 70, 10],
        [10, 25, 30, 15],
        [40, 20, 40, 20],
        [75, 30, 15, 10]
    ],
    // Shape 4 (Tall Puffy)
    [
        [20, 40, 60, 10],
        [30, 50, 40, 10],
        [20, 20, 20, 20],
        [40, 5, 20, 35],
        [60, 20, 20, 20]
    ]
];

// Compile shapes into sets of discrete pixel cells
const cloudShapes = rawShapes.map(rectangles => {
    const grid = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(false));
    rectangles.forEach(([x, y, w, h]) => {
        const startR = Math.floor(y / PIXEL_SIZE);
        const endR = Math.floor((y + h) / PIXEL_SIZE);
        const startC = Math.floor(x / PIXEL_SIZE);
        const endC = Math.floor((x + w) / PIXEL_SIZE);
        for (let r = startR; r < endR; r++) {
            for (let c = startC; c < endC; c++) {
                if (r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLS) {
                    grid[r][c] = true;
                }
            }
        }
    });

    const cells = [];
    let minR = GRID_ROWS, maxR = 0;
    for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
            if (grid[r][c]) {
                cells.push({ c, r });
                if (r < minR) minR = r;
                if (r > maxR) maxR = r;
            }
        }
    }
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
        const shadeL = (0.5 - relY) * 16;
        
        // Randomized per-pixel color jitter
        const jitterL = (Math.random() - 0.5) * 20;
        const jitterS = (Math.random() - 0.5) * 16;
        const jitterH = (Math.random() - 0.5) * 10;

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

// Pre-populate some drifting clouds immediately on page load
for (let i = 0; i < 8; i++) {
    createCloud(true);
}

// Continuously spawn new clouds every 0.8 seconds
setInterval(() => createCloud(false), 800);
