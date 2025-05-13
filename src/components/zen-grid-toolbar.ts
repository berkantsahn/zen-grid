import { DomUtils } from '../core/utils';
import { TranslationService, TranslationKey } from '../core/utils';

/**
 * ZenGrid Toolbar bileşeni
 * 
 * Bu bileşen, ZenGrid üzerinde kullanılacak araç çubuğunu ve 
 * çeşitli kontrol bileşenlerini içerir.
 */
export class ZenGridToolbar extends HTMLElement {
  // Shadow DOM
  private shadow!: ShadowRoot;
  
  // Ana konteyner
  private container!: HTMLDivElement;
  
  // Sol, orta ve sağ bölümler
  private leftSection!: HTMLDivElement;
  private centerSection!: HTMLDivElement;
  private rightSection!: HTMLDivElement;
  
  // Bileşenin bağlı olduğu ZenGrid örneği
  private gridElement: HTMLElement | null = null;
  
  // Dil servisi referansı
  private translationService: TranslationService = TranslationService.getInstance();
  
  /**
   * Yapıcı metod
   */
  constructor() {
    super();
    
    console.log('ZenGridToolbar: Bileşen oluşturuluyor');
    
    // Shadow DOM oluştur
    this.shadow = this.attachShadow({ mode: 'open' });
    
    // Temel yapıyı oluştur
    this.createBaseStructure();
    
    // Stil oluştur
    this.createStyles();
  }
  
  /**
   * Temel yapıyı oluşturur
   */
  private createBaseStructure(): void {
    // Ana konteyner
    this.container = DomUtils.createElement('div', { class: 'zen-grid-toolbar' });
    
    // Sol bölüm (örn: global arama, filtre vb.)
    this.leftSection = DomUtils.createElement('div', { class: 'zen-grid-toolbar-section left' });
    
    // Orta bölüm (örn: başlık, durum bilgisi vb.)
    this.centerSection = DomUtils.createElement('div', { class: 'zen-grid-toolbar-section center' });
    
    // Sağ bölüm (örn: sayfalama, dışa aktarma butonları vb.)
    this.rightSection = DomUtils.createElement('div', { class: 'zen-grid-toolbar-section right' });
    
    // Bölümleri ana konteynere ekle
    this.container.appendChild(this.leftSection);
    this.container.appendChild(this.centerSection);
    this.container.appendChild(this.rightSection);
    
    // Shadow DOM'a ekle
    this.shadow.appendChild(this.container);
  }
  
