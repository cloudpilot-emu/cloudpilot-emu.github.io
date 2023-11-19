import { loadImage, prerender } from './image.js';

const BACKGROUND = [135, 135, 105];
const FOREGROUND = [0x0, 0x0, 0x0];

export const GRAYSCALE_PALETTE_RGBA = new Array(16)
    .fill(0)
    .map((_, i) => FOREGROUND.map((fg, j) => Math.floor((i * fg + (15 - i) * BACKGROUND[j]) / 15)))
    .map(([r, g, b]) => 0xff000000 | (b << 16) | (g << 8) | r);

export const GRAYSCALE_PALETTE_HEX = GRAYSCALE_PALETTE_RGBA.map(
    (x) => '#' + (x & 0xffffff).toString(16).padStart(6, '0').match(/(..?)/g)?.reverse().join('')
);

const BUTTON_HEIGHT = 60;

const BACKGROUND_COLOR_SILKSCREEN = GRAYSCALE_PALETTE_HEX[2];
const BACKGROUND_COLOR_COLOR_DEVICE = 'white';
const FRAME_COLOR_COLOR_DEVICE = 'white';
const BACKGROUND_ACTIVE_BUTTON = 'rgba(0,0,0,0.2)';

const IMAGE_BUTTONS = prerender(loadImage('./web/buttons.svg'));
const IMAGE_SILKSCREEN = prerender(loadImage('./web/silkscreen.svg'));

function calculateLayout() {
    const dimensions = {
        width: 320,
        height: 320,
        silkscreenHeight: 120,
    };

    const scale = 2 * devicePixelRatio;
    const borderWidth = { frameDevice: 1, frameCanvas: scale };

    const dist = (x) => ({ frameDevice: x, frameCanvas: x * scale });
    const coord = (x) => ({ frameDevice: x, frameCanvas: borderWidth.frameCanvas + x * scale });

    const separatorHeight = dist(1);
    const buttonHeight = dist(BUTTON_HEIGHT);

    return {
        scale,
        borderWidth,
        height: dist(
            2 * borderWidth.frameDevice +
                dimensions.height +
                separatorHeight.frameDevice +
                dimensions.silkscreenHeight +
                buttonHeight.frameDevice
        ),
        width: dist(2 * borderWidth.frameDevice + dimensions.width),
        screenHeight: dist(dimensions.height),
        screenWidth: dist(dimensions.width),
        screenLeft: coord(0),
        screenTop: coord(0),
        screenBottom: coord(dimensions.height),
        separatorHeight,
        silkscreenHeight: dist(dimensions.silkscreenHeight),
        silkscreenTop: coord(dimensions.height + separatorHeight.frameDevice),
        silkscreenBottom: coord(dimensions.height + separatorHeight.frameDevice + dimensions.silkscreenHeight),
        softSilkscreenHeight: dist(dimensions.silkscreenHeight > 0 ? 0 : dimensions.height - dimensions.width),
        buttonHeight,
        buttonWidth: buttonHeight,
        buttonTop: coord(dimensions.height + separatorHeight.frameDevice + dimensions.silkscreenHeight),
        buttonBottom: coord(
            dimensions.height + separatorHeight.frameDevice + dimensions.silkscreenHeight + buttonHeight.frameDevice
        ),
    };
}

export class DisplayService {
    constructor() {
        this.layout = calculateLayout();
    }

    get width() {
        return this.layout.width.frameCanvas;
    }

    get height() {
        return this.layout.height.frameCanvas;
    }

    updateEmulationCanvas(canvas) {
        this.drawEmulationCanvas(canvas);
    }

