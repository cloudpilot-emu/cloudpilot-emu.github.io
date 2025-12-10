# About

CloudpilotEmu is a web-based emulator for PalmOS. It emulates both Dragonball
based devices (OS 1-4) and the Palm Tungsten E2 (ARM-based, OS5). Emulation
of Dragonball devices is based on the original POSE emulator, and OS5
emulation is based on Dmitry Grinberg's [uARM](https://github.com/uARM-Palm/uARM).

Currently, the following devices are emulated:

-   Pilot, Palm Pilot
-   Palm III
-   Palm IIIxe, Palm IIIx, Palm IIIe
-   Palm IIIc
-   Palm Vx, Palm V
-   Palm VII, Palm VII EZ, Palm VIIx
-   Palm m500, Palm m505, Palm m515
-   Palm m520 (an unreleased prototype of a highres 5xx)
-   Palm m100, Palm m105, Palm m125, Palm m130
-   Palm i705
-   Tungsten W (silkscreen version)
-   Tungsten E2, E3 (a widescreen version of the E2 created specifically for emulation by
    Dmitry Grinberg)
-   Handera 330, 330c (the lost color version of the 330c)
-   Sony PEG-S300, PEG-S320
-   Sony PEG-S500C series
-   Sony PEG-T400 series
-   Sony PEG-N600C series
-   Sony PEG-T600C series
-   Sony PEG-N700C series
-   Sony PEG-T650C series
-   Sony PEG-NR70 series
-   Acer S1x
-   Legend P168 (no SD card support)

CloudpilotEmu can be run as a web page or as a mobile app on phones and tables,
and on iOS it is also available on the 
[App Store](https://apps.apple.com/us/app/cloudpilotemu/id6478502699).
The list of features includes

 * Realistic emulation of timers and device speed
 * Continuous state saves --- emulation resumes if the page or app is reloaded
 * Direct installation and export of .prc and .pdb files
 * Export and import snapshot files
 * Switching between multiple emulation sessions
 * Emulated SD cards and memory sticks
 * File browser for managing memory cards
 * Audio emulation, incuding PCM audio on OS5
 * Keyboard input
 * Clipboard integration on OS4 and earlier
 * Network support (including network hotsync) on OS4 and earlier using a websocket proxy
  ([documentation](https://github.com/cloudpilot-emu/cloudpilot-emu/blob/master/doc/networking.md))

You can download supported ROMs on [PalmDB](https://palmdb.net/app/palm-roms-complete).

[Launch CloudpilotEmu!](/app)

## CloudpilotEmu embedded

There is an embedded version of CloudpilotEmu that allows you to embed the
emulator into your own web pages. Check out the
[documentation](/embedded)
for more details.

## Other links

 * [CloudpilotEmu preview](/app-preview)

   This is the preview of the next CloudpilotEmu release. On the iOS native app you
   you can switch between the preview and stable versions by opening the "Settings" app,
   selecting "CloudpilotEmu" and toggling "Use preview version".

 * [CloudpilotEmu embedded preview](/embedded-preview)

   This is the preview of the next release of CloudpilotEmu embedded.

 * [deNVFS image for uARM](./e2_denvfs.rom)
  
   This is the deNVFSed E2 ROM by Dmitry Grinberg. You can find more information in
   the original
   [release note on Reddit](https://www.reddit.com/r/Palm/comments/j6nyyb/removing_nvfs_from_a_tungsten_e2_success/).

 * [320x480 screen image for uARM](/e2_dia.rom)
  
   Modified E2 ROM with a dynamic input area, 320x480 screen resolution and no NVFS,
   courtesy of Dmitry Grinberg.

 * [Source code](https://github.com/cloudpilot-emu/cloudpilot-emu)

# Privacy

CloudpilotEmu is a strictly client side application. It stores the data that
you enter locally on your device and does not transmit any of it over the network.
Please check the [privacy statement](PRIVACY.md) for details.
