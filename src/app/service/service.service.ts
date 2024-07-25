import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { TreeNode } from "primeng/api";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { LeaseOwnerShip } from "./lease-owner-ship/lease-owner-ship.component";
import { CookieService } from "ngx-cookie-service/cookie-service/cookie.service";

@Injectable({
  providedIn: "root",
})
export class ServiceService {
  public Service_Name: string = null;
  disablefins: boolean = true;
  private taskdropdown = environment.rootPathApi + "tasks/proctasks";
  private servicedropdwn = environment.rootPathApi + "services/procservices";
  private DocumentArc =
    environment.rootPathApi + "Document_Archive/procDocument_Archive";
  private orgdropdwn =
    environment.rootPathApi + "organizations/procorganizations";
  private Requirement_Documents =
    environment.rootpath2 + "getRequrementDocumentOfTasks";
  private save_Documentoftask = environment.rootpath2 + "SaveDocumentMaster";
  private Save_License_Service =
    environment.rootpath2 + "saveLicenceServiceRecord";
  private Remove_Document = environment.rootpath2 + "Remove_RequrementDocument";
  private License_Service =
    environment.rootPathApi + "License_Service/procLicense_Service";
  private Tasks = environment.rootpath2 + "getTasks";
  private Document = environment.rootpath2 + "getAllDocument";
  private saveFileLookUP = environment.rootpath2 + "SaveDocumentMaster";
  private UpdateCertURL1 = environment.rootPath + "Document_Archive";
  private UpdateCertURL =
    environment.rootPathApi + "Document_Archive/procDocument_Archive";
  private GetApplicationNumberByUserURL =
    environment.rootPathApi +
    "view/View_getUserNameForReviewByApplication/UserName/UserName";
  private GetApplicationNumberBypreviousApplication =
    environment.rootPathApi +
    "view/View_getUserNameForReviewByApplication/previousApplication";
  private GetpreviousApplicationNumberByUserURL =
    environment.rootPathApi +
    "view/View_GetPreviceApplicationForReview/current/";
  private Certficate_ver_ValidationURL =
    environment.rootPathApi +
    "Certficate_ver_Validation/Certficate_ver_Validation/Certficate_ver_Validation/Certficate_ver_Validation/Applicationcode/servicecode/";
  private PlotValidationURL =
    environment.rootPathApi +
    "PlotValidation/PlotValidation/PlotValidation/PlotValidation/PlotValidation/PlotValidation/Applicationcode/servicecode/";
  private ProportyValidationURL =
    environment.rootPathApi +
    "ProportyValidation/Proporty_Validation/Proporty_Validation/Proporty_Validation/Applicationcode/";
  private ProportyValidationbyURL =
    environment.rootPathApi +
    "ProportyValidation/ProportyValidation/ProportyValidation/ProportyValidation/ProportyValidation/Proporty_Validation/Proporty_Validation/Proporty_Validation/Applicationcode/";

  private GetApplicationNumberByUserURLsapi =
    environment.rootPathApi +
    "view/View_getUserNameForReviewByApplication/UserName/UserName";
  private GetApplicationNumberByUserURLs =
    environment.rootpath2 + "GetApplicationNumberByUser";
  private getRequerdURL =
    environment.rootpath2 + "getRequrementDocumentOfTasks";
  private All_Service = environment.rootpath2 + "Service";
  private All_Serviceapi = environment.rootPathApi + "view/View_servicesforapi";
  private Task_Service = environment.rootpath2 + "getTasks";
  private All_Org = environment.rootpath2 + "AllOrg";
  public customerUrl =
    environment.rootPathApi + "Customer/procCustomer";
  public Username =
    environment.rootPathApi + "view/View_GetcustomerAllWithVitalId/";
  public CustomerId =
    environment.rootPathApi +
    "view/View_GetcustomerAllWithVitalId/Customer_ID/";
  public CustomerByColumn =
    environment.rootPathApi + "Customer/procCustomer/Column/";
  public woredabysubcity =
    environment.rootPathApi + "Woreda_Lookup/procWoreda_Lookup";
  public QRcode = environment.rootPathApi + "QRCode/QRCode";
  public CustomerByColumn1 =
    environment.rootPathApi +
    "Customer/procCustomer/Column/Column/CustomerLoadByTitledeedculumn/";
  private EthiopianToGregorian =
    environment.rootPathApi + "EthiopianToGregorian";
  private gregorianToEthiopianDate =
    environment.rootPathApi + "gregorianToEthiopianDate";
  public DocByAppNo =
    environment.rootPathApi +
    "View_RecordAppNoAndDocIdByAppNo/procView_RecordAppNoAndDocIdByAppNo/";
    public get_payment_plan1 =
    environment.rootPathApi +
    "proc_Payment_Plan?Lease_cdoe=";
  public DeedByAPP =
    environment.rootPathApi + "view/View_DeedRegstration/Application_No/";
  public DeedByCustId =
    environment.rootPathApi + "view/View_DeedRegstration12/Customer_ID";
  public AppbyUserId =
    environment.rootPathApi +
    "ApplicationLoadByUserId/procApplicationLoadByUserId/";
  public userbyusername =
    environment.rootPathApi + "view/View_aspuserforapi/UserName?UserName=";

