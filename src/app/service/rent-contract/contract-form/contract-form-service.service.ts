import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ContractFormService {
  private learseownerURLsave =
    environment.rootPath + "Lease_and_Owned_Land/Put"; // URL to web api
  private learseownerURLAdd =
    environment.rootPath + "Lease_and_Owned_Land/Post"; // URL to web api
  private learseownerURL = environment.rootPath + "Lease_and_Owned_Land"; // URL to web api
  private rentContract = environment.rootPath + "ProprtyData/procRentContract";
  private customer = environment.rootPath + "finance/procCCustomer";
  private contract = environment.rootPath + "dbo/procContract";

  constructor(private http: HttpClient) { }

  getContract() {
    return this.http.get<any>(this.contract);
  }

  getCustomer() {
    return this.http.get<any>(this.customer);
  }

  getContractIdsLookUp() {
    return [{ name: "one" }, { name: "two" }, { name: "three" }];
  }

  getAllRentContract() {
    return this.http.get<any>(this.rentContract);
  }

  getRentContractByIdOf(id) {
    return this.http.get<any>(`${this.rentContract}/${id}`);
  }

  saveRentContract(rentContract) {
    return this.http.post<any>(this.rentContract, rentContract);
  }

  updateRentContract(rentContract) {
    return this.http.put<any>(this.rentContract, rentContract);
  }

  deleteRentContract(id) {
    return this.http.delete<any>(`${this.rentContract}/${id}`);
  }

  getAll(plotID) {
    return this.http.get<any[]>(
      this.learseownerURL +
      "?" +
      "sortOrder=test&currentFilter=&searchString&pageIndex&pageSize"
    );
  }

  save(data) {
    return this.http.put<any[]>(this.learseownerURLsave, data);
  }

  Add(data) {
    return this.http.post<any[]>(this.learseownerURLAdd, data);
  }
}
