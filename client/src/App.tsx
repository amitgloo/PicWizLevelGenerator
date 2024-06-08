import type { OnConnect } from "reactflow";
import { MagicWandIcon } from '@radix-ui/react-icons';

import { useCallback, useRef } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  ControlButton,
  BackgroundVariant
} from "reactflow";

import "reactflow/dist/style.css";

import { getInitialNodes, nodeTypes } from "./nodes";
import { edgeTypes, getInitialEdges } from "./edges";
import { useForm } from "react-hook-form";

function processPipeline(e: object) {
  console.log("Input to Model")
  console.log(e)
}

export default function App() {
  const { register, handleSubmit } = useForm();
  const [nodes, , onNodesChange] = useNodesState(getInitialNodes(register));
  const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialEdges(getInitialNodes('')));
  const onSubmit = processPipeline
  
  
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );
  
  return (
    
    <form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%', 'width': '100%' }}>
    <div className="main" style={{ height: '100%', 'width': '100%' }}>
    <button className="button-80 run-button" type='submit' >Run Pipeline</button>
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
    <Controls>
    <ControlButton onClick={() => alert('Something magical just happened. ✨')}>
          <MagicWandIcon />
        </ControlButton>
    </Controls>
    <Background color="#ccc" variant={BackgroundVariant.Dots} />
    </ReactFlow>
    </div>
    </form>
  );
  
}