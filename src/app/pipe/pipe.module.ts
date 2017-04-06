import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchgratePipe } from './exchgrate.pipe';
import { CheckmarkPipe } from './checkmark.pipe';
import { ShortPipe } from './short.pipe';
import { TonamePipe } from './toname.pipe';
import { BracketPipe } from './bracket.pipe';
import { LimitToPipe } from './limit-to.pipe';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ExchgratePipe,
  CheckmarkPipe,
  ShortPipe,
  TonamePipe,
  BracketPipe,
  LimitToPipe],
  exports: [
  ExchgratePipe,
  CheckmarkPipe,
  ShortPipe,
  TonamePipe,
  BracketPipe,
  LimitToPipe]
})
export class PipeModule {
  static forRoot() {
        return {
            ngModule: PipeModule,
            providers: [],
        };
     }
}
