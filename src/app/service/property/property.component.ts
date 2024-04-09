import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { ServiceService } from "../service.service";
import { TreeNode } from "primeng/api";
import { NotificationsService } from "angular2-notifications";
import { ServiceComponent } from "../service.component";
import { environment } from "src/environments/environment";

import { BehaviorSubject } from "rxjs";
import { LeaseOwnerShipService } from "../lease-owner-ship/lease-owner-ship.service";
import { TitleDeedRegistrationService } from "../title-deed-registration/title-deed-registration.service";
import { MeasurmentService } from "../measurment/measurment.service";
import {
  PropertyRegister,
  PropformLocation,
} from "../property-register/property-register.component";
@Component({
  selector: "app-property",
  templateUrl: "./property.component.html",
  styleUrls: ["./property.component.css"],
})
export class PropertyComponent implements OnChanges {
  @Output() completed = new EventEmitter();
  @Output() getpro = new EventEmitter();
  public propertyRegister: PropertyRegister;
  @Input() LicenceData;
  highlighted;
  @Input() Mode;
  @Input() Licence_Service_ID;
  @Input() disable;
  @Input() AppNo;
  @Input() Service_ID;
  @Input() todoid;
  @Input() tskID;
  @Input() DocID;
  PlotManagementList = [];
  propertyForm;
  SelectedProperty;
  PropertyList;
  propertyregForm;
  selectedprofromtree;
  selectedFile;
  disabled;
  PropertyTypeLookUP: any;
  totitleDeed;
  toFixedasset;
  isnew = true;
  CanDone;
  novalidprops;

  public SelectedProprtyPlot;

  Saved = false;
  language: string;
  newplot: boolean = true;
  tasksCertificate: any;
  isNextactive: boolean = true;
  PlotManagementListfinal = [];
  randomColor = "#006ab5";

  constructor(
    public serviceService: ServiceService,
    public serviceComponent: ServiceComponent,
    private notificationsService: NotificationsService,

    private leaseOwnerShipService: LeaseOwnerShipService,
    private measurmentService: MeasurmentService,
    private titleDeedRegistrationService: TitleDeedRegistrationService
  ) {}

