//#region Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//#endregion

//#region Modules
import { SharedModule } from 'src/app/modules/shared/shared.module';
//#endregion

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    LoginPage
  ]
})
export class LoginPageModule {}
