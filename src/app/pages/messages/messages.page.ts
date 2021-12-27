//#region Angular
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
//#endregion

//#region Seriveces
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { HelpersDevService } from 'src/app/core/services/helperDev/helper-dev.service';
import { UserService } from 'src/app/core/services/user/user.service';
//#endregion

import * as moment from 'moment';

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

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})

export class MessagesPage implements OnInit {
  //#region Varaibles
  @ViewChild('file') file: ElementRef;
  id: string = '';
  userLogin: string = '';
  attached: File = null;
  url_api: string = null;
  notfyTimeout: any = null;

  //#region DOM
  loadingMessage:string = 'ml-hide';
  styleModalsubject: string = 'subject-modal-hide';
  //#endregion

  //#endregion

  //#region Objects
  modal: notification = {
    modal: 'hide',
    type_of_message: '',
    message: ''
  }
  chatForm = new FormGroup({
    subject: new FormControl('', [Validators.required]),
    fromPage: new FormControl('1', [Validators.required])
  })
  messageForm = new FormGroup({
    chatID: new FormControl('0', [Validators.required]),
    from: new FormControl('', [Validators.required]),
    to: new FormControl('0', [Validators.required]),
    body: new FormControl('', [Validators.required]),
    fromPage: new FormControl('1', [Validators.required])
  })
  chat: any = {
    data: {
      id: 1,
      agent: '',
      subject: '',
      create_time: '',
      archive: 0,
      ticketID: 0,
      state: 0
    },
    messages: []
  }
  //#endregion

  //#region Index
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private helperDev: HelpersDevService,
    private userService: UserService,
    private socket: Socket
  ) { }

  //#region Live cycle
  async ngOnInit() {
    this.url_api = environment.api_url;
    let user = JSON.parse((await Storage.get({ key: 'user' })).value);

    this.socket.fromEvent('message').subscribe(
      (result: any) => {
        if (user.login == result.to && result.chatID == this.chat.data.id) {
          this.GetMessages();
          this.UpdateMessage();
        }
      }
    )

    this.socket.fromEvent('ticket_closed').subscribe(
      (result: any) => {
        if (user.login == result.to) {
          this.GetChat();
        }
      }
    )
  }

  async ionViewWillEnter() {
    this.userService.token = JSON.parse((await Storage.get({ key: TOKEN_KEY })).value);
    this.route.paramMap.subscribe(
      async param => {
        if (param.has('chatID')) {
          let user = JSON.parse((await Storage.get({ key: 'user' })).value);
          this.userLogin = user.login;
          this.messageForm.get('from').setValue(this.userLogin);
          if (param.get('chatID') == '-1') {
            this.chatForm.get('subject').setValue('');
            this.styleModalsubject = 'subject-modal-show';
            return;
          }
          this.id = param.get('chatID');
          this.messageForm.get('chatID').setValue(this.id);
          this.GetChat();
        } else this.router.navigate(["/chat"]);
      }
    )
  }
  //#endregion

  //#endregion

  //#region API
  CreateChat() {
    this.loadingMessage = 'ml-show';
    this.chatService.Create(this.chatForm.value, this.messageForm.value, this.attached).subscribe(
      (result: any) => {
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true);
          return;
        }
        this.messageForm.get('body').setValue('');
        if (this.attached) {
          this.file.nativeElement.value = '';
          this.attached = null;
        }
        this.loadingMessage = 'ml-hide';
        this.router.navigate(["/chat", result.chatID])
      },
      error => {
        this.loadingMessage = 'ml-hide';
        this.Notify('show-message', 'bug', '(404) Error interno.', true)
      }
    )
  }

  GetChat() {
    this.chatService.GetData({ fromPage: '1', chatID: this.id }).subscribe(
      (result: any) => {
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true);
          return;
        }
        this.chat = result.result;
        if (this.chat.data.to_login)
          this.messageForm.get('to').setValue(this.chat.data.to_login);
        else this.messageForm.get('to').setValue('0');
        this.UpdateMessage();
        this.RenderList();
      },
      error => this.Notify('show-message', 'bug', '(404) Error interno.', true)
    )
  }

  SendMessage() {
    this.loadingMessage = 'ml-show';
    if (this.attached) this.messageForm.get('body').setValue(this.attached.name);

    this.chatService.CreateMessage(this.messageForm.value, this.attached).subscribe(
      (result: any) => {

        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true);
          return;
        }
        if (this.chat.data.archive == 1) {
          this.UpdateChat('3', '0');
          return;
        }
        this.messageForm.get('body').setValue('');
        if (this.attached) {
          this.file.nativeElement.value = '';
          this.attached = null;
        }
        this.GetMessages();
        this.loadingMessage = 'ml-hide';
      },
      error => {
        this.loadingMessage = 'ml-hide';
        this.Notify('show-message', 'bug', '(404) Error interno.', true)
      }
    )
  }

  GetMessages() {
    this.chatService.GetMessage({ chatID: this.id }).subscribe(
      (result: any) => {
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true);
          return;
        }
        this.chat.messages = result.messages;
        this.RenderList();
      },
      error => this.Notify('show-message', 'bug', '(404) Error interno.', true)
    )
  }

  UpdateChat(op: string, newValue: string) {
    this.chatService.Update({ chatID: this.id, op, newValue, fromPage: '1' }).subscribe(
      (result: any) => {
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true);
          return;
        }
        this.GetChat();
      },
      error => this.Notify('show-message', 'bug', '(404) Error interno.', true)
    )
  }

  UpdateMessage() {
    this.chatService.UpdateMessage({ chatID: this.id, fromPage: '1', userLogin: this.userLogin }).subscribe(
      (result: any) => {
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true);
          return;
        }
      },
      error => this.Notify('show-message', 'bug', '(404) Error interno.', true)
    )
  }
  //#endregion

  //#region Event
  OnFile(event: HTMLInputEvent | any) {
    if (!event.target.files && !event.target.files[0])
      return;
    this.attached = event.target.files[0];
    this.SendMessage();
  }

  OpenChat() {
    this.chat.data.subject = this.chatForm.get('subject').value;
    this.styleModalsubject = 'subject-modal-hide';
  }

  Create() {
    if (this.chat.messages.length == 0) this.CreateChat();
    else this.SendMessage();
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

  RenderList() {
    for (let a = 0; a < this.chat.messages.length; a++) {
      let date = moment(this.chat.messages[a].date).format('L');
      if (date == moment().format('L')) this.chat.messages[a].date = moment(this.chat.messages[a].date).format('LT');
      else this.chat.messages[a].date = date;
    }
    var objDiv = document.getElementById("chat-messages");
    objDiv.scrollTop = objDiv.scrollHeight;
  }
  //#endregion
}