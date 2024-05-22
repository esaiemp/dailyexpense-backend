import { BadRequestException } from "@nestjs/common";

export const CheckIfIsValidUUID = (str: string, fieldName: string = 'userId'): string =>{
  if(!str || str ==='')
    return null;
  // Regular expression to check if string is a valid UUID
  const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

  if(regexExp.test(str))
    return str;
  
  throw new BadRequestException(`${fieldName} field is not in correct format. Please provide a valid uuid.`);
}