'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePlaces } from '@/hooks/usePlace';

import { Place } from './types';
import styles from './places.module.scss';

const LIMIT = 9;

export const Places = () => {
  const [ search, setSearch ] = useState<string>('');
  const [ selectedTags, setSelectedTags ] = useState<string[]>([]);
  const [ offset, setOffset ] = useState<number>(0);
  const [ places, setPlaces ] = useState<Place[]>([]);
  const [ hasMore, setHasMore ] = useState<boolean>(true);
  const [ initialLoadDone, setInitialLoadDone ] = useState(false);
  const [ isFetchingMore, setIsFetchingMore ] = useState<boolean>(false);

  const { places: queriedPlaces, loading, error, refetch, fetchMore } = usePlaces(
    LIMIT,
    offset,
    search,
    selectedTags
  );

  useEffect(() => {
    if (!initialLoadDone && queriedPlaces.length) {
      setPlaces(queriedPlaces);
      setHasMore(queriedPlaces.length === LIMIT);
      setInitialLoadDone(true);
    }
  }, [queriedPlaces, initialLoadDone]);

  useEffect(() => {
    if (initialLoadDone) {
      refetch({ limit: LIMIT, offset: 0, search, tags: selectedTags }).then(({ data }) => {
        setPlaces(data?.places || []);
        setOffset(0);
        setHasMore(data?.places?.length === LIMIT);
      });
    }
  }, [search, selectedTags]);

  const loadMore = async () => {
    setIsFetchingMore(true);
    const newOffset = offset + LIMIT;
    const { data: moreData } = await fetchMore({
      variables: {
        limit: LIMIT,
        offset: newOffset,
        search,
        tags: selectedTags,
      },
    });

    if (moreData?.places?.length) {
      setPlaces((prev) => [...prev, ...moreData.places]);
      setOffset(newOffset);
      setHasMore(moreData.places.length === LIMIT);
    } else {
      setHasMore(false);
    }
    setIsFetchingMore(false);
  };

  return (
    <div className={styles.wrapper}>
      <h1>Hidden Places of Europe</h1>
      <input
        type="text"
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />
      <div className={styles.tagsFilter}>
        {['hidden', 'explore', 'historic', 'nature'].map((tag) => (
          <label key={tag} className={styles.tagCheckbox}>
            <input
              type="checkbox"
              value={tag}
              checked={selectedTags.includes(tag)}
              onChange={(e) => {
                const checked = e.target.checked;
                setSelectedTags((prev) =>
                  checked ? [...prev, tag] : prev.filter((t) => t !== tag)
                );
              }}
            />
            {tag}
          </label>
        ))}
      </div>
      {error && <p>Error: {error.message}</p>}
      {places.length === 0 && initialLoadDone && !loading ? (
        <p className={styles.noResults}>No places found.</p>
      ) : (
        <div className={styles.grid}>
        {places.map((place) => (
          <div key={place.id} className={styles.card}>
            <img src={place.imageUrl} alt={place.title} />
            <h2>{place.title}</h2>
            <p>{place.city}, {place.country}</p>
            <p>{place.description}</p>
            <div className={styles.tags}>
              {place.tags?.map((tag) => (
                tag.length ? <span key={tag}>{tag}</span> : null
              ))}
            </div>
            <div className={styles.actions}>
              <Link href={`/places/${place.id}`} className={styles.viewBtn}>
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
      )}
      {(loading && places.length === 0) || isFetchingMore ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        hasMore && (
          <button
            className={styles.loadMore}
            onClick={loadMore}
            disabled={isFetchingMore}
          >
            Load More
          </button>
        )
      )}
    </div>
  );
};
