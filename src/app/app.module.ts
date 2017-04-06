import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { GlobalVariable } from './global-variable';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

import {PriceModule} from './price/price.module';
import {appRoutes} from './app.routes';
import { PipeModule }    from './pipe/pipe.module';
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule,
    PriceModule,
    PipeModule.forRoot()
  ],
  providers: [GlobalVariable],
  bootstrap: [AppComponent]
})
export class AppModule { }
