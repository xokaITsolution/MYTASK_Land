import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ServiceComponent } from "../service.component";
import { PropertyRegisterService } from "./property-register.service";
import { NotificationsService } from "angular2-notifications";
import { PropertyComponent } from "../property/property.component";
import { DomSanitizer } from "@angular/platform-browser";
import { ConfirmationService } from "primeng/api";
import { NgxSmartModalService } from "ngx-smart-modal";
import { ServiceService } from "../service.service";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ActivatedRoute } from "@angular/router";
import { PlatformLocation } from "../plot-managment/plot-managment.component";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-property-register",
  templateUrl: "./property-register.component.html",
  styleUrls: ["./property-register.component.css"],
})
export class PropertyRegisterComponent implements OnInit, OnChanges {
  @Output() completed = new EventEmitter();
  @Output() completeddel = new EventEmitter();

  public propertyRegister: PropertyRegister;
  public propformLocation: PropformLocation;
  @Input() selectedpro;
  @Input() disable;
  @Input() LicenceData;
  pictoShow: any;
  isnew = true;
  Saved = false;
  PropertyList: any;
  isproplocnew: boolean = false;
  proploc: any;
  language: string;
  plotloc: any;
  urlParams: any;
  PropertyTypeLookUP: any;
  CustomerLookUP: any;
  //platformLocation: PlatformLocation;
  geo: any;
  combineArray: [];
  convertedCoordinates: any = [];

  isconfirmsave: boolean;
  msgs: string;
  totlaizeproportinal: number = 0;
  isMinimized: boolean;
  isMaximized: boolean;
  ismodaEnable: boolean;
  maxWidth: string = "1400px";
  isbuildingApartama: boolean;
  proprty_Use_lookup: Object;
  maxheight: string;
  messagefortoast: string;
  isconfirmsaveplot: boolean;
  plan_Document: any;
  picture_North: any;
  picture_East: any;
  picture_South: any;
  picture_West: any;
  proploceach: any;
  ishavespashal: boolean = false;
  technicaluser: any;
  isbuilding: boolean;
  constructor(
    public serviceService: ServiceService,
    public serviceComponent: ServiceComponent,
    private routerService: ActivatedRoute,
    public propertyRegisterService: PropertyRegisterService,
    private notificationsService: NotificationsService,
    public propertyComponent: PropertyComponent,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private ngxSmartModalService: NgxSmartModalService,
    private confirmationService: ConfirmationService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    this.propertyRegister = new PropertyRegister();
    this.propformLocation = new PropformLocation();
  }
  changingValue: Subject<any> = new Subject();

  tellChild(aa) {
    // console.log("🚀 ~ PropertyRegisterComponent ~ tellChild ~ aa:", aa);
    if (aa[0].length > 1) {
      this.convertedCoordinates.push(aa);
      this.geo = this.convertedCoordinates;
      // console.log("value is changingg", this.geo);
      this.serviceService.check = false;
      this.changingValue.next(aa);
    }
  }
  combineDeeplyNestedArray(arr: any[]) {
    const mappedArray = arr.map((innerArray) => {
      // Perform your mapping logic here
      return {
        northing: innerArray[0],
        easting: innerArray[1],
        hemisphere: innerArray[2],
        zone: innerArray[3],
      };
    });
    return mappedArray;
  }
  async ngOnChanges() {
    // debugger
    this.routerService.params.subscribe((params) => {
      this.urlParams = params;
    });
    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
    this.pictoShow = null;
    console.log("chang detected");
    if (this.selectedpro !== undefined && this.selectedpro !== null) {
      this.propertyRegister = new PropertyRegister();
      this.propertyRegister = this.selectedpro;
      this.propertyRegister.plot_ID = this.selectedpro.plot_ID;
      this.propertyRegister.property_Parent_ID =
        this.selectedpro.property_Parent_ID;
      this.serviceService.insertedProperty = this.selectedpro.property_ID; 
      this.technicaluser=this.propertyRegister.application_No
      console.log("selectedddd", this.selectedpro);
      //
      //this.getplotlocbyid(this.propertyRegister.plot_ID);
      this.getproplocbyid(this.propertyRegister.plot_ID);
    }

    // if (this.LicenceData !== undefined && this.LicenceData !== null) {
    //   if (!this.propertyRegister.property_ID) {
    //     this.propertyRegister.property_ID = this.LicenceData.Property_ID;
      
    //   }
    // }
    if (this.propertyRegister.registration_Date) {
      if (this.language != "amharic") {
        this.propertyRegister.registration_Date =
          this.propertyRegister.registration_Date.split("T")[0];
      } else {
        this.propertyRegister.registration_Date =
          await this.getgregorianToEthiopianDate(
            this.propertyRegister.registration_Date
          );
      }
    }

    if (this.propertyRegister.map_Floor_Plan) {
      this.pictoShow =
        "data:image/jpg;base64, " + this.propertyRegister.map_Floor_Plan;
      this.pictoShow = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.pictoShow
      );
    }

