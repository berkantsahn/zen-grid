import { GridOptions, Column, PaginationOptions, SortOptions, ToolbarOptions } from '../core/models/';
import { IColumn, ISortOptions, IPaginationOptions, IToolbarOptions, SortDirection } from '../core/interfaces';
import { DomUtils, DataUtils, TranslationService, TranslationKey } from '../core/utils';

/**
 * ZenGrid web bileşeni
 */
export class ZenGrid extends HTMLElement {
  // Shadow DOM
  private shadow!: ShadowRoot;
  
  // Temel konteynerler
  private tableContainer!: HTMLDivElement;
  private tableElement!: HTMLTableElement;
  private tableHead!: HTMLTableSectionElement;
  private tableBody!: HTMLTableSectionElement;
  private paginationContainer!: HTMLDivElement;
  
  // Toolbar referansı
  private toolbarElement: HTMLElement | null = null;
  
  // Veri ve yapılandırma
  private _options!: GridOptions;
  private _filteredData: any[] = [];
  private _selectedRows: any[] = [];
  
  // Dil servis referansı
  private translationService: TranslationService = TranslationService.getInstance();
  
  /**
   * Yapıcı metod
   */
  constructor() {
    super();
    
    console.log('ZenGrid: constructor çağrıldı');
    
    // Shadow DOM oluştur
    this.shadow = this.attachShadow({ mode: 'open' });
    
    // Varsayılan seçenekleri ayarla
    this._options = new GridOptions({
      columns: [],
      data: [],
      striped: true,
      bordered: true,
      responsive: true,
      showHeader: true,
      toolbarOptions: {
        visible: true,
        search: true,
        export: true
      }
    });
    
    // Temel yapıyı oluştur
    this.createBaseStructure();
    
    // Stil oluştur
    this.createStyles();
  }
  
  /**
   * Temel tablo yapısını oluşturur
   */
  private createBaseStructure(): void {
    // Ana konteyner
    this.tableContainer = DomUtils.createElement('div', { class: 'zen-grid-container' });
    
    // Tablo elementi
    this.tableElement = DomUtils.createElement('table', { class: 'zen-grid-table' });
    
    // Tablo başlığı ve gövdesi
    this.tableHead = DomUtils.createElement('thead');
    this.tableBody = DomUtils.createElement('tbody');
    
    // Tabloyu oluştur
    this.tableElement.appendChild(this.tableHead);
    this.tableElement.appendChild(this.tableBody);
    this.tableContainer.appendChild(this.tableElement);
    
    // Sayfalama konteynerı
    this.paginationContainer = DomUtils.createElement('div', { class: 'zen-grid-pagination' });
    this.tableContainer.appendChild(this.paginationContainer);
    
    // Shadow DOM'a ekle
    this.shadow.appendChild(this.tableContainer);
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
        --primary-color: #1976d2;
        --primary-light: #e3f2fd;
        --border-color: #e0e0e0;
        --hover-color: #f5f5f5;
        --selected-color: rgba(25, 118, 210, 0.1);
        --header-bg: #fafafa;
        --row-border: #f0f0f0;
        --text-color: #424242;
      }
      
      .zen-grid-container {
        overflow: auto;
        width: 100%;
        border-radius: 0 0 4px 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        position: relative;
      }
      
