/**
 * React adaptörü
 * 
 * Bu dosya, ZenGrid'in React ile kullanılmasını sağlar.
 * React uygulamasında bu komponenti kullanmak için:
 * 
 * 1. React uygulamanızda `zen-grid` paketi içe aktarılır
 * 
 * import { ZenGrid } from 'zen-grid';
 * import 'zen-grid/dist/index.css';
 * 
 * 2. Komponenti şu şekilde kullanın:
 * 
 * <ZenGrid data={users} columns={columns} />
 */

// React uygulamasının bu adaptörü gereksiz yere yüklemesini engellemek için
// yalnızca tarayıcı ortamında çalışacak şekilde kontrol yapılıyor
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // React için gerekli özellikleri tanımla
  const ZenGridReactBridge = {
    // React event handler'larını izlenecek özel nitelikler listesine ekle
    observedAttributes: [
      'onSelectionChange',
      'onSortChange',
      'onPageChange'
    ],
    
    // React'ın prop isimlerini Web Component özelliklerine eşleştir
    propToAttrMap: {
      className: 'class',
      paginationOptions: 'pagination-options',
      sortOptions: 'sort-options'
    }
  };
  
  // React wrapper için özel event işleyicileri ekleyen fonksiyon
  const setupReactEventHandlers = (gridElement: HTMLElement) => {
    // React'ın event handler'larını DOM olaylarına bağla
    
    // Seçim değişikliği
    const selectionChangeHandler = (gridElement as any).onSelectionChange;
    if (typeof selectionChangeHandler === 'function') {
      gridElement.addEventListener('selectionChange', ((event: CustomEvent) => {
        selectionChangeHandler(event.detail);
      }) as EventListener);
    }
    
    // Sıralama değişikliği
    const sortChangeHandler = (gridElement as any).onSortChange;
    if (typeof sortChangeHandler === 'function') {
      gridElement.addEventListener('sortChange', ((event: CustomEvent) => {
        sortChangeHandler(event.detail);
      }) as EventListener);
    }
    
    // Sayfa değişikliği
    const pageChangeHandler = (gridElement as any).onPageChange;
    if (typeof pageChangeHandler === 'function') {
      gridElement.addEventListener('pageChange', ((event: CustomEvent) => {
        pageChangeHandler(event.detail);
      }) as EventListener);
    }
  };
  
  // Web API kullanılabilir olduğunda, eğer React kullanan bir uygulama ise
  // gerekli özel işlemleri yap
  const ZenGridElement = customElements.get('zen-grid');
  if (ZenGridElement) {
    // JSX entegrasyonu için React özelliklerini ele almamız gerekiyor
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prototype = ZenGridElement.prototype as any;
    
    // Orijinal connectedCallback fonksiyonunu sakla
    const originalConnectedCallback = prototype.connectedCallback;
    
    // React'tan gelen propları işlemek için connectedCallback'i genişlet
    prototype.connectedCallback = function() {
      // React event handler'larını ayarla
      setupReactEventHandlers(this);
      
      // Orijinal connectedCallback'i çağır
      if (originalConnectedCallback) {
        originalConnectedCallback.call(this);
      }
    };
    
    // React'ın camelCase prop isimlerini kebab-case HTML niteliklerine dönüştürmek için
    // attributeChangedCallback'i genişlet
    const originalAttributeChangedCallback = prototype.attributeChangedCallback;
    
    prototype.attributeChangedCallback = function(name: string, oldValue: string, newValue: string) {
      // React'ın özel prop isimlerini kontrol et
      if (name in ZenGridReactBridge.propToAttrMap) {
        // React prop ismini web bileşeni nitelik ismine dönüştür
        const attrName = ZenGridReactBridge.propToAttrMap[name as keyof typeof ZenGridReactBridge.propToAttrMap];
        // React tarafından belirlenen değeri ayarla
        originalAttributeChangedCallback.call(this, attrName, oldValue, newValue);
        return;
      }
      
      // Normal attribute değişikliklerini işle
      originalAttributeChangedCallback.call(this, name, oldValue, newValue);
    };
    
    // Özellik listesine React için özel özellikleri ekle
    if ('observedAttributes' in ZenGridElement) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const originalObservedAttributes = (ZenGridElement as any).observedAttributes || [];
      if (Array.isArray(originalObservedAttributes)) {
        Object.defineProperty(ZenGridElement, 'observedAttributes', {
          get() {
            return [
              ...originalObservedAttributes,
              ...ZenGridReactBridge.observedAttributes,
              ...Object.keys(ZenGridReactBridge.propToAttrMap)
            ];
          }
        });
      }
    }
  }
  
  // React için JSX.IntrinsicElements arayüzünü genişleten bir tip tanımla
  // Bu, React uygulamalarında düzgün tip desteği sağlayacak
  
  /*
  // TypeScript .d.ts dosyasına şunu ekleyin:
  
  declare global {
    namespace JSX {
      interface IntrinsicElements {
        'zen-grid': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
          data?: any[];
          columns?: any[];
          height?: string;
          striped?: boolean;
          bordered?: boolean;
          responsive?: boolean;
          'pagination-options'?: any;
          'sort-options'?: any;
          paginationOptions?: any;
          sortOptions?: any;
          onSelectionChange?: (selectedRows: any[]) => void;
          onSortChange?: (sortOptions: any) => void;
          onPageChange?: (pageNumber: number) => void;
        }, HTMLElement>;
      }
    }
  }
  */
} 