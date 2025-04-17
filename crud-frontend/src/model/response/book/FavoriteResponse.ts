interface FavoriteResponse {
    message: string;
    book: {
        id: number;
        title: string;
        author: string;
        genre: string;
    }
}

export default FavoriteResponse;