  private getTodandAppNoURL = environment.rootpath2 + "TodandAppNo";
  private RemoveDocURL =
    environment.rootPath + "BPEL/Remove_RequrementDocument";
  private License_ServiceURL = environment.rootPath + "License_Service";
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
    "view/View_getUserNameForReviewByApplication/";
  //application_number?application_number=
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

  private Postit_user =
    environment.rootPathApi +
    "view/View_postit_note_user/application_number?application_number";
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

  private nextTaskCompleteURL = environment.rootPath + "BPEL/nextTaskComplete"; // URL to web api
  staticProperty = environment.rootPath2+'ProprtyData/ProcProportyStaticData'
  private withdrawprop = environment.rootPathApi+'proc_withdraw_propose/proc_withdraw_propose'
  private nextTaskAcceptOrRejectURl =
    environment.rootPath + "BPEL/nextTaskAcceptOrReject"; // URL to web api
  private SaveDataURL = environment.rootPath + "BPEL/SaveData"; // URL to web api
  private SaveDataURLkill = environment.rootPath + "BPEL/Kill"; // URL to web api
  private SaveDataURLreopen = environment.rootPath + "BPEL/reOpen"; // URL to web api
  private GetDataURL = environment.rootPath + "BPEL/GetData"; // URL to web api

  private ViewAspNetUsersWorkInfoDetail =
    environment.rootPath + "view/ViewAspNetUsersWorkInfoDetail";
  private BaseUrl = environment.rootPath + "BPEL/GetCertficateBase";
  private SaveBaseUrl = environment.rootPath + "Certificate_Base";
  private ViewAspNetUsersWorkInfoDetaill =
    environment.rootPathApi + "view/View_postit_note_user";
  private SaveNoteURL = environment.rootPath + "BPEL/Edit_postit_notes"; // URL to web api
  private AddNoteURL = environment.rootPath + "BPEL/Set_postit_notes"; // URL to web api
  private SendNoteURL = environment.rootPath + "BPEL/sendNot"; // URL to web api
  private SendNoteURLapi = environment.rootPathApi + "sendnote/sendnote/"; // URL to web api
  private DeleteNoteURL = environment.rootPath + "BPEL/Delete_postit_notes"; // URL to web api
  private GetNoteURL = environment.rootPath + "BPEL/Get_postit_notes"; // URL to web api
  private isvalidatedURL = environment.rootPath + "BPEL/isvalidated"; // URL to web api
  private PaymentUrl = environment.rootPath + "Payment"; // URL to web api
  private BackURL = environment.rootPath + "BPEL/TaskBack"; // URL to web api
  private PaymentDetailUrl = environment.rootPath + "Payment_Details"; // URL to web api
  private Plot_Land_Grade_lookup =
    environment.rootPath + "Plot_Land_Grade_lookup"; // URL to web api
  private View_propertyUse = environment.rootPathApi + "view/View_propertyUse"; // URL to web api
  private Lease_Stuts_Lookup =
    environment.rootPath + "Lease_Owned_Status_Lookup/Get";
  private lookup = environment.rootPath + "BPEL/GetLookUp?DropGownName";
  private units = environment.rootPath + "finance/cUnit";
  private currencies = environment.rootPath + "finance/CCurrencyID";
  private SaveDataObjURL = environment.rootPath + "BPEL/SaveDataObj"; // URL to web api
  private getAllDocumentURL = environment.rootPath + "BPEL/getAllDocument";
  private getAllDocumentURLs =
    environment.rootPathApi +
    "view/Vw_AllDocuments/application_number/application_code?";
    private getwithpropbyId1 =
    environment.rootPathApi +
    "proc_withdraw_propose/proc_withdraw_propose?";
    
