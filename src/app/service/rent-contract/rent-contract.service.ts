import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class RentContractService {
  private learseownerURLsave =
    environment.rootPath + "Lease_and_Owned_Land/Put"; // URL to web api
  private learseownerURLAdd =
    environment.rootPath + "Lease_and_Owned_Land/Post"; // URL to web api
  private learseownerURL = environment.rootPath + "Lease_and_Owned_Land"; // URL to web api
  private rentContract = environment.rootPath + "ProprtyData/procRentContract";

  constructor(private http: HttpClient) { }

  getAllRentContract() {
    return this.http.get<any>(this.rentContract);
  }

  getPropertyTypeLookUp() {
    return [{ name: "one" }, { name: "two" }, { name: "three" }];
  }

  getAll() {
    return this.http.get<any[]>(
      this.learseownerURL +
      "?" +
      "sortOrder=test&currentFilter="
      +
      "&searchString&pageIndex&pageSize"
    );
  }

  save(data) {
    return this.http.put<any[]>(this.learseownerURLsave, data);
  }

  Add(data) {
    return this.http.post<any[]>(this.learseownerURLAdd, data);
  }
}
