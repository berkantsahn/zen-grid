import { IPaginationOptions } from '../interfaces/pagination-options.interface';

/**
 * Sayfalama seçenekleri modeli
 */
export class PaginationOptions implements IPaginationOptions {
  /** Mevcut sayfa numarası (1'den başlar) */
  currentPage: number = 1;
  
  /** Sayfa başına öğe sayısı */
  pageSize: number = 10;
  
  /** Toplam öğe sayısı */
  totalItems: number = 0;
  
  /** Gösterilecek sayfa numarası düğmelerinin sayısı */
  maxPageButtons: number = 5;
  
  /** İlk sayfa düğmesi gösterilsin mi */
  showFirstLastButtons: boolean = true;
  
  /** Sayfa boyutu değiştirme seçeneği etkin mi */
  showPageSizeOptions: boolean = true;
  
  /** Kullanılabilir sayfa boyutu seçenekleri */
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  
  /**
   * Toplam sayfa sayısını hesaplar
   */
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
  
  /**
   * Mevcut sayfanın son öğe indexini döndürür
   */
  get lastItemIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }
  
  /**
   * Mevcut sayfanın ilk öğe indexini döndürür
   */
  get firstItemIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }
  
  constructor(options: Partial<IPaginationOptions> = {}) {
    if (options.currentPage !== undefined) this.currentPage = options.currentPage;
    if (options.pageSize !== undefined) this.pageSize = options.pageSize;
    if (options.totalItems !== undefined) this.totalItems = options.totalItems;
    if (options.maxPageButtons !== undefined) this.maxPageButtons = options.maxPageButtons;
    if (options.showFirstLastButtons !== undefined) this.showFirstLastButtons = options.showFirstLastButtons;
    if (options.showPageSizeOptions !== undefined) this.showPageSizeOptions = options.showPageSizeOptions;
    if (options.pageSizeOptions !== undefined) this.pageSizeOptions = options.pageSizeOptions;
  }
} 