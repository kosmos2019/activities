import React from 'react';
import { Duck } from '../demo/demo';

interface Props {
    duck: Duck;
}

function DuckItem({ duck }: Props) {
    return (
        <div>
            <span>{duck.name}</span>
            <button onClick={() => duck.makeSound(duck.name + ' quack')}>Make sound</button>
        </div>
    );
}

export default DuckItem;