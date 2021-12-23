//#region Angular
import { Component, OnInit } from '@angular/core';
//#endregion

//#region Services
import { HelpersDevService } from 'src/app/core/services/helperDev/helper-dev.service';
import { CallService } from 'src/app/core/services/call/call.service';
import { UserService } from 'src/app/core/services/user/user.service';
//#endregion

//#region Interface
import { notification } from 'src/app/interface/others';
//#endregion

//#region Capacitor
import { Storage } from '@capacitor/storage';
//#endregion

//#region Variables
import { TOKEN_KEY } from 'src/app/core/guards/autoLogin/auto-login.guard';
//#endregion

import { Socket } from 'ngx-socket-io';

import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-call',
  templateUrl: './call.page.html',
  styleUrls: ['./call.page.scss'],
})

export class CallPage implements OnInit {
  //#region Variables
  customerLogin: string = '';
  list: any = [];
  notfyTimeout: any = null;
  styleList: boolean = false;
  //#endregion

  //#region List
  // records: any[] = [
  //   {
  //     id: 0,
  //     tel_name: 'Hola',
  //     date: '2020-01-02'
  //   },
  //   {
  //     id: 0,
  //     tel_name: 'Hola',
  //     date: '2020-01-02'
  //   },
  //   {
  //     id: 0,
  //     tel_name: 'Hola',
  //     date: '2020-01-02'
  //   },
  //   {
  //     id: 0,
  //     tel_name: 'Hola',
  //     date: '2020-01-02'
  //   },
  //   {
  //     id: 0,
  //     tel_name: 'Hola',
  //     date: '2020-01-02'
  //   },
  //   {
  //     id: 0,
  //     tel_name: 'Hola',
  //     date: '2020-01-02'
  //   },
  // ];
  //#endregion

  //#region Object
  modal: notification = {
    modal: 'hide',
    type_of_message: '',
    message: ''
  }
  //#endregion
  
  //#region Index
  constructor(
    private callService:CallService,
    private helperDev: HelpersDevService,
    private userService: UserService,
    private socket: Socket,
    private callNumber: CallNumber
  ) { }

  //#region Live cycle
  ngOnInit() {
    this.socket.fromEvent('call_log').subscribe(
      (result: any) => {
        if(result == this.customerLogin)
        this.Get();
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
    this.Notify('show-loading', '', 'Cargando lista de contactos', false);
    this.callService.Get({fromPage: '1'}).subscribe(
      (result: any) => {
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true);
          return;
        }
        this.Notify('hide', '', '', false);
        this.list = result.result;
      },
      error => this.Notify('show-message', 'bug', '(404) Error interno.', true)
    )
  }

  // GetCall() {
  //   this.ticketService.GetHistoty({userLogin: user.login, type_of_service: this.type, indication: this.indication}).subscribe(
  //     (result: any) => {
  //       let interpretResponse = this.helperDev.InterpretResponse(result);
  //       if (interpretResponse.status == false) {
  //         this.Notify('show-message', 'bug', 'Error interno.', true)
  //         return;
  //       }
  //       this.Notify('hide', '', '', false);
  //       this.list = result.history;
  //       this.RenderList();
  //     },
  //     error => this.Notify('show-message', 'bug', '(404) Error interno.', false)
  //   )
  // }

  async Create(id: string, number: string) {
    this.Notify('show-loading', '', 'Un momento por favor', false);
    this.callService.Create({id, subject: 'Llamada entrante.'}).subscribe(
      (result: object) => {
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true);
          return;
        }
        this.callNumber.callNumber(number, true)
        .then(res => this.Notify('show-message', 'message', 'En caso de no ser atendida un agente le podra devolver la llamada.', false))
        .catch(err => this.Notify('show-message', 'bug', 'Error interno.', true));
      },
      error =>  this.Notify('show-message', 'bug', '(404) Error interno.', true)
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
}
