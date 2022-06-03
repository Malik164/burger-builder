import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom"
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import BurgerArt from "../components/burger/BurgerArt";
import Button from "../components/Button";
import "./checkout.css"
import CustomeForm from "../components/Form/CustomerForm";
import OrderAnimation from "../components/OrderAnimation/OrderAnimation";
import OrderInstance from "../components/OrderAxios/OrderAxios";
import PaymentMethod from "../components/PaymentMethod";
import BackDrop from "../components/modal/BackDrop";
const Checkout = props => {
const multiStep = useRef()
const progressBar = useRef()
const [searchParams] = useSearchParams()
const navigate = useNavigate()
const [ingredients, setIngredients] = useState({})
const [price, setPrice] = useState(0)
const [disabledOrder, setDisableOrder] = useState(false)
const [stepCount, setStepCount] = useState(0)
const [showModal, setShowModal] = useState(false)
const [loading, setLoading] = useState(false)
const [method, setMethod] = useState('')
const [formValid, setFormValid] = useState(false)
const [errMsg, setErrMsg] = useState('')
const firstRender = useRef(false)
const [formData, setFormData] = useState({
    name: {
        inputType: 'input',
        label: 'Your Name:',
        feedback: 'Fill name field minimum 3 characters',
        value: '',
        config: {
            type: 'text',
            placeholder: 'type your name',
            required: true

        },
        valid: false,
        touched: false,
        validity: {
            required: true,
            minLength: 3
        }
    },
    email: {
        inputType: 'input',
        label: 'Your Email Address:',
        feedback: 'Enter a valid email adresss',
        value: '',
        config: {
            type: 'email',
            placeholder: 'type your email address',
            required: true

        },
        valid: false,
        touched: false,
        validity: {
            required: true,
            minLength: 5
        }
    },
    city: {
        inputType: 'input',
        label: 'City Name',
        feedback: 'Fill City field minimum 3 characters',
        value: '',
        config: {
            type: 'text',
            placeholder: 'type your city name',
            required: true

        },
        touched: false,
        valid: false,
        validity: {
            required: true,
            minLength: 3
        }
    },
    postalCode: {
        inputType: 'input',
        value: '',
        label: 'Postal Code',
        feedback: 'Enter a valid Postal Code minimum & maximum 5 Characters',
        config: {
            type: 'number',
            required: true,
            min: '0',

        },
        valid: false,
        touched: false,
        validity: {
            required: true,
            minLength: 5,
            maxLength: 5
        }
    },
    address: {
        inputType: 'textarea',
        value: '',
        label: 'Shipping Address',
        feedback: 'Fill adress field minimum 10 characters',
        config: {
            required: true,

        },
        valid: false,
        touched: false,
        validity: {
            required: true,
            minLength: 10,

        }
    },
    deliveryMethod: {
        inputType: 'select',
        value: 'cheapest',
        label: 'Delivery Method',
        config: {
            required: true,
            options: [{
                label: 'Cheapest',
                value: 'cheapest'
            },
            {
                label: 'Fastest (extra 2$)',
                value: 'fastest'
            }
            ]
        },
        validity: {},
        valid: true
    }

})
useEffect(() => {
    // make ingredients object and price
    let ingredientsObj = {}
    let count = 0
    for (const entry of searchParams.entries()) {
        if (entry[0] === 'price') {
            setPrice(parseFloat(entry[1]).toFixed(2))
        }
        else {
            ingredientsObj[entry[0]] = entry[1]
            count += +entry[1]

        }
    }
    setIngredients(ingredientsObj)
    if (count === 0) {
        setDisableOrder(true)
    }

    // now check also for the if it is purchaseable or not
    showCurrentStep(0)
    firstRender.current = true

}, [searchParams])


// go back to previous page handler
const navigateHandler = () => {
    navigate(-1)
}

// next step handler
const nextHanlder = () => {
    let n = stepCount
    n++;
    setStepCount(n)
    showCurrentStep(n)
}


const showCurrentStep = (n) => {

    const steps = multiStep.current.querySelectorAll('.step')
    // remove all active classes previously added
    let li = progressBar.current.querySelectorAll('li')
    li.forEach(e => e.classList.remove('active'))
    for (let i = 0; i <= n; i++) {
        li[i].classList.add('active')
    }
    steps.forEach((step, index) => {
        step.classList.toggle('show', index === n)
    })
}

const previousStepHanlder = () => {
    let n = stepCount
    --n;
    setStepCount(n)
    showCurrentStep(n)
}


// change input hadnler
const inputChangeHandler = (event, targetElm) => {
    // just update the value of form element targeted by user
    let value = event.target.value
    const updatedForm = { ...formData }
    const updatedFormElm = { ...updatedForm[targetElm] }
    // now change the value of that input element
    updatedFormElm.value = value
    updatedFormElm.valid = validHandler(updatedFormElm.value, updatedFormElm.validity)
    updatedFormElm.touched = true
    updatedForm[targetElm] = updatedFormElm
    // now check for if whole form is valid or not
    // check for if user is changin the delivery method
    if (targetElm === 'deliveryMethod') {
        // now if users choses the fastest method so update the price
        if (updatedFormElm.value === 'fastest') {
            // get the price and update it
            setPrice(prevPrice => (parseFloat(prevPrice) + 2))
        }
    }
    let wholeValid = true
    for (const key in updatedForm) {
        wholeValid = updatedForm[key].valid && wholeValid
    }
    // now update the state
    setFormData(updatedForm)
    setFormValid(wholeValid)
}


const orderSavetoFirebase = useCallback(() => {
    // update the state
    setLoading(true)
    let customer = {}
    for (const key in formData) {
        customer[key] = formData[key].value
    }
    customer.PaymentMethod = method
    const reqObj = {
        ingredients,
        customer,
        price
    }
    OrderInstance.post('/orders.json', reqObj).then(res => {
        setLoading(false)
        navigate('/orders')
    }).catch(e => {
        showModal(true)
        setErrMsg(e.message)
    })
},[method,formData, ingredients, navigate, price , showModal])


// hadndlig for payment method changes
useEffect(() => {
    if (firstRender.current) {
        // now check if method is empty
        if (method !== '') {
            orderSavetoFirebase()
        }
    }

}, [method, orderSavetoFirebase])

const validHandler = (value, validation) => {
    // check if validation exists
    let isValid = true
    if (!validation) return
    // now check for each validation
    if (validation.required) {
        isValid = value.trim() !== '' && isValid
    }
    if (validation.minLength) {
        isValid = value.length >= validation.minLength && isValid
    }
    if (validation.maxLength) {
        isValid = value.length <= validation.maxLength && isValid
    }
    return isValid
}

// cash on delivery method handler
const methodSelectHandler = () => {
    // toggle the active class
    // choose the method to delivey method
    let updateMethod = method
    updateMethod = 'Cash On Delivery'
    // update the state
    setMethod(updateMethod)

}

const paidHandler = paymentRequest => {

    // if user has paid the google payment
    let mthd = 'Paid with Google Pay'
    setMethod(mthd)
}
// post request to firebase
const postReqHandler = event => {
    event.preventDefault()
    orderSavetoFirebase()
}



const paymentCancelHandler = msg => {
    setErrMsg('You canceled the Payment, Please Make sure the Payment!')
    // show the user that user has cancel the payment
    setShowModal(true)
}

const paymentErrorHandler = err => {
    setErrMsg(err)
    setShowModal(true)
}

const modalCloseHandler = () => {
    setShowModal(false)
}
return (
    loading ? <OrderAnimation /> :
        <>
            <div className="container p-2 step-wrappers" ref={multiStep}>
                <div className="step-progress-bar">
                    <ul ref={progressBar}>
                        <li className="active">Confirm Order</li>
                        <li>Contact Details</li>
                        <li>Payment Method</li>
                    </ul>
                </div>

                <motion.div
                    initial={{
                        x: "-100vw"
                    }}
                    animate={{ x: 0 }}
                    className="text-center  mx-auto step"
                >
                    <h3>Hopefully! It will taste delicious! 😋
                    </h3>
                    <div className="burger-wrapper custom-height">
                        <BurgerArt ingredients={ingredients} />

                    </div>
                    <div className="button-row mt-4">
                        <Button
                            clicked={navigateHandler}
                            type="warning mx-1"
                        >
                            <i className="fa fa-hand-o-left" aria-hidden="true"></i> &nbsp;
                            Cancel
                        </Button>
                        <Button
                            type='success my-2 bg-success text-light'
                            isDisabled={disabledOrder}
                            clicked={nextHanlder}
                        >
                            <i className="fa fa-arrow-right" aria-hidden="true"></i>

                        </Button>
                    </div>
                </motion.div>

                <div
                    className="  step "
                >
                    <CustomeForm
                        formData={formData}
                        nextHanlder={nextHanlder}
                        previousStepHanlder={previousStepHanlder}
                        formValid={formValid}
                        inputChangeHandler={inputChangeHandler}
                    />
                </div>
                <div className="step">
                    <PaymentMethod
                        price={price}
                        previousStepHanlder={previousStepHanlder}
                        disabledOrder={disabledOrder}
                        postReqHandler={postReqHandler}
                        methodSelected={methodSelectHandler}
                        method={method}
                        paymentErrorHandler={paymentErrorHandler}
                        paymentCancelHandler={paymentCancelHandler}
                        paidHandler={paidHandler}

                    />
                </div>

            </div>
            <BackDrop
                show={showModal}
                modalClosed={modalCloseHandler}
            >
                <div className="text-center">
                    <p className="text-danger my-2">
                        <i class="fa fa-exclamation-triangle fa-3x" aria-hidden="true"></i>
                    </p>
                    <p>
                        {errMsg}
                    </p>
                </div>

            </BackDrop>
        </>
)

}

export default Checkout