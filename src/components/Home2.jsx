import { useState } from "react";
import { Logic } from "./Logic";

export const Home = () => {
    const [inputBitOne, setInputBitOne] = useState()
    const [inputBitX, setInputBitX] = useState()
    const [inputsBitOne, setInputsBitOne] = useState([])
    const [inputsBitX, setinputsBitX] = useState([])

    const submitBitOne = (input) => {
        const subInput = ToNum(input)
        setInputsBitOne([...inputsBitOne, subInput])
        setInputBitOne("")
    }


    const submitBitX = (input) => {
        const subInput = ToNum(input)
        setinputsBitX([...inputsBitX, subInput])
        setInputBitX("")
    }

    const ToNum = (text) => {
        const num = Number(text)
        return num
    }
    
    return (
        <div><tr>
                <input type="number" value={inputBitOne} onChange={(event) => setInputBitOne(event.target.value)} />
                <button onClick={() => submitBitOne(inputBitOne)}>1ビットのビット表現</button>
            </tr>
            <tr>
                <input type="number" value={inputBitX} onChange={(event) => setInputBitX(event.target.value)} />
                <button onClick={() => submitBitX(inputBitX)}>xビットのビット表現</button>
            </tr>
            <p>inputsBitOne</p>
            <ul>
                {inputsBitOne.map((inputBitOne, i) => <li key={i}>{inputBitOne}</li>)}
            </ul>
            <Logic inputs={[inputsBitOne, inputsBitX]} />
        </div>
    )
}
