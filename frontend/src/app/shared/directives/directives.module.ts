import { NgModule } from '@angular/core';
//import { ScrollBarDirective, HighlightDirective } from './common.directive';
import { ScrollBarDirective, NumbersOnlyDirective, DatepickertDirective, scrollPaginationDirective, ConfirmDirective, BlockCopyPasteDirective } from './common.directive';

@NgModule({
  imports: [],
  declarations: [ScrollBarDirective, BlockCopyPasteDirective, NumbersOnlyDirective, DatepickertDirective, scrollPaginationDirective, ConfirmDirective],
  exports: [ScrollBarDirective, BlockCopyPasteDirective, NumbersOnlyDirective, DatepickertDirective, scrollPaginationDirective, ConfirmDirective]
})
export class DirectivesModule { }