<script lang="ts">
  import { onMount } from "svelte";

  let toggled = false;
  type device = { name: string; index: number };
  let devices: { input: device[]; output: device[] } = {
    input: [],
    output: []
  };
  let selected: { input: number; output: number } = {
    input: -1,
    output: -1
  };

  onMount(() => {
    window.astra.onSoundDeviceResponse((_devices) => {
      if (selected.output == -1) {
        selected.output = _devices.default_output;
      }
      if (selected.input == -1) {
        selected.input = _devices.default_input;
      }
      _devices.devices.forEach((device: any) => {
        if (device.maxOutputChannels > 0) {
          devices.output.push({ name: device.name, index: device.index });
        }
        if (device.maxInputChannels > 0) {
          devices.input.push({ name: device.name, index: device.index });
        }

        devices = devices;
      });
    });
  });

  export function toggle() {
    toggled = !toggled;
    if (toggled) {
      devices.input.length = 0;
      devices.output.length = 0;
      devices = devices;
      window.astra.requestSoundDevices();
    }
  }

  function selectOutputDevice(index: number) {
    selected.output = index;
    window.astra.selectSoundOutput(index);
  }

  function selectInputDevice(index: number) {
    selected.input = index;
    window.astra.selectSoundInput(index);
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div id="root" style="display: {toggled ? 'flex' : 'none'}" on:click={toggle}>
  <div on:click={(e) => e.stopPropagation()}>
    <div style="overflow-y: auto">
      <div class="output">
        <h2>Çıkış Cihazı</h2>
        <ol>
          {#each devices.output as device}
            <li>
              <button
                class={device.index == selected.output ? "selected" : ""}
                on:click={() => selectOutputDevice(device.index)}>{device.name}</button
              >
            </li>
          {/each}
        </ol>
      </div>
      <div class="input">
        <h2>Giriş Cihazı</h2>
        <ol>
          {#each devices.input as device}
            <li>
              <button
                class={device.index == selected.input ? "selected" : ""}
                on:click={() => selectInputDevice(device.index)}>{device.name}</button
              >
            </li>
          {/each}
        </ol>
      </div>
    </div>
  </div>
</div>

<style>
  #root {
    position: absolute;
    display: none;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
  }

  #root > div {
    list-style-position: inside;
    display: flex;
    overflow-y: hidden;
    padding: 30px;
    max-width: 60%;
    max-height: 80%;
    background-color: black;
    border: thick solid #00ffe0;
    border-radius: 30px;
    justify-content: center;
    align-items: left;
    flex-direction: column;
    font-size: x-large;
  }

  button {
    all: unset;
  }

  button.selected {
    color: green;
  }
</style>
