/**
 * Sıralama yönünü belirten enum
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
  NONE = 'none'
}

/**
 * Sıralama seçenekleri arayüzü
 */
export interface ISortOptions {
  /** Sıralama yapılacak alan adı */
  field: string;
  
  /** Sıralama yönü */
  direction: SortDirection;
  
  /** Özel sıralama fonksiyonu */
  comparator?: (a: any, b: any) => number;
} 