import { Component, OnInit } from "@angular/core";
import { MyTaskService } from "../my-task.service";
import { NgxSmartModalService } from "ngx-smart-modal";
import { NotificationsService } from "angular2-notifications";
import { Router } from "@angular/router";

@Component({
  selector: "app-supervisor-task",
  templateUrl: "./supervisor-task.component.html",
  styleUrls: ["./supervisor-task.component.css"],
})
export class SupervisorTaskComponent implements OnInit {
  taskList;
  SuperviedUsers;
  selectedUser;
  selectedTask;
  username: any;
  uid: any;
  taskListtamp: any;
  lockedpromise: any;
  isAccountVisible: boolean;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private myTaskService: MyTaskService,
    private notificationsService: NotificationsService,
    private router: Router
  ) {}

  ngOnInit() {
    //this.getSupervisedTask();
    this.GetSuperviedUsers();
  }

  getSupervisedTask() {
    this.myTaskService.getSupervisertasks().subscribe((tasks) => {
      this.taskList = tasks;
      this.taskList = Object.assign([], this.taskList.Table1);
      console.log("tasks", tasks);
      console.log("this.taskList", this.taskList);
    });
  }

  GetSuperviedUsers() {
    this.myTaskService.GetSuperviedUsers().subscribe((SuperviedUsers) => {
      this.SuperviedUsers = SuperviedUsers;
      this.SuperviedUsers = Object.assign([], this.SuperviedUsers);
      this.SuperviedUsers = SuperviedUsers;
      let mergedTaskList = []; // Create an empty array to store the merged tasks

      if (this.SuperviedUsers) {
        console.log("this.SuperviedUsers", this.SuperviedUsers);
        for (let i = 0; i < this.SuperviedUsers.length; i++) {
          this.myTaskService
            .getMytasksbyusername(this.SuperviedUsers[i].UserName)
            .subscribe((tasks) => {
              this.taskListtamp = tasks;
              this.taskListtamp = Object.assign([], this.taskListtamp.Table1);
              console.log("tasks", tasks);

              // Concatenate the current tasks with the mergedTaskList
              mergedTaskList = mergedTaskList.concat(this.taskListtamp);

              if (i === this.SuperviedUsers.length - 1) {
                // Last iteration, assign the mergedTaskList to this.taskList
                this.taskList = Object.assign([], mergedTaskList);
                this.taskList = this.taskList.filter(
                  (x) => x.status != "O" && x.status != "C"
                );
                console.log("this.taskList", this.taskList);
                this.taskList.sort((a, b) => {
                  if (a.start_date && b.start_date) {
                    const dateA = new Date(a.start_date);
                    const dateB = new Date(b.start_date);
                    return dateA.getTime() - dateB.getTime();
                  } else if (a.start_date && !b.start_date) {
                    return -1;
                  } else if (!a.start_date && b.start_date) {
                    return 1;
                  } else {
                    return 0;
                  }
                });
              }
            });
        }
      }
    });
  }

  openModal(task) {
    this.selectedTask = task;
    // this.ngxSmartModalService.getModal(modal).open();
    this.isAccountVisible = true;
  }

  closeModal(emp, modal) {
    /* this.deptSuspensionRecord.Suspended_By = customer.Customer_ID;
   console.log('closeing.....');
   console.log('closeing.....', customer.Customer_ID);*/
    this.ngxSmartModalService.getModal(modal).close();
  }
  passdata(modal) {
    this.username =
      modal.target.options[modal.target.options.selectedIndex].text;

    this.uid = modal.target.value;
  }
  assign(modal) {
    this.myTaskService
      .AssignToUser(
        this.selectedTask.todo_comment,
        this.uid,
        this.selectedTask.id,
        this.username,
        "O"
      )
      .subscribe(
        (message) => {
          if (message) {
            const toast = this.notificationsService.success(
              "Sucess",
              "assigned sucessfully"
            );
            this.isAccountVisible = false;
          } else {
            const toast = this.notificationsService.error(
              "Error",
              "Assign falied"
            );
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

    this.ngxSmartModalService.getModal(modal).close();
  }
  IsLockedBy_OtherUser(task) {
    // this.go(task);
    this.lockedpromise = this.myTaskService
      .IsLockedBy_OtherUser(task.id)
      .subscribe(
        (message) => {
          if (!message || message) {
            this.go(task);
          } else {
            this.go(task);
            // const toast = this.notificationsService.error('Error',
            //   'This Application No is being Processed by another staff. ' +
            //   'Please choose another Application No. ' +
            //   '/ ይህን ማመልከቻ በሌላ ሰራተኛ እየተስተናገደ ስለሆነ እባክዎ ሌላ ማመልከቻ ቁጥር ይውሰዱ፡፡');
          }
          // const toast = this.notificationsService.success('Sucess', message);
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

  go(task) {
    console.log("task.to_screen", task.to_screen);

    // if (task.to_screen == 'a7a1e05e-32c2-4f44-ad58-306572c64593') {
    //   console.log('path if :: ', '/services/2/' + task.todo_comment + '/' + task.task_types_id + '/' + task.tasks_id + '/' + task.service_details_id + '/' + task.id + '/' + task.to_screen);
    //   // this.router.navigateByUrl('/services/2/' + task.todo_comment + '/' + task.task_types_id + '/' + task.tasks_id + '/' + task.service_details_id + '/' + task.id);
    //   location.replace(window['_app_base'] + '/services/2/' + task.todo_comment + '/' + task.task_types_id + '/' + task.tasks_id + '/' + task.service_details_id + '/' + task.id)
    // } else if (task.to_screen == 'da8c5bd4-ea3d-4f02-b1b2-38cf26d6d1ff') {
    //   console.log('path else if 1 :: ', '/services/3/' + task.todo_comment + '/' + task.task_types_id + '/' + task.tasks_id + '/' + task.service_details_id + '/' + task.id);
    //   // this.router.navigateByUrl('/services/3/' + task.todo_comment + '/' + task.task_types_id + '/' + task.tasks_id + '/' + task.service_details_id + '/' + task.id);
    //   location.replace(window['_app_base'] + '/services/3/' + task.todo_comment + '/' + task.task_types_id + '/' + task.tasks_id + '/' + task.service_details_id + '/' + task.id)
    // } else if (task.to_screen == '9e0834e9-7ec2-460c-a5ed-7ade1204c7ee') {
    //   console.log('path else if 2 :: ', '/services/4/' + task.todo_comment + '/' + task.task_types_id + '/' + task.tasks_id + '/' + task.service_details_id + '/' + task.id);
    //   // this.router.navigateByUrl('/services/4/' + task.todo_comment + '/' + task.task_types_id + '/' + task.tasks_id + '/' + task.service_details_id + '/' + task.id);
    //   location.replace(window['_app_base'] + '/services/4/' + task.todo_comment + '/' + task.task_types_id + '/' + task.tasks_id + '/' + task.service_details_id + '/' + task.id)
    // } else {
    console.log(
      "path else :: ",
      "/services/1/" +
        task.todo_comment +
        "/" +
        task.task_types_id +
        "/" +
        task.tasks_id +
        "/" +
        task.service_details_id +
        "/" +
        task.id +
        "/" +
        task.to_screen
    );
    // this.router.navigateByUrl('/services/1/' + task.todo_comment + '/' + task.task_types_id + '/' + task.tasks_id + '/' + task.service_details_id + '/' + task.id + '/' + task.to_screen);
    location.replace(
      window["_app_base"] +
        "/services/1/" +
        task.todo_comment +
        "/" +
        task.task_types_id +
        "/" +
        task.tasks_id +
        "/" +
        task.service_details_id +
        "/" +
        task.id +
        "/" +
        task.to_screen
    );
    // }
    // a7a1e05e-32c2-4f44-ad58-306572c64593 for plot
    // da8c5bd4-ea3d-4f02-b1b2-38cf26d6d1ff for property
    // 9e0834e9-7ec2-460c-a5ed-7ade1204c7ee for certefcate

    // this.router.navigate(['/service/1']);
  }
}
