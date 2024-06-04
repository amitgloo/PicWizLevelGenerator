import type { Node, NodeTypes } from "reactflow";
import { InputNode, InputNodeProps } from "./InputNode";

const fullModels: Omit<InputNodeProps, 'register'>[] = [
  {
    title: 'Trend / User Data Agent',
    description: "process initial data to the caption generator",
    placeholder: 'Specify Context',
    hasTextArea: true
  },
  {
    title: 'Level Caption Generator',
    description: "produce the level captions based on data",
    placeholder: 'Specify Context',
    hasTextArea: true

  },
  {
    title: 'Caption to Image Prompt',
    description: "transform caption into fully detailed image prompt",
    placeholder: 'Specify Context',
    hasTextArea: true

  },
  {
    title: 'Image Generator',
    description: "produce level caption image",
    placeholder: 'Specify Context',
    hasTextArea: true

  },
  {
    title: 'Image Processing',
    description: 'Do stuff that berger lieks',
    placeholder: '',
    hasTextArea: false
  },
  {
    title: 'Background Generator',
    description: "created background for the image",
    placeholder: 'Specify Context',
    hasTextArea: true
  },
]


export const getInitialNodes = (register: any) => [
  ...fullModels.map((data, i) => ({
    id: i.toString(),
    type: 'InputNode',
    data: {
      ...data,
      register,
      input: '',
    },
    position: {
      x: i * 400,
      y: 0,
    }
  }))
] satisfies Node[];



export const nodeTypes = {
  "InputNode": InputNode
  // Add any of your custom nodes here!
} satisfies NodeTypes;
