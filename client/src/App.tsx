import type { OnConnect } from "reactflow";

import { useCallback, useRef } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";

import "reactflow/dist/style.css";

import { getInitialNodes, nodeTypes } from "./nodes";
import { edgeTypes, getInitialEdges } from "./edges";
import { useForm } from "react-hook-form";

export default function App() {
  const { register, handleSubmit } = useForm();
  const [nodes, , onNodesChange] = useNodesState(getInitialNodes(register));
  const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialEdges(getInitialNodes('')));
  const onSubmit = console.log



  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%', 'width': '100%' }}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
        <button type='submit' >Submit</button>
      </ReactFlow>
    </form>
  );

}
