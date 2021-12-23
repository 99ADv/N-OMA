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
export class NotificactionService {
 //#region Variables
 private url_api = environment.api_url+'notification/';
 //#endregion

//#region Start
constructor(private http: HttpClient) { }
//#endregion

//#region Methods
Get(params: any) {
  return this.http.get(this.url_api, {
    params: params
  });
}
//#endregion
}
