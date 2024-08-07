import { Component, OnInit } from "@angular/core";
import { MyTaskService } from "../my-task.service";
import { Router } from "@angular/router";
import { ServiceService } from "../../service/service.service";
import { environment } from "src/environments/environment";
import { NgxSmartModalService } from "ngx-smart-modal";
import { NotificationsService } from "angular2-notifications";
import * as pako from 'pako';
import { error } from "console";
@Component({
  selector: "app-my-task",
  templateUrl: "./my-task.component.html",
  styleUrls: ["./my-task.component.css"],
})
export class MyTaskComponent implements OnInit {
  taskwaithing = 120;
  isAccountVisible: boolean;
  taskList;
  messageAppNo;
  loading: boolean = true;
  messageCache = [];
  messageObj = {
    userName: null,
    currentMessage: null,
    currentMessageIndex: 0,
    messages: null,
  };
  direction = {
    NEXT: "d00",
    PREV: "d01",
  };
  identifiers = [
    "2a558556-97d4-4dfb-a8a6-1cc04d2aaf12",
    "f391f658-a6cf-47dc-b844-964def4ecd56",
    "77124a10-c952-4df1-bfd7-be112e6a96ff",
    "beb66e16-8a05-41dc-9da1-cf4f540d48ff",
    "ec23ceaf-b6f7-4d99-82cc-e23ee23f0425",
    "fad61b19-b6a5-4c58-a399-eb548cedb1d2",
    "23bd7067-3a8b-43fa-a2fb-f703bc51e90e",
    "045976fa-123f-4b38-aad7-f9ec37cd11f4",
    "1d146595-11ba-4a27-bb93-e59a79d23eba"
  ];
  loadingMessage = false;
  user: any;
  user_name: any;
  lanid: string;
  AppNumber: any;
  caseUser: any;
  orgID: any;
  numberOfpick:any
  myTaskHasNoData:boolean=false;
  myTaskLoading:boolean=false;
  isRecordDes: boolean;
  constructor(
    private myTaskService: MyTaskService,
    private router: Router,
    private seice: ServiceService,
    private modal: NgxSmartModalService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    if (environment.Lang_code == "en-us") {
      this.lanid = "10D04E8B-3361-E111-95D5-00E04C05559B";
    } else {
      this.lanid = "2C2EBBEA-3361-E111-95D5-00E04C05559B";
    }
    this.numberOfpick=environment.numberOfpick
    this.seice.getUserRole().subscribe((response: any) => {
      if (response) {
        for (let index = 0; index < response.length; index++) {
          const element = response[index];

          if (
            element.RoleId == "B59EA343-65EF-4C41-95A8-02D9AD81BFCD".toLocaleLowerCase() ||
            element.RoleId == "F07A844C-E107-44AB-AA18-9D462BC7CDA3".toLocaleLowerCase()
          ) {
           
            this.isRecordDes = true;
            break;
          } else {
           
            this.isRecordDes = false;
          }
        }
      }
    });
    this.getMyTask();
    
  }
  canGo(where) {
    if (this.messageObj.messages) {
      if (where == this.direction.NEXT) {
        return (
          this.messageObj.currentMessageIndex <
          this.messageObj.messages.length - 1
        );
      } else if (where == this.direction.PREV) {
        return this.messageObj.currentMessageIndex > 0;
      }
      return false;
    } else {
      return false;
    }
  }
  isInIdentifiers(taskId: any): boolean {
    return this.identifiers.includes(taskId);
  }
  navigateMessage(direction) {
    if (
      this.messageObj.messages ? this.messageObj.messages.length > 0 : false
    ) {
      if (
        direction == this.direction.NEXT &&
        this.messageObj.currentMessageIndex < this.messageObj.messages.length
      ) {
        this.messageObj.currentMessageIndex += 1;
        this.messageObj.currentMessage =
          this.messageObj.messages[this.messageObj.currentMessageIndex][
            "remarks"
          ];
        console.log(
          "this.messageObj.currentMessageIndex",
          this.messageObj.currentMessageIndex
        );

        this.user_name =
          "Massage From: " +
          this.user[this.messageObj.currentMessageIndex].userName;
        this.messageObj.userName =
          this.user[this.messageObj.currentMessageIndex].userName;
      } else if (
        direction == this.direction.PREV &&
        this.messageObj.currentMessageIndex > 0
      ) {
        this.messageObj.currentMessageIndex -= 1;
        this.messageObj.currentMessage =
          this.messageObj.messages[this.messageObj.currentMessageIndex][
            "remarks"
          ];

        this.user_name =
          "Massage From: " +
          this.user[this.messageObj.currentMessageIndex].userName;
        this.messageObj.userName =
          this.user[this.messageObj.currentMessageIndex].userName;
      }
    }
  }

