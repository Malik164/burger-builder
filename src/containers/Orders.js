import { motion } from "framer-motion"
import withErrorHandler from "../components/HOC/withErrorHanlder"
import Order from "../components/Order"
import OrderInstance from "../components/OrderAxios/OrderAxios"

const Orders = props => {
    // convert the object of objects to arrays of objects
    let orders = props.response.data

    let OrderElm = <h1>No Orders found!</h1>
    if (orders) {
        orders = Object.keys(props.response.data).map(key => props.response.data[key])
        OrderElm = <>
            {orders.map((order, i) => (
                <div className="col-md-4 " key={`fxx${i}`}
                >
                    <Order
                        order={order}
                    />
                </div>
            ))}
        </>
    }
    return (
        <div className="container my-2">
            <div className="w-50 mx-auto">
                <motion.h2
                    initial={{ y: "-100vh" }}
                    animate={{ y: 0 }}
                    className="text-center my-2 bg-info text-light rounded-pill shadow p-2">Orders
                    &nbsp;
                    <i className="fa fa-shopping-bag" aria-hidden="true"></i>
                </motion.h2>

            </div>
            <div className="row g-1 my-2 px-2 mb-5"  >
            {OrderElm}
            </div>
        </div>
    )
}
export default withErrorHandler(Orders, OrderInstance, '/orders.json')