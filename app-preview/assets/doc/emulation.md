The "Emulation" tab displays your emulated device. The device is running as
long as the tab is visible. Once the tab is switched (or Cloudpilot goes into
the background) the emulation pauses. Date and time are read from the host
system, so the clock is not affected by the emulator pausing and resuming.

# Interacting with the emulator

You can interact with the emulator by touching or clicking the screen and the
hardware buttons below. The power button is located in the menu on the top
lefft.

A hardware keyboard can be used to type directly in the emulator.

# Installing program and database files

Select the "Install file" button on the top right in order to install `.prc` and
`.pdb` files into the emulator. You can select and install multiple files at
once.

Please note that the launcher needs to be restarted by switching to another
program and back to the launcher in order for newly installed programs to become
visible. On Palm OS 3.5 and above it is sufficient to switch the launcher
category.

# State saves

Cloudpilot automatically saves the emulator state every second while the
emulator is running. If Cloudpilot is reloaded (or the session is switched) the
state is preserved and restored.

# Device reset

The device can be reset by selecting one of the reset options from the menu.
This is equivalent to pushing a pin into the reset hole on a real
device. The different options correspond to different key combinations held while
the device resets.

### Reset

No key held. This causes a plain reset.

### Reset (no extensions)

This corresponds to holding "down" while resetting
the deviCe and will disable the loading of system extensions during startup.
This is very useful to recover from a bad hack or system extension.

### Hard reset

Corresponds to "power" being held during reset. This will
trigger a prompt that will allow you to factory reset the device.

# The power button

The power button can be pressed by selecting the "Power" entry in the menu.

# Audio

The speaker button at the top allows to toggle audio emulation on / off.
Cloudpilot always starts with audio disabled, and the icon must be tapped to enable
it.

The volume can be changed on the settings tab. The speaker button is not shown if the
volume is set to zero.

On iOS, muting the phone also mutes audio from the emulator.

# Keyboard input

If you are using Cloudpilot on a device with a keyboard you can use the keyboard to
control the emulator. There are two different modes of keyboard input, game mode
and normal mode. In normal mode the keyboard can be used to enter text on
the Palm, and in game mode it controls the hardware buttons.

Game mode can be toggled by pressing `shift-ctrl`. A gamepad icon will appear at the top
while game mode is active. In normal mode the game mode mappings are accessible by holding `ctrl`.

In both modes `page up` and `page down` control the up / down buttons of the device.

### Game mode mappings

In game mode there are several blocks on the keyboard that correspond to the
hardware buttons

* **wasd/qe:**
  The w/a/s/d buttons control up/cal/down/notes and the q/e buttons control
  contacs/todo.
* **uhjk/uo:**
  The same as wasd/qe, but shifted to the right of the keyboard.
* **up/down/left/right**:
  These buttons control up/down/cal/notes.
* **zxcv/yxcv**:
  z/x/c/v (or y/x/c/v) control cal/contacs/todo/notes.

If unsure take a look at the buttons on the silkscreen --- their background will change
while the corresponding button is pressed.

# Statistics

**WARNING** Technical details ahead. This is a technical diagnostics feature and not
required for normal operation. Continue reading at your own risk.

If "Show Statistics" is enabled (on the settings tab) Cloudpilot displays an overlay with
performance statistics above the grafitti silkscreen. The statistics are updated
whenever a new state snapshot is taken.

### Snapshot statistics

State snapshots are taken every second while the emulator is running and preserve
the current state of the emulator in the browser's IndexedDB. The snapshot consists
of the device RAM and of a representation of the current hardware state. In order to
reduce the amount of data saved memory is divided into pages of 1k, writes are tracked
and only the pages that have been modfied are saved.

 * **last snapshot**: This is the time at wbich the last snapshot was taken.
 * **snapshot pages**: The number of pages updated in this snapshot.
 * **snapshot time total**: The total amount of time the snapshot took to complete.
   Most of this time is spent by the browser on a separate thread and does not block
   emulation, so this number does not have a direct impact on performance.
 * **snapshot time blocking**: The amount of time that was spent blocking the main
   thread. During this time the emulator cannot execute. If this value is higher than
   the time for a single frame (typically 1/60th second) the snapshot will cause a
   slight frame drop when it executes.

### Emulation statistics

The CPU load of the emulator can easily vary by orders of magnitude depending on
the code that is currently executing. If the device sleeps the emulator will
consume very little CPU as well. If the emulator is busy executing code and shoveling
data around the CPU load on the host device increases as well.

While all supported iOS devices are fast enough to execute the emulator at full
speed at all times, some (in particular older) Android devices are not able to
keep up all the time. Cloudpilot compensates this by monitoring the "host speed"
(the ratio between the real time required to emulate a chunk of m68k code relative
to the corresponding time in the frame of the virtual device). If this drops below ome
Cloudpilot will reduce the clock of the emulated device accordingly while keeping the
timers in sync with real time.

 * **host speed**: See above. Note that this is calculated using the true clock speed
   of the virtual device (ignoring the correction that is applied if host speed
   drops below one).
 * **emulation speed**: The ratio between the actual clock of the emulated device and
   the clock at which it is supposed to run. This drops below 1 if Cloudpilot reduces
   speed in order to compensate for a slow host.
 * **average FPS**: The average frames per second at which the emulator runs.
   This is usually identical to the refresh rate of the display (usually 60Hz), but it
   will drop if the host device cannot keep up. Note that the screen is not actually
   updated during every frame; Cloudpilot redraws only if the display content has
   changed.
