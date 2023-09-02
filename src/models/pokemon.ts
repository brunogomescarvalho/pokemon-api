export class Pokemon {
    id: number;
    nome: string;
    tipo:string;
    sprites: Sprites;
}
export interface Sprites {
    back_default: string,
    back_shiny: string,
    front_default: string,
    front_shiny: string,
}