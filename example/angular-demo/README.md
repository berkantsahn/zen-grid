# Zen-Grid Angular Demo

Bu projede `zen-grid` web bileşeni kullanılarak Angular ile entegrasyona bir örnek gösterilmiştir.

## Özellikleri

- Web Component'in Angular ile entegrasyonu
- Temel veri tablosu işlevleri:
  - Sıralama
  - Sayfalama
  - Filtreleme
  - Satır seçimi
  - Özelleştirilebilir tasarım

## Kurulum

1. Zen-Grid'i lokal olarak bağlayın:

```bash
# Ana proje dizininde
cd ../../
npm run build
npm link

# Angular projesi dizinine dön
cd example/angular-demo
npm link zen-grid
```

2. Angular uygulamasını başlatın:

```bash
npm start
```

## Proje Yapısı

- `src/app/app.component.ts`: Ana uygulama bileşeni, zen-grid kullanımını gösterir
- `src/main.ts`: Uygulama başlangıç noktası, zen-grid web bileşenini import eder

## Entegrasyon Adımları

1. CUSTOM_ELEMENTS_SCHEMA eklendi (Web Bileşenlerini kullanabilmek için)
2. NgZone kullanılarak Web Bileşenlerinden Angular'a event binding sağlandı 
3. Özellikler için JSON string dönüşümleri yapıldı

## Diğer Notlar

- Web Component API'sindeki özellikler kebab-case ile kullanılır: `[pagination-options]`
- Kompleks nesneler JSON stringler ile aktarılır
- Olaylar için doğrudan event binding kullanmak yerine manuel listener'lar kullanılır
