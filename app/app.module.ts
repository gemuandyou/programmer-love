import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent}   from './app.component';
import {AppRouterModule} from "./app-routing.module";
import {APP_BASE_HREF} from "@angular/common";
import {CharityModule} from "./comps/charity/charity.module";
@NgModule({
    imports: [
        BrowserModule,
        AppRouterModule,
        CharityModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        {provide: APP_BASE_HREF, useValue: '/'}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
