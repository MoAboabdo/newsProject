import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../../environments/environment";
import {MiddleEast} from "./middleEast.model";

const BACKEND_URL = environment.apiUrl + "/middleEast/";

@Injectable({
  providedIn: 'root'
})
export class MiddleEastService {

  private middleEast:MiddleEast[] = [];
  private middleEastUpdated = new Subject<{ middleEast: MiddleEast[], middleEastCount:number }>();

  constructor(private http:HttpClient, private router: Router) { }



  getMiddleEasts(middleEastPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${middleEastPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; middleEast: any; maxMiddleEast: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(middleEastData => {
          return {
            middleEast: middleEastData.middleEast.map(middleEast => {
              return {
                title: middleEast.title,
                content: middleEast.content,
                id: middleEast._id,
                imagePath: middleEast.imagePath,
                creator: middleEast.creator
                
              };
            }),
            maxMiddleEast: middleEastData.maxMiddleEast
          };
        })
      )
      .subscribe(transformedMiddleEastData => {
        this.middleEast = transformedMiddleEastData.middleEast;
        this.middleEastUpdated.next({
          middleEast: [...this.middleEast],
          middleEastCount: transformedMiddleEastData.maxMiddleEast
        });
      });
  }

  getMiddleEastUpdateListener() {
    return this.middleEastUpdated.asObservable();
  }

  getMiddleEast(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      description: string;
      article:string,
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addMiddleEast(title: string, description: string, article:string , image: File) {
    const middleEastData = new FormData();
    middleEastData.append("title", title);
    middleEastData.append("description", description);
    middleEastData.append("article", article);

    middleEastData.append("image", image, title);
    this.http
      .post<{ message: string; middleEast: MiddleEast }>(
        BACKEND_URL + "add",
        middleEastData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updateMiddleEast(id: string, title: string, description: string,article:string, image: File | string) {
    let middleEastData: MiddleEast | FormData;
    if (typeof image === "object") {
      middleEastData = new FormData();
      middleEastData.append("id", id);
      middleEastData.append("title", title);
      middleEastData.append("description", description);
      middleEastData.append("article", article);
      middleEastData.append("image", image, title);
    } else {
      middleEastData = {
        id: id,
        title: title,
        description: description,
        article: article,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + id, middleEastData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deleteMiddleEast(middleEastId: string) {
    return this.http.delete(BACKEND_URL + middleEastId);
  }

}
