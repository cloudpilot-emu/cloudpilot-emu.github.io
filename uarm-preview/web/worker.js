importScripts('../src/uarm_web.js', './setimmediate/setimmediate.js');

(function () {
    const PCM_BUFFER_SIZE = 44100 / 10;

    const messageQueue = [];
    let dispatchInProgress = false;

    let emulator;

    let framePool = [];
    let pcmPool = [];

    class Emulator {
        constructor(module, { onSpeedDisplay, onFrame, log }) {
            this.module = module;
            this.onSpeedDisplay = onSpeedDisplay;
            this.onFrame = onFrame;
            this.log = log;

            this.cycle = module.cwrap('cycle', undefined, ['number']);
            this.getFrame = module.cwrap('getFrame', 'number', []);
            this.resetFrame = module.cwrap('resetFrame', undefined, []);
            this.currentIps = module.cwrap('currentIps', 'number', []);
            this.currentIpsMax = module.cwrap('currentIpsMax', 'number', []);
            this.getTimesliceSizeUsec = module.cwrap('getTimesliceSizeUsec', 'number', []);
            this.getTimestampUsec = module.cwrap('getTimestampUsec', 'number', []);
            this.penDown = module.cwrap('penDown', undefined, ['number', 'number']);
            this.penUp = module.cwrap('penUp', undefined, []);
            this.keyDown = module.cwrap('keyDown', undefined, ['number']);
            this.keyUp = module.cwrap('keyUp', undefined, ['number']);
            this.pendingSamples = module.cwrap('pendingSamples', 'number', []);
            this.popQueuedSamples = module.cwrap('popQueuedSamples', 'number', []);
            this.setPcmOutputEnabled = module.cwrap('setPcmOutputEnabled', undefined, ['number']);
            this.setPcmSuspended = module.cwrap('setPcmSuspended', undefined, ['number']);

            this.amIDead = false;
            this.pcmEnabled = false;
            this.pcmPort = undefined;
        }

        static async create(nor, nand, sd, env) {
            const { log } = env;
            let module;

            module = await createModule({
                noInitialRun: true,
                print: log,
                printErr: log,
                locateFile: () => '../src/uarm_web.wasm',
            });

            const malloc = module.cwrap('malloc', 'number', ['number']);

            let norPtr = malloc(nor.length);
            let nandPtr = malloc(nand.length);
            let sdPtr = sd ? malloc(sd.length) : 0;

            module.HEAPU8.subarray(norPtr, norPtr + nor.length).set(nor);
            module.HEAPU8.subarray(nandPtr, nandPtr + nand.length).set(nand);
            if (sd) module.HEAPU8.subarray(sdPtr, sdPtr + sd.length).set(sd);

            module.callMain([]);

            module.ccall(
                'webMain',
                undefined,
                ['number', 'number', 'number', 'number', 'number', 'number'],
                [norPtr, nor.length, nandPtr, nand.length, sdPtr, sd ? sd.length : 0]
            );

            return new Emulator(module, env);
        }

        stop() {
            if (this.amIDead) return;

            if (this.immediateHandle) clearImmediate(this.immediateHandle);
            if (this.timeoutHandle) clearTimeout(this.timeoutHandle);

            this.timeoutHandle = this.immediateHandle = undefined;

            this.log('emulator stopped');
        }

        start() {
            if (this.amIDead) return;

            if (this.timeoutHandle || this.immediateHandle) return;
            this.lastSpeedUpdate = Number(this.getTimestampUsec());

            const schedule = () => {
                const now64 = this.getTimestampUsec();
                const now = Number(now64);

                try {
                    this.cycle(now64);
                } catch (e) {
                    this.amIDead = true;
                    console.error(e);
                    this.log(e.message);

                    return;
                }

                this.render();
                this.processAudio();

                const timesliceRemainning =
                    (this.getTimesliceSizeUsec() - Number(this.getTimestampUsec()) + now) / 1000;
                this.timeoutHandle = this.immediateHandle = undefined;

                if (timesliceRemainning < 5) this.immediateHandle = setImmediate(schedule);
                else this.timeoutHandle = setTimeout(schedule, timesliceRemainning);

                if (now - this.lastSpeedUpdate > 1000000) {
                    this.updateSpeedDisplay();
                    this.lastSpeedUpdate = now;
                }
            };

            this.log('emulator running');
            schedule();
        }

        render() {
            if (!this.module) return;

            const framePtr = this.getFrame() >>> 2;
            if (!framePtr) return;

            const frame = this.module.HEAPU32.subarray(framePtr, framePtr + 320 * 320);

            if (framePool.length === 0) {
                this.onFrame(frame.slice().buffer);
            } else {
                const frameCopy = new Uint32Array(framePool.pop());
                frameCopy.set(frame);

                this.onFrame(frameCopy.buffer);
            }

            this.resetFrame();
        }

        getPcmBuffer() {
            if (pcmPool.length > 0) return new Uint32Array(pcmPool.pop());

            return new Uint32Array(PCM_BUFFER_SIZE);
        }

        processAudio() {
            if (!this.module || !this.pcmPort || !this.pcmEnabled) return;

            const pendingSamples = this.pendingSamples();
            if (pendingSamples === 0) return;

            const samplesPtr = this.popQueuedSamples() >>> 2;
            const samples = this.getPcmBuffer();

            samples.set(this.module.HEAPU32.subarray(samplesPtr, samplesPtr + pendingSamples));

            this.pcmPort.postMessage({ type: 'sample-data', count: pendingSamples, buffer: samples.buffer }, [
                samples.buffer,
            ]);
        }

        updateSpeedDisplay() {
            const currentIps = this.currentIps();
            const currentIpsMax = Number(this.currentIpsMax());

            this.onSpeedDisplay(
                `current ${(currentIps / 1e6).toFixed(2)} MIPS, limit ${(currentIpsMax / 1e6).toFixed(2)} MIPS -> ${(
                    (currentIps / currentIpsMax) *
                    100
                ).toFixed(2)}%`
            );
        }

        setupPcm(port) {
            this.pcmPort = port;
            this.setPcmOutputEnabled(true);
            this.pcmEnabled = true;

            this.pcmPort.onmessage = (evt) => this.handlePcmMessage(evt.data);
        }

        handlePcmMessage(message) {
            switch (message.type) {
                case 'suspend-pcm':
                    this.setPcmSuspended(true);
                    break;

                case 'resume-pcm':
                    this.setPcmSuspended(false);
                    break;

                case 'return-buffer':
                    pcmPool.push(message.buffer);
                    break;

                default:
                    console.error(`worker: invalid PCM message ${message.type}`);
                    break;
            }
        }
    }

    function mapButton(name) {
        switch (name) {
            case 'cal':
                return 1;

            case 'phone':
                return 2;

            case 'todo':
                return 3;

            case 'notes':
                return 4;

            case 'up':
                return 5;

            case 'down':
                return 6;

            default:
                return -1;
        }
    }

    function postReady() {
        postMessage({ type: 'ready' });
    }

    function postFrame(data) {
        postMessage({ type: 'frame', data }, [data]);
    }

    function postSpeed(text) {
        postMessage({ type: 'speed', text });
    }

    function postLog(message) {
        postMessage({ type: 'log', message });
    }

    function postError(reason) {
        postMessage({ type: 'error', reason });
    }

    function postInitialized() {
        postMessage({ type: 'initialized' });
    }

    async function handleMessage(message) {
        let assertEmulator = (context) => {
            if (!emulator) {
                throw new Error(`${context}: emulator not running`);
            }
        };

        switch (message.type) {
            case 'initialize':
                emulator = await Emulator.create(message.nor, message.nand, message.sd, {
                    onFrame: postFrame,
                    onSpeedDisplay: postSpeed,
                    log: postLog,
                });

                postInitialized();

                break;

            case 'start':
                assertEmulator('start');
                emulator.start();
                break;

            case 'stop':
                assertEmulator('stop');
                emulator.stop();
                break;

            case 'penDown':
                assertEmulator('penDown');
                emulator.penDown(message.x, message.y);
                break;

            case 'penUp':
                assertEmulator('penUp');
                emulator.penUp();
                break;

            case 'buttonDown': {
                const button = mapButton(message.button);
                if (button < 0) {
                    console.error(`ignoring unknown button ${message.button}`);
                    return;
                }

                assertEmulator('buttonDown');

                emulator.keyDown(button);
                break;
            }

            case 'buttonUp': {
                const button = mapButton(message.button);
                if (button < 0) {
                    console.error(`ignoring unknown button ${message.button}`);
                    return;
                }

                assertEmulator('buttonUp');

                emulator.keyUp(button);
                break;
            }

            case 'returnFrame':
                framePool.push(message.frame);
                break;

            case 'setupPcm':
                emulator.setupPcm(message.port);
                break;

            case 'disablePcm':
                emulator.setPcmOutputEnabled(false);
                break;

            case 'enablePcm':
                emulator.setPcmOutputEnabled(true);
                break;

            default:
                console.error('unknown message from main thread', message);
        }
    }

    async function dispatchMessages() {
        if (dispatchInProgress || messageQueue.length === 0) return;
        dispatchInProgress = true;

        while (messageQueue.length > 0) {
            try {
                await handleMessage(messageQueue.shift());
            } catch (e) {
                postError(e);
            }
        }

        dispatchInProgress = false;
    }

    async function main() {
        postReady();

        onmessage = (e) => {
            messageQueue.push(e.data);
            dispatchMessages();
        };
    }

    main().catch((e) => console.error(e));
})();