      .zen-grid-table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        margin-bottom: 0;
        color: var(--text-color);
        font-size: 0.9rem;
      }
      
      .zen-grid-table.bordered {
        border: 1px solid var(--border-color);
      }
      
      .zen-grid-table th,
      .zen-grid-table td {
        padding: 0.75rem 1rem;
        vertical-align: middle;
        text-align: left;
        border-top: 1px solid var(--row-border);
        transition: background-color 0.15s ease-in-out;
      }
      
      .zen-grid-table.bordered th,
      .zen-grid-table.bordered td {
        border: 1px solid var(--border-color);
      }
      
      .zen-grid-table thead th {
        position: sticky;
        top: 0;
        vertical-align: bottom;
        border-bottom: 2px solid var(--border-color);
        font-weight: 600;
        background-color: var(--header-bg);
        cursor: pointer;
        user-select: none;
        z-index: 1;
        white-space: nowrap;
        padding-right: 1.5rem; /* Space for sort icon */
      }
      
      .zen-grid-table thead th:hover {
        background-color: #f0f0f0;
      }
      
      .zen-grid-table.striped tbody tr:nth-of-type(odd) {
        background-color: rgba(0, 0, 0, 0.02);
      }
      
      .zen-grid-table tbody tr:hover {
        background-color: var(--hover-color);
      }
      
      .zen-grid-table tbody tr.selected {
        background-color: var(--selected-color);
      }
      
      .zen-grid-pagination {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        background-color: var(--header-bg);
        border-top: 1px solid var(--border-color);
        font-size: 0.85rem;
      }
      
      .zen-grid-pagination-info {
        color: #757575;
      }
      
      .zen-grid-pagination-buttons {
        display: flex;
        gap: 0.25rem;
      }
      
      .zen-grid-pagination-button {
        background-color: white;
        border: 1px solid var(--border-color);
        padding: 0.35rem 0.6rem;
        cursor: pointer;
        font-size: 0.85rem;
        min-width: 2rem;
        text-align: center;
        border-radius: 3px;
        transition: all 0.2s ease;
      }
      
      .zen-grid-pagination-button:hover {
        background-color: var(--hover-color);
        border-color: #ccc;
      }
      
      .zen-grid-pagination-button.active {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
        color: white;
      }
      
      .zen-grid-pagination-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: #f5f5f5;
      }
      
      .zen-grid-sort-icon {
        position: absolute;
        margin-left: 0.35rem;
        width: 0;
        height: 0;
        vertical-align: middle;
        right: 0.5rem;
        top: calc(50% - 3px);
        color: #aaaaaa;
      }
      
      .zen-grid-sort-icon.asc {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 6px solid currentColor;
      }
      
      .zen-grid-sort-icon.desc {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 6px solid currentColor;
      }
      
      .zen-grid-empty-message {
        padding: 3rem 1rem;
        text-align: center;
        color: #757575;
        font-style: italic;
        background-color: #fafafa;
      }
      
      @media (max-width: 768px) {
        .zen-grid-table.responsive thead {
          display: none;
        }
        
        .zen-grid-table.responsive tbody tr {
          display: block;
          margin-bottom: 0.75rem;
          border: 1px solid var(--border-color);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border-radius: 4px;
        }
        
        .zen-grid-table.responsive tbody td {
          display: block;
          text-align: right;
          padding: 0.5rem 0.75rem;
          border-top: none;
          border-bottom: 1px solid var(--row-border);
        }
        
        .zen-grid-table.responsive tbody td:last-child {
          border-bottom: none;
        }
        
        .zen-grid-table.responsive tbody td::before {
          content: attr(data-label);
          float: left;
          font-weight: bold;
          margin-right: 1rem;
          color: #666;
        }
      }
    `;
    this.shadow.appendChild(style);
  }
  
  /**
   * Bileşen DOM'a eklendiğinde çağrılır
   */
  connectedCallback() {
    // Log ekle
    console.log('ZenGrid: connectedCallback çağrıldı');
    
    // Özellik gözlemcilerini ayarla
    this.setupPropertyObservers();
    
    // MutationObserver oluştur, propertychange eventlerini dinle
    this.setupPropertyChangeObserver();
    
    // Toolbar entegrasyonu
    this.setupToolbarIntegration();
    
    // Filtreleme olayını dinle
    this.addEventListener('filterChange', (e: Event) => {
      console.log('ZenGrid: filterChange olayı alındı');
      const customEvent = e as CustomEvent;
      const filters = customEvent.detail;
      
      // Debug için log ekleyelim
      console.log('ZenGrid: Filtreleme yapılacak, filtreler:', JSON.stringify(filters));
      
      // Event'i durduralım ki yukarı doğru kabarcıklanmasın
      e.stopPropagation();
      
      // Filtrelerin geçerli olduğundan emin olalım
      if (filters) {
        console.log('ZenGrid: Olay ile filtreleme yapılıyor:', filters);
        
        // Uygulamadan önce filtreleri kontrol edelim
        try {
          this.filter(filters);
          console.log('ZenGrid: Filtreleme başarılı');
        } catch (err) {
          console.error('ZenGrid: Filtreleme sırasında hata:', err);
        }
      } else {
        console.warn('ZenGrid: Filtreleme için geçerli değer bulunamadı');
      }
    });
    
    // Eğer toolbarElement hala yoksa ve toolbarOptions varsa veya yoksa
    if (!this.toolbarElement) {
      console.log('ZenGrid: Toolbar elementi bulunamadı, yenisi oluşturuluyor');
      
      // Eğer toolbarOptions yoksa, varsayılan değerleri oluştur
      if (!this._options.toolbarOptions) {
        console.log('ZenGrid: Toolbar seçenekleri bulunamadı, varsayılan değerler ayarlanıyor');
        this._options.toolbarOptions = new ToolbarOptions({
          visible: true,
          search: true,
          export: true,
          language: this._options.language || 'tr'
        });
      }
      
      // Toolbar oluştur ve DOM'a ekle
      this.toolbarElement = document.createElement('zen-grid-toolbar') as HTMLElement;
      this.parentNode?.insertBefore(this.toolbarElement, this);
      console.log('ZenGrid: Yeni toolbar elementi oluşturuldu ve DOM\'a eklendi');
    }
    
    // Toolbar'ı güncelle
    setTimeout(() => {
      console.log('ZenGrid: Gecikmeli olarak toolbar güncelleniyor');
      this.updateToolbar();
    }, 0);
    
    // Render
    this.render();
  }
  
  /**
   * Dışarıdan obje olarak verilebilen özellikler için otomatik dönüşüm
   */
  private setupPropertyObservers() {
    // JS ve HTML özellikleri arasında otomatik dönüşüm için event listener
    
    // Angular, React, Vue gibi frameworklerden direkt olarak
    // property setting için bir dinleyici
    this.addEventListener('propertyChange', (e: Event) => {
      const customEvent = e as CustomEvent;
      const { property, value } = customEvent.detail;
      
      // Özellik adına göre işlemi yönlendir
      switch (property) {
        case 'toolbarOptions':
          this.setToolbarOptions(value);
          break;
          
        case 'paginationOptions':
          this.setPaginationOptions(value);
          break;
          
        case 'sortOptions':
          this.setSortOptions(value);
          break;
      }
    });
  }
  
  /**
   * ToolbarOptions için özel setter
   */
  private setToolbarOptions(value: any): void {
    console.log('ZenGrid: setToolbarOptions çağrıldı', value);
    
    // String olarak alınabilir (HTML attribute olarak geldiğinde)
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
        console.log('ZenGrid: String toolbar options JSON olarak parse edildi:', value);
      } catch (e) {
        console.error('Geçersiz toolbar options string formatı:', e);
        return;
      }
    }
    
    // Mevcut seçeneklerle birleştir
    const currentOptions = this._options.toolbarOptions || {};
    const mergedOptions = {
      ...currentOptions,
      ...value
    };
    
    console.log('ZenGrid: Toolbar seçenekleri birleştirildi:', mergedOptions);
    
    // Nesne olarak ayarla
    this.toolbarOptions = mergedOptions;
  }
  
  /**
   * PaginationOptions için özel setter
   */
  private setPaginationOptions(value: any): void {
    // String olarak alınabilir (HTML attribute olarak geldiğinde)
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch (e) {
        console.error('Geçersiz pagination options string formatı:', e);
        return;
      }
    }
    
    // Nesne olarak ayarla
    this.paginationOptions = value;
  }
  
  /**
   * SortOptions için özel setter
   */
  private setSortOptions(value: any): void {
    // String olarak alınabilir (HTML attribute olarak geldiğinde)
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch (e) {
        console.error('Geçersiz sort options string formatı:', e);
        return;
      }
    }
    
    // Nesne olarak ayarla
    this.sortOptions = value;
  }
  
  /**
   * Toolbar entegrasyonu
   */
  private setupToolbarIntegration(): void {
    // Bir önceki kardeş elementi kontrol et (zen-grid-toolbar mu?)
    const previousSibling = this.previousElementSibling;
    if (previousSibling && previousSibling.tagName.toLowerCase() === 'zen-grid-toolbar') {
      this.toolbarElement = previousSibling as HTMLElement;
      console.log('ZenGrid: Toolbar bileşeni bulundu ve otomatik olarak entegre edildi.');
    }
  }
  
  /**
   * Toolbar'ı ayarlar
   */
  set toolbar(element: HTMLElement | null) {
    this.toolbarElement = element;
  }
  
  /**
   * Toolbar elementini döndürür
   */
  get toolbar(): HTMLElement | null {
    return this.toolbarElement;
  }
  
  /**
   * İzlenen özellikleri tanımlar
   */
  static get observedAttributes() {
    return ['columns', 'data', 'height', 'striped', 'bordered', 'responsive', 'toolbar-options', 'language'];
  }
  
  /**
   * Bir özellik değiştiğinde çağrılır
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    
    console.log(`ZenGrid: attributeChangedCallback - ${name} değişti:`, newValue);
    
    switch (name) {
      case 'columns':
      case 'data':
        try {
          const parsedValue = JSON.parse(newValue);
          if (name === 'columns') {
            this.columns = parsedValue;
          } else {
            this.data = parsedValue;
          }
        } catch (e) {
          console.error(`Geçersiz ${name} formatı:`, e);
        }
        break;
        
      case 'toolbar-options':
        try {
          const parsedValue = JSON.parse(newValue);
          console.log('ZenGrid: Toolbar options parsed:', parsedValue);
          
          // Mevcut değerlerle birleştirerek ayarla
          const currentOptions = this._options.toolbarOptions || {};
          const mergedOptions = {
            ...currentOptions,
            ...parsedValue
          };
          
          console.log('ZenGrid: Toolbar options merged:', mergedOptions);
          this.toolbarOptions = mergedOptions;
        } catch (e) {
          console.error('Geçersiz toolbar-options formatı:', e);
        }
        break;
        
      case 'pagination-options':
        try {
          const parsedValue = JSON.parse(newValue);
          this.paginationOptions = parsedValue;
        } catch (e) {
          console.error('Geçersiz pagination-options formatı:', e);
        }
        break;
        
      case 'sort-options':
        try {
          const parsedValue = JSON.parse(newValue);
          this.sortOptions = parsedValue;
        } catch (e) {
          console.error('Geçersiz sort-options formatı:', e);
        }
        break;
        
      case 'height':
        this.height = newValue;
        break;
        
      case 'striped':
        this.striped = newValue !== null && newValue !== 'false';
        break;
        
      case 'bordered':
        this.bordered = newValue !== null && newValue !== 'false';
        break;
        
      case 'responsive':
        this.responsive = newValue !== null && newValue !== 'false';
        break;
        
      case 'language':
        this.language = newValue;
        break;
        
      default:
        console.warn(`Bilinmeyen özellik değişti: ${name}`);
        break;
    }
    
    this.render();
  }
  
  /**
   * Veri getter
   */
  get data(): any[] {
    return this._options.data;
  }
  
  /**
   * Veri setter
   */
  set data(value: any[]) {
    this._options.data = value || [];
    this._filteredData = [...this._options.data];
    this._selectedRows = [];
    this.render();
  }
  
  /**
   * Sütunlar getter
   */
  get columns(): IColumn[] {
    return this._options.columns;
  }
  
  /**
   * Sütunlar setter
   */
  set columns(value: IColumn[]) {
    this._options.columns = value.map(col => new Column(col));
    this.render();
  }
  
  /**
   * Yükseklik getter
   */
  get height(): string | undefined {
    return this._options.height;
  }
  
  /**
   * Yükseklik setter
   */
  set height(value: string | undefined) {
    this._options.height = value;
    if (value) {
      this.tableContainer.style.height = value;
      this.tableContainer.style.overflow = 'auto';
    } else {
      this.tableContainer.style.height = '';
    }
  }
  
  /**
   * Çizgili görünüm getter
   */
  get striped(): boolean {
    return !!this._options.striped;
  }
  
  /**
   * Çizgili görünüm setter
   */
  set striped(value: boolean) {
    this._options.striped = value;
    if (value) {
      DomUtils.addClass(this.tableElement, 'striped');
    } else {
      DomUtils.removeClass(this.tableElement, 'striped');
    }
  }
  
  /**
   * Kenarlıklı görünüm getter
   */
  get bordered(): boolean {
    return !!this._options.bordered;
  }
  
  /**
   * Kenarlıklı görünüm setter
   */
  set bordered(value: boolean) {
    this._options.bordered = value;
    if (value) {
      DomUtils.addClass(this.tableElement, 'bordered');
    } else {
      DomUtils.removeClass(this.tableElement, 'bordered');
    }
  }
  
  /**
   * Duyarlı görünüm getter
   */
  get responsive(): boolean {
    return !!this._options.responsive;
  }
  
  /**
   * Duyarlı görünüm setter
   */
  set responsive(value: boolean) {
    this._options.responsive = value;
    if (value) {
      DomUtils.addClass(this.tableElement, 'responsive');
    } else {
      DomUtils.removeClass(this.tableElement, 'responsive');
    }
  }
  
  /**
   * Sayfalama seçenekleri getter
   */
  get paginationOptions(): IPaginationOptions | undefined {
    return this._options.paginationOptions;
  }
  
  /**
   * Sayfalama seçenekleri setter
   */
  set paginationOptions(value: IPaginationOptions | undefined) {
    if (!value) {
      this._options.paginationOptions = undefined;
    } else {
      this._options.paginationOptions = new PaginationOptions(value);
    }
    this.render();
  }
  
  /**
   * Sıralama seçenekleri getter
   */
  get sortOptions(): ISortOptions | undefined {
    return this._options.sortOptions;
  }
  
  /**
   * Sıralama seçenekleri setter
   */
  set sortOptions(value: ISortOptions | undefined) {
    if (!value) {
      this._options.sortOptions = undefined;
    } else {
      this._options.sortOptions = new SortOptions(value);
    }
    this.render();
  }
  
  /**
   * Toolbar seçenekleri getter
   */
  get toolbarOptions(): IToolbarOptions | undefined {
    return this._options.toolbarOptions;
  }
  
  /**
   * Toolbar seçenekleri setter
   */
  set toolbarOptions(value: IToolbarOptions | undefined) {
    if (!value) {
      this._options.toolbarOptions = undefined;
    } else {
      this._options.toolbarOptions = new ToolbarOptions(value);
    }
    
    this.updateToolbar();
  }
  
  /**
   * Toolbar'ı günceller
   */
  private updateToolbar(): void {
    console.log('updateToolbar çağrıldı, toolbarOptions:', this._options.toolbarOptions);
    
    if (!this._options.toolbarOptions) {
      console.log('Toolbar seçenekleri yok, çıkılıyor');
      return;
    }
    
    // Otomatik toolbar bulunamadıysa oluştur
    if (!this.toolbarElement && this._options.toolbarOptions.visible) {
      console.log('Toolbar bulunamadı, yeni oluşturuluyor');
      this.toolbarElement = document.createElement('zen-grid-toolbar') as HTMLElement;
      this.parentNode?.insertBefore(this.toolbarElement, this);
      console.log('Toolbar oluşturuldu ve DOM\'a eklendi');
    }
    
    // Toolbar'ın görünürlüğünü ayarla
    if (this.toolbarElement) {
      console.log('Toolbar element bulundu, görünürlük ayarlanıyor:', this._options.toolbarOptions.visible);
      
      // Görünürlük ayarı
      if (this._options.toolbarOptions.visible) {
        (this.toolbarElement as HTMLElement).style.display = '';
        
        // Toolbar özelliklerini güncelle
        if (this.toolbarElement instanceof HTMLElement) {
          // Boolean değerler yerine sayısal değerler kullanalım (1 = true, 0 = false)
          // Bazı web componentleri boolean parametreleri string olarak alabildiğinden
          // bu daha güvenli bir yöntemdir
          const toolbarEvent = new CustomEvent('toolbarOptionsChange', {
            detail: {
              search: this._options.toolbarOptions.search ? true : false,
              export: this._options.toolbarOptions.export ? true : false,
              visible: this._options.toolbarOptions.visible ? true : false,
              language: this._options.toolbarOptions.language || this._options.language || 'tr'
            }
          });
          
          console.log('ZenGrid: Toolbar seçenekleri olayı gönderiliyor:', toolbarEvent.detail);
          
          try {
            // Olayı gönder
            this.toolbarElement.dispatchEvent(toolbarEvent);
          } catch (error) {
            console.error('ZenGrid: Toolbar seçenekleri olayı gönderilirken hata:', error);
          }
          
          // Dil değişimini ayrıca bildir
          if (this._options.toolbarOptions.language || this._options.language) {
            const languageEvent = new CustomEvent('languageChange', {
              detail: {
                language: this._options.toolbarOptions.language || this._options.language || 'tr'
              }
            });
            console.log('ZenGrid: Dil değişimi olayı gönderiliyor:', languageEvent.detail);
            
            try {
              this.toolbarElement.dispatchEvent(languageEvent);
            } catch (error) {
              console.error('ZenGrid: Dil değişimi olayı gönderilirken hata:', error);
            }
          }
        }
      } else {
        (this.toolbarElement as HTMLElement).style.display = 'none';
      }
    } else {
      console.warn('ZenGrid: Toolbar elementi bulunamadı, güncelleme yapılamıyor');
    }
  }
  
  /**
   * Bileşeni render eder
   */
  render(): void {
    this.renderHeaders();
    this.renderBody();
    this.renderPagination();
    
    // Ek CSS sınıflarını ayarla
    this.striped = this.striped;
    this.bordered = this.bordered;
    this.responsive = this.responsive;
  }
  
  /**
   * Tablo başlıklarını oluşturur
   */
  private renderHeaders(): void {
    if (!this._options.showHeader) {
      DomUtils.clearElement(this.tableHead);
      return;
    }
    
    DomUtils.clearElement(this.tableHead);
    
    if (this._options.columns.length === 0) {
      return;
    }
    
    const headerRow = DomUtils.createElement('tr');
    
    this._options.columns.forEach(column => {
      const th = DomUtils.createElement('th', { 
        'data-field': column.field,
        'style': column.width ? `width: ${column.width}` : '',
        'class': column.cssClass || ''
      });
      
      // Başlık metni
      const headerText = document.createTextNode(column.header);
      th.appendChild(headerText);
      
      // Sıralama ikonu
      if (column.sortable) {
        const sortIcon = DomUtils.createElement('span', { 
          class: 'zen-grid-sort-icon'
        });
        
        // Eğer bu sütun sıralanmışsa, ikon sınıfını ayarla
        if (this._options.sortOptions && this._options.sortOptions.field === column.field) {
          sortIcon.classList.add(this._options.sortOptions.direction);
        }
        
        th.appendChild(sortIcon);
        
        // Sıralama tıklama olayı ekle
        th.addEventListener('click', () => this.handleSortClick(column.field));
      }
      
      // Hizalama
      if (column.align) {
        th.style.textAlign = column.align;
      }
      
      headerRow.appendChild(th);
    });
    
    this.tableHead.appendChild(headerRow);
  }
  
  /**
   * Tablo gövdesini oluşturur
   */
  private renderBody(): void {
    DomUtils.clearElement(this.tableBody);
    
    // Veri yoksa boş mesaj göster
    if (this._filteredData.length === 0) {
      const emptyRow = DomUtils.createElement('tr');
      const emptyCell = DomUtils.createElement('td', {
        colspan: String(this._options.columns.length || 1),
        class: 'zen-grid-empty-message'
      }, [this.getTranslation(TranslationKey.NO_DATA)]);
      
      emptyRow.appendChild(emptyCell);
      this.tableBody.appendChild(emptyRow);
      return;
    }
    
    // Sayfalama varsa, mevcut sayfadaki verileri göster
    let dataToShow = this._filteredData;
    
    if (this._options.paginationOptions) {
      const { currentPage, pageSize } = this._options.paginationOptions;
      dataToShow = DataUtils.paginate(this._filteredData, currentPage, pageSize);
    }
    
    // Veriyi göster
    dataToShow.forEach((rowData, rowIndex) => {
      const row = DomUtils.createElement('tr', {
        'data-index': String(rowIndex)
      });
      
      // Satır seçilebilir mi
      if (this._options.selectable) {
        row.addEventListener('click', () => this.handleRowClick(rowData, row));
        
        // Eğer bu satır seçiliyse, seçili sınıfını ekle
        if (this._selectedRows.includes(rowData)) {
          DomUtils.addClass(row, 'selected');
        }
      }
      
      // Sütunları oluştur
      this._options.columns.forEach(column => {
        const cellValue = DataUtils.getNestedValue(rowData, column.field);
        let cellContent: string | HTMLElement = cellValue !== null && cellValue !== undefined 
          ? String(cellValue) 
          : '';
        
        // Özel hücre render fonksiyonu varsa kullan
        if (column.cellRenderer) {
          const rendered = column.cellRenderer(rowData, rowIndex);
          if (rendered) {
            cellContent = rendered;
          }
        }
        
        const cell = DomUtils.createElement('td', {
          'data-label': column.header,
          'class': column.cssClass || ''
        });
        
        // Hizalama
        if (column.align) {
          cell.style.textAlign = column.align;
        }
        
        // İçeriği ekle
        if (typeof cellContent === 'string') {
          cell.textContent = cellContent;
        } else {
          cell.appendChild(cellContent);
        }
        
        row.appendChild(cell);
      });
      
      this.tableBody.appendChild(row);
    });
  }
  
  /**
   * Sayfalama arayüzünü oluşturur
   */
  private renderPagination(): void {
    DomUtils.clearElement(this.paginationContainer);
    
    // Sayfalama ayarlanmamışsa gösterme
    if (!this._options.paginationOptions) {
      return;
    }
    
    const { currentPage, pageSize, totalItems, showFirstLastButtons, maxPageButtons } = this._options.paginationOptions;
    
    // Toplam sayfa sayısını hesapla
    const totalPages = Math.ceil(this._filteredData.length / pageSize);
    
    // Sayfalama gereksizse gösterme
    if (totalPages <= 1) {
      return;
    }
    
    // Sayfalama bilgisi
    const paginationInfo = DomUtils.createElement('div', { class: 'zen-grid-pagination-info' });
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, this._filteredData.length);
    paginationInfo.textContent = `${startItem}-${endItem} / ${this._filteredData.length}`;
    
    // Sayfalama düğmeleri
    const paginationButtons = DomUtils.createElement('div', { class: 'zen-grid-pagination-buttons' });
    
    // İlk sayfa düğmesi
    if (showFirstLastButtons) {
      const firstButton = DomUtils.createElement('button', {
        class: 'zen-grid-pagination-button',
        disabled: currentPage === 1 ? 'disabled' : ''
      }, ['«']);
      
      firstButton.addEventListener('click', () => this.handlePageChange(1));
      paginationButtons.appendChild(firstButton);
    }
    
    // Önceki sayfa düğmesi
    const prevButton = DomUtils.createElement('button', {
      class: 'zen-grid-pagination-button',
      disabled: currentPage === 1 ? 'disabled' : ''
    }, ['‹']);
    
    prevButton.addEventListener('click', () => this.handlePageChange(currentPage - 1));
    paginationButtons.appendChild(prevButton);
    
    // Sayfa numarası düğmeleri
    const maxButtons = maxPageButtons || 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      const pageButton = DomUtils.createElement('button', {
        class: `zen-grid-pagination-button ${i === currentPage ? 'active' : ''}`
      }, [String(i)]);
      
      pageButton.addEventListener('click', () => this.handlePageChange(i));
      paginationButtons.appendChild(pageButton);
    }
    
    // Sonraki sayfa düğmesi
    const nextButton = DomUtils.createElement('button', {
      class: 'zen-grid-pagination-button',
      disabled: currentPage === totalPages ? 'disabled' : ''
    }, ['›']);
    
    nextButton.addEventListener('click', () => this.handlePageChange(currentPage + 1));
    paginationButtons.appendChild(nextButton);
    
    // Son sayfa düğmesi
    if (showFirstLastButtons) {
      const lastButton = DomUtils.createElement('button', {
        class: 'zen-grid-pagination-button',
        disabled: currentPage === totalPages ? 'disabled' : ''
      }, ['»']);
      
      lastButton.addEventListener('click', () => this.handlePageChange(totalPages));
      paginationButtons.appendChild(lastButton);
    }
    
    this.paginationContainer.appendChild(paginationInfo);
    this.paginationContainer.appendChild(paginationButtons);
  }
  
  /**
   * Sıralama tıklama olayını işler
   */
  private handleSortClick(field: string): void {
    // Sıralama seçenekleri yoksa oluştur
    if (!this._options.sortOptions) {
      this._options.sortOptions = new SortOptions({
        field,
        direction: SortDirection.ASC
      });
    } else if (this._options.sortOptions.field === field) {
      // Aynı sütuna tıklanmışsa, sıralama yönünü değiştir
      this._options.sortOptions.direction = this._options.sortOptions.direction === SortDirection.ASC 
        ? SortDirection.DESC 
        : SortDirection.ASC;
    } else {
      // Farklı sütuna tıklanmışsa, yeni sütunu sırala
      this._options.sortOptions.field = field;
      this._options.sortOptions.direction = SortDirection.ASC;
    }
    
    // Verileri sırala
    this.sortData();
    
    // Yeniden render et
    this.render();
    
    // Callback çağır
    if (this._options.onSortChange) {
      this._options.onSortChange(this._options.sortOptions);
    }
  }
  
  /**
   * Verileri sıralar
   */
  private sortData(): void {
    if (!this._options.sortOptions || !this._options.sortOptions.field) {
      this._filteredData = [...this._options.data];
      return;
    }
    
    const { field, direction, comparator } = this._options.sortOptions;
    
    this._filteredData.sort((a, b) => {
      // Özel karşılaştırıcı varsa kullan
      if (comparator) {
        return direction === 'asc' ? comparator(a, b) : comparator(b, a);
      }
      
      const aValue = DataUtils.getNestedValue(a, field);
      const bValue = DataUtils.getNestedValue(b, field);
      
      // Null/undefined değerleri sona yerleştir
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      // Karşılaştırma yap
      let comparison = 0;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
  }
  
  /**
   * Sayfa değişikliği olayını işler
   */
  private handlePageChange(pageNumber: number): void {
    if (!this._options.paginationOptions) {
      return;
    }
    
    // Geçerli sayfa kontrolü
    if (pageNumber < 1 || pageNumber > Math.ceil(this._filteredData.length / this._options.paginationOptions.pageSize)) {
      return;
    }
    
    this._options.paginationOptions.currentPage = pageNumber;
    this.render();
    
    // Callback çağır
    if (this._options.onPageChange) {
      this._options.onPageChange(pageNumber);
    }
  }
  
  /**
   * Satır tıklama olayını işler
   */
  private handleRowClick(rowData: any, rowElement: HTMLTableRowElement): void {
    const isSelected = this._selectedRows.includes(rowData);
    
    if (isSelected) {
      // Seçimi kaldır
      this._selectedRows = this._selectedRows.filter(row => row !== rowData);
      DomUtils.removeClass(rowElement, 'selected');
    } else {
      // Eğer çoklu seçim yoksa, önceki seçimleri temizle
      if (!this._options.multiSelectable) {
        this._selectedRows = [];
        // Tüm satırlardan selected sınıfını kaldır
        this.tableBody.querySelectorAll('tr.selected').forEach(tr => {
          DomUtils.removeClass(tr as HTMLElement, 'selected');
        });
      }
      
      // Yeni satırı seç
      this._selectedRows.push(rowData);
      DomUtils.addClass(rowElement, 'selected');
    }
    
    // Callback çağır
    if (this._options.onSelectionChange) {
      this._options.onSelectionChange([...this._selectedRows]);
    }
  }
  
  /**
   * Seçili satırları döndürür
   */
  getSelectedRows(): any[] {
    return [...this._selectedRows];
  }
  
  /**
   * Verileri filtreler
   */
  filter(filters: Record<string, any>): void {
    console.log('ZenGrid: filter metodu çağrıldı, filtreler:', filters);
    
    try {
      // Önce veri var mı kontrol et
      if (!this._options.data || !Array.isArray(this._options.data) || this._options.data.length === 0) {
        console.warn('ZenGrid: Filtrelenecek veri yok!');
        this._filteredData = [];
        this.render();
        return;
      }
      
      // Başlangıç veri sayısı ve durumunu logla
      const originalDataCount = this._options.data.length;
      console.log('ZenGrid: Filtreleme öncesi veri sayısı:', originalDataCount);
      console.log('ZenGrid: Veri özeti:', JSON.stringify(this._options.data.slice(0, 1)).substring(0, 100) + '...');
      
      // String olarak tek parametre gelirse onu searchTerm olarak işle
      if (typeof filters === 'string') {
        filters = { searchTerm: filters };
      }
      
      // filters null veya undefined ise, boş nesne kullan
      if (!filters) {
        console.log('ZenGrid: Filtreler geçersiz, tüm veriyi gösteriyorum');
        filters = {};
      }
      
      // Boş arama terimi kontrolü
      if ('searchTerm' in filters) {
        // searchTerm string'e dönüştür ve boşlukları kırp
        filters.searchTerm = String(filters.searchTerm || '').trim();
        
        if (filters.searchTerm === '') {
          console.log('ZenGrid: Boş arama terimi, tüm veriyi göster');
          this._filteredData = [...this._options.data];
        } else {
          // Sadece searchTerm filtresi varsa, özelliğini belirt
          console.log(`ZenGrid: '${filters.searchTerm}' için tüm alanlarda arama yapılıyor...`);
          // Filtreleme işlemi
          this._filteredData = DataUtils.filter(this._options.data, filters);
        }
      } else {
        // Diğer filtreler için
        console.log('ZenGrid: Diğer filtreler uygulanıyor:', filters);
        this._filteredData = DataUtils.filter(this._options.data, filters);
      }
      
      // Hiçbir filtre belirtilmezse
      if (Object.keys(filters).length === 0) {
        console.log('ZenGrid: Filtre yok, tüm veriyi göster');
        this._filteredData = [...this._options.data];
      }
      
      // Sonuç veri sayısı
      const filteredDataCount = this._filteredData.length;
      console.log(`ZenGrid: Filtreleme sonucu ${originalDataCount} kayıttan ${filteredDataCount} kayıt gösteriliyor`);
      
      // Hiç veri bulunamadıysa spesifik olarak bildir
      if (filteredDataCount === 0) {
        console.warn('ZenGrid: Filtreleme sonrası hiç veri bulunamadı!');
      }
      
      // Sayfalama varsa ilk sayfaya dön
      if (this._options.paginationOptions) {
        this._options.paginationOptions.currentPage = 1;
        this._options.paginationOptions.totalItems = this._filteredData.length;
      }
      
      // Filtreleme olayını tetikle
      const filterEvent = new CustomEvent('filtered', {
        detail: {
          filters,
          resultCount: filteredDataCount
        }
      });
      this.dispatchEvent(filterEvent);
      
      // Veri kümesi değiştiğinde referans güncellensin
      this._filteredData = [...this._filteredData];
      
      // Yeniden render et
      this.render();
    } catch (err) {
      console.error('ZenGrid: Filtreleme sırasında hata oluştu:', err);
      // Hata durumunda filtreyi temizle ve orjinal veriyi göster
      this._filteredData = [...this._options.data];
      this.render();
    }
  }
  
  /**
   * Seçili satırları temizler
   */
  clearSelection(): void {
    this._selectedRows = [];
    this.tableBody.querySelectorAll('tr.selected').forEach(tr => {
      DomUtils.removeClass(tr as HTMLElement, 'selected');
    });
    
    // Callback çağır
    if (this._options.onSelectionChange) {
      this._options.onSelectionChange([]);
    }
  }
  
  /**
   * Property değişikliklerini izlemek için MutationObserver kurar
   */
  private setupPropertyChangeObserver(): void {
    // Frameworks nasıl property ataması yapıyor gözlemlemek için
    // Özellikle Angular, React ve Vue'da doğrudan property ataması yapıldığında
    // bu observer çalışır
    
    // Bu işlev framework property atamalarını algılar ve 
    // attributeChangedCallback'e yönlendirir
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          const attrName = mutation.attributeName;
          if (attrName) {
            // attributeChangedCallback'i simüle et
            const newValue = this.getAttribute(attrName);
            if (newValue !== null) {
              // Şu anda izlenen bir özellik mi diye kontrol et
              const observedAttrs = (this.constructor as typeof ZenGrid).observedAttributes;
              if (observedAttrs.includes(attrName)) {
                this.attributeChangedCallback(attrName, "", newValue);
              }
            }
          }
        }
      }
    });
    
    // Bileşeni gözlemle
    observer.observe(this, {
      attributes: true
    });
  }
  
  /**
   * Dil getter
   */
  get language(): string {
    return this._options.language || 'tr';
  }
  
  /**
   * Dil setter
   */
  set language(value: string) {
    console.log(`ZenGrid: Dil değiştiriliyor: ${this._options.language} -> ${value}`);
    
    // Değer kontrolü
    if (!value) {
      console.warn('ZenGrid: Geçersiz dil değeri, varsayılan "tr" kullanılacak');
      value = 'tr';
    }
    
    this._options.language = value;
    
    // Dil servisine dil ayarını bildir
    try {
      console.log('ZenGrid: TranslationService.setLanguage çağrılıyor:', value);
      this.translationService.setLanguage(value);
    } catch (err) {
      console.error('ZenGrid: Dil servisi ayarlanırken hata:', err);
    }
    
    // Toolbar'ın dilini güncelle
    if (this.toolbarElement && this._options.toolbarOptions) {
      console.log('ZenGrid: Toolbar dil ayarı güncelleniyor');
      this._options.toolbarOptions.language = value;
      
      // Toolbar'a dil değişimi olayını gönder
      try {
        console.log('ZenGrid: Toolbar\'a languageChange olayı gönderiliyor');
        const languageEvent = new CustomEvent('languageChange', {
          detail: {
            language: value
          },
          bubbles: true,  // Olayın yukarı doğru kabarcıklanmasını sağla
          composed: true  // Shadow DOM sınırlarından geçmesini sağla
        });
        
        this.toolbarElement.dispatchEvent(languageEvent);
        console.log('ZenGrid: Dil değişimi olayı başarıyla gönderildi');
      } catch (err) {
        console.error('ZenGrid: Dil değişimi olayı gönderilirken hata:', err);
      }
    } else {
      console.warn('ZenGrid: Toolbar bulunamadı, dil değişimi iletilemedi');
    }
    
    // Tabloyu yeniden oluştur (çevirilerin güncellenmesi için)
    this.render();
  }
  
  /**
   * Çevirme yardımcı metodu
   */
  getTranslation(key: TranslationKey, params?: Record<string, string | number>): string {
    return this.translationService.translate(key, params);
  }
} 