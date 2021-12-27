//#region Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';
//#endregion

//#region Service
import { TicketService } from 'src/app/core/services/ticket/ticket.service';
import { HelpersDevService } from 'src/app/core/services/helperDev/helper-dev.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { ChatService } from 'src/app/core/services/chat/chat.service';
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

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  //#region Variables
  notfyTimeout: any = null;

  //#region DOM
  bell: boolean = false;
  chatBell: boolean = true;
  //#endregion

  //#endregion

  //#region Object
  modal: notification = {
    modal: 'hide',
    type_of_message: '',
    message: ''
  }
  user: any = {
    id: -1,
    login: '',
    name: '',
    email: '',
    token: ''
  }
  abstract: any = {
    incoming: 0,
    resolved: 0,
    service: {
      incoming: 0,
      resolved: 0
    },
    chat: {
      incoming: 0,
      resolved: 0
    },
    email: {
      incoming: 0,
      resolved: 0
    },
    tel: {
      incoming: 0,
      resolved: 0
    },
  }
  //#endregion

  //#region Index
  constructor(
    private router: Router,
    private ticketService: TicketService,
    private helperDev: HelpersDevService,
    private userSerivce: UserService,
    private socket: Socket,
    private chatService: ChatService
  ) { }

  //#region life cycle
  async ionViewWillEnter() {
    this.user = JSON.parse((await Storage.get({ key: 'user' })).value);
    this.userSerivce.token = JSON.parse((await Storage.get({ key: TOKEN_KEY })).value);
    let notoficatioPoint = await Storage.get({ key: 'notification' });
    let chatPoint = await Storage.get({ key: 'chat' });

    if (notoficatioPoint && notoficatioPoint.value == 'true') this.bell = true;
    else this.bell = false;

    if (chatPoint && chatPoint.value == 'true') this.chatBell = true;
    else this.chatBell = false;

    this.GetAbstract();
    this.GetMessages(false);
  }

  async ngOnInit() {
    // this.socket.fromEvent('ticket_closed').subscribe(
    //   (result: any) => {
    //     if (this.user.login == result.to) {
    //       // this.GetAbstract();
    //     }
    //   }
    // )

    this.socket.fromEvent('notification').subscribe(
      async (result: any) => {
        await Storage.remove({ key: 'notification' });
        this.bell = false;
        if ((result.permissions == '2' || result.permissions == '0') && result.show == '1') {
          const audio = new Audio('../../../../assets/audio/timbre1.mp3')
          audio.play();
          await Storage.set({ key: 'notification', value: 'true' });
          this.bell = true;
          this.Notify('show-message', 'message', result.message, false)
        }
      }
    )

    // this.socket.fromEvent('call_log').subscribe(
    //   (result: any) => {
    //     // if(result == this.user.login)
    //     // this.GetAbstract();
    //   }
    // )

    this.socket.fromEvent('message').subscribe(
      (result: any) => {
        if (this.user.login == result.to) {
          this.GetMessages(true);
        }
      }
    )
  }
  //#endregion

  //#endregion

  //#region API
  GetAbstract() {
    this.Notify('show-loading', 'Cargando contendido', '', false)
    this.ticketService.GetAbstract({ userLogin: this.user.login }).subscribe(
      (result: any) => {
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true)
          return false;
        }
        this.Notify('hide', '', '', false)
        this.abstract = result.result;
      }
      ,
      error => this.Notify('show-message', 'bug', '(404) Error interno.', true)
    )
  }

  GetMessages(sw: boolean) {
    this.chatService.GetNewMessages({ fromPage: '1' }).subscribe(
      async (result: any) => {
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true)
          return;
        }
        const chats = result.result.new_messages;
        await Storage.remove({ key: 'chat' });
        this.chatBell = false;
        if (chats > 0) {
          await Storage.set({ key: 'chat', value: 'true' });
          this.chatBell = true;
          if (sw) {
            const audio = new Audio('../../../../assets/audio/timbre2.mp3')
            audio.play();
          }
        }
      },
      error => this.Notify('show-message', 'bug', '(404) Error interno.', true)
    )
  }
  //#endregion

  //#region Event
  async SingOut() {
    await Storage.remove({ key: TOKEN_KEY });
    await Storage.remove({ key: 'user' });
    this.router.navigate(['/login']);
  }
  //#endregion

  //#region DOM
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