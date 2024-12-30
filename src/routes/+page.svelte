<script lang="ts">
  import { onMount } from "svelte";
  import AstraLoading from "./AstraLoading.svelte";
  import SoundDeviceSelector from "./SoundDeviceSelector.svelte";

  let showAstra = true; // Başlangıçta A.S.T.R.A. animasyonu görünsün
  let messages: { sender: "assistant" | "user"; text: string }[] = []; // Mesajları saklamak için
  let userInput = ""; // Kullanıcı girdisi
  let textInputDisabled = false;
  let nextVoiceActive = false;
  let soundSelector;

  onMount(() => {
    window.astra.readyPromise.then(() => {
      showAstra = false;
    });
    window.astra.onResponse((text) => {
      messages.push({ sender: "assistant", text });
      setTimeout(scrollToBottom, 0);
      messages = messages;
    });
    window.astra.onTranscriptReady((text) => {
      if (!text) return;
      userInput = text;
      textInputDisabled = false;
      nextVoiceActive = true;
    });
  });

  function sendMessage(speak: boolean) {
    nextVoiceActive = false;
    if (userInput.trim()) {
      messages = [...messages, { sender: "user", text: userInput }];
      window.astra.submitText(userInput, speak);
      userInput = "";
      setTimeout(scrollToBottom, 0);
    }
  }

  function startVoiceInput() {
    textInputDisabled = false;
    window.astra.toggleVoice();
  }

  function scrollToBottom() {
    const messages = document.querySelector(".messages")?.children;
    if (!messages || !messages.length) return;
    const elem = messages[messages.length - 1];
    console.log(elem);
    elem.scrollIntoView();
  }
  function rewrite() {
    // Mesajları içeren kapsayıcıyı seç
    const messagesContainer = document.querySelector(".messages");

    // Kapsayıcıyı ve mesajları kontrol et
    if (!messagesContainer) {
      console.log("Mesaj kapsayıcı bulunamadı.");
      return;
    }

    const messages = messagesContainer.children;

    // Son kullanıcı mesajını ve ona ait cevabını bul
    const lastUserMessage = Array.from(messages)
      .reverse()
      .find((message) => message.classList.contains("user"));
    const lastAssistantMessage = Array.from(messages)
      .reverse()
      .find((message) => message.classList.contains("assistant"));

    // Eğer son bir kullanıcı mesajı ve ona ait bir asistan cevabı varsa
    if (lastUserMessage && lastAssistantMessage) {
      // Kullanıcı mesajını input alanına yaz
      userInput = lastUserMessage.textContent?.trim() || "";

      // Son kullanıcı mesajını ve onun cevabını sil
      messagesContainer.removeChild(lastUserMessage);
      messagesContainer.removeChild(lastAssistantMessage);

      // Asistanın mesaj geçmişini geri al (rewindMessage)
      window.astra.rewindMessage();
    } else {
      console.log("Son kullanıcı mesajı veya asistan cevabı bulunamadı.");
    }
  }
</script>

<div class="container">
  <SoundDeviceSelector bind:this={soundSelector}></SoundDeviceSelector>
  {#if showAstra}
    <AstraLoading />
  {:else}
    <div class="assistant-container">
      <div class="messages">
        {#each messages as message}
          <div class="message {message.sender}">
            {@html message.text}
          </div>
        {/each}
      </div>
      <div class="input-container">
        <button class="pencil-button" on:click={rewrite}>
          <img src="/pencil.png" alt="Yeniden Yaz" />
        </button>
        <input
          disabled={textInputDisabled}
          type="text"
          bind:value={userInput}
          placeholder="Bir şey yazın..."
          on:keydown={(e) => e.key === "Enter" && sendMessage(nextVoiceActive)}
        />
        <button class="send-button" on:click={() => sendMessage(nextVoiceActive)}>
          <img src="/send.png" alt="Gönder" />
        </button>

        <button
          disabled={textInputDisabled}
          class="microphone-button"
          on:click={startVoiceInput}
          on:contextmenu={soundSelector.toggle}
        >
          <img src="/microphone.png" alt="Mikrofon" width="40" height="40" />
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  :root {
    --container-width: 400px;
    --container-height: 400px;
  }

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: var(--container-width);
    min-height: var(--container-height);
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, #0d0d0d 0%, #000000 100%);
    color: #00ffe0;
    border-radius: 10px;
    transition: all 0.3s ease-in-out;
  }

  .assistant-container {
    width: 90%;
    height: 90%;
    background: #1e1e1e;
    border-radius: 10px;
    box-shadow: 0 0 20px #00ffe0;
  }

  .messages {
    display: flex;
    flex-direction: column;
    padding-right: 15px;
    padding-left: 15px;
    overflow-x: hidden;
  }

  .message {
    list-style-position: inside;
    min-width: 0;
    max-width: 600px;
    word-break: break-word;
    white-space: pre-wrap;
    margin: 10px 0;
    padding: 10px;
    border-radius: 5px;
  }

  .message.user {
    background: #00ffe0;
    color: #000;
    align-self: flex-end;
  }

  .message.assistant {
    background: #333;
    color: #00ffe0;
    align-self: flex-start;
  }

  .input-container {
    display: flex;
    align-items: center;
  }

  input[type="text"] {
    flex: 1;
    padding: 10px;
    height: 38px;
    border: none;
    border-radius: 5px;
    outline: none;
  }

  .send-button {
    margin-left: 5px;
    width: 38px;
    height: 38px;
    padding: 5px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #00ffe0;
    border: none;
    cursor: pointer;
    transition:
      transform 0.3s ease,
      background-color 0.3s ease;
  }

  .send-button:hover {
    background: #00d1b8;
    transform: scale(1.1);
  }

  .send-button img {
    width: 70%;
    height: 70%;
  }

  .microphone-button {
    margin-left: 5px;
    width: 38px;
    height: 38px;
    background: #00ffe0;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition:
      transform 0.3s ease,
      background 0.3s ease;
  }

  .microphone-button:hover {
    transform: scale(1.1);
    background: #00d1b8;
  }

  .microphone-icon {
    width: 24px;
    height: 24px;
    color: #000;
  }
  .pencil-button {
    margin-right: 5px;
    width: 38px;
    height: 38px;
    padding: 5px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #00ffe0;
    border: none;
    cursor: pointer;
    transition:
      transform 0.3s ease,
      background-color 0.3s ease;
  }

  .pencil-button:hover {
    background: #00d1b8;
    transform: scale(1.1);
  }

  .pencil-button img {
    width: 70%;
    height: 70%;
  }
</style>
