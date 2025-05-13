/**
 * Toolbar seçenekleri arayüzü
 */
export interface IToolbarOptions {
  /** Toolbar'ın görünürlüğü */
  visible?: boolean;
  
  /** Arama özelliğinin görünürlüğü */
  search?: boolean;
  
  /** Dışa aktarma özelliğinin görünürlüğü */
  export?: boolean;
  
  /** Dil seçeneği (tr, en) */
  language?: string;
} 