    if (!this.selectedpro.property_ID) {
      this.isnew = false;
    } else {
      this.isnew = true;
      //this.getproploc(this.propertyRegister.property_ID);
    }
  }


  ngOnInit() {
    this.routerService.params.subscribe((params) => {
      this.urlParams = params;
    });
    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
    console.log("is new :: ", this.isnew);
    console.log("is disable :: ", this.disable);
    this.GetpropertyUselookup();
  }

  selectedDateTime(dates: any, selecter) {
    if (selecter == 1) {
      this.propertyRegister.registration_Date =
        dates[0]._day + "/" + dates[0]._month + "/" + dates[0]._year;

      console.log(this.propertyRegister.registration_Date);
    }
  }
  async getEthiopianToGregorian(date) {
    if (date) {
      var datenow = await this.serviceService
        .getEthiopianToGregorian(date)
        .toPromise();
      console.log(datenow);
      return datenow.nowTime;
    }
  }
  async getgregorianToEthiopianDate(date) {
    if (date != "0001-01-01T00:00:00") {
      var datenow = await this.serviceService
        .getgregorianToEthiopianDate(date)
        .toPromise();
      console.log(datenow);
      return datenow.nowTime;
    }
  }
  GetpropertyUselookup() {
    this.serviceService.GetProperty_use_lookup().subscribe(
      (res) => {
        this.proprty_Use_lookup = res;

        console.log("Plot_Land_Grade_lookup", this.proprty_Use_lookup);
      },
      (error) => {
        console.log("error");
      }
    );
  }
  checkplothavecertificet() {
    this.serviceService
      .GetView_ForApicheckcertificateVersionbyproperty(
        this.propertyRegister.property_ID
      )
      .subscribe((rec: any) => {
        console.log("🚀 ~ .subscribe ~ rec:", rec);

        if (rec.length > 0) {
          this.messagefortoast = `The property with ID ${rec[0].property_ID} currently has an active map certificate version identified by the title deed number ${rec[0].title_Deed_No}. Would you like to deactivate the map certificate version? Upon clicking 'Yes,' the map will be deactivated.`;

          this.isconfirmsaveplot = true;
        } else {
          this.save();
          this.isconfirmsaveplot = false;
        }
      });
  }
  async save() {
    this.serviceService.getUserRole().subscribe(async (response: any) => {
      console.log("responseresponseresponse", response, response[0].RoleId);
      this.propertyRegister.updated_By = response[0].UserId;
    if (this.serviceService.Licence_Service_ID != this.serviceService.LicenceserviceID){
      this.serviceService
      .GetProportyValidationbyURL(this.serviceService.LicenceserviceID)
      .subscribe(async (message:any) => {
       
        if (message.Message == "1" || this.serviceService.Service_ID ==='81F8770B-2C1E-4255-8BE1-341089703FA1'.toLocaleLowerCase() ) {
            if (this.propertyRegister.property_Parent_ID == 0) {
              this.serviceService.ishavespashal = true;
            }
            if (
              parseInt(this.propertyRegister.property_Type_ID) == 2 &&
              parseInt(this.propertyRegister.property_Parent_ID) == 0
            ) {
              const toastt = this.notificationsService.warn(
                "Please note that you cannot add የጋራ መኖርያ ቤቶች/Appartments/Condominiums without first adding a parent building. Kindly ensure that you add the building details before proceeding with adding the apartments"
              );
              return;
            }
            if (this.serviceService.isproportinal == true) {
              let totalsize =
                parseInt(this.propertyRegister.building_Size_M2) +
                // parseInt(this.propertyRegister.proportional_from_Compound_Size) +
                // parseInt(this.propertyRegister.parking_Area_M2) +
                parseInt(this.propertyRegister.size_In_Proportional);
              console.log("totalsize", totalsize);
        
              this.serviceService
                .getPropertyLists(this.propertyRegister.plot_ID)
                .subscribe(async (PropertyList: any) => {
                  let propertylst = PropertyList.procProperty_Registrations;
                  console.log("propertylst", propertylst);
                  if (propertylst.length > 0) {
                    propertylst.forEach((element) => {
                      if (element.property_ID != "No Parent") {
                        if (element.property_ID != this.propertyRegister.property_ID) {
                          let totalsize =
                            parseInt(element.building_Size_M2) +
                            // parseInt(element.proportional_from_Compound_Size) +
                            // parseInt(element.parking_Area_M2) +
                            parseInt(element.size_In_Proportional);
                          this.totlaizeproportinal += totalsize;
                        }
                      }
                    });
                    this.totlaizeproportinal =
                      parseInt(this.serviceService.Plot_Size_M2) -
                      this.totlaizeproportinal;
                  } else {
                    this.totlaizeproportinal = parseInt(
                      this.serviceService.Plot_Size_M2
                    );
                  }
        
                  console.log(
                    "this.totlaizeproportinal",
                    this.totlaizeproportinal,
                    this.serviceService.Plot_Size_M2
                  );
                  if (this.totlaizeproportinal < totalsize) {
                    const toast = this.notificationsService.error(
                      "error",
                      "total Compound Size remain is" + this.totlaizeproportinal + "M2"
                    );
        
                    return;
                  } else {
                    const prop = { ...this.propertyRegister };
        
                    // Exclude the 'parent' property
                    if ("parent" in prop) {
                      delete prop.parent;
                    }
                    if (prop.children) {
                      prop.children = null;
                    }
                    if (prop.parent) {
                      if (prop.parent.children) {
                        prop.parent.children = null;
                      }
                    }
                    if (prop.property_Parent_ID == "No Parent") {
                      prop.property_Parent_ID = "0";
                    }
                    if (this.language == "amharic") {
                      prop.registration_Date = await this.getEthiopianToGregorian(
                        prop.registration_Date
                      );
                    }
                    console.log("saveing....", prop);
                    this.propertyRegisterService.save(prop).subscribe(
                      (property) => {
                        console.log("property", property);
                        this.getPropertyList(prop.plot_ID);
                        if (!this.Saved) {
                          this.completed.emit(prop);
                          this.Saved = true;
                        }
                        this.serviceService.frompropertyUpdate = true;
        
                        const toast =
                          this.notificationsService.success("Sucess updated");
                      },
                      (error) => {
                        console.log(error);
        
                        const toast = this.notificationsService.error(
                          "Error",
                          error.error
                        );
                      }
                    );
                    console.log("saveing....");
                  }
                });
            } else {
              const prop = { ...this.propertyRegister };
        
              // Exclude the 'parent' property
              if ("parent" in prop) {
                delete prop.parent;
              }
              if (prop.children) {
                prop.children = null;
              }
              if (prop.parent) {
                if (prop.parent.children) {
                  prop.parent.children = null;
                }
              }
              if (prop.property_Parent_ID == "No Parent") {
                prop.property_Parent_ID = "0";
              }
              if (this.language == "amharic") {
                prop.registration_Date = await this.getEthiopianToGregorian(
                  prop.registration_Date
                );
              }
              console.log("saveing....", prop);
              this.propertyRegisterService.save(prop).subscribe(
                (property) => {
                  console.log("property", property);
                  //this.getPropertyList(prop.plot_ID);
                  if (!this.Saved) {
                    this.completed.emit(prop);
                    this.Saved = true;
                  }
                  this.serviceService.frompropertyUpdate = true;
        
                  const toast = this.notificationsService.success("Sucess updated");
                },
                (error) => {
                  console.log(error);
        
                  const toast = this.notificationsService.error("Error", error.error);
                }
              );
              console.log("saveing....");
            }
            
          
        } else {
          const toast = this.notificationsService.error("Error", message.Message);
        }
        return
      });
     
     
    }else{

    
    if (this.propertyRegister.property_Parent_ID == 0) {
      this.serviceService.ishavespashal = true;
    }
    if (
      parseInt(this.propertyRegister.property_Type_ID) == 2 &&
      parseInt(this.propertyRegister.property_Parent_ID) == 0
    ) {
      const toastt = this.notificationsService.warn(
        "Please note that you cannot add የጋራ መኖርያ ቤቶች/Appartments/Condominiums without first adding a parent building. Kindly ensure that you add the building details before proceeding with adding the apartments"
      );
      return;
    }
    if (this.serviceService.isproportinal == true) {
      let totalsize =
        parseInt(this.propertyRegister.building_Size_M2) +
        // parseInt(this.propertyRegister.proportional_from_Compound_Size) +
        // parseInt(this.propertyRegister.parking_Area_M2) +
        parseInt(this.propertyRegister.size_In_Proportional);
      console.log("totalsize", totalsize);

      this.serviceService
        .getPropertyLists(this.propertyRegister.plot_ID)
        .subscribe(async (PropertyList: any) => {
          let propertylst = PropertyList.procProperty_Registrations;
          console.log("propertylst", propertylst);
          if (propertylst.length > 0) {
            propertylst.forEach((element) => {
              if (element.property_ID != "No Parent") {
                if (element.property_ID != this.propertyRegister.property_ID) {
                  let totalsize =
                    parseInt(element.building_Size_M2) +
                    // parseInt(element.proportional_from_Compound_Size) +
                    // parseInt(element.parking_Area_M2) +
                    parseInt(element.size_In_Proportional);
                  this.totlaizeproportinal += totalsize;
                }
              }
            });
            this.totlaizeproportinal =
              parseInt(this.serviceService.Plot_Size_M2) -
              this.totlaizeproportinal;
          } else {
            this.totlaizeproportinal = parseInt(
              this.serviceService.Plot_Size_M2
            );
          }

          console.log(
            "this.totlaizeproportinal",
            this.totlaizeproportinal,
            this.serviceService.Plot_Size_M2
          );
          if (this.totlaizeproportinal < totalsize) {
            const toast = this.notificationsService.error(
              "error",
              "total Compound Size remain is" + this.totlaizeproportinal + "M2"
            );

            return;
          } else {
            const prop = { ...this.propertyRegister };

            // Exclude the 'parent' property
            if ("parent" in prop) {
              delete prop.parent;
            }
            if (prop.children) {
              prop.children = null;
            }
            if (prop.parent) {
              if (prop.parent.children) {
                prop.parent.children = null;
              }
            }
            if (prop.property_Parent_ID == "No Parent") {
              prop.property_Parent_ID = "0";
            }
            if (this.language == "amharic") {
              prop.registration_Date = await this.getEthiopianToGregorian(
                prop.registration_Date
              );
            }
            console.log("saveing....", prop);
            this.propertyRegisterService.save(prop).subscribe(
              (property) => {
                console.log("property", property);
                this.getPropertyList(prop.plot_ID);
                if (!this.Saved) {
                  this.completed.emit(prop);
                  this.Saved = true;
                }
                this.serviceService.frompropertyUpdate = true;

                const toast =
                  this.notificationsService.success("Sucess updated");
              },
              (error) => {
                console.log(error);

                const toast = this.notificationsService.error(
                  "Error",
                  error.error
                );
              }
            );
            console.log("saveing....");
          }
        });
    } else {
      const prop = { ...this.propertyRegister };

      // Exclude the 'parent' property
      if ("parent" in prop) {
        delete prop.parent;
      }
      if (prop.children) {
        prop.children = null;
      }
      if (prop.parent) {
        if (prop.parent.children) {
          prop.parent.children = null;
        }
      }
      if (prop.property_Parent_ID == "No Parent") {
        prop.property_Parent_ID = "0";
      }
      if (this.language == "amharic") {
        prop.registration_Date = await this.getEthiopianToGregorian(
          prop.registration_Date
        );
      }
      console.log("saveing....", prop);
      this.propertyRegisterService.save(prop).subscribe(
        (property) => {
          console.log("property", property);
          //this.getPropertyList(prop.plot_ID);
          if (!this.Saved) {
            this.completed.emit(prop);
            this.Saved = true;
          }
          this.serviceService.frompropertyUpdate = true;

          const toast = this.notificationsService.success("Sucess updated");
        },
        (error) => {
          console.log(error);

          const toast = this.notificationsService.error("Error", error.error);
        }
      );
      console.log("saveing....");
    }
    
  }
})
  }
  modalRef: BsModalRef;
  openModall(template: TemplateRef<any>) {
    this.ismodaEnable = true;
    // this.modalRef = this.modalService.show(
    //   template,
    //   Object.assign({}, { class: "gray modal-lg" })
    // );
  }
  onOptionsSelected(e) {
    console.log(
      "🚀 ~ file: property-register.component.ts:358 ~ onOptionsSelected ~ e:",
      e
    );
    if (e == 2  || e ==1016) {
      this.isbuildingApartama = true;
      this.isbuilding=true
    }else if(e == 3){
      this.isbuilding=true
      this.isbuildingApartama = false;
    } else {
      this.isbuildingApartama = false;
    }
  }
  onOptionsSelecteds(e) {
    console.log(
      "🚀 ~ file: property-register.component.ts:358 ~ onOptionsSelecteds ~ e:",
      e
    );
    if (e == 5) {
      this.serviceService.isagriculture = true;

      this.propertyRegister.proportional_from_Compound_Size = 0;
      this.propertyRegister.parking_Area_M2 = 0;

      this.propertyRegister.property_Status_ID = 1;
      this.propertyRegister.property_Type_ID = 1014;

      this.propertyRegister.description = "የእርሻ ይዞታ አገልግሎት/For Agriculture";
      this.propertyRegister.registration_Date = new Date();
    } else {
      this.serviceService.isagriculture = false;
    }
  }
  // getplotlocbyid(Plot_ID) {
  //   this.serviceService.getPlotloc(Plot_ID).subscribe((response: any) => {
  //     this.plotloc = response.procPlot_Locations;
  //     if (this.plotloc.length > 0) {
  //       this.platformLocation = this.plotloc[0];
  //       console.log(this.plotloc[0]);

  //       this.convertPolygonCoordinates(
  //         this.plotloc[0].geowithzone,
  //         this.plotloc[0]
  //       );
  //       this.serviceService.fromPropoperty = true;
  //       console.log("plotloc:", this.plotloc, this.plotloc[0].geowithzone);
  //       //this.isplotllocnew = true;
  //     } else {
  //       this.platformLocation = new PlatformLocation();
  //       //this.isplotllocnew = false;
  //     }
  //   });
  // }
  // convertPolygonCoordinates(polygonString: string): any[] {
  //   const coordinates = polygonString.match(/([\d.]+\s[\d.]+\s\w\s\d+)/g);

  //   const result = [];

  //   if (coordinates) {
  //     for (const coord of coordinates) {
  //       console.log("coordcoordcoord", coord);

  //       const [easting, northing, hemisphere, zone] = coord.split(" ");

  //       result.push({
  //         northing: northing,
  //         easting: easting,
  //         hemisphere: hemisphere,
  //         zone: zone,
  //       });
  //     }
  //   }
  //   console.log("result", result);
  //   this.convertCoordinates(result);

  //   return result;
  // }
  // convertCoordinates(data) {
  //   const convertedCoordinates = [];
  //   // Convert UTM coordinates to the desired format
  //   convertedCoordinates.push(["northing", "easting", "hemisphere", "zone"]);

  //   for (const coord of data) {
  //     convertedCoordinates.push([
  //       coord.northing,
  //       coord.easting,
  //       coord.hemisphere,
  //       coord.zone,
  //     ]);
  //   }
  //   this.tellChild(convertedCoordinates);
  //   console.log(
  //     "convertedCconvertedCoordinatesoordinates",
  //     convertedCoordinates
  //   );
  // }

  closeModall() {
    // console.log('closeing.....');
    this.modalRef.hide();
  }
  Delete() {
    this.confirmationService.confirm({
      message: "Are you sure u want to delete this Property?",
      accept: () => {
        this.propertyRegister.is_Deleted = true;
        const prop = Object.assign({}, this.propertyRegister);
        if (prop.children) {
          prop.children = null;
        }
        if (prop.parent) {
          if (prop.parent.children) {
            prop.parent.children = null;
          }
        }
        console.log("saveing....", prop);
        this.propertyRegisterService.save(prop).subscribe(
          (property) => {
            console.log("property", property);
            this.getPropertyList(prop.plot_ID);
            const toast = this.notificationsService.success("Sucess", property);
            if (!this.Saved) {
              this.completed.emit(prop);
              this.Saved = true;
            }
          },
          (error) => {
            console.log(error);
            if (error.status == "400") {
              const toast = this.notificationsService.error(
                "Error",
                error.error.InnerException.Errors[0].message
              );
            } else {
              const toast = this.notificationsService.error(
                "Error",
                "SomeThing Went Wrong"
              );
            }
          }
        );
        console.log("saveing....");
      },
    });
  }
  getPropertyList(Plot_ID) {
    this.serviceService.getPropertyLists(Plot_ID).subscribe(
      (PropertyList: any) => {
        this.PropertyList = PropertyList.procProperty_Registrations;
        this.PropertyList = Object.assign([], this.PropertyList);
        let currentpro = this.PropertyList.filter(
          (x) => x.property_ID === this.serviceService.insertedProperty
        );
        this.completed.emit(currentpro[0]);
        console.log("PropertyList", PropertyList);
        this.PropertyList.push({ property_ID: "No Parent" });
        //this.getTree(Object.assign([], this.PropertyList));
        // this.novalidprops = this.PropertyList.length;
        // this.isvalidated();
      },
      (error) => {
        console.log("error");
      }
    );
  }
  async getTree(PropertyList) {
    this.serviceService.files = [];

    const addLevelToNode = (node, level) => {
      node.level = level;

      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          addLevelToNode(child, level + 1);
        });
      }
    };

    for (let i = 0; i < PropertyList.length; i++) {
      let a;

      if (
        PropertyList[i].property_Parent_ID == null ||
        PropertyList[i].property_Parent_ID == 0
      ) {
        a = { ...PropertyList[i] };
        a.label = a.property_ID;
        a.children = [];
        a.level = 0;

        const l1 = [...PropertyList];

        for (let j = 0; j < l1.length; j++) {
          let b;

          if (l1[j].property_Parent_ID == a.property_ID) {
            b = { ...l1[j] };
            b.label = b.property_ID;
            b.children = [];
            b.level = 1;
            a.children.push(b);

            const l2 = [...PropertyList];

            for (let k = 0; k < l2.length; k++) {
              let c;

              if (l2[k].property_Parent_ID == b.property_ID) {
                c = { ...l2[k] };
                c.label = c.property_ID;
                c.children = [];
                c.level = 2;
                b.children.push(c);
              }
            }
          }
        }

        addLevelToNode(a, 0);
        this.serviceService.files.push(a);
      }
    }

    const selectedChild = this.expandAndSelectChild(
      this.serviceService.files,
      this.serviceService.insertedProperty
    );
    console.log("this.serviceService.files", this.serviceService.files);
  }

  expandAndSelectChild(tree, targetPropertyID) {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].property_ID === targetPropertyID) {
        // Found the element with the specified property_ID
        tree[i].expanded = true; // Expand the node
        return tree[i];
      } else if (tree[i].children && tree[i].children.length > 0) {
        const result = this.expandAndSelectChild(
          tree[i].children,
          targetPropertyID
        );
        if (result) {
          tree[i].expanded = true; // Expand the parent node
          return result;
        }
      }
    }
    return null; // Element not found
  }
  findTreeElement(tree, targetPropertyID) {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].property_ID === targetPropertyID) {
        return tree[i]; // Found the element with the specified property_ID
      } else if (tree[i].children && tree[i].children.length > 0) {
        const result = this.findTreeElement(tree[i].children, targetPropertyID);
        if (result) {
          return result; // Found the element in a child node
        }
      }
    }
    return null; // Element not found
  }
  getPropertyTypeLookUP() {
    this.serviceService.getPropertyTypeLookUP().subscribe(
      (PropertyTypeLookUP) => {
        this.PropertyTypeLookUP = PropertyTypeLookUP;
        this.PropertyTypeLookUP = Object.assign(
          [],
          this.PropertyTypeLookUP.list
        );
        // console.log('PropertyTypeLookUP', PropertyTypeLookUP);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  async add() {
    this.serviceService.getUserRole().subscribe(async (response: any) => {
      console.log("responseresponseresponse", response, response[0].RoleId);
      this.propertyRegister.created_By = response[0].UserId;
  
    if (
      parseInt(this.propertyRegister.property_Type_ID) == 2 &&
      this.propertyRegister.property_Parent_ID == "No Parent"
    ) {
      const toastt = this.notificationsService.warn(
        "Please note that you cannot add የጋራ መኖርያ ቤቶች/Appartments/Condominiums without first adding a parent building. Kindly ensure that you add the building details before proceeding with adding the apartments"
      );
      return;
    }
    if (this.serviceService.isproportinal == true) {
      let totalsize =
        parseInt(this.propertyRegister.building_Size_M2) +
        parseInt(this.propertyRegister.proportional_from_Compound_Size);
      // parseInt(this.propertyRegister.parking_Area_M2) +
      //parseInt(this.propertyRegister.size_In_Proportional);
      console.log("totalsize", totalsize);

      this.serviceService
        .getPropertyLists(this.propertyRegister.plot_ID)
        .subscribe(async (PropertyList: any) => {
          let propertylst = PropertyList.procProperty_Registrations;
          console.log("propertylst", propertylst);
          if (propertylst.length > 0) {
            propertylst.forEach((element) => {
              if (element.property_ID != "No Parent") {
                let totalsize =
                  parseInt(element.building_Size_M2) +
                  parseInt(element.proportional_from_Compound_Size);
                // parseInt(element.parking_Area_M2) +
                //parseInt(element.size_In_Proportional);

                this.totlaizeproportinal += totalsize;
              }
            });
            this.totlaizeproportinal =
              parseInt(this.serviceService.Plot_Size_M2) -
              this.totlaizeproportinal;
          } else {
            this.totlaizeproportinal = parseInt(
              this.serviceService.Plot_Size_M2
            );
          }

          console.log(
            "this.totlaizeproportinal",
            this.totlaizeproportinal,
            this.serviceService.Plot_Size_M2
          );
          if (this.totlaizeproportinal < totalsize) {
            const toast = this.notificationsService.error(
              "error",
              "total Compound Size remain is" + this.totlaizeproportinal + "M2"
            );

            return;
          } else {
            const prop = Object.assign({}, this.propertyRegister);
            if (prop.children) {
              prop.children = null;
            }
            if (prop.parent) {
              if (prop.parent.children) {
                prop.parent.children = null;
              }
            }

            if (prop.property_Parent_ID == "No Parent") {
              prop.property_Parent_ID = "0";
            }
            if (this.language === "amharic") {
              prop.registration_Date = await this.getEthiopianToGregorian(
                prop.registration_Date
              );
            }
            prop.property_ID = "-1";
            this.propertyRegisterService.Add(prop).subscribe(
              (deptSuspension) => {
                console.log("deptSuspension", deptSuspension);

                // if (prop.map_Floor_Plan != null) {
                //   this.serviceService.isNextactive = true;
                // } else {
                //   this.serviceService.isNextactive = false;
                // }
                this.serviceService.insertedProperty =
                  deptSuspension[0].property_ID;

                this.isnew = true;
                if (!this.Saved) {
                  this.Saved = true;
                }
                this.getPropertyList(prop.plot_ID);

                if (prop.property_Parent_ID != "0") {
                  this.serviceService.hide = false;
                }
                const toast = this.notificationsService.success("Sucess");

                const toastt = this.notificationsService.warn(
                  "building or apartment with out minimum one title deed registration for property , you can't add sub property/ህንጻ ወይም አፓርትመንት ቢያንስ አንድ የንብረት ባለቤትነት ማረጋገጫ ለንብረት ምዝገባ, ንዑስ ንብረቱን ማከል አይችሉም"
                );
                //this.getproplocbyid(prop.plot_ID);

                // this.serviceService.disablefins = false;
                this.serviceService.propertyISEnable = true;

                console.log("added property registration");
              },
              (error) => {
                const toast = this.notificationsService.error(
                  "Error",
                  error.error
                );
              }
            );
            console.log("saveing....");
          }
        });
    } else {
      let totalsize =
        parseInt(this.propertyRegister.building_Size_M2) +
        parseInt(this.propertyRegister.proportional_from_Compound_Size);
      // parseInt(this.propertyRegister.parking_Area_M2) +
      //parseInt(this.propertyRegister.size_In_Proportional);
      console.log(parseInt(this.serviceService.Plot_Size_M2));

      if (
        parseInt(this.serviceService.Plot_Size_M2) !=
        parseInt(this.serviceService.Plot_Size_M2)
      ) {
        const toast = this.notificationsService.error(
          "error",
          "the sum of building_Size_M2 , proportional_from_Compound_Size  and parking_Area_M2 must be equle to " +
            this.serviceService.Plot_Size_M2 +
            "M2"
        );

        return;
      } else {
        const prop = Object.assign({}, this.propertyRegister);
        if (prop.children) {
          prop.children = null;
        }
        if (prop.parent) {
          if (prop.parent.children) {
            prop.parent.children = null;
          }
        }

        if (prop.property_Parent_ID == "No Parent") {
          prop.property_Parent_ID = "0";
        }
        if (this.language === "amharic") {
          prop.registration_Date = await this.getEthiopianToGregorian(
            prop.registration_Date
          );
        }
        prop.property_ID = "-1";
        this.propertyRegisterService.Add(prop).subscribe(
          (deptSuspension) => {
            console.log("deptSuspension", deptSuspension);
            // if (prop.map_Floor_Plan != null) {
            //   this.serviceService.isNextactive = true;
            // } else {
            //   this.serviceService.isNextactive = false;
            // }
            this.serviceService.insertedProperty =
              deptSuspension[0].property_ID;

            this.isnew = true;
            if (!this.Saved) {
              this.Saved = true;
            }
            this.getPropertyList(prop.plot_ID);
            //this.completed.emit(prop);
            if (prop.property_Parent_ID != "0") {
              this.serviceService.hide = false;
            }
            const toast = this.notificationsService.success("Sucess");
            //this.getproplocbyid(prop.plot_ID);

            // this.serviceService.disablefins = false;
            this.serviceService.propertyISEnable = true;

            console.log("added property registration");
          },
          (error) => {
            console.log(error);

            const toast = this.notificationsService.error("Error", error.error);
          }
        );
        console.log("saveing....");
      }
    }
  })
  }
  getcurrentlocationdata() {
    this.serviceService
      .getProploc(this.selectedpro.property_ID)
      .subscribe((response: any) => {
        this.proploceach = response.procProporty_Locations;
        console.log(
          "🚀 ~ .subscribe ~ propformLocation:",
          this.propformLocation
        );
        if (this.proploceach.length > 0) {
          this.propformLocation = this.proploceach[0];
          if (this.propformLocation.plan_Document) {
            this.plan_Document =
              "data:image/jpg;base64, " + this.propformLocation.plan_Document;
            this.plan_Document = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.plan_Document
            );
          }
          if (this.propformLocation.picture_North) {
            this.picture_North =
              "data:image/jpg;base64, " + this.propformLocation.picture_North;
            this.picture_North = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.picture_North
            );
          }
          if (this.propformLocation.picture_East) {
            this.propformLocation.picture_East =
              "data:image/jpg;base64, " + this.propformLocation.picture_East;
            this.picture_East = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.picture_East
            );
          }
          if (this.propformLocation.picture_South) {
            this.propformLocation.picture_South =
              "data:image/jpg;base64, " + this.propformLocation.picture_South;
            this.picture_South = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.picture_South
            );
          }
          if (this.propformLocation.picture_West) {
            this.picture_West =
              "data:image/jpg;base64, " + this.propformLocation.picture_West;
            this.picture_West = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.picture_West
            );
          }
        }
      });
  }

  getproplocbyid(plotid) {
    this.convertedCoordinates = [];
    this.serviceService.getPlotloc(plotid).subscribe((response: any) => {
      this.plotloc = response.procPlot_Locations;
      console.log("plotlocccc:", this.plotloc);
      if (this.plotloc.length > 0) {
        let allgeowithzone = this.parsePolygons(this.plotloc[0].geowithzone);
        console.log(
          "🚀 ~ this.proploc.forEach ~ allgeowithzone:",
          allgeowithzone
        );
        allgeowithzone.forEach((each) => {
          console.log("🚀 ~ this.proploc.forEach ~ each:", each);
          this.convertPolygonCoordinates(each, this.plotloc[0]);
        });

        if (this.plotloc[0].geoForwgs84 != null) {
          this.convertPolygonCoordinates(
            this.plotloc[0].geoForwgs84,
            this.plotloc[0]
          );
        }

        this.serviceService.selectedproperty = this.selectedpro.property_ID;
        console.log("this.propformLocation", this.serviceService.PropertyList);
        this.serviceService.PropertyList.forEach((element) => {
          if (element.property_ID != "No Parent") {
            this.serviceService
              .getProploc(element.property_ID)
              .subscribe((response: any) => {
                this.proploc = response.procProporty_Locations;
                console.log(
                  "this.propformLocation",
                  this.proploc,
                  this.selectedpro.property_ID
                );
                if (this.proploc.length > 0) {
                  this.proploc.forEach((elementeach) => {
                    console.log(
                      "this.propformLocationelementeach",
                      elementeach
                    );
                    if (
                      elementeach.proporty_Id == this.selectedpro.property_ID
                    ) {
                      this.propformLocation = elementeach;
                      console.log(
                        "🚀 ~ this.proploc.forEach ~ propformLocation:",
                        this.propformLocation
                      );

                      this.serviceService.isvalidatedPlotGis = true;
                      this.serviceService.ispropoertylocation = true;

                      this.isproplocnew = true;
                      let allgeowithzone = this.parsePolygons(
                        elementeach.geowithzone
                      );
                      console.log(
                        "🚀 ~ this.proploc.forEach ~ allgeowithzone:",
                        allgeowithzone
                      );
                      allgeowithzone.forEach((each) => {
                        console.log("🚀 ~ this.proploc.forEach ~ each:", each);
                        this.convertPolygonCoordinates(each, element);
                      });
                      return;
                    } else {
                      this.propformLocation = new PropformLocation();
                      console.log(
                        "this.propformLocationcur",
                        this.propformLocation
                      );
                      this.serviceService.isvalidatedPlotGis = false;
                      this.serviceService.ispropoertylocation = true;

                      this.isproplocnew = false;

                      let allgeowithzone = this.parsePolygons(
                        elementeach.geowithzone
                      );
                      console.log(
                        "🚀 ~ this.proploc.forEach ~ allgeowithzone:",
                        allgeowithzone
                      );
                      allgeowithzone.forEach((each) => {
                        console.log("🚀 ~ this.proploc.forEach ~ each:", each);
                        this.convertPolygonCoordinates(each, element);
                      });
                      
                    }
                  });
                } else {
                  if (element.property_ID == this.selectedpro.property_ID) {
                    console.log("this.propformLocationcurrent", element);
                    this.propformLocation = new PropformLocation();
                    this.serviceService.ispropoertylocation = false;
                    this.isproplocnew = false;
                  }
                }
              });
          }
        });
      }
    });
  }
  parsePolygons(polygonsString: any): any[] {
    const polygons = polygonsString
      .split("),")
      .map((polygon) => `${polygon.trim()})`);
    //console.log("🚀 ~ parsePolygons ~ polygons:", polygons);
    return polygons;
  }
  // convertToMultiPoint(
  //   points: {
  //     easting: number;
  //     northing: number;
  //     hemisphere: string;
  //     zone: number;
  //   }[]
  // ): string {
  //   const multiPointArray = points
  //     .map(
  //       (point) =>
  //         `${point.easting} ${point.northing} ${point.hemisphere} ${point.zone}`
  //     )
  //     .join(", ");

  //   const multiPointString = `POLYGON((${multiPointArray}))`;

  //   return multiPointString;
  // }
  convertToMultiPoint(
    points: {
      easting: number;
      northing: number;
      hemisphere: string;
      zone: number;
    }[]
  ): string {
    // Check if the input points form a valid polygon
    if (
      points.length < 3 || // At least three points are required for a polygon
      points[0].easting !== points[points.length - 1].easting || // Check if the first and last points are the same
      points[0].northing !== points[points.length - 1].northing
    ) {
      const toast = this.notificationsService.warn(
        "Invalid polygon: The first and last points must be the same."
      );
      return;
    }

    // Remove the last point if it's identical to the first point
    if (
      points.length > 1 &&
      points[0].easting === points[points.length - 2].easting &&
      points[0].northing === points[points.length - 2].northing
    ) {
      points.pop();
    }

    const multiPointArray = points
      .map(
        (point) =>
          `${point.easting} ${point.northing} ${point.hemisphere} ${point.zone}`
      )
      .join(", ");

    const multiPointString = `POLYGON((${multiPointArray}))`;

    return multiPointString;
  }

  convertToMultiPoints(
    points: { easting: number; northing: number }[]
  ): string {
    const multiPointArray = points
      .map((point) => `${point.easting} ${point.northing}`)
      .join(", ");

    if (this.serviceService.iscircleLatLngs == 0) {
      const multiPointString = `POLYGON((${multiPointArray}))/0`;

      return multiPointString;
    } else {
      const multiPointCircle = this.serviceService.centerLatLng
        .map((point) => `${point.easting} ${point.northing}`)
        .join(", ");

      const multiPoint = `POINT(${multiPointCircle})/${Math.trunc(
        this.serviceService.iscircleLatLngs
      )}`;
      return multiPoint;
    }
  }

  convertToMultiPointsmorethanone(
    pointsArray: Array<Array<Array<string>>>
  ): string {
    let multiPointString = "";

    pointsArray.forEach((polygonPoints) => {
      if (polygonPoints.length > 1) {
        const multiPointArray = polygonPoints
          .map((point) => `${point[1]} ${point[0]}`)
          .join(", ");
        multiPointString += `POLYGON((${multiPointArray})), `;
      }
    });

    // Remove the trailing comma and space
    multiPointString = multiPointString.slice(0, -2);
    console.log(
      "🚀 ~ convertToMultiPoints ~ multiPointString:",
      multiPointString
    );

    return multiPointString;
  }
  convertToMultiPointgeozone(points) {
    const polygons = points.map((polygonPoints) => {
      if (polygonPoints.length > 1) {
        const multiPointArray = polygonPoints
          .map((point) => `${point[1]} ${point[0]} ${point[2]} ${point[3]}`)
          .join(", ");

        return `POLYGON((${multiPointArray}))`;
      }
    });

    // Filter out any undefined values and join the strings
    return polygons.filter((polygon) => polygon).join(", ");
  }
  // convertPolygonCoordinatesingle(polygonString: string, data): any[] {
  //   const coordinates = polygonString.match(/([\d.]+\s[\d.]+\s\w\s\d+)/g);
  //   console.log(
  //     "🚀 ~ convertPolygonCoordinatesingle ~ coordinates:",
  //     coordinates
  //   );

  //   const result = [];

  //   if (coordinates) {
  //     for (const coord of coordinates) {
  //       console.log("coordcoordcoord", coord);

  //       const [easting, northing, hemisphere, zone] = coord.split(" ");

  //       result.push({
  //         northing: northing,
  //         easting: easting,
  //         hemisphere: hemisphere,
  //         zone: zone,
  //       });
  //     }
  //   }

  //   console.log("result", result);
  //   this.convertCoordinates(result, data);

  //   return result;
  // }
  convertPolygonCoordinates(polygonString: string, data): any[] {
    // console.log(
    //   "🚀 ~ convertPolygonCoordinates ~ polygonString:",
    //   polygonString
    // );

    const coordinates = polygonString.match(/([\d.]+\s[\d.]+\s\w\s\d+)/g);
   // console.log("🚀 ~ convertPolygonCoordinates ~ coordinates:", coordinates);

    const result = [];

    if (coordinates != null) {
      const uniqueCoordinates = new Set(); // Using a Set to store unique coordinates
      for (const coord of coordinates) {
        const [easting, northing, hemisphere, zone] = coord.split(" ");

        // Check if the coordinate is unique before adding it to the result
        const uniqueCoordString = `${easting},${northing}`;
        if (!uniqueCoordinates.has(uniqueCoordString)) {
          uniqueCoordinates.add(uniqueCoordString);

          // result.push({
          //   northing: northing,
          //   easting: easting,
          //   hemisphere: hemisphere,
          //   zone: zone,
          // });
          result.push({
            northing: (parseFloat(northing) + 207.34388375).toString(),
            easting: (parseFloat(easting) + 95.4782061405).toString(),
            hemisphere: hemisphere,
            zone: zone,
          });
        }
      }
    }

    // Validating the polygon
    const isValidPolygon =
      result.length >= 3 &&
      result[0].northing === result[result.length - 1].northing &&
      result[0].easting === result[result.length - 1].easting;

    console.log("result", result);
    console.log("isValidPolygon", isValidPolygon);
    if (result.length > 0) {
      this.convertCoordinates(result, data);
    }

    return isValidPolygon ? result : [];
  }

  convertCoordinates(data, prop) {
    const convertedCoordinates = [];
    // Convert UTM coordinates to the desired format
    convertedCoordinates.push([
      "northing",
      "easting",
      "hemisphere",
      "zone",
      "shapeProperties",
    ]);

    for (const coord of data) {
      convertedCoordinates.push([
        coord.northing,
        coord.easting,
        coord.hemisphere,
        coord.zone,
        prop,
      ]);
    }

    const arrayOfArrays = [];
    // let proparray = [];
    // proparray.push(prop);

    // convertedCoordinates.push(proparray);
    // Push the innerArray into arrayOfArrays
    arrayOfArrays.push(convertedCoordinates);
    //console.log("convertedCconvertedCoordinatesoordinates", arrayOfArrays);
    this.tellChild(arrayOfArrays);
  }

  updateproploc() {
    // if (this.serviceService.Licence_Service_ID != this.serviceService.LicenceserviceID){
    //   const toast = this.notificationsService.error(
    //     "Error",
    //     "this property created by other technical officer so you can't update it /ይህ ቤት በሌላ ቴክኒካል ኦፊሰር የተፈጠረ ስለሆነ ማዘመን አይችሉም"
    //   );
    //   return
    // }
    // console.log(
    //   "coordinatcoordinat",
    //   this.serviceService.coordinate,
    //   this.selectedpro.property_ID
    // );
    if (this.serviceService.coordinate) {
      let coordinate = this.convertToMultiPointgeozone(
        this.serviceService.coordinate
      );
      let coordinate2 = this.convertToMultiPointsmorethanone(
        this.serviceService.coordinate
      );
      this.propformLocation.geo = coordinate2;
      this.propformLocation.geowithzone = coordinate;
      this.propformLocation.proporty_Id = this.selectedpro.property_ID;
      this.propformLocation.geoForwgs84 =
        this.serviceService.coordinateForwgs84;
      this.serviceService.getUserRole().subscribe((response: any) => {
        console.log("responseresponseresponse", response, response[0].RoleId);
        this.propformLocation.updated_By = response[0].UserId;
        this.propformLocation.updated_Date = new Date();
        if (response[0].RoleId == "f8dda85e-f967-4ac5-bf79-4d989ecfb863") {
          this.propformLocation.team_Leader_Approved_By = response[0].UserId;
          this.propformLocation.team_Leader_Approved = true;

          console.log(
            this.propformLocation.team_Leader_Approved_By,
            this.propformLocation.team_Leader_Approved
          );
        } else if (
          response[0].RoleId == "fe7be2e0-e717-4230-b732-5b810a8bb875"
        ) {
          this.propformLocation.baseMap_Approved_By = response[0].UserId;
          this.propformLocation.baseMap_Approved = true;
          console.log(
            this.propformLocation.team_Leader_Approved_By,
            this.propformLocation.team_Leader_Approved
          );
        }
        this.serviceService.updateProploc(this.propformLocation).subscribe(
          (CustID) => {
            this.getproplocbyid(this.propertyRegister.plot_ID);
            const toast = this.notificationsService.success(
              "Sucess",
              "Succesfully Upadted"
            );
          },
          (error) => {
            console.log("error");
            const toast = this.notificationsService.error(
              "error",
              `unable to Update ${
                error["status"] == 0
                  ? error["message"]
                  : JSON.stringify(JSON.stringify(error["error"]))
              }`
            );
          }
        );
      });
    }
  }
  saveproploc() {
    console.log("propformLocation", this.propformLocation);
    console.log("coordinatcoordinat", this.serviceService.coordinate);
    if (this.serviceService.coordinate) {
      // let coordinate= this.convertToMultiPoint(this.serviceService.coordinate)
      // console.log('coordinatecoordinate',coordinate)

      // let coordinate= this.convertToMultiPoint(this.serviceService.coordinate)
      // this.propformLocation.geowithzone=coordinate

      this.serviceService.getUserRole().subscribe((response: any) => {
        let coordinates = this.convertToMultiPointsmorethanone(
          this.serviceService.coordinate
        );

        console.log("coordinatecoordinate", coordinates);
        this.propformLocation.geo = coordinates;
        let coordinate = this.convertToMultiPointgeozone(
          this.serviceService.coordinate
        );
        console.log(
          "🚀 ~ this.serviceService.getUserRole ~ coordinate:",
          coordinate
        );
        this.propformLocation.geowithzone = coordinate;
        this.propformLocation.geoForwgs84 =
          this.serviceService.coordinateForwgs84;
        console.log("responseresponseresponse", response, response[0].RoleId);
        this.propformLocation.proporty_Id =
          this.serviceService.insertedProperty;
        this.propformLocation.created_By = response[0].RoleId;
        this.propformLocation.created_By = response[0].RoleId;
        //this.propformLocation.created_Date = new Date();
        console.log(
          "🚀 ~ this.serviceService.getUserRole ~ propformLocation:",
          this.propformLocation
        );

        this.serviceService.saveProploc(this.propformLocation).subscribe(
          (CustID) => {
            //this.getproploc(this.propformLocation.proporty_Id);
            const toast = this.notificationsService.success(
              "Sucess",
              "Succesfully saved"
            );
            this.getproplocbyid(this.propertyRegister.plot_ID);
            // this.serviceService.hide = false;
          },
          (error) => {
            console.log("error");
            const toast = this.notificationsService.error(
              "error",
              `unable to Save ${
                error["status"] == 0
                  ? error["message"]
                  : JSON.stringify(JSON.stringify(error["error"]))
              }`
            );
          }
        );
      });
    }
  }
  Uploader(File) {
    let base64file;
    const reader = new FileReader();
    reader.readAsDataURL(File);
    reader.addEventListener("loadend", (e) => {
      base64file = reader.result;
      this.pictoShow = base64file;
      this.pictoShow = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.pictoShow
      );
      const re = /base64,/gi;
      base64file = base64file.replace(re, "");
      this.propertyRegister.imageType = base64file.split(";")[0].split(":")[1];
      base64file = base64file.split(";")[1];

      this.propertyRegister.map_Floor_Plan = base64file;
      console.log(
        "this.propertyRegister.map_Floor_Plan",
        this.propertyRegister.map_Floor_Plan
      );
    });
  }
  openModalll() {
    // Open the modal with the ng-template
    this.ngxSmartModalService.setModalData(null, "myModal");
    this.ngxSmartModalService.open("myModal");
  }
  setModalSize(size: "mini" | "full", modal: string) {
    const myModal = this.ngxSmartModalService.getModal(modal);
    console.log(myModal);

    // if (size === "mini") {
    //   // Add the 'mini-size' class to adjust the modal's size
    //   myModal.size.add("mini-size");
    // } else if (size === "full") {
    //   // Add the 'full-size' class to adjust the modal's size
    //   myModal.cl.add("full-size");
    // }

    // Close and reopen the modal to apply the size changes
  }
  confirmsave() {
    this.msgs = "Are you sure that you want to save?";
    this.isconfirmsave = true;
  }

  upload(event, form) {
    this.Uploader(event.files[0]);
    form.clear();
  }
  planDocument(event, form) {
    this.planDocumentU(event.files[0]);
    form.clear();
  }
  planDocumentU(File) {
    let base64file;
    const reader = new FileReader();
    reader.readAsDataURL(File);
    reader.addEventListener("loadend", (e) => {
      base64file = reader.result;
      console.log("🚀 ~ reader.addEventListener ~ base64file:", base64file);
      this.plan_Document = base64file;
      this.plan_Document = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.plan_Document
      );
      const re = /base64,/gi;
      base64file = base64file.replace(re, "");
      this.propformLocation.imageType = base64file.split(";")[0].split(":")[1];
      base64file = base64file.split(";")[1];
      this.propformLocation.plan_Document = base64file;
    });
  }
  pictureNorth(event, form) {
    this.pictureNorthU(event.files[0]);
    form.clear();
  }
  pictureNorthU(File) {
    let base64file;
    const reader = new FileReader();
    reader.readAsDataURL(File);
    reader.addEventListener("loadend", (e) => {
      base64file = reader.result;
      this.picture_North = base64file;
      this.picture_North = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.picture_North
      );
      const re = /base64,/gi;
      base64file = base64file.replace(re, "");
      this.propformLocation.imageType = base64file.split(";")[0].split(":")[1];
      base64file = base64file.split(";")[1];
      this.propformLocation.picture_North = base64file;
    });
  }
  pictureEast(event, form) {
    this.pictureEastU(event.files[0]);
    form.clear();
  }
  pictureEastU(File) {
    let base64file;
    const reader = new FileReader();
    reader.readAsDataURL(File);
    reader.addEventListener("loadend", (e) => {
      base64file = reader.result;
      this.picture_East = base64file;
      this.picture_East = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.picture_East
      );
      const re = /base64,/gi;
      base64file = base64file.replace(re, "");
      this.propformLocation.imageType = base64file.split(";")[0].split(":")[1];
      base64file = base64file.split(";")[1];
      this.propformLocation.picture_East = base64file;
    });
  }
  pictureSouth(event, form) {
    this.pictureSouthU(event.files[0]);
    form.clear();
  }
  pictureSouthU(File) {
    let base64file;
    const reader = new FileReader();
    reader.readAsDataURL(File);
    reader.addEventListener("loadend", (e) => {
      base64file = reader.result;
      this.picture_South = base64file;
      this.picture_South = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.picture_South
      );
      const re = /base64,/gi;
      base64file = base64file.replace(re, "");
      this.propformLocation.imageType = base64file.split(";")[0].split(":")[1];
      base64file = base64file.split(";")[1];
      this.propformLocation.picture_South = base64file;
    });
  }
  pictureWest(event, form) {
    this.pictureWestU(event.files[0]);
    form.clear();
  }
  pictureWestU(File) {
    let base64file;
    const reader = new FileReader();
    reader.readAsDataURL(File);
    reader.addEventListener("loadend", (e) => {
      base64file = reader.result;
      this.picture_West = base64file;
      this.picture_West = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.picture_West
      );
      const re = /base64,/gi;
      base64file = base64file.replace(re, "");
      this.propformLocation.imageType = base64file.split(";")[0].split(":")[1];
      base64file = base64file.split(";")[1];
      this.propformLocation.picture_West = base64file;
    });
  }
  openModal(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }

  closeModal(modal) {
    console.log("closeing.....");
    this.ngxSmartModalService.getModal(modal).close();
  }
  openFullModal() {
    this.isMaximized = true;
    this.maxWidth = "2000px"; // Set the max width for full modal
    this.maxheight = "800px";
  }

  openMiniModal() {
    this.isMaximized = false;
    this.maxWidth = "1600px"; // Set the max width for mini modal
  }
}

