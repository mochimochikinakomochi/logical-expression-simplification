import { Table } from "./Table";
import './../home.css';


// 最小項のクラス
const Term = class {
    constructor(bitOne, bitX = 0, digit = 4) {
        this.bitOne = bitOne;
        this.subBitOne = bitOne;
        this.one = 0; 
        this.bitX = bitX;
        this.subBitX = bitX;
        this.x = 0;
        this.digit = digit;
        this.numOne = 0;
        this.isEss = "notEss";
        this.isCoveredByEss = "false"
        this.oneX = ""
        this.subOneX = []
        this.Logic = ""
        this.subLogic = []
        this.Logics = [["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
                        ["￢A", "￢B", "￢C", "￢D", "￢E", "￢F", "￢G", "￢H", "￢I", "￢J", "￢K", "￢L", "￢M", "￢N", "￢O", "￢P", "￢Q", "￢R", "￢S", "￢T", "￢U", "￢V", "￢W", "￢X", "￢Y", "￢Z"]]
        for(let i = 1; i < digit + 1; i++) {
            if((this.subBitOne % 10 ) === 1) {
                this.numOne += 1
                this.one += 2 ** (i - 1)
                this.subLogic.push(this.Logics[0][digit - i])
                this.subOneX.push("1")
            }
            if((this.subBitX % 10) === 1) {
                this.x += 2 ** (i - 1)
                this.subOneX.push("x")
            } else if(this.subBitOne % 10 === 0){
                this.subLogic.push(this.Logics[1][digit - i])
                this.subOneX.push("0")
            }
            this.subBitOne = Math.floor(this.subBitOne / 10)
            this.subBitX = Math.floor(this.subBitX / 10)
        }
        this.subLogic = this.subLogic.reverse()
        for(let j = 0; j < this.subLogic.length; j++) {
            this.Logic += this.subLogic[j]
        }
        this.subOneX = this.subOneX.reverse()
        for(let k = 0; k < this.subOneX.length; k++) {
            this.oneX += this.subOneX[k]
        }
    }

    getInfo() {
        return [this.bitOne, this.bitX, this.numOne]
    }
}

// 1のビット数によって分類
const getArrByOne = (array, digit) => {
    const arrByOne = []
    for(let i = 0; i < digit + 1; i++) {
        const subArrByOne = []
        for(let j = 0; j < array.length; j++) {
            if(array[j].numOne === i) {
                subArrByOne.push(array[j])
            }
        }
        arrByOne.push(subArrByOne)
    }

    return arrByOne
}

// 10進数を2進数に直す関数
const dTob = (dNum) => {
    let bNum = 0
    let i = 0;
    while(true) {
        if(dNum % 2 === 1) {
            bNum += 10 ** i
        }
        dNum = Math.floor(dNum / 2)
        i += 1
        if(dNum === 0) {
            break
        }
    }
    return bNum
}


// 論理和と論理積の差が2の階乗のいずれならば(二つの論理式のビット差が1である場合)その差を返す関数
const func1 = (termA, termB, digit) => {
    const dif = (termA.one | termB.one) - (termA.one & termB.one)
    for(let i = 0; i < digit; i++) {
        if((dif === 2 ** i)) {
            return dif
        }
    }

    return null
}


// arrayに指定したTermが含まれていれば削除して返す関数
const func2 = (array, term) => {
    const newArray = array.filter(n => (n.bitOne !== term.bitOne) || (n.bitX !== term.bitX))
    //newArray.push(term)
    return newArray
} 

// arrayに指定したTermが含まれていなければ追加
const func3 = (array, term) => {
    let count = 0
    if(array.length === 0) {
        array.push(term)
    } else {
        for(let i = 0; i < array.length; i++) {
            if(!((array[i].bitOne === term.bitOne) && (array[i].bitX === term.bitX))) {
                count += 1
            }
        }
        if(count === array.length) {
            array.push(term)
        }
    }

    return array
}

// n次圧縮を行い、mainTermsを返す関数
const func4 = (mainTerms, digit) => {
    // 1のビット数によって分類した配列
    const arrByOne = getArrByOne(mainTerms, digit)
    // 圧縮したTermを追加する配列
    let arrSec = []
    // 圧縮した項を削除するための配列
    let arrThi = []
    
    // 桁数(入力の数)について
    for(let i = 0; i < arrByOne.length - 1; i++) {
        // iのビット数がi個の項について
        for(let j = 0; j < arrByOne[i].length; j++) {
            // 1のビット数がi + 1個の項について
            for(let k = 0; k < arrByOne[i + 1].length; k++) {
                // 1ビットの差
                const difOne = func1(arrByOne[i][j], arrByOne[i + 1][k], digit) 
                // xのビットが一致するかどうか判定
                const difX = (arrByOne[i][j].bitX === arrByOne[i + 1][k].bitX)

                // 圧縮の条件を満たすかどうか判定
                if((difOne !== null) && difX) {
                    // maintermsの要素が圧縮されたかを確認
                    arrThi = func3(arrThi, arrByOne[i][j])
                    arrThi = func3(arrThi, arrByOne[i+1][k])

                    const newTerm = new Term(arrByOne[i][j].bitOne, dTob(arrByOne[i][j].x | difOne), digit)
                    arrSec = func3(arrSec, newTerm)
                }
            }
        }
    }
    // 圧縮後の主要項をmaintermsに追加
    for(let l = 0; l < arrSec.length; l++) {
        mainTerms = func3(mainTerms, arrSec[l])
    }
    // 圧縮前の項をmaintermsから削除
    for(let m = 0; m < arrThi.length; m++) {
        mainTerms = func2(mainTerms, arrThi[m])
    }

    return mainTerms
}

// 主項候補を返す関数
const func5 = (mainTerms, digit) => {
    const listMainTerms = []
    for(let i = 0; i < digit; i++) {
        const subMainTerms = [...mainTerms]
        mainTerms = func4(subMainTerms, digit)
        listMainTerms.push(mainTerms)
    }

    return listMainTerms
}

// 必須主項と非必須主項を返す関数
const func6 = (terms, mainTerms, digit) => {
    const subTerms = [...terms]
    let notEssMainTerms = [...mainTerms]
    let essMainTerms = []

    // 最小項について
    for(let i = 0; i < subTerms.length; i++) {
        // それぞれの最小項についてカバーする主項を保存
        const arrCheck = []
        // 必須主項かどうか判定するための配列
        const essCheck = []
        // 主項について
        for(let j = 0; j < mainTerms.length; j++) {
            // xのビット以外が一致しているか判定
            if(((subTerms[i].one | mainTerms[j].x) === (mainTerms[j].one | mainTerms[j].x))) {
                arrCheck.push(new Term(mainTerms[j].bitOne, mainTerms[j].bitX, digit))
                essCheck.push(j)
            }
        }
        if(arrCheck.length === 1) { 
            essMainTerms = func3(essMainTerms, arrCheck[0])
            notEssMainTerms = func2(notEssMainTerms, arrCheck[0])
            mainTerms[essCheck[0]].isEss = "ess"
        }
    }
    return [mainTerms, essMainTerms, notEssMainTerms]
}

// 必須主項にカバーされる最小項を除いた最小項の配列を返す関数
const func7 = (terms, essMainTerms) => {
    let restTerms = [...terms]
    // 必須主項にカバーされる最小項の配列
    let notRestTerms = []
    // どの主項にカバーされるかを判定する配列
    // 最小項について
    for(let i = 0; i < terms.length; i++) {
        // 必須主項について
        for(let j = 0; j < essMainTerms.length; j++) {
            // 最小項が必須主項にカバーされているかを判定
            if(((restTerms[i].one | essMainTerms[j].x) === (essMainTerms[j].one | essMainTerms[j].x))) {
                notRestTerms = func3(notRestTerms, restTerms[i])
            }
        }

    }
    for(let k = 0; k < notRestTerms.length; k++) {
        restTerms = func2(restTerms, notRestTerms[k])
    }

    return [restTerms, notRestTerms]
}

// 最小項それぞれがどの主項にカバーされるかを判定(主項にカバーされる場合"notEss", どの主項にもカバーされない場合"false")
const func8 = (terms, mainTerms, essMainTerms) => {
    let coveredArr = []
    // 最小項について
    for(let i = 0; i < terms.length; i++) {
        const subCoveredArr = []
        // 主項について
        for(let j = 0; j < mainTerms.length; j++) {
            if(((terms[i].one | mainTerms[j].x) === (mainTerms[j].one | mainTerms[j].x))) {
                subCoveredArr.push("notEss")
            } else {
                subCoveredArr.push("false")
            }
        }
        coveredArr.push(subCoveredArr)
        // 必須主項について
        for(let k = 0; k < essMainTerms.length; k++) {
            if(((terms[i].one | essMainTerms[k].x) === (essMainTerms[k].one | essMainTerms[k].x))) {
                terms[i].isCoveredByEss = "true"
            }
        }
    }
    coveredArr = func9(coveredArr)

    return [terms, coveredArr]
}

// 必須主項にのみカバーされる場合"ess"に直す
const func9 = (coveredArr) => {
    for(let i = 0; i < coveredArr.length; i++) {
        let count = [];
        for(let j = 0; j < coveredArr[i].length; j++) {
            if(coveredArr[i][j] === "notEss") {
                count.push(j)
            }
        }
        if(count.length === 1) {
            coveredArr[i][count[0]] = "ess"
        } 
    }

    return coveredArr
}

// termが必須主項にカバーされているかどうか判定



export const Logic = ({inputs = [], inputDigit = 4}) => {
    const digit = inputDigit
    let terms = []
    for(let i = 0; i < inputs.length; i++){
        const newTerm = new Term(inputs[i], 0, digit)
        terms = func3(terms, newTerm)
    }
    console.log("terms", terms)
    console.log("digit", digit)

    const arrByOne = getArrByOne(terms, digit)
    console.log("arrByOne", arrByOne)

    let listMainTerms = func5(terms, digit)
    console.log("listMainTerms", listMainTerms)

    const [mainTerms, essMainTerms, notEssMainTerms] = func6(terms, listMainTerms[listMainTerms.length - 1], digit)
    console.log("essMainTerms", essMainTerms)

    const [restTerms, notRestTerms] = func7(terms, essMainTerms)
    console.log("restTerms", restTerms)
    console.log("notRestTerms", notRestTerms)

    let coveredArr 
    [terms, coveredArr] = func8(terms, mainTerms, essMainTerms)
    console.log("coveredArr", coveredArr)


    return (
        <div>
            <p>terms</p>
            <div>
                {arrByOne.map((arr, index) => {
                    return (
                        <div>
                            <p>
                                1ビットの数:{index}
                            </p>
                            <ol>
                                {arr.map((subArr, subIndex) => {
                                    return (
                                        <li>
                                            {subArr.bitOne}
                                        </li>
                                    )
                                })}
                            </ol>
                        </div>
                    )
                })}
            </div>
            <p>
                mainTerms
            </p>
            <div>
                {listMainTerms.map((mainTerms, index) => {
                    return (
                        <div>
                            <p>
                                {index + 1}次圧縮後
                            </p>
                            <ol>
                                {mainTerms.map((mainTerm, subIndex) => {
                                    return (
                                        <li>
                                            {[mainTerm.oneX, "||", mainTerm.Logic]}
                                        </li>
                                    )
                                })}
                            </ol>
                        </div>
                    )
                })}
            </div>
            <p>
                必須主項
            </p>
            <ol>
                {essMainTerms.map((mainTerms, index) => {
                    return (
                        <li>
                            {mainTerms.Logic}
                        </li>
                    )
                })}
            </ol>
            <Table terms={terms} mainTerms={mainTerms} coveredArr={coveredArr} /> 
        </div>
    )
}