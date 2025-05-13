/**
 * Veri işlemleri için yardımcı fonksiyonlar
 */
export class DataUtils {
  /**
   * Veri dizisini filtrelemek için kullanılır
   * @param data Filtre uygulanacak veri dizisi
   * @param filters Filtre kriterleri
   * @returns Filtrelenmiş veri dizisi
   */
  static filter<T>(data: T[], filters: Record<string, any>): T[] {
    // Öncelikle data geçerli mi kontrol et
    if (!data || !Array.isArray(data)) {
      console.warn('DataUtils.filter: Geçersiz veri, boş dizi döndürülüyor');
      return [];
    }
    
    // Debug için daha detaylı bilgi
    console.log(`DataUtils.filter: Veri dizisi uzunluğu: ${data.length}`);
    if (data.length > 0) {
      console.log('DataUtils.filter: İlk öğe örneği:', JSON.stringify(data[0]).substring(0, 200) + '...');
    }
    
    // Filtre yoksa veya boşsa tüm veriyi döndür
    if (!filters || Object.keys(filters).length === 0) {
      console.log('DataUtils.filter: Filtre yok, tüm veriyi döndürüyorum');
      return [...data];
    }
    
    console.log('DataUtils.filter çağrıldı, gelen filtreler:', filters);
    
    // searchTerm boşsa tüm veriyi döndür
    if ('searchTerm' in filters) {
      const searchTerm = String(filters.searchTerm || '').trim();
      if (searchTerm === '') {
        console.log('DataUtils.filter: Boş arama terimi, tüm veriyi döndürüyorum');
        return [...data];
      }
    }
    
    // Filtrelemeyi gerçekleştir
    console.log('DataUtils.filter: Filtreleme başlıyor...');
    const result = data.filter(item => {
      // İtem geçerli mi kontrol et
      if (!item) return false;
      
      // searchTerm özel bir filtre, tüm alanlarda arama yapar
      if ('searchTerm' in filters) {
        const searchTerm = String(filters.searchTerm || '').toLowerCase().trim();
        
        // Boş arama terimi varsa bu öğeyi dahil et
        if (searchTerm === '') {
          return true;
        }
        
        try {
          // Öğeyi düzleştirerek tüm alt nesneleri dahil et
          const flattenedValues = this.flattenObject(item);
          console.log('DataUtils.filter: Düzleştirilmiş değerler örnek:', 
            Object.entries(flattenedValues).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(', '));
          
          // Tüm değerlerde arama yap (alt nesneler dahil)
          let found = false;
          for (const [key, val] of Object.entries(flattenedValues)) {
            if (val !== null && val !== undefined) {
              const strValue = String(val).toLowerCase();
              if (strValue.includes(searchTerm)) {
                console.log(`DataUtils.filter: Eşleşme bulundu! Anahtar: ${key}, Değer: "${strValue}", Arama: "${searchTerm}"`);
                found = true;
                break; // Bir eşleşme bulduktan sonra döngüden çıkabiliriz
              }
            }
          }
          
          return found;
        } catch (err) {
          console.error('DataUtils: Arama sırasında hata:', err);
          return false;
        }
      }
      
      // Diğer filtreler için her bir filtreyi kontrol et
      return Object.entries(filters).every(([key, filterValue]) => {
        // searchTerm özel durumu, zaten yukarıda işlendi
        if (key === 'searchTerm') {
          return true;
        }
        
        try {
          const itemValue = this.getNestedValue(item, key);
          
          if (filterValue === null || filterValue === undefined) {
            return true;
          }
          
          // Farklı veri türleri için filtre işlemi
          if (typeof filterValue === 'string') {
            // String'e dönüştürülmüş değerde arama yap (içerme kontrolü)
            const strValue = String(itemValue || '').toLowerCase();
            const strFilter = String(filterValue).toLowerCase();
            return strValue.includes(strFilter);
          } else if (typeof filterValue === 'number') {
            return Number(itemValue) === filterValue;
          } else if (typeof filterValue === 'boolean') {
            return Boolean(itemValue) === filterValue;
          } else if (filterValue instanceof Date) {
            return new Date(itemValue).getTime() === filterValue.getTime();
          } else if (Array.isArray(filterValue)) {
            return filterValue.includes(itemValue);
          }
          
          return itemValue === filterValue;
        } catch (err) {
          console.error(`DataUtils: '${key}' filtresi uygulanırken hata:`, err);
          return false;
        }
      });
    });
    
    // Sonuç hakkında bilgi ver
    console.log(`DataUtils.filter: Filtreleme sonucu - ${data.length} kayıttan ${result.length} kayıt eşleşti`);
    if (result.length === 0) {
      console.warn('DataUtils.filter: Hiçbir kayıt eşleşmedi!');
    } else if (result.length > 0) {
      console.log('DataUtils.filter: İlk eşleşen kayıt örneği:', JSON.stringify(result[0]).substring(0, 200) + '...');
    }
    
    return result;
  }
  
  /**
   * Objeyi düzleştirir ve tüm alt nesneleri içeren tek seviyeli bir obje döndürür
   * Bu fonksiyon, iç içe nesnelerde de arama yapabilmek için kullanılır
   */
  static flattenObject(obj: any, prefix = ''): Record<string, any> {
    const result: Record<string, any> = {};
    
    try {
      // null/undefined değilse işleme devam et
      if (obj === null || obj === undefined) {
        return result;
      }
      
      // Basit obje veya array'lere dönüştürülebilen değerleri düzleştir
      if (typeof obj !== 'object' || obj instanceof Date) {
        result[prefix || 'value'] = obj;
        return result;
      }
      
      // Array ise, her elemanı kendi indeksi ile düzleştir
      if (Array.isArray(obj)) {
        // Önce tüm array'i tek bir string olarak ekle
        if (prefix) {
          result[prefix] = obj.join(', ');
        }
        
        // Sonra her elemanı ayrı ayrı düzleştir
        obj.forEach((item, index) => {
          const newPrefix = prefix ? `${prefix}.${index}` : `${index}`;
          Object.assign(result, this.flattenObject(item, newPrefix));
        });
        return result;
      }
      
      // Obje ise, her özelliği kendi adıyla düzleştir
      Object.entries(obj).forEach(([key, value]) => {
        // Objenin metotlarını ve prototip özelliklerini atla
        if (typeof value === 'function' || key === '__proto__') {
          return;
        }
        
        const newPrefix = prefix ? `${prefix}.${key}` : key;
        
        // Değerin kendisinı ekle (anahtar varsa)
        if (newPrefix) {
          result[newPrefix] = value;
        }
        
        // Nesnenin tüm alt özelliklerini de düzleştir
        if (value !== null && typeof value === 'object') {
          Object.assign(result, this.flattenObject(value, newPrefix));
        }
      });
      
      return result;
    } catch (err) {
      console.error('DataUtils.flattenObject: Hata:', err);
      return result;
    }
  }
  
  /**
   * Bir nesne içindeki iç içe değeri almak için kullanılır
   * Örneğin: "user.address.city" şeklindeki bir yolla nesne içindeki değeri alır
   */
  static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => (o && o[p] !== undefined) ? o[p] : null, obj);
  }
  
  /**
   * Veri dizisini sayfalamak için kullanılır
   */
  static paginate<T>(data: T[], pageNumber: number, pageSize: number): T[] {
    const startIndex = (pageNumber - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }
  
  /**
   * Bir değerin belirli bir türe dönüştürülmesi
   */
  static convertValueToType(value: any, type: string): any {
    switch (type) {
      case 'string':
        return String(value);
      case 'number':
        return Number(value);
      case 'boolean':
        return Boolean(value);
      case 'date':
        return new Date(value);
      default:
        return value;
    }
  }
  
  /**
   * Bir veri setinden benzersiz değerleri çıkarır
   */
  static getUniqueValues<T>(data: T[], field: string): any[] {
    const values = data.map(item => this.getNestedValue(item, field));
    return [...new Set(values)].filter(val => val !== null && val !== undefined);
  }
} 