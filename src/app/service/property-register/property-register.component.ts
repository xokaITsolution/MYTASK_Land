import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { ServiceComponent } from "../service.component";
import { PropertyRegisterService } from "./property-register.service";
import { NotificationsService } from "angular2-notifications";
import { PropertyComponent } from "../property/property.component";
import { DomSanitizer } from "@angular/platform-browser";
import { ConfirmationService } from "primeng/api";
import { NgxSmartModalService } from "ngx-smart-modal";
import { ServiceService } from "../service.service";

@Component({
  selector: 'app-property-register',
  templateUrl: './property-register.component.html',
  styleUrls: ['./property-register.component.css']
})
export class PropertyRegisterComponent implements OnInit, OnChanges {
  @Output() completed = new EventEmitter();
  @Output() completeddel = new EventEmitter();

  public propertyRegister: PropertyRegister;
  @Input() selectedpro;
  @Input() disable;
  @Input() LicenceData;
  pictoShow;
  isnew = true;
  Saved=false;

  constructor(
    private serviceService: ServiceService,
    public serviceComponent: ServiceComponent,
    public propertyRegisterService: PropertyRegisterService,
    private notificationsService: NotificationsService,
    public propertyComponent: PropertyComponent,
    private sanitizer: DomSanitizer,
    private ngxSmartModalService: NgxSmartModalService,
    private confirmationService: ConfirmationService
  ) {
    this.propertyRegister = new PropertyRegister();
  }

  ngOnChanges() {
    this.pictoShow = null;
    console.log("chang detected");
    console.log('selected :: ', this.selectedpro);
    if (
      this.selectedpro !== undefined &&
      this.selectedpro !== null
    ) {
      this.propertyRegister = this.selectedpro;
    }

    if (
      this.LicenceData !== undefined &&
      this.LicenceData !== null
    ) {
      if (!this.propertyRegister.Property_ID) {
        this.propertyRegister.Property_ID = this.LicenceData.Property_ID;
      }
    }
    if (this.propertyRegister.Registration_Date) {
      this.propertyRegister.Registration_Date = this.propertyRegister.Registration_Date.split(
        "T"
      )[0];
    }
    if (this.propertyRegister.Map_Floor_Plan) {
      this.pictoShow =
        "data:image/jpg;base64, " + this.propertyRegister.Map_Floor_Plan;
      this.pictoShow = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.pictoShow
      );
    }

    if (!this.selectedpro.Property_ID) {
      this.isnew = false;
    } else {
      this.isnew = true;
    }
  }

  ngOnInit() {
    console.log('is new :: ', this.isnew);
    console.log('is disable :: ', this.disable);
  }

  save() {
    const prop = Object.assign({}, this.propertyRegister);
    if (prop.children) {
      prop.children = null;
    }
    if (prop.parent) {
      if (prop.parent.children) {
        prop.parent.children = null;
      }
    }
    if (prop.Property_Parent_ID == "No Parent") {
      prop.Property_Parent_ID = "0";
    }
    console.log("saveing....", prop);
    this.propertyRegisterService.save(prop).subscribe(
      (property) => {
        console.log("property", property);

        if(!this.Saved){
          this.completed.emit();
          this.Saved = true;
        }
        const toast = this.notificationsService.success("Sucess", property);
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
  }

  Delete() {
    this.confirmationService.confirm({
      message: "Are you sure u want to delete this Property?",
      accept: () => {
        this.propertyRegister.Is_Deleted = true;
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
            const toast = this.notificationsService.success("Sucess", property);
            if(!this.Saved){
              this.completed.emit();
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

  add() {
    const prop = Object.assign({}, this.propertyRegister);
    if (prop.children) {
      prop.children = null;
    }
    if (prop.parent) {
      if (prop.parent.children) {
        prop.parent.children = null;
      }
    }

    if (prop.Property_Parent_ID == "No Parent") {
      prop.Property_Parent_ID = "0";
    }
    this.propertyRegisterService.Add(prop).subscribe(
      (deptSuspension) => {
        console.log("deptSuspension", deptSuspension);

        this.isnew = false;
        const toast = this.notificationsService.success(
          "Sucess",
          deptSuspension
        );
        this.serviceService.disablefins = false;
        
        console.log('added property registration');
      
        
        if(!this.Saved){
          
          this.completed.emit(this.propertyRegister);
          this.Saved = true;
        }
      },
      (error) => {
        console.log(error);
        if (error.status == "400") {
          const toast = this.notificationsService.error(
            "Error",
            error.error.InnerException.Message
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
      this.propertyRegister.ImageType = base64file.split(";")[0].split(":")[1];
      base64file = base64file.split(";")[1];
      this.propertyRegister.Map_Floor_Plan = base64file;
    });
  }

  upload(event, form) {
    this.Uploader(event.files[0]);
    form.clear();
  }

  openModal(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }

  closeModal(modal) {
    console.log("closeing.....");
    this.ngxSmartModalService.getModal(modal).close();
  }
}

export class PropertyRegister {
  public Plot_ID: string;
  public Property_ID: string;
  public Description: string;
  public Property_Type_ID: string;
  public Basement_Floor_No: string;
  public Upper_Floor_No: string;
  public Parking_Area_M2: string;
  public Estimated_Price: string;
  public Number_of_Lift: string;
  public Compound_Size_M2: string;
  public Property_Status_ID: string;
  public Property_Parent_ID: string;
  public Map_Floor_Plan;
  public HouseNo: string;
  public children;
  public parent;
  public Is_Deleted;
  public Licence_Service_ID;
  public Registration_Date;
  public Building_Size_M2;
  public LocationName;
  public Building_No;
  public Location_of_Property;
  public Floor_No;
  public Size_In_Proportional;
  public Proportional_from_Compound_Size;
  public ImageType;
}