export class PropertyRegister {
  public property_ID: any;
  public description: any;
  public plot_ID: any;
  public registration_Date: any;
  public property_Type_ID: any;
  public basement_Floor_No: any;
  public upper_Floor_No: any;
  public parking_Area_M2: any;
  public estimated_Price: any;
  public building_Size_M2: any;
  public compound_Size_M2: any;
  public property_Status_ID: any;
  public property_Parent_ID: any;
  public map_Floor_Plan: any;
  public application_No: any;
  public licence_Service_ID: any;
  public number_of_Lift: any;
  public building_No: any;
  public houseNo: any;
  public location_of_Property: any;
  public floor_No: any;
  public size_In_Proportional: any;
  public proportional_from_Compound_Size: any;
  public created_By: any;
  public updated_By: any;
  public deleted_By: any;
  public is_Deleted: any;
  public created_Date: any;
  public updated_Date: any;
  public deleted_Date: any;
  public imageType: any;
  public children;
  public parent;
  public is_commerscial;
  public room_No;
  public proprty_Use;
}
export class PropformLocation {
  public proporty_Id: any;
  public no: any;
  public created_By: any;
  public updated_By: any;
  public deleted_By: any;
  public is_Deleted: any;
  public created_Date: any;
  public updated_Date: any;
  public deleted_Date: any;
  public geo: any;
  public plan_Document: any;
  public picture_North: any;
  public picture_East: any;
  public picture_South: any;
  public picture_West: any;
  public baseMap_Approved: any;
  public baseMap_Approved_By: any;
  public team_Leader_Approved: any;
  public team_Leader_Approved_By: any;
  public geowithzone: any;
  public imageType: any;
  public hight_Meter: any;
  public geoForwgs84: any;
}
