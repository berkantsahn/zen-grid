import { IColumn } from './column.interface';
import { IPaginationOptions } from './pagination-options.interface';
import { ISortOptions } from './sort-options.interface';

/**
 * Zen-Grid için yapılandırma seçenekleri
 */
export interface IGridOptions {
  /** Tabloda gösterilecek sütunlar */
  columns: IColumn[];
  
  /** Tabloda gösterilecek veri */
  data: any[];
  
  /** Sıralama seçenekleri */
  sortOptions?: ISortOptions;
  
  /** Sayfalama seçenekleri */
  paginationOptions?: IPaginationOptions;
  
  /** Tablo yüksekliği */
  height?: string;
  
  /** Satır seçimi etkin mi */
  selectable?: boolean;
  
  /** Çoklu satır seçimi etkin mi */
  multiSelectable?: boolean;
  
  /** Zebra şerit görünümü etkin mi */
  striped?: boolean;
  
  /** Tablo kenarlıkları etkin mi */
  bordered?: boolean;
  
  /** Duyarlı davranış etkin mi */
  responsive?: boolean;
  
  /** Tablo başlığı etkin mi */
  showHeader?: boolean;
  
  /** Boş veri mesajı */
  emptyMessage?: string;
  
  /** Tablo CSS sınıfı */
  cssClass?: string;
  
  /** Seçilen satırları izleme callback'i */
  onSelectionChange?: (selectedRows: any[]) => void;
  
  /** Sıralama değiştiğinde çağrılacak callback */
  onSortChange?: (sortOptions: ISortOptions) => void;
  
  /** Sayfa değiştiğinde çağrılacak callback */
  onPageChange?: (pageNumber: number) => void;
} 