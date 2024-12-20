<script>
    // Svelte'in onMount fonksiyonu, komponent yüklendikten sonra çalışacak kodu tanımlar
    import { onMount } from 'svelte';
  
    // Durum değişkenleri tanımlanıyor
    let showAstra = true; // Başlangıçta A.S.T.R.A. animasyonu görünsün
    // {sender: string, text: string}[]
    let messages = []; // Kullanıcı ve asistan mesajlarını saklamak için boş bir dizi
    let userInput = ''; // Kullanıcının yazdığı metin için boş bir değer
  
    // A.S.T.R.A. animasyonunun 2 saniye sonra kaybolmasını sağlıyoruz
    onMount(() => {
      setTimeout(() => {
        showAstra = false; // 2 saniye sonra A.S.T.R.A. animasyonu kaybolur
      }, 2000); // 2 saniye bekleme süresi
    });
  
    // Mesaj gönderme fonksiyonu
    function sendMessage() {
      if (userInput.trim()) { // Eğer kullanıcı inputu boş değilse
        messages = [...messages, { sender: 'user', text: userInput }]; // Kullanıcı mesajını ekle
        messages = [
          ...messages, // Asistanın yanıtını ekle
          { sender: 'assistant', text: 'Bu, örnek bir yapay zeka yanıtıdır.' }
        ];
        userInput = ''; // Kullanıcı girdisini temizle
      }
    }
  
    // Mikrofon butonuna tıklandığında çalışacak fonksiyon
    function startVoiceInput() {
      alert('Sesli giriş başlatıldı! (Burada sesli komutları algılayabilirsiniz.)');
      // Ses algılama işlemleri buraya eklenebilir
    }
</script>

<style>
    /* Ortak Stiller */
    .container {
      display: flex; /* Flexbox kullanarak içerikleri yatayda ve dikeyde ortalayacağız */
      justify-content: center; /* Yatayda ortala */
      align-items: center; /* Dikeyde ortala */
      height: 100vh; /* Sayfanın yüksekliği kadar yer kapla */
      font-family: "Orbitron", sans-serif; /* Yazı tipi olarak Orbitron seçildi */
      background: radial-gradient(circle, #0d0d0d 0%, #000000 100%); /* Arka plan gradyanı */
      color: #00ffe0; /* Yazı rengi */
      overflow: hidden; /* Sayfada scroll bar'ı engeller */
      
    }

    /* A.S.T.R.A. Animasyonu */
    .astra-title {
      font-size: 3rem; /* Font büyüklüğünü artırdık */
      color: #00ffe0; /* A.S.T.R.A. başlığının rengi */
      text-shadow: 0 0 20px #00ffe0; /* Yazıya ışıma efekti */
    }

    /* Asistan Arayüzü */
    .assistant-container {
      width: 90%; /* Genişlik %90 olacak */
      max-width: 600px; /* Maksimum genişlik 600px olacak */
      height: 80%; /* Yükseklik %80 olacak */
      background: #1e1e1e; /* Arka plan rengi */
      border-radius: 10px; /* Kenarları yuvarlak yap */
      box-shadow: 0 0 20px #00ffe0; /* Çerçeve etrafında parlama efekti */
      display: flex; /* Flexbox düzeni */
      flex-direction: column; /* Flex yönü dikey olacak */
      padding: 20px; /* İçerideki boşluk */
    }

    .messages {
      flex: 1; /* Mesajlar bölümü esnek olacak, kalan boşluğu alacak */
      overflow-y: auto; /* Yatayda değil, dikeyde kaydırma yapılacak */
      margin-bottom: 10px; /* Mesajlar alanının alt kısmına boşluk ekle */
    }

    .message {
      margin: 10px 0; /* Her mesajın etrafına boşluk ekle */
      padding: 10px; /* Mesajın içindeki boşluk */
      border-radius: 5px; /* Mesajların kenarlarını yuvarla */
    }

    .message.user {
      background: #00ffe0; /* Kullanıcı mesajlarının arka planı */
      color: #000; /* Kullanıcı mesajlarının yazı rengi */
      align-self: flex-end; /* Kullanıcı mesajları sağa yaslanacak */
    }

    .message.assistant {
      background: #333; /* Asistan mesajlarının arka planı */
      color: #00ffe0; /* Asistan mesajlarının yazı rengi */
      align-self: flex-start; /* Asistan mesajları sola yaslanacak */
    }

    .input-container {
      display: flex; /* Flexbox düzeni */
      align-items: center; /* Giriş alanı ve butonları dikeyde ortala */
    }

    input[type="text"] {
      flex: 1; /* Giriş alanı esnek olacak */
      padding: 10px; /* Giriş alanı içi boşluk */
      border: none; /* Kenarlık yok */
      border-radius: 5px; /* Kenarları yuvarlat */
      outline: none; /* Focus olduğunda dış hat çizgisini kaldır */
    }

    button {
      margin-left: 10px; /* Buton ile giriş alanı arasında boşluk bırak */
      padding: 10px 15px; /* Butonun içindeki boşluk */
      background: #00ffe0; /* Butonun arka plan rengi */
      border: none; /* Kenarlık yok */
      color: #000; /* Yazı rengi */
      font-weight: bold; /* Yazı kalın olacak */
      border-radius: 5px; /* Butonun kenarlarını yuvarla */
      cursor: pointer; /* Butona tıklanabilir işaret */
    }

    button:hover {
      background: #00d1b8; /* Buton üzerine gelindiğinde arka plan rengi değişir */
    }

    /* Mikrofon Butonu */
    .microphone-button {
      margin-left: 10px; /* Buton ile önceki eleman arasında boşluk bırak */
      width: 50px; /* Buton genişliği */
      height: 50px; /* Buton yüksekliği */
      background: #00ffe0; /* Arka plan rengi */
      border: none; /* Kenarlık yok */
      border-radius: 50%; /* Yuvarlak buton */
      display: flex; /* Flex düzeni */
      align-items: center; /* Mikrofon simgesini dikeyde ortala */
      justify-content: center; /* Mikrofon simgesini yatayda ortala */
      cursor: pointer; /* Butona tıklanabilir işaret */
      box-shadow: 0 0 10px #00ffe0; /* Buton etrafında parlama efekti */
      transition: background 0.3s; /* Arka plan renginin geçiş efekti */
    }

    .microphone-button:hover {
      background: #00d1b8; /* Mikrofon butonuna tıklandığında renk değişir */
    }

    .microphone-icon {
      font-size: 1.5rem; /* Mikrofon simgesinin büyüklüğü */
      color: #000; /* Mikrofon simgesinin rengi */
    }
</style>

<!-- HTML Yapısı -->
<div class="container">
    {#if showAstra}
      <!-- A.S.T.R.A. Animasyonu -->
      <div class="astra-title">A.S.T.R.A.</div>
    {:else}
      <!-- Sesli Asistan Arayüzü -->
      <div class="assistant-container">
        <div class="messages">
          {#each messages as message}
            <!-- Kullanıcı ve Asistan mesajlarını göster -->
            <div class="message {message.sender}">
              {message.text}
            </div>
          {/each}
        </div>
        <div class="input-container">
          <!-- Kullanıcı inputu -->
          <input
            type="text"
            bind:value={userInput}
            placeholder="Bir şey yazın..."
            on:keydown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <!-- Gönder butonu -->
          <button on:click={sendMessage}>Gönder</button>
          <!-- Mikrofon Butonu -->
          <button class="microphone-button" on:click={startVoiceInput}>
            <span class="microphone-icon">🎤</span> <!-- Mikrofon simgesi -->
          </button>
        </div>
      </div>
    {/if}
</div>
