/**
 * Angular adaptörü
 * 
 * Bu dosya, ZenGrid'in Angular ile kullanılmasını sağlar.
 * Angular uygulamasında bu komponenti kullanmak için:
 * 
 * 1. Angular modülüne CUSTOM_ELEMENTS_SCHEMA ekleyin:
 * 
 * @NgModule({
 *   schemas: [CUSTOM_ELEMENTS_SCHEMA]
 * })
 * 
 * 2. Komponenti şu şekilde kullanın:
 * 
 * <zen-grid [data]="users" [columns]="columns"></zen-grid>
 */

// Angular uygulamasının global namespace'inde bu kodu aramayıp hata vermemesi için 
// bu ekstra kontrol yapılıyor
if (typeof window !== 'undefined') {
  // Angular özelliklerini algılayan bir nesne
  const ZenGridAngularBridge = {
    // Angular property değişikliklerini izle
    observedAttributes: [
      // ZenGrid özellikleri
      'data',
      'columns',
      'height',
      'striped',
      'bordered',
      'responsive',
      'pagination-options',
      'sort-options',
      
      // Angular özellikleri (köşeli parantez eklenen özellikler)
      '[data]',
      '[columns]', 
      '[height]',
      '[striped]',
      '[bordered]',
      '[responsive]',
      '[paginationOptions]',
      '[sortOptions]',
      '[class]',
      '[style]',
      
      // Angular olayları
      '(selectionChange)',
      '(sortChange)',
      '(pageChange)'
    ]
  };
  
  // Angular integration için web bileşen prototipini genişlet
  const ZenGridElement = customElements.get('zen-grid');
  if (ZenGridElement) {
    // Angular'ın özellik bağlama sözdizimini desteklemek için gereken özellikler
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prototype = ZenGridElement.prototype as any;
    
    // Angular'ın attribute formatındaki özellikleri düzgün işlemesi için
    const originalAttributeChangedCallback = prototype.attributeChangedCallback;
    
    // Özel attribute changed callback
    prototype.attributeChangedCallback = function(name: string, oldValue: string, newValue: string) {
      // Angular tarafında [property] bindinglerini işle
      if (name.startsWith('[') && name.endsWith(']')) {
        const propName = name.slice(1, -1);
        try {
          const value = JSON.parse(newValue);
          (this as any)[propName] = value;
        } catch (e) {
          console.warn(`ZenGrid: Error parsing Angular binding for ${propName}`, e);
        }
        return;
      }
      
      // pagination-options ve sort-options gibi kebab-case formatlı özellikleri işle
      if (name === 'pagination-options') {
        try {
          this.paginationOptions = JSON.parse(newValue);
          return;
        } catch (e) {
          console.warn('ZenGrid: Error parsing pagination options', e);
        }
      }
      
      if (name === 'sort-options') {
        try {
          this.sortOptions = JSON.parse(newValue);
          return;
        } catch (e) {
          console.warn('ZenGrid: Error parsing sort options', e);
        }
      }
      
      // Normal attribute değişikliklerini işle
      if (originalAttributeChangedCallback) {
        originalAttributeChangedCallback.call(this, name, oldValue, newValue);
      }
    };
    
    // ZenGrid.observedAttributes'a Angular özelliklerini ekle
    // TypeScript için tip kontrol
    if ('observedAttributes' in ZenGridElement) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const originalObservedAttributes = (ZenGridElement as any).observedAttributes || [];
      if (Array.isArray(originalObservedAttributes)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ZenGridElement as any).observedAttributes = [
          ...originalObservedAttributes,
          ...ZenGridAngularBridge.observedAttributes.filter(attr => !originalObservedAttributes.includes(attr))
        ];
      }
    }
    
    // Angular'ın (event) binding sözdizimini desteklemek için
    prototype.connectedCallback = function() {
      const originalConnectedCallback = prototype.connectedCallback;
      
      // Olay dinleyicilerini ekle
      if (this.onSelectionChange !== undefined) {
        this.addEventListener('selectionChange', (event: CustomEvent) => {
          this.dispatchEvent(new CustomEvent('selectionChange', { detail: event.detail }));
        });
      }
      
      if (this.onSortChange !== undefined) {
        this.addEventListener('sortChange', (event: CustomEvent) => {
          this.dispatchEvent(new CustomEvent('sortChange', { detail: event.detail }));
        });
      }
      
      if (this.onPageChange !== undefined) {
        this.addEventListener('pageChange', (event: CustomEvent) => {
          this.dispatchEvent(new CustomEvent('pageChange', { detail: event.detail }));
        });
      }
      
      // Orijinal connectedCallback'i çağır
      if (originalConnectedCallback) {
        originalConnectedCallback.call(this);
      }
    };
  }
} 