import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DirectorInfoComponent } from '../director-info/director-info.component';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';

import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  user = JSON.parse(localStorage.getItem('user') || '');
  userData = { username: '', favorites: [] };
  favorites: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAllMovies();
    this.getFavMovies();
  }

  getAllMovies(): void {
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

  getFavMovies(): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);

      this.userData.favorites = parsedUser.favorites;
      this.favorites = parsedUser.favorites;
    }
    console.log('Favorite Movies:', this.favorites);
  }

  isFav(movie: any): boolean {
    return this.favorites.includes(movie._id);
    // const MovieID = movie._id;
    // if (this.favorites.some((movie) => movie == MovieID)) {
    //   return true;
    // } else {
    //   return false;
    // }
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
