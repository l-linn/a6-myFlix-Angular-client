import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

// Components
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';
import { GenreInfoComponent } from '../genre-info/genre-info.component';

// Import to bring in the API call created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// Import to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
/**
 * UserProfileComponent is a component that handles user profile related operations.
 * It allows users to view and update their profile, view their favorite movies, add or remove movies from their favorites, and delete their account.
 * It also provides dialogues for viewing genre, director, and movie synopsis information.
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  /**
   * Input decorator is used to create custom properties for the UserProfileComponent which can be binded in the parent component.
   */
  @Input() userData = { username: '', email: '', birthday: '', favorites: [] };
  formUserData = { username: '', email: '', birthday: '', favorites: [] };

  /**
   * User and movies are used to store the user's profile and movies data respectively.
   */
  user: any = {};
  movies: any[] = [];
  favorites: any[] = [];

  /**
   * Constructor for the UserProfileComponent.
   * It injects the FetchApiDataService, MatDialog, MatSnackBar, and Router services.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) {}

  /**
   * ngOnInit is a lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.getProfile();
    this.getFavMovies();
  }

  /**
   * getProfile method fetches the user's profile information and favorite movies.
   */
  getProfile(): void {
    this.fetchApiData.getOneUser().subscribe((response) => {
      console.log('response:', response);
      this.user = response;
      this.userData.username = this.user.username;
      this.userData.email = this.user.email;
      this.userData.birthday = this.user.birthbay;
      this.userData.username = this.user.username;
      this.formUserData = { ...this.userData };
      this.favorites = this.user.favorites;
    });
    this.fetchApiData.getAllMovies().subscribe((response) => {
      this.favorites = response.filter((movie: any) =>
        this.favorites.includes(movie._id)
      );
    });
  }

  /**
   * Function to get user's favorite movies
   * @returns user's favorite movies
   */
  getFavMovies(): void {
    this.user = this.fetchApiData.getOneUser();
    this.userData.favorites = this.user.favorites;
    this.favorites = this.user.favorites;
    console.log('Fav Movies in getFavMovie', this.favorites);
  }

  /**
   * isFav method checks if a movie is in the user's favorite movies list.
   */
  isFav(movie: any): any {
    const MovieID = movie._id;
    if (this.favorites.some((movie) => movie === MovieID)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * toggleFav method adds or removes a movie from the user's favorite movies list.
   */
  toggleFav(movie: any): void {
    console.log('toggleFav called with movie:', movie);
    const isFavorite = this.isFav(movie);
    console.log('isFavorite:', isFavorite);
    isFavorite ? this.deleteFavMovies(movie) : this.addFavMovies(movie);
  }

  /**
   * addFavMovies method adds a movie to the user's favorite movies list.
   */
  addFavMovies(movie: any): void {
    console.log('addFavMovies called with movie:', movie);
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      console.log('user:', parsedUser);

      this.fetchApiData.addfavoriteMovies(movie._id).subscribe((Resp) => {
        console.log('server response:', Resp);
        localStorage.setItem('user', JSON.stringify(Resp));
        this.getFavMovies();
        this.snackBar.open(
          `${movie.title} has been added to your favorites`,
          'OK',
          {
            duration: 3000,
          }
        );
      });
    }
  }

  /**
   * updateUser method updates the user's profile information.
   */
  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe(
      (result) => {
        console.log('User update success:', result);
        localStorage.setItem('user', JSON.stringify(result));
        this.snackBar.open('User update successful', 'OK', {
          duration: 2000,
        });
      },
      (error) => {
        console.error('Error updating user:', error);
        this.snackBar.open('Failed to update user', 'OK', {
          duration: 2000,
        });
      }
    );
  }

  /**
   * deleteUser method deletes the user's account.
   */
  deleteUser(): void {
    this.router.navigate(['welcome']).then(() => {
      localStorage.clear();
      this.snackBar.open('User successfully deleted.', 'OK', {
        duration: 2000,
      });
    });
    this.fetchApiData.deleteOneUser().subscribe((result) => {
      console.log(result);
    });
  }

  /**
   * Function to get all movies from the database
   * @returns all movies
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * openGenreDialog, openDirectorDialog, and openSynopsisDialog methods open dialogues for viewing genre, director, and movie synopsis information respectively.
   */
  openDirectorDialog(
    name: string,
    bio: string,
    country: string,
    birthYear: number,
    deathYear: number
  ): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        name: name,
        bio: bio,
        country: country,
        birthYear: birthYear,
        deathYear: deathYear,
      },
      width: '450px',
    });
  }

  openGenreDialog(type: string, description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        type: type,
        description: description,
      },
      width: '450px',
    });
  }

  openSynopsisDialog(description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        description: description,
      },
      width: '450px',
    });
  }

  /**
   * deleteFavMovies method removes a movie from the user's favorite movies list.
   */
  deleteFavMovies(movie: any): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      this.fetchApiData.deleteFavoriteMovie(movie._id).subscribe((Resp) => {
        localStorage.setItem('user', JSON.stringify(Resp));
        this.getFavMovies();
        this.snackBar.open(
          `${movie.title} has been removed from your favorites`,
          'OK',
          {
            duration: 3000,
          }
        );
      });
    }
  }
}
