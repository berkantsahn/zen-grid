import { DomUtils } from '../../core/utils';
import { ToolbarItemBase, IToolbarItemOptions } from './toolbar-item-base';

/**
 * Arama Öğesi Seçenekleri
 */
export interface ISearchItemOptions extends IToolbarItemOptions {
  placeholder?: string;
  width?: string;
  searchDelay?: number;
  onSearch?: (searchTerm: string) => void;
}

/**
 * Arama Öğesi
 * 
 * Tablo içinde arama yapmak için bir arama kutusu sağlar.
 */
export class SearchItem extends ToolbarItemBase {
  private searchInput!: HTMLInputElement;
  private searchTimeout: any = null;
  private searchDelay: number;
  private onSearchCallback?: (searchTerm: string) => void;
  
  /**
   * Yapıcı metod
   */
  constructor(options: ISearchItemOptions = {}) {
    super(options);
    
    this.searchDelay = options.searchDelay || 300;
    this.onSearchCallback = options.onSearch;
    
    // Arama girişi için width belirtilmişse uygula
    if (options.width) {
      this.searchInput.style.width = options.width;
    }
    
    // Arama olayını ekle
    this.setupSearchHandler();
  }
  
  /**
   * Search elementini oluşturur
   */
  protected createElement(): HTMLElement {
    const container = DomUtils.createElement('div', { class: 'zen-grid-search' });
    const searchIcon = DomUtils.createElement('span', { class: 'zen-grid-search-icon' }, ['🔍']);
    
    this.searchInput = DomUtils.createElement('input', {
      class: 'zen-grid-search-input',
      type: 'text',
      placeholder: 'Ara...'
    }) as HTMLInputElement;
    
    container.appendChild(searchIcon);
    container.appendChild(this.searchInput);
    
    return container;
  }
  
  /**
   * Arama işlevini ayarlar
   */
  private setupSearchHandler(): void {
    this.searchInput.addEventListener('input', (e) => {
      const searchTerm = (e.target as HTMLInputElement).value;
      
      // Gecikmeli arama (debounce) için
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      
      this.searchTimeout = setTimeout(() => {
        this.performSearch(searchTerm);
      }, this.searchDelay);
    });
  }
  
  /**
   * Arama işlemini gerçekleştirir
   */
  private performSearch(searchTerm: string): void {
    // Eğer callback tanımlanmışsa onu çağır
    if (this.onSearchCallback) {
      this.onSearchCallback(searchTerm);
      return;
    }
    
    // Aksi halde grid üzerindeki filtreleme işlevini kullan
    if (this.grid) {
      try {
        // Arama terimi varsa filtrele
        if (searchTerm.trim() !== '') {
          const filters = { searchTerm };
          // @ts-ignore: grid üzerindeki filter metodu
          this.grid.filter(filters);
        } else {
          // Arama terimi yoksa filtreyi temizle
          // @ts-ignore: grid üzerindeki filter metodu
          this.grid.filter({});
        }
      } catch (error) {
        console.error('Filtreleme sırasında hata oluştu:', error);
      }
    }
  }
  
  /**
   * Mevcut arama terimini alır
   */
  getSearchTerm(): string {
    return this.searchInput.value;
  }
  
  /**
   * Arama terimini ayarlar
   */
  setSearchTerm(searchTerm: string, triggerSearch: boolean = true): void {
    this.searchInput.value = searchTerm;
    
    if (triggerSearch) {
      this.performSearch(searchTerm);
    }
  }
  
  /**
   * Arama kutusunu temizler
   */
  clear(): void {
    this.setSearchTerm('', true);
  }
  
  /**
   * Placeholder metnini ayarlar
   */
  setPlaceholder(placeholder: string): void {
    this.searchInput.placeholder = placeholder;
  }
} 