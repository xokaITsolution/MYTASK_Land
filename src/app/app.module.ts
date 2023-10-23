import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from "@angular/common/http";

import { MyTaskModule } from "./my-task/my-task.module";
import { ServiceModule } from "./service/service.module";
import { APP_BASE_HREF } from "@angular/common";
import { ModalModule } from "ngx-bootstrap/modal";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { NgxSpinnerModule } from "ngx-spinner";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { SimpleNotificationsModule } from "angular2-notifications";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HomeComponent } from "./home/home.component";
import { FetchDataComponent } from "./fetch-data/fetch-data.component";
import { CounterComponent } from "./counter/counter.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { GeojsondeskComponent } from "./components/geojsondesk/geojsondesk.component";
import { DrawmapComponent } from "./components/drawmap/drawmap.component";
import {
  MatIconModule,
  MatPaginatorModule,
  MatSelectModule,
  MatTableModule,
} from "@angular/material";
import { environment } from "src/environments/environment";
import { LoadingBarComponent } from "./loading-bar/loading-bar.component";
import { LoadingBarService } from "./loading-bar/loading-bar.service";
import { LoadingBarInterceptor } from "./loading-bar/loading-bar-interceptor";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FetchDataComponent,
    CounterComponent,
    NavMenuComponent,
    GeojsondeskComponent,
    DrawmapComponent,
    LoadingBarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,

    // HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {dataEncapsulation: false}),
    AngularFontAwesomeModule,
    ServiceModule,
    MyTaskModule,
    ModalModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatSelectModule,
    MatIconModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: window["_app_base"] },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingBarInterceptor,
      multi: true,
    },
    LoadingBarService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.phisicalPath, ".json");
}
