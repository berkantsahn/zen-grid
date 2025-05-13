/**
 * Sayfalama seçenekleri arayüzü
 */
export interface IPaginationOptions {
  /** Mevcut sayfa numarası (1'den başlar) */
  currentPage: number;
  
  /** Sayfa başına öğe sayısı */
  pageSize: number;
  
  /** Toplam öğe sayısı */
  totalItems: number;
  
  /** Gösterilecek sayfa numarası düğmelerinin sayısı */
  maxPageButtons?: number;
  
  /** İlk sayfa düğmesi gösterilsin mi */
  showFirstLastButtons?: boolean;
  
  /** Sayfa boyutu değiştirme seçeneği etkin mi */
  showPageSizeOptions?: boolean;
  
  /** Kullanılabilir sayfa boyutu seçenekleri */
  pageSizeOptions?: number[];
} 