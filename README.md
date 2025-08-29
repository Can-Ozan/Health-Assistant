# 🏥 ErgoAsistan - Akıllı Ergonomi ve Sağlık Sistemi

## 📋 Proje Hakkında

ErgoAsistan, evden çalışan profesyoneller için geliştirilmiş akıllı bir sağlık ve ergonomi sistemidir. 🖥️ Bilgisayar başında geçirilen uzun saatlerin olumsuz etkilerini minimize etmek ve sağlıklı çalışma alışkanlıkları kazandırmak amacıyla tasarlanmıştır.

## ✨ Özellikler

### 🎯 Ana Özellikler
- **Gerçek Zamanlı Duruş Takibi** 📸 - Kamera ile duruş analizi ve uyarılar
- **AI Asistan** 🤖 - Kişiselleştirilmiş sağlık önerileri
- **Çoklu Dil Desteği** 🌍 - 12+ dil seçeneği
- **Karanlık/Açık Tema** 🌓 - Göz dostu arayüz
- **Akıllı Hatırlatmalar** ⏰ - Kullanıcı tanımlı egzersiz ve mola hatırlatıcıları

### 📊 İzleme ve Analiz
- **20 Saniye Duruş Taraması** - Detaylı rapor oluşturma
- **Gerçekçi Çalışma Süresi Takibi** - Günlük ekran süresi analizi
- **Liderlik Tablosu** 🏆 - Gamifikasyon sistemi
- **Sağlık İstatistikleri** 📈 - Gelişim takibi

### 🎮 Gamifikasyon
- **Rozet Sistemi** 🏅 - Başarı rozetleri
- **Puan Sistemi** 🎯 - Aktivite bazlı puanlama
- **Sosyal Özellikler** 👥 - Arkadaşlarla yarışma

## 🚀 Teknoloji Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **AI**: OpenAI GPT API
- **Kamera İşleme**: WebRTC + Canvas API
- **Tema Sistemi**: CSS Variables + Dark Mode
- **İnternasyonalizasyon**: Custom i18n Hook

## 📱 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Modern bir web tarayıcısı (Chrome, Firefox, Safari)

### Yerel Geliştirme

1. **Repo'yu klonlayın**
```bash
git clone https://github.com/kullanici-adi/ergoasistan.git
cd ergoasistan
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

4. **Tarayıcıda açın**
```
http://localhost:5173
```

## 🔧 Yapılandırma

### Supabase Kurulumu
1. [Supabase](https://supabase.io) hesabı oluşturun
2. Yeni proje oluşturun
3. Veritabanı şemasını `supabase/migrations/` klasöründeki dosyalarla ayarlayın
4. API anahtarlarını `.env` dosyasına ekleyin

### OpenAI API
1. [OpenAI](https://openai.com) API anahtarı alın
2. Supabase Edge Functions secrets bölümünde `OPENAI_API_KEY` ekleyin

## 📂 Proje Yapısı

```
src/
├── components/          # React bileşenleri
│   ├── ui/             # Temel UI bileşenleri (shadcn)
│   ├── AIAssistant.tsx # AI asistan bileşeni
│   ├── PostureMonitor.tsx # Duruş takip sistemi
│   └── ...
├── hooks/              # Custom React hooks
├── pages/              # Sayfa bileşenleri
├── lib/                # Yardımcı fonksiyonlar
└── integrations/       # Supabase entegrasyonu

supabase/
├── functions/          # Edge Functions
├── migrations/         # Veritabanı migration'ları
└── config.toml        # Supabase yapılandırması
```

## 🎨 Tema Sistemi

Proje, modern ve göz dostu bir tema sistemine sahiptir:

- **Açık Tema** ☀️ - Gündüz kullanımı için
- **Karanlık Tema** 🌙 - Gece kullanımı için
- **Sistem Teması** 💻 - İşletim sistemi ayarını takip eder

### Özelleştirilmiş Renkler
- **Wellness Yeşili** 🟢 - Sağlık ve huzur
- **Energy Turuncusu** 🟠 - Enerji ve motivasyon
- **Calm Mavisi** 🔵 - Sakinlik ve odaklanma

## 🌍 Dil Desteği

Desteklenen Diller:
- 🇹🇷 Türkçe
- 🇺🇸 English
- 🇩🇪 Deutsch
- 🇫🇷 Français
- 🇪🇸 Español
- 🇮🇹 Italiano
- 🇵🇹 Português
- 🇷🇺 Русский
- 🇯🇵 日本語
- 🇰🇷 한국어
- 🇨🇳 中文
- 🇸🇦 العربية

## 📊 Özellik Detayları

### Duruş Takibi
- WebRTC ile kamera erişimi
- 20 saniye sürekli tarama
- Boyun açısı, omuz simetrisi analizi
- Gerçek zamanlı uyarılar
- Detaylı rapor oluşturma

### AI Asistan
- OpenAI GPT-4 entegrasyonu
- Kişiselleştirilmiş öneriler
- Sohbet geçmişi
- Ergonomi danışmanlığı

### Gamifikasyon
- Günlük hedef sistemi
- Başarı rozetleri
- Sosyal liderlik tablosu
- İlerleme takibi

## 🤝 Katkıda Bulunma

1. Fork edin 🍴
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun 📝

## 📧 İletişim

- **Geliştirici**: [GitHub Profili](https://github.com/kullanici-adi)
- **E-posta**: your.email@example.com
- **LinkedIn**: [Profil Linki](https://linkedin.com/in/your-profile)

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakınız.

## 🙏 Teşekkürler

- Supabase ekibine harika BaaS hizmeti için
- OpenAI'ya güçlü AI API'si için
- shadcn/ui ekibine beautiful components için
- Tailwind CSS ekibine flexible styling için

---

💡 **Not**: Bu proje sürekli geliştirilmektedir. Yeni özellikler ve iyileştirmeler için GitHub'da takip edin!

🌟 **Projeyi beğendiyseniz yıldızlamayı unutmayın!**