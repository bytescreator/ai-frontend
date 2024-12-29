<div class="astra-title">A.S.T.R.A.</div>

<style>
  /* A.S.T.R.A. Yazısı ve Altındaki Hareketli Çizgi */
  .astra-title {
    font-size: 3rem;
    /* Font büyüklüğünü artırdık */
    color: #00ffe0;
    /* A.S.T.R.A. başlığının rengi */
    text-shadow: 0 0 20px #00ffe0;
    /* Yazıya ışıma efekti */
    position: relative;
    /* Çizgiyi yazının altında konumlandırabilmek için */
    animation: moveLine 2s infinite;
  }

  .astra-title::after {
    content: "";
    /* Boş içerik, çizgi oluşturmak için */
    position: absolute;
    bottom: -0.2rem;
    /* Yazının hemen altına yerleştir */
    left: 60px;
    /* Çizginin sol başlangıç noktası */
    width: 40%;
    height: 2px;
    /* Çizginin yüksekliği */
    background: #00ffe0;
    /* Sol taraf parlak, sağ taraf soluk */
    animation:
      slide 2s infinite,
      glowEffect 1.5s infinite alternate;
    /* Çizginin hareket süresi */
    box-shadow:
      0 0 10px #00ffe0,
      0 0 20px #00ffe0;
    /* Kuyruklu yıldız etkisi için parlama */
  }

  @keyframes slide {
    0% {
      transform: translateX(-100%);
    }

    50% {
      transform: translateX(100%);
    }

    100% {
      transform: translateX(-100%);
    }
  }

  @keyframes glowEffect {
    0% {
      box-shadow:
        0 0 10px #00ffe0,
        0 0 20px #00ffe0;
    }

    100% {
      box-shadow:
        0 0 20px #00d1b8,
        0 0 40px #00d1b8;
    }
  }
</style>