  IsLockedBy_OtherUser(task) {
    this.myTaskService.IsLockedBy_OtherUser(task.id).subscribe(
      (message) => {
        console.log(
          "🚀 ~ MyTaskComponent ~ IsLockedBy_OtherUser ~ message:",
          message
        );
        // if(task.tasks_id =="d553ccb8-e40d-4bee-9418-5754805609fd"){
        //   const warningMessage = "የሊዝ ወይም የነባር ይዞታ መመዝገቡን አረጋግጥ/Check lease or freehold record is active for this plot";
        //   const toastWarning = this.notificationsService.warn(
        //     "Warning",
        //     warningMessage
        //   );
        // this.go(task);
        // }
        // else{
        if (message == false) {
          this.myTaskService.GetgetSendPaymentReminder(task.todo_comment).subscribe(
            (message:any) => {
              if(message.Message == "0"){
                this.go(task);
              }else{
                const toastWarning = this.notificationsService.error(
                  message.Message
                );
                return;
              }
            },error => {
              this.go(task);
            //  if( error.status =="200"){
            //   if(message == true){
            //     this.go(task);
            //   }else{
            //     const toastWarning = this.notificationsService.error(
            //       message
            //     );
            //     return;
            //   }
            //  }

            })

        } else {
          const toastWarning = this.notificationsService.error(
            "Warning",
            "this task already pick by other caseworker /ይህ ተግባር አስቀድሞ በሌላ ጉዳይ ሰራተኛ ይመርጣል"
          );
          return;
        }
        //  }
      },
      (error) => {
        console.error(error);
      }
    );
  }
  openModal(id) {
    this.modal.getModal(id).open();
  }

  closeModal(id) {
    // this.modal.getModal(id).close();
    this.isAccountVisible = false;
  }

  showMessage(appNo, task) {
    if (appNo != this.messageAppNo) {
      let messageInCache = false;
      // this.loadingMessage = true;
      this.isAccountVisible = true;
      this.messageObj.currentMessage = null;
      this.messageObj.currentMessageIndex = 0;
      this.messageObj.messages = null;

      this.messageCache.some((message) => {
        if (message["appNo"] == appNo) {
          messageInCache = true;
          this.messageObj.messages = message["messages"];
          if (this.messageObj.messages) {
            this.messageObj.currentMessage =
              this.messageObj.messages[0]["remarks"];
          }
          this.loadingMessage = false;
          return true;
        }
        return false;
      });

      if (!messageInCache) {
        this.user = [];
        this.user_name = null;
        this.seice.GetNote(appNo).subscribe(
          (result) => {
            console.log("messagesss", result);

            this.messageObj.messages = result;

            if (this.messageObj.messages) {
              console.log(
                "this.messageObj.messages",
                this.messageObj.messages[0].remarks
              );

              this.messageCache.push({
                appNo: this.messageAppNo,
                messages: result,
              });
              this.AppNumber = appNo;
              this.myTaskService
                .getViewAspNetUsersWorkInfoDetail(appNo)
                .subscribe((res) => {
                  console.log("this.messageObj.userName+i", res);

                  this.user = res;
                  this.user_name = "Massage From: " + this.user[0].userName;
                  this.messageObj.userName = this.user[0].userName;
                  console.log("userrrr", this.messageObj.userName);
                  this.messageObj.currentMessage =
                    this.messageObj.messages[0]["remarks"];
                });
            }
            this.loadingMessage = false;
          },
          (error) => {
            this.loadingMessage = false;
            console.error("message error :: ", error);
          }
        );
      }
    }
    this.openModal("messages");
    this.messageAppNo = appNo;
  }

  // async getMyTask() {
  //   //var userInfo = await this.seice.getViewAspNetUsersWorkInfoDetail(environment.username).toPromise();
  //   //var orgid= userInfo[0].organization_code;
  //   // this.seice
  //   //   .getUserInfoByUserName(environment.username)
  //   //   .subscribe((uname) => {
  //   //     this.caseUser = uname[0];
  //   //     this.orgID = this.caseUser.organization_code;

  //   var orgid = "00000000-0000-0000-0000-000000000000";
  //   //var orgid = "24d45c72-8088-4591-810a-bc674f9f0a57";

  //   this.myTaskService.getMytaskss(orgid, this.lanid).subscribe(
  //     (taskList) => {
  //       this.taskList = taskList;
  //       this.taskList = Object.assign([], this.taskList.Table1);

  //       console.log("taskList", taskList);
  //       console.log("dcument id", this.seice.docId);
  //       this.taskList.sort((b, a) => {
  //         if (a.start_date > b.start_date) {
  //           return -1;
  //         } else if (a.start_date < b.start_date) {
  //           return 1;
  //         } else {
  //           return 0;
  //         }
  //       });

