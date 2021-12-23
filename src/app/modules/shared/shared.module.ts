import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//#region Components
import { FooterComponent } from './components/main/footer/footer.component';
import { NotificationComponent } from './components/notification/notification.component';
//#endregion

@NgModule({
  declarations: [FooterComponent, NotificationComponent],
  imports: [
    CommonModule
  ],
  exports: [
    FooterComponent,
    NotificationComponent
  ]
})
export class SharedModule { }
