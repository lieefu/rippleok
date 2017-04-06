import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceComponent } from './price.component';
import { RouterModule } from '@angular/router';
import { priceRoutes } from './price.routes';
import { PipeModule }    from '../pipe/pipe.module';
@NgModule({
  imports: [
    CommonModule,
      RouterModule.forChild(priceRoutes),
      PipeModule.forRoot()
  ],
  declarations: [
    PriceComponent
  ]
})
export class PriceModule { }
