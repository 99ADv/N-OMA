//#region Angular
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//#endregion

//#region Service
import { HelpersDevService } from 'src/app/core/services/helperDev/helper-dev.service';
import { TicketService } from 'src/app/core/services/ticket/ticket.service';
//#endregion

//#region Interface
import { notification } from 'src/app/interface/others';
//#endregion

//#region Capacitor
import { Storage } from '@capacitor/storage';
//#endregion

//#region Others
import * as moment from 'moment';
//#endregion

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})

export class NewComponent implements OnInit {
  //#region Variables
  @ViewChild('file') file: ElementRef;
  notfyTimeout: any = null;
  attached: any = null;
  attachedName: string = 'Nombre del archivo';
  indication: string = '';
  styleList: boolean = false;
  //#endregion

  //#region List
  records: any = [];
  //#endregion

  //#region Object
  user: any = {};
  modal: notification = {
    modal: 'hide',
    type_of_message: '',
    message: ''
  }
  form = new FormGroup({
    subject: new FormControl('Nueva app', [Validators.required]),
    body: new FormControl('80%', [Validators.required]),
    type: new FormControl('1', [Validators.required]),
    customerLogin: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  })
  //#endregion

  //#region Index
  constructor(
    private router: Router,
    private helperDev: HelpersDevService,
    private ticketService: TicketService
  ) { }

  //#region Live cicle
  ngOnInit() { }

  async ionViewWillEnter() {
    this.CleanForm();
    this.user = JSON.parse((await Storage.get({key: 'user'})).value);
    this.form.get('customerLogin').setValue(this.user.login);
    this.form.get('password').setValue(JSON.parse((await Storage.get({key: '01e'})).value));
  }
  //#endregion

  //#endregion

  //#region API
  CreateTicket() {
    this.Notify('show-loading', '', 'Enviando ticket.', false);
    this.ticketService.Create(this.form.value, this.attached).subscribe(
      (result: Object) => {    
        console.log(result);
        
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true)
          return;
        }
        this.Notify('show-message', 'message', 'Ticket enviado.', true);
        this.CleanForm()
      },
      error => this.Notify('show-message', 'bug', '(404) Error interno.', true)
    )
  }

  GetTickets() {
    this.Notify('show-loading', '', 'Cargando registros', false);
    this.ticketService.GetHistoty({userLogin: this.user.login, type_of_service: '1', indication: this.indication}).subscribe(
      (result: any) => {
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true)
          return;
        }
        this.Notify('hide', '', '', false);
        this.records = result.history;
        this.RenderList();
      },
      error => this.Notify('show-message', 'bug', '(404) Error interno.', false)
    )
  }
  //#endregion

  //#region Event
  OnFile(event: HTMLInputEvent | any) {
    if (!event.target.files && !event.target.files[0])
      return;
    this.attached = event.target.files[0];
    // if (this.attached.size > 2000) {
    //   this.file.nativeElement.value = '';
    //   this.Notify('show-message', 'alert', 'Este archivo es demasiodo grande, el limite es de 2 KB.', true);
    // }
    this.attachedName = this.attached.name

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
    for (let a = 0; a < this.records.length; a++) {
      let date = moment(this.records[a].date).format('L');
      if (date == moment().format('L')) this.records[a].date = moment(this.records[a].date).format('LT');
      else this.records[a].date = date;
    }
  }
  //#endregion

   //#region Tools
   CleanForm() {
    this.form.get('subject').setValue('');
    this.form.get('body').setValue('');
    this.CleanFile();
  }

  CleanFile() {
    this.attached = null;
    this.attachedName = '';
    this.file.nativeElement.value = '';
  }
  //#endregion
}