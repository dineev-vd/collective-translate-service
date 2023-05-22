export class ResponseDto<T> {
    data: T;
}

export class PagedResponseDto<T> extends ResponseDto<T> {
    meta: {
        totalReacords: number
    }
}