  private getDocumentbytasksURL =
    environment.rootPathApi + "view/View_Document_By_Task/task_code";
  private MytasksUrl = environment.rootPath + "BPEL/GetlistofTodo"; // URL to web api
  OrganizationparentUrl =
    environment.rootPath2 + "Job/procOrganization/Organization";
  saveCustomerdata = environment.rootPath3 + "Customer/procCustomer/";
  get_constraction_level1 = environment.rootPathApi + "proc_Contraction_Level/proc_Contraction_Level";
  saveCustomerdataapi = environment.rootPath3 + "Tax/procTINERCA/system";
  PdfCompressor =
    "http://197.156.93.110/xoka.jobapi/api/compress/DeflateCompression/Compresse";
  saveplotlocdata = environment.rootPath3 + "Plot_Location/procPlot_Location/";
  saveproplocdata =
    environment.rootPath3 + "Proporty_Location/procProporty_Location/";

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
  private GetSuperviedUsersUrl =
    environment.rootPath + "BPEL/Get_SuperviedUsers"; // URL to web api
  private APIForMoreOptionGetCustmerInformationURL =
    environment.rootPathApi +
    "view/View_APIForMoreOptionGetCustmerInformation/application_number?application_number=";
  private View_ForApicheckcertificateVersionController =
    environment.rootPathApi + "view/View_ForApicheckcertificateVersion";
  private ViewUserInfo =
    environment.rootPathApi +
    "view/View_caseworkeruserorganizationcodeapi/UserName?UserName";
  private applicationdelete = environment.rootPathApi + "aplication/";
  propertyLookupbyid = environment.rootPath2+'ProprtyData/procProportyTypeLockup/'
  getWithdrawpropose1 = environment.rootPathApi+'view/View_Withdraw_propose'
  PropertyDynamicDataCollectionTransactionByProperty = environment.rootPathApi+'proc_Con_Review_TransactionDetail/proc_ConReviewTransactionDetail/'
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
  DisableFormb: boolean;
  Parcel_ID:any;
  taskid: string;
  coordinate: any[] = [];
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
  coordinateForwgs84: any;
  isconfirmsave: boolean;
  allLicenceData: any;
  totalsizeformerage = 0;
  isagriculture: boolean = false;
  isRecordDocumentationManager: boolean;
  docId;
  currentApplicationUsers: any;
  currentsdpid: any;
  licenceData: any;
  isFreeHold: boolean;
  selectedplotid: any;
  fornewplotinsert: any;
  freeholdsize: any;
  leaseOwnerShip: LeaseOwnerShip;
  isfreeholdselected: boolean;
  serviceisundoumneted: boolean = false;
  currentcertID: any;
  LicenceserviceID: any;
  fileexxcedlimit: boolean = false;
  polygonAreaname: any;
  polygonAreanameFrehold: any;
  coordinatetemp: any;
  RequerdDocspre: any;
  backbuttonviable: boolean;
  appnoForRecord: any;
  ishavespashal: boolean=true;
  itcanntupdate: boolean=false;
  Licence_Service_ID: any;
  recordno: any;
  errorservices: any;
  appnoForRecorderror: any;
  salesFrominformat: boolean=false
  sellerCustomerId: string;
  currentproprtyID: any;
  propertyTypeid: any;
  propertyid: any;
  disable: any;
  tskID: any;
  constructor(private http: HttpClient, private cookieService: CookieService) {}
  getdbstatus(orgid) {
    return this.http.get(this.dbstatus + "GetDBServerStatus?orgid=" + orgid);
  }
  public PropertyManagmentUrlapi =
    environment.rootPathApi + "Property_Registration/procProperty_Registration"; // URL to web api
  multipleplotcanbeadd = environment.multipleplotcanbeadd;
  propertytaskslist = environment.propertytasks;
  Add(data) {
    return this.http.post<any[]>(this.PropertyManagmentUrlapi, data);
  }
  getViewAspNetUsersWorkInfoDetaill(data) {
    // User_ID = this.removeSlash(User_ID);
    return this.http.get<any>(
      this.ViewAspNetUsersWorkInfoDetaill +
        "/application_number?application_number=" +
        data
    );
  }
  postapplicationdelete(data) {
    // User_ID = this.removeSlash(User_ID);
    return this.http.get<any>(this.applicationdelete + data);
  }
  setCookies(area: number) {
    // Setting cookies using cookieService
    if (this.isfreeholdselected) {
      //localStorage.setItem("PolygonAreanameFrehold", "" + area.toFixed(2));
      this.cookieService.set("PolygonAreanameFrehold", "" + area.toFixed(2));
      this.getCookies();
    } else {
      //ocalStorage.setItem("PolygonAreaname", "" + area.toFixed(2));
      this.cookieService.set("PolygonAreaname", "" + area.toFixed(2));
      this.getCookies();
    }
  }
  getUserInfoByUserName(userName) {
    return this.http.get<any>(this.ViewUserInfo + "=" + userName);
  }
  getCookies() {
    // Getting cookie values using cookieService
    this.polygonAreaname =
      parseFloat(this.cookieService.get("PolygonAreaname")) || 0;
    this.polygonAreanameFrehold =
      parseFloat(this.cookieService.get("PolygonAreanameFrehold")) || 0;

    // Use the retrieved values as needed
    console.log("PolygonAreaname:", this.polygonAreaname);
    console.log("PolygonAreanameFrehold:", this.polygonAreanameFrehold);
  }

