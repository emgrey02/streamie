'use server';

import Image from 'next/image';
import { Key } from 'react';
import FavorWatchButton from '@/app/components/FavorWatchButton';
import BackButton from '@/app/components/BackButton';
import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function Show({ params }: { params: { id: string } }) {
    let showId = params.id;

    const accountId = cookies().get('accId')?.value;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_AUTH_TOKEN}`,
        },
    };

    let res = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}?language=en-US`,
        options
    );

    let creditsRes = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}/aggregate_credits?language=en-US`,
        options
    );

    if (!res.ok) {
        console.error('failed to fetch show data');
    }

    if (!creditsRes.ok) {
        console.error('failed to fetch show cast & crew data');
    }

    let deets = await res.json();
    let creds = await creditsRes.json();

    return (
        <main className="m-8">
            <div className="flex gap-4">
                <Image
                    src={`https://image.tmdb.org/t/p/w400${deets.poster_path}`}
                    alt="tv poster"
                    width={400}
                    height={1200}
                />
                <div className="grid gap-4">
                    <h1 className="text-2xl font-bold text-slate-200">
                        {deets.name}
                    </h1>
                    <p>{deets.tagline}</p>
                    <ul>
                        <h2>Genres:</h2>
                        {deets.genres.map(
                            (genre: { name: string }, index: Key) => (
                                <li key={index}>{genre.name}</li>
                            )
                        )}
                    </ul>
                    {accountId && (
                        <>
                            <FavorWatchButton
                                whichOne="favorite"
                                content="tv"
                                contentId={deets.id}
                                accountId={accountId}
                            />
                            <FavorWatchButton
                                whichOne="watchlist"
                                content="tv"
                                contentId={deets.id}
                                accountId={accountId}
                            />
                        </>
                    )}
                    <p>{deets.release_date}</p>
                    <p className="justify-self-end">{deets.overview}</p>
                </div>
            </div>
            <BackButton />
            <div className="flex flex-col">
                <h2 className="my-8 font-bold text-xl">Cast</h2>
                <ul className="grid grid-flow-col grid-rows-2 place-items-center auto-cols-fr gap-8 text-sm">
                    {creds.cast.map(
                        (p: any, index: number) =>
                            index < 8 && (
                                <li
                                    key={index}
                                    className="grid gap-y-2 w-full h-full"
                                >
                                    <p className="font-bold text-base tracking-wide">
                                        {p.name}
                                    </p>
                                    <p>as {p.roles[0].character}</p>

                                    <div className="h-full grid justify-center items-end">
                                        {p.profile_path ?
                                            <Image
                                                src={`https://image.tmdb.org/t/p/w200${p.profile_path}`}
                                                alt={`${p.name} headshot`}
                                                width={'150'}
                                                height={'275'}
                                            />
                                        :   <div className="w-36 h-56 bg-slate-900/80 text-slate-400 grid place-items-center">
                                                no image available
                                            </div>
                                        }
                                    </div>
                                </li>
                            )
                    )}
                </ul>
                <Link className="self-end my-8" href="">
                    See All Cast & Crew
                </Link>
            </div>
        </main>
    );
}
