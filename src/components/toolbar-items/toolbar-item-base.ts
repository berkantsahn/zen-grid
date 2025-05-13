import { DomUtils } from '../../core/utils';

/**
 * Toolbar Öğesi Arayüzü
 */
export interface IToolbarItemOptions {
  id?: string;
  class?: string;
  disabled?: boolean;
  order?: number;
  [key: string]: any;
}

/**
 * Toolbar Öğesi Temel Sınıfı
 * 
 * Bu sınıf, tüm toolbar öğelerinin türetileceği temel sınıftır.
 */
export abstract class ToolbarItemBase {
  /** Öğe kimliği */
  protected id: string;
  
  /** HTML DOM elemanı */
  protected element: HTMLElement;
  
  /** Öğenin sıralaması */
  protected order: number;
  
  /** Öğenin etkin olup olmadığı */
  protected disabled: boolean;
  
  /** Toolbar bileşeni referansı */
  protected toolbar: HTMLElement | null = null;
  
  /** Grid bileşeni referansı */
  protected grid: HTMLElement | null = null;
  
  /**
   * Yapıcı metod
   */
  constructor(options: IToolbarItemOptions = {}) {
    this.id = options.id || `toolbar-item-${Math.floor(Math.random() * 1000000)}`;
    this.order = options.order || 0;
    this.disabled = options.disabled || false;
    
    // Temel HTML elementini oluştur
    this.element = this.createElement();
    
    // Özelleştirmeleri uygula
    this.applyOptions(options);
  }
  
  /**
   * DOM elementini oluşturmak için soyut metod
   * Her alt sınıf kendi elementini oluşturmalıdır
   */
  protected abstract createElement(): HTMLElement;
  
  /**
   * Seçenekleri uygular
   */
  protected applyOptions(options: IToolbarItemOptions): void {
    // id
    this.element.id = this.id;
    
    // class
    if (options.class) {
      options.class.split(' ').forEach(cls => {
        if (cls) this.element.classList.add(cls);
      });
    }
    
    // disabled
    if (this.disabled) {
      this.element.setAttribute('disabled', 'disabled');
    }
    
    // diğer özellikler
    Object.keys(options).forEach(key => {
      if (!['id', 'class', 'disabled', 'order'].includes(key)) {
        this.element.setAttribute(key, options[key]);
      }
    });
  }
  
  /**
   * Öğeyi toolbar'a ekler
   */
  appendTo(toolbar: HTMLElement, position: 'left' | 'center' | 'right' = 'left'): void {
    this.toolbar = toolbar;
    
    // Toolbar'ın ZenGridToolbar olduğunu varsayar
    const selector = `.zen-grid-toolbar-section.${position}`;
    const section = toolbar.shadowRoot?.querySelector(selector);
    if (section) {
      section.appendChild(this.element);
    } else {
      toolbar.appendChild(this.element);
    }
    
    // Grid referansını bul
    this.findGridElement();
  }
  
  /**
   * Grid referansını bulur
   */
  protected findGridElement(): void {
    if (!this.toolbar) return;
    
    // Toolbar'ın bağlı olduğu grid'i bul
    const parent = this.toolbar.parentElement;
    if (parent) {
      const grid = parent.querySelector('zen-grid');
      if (grid) {
        this.grid = grid as HTMLElement;
      }
    }
  }
  
  /**
   * Öğeyi etkinleştirir veya devre dışı bırakır
   */
  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
    
    if (disabled) {
      this.element.setAttribute('disabled', 'disabled');
    } else {
      this.element.removeAttribute('disabled');
    }
  }
  
  /**
   * Öğeyi gizler veya gösterir
   */
  setVisible(visible: boolean): void {
    this.element.style.display = visible ? '' : 'none';
  }
  
  /**
   * Element getter
   */
  getElement(): HTMLElement {
    return this.element;
  }
} 