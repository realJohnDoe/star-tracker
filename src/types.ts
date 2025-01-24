export const taskUnitValues = ['Hours', 'Days', 'Weeks', 'Months', 'Years', 'Evergreen'] as const;

export interface Task {
    id: number;
    name: string;
    unit: typeof taskUnitValues[number]
}


export interface Alignment {
    id: number;
    task1: number;
    task2: number;
    value: number;
}
