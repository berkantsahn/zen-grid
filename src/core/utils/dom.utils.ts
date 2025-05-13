/**
 * DOM işlemleri için yardımcı fonksiyonlar
 */
export class DomUtils {
  /**
   * Bir element oluşturur
   */
  static createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    attributes: { [key: string]: string } = {},
    children: (string | Node)[] = []
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);
    
    // Özellikleri ayarla
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'style' && typeof value === 'string') {
        // Style özelliğini işle
        value.split(';').forEach(style => {
          if (!style.trim()) return;
          const [property, val] = style.split(':');
          if (property && val) {
            (element.style as any)[property.trim()] = val.trim();
          }
        });
      } else if (key === 'class' || key === 'className') {
        element.className = value;
      } else {
        element.setAttribute(key, value);
      }
    });
    
    // Alt öğeleri ekle
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
    
    return element;
  }
  
  /**
   * Bir elementin tüm alt öğelerini temizler
   */
  static clearElement(element: HTMLElement): void {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
  
  /**
   * Bir elementin tüm sınıflarını temizler
   */
  static clearClasses(element: HTMLElement): void {
    element.className = '';
  }
  
  /**
   * Bir elemente CSS sınıfı ekler
   */
  static addClass(element: HTMLElement, className: string): void {
    if (!element.classList.contains(className)) {
      element.classList.add(className);
    }
  }
  
  /**
   * Bir elementten CSS sınıfı kaldırır
   */
  static removeClass(element: HTMLElement, className: string): void {
    if (element.classList.contains(className)) {
      element.classList.remove(className);
    }
  }
  
  /**
   * Bir elementin CSS sınıfını değiştirir
   */
  static toggleClass(element: HTMLElement, className: string): void {
    element.classList.toggle(className);
  }
  
  /**
   * Bir element bir CSS sınıfına sahip mi kontrol eder
   */
  static hasClass(element: HTMLElement, className: string): boolean {
    return element.classList.contains(className);
  }
} 