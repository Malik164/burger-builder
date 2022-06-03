import Button from "./Button"
import pic from "../assets/cash-on-delivery.png"
import GooglePayment from "./GooglePayment/GooglePayment"
const PaymentMethod = props => {
    return (
        <div className="row my-2  justify-content-md-center g-1 text-center">
            <h5 className="text-center ">
                <span className="position-relative">
                <span className="display-6">Select Payment Method</span>
                <span className="position-absolute top-0 start-100  badge border border-secondary  badge-sm rounded-pill bg-success" 
                style={{
                    "transform":"translate(-21px, -102%) rotate(20deg)"
                }}
                >
                    {props.price}$
                </span>

                </span>
            </h5>
            <div className="col-sm-5 m-1   custom-border">
                <div>
                    <h3>Google Pay</h3>
                    <div className="my-5">
                        <GooglePayment
                            paymentErrorHandler={props.paymentErrorHandler}
                            paymentCancelHandler={props.paymentCancelHandler}
                            paidHandler={props.paidHandler}
                            price={props.price.toString()}
                        />
                    </div>
                </div>
            </div>
            <div className="col-sm-5 m-1  custom-border "
                onClick={props.methodSelected}
            >
                <div>
                    <h3>Cash on Delivery</h3>
                    <img width="150" height="150" src={pic} alt="cash on delivery" />
                    <div className="me-2">
                        <p className="float-end">
                            <i className="fa fa-check-circle fa-2x custom-icon" aria-hidden="true"></i>

                        </p>
                    </div>
                </div>
            </div>

            <div className="button-row text-center">
                <Button
                    clicked={props.previousStepHanlder}
                    type="secondary mx-2 my-2"
                >
                    <i className="fa fa-arrow-left" aria-hidden="true"></i>
                </Button>

            </div>

        </div>
    )
}

export default PaymentMethod