import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../../environments/environment";
import {World} from "./world.model";

const BACKEND_URL = environment.apiUrl + "/world/";

@Injectable({
  providedIn: 'root'
})
export class WorldService {

  private world:World[] = [];
  private worldUpdated = new Subject<{ world: World[], worldCount:number }>();

  constructor(private http:HttpClient, private router: Router) { }

  getWorlds(worldPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${worldPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; world: any; maxWorld: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(worldData => {
          return {
            world: worldData.world.map(world => {
              return {
                title: world.title,
                content: world.content,
                id: world._id,
                imagePath: world.imagePath,
                creator: world.creator
                
              };
            }),
            maxWorld: worldData.maxWorld
          };
        })
      )
      .subscribe(transformedWorldData => {
        this.world = transformedWorldData.world;
        this.worldUpdated.next({
          world: [...this.world],
          worldCount: transformedWorldData.maxWorld
        });
      });
  }

  getWorldUpdateListener() {
    return this.worldUpdated.asObservable();
  }

  getWorld(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      description: string;
      article:string,
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addWorld(title: string, description: string, article:string , image: File) {
    const worldData = new FormData();
    worldData.append("title", title);
    worldData.append("description", description);
    worldData.append("article", article);

    worldData.append("image", image, title);
    this.http
      .post<{ message: string; world: World }>(
        BACKEND_URL + "add",
        worldData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updateWorld(id: string, title: string, description: string,article:string, image: File | string) {
    let worldData: World | FormData;
    if (typeof image === "object") {
      worldData = new FormData();
      worldData.append("id", id);
      worldData.append("title", title);
      worldData.append("description", description);
      worldData.append("article", article);
      worldData.append("image", image, title);
    } else {
      worldData = {
        id: id,
        title: title,
        description: description,
        article: article,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + id, worldData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deleteWorld(worldId: string) {
    return this.http.delete(BACKEND_URL + worldId);
  }

}
