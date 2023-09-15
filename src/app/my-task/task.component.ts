import {Component, OnInit} from '@angular/core';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styles: []
})
export class TaskComponent implements OnInit {
  tab = '';
  showcustomer: boolean=true;

  constructor(public serviceService:ServiceService) {
  }

  ngOnInit() {
    this.serviceService.getUserRole().subscribe(
      (response:any) => {
        console.log('responseresponseresponse',response , response[0].RoleId)
        if(response[0].RoleId=="8e759c69-1ed6-445b-b7f8-32c3fd44e8be" || response[0].RoleId=="5b3b5dd4-3cef-4696-ac19-442ba531a7dd"){
          this.showcustomer=false
        }

  })}

}
