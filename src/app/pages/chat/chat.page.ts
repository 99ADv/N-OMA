//#region Angular
import { Component, OnInit } from '@angular/core';
//#endregion

import * as moment from 'moment';

//#region Capacitor
import { Storage } from '@capacitor/storage';
//#endregion

//#region Services
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { HelpersDevService } from 'src/app/core/services/helperDev/helper-dev.service';
import { UserService } from 'src/app/core/services/user/user.service';
//#endregion

//#region Interface
import { notification } from 'src/app/interface/others';
//#endregion

//#region Variables
import { TOKEN_KEY } from 'src/app/core/guards/autoLogin/auto-login.guard';
//#endregion

import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})

export class ChatPage implements OnInit {
  //#region Variables
  notfyTimeout: any = null;
  indication: string = '';

  //#region DOM
  activeList: string = 'chat-archived-list';
  filter: boolean = false;
  //#endregion

  //#endregion

  //#region Object
  modal: notification = {
    modal: 'hide',
    type_of_message: '',
    message: ''
  }
  //#endregion

  //#region List
  list: any = [];
  chats: any = {
    active: [],
    archived: []
  }
  chats_closed: any = []
  chatList: any = [];
  //#endregion

  //#region Index
  constructor(
    private chatService: ChatService,
    private helperDev: HelpersDevService,
    private userService: UserService,
    private socket: Socket
  ) { }

  //#region Live cycle
  async ngOnInit() {
    let user = JSON.parse((await Storage.get({key: 'user'})).value);
    this.socket.fromEvent('message').subscribe(
      (result: any) => {
        if (user.login == result.to) {
          const audio = new Audio('../../../assets/audio/timbre2.mp3')
          audio.play();
          this.Get();
        }
      }
    )

    this.socket.fromEvent('ticket_closed').subscribe(
      (result: any) => {
        if (user.login == result.to) {
          this.Get();
        }
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
  async Get() {
    this.Notify('show-loading', '', 'Cargando lista de chats', false);
    let user = JSON.parse((await Storage.get({key: 'user'})).value);
    
    this.Notify('show-loading', '', 'Cargando lista', false);
    this.chatService.Get({ fromPage: '1', userLogin: user.login, indication: this.indication }).subscribe(
      (result: any) => {
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true)
          return;
        }
        this.Notify('hide', '', '', false);
        this.chats = result.result.chats;
        this.chats_closed = result.result.chats_closed;
        if(this.indication == '') this.ShowList(1);
        this.RenderList();
      },
      error => this.Notify('show-message', 'bug', '(404) Error interno.', false)
    )
  }
  //#endregion

  //#region Event
  ShowList(list: number) {
    switch (list) {
      case 1:
        this.activeList = 'chat-active-list';
        this.list = this.chats.active;
        break;
      case 2:
        this.activeList = 'chat-closed-list';
        this.list = this.chats_closed;
        break;
      case 3:
        this.activeList = 'chat-archived-list';
        this.list = this.chats.archived;
        break;
    }
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
    for (let a = 0; a < this.chats.active.length; a++) {
      let date = moment(this.chats.active[a].create_time).format('L');
      if(date == moment().format('L')) this.chats.active[a].create_time = moment(this.chats.active[a].create_time).format('LT');
      else this.chats.active[a].create_time = date;
    }

    for (let a = 0; a < this.chats_closed.length; a++) {
      let date = moment(this.chats_closed[a].create_time).format('L');
      if(date == moment().format('L')) this.chats_closed[a].create_time = moment(this.chats_closed[a].create_time).format('LT');
      else this.chats_closed[a].create_time = date;
    }
  }
  //#endregion
}