/**
 * Vue adaptörü
 * 
 * Bu dosya, ZenGrid'in Vue ile kullanılmasını sağlar.
 * Vue uygulamasında bu komponenti kullanmak için:
 * 
 * 1. Vue uygulamanızda `zen-grid` paketi içe aktarılır
 * 
 * import { ZenGrid } from 'zen-grid';
 * import 'zen-grid/dist/index.css';
 * 
 * 2. Vue uygulamanızda özel elementi tanıtın (Vue 3):
 * 
 * // main.js veya main.ts
 * app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-');
 * 
 * 3. Komponenti şu şekilde kullanın:
 * 
 * <zen-grid :data="users" :columns="columns"></zen-grid>
 */

// Vue entegrasyonu için bu kodu yalnızca tarayıcı ortamında çalıştır
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Vue için gerekli özellikleri tanımla
  const ZenGridVueBridge = {
    // Vue model değişikliklerini dinleyecek özellikler
    observedAttributes: [
      // İki nokta (v-bind) ile bağlanan özellikler
      ':data',
      ':columns',
      ':height',
      ':striped',
      ':bordered',
      ':responsive',
      ':pagination-options',
      ':sort-options',
      ':class',
      ':style',
      
      // Vue 3 özellikler - v-model desteği
      'v-model:data',
      'v-model:columns',
      'v-model:selected-rows',
      
      // Vue olayları (@ ile bağlanan)
      '@selection-change',
      '@sort-change',
      '@page-change'
    ],
    
    // Vue'nun özellik isimlerini web bileşeni özelliklerine eşleştir
    propToAttrMap: {
      // Vue kebab-case özelliklerini camelCase'e dönüştür
      'pagination-options': 'paginationOptions',
      'sort-options': 'sortOptions',
      'selected-rows': 'selectedRows'
    },
    
    // Vue olay isimlerini web bileşeni olay adlarına eşleştir
    eventMap: {
      'selection-change': 'selectionChange',
      'sort-change': 'sortChange',
      'page-change': 'pageChange'
    }
  };
  
  // Vue wrapper için özel event işleyicileri ekleyen fonksiyon
  const setupVueEventHandlers = (gridElement: HTMLElement) => {
    // Vue olaylarını dom olaylarına bağla
    
    // Web bileşeni olaylarını Vue olaylarına bağlama
    Object.keys(ZenGridVueBridge.eventMap).forEach(vueEvent => {
      const webComponentEvent = ZenGridVueBridge.eventMap[vueEvent as keyof typeof ZenGridVueBridge.eventMap];
      
      // Her olay için bir dinleyici ekle
      gridElement.addEventListener(webComponentEvent, (event: Event) => {
        // Vue'nun beklediği formatta özel olay oluştur
        const customEvent = new CustomEvent(`vue-${vueEvent}`, {
          bubbles: true,
          composed: true,
          detail: (event as CustomEvent).detail
        });
        
        gridElement.dispatchEvent(customEvent);
      });
    });
  };
  
  // Vue entegrasyonu için web bileşeni kayıtlıysa özelleştir
  const ZenGridElement = customElements.get('zen-grid');
  if (ZenGridElement) {
    // Vue entegrasyonu için özellikler
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prototype = ZenGridElement.prototype as any;
    
    // Orijinal connectedCallback fonksiyonunu sakla
    const originalConnectedCallback = prototype.connectedCallback;
    
    // Vue'dan gelen propları işlemek için connectedCallback'i genişlet
    prototype.connectedCallback = function() {
      // Vue event handler'larını ayarla
      setupVueEventHandlers(this);
      
      // Orijinal connectedCallback'i çağır
      if (originalConnectedCallback) {
        originalConnectedCallback.call(this);
      }
      
      // v-model desteği için değişiklik olaylarını izle
      this.addEventListener('selectionChange', (event: CustomEvent) => {
        // v-model:selected-rows için değer güncelleme
        const customEvent = new CustomEvent('update:selected-rows', {
          bubbles: true,
          composed: true,
          detail: event.detail
        });
        
        this.dispatchEvent(customEvent);
      });
    };
    
    // Vue'nun kebab-case prop isimlerini web bileşeni özelliklerine dönüştürmek için
    // attributeChangedCallback'i genişlet
    const originalAttributeChangedCallback = prototype.attributeChangedCallback;
    
    prototype.attributeChangedCallback = function(name: string, oldValue: string, newValue: string) {
      // Vue'nun : ile başlayan bağlamaları işle
      if (name.startsWith(':')) {
        const propName = name.substring(1); // Başındaki : işaretini kaldır
        const mappedName = ZenGridVueBridge.propToAttrMap[propName as keyof typeof ZenGridVueBridge.propToAttrMap] || propName;
        
        try {
          const value = JSON.parse(newValue);
          (this as any)[mappedName] = value;
        } catch (e) {
          console.warn(`ZenGrid: Error parsing Vue binding for ${propName}`, e);
        }
        return;
      }
      
      // v-model ile başlayan bağlamaları işle
      if (name.startsWith('v-model:')) {
        const propName = name.substring(8); // v-model: kısmını kaldır
        const mappedName = ZenGridVueBridge.propToAttrMap[propName as keyof typeof ZenGridVueBridge.propToAttrMap] || propName;
        
        try {
          const value = JSON.parse(newValue);
          (this as any)[mappedName] = value;
          
          // Değer değişikliğine abone ol
          this.addEventListener(`${mappedName}Change`, (event: CustomEvent) => {
            const updateEvent = new CustomEvent(`update:${propName}`, {
              bubbles: true,
              composed: true,
              detail: event.detail
            });
            
            this.dispatchEvent(updateEvent);
          });
        } catch (e) {
          console.warn(`ZenGrid: Error parsing Vue v-model binding for ${propName}`, e);
        }
        return;
      }
      
      // Normal attribute değişikliklerini işle
      if (originalAttributeChangedCallback) {
        originalAttributeChangedCallback.call(this, name, oldValue, newValue);
      }
    };
    
    // Özellik listesine Vue için özel özellikleri ekle
    if ('observedAttributes' in ZenGridElement) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const originalObservedAttributes = (ZenGridElement as any).observedAttributes || [];
      if (Array.isArray(originalObservedAttributes)) {
        Object.defineProperty(ZenGridElement, 'observedAttributes', {
          get() {
            return [
              ...originalObservedAttributes,
              ...ZenGridVueBridge.observedAttributes
            ];
          }
        });
      }
    }
  }
} 