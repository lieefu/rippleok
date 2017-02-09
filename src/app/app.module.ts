import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExchgratePipe } from './exchgrate.pipe';
import { PriceComponent } from './price/price.component';
import { GlobalVariable } from './global-variable';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LedgerComponent } from './ledger/ledger.component';
import { TransactionComponent } from './transaction/transaction.component';
import { AccountComponent } from './account/account.component';
import { GatewayComponent } from './gateway/gateway.component';

@NgModule({
  declarations: [
    AppComponent,
    ExchgratePipe,
    PriceComponent,
    FooterComponent,
    HeaderComponent,
    LedgerComponent,
    TransactionComponent,
    AccountComponent,
    GatewayComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule,
    AppRoutingModule
  ],
  providers: [GlobalVariable],
  bootstrap: [AppComponent]
})
export class AppModule { }