  //       let num = 1;
  //       (this.taskList as Array<any>).map((task) => (task["number"] = num++));
  //       const uniqueJobMatchIDs = {};
  //       const uniqueData = this.taskList.filter((item) => {
  //         if (!uniqueJobMatchIDs[item.todo_comment]) {
  //           uniqueJobMatchIDs[item.todo_comment] = true;
  //           return true;
  //         }
  //         return false;
  //       });
  //       for (let i = 0; i < this.taskList.length; i++) {
  //         this.seice.docId = this.taskList[i].service_details_id;
  //       }
  //       this.taskList = uniqueData;
  //       this.loading = false;
  //     },
  //     (error) => {
  //       console.log("error");
  //       this.loading = false;
  //     }
  //   );
  //   // });
  // }

  filterByUserId(checked: boolean) {
    if (checked) {
      // Filter out tasks where userId is not equal to '00000000-0000-0000-0000-000000000000'
      this.taskList = this.taskList.filter(task => task.userId !== '00000000-0000-0000-0000-000000000000');
    } else {
      // Reset to display all tasks
      this.getMyTask();
    }
  }
  async getMyTask() {
    this.myTaskLoading=true;
    //var userInfo = await this.seice.getViewAspNetUsersWorkInfoDetail(environment.username).toPromise();
    //var orgid= userInfo[0].organization_code;
    // this.seice
    //   .getUserInfoByUserName(environment.username)
    //   .subscribe((uname) => {
    //     this.caseUser = uname[0];
    //     this.orgID = this.caseUser.organization_code;

    var orgid = "00000000-0000-0000-0000-000000000000";
    //var orgid = "24d45c72-8088-4591-810a-bc674f9f0a57";

    this.myTaskService.getcompressedtodolist(orgid, this.lanid).subscribe(
      (taskList) => {
        console.log('compressed todo:', taskList);

        const compressedData = taskList['table1'];
        
        // Decode the base64 encoded compressed data
        const decodedData = atob(compressedData);
        
        // Convert the decoded data to a Uint8Array
        const uint8Array = new Uint8Array(decodedData.length);
        for (let i = 0; i < decodedData.length; ++i) {
          uint8Array[i] = decodedData.charCodeAt(i);
        }
        
        // Decompress the data using pako
        const inflatedData = pako.inflate(uint8Array, { to: 'string' });
        
        // Parse the decompressed JSON string
        const todoList = JSON.parse(inflatedData);
        
        // Wrap the array inside an object with key "Table1"
        const formattedTodoList = { Table1: todoList };
        
        console.log('formatted todo list:', formattedTodoList);
        
        this.taskList = Object.assign([],formattedTodoList.Table1);

        console.log("taskList", taskList);
        console.log("dcument id", this.seice.docId);
        // this.taskList.sort((b, a) => {
        //   if (a.start_date > b.start_date) {
        //     return -1;
        //   } else if (a.start_date < b.start_date) {
        //     return 1;
        //   } else {
        //     return 0;
        //   }
          
        // });
        // this.taskList.sort((b, a) => {
        //   if (a.Estimated_minute_To_Finsh_This_Tasks > b.Estimated_minute_To_Finsh_This_Tasks) {
        //     return -1;
        //   } else if (a.Estimated_minute_To_Finsh_This_Tasks < b.Estimated_minute_To_Finsh_This_Tasks) {
        //     return 1;
        //   } else {
        //     return 0;
        //   }
          
        // });

        let num = 1;
        (this.taskList as Array<any>).map((task) => (task["number"] = num++));
        const uniqueJobMatchIDs = {};
        const uniqueData = this.taskList.filter((item) => {
          if (!uniqueJobMatchIDs[item.todo_comment]) {
            uniqueJobMatchIDs[item.todo_comment] = true;
            return true;
          }
          return false;
        });
        this.myTaskLoading=false;
        for (let i = 0; i < this.taskList.length; i++) {
          this.seice.docId = this.taskList[i].service_details_id;
        }
        this.taskList = uniqueData;
        this.loading = false;

        if(this.taskList.length==0){
          this.myTaskHasNoData=true;
        }else{
          this.myTaskHasNoData=false;
        }
      },
      (error) => {
        this.myTaskLoading=false;
        console.log("error");
        this.loading = false;
      }
    );
    // });
  }

  go(task) {
    console.log("task.to_screen", task.to_screen);

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
    //this.showMessage(task.todo_comment, task);
    // }
    // a7a1e05e-32c2-4f44-ad58-306572c64593 for plot
    // da8c5bd4-ea3d-4f02-b1b2-38cf26d6d1ff for property
    // 9e0834e9-7ec2-460c-a5ed-7ade1204c7ee for certefcate

    // this.router.navigate(['/service/1']);
  }
}
