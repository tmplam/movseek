package movie

import (
	"context"

	"github.com/tmplam/movseek/internal/models"
	"github.com/tmplam/movseek/internal/movie"
)

func (uc implUsecase) GetOneMovie(ctx context.Context, movieID string) (models.Movie, error) {
	return uc.repo.GetOneMovie(ctx, movieID)
}

func (uc implUsecase) GetMovieCredits(ctx context.Context, movieID string) (models.MovieCredits, error) {
	m, err := uc.repo.GetOneMovie(ctx, movieID)
	if err != nil {
		return models.MovieCredits{}, err
	}

	return m.Credits, nil
}

func (uc implUsecase) ListMovies(ctx context.Context, input movie.ListMoviesInput) (movie.ListMoviesOutput, error) {
	movies, err := uc.repo.ListMovies(ctx, movie.ListMoviesOptions{
		Query:  input.Query,
		Filter: input.Filter,
	})
	if err != nil {
		return movie.ListMoviesOutput{}, err
	}

	return movie.ListMoviesOutput{Movies: movies}, nil
}

func (uc implUsecase) GetUpcomingMovies(ctx context.Context, input movie.GetUpcomingMoviesInput) (movie.GetUpcomingMoviesOutput, error) {
	movies, err := uc.repo.GetUpcomingMovies(ctx, movie.GetUpcomingMoviesOptions{
		Filter: input.Filter,
	})
	if err != nil {
		return movie.GetUpcomingMoviesOutput{}, err
	}

	return movie.GetUpcomingMoviesOutput{Movies: movies}, nil
}

func (uc implUsecase) GetTrendingMovies(ctx context.Context, input movie.GetTrendingMoviesInput) (movie.GetTrendingMoviesOutput, error) {
	movies, err := uc.repo.GetTrendingMovies(ctx, movie.GetTrendingMoviesOptions{
		Filter: input.Filter,
		Type:   input.Type,
	})
	if err != nil {
		return movie.GetTrendingMoviesOutput{}, err
	}

	return movie.GetTrendingMoviesOutput{Movies: movies}, nil
}