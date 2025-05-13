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
    // En yakın ZenGrid bileşenini bul
    this.gridElement = this.findZenGridElement();
    
    // Varsayılan araç çubuğu içeriğini oluştur
    this.renderDefaultContent();
    
    // Toolbar özelliklerini dinle
    this.addEventListener('toolbarOptionsChange', this.handleToolbarOptionsChange.bind(this));
    
    // Toolbar dil değişimi olayını dinle
    this.addEventListener('languageChange', this.handleLanguageChange.bind(this));
  }
  
  /**
   * Dil değişimini işler
   */
  private handleLanguageChange(event: Event) {
    const customEvent = event as CustomEvent;
    const language = customEvent.detail?.language;
    
    if (language) {
      this.translationService.setLanguage(language);
      this.renderDefaultContent(); // İçeriği yeniden oluştur
    }
  }
  
  /**
   * Toolbar özelliklerinin değiştiğini dinler
   */
  private handleToolbarOptionsChange(event: Event) {
    const customEvent = event as CustomEvent;
    const options = customEvent.detail;
    
    // Arama özelliğinin görünürlüğünü güncelle
    const searchContainer = this.shadow.querySelector('.zen-grid-search');
    if (searchContainer) {
      (searchContainer as HTMLElement).style.display = options.search ? '' : 'none';
    }
    
    // Dışa aktarma butonlarının görünürlüğünü güncelle
    const exportButtons = this.shadow.querySelectorAll('.zen-grid-toolbar-button[data-action^="export"]');
    exportButtons.forEach(button => {
      (button as HTMLElement).style.display = options.export ? '' : 'none';
    });
    
    // Dil değişimini kontrol et ve güncelle
    if (options.language) {
      this.translationService.setLanguage(options.language);
      this.renderDefaultContent(); // İçeriği yeniden oluştur
    }
  }
  
  /**
   * Varsayılan araç çubuğu içeriğini oluşturur
   */
  private renderDefaultContent(): void {
    // Önce mevcut içeriği temizle
    this.clearAll();
    
    // Sol bölüm - Arama kutusu
    const searchContainer = DomUtils.createElement('div', { class: 'zen-grid-search' });
    const searchIcon = DomUtils.createElement('span', { class: 'zen-grid-search-icon' }, ['🔍']);
    const searchInput = DomUtils.createElement('input', {
      class: 'zen-grid-search-input',
      type: 'text',
      placeholder: this.translationService.translate(TranslationKey.SEARCH_PLACEHOLDER)
    });
    
    searchInput.addEventListener('input', (e) => {
      if (this.gridElement) {
        const searchTerm = (e.target as HTMLInputElement).value;
        // Tüm alanlarda basit bir arama yapmak için
        if (searchTerm.trim() !== '') {
          const filters = { searchTerm };
          // @ts-ignore: gridElement üzerindeki filter metodu
          this.gridElement.filter(filters);
        } else {
          // @ts-ignore: gridElement üzerindeki filter metodu
          this.gridElement.filter({});
        }
      }
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
   * En yakın ZenGrid bileşenini bulur
   */
  private findZenGridElement(): HTMLElement | null {
    // Eğer bir sonraki kardeş eleman ZenGrid ise onu döndür
    const nextSibling = this.nextElementSibling;
    if (nextSibling && nextSibling.tagName.toLowerCase() === 'zen-grid') {
      return nextSibling as HTMLElement;
    }
    
    // Eğer bir üst eleman içinde ZenGrid varsa onu döndür
    const parent = this.parentElement;
    if (parent) {
      const zenGridInParent = parent.querySelector('zen-grid');
      if (zenGridInParent) {
        return zenGridInParent as HTMLElement;
      }
    }
    
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