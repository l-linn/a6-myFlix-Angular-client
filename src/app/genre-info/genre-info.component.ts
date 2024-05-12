import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
/**
 * @Component decorator that specifies the Angular metadata for the component.
 *
 * @selector app-genre-info - The name of the HTML tag where this component will be inserted.
 * @templateUrl ./genre-info.component.html - The location of the component's template file.
 * @styleUrls ./genre-info.component.scss - The location of the component's private CSS styles.
 */

/**
 * Component for displaying genre information.
 */
@Component({
  selector: 'app-genre-info',
  templateUrl: './genre-info.component.html',
  styleUrls: ['./genre-info.component.scss'],
})
export class GenreInfoComponent implements OnInit {
  /**
   * Constructor for the GenreInfoComponent.
   *
   * @param data - The data of the genre to be displayed. Injected via Angular's dependency injection.
   * @property type - The name of the genre.
   * @property description - The description of the genre.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      type: string;
      description: string;
    }
  ) {}

  ngOnInit(): void {}
}
