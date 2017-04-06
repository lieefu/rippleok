import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { transactionRoutes } from './transaction.routes';
import { TransactionComponent } from './transaction.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(transactionRoutes)
  ],
  declarations: [TransactionComponent]
})
export class TransactionModule { }
