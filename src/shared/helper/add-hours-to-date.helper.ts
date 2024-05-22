export const AddHoursToDate =(date: Date, hours: number): Date =>{
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
};