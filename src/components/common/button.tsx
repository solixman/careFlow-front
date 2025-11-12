import ButtonProps  from "../../interfaces/ButtonProps";

export function Button(props: ButtonProps){

    return (
        <button>
       {props.label}
        </button>
    )

}

export default Button