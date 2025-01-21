export interface Task {
    id: number;
    name: string;
    unit: 'Hours' | 'Days' | 'Weeks' | 'Months' | 'Years';  // Unit of effort
}


export interface Alignment {
    id: number;
    task1: number;
    task2: number;
    value: number;
}
