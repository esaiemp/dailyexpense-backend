import { NotFoundException } from "@nestjs/common";

export const CheckRecord =<Type>(item: Type, isParentItem: boolean=false, entityName: string =null): Type =>{
    if(!item){
        const errorMessage = `No ${isParentItem ? 'parent ' : ''}item found${entityName ? ` (${entityName})` : ''}.`;
        throw new NotFoundException(`${errorMessage}`);
    }
    return item;
};
