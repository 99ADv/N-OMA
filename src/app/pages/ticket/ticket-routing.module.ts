import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketPage } from './ticket.page';

//#region Component
import { NewComponent } from './new/new.component';
//#endregion

const routes: Routes = [
  {
    path: ':id',
    component: TicketPage
  },
  { path: 'new/:type', component: NewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketPageRoutingModule {}
