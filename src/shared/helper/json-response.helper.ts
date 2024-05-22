export class JsonResponse<T> {
    id: T;
    constructor(value : T) {
        this.id = value;
    }
}   