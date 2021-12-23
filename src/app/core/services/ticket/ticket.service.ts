//#region Import

//#region Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//#endregion

//#region Others
import { environment } from 'src/environments/environment';
//#endregion

//#endregion

@Injectable({
  providedIn: 'root'
})

export class TicketService {
    //#region Variables
    private url_api = environment.api_url+'ticket/';
    //#endregion

   //#region Start
   constructor(private http: HttpClient) { }
   //#endregion
   
   //#region Methods
   GetAbstract(params: any) {
     return this.http.get(this.url_api+'abstract', {
       params: params
     });
   }

   GetHistoty(params: any) {
     return this.http.get(this.url_api+'/history', {
       params: params
     });
   }

   Get(params: any) {
     return this.http.get(this.url_api+'web-service', {
       params: params
     });
   }

   Create(params: any, file: any) {
    const fd = new FormData();
    fd.append('subject', params.subject);
    fd.append('body', params.body);
    fd.append('type', params.type);
    fd.append('customerLogin', params.customerLogin);
    fd.append('password', params.password);
    if(file) fd.append('file', file);
    if(params.email && params.full_name){
      fd.append('email', params.email);
      fd.append('full_name', params.full_name);
    }

    return this.http.post(this.url_api, fd);
   }
   //#endregion
}