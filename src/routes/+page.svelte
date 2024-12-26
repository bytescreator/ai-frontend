<script lang="ts">
  import { onMount } from "svelte";

  let showAstra = true; // Başlangıçta A.S.T.R.A. animasyonu görünsün
  let messages: { sender: string; text: string }[] = []; // Mesajları saklamak için
  let userInput = ""; // Kullanıcı girdisi
  let isExpanded = false; // Genişletme/Daraltma durumunu kontrol eden değişken

  onMount(() => {
    setTimeout(() => {
      showAstra = false;
    }, 2000); // 2 saniye sonra animasyonu gizle
  });

  function sendMessage() {
    if (userInput.trim()) {
      messages = [...messages, { sender: "user", text: userInput }];
      messages = [
        ...messages,
        { sender: "assistant", text: "Bu, örnek bir yapay zeka yanıtıdır." }
      ];
      userInput = "";
      setTimeout(scrollToBottom, 0);
    }
  }

  function startVoiceInput() {
    alert("Sesli giriş başlatıldı!");
  }

  function toggleExpand() {
    const container = document.querySelector(".container");
    isExpanded = !isExpanded; // Genişletme/Daraltma durumu değiştiriliyor
    if (isExpanded) {
      container?.requestFullscreen(); // Tam ekran modu
    } else {
      document.exitFullscreen(); // Tam ekranı kapat
    }
  }
  function scrollToBottom() {
    const messages = document.querySelector(".messages")?.children;
    if (!messages || !messages.length) return;
    const elem = messages[messages.length - 1];
    console.log(elem);
    elem.scrollIntoView();
  }
</script>

<div class="container {isExpanded ? 'expanded' : ''}">
  {#if !showAstra}
    <button class="expand-button" on:click={toggleExpand}>
      {isExpanded ? "v" : "^"}
    </button>
  {/if}
  {#if showAstra}
    <div class="astra-title">A.S.T.R.A.</div>
  {:else}
    <div class="assistant-container">
      <div class="messages">
        {#each messages as message}
          <div class="message {message.sender}">
            {message.text}
          </div>
        {/each}
      </div>
      <div class="input-container">
        <input
          type="text"
          bind:value={userInput}
          placeholder="Bir şey yazın..."
          on:keydown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button on:click={sendMessage}>Gönder</button>
        <button class="microphone-button" on:click={startVoiceInput}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="microphone-icon"
          >
            <path
              d="M12 15c1.65 0 3-1.35 3-3V6c0-1.65-1.35-3-3-3s-3 1.35-3 3v6c0 1.65 1.35 3 3 3zm4.5-3c0 2.48-2.02 4.5-4.5 4.5S7.5 14.48 7.5 12H6c0 3.05 2.2 5.58 5.07 6.26V21h1.86v-2.74c2.87-.68 5.07-3.2 5.07-6.26h-1.5z"
            />
          </svg>
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
    width: var(--container-width);
    height: var(--container-height);
    background: radial-gradient(circle, #0d0d0d 0%, #000000 100%);
    color: #00ffe0;
    border-radius: 10px;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
  }

  .container.expanded {
    width: 100vw;
    height: 100vh;
  }

  .expand-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    color: #00ffe0;
    border: none;
    padding: 5px;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    z-index: 10;
    transition: color 0.3s ease;
  }

  .expand-button:hover {
    color: #00d1b8;
  }

  .astra-title {
    font-size: 3rem;
    color: #00ffe0;
    text-shadow: 0 0 20px #00ffe0;
  }

  .assistant-container {
    width: 90%;
    height: 80%;
    background: #1e1e1e;
    border-radius: 10px;
    box-shadow: 0 0 20px #00ffe0;
    display: flex;
    flex-direction: column;
    padding: 20px;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 10px;
  }

  .message {
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
    border: none;
    border-radius: 5px;
    outline: none;
  }

  button {
    margin-left: 10px;
    padding: 10px 15px;
    background: #00ffe0;
    border: none;
    color: #000;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background: #00d1b8;
  }

  .microphone-button {
    margin-left: 10px;
    width: 50px;
    height: 50px;
    background: #00ffe0;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 0 10px #00ffe0;
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
</style>
