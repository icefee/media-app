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

declare interface SearchVideo {
    key: string;
    name: string;
    rating: number;
    page: SearchVideoPagination;
    data: VideoSummary[];
}

declare interface SearchVideoPagination {
    page: number;
    pagecount: number;
    pagesize: number;
    recordcount: number;
}

declare interface VideoSummary {
    id: number;
    name: string;
    note: string;
    tid: number;
    type: string;
    dt: string;
    last: string;
}

declare type VideoItem = {
    label: string;
    url: string;
}

declare type VideoSource = {
    name: string;
    urls: VideoItem[];
}

declare interface VideoInfo {
    name: string;
    subname?: string;
    note: string;
    pic: string;
    type: string;
    year: string;
    actor?: string;
    area?: string;
    des: string;
    director?: string;
    lang: string;
    last: string;
    state: number;
    tid: number;
    proxy: boolean;
    dataList: VideoSource[];
}

declare enum SearchType {
    music = 0,
    video = 1
}

declare interface SearchMusic {
    id: string;
    name: string;
    artist: string;
    url: string;
    poster: string;
}

declare interface PlayState {
    playing: boolean;
    duration: number;
    currentTime: number;
}

type VideoPlayerEvent = 'play-next' | 'play-end' | 'play-time-update'

declare interface VideoPlayState {
    progress: number;
    buffered: number;
    duration: number;
}

interface EventEmitter {
    (event: 'next', params: undefined): void;
    (event: 'end', params: undefined): void;
    (event: 'time-update', params: VideoPlayState): void;
}