  ngOnChanges() {
    if (environment.Lang_code === "am-et") {
      this.language = "amharic";
    } else {
      this.language = "english";
    }
    this.propertyForm = false;
    console.log(
      "🚀 ~ PropertyComponent ~ ngOnChanges ~ propertyForm:",
      this.serviceService.Service_ID
    );
    this.propertyregForm = false;
    this.PlotManagementList = [];
    this.novalidprops = 0;
    this.getPloat();
  }
  async savedata() {
    if (!this.Saved) {
      const sumOfPropertiess: any = this.serviceService.files.filter(
        (node: ExtendedTreeNode) =>
          node.level === 0 && node.label != "No Parent"
      );
      const sumOfProperties = this.serviceService.files
        .filter(
          (node: ExtendedTreeNode) =>
            node.level === 0 && node.label != "No Parent"
        )
        .reduce((sum, node: ExtendedTreeNode) => {
          sum +=
            parseFloat(node.building_Size_M2) +
            // parseFloat(node.proportional_from_Compound_Size) +
            // parseFloat(node.parking_Area_M2) +
            parseFloat(node.size_In_Proportional);
          return sum;
        }, 0);

      console.log("this.serviceService.files", sumOfProperties);
      const sumOfPropertiesfinal = sumOfProperties.toFixed(2);
      // Check if the sum is equal to compound_Size_M2
      if (
        parseFloat(sumOfPropertiesfinal) === parseFloat(sumOfPropertiesfinal)
      ) {
        for (let i = 0; i < this.serviceService.files.length; i++) {
          const element: any = Object.assign([], this.serviceService.files[i]);
          console.log("sub property", element);

          if (element.property_ID !== "No Parent") {
            const isdeedchildren = await this.checkProperty(element);

            if (!isdeedchildren) {
              const toast = this.notificationsService.warn(
                `Must add title deed for this property: ${element.property_ID}`
              );
            } else {
              this.serviceService
                .GetProportyValidationURL(this.serviceService.LicenceserviceID)
                .subscribe((message: any) => {
                  if (message == 1) {
                    this.serviceService.disablefins = false;

                    this.completed.emit();
                  } else {
                    const toast = this.notificationsService.error(
                      "Error",
                      message
                    );
                  }
                });
            }
          }
        }
      } else {
        const toast = this.notificationsService.warn(
          "built-in size must be equal to lease size/ ንብረት ድምር ከሊዝ መጠን ጋር እኩል መሆን አለበት።"
        );
      }
      this.Saved = true;
    }
  }
  getPloat() {
    if (this.LicenceData.Parcel_ID) {
      //this.completed.emit();
      console.log("geting ploat this.Parcel_ID", this.LicenceData.Parcel_ID);
      this.getPlotManagement(this.LicenceData.Parcel_ID);
    }
    if (this.LicenceData.Plot_Merge_1) {
      console.log(
        "geting ploat this.Plot_Merge_1",
        this.LicenceData.Plot_Merge_1
      );
      this.getPlotManagement(this.LicenceData.Plot_Merge_1);
    }
    if (this.LicenceData.Plot_Merge_2) {
      console.log(
        "geting ploat this.Plot_Merge_2",
        this.LicenceData.Plot_Merge_2
      );
      this.getPlotManagement(this.LicenceData.Plot_Merge_2);
    }
    if (this.LicenceData.Plot_Merge_3) {
      console.log(
        "geting ploat this.Plot_Merge_3",
        this.LicenceData.Plot_Merge_3
      );
      this.getPlotManagement(this.LicenceData.Plot_Merge_3);
    }
    if (this.LicenceData.Plot_Merge_4) {
      console.log(
        "geting ploat this.Plot_Merge_4",
        this.LicenceData.Plot_Merge_4
      );
      this.getPlotManagement(this.LicenceData.Plot_Merge_4);
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
  getPlotManagement(Licence_Service_ID) {
    let a;

    this.serviceService.getPlotManagementApi(Licence_Service_ID).subscribe(
      async (PlotManagementLists: any) => {
        let PlotManagementList = PlotManagementLists.procPlot_Registrations;
        if (PlotManagementList.length > 0) {
          this.PlotManagementList = this.removeDuplicates(PlotManagementList);
        }
        console.log("PlotManagementList", this.PlotManagementList);
        if (this.PlotManagementList.length > 0) {
          this.PlotManagementListfinal.push(this.PlotManagementList[0]);
          this.PlotManagementListfinal = this.removeDuplicates(
            this.PlotManagementListfinal
          );
        }
        for (
          let index = 0;
          index < this.PlotManagementListfinal.length;
          index++
        ) {
          const element = this.PlotManagementListfinal[index];
          if (element.plot_Status == 1) {
            this.PlotManagementListfinal = this.PlotManagementListfinal.filter(
              (x) => x.plot_Status == 1
            );
          }
        }

        console.log("PlotManagementList", this.PlotManagementListfinal);

        console.log("PlotManagementList", this.PlotManagementListfinal);
        console.log(
          "this.PlotManagementList",
          this.PlotManagementList,
          this.serviceService.Service_ID
        );
      },
      (error) => {
        console.log("error");
      }
    );
  }
  removeDuplicates(data) {
    const uniqueArray = data.filter(
      (item, index, self) =>
        self.findIndex((i) => i.plot_ID === item.plot_ID) === index
    );

    return uniqueArray;
  }
  // getPlotManagement(Parcel_ID) {
  //   let a;
  //   this.serviceService.getPlotManagement(Parcel_ID).subscribe(
  //     async (PlotManagementList) => {
  //       a = PlotManagementList;
  //       let b = false;
  //       console.log("this.PlotManagementList", this.PlotManagementList);
  //       for (let i = 0; i < (PlotManagementList as any).list.length; i++) {
  //         console.log("plot list loop");

  //         if (
  //           a.list[0].plot_ID == (PlotManagementList as any).list[i].plot_ID
  //         ) {
  //           b = true;
  //           break;
  //         }
  //       }
  //       if (b) {
  //         this.novalidprops = this.novalidprops + 1;
  //         if (this.language == "amharic") {
  //           a.list[0].Registration_Date =
  //             await this.getgregorianToEthiopianDate(
  //               a.list[0].Registration_Date
  //             );
  //         }
  //         this.PlotManagementList.push(a.list[0]);
  //         // this.isisvalidated(
  //         //   this.todoid,
  //         //   this.tskID,
  //         //   a.list[0].plot_ID,
  //         //   "00000000-0000-0000-0000-000000000000",
  //         //   this.DocID
  //         // );
  //         const uniqueJobMatchIDs = {};
  //         const uniqueData = this.PlotManagementList.filter((item) => {
  //           if (!uniqueJobMatchIDs[item.plot_ID]) {
  //             uniqueJobMatchIDs[item.plot_ID] = true;
  //             return true;
  //           }
  //           return false;
  //         });
  //         this.PlotManagementList = uniqueData;
  //       }

  //       console.log("PlotManagementList", PlotManagementList);
  //       console.log("this.PlotManagementList", this.PlotManagementList);
  //     },
  //     (error) => {
  //       console.log("error");
  //     }
  //   );
  // }

  async SelectProprty(property) {
    console.log(
      "🚀 ~ file: property.component.ts:293 ~ PropertyComponent ~ SelectProprty ~ property:",
      property
    );

    this.getleaseOwnerShip(property.plot_ID);
    if (property.type_Of_Use_ID == 2020) {
      //የእርሻ ይዞታ አገልግሎት/For Agriculture
      this.serviceService.isagriculture = true;
      this.propertyForm = true;
      // this.propertyregForm = true;
      this.SelectedProperty = property;
      this.propertyRegister = new PropertyRegister();
      this.propertyRegister.building_Size_M2 = property.plot_Size_M2;
      this.propertyRegister.proportional_from_Compound_Size = 0;
      this.propertyRegister.parking_Area_M2 = 0;
      this.propertyRegister.size_In_Proportional = 0;
      this.propertyRegister.plot_ID = property.plot_ID;
      this.propertyRegister.application_No = property.application_No;
      this.propertyRegister.property_Status_ID = 1;
      this.propertyRegister.property_Type_ID = 1014;
      this.propertyRegister.compound_Size_M2 = property.plot_Size_M2;
      this.propertyRegister.description = "የእርሻ ይዞታ አገልግሎት/For Agriculture";
      this.propertyRegister.registration_Date = new Date();
      this.propertyRegister.licence_Service_ID = property.licence_Service_ID;

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

      prop.property_ID = "-1";
      console.log(
        "🚀 ~ file: property.component.ts:339 ~ PropertyComponent ~ SelectProprty ~ prop:",
        prop
      );
      this.serviceService.Add(prop).subscribe(
        (deptSuspension) => {
          console.log("deptSuspension", deptSuspension);
          // if (prop.map_Floor_Plan != null) {
          //   this.serviceService.isNextactive = true;
          // } else {
          //   this.serviceService.isNextactive = false;
          // }
          this.serviceService.insertedProperty = deptSuspension[0].property_ID;

          this.isnew = true;
          if (!this.Saved) {
            this.Saved = true;
          }
          this.getPropertyList();
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
    } else {
      this.propertyForm = true;
      this.propertyregForm = false;
      this.SelectedProperty = property;
      this.serviceService.isagriculture = false;
      this.serviceService.Plot_Size_M2 = this.SelectedProperty.plot_Size_M2;
      console.log("plotManagment", this.SelectedProperty);
      this.getPropertyList();
      this.getleaseOwnerShip(this.SelectedProperty.plot_ID);
    }

    // this.disable=false;
  }
  getleaseOwnerShip(plotID) {
    console.log("plotIDplotID", plotID);

    this.leaseOwnerShipService.getAll(plotID).subscribe(
      (CertificateVersion) => {
        this.tasksCertificate = CertificateVersion;
        this.tasksCertificate = Object.assign([], this.tasksCertificate.list);

        console.log("tasksCertificate", this.tasksCertificate);
        if (this.tasksCertificate.length > 0) {
          if (this.tasksCertificate[0].Type_ID == 2) {
            this.serviceService.isproportinal = true;
          }
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
  }

  async getPropertyList() {
    this.serviceService.backbuttonviable = true;
    this.serviceService
      .getPropertyLists(this.SelectedProperty.plot_ID)
      .subscribe(
        (PropertyList: any) => {
          this.PropertyList = PropertyList.procProperty_Registrations;
          this.PropertyList = Object.assign([], this.PropertyList);
          console.log("PropertyList", PropertyList);

          this.PropertyList.push({ property_ID: "No Parent" });
          this.serviceService.PropertyList = this.PropertyList;
          console.log("PropertyListlist", this.serviceService.PropertyList);
          this.getTree(Object.assign([], this.PropertyList));
          this.novalidprops = this.PropertyList.length;
          //this.isvalidated();

          if (this.PropertyList.length > 0) {
            // if (Property) {
            //   this.selectedFile = Property;
            //   this.selectedprofromtree = this.selectedFile;
            //   this.selectedprofromtree = {
            //     property_ID: Property.property_ID,
            //   };
            // }
            this.serviceService.backbuttonviable = true;
          }
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
        a.randomColor = "#006ab5";

        const l1 = [...PropertyList];

        for (let j = 0; j < l1.length; j++) {
          let b;

          if (l1[j].property_Parent_ID == a.property_ID) {
            b = { ...l1[j] };
            b.label = b.property_ID;
            b.children = [];
            b.level = 1;
            b.randomColor = "#d0ff00";
            a.children.push(b);

            const l2 = [...PropertyList];

            for (let k = 0; k < l2.length; k++) {
              let c;

              if (l2[k].property_Parent_ID == b.property_ID) {
                c = { ...l2[k] };
                c.label = c.property_ID;
                c.children = [];
                c.level = 2;
                c.randomColor = "#ff3a43";
                //c.styleClass = "custom-selected-node";
                b.children.push(c);
              }
            }
          }
        }

        addLevelToNode(a, 0);
        this.serviceService.files.push(a);
      }
    }

    const sumOfProperties = this.serviceService.files
      .filter(
        (node: ExtendedTreeNode) =>
          node.level === 0 && node.label != "No Parent"
      )
      .reduce((sum, node: ExtendedTreeNode) => {
        sum +=
          parseFloat(node.building_Size_M2) +
          // parseFloat(node.proportional_from_Compound_Size) +
          // parseFloat(node.parking_Area_M2) +
          parseFloat(node.size_In_Proportional);
        return sum;
      }, 0);

    const sumOfPropertiess: any = this.serviceService.files.filter(
      (node: ExtendedTreeNode) => node.level === 0 && node.label != "No Parent"
    );
    const selectedChild = this.expandAndSelectChild(
      this.serviceService.files,
      this.serviceService.insertedProperty
    );
    this.selectedFile = selectedChild;
    if (selectedChild) {
      this.nodeSelect("1");
      this.selectedFile.styleClass = "custom-selected-node";
    }
    console.log(
      "this.serviceService.files",
      this.serviceService.files,
      this.serviceService.insertedProperty,
      selectedChild
    );
  }
  async getTreeDepth(PropertyList) {
    let maxDepth = 0;

    const calculateDepth = (node, depth) => {
      if (depth > maxDepth) {
        maxDepth = depth;
      }

      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => {
          calculateDepth(child, depth + 1);
        });
      }
    };

    PropertyList.forEach((node) => {
      calculateDepth(node, 0);
    });

    console.log("🚀 ~ PropertyComponent ~ getTreeDepth ~ maxDepth:", maxDepth);
    return maxDepth;
  }

  async getTreeForeach(PropertyList) {
    const files = [];

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
        a.randomColor = "#006ab5";

        const l1 = [...PropertyList];

        for (let j = 0; j < l1.length; j++) {
          let b;

          if (l1[j].property_Parent_ID == a.property_ID) {
            b = { ...l1[j] };
            b.label = b.property_ID;
            b.children = [];
            b.level = 1;
            b.randomColor = "#d0ff00";
            a.children.push(b);

            const l2 = [...PropertyList];

            for (let k = 0; k < l2.length; k++) {
              let c;

              if (l2[k].property_Parent_ID == b.property_ID) {
                c = { ...l2[k] };
                c.label = c.property_ID;
                c.children = [];
                c.level = 2;
                c.randomColor = "#ff3a43";
                //c.styleClass = "custom-selected-node";
                b.children.push(c);
              }
            }
          }
        }

        addLevelToNode(a, 0);
        files.push(a);
      }
    }

    return files;
  }
  expandAndSelectChild(tree, targetPropertyID, depth = 0) {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].property_ID === targetPropertyID) {
        // Found the element with the specified property_ID
        tree[i].expanded = true; // Expand the node
        return tree[i];
      } else if (tree[i].children && tree[i].children.length > 0) {
        const result = this.expandAndSelectChild(
          tree[i].children,
          targetPropertyID,
          depth + 1
        );
        if (result) {
          if (depth === 0) {
            // Expand the parent node only if it's the top level
            tree[i].expanded = true;
          }
          return result;
        }
      }
    }
    return null; // Element not found
  }