  /**
   * Stil oluşturur
   */
  private createStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #333;
      }
      
      .zen-grid-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 16px;
        background-color: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 4px 4px 0 0;
        margin-bottom: -1px;
      }
      
      .zen-grid-toolbar-section {
        display: flex;
        align-items: center;
      }
      
      .zen-grid-toolbar-section.left {
        justify-content: flex-start;
        flex: 1;
      }
      
      .zen-grid-toolbar-section.center {
        justify-content: center;
        flex: 1;
        text-align: center;
      }
      
      .zen-grid-toolbar-section.right {
        justify-content: flex-end;
        flex: 1;
      }
      
      /* Düğme stillemesi */
      .zen-grid-toolbar-button {
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 6px 12px;
        margin-right: 8px;
        cursor: pointer;
        font-size: 14px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }
      
      .zen-grid-toolbar-button:hover {
        background-color: #f1f1f1;
        border-color: #c9c9c9;
      }
      
      .zen-grid-toolbar-button:last-child {
        margin-right: 0;
      }
      
      .zen-grid-toolbar-button .icon {
        margin-right: 4px;
        width: 16px;
        height: 16px;
        display: inline-block;
      }
      
      /* Arama kutusu */
      .zen-grid-search {
        position: relative;
        display: inline-block;
      }
      
      .zen-grid-search-input {
        padding: 6px 12px;
        padding-left: 32px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        width: 200px;
        outline: none;
      }
      
      .zen-grid-search-input:focus {
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }
      
      .zen-grid-search-icon {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
      }
    `;
    this.shadow.appendChild(style);
  }
  
  /**
   * Bileşen DOM'a eklendiğinde çağrılır
   */
  connectedCallback() {
    console.log('ZenGridToolbar: connectedCallback çağrıldı');
    
    // Bir kere daha ref oluşturmayı hemen dene
    this.gridElement = this.findZenGridElement();
    console.log('ZenGridToolbar: İlk ref oluşturma - Grid elementi bulundu mu?:', !!this.gridElement);
    
    // DOM tamamen hazır olduğunda grid bileşenini bul
    // Not: DOM bağlantısı tam kurulmadan grid bulunamayabilir, bu nedenle gecikmeli kontrol ekliyoruz
    setTimeout(() => {
      // Yeni bir grid ref bul (eğer ilk aramada bulunmadıysa)
      if (!this.gridElement) {
        this.gridElement = this.findZenGridElement();
        console.log('ZenGridToolbar: Gecikmeli ref oluşturma - Grid elementi bulundu mu?:', !!this.gridElement);
      }
      
      if (this.gridElement) {
        // Referans bilgilerini logla
        console.log('ZenGridToolbar: Grid elementinin ID\'si:', this.gridElement.id);
        console.log('ZenGridToolbar: Grid elementinin classList\'i:', Array.from(this.gridElement.classList));
        
        // Test amaçlı - filter metodunu doğrudan çağırabilir miyiz?
        try {
          console.log('ZenGridToolbar: Grid filter metodu mevcut mu?', typeof (this.gridElement as any).filter === 'function');
        } catch (e) {
          console.warn('ZenGridToolbar: Filter metodu test edilirken hata:', e);
        }
        
        // Toolbar ve grid arasındaki bağlantıyı kuvvetlendir (çift yönlü)
        try {
          // @ts-ignore: grid.toolbar bağlantısı
          if (typeof this.gridElement.toolbar === 'function') {
            // @ts-ignore
            this.gridElement.toolbar(this);
            console.log('ZenGridToolbar: Grid\'e toolbar referansı verildi');
          }
        } catch (e) {
          console.warn('ZenGridToolbar: Grid\'e toolbar referansı verilirken hata:', e);
        }
      }
      
      // Varsayılan araç çubuğu içeriğini oluştur
      this.renderDefaultContent();
      
      // Event dinleyicileri
      this.addEventListener('toolbarOptionsChange', (e) => {
        console.log('ZenGridToolbar: toolbarOptionsChange olayı alındı');
        this.handleToolbarOptionsChange(e);
      });
      
      this.addEventListener('languageChange', (e) => {
        console.log('ZenGridToolbar: languageChange olayı alındı');
        this.handleLanguageChange(e);
      });
      
      // Filtreleme sonuçlarını dinle
      if (this.gridElement) {
        this.gridElement.addEventListener('filtered', (e: Event) => {
          console.log('ZenGridToolbar: Grid filtered olayı alındı');
          const customEvent = e as CustomEvent;
          console.log('ZenGridToolbar: Filtreleme sonucu:', customEvent.detail);
        });
      }
      
      // Yapılandırmayı gridElement'ten al (eğer mevcutsa)
      if (this.gridElement) {
        try {
          // @ts-ignore: toolbar özelliklerine erişim
          const options = this.gridElement.toolbarOptions;
          if (options) {
            console.log('ZenGridToolbar: Grid\'den toolbar seçenekleri alındı:', options);
            // Seçenekleri uygulamak için olay tetikle
            const event = new CustomEvent('toolbarOptionsChange', {
              detail: options
            });
            this.dispatchEvent(event);
          }
        } catch (e) {
          console.error('ZenGridToolbar: Grid\'den toolbar seçenekleri alınırken hata:', e);
        }
      }
    }, 100); // 100ms gecikme ekleyelim, DOM'un tam olarak yüklenmesi için
  }
  
  /**
   * Dil değişimini işler
   */
  private handleLanguageChange(event: Event) {
    console.log('ZenGridToolbar: handleLanguageChange çağrıldı, olay:', event);
    
    try {
      const customEvent = event as CustomEvent;
      const language = customEvent.detail?.language;
      
      console.log('ZenGridToolbar: Gelen dil değeri:', language);
      
      if (language) {
        console.log('ZenGridToolbar: handleLanguageChange - Dil değişiyor:', language);
        
        try {
          // Dil servisini güncelle
          this.translationService.setLanguage(language);
          console.log('ZenGridToolbar: Dil servisi güncellendi');
          
          // Sadece metinleri güncelle, tüm içeriği yeniden oluşturma
          this.updateTranslations();
          console.log('ZenGridToolbar: Çeviriler güncellendi');
        } catch (err) {
          console.error('ZenGridToolbar: Dil değişimi sırasında hata:', err);
        }
      } else {
        console.warn('ZenGridToolbar: Dil değişimi olayında geçerli dil değeri bulunamadı');
      }
    } catch (err) {
      console.error('ZenGridToolbar: Dil değişimi olayı işlenirken hata:', err);
    }
  }
  
  /**
   * Toolbar özelliklerinin değiştiğini dinler
   */
  private handleToolbarOptionsChange(event: Event) {
    const customEvent = event as CustomEvent;
    const options = customEvent.detail;
    
    console.log('ZenGridToolbar: Toolbar seçenekleri değişti:', options);
    console.log('Orijinal veri:', JSON.stringify(options));
    console.log('Arama görünürlüğü:', options.search);
    console.log('Dışa aktarma görünürlüğü:', options.export);
    console.log('Dil:', options.language);
    
    // DOM varlığını kontrol et
    const hasShadowRoot = !!this.shadow;
    console.log('Shadow root var mı?', hasShadowRoot);
    
    // Mevcut seçenekleri sakla
    // Boolean olarak kesin değerler almak için === kullan
    const currentSearchState = options.search === true;
    const currentExportState = options.export === true;
    
    console.log('İşlenmiş arama durumu:', currentSearchState);
    console.log('İşlenmiş dışa aktarma durumu:', currentExportState);
    
    try {
      // Arama özelliğinin görünürlüğünü güncelle
      const searchContainer = this.shadow.querySelector('.zen-grid-search');
      console.log('Arama konteyner elemanı bulundu:', !!searchContainer);
      
      if (searchContainer) {
        // style.display'i doğrudan ayarlamak yerine öğeye veri özniteliği ekleyelim
        if (currentSearchState) {
          searchContainer.removeAttribute('hidden');
          (searchContainer as HTMLElement).style.display = '';
        } else {
          searchContainer.setAttribute('hidden', 'true');
          (searchContainer as HTMLElement).style.display = 'none';
        }
        console.log('Arama konteynerinin yeni görünürlüğü:', (searchContainer as HTMLElement).style.display);
      }
      
      // Dışa aktarma butonlarının görünürlüğünü güncelle
      const exportButtonsContainer = this.shadow.querySelector('.zen-grid-export-buttons');
      console.log('Dışa aktarma butonu konteyner elemanı bulundu:', !!exportButtonsContainer);
      
      if (exportButtonsContainer) {
        // style.display'i doğrudan ayarlamak yerine öğeye veri özniteliği ekleyelim
        if (currentExportState) {
          exportButtonsContainer.removeAttribute('hidden');
          (exportButtonsContainer as HTMLElement).style.display = '';
        } else {
          exportButtonsContainer.setAttribute('hidden', 'true');
          (exportButtonsContainer as HTMLElement).style.display = 'none';
        }
        console.log('Dışa aktarma konteynerinin yeni görünürlüğü:', (exportButtonsContainer as HTMLElement).style.display);
      }
      
      // Dil değişimini kontrol et ve güncelle
      if (options.language) {
        console.log('ZenGridToolbar: Dil değişiyor:', options.language);
        this.translationService.setLanguage(options.language);
        
        // Metinleri güncelle
        this.updateTranslations();
      }
    } catch (error) {
      console.error('ZenGridToolbar: Toolbar seçenekleri güncellenirken hata:', error);
    }
  }
  
  /**
   * Dil değiştiğinde metinleri günceller
   */
  private updateTranslations(): void {
    console.log('ZenGridToolbar: updateTranslations başladı, aktif dil:', this.translationService.getLanguage());
    
    try {
      // Arama placeholder'ını güncelle
      const searchInput = this.shadow.querySelector('.zen-grid-search-input') as HTMLInputElement;
      if (searchInput) {
        const placeholder = this.translationService.translate(TranslationKey.SEARCH_PLACEHOLDER);
        console.log('ZenGridToolbar: Arama placeholder güncelleniyor:', placeholder);
        searchInput.placeholder = placeholder;
      } else {
        console.log('ZenGridToolbar: Arama alanı bulunamadı');
      }
      
      // Başlığı güncelle
      const title = this.shadow.querySelector('.zen-grid-toolbar-title');
      if (title) {
        const titleText = this.translationService.translate(TranslationKey.TABLE_TITLE);
        console.log('ZenGridToolbar: Başlık güncelleniyor:', titleText);
        title.textContent = titleText;
      } else {
        console.log('ZenGridToolbar: Başlık alanı bulunamadı');
      }
      
      // Buton başlıklarını güncelle
      const buttons = this.shadow.querySelectorAll('.zen-grid-toolbar-button');
      console.log('ZenGridToolbar: Güncellenecek buton sayısı:', buttons.length);
      
      buttons.forEach(button => {
        const action = (button as HTMLElement).dataset.action;
        if (action) {
          let translationKey: TranslationKey | null = null;
          
          if (action === 'export-csv') {
            translationKey = TranslationKey.EXPORT_CSV;
          } else if (action === 'export-json') {
            translationKey = TranslationKey.EXPORT_JSON;
          } else if (action === 'export-pdf') {
            translationKey = TranslationKey.EXPORT_PDF;
          } else if (action === 'export-excel') {
            translationKey = TranslationKey.EXPORT_EXCEL;
          }
          
          if (translationKey) {
            const buttonTitle = this.translationService.translate(translationKey);
            console.log(`ZenGridToolbar: "${action}" butonu için başlık güncelleniyor:`, buttonTitle);
            button.setAttribute('title', buttonTitle);
          }
        }
      });
      
      console.log('ZenGridToolbar: Tüm çeviriler başarıyla güncellendi');
    } catch (err) {
      console.error('ZenGridToolbar: Çeviriler güncellenirken hata:', err);
    }
  }
  
  /**
   * Varsayılan araç çubuğu içeriğini oluşturur
   */
  private renderDefaultContent(): void {
    // Önce mevcut içeriği temizle
    this.clearAll();
    
    // Toolbar seçeneklerini ara
    let searchVisible = true;
    let exportVisible = true;
    
    // Seçenekleri al
    const zenGrid = this.findZenGridElement();
    if (zenGrid) {
      try {
        // @ts-ignore: ZenGrid.toolbarOptions özelliğine erişme
        const options = zenGrid.toolbarOptions;
        if (options) {
          searchVisible = options.search !== false; // undefined ise true kabul et
          exportVisible = options.export !== false; // undefined ise true kabul et
          console.log('ZenGridToolbar: İçerik oluşturulurken seçenekler alındı:', { searchVisible, exportVisible });
        }
      } catch (err) {
        console.warn('ZenGridToolbar: Seçenekler alınamadı', err);
      }
    }
    
    // Sol bölüm - Arama kutusu
    const searchContainer = DomUtils.createElement('div', { class: 'zen-grid-search' });
    if (!searchVisible) {
      searchContainer.style.display = 'none';
    }
    
    const searchIcon = DomUtils.createElement('span', { class: 'zen-grid-search-icon' }, ['🔍']);
    const searchInput = DomUtils.createElement('input', {
      class: 'zen-grid-search-input',
      type: 'text',
      placeholder: this.translationService.translate(TranslationKey.SEARCH_PLACEHOLDER)
    });
    
    searchInput.addEventListener('input', (e) => {
      console.log('ZenGridToolbar: Search input event tetiklendi');
      
      // Her zaman en güncel grid referansı ile çalış
      if (!this.gridElement) {
        this.gridElement = this.findZenGridElement();
        console.log('ZenGridToolbar: Grid referansı bulundu mu:', !!this.gridElement);
      }
      
      // Arama metnini al ve boşlukları kırp
      const searchTerm = (e.target as HTMLInputElement).value;
      console.log('ZenGridToolbar: Arama terimi:', searchTerm);
      
      // Filtreleme işlemi
      this.performSearch(searchTerm);
    });
    
    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(searchInput);
    this.leftSection.appendChild(searchContainer);
    
    // Orta bölüm - Tablo başlığı veya bilgi metni
    const title = DomUtils.createElement('h3', { class: 'zen-grid-toolbar-title' }, [
      this.translationService.translate(TranslationKey.TABLE_TITLE)
    ]);
    this.centerSection.appendChild(title);
    
    // Sağ bölüm - Dışa aktarma butonları
    const exportButtonsContainer = DomUtils.createElement('div', { class: 'zen-grid-export-buttons' });
    if (!exportVisible) {
      exportButtonsContainer.style.display = 'none';
    }
    
    // CSV olarak dışa aktar
    const csvButton = DomUtils.createElement('button', { 
      class: 'zen-grid-toolbar-button',
      'data-action': 'export-csv',
      title: this.translationService.translate(TranslationKey.EXPORT_CSV)
    }, ['CSV']);
    csvButton.addEventListener('click', () => this.exportCSV());
    
    // JSON olarak dışa aktar
    const jsonButton = DomUtils.createElement('button', { 
      class: 'zen-grid-toolbar-button',
      'data-action': 'export-json',
      title: this.translationService.translate(TranslationKey.EXPORT_JSON)
    }, ['JSON']);
    jsonButton.addEventListener('click', () => this.exportJSON());
    
    // PDF olarak dışa aktar
    const pdfButton = DomUtils.createElement('button', { 
      class: 'zen-grid-toolbar-button',
      'data-action': 'export-pdf',
      title: this.translationService.translate(TranslationKey.EXPORT_PDF)
    }, ['PDF']);
    pdfButton.addEventListener('click', () => this.exportPDF());
    
    // Excel olarak dışa aktar
    const excelButton = DomUtils.createElement('button', { 
      class: 'zen-grid-toolbar-button',
      'data-action': 'export-excel',
      title: this.translationService.translate(TranslationKey.EXPORT_EXCEL)
    }, ['Excel']);
    excelButton.addEventListener('click', () => this.exportExcel());
    
    exportButtonsContainer.appendChild(csvButton);
    exportButtonsContainer.appendChild(jsonButton);
    exportButtonsContainer.appendChild(pdfButton);
    exportButtonsContainer.appendChild(excelButton);
    this.rightSection.appendChild(exportButtonsContainer);
  }
  
  /**
   * Arama işlemini gerçekleştirir
   */
  private performSearch(searchTerm: string): void {
    // Grid referansı yoksa bulmaya çalış
    if (!this.gridElement) {
      this.gridElement = this.findZenGridElement();
    }
    
    if (this.gridElement) {
      console.log('ZenGridToolbar: Grid referansı bulundu, arama yapılıyor');
      
      // Filtreleri oluştur
      const filters = { searchTerm: searchTerm };
      console.log('ZenGridToolbar: Oluşturulan filtreler:', filters);
      
      // 1. CustomEvent ile filtre bildirimini gönder
      try {
        console.log('ZenGridToolbar: FilterChange olayı gönderiliyor...');
        const filterEvent = new CustomEvent('filterChange', {
          detail: filters,
          bubbles: true,  // Olayın yukarı doğru kabarcıklanmasını sağla
          composed: true  // Shadow DOM sınırlarından geçmesini sağla
        });
        this.gridElement.dispatchEvent(filterEvent);
        console.log('ZenGridToolbar: FilterChange olayı gönderildi');
        return;
      } catch (err) {
        console.error('ZenGridToolbar: Olay gönderilirken hata:', err);
      }
      
      // 2. Direkt metot çağrısı (1. yöntem başarısız olursa)
      try {
        console.log('ZenGridToolbar: Doğrudan filter metodu çağrılıyor');
        if (typeof (this.gridElement as any).filter === 'function') {
          (this.gridElement as any).filter(filters);
          console.log('ZenGridToolbar: filter metodu başarıyla çağrıldı');
          return;
        } else {
          console.warn('ZenGridToolbar: filter metodu bulunamadı');
        }
      } catch (err) {
        console.error('ZenGridToolbar: filter metodu çağırma hatası:', err);
      }
    }
    
    // Hiçbir yöntem çalışmazsa, document üzerinden son bir deneme yap
    console.warn('ZenGridToolbar: Normal yöntemlerle grid bulunamadı, document üzerinden aranıyor');
    const gridElements = document.querySelectorAll('zen-grid');
    if (gridElements.length > 0) {
      this.gridElement = gridElements[0] as HTMLElement;
      console.log('ZenGridToolbar: Document üzerinde grid bulundu, tekrar deneniyor');
      
      try {
        // Filtreleri oluştur
        const filters = { searchTerm: searchTerm };
        
        const filterEvent = new CustomEvent('filterChange', {
          detail: filters,
          bubbles: true,
          composed: true
        });
        gridElements[0].dispatchEvent(filterEvent);
        console.log('ZenGridToolbar: Document üzerindeki grid ile filtreleme yapıldı');
      } catch (err) {
        console.error('ZenGridToolbar: Document üzerindeki grid ile filtreleme hatası:', err);
      }
    } else {
      console.error('ZenGridToolbar: Hiçbir şekilde grid elementi bulunamadı');
      
      // Son çare: Grid bulunamadığında uyarı göster
      alert('Grid bulunamadı, arama yapılamıyor. Sayfayı yenileyin ve tekrar deneyin.');
    }
  }
  
  /**
   * En yakın ZenGrid bileşenini bulur
   */
  private findZenGridElement(): HTMLElement | null {
    console.log('ZenGridToolbar: findZenGridElement çağrıldı');
    
    // Mevcut grid referansı
    if (this.gridElement) {
      console.log('ZenGridToolbar: Mevcut grid referansı kullanılıyor');
      return this.gridElement;
    }
    
    // 1. Önce kardeş elementleri kontrol et
    // 1.1 Sonraki kardeş elementi kontrol et (en yaygın durum)
    const nextSibling = this.nextElementSibling;
    if (nextSibling && nextSibling.tagName.toLowerCase() === 'zen-grid') {
      console.log('ZenGridToolbar: Sonraki eleman olarak zen-grid bulundu');
      return nextSibling as HTMLElement;
    }
    
    // 1.2 Önceki kardeş elementi kontrol et
    const prevSibling = this.previousElementSibling;
    if (prevSibling && prevSibling.tagName.toLowerCase() === 'zen-grid') {
      console.log('ZenGridToolbar: Önceki eleman olarak zen-grid bulundu');
      return prevSibling as HTMLElement;
    }
    
    // 2. Üst eleman içindeki tüm zen-grid elementlerini bul
    const parent = this.parentElement;
    if (parent) {
      const zenGridsInParent = parent.querySelectorAll('zen-grid');
      if (zenGridsInParent.length > 0) {
        console.log('ZenGridToolbar: Üst eleman içinde zen-grid bulundu');
        return zenGridsInParent[0] as HTMLElement;
      }
    }
    
    // 3. shadow root ve diğer konteynerleri kontrol et
    try {
      // Üst containerların içinde ara
      let currentParent = this.parentElement;
      while (currentParent) {
        const containers = currentParent.querySelectorAll('.container, .wrapper, main, section, div');
        for (const container of Array.from(containers)) {
          const grids = container.querySelectorAll('zen-grid');
          if (grids.length > 0) {
            console.log('ZenGridToolbar: Container içinde zen-grid bulundu');
            return grids[0] as HTMLElement;
          }
        }
        currentParent = currentParent.parentElement;
      }
    } catch (err) {
      console.warn('İç içe konteyner araması sırasında hata:', err);
    }
    
    // 4. Tüm dokümandaki zen-grid elementlerini ara
    const allZenGrids = document.querySelectorAll('zen-grid');
    if (allZenGrids.length > 0) {
      console.log('ZenGridToolbar: Dokümanda zen-grid bulundu, ilki seçiliyor');
      console.log('ZenGridToolbar: Bulunan grid IDs:', Array.from(allZenGrids).map(g => g.id || 'id-yok'));
      return allZenGrids[0] as HTMLElement;
    }
    
    // 5. Uzak ihtimal: Custom elementler yüklenmemiş olabilir, biraz bekleyip tekrar deneyelim
    setTimeout(() => {
      console.log('ZenGridToolbar: Custom elementlerin yüklenmesi için bekleniliyor...');
      const gridsAfterTimeout = document.querySelectorAll('zen-grid');
      if (gridsAfterTimeout.length > 0) {
        console.log('ZenGridToolbar: Gecikmeli olarak grid bulundu');
        this.gridElement = gridsAfterTimeout[0] as HTMLElement;
        
        // Grid'i bulduktan sonra event'i bağlayalım
        if (this.gridElement) {
          // Bağlantıyı iki yönlü yapalım
          try {
            if (typeof (this.gridElement as any).toolbar === 'function') {
              (this.gridElement as any).toolbar = this;
              console.log('ZenGridToolbar: Grid ile iki yönlü bağlantı kuruldu');
            }
          } catch (err) {
            console.warn('ZenGridToolbar: Grid ile iki yönlü bağlantı kurulamadı', err);
          }
        }
      }
    }, 100);
    
    console.warn('ZenGridToolbar: Hiçbir zen-grid elementi bulunamadı');
    return null;
  }
  
  /**
   * CSV olarak dışa aktarma
   */
  private exportCSV(): void {
    if (!this.gridElement) return;
    
    console.log('CSV dışa aktarma işlemi başlatıldı');
    // Gerçek implementasyon eklenecek
    
    // Örnek: veriyi al ve CSV'ye dönüştür
    const gridInstance = this.gridElement as any;
    if (gridInstance.data && Array.isArray(gridInstance.data)) {
      const data = gridInstance.data;
      
      // CSV başlık satırı
      let csvContent = "";
      if (gridInstance.columns && Array.isArray(gridInstance.columns)) {
        const headers = gridInstance.columns.map((col: any) => col.header || col.field);
        csvContent += headers.join(',') + '\n';
        
        // Veri satırları
        data.forEach((row: any) => {
          const rowContent = gridInstance.columns.map((col: any) => {
            const value = row[col.field];
            // CSV'de virgül ve çift tırnakları kaçış karakteri ile işle
            return `"${String(value).replace(/"/g, '""')}"`;
          });
          csvContent += rowContent.join(',') + '\n';
        });
        
        // CSV dosyasını indir
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'zen-grid-export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
  
  /**
   * PDF olarak dışa aktarma
   */
  private exportPDF(): void {
    if (!this.gridElement) return;
    
    console.log('PDF dışa aktarma işlemi başlatıldı');
    // Not: PDF çıktısı için genellikle ilave kütüphaneler gereklidir
    // Gerçek implementasyon için jsPDF gibi bir kütüphane kullanılabilir
    
    alert('PDF dışa aktarma özelliği yakında eklenecek!');
  }
  
  /**
   * Verileri JSON olarak dışa aktarır
   */
  private exportJSON(): void {
    if (!this.gridElement) return;
    
    try {
      // Grid üzerinden veriyi al
      const data = (this.gridElement as any).data;
      
      if (!data || !data.length) {
        console.warn('Dışa aktarılacak veri bulunamadı');
        return;
      }
      
      // JSON verisini oluştur
      const jsonStr = JSON.stringify(data, null, 2);
      
      // Veriyi indirme işlemi
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = 'grid-data.json';
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('JSON dışa aktarma hatası:', error);
    }
  }
  
  /**
   * Verileri Excel olarak dışa aktarır
   */
  private exportExcel(): void {
    if (!this.gridElement) return;
    
    try {
      // Grid üzerinden veriyi al
      const data = (this.gridElement as any).data;
      
      if (!data || !data.length) {
        console.warn('Dışa aktarılacak veri bulunamadı');
        return;
      }
      
      // CSV formatına dönüştür (Excel için basit yaklaşım)
      const columns = (this.gridElement as any).columns;
      
      // Başlık satırı
      let csvContent = columns.map((col: any) => `"${col.header}"`).join(',') + '\r\n';
      
      // Veri satırları
      data.forEach((row: any) => {
        const rowValues = columns.map((col: any) => {
          const value = row[col.field];
          return `"${value !== undefined && value !== null ? value : ''}"`;
        });
        csvContent += rowValues.join(',') + '\r\n';
      });
      
      // Veriyi indirme işlemi
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = 'grid-data.xlsx';
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Excel dışa aktarma hatası:', error);
    }
  }
  
  /**
   * Sol bölüme içerik ekler
   */
  addToLeftSection(element: HTMLElement): void {
    this.leftSection.appendChild(element);
  }
  
  /**
   * Orta bölüme içerik ekler
   */
  addToCenterSection(element: HTMLElement): void {
    this.centerSection.appendChild(element);
  }
  
  /**
   * Sağ bölüme içerik ekler
   */
  addToRightSection(element: HTMLElement): void {
    this.rightSection.appendChild(element);
  }
  
  /**
   * Sol bölümü temizler
   */
  clearLeftSection(): void {
    DomUtils.clearElement(this.leftSection);
  }
  
  /**
   * Orta bölümü temizler
   */
  clearCenterSection(): void {
    DomUtils.clearElement(this.centerSection);
  }
  
  /**
   * Sağ bölümü temizler
   */
  clearRightSection(): void {
    DomUtils.clearElement(this.rightSection);
  }
  
  /**
   * Tüm araç çubuğunu temizler
   */
  clearAll(): void {
    this.clearLeftSection();
    this.clearCenterSection();
    this.clearRightSection();
  }
} 