import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { LoginComponent } from './pages/login/login.component';
import { MiddleEastComponent } from './pages/middle-east/middle-east.component';
import { RegisterComponent } from './pages/register/register.component';
import { SportsComponent } from './pages/sports/sports.component';
import { WorldComponent } from './pages/world/world.component';
import { MainComponent } from './shared/main/main.component';

const routes: Routes = [
  {path:'signup', component:RegisterComponent},
  {path:'login', component:LoginComponent},
  {path:'',component:MainComponent},
  {path:'middleEast',component:MiddleEastComponent},
  {path:'sports',component:SportsComponent},
  {path:'world',component:WorldComponent},
  {path:'aboutus',component:AboutUsComponent},




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }