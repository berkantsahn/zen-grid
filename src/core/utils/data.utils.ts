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
    if (!filters || Object.keys(filters).length === 0) {
      return data;
    }
    
    return data.filter(item => {
      return Object.entries(filters).every(([key, filterValue]) => {
        const itemValue = this.getNestedValue(item, key);
        
        if (filterValue === null || filterValue === undefined) {
          return true;
        }
        
        // Farklı veri türleri için filtre işlemi
        if (typeof filterValue === 'string') {
          return String(itemValue).toLowerCase().includes(filterValue.toLowerCase());
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
      });
    });
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