/**
 * Tablo sütunlarını temsil eden arayüz
 */
export interface IColumn {
  /** Veri kaynağındaki alan adı */
  field: string;
  
  /** Sütun başlığı */
  header: string;
  
  /** Sütun genişliği (px veya %) */
  width?: string;
  
  /** Sütunda sıralama yapılabilir mi */
  sortable?: boolean;
  
  /** Sütunda filtreleme yapılabilir mi */
  filterable?: boolean;
  
  /** Özel hücre render fonksiyonu */
  cellRenderer?: (data: any, rowIndex: number) => string | HTMLElement;
  
  /** Sütun CSS sınıfı */
  cssClass?: string;
  
  /** Hücre içeriğinin hizalanması */
  align?: 'left' | 'center' | 'right';
} 