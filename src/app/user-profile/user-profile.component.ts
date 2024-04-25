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

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  @Input() userData = { username: '', email: '', birthday: '', favorites: [] };
  formUserData = { username: '', email: '', birthday: '', favorites: [] };

  user: any = {};
  movies: any[] = [];
  favorites: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProfile();
    this.getFavMovies();
  }

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

  getFavMovies(): void {
    this.user = this.fetchApiData.getOneUser();
    this.userData.favorites = this.user.favorites;
    this.favorites = this.user.favorites;
    console.log('Fav Movies in getFavMovie', this.favorites);
  }

  isFav(movie: any): any {
    const MovieID = movie._id;
    if (this.favorites.some((movie) => movie === MovieID)) {
      return true;
    } else {
      return false;
    }
  }
  toggleFav(movie: any): void {
    console.log('toggleFav called with movie:', movie);
    const isFavorite = this.isFav(movie);
    console.log('isFavorite:', isFavorite);
    isFavorite ? this.deleteFavMovies(movie) : this.addFavMovies(movie);
  }

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

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

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
