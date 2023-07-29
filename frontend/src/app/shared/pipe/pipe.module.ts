import { NgModule } from '@angular/core';
import { ArraySimpleSortPipe, ArraySortPipe, GroupByPipe, NiceTimePipe } from './common.pipe';

@NgModule({
  imports: [],
  declarations: [NiceTimePipe, GroupByPipe, ArraySortPipe, ArraySimpleSortPipe],
  exports: [NiceTimePipe, GroupByPipe, ArraySortPipe, ArraySimpleSortPipe]
})
export class PipeModule { }
