import { Link } from "react-router-dom"
import logo from "../assets/logo.png"
import { motion } from "framer-motion"
const Home = props => (
    <div className="container vh-100">
        <motion.div
            initial={{ opacity: 0, scale: 1.4 }}
            animate={{ opacity: 1, scale: 1, transitionDuration: 3 }}
            className="d-flex w-100 h-100 justify-content-center align-items-center">
            <div className="jumbotron text-center">
                <h1 className="display-4">Burger Builder</h1>
                <img src={logo} alt="burger-builder-logo" />
                <p className="lead">Make Delicious Burger with desired ingredients!</p>
                <hr className="my-4" />
                <p>Bureger Builder is a project made using react technology with firebase as a database with  react router.</p>
                <motion.p
                    initial={{ opacity: 0, x: "-100vw" }}
                    animate={{
                        opacity: 1, x: 0,
                        transition:{
                            delay:.5,
                            type:"spring",
                            stiffness:150
                        }
                    }}
                    className="lead">
                    <Link className="btn btn-primary btn-lg" to="/builder" role="button">Build Burger</Link>
                </motion.p>
            </div>
        </motion.div>
    </div>
)
export default Home