import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallPageRoutingModule } from './call-routing.module';

import { CallPage } from './call.page';

//#region Components
import { NewCallComponent } from './new-call/new-call.component';
//#endregion

//#region Modules
import { SharedModule } from 'src/app/modules/shared/shared.module';
//#endregion

import { CallNumber } from '@ionic-native/call-number/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CallPageRoutingModule,
    SharedModule
  ],
  providers: [
    CallNumber
  ],
  declarations: [CallPage, NewCallComponent]
})
export class CallPageModule {}
