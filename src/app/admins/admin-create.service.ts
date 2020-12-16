import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

import { Admin } from "./admin.model";

const BACKEND_URL = environment.apiUrl + "/admin/";

@Injectable({
  providedIn: 'root'
})
export class AdminCreateService {

  private admins: Admin[] = [];
  private adminsUpdated = new Subject<{ admins: Admin[]; adminCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getAdmins(adminsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${adminsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; admins: any; maxAdmins: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(adminData => {
          return {
            admins: adminData.admins.map(admin => {
              return {
                name: admin.name,
                email: admin.email,
                type:admin.type,
                id: admin._id,
                password:admin.password,
                creator: admin.creator
              };
            }),
            maxAdmins: adminData.maxAdmins
          };
        })
      )
      .subscribe(transformedAdminData => {
        this.admins = transformedAdminData.admins;
        this.adminsUpdated.next({
          admins: [...this.admins],
          adminCount: transformedAdminData.maxAdmins
        });
      });
  }

  getAdminUpdateListener() {
    return this.adminsUpdated.asObservable();
  }

  getAdmin(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      email: string;
      password: string;
      type:string;
      creator:string;
    }>(BACKEND_URL + id);
  }

  addAdmin(name: string, email: string,password:string,type:string) {
    const adminData = new FormData();
    adminData.append("name", name);
    adminData.append("email", email);
    adminData.append("password", password);
    adminData.append("type", type);

    this.http
      .post<{ message: string; admin: Admin }>(
        BACKEND_URL + 'add',
        adminData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updateAdmin(id: string, name: string, email: string, password: string,type:string) {
    let adminData: Admin | FormData;
    adminData = new FormData();
      adminData.append("id", id);
      adminData.append("name", name);
      adminData.append("email", email);
      adminData.append("password", password);
    adminData.append("type", type);

    this.http
      .put(BACKEND_URL + id, adminData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deleteAdmin(adminId: string) {
    return this.http.delete(BACKEND_URL + adminId);
  }


  
}
