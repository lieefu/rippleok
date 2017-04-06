import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceComponent } from './price/price.component';
import { LedgerComponent } from './ledger/ledger.component';
import { TransactionComponent } from './transaction/transaction.component';
import { AccountComponent } from './account/account.component';
import { GatewayComponent } from './gateway/gateway.component';

export const appRoutes: Routes = [
    {path: '', redirectTo: '/price', pathMatch: 'full'},
    {path: 'price', loadChildren: './price/price.module#PriceModule'},
    {path: 'ledger/:args',loadChildren: './ledger/ledger.module#LedgerModule'},
    {path: 'transaction/:args', loadChildren: './transaction/transaction.module#TransactionModule'},
    {path: 'account/:args', loadChildren: './account/account.module#AccountModule'},
    {path: 'gateway/:args', loadChildren: './gateway/gateway.module#GatewayModule'}
  ]
