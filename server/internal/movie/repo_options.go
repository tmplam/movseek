package movie

type ListMoviesOptions struct {
	Query  string
	Filter GetMovieFilter
}

type GetUpcomingMoviesOptions struct {
	Filter GetMovieFilter
}

type GetTrendingMoviesOptions struct {
	Filter GetMovieFilter
	Type   string
}

type GetNowPlayingMoviesOptions struct {
	Filter GetMovieFilter
}

type GetTopRatedMoviesOptions struct {
	Filter GetMovieFilter
}

type GetPopularMoviesOptions struct {
	Filter GetMovieFilter
}
