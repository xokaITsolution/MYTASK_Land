import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service/service.service';
import { environment } from 'src/environments/environment';
import {MyTaskService} from '../my-task.service';

@Component({
  selector: 'app-supervisor-task',
  templateUrl: './supervisor-task.component.html',
  styleUrls: ['./supervisor-task.component.css']
})
export class SupervisorTaskComponent implements OnInit {
  taskwaithing = 120;

  tasks;
  constructor(private myTaskService: MyTaskService ,private seice:ServiceService) { }

  ngOnInit() {
    this.getSupervisedTask();

  }

   getSupervisedTask() {
    //var userInfo = await this.seice.getViewAspNetUsersWorkInfoDetail(environment.username).toPromise();
    //var orgid= userInfo[0].organization_code;
    var orgid="24d45c72-8088-4591-810a-bc674f9f0a57"
    this.myTaskService.getSupervisertasks(orgid).subscribe(tasks => {
      this.tasks = tasks;
      this.tasks = (Object.assign([], this.tasks.Table1));
      console.log('tasks', tasks);
      console.log('this.taskList', this.tasks);
    });
  }
}
