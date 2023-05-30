interface ApiJsonSuccess<T = unknown> {
    code: 0;
    data: T;
    msg: string;
}

interface ApiJsonFail {
    code: -1;
    data: null;
    msg: string;
}

declare type ApiJsonType<T = unknown> = ApiJsonSuccess<T> | ApiJsonFail;

declare interface ToastMsg<T = unknown> {
    msg: string;
    type: T;
}

declare interface SearchTask<T = unknown> {
    keyword?: string;
    data: T[];
    pending: boolean;
    complete: boolean;
    success: boolean;
}

declare interface SearchMusic {
    id: string;
    name: string;
    artist: string;
    url: string;
    poster: string;
}