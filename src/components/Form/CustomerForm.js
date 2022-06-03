import Button from "../Button"
import Input from "./Input"
const CustomeForm = props => {
    // convert the receiving object to array  so that I can map them
    let formDataArr=[]
    for (const key in props.formData) {
        formDataArr.push({
            id:key,
            ...props.formData[key]
        })
    }
    return (
        <div>
            <form action="" className="rounded" noValidate>
                {formDataArr.map(elm=>(
                    <Input
                    key={elm.id}
                    inputType={elm.inputType}
                    config={elm.config}
                    label={elm.label}
                    value={elm.value}
                    valid={elm.valid}
                    touched={elm.touched}
                    feedback={elm.feedback}
                    inputChanged={(event)=>{props.inputChangeHandler(event,elm.id)}}
                    />
                ))}
                <div className="text-center">
                 <Button
                 clicked={e=>{
                     e.preventDefault()
                     props.previousStepHanlder()
                 }}
                 type="secondary mx-2 my-2"
                 >
                     <i className="fa fa-arrow-left" aria-hidden="true"></i>
                </Button>   
                <Button
                isDisabled={!props.formValid} 
                clicked={(event)=>{
                    event.preventDefault()
                    props.nextHanlder()
                }}
                
                type="success my-2 bg-success text-light" >
                    <i className="fa fa-arrow-right" aria-hidden="true"></i>
                </Button>

                </div>
                

            </form>
        </div>

    )
}

export default CustomeForm