interface ListFavorites {
    message: string;
    books: {
        id: number;
        title: string;
        author: string;
        genre: string;
    } [];
}

export default ListFavorites;