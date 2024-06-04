import { UseFormRegister, UseFormRegisterReturn } from 'react-hook-form';
import {  Handle, Position, type NodeProps } from 'reactflow';

export interface InputNodeProps {
    title: string
    description: string
    placeholder: string
    hasTextArea: boolean
    register: UseFormRegister<any>
}


export function InputNode({ data: {register, ...data} }: NodeProps<InputNodeProps>) {
    return (
        <div style={{ padding: 10, borderWidth: 4, display: 'flex', flexDirection: 'column', border: '1px solid #ddd', borderRadius: 5, width: 250, height: 350 }}>
            <h4>{data.title}</h4>
            <p>{data.description}</p>
            {data.hasTextArea && <textarea
                placeholder={data.placeholder}
                {...register(data.title)}
                style={{ width: '100%', height: '40%', marginTop: 'auto',  resize: 'none' }} />}
            <Handle type='target' id='l' position={Position.Left}  />
            <Handle type='target' id='b' position={Position.Bottom} />
            <Handle type='source' id='b' position={Position.Bottom} />
            <Handle type='source' id='r' position={Position.Right} />
        </div>
    );
}

