import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent}   from './app.component';
import {AppRouterModule} from "./app-routing.module";
import {APP_BASE_HREF} from "@angular/common";
import {CharityModule} from "./comps/charity/charity.module";
import {HttpModule} from "@angular/http";
import {NotesModule} from "./comps/notes/notes.module";
import {EssayModule} from "./comps/essay/essay.module";

@NgModule({
    imports: [
        BrowserModule,
        AppRouterModule,
        HttpModule, // 如果使用http就必须注入这个。不然报错：No provider for Http!
        CharityModule,
        NotesModule,
        EssayModule
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
