import { IToolbarOptions } from '../interfaces';

/**
 * Toolbar Seçenekleri
 */
export class ToolbarOptions implements IToolbarOptions {
  /** Toolbar'ın görünürlüğü */
  visible: boolean = true;
  
  /** Arama özelliğinin görünürlüğü */
  search: boolean = true;
  
  /** Dışa aktarma özelliğinin görünürlüğü */
  export: boolean = true;
  
  /** Dil seçeneği (tr, en) */
  language: string = 'tr'; // Varsayılan olarak Türkçe
  
  constructor(options?: Partial<IToolbarOptions>) {
    if (options) {
      Object.assign(this, options);
    }
  }
} 