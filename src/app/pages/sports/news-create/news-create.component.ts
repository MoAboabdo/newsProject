import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";


import { SportsService } from "../sports.service";
import { Sport } from "../sports.model";
import { mimeType } from "./mime-type.validator";
import { UserService } from "../../../services/user.service";


@Component({
  selector: 'app-create-sports',
  templateUrl: './news-create.component.html',
  styleUrls: ['./news-create.component.css']
})
export class CreateSportsComponent implements OnInit, OnDestroy {

  enteredTitle = "";
  enteredDescription = "";
  enteredArticle = "";
  sport: Sport;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private sportId: string;
  private authStatusSub: Subscription;

  constructor(
    public sportsService: SportsService,
    public route: ActivatedRoute,
    private authService: UserService) { }

  ngOnInit(): void {

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      description: new FormControl(null, { validators: [Validators.required] }),
      article: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("sportId")) {
        this.mode = "edit";
        this.sportId = paramMap.get("sportId");
        this.isLoading = true;
        this.sportsService.getSport(this.sportId).subscribe(sportData => {
          this.isLoading = false;
          this.sport = {
            id: sportData._id,
            title: sportData.title,
            description: sportData.description,
            article: sportData.article,
            imagePath: sportData.imagePath,
            creator: sportData.creator
          };
          this.form.setValue({
            title: this.sport.title,
            description: this.sport.description,
            article: this.sport.article,
            image: this.sport.imagePath
          });
        });
      } else {
        this.mode = "create";
        this.sportId = null;
      }
    });



  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string ;
    };
    reader.readAsDataURL(file);
  }

  onSaveSport() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.sportsService.addSport(
        this.form.value.title,
        this.form.value.description,
        this.form.value.article,
        this.form.value.image
      );
    } else {
      this.sportsService.updateSport(
        this.sportId,
        this.form.value.title,
        this.form.value.description,
        this.form.value.article,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
