import { Square } from "./Square"


export const Table = ({terms, mainTerms, coveredArr}) => {
    return (
        <div>
            <table className="table" border={1} width={500} cellPadding={0}>
                <th>terms&#047;mainTerms</th>
                    {mainTerms.map((mainTerm, index) => {
                        return (
                            <th>{mainTerm.Logic}</th>
                        )
                    })}
                    {terms.map((term, index) => {
                        return (
                            <tr>
                                <td>{term.Logic}</td>
                                {coveredArr[index].map((subCoveredArr, subIndex) => {
                                    return (
                                        <Square value={subCoveredArr} />
                                    )
                                })}
                            </tr>
                        )
                    })}
            </table>
        </div>
    )
}