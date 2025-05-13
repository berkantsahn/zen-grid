/**
 * Toolbar Seçenekleri
 */
export class ToolbarOptions {
  visible: boolean = true;
  search: boolean = true;
  export: boolean = true;
  
  constructor(options?: Partial<ToolbarOptions>) {
    if (options) {
      Object.assign(this, options);
    }
  }
} 