  findTreeElement(tree, targetPropertyID, depth = 0) {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].property_ID === targetPropertyID) {
        return tree[i]; // Found the element with the specified property_ID
      } else if (tree[i].children && tree[i].children.length > 0) {
        const result = this.findTreeElement(
          tree[i].children,
          targetPropertyID,
          depth + 1
        );
        if (result) {
          // Optionally, you can handle depth-specific actions here
          return result; // Found the element in a child node
        }
      }
    }
    return null; // Element not found
  }

  async AddNew() {
    const isdeedchildren = await this.checkpropertyType();
    console.log(
      "🚀 ~ PropertyComponent ~ AddNew ~ isdeedchildren:",
      isdeedchildren
    );

    if (!isdeedchildren) {
      this.propertyregForm = false;
      this.isnew = false;
    } else {
      this.getpro.emit();
      this.isnew = true;
      this.propertyregForm = true;
      this.selectedprofromtree = {};
      if (this.selectedFile) {
        this.selectedprofromtree.property_Parent_ID =
          this.selectedFile.property_ID;
        //this.selectedprofromtree.property_Type_ID = 2;
      } else {
        // this.selectedprofromtree.property_Type_ID = 1;
      }

      console.log("plotManagment", this.SelectedProperty.plot_ID);

      this.selectedprofromtree.plot_ID = this.SelectedProperty.plot_ID;
      this.selectedprofromtree.compound_Size_M2 =
        this.SelectedProperty.plot_Size_M2;

      this.selectedprofromtree.licence_Service_ID = this.Licence_Service_ID;
    }
  }
  selectedTab = 0;
  tab1;
  tab2;
  initTabs() {
    this.tab1 = true;
    this.tab2 = false;
  }
  tabChanged(e) {
    console.log(e.index);
    if (e.index == 0) {
      this.tab1 = true;
      this.tab2 = false;
    } else if (e.index == 1) {
      this.tab1 = false;
      this.tab2 = true;
    }
  }
  nodeUnselecte(data) {
    data.node.styleClass = "";
    this.selectedFile = data.node;
    this.propertyregForm = false;
  }

  async nodeSelect(data) {
    if (this.selectedFile.property_Parent_ID == 0) {
      this.serviceService.ishavespashal = true;
    }
    this.getTreeDepth(this.serviceService.files);
    if (data != "1") {
      data.node.styleClass = "custom-selected-node";
      this.selectedFile = data.node;
    }
    console.log("selectedFile", data);
    // if (this.selectedFile.map_Floor_Plan != null) {
    //   this.serviceService.isNextactive = true;
    // } else {
    //   this.serviceService.isNextactive = false;
    // }
    if (this.selectedFile.property_Type_ID == 1014) {
      this.serviceService.isagriculture = true;
      this.propertyregForm = true;
      this.isnew = false;
      this.newplot = true;
      this.selectedFile.plot_ID = this.SelectedProperty.plot_ID;
      this.selectedprofromtree = this.selectedFile;
    } else {
      let a: any = await this.getmeasurment(this.selectedFile.property_ID);
      let b = await this.getdeed(this.selectedFile.property_ID);
      this.serviceService.isagriculture = false;
      // Add conditions based on the level of the selected node
      if (
        (this.selectedFile.level === 0 &&
          this.selectedFile.property_ID != "No Parent") ||
        (this.selectedFile.level === 1 &&
          this.selectedFile.property_ID != "No Parent")
      ) {
        // Handle actions for level 0 nodes
        this.getpro.emit();
        if (this.tasksCertificate.length > 0) {
          if (
            this.tasksCertificate[0].Type_ID == 2 ||
            this.tasksCertificate[0].Type_ID == 1
          ) {
            this.newplot = false;
          } else if (this.serviceService.files.length == 2) {
            this.newplot = true;
          } else {
            this.newplot = false;
          }
        } else {
          this.newplot = false;
        }
        this.propertyregForm = true;
        this.isnew = false;
        this.newplot = false;
        this.selectedFile.plot_ID = this.SelectedProperty.plot_ID;
        this.selectedprofromtree = this.selectedFile;

        a = Object.assign([], a.list);
        b = b.procDeed_Registrations.filter(
          (x) => x.property_ID === this.selectedFile.property_ID
        );

        this.selectedprofromtree = this.selectedFile;

        if (a.length > 0) {
          this.serviceService.ismeasurmentList = true;
        } else {
          this.serviceService.ismeasurmentList = false;
        }
        if (b.length > 0) {
          this.serviceService.ishavetitleDeedRegistrationList = true;
        } else {
          this.serviceService.ishavetitleDeedRegistrationList = false;
        }
      } else {
        if (this.selectedFile.property_ID === "No Parent") {
          this.propertyregForm = false;
          this.newplot = false;
          return;
        }
        // Handle actions for nodes with level > 0
        this.propertyregForm = true;
        this.isnew = false;
        this.newplot = true;
        this.selectedFile.plot_ID = this.SelectedProperty.plot_ID;
        this.selectedprofromtree = this.selectedFile;

        a = Object.assign([], a.list);
        b = b.procDeed_Registrations.filter(
          (x) => x.property_ID === this.selectedFile.property_ID
        );

        this.selectedprofromtree = this.selectedFile;

        if (a.length > 0) {
          this.serviceService.ismeasurmentList = true;
        } else {
          this.serviceService.ismeasurmentList = false;
        }
        if (b.length > 0) {
          this.serviceService.ishavetitleDeedRegistrationList = true;
        } else {
          this.serviceService.ishavetitleDeedRegistrationList = false;
        }
      }
    }
  }

  async getmeasurment(propertyid) {
    var s = await this.measurmentService.getAll(propertyid).toPromise();
    return s;
  }
  async getProploc(propertyid) {
    var s = await this.serviceService.getProploc(propertyid).toPromise();

    return s;
  }
  async getdeed(propertyid) {
    var a: any = this.titleDeedRegistrationService.getAllby().toPromise();

    return a;
  }

  SelectPropertyPLot(ProprtyPlot) {
    this.propertyregForm = false;
    this.SelectedProprtyPlot = ProprtyPlot;
  }

  isvalidated() {
    if (this.PropertyList !== null && this.PropertyList !== undefined) {
      for (let i = 0; i < this.PropertyList.length; i++) {
        if (this.PropertyList[i].property_ID !== "No Parent") {
          this.isisvalidated(
            this.todoid,
            this.tskID,
            "00000000-0000-0000-0000-000000000000",
            "00000000-0000-0000-0000-000000000000",
            this.DocID
          );
        }
      }
    }
  }

  isisvalidated(todoID, tskID, plotid, proid, DocID) {
    this.serviceService
      .isvalidated(todoID, tskID, plotid, proid, DocID)
      .subscribe(
        (Validated) => {
          if (Validated == "Validated") {
            this.novalidprops = this.novalidprops - 1;
            console.log("novalidprops", this.novalidprops);
            if (this.novalidprops == 0) {
              if (!this.Saved) {
                this.Saved = true;
              }
              // this.CanDone = true;
            }
            // if (this.serviceService.isproportinal == true) {
            //   if (
            //     this.serviceService.totlaizeproportinal ==
            //     this.serviceService.Plot_Size_M2
            //   ) {
            //     this.completed.emit();
            //   }
            // } else {
            //   this.completed.emit();
            // }
          } else {
            // this.validated = false;
            // const toast = this.notificationsService.warn("Warning", Validated);
          }
          // this.RequerdDocs = RequerdDocs;

          // this.getAllDocument();
          // console.log('RequerdDocs', this.RequerdDocs);
        },
        (error) => {
          console.log("error");
        }
      );
  }

  EnableFins() {
    this.getPropertyList();
    this.isvalidated();
  }

  EnableFinspro() {
    // this.propertyregForm = false;
    this.getPropertyList();
    this.isvalidated();
  }

  async EnableFinsFixedasset() {
    if (this.serviceService.isproportinal == true) {
      if (
        this.serviceService.totlaizeproportinal ==
        this.serviceService.Plot_Size_M2
      ) {
        this.serviceService
          .GetProportyValidationURL(this.serviceService.LicenceserviceID)
          .subscribe((message: any) => {
            if (message == 1) {
              this.serviceService.disablefins = false;

              this.completed.emit();
            } else {
              const toast = this.notificationsService.error("Error", message);
            }
          });
      } else {
        const toast = this.notificationsService.warn(
          "if the lease type is proportional the sum of property built-in size must be equal to lease size/የሊዝ አይነት ተመጣጣኝ ከሆነ አብሮ የተሰራው ንብረት ድምር ከሊዝ መጠን ጋር እኩል መሆን አለበት።"
        );
      }
    } else {
      if (
        2 == this.serviceService.selectedproperty_Type_ID ||
        3 == this.serviceService.selectedproperty_Type_ID
      ) {
        if (this.selectedFile.children.length == 0) {
          const toast = this.notificationsService.warn(
            "must  add minimum  one sub property if the property type is building or apartment / የንብረቱ ዓይነት ሕንፃ ወይም አፓርትመንት ከሆነ ቢያንስ አንድ ንዑስ ንብረት መጨመር አለበት"
          );
        } else {
          for (let i = 0; i < this.serviceService.files.length; i++) {
            const element: any = Object.assign(
              [],
              this.serviceService.files[i]
            );
            console.log("sub property", element);

            if (element.property_ID !== "No Parent") {
              const isdeedchildren = await this.checkProperty(element);

              if (!isdeedchildren) {
                const toast = this.notificationsService.warn(
                  `Must add title deed for this property: ${element.property_ID}`
                );
              } else {
                this.serviceService
                  .GetProportyValidationURL(
                    this.serviceService.LicenceserviceID
                  )
                  .subscribe((message: any) => {
                    if (message == 1) {
                      this.serviceService.disablefins = false;

                      this.completed.emit();
                    } else {
                      const toast = this.notificationsService.error(
                        "Error",
                        message
                      );
                    }
                  });
              }
            }
          }
        }
      } else {
        for (let i = 0; i < this.serviceService.files.length; i++) {
          const element: any = Object.assign([], this.serviceService.files[i]);
          console.log("sub property", element);

          if (element.property_ID !== "No Parent") {
            const isdeedchildren = await this.checkProperty(element);

            if (!isdeedchildren) {
              const toast = this.notificationsService.warn(
                `Must add title deed for this property: ${element.property_ID}`
              );
            } else {
              this.serviceService
                .GetProportyValidationURL(this.serviceService.LicenceserviceID)
                .subscribe((message: any) => {
                  if (message == 1) {
                    this.serviceService.disablefins = false;

                    this.completed.emit();
                  } else {
                    const toast = this.notificationsService.error(
                      "Error",
                      message
                    );
                  }
                });
            }
          }
        }
      }
    }
    // this.propertyregForm = false;
    console.log("fixed asset");

    this.getPropertyList();
    this.isvalidated();
  }

  async EnableFinspronew(Property) {
    console.log(
      "🚀 ~ PropertyComponent ~ EnableFinspronew ~ Property:",
      Property
    );

    this.selectedFile = Property;
    this.selectedprofromtree = this.selectedFile;

    this.selectedprofromtree = {
      property_ID: this.serviceService.insertedProperty,
    };
    let prop = await this.getPropertyList();

    // let treedibth = await this.getTreeDepth(this.serviceService.files);
    // if (
    //   "47BA2A09-33F8-4553-A1A1-3D11A031B056".toLocaleLowerCase() ==
    //     this.serviceService.Service_ID ||
    //   "2B1FC99A-9705-4799-96B9-164BD3B1077E".toLocaleLowerCase() ==
    //     this.serviceService.Service_ID
    // ) {
    //   if (treedibth == 2) {
    //   } else {
    //     if (treedibth == 0) {
    //       const toast = this.notificationsService.warn(
    //         `must add one  floor for building/ለግንባታ አንድ ወለል መጨመር አለበት`
    //       );
    //     }
    //     if (treedibth == 1) {
    //       const toast = this.notificationsService.warn(
    //         `must add one  room for  floor / ለአንድ ወለል አንድ ክፍል መጨመር አለበት`
    //       );
    //     }
    //     return;
    //   }
    // } else {
    //   this.DoneNew();
    // }
  }

  EnabledelFinspro() {
    this.getPropertyList();
    this.propertyregForm = false;
  }

  EnableFinsMesNEw() {
    // this.propertyregForm = false;
    // this.getPropertyList();
    // this.completed.emit();
    this.totitleDeed = true;
  }

  async DoneNew() {
    let treedibth = await this.getTreeDepth(this.serviceService.files);

    console.log("EnableFinstitlefiles", this.serviceService.files.length);
    const sumOfPropertiess: any = this.serviceService.files.filter(
      (node: ExtendedTreeNode) => node.level === 0 && node.label != "No Parent"
    );
    const sumOfProperties = this.serviceService.files
      .filter(
        (node: ExtendedTreeNode) =>
          node.level === 0 && node.label != "No Parent"
      )
      .reduce((sum, node: ExtendedTreeNode) => {
        sum +=
          parseFloat(node.building_Size_M2) +
          // parseFloat(node.proportional_from_Compound_Size) +
          // parseFloat(node.parking_Area_M2) +
          parseFloat(node.size_In_Proportional);
        return sum;
      }, 0);

    console.log("this.serviceService.files", sumOfProperties);
    const sumOfPropertiesfinal = sumOfProperties.toFixed(2);
    // Check if the sum is equal to compound_Size_M2
    console.log(
      "🚀 ~ PropertyComponent ~ DoneNew ~ serviceService:",
      this.serviceService.files
    );
    this.serviceService.files = this.serviceService.files.filter(
      (x) => x.label != "No Parent"
    );
    console.log(
      "🚀 ~ PropertyComponent ~ DoneNew ~ serviceService:",
      this.serviceService.files
    );

    if (parseFloat(sumOfPropertiesfinal) === parseFloat(sumOfPropertiesfinal)) {
      for (let i = 0; i < this.serviceService.files.length; i++) {
        const element: any = Object.assign([], this.serviceService.files[i]);
        console.log("sub property", element);

        if (element.property_ID !== "No Parent") {
          const isdeedchildren = await this.checkProperty(element);

          if (!isdeedchildren) {
            //this.checkPropertylocationAll();

            const toast = this.notificationsService.warn(
              `Must add title deed For this property: ${element.property_ID}`
            );
            if (
              "47BA2A09-33F8-4553-A1A1-3D11A031B056".toLocaleLowerCase() ==
                this.serviceService.Service_ID ||
              "2B1FC99A-9705-4799-96B9-164BD3B1077E".toLocaleLowerCase() ==
                this.serviceService.Service_ID
            ) {
              console.log(
                "🚀 ~ PropertyComponent ~ DoneNew ~ treedibth:",
                treedibth
              );
              if (treedibth == 2) {
              } else {
                if (treedibth == 0) {
                  const toast = this.notificationsService.warn(
                    `must add one  floor for building/ለግንባታ አንድ ወለል መጨመር አለበት`
                  );
                }
                if (treedibth == 1) {
                  const toast = this.notificationsService.warn(
                    `must add one  room for  floor / ለአንድ ወለል አንድ ክፍል መጨመር አለበት`
                  );
                }
                return;
              }
            }

            return;
          } else {
            if (
              parseFloat(sumOfPropertiesfinal) ===
              parseFloat(sumOfPropertiesfinal)
            ) {
              this.checkPropertylocationAll();
            } else {
              const toast = this.notificationsService.warn(
                "all property must have location on the map /ሁሉም ንብረቶች በካርታው ላይ ቦታ ሊኖራቸው ይገባል"
              );
              return;
            }
          }
        } else {
          this.serviceService
            .GetProportyValidationURL(this.serviceService.LicenceserviceID)
            .subscribe((message: any) => {
              if (message == 1) {
                this.serviceService.disablefins = false;

                this.completed.emit();
              } else {
                const toast = this.notificationsService.error("Error", message);
              }
            });
        }
      }
    } else {
      if (!this.serviceService.isagriculture) {
        const toast = this.notificationsService.warn(
          "built-in size must be equal to lease size/ ንብረት ድምር ከሊዝ መጠን ጋር እኩል መሆን አለበት።"
        );
        return;
      } else {
        this.serviceService
          .GetProportyValidationURL(this.serviceService.LicenceserviceID)
          .subscribe((message: any) => {
            if (message == 1) {
              this.serviceService.disablefins = false;

              this.completed.emit();
            } else {
              const toast = this.notificationsService.error("Error", message);
            }
          });
      }
    }
  }

  async EnableFinstitle() {
    console.log("EnableFinstitlefiles", this.serviceService.files);
    const sumOfPropertiess: any = this.serviceService.files.filter(
      (node: ExtendedTreeNode) => node.level === 0 && node.label != "No Parent"
    );
    const sumOfProperties = this.serviceService.files
      .filter(
        (node: ExtendedTreeNode) =>
          node.level === 0 && node.label != "No Parent"
      )
      .reduce((sum, node: ExtendedTreeNode) => {
        sum +=
          parseFloat(node.building_Size_M2) +
          // parseFloat(node.proportional_from_Compound_Size) +
          // parseFloat(node.parking_Area_M2) +
          parseFloat(node.size_In_Proportional);
        return sum;
      }, 0);

    console.log("this.serviceService.files", sumOfProperties);
    const sumOfPropertiesfinal = sumOfProperties.toFixed(2);
    // Check if the sum is equal to compound_Size_M2
    if (parseFloat(sumOfPropertiesfinal) === parseFloat(sumOfPropertiesfinal)) {
      for (let i = 0; i < this.serviceService.files.length; i++) {
        const element: any = Object.assign([], this.serviceService.files[i]);
        console.log("sub property", element);

        if (element.property_ID !== "No Parent") {
          const isdeedchildren = await this.checkProperty(element);

          if (!isdeedchildren) {
            this.checkPropertylocationAll();
            const toast = this.notificationsService.warn(
              `Must add title deed for this property: ${element.property_ID}`
            );
            return;
          } else {
            if (
              parseFloat(sumOfPropertiesfinal) ===
              parseFloat(sumOfPropertiesfinal)
            ) {
              // parseFloat(sumOfPropertiess[0].compound_Size_M2
              // for (let i = 0; i < this.serviceService.files.length; i++) {
              //   const element: any = Object.assign(
              //     [],
              //     this.serviceService.files[i]
              //   );
              //   console.log("sub property", element);

              //   if (element.property_ID !== "No Parent") {
              //     const isdeedchildren = await this.checkPropertylocation(
              //       element
              //     );

              //     if (!isdeedchildren) {
              //       const toast = this.notificationsService.warn(
              //         `Must add property location  for this property: ${element.property_ID}`
              //       );
              //       return;
              //     } else {
              //       this.completed.emit();
              //     }
              //   }
              // }
              this.checkPropertylocationAll();
            } else {
              const toast = this.notificationsService.warn(
                "all property must have location on the map /ሁሉም ንብረቶች በካርታው ላይ ቦታ ሊኖራቸው ይገባል"
              );
              return;
            }
          }
        }
      }
    } else {
      const toast = this.notificationsService.warn(
        "built-in size must be equal to lease size/ ንብረት ድምር ከሊዝ መጠን ጋር እኩል መሆን አለበት።"
      );
    }

    this.CanDone = true;
  }
  async getPropertylis() {
    var a: any = this.serviceService
      .getPropertyLists(this.SelectedProperty.plot_ID)
      .toPromise();

    return a;
  }
  async checkpropertyType() {
    let PropertyListtim = await this.getPropertylis();
    console.log(
      "🚀 ~ PropertyComponent ~ checkpropertyType ~ PropertyListtim:",
      PropertyListtim
    );
    let finapropertylist = PropertyListtim.procProperty_Registrations;
    if (finapropertylist.length > 0) {
      console.log(
        "🚀 ~ PropertyComponent ~ checkpropertyType ~ finapropertylist:",
        finapropertylist
      );

      for (let i = 0; i < finapropertylist.length; i++) {
        if (finapropertylist[i].property_Type_ID === 1) {
          const toast = this.notificationsService.warn(
            "in one plot you can not add more than one   property if property type   residence/በአንድ መሬት ውስጥ የንብረት ዓይነት መኖሪያ ከሆነ ከአንድ በላይ ንብረት ማከል አይችሉም"
          );
          return false;
        }
      }
    }
    return true; // Return true if no warning condition is met
  }

  async checkProperty(element) {
    if (element.property_ID !== "No Parent") {
      const b = await this.getdeed(element.property_ID);
      const bdeed = b.procDeed_Registrations.filter(
        (x) => x.property_ID === element.property_ID
      );

      if (bdeed.length === 0) {
        return false; // No deed record for current property
      }

      for (const elementchildren of element.children) {
        const childCheck = await this.checkProperty(elementchildren);
        if (!childCheck) {
          return false; // At least one child or descendant has no deed record
        }
      }

      return true; // All children and descendants have deed records
    } else {
      const toast = this.notificationsService.warn(
        "must add one property for this /applicationለዚህ መተግበሪያ አንድ ንብረት ማከል አለበት።"
      );
      return false; // Property has "No Parent", return true
    }
  }

  // async checkProperty(element) {
  //   if (element.property_ID != "No Parent") {
  //     // const a: any = await this.getmeasurment(element.property_ID);
  //     const b: any = await this.getdeed(element.property_ID);
  //     // const ameasurmnet = Object.assign([], a.list);
  //     const bdeed = b.procDeed_Registrations.filter(
  //       (x) => x.property_ID === element.property_ID
  //     );
  //     if (element.children.length == 0) {
  //       if (bdeed.length === 0) {
  //         return false;
  //       } else {
  //         return true;
  //       }
  //       // if (ameasurmnet.length === 0 && bdeed.length === 0) {
  //       //   return false;
  //       // } else {
  //       //   return true;
  //       // }
  //     } else {
  //       for (const elementchildren of element.children) {
  //         // const c: any = await this.getmeasurment(elementchildren.property_ID);
  //         const d: any = await this.getdeed(elementchildren.property_ID);
  //         // const cmeasurmnet = Object.assign([], c.list);
  //         const ddeed = d.procDeed_Registrations.filter(
  //           (x) => x.property_ID === elementchildren.property_ID
  //         );
  //         // console.log("sub property", cmeasurmnet, ddeed);
  //         if (ddeed.length === 0) {
  //           // const toast = this.notificationsService.warn(
  //           //   `Must add title deed for this property: ${elementchildren.property_ID}`
  //           // );
  //           return false;
  //         }
  //       }
  //       return true;
  //     }
  //   }
  // }
  checkPropertylocationAll() {
    console.log(
      "🚀 ~ file: property.component.ts:1273 ~ PropertyComponent ~ checkPropertylocationAll ~ PlotManagementListfinal:",
      this.PlotManagementListfinal
    );
    let isnullplot = false;
    for (let index = 0; index < this.PlotManagementListfinal.length; index++) {
      const element = this.PlotManagementListfinal[index];
      console.log(
        "🚀 ~ file: property.component.ts:1273 ~ PropertyComponent ~ checkPropertylocationAll ~ element:",
        element
      );

      this.serviceService
        .getPropertyLists(element.plot_ID)
        .subscribe(async (PropertyList: any) => {
          let PropertyLists = PropertyList.procProperty_Registrations;
          PropertyLists = Object.assign([], PropertyLists);
          console.log(
            "🚀 ~ file: property.component.ts:1291 ~ PropertyComponent ~ .subscribe ~ PropertyLists:",
            PropertyLists
          );

          if (PropertyLists.length == 0) {
            const toast = this.notificationsService.warn(
              `Must add property   for this plot: ${element.plot_ID}`
            );
            isnullplot = true;
            return false;
          } else {
            let eachPlot = await this.getTreeForeach(
              Object.assign([], PropertyLists)
            );
            console.log(
              "🚀 ~ file: property.component.ts:1280 ~ PropertyComponent ~ .subscribe ~ eachPlot:",
              eachPlot
            );
            for (let i = 0; i < eachPlot.length; i++) {
              const element: any = Object.assign([], eachPlot[i]);
              console.log("sub property", element);

              if (
                element.property_ID !== "No Parent" ||
                element.property_Parent_ID != 0
              ) {
                const isdeedchildren = await this.checkPropertylocation(
                  element
                );

                if (!isdeedchildren) {
                  // const toast = this.notificationsService.warn(
                  //   `Must add property location  for this property: ${element.property_ID}`
                  // );

                  return;
                } else {
                  // const toast = this.notificationsService.warn(
                  //   `this property have location : ${element.property_ID}`
                  // );
                  if (!isnullplot) {
                    this.serviceService
                      .GetProportyValidationURL(
                        this.serviceService.LicenceserviceID
                      )
                      .subscribe((message: any) => {
                        if (message == 1) {
                          this.serviceService.disablefins = false;

                          this.completed.emit();
                        } else {
                          const toast = this.notificationsService.error(
                            "Error",
                            message
                          );
                        }
                      });
                  }
                }
              }
            }
          }
        });
    }
  }
  async checkPropertylocation(element) {
    if (element.property_ID != "No Parent" || element.property_Parent_ID != 0) {
      const b: any = await this.getProploc(element.property_ID);
      const e = Object.assign([], b);

      console.log("propertylocation", e, element.property_ID);

      const blocation = e.procProporty_Locations.find(
        (x) => x.proporty_Id === element.property_ID
      );
      console.log("propertylocation", blocation);
      if (blocation != undefined || blocation != null) {
        if (element.children.length == 0) {
          if (blocation.length === 0) {
            return false;
          } else {
            return true;
          }
        } else {
          // for (const elementchildren of element.children) {
          //   console.log(
          //     "🚀 ~ PropertyComponent ~ checkPropertylocation ~ elementchildren:",
          //     elementchildren
          //   );

          //   const d: any = await this.getProploc(elementchildren.property_ID);
          //   const f = Object.assign([], d);

          //   const dlocation = f.procProporty_Locations.find(
          //     (x) => x.Proporty_Id === elementchildren.property_ID
          //   );
          //   console.log(
          //     "🚀 ~ PropertyComponent ~ checkPropertylocation ~ dlocation:",
          //     dlocation
          //   );
          //   if (dlocation != undefined) {
          //     if (dlocation.length === 0) {
          //       const toast = this.notificationsService.warn(
          //         `Must add title deed for this property: ${elementchildren.property_ID}`
          //       );
          //       return false;
          //     }
          //   }
          // }
          for (const elementChild of element.children) {
            console.log(
              "🚀 ~ PropertyComponent ~ checkPropertyLocation ~ elementChild:",
              elementChild
            );

            // Check if elementChild has children
            if (
              elementChild.children &&
              Array.isArray(elementChild.children) &&
              elementChild.children.length > 0
            ) {
              // elementChild has children, iterate over them
              for (const subChild of elementChild.children) {
                const subChildLocation: any = await this.getProploc(
                  subChild.property_ID
                );
                const e = Object.assign([], subChildLocation);
                console.log(
                  "🚀 ~ PropertyComponent ~ checkPropertylocation ~ subChildLocation:",
                  subChildLocation,
                  subChild.property_ID,
                  e
                );

                const subDLocation = e.procProporty_Locations.find(
                  (x) => x.proporty_Id === subChild.property_ID
                );
                console.log(
                  "🚀 ~ PropertyComponent ~ checkPropertyLocation ~ subDLocation:",
                  subDLocation
                );
                if (!subDLocation || subDLocation.length === 0) {
                  const toast = this.notificationsService.warn(
                    `Must add property location for this property: ${subChild.property_ID}`
                  );
                  return false;
                }
              }
            } else {
              // elementChild does not have children
              const childLocation: any = await this.getProploc(
                elementChild.property_ID
              );
              const dLocation = childLocation.procProporty_Locations.find(
                (x) => x.Proporty_Id === elementChild.property_ID
              );
              console.log(
                "🚀 ~ PropertyComponent ~ checkPropertyLocation ~ dLocation:",
                dLocation
              );
              if (!dLocation || dLocation.length === 0) {
                const toast = this.notificationsService.warn(
                  `Must add property location for this property: ${elementChild.property_ID}`
                );
                return false;
              }
            }
          }

          return true;
        }
      }
    }
  }
}
interface ExtendedTreeNode extends TreeNode {
  level: number;
  building_Size_M2: any;
  proportional_from_Compound_Size: any;
  parking_Area_M2: any;
  size_In_Proportional: any;
  compound_Size_M2: any;
}
