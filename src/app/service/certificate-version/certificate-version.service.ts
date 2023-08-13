import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CertificateVersionService {
  private SaveUrl = environment.rootPath + 'Certificate_Version';
  private getDeedTableURL = environment.rootPath + 'BPEL/getDeedRegstrationByPlotID';

  constructor(private http: HttpClient) {
  }

  SaveCertificate(data: any) {
    return this.http.put(this.SaveUrl, data);
  }

  AddCertificate(data: any) {
    return this.http.post(this.SaveUrl, data);
  }

  getDeedTable(plotid) {
    return this.http.get(this.getDeedTableURL + '?plotid=' + plotid);
  }

}
