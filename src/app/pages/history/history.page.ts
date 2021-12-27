//#region Angular
import { Component, OnInit } from '@angular/core';
//#endregion

//#region Capacitor
import { Storage } from '@capacitor/storage';
//#endregion

//#region Services
import { TicketService } from 'src/app/core/services/ticket/ticket.service';
import { HelpersDevService } from 'src/app/core/services/helperDev/helper-dev.service';
import { UserService } from 'src/app/core/services/user/user.service';
//#endregion

//#region Interface
import { notification } from 'src/app/interface/others';
//#endregion

//#region Others
import * as moment from 'moment';
import { Socket } from 'ngx-socket-io';
//#endregion

//#region Variables
import { TOKEN_KEY } from 'src/app/core/guards/autoLogin/auto-login.guard';
//#endregion

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})

export class HistoryPage implements OnInit {
  //#region Variables
  type: number = 0;
  notfyTimeout: any = null;
  indication: string = '';

  //#region DOM
  styleFilter: string = 'filter-hide';
  //#endregion

  //#endregion

  //#region Object
  modal: notification = {
    modal: 'hide',
    type_of_message: '',
    message: ''
  }
  user: any = {};
  //#endregion

  //#region List
  list: any = [];
  //#endregion

  //#region Index
  constructor(
    private ticketService: TicketService,
    private helperDev: HelpersDevService,
    private userService: UserService,
    private socket: Socket,
  ) { }

  //#region Live cycle
  ngOnInit() {
    this.socket.fromEvent('ticket_closed').subscribe(
      (result: any) => {
        if (this.user.login == result.to) {
          this.Get();
        }
      }
    )

    this.socket.fromEvent('call_log').subscribe(
      (result: any) => {
        if (result == this.user.login)
          this.Get();
      }
    )
  }

  async ionViewWillEnter() {
    this.userService.token = JSON.parse((await Storage.get({ key: TOKEN_KEY })).value);
    this.user = JSON.parse((await Storage.get({ key: 'user' })).value);
    this.Get();
  }
  //#endregion

  //#endregion

  //#region API
  async Get() {
    let user = JSON.parse((await Storage.get({ key: 'user' })).value);

    this.Notify('show-loading', '', 'Cargando lista', false);
    this.ticketService.GetHistoty({ userLogin: user.login, type_of_service: this.type, indication: this.indication }).subscribe(
      (result: any) => {
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true)
          return;
        }
        this.Notify('hide', '', '', false);
        this.list = result.history;
        this.RenderList();
      },
      error => this.Notify('show-message', 'bug', '(404) Error interno.', false)
    )
  }
  //#endregion

  //#region DOM
  RenderList() {
    for (let a = 0; a < this.list.length; a++) {
      let date = moment(this.list[a].date).format('L');
      if (date == moment().format('L')) this.list[a].date = moment(this.list[a].date).format('LT');
      else this.list[a].date = date;
    }
  }

  Notify(modal: string, messageType: string, message: string, setTimeout_vr: boolean) {
    this.modal.modal = modal;
    this.modal.type_of_message = messageType;
    this.modal.message = message;
    if (setTimeout_vr) {
      if (this.notfyTimeout) clearTimeout(this.notfyTimeout);
      this.notfyTimeout = setTimeout(() => {
        this.Notify('hide', '', '', false);
      }, 5000);
    }
  }
  //#endregion
}