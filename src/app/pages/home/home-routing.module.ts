import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//#region Page
import { HomePage } from './home.page';
//#endregion

//#region Components
//#endregion

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
