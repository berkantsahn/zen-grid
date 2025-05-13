import { IColumn } from '../interfaces/column.interface';

/**
 * Tablo sütununu temsil eden model
 */
export class Column implements IColumn {
  /** Veri kaynağındaki alan adı */
  field: string;
  
  /** Sütun başlığı */
  header: string;
  
  /** Sütun genişliği (px veya %) */
  width?: string;
  
  /** Sütunda sıralama yapılabilir mi */
  sortable?: boolean = true;
  
  /** Sütunda filtreleme yapılabilir mi */
  filterable?: boolean = false;
  
  /** Özel hücre render fonksiyonu */
  cellRenderer?: (data: any, rowIndex: number) => string | HTMLElement;
  
  /** Sütun CSS sınıfı */
  cssClass?: string;
  
  /** Hücre içeriğinin hizalanması */
  align?: 'left' | 'center' | 'right' = 'left';
  
  constructor(options: IColumn) {
    this.field = options.field;
    this.header = options.header;
    
    if (options.width !== undefined) this.width = options.width;
    if (options.sortable !== undefined) this.sortable = options.sortable;
    if (options.filterable !== undefined) this.filterable = options.filterable;
    if (options.cellRenderer !== undefined) this.cellRenderer = options.cellRenderer;
    if (options.cssClass !== undefined) this.cssClass = options.cssClass;
    if (options.align !== undefined) this.align = options.align;
  }
} 