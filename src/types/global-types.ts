export interface IBoard {
    title: string;
    id: string,
    list?: IList[];
    cards?: ICard[];
}


export interface IList {
    title: string;
    id: string,
    cards?: ICard[];
}

export interface ICard {
    title: string;
    id: string
}