    eventToPalmCoordinates(e, clip = false) {
        if (!this.ctx) return;

        const bb = this.ctx.canvas.getBoundingClientRect();

        let contentX = 0;
        let contentY = 0;
        let contentWidth = bb.width;
        let contentHeight = bb.height;

        // CSS object-fit keeps the aspect ratio of the canvas content, but the canvas itself
        // looses aspect and fills the container -> manually calculate the metrics for the content
        if (bb.width / bb.height > this.width / this.height) {
            contentHeight = bb.height;
            contentWidth = (this.width / this.height) * bb.height;
            contentY = bb.top;
            contentX = bb.left + (bb.width - contentWidth) / 2;
        } else {
            contentWidth = bb.width;
            contentHeight = (this.height / this.width) * bb.width;
            contentX = bb.left;
            contentY = bb.top + (bb.height - contentHeight) / 2;
        }

        // Transform coordinate to device frame
        let x = (((e.clientX - contentX) / contentWidth) * this.width) / this.layout.scale;
        let y = (((e.clientY - contentY) / contentHeight) * this.height) / this.layout.scale;

        // Compensate for the border
        x -= this.layout.borderWidth.frameDevice;
        y -= this.layout.borderWidth.frameDevice;

        // The canvas layout inside the border is as follows:
        //
        // * 0 .. 159   : LCD
        // * 160        : separator
        // * 161 .. 220 : silkscreen
        // * 221 .. 250 : buttons
        //
        // we map this to 160x250 lines by mapping the separator to the silkscreen

        if (y >= this.layout.screenHeight.frameDevice) {
            if (y <= this.layout.screenHeight.frameDevice + this.layout.separatorHeight.frameDevice) {
                y = this.layout.screenHeight.frameDevice;
            } else {
                y -= this.layout.separatorHeight.frameDevice;
            }
        }

        const totalHeight =
            this.layout.screenHeight.frameDevice +
            this.layout.silkscreenHeight.frameDevice +
            this.layout.buttonHeight.frameDevice;

        if (clip) {
            if (x < 0) x = 0;
            if (x >= this.layout.screenWidth.frameDevice) x = this.layout.screenWidth.frameDevice - 1;
            if (y < 0) y = 0;
            if (y >= totalHeight) y = totalHeight - 1;
        } else {
            if (x < 0 || x >= this.layout.screenWidth.frameDevice || y < 0 || y >= totalHeight) {
                return undefined;
            }
        }

        return [x, y];
    }

    isSilkscreen(coords) {
        const [, y] = coords;

        return !this.isButtons(coords) && y >= this.layout.screenHeight.frameDevice;
    }

    isButtons([, y]) {
        return y >= this.layout.screenHeight.frameDevice + this.layout.silkscreenHeight.frameDevice;
    }

    determineButton([x, y]) {
        if (x >= this.layout.screenWidth.frameDevice - this.layout.buttonWidth.frameDevice) return 'notes';
        if (x >= this.layout.screenWidth.frameDevice - 2 * this.layout.buttonWidth.frameDevice) return 'todo';
        if (x >= 2 * this.layout.buttonWidth.frameDevice) {
            return y >=
                this.layout.screenHeight.frameDevice +
                    this.layout.silkscreenHeight.frameDevice +
                    this.layout.buttonHeight.frameDevice / 2
                ? 'down'
                : 'up';
        }
        if (x >= this.layout.buttonWidth.frameDevice) return 'phone';

        return 'cal';
    }

