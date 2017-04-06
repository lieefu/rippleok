import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LedgerComponent } from './ledger.component';
import { RouterModule } from '@angular/router';
import { ledgerRoutes } from './ledger.routes';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ledgerRoutes)
  ],
  declarations: [LedgerComponent]
})
export class LedgerModule { }
