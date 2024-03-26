import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class NetworkMonitoringService {
  constructor(private http: HttpClient) {}
  private checkConnectivityURL =
    environment.rootPathApi + "Network/Network/checkConnectivity?serverUrl=";
  private pingserverURL =
    environment.rootPathApi + "Network/Network/pingServer?serverUrl=";
  private assessNetworkReliabilityURL =
    environment.rootPathApi +
    "Network/Network/assessNetworkReliability?serverUrl=";
  private networkChangeSource = new Subject<void>();

  headerChange$ = this.networkChangeSource.asObservable();
  check = environment.rootPathApi + `Country/procCountry`;
  checkConnectivity(): Observable<boolean> {
    // Check connectivity by making a simple HTTP GET request to a known endpoint
    let url = this.checkConnectivityURL + this.check;
    return this.http.get(url, { observe: "response" }).pipe(
      map((response) => response.status === 200),
      catchError((error) => throwError(false))
    );
  }
  notifyHeaderChange() {
    this.networkChangeSource.next();
  }
  pingServer(turl: any): Observable<number> {
    // Ping a server by sending an HTTP request and measuring the time it takes to receive a response
    const startTime = Date.now();
    return this.http.get(turl).pipe(
      map(() => Date.now() - startTime),
      catchError((error) => throwError("Ping failed"))
    );
  }

  pingServerapi(): Observable<number> {
    // Ping a server by sending an HTTP request and measuring the time it takes to receive a response
    let url = this.pingserverURL + this.check;
    const startTime = Date.now();
    return this.http.get(url).pipe(
      map(() => Date.now() - startTime),
      catchError((error) => throwError("Ping failed"))
    );
  }

  measureBandwidth(serverUrl: string, fileSizeMB: number): Observable<number> {
    // Measure bandwidth by downloading a file of a specified size from the server and calculating the transfer rate
    const fileUrl = `${serverUrl}/${fileSizeMB}MBFile.bin`;
    const startTime = Date.now();
    return this.http.get(fileUrl, { responseType: "blob" }).pipe(
      map((blob) => {
        const endTime = Date.now();
        const durationInSeconds = (endTime - startTime) / 1000; // Convert to seconds
        const fileSizeBytes = blob.size;
        const fileSizeBits = fileSizeBytes * 8;
        return fileSizeBits / durationInSeconds; // Calculate bandwidth in bits per second
      }),
      catchError((error) => throwError("Bandwidth measurement failed"))
    );
  }

  assessNetworkReliability(pingThreshold: number): Observable<boolean> {
    // Assess network reliability based on ping response times compared to a threshold
    let url = this.assessNetworkReliabilityURL + this.check;
    return this.pingServer(url).pipe(
      map((pingTime) => pingTime <= pingThreshold),
      catchError((error) => throwError("Network reliability assessment failed"))
    );
  }
  testLDAPConnection(urlldap: any): Observable<string> {
    return this.http.get<string>(
      environment.rootPathApi + `Network/Network/checkLDAP?Urlldap=` + urlldap
    );
  }
}
