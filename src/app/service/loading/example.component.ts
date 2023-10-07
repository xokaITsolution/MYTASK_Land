import { Component, OnInit } from "@angular/core";
import { LoadingExampleService } from "./loadingExample.service";
import { environment } from "../../../environments/environment";
@Component({
  selector: "app-example",
  templateUrl: "./example.component.html",
  styleUrls: ["./example.component.css"],
})
export class ExampleComponent implements OnInit {
  constructor(private loadingService: LoadingExampleService) {}

  ngOnInit() {
    this.loadingService.show;
  }

  imgclock = environment.imagepathclock;

  updateClock() {
    const now = new Date();
    const hours = now.getHours() % 12; // Convert to 12-hour format
    const minutes = now.getMinutes();

    const hourHand = document.querySelector(".hour-hand") as HTMLElement;
    const minuteHand = document.querySelector(".minute-hand") as HTMLElement;

    const hourAngle = (360 / 12) * hours + (360 / 12) * (minutes / 60);
    const minuteAngle = (360 / 60) * minutes;

    hourHand.style.transform = `rotate(${hourAngle}deg)`;
    minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
  }
}
