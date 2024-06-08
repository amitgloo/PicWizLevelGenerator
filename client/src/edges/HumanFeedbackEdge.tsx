import { BaseEdge, EdgeLabelRenderer, EdgeProps, EdgeText, MarkerType, Position, getBezierPath, getSimpleBezierPath, getSmoothStepPath } from "reactflow";

export function HumanFeedbackEdge({ id, sourceX, sourceY, targetX, targetY, markerEnd, style }: EdgeProps) {
    const [edgePath, labelX, labelY ] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition: Position.Bottom,
        targetPosition: Position.Bottom,
        offset: 100
    });

    return (
        <>
            <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
            <EdgeText labelStyle={{fontSize: "1.4rem"}} label="Human Feedback" x={targetX} y={targetY + 50}/>
        </>
    );
}