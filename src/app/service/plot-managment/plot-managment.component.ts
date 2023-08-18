import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from "@angular/core";
import { ServiceComponent } from "../service.component";
import { PloatManagmentService } from "./ploat-managment.service";
import { NotificationsService } from "angular2-notifications";
import { NgxSmartModalService } from "ngx-smart-modal";
import { ServiceService } from "../service.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { ViewEncapsulation } from "@angular/core";
import { Regions } from './regions';
import { PlotComponent } from "../plot/plot.component";
@Component({
  selector: 'app-plot-managment',
  templateUrl: './plot-managment.component.html',
  styleUrls: ['./plot-managment.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PlotManagmentComponent implements OnInit, OnChanges {
  @Output() completed = new EventEmitter<PlotManagment>();
  @Output() completeddel = new EventEmitter<PlotManagment>();

  public plotManagment: PlotManagment;
  @Input() SelectedPlot;
  @Input() disable;
  @Input() Fields;

  mapCenter = [11.610400228322295, 37.41706261388921];
  basemapType = "streets-vector";
  mapZoomLevel = 1;
  isnew = false;
  isploatDisabled = false;
  displayGIS = false;
  toogleSpin = false;
  Saved = false;
  woredas = [];
  woredasHolder = [];
  zoneOptions = [];
  Land_Grade =[];
  selectedRegion;
  selectedZone;
  

  constructor(
    private serviceService: ServiceService,
    private ngxSmartModalService: NgxSmartModalService,
    public serviceComponent: ServiceComponent,
    private ploatManagmentService: PloatManagmentService,
    private notificationsService: NotificationsService,
    private confirmationService: ConfirmationService,
    private message: MessageService,
    public plotcomponent:PlotComponent,

  ) {
    this.plotManagment = new PlotManagment();
  }

  ngOnChanges() {

    console.log("haha1", this.SelectedPlot,this.serviceComponent.ServiceDeliveryUnitLookUP);
   
    if (this.SelectedPlot) {
      this.plotManagment = this.SelectedPlot;
    }
    console.log("chang detected");

    if (this.plotManagment['Plot_ID']) {
      this.isnew = this.plotManagment['Parcel_No'] ? false : true;
      this.isploatDisabled = true;
    }
    else {
      this.isnew = this.plotManagment['Parcel_No'] ? false : true;
      this.isploatDisabled = false;
    }
    
    this.plotManagment.SDP_ID=this.serviceComponent.ServiceDeliveryUnitLookUP[0].organization_code
  if( this.plotManagment.SDP_ID!=null || this.plotManagment.SDP_ID!=undefined ){
    this.regionSelectedd(this.plotManagment.SDP_ID)
  }
    console.log('vvvvv', this.plotManagment.SDP_ID);
    
  }

  ngOnInit() {
    // this.getServiceDeliveryUnitLookUP();
    console.log(
      'plot debug ::: ',
      'is new :: ', this.isnew,
      'disabled :: ', this.disable,
      'is plot Disabled :: ', this.isploatDisabled,
      'plot id :: ', this.plotManagment.Plot_ID,
      'plotManagement :: ', this.plotManagment,
    );

    // this.plotManagment.SDP_ID=this.serviceComponent.ServiceDeliveryUnitLookUP[0].organization_code
  }

  subcitySelected(event) {
    if (this.selectedRegion) {
      (this.selectedRegion.woredas as any[]).find(
        subcity => {
          if (subcity.value == event.target.value) {
            this.woredas = subcity.woredas;
            return true;
          }
          return false;
        }
      )
    }
  }
  LandGrade(event) {
    if (this.selectedRegion) {
      (this.selectedRegion.Land_Grade as any[]).find(
        sub => {
          if (sub.value == event.target.value) {
            this.Land_Grade = sub.Land_Grade;
            return true;
          }
          return false;
        }
      )
    }
  }
  regionSelectedd(events) {
    Regions.find(
      region => {
        if (region.orgCode == events) {
          console.log('bbbb',events)
          this.zoneOptions = region.woredas;
          this.selectedRegion = region;
          this.woredas = [];
          this.plotManagment.Land_Grade_ID ;
          return true;
        }
        return false;
      }
    );
  }
  regionSelected(event) {
    Regions.find(
      region => {
        if (region.orgCode == event.target.value) {
          console.log('bbbx',event.target.value)
          this.zoneOptions = region.woredas;
          this.selectedRegion = region;
          this.woredas = [];
          this.plotManagment.Land_Grade_ID ;
          return true;
        }
        return false;
      }
    );
  }

  woredaLookup() {
    this.serviceService.getWoredaLookUP().subscribe(
      data => {
        if (data['list'] instanceof Array) {
          this.woredasHolder = data['list'];
          this.woredasHolder.sort(
            (a, b) => a['Woreda_Name'] - b['Woreda_Name']
          );
          let tempWoredasHolder = [];
          this.woredasHolder.forEach(
            woreda => {
              if (
                !tempWoredasHolder.some(
                  tempWoreda => tempWoreda['Woreda_Name'] == woreda['Woreda_Name']
                )
              ) {
                tempWoredasHolder.push(woreda);
              }
            }
          );
          this.woredasHolder = tempWoredasHolder;
        }
      },
      error => {
        console.error('unable to get woreda :: ', error);
      }
    );
  }

  finishSelection() {
    this.plotManagment.Plot_ID= this.plotManagment.Plot_ID.toString()
    
    console.log('gusssss',this.plotManagment.Plot_ID);
    
    if (this.plotManagment.Plot_ID) {
      this.message.add(
        { severity: 'success', summary: 'Plot Selection', detail: 'Plot selected successfully!' }
      );
   
      
      this.toogleSpin = true;
      setTimeout(() => {
        this.displayGIS = false;
        this.toogleSpin = false;
      }, 1000);
      
    }
    else {
      this.message.add(
        { severity: 'warn', summary: 'Plot Selection', detail: 'Please select a plot first!' }
      );
    }
  }

  selectPlotID(plotData) {
    console.log('selected plot :: ', plotData);
    this.plotManagment.Plot_ID=plotData
    // if (plotData.properties.OBJECTID || plotData.properties.ID_3 || plotData.properties.ID_0) {
    //   console.log('plot id from gis :: ', plotData.properties.POP2000);
    //   console.log('plot id before gis :: ', this.plotManagment.Plot_ID);
    //   this.plotManagment.Plot_ID = plotData.properties.OBJECTID ? plotData.properties.OBJECTID : plotData.properties.ID_3 || plotData.properties.ID_0;
    //   console.log('plot id from gis :: ', this.plotManagment.Plot_ID);
    // }
  }

  plotSelector(event) {
    console.log("event", event.mapPoint.spatialReference.latestWkid);
    if (!this.isploatDisabled) {
      this.plotManagment.Plot_ID = event.mapPoint.spatialReference.latestWkid;
      this.ngxSmartModalService.getModal("GisViewer").close();
    }
  }

  openModal(modal) {
    this.ngxSmartModalService.getModal(modal).open();
  }

  closeModal(modal) {
    console.log("closeing.....");
    this.plotManagment.GISCoordinate =
      this.plotManagment.GIS_X_Coordinate_1 +
      ":" +
      this.plotManagment.GIS_Y_Coordinate_1 +
      "," +
      this.plotManagment.GIS_X_Coordinate_2 +
      ":" +
      this.plotManagment.GIS_Y_Coordinate_2 +
      "," +
      this.plotManagment.GIS_X_Coordinate_3 +
      ":" +
      this.plotManagment.GIS_Y_Coordinate_3 +
      "," +
      this.plotManagment.GIS_X_Coordinate_4 +
      ":" +
      this.plotManagment.GIS_Y_Coordinate_4 +
      "," +
      this.plotManagment.GIS_X_Coordinate_5 +
      ":" +
      this.plotManagment.GIS_Y_Coordinate_5 +
      "," +
      this.plotManagment.GIS_X_Coordinate_6 +
      ":" +
      this.plotManagment.GIS_Y_Coordinate_6 +
      "," +
      this.plotManagment.GIS_X_Coordinate_7 +
      ":" +
      this.plotManagment.GIS_Y_Coordinate_7 +
      "," +
      this.plotManagment.GIS_X_Coordinate_8 +
      ":" +
      this.plotManagment.GIS_X_Coordinate_8;
    this.ngxSmartModalService.getModal(modal).close();
  }

  save() {
    this.plotManagment.Plot_ID= JSON.stringify(this.plotManagment.Plot_ID)
    this.ploatManagmentService.save(this.plotManagment).subscribe(
      deptSuspension => {
        console.log("deptSuspension", deptSuspension);
        const toast = this.notificationsService.success(
          "Sucess",
          deptSuspension
          
        );
        this.serviceService.disablefins=false
        if (!this.Saved) {
          this.completed.emit(this.plotManagment);
          this.Saved = true;
        }


      },
      error => {
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
    // this.confirmationService.confirm({
    //   message: 'Are you sure u want to delete this Plot?',
    //   accept: () => {

        this.plotManagment.Is_Deleted = true;
        this.ploatManagmentService.save(this.plotManagment).subscribe(
          deptSuspension => {
            console.log('deptSuspension', deptSuspension);
            const toast = this.notificationsService.success(
              "Sucess",
              deptSuspension
              
            );
            this.serviceService.disablefins = false;
            


            if (!this.Saved) {
              this.completed.emit(this.plotManagment);
              this.Saved = true;
            }
            deptSuspension=>{
              const toast = this.notificationsService.warn('Warning' );
            }

          },
       
          error => {
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
  //   });

  // }

  add() {
    
    this.ploatManagmentService.Add(this.plotManagment).subscribe(
      deptSuspension => {
        console.log("deptSuspension", deptSuspension);
        const toast = this.notificationsService.success(
          "Success",
          deptSuspension
        );
        
        this.serviceService.disablefins = false;
        this.plotcomponent.toMes=true
        this.plotcomponent.CanDone =true
        this.isnew = false;
        this.isploatDisabled = true;
        console.log("FinalPLoat before send", this.plotManagment);
        
        if (!this.Saved) {
          this.completed.emit(this.plotManagment);
          this.Saved = true;
        }
        
        // Add warning message here
        const warningMessage = "የሊዝ ወይም የነባር ይዞታ መመዝገቡን አረጋግጥ/Check lease or freehold record is active for this plot";
        const toastWarning = this.notificationsService.warn(
          "Warning",
          warningMessage
        );
      },
      error => {
        console.log(error);
        if (error.status == "400") {
          const toast = this.notificationsService.error(
            "Error",
            error.error.InnerException.Errors[0].message
          );
        } else {
          const toast = this.notificationsService.error(
            "Error",
            "Something Went Wrong"
          );
        }
      }
    );
    console.log("saving....");
  }

}

export class PlotManagment {
  public Plot_ID: string;
  public Description: string;
  public SDP_ID: string;
  public Wereda_ID: string;
  public House_No: string;
  public Block_No: string;
  public Parcel_No: string;
  public Plot_Size_M2: string;
  public Plot_Status: string;
  public Registration_Date: string;
  public Type_Of_Use_ID: string;
  public Land_Grade_ID:string;
  public GIS_X_Coordinate_1: string;
  public GIS_X_Coordinate_2: string;
  public GIS_X_Coordinate_3: string;
  public GIS_X_Coordinate_4: string;
  public GIS_X_Coordinate_5: string;
  public GIS_X_Coordinate_6: string;
  public GIS_X_Coordinate_7: string;
  public GIS_X_Coordinate_8: string;
  public GIS_Y_Coordinate_1: string;
  public GIS_Y_Coordinate_2: string;
  public GIS_Y_Coordinate_3: string;
  public GIS_Y_Coordinate_4: string;
  public GIS_Y_Coordinate_5: string;
  public GIS_Y_Coordinate_6: string;
  public GIS_Y_Coordinate_7: string;
  public GIS_Y_Coordinate_8: string;
  public GISCoordinate: string;
  public N_Plot_ID: string;
  public S_Plot_ID: string;
  public E_Plot_ID: string;
  public W_Plot_ID: string;
  public Is_Deleted;
  public Street_No;
  public Nortech_No:string;
  public Licence_Service_ID;
  public Application_No;
}
