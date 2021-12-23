//#region Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
//#endregion

import { TicketPageRoutingModule } from './ticket-routing.module';

//#region Pages
import { TicketPage } from './ticket.page';
//#endregion

//#region Components
import { NewComponent } from './new/new.component';
//#endregion

//#region Modules
import { SharedModule } from 'src/app/modules/shared/shared.module';
//#endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [TicketPage, NewComponent]
})
export class TicketPageModule {}