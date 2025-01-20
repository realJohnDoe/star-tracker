export interface Task {
    id: number;
    name: string;
    effort: number;
}

export interface Alignment {
    id: number;
    task1: number;
    task2: number;
    value: number;
}
