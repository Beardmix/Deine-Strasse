export abstract class AbstractModelType {
    id: string;

    abstract initialise(objectDB: any): void;
    abstract clone(objectDest: AbstractModelType): void;
    abstract toDBJSON(): {};
}

