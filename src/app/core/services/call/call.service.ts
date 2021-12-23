//#region Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//#endregion

//#region Others
import { environment } from 'src/environments/environment';
//#endregion


@Injectable({
  providedIn: 'root'
})
export class CallService {
//#region Variables
private url_api = environment.api_url + 'tel/';
//#endregion

//#region Start
constructor(private http: HttpClient) { }
//#endregion

//#region Methods
Create(params: any) {
  return this.http.post(this.url_api+'call-log', params);
}
Get(params: any) {
  return this.http.get(this.url_api, {params: params});
}
GetData(params: any) {
  return this.http.get(this.url_api+'data', {params: params});
}
//#endregion
}
