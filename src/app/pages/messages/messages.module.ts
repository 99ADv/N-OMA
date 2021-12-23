//#region Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
//#endregion

import { MessagesPageRoutingModule } from './messages-routing.module';

import { MessagesPage } from './messages.page';

//#region Modules
import { SharedModule } from 'src/app/modules/shared/shared.module';
//#endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessagesPageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [MessagesPage]
})
export class MessagesPageModule {}
