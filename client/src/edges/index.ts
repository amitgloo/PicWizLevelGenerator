import type {Node, Edge, EdgeTypes, MarkerType } from "reactflow";
import { HumanFeedbackEdge } from "./HumanFeedbackEdge";

export function getInitialEdges(nodes: Node[]): Edge[] {
  const edges: Edge[] = []
  const outputNode = nodes[nodes.length - 1]

  for (let i =0; i < nodes.length - 1; ++i) {
    edges.push({
      animated: true,
      id: `${nodes[i].id}->${nodes[i+1].id}`,
      source: nodes[i].id,
      sourceHandle: 'r',
      target: nodes[i+1].id,
      targetHandle: 'l'
    })
    if (nodes[i].data.hasTextArea)
    edges.push({
      animated: true,
      source: outputNode.id,
      target: nodes[i].id,
      id: `human-feedback-${i}`,
      sourceHandle: 'b',
      // label: "Human Feedback",
      type: 'HumanFeedback',
      targetHandle: 'b'
    })
  }
  return edges;
}

export const edgeTypes = {
  'HumanFeedback': HumanFeedbackEdge,
  // Add your custom edge types here!
} satisfies EdgeTypes;
