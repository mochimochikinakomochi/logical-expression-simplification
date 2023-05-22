import { useState } from "react";
import { Logic } from "./Logic";
import { ResetButton } from "./ResetButton";

export const Home = () => {
    const [inputBitOne, setInputBitOne] = useState()
    const [inputsBitOne, setInputsBitOne] = useState([])
    const [digit, setDigit] = useState(4)

    const submitBitOne = (input) => {
        const subInput = ToNum(input)
        setInputsBitOne([...inputsBitOne, subInput])
        setInputBitOne("")
    }

    const ToNum = (text) => {
        const num = Number(text)
        return num
    }

    const handleClick = () => {
        setInputBitOne()
        setInputsBitOne([])
    }
    
    return (
        <div>
            <h1>
                クワイン マクラスキー法で論理式を圧縮, 必須主項を発見
            </h1>
            <p>
                最小項の入力例: ￢AB￢CD =&gt; 101, ABC￢D =&gt; 1110
            </p>
            <p>
                入力したら「最小項提出」をクリック
            </p>
            <tr>
                <p>
                    桁数を入力(デフォルトでは4(A, B, C, D))
                </p>
                <input type="number" value={digit} onChange={(event) => setDigit(event.target.value)} />
            </tr>
            <tr>
                <p>
                    最小項を入力    
                </p>
                <input type="number" value={inputBitOne} onChange={(event) => setInputBitOne(event.target.value)} />
                <button onClick={() => submitBitOne(inputBitOne)}>最小項提出</button>
                <ResetButton handleClick={handleClick} />
            </tr>
            <p>inputs</p>
            <ul>
                {inputsBitOne.map((inputBitOne, i) => <li key={i}>{inputBitOne}</li>)}
            </ul>
            <Logic inputs={inputsBitOne} />
        </div>
    )
}
