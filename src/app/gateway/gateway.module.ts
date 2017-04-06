import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GatewayComponent } from './gateway.component';

import { RouterModule } from '@angular/router';
import { gatewayRoutes } from './gateway.routes';
import { PipeModule }    from '../pipe/pipe.module';
@NgModule({
  imports: [
    CommonModule,
      RouterModule.forChild(gatewayRoutes),
      PipeModule.forRoot()
  ],
  declarations: [GatewayComponent]
})
export class GatewayModule { }
