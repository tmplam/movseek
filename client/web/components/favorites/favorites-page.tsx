'use client';

import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { User } from '@clerk/nextjs/server';
import { formatTimestampWithSuffix } from '@/utils/util-functions/favorites-page';
import Rating from '@/components/movie/rating';
import { MovieListResults } from '@/models/movie-list-types';
import { fetchMoviePopular } from '@/apis/movie-list';
import Loading from '@/app/(main)/loading';
import FavoriteMovieCard from '@/components/favorites/favorite-movie-card';
import PaginationCustom from '@/components/favorites/pagination';
import { fetchTVPopular } from '@/apis/tv-list';
import { TVListResults } from '@/models/tv-list-types';
import FavoriteTVCard from '@/components/favorites/favorite-tv-card';

interface FavoritesPageProps {
  user: User | null;
}

const isValidType = (value: string | null): value is 'movie' | 'tv' => ['movie', 'tv'].includes(value ? value : '');

const FavoritesPage: React.FC<FavoritesPageProps> = ({ user }) => {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const type = searchParams.get('type');
  const [src, setSrc] = useState(user?.imageUrl);
  const [movieResults, setMovieResults] = useState<MovieListResults | null>(null);
  const [tvResults, setTVResults] = useState<TVListResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isNewAcsess, setIsNewAcsess] = useState(true);
  const [mode, setMode] = useState<'movie' | 'tv'>(isValidType(type) ? type : 'movie');
  const [transitioning, setTransitioning] = useState(false);

  const fetchData = async (page: string | null, isChangeMode: boolean) => {
    try {
      setLoading(true);
      if (mode == 'movie' || !isChangeMode) {
        const movieResponse = await fetchMoviePopular(page != null ? parseInt(page) : 1);
        setMovieResults(movieResponse.data);
      }
      if (mode == 'tv' || !isChangeMode) {
        const tvResponse = await fetchTVPopular(page != null ? parseInt(page) : 1);
        setTVResults(tvResponse.data);
      }
    } catch (err) {
      console.log(err);
      setIsError(true);
    } finally {
      setTransitioning(true);
      setTimeout(() => {
        setLoading(false);
        setTransitioning(false);
      }, 500);
    }
  };

  useEffect(() => {
    fetchData(page, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const updateUrl = (key: string, value: string | null) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    window.history.replaceState({}, '', url);
  };

  // Gọi hàm khi mode thay đổi
  useEffect(() => {
    if (!isNewAcsess) {
      updateUrl('type', mode);
      updateUrl('page', null);
      fetchData('1', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const handleChangeMode = (newMode: 'movie' | 'tv') => {
    if (mode != newMode) {
      setIsNewAcsess(false);
      setMode(newMode);
    }
  };

  if (isError)
    return (
      <h1 className="container mx-auto mt-5 font-bold text-2xl">Uh-oh! Something went wrong. Please try later!!!</h1>
    );

  return (
    <div className="text-center font-geist">
      <div className="relative py-10 px-5 shadow-lg bg-indigo-500 text-center">
        <div className="absolute z-0 inset-0 bg-black/70"></div>
        <div className="relative flex items-center gap-10 z-10 container mx-auto">
          <Image
            src={src ? src : '/poster-default.svg'}
            alt={user?.firstName || 'Avatar'}
            className="w-40 h-40 rounded-full my-4"
            width={400}
            height={400 * 1.618}
            onError={() => setSrc('/poster-default.svg')}
            priority
          />
          <div className="flex flex-col gap-5 text-white">
            <div className="flex gap-5 items-end">
              <div className="text-4xl font-bold">{`${user?.firstName} ${user?.lastName}`}</div>
              <div className="text-xl text-gray-200">{`Member since ${formatTimestampWithSuffix(
                user?.lastActiveAt,
              )}`}</div>
            </div>
            <div className="flex gap-8 items-center">
              <div className="relative w-fit">
                <Rating rating={10} />
              </div>
              <div className="flex flex-col items-start text-lg font-bold mr-4">
                <div>Average</div>
                <div>Movie Score</div>
              </div>
              <div className="border-l-2 border-white h-14 mx-2"></div>
              <div className="relative w-fit">
                <Rating rating={10} />
              </div>
              <div className="flex flex-col items-start text-lg font-bold mr-4">
                <div>Average</div>
                <div>TV Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <main className="flex-grow text-black">
          <section className="container py-6">
            <div className="flex justify-between items-end content-center py-3 mb-5">
              <div className="flex items-start content-center gap-10">
                <h1 className="text-4xl text-start font-bold mr-14">My Favorites</h1>
                <div
                  className={`hover:cursor-pointer flex items-end gap-4 ${
                    mode == 'movie' && 'border-b-4 border-primary'
                  }`}
                  onClick={() => handleChangeMode('movie')}
                >
                  <div className="text-2xl">Movies</div>
                  <div className="text-lg text-primary">{movieResults?.total_results}</div>
                </div>
                <div
                  className={`hover:cursor-pointer flex items-end gap-4 ${mode == 'tv' && 'border-b-4 border-primary'}`}
                  onClick={() => handleChangeMode('tv')}
                >
                  <div className="text-2xl">TV Series</div>
                  <div className="text-lg text-primary">{tvResults?.total_results}</div>
                </div>
              </div>
            </div>
            <div className={`relative transition-opacity duration-500 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
              {mode == 'movie' ? (
                <div className="flex flex-col gap-7">
                  <>
                    {movieResults != null && !loading ? (
                      movieResults.results.length > 0 ? (
                        <>
                          <>
                            {movieResults.results.map((movie, index) => (
                              <FavoriteMovieCard
                                key={index}
                                movie={movie}
                                isFavorite={index == 1}
                                isWatchlist={index == 2}
                                rated={index == 3 ? 50 : null}
                              />
                            ))}
                          </>
                          {movieResults.total_pages > 1 && (
                            <PaginationCustom
                              currentPage={page != null ? parseInt(page) : 1}
                              totalPage={movieResults.total_pages}
                              type={mode}
                              endpoint="/favorites"
                            />
                          )}
                        </>
                      ) : (
                        <div>{`You haven't added any favorite movies.`}</div>
                      )
                    ) : (
                      <Loading />
                    )}
                  </>
                </div>
              ) : (
                <div className="flex flex-col gap-7">
                  <>
                    {tvResults != null && !loading ? (
                      tvResults.results.length > 0 ? (
                        <>
                          <>
                            {tvResults.results.map((tv, index) => (
                              <FavoriteTVCard
                                key={index}
                                tv={tv}
                                isFavorite={index == 1}
                                isWatchlist={index == 2}
                                rated={index == 3 ? 50 : null}
                              />
                            ))}
                          </>
                          {tvResults.total_pages > 1 && (
                            <PaginationCustom
                              currentPage={page != null ? parseInt(page) : 1}
                              totalPage={tvResults.total_pages}
                              type={mode}
                              endpoint="/favorites"
                            />
                          )}
                        </>
                      ) : (
                        <div>{`You haven't added any favorite tv series.`}</div>
                      )
                    ) : (
                      <Loading />
                    )}
                  </>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default FavoritesPage;