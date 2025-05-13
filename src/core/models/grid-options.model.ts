import { IGridOptions, IColumn, ISortOptions, IPaginationOptions, IToolbarOptions } from '../interfaces';
import { Column } from './column.model';
import { PaginationOptions } from './pagination-options.model';
import { SortOptions } from './sort-options.model';
import { ToolbarOptions } from './toolbar-options.model';

/**
 * Zen-Grid yapılandırma seçenekleri modeli
 */
export class GridOptions implements IGridOptions {
  /** Tabloda gösterilecek sütunlar */
  columns: Column[];
  
  /** Tabloda gösterilecek veri */
  data: any[];
  
  /** Toolbar seçenekleri */
  toolbarOptions?: ToolbarOptions;
  
  /** Sıralama seçenekleri */
  sortOptions?: SortOptions;
  
  /** Sayfalama seçenekleri */
  paginationOptions?: PaginationOptions;
  
  /** Tablo yüksekliği */
  height?: string;
  
  /** Satır seçimi etkin mi */
  selectable: boolean = false;
  
  /** Çoklu satır seçimi etkin mi */
  multiSelectable: boolean = false;
  
  /** Zebra şerit görünümü etkin mi */
  striped: boolean = true;
  
  /** Tablo kenarlıkları etkin mi */
  bordered: boolean = true;
  
  /** Duyarlı davranış etkin mi */
  responsive: boolean = true;
  
  /** Tablo başlığı etkin mi */
  showHeader: boolean = true;
  
  /** Boş veri mesajı */
  emptyMessage: string = 'Görüntülenecek veri yok';
  
  /** Tablo CSS sınıfı */
  cssClass?: string;
  
  /** Seçilen satırları izleme callback'i */
  onSelectionChange?: (selectedRows: any[]) => void;
  
  /** Sıralama değiştiğinde çağrılacak callback */
  onSortChange?: (sortOptions: ISortOptions) => void;
  
  /** Sayfa değiştiğinde çağrılacak callback */
  onPageChange?: (pageNumber: number) => void;
  
  /** Dil seçeneği (tr, en) */
  language?: string = 'tr'; // Varsayılan dil
  
  constructor(options: IGridOptions) {
    // Sütunları dönüştür
    this.columns = options.columns.map(col => new Column(col));
    
    // Veriyi ayarla
    this.data = options.data || [];
    
    // Diğer özellikleri ayarla
    if (options.toolbarOptions) this.toolbarOptions = new ToolbarOptions(options.toolbarOptions);
    if (options.sortOptions) this.sortOptions = new SortOptions(options.sortOptions);
    if (options.paginationOptions) this.paginationOptions = new PaginationOptions(options.paginationOptions);
    if (options.height !== undefined) this.height = options.height;
    if (options.selectable !== undefined) this.selectable = options.selectable;
    if (options.multiSelectable !== undefined) this.multiSelectable = options.multiSelectable;
    if (options.striped !== undefined) this.striped = options.striped;
    if (options.bordered !== undefined) this.bordered = options.bordered;
    if (options.responsive !== undefined) this.responsive = options.responsive;
    if (options.showHeader !== undefined) this.showHeader = options.showHeader;
    if (options.emptyMessage !== undefined) this.emptyMessage = options.emptyMessage;
    if (options.cssClass !== undefined) this.cssClass = options.cssClass;
    
    // Callback'leri ayarla
    if (options.onSelectionChange) this.onSelectionChange = options.onSelectionChange;
    if (options.onSortChange) this.onSortChange = options.onSortChange;
    if (options.onPageChange) this.onPageChange = options.onPageChange;
    
    // Dil ayarını yap
    if (options.language !== undefined) this.language = options.language;
  }
} 