  getCustomerLookUP() {
    return this.http.get(
      this.CustomerLookUP +
        "?" +
        "sortOrder=test&currentFilter&searchString&pageIndex&pageSize"
    );
  }
  GetSuperviedUsers() {
    return this.http.get(
      this.GetSuperviedUsersUrl + "?username=" + environment.username
    );
  }
  GetApplicationNumberByUser(username) {
    return this.http.get(
      this.GetApplicationNumberByUserURLs + "?UserName=" + username
    );
  }
  GetApplicationNumberByUserapi(username) {
    return this.http.get(
      this.GetApplicationNumberByUserURLsapi + "?UserName=" + username
    );
  }
  getPropertyTypeId() {
    console.log(' return this.propertyTypeid: ',this.propertyTypeid);
    return this.propertyTypeid
  }
  getPropertyTypeForm(data) {
    return this.http.get(this.propertyLookupbyid + data)
  }
  getWithdrawpropose() {
   return this.http.get(this.getWithdrawpropose1)
  }
  getWithdrawproposebyid(titdeed,cid) {
    return this.http.get(this.getWithdrawpropose1+"/"+titdeed+"/"+cid)
   }
  addwithprop(data){
    return this.http.post(this.withdrawprop,data)
  }
  updatewithprop(data){
    return this.http.put(this.withdrawprop,data)
  }
  getwithpropbyId(cid,titdeed) {
   return this.http.get<any[]>(
      this.getwithpropbyId1 +
        "customer_ID=" +
        cid +
        "&Title_Deed_No=" +
        titdeed
    );
  }
  getPropertyStaticForm() {
    return this.http.get(this.staticProperty)
  }
  getPropertyId() {
    return this.propertyid
  }
  savePropertyStaticForm(data: any) {
    return this.http.post(this.staticProperty,data)
  }

  getTasks(data) {
    return this.http.get(this.Tasks + "?ServiceCode=" + data);
  }
  getDocumentArc() {
    return this.http.get(this.DocumentArc);
  }
  getDocumentArcbyid(RID) {
    const url = `${this.DocumentArc}/${RID}`;
    return this.http.get(url);
  }
  getDocIdByAppNo(AppNo) {
    return this.http.get(this.DocByAppNo + AppNo);
  }
  get_payment_plan(lease_code) {
    return this.http.get(this.get_payment_plan1 + lease_code);
  }
  getDeedByApp(AppNo) {
    return this.http.get(
      this.DeedByAPP + "Application_No?Application_No=" + AppNo
    );
  }
  getDeedByCustId(CustId) {
    return this.http.get(this.DeedByCustId + "?Customer_ID=" + CustId);
  }
  getAppbyUserid(UserId ,appno) {
    return this.http.get(this.AppbyUserId + UserId +'/'+appno);
  }
  getaspnetuser() {
    return this.http.get(this.userbyusername + environment.username);
  }
  getLicenceService(AppNo) {
    return this.http.get<any[]>(
      this.License_ServiceURL +
        "?" +
        "sortOrder=test&currentFilter=" +
        AppNo +
        "&searchString&pageIndex&pageSize"
    );
  }
  getCustomerByColsp(col) {
    return this.http.get(this.CustomerByColumn + col).toPromise();
  }

  getDocIdByAppNop(AppNo) {
    return this.http.get(this.DocByAppNo + AppNo).toPromise();
  }

  getAppbyUseridp(UserId) {
    return this.http.get(this.AppbyUserId + UserId).toPromise();
  }

  getuserNamep(Appno) {
    return this.http.get(this.getusernameUrl + Appno).toPromise();
  }
  saveRecord(data) {
    console.log("logggggg1", data);

    return this.http.post(
      this.Save_License_Service +
        "?ApplicationNo=" +
        data.appno +
        "&ServiceCode=" +
        data.selectedService +
        "&applicationDate=" +
        data.date +
        "&SDP=" +
        data.SDP +
        "&TitleDeedNo=" +
        data.Deed +
        "&Woredaid=" +
        data.Woreda +
        "&ploteNo=" +
        data.FullName_AM,
      null
    );
  }
  deletedoc() {
    return this.http.delete(this.Remove_Document);
  }

  getorg() {
    return this.http.get(this.All_Org);
  }
  getreqdoc() {
    return this.http.get(this.Requirement_Documents);
  }
  postdocfortask(data) {
    return this.http.post(this.save_Documentoftask, data);
  }
  gettask(serviceCode: string) {
    const url = `${this.Task_Service}?ServiceCode=${encodeURIComponent(
      serviceCode
    )}`;
    return this.http.get(url);
  }
  getservice() {
    return this.http.get(this.All_Service);
  }
  getserviceapi() {
    return this.http.get(this.All_Serviceapi);
  }
  getUsernme(data) {
    return this.http.get(this.Username + "UserName?UserName=" + data);
  }
  getByCustomerId(data) {
    return this.http.get(this.CustomerId + "Customer_ID?Customer_ID=" + data);
  }
  getQRcode(data) {
    return this.http.get(this.QRcode + "?data=" + data);
  }
  getCustomerByCols(col) {
    return this.http.get(this.CustomerByColumn + col);
  }
  getworedabysubcity(col) {
    return this.http.get(this.woredabysubcity + "/" + col);
  }
  getuserName(Appno) {
    return this.http.get(this.getusernameUrl + Appno);
  }
  postplotTopostgres(plotid, propertid) {
    return this.http.get(
      this.gettopostgres + plotid + "/Proporty_Id?Proporty_Id=" + propertid
    );
  }
  GetApplicationNumberByUsers(username, orgcod,AppNo) {
    return this.http.get(
      this.GetApplicationNumberByUserURL + "/" + username + "/" + orgcod +"/"+AppNo
    );
  }
  GetApplicationNumberByprevious(Title_Deed_No, Useranem, orgcod) {
    return this.http.get(
      this.GetApplicationNumberBypreviousApplication +
        "/" +
        Title_Deed_No +
        "/" +
        Useranem +
        "/" +
        orgcod
    );
  }
  GetpreviousApplicationNumberByUsers(username, Parch_ID) {
    return this.http.get(
      this.GetpreviousApplicationNumberByUserURL + username + "/" + Parch_ID
    );
  }
  GetPlotValidationURL(Appno, serviceid) {
    return this.http.get(this.PlotValidationURL + Appno + "/" + serviceid);
  }
  GetProportyValidationURL(Appno) {
    return this.http.get(this.ProportyValidationURL + Appno);
  }
  GetProportyValidationbyURL(Appno) {
    return this.http.get(this.ProportyValidationbyURL + Appno);
  }
  GetCertficate_ver_Validation(Appno, serviceid) {
    return this.http.get(
      this.Certficate_ver_ValidationURL + Appno + "/" + serviceid
    );
  }
  GetApplicationNumberByUserInfo(appno) {
    return this.http.get(this.APIForMoreOptionGetCustmerInformationURL + appno);
  }
  GetView_ForApicheckcertificateVersion(plot_ID) {
    return this.http.get(
      this.View_ForApicheckcertificateVersionController + "/" + plot_ID
    );
  }
  GetView_ForApicheckcertificateVersionbyproperty(propertyID) {
    return this.http.get(
      this.View_ForApicheckcertificateVersionController +
        "/propertyID/" +
        propertyID
    );
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
  getPostit_user(appno) {
    // User_ID = this.removeSlash(User_ID);
    return this.http.get<any>(this.Postit_user + "=" + appno);
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
  GetProperty_use_lookup() {
    return this.http.get(this.View_propertyUse);
  }

  UpdateLicence(LicenceData) {
    return this.http.put(this.License_Service, LicenceData);
  }

  getLicencebyid(LicenceData) {
    return this.http.get(this.License_Service + "/" + LicenceData);
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
        noteid +
        "&Msg=" +
        Msg,

      null
    );
  }
  // addNote(ApplicationNumber, Msg, noteid) {
  //   return this.http.post(
  //     this.AddNoteURL +
  //       "?Application_number=" +
  //       ApplicationNumber +
  //       "&uid=" +
  //       environment.username +
  //       "&Msg=" +
  //       Msg +
  //       "&postitid=" +
  //       noteid,
  //     null
  //   );
  // }
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

  sendNoteApi(msg, AppNo, postit_note_code, todoid, orgid) {
    return this.http.get(
      this.SendNoteURLapi +
        orgid +
        "/" +
        postit_note_code +
        "/" +
        todoid +
        "/" +
        AppNo +
        "/" +
        msg
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
  getcaseWorkerbyApplication(AppNo) {
    return this.http.get(
      environment.rootPathApi +
        "view/procView_Certficate_Verstion_Approved_by_caseworkerController/application_number?application_number=" +
        AppNo
    );
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
  UpdateCustomerAPI(data) {
    return this.http.post(this.saveCustomerdataapi, data);
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
  get_constraction_level() {
    return this.http.get(this.get_constraction_level1 );
  }
  getcustomerPdfCompressor(col) {
    return this.http.post(this.PdfCompressor, col);
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
        "/"  +
        CertefcateCode 
        
    );
  }
  // getDocmentArcive(CertefcateCode) {
  //   return this.http.get(
  //     this.UpdateCertURL +
  //       "?" +
  //       "sortOrder=test&currentFilter=" +
  //       CertefcateCode +
  //       "&searchString&pageIndex&pageSize"
  //   );
  // }

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
  getAllDocuments(ApplicationCode, DocID) {
    console.log("ApplicationCode, DocID", ApplicationCode, DocID);

    return this.http.get<any[]>(
      this.getAllDocumentURLs +
        "application_code=" +
        ApplicationCode +
        "&application_detail_id=" +
        DocID
    );
  }
  getAllDocumentt(DocID) {
    console.log("ApplicationCode, DocID", DocID);

    return this.http.get<any[]>(
      environment.rootPathApi +
        "view/Vw_AllDocuments/application_number/doc/doc/document_code/document_code?document_code=" +
        DocID
    );
  }
  getPropertyDynamicDataCollectionTransactionByTransId(id) {
    return this.http.get(this.PropertyDynamicDataCollectionTransactionByProperty + id)
  }
  updatePropertyDynamicDataCollectionTransactionByTransId(data) {
    return this.http.put(this.PropertyDynamicDataCollectionTransactionByProperty, data)
  }
  getDocumentbytaskssURL(ApplicationCode, DocID, taskid) {
    console.log("ApplicationCode, DocID", ApplicationCode, DocID, taskid);

    return this.http.get<any[]>(
      this.getDocumentbytasksURL +
        "?task_code=" +
        taskid +
        "&applications_application_code=" +
        ApplicationCode +
        "&application_detail_id=" +
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
        "sortOrder=test&currentFilter&searchString&pageIndex&pageSize=100"
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
  killtodo(appno, eid, todoid, usename, status) {
    return this.http.post(
      this.SaveDataURLkill +
        "?ApplicationNO=" +
        appno +
        "&eid=" +
        eid +
        "&todoid=" +
        todoid +
        "&userName=" +
        usename +
        "&status=" +
        status,
      null
    );
  }
  Reopentodo(appno, eid, todoid, usename, status) {
    return this.http.post(
      this.SaveDataURLreopen +
        "?ApplicationNO=" +
        appno +
        "&eid=" +
        eid +
        "&todoid=" +
        todoid +
        "&userName=" +
        usename +
        "&status=" +
        status,
      null
    );
  }

  GetForm(docid) {
    return this.http.get(this.GetDataURL + "?docid=" + docid);
  }

  getFormData(formcode) {
    if (!environment.production) {
      return this.http.get<any>(environment.formPath + formcode + ".json");
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
  getcustcompress(aa) {
    return this.http.get(this.customerUrl + aa);
  }
  getcustomerbycusid(custID) {
    return this.http.get(this.customerUrl + "/" + custID);
  }
  disableBrowserBackButton() {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
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


