import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCreateComponent } from './admins/admin-create/admin-create.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { LoginComponent } from './pages/login/login.component';
import { MiddleEastComponent } from './pages/middle-east/middle-east.component';
import { RegisterComponent } from './pages/register/register.component';
import { CreateSportsComponent } from './pages/sports/create-sports/create-sports.component';
import { NewsCreateComponent } from './pages/world/news-create/news-create.component';
import { MainComponent } from './shared/main/main.component';

const routes: Routes = [
  {path:'signup', component:RegisterComponent},
  {path:'login', component:LoginComponent},
  {path:'',component:MainComponent},
  {path:'middleEast',component:MiddleEastComponent},
  {path:'aboutus',component:AboutUsComponent},
  {path:'admin/createAdmin',component:AdminCreateComponent},
  {path:'sports/createSportsNews',component:CreateSportsComponent},
  {path:'world/createWorldNews',component:NewsCreateComponent},
  {path:'middleEast/createNews',component:MiddleEastComponent}



  





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }