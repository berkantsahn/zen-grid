import { ISortOptions, SortDirection } from '../interfaces/sort-options.interface';

/**
 * Sıralama seçenekleri modeli
 */
export class SortOptions implements ISortOptions {
  /** Sıralama yapılacak alan adı */
  field: string;
  
  /** Sıralama yönü */
  direction: SortDirection = SortDirection.NONE;
  
  /** Özel sıralama fonksiyonu */
  comparator?: (a: any, b: any) => number;
  
  constructor(options: Partial<ISortOptions> = { field: '', direction: SortDirection.NONE }) {
    this.field = options.field || '';
    this.direction = options.direction || SortDirection.NONE;
    if (options.comparator) this.comparator = options.comparator;
  }
  
  /**
   * Sıralama yönünü değiştirir
   */
  toggleDirection(): void {
    if (this.direction === SortDirection.NONE) {
      this.direction = SortDirection.ASC;
    } else if (this.direction === SortDirection.ASC) {
      this.direction = SortDirection.DESC;
    } else {
      this.direction = SortDirection.NONE;
    }
  }
  
  /**
   * Yeni bir alan için sıralama ayarlar
   */
  sortBy(field: string): void {
    if (this.field === field) {
      this.toggleDirection();
    } else {
      this.field = field;
      this.direction = SortDirection.ASC;
    }
  }
  
  /**
   * Verileri sıralar
   */
  sort<T>(data: T[]): T[] {
    if (this.direction === SortDirection.NONE || !this.field) {
      return [...data];
    }
    
    return [...data].sort((a: any, b: any) => {
      if (this.comparator) {
        return this.direction === SortDirection.ASC 
          ? this.comparator(a, b) 
          : this.comparator(b, a);
      }
      
      const valueA = a[this.field];
      const valueB = b[this.field];
      
      if (valueA === valueB) return 0;
      
      const comparison = valueA < valueB ? -1 : 1;
      return this.direction === SortDirection.ASC ? comparison : -comparison;
    });
  }
} 