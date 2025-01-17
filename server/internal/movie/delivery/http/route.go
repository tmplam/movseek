package http

import "github.com/gin-gonic/gin"

func (h handlerImpl) MapRoutes(r *gin.RouterGroup) {
	r.GET("/search/movie", h.searchMovies)

	movie := r.Group("/movie")
	movie.GET("/:id", h.getOneMovie)
	movie.GET("/:id/credits", h.getMovieCredits)
	movie.GET("/:id/videos", h.getMovieVideos)
	movie.GET("/:id/keywords", h.getMovieKeywords)
	movie.GET("/upcoming", h.getUpcomingMovies)
	movie.GET("/trending/:type", h.getTrendingMovies)
	movie.GET("/top-rated", h.getTopRatedMovies)
	movie.GET("/popular", h.getPopularMovies)
	movie.GET("/now-playing", h.getNowPlayingMovies)
	movie.GET("/genres", h.getMovieGenres)
	movie.GET("/trailer/latest", h.getLastestTrailer)
}
