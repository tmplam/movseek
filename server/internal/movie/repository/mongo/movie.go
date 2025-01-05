package mongo

import (
	"context"
	"fmt"

	"github.com/tmplam/movseek/internal/models"
	"github.com/tmplam/movseek/internal/movie"
	"github.com/tmplam/movseek/internal/movie/repository"
	"github.com/tmplam/movseek/pkg/mongo"
	"go.mongodb.org/mongo-driver/bson"
)

const (
	movieCollection        = "movies"
	upcomingCollection     = "movies_upcoming"
	weekTrendingCollection = "movies_trending_week"
	dayTrendingCollection  = "movies_trending_day"
	topRatedCollection     = "movies_top_rated"
	popularCollection      = "movies_popular"
	genresCollection       = "movie_genres"
)

func (repo implRepository) getMovieCollection() mongo.Collection {
	return repo.db.Collection(movieCollection)
}

func (repo implRepository) getUpcomingCollection() mongo.Collection {
	return repo.db.Collection(upcomingCollection)
}

func (repo implRepository) getTrendingCollection(t string) mongo.Collection {
	return repo.db.Collection(fmt.Sprintf("movies_trending_%s", t))
}

func (repo implRepository) getTopRatedCollection() mongo.Collection {
	return repo.db.Collection(topRatedCollection)
}

func (repo implRepository) getPopularCollection() mongo.Collection {
	return repo.db.Collection(popularCollection)
}

func (repo implRepository) getGenresCollection() mongo.Collection {
	return repo.db.Collection(genresCollection)
}

func (repo implRepository) GetOneMovie(ctx context.Context, movieID string) (models.Movie, error) {
	col := repo.getMovieCollection()

	queryFilter, err := repo.buildMovieQuery(movieID)
	if err != nil {
		return models.Movie{}, err
	}

	var m = models.Movie{}
	err = col.FindOne(ctx, queryFilter).Decode(&m)
	if err != nil {
		return models.Movie{}, repository.MapError(err)
	}

	return m, err
}

func (repo implRepository) ListMovies(ctx context.Context, input movie.ListMoviesOptions) ([]models.Movie, error) {
	col := repo.getMovieCollection()

	queryFilter := repo.buildListMoviesQuery(input)

	findOptions := repo.buildGetMovieFindOptions(input.Filter)

	cursor, err := col.Find(ctx, queryFilter, findOptions)
	if err != nil {
		return []models.Movie{}, err
	}

	var movies []models.Movie
	err = cursor.All(ctx, &movies)
	if err != nil {
		return []models.Movie{}, err
	}

	return movies, nil
}

func (repo implRepository) GetUpcomingMovies(ctx context.Context, input movie.GetUpcomingMoviesOptions) ([]models.MovieSummary, error) {
	col := repo.getUpcomingCollection()

	findOptions := repo.buildGetMovieFindOptions(input.Filter)

	cursor, err := col.Find(ctx, bson.M{}, findOptions)
	if err != nil {
		return []models.MovieSummary{}, err
	}

	var movies []models.MovieSummary
	err = cursor.All(ctx, &movies)
	if err != nil {
		return []models.MovieSummary{}, err
	}

	return movies, nil
}

func (repo implRepository) GetTrendingMovies(ctx context.Context, input movie.GetTrendingMoviesOptions) ([]models.MovieSummary, error) {
	col := repo.getTrendingCollection(input.Type)

	findOptions := repo.buildGetMovieFindOptions(input.Filter)

	cursor, err := col.Find(ctx, bson.M{}, findOptions)
	if err != nil {
		return []models.MovieSummary{}, err
	}

	var movies []models.MovieSummary
	err = cursor.All(ctx, &movies)
	if err != nil {
		return []models.MovieSummary{}, err
	}

	return movies, nil
}

func (repo implRepository) GetTopRatedMovies(ctx context.Context, input movie.GetTopRatedMoviesOptions) ([]models.MovieSummary, error) {
	col := repo.getTopRatedCollection()

	findOptions := repo.buildGetMovieFindOptions(input.Filter)

	cursor, err := col.Find(ctx, bson.M{}, findOptions)
	if err != nil {
		return []models.MovieSummary{}, err
	}

	var movies []models.MovieSummary
	err = cursor.All(ctx, &movies)
	if err != nil {
		return []models.MovieSummary{}, err
	}

	return movies, nil
}

func (repo implRepository) GetPopularMovies(ctx context.Context, input movie.GetPopularMoviesOptions) ([]models.MovieSummary, error) {
	col := repo.getPopularCollection()

	findOptions := repo.buildGetMovieFindOptions(input.Filter)

	cursor, err := col.Find(ctx, bson.M{}, findOptions)
	if err != nil {
		return []models.MovieSummary{}, err
	}

	var movies []models.MovieSummary
	err = cursor.All(ctx, &movies)
	if err != nil {
		return []models.MovieSummary{}, err
	}

	return movies, nil
}

func (repo implRepository) GetMovieGenres(ctx context.Context) ([]models.MovieGenre, error) {
	col := repo.getGenresCollection()

	cursor, err := col.Find(ctx, bson.M{})
	if err != nil {
		return []models.MovieGenre{}, err
	}

	var genres []models.MovieGenre
	err = cursor.All(ctx, &genres)
	if err != nil {
		return []models.MovieGenre{}, err
	}

	return genres, nil
}
