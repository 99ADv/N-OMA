//#region Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//#endregion

//#region Services
import { HelpersDevService } from 'src/app/core/services/helperDev/helper-dev.service';
import { TicketService } from 'src/app/core/services/ticket/ticket.service';
//#endregion

//#region Interface
import { notification } from 'src/app/interface/others';
//#endregion

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {
  //#region Variables
  notfyTimeout: any;
  id: string = '';
  body: string = '';
  //#endregion

  //#region Object
  ticket: any = {}
  modal: notification = {
    modal: 'hide',
    type_of_message: 'messae',
    message: ''
  }
  //#endregion

  //#region Index
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private helperDev: HelpersDevService
  ) { }

  //#region Live cycle
  ngOnInit() {
  }

  ionViewWillEnter() {
    this.route.paramMap.subscribe(
      param => {
        if (param.has('id')) {
          this.id = param.get('id');
          this.GetTicket();
        } else this.router.navigate(["/history"]);
      }
    )
  }
  //#endregion

  //#endregion

  //#region API
  GetTicket() {
    this.Notify('show-loading', '', 'Cargando datos', false);
    this.ticketService.Get({ ticketID: this.id }).subscribe(
      (result: any) => {
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true);
          return;
        }
        this.Notify('hide', '', '', false);
        this.ticket = result.result;

        this.body = this.ticket.Article[0].Body;
      },
      error => this.Notify('show-message', 'bug', '(404)Error interno.', true)
    )
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