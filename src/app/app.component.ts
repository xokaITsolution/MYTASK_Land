import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LoadingBarService } from "./loading-bar/loading-bar.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "MyTask";
  langs = [
    { key: "en", lang: "english" },
    { key: "am", lang: "amharic" },
  ];
  LangID = "en";
  Lang: any;

  constructor(
    private translate: TranslateService,
    public loadingBarService: LoadingBarService
  ) {
    this.Lang = window["lang"];
    console.log("lang", window["lang"]);

    if (this.Lang == "am-ET" || this.Lang == "am-et") {
      translate.setDefaultLang("am");
    } else {
      translate.setDefaultLang("en");
    }
  }

  changlang(lang) {
    console.log("lang", lang);
    this.translate.use(lang);
  }
}
