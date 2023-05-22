

export const Square = ({value}) => {
    console.log("value", value)
    return (
        <td class="square">
            <div class={value}></div>
        </td>
    )
}