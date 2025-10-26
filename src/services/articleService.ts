import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5083';

enum SOURCE_TYPE {
    FOX5 = 'FOX5',
    NBC7 = 'NBC7',
}

export type Article = {
    created_at: string,
    date_posted: string,
    id: string,
    is_relevant: boolean,
    link: string,
    source: SOURCE_TYPE,
    summary: null,
    title: string,
    unique_id: string,
    updated_at: string,
    web_id: string | number,
}

export async function fetchArticles(): Promise<Article[]> {
    const response = await axios.get(`${API_BASE_URL}/articles`);
    return response.data;
};

export function daysSinceLastFatality(articles: Article[]): number {
    // sort articles by date, descending
    const sortedArticles = [...articles].sort((a, b) => {
        const dateA = new Date(a.date_posted).getTime();
        const dateB = new Date(b.date_posted).getTime();
        return dateB - dateA; // descending order (most recent first)
    });

    // get the number of days between the most recent article and today
    if (sortedArticles.length === 0) {
        return 0;
    }

    const mostRecentDate = new Date(sortedArticles[0].date_posted);
    const today = new Date();
    const diffInMilliseconds = today.getTime() - mostRecentDate.getTime();
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    // return that number
    return diffInDays;
}