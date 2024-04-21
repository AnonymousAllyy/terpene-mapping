// src/interfaces/index.ts

export interface Terpene {
    TerpeneID: number;
    Terpene: string;
}

export interface Smell {
    SmellID: number;
    Smell: string;
}

export interface Taste {
    TasteID: number;
    Taste: string;
}

export interface Property  {
    PropertyID: number;
    Property: string;
    PropertyDesr: null | string;
    mapped: null | string;
    ClientFacingDesr: null | string;
    ConsumerFacingDesr: null | string;
}

export interface BasicProperty {
    PropertyID: number;
    Property: string;
}

export interface SmellwithCitation extends Smell {
    Citation: null | string;
}

export interface TastewithCitation  extends Taste {
    Citation: null | string;
}

export interface PropertywithCitation {
    PropertyID: number;
    Property: string;
    Citation: null | string;
}

interface Synonym {
    Synonym: string;
}
export interface TerpeneObjectResponse extends Terpene {
    arySmell: SmellwithCitation[];
    aryTaste: TastewithCitation[];
    arySynonym: undefined | Synonym[];
    aryProperty: PropertywithCitation[];
}
