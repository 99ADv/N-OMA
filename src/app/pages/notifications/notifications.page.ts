//#region Angular
import { Component, OnInit } from '@angular/core';
//#endregion

//#region Service
import { HelpersDevService } from 'src/app/core/services/helperDev/helper-dev.service';
import { NotificactionService } from 'src/app/core/services/notification/notificaction.service';
import { UserService } from 'src/app/core/services/user/user.service';
//#endregion

//#region Capacitor
import { Storage } from '@capacitor/storage';
//#endregion

//#region Interface
import { notification } from 'src/app/interface/others';
//#endregion

//#region Variables
import { TOKEN_KEY } from 'src/app/core/guards/autoLogin/auto-login.guard';
//#endregion

import { Socket } from 'ngx-socket-io';

import * as moment from 'moment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  //#region Variables
  notfyTimeout: any;

  //#endregion

  //#region Object
  modal: notification = {
    modal: 'hide',
    type_of_message: 'messae',
    message: ''
  }
  //#endregion

  //#region List
  list: any = [];
  //#endregion

  //#region API
  constructor(
    private notification: NotificactionService,
    private helperDev: HelpersDevService,
    private userService: UserService,
    private socket: Socket
  ) { }

  //#region Live cycle
  ngOnInit() {
    this.socket.fromEvent('notification').subscribe(
      (result: any) => {
        this.Get();
        // if (result.permissions == '2' || result.permissions == '0') {
          
        // }
      }
    )
  }

  async ionViewWillEnter() {
    this.userService.token = JSON.parse((await Storage.get({key: TOKEN_KEY})).value);
    this.Get();
  }
  //#endregion

  //#endregion

  //#region API
  Get() {
    this.notification.Get({fromPage: '1'}).subscribe(
      (result: any) => {
        
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true)
          return;
        }
        this.Notify('hide', '', '', false);
        this.list = result.notifications;
        this.RenderList();
      },
      error => this.Notify('show-message', 'bug', '(404) Error interno.', false)
    )
  }
  //#endregion

  //#region DOM
  Notify(modal: string, messageType: string, message: string, setTimeout_vr: boolean) {
    this.modal.modal = modal;
    this.modal.type_of_message = messageType;
    this.modal.message = message;
    if (setTimeout_vr) {
      if(this.notfyTimeout) clearTimeout(this.notfyTimeout);
      this.notfyTimeout = setTimeout(() => {
        this.Notify('hide', '', '', false);
      }, 5000);
    }
  }
  //#endregion

   //#region Tools
   RenderList() {
    for (let a = 0; a < this.list.length; a++) {
      let date = moment(this.list[a].date).format('L');
      if(date == moment().format('L')) this.list[a].date = moment(this.list[a].date).format('LT');
      else this.list[a].date = date;
    }
  }
  //#endregion
}
