export interface IdGenerator { 
    generateId():Promise<number>
}