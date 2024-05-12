import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
/**
 * @description Component representing the director info dialog.
 * @selector 'app-director-info'
 * @templateUrl './director-info.component.html'
 * @styleUrls ['./director-info.component.scss']
 */
@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrls: ['./director-info.component.scss'],
})
export class DirectorInfoComponent implements OnInit {
  /**
   * Constructor for the DirectorInfoComponent.
   *
   * @param data - The data of the director to be displayed. Injected via Angular's dependency injection.
   * @property name - The name of the director.
   * @property bio - The biography of the director.
   * @property birthYear - The birth date of the director.
   * @property deathYear - The death date of the director.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      name: string;
      bio: string;
      country: string;
      birthYear: number;
      deathYear: number;
    }
  ) {}

  ngOnInit(): void {}
}