    async initWithCanvas(canvas) {
        if (!canvas) return;

        canvas.width = this.width;
        canvas.height = this.height;

        canvas.style.height = `${this.layout.height.frameDevice * 2}px`;
        canvas.style.width = `${this.layout.width.frameDevice * 2}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('canvas not supported - get a new browser');
        }

        this.ctx = ctx;

        this.fillCanvasRect(0, 0, this.layout.width.frameCanvas, this.layout.height.frameCanvas, this.frameColor());
        this.fillRect(
            0,
            0,
            this.layout.screenWidth.frameDevice,
            this.layout.screenHeight.frameDevice +
                this.layout.silkscreenHeight.frameDevice +
                this.layout.separatorHeight.frameDevice +
                this.layout.buttonHeight.frameDevice,
            this.backgroundColor()
        );

        this.drawEmulationCanvas();
        await Promise.all([this.drawSilkscreen(), this.drawButtons()]);
    }

    async drawButtons(activeButtons = []) {
        if (!this.ctx) return;

        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';

        this.ctx.drawImage(
            await IMAGE_BUTTONS(this.layout.screenWidth.frameCanvas, this.layout.buttonHeight.frameCanvas),
            this.layout.screenLeft.frameCanvas,
            this.layout.buttonTop.frameCanvas,
            this.layout.screenWidth.frameCanvas,
            this.layout.buttonHeight.frameCanvas
        );

        if (activeButtons.includes('cal')) {
            this.fillRect(
                0,
                this.layout.buttonTop.frameDevice,
                this.layout.buttonWidth.frameDevice,
                this.layout.buttonHeight.frameDevice,
                BACKGROUND_ACTIVE_BUTTON
            );
        }
        if (activeButtons.includes('phone')) {
            this.fillRect(
                this.layout.buttonWidth.frameDevice,
                this.layout.buttonTop.frameDevice,
                this.layout.buttonWidth.frameDevice,
                this.layout.buttonHeight.frameDevice,
                BACKGROUND_ACTIVE_BUTTON
            );
        }
        if (activeButtons.includes('todo')) {
            this.fillRect(
                this.layout.screenWidth.frameDevice - 2 * this.layout.buttonWidth.frameDevice,
                this.layout.buttonTop.frameDevice,
                this.layout.buttonWidth.frameDevice,
                this.layout.buttonHeight.frameDevice,
                BACKGROUND_ACTIVE_BUTTON
            );
        }
        if (activeButtons.includes('notes')) {
            this.fillRect(
                this.layout.screenWidth.frameDevice - this.layout.buttonWidth.frameDevice,
                this.layout.buttonTop.frameDevice,
                this.layout.buttonWidth.frameDevice,
                this.layout.buttonHeight.frameDevice,
                BACKGROUND_ACTIVE_BUTTON
            );
        }
        if (activeButtons.includes('up')) {
            this.fillRect(
                2 * this.layout.buttonWidth.frameDevice,
                this.layout.buttonTop.frameDevice,
                this.layout.screenWidth.frameDevice - 4 * this.layout.buttonWidth.frameDevice,
                this.layout.buttonHeight.frameDevice / 2,
                BACKGROUND_ACTIVE_BUTTON
            );
        }
        if (activeButtons.includes('down')) {
            this.fillRect(
                2 * this.layout.buttonWidth.frameDevice,
                this.layout.buttonTop.frameDevice + this.layout.buttonHeight.frameDevice / 2,
                this.layout.screenWidth.frameDevice - 4 * this.layout.buttonWidth.frameDevice,
                this.layout.buttonHeight.frameDevice / 2,
                BACKGROUND_ACTIVE_BUTTON
            );
        }
    }

    async drawSilkscreen() {
        if (this.layout.silkscreenHeight.frameCanvas === 0 || !this.ctx) return;

        this.fillRect(
            this.layout.screenLeft.frameDevice,
            this.layout.silkscreenTop.frameDevice,
            this.layout.screenWidth.frameDevice,
            this.layout.silkscreenHeight.frameDevice,
            BACKGROUND_COLOR_SILKSCREEN
        );

        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';

        this.ctx.drawImage(
            await IMAGE_SILKSCREEN(this.layout.screenWidth.frameCanvas, this.layout.silkscreenHeight.frameCanvas),
            this.layout.borderWidth.frameCanvas,
            this.layout.silkscreenTop.frameCanvas,
            this.layout.screenWidth.frameCanvas,
            this.layout.silkscreenHeight.frameCanvas
        );
    }

    drawEmulationCanvas(canvas = this.lastEmulationCanvas) {
        if (!canvas || !this.ctx) return;
        this.lastEmulationCanvas = canvas;

        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(
            canvas,
            this.layout.screenLeft.frameCanvas,
            this.layout.screenTop.frameCanvas,
            this.layout.screenWidth.frameCanvas,
            this.layout.screenHeight.frameCanvas
        );
    }

    fillRect(x, y, width, height, style) {
        if (!this.ctx) return;

        this.ctx.beginPath();
        this.ctx.rect(
            this.layout.borderWidth.frameCanvas + this.layout.scale * x,
            this.layout.borderWidth.frameCanvas + this.layout.scale * y,
            this.layout.scale * width,
            this.layout.scale * height
        );
        this.ctx.fillStyle = style;
        this.ctx.fill();
    }

    fillCanvasRect(x, y, width, height, style) {
        if (!this.ctx) return;

        this.ctx.beginPath();
        this.ctx.rect(x, y, width, height);
        this.ctx.fillStyle = style;
        this.ctx.fill();
    }

    backgroundColor() {
        return BACKGROUND_COLOR_COLOR_DEVICE;
    }

    frameColor() {
        return FRAME_COLOR_COLOR_DEVICE;
    }
}
