import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { RouterModule } from '@angular/router';
import { accountRoutes } from './account.routes';
import { PipeModule }    from '../pipe/pipe.module';
@NgModule({
  imports: [
    CommonModule,
      RouterModule.forChild(accountRoutes),
      PipeModule.forRoot()
  ],
  declarations: [AccountComponent]
})
export class AccountModule { }
