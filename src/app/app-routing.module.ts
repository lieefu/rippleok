import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceComponent } from './price/price.component';
import { LedgerComponent } from './ledger/ledger.component';
import { TransactionComponent } from './transaction/transaction.component';
import { AccountComponent } from './account/account.component';
import { GatewayComponent } from './gateway/gateway.component';
const routes: Routes = [
    {path: '', redirectTo: '/price', pathMatch: 'full'},
    {path: 'price', component: PriceComponent},
    {path: 'ledger/:args', component: LedgerComponent},
    {path: 'transaction/:args', component: TransactionComponent},
    {path: 'account/:args', component: AccountComponent},
    {path: 'gateway/:args', component: GatewayComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }
