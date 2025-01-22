import { Alignment } from "./types";

export const calculateIndirectAlignments = (
    selectedTaskId: number,
    alignments: Alignment[]
): Omit<Alignment, 'id'>[] => {
    const alignmentMap = new Map<number, Alignment[]>();

    // Build bidirectional adjacency list for task alignments
    for (const align of alignments) {
        if (!alignmentMap.has(align.task1)) alignmentMap.set(align.task1, []);
        if (!alignmentMap.has(align.task2)) alignmentMap.set(align.task2, []);

        // Add bidirectional relationship for both task1 -> task2 and task2 -> task1
        alignmentMap.get(align.task1)!.push(align);
        alignmentMap.get(align.task2)!.push({ ...align, task1: align.task2, task2: align.task1 }); // Reverse the task order
    }

    const visited = new Set<number>();
    const maxAlignments: Record<number, number> = {};

    function dfs(currentTask: number, accumulatedValue: number) {
        if (visited.has(currentTask)) return;
        visited.add(currentTask);

        for (const align of alignmentMap.get(currentTask) || []) {
            if (align.task2 === selectedTaskId) continue; // Ignore direct connections to the selected task

            const newAlignmentValue = accumulatedValue * (align.value / 100);

            if (!(align.task2 in maxAlignments) || newAlignmentValue > maxAlignments[align.task2]) {
                maxAlignments[align.task2] = newAlignmentValue;
                dfs(align.task2, newAlignmentValue); // Explore further from the other task
            }
        }
        visited.delete(currentTask);
    }

    dfs(selectedTaskId, 1); // Start DFS from the selected task with an initial alignment of 1 (100%)

    // Remove direct alignments from maxAlignments
    for (const alignment of alignments) {
        if (alignment.task1 === selectedTaskId) {
            delete maxAlignments[alignment.task2]; // Remove task2 from maxAlignments if task1 is selected task
        }
        if (alignment.task2 === selectedTaskId) {
            delete maxAlignments[alignment.task1]; // Remove task1 from maxAlignments if task2 is selected task
        }
    }

    // Map the maxAlignments record to Alignment[]
    const indirectAlignments: Omit<Alignment, 'id'>[] = Object.entries(maxAlignments).map(([taskId, value]) => ({
        task1: selectedTaskId,
        task2: parseInt(taskId), // Convert the taskId from string to number
        value: value * 100, // Convert the value back to a percentage
    }));

    return indirectAlignments;
};  
