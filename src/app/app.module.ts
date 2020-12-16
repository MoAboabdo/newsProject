import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from "@angular/forms";







import { AppComponent } from './app.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { MainComponent } from './shared/main/main.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { SportsComponent } from './pages/sports/sports.component';
import { MiddleEastComponent } from './pages/middle-east/middle-east.component';
import { WorldComponent } from './pages/world/world.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { AngularMaterialModule } from "./angular-material.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from "./services/auth-interceptor";
import { AdminCreateComponent } from './admins/admin-create/admin-create.component';
import { CreateSportsComponent} from './pages/sports/create-sports/create-sports.component';
import { NewsCreateComponent } from './pages/world/news-create/news-create.component';





@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    MainComponent,
    RegisterComponent,
    LoginComponent,
    // SportsComponent,
    MiddleEastComponent,
    WorldComponent,
    AboutUsComponent,
    AdminCreateComponent,
    CreateSportsComponent,
    NewsCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    AngularMaterialModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
