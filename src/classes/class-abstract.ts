export abstract class AbstractModelType {
    id: string;

    abstract initialise(objectDB: any): void;
    abstract toDBJSON(): {};
}

