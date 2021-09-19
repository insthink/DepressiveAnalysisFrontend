import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NZ_I18N, zh_CN} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzSliderModule} from "ng-zorro-antd/slider";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzInputModule} from "ng-zorro-antd/input";
import {NgxEchartsModule} from "ngx-echarts";

registerLocaleData(zh);

const antd = [
  NzGridModule,
  NzSliderModule,
  NzInputNumberModule,
  NzInputModule
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    ...antd
  ],
  providers: [{provide: NZ_I18N, useValue: zh_CN}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
