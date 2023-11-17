import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { TreeNode } from "primeng/api";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ServiceService {
  public Service_Name: string = null;
  disablefins: boolean = true;
  private paymentUrl =
    environment.rootPath +
    "Payment?sortOrder=test&currentFilter&searchString&pageIndex&pageSize";
  private paymentByappNoUrl =
    environment.rootPath + "Payment?sortOrder=test&currentFilter=";
  private paymentDetailsUrl =
    environment.rootPath +
    "Payment_Details?sortOrder=test&currentFilter&searchString&pageIndex&pageSize";
  private getPaymentDetailByID =
    environment.rootPath + "Payment_Details?sortOrder=test&currentFilter=";
  private getusernameUrl =
    environment.rootPathApi +
    "view/View_getUserNameForReviewByApplication/application_number?application_number=";
  private gettopostgres =
    environment.rootPathApi + "Insert_In_toPostgres/procInsert_In_toPostgres/";
  private PlotManagementUrl = environment.rootPath + "Plot_Registration";
  private PlotManagementUrlapi =
    environment.rootPathApi + "Plot_Registration/procPlot_Registration/"; // URL to web api
  private PropertyListUrl = environment.rootPath + "Property_Registration"; // URL to web api
  private CertificateVersionUrl = environment.rootPath + "Certificate_Version"; // URL to web api
  private CertificateVersionUrl1 =
    environment.rootPath3 + "Certificate_Version/procCertificate_Version";
  private DeedUrl = environment.rootPath + "Deed_Registration"; // URL to web api
  private License_ServiceURL = environment.rootPath + "License_Service";
  private License_Service =
    environment.rootPathApi + "License_Service/procLicense_Service"; // URL to web api
  private saveFileLookUP = environment.rootPath + "BPEL/SaveDocumentMaster"; // URL to web api
  private Postit_user = environment.rootPathApi + "view/View_postit_note_user";
  private CustomerTypeLookUP = environment.rootPath + "Customer_Type_Lookup"; // URL to web api
  private CustomerLookUP = environment.rootPath + "Customer"; // URL to web api
  private SuspendedReasonLookUP =
    environment.rootPath + "Suspension_Reason_Lookup"; // URL to web api
  private PropertyTypeLookUP = environment.rootPath + "Property_Type_Lookup"; // URL to web api
  private PropertyStatusLookUP = environment.rootPath + "Property_StatusLookup"; // URL to web api
  private ServiceDeliveryUnitLookUP = environment.rootPath + "BPEL/AllOrg";
  private Deed_Transfer_Lookup =
    environment.rootPath + "Deed_Transfer_Lookup/Get";
  private Lease_Type_Lookup = environment.rootPath + "Lease_Type_Lookup/Get";
  private WoredaLookUP = environment.rootPath + "Woreda_Lookup"; // URL to web api
  private PlotStutusLookUP = environment.rootPath + "Plotl_Status_Lookup"; // URL to web api
  private PlotLandUseLookUP = environment.rootPath + "Plot_Type_Of_Use_Lookup"; // URL to web api
  private saveFormDataURL = environment.rootPath + "BPEL/Savedata"; // URL to web api
  private getTaskRuleURL = environment.rootPath + "BPEL/TaskRule"; // URL to web api
  private getTodandAppNoURL = environment.rootPath + "BPEL/TodandAppNo"; // URL to web api
  private getRequerdURL =
    environment.rootPath + "BPEL/getRequrementDocumentOfTasks"; // URL to web api
  private nextTaskCompleteURL = environment.rootPath + "BPEL/nextTaskComplete"; // URL to web api
  private nextTaskAcceptOrRejectURl =
    environment.rootPath + "BPEL/nextTaskAcceptOrReject"; // URL to web api
  private SaveDataURL = environment.rootPath + "BPEL/SaveData"; // URL to web api
  private GetDataURL = environment.rootPath + "BPEL/GetData"; // URL to web api
  private RemoveDocURL =
    environment.rootPath + "BPEL/Remove_RequrementDocument"; // URL to web api
  private ViewAspNetUsersWorkInfoDetail =
    environment.rootPath + "view/ViewAspNetUsersWorkInfoDetail";
  private BaseUrl = environment.rootPath + "BPEL/GetCertficateBase";
  private SaveBaseUrl = environment.rootPath + "Certificate_Base";
  private UpdateCertURL = environment.rootPath + "Document_Archive"; // URL to web api
  docId;
  private SaveNoteURL = environment.rootPath + "BPEL/Edit_postit_notes"; // URL to web api
  private AddNoteURL = environment.rootPath + "BPEL/Set_postit_notes"; // URL to web api
  private SendNoteURL = environment.rootPath + "BPEL/sendNot"; // URL to web api
  private DeleteNoteURL = environment.rootPath + "BPEL/Delete_postit_notes"; // URL to web api
  private GetNoteURL = environment.rootPath + "BPEL/Get_postit_notes"; // URL to web api
  private isvalidatedURL = environment.rootPath + "BPEL/isvalidated"; // URL to web api
  private PaymentUrl = environment.rootPath + "Payment"; // URL to web api
  private BackURL = environment.rootPath + "BPEL/TaskBack"; // URL to web api
  private PaymentDetailUrl = environment.rootPath + "Payment_Details"; // URL to web api
  private Plot_Land_Grade_lookup =
    environment.rootPath + "Plot_Land_Grade_lookup"; // URL to web api
  private Lease_Stuts_Lookup =
    environment.rootPath + "Lease_Owned_Status_Lookup/Get";
  private lookup = environment.rootPath + "BPEL/GetLookUp?DropGownName";
  private units = environment.rootPath + "finance/cUnit";
  private currencies = environment.rootPath + "finance/CCurrencyID";
  private SaveDataObjURL = environment.rootPath + "BPEL/SaveDataObj"; // URL to web api
  private getAllDocumentURL = environment.rootPath + "BPEL/getAllDocument";
  private MytasksUrl = environment.rootPath + "BPEL/GetlistofTodo"; // URL to web api
  OrganizationparentUrl =
    environment.rootPath2 + "Job/procOrganization/Organization";
  saveCustomerdata = environment.rootPath3 + "Customer/procCustomer/";
  saveplotlocdata = environment.rootPath3 + "Plot_Location/procPlot_Location/";
  saveproplocdata =
    environment.rootPath3 + "Proporty_Location/procProporty_Location/";
  private EthiopianToGregorian = environment.rootPath3 + "EthiopianToGregorian";
  private gregorianToEthiopianDate =
    environment.rootPath3 + "gregorianToEthiopianDate";
  private propertreg =
    environment.rootPath3 + "Property_Registration/procProperty_Registration";
  private propertregis =
    environment.rootPath3 + "Proporty_Location/procProporty_Location/";

  private saveCustomerLookUP = environment.rootPath + "Customer"; // URL to web api
  userRoleUrl = environment.rootPath + "BPEL/GetUserRole";
  private CountryLookUP = environment.rootPath + "Country"; // URL to web api
  public lookupUrl = environment.rootPath + "BPEL/" + "";
  private CustomerStatusLookUP =
    environment.rootPath + "Customer_Status_Lookup"; // URL to web api
  private saveCustomeredit = environment.rootPath + "Customer";
  private dbstatus = environment.rootPath + "BPEL/";
  public customerUrl = environment.rootPathApi + "Customer/procCustomer";
  private GetApplicationNumberByUserURL =
    environment.rootPathApi +
    "view/View_getUserNameForReviewByApplication/UserName/";
  private APIForMoreOptionGetCustmerInformationURL =
    environment.rootPathApi +
    "view/View_APIForMoreOptionGetCustmerInformation/application_number?application_number=";
  // environment.rootPath + "BPEL/GetApplicationNumberByUser"; // URL to web api
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
    params: {},
  };
  ApplicationNo: any;
  todo: any;
  servID: any;
  taskrul: any;
  isleaseForm: boolean;
  EmployeeTIN: any;
  Parent_Customer_ID: any;
  showcustomerr: boolean;
  taskid: string;
  coordinate: any;
  geometry: any[];
  files: TreeNode[] = [];
  disablebutton: boolean = false;
  latLngs: { lat: number; lng: number }[];
  check: boolean;
  shapes: any;
  hide: boolean = false;
  toMes: boolean;
  toEnablenext: boolean = true;
  propertyISEnable: boolean = true;
  toMess: boolean = false;
  Plot_Size_M2: any;
  fromPropoperty: boolean = false;
  Totalarea: number = 0;
  areaVerified: boolean = false;
  Service_ID: any;
  PlotStutusLook: any;
  serviceDP: any;
  isvalidatedPlotGis: boolean = true;
  ispropoertylocation: boolean = false;
  frompropertyUpdate: boolean;
  isproportinal: boolean = false;
  totlaizeproportinal: number = 0;
  PropertyList: any;
  selectedproperty: any;
  ishavetitleDeedRegistrationList: boolean = false;
  ismeasurmentList: boolean = false;
  insertedProperty: any;
  selectedproperty_Type_ID: any;
  iscircleLatLngs: number = 0;
  centerLatLng: any;
  plotsizenotequal: boolean;
  isNextactive: boolean = false;
  currentplotsize: any;
  leaselist: any;
  constructor(private http: HttpClient) {}
  getdbstatus(orgid) {
    return this.http.get(this.dbstatus + "GetDBServerStatus?orgid=" + orgid);
  }
  multipleplotcanbeadd = environment.multipleplotcanbeadd;
  getCustomerLookUP() {
    return this.http.get(
      this.CustomerLookUP +
        "?" +
        "sortOrder=test&currentFilter&searchString&pageIndex&pageSize"
    );
  }
  getuserName(Appno) {
    return this.http.get(this.getusernameUrl + Appno);
  }
  postplotTopostgres(plotid, propertid) {
    return this.http.get(
      this.gettopostgres + plotid + "/Proporty_Id?Proporty_Id=" + propertid
    );
  }
  GetApplicationNumberByUser(username, orgcod) {
    return this.http.get(
      this.GetApplicationNumberByUserURL + username + "/" + orgcod
    );
  }
  GetApplicationNumberByUserInfo(appno) {
    return this.http.get(this.APIForMoreOptionGetCustmerInformationURL + appno);
  }
  getAppointmentByApp(params): Observable<any> {
    const url = environment.rootPath + "GetAppointementByApp";
    this.httpOptions.params = params;
    return this.http
      .get<AppointmentByAppResult[]>(url, this.httpOptions)
      .pipe(catchError(this.handleError("GetAppointementByApp", [])));
  }

  handleError(
    arg0: string,
    arg1: undefined[]
  ): (
    err: any,
    caught: Observable<any>
  ) => import("rxjs").ObservableInput<any> {
    throw new Error("Method not implemented.");
  }
  getgregorianToEthiopianDate(date) {
    if (date) {
      let year = parseInt(date.split("-")[0]);
      let month = parseInt(date.split("-")[1]);
      let day = parseInt(date.split("-")[2].split(":")[0].split("T")[0]);

      return this.http.get<any>(
        this.gregorianToEthiopianDate + "/" + year + "/" + month + "/" + day
      );
    }
  }
  getEthiopianToGregorian(date) {
    if (date) {
      const dateStr = date;
      const dateParts = dateStr.split("/");
      const year = +dateParts[2]; // Convert to a number using the '+' operator
      const month = +dateParts[1];
      const day = +dateParts[0];
      console.log("datedatedate", year, month, day);
      return this.http.get<any>(
        this.EthiopianToGregorian + "/" + year + "/" + month + "/" + day
      );
    }
  }
  getCountryLookUP() {
    return this.http.get(
      this.CountryLookUP +
        "?" +
        "sortOrder=test&currentFilter&searchString&pageIndex&pageSize"
    );
  }

  getCustomerTypeLookUP() {
    return this.http.get(
      this.CustomerTypeLookUP +
        "?" +
        "sortOrder=test&currentFilter&searchString&pageIndex&pageSize"
    );
  }
  getCustomerStatusLookUP() {
    return this.http.get(
      this.CustomerStatusLookUP +
        "?" +
        "sortOrder=test&currentFilter&searchString&pageIndex&pageSize"
    );
  }
  getMytasks(orgid) {
    return this.http.get(
      this.MytasksUrl +
        "?username=" +
        environment.username +
        "&orgid=" +
        orgid +
        "&lanid=10D04E8B-3361-E111-95D5-00E04C05559B&userroll" +
        "=00000000-0000-0000-0000-000000000000"
    );
  }
  getCurrencies() {
    return this.http.get<any>(this.currencies);
  }
  getPostit_user() {
    // User_ID = this.removeSlash(User_ID);
    return this.http.get<any>(this.Postit_user);
  }
  getUnits() {
    return this.http.get<any>(this.units);
  }

  getLookupBy(name) {
    return this.http.get<any>(`${this.lookup}=${name}`);
  }

  getLease_Stuts_Lookup() {
    return this.http.get(
      this.Lease_Stuts_Lookup +
        "?" +
        "sortOrder=test&currentFilter&searchString&pageIndex&pageSize"
    );
  }

  GetPlot_Land_Grade_lookup() {
    return this.http.get(this.Plot_Land_Grade_lookup);
  }

  UpdateLicence(LicenceData) {
    return this.http.put(this.License_Service, LicenceData);
  }

  isvalidated(todoid, taskid, Plotid, ProperyID, DocID) {
    return this.http.get(
      this.isvalidatedURL +
        "?Username=" +
        environment.username +
        "&todoid=" +
        todoid +
        "&taskid=" +
        taskid +
        "&Plotid=" +
        Plotid +
        "&ProperyID=" +
        ProperyID +
        "&DocID=" +
        DocID
    );
  }

  saveNote(Msg, noteid) {
    return this.http.post(
      this.SaveNoteURL + "?Msg=" + Msg + "&postitid=" + noteid,
      null
    );
  }
  addNote(ApplicationNumber, Msg, noteid) {
    return this.http.post(
      this.AddNoteURL +
        "?Application_number=" +
        ApplicationNumber +
        "&uid=" +
        environment.username +
        "&Msg=" +
        Msg +
        "&postitid=" +
        noteid,
      null
    );
  }

  GetNote(ApplicationNo) {
    return this.http.post(
      this.GetNoteURL + "?Application_number=" + ApplicationNo,
      null
    );
  }

  DeleteNote(ApplicationNo, noteid) {
    return this.http.post(
      this.DeleteNoteURL +
        "?Application_number=" +
        ApplicationNo +
        "&postitid=" +
        noteid,
      null
    );
  }

  sendNote(msg, AppNo, postit_note_code, todoid, orgid) {
    return this.http.post(
      this.SendNoteURL +
        "?meg=" +
        msg +
        "&Application_number=" +
        AppNo +
        "&todoid=" +
        todoid +
        "&postit_note_code=" +
        postit_note_code +
        "&orgid=" +
        orgid,
      null
    );
  }
  saveFormData(formData) {
    const ApplicationCode = "00000000-0000-0000-0000-000000000000";
    const serviceId = "000000-0000-0000-0000-000000000000";
    const taskid = "c8c52994-57e4-4b3a-a7be-1d00ea0db37f";
    const orgid = "930d1c20-9e0e-4a50-9eb2-e542fafbad68";
    const userid = environment.username;
    const json = formData;
    const docid = "00000000-0000-0000-0000-000000000000";
    return this.http.put<any>(this.saveFormDataURL, {
      ApplicationCode,
      serviceId,
      taskid,
      orgid,
      userid,
      json,
      docid,
    });
  }
  getViewAspNetUsersWorkInfoDetail(User_ID) {
    User_ID = this.removeSlash(User_ID);
    return this.http.get<any>(
      this.ViewAspNetUsersWorkInfoDetail + "/" + User_ID
    );
  }
  removeSlash(string) {
    if (string == null) return;
    return string.replace(/\//g, "%2F");
  }

  RemoveDoc(DocCode) {
    return this.http.post(
      this.RemoveDocURL +
        "?currentUserId=" +
        environment.username +
        "&document_code=" +
        DocCode,
      null
    );
  }
  getView_CustomerForWhereWhereWork() {
    return this.http.get(
      environment.rootPath2 + "view/View_CustomerForWhereWhereWork"
    );
  }
  getorganizationbyparent(orgid) {
    return this.http.get(this.OrganizationparentUrl + "/" + orgid);
  }
  public getUserRole() {
    return this.http.get(
      this.userRoleUrl + "?userName=" + environment.username
    );
  }

  getWoredaLookUPbyorg(org) {
    return this.http.get(
      this.WoredaLookUP +
        "?" +
        "sortOrder=test&currentFilter=" +
        org +
        "&searchString&pageIndex&pageSize"
    );
  }
  saveCustomer(data) {
    console.log("saveing", data);
    return this.http.post(this.saveCustomerdata, data);
  }
  savePlotloc(data) {
    console.log("saveing", data);
    return this.http.post(this.saveplotlocdata, data);
  }
  saveProploc(data) {
    console.log("saveing", data);
    return this.http.post(this.saveproplocdata, data);
  }
  updatePlotloc(data) {
    console.log("saveing", data);
    return this.http.put(this.saveplotlocdata, data);
  }
  updateProploc(data) {
    console.log("saveing", data);
    return this.http.put(this.saveproplocdata, data);
  }
  getPlotloc(data) {
    console.log("saveing", data);
    return this.http.get(this.saveplotlocdata + data);
  }
  getProploc(data) {
    console.log("saveing", data);
    return this.http.get(this.saveproplocdata + data);
  }
  UpdateCustomer(data) {
    return this.http.put(this.saveCustomerdata, data);
  }
  getCustomer(custID) {
    return this.http.get(
      this.CustomerLookUP +
        "?" +
        "sortOrder=test&currentFilter=" +
        custID +
        "&searchString&pageIndex&pageSize"
    );
  }
  getcustomerlease(col) {
    return this.http.get(
      this.saveCustomerdata + "Column/CustomerLoadByHaveLeaseculumn/" + col
    );
  }
  getcustomerAll(col) {
    return this.http.get(this.saveCustomerdata + "Column/" + col);
  }
  getcustomerbyid(col) {
    return this.http.get(this.saveCustomerdata + col);
  }
  getLookup(table) {
    return this.http.get(this.lookupUrl + "?DropGownName=" + table);
  }
  getcostemerbyuserid(table) {
    return this.http.get(
      environment.rootPath2 +
        "finance/procCCustomer/api/finance/procCCustomer/" +
        table
    );
  }
  Back(ApplicationNo, todoid) {
    return this.http.post(
      this.BackURL +
        "?" +
        "ApplicationNo=" +
        ApplicationNo +
        "&UserName=" +
        environment.username +
        "&todoid=" +
        todoid,
      null
    );
  }
  saveFile(
    DocData,
    FileType,
    ApplicationNo,
    RequrementID,
    TaskType,
    Requrement,
    DocID
  ) {
    // console.log('File', File);
    /*return this.http.post(this.saveFileLookUP + '?' + 'TaskType=' + TaskType + '&ApplicationNo=' + ApplicationNo + '&DocData=' + File + '&uid=00000000-0000-0000-0000-000000000000' + '&FileType=' + Type + '&RequrementID=' + ReqId + '&Requrement=' + Requrement, null);*/

    return this.http.post(this.saveFileLookUP, {
      TaskType,
      ApplicationNo,
      DocData,
      uid: environment.username,
      FileType,
      RequrementID,
      Requrement,
      DocID,
    });
  }
  getBaseTable(CertefcateCode) {
    return this.http.get(this.BaseUrl + "?" + "PlotID=" + CertefcateCode);
  }

  EditBase(data) {
    return this.http.put<any[]>(this.SaveBaseUrl, data);
  }
  SaveBase(data) {
    return this.http.post<any[]>(this.SaveBaseUrl, data);
  }

  getDocmentArcive(CertefcateCode) {
    return this.http.get(
      this.UpdateCertURL +
        "?" +
        "sortOrder=test&currentFilter=" +
        CertefcateCode +
        "&searchString&pageIndex&pageSize"
    );
  }

  UpdateDocmentArcive(cerltter) {
    return this.http.put(this.UpdateCertURL, cerltter);
  }
  CreateDocmentArcive(cerltter) {
    return this.http.post(this.UpdateCertURL, cerltter);
  }

  getTodandAppNo(AppNo) {
    return this.http.get<any[]>(
      this.getTodandAppNoURL + "?" + "ApplicationNo=" + AppNo
    );
  }

  getAllDocument(ApplicationCode, DocID) {
    console.log("ApplicationCode, DocID", ApplicationCode, DocID);

    return this.http.get<any[]>(
      this.getAllDocumentURL +
        "?" +
        "ApplicationCode=" +
        ApplicationCode +
        "&DocID=" +
        DocID
    );
  }
  getAll(AppNo) {
    return this.http.get<any[]>(
      this.License_ServiceURL +
        "?" +
        "sortOrder=test&currentFilter=" +
        AppNo +
        "&searchString&pageIndex&pageSize"
    );
  }

  getPriveys(certefcatcode) {
    return this.http.get<any[]>(
      this.License_ServiceURL +
        "?" +
        "sortOrder=test&currentFilter=" +
        certefcatcode +
        "&searchString&pageIndex&pageSize"
    );
  }

  getRequerdDocs(TaskID) {
    return this.http.get(this.getRequerdURL + "?TaskID=" + TaskID);
  }

  getTaskRule(tasksId) {
    return this.http.post(
      this.getTaskRuleURL +
        "?" +
        "taskid=" +
        tasksId +
        "&LangID=10D04E8B-3361-E111-95D5-00E04C05559B",
      null
    );
  }

  getPlotManagement(plotid) {
    return this.http.get(
      this.PlotManagementUrl +
        "?" +
        "sortOrder=test&currentFilter=" +
        plotid +
        "&searchString&pageIndex&pageSize"
    );
  }
  getPlotManagementApi(plotid) {
    return this.http.get(this.PlotManagementUrlapi + plotid);
  }

  getPlotManagementApiLicen(Licence_Service_ID) {
    return this.http.get(
      this.PlotManagementUrlapi +
        "Licence_Service_ID/Licence_Service_ID?Licence_Service_ID=" +
        Licence_Service_ID
    );
  }
  getPropertyList(plotid) {
    return this.http.get(
      this.PropertyListUrl +
        "?" +
        "sortOrder=test&currentFilter=" +
        plotid +
        "&searchStringByPID&searchStringByPloteID&pageIndex&pageSize"
    );
  }
  getPropertyLists(plotid) {
    return this.http.get(this.propertreg + "/" + plotid);
  }

  getPropertyListsfromcenteral(propert) {
    return this.http.get(this.propertregis + propert + "/Proporty_Id");
  }

  getDeedTable(propertyID) {
    return this.http.get(
      this.DeedUrl +
        "?" +
        "sortOrder=test&currentFilter=" +
        propertyID +
        "&searchString&pageIndex&pageSize"
    );
  }

  getCertificateVersion(ownerShipid) {
    return this.http.get(
      this.CertificateVersionUrl +
        "?" +
        "sortOrder=test&currentFilter=" +
        ownerShipid +
        "&searchString&pageIndex&pageSize"
    );
  }
  getCertificateVersion1(ownerShipid) {
    return this.http.get(this.CertificateVersionUrl1 + "/" + ownerShipid);
  }

  getSuspendedReasonLookUP() {
    return this.http.get(
      this.SuspendedReasonLookUP +
        "?" +
        "sortOrder=test&currentFilter&searchString&pageIndex&pageSize"
    );
  }

  getPropertyTypeLookUP() {
    return this.http.get(
      this.PropertyTypeLookUP +
        "?" +
        "sortOrder=test&currentFilter&searchString&pageIndex&pageSize"
    );
  }

  getPropertyStatusLookUP() {
    return this.http.get(
      this.PropertyStatusLookUP +
        "?" +
        "sortOrder=test&currentFilter&searchString&pageIndex&pageSize"
    );
  }

  getServiceDeliveryUnitLookUP() {
    return this.http.get(
      this.ServiceDeliveryUnitLookUP +
        "?" +
        "sortOrder=test&currentFilter&searchString&pageIndex&pageSize"
    );
  }

  getTransferTypeLookUP() {
    return this.http.get(
      this.Deed_Transfer_Lookup +
        "?" +
        "sortOrder=test&currentFilter&searchString&pageIndex&pageSize"
    );
  }
  getLease_Type_Lookup() {
    return this.http.get(
      this.Lease_Type_Lookup +
        "?" +
        "sortOrder=test&currentFilter&searchString&pageIndex&pageSize"
    );
  }

  getWoredaLookUP() {
    return this.http.get(
      this.WoredaLookUP +
        "?" +
        "sortOrder=test&currentFilter&searchString&pageIndex&pageSize"
    );
  }

  getPlotStutusLookUP() {
    return this.http.get(
      this.PlotStutusLookUP +
        "?" +
        "sortOrder=test&currentFilter&searchString&pageIndex&pageSize"
    );
  }

  getPlotLandUseLookUP() {
    return this.http.get(
      this.PlotLandUseLookUP +
        "?" +
        "sortOrder=test&currentFilter&searchString&pageIndex&pageSize"
    );
  }

  Submit(AppCode, docID, todoID, ruleid) {
    return this.http.post(
      this.nextTaskCompleteURL +
        "?ApplicationNo=" +
        AppCode +
        "&docid=" +
        docID +
        "&todoid=" +
        todoID +
        "&userName=" +
        environment.username +
        "&status=C&Taskruleid=" +
        ruleid +
        "&ispending=false",
      null
    );
  }

  SubmitAR(AppCode, docID, todoID, ruleid) {
    return this.http.post(
      this.nextTaskAcceptOrRejectURl +
        "?ApplicationNo=" +
        AppCode +
        "&docid=" +
        docID +
        "&eid=00000000-0000-0000-0000-000000000000&isPending=false&todoid=" +
        todoID +
        "&userName=" +
        environment.username +
        "&status=C&taskruleid=" +
        ruleid,
      null
    );
  }

  saveFormObj(ApplicationCode, serviceId, taskid, orgid, json, docid, todoID) {
    let body = {
      ApplicationCode,
      UserName: environment.username,
      docid,
      json,
      orgid,
      serviceId,
      taskid,
      todoID,
    };

    return this.http.post(this.SaveDataObjURL, body);
  }

  saveForm(ApplicationCode, serviceId, taskid, orgid, json, docid, todoId) {
    return this.http.post(
      this.SaveDataURL +
        "?ApplicationCode=" +
        ApplicationCode +
        "&serviceId=" +
        serviceId +
        "&taskid=" +
        taskid +
        "&orgid=" +
        orgid +
        "&UserName=" +
        environment.username +
        "&json=" +
        json +
        "&docid=" +
        docid +
        "&todoid=" +
        todoId,
      null
    );
  }

  GetForm(docid) {
    return this.http.get(this.GetDataURL + "?docid=" + docid);
  }

  getFormData(formcode) {
    if (!environment.production) {
      return this.http.get<any>(
        "http://land.xokait.com.et/DB/" + formcode + ".json"
      );
    } else {
      return this.http.get<any>(environment.formPath + formcode + ".json");
    }
  }
  //Payment
  getPayment(AppNO) {
    return this.http.get(
      this.PaymentUrl +
        "?" +
        "sortOrder=test&currentFilter=" +
        AppNO +
        "&searchString&pageIndex&pageSize"
    );
  }

  getPaymentDetail(pID) {
    return this.http.get(
      this.PaymentDetailUrl +
        "?" +
        "sortOrder=test&currentFilter=" +
        pID +
        "&searchString&pageIndex&pageSize"
    );
  }
  savePaymentDetail(data) {
    return this.http.put<any[]>(this.PaymentDetailUrl, data);
  }

  addPaymentDetail(data) {
    return this.http.post<any[]>(this.PaymentDetailUrl, data);
  }

  savePayment(data) {
    return this.http.put<any[]>(this.PaymentUrl, data);
  }
  saveFormm(ApplicationCode, serviceId, taskid, orgid, json, docid, todoID) {
    // taskid = "0095300b-ffa8-4b74-b6e4-e4b984b85a31";
    //serviceId = "4c45e330-40a1-46d3-83ee-443eace0faf6";
    //orgid="df9d76cd-c5fe-49f3-8984-88b97985ff03";
    return this.http.post(
      this.SaveDataURL +
        "?ApplicationCode=" +
        ApplicationCode +
        "&serviceId=" +
        serviceId +
        "&taskid=" +
        taskid +
        "&orgid=" +
        orgid +
        "&UserName=" +
        environment.username +
        "&json=" +
        json +
        "&docid=" +
        docid +
        "&todoID=" +
        todoID,

      null
    );
  }
  //getPaymentByAppNo(appNo){
  //  return this.http.get<any>(this.paymentByappNoUrl+appNo+"&searchString&pageIndex&pageSize");
  //   }
  //   updatePayment(payment){
  //     return this.http.put(this.paymentUrl,payment);
  //   }
  //   getPaymentDetails(){
  //    return  this.http.get(this.paymentDetailsUrl);
  //   }
  //   getPaymentDetailByPaymentId(payment_Id){
  //    return this.http.get(this.getPaymentDetailByID+payment_Id+"&searchString&pageIndex&pageSize");
  //   }

  //   addPaymentDetails(paymentDetails){
  //    return this.http.post(this.paymentDetailsUrl,paymentDetails);
  //   }
  //   updatePaymentDetails(data){
  //   return this.http.put(this.paymentDetailsUrl,data);
  //   }
  // //posts
  postsUrl = "http://localhost:3000/db";
  getPosts() {
    return this.http.get(this.postsUrl);
  }
  //posts
  postUrl = "http://localhost:3000/posts";
  getPost() {
    return this.http.get(this.postUrl);
  }
  getcustomerby() {
    return this.http.get(this.customerUrl);
  }
}

export class UserRole {
  UserId: string;
  RoleId: string;
}

export class Application {
  ApplicationId: string;
  ApplicationNumber: string;
  CitizenId: string;
  UserName: string;
  Service_Name: string;
  to_do_lists_to_do_code: string;
  status: string;
  looked: boolean;
  Licence_Service_ID: string;
  isConfirmed: boolean;
  isselect: boolean;
  queueNumber: null;
}
export class AppointmentByAppResult {
  aspnet_UsersInRoles: UserRole[];
  View_AppointementByApp: Application[];
}
