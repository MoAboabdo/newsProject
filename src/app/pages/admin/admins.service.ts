import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../../environments/environment";
import { Admin } from './admins.model';

const BACKEND_URL = environment.apiUrl + "/admin/";


@Injectable({
  providedIn: 'root'
})
export class AdminsService {

  private admin:Admin[] = [];
  private adminUpdated = new Subject<{ admin: Admin[], adminCount:number }>();

  constructor(private http:HttpClient, private router: Router) { }

  getadmins(adminPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${adminPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; admin: any; maxAdmin: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(adminData => {
          return {
            admin: adminData.admin.map(admin => {
              return {
                name: admin.name,
                email: admin.email,
                id: admin._id,
                password: admin.password,
                avatar:admin.avatar,
                type:admin.type
                
              };
            }),
            maxAdmin: adminData.maxAdmin
          };
        })
      )
      .subscribe(transformedAdminData => {
        this.admin = transformedAdminData.admin;
        this.adminUpdated.next({
          admin: [...this.admin],
          adminCount: transformedAdminData.maxAdmin
        });
      });
  }

  getAdminUpdateListener() {
    return this.adminUpdated.asObservable();
  }

  getAdmin(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      type: string;
      email:string,
      password: string;
      avatar: string;
    }>(BACKEND_URL + id);
  }

  addAdmin(name: string, email: string, type:string , password: string) {
    const adminData = new FormData();
    adminData.append("name", name);
    adminData.append("email", email);
    adminData.append("password", password);
    adminData.append("type",type);
    this.http
      .post<{ message: string; admin: Admin }>(
        BACKEND_URL + "add",
        adminData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updateAdmin(id: string, name: string, email: string, type:string , password: string) {
    let adminData: Admin | FormData;
    adminData = new FormData();
    adminData.append("id", id);
    adminData.append("name", name);
    adminData.append("email", email);
    adminData.append("password", password);
    adminData.append("type",type);

    this.http
      .patch(BACKEND_URL + id, adminData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deleteAdmin(adminId: string) {
    return this.http.delete(BACKEND_URL + adminId);